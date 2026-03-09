import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Scroll, Mountain, Zap, Skull, Globe, Copy, RefreshCw, Dice6, Star, Sparkles, FileText, FileSpreadsheet, FileDown, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useUsage } from "@/hooks/useUsage";
import { getDatasetSelections } from "@/lib/datasets";
import { exportCharacterPDF, exportCharacterExcel, exportCharacterWord } from "@/lib/characterExport";
import UsageMeter from "@/components/UsageMeter";
import LimitReachedModal from "@/components/LimitReachedModal";

const generators = [
  { id: "character", label: "Character Generator", icon: Users },
  { id: "name", label: "Name Generator", icon: Scroll },
  { id: "cultivation", label: "Cultivation Generator", icon: Mountain },
  { id: "plot", label: "Plot Generator", icon: Zap },
  { id: "villain", label: "Villain Generator", icon: Skull },
  { id: "world", label: "World Generator", icon: Globe },
];

// Dropdown options for character generator
const characterOptions = {
  role: ["Protagonist", "Anti-Hero", "Villain", "Side Character", "Mentor", "Rival"],
  genre: ["Fantasy", "Sci-Fi", "Xianxia", "Wuxia", "LitRPG", "Dark Fantasy", "Modern Fantasy", "Post-Apocalyptic"],
  race: ["Human", "Elf", "Demon", "Angel", "Dragonborn", "Spirit", "Vampire", "Beastkin", "Android", "Custom"],
  powerType: ["Magic", "Cultivation", "Technology", "Divine Power", "Swordsmanship", "Bloodline Ability"],
  powerLevel: ["Beginner", "Rising Talent", "Elite Warrior", "Legendary Hero", "God-Tier Being"],
};

interface FieldConfig {
  key: string;
  label: string;
  type: "text" | "select";
  placeholder?: string;
  options?: string[];
}

interface GeneratorInputs {
  [key: string]: FieldConfig[];
}

const inputFields: GeneratorInputs = {
  character: [
    { key: "role", label: "Character Role", type: "select", options: characterOptions.role },
    { key: "genre", label: "Genre / Setting", type: "select", options: characterOptions.genre },
    { key: "race", label: "Race / Species", type: "select", options: characterOptions.race },
    { key: "personality", label: "Personality Traits", type: "text", placeholder: "e.g. ruthless, intelligent, kind, arrogant, chaotic" },
    { key: "powerType", label: "Power Type", type: "select", options: characterOptions.powerType },
    { key: "powerLevel", label: "Power Level", type: "select", options: characterOptions.powerLevel },
    { key: "goal", label: "Goal / Ambition", type: "text", placeholder: "e.g. Avenge his fallen kingdom, ascend to immortality" },
    { key: "worldSetting", label: "World Setting", type: "text", placeholder: "e.g. A dying empire ruled by dragon lords" },
  ],
  name: [
    { key: "style", label: "Name Style", type: "text", placeholder: "e.g. Elven, Draconic, Nordic" },
    { key: "type", label: "Name Type", type: "text", placeholder: "e.g. Character, Kingdom, Race" },
  ],
  cultivation: [
    { key: "genre", label: "Genre", type: "text", placeholder: "e.g. Xianxia, Wuxia, Cultivation" },
  ],
  plot: [
    { key: "genre", label: "Story Genre", type: "text", placeholder: "e.g. Fantasy, Sci-fi, Romance" },
  ],
  villain: [
    { key: "archetype", label: "Villain Archetype", type: "text", placeholder: "e.g. Fallen Hero, Mad Scholar" },
  ],
  world: [
    { key: "theme", label: "World Theme", type: "text", placeholder: "e.g. Dark Fantasy, Steampunk" },
  ],
};

// Character result has special formatting
const characterResultOrder = [
  "Name", "Title / Alias", "Race", "Role", "World Setting",
  "Personality", "Backstory", "Abilities / Powers", "Goal / Motivation",
  "Secret", "Weakness", "Character Arc Potential"
];

