import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Scroll, Mountain, Zap, Skull, Globe, Copy, RefreshCw, Dice6 } from "lucide-react";
import { generateCharacter, generateName, generateCultivation, generatePlotTwist, generateVillain, generateWorld } from "@/lib/generators";
import { toast } from "sonner";

const generators = [
  { id: "character", label: "Character Generator", icon: Users },
  { id: "name", label: "Name Generator", icon: Scroll },
  { id: "cultivation", label: "Cultivation Generator", icon: Mountain },
  { id: "plot", label: "Plot Generator", icon: Zap },
  { id: "villain", label: "Villain Generator", icon: Skull },
  { id: "world", label: "World Generator", icon: Globe },
];

interface GeneratorInputs {
  [key: string]: { label: string; placeholder: string; key: string }[];
}

const inputFields: GeneratorInputs = {
  character: [
    { key: "role", label: "Character Role", placeholder: "e.g. Fallen Prince, Shadow Assassin" },
    { key: "personality", label: "Personality Keywords", placeholder: "e.g. ruthless, intelligent" },
    { key: "setting", label: "World Setting", placeholder: "e.g. Dark Fantasy, Sci-fi" },
  ],
  name: [
    { key: "style", label: "Name Style", placeholder: "e.g. Elven, Draconic, Nordic" },
    { key: "type", label: "Name Type", placeholder: "e.g. Character, Kingdom, Race" },
  ],
  cultivation: [
    { key: "genre", label: "Genre", placeholder: "e.g. Xianxia, Wuxia, Cultivation" },
  ],
  plot: [
    { key: "genre", label: "Story Genre", placeholder: "e.g. Fantasy, Sci-fi, Romance" },
  ],
  villain: [
    { key: "archetype", label: "Villain Archetype", placeholder: "e.g. Fallen Hero, Mad Scholar" },
  ],
  world: [
    { key: "theme", label: "World Theme", placeholder: "e.g. Dark Fantasy, Steampunk" },
  ],
};

const Generators = () => {
  const [active, setActive] = useState("character");
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [result, setResult] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleGenerate = () => {
    setLoading(true);
    setResult(null);

    setTimeout(() => {
      let output;
      switch (active) {
        case "character":
          output = generateCharacter(inputs.role, inputs.personality, inputs.setting);
          break;
        case "name":
          output = generateName(inputs.style, inputs.type);
          break;
        case "cultivation":
          output = generateCultivation(inputs.genre);
          break;
        case "plot":
          output = generatePlotTwist(inputs.genre);
          break;
        case "villain":
          output = generateVillain(inputs.archetype);
          break;
        case "world":
          output = generateWorld(inputs.theme);
          break;
        default:
          output = generateCharacter();
      }
      setResult(output.result as Record<string, string>);
      setLoading(false);

      // Save to history
      const history = JSON.parse(localStorage.getItem("sf_history") || "[]");
      history.unshift({
        generator: active,
        date: new Date().toISOString(),
        result: output.result,
      });
      localStorage.setItem("sf_history", JSON.stringify(history.slice(0, 50)));
    }, 800);
  };

  const handleCopy = () => {
    if (!result) return;
    const text = Object.entries(result).map(([k, v]) => `${k}: ${v}`).join("\n");
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const handleRandom = () => {
    setInputs({});
    handleGenerate();
  };

  const currentGen = generators.find((g) => g.id === active)!;

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="flex">
        {/* Mobile sidebar toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed top-20 left-4 z-40 glass-card p-2 rounded-lg"
        >
          <currentGen.icon className="w-5 h-5 text-frost" />
        </button>

        {/* Sidebar */}
        <aside className={`fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-void border-r border-border p-4 z-30 transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-3">Generators</h2>
          <nav className="space-y-1">
            {generators.map((g) => (
              <button
                key={g.id}
                onClick={() => { setActive(g.id); setResult(null); setInputs({}); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  active === g.id
                    ? "bg-primary/10 text-frost border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <g.icon className="w-4 h-4" />
                {g.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-background/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main */}
        <main className="flex-1 p-4 sm:p-8 lg:p-12 max-w-4xl">
          <motion.div key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <currentGen.icon className="w-5 h-5 text-frost" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">{currentGen.label}</h1>
            </div>

            {/* Inputs */}
            <div className="glass-card p-6 rounded-xl mb-6">
              <div className="space-y-4">
                {inputFields[active]?.map((field) => (
                  <div key={field.key}>
                    <label className="text-sm text-muted-foreground mb-1.5 block">{field.label}</label>
                    <input
                      type="text"
                      value={inputs[field.key] || ""}
                      onChange={(e) => setInputs({ ...inputs, [field.key]: e.target.value })}
                      placeholder={field.placeholder}
                      className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="btn-primary-gradient px-6 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  Generate
                </button>
                <button
                  onClick={handleRandom}
                  className="btn-ghost-frost px-4 py-2.5 rounded-lg text-sm flex items-center gap-2"
                >
                  <Dice6 className="w-4 h-4" />
                  Random
                </button>
              </div>
            </div>

            {/* Loading */}
            {loading && (
              <div className="glass-card p-8 rounded-xl flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-2 border-frost/20 border-t-frost rounded-full animate-spin" />
                  <p className="text-sm text-muted-foreground">Generating...</p>
                </div>
              </div>
            )}

            {/* Result */}
            {result && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6 rounded-xl frost-glow"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-frost">Generated Result</h3>
                  <div className="flex gap-2">
                    <button onClick={handleCopy} className="p-2 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground">
                      <Copy className="w-4 h-4" />
                    </button>
                    <button onClick={handleGenerate} className="p-2 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground">
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {Object.entries(result).map(([key, value]) => (
                    <div key={key} className="flex flex-col sm:flex-row sm:gap-4">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-[140px] pt-0.5">{key}</span>
                      <span className="text-sm text-foreground whitespace-pre-wrap">{value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Generators;
