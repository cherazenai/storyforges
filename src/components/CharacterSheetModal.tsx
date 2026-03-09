import { useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Image, Lock, ArrowRight } from "lucide-react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import CharacterSheet from "./CharacterSheet";
import type { PlanType } from "@/hooks/useUsage";

interface CharacterSheetModalProps {
  open: boolean;
  onClose: () => void;
  data: Record<string, string>;
  plan: PlanType;
}

const CharacterSheetModal = ({ open, onClose, data, plan }: CharacterSheetModalProps) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const isFree = plan === "free";

  const captureSheet = useCallback(async (): Promise<string | null> => {
    if (!sheetRef.current) return null;
    try {
      // Capture at 2x for high quality
      const dataUrl = await toPng(sheetRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#000000",
      });
      return dataUrl;
    } catch {
      toast.error("Failed to capture sheet");
      return null;
    }
  }, []);

  const handleDownloadPNG = useCallback(async () => {
    if (isFree) { setShowUpgradeModal(true); return; }
    setExporting(true);
    try {
      const dataUrl = await captureSheet();
      if (!dataUrl) return;
      const link = document.createElement("a");
      const charName = (data["Name"] || "character").replace(/[^a-zA-Z0-9\s]/g, "").trim().replace(/\s+/g, "-").toLowerCase();
      link.download = `${charName}-character-sheet.png`;
      link.href = dataUrl;
      link.click();
      toast.success("Character sheet image downloaded!");
    } finally {
      setExporting(false);
    }
  }, [isFree, captureSheet, data]);

  const handleDownloadPDF = useCallback(async () => {
    if (isFree) { setShowUpgradeModal(true); return; }
    setExporting(true);
    try {
      const dataUrl = await captureSheet();
      if (!dataUrl) return;

      const img = new window.Image();
      img.src = dataUrl;
      await new Promise((resolve) => { img.onload = resolve; });

      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Calculate scaling to fit A4
      const imgRatio = img.width / img.height;
      const pageRatio = pdfWidth / pdfHeight;
      let renderWidth = pdfWidth;
      let renderHeight = pdfWidth / imgRatio;

      if (renderHeight > pdfHeight) {
        renderHeight = pdfHeight;
        renderWidth = pdfHeight * imgRatio;
      }

      const xOffset = (pdfWidth - renderWidth) / 2;
      const yOffset = 0;

      // Black background
      pdf.setFillColor(0, 0, 0);
      pdf.rect(0, 0, pdfWidth, pdfHeight, "F");

      pdf.addImage(dataUrl, "PNG", xOffset, yOffset, renderWidth, renderHeight);

      const charName = (data["Name"] || "character").replace(/[^a-zA-Z0-9\s]/g, "").trim().replace(/\s+/g, "-").toLowerCase();
      pdf.save(`${charName}-character-sheet.pdf`);
      toast.success("Character sheet PDF downloaded!");
    } finally {
      setExporting(false);
    }
  }, [isFree, captureSheet, data]);

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center bg-background/80 backdrop-blur-md overflow-y-auto py-8 px-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-[850px] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Toolbar */}
              <div className="sticky top-0 z-10 flex items-center justify-between gap-3 mb-4 p-3 rounded-xl"
                style={{ background: "rgba(26, 26, 31, 0.9)", backdropFilter: "blur(12px)", border: "1px solid rgba(168, 193, 214, 0.1)" }}>
                <h3 className="text-sm font-semibold text-frost uppercase tracking-wider">Character Sheet Preview</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadPDF}
                    disabled={exporting}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-primary/10 border border-primary/20 text-frost hover:bg-primary/20 hover:border-primary/40 hover:shadow-[0_0_16px_hsl(var(--frost)/0.15)] transition-all duration-200 disabled:opacity-50"
                  >
                    {isFree && <Lock className="w-3 h-3" />}
                    <Download className="w-3.5 h-3.5" />
                    Sheet PDF
                  </button>
                  <button
                    onClick={handleDownloadPNG}
                    disabled={exporting}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-primary/10 border border-primary/20 text-frost hover:bg-primary/20 hover:border-primary/40 hover:shadow-[0_0_16px_hsl(var(--frost)/0.15)] transition-all duration-200 disabled:opacity-50"
                  >
                    {isFree && <Lock className="w-3 h-3" />}
                    <Image className="w-3.5 h-3.5" />
                    Sheet Image
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Sheet */}
              <div className="rounded-xl overflow-hidden shadow-2xl" style={{ border: "1px solid rgba(168, 193, 214, 0.1)" }}>
                <CharacterSheet ref={sheetRef} data={data} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upgrade Modal for Free Users */}
      <AnimatePresence>
        {showUpgradeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-background/70 backdrop-blur-sm"
            onClick={() => setShowUpgradeModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card p-8 rounded-xl max-w-sm w-full mx-4 text-center border border-primary/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-14 h-14 rounded-xl bg-primary/15 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-7 h-7 text-frost" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Upgrade to Download</h3>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Character Sheet downloads are available on the <span className="text-frost font-medium">Writer plan</span> and above.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="px-5 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                >
                  Cancel
                </button>
                <Link
                  to="/pricing"
                  onClick={() => { setShowUpgradeModal(false); onClose(); }}
                  className="btn-primary-gradient px-5 py-2.5 rounded-lg text-sm font-semibold inline-flex items-center gap-2"
                >
                  Upgrade <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CharacterSheetModal;
