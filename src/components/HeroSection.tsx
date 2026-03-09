import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, Wand2, BookOpen } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      {/* Glow aura */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, hsl(196 51% 33% / 0.4), transparent 70%)" }}
      />
      <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, hsl(208 30% 74% / 0.3), transparent 70%)" }}
      />

      <div className="container max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center lg:text-left"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-frost/20 bg-frost/5 text-frost text-sm mb-6"
          >
            <Sparkles className="w-4 h-4" />
            AI-Powered Writing Toolkit
          </motion.div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 tracking-tight">
            Build Better Stories with{" "}
            <span className="gradient-text">AI-Powered Writing Tools</span>
          </h1>

          <p className="text-lg text-silver/70 max-w-xl mb-8 leading-relaxed mx-auto lg:mx-0">
            Generate characters, fantasy worlds, plots, cultivation systems, and story ideas in seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link
              to="/generators"
              className="btn-primary-gradient px-8 py-3.5 rounded-lg text-center font-semibold inline-flex items-center justify-center gap-2"
            >
              <Wand2 className="w-4 h-4" />
              Start Creating
            </Link>
            <Link
              to="/generators"
              className="btn-ghost-frost px-8 py-3.5 rounded-lg text-center inline-flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Explore Generators
            </Link>
          </div>
        </motion.div>

        {/* Right mockup */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="hidden lg:block"
        >
          <div className="glass-card p-6 rounded-xl relative">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-destructive/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
              <span className="text-xs text-muted-foreground ml-2">Character Generator</span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex gap-2">
                <span className="text-xs text-muted-foreground w-20">Role</span>
                <div className="flex-1 h-8 bg-muted/50 rounded-md flex items-center px-3 text-sm text-frost">Fallen Prince</div>
              </div>
              <div className="flex gap-2">
                <span className="text-xs text-muted-foreground w-20">Setting</span>
                <div className="flex-1 h-8 bg-muted/50 rounded-md flex items-center px-3 text-sm text-frost">Dark Fantasy</div>
              </div>
            </div>

            <div className="bg-muted/30 rounded-lg p-4 border border-frost/5">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
              >
                <p className="text-sm font-semibold text-frost mb-2">⚔️ Kael Draven</p>
                <p className="text-xs text-silver/60 leading-relaxed">
                  A ruthless yet secretly honorable fallen prince, haunted by guilt and driven to reclaim his destroyed kingdom. He carries forbidden blood magic...
                </p>
              </motion.div>
            </div>

            {/* Floating glow */}
            <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-full opacity-20 blur-2xl"
              style={{ background: "hsl(196 51% 33%)" }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
