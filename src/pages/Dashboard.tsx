import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Wand2, Clock, Star, Copy, Trash2, Download, LogIn } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

interface Generation {
  id: string;
  generator_type: string;
  result: Record<string, string>;
  created_at: string;
  is_favorite: boolean;
}

const Dashboard = () => {
  const { user, loading: authLoading, displayName } = useAuth();
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "favorites">("all");

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const fetchGenerations = async () => {
      const { data, error } = await supabase
        .from("generations")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      if (!error && data) setGenerations(data as Generation[]);
      setLoading(false);
    };
    fetchGenerations();
  }, [user]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-frost/20 border-t-frost rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="glass-card p-8 rounded-xl text-center max-w-md">
          <LogIn className="w-10 h-10 text-frost mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">Sign in to view your dashboard</h2>
          <p className="text-sm text-muted-foreground mb-6">Track your generations and history.</p>
          <Link to="/login" className="btn-primary-gradient px-6 py-3 rounded-lg text-sm font-semibold inline-block">
            Login
          </Link>
        </div>
      </div>
    );
  }

  const totalGenerations = generations.length;
  const todayCount = generations.filter(
    (g) => new Date(g.created_at).toDateString() === new Date().toDateString()
  ).length;
  const favoritesCount = generations.filter((g) => g.is_favorite).length;

  const favoriteGen = generations.length
    ? Object.entries(
        generations.reduce<Record<string, number>>((acc, g) => {
          acc[g.generator_type] = (acc[g.generator_type] || 0) + 1;
          return acc;
        }, {})
      ).sort((a, b) => b[1] - a[1])[0]?.[0] || "None"
    : "None";

  const displayedGenerations = activeTab === "favorites"
    ? generations.filter((g) => g.is_favorite)
    : generations;

  const handleCopy = (item: Generation) => {
    const text = Object.entries(item.result).map(([k, v]) => `${k}:\n${v}`).join("\n\n");
    navigator.clipboard.writeText(text);
    toast.success("Copied!");
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("generations").delete().eq("id", id);
    if (!error) {
      setGenerations((prev) => prev.filter((g) => g.id !== id));
      toast.success("Deleted");
    }
  };

  const handleToggleFavorite = async (item: Generation) => {
    const newFav = !item.is_favorite;
    const { error } = await supabase.from("generations").update({ is_favorite: newFav }).eq("id", item.id);
    if (!error) {
      setGenerations((prev) => prev.map((g) => g.id === item.id ? { ...g, is_favorite: newFav } : g));
      toast.success(newFav ? "Added to favorites!" : "Removed from favorites");
    }
  };

  const handleExport = (item: Generation) => {
    const text = Object.entries(item.result).map(([k, v]) => `${k}:\n${v}`).join("\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `storyforge-${item.generator_type}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const stats = [
    { label: "Generations Today", value: todayCount, icon: Clock },
    { label: "Total Generations", value: totalGenerations, icon: Wand2 },
    { label: "Saved Favorites", value: favoritesCount, icon: Star },
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-16 px-4">
      <div className="container max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold mb-2 text-foreground">
            Welcome back, <span className="gradient-text">{displayName || "Writer"}</span>.
          </h1>
          <p className="text-muted-foreground mb-8">Your creative dashboard</p>

          {/* Stats */}
          <div className="grid sm:grid-cols-3 gap-4 mb-10">
            {stats.map((s) => (
              <div key={s.label} className="glass-card p-5 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <s.icon className="w-4 h-4 text-frost" />
                  </div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</span>
                </div>
                <p className="text-2xl font-bold text-foreground capitalize">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-4 border-b border-border">
            {[
              { key: "all", label: `All (${totalGenerations})` },
              { key: "favorites", label: `⭐ Favorites (${favoritesCount})` },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as "all" | "favorites")}
                className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  activeTab === tab.key
                    ? "border-frost text-frost"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="glass-card p-8 rounded-xl flex justify-center">
              <div className="w-6 h-6 border-2 border-frost/20 border-t-frost rounded-full animate-spin" />
            </div>
          ) : displayedGenerations.length === 0 ? (
            <div className="glass-card p-8 rounded-xl text-center">
              <p className="text-muted-foreground">
                {activeTab === "favorites" ? "No favorites yet. Star a result to save it here!" : "No generations yet. Start creating!"}
              </p>
              {activeTab === "all" && (
                <Link to="/generators" className="btn-primary-gradient px-5 py-2 rounded-lg text-sm font-semibold inline-block mt-4">
                  Go to Generators
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {displayedGenerations.map((item, i) => {
                const firstName = Object.values(item.result)[0] || "";
                const preview = Object.values(item.result).slice(1, 2)[0] || "";
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className={`glass-card p-4 rounded-xl ${item.is_favorite ? "border-yellow-500/20" : ""}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-xs font-medium text-frost capitalize px-2 py-0.5 bg-primary/10 rounded-full">
                            {item.generator_type}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(item.created_at).toLocaleDateString()}
                          </span>
                          {item.is_favorite && (
                            <span className="text-xs text-yellow-400">⭐ Favorited</span>
                          )}
                        </div>
                        <p className="text-sm font-medium text-foreground truncate">{firstName}</p>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">{preview}</p>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <button
                          onClick={() => handleToggleFavorite(item)}
                          className={`p-1.5 rounded hover:bg-muted/50 transition-colors ${item.is_favorite ? "text-yellow-400" : "text-muted-foreground hover:text-yellow-400"}`}
                          title={item.is_favorite ? "Remove from favorites" : "Add to favorites"}
                        >
                          <Star className={`w-3.5 h-3.5 ${item.is_favorite ? "fill-current" : ""}`} />
                        </button>
                        <button onClick={() => handleCopy(item)} className="p-1.5 rounded hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors">
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleExport(item)} className="p-1.5 rounded hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors">
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded hover:bg-muted/50 text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
