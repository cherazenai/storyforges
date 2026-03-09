import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Users, Skull, Globe, Zap, Mountain, Scroll } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Character Generator",
    description: "Create deep characters with personality, backstory, goals, secrets, and flaws for any genre.",
  },
  {
    icon: Skull,
    title: "Villain Generator",
    description: "Generate tragic or complex villain origins with motivations that drive your story forward.",
  },
  {
    icon: Globe,
    title: "World Generator",
    description: "Build kingdoms, magic systems, political structures, and detailed lore from scratch.",
  },
  {
    icon: Zap,
    title: "Magic System Generator",
    description: "Design unique power systems with rules, limitations, and progression tiers.",
  },
  {
    icon: Mountain,
    title: "Cultivation Generator",
    description: "Generate realm names, cultivation stages, and xianxia-style progression systems.",
  },
  {
    icon: Scroll,
    title: "Plot Generator",
    description: "Create shocking plot twists, story arcs, and narrative hooks that keep readers hooked.",
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
          <p className="text-muted-foreground max-w-2xl mx-auto">
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
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link to="/generators" className="glass-card p-6 group cursor-pointer block h-full">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:border-primary/30 transition-all duration-300">
                  <feature.icon className="w-6 h-6 text-frost" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground group-hover:text-frost transition-colors">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