const Generators = () => {
  const { user } = useAuth();
  const { plan, used, limit, percentage, isAtLimit, refresh: refreshUsage } = useUsage();
  const [active, setActive] = useState("character");
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [result, setResult] = useState<Record<string, string> | null>(null);
  const [resultId, setResultId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showNoCharModal, setShowNoCharModal] = useState(false);

  const handleGenerate = async () => {
    if (isAtLimit) {
      setShowLimitModal(true);
      return;
    }
    setLoading(true);
    setResult(null);
    setResultId(null);
    setIsFavorite(false);

    try {
      const datasetSelections = getDatasetSelections(active);
      const { data, error } = await supabase.functions.invoke("generate", {
        body: { generatorType: active, inputs, datasetSelections },
      });

      if (error) throw new Error(error.message || "Generation failed");

      if (data?.error) {
        toast.error(data.error);
        setLoading(false);
        return;
      }

      const generatedResult = data.result as Record<string, string>;
      setResult(generatedResult);

      // Save to database if logged in
      if (user) {
        const { data: insertedData } = await supabase.from("generations").insert({
          user_id: user.id,
          generator_type: active,
          inputs,
          result: generatedResult,
        }).select("id").single();
        if (insertedData) setResultId(insertedData.id);
        refreshUsage();
      }
    } catch (err) {
      console.error("Generation error:", err);
      toast.error("Failed to generate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    const text = Object.entries(result).map(([k, v]) => `${k}:\n${v}`).join("\n\n");
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const handleRandom = async () => {
    setInputs({});
    await handleGenerate();
  };

  const handleRandomIdea = async () => {
    // Pick a random generator type and generate with empty inputs (datasets will provide variety)
    const randomTypes = ["character", "world", "villain", "cultivation", "plot"];
    const randomType = randomTypes[Math.floor(Math.random() * randomTypes.length)];
    setActive(randomType);
    setInputs({});
    setResult(null);
    setResultId(null);
    setIsFavorite(false);
    if (isAtLimit) { setShowLimitModal(true); return; }
    setLoading(true);
    try {
      const datasetSelections = getDatasetSelections(randomType);
      const { data, error } = await supabase.functions.invoke("generate", {
        body: { generatorType: randomType, inputs: {}, datasetSelections },
      });
      if (error) throw new Error(error.message || "Generation failed");
      if (data?.error) { toast.error(data.error); setLoading(false); return; }
      const generatedResult = data.result as Record<string, string>;
      setResult(generatedResult);
      if (user) {
        const { data: insertedData } = await supabase.from("generations").insert({
          user_id: user.id, generator_type: randomType, inputs: {}, result: generatedResult,
        }).select("id").single();
        if (insertedData) setResultId(insertedData.id);
        refreshUsage();
      }
    } catch (err) {
      console.error("Random idea error:", err);
      toast.error("Failed to generate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async () => {
    if (!user) {
      toast.error("Sign in to save favorites");
      return;
    }
    if (!resultId) return;

    const newFavorite = !isFavorite;
    const { error } = await supabase
      .from("generations")
      .update({ is_favorite: newFavorite })
      .eq("id", resultId);

    if (!error) {
      setIsFavorite(newFavorite);
      toast.success(newFavorite ? "Added to favorites!" : "Removed from favorites");
    }
  };

  const currentGen = generators.find((g) => g.id === active)!;
  const fields = inputFields[active] || [];

  // Order result keys for character generator
  const orderedResultEntries = () => {
    if (!result) return [];
    if (active === "character") {
      return characterResultOrder
        .filter(key => key in result)
        .map(key => [key, result[key]] as [string, string])
        .concat(
          Object.entries(result).filter(([key]) => !characterResultOrder.includes(key))
        );
    }
    return Object.entries(result);
  };

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
          <div className="mt-6 px-3">
            <button
              onClick={handleRandomIdea}
              disabled={loading}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold btn-primary-gradient disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              Random Idea
            </button>
            <p className="text-xs text-muted-foreground mt-2 px-1">Generate a random character, world, villain, power system, and plot twist using our datasets.</p>
          </div>
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
              <div>
                <h1 className="text-2xl font-bold text-foreground">{currentGen.label}</h1>
                {active === "character" && (
                  <p className="text-sm text-muted-foreground">Create deep characters for your web novel</p>
                )}
              </div>
            </div>

            {/* Usage Meter */}
            <UsageMeter used={used} limit={limit} percentage={percentage} plan={plan} />

            {/* Inputs */}
            <div className="glass-card p-6 rounded-xl mb-6 mt-6">
              <div className="grid sm:grid-cols-2 gap-4">
                {fields.map((field) => (
                  <div key={field.key} className={field.type === "text" && active === "character" ? "sm:col-span-2" : ""}>
                    <label className="text-sm text-muted-foreground mb-1.5 block">{field.label}</label>
                    {field.type === "select" ? (
                      <select
                        value={inputs[field.key] || ""}
                        onChange={(e) => setInputs({ ...inputs, [field.key]: e.target.value })}
                        className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors appearance-none cursor-pointer"
                      >
                        <option value="">Select...</option>
                        {field.options?.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={inputs[field.key] || ""}
                        onChange={(e) => setInputs({ ...inputs, [field.key]: e.target.value })}
                        placeholder={field.placeholder}
                        className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                      />
                    )}
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
                  disabled={loading}
                  className="btn-ghost-frost px-4 py-2.5 rounded-lg text-sm flex items-center gap-2 disabled:opacity-50"
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
                  <p className="text-sm text-muted-foreground">Generating epic character...</p>
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
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-semibold text-frost uppercase tracking-wider">Generated Character</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={handleFavorite}
                      className={`p-2 rounded-lg transition-colors ${isFavorite ? "bg-yellow-500/20 text-yellow-400" : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"}`}
                      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                      <Star className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
                    </button>
                    <button onClick={handleCopy} className="p-2 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground" title="Copy">
                      <Copy className="w-4 h-4" />
                    </button>
                    <button onClick={handleGenerate} className="p-2 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground" title="Regenerate">
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-5">
                  {orderedResultEntries().map(([key, value]) => (
                    <div key={key} className="group">
                      <span className="text-xs font-semibold text-frost uppercase tracking-wider block mb-1">{key}</span>
                      <div className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed pl-3 border-l-2 border-primary/20">
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </main>
      </div>
      <LimitReachedModal open={showLimitModal} onClose={() => setShowLimitModal(false)} />
    </div>
  );
};

export default Generators;
