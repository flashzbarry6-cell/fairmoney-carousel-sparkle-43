-- Add archived field to payments table for admin to archive payments
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS archived boolean DEFAULT false;

-- Create index for faster querying of non-archived payments
CREATE INDEX IF NOT EXISTS idx_payments_archived ON public.payments(archived) WHERE archived = false;

-- Update RLS policy for admins to see non-archived payments (optional - current policy already works)