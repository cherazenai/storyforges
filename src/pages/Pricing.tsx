import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, Zap, Crown, Building2, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useRazorpay } from "@/hooks/useRazorpay";

type PlanKey = "free" | "writer" | "pro_author" | "studio";

const plans: Array<{
  name: string;
  key: PlanKey;
  monthlyPrice: number;
  yearlyPrice: number;
  monthlyPriceINR: number;
  yearlyPriceINR: number;
  limit: string;
  badge: string | null;
  icon: typeof Zap;
  features: string[];
  excluded: string[];
  cta: string;
  highlighted: boolean;
}> = [
  {
    name: "Free",
    key: "free",
    monthlyPrice: 0,
    yearlyPrice: 0,
    monthlyPriceINR: 0,
    yearlyPriceINR: 0,
    limit: "10 generations / day",
    badge: null,
    icon: Zap,
    features: [
      "Character Generator",
      "Fantasy Name Generator",
      "Plot Twist Generator",
      "Last 10 results saved",
      "Basic generation speed",
    ],
    excluded: [
      "Export to TXT / PDF",
      "Story Builder",
      "Advanced generators",
    ],
    cta: "Start Free",
    highlighted: false,
  },
  {
    name: "Writer",
    key: "writer",
    monthlyPrice: 12,
    yearlyPrice: 120,
    monthlyPriceINR: 999,
    yearlyPriceINR: 9999,
    limit: "300 generations / month",
    badge: "Most Popular",
    icon: Sparkles,
    features: [
      "All Free features",
      "Villain Generator",
      "World Generator",
      "Cultivation System Generator",
      "Story Builder",
      "Full generation history",
      "Export to TXT & PDF",
      "Faster generation speed",
    ],
    excluded: [],
    cta: "Upgrade to Writer",
    highlighted: true,
  },
  {
    name: "Pro Author",
    key: "pro_author",
    monthlyPrice: 25,
    yearlyPrice: 240,
    monthlyPriceINR: 2099,
    yearlyPriceINR: 19999,
    limit: "1,500 generations / month",
    badge: null,
    icon: Crown,
    features: [
      "Everything in Writer",
      "Chapter Generator",
      "Story Arc Generator",
      "Character Relationship Generator",
      "Advanced Story Builder",
      "Priority AI processing",
    ],
    excluded: [],
    cta: "Upgrade to Pro",
    highlighted: false,
  },
  {
    name: "Studio",
    key: "studio",
    monthlyPrice: 49,
    yearlyPrice: 470,
    monthlyPriceINR: 4099,
    yearlyPriceINR: 38999,
    limit: "5,000 generations / month",
    badge: "For Power Users",
    icon: Building2,
    features: [
      "Everything in Pro Author",
      "Unlimited history storage",
      "Bulk generation mode",
      "Advanced worldbuilding generator",
      "Large story blueprint generator",
      "Future experimental tools",
    ],
    excluded: [],
    cta: "Upgrade to Studio",
    highlighted: false,
  },
];

const Pricing = () => {
  const [yearly, setYearly] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const { checkout, loading: paymentLoading } = useRazorpay({
    onSuccess: () => {
      navigate("/dashboard");
    },
  });

  const [activePlan, setActivePlan] = useState<string | null>(null);

  const handlePlanClick = (plan: typeof plans[0]) => {
    if (plan.key === "free") {
      navigate("/signup");
      return;
    }

    if (!user) {
      navigate("/signup");
      return;
    }

    setActivePlan(plan.key);
    const period = yearly ? "yearly" : "monthly";
    checkout(plan.key, period);
  };

  return (
    <div className="min-h-screen bg-[#000000] pt-24 pb-16 px-4">
      <div className="container max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-foreground">
            Choose Your <span className="gradient-text">Story Plan</span>
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto mb-8">
            Unlock AI-powered writing tools to bring your web novel to life.
          </p>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-3">
            <span className={`text-sm font-medium transition-colors ${!yearly ? "text-foreground" : "text-muted-foreground"}`}>Monthly</span>
            <button
              onClick={() => setYearly(!yearly)}
              className={`relative w-14 h-7 rounded-full transition-colors ${yearly ? "bg-primary" : "bg-muted"}`}
            >
              <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-foreground transition-transform ${yearly ? "translate-x-7" : "translate-x-0.5"}`} />
            </button>
            <span className={`text-sm font-medium transition-colors ${yearly ? "text-foreground" : "text-muted-foreground"}`}>
              Yearly
            </span>
            {yearly && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              >
                Save 20%
              </motion.span>
            )}
          </div>
        </motion.div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {plans.map((plan, i) => {
            const priceINR = yearly ? plan.yearlyPriceINR : plan.monthlyPriceINR;
            const period = plan.monthlyPrice === 0 ? "" : yearly ? "/year" : "/mo";
            const Icon = plan.icon;
            const isLoading = paymentLoading && activePlan === plan.key;

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className={`relative rounded-2xl p-[1px] ${
                  plan.highlighted
                    ? "bg-gradient-to-b from-primary via-primary/40 to-transparent"
                    : "bg-gradient-to-b from-border/60 to-transparent"
                }`}
              >
                <div
                  className={`h-full rounded-2xl p-6 backdrop-blur-xl flex flex-col ${
                    plan.highlighted
                      ? "bg-[#0a0f14]/90 shadow-[0_0_40px_-10px_hsl(var(--primary)/0.3)]"
                      : "bg-[#0a0a0e]/80"
                  }`}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 whitespace-nowrap ${
                      plan.highlighted
                        ? "btn-primary-gradient text-primary-foreground"
                        : "bg-muted border border-border text-foreground"
                    }`}>
                      {plan.highlighted && <Sparkles className="w-3 h-3" />}
                      {plan.badge}
                    </div>
                  )}

                  {/* Icon + Name */}
                  <div className="flex items-center gap-2 mb-4 mt-1">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      plan.highlighted ? "bg-primary/20" : "bg-muted/60"
                    }`}>
                      <Icon className={`w-4 h-4 ${plan.highlighted ? "text-primary-foreground" : "text-muted-foreground"}`} />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-4xl font-extrabold text-foreground">
                      {priceINR === 0 ? "Free" : `₹${priceINR.toLocaleString("en-IN")}`}
                    </span>
                    {period && priceINR > 0 && <span className="text-sm text-muted-foreground">{period}</span>}
                  </div>

                  {/* Limit */}
                  <p className="text-xs text-muted-foreground mb-5">{plan.limit}</p>

                  {/* CTA */}
                  <button
                    onClick={() => handlePlanClick(plan)}
                    disabled={isLoading || paymentLoading}
                    className={`block w-full text-center py-2.5 rounded-lg text-sm font-semibold transition-all mb-6 disabled:opacity-50 ${
                      plan.highlighted
                        ? "btn-primary-gradient hover:shadow-[0_0_20px_-5px_hsl(var(--primary)/0.5)]"
                        : "border border-border text-foreground hover:bg-muted/50"
                    }`}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      plan.cta
                    )}
                  </button>

                  {/* Features */}
                  <ul className="space-y-2.5 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-foreground/80">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                    {plan.excluded.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground/50 line-through">
                        <Check className="w-4 h-4 text-muted-foreground/30 mt-0.5 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
