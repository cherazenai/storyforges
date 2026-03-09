import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Scroll, Mountain, Zap, Skull, Globe, Copy, RefreshCw, Dice6, Star, Sparkles, FileText, FileSpreadsheet, FileDown, AlertCircle, LayoutTemplate, Lock } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useUsage } from "@/hooks/useUsage";
import { getDatasetSelections } from "@/lib/datasets";
import { exportCharacterPDF, exportCharacterExcel, exportCharacterWord } from "@/lib/characterExport";
import UsageMeter from "@/components/UsageMeter";
import LimitReachedModal from "@/components/LimitReachedModal";
import CharacterSheetModal from "@/components/CharacterSheetModal";

const generators = [
  { id: "character", label: "Character Generator", icon: Users, locked: false },
  { id: "name", label: "Name Generator", icon: Scroll, locked: false },
  { id: "cultivation", label: "Cultivation Generator", icon: Mountain, locked: false },
  { id: "plot", label: "Plot Generator", icon: Zap, locked: false },
  { id: "villain", label: "Villain Generator", icon: Skull, locked: false },
  { id: "world", label: "World Generator", icon: Globe, locked: false },
];

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
  group?: number;
}

interface GeneratorInputs {
  [key: string]: FieldConfig[];
}

const inputFields: GeneratorInputs = {
  character: [
    { key: "role", label: "Character Role", type: "select", options: characterOptions.role, group: 1 },
    { key: "genre", label: "Genre / Setting", type: "select", options: characterOptions.genre, group: 1 },
    { key: "race", label: "Race / Species", type: "select", options: characterOptions.race, group: 1 },
    { key: "personality", label: "Personality Traits", type: "text", placeholder: "e.g. ruthless, intelligent, kind, arrogant, chaotic", group: 2 },
    { key: "powerType", label: "Power Type", type: "select", options: characterOptions.powerType, group: 2 },
    { key: "powerLevel", label: "Power Level", type: "select", options: characterOptions.powerLevel, group: 2 },
    { key: "goal", label: "Goal / Ambition", type: "text", placeholder: "e.g. Avenge his fallen kingdom, ascend to immortality", group: 3 },
    { key: "worldSetting", label: "World Setting", type: "text", placeholder: "e.g. A dying empire ruled by dragon lords", group: 3 },
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
  const [showCharSheet, setShowCharSheet] = useState(false);

  const handleGenerate = async () => {
    if (isAtLimit) { setShowLimitModal(true); return; }
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
      if (data?.error) { toast.error(data.error); setLoading(false); return; }
      const generatedResult = data.result as Record<string, string>;
      setResult(generatedResult);
      if (user) {
        const { data: insertedData } = await supabase.from("generations").insert({
          user_id: user.id, generator_type: active, inputs, result: generatedResult,
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
    if (!user) { toast.error("Sign in to save favorites"); return; }
    if (!resultId) return;
    const newFavorite = !isFavorite;
    const { error } = await supabase.from("generations").update({ is_favorite: newFavorite }).eq("id", resultId);
    if (!error) {
      setIsFavorite(newFavorite);
      toast.success(newFavorite ? "Added to favorites!" : "Removed from favorites");
    }
  };

  const currentGen = generators.find((g) => g.id === active)!;
  const fields = inputFields[active] || [];

  const orderedResultEntries = () => {
    if (!result) return [];
    if (active === "character") {
      return characterResultOrder
        .filter(key => key in result)
        .map(key => [key, result[key]] as [string, string])
        .concat(Object.entries(result).filter(([key]) => !characterResultOrder.includes(key)));
    }
    return Object.entries(result);
  };

  // Group fields for character generator
  const renderInputGroups = () => {
    if (active === "character") {
      const groups = [1, 2, 3];
      return (
        <div className="space-y-6">
          {groups.map((g) => {
            const groupFields = fields.filter((f) => f.group === g);
            if (groupFields.length === 0) return null;
            return (
              <div key={g}>
                {g > 1 && <div className="border-t border-border/50 mb-6" />}
                <div className="grid sm:grid-cols-2 gap-4">
                  {groupFields.map((field) => (
                    <div key={field.key} className={field.type === "text" ? "sm:col-span-2" : ""}>
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                        {field.label}
                      </label>
                      {field.type === "select" ? (
                        <select
                          value={inputs[field.key] || ""}
                          onChange={(e) => setInputs({ ...inputs, [field.key]: e.target.value })}
                          className="input-glass w-full appearance-none cursor-pointer"
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
                          className="input-glass w-full"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    // Non-character generators
    return (
      <div className="grid sm:grid-cols-2 gap-4">
        {fields.map((field) => (
          <div key={field.key} className={field.type === "text" ? "sm:col-span-2" : ""}>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
              {field.label}
            </label>
            {field.type === "select" ? (
              <select
                value={inputs[field.key] || ""}
                onChange={(e) => setInputs({ ...inputs, [field.key]: e.target.value })}
                className="input-glass w-full appearance-none cursor-pointer"
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
                className="input-glass w-full"
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="flex">
        {/* Mobile sidebar toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed top-20 left-4 z-40 glass-card-static p-2 rounded-lg"
        >
          <currentGen.icon className="w-5 h-5 text-frost" />
        </button>

        {/* Sidebar */}
        <aside className="fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-64 border-r border-border/50 p-5 z-30 transition-transform lg:translate-x-0 bg-background lg:bg-transparent"
          style={{ transform: sidebarOpen ? "translateX(0)" : undefined, ...(sidebarOpen ? {} : { transform: undefined }) }}
          className={`fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-64 border-r border-border/50 p-5 z-30 transition-transform duration-300 lg:translate-x-0 bg-background ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-5 px-3">Generators</h2>
          <nav className="space-y-1.5">
            {generators.map((g) => (
              <button
                key={g.id}
                onClick={() => { setActive(g.id); setResult(null); setInputs({}); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-all duration-200 ${
                  active === g.id
                    ? "bg-primary/10 text-frost border border-primary/20 shadow-[0_0_12px_hsl(196_51%_33%/0.1)]"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                }`}
              >
                <g.icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 text-left">{g.label}</span>
                {g.locked && <Lock className="w-3.5 h-3.5 text-muted-foreground/50" />}
              </button>
            ))}
          </nav>

          <div className="mt-8 px-3">
            <button
              onClick={handleRandomIdea}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-3 py-3 rounded-lg text-sm font-semibold btn-primary-gradient disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              Random Idea
            </button>
            <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
              Generate a random character, world, villain, power system, or plot twist.
            </p>
          </div>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-background/60 backdrop-blur-sm z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main */}
        <main className="flex-1 flex justify-center p-4 sm:p-8 lg:p-12">
          <div className="w-full max-w-[720px]">
            <motion.div key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              {/* Header */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <currentGen.icon className="w-5 h-5 text-frost" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{currentGen.label}</h1>
                  {active === "character" && (
                    <p className="text-sm text-muted-foreground mt-0.5">Create deep characters for your web novel</p>
                  )}
                </div>
              </div>

              {/* Usage Meter */}
              <UsageMeter used={used} limit={limit} percentage={percentage} plan={plan} />

              {/* Input Card */}
              <div className="glass-card-static p-6 sm:p-8 rounded-xl mb-6 mt-6">
                {renderInputGroups()}

                <div className="flex gap-3 mt-8">
                  <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="btn-primary-gradient px-8 py-3 rounded-lg text-sm font-semibold flex items-center gap-2 disabled:opacity-50"
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
                    className="btn-ghost-frost px-5 py-3 rounded-lg text-sm flex items-center gap-2 disabled:opacity-50"
                  >
                    <Dice6 className="w-4 h-4" />
                    Random
                  </button>
                </div>
              </div>

              {/* Loading */}
              {loading && (
                <div className="glass-card-static p-10 rounded-xl flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-frost/20 border-t-frost rounded-full animate-spin" />
                    <p className="text-sm text-muted-foreground">Generating...</p>
                  </div>
                </div>
              )}

              {/* Result */}
              {result && !loading && (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card-static p-6 sm:p-8 rounded-xl border border-primary/10 frost-glow"
                  >
                    {/* Result header */}
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/50">
                      <h3 className="text-xs font-semibold text-frost uppercase tracking-widest">Generated Result</h3>
                      <div className="flex gap-1.5">
                        <button
                          onClick={handleFavorite}
                          className={`p-2 rounded-lg transition-all duration-200 ${isFavorite ? "bg-yellow-500/10 text-yellow-400" : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"}`}
                          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                        >
                          <Star className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
                        </button>
                        <button onClick={handleCopy} className="p-2 rounded-lg hover:bg-muted/50 transition-all duration-200 text-muted-foreground hover:text-foreground" title="Copy">
                          <Copy className="w-4 h-4" />
                        </button>
                        <button onClick={handleGenerate} className="p-2 rounded-lg hover:bg-muted/50 transition-all duration-200 text-muted-foreground hover:text-foreground" title="Regenerate">
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Character name + subtitle */}
                    {active === "character" && result["Name"] && (
                      <div className="mb-6">
                        <h2 className="text-2xl font-bold text-foreground mb-1">{result["Name"]}</h2>
                        <p className="text-sm text-frost">
                          {[result["Title / Alias"], result["Race"], result["Role"]].filter(Boolean).join(" • ")}
                        </p>
                      </div>
                    )}

                    {/* Fields */}
                    <div className="space-y-5">
                      {orderedResultEntries()
                        .filter(([key]) => !(active === "character" && key === "Name"))
                        .map(([key, value]) => (
                        <div key={key}>
                          <h4 className="text-xs font-semibold text-frost uppercase tracking-wider mb-1.5">{key}</h4>
                          <div className="border-b border-border/30 mb-2" />
                          <p className="text-sm text-foreground/85 whitespace-pre-wrap leading-relaxed">
                            {value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Export Buttons */}
                  {active === "character" && (
                    <>
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="flex flex-wrap gap-3 mt-4"
                      >
                        <button
                          onClick={() => {
                            try { exportCharacterPDF(result); toast.success("PDF exported!"); }
                            catch { toast.error("PDF export failed"); }
                          }}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-primary/8 border border-primary/15 text-frost hover:bg-primary/15 hover:border-primary/30 hover:shadow-[0_0_16px_hsl(196_51%_33%/0.1)] transition-all duration-200"
                        >
                          <FileText className="w-4 h-4" />
                          Export PDF
                        </button>
                        <button
                          onClick={() => {
                            try { exportCharacterExcel(result); toast.success("Excel exported!"); }
                            catch { toast.error("Excel export failed"); }
                          }}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-primary/8 border border-primary/15 text-frost hover:bg-primary/15 hover:border-primary/30 hover:shadow-[0_0_16px_hsl(196_51%_33%/0.1)] transition-all duration-200"
                        >
                          <FileSpreadsheet className="w-4 h-4" />
                          Export Excel
                        </button>
                        <button
                          onClick={async () => {
                            try { await exportCharacterWord(result); toast.success("Word document exported!"); }
                            catch { toast.error("Word export failed"); }
                          }}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-primary/8 border border-primary/15 text-frost hover:bg-primary/15 hover:border-primary/30 hover:shadow-[0_0_16px_hsl(196_51%_33%/0.1)] transition-all duration-200"
                        >
                          <FileDown className="w-4 h-4" />
                          Export Word
                        </button>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        className="mt-3"
                      >
                        <button
                          onClick={() => setShowCharSheet(true)}
                          className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold btn-primary-gradient"
                        >
                          <LayoutTemplate className="w-4 h-4" />
                          Create Character Sheet
                        </button>
                      </motion.div>
                    </>
                  )}
                </>
              )}
            </motion.div>
          </div>
        </main>
      </div>

      <LimitReachedModal open={showLimitModal} onClose={() => setShowLimitModal(false)} />
      {result && active === "character" && (
        <CharacterSheetModal open={showCharSheet} onClose={() => setShowCharSheet(false)} data={result} plan={plan} />
      )}

      {/* No Character Generated Modal */}
      <AnimatePresence>
        {showNoCharModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm"
            onClick={() => setShowNoCharModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card-static p-6 rounded-xl max-w-sm w-full mx-4 text-center border border-border"
              onClick={(e) => e.stopPropagation()}
            >
              <AlertCircle className="w-10 h-10 text-frost mx-auto mb-3" />
              <h3 className="text-lg font-bold text-foreground mb-2">No Character Generated</h3>
              <p className="text-sm text-muted-foreground mb-5">Generate a character first before exporting.</p>
              <button
                onClick={() => setShowNoCharModal(false)}
                className="btn-primary-gradient px-6 py-2.5 rounded-lg text-sm font-semibold"
              >
                OK
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Generators;
