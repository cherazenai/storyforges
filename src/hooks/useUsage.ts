import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type PlanType = "free" | "writer" | "pro_author" | "studio";

interface PlanConfig {
  limit: number;
  period: "day" | "month";
  label: string;
}

export const PLAN_CONFIGS: Record<PlanType, PlanConfig> = {
  free: { limit: 10, period: "day", label: "Free" },
  writer: { limit: 300, period: "month", label: "Writer" },
  pro_author: { limit: 1500, period: "month", label: "Pro Author" },
  studio: { limit: 5000, period: "month", label: "Studio" },
};

export function useUsage() {
  const { user } = useAuth();
  const [plan, setPlan] = useState<PlanType>("free");
  const [used, setUsed] = useState(0);
  const [loading, setLoading] = useState(true);
  const [billingCycleStart, setBillingCycleStart] = useState<string | null>(null);

  const config = PLAN_CONFIGS[plan];
  const limit = config.limit;
  const percentage = limit > 0 ? Math.min((used / limit) * 100, 100) : 0;
  const remaining = Math.max(limit - used, 0);
  const isAtLimit = used >= limit;

  const fetchUsage = useCallback(async () => {
    if (!user) { setLoading(false); return; }

    // Get plan from profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan, billing_cycle_start")
      .eq("user_id", user.id)
      .single();

    const userPlan = (profile?.plan as PlanType) || "free";
    setPlan(userPlan);
    setBillingCycleStart(profile?.billing_cycle_start || null);

    // Count generations in current period
    const planConfig = PLAN_CONFIGS[userPlan];
    let since: string;

    if (planConfig.period === "day") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      since = today.toISOString();
    } else {
      // Monthly: use billing_cycle_start, reset monthly
      const cycleStart = new Date(profile?.billing_cycle_start || new Date());
      const now = new Date();
      // Find current period start
      const periodStart = new Date(cycleStart);
      while (periodStart <= now) {
        const next = new Date(periodStart);
        next.setMonth(next.getMonth() + 1);
        if (next > now) break;
        periodStart.setMonth(periodStart.getMonth() + 1);
      }
      since = periodStart.toISOString();
    }

    const { count } = await supabase
      .from("generations")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", since);

    setUsed(count || 0);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchUsage(); }, [fetchUsage]);

  return {
    plan,
    used,
    limit,
    remaining,
    percentage,
    isAtLimit,
    loading,
    config,
    refresh: fetchUsage,
  };
}
