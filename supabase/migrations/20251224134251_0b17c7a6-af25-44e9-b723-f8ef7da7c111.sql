-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create enum for payment status
CREATE TYPE public.payment_status AS ENUM ('pending', 'approved', 'rejected');

-- Create user_roles table for role-based access
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Add blocked status to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS blocked_reason TEXT;

-- Create payments table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  amount INTEGER NOT NULL,
  status payment_status NOT NULL DEFAULT 'pending',
  payment_type TEXT NOT NULL DEFAULT 'deposit',
  payment_proof_url TEXT,
  rejection_reason TEXT,
  approved_by UUID,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Security definer function to check if user has a role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'admin')
$$;

-- Security definer function to check if user is blocked
CREATE OR REPLACE FUNCTION public.is_user_blocked(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT is_blocked FROM public.profiles WHERE user_id = _user_id),
    false
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- RLS policies for payments
CREATE POLICY "Users can view their own payments"
ON public.payments
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE POLICY "Users can insert their own payments"
ON public.payments
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update any payment"
ON public.payments
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));

-- Allow admins to view all profiles for user management
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

-- Allow admins to update any profile (for blocking)
CREATE POLICY "Admins can update any profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

-- Create indexes for better performance
CREATE INDEX idx_payments_user_id ON public.payments(user_id);
CREATE INDEX idx_payments_status ON public.payments(status);
CREATE INDEX idx_payments_created_at ON public.payments(created_at DESC);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);

-- Function to approve payment and credit wallet
CREATE OR REPLACE FUNCTION public.approve_payment(_payment_id UUID, _admin_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  payment_record RECORD;
  result JSON;
BEGIN
  -- Check if admin
  IF NOT public.is_admin(_admin_id) THEN
    RETURN json_build_object('success', false, 'message', 'Unauthorized');
  END IF;

  -- Get payment details
  SELECT * INTO payment_record FROM public.payments WHERE id = _payment_id;
  
  IF payment_record IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Payment not found');
  END IF;
  
  IF payment_record.status != 'pending' THEN
    RETURN json_build_object('success', false, 'message', 'Payment already processed');
  END IF;
  
  -- Update payment status
  UPDATE public.payments 
  SET status = 'approved', 
      approved_by = _admin_id, 
      approved_at = now(),
      updated_at = now()
  WHERE id = _payment_id;
  
  -- Credit user wallet
  UPDATE public.profiles 
  SET balance = balance + payment_record.amount,
      updated_at = now()
  WHERE user_id = payment_record.user_id;
  
  RETURN json_build_object('success', true, 'message', 'Payment approved and wallet credited');
END;
$$;

-- Function to reject payment
CREATE OR REPLACE FUNCTION public.reject_payment(_payment_id UUID, _admin_id UUID, _reason TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  payment_record RECORD;
BEGIN
  -- Check if admin
  IF NOT public.is_admin(_admin_id) THEN
    RETURN json_build_object('success', false, 'message', 'Unauthorized');
  END IF;

  -- Get payment details
  SELECT * INTO payment_record FROM public.payments WHERE id = _payment_id;
  
  IF payment_record IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Payment not found');
  END IF;
  
  IF payment_record.status != 'pending' THEN
    RETURN json_build_object('success', false, 'message', 'Payment already processed');
  END IF;
  
  -- Update payment status
  UPDATE public.payments 
  SET status = 'rejected', 
      rejection_reason = _reason,
      updated_at = now()
  WHERE id = _payment_id;
  
  RETURN json_build_object('success', true, 'message', 'Payment rejected');
END;
$$;

-- Function to block/unblock user
CREATE OR REPLACE FUNCTION public.toggle_user_block(_target_user_id UUID, _admin_id UUID, _block BOOLEAN, _reason TEXT DEFAULT NULL)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if admin
  IF NOT public.is_admin(_admin_id) THEN
    RETURN json_build_object('success', false, 'message', 'Unauthorized');
  END IF;

  -- Update user blocked status
  UPDATE public.profiles 
  SET is_blocked = _block,
      blocked_reason = CASE WHEN _block THEN COALESCE(_reason, 'Account restricted by admin') ELSE NULL END,
      updated_at = now()
  WHERE user_id = _target_user_id;
  
  RETURN json_build_object('success', true, 'message', CASE WHEN _block THEN 'User blocked' ELSE 'User unblocked' END);
END;
$$;