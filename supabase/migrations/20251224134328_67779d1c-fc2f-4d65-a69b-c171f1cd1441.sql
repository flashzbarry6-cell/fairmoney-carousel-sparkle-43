-- Fix search_path for existing functions
CREATE OR REPLACE FUNCTION public.update_referral_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  UPDATE public.profiles 
  SET total_referrals = (
    SELECT COUNT(*) 
    FROM public.referrals 
    WHERE referrer_id = NEW.referrer_id AND status = 'completed'
  )
  WHERE user_id = NEW.referrer_id;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id, 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.process_referral(referral_code_input text, device_id_input text DEFAULT NULL::text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  referrer_user_id UUID;
  current_user_id UUID;
  result JSON;
BEGIN
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'User not authenticated');
  END IF;
  
  IF device_id_input IS NOT NULL THEN
    IF EXISTS (SELECT 1 FROM public.profiles WHERE device_id = device_id_input) THEN
      RETURN json_build_object('success', false, 'message', 'Device already registered');
    END IF;
    
    UPDATE public.profiles SET device_id = device_id_input WHERE user_id = current_user_id;
  END IF;
  
  SELECT user_id INTO referrer_user_id 
  FROM public.profiles 
  WHERE referral_code = referral_code_input;
  
  IF referrer_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Invalid referral code');
  END IF;
  
  IF referrer_user_id = current_user_id THEN
    RETURN json_build_object('success', false, 'message', 'Cannot refer yourself');
  END IF;
  
  IF EXISTS (SELECT 1 FROM public.referrals WHERE referred_id = current_user_id) THEN
    RETURN json_build_object('success', false, 'message', 'User already referred');
  END IF;
  
  INSERT INTO public.referrals (referrer_id, referred_id, status)
  VALUES (referrer_user_id, current_user_id, 'completed');
  
  UPDATE public.profiles SET referred_by = referrer_user_id WHERE user_id = current_user_id;
  
  RETURN json_build_object('success', true, 'message', 'Referral processed successfully');
END;
$function$;