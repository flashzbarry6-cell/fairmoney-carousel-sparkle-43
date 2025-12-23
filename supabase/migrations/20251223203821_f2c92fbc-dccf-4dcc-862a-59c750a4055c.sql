-- Create spin_history table to track all spins
CREATE TABLE public.spin_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stake_amount INTEGER NOT NULL,
  result TEXT NOT NULL CHECK (result IN ('win', 'lose')),
  prize_amount INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.spin_history ENABLE ROW LEVEL SECURITY;

-- Users can view their own spin history
CREATE POLICY "Users can view their own spin history"
ON public.spin_history
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own spins
CREATE POLICY "Users can insert their own spins"
ON public.spin_history
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_spin_history_user_id ON public.spin_history(user_id);
CREATE INDEX idx_spin_history_created_at ON public.spin_history(created_at DESC);