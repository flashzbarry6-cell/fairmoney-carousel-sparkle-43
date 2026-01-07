-- Allow users to update/re-upload their receipts
CREATE POLICY "Users can update their receipts"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'payment-receipts' AND (auth.uid())::text = (storage.foldername(name))[1])
WITH CHECK (bucket_id = 'payment-receipts' AND (auth.uid())::text = (storage.foldername(name))[1]);