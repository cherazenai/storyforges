import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "",
    features: [
      "5 generations per day",
      "Access to basic generators",
      "Limited history",
    ],
    cta: "Start Free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$5",
    period: "/ month",
    features: [
      "Unlimited generations",
      "All generators unlocked",
      "Full history",
      "Faster generation",
    ],
    cta: "Upgrade to Pro",
    highlighted: true,
  },
];

const Pricing = () => {
  return (
    <div className="min-h-screen bg-background pt-24 pb-16 px-4">
      <div className="container max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold mb-4">
            Simple <span className="gradient-text">Pricing</span>
          </h1>
          <p className="text-silver/60 max-w-lg mx-auto">
            Start free and upgrade when you need more power.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className={`glass-card p-8 rounded-xl relative ${
                plan.highlighted ? "frost-glow-strong" : ""
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full btn-primary-gradient text-xs font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Popular
                </div>
              )}

              <h3 className="text-lg font-semibold text-foreground mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                {plan.period && <span className="text-muted-foreground text-sm">{plan.period}</span>}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-silver/70">
                    <Check className="w-4 h-4 text-frost flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                to="/signup"
                className={`block text-center py-3 rounded-lg text-sm font-semibold transition-all ${
                  plan.highlighted
                    ? "btn-primary-gradient"
                    : "btn-ghost-frost"
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
