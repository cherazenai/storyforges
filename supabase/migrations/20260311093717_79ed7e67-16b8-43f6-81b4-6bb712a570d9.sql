
CREATE TABLE public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  razorpay_order_id text NOT NULL,
  razorpay_payment_id text,
  razorpay_signature text,
  plan text NOT NULL,
  billing_period text NOT NULL DEFAULT 'monthly',
  amount integer NOT NULL,
  currency text NOT NULL DEFAULT 'INR',
  status text NOT NULL DEFAULT 'created',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payments"
  ON public.payments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert payments"
  ON public.payments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can update payments"
  ON public.payments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);
