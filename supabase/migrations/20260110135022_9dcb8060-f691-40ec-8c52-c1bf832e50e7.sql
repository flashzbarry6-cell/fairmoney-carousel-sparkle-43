-- Create admin_settings table for storing admin configuration
CREATE TABLE public.admin_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL DEFAULT '{}'::jsonb,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Admins can view settings" ON public.admin_settings
FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "Admins can update settings" ON public.admin_settings
FOR UPDATE USING (is_admin(auth.uid()));

CREATE POLICY "Admins can insert settings" ON public.admin_settings
FOR INSERT WITH CHECK (is_admin(auth.uid()));

-- Insert default auto-deduct setting (OFF by default)
INSERT INTO public.admin_settings (setting_key, setting_value, description)
VALUES ('auto_deduct_on_withdraw', '{"enabled": false}'::jsonb, 'Auto deduct balance when user clicks continue on approved withdrawal page');

-- Create balance_deductions table for logging all deductions
CREATE TABLE public.balance_deductions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  amount INTEGER NOT NULL,
  deduction_type TEXT NOT NULL, -- 'payment_approved', 'payment_rejected', 'withdrawal_continue', 'manual_reversal'
  reference_id UUID, -- payment_id or withdrawal_id
  reason TEXT,
  balance_before INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  transaction_hash TEXT UNIQUE, -- Unique hash to prevent double deductions
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.balance_deductions ENABLE ROW LEVEL SECURITY;

-- Policies for deductions
CREATE POLICY "Users can view their own deductions" ON public.balance_deductions
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all deductions" ON public.balance_deductions
FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "Admins can insert deductions" ON public.balance_deductions
FOR INSERT WITH CHECK (is_admin(auth.uid()) OR auth.uid() = user_id);

-- Add processed_deduction column to payments to prevent double deductions
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS deduction_processed BOOLEAN DEFAULT false;

-- Create function to process payment deduction (approve/reject deduction)
CREATE OR REPLACE FUNCTION public.process_payment_deduction(
  _payment_id UUID,
  _deduction_type TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_payment RECORD;
  v_profile RECORD;
  v_new_balance INTEGER;
  v_tx_hash TEXT;
BEGIN
  -- Get payment details
  SELECT * INTO v_payment FROM payments WHERE id = _payment_id;
  
  IF v_payment IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Payment not found');
  END IF;
  
  -- Check if already processed
  IF v_payment.deduction_processed = true THEN
    RETURN jsonb_build_object('success', false, 'message', 'Deduction already processed');
  END IF;
  
  -- Get user profile
  SELECT * INTO v_profile FROM profiles WHERE user_id = v_payment.user_id;
  
  IF v_profile IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'User profile not found');
  END IF;
  
  -- Calculate new balance (deduct the payment amount)
  v_new_balance := GREATEST(0, v_profile.balance - v_payment.amount);
  
  -- Generate unique transaction hash
  v_tx_hash := 'TXN-' || UPPER(SUBSTRING(gen_random_uuid()::TEXT, 1, 8)) || '-' || EXTRACT(EPOCH FROM NOW())::TEXT;
  
  -- Update user balance
  UPDATE profiles SET balance = v_new_balance, updated_at = NOW() WHERE user_id = v_payment.user_id;
  
  -- Mark payment as deduction processed
  UPDATE payments SET deduction_processed = true WHERE id = _payment_id;
  
  -- Log the deduction
  INSERT INTO balance_deductions (user_id, amount, deduction_type, reference_id, reason, balance_before, balance_after, transaction_hash)
  VALUES (
    v_payment.user_id,
    v_payment.amount,
    _deduction_type,
    _payment_id,
    CASE _deduction_type 
      WHEN 'payment_approved' THEN 'Balance deducted after payment approval'
      WHEN 'payment_rejected' THEN 'Balance deducted after payment rejection'
      ELSE 'Balance deduction'
    END,
    v_profile.balance,
    v_new_balance,
    v_tx_hash
  );
  
  -- Create admin notification
  INSERT INTO admin_notifications (user_id, user_name, user_email, type, message, amount, reference_id, priority)
  VALUES (
    v_payment.user_id,
    v_profile.full_name,
    v_profile.email,
    'deduction',
    'Balance deducted: ₦' || v_payment.amount || ' (' || _deduction_type || ')',
    v_payment.amount,
    _payment_id,
    'normal'
  );
  
  RETURN jsonb_build_object(
    'success', true, 
    'message', 'Deduction processed',
    'balance_before', v_profile.balance,
    'balance_after', v_new_balance,
    'amount_deducted', v_payment.amount,
    'transaction_hash', v_tx_hash
  );
END;
$$;

-- Create function for withdrawal continue deduction
CREATE OR REPLACE FUNCTION public.process_withdrawal_deduction(
  _user_id UUID,
  _amount INTEGER
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_profile RECORD;
  v_new_balance INTEGER;
  v_tx_hash TEXT;
  v_setting RECORD;
BEGIN
  -- Check admin setting
  SELECT setting_value INTO v_setting FROM admin_settings WHERE setting_key = 'auto_deduct_on_withdraw';
  
  IF v_setting IS NULL OR (v_setting.setting_value->>'enabled')::boolean = false THEN
    RETURN jsonb_build_object('success', false, 'message', 'Auto deduction is disabled', 'should_deduct', false);
  END IF;
  
  -- Get user profile
  SELECT * INTO v_profile FROM profiles WHERE user_id = _user_id;
  
  IF v_profile IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'User profile not found');
  END IF;
  
  -- Check sufficient balance
  IF v_profile.balance < _amount THEN
    RETURN jsonb_build_object('success', false, 'message', 'Insufficient balance');
  END IF;
  
  -- Calculate new balance
  v_new_balance := v_profile.balance - _amount;
  
  -- Generate unique transaction hash
  v_tx_hash := 'WD-' || UPPER(SUBSTRING(gen_random_uuid()::TEXT, 1, 8)) || '-' || EXTRACT(EPOCH FROM NOW())::TEXT;
  
  -- Update user balance
  UPDATE profiles SET balance = v_new_balance, updated_at = NOW() WHERE user_id = _user_id;
  
  -- Log the deduction
  INSERT INTO balance_deductions (user_id, amount, deduction_type, reason, balance_before, balance_after, transaction_hash)
  VALUES (
    _user_id,
    _amount,
    'withdrawal_continue',
    'Amount reserved for withdrawal processing',
    v_profile.balance,
    v_new_balance,
    v_tx_hash
  );
  
  RETURN jsonb_build_object(
    'success', true, 
    'message', 'Withdrawal deduction processed',
    'balance_before', v_profile.balance,
    'balance_after', v_new_balance,
    'amount_deducted', _amount,
    'transaction_hash', v_tx_hash,
    'should_deduct', true
  );
END;
$$;

-- Update approve_payment function to also process deduction
CREATE OR REPLACE FUNCTION public.approve_payment_with_deduction(
  _payment_id UUID,
  _admin_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result JSONB;
BEGIN
  -- First approve the payment using existing function
  SELECT approve_payment(_payment_id, _admin_id) INTO v_result;
  
  IF (v_result->>'success')::boolean = true THEN
    -- Then process deduction
    PERFORM process_payment_deduction(_payment_id, 'payment_approved');
  END IF;
  
  RETURN v_result;
END;
$$;