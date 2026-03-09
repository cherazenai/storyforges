import { motion } from "framer-motion";
import { Users, Scroll, Mountain, Zap, Skull, Globe } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Character Generator",
    description: "Create deep characters with personality, goals, secrets and flaws.",
  },
  {
    icon: Scroll,
    title: "Fantasy Name Generator",
    description: "Generate unique fantasy names for heroes, villains, kingdoms and races.",
  },
  {
    icon: Mountain,
    title: "Cultivation Realm Generator",
    description: "Generate realm names, power systems, and progression stages for xianxia novels.",
  },
  {
    icon: Zap,
    title: "Plot Twist Generator",
    description: "Create shocking plot twists that keep your readers on the edge.",
  },
  {
    icon: Skull,
    title: "Villain Backstory Generator",
    description: "Generate tragic or complex villain origins with depth.",
  },
  {
    icon: Globe,
    title: "Worldbuilding Generator",
    description: "Generate kingdoms, magic systems, and detailed lore.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="relative py-24 px-4 section-glow">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Powerful <span className="gradient-text">Generators</span> for Writers
          </h2>
          <p className="text-silver/60 max-w-2xl mx-auto">
            Everything you need to craft immersive stories, characters, and worlds.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card p-6 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-frost" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
