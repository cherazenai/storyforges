import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface UseRazorpayOptions {
  onSuccess?: (plan: string) => void;
}

export function useRazorpay({ onSuccess }: UseRazorpayOptions = {}) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const loadScript = useCallback((): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }, []);

  const checkout = useCallback(
    async (plan: string, billingPeriod: "monthly" | "yearly") => {
      if (!user) {
        toast.error("Please log in to upgrade your plan");
        return;
      }

      setLoading(true);

      try {
        const loaded = await loadScript();
        if (!loaded) {
          toast.error("Failed to load payment gateway");
          setLoading(false);
          return;
        }

        // Create order
        const { data, error } = await supabase.functions.invoke("create-order", {
          body: { plan, billing_period: billingPeriod },
        });

        if (error || !data?.order_id) {
          toast.error("Failed to create order. Please try again.");
          setLoading(false);
          return;
        }

        const options = {
          key: data.key_id,
          amount: data.amount,
          currency: data.currency,
          name: "StoryForge",
          description: `${plan.replace("_", " ")} Plan (${billingPeriod})`,
          order_id: data.order_id,
          handler: async (response: {
            razorpay_order_id: string;
            razorpay_payment_id: string;
            razorpay_signature: string;
          }) => {
            // Verify payment
            const { data: verifyData, error: verifyError } =
              await supabase.functions.invoke("verify-payment", {
                body: {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                },
              });

            if (verifyError || !verifyData?.success) {
              toast.error("Payment verification failed. Contact support.");
            } else {
              toast.success(`Successfully upgraded to ${plan.replace("_", " ")}!`);
              onSuccess?.(plan);
            }
            setLoading(false);
          },
          prefill: {
            email: user.email,
          },
          theme: {
            color: "#4a9ead",
          },
          modal: {
            ondismiss: () => setLoading(false),
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", (response: any) => {
          console.error("Payment failed:", response.error);
          toast.error("Payment failed. Please try again.");
          setLoading(false);
        });
        rzp.open();
      } catch (e) {
        console.error("Checkout error:", e);
        toast.error("Something went wrong. Please try again.");
        setLoading(false);
      }
    },
    [user, loadScript, onSuccess]
  );

  return { checkout, loading };
}
