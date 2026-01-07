-- Allow end-users to attach/update their own receipt URL (required for receipt uploads)
CREATE POLICY "Users can update their own payments"
ON public.payments
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Guardrail: non-admins may ONLY change payment_proof_url (receipt) while payment is pending
CREATE OR REPLACE FUNCTION public.enforce_payments_user_update_restrictions()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  -- Admins can update anything
  IF public.is_admin(auth.uid()) THEN
    NEW.updated_at := now();
    RETURN NEW;
  END IF;

  -- Must be authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Must own the payment
  IF OLD.user_id <> auth.uid() OR NEW.user_id <> auth.uid() THEN
    RAISE EXCEPTION 'Not allowed';
  END IF;

  -- Only allow edits while pending
  IF OLD.status <> 'pending' OR NEW.status <> 'pending' THEN
    RAISE EXCEPTION 'Cannot modify non-pending payment';
  END IF;

  -- Only receipt can change (plus updated_at which we set here)
  IF NEW.amount <> OLD.amount
     OR NEW.payment_type <> OLD.payment_type
     OR NEW.archived IS DISTINCT FROM OLD.archived
     OR NEW.expires_at IS DISTINCT FROM OLD.expires_at
     OR NEW.rejection_reason IS DISTINCT FROM OLD.rejection_reason
     OR NEW.approved_by IS DISTINCT FROM OLD.approved_by
     OR NEW.approved_at IS DISTINCT FROM OLD.approved_at
     OR NEW.status IS DISTINCT FROM OLD.status
  THEN
     RAISE EXCEPTION 'Only receipt can be updated';
  END IF;

  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS payments_enforce_user_updates ON public.payments;

CREATE TRIGGER payments_enforce_user_updates
BEFORE UPDATE ON public.payments
FOR EACH ROW
EXECUTE FUNCTION public.enforce_payments_user_update_restrictions();