-- Create admin notifications table
CREATE TABLE public.admin_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('pending_payment', 'new_user', 'withdrawal_request')),
  user_id UUID NOT NULL,
  user_email TEXT,
  user_name TEXT,
  amount INTEGER,
  reference_id UUID,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  is_resolved BOOLEAN NOT NULL DEFAULT false,
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('normal', 'high')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

-- Only admins can view notifications
CREATE POLICY "Admins can view all notifications"
ON public.admin_notifications
FOR SELECT
USING (is_admin(auth.uid()));

-- Only admins can update notifications (mark as read/resolved)
CREATE POLICY "Admins can update notifications"
ON public.admin_notifications
FOR UPDATE
USING (is_admin(auth.uid()));

-- System can insert notifications (via triggers)
CREATE POLICY "System can insert notifications"
ON public.admin_notifications
FOR INSERT
WITH CHECK (true);

-- Enable realtime for this table
ALTER PUBLICATION supabase_realtime ADD TABLE public.admin_notifications;

-- Trigger function for new pending payments
CREATE OR REPLACE FUNCTION public.notify_admin_on_pending_payment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_profile RECORD;
BEGIN
  -- Only trigger for pending status
  IF NEW.status = 'pending' THEN
    -- Get user details
    SELECT email, full_name INTO user_profile 
    FROM public.profiles 
    WHERE user_id = NEW.user_id;
    
    INSERT INTO public.admin_notifications (
      type,
      user_id,
      user_email,
      user_name,
      amount,
      reference_id,
      message,
      priority
    ) VALUES (
      'pending_payment',
      NEW.user_id,
      user_profile.email,
      user_profile.full_name,
      NEW.amount,
      NEW.id,
      'New pending payment of ₦' || NEW.amount || ' from ' || COALESCE(user_profile.full_name, user_profile.email),
      'high'
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for payments
CREATE TRIGGER on_payment_created
AFTER INSERT ON public.payments
FOR EACH ROW
EXECUTE FUNCTION public.notify_admin_on_pending_payment();

-- Trigger function for new user registration
CREATE OR REPLACE FUNCTION public.notify_admin_on_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.admin_notifications (
    type,
    user_id,
    user_email,
    user_name,
    message,
    priority
  ) VALUES (
    'new_user',
    NEW.user_id,
    NEW.email,
    NEW.full_name,
    'New user registered: ' || COALESCE(NEW.full_name, NEW.email),
    'normal'
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger for new profiles (user registration)
CREATE TRIGGER on_user_registered
AFTER INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.notify_admin_on_new_user();