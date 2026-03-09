import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Wand2, BookOpen, Search } from "lucide-react";

const searchItems = [
  { label: "Character Generator", path: "/generators", type: "generator" },
  { label: "Villain Generator", path: "/generators", type: "generator" },
  { label: "World Generator", path: "/generators", type: "generator" },
  { label: "Plot Twist Generator", path: "/generators", type: "generator" },
  { label: "Cultivation Generator", path: "/generators", type: "generator" },
  { label: "Name Generator", path: "/generators", type: "generator" },
  { label: "Magic System Generator", path: "/generators", type: "generator" },
  { label: "Dark Elf Assassin Character", path: "/generators", type: "character" },
  { label: "Dragon Knight Character", path: "/generators", type: "character" },
  { label: "Character Sheet Designer", path: "/generators", type: "tool" },
];

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  const filtered = query.trim()
    ? searchItems.filter((s) => s.label.toLowerCase().includes(query.toLowerCase()))
    : [];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setFocused(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-4 pt-16">
      {/* Background glows */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.08]"
        style={{ background: "radial-gradient(circle, hsl(196 51% 33%), transparent 70%)" }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full opacity-[0.05]"
        style={{ background: "radial-gradient(circle, hsl(208 30% 74%), transparent 70%)" }}
      />

      <div className="container max-w-3xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-frost text-xs font-medium tracking-wide mb-6"
          >
            <Wand2 className="w-3.5 h-3.5" />
            AI-Powered Writing Toolkit
          </motion.span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6 tracking-tight text-foreground">
            Forge Characters, Worlds, and Stories with{" "}
            <span className="gradient-text">AI</span>.
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
            StoryForge helps fantasy writers instantly generate characters, magic systems, worlds, and plot ideas.
          </p>

          {/* Search */}
          <div ref={ref} className="relative max-w-lg mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                placeholder="Search characters, generators, or story ideas..."
                className="input-glass w-full pl-12 pr-4 py-3.5 rounded-xl text-base"
                style={{ boxShadow: "0 0 24px hsl(196 51% 33% / 0.06)" }}
              />
            </div>

            <AnimatePresence>
              {focused && filtered.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  className="absolute top-full mt-2 left-0 right-0 glass-card-static rounded-xl overflow-hidden z-20 border border-border"
                >
                  {filtered.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => { navigate(item.path); setQuery(""); setFocused(false); }}
                      className="w-full text-left px-4 py-3 text-sm text-foreground hover:bg-muted/50 transition-colors flex items-center justify-between"
                    >
                      <span>{item.label}</span>
                      <span className="text-xs text-muted-foreground capitalize px-2 py-0.5 rounded-full bg-muted/50">{item.type}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/generators" className="btn-primary-gradient px-8 py-3.5 rounded-lg text-center font-semibold inline-flex items-center justify-center gap-2">
              <Wand2 className="w-4 h-4" />
              Start Creating
            </Link>
            <Link to="/generators" className="btn-ghost-frost px-8 py-3.5 rounded-lg text-center inline-flex items-center justify-center gap-2">
              <BookOpen className="w-4 h-4" />
              Explore Generators
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
