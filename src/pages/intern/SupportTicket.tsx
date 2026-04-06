import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  LifeBuoy, 
  MessageCircle, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  Reply,
  Info,
  Calendar,
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

// --- Types ---

type TicketStatus = "Open" | "In Progress" | "Resolved";

interface Ticket {
  id: string;
  title: string;
  category: string;
  status: TicketStatus;
  createdAt: string;
}

// --- Mock Data ---

const initialTickets: Ticket[] = [
  {
    id: "TIC-101",
    title: "Unable to access the 'Backend Scalability' recording",
    category: "Technical",
    status: "In Progress",
    createdAt: "Mar 22, 2026",
  },
  {
    id: "TIC-102",
    title: "Inquiry about the upcoming hackathon registration",
    category: "Academic",
    status: "Open",
    createdAt: "Today",
  },
  {
    id: "TIC-103",
    title: "Stipend for the month of February not credited",
    category: "Admin",
    status: "Resolved",
    createdAt: "Mar 15, 2026",
  },
];

const categories = ["Technical Issue", "Doubt", "Assignment Help", "Other"];

// --- Sub-components ---

const TicketCard = ({ ticket }: { ticket: Ticket }) => {
  const getStatusStyle = (status: TicketStatus) => {
    switch (status) {
      case "Open":
        return "bg-blue-500/10 text-blue-600 border-blue-200";
      case "In Progress":
        return "bg-amber-500/10 text-amber-600 border-amber-200";
      case "Resolved":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-200";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: TicketStatus) => {
    switch (status) {
      case "In Progress":
        return <Clock className="w-3 h-3" />;
      case "Resolved":
        return <CheckCircle2 className="w-3 h-3" />;
      default:
        return <AlertCircle className="w-3 h-3" />;
    }
  };

  return (
    <Card className="border-border/50 shadow-sm rounded-xl overflow-hidden transition-all duration-200 hover:shadow-md group border-l-4 border-l-primary/10 hover:border-l-primary">
      <CardContent className="p-0">
        <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors shadow-inner">
              <MessageCircle className="w-5 h-5 text-primary/70" />
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold text-muted-foreground/60 tracking-wider">#{ticket.id}</span>
                <h3 className="font-bold text-base leading-tight text-foreground group-hover:text-primary transition-colors">
                  {ticket.title}
                </h3>
              </div>
              
              <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                <Badge variant="secondary" className="bg-muted/50 text-muted-foreground font-semibold rounded-md px-2 py-0 h-5">
                  {ticket.category}
                </Badge>
                <div className="flex items-center gap-1.5 opacity-70">
                  <Calendar className="w-3 h-3" />
                  <span>Created on {ticket.createdAt}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between md:justify-end gap-6 shrink-0">
            <Badge className={cn("px-2.5 py-0.5 rounded-full font-bold text-[10px] flex items-center gap-1.5 border", getStatusStyle(ticket.status))}>
              {getStatusIcon(ticket.status)}
              {ticket.status}
            </Badge>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-primary/10 hover:text-primary transition-colors">
                <Eye className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-primary/10 hover:text-primary transition-colors">
                <Reply className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// --- Create Ticket Modal (Pixel-Perfect Alignment with Weekly Report) ---

interface CreateTicketModalProps {
  onClose: () => void;
  onSubmit: (ticket: { title: string; category: string; description: string; files: File[] }) => void;
}

const CreateTicketModal = ({ onClose, onSubmit }: CreateTicketModalProps) => {
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
    category: "",
  });

  useEffect(() => {
    // Prevent scrolling on mount
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    // Restore scrolling on unmount
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const hasFormData = formData.title.trim() !== "" || formData.description.trim() !== "" || formData.category !== "" || files.length > 0;

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
    if (!formData.title || !formData.category || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    onSubmit({ ...formData, files });
    setIsSubmitting(false);
    toast.success("Ticket submitted successfully");
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
              <h2 className="text-xl font-bold tracking-tight text-foreground">Create Ticket</h2>
              <p className="text-sm text-muted-foreground mt-1">Fill in the details to raise your support request.</p>
            </div>
          </div>
          <button onClick={handleCloseRequest} className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-semibold text-foreground">Category <span className="text-red-500">*</span></Label>
            <Select 
              onValueChange={(value) => setFormData({...formData, category: value})}
              value={formData.category}
            >
              <SelectTrigger className="h-10 rounded-xl bg-background border border-border/50">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border/40 shadow-xl z-[10001]">
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat} className="rounded-lg">
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-semibold text-foreground">Ticket Title <span className="text-red-500">*</span></Label>
            <Input
              id="title"
              placeholder="e.g., UI Components & Auth Integration"
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="rounded-xl h-10"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold text-foreground">Description <span className="text-red-500">*</span></Label>
            <Textarea 
              id="description" 
              placeholder="Describe your issue in detail..." 
              className="min-h-[120px] resize-none rounded-xl"
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold text-foreground">Attachment (Optional file upload)</Label>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                files.length >= MAX_FILES
                  ? "bg-red-500/10 text-red-600"
                  : "bg-muted text-muted-foreground"
              }`}>
                {files.length} / {MAX_FILES} files
              </span>
            </div>

            {/* Drop Zone */}
            {files.length < MAX_FILES && (
              <div
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-border/50 hover:border-primary/50 hover:bg-muted/10 bg-muted/5"
                }`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={e => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer.files) {
                    setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
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
                      setFiles(prev => [...prev, ...Array.from(e.target.files)]);
                    }
                  }}
                />
                <div className="flex flex-col items-center gap-2 text-foreground">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    isDragging ? "bg-primary/20" : "bg-primary/10"
                  }`}>
                    <Upload className={`w-5 h-5 ${isDragging ? "text-primary scale-110" : "text-primary"} transition-transform`} />
                  </div>
                  <p className="text-sm font-medium">
                    {isDragging ? "Drop files here" : "Click to upload or drag & drop"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PDF, ZIP, Images, DOCX · Max {MAX_FILE_SIZE_MB}MB each · Up to {MAX_FILES} files
                  </p>
                </div>
              </div>
            )}

            {/* File List */}
            {files.length > 0 && (
              <ul className="space-y-2">
                {files.map((file, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/30 border border-border/40 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate leading-tight text-foreground">{file.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{formatSize(file.size)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFiles(prev => prev.filter((_, i) => i !== idx))}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100"
                      title="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-border/50 bg-muted/5 flex items-center justify-end gap-3">
          <Button 
            variant="outline" 
            onClick={handleCloseRequest}
            disabled={isSubmitting}
            className="rounded-xl px-6"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.title || !formData.category || !formData.description}
            className="rounded-xl px-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : "Submit Ticket"}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};

// --- Main Page ---

const SupportTicket = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filterTabs = [
    { label: "All", count: tickets.length },
    { label: "Open", count: tickets.filter(t => t.status === "Open").length },
    { label: "In Progress", count: tickets.filter(t => t.status === "In Progress").length },
    { label: "Resolved", count: tickets.filter(t => t.status === "Resolved").length },
  ];

  const filteredTickets = tickets.filter(ticket => 
    activeFilter === "All" || ticket.status === activeFilter
  );

  const handleTicketSubmission = (ticketData: { title: string; category: string }) => {
    const ticketToAdd: Ticket = {
      id: `TIC-${Math.floor(Math.random() * 900) + 100}`,
      title: ticketData.title,
      category: ticketData.category,
      status: "Open",
      createdAt: "Today",
    };

    setTickets([ticketToAdd, ...tickets]);
    setIsModalOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-8 max-w-6xl mx-auto px-4 md:px-6 lg:px-8 pb-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-b border-border/10 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 shadow-inner">
              <LifeBuoy className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
                Support Ticket
              </h1>
              <p className="text-muted-foreground text-sm font-medium mt-1">
                Raise and track your support requests
              </p>
            </div>
          </div>

          <Button 
            onClick={() => setIsModalOpen(true)}
            className="h-11 rounded-xl px-6 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 gap-2 font-bold transition-all hover:scale-105 active:scale-95 text-primary-foreground"
          >
            <Plus className="w-5 h-5 text-primary-foreground" />
            Create Ticket
          </Button>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <CreateTicketModal 
            onClose={() => setIsModalOpen(false)} 
            onSubmit={handleTicketSubmission}
          />
        )}

        {/* Filters Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-1.5 bg-muted/50 p-1 rounded-xl w-fit border border-border/40 flex-wrap shadow-sm">
            {filterTabs.map(tab => (
              <button
                key={tab.label}
                onClick={() => setActiveFilter(tab.label)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all relative",
                  activeFilter === tab.label
                    ? "bg-background shadow-sm text-foreground border border-border/50"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
                <span className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded-full font-black",
                  activeFilter === tab.label
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
                )}>
                  {tab.count}
                </span>
                {activeFilter === tab.label && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                )}
              </button>
            ))}
          </div>

          {/* Ticket List */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-[400px]">
            {filteredTickets.length > 0 ? (
              <div className="grid gap-4">
                {filteredTickets.map(ticket => (
                  <TicketCard key={ticket.id} ticket={ticket} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 px-4 text-center space-y-4 bg-muted/5 border border-dashed border-border/40 rounded-3xl">
                <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center">
                  <Info className="w-10 h-10 text-muted-foreground/30" />
                </div>
                <div className="max-w-xs">
                  <p className="text-muted-foreground font-bold text-lg">No tickets found</p>
                  <p className="text-sm text-muted-foreground/60 mt-1">
                    {activeFilter === "All" 
                      ? "You haven't raised any support tickets yet." 
                      : `You don't have any tickets with status "${activeFilter}".`}
                  </p>
                  {activeFilter !== "All" && (
                    <Button 
                      variant="link" 
                      className="text-primary font-bold mt-2"
                      onClick={() => setActiveFilter("All")}
                    >
                      Clear filters
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SupportTicket;
