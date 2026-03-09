import ParticleBackground from "@/components/ParticleBackground";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Wand2, BookOpen, Sparkles, PenTool, Shield, Gamepad2, Check, Users, Scroll, Mountain, Zap, Skull, Globe } from "lucide-react";

const exampleCharacters = [
  {
    name: "Kael Draven",
    race: "Half-Demon",
    role: "Fallen Prince",
    backstory: "Exiled from the Obsidian Throne after his demonic heritage was revealed, Kael wanders the shattered kingdoms seeking redemption through forbidden blood magic.",
  },
  {
    name: "Lyra Ashenveil",
    race: "Moon Elf",
    role: "Shadow Weaver",
    backstory: "Once the brightest mage of the Silver Spire, Lyra now hunts the corrupted spirits that destroyed her homeland, wielding threads of starlight and shadow.",
  },
  {
    name: "Thorne Ironfist",
    race: "Dragonborn",
    role: "Siege Commander",
    backstory: "A war-scarred veteran who carries the last dragon egg of the Ember Clutch. He builds armies not for conquest but to protect the egg from those who would exploit it.",
  },
];

const steps = [
  { step: "01", title: "Choose a Generator", desc: "Pick from character, world, villain, magic system, and more.", icon: Wand2 },
  { step: "02", title: "Generate Your Idea", desc: "AI creates rich, detailed content tailored to your story.", icon: Sparkles },
  { step: "03", title: "Download & Save", desc: "Export as PDF, Word, Excel, or save to your library.", icon: BookOpen },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    highlight: false,
    features: ["10 generations / day", "All 6 generators", "Copy & paste results", "Basic export"],
  },
  {
    name: "Writer",
    price: "$9",
    period: "/month",
    highlight: true,
    features: ["500 generations / month", "Character Sheet Designer", "PDF, Word & Excel export", "Save favorites & history", "Priority generation"],
  },
  {
    name: "Pro Author",
    price: "$24",
    period: "/month",
    highlight: false,
    features: ["5,000 generations / month", "Everything in Writer", "Batch generation", "Custom datasets", "Early access to new tools"],
  },
];

const useCases = [
  { icon: PenTool, label: "Web Novel Writers", desc: "Generate characters and arcs for serialized fiction." },
  { icon: Shield, label: "Dungeon Masters", desc: "Create NPCs, lore, and encounters on the fly." },
  { icon: Globe, label: "Worldbuilders", desc: "Design kingdoms, magic systems, and histories." },
  { icon: Gamepad2, label: "Indie Game Writers", desc: "Build narrative elements for RPGs and visual novels." },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <ParticleBackground />
      <HeroSection />
      <FeaturesSection />

      {/* Character Showcase */}
      <section className="relative py-24 px-4 section-glow">
        <div className="container max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Example <span className="gradient-text">Characters</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              See what StoryForge can generate in seconds.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {exampleCharacters.map((char, i) => (
              <motion.div
                key={char.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 group"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 text-2xl">
                  ⚔️
                </div>
                <h3 className="text-lg font-bold text-foreground mb-1">{char.name}</h3>
                <p className="text-xs text-frost mb-3">{char.race} • {char.role}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{char.backstory}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-24 px-4">
        <div className="container max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">Three steps to your next story idea.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-5">
                  <s.icon className="w-7 h-7 text-frost" />
                </div>
                <span className="text-xs font-bold text-frost uppercase tracking-widest mb-2 block">Step {s.step}</span>
                <h3 className="text-lg font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="relative py-24 px-4 section-glow">
        <div className="container max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Simple <span className="gradient-text">Pricing</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">Start free. Upgrade when you need more.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`glass-card-static p-6 rounded-xl relative ${plan.highlight ? "border-primary/30 frost-glow" : ""}`}
              >
                {plan.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-semibold px-3 py-1 rounded-full btn-primary-gradient">
                    Most Popular
                  </span>
                )}
                <h3 className="text-lg font-bold text-foreground mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-5">
                  <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-frost flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/pricing"
                  className={`w-full text-center block py-2.5 rounded-lg text-sm font-semibold transition-all ${plan.highlight ? "btn-primary-gradient" : "btn-ghost-frost"}`}
                >
                  {plan.name === "Free" ? "Get Started" : "Choose Plan"}
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/pricing" className="text-sm text-frost hover:underline inline-flex items-center gap-1.5">
              View Full Pricing <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof / Use Cases */}
      <section className="relative py-24 px-4">
        <div className="container max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Built for <span className="gradient-text">Fantasy Writers</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">No matter your creative medium, StoryForge has you covered.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {useCases.map((uc, i) => (
              <motion.div
                key={uc.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card p-5 text-center group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                  <uc.icon className="w-5 h-5 text-frost" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1">{uc.label}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{uc.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-28 px-4">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, hsl(196 51% 33% / 0.6), transparent 70%)" }}
        />
        <div className="container max-w-3xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5">
              Start building your story universe <span className="gradient-text">today</span>.
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Join writers who use StoryForge to craft unforgettable worlds and characters with AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="btn-primary-gradient px-8 py-3.5 rounded-lg font-semibold inline-flex items-center justify-center gap-2"
              >
                <Wand2 className="w-4 h-4" />
                Start Creating Free
              </Link>
              <Link
                to="/generators"
                className="btn-ghost-frost px-8 py-3.5 rounded-lg inline-flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Explore Generators
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-10 px-4 relative z-10">
        <div className="container max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <Link to="/" className="flex items-center gap-2 text-lg font-bold text-foreground mb-1">
                <Sparkles className="w-5 h-5 text-frost" />
                StoryForge
              </Link>
              <p className="text-xs text-muted-foreground">AI-powered writing toolkit for fantasy authors.</p>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-muted-foreground">
              <Link to="/generators" className="hover:text-foreground transition-colors">Generators</Link>
              <Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
              <Link to="/dashboard" className="hover:text-foreground transition-colors">Character Library</Link>
              <Link to="/login" className="hover:text-foreground transition-colors">Login</Link>
              <Link to="/signup" className="hover:text-foreground transition-colors">Sign Up</Link>
            </div>
          </div>
          <div className="border-t border-border/30 mt-6 pt-6">
            <p className="text-xs text-muted-foreground">© 2026 StoryForge. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
