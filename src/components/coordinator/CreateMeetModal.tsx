import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  X, 
  Video, 
  Calendar, 
  Clock, 
  Link as LinkIcon, 
  Loader2 
} from "lucide-react";
import { toast } from "sonner";

interface CreateMeetModalProps {
  onClose: () => void;
  onSubmit: (meeting: { title: string; date: string; time: string; link: string; description?: string }) => void;
}

const CreateMeetModal = ({ onClose, onSubmit }: CreateMeetModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    link: "",
    description: "",
  });

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const hasFormData = formData.title.trim() !== "" || formData.date !== "" || formData.time !== "" || formData.link.trim() !== "" || formData.description.trim() !== "";

  const handleCloseRequest = () => {
    if (hasFormData) {
      setShowDiscardConfirm(true);
    } else {
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.time || !formData.link) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Basic URL validation
    if (!formData.link.startsWith("http")) {
      toast.error("Please enter a valid meeting link (starting with http)");
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    onSubmit(formData);
    setIsSubmitting(false);
    toast.success("Meeting scheduled successfully");
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-hidden">
      <div
        className="bg-background border border-border/50 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Discard Confirmation Dialog */}
        {showDiscardConfirm && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 rounded-2xl">
            <div className="bg-background border border-border/60 rounded-2xl shadow-xl p-6 mx-6 max-w-sm w-full">
              <h3 className="text-base font-bold mb-1 text-foreground">Discard changes?</h3>
              <p className="text-sm text-muted-foreground mb-6">You have unsaved input. If you leave, your progress will be lost.</p>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowDiscardConfirm(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold border border-border/50 hover:bg-muted transition-colors text-foreground"
                >
                  Stay
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                >
                  Discard
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/50 bg-muted/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
               <Video className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">Schedule Meet</h2>
              <p className="text-sm text-muted-foreground mt-1">Fill in the details to schedule a new meeting.</p>
            </div>
          </div>
          <button onClick={handleCloseRequest} className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 col-span-full">
              <Label htmlFor="title" className="text-sm font-semibold text-foreground">Meeting Title <span className="text-red-500">*</span></Label>
              <Input
                id="title"
                placeholder="e.g., Weekly Sync - Batch A"
                value={formData.title}
                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="rounded-xl h-11 border-border/50 bg-muted/10 focus-visible:ring-primary/20"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-semibold text-foreground">Date <span className="text-red-500">*</span></Label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="rounded-xl h-11 pl-10 border-border/50 bg-muted/10 focus-visible:ring-primary/20 text-sm font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time" className="text-sm font-semibold text-foreground">Time <span className="text-red-500">*</span></Label>
              <div className="relative">
                <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={e => setFormData(prev => ({ ...prev, time: e.target.value }))}
                  className="rounded-xl h-11 pl-10 border-border/50 bg-muted/10 focus-visible:ring-primary/20 text-sm font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-2 col-span-full">
              <Label htmlFor="link" className="text-sm font-semibold text-foreground">Google Meet Link <span className="text-red-500">*</span></Label>
              <div className="relative">
                <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="link"
                  placeholder="https://meet.google.com/xxx-xxxx-xxx"
                  value={formData.link}
                  onChange={e => setFormData(prev => ({ ...prev, link: e.target.value }))}
                  className="rounded-xl h-11 pl-10 border-border/50 bg-muted/10 focus-visible:ring-primary/20"
                  required
                />
              </div>
            </div>

            <div className="space-y-2 col-span-full">
              <Label htmlFor="description" className="text-sm font-semibold text-foreground">Description (Optional)</Label>
              <Textarea 
                id="description" 
                placeholder="Briefly describe the purpose of the meeting..." 
                className="min-h-[120px] resize-none rounded-xl p-4 border-border/50 bg-muted/10 focus-visible:ring-primary/20"
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-border/50 bg-muted/5 flex items-center justify-end gap-3">
          <Button 
            variant="outline" 
            onClick={handleCloseRequest}
            disabled={isSubmitting}
            className="rounded-xl px-6 h-11 font-semibold border-border/50 hover:bg-muted"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.title || !formData.date || !formData.time || !formData.link}
            className="rounded-xl px-8 h-11 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 font-bold gap-2 animate-in fade-in slide-in-from-right-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Scheduling...
              </>
            ) : (
              <>
                Schedule Meeting
              </>
            )}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CreateMeetModal;
