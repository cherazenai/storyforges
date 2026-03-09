import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Zap } from "lucide-react";

interface LimitReachedModalProps {
  open: boolean;
  onClose: () => void;
}

const LimitReachedModal = ({ open, onClose }: LimitReachedModalProps) => {
  const navigate = useNavigate();

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-2">
            <Zap className="w-6 h-6 text-destructive" />
          </div>
          <DialogTitle className="text-center text-xl">Generation Limit Reached</DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            You have reached your plan's generation limit. Upgrade your plan to continue generating content.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-3 mt-4">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Close
          </Button>
          <Button
            className="flex-1 bg-primary hover:bg-primary/90"
            onClick={() => { onClose(); navigate("/pricing"); }}
          >
            Upgrade Plan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LimitReachedModal;
