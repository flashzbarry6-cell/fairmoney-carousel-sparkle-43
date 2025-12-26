-- Add expires_at column to payments table
ALTER TABLE public.payments 
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '1 hour');

-- Enable realtime for payments table
ALTER PUBLICATION supabase_realtime ADD TABLE public.payments;