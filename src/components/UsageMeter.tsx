import { PLAN_CONFIGS, type PlanType } from "@/hooks/useUsage";

interface UsageMeterProps {
  used: number;
  limit: number;
  percentage: number;
  plan: PlanType;
}

const UsageMeter = ({ used, limit, percentage, plan }: UsageMeterProps) => {
  const config = PLAN_CONFIGS[plan];
  const periodLabel = config.period === "day" ? "today" : "this month";

  const barColor =
    percentage >= 90
      ? "bg-destructive"
      : percentage >= 60
        ? "bg-orange-500"
        : "bg-primary";

  return (
    <div className="glass-card p-4 rounded-xl">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted-foreground uppercase tracking-wider">
          Generations {periodLabel}
        </span>
        <span className="text-sm font-semibold text-foreground">
          {used} / {limit}
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {percentage >= 80 && percentage < 100 && (
        <p className="text-xs text-orange-400 mt-2">
          You are close to your generation limit. Upgrade for more story creation power.
        </p>
      )}
    </div>
  );
};

export default UsageMeter;
