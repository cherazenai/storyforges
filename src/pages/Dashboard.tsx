import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Wand2, Clock, Star, Copy, Trash2, Download } from "lucide-react";
import { toast } from "sonner";

interface HistoryItem {
  generator: string;
  date: string;
  result: Record<string, string>;
}

const Dashboard = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("sf_history") || "[]");
    setHistory(saved);
  }, []);

  const totalGenerations = history.length;
  const todayCount = history.filter(
    (h) => new Date(h.date).toDateString() === new Date().toDateString()
  ).length;

  const favoriteGen = history.length
    ? Object.entries(
        history.reduce<Record<string, number>>((acc, h) => {
          acc[h.generator] = (acc[h.generator] || 0) + 1;
          return acc;
        }, {})
      ).sort((a, b) => b[1] - a[1])[0]?.[0] || "None"
    : "None";

  const handleCopy = (item: HistoryItem) => {
    const text = Object.entries(item.result).map(([k, v]) => `${k}: ${v}`).join("\n");
    navigator.clipboard.writeText(text);
    toast.success("Copied!");
  };

  const handleDelete = (index: number) => {
    const updated = history.filter((_, i) => i !== index);
    setHistory(updated);
    localStorage.setItem("sf_history", JSON.stringify(updated));
    toast.success("Deleted");
  };

  const handleExport = (item: HistoryItem) => {
    const text = Object.entries(item.result).map(([k, v]) => `${k}: ${v}`).join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `storyforge-${item.generator}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const stats = [
    { label: "Generations Today", value: todayCount, icon: Clock },
    { label: "Total Generations", value: totalGenerations, icon: Wand2 },
    { label: "Favorite Generator", value: favoriteGen, icon: Star },
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-16 px-4">
      <div className="container max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold mb-2 text-foreground">
            Welcome back, <span className="gradient-text">Writer</span>.
          </h1>
          <p className="text-muted-foreground mb-8">Your creative dashboard</p>

          {/* Stats */}
          <div className="grid sm:grid-cols-3 gap-4 mb-12">
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

          {/* History */}
          <h2 className="text-lg font-semibold text-foreground mb-4">Generation History</h2>

          {history.length === 0 ? (
            <div className="glass-card p-8 rounded-xl text-center">
              <p className="text-muted-foreground">No generations yet. Start creating!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card p-4 rounded-xl"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-frost capitalize">{item.generator}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(item.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-foreground/80 truncate">
                        {Object.values(item.result).slice(0, 2).join(" — ")}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => handleCopy(item)} className="p-1.5 rounded hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleExport(item)} className="p-1.5 rounded hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors">
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(i)} className="p-1.5 rounded hover:bg-muted/50 text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
