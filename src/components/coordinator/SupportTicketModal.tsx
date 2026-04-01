import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { 
  LifeBuoy, 
  X, 
  Upload, 
  Loader2, 
  FileText 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";

interface SupportTicketModalProps {
  onClose: () => void;
  onSubmit: (ticket: { title: string; priority: string; description: string; module?: string; files: File[] }) => void;
}

const priorities = ["Low", "Medium", "High"];
const modules = ["Intern", "Task", "Attendance", "Other"];

const SupportTicketModal = ({ onClose, onSubmit }: SupportTicketModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILES = 5;
  const MAX_FILE_SIZE_MB = 10;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "",
    module: "",
  });

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const hasFormData = formData.title.trim() !== "" || formData.description.trim() !== "" || formData.priority !== "" || formData.module !== "" || files.length > 0;

  const handleCloseRequest = () => {
    if (hasFormData) {
      setShowDiscardConfirm(true);
    } else {
      onClose();
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.priority || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    onSubmit({ ...formData, files });
    setIsSubmitting(false);
    toast.success("Support ticket raised successfully");
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
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
               <LifeBuoy className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">Raise Support Ticket</h2>
              <p className="text-sm text-muted-foreground mt-1">Submit your request as a Coordinator.</p>
            </div>
          </div>
          <button onClick={handleCloseRequest} className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 col-span-full">
              <Label htmlFor="title" className="text-sm font-semibold text-foreground">Subject <span className="text-red-500">*</span></Label>
              <Input
                id="title"
                placeholder="e.g., Issue with Intern Attendance syncing"
                value={formData.title}
                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="rounded-xl h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority" className="text-sm font-semibold text-foreground">Priority <span className="text-red-500">*</span></Label>
              <Select 
                onValueChange={(value) => setFormData({...formData, priority: value})}
                value={formData.priority}
              >
                <SelectTrigger className="h-11 rounded-xl bg-background border border-border/50">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/40 shadow-xl z-[10001]">
                  {priorities.map(p => (
                    <SelectItem key={p} value={p} className="rounded-lg font-medium">
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="module" className="text-sm font-semibold text-foreground">Related Module (Optional)</Label>
              <Select 
                onValueChange={(value) => setFormData({...formData, module: value})}
                value={formData.module}
              >
                <SelectTrigger className="h-11 rounded-xl bg-background border border-border/50">
                  <SelectValue placeholder="Select module" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/40 shadow-xl z-[10001]">
                  {modules.map(m => (
                    <SelectItem key={m} value={m} className="rounded-lg font-medium">
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 col-span-full">
              <Label htmlFor="description" className="text-sm font-semibold text-foreground">Description <span className="text-red-500">*</span></Label>
              <Textarea 
                id="description" 
                placeholder="Provide details about the issue..." 
                className="min-h-[120px] resize-none rounded-xl p-4 focus-visible:ring-primary/20"
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-3 col-span-full">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold text-foreground">Attachments (Optional)</Label>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  files.length >= MAX_FILES
                    ? "bg-red-500/10 text-red-600"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {files.length} / {MAX_FILES} files
                </span>
              </div>

              {files.length < MAX_FILES && (
                <div
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
                    isDragging
                      ? "border-primary bg-primary/5"
                      : "border-border/50 hover:border-primary/50 hover:bg-muted/10 bg-muted/5 group"
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={e => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files) {
                      setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)].slice(0, MAX_FILES));
                    }
                  }}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    multiple
                    onChange={e => {
                      if (e.target.files) {
                        setFiles(prev => [...prev, ...Array.from(e.target.files)].slice(0, MAX_FILES));
                      }
                    }}
                  />
                  <div className="flex flex-col items-center gap-2 text-foreground">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isDragging ? "bg-primary/20" : "bg-primary/10 group-hover:bg-primary/20"
                    }`}>
                      <Upload className={`w-5 h-5 ${isDragging ? "text-primary scale-110" : "text-primary"} transition-transform`} />
                    </div>
                    <p className="text-sm font-bold">
                      {isDragging ? "Drop files here" : "Click to upload or drag & drop"}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-medium">
                      PDF, ZIP, Images, DOCX · Max {MAX_FILE_SIZE_MB}MB each
                    </p>
                  </div>
                </div>
              )}

              {files.length > 0 && (
                <ul className="space-y-2">
                  {files.map((file, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/30 border border-border/40 group hover:border-primary/30 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate leading-tight text-foreground">{file.name}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">{formatSize(file.size)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFiles(prev => prev.filter((_, i) => i !== idx))}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors flex-shrink-0 sm:opacity-0 sm:group-hover:opacity-100"
                        title="Remove file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-border/50 bg-muted/5 flex items-center justify-end gap-3">
          <Button 
            variant="outline" 
            onClick={handleCloseRequest}
            disabled={isSubmitting}
            className="rounded-xl px-6 h-11 font-semibold"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.title || !formData.priority || !formData.description}
            className="rounded-xl px-8 h-11 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 font-bold gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Submit Ticket
              </>
            )}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SupportTicketModal;
