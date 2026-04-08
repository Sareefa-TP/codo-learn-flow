import { useEffect, useRef, useState } from "react";
import {
  Plus,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Search,
  Paperclip,
  Send,
  ArrowLeft,
  ShieldQuestion,
  LifeBuoy,
  Download,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Types
type TicketStatus = "Open" | "In Progress" | "Resolved" | "Closed";
type TicketPriority = "Low" | "Medium" | "High" | "Urgent";
type TicketCategory =
  | "Technical Issue"
  | "Assignment Problem"
  | "Payment Issue"
  | "Live Class Issue"
  | "Certificate Issue"
  | "Other";

interface Message {
  id: string;
  sender: "Student" | "Support";
  text: string;
  timestamp: string;
  attachment_url?: string;
  attachment_name?: string;
}

interface Ticket {
  id: string;
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  date: string;
  lastUpdate: string;
  messages: Message[];
}

// Mock Data
const INITIAL_TICKETS: Ticket[] = [
  {
    id: "TIC-8421",
    subject: "Cannot access Module 4 video",
    category: "Technical Issue",
    priority: "High",
    status: "In Progress",
    date: "12 March 2026",
    lastUpdate: "2 hours ago",
    messages: [
      {
        id: "m1",
        sender: "Student",
        text: "Hi, I'm trying to watch the video for Module 4, but it says 'Video not available' for me. I've tried clearing my cache.",
        timestamp: "12 March 2026, 10:30 AM",
      },
      {
        id: "m2",
        sender: "Support",
        text: "Hello! We are looking into this. It seems to be a temporary CDN issue in your region. Please allow us an hour to resolve it.",
        timestamp: "12 March 2026, 11:15 AM",
      },
    ],
  },
  {
    id: "TIC-8390",
    subject: "Certificate not showing after completion",
    category: "Certificate Issue",
    priority: "Medium",
    status: "Open",
    date: "10 March 2026",
    lastUpdate: "1 day ago",
    messages: [
      {
        id: "m1",
        sender: "Student",
        text: "I've completed the course, but my certificate is not visible in the Certificates section.",
        timestamp: "10 March 2026, 4:10 PM",
      },
    ],
  },
  {
    id: "TIC-8356",
    subject: "Payment successful but course not unlocked",
    category: "Payment Issue",
    priority: "Urgent",
    status: "Resolved",
    date: "05 March 2026",
    lastUpdate: "5 days ago",
    messages: [
      {
        id: "m1",
        sender: "Student",
        text: "I made the payment today, but I still can't access the course content.",
        timestamp: "05 March 2026, 9:20 AM",
      },
      {
        id: "m2",
        sender: "Support",
        text: "Thanks for reporting. We verified your transaction and have unlocked the course for you. Please refresh and try again.",
        timestamp: "05 March 2026, 11:00 AM",
      },
    ],
  },
];

const categoryOptions: TicketCategory[] = [
  "Technical Issue",
  "Assignment Problem",
  "Payment Issue",
  "Live Class Issue",
  "Certificate Issue",
  "Other",
];

const priorityOptions: TicketPriority[] = ["Low", "Medium", "High", "Urgent"];

function getStatusStyles(status: TicketStatus) {
  switch (status) {
    case "Open":
      return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    case "In Progress":
      return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    case "Resolved":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    case "Closed":
      return "bg-slate-500/10 text-slate-600 border-slate-500/20";
    default:
      return "bg-muted text-muted-foreground border-border/40";
  }
}

function getStatusIcon(status: TicketStatus) {
  switch (status) {
    case "In Progress":
      return <Clock className="w-3.5 h-3.5" />;
    case "Resolved":
      return <CheckCircle2 className="w-3.5 h-3.5" />;
    case "Open":
      return <AlertCircle className="w-3.5 h-3.5" />;
    default:
      return <MessageSquare className="w-3.5 h-3.5" />;
  }
}

export function SupportTicketsContent() {
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [view, setView] = useState<"list" | "details" | "create">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyFile, setReplyFile] = useState<File | null>(null);
  const [isSending, setIsSending] = useState(false);

  const [newTicket, setNewTicket] = useState({
    subject: "",
    category: "" as TicketCategory | "",
    priority: "" as TicketPriority | "",
    description: "",
    attachment: null as File | null,
  });

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (view === "details") {
      setTimeout(scrollToBottom, 50);
    }
  }, [view, selectedTicket?.messages.length]);

  const filteredTickets = tickets.filter((t) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return t.id.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q);
  });

  const handleOpenTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setView("details");
  };

  const handleBackToList = () => {
    setSelectedTicket(null);
    setView("list");
  };

  const handleCreateTicket = () => {
    setView("create");
  };

  const handleSubmitTicket = () => {
    if (!newTicket.subject.trim() || !newTicket.category || !newTicket.priority || !newTicket.description.trim()) {
      toast.error("Please fill all required fields");
      return;
    }

    const id = `TIC-${Math.floor(1000 + Math.random() * 8999)}`;
    const created: Ticket = {
      id,
      subject: newTicket.subject.trim(),
      category: newTicket.category,
      priority: newTicket.priority,
      status: "Open",
      date: "07 Apr 2026",
      lastUpdate: "Just now",
      messages: [
        {
          id: "m1",
          sender: "Student",
          text: newTicket.description.trim(),
          timestamp: "07 Apr 2026, 10:00 AM",
          attachment_url: newTicket.attachment ? "mock://attachment" : undefined,
          attachment_name: newTicket.attachment?.name,
        },
      ],
    };

    setTickets([created, ...tickets]);
    setNewTicket({ subject: "", category: "", priority: "", description: "", attachment: null });
    toast.success("Ticket created!");
    setView("list");
  };

  const handleSendReply = () => {
    if (!selectedTicket) return;
    if (!replyText.trim() && !replyFile) return;

    setIsSending(true);
    setTimeout(() => {
      const newMessage: Message = {
        id: `m-${Date.now()}`,
        sender: "Student",
        text: replyText.trim() || "(Attachment)",
        timestamp: "Just now",
        attachment_url: replyFile ? "mock://attachment" : undefined,
        attachment_name: replyFile?.name,
      };

      const updatedTicket: Ticket = {
        ...selectedTicket,
        messages: [...selectedTicket.messages, newMessage],
        lastUpdate: "Just now",
      };

      setTickets(tickets.map((t) => (t.id === selectedTicket.id ? updatedTicket : t)));
      setSelectedTicket(updatedTicket);
      setReplyText("");
      setReplyFile(null);
      setIsSending(false);
      toast.success("Reply sent!");

      setTimeout(scrollToBottom, 100);
    }, 800);
  };

  const handleDownload = (url: string, filename: string) => {
    toast.info(`Downloading ${filename}...`);
    console.log(`Downloading from ${url}`);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto px-4 md:px-6 lg:px-8 pb-10">
      {/* Header Section */}
      <div className="mb-8 p-4 bg-primary/5 rounded-2xl border border-primary/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">
              Support Tickets
            </h1>
            <p className="text-muted-foreground text-sm font-medium">
              Need help? Raise a ticket and track its resolution.
            </p>
          </div>
          {view === "list" && (
            <Button onClick={handleCreateTicket} className="w-full sm:w-auto gap-2 shadow-md">
              <Plus className="w-4 h-4" />
              Raise New Ticket
            </Button>
          )}
        </div>
      </div>

      {/* 1️⃣ Ticket List View */}
      {view === "list" && (
        <div className="space-y-6">
          {/* Search Bar - New Full-Width Position */}
          <div className="relative mb-10 group animate-in fade-in slide-in-from-top-4 duration-700 delay-100">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-all duration-300" />
            <input
              type="text"
              placeholder="Search tickets by ID or subject..."
              className="w-full bg-card border border-border/60 rounded-[1.25rem] py-4 pl-12 pr-6 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm placeholder:text-muted-foreground/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Tickets */}
          {filteredTickets.length === 0 ? (
            <Card className="rounded-2xl border border-dashed border-border/60 bg-muted/10">
              <CardContent className="p-10 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-muted/40 flex items-center justify-center mx-auto">
                  <ShieldQuestion className="w-8 h-8 text-muted-foreground/40" />
                </div>
                <p className="font-bold text-lg text-foreground">No tickets found</p>
                <p className="text-sm text-muted-foreground">
                  Try a different search or raise a new ticket.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredTickets.map((ticket) => (
                <Card
                  key={ticket.id}
                  className="rounded-2xl border-border/60 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                  onClick={() => handleOpenTicket(ticket)}
                >
                  <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold text-muted-foreground/70 tracking-wider">
                          #{ticket.id}
                        </span>
                        <h3 className="font-bold text-foreground group-hover:text-primary transition-colors truncate">
                          {ticket.subject}
                        </h3>
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground flex-wrap">
                        <Badge variant="secondary" className="rounded-full px-2.5 py-0.5">
                          {ticket.category}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={cn("rounded-full px-2.5 py-0.5 font-bold border", getStatusStyles(ticket.status))}
                        >
                          <span className="mr-1 inline-flex">{getStatusIcon(ticket.status)}</span>
                          {ticket.status}
                        </Badge>
                        <span className="opacity-70">Updated {ticket.lastUpdate}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2️⃣ Ticket Details View */}
      {view === "details" && selectedTicket && (
        <div className="space-y-6">
          <Button
            variant="ghost"
            className="gap-2 rounded-xl w-fit"
            onClick={handleBackToList}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to tickets
          </Button>

          <Card className="rounded-2xl border-border/60 shadow-sm overflow-hidden">
            <CardHeader className="border-b border-border/50 bg-muted/20">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="min-w-0">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <LifeBuoy className="w-5 h-5 text-primary" />
                    {selectedTicket.subject}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    #{selectedTicket.id} • {selectedTicket.date}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={cn("rounded-full px-3 py-1 text-xs font-bold border", getStatusStyles(selectedTicket.status))}
                >
                  {selectedTicket.status}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {/* Messages */}
              <div className="p-6 space-y-4 max-h-[55vh] overflow-y-auto custom-scrollbar">
                {selectedTicket.messages.map((m) => (
                  <div
                    key={m.id}
                    className={cn(
                      "flex",
                      m.sender === "Student" ? "justify-end" : "justify-start",
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] rounded-2xl border px-4 py-3 shadow-sm",
                        m.sender === "Student"
                          ? "bg-primary text-primary-foreground border-primary/30"
                          : "bg-card border-border/60",
                      )}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {m.text}
                      </p>
                      {m.attachment_url && m.attachment_name && (
                        <button
                          type="button"
                          onClick={() => handleDownload(m.attachment_url!, m.attachment_name!)}
                          className={cn(
                            "mt-2 inline-flex items-center gap-2 text-xs font-semibold underline-offset-2 hover:underline",
                            m.sender === "Student" ? "text-primary-foreground/90" : "text-primary",
                          )}
                        >
                          <Download className="w-3.5 h-3.5" />
                          {m.attachment_name}
                        </button>
                      )}
                      <p
                        className={cn(
                          "text-[10px] mt-2 opacity-80",
                          m.sender === "Student" ? "text-primary-foreground/80" : "text-muted-foreground",
                        )}
                      >
                        {m.sender} • {m.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Reply box */}
              <div className="border-t border-border/50 bg-muted/10 p-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
                  <div className="flex-1">
                    <Textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write a reply..."
                      className="min-h-[44px] rounded-xl resize-none bg-background"
                    />
                    {replyFile && (
                      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                        <Paperclip className="w-3.5 h-3.5" />
                        <span className="truncate flex-1">{replyFile.name}</span>
                        <button
                          type="button"
                          className="p-1 rounded-lg hover:bg-muted transition-colors"
                          onClick={() => setReplyFile(null)}
                          aria-label="Remove attachment"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="inline-flex items-center justify-center h-11 w-11 rounded-xl border border-border/60 bg-background hover:bg-muted transition-colors cursor-pointer">
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => setReplyFile(e.target.files?.[0] ?? null)}
                      />
                      <Paperclip className="w-5 h-5 text-muted-foreground" />
                    </label>

                    <Button
                      type="button"
                      className="h-11 rounded-xl px-5 gap-2 font-bold"
                      disabled={isSending || (!replyText.trim() && !replyFile)}
                      onClick={handleSendReply}
                    >
                      {isSending ? (
                        "Sending..."
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 3️⃣ Create Ticket View */}
      {view === "create" && (
        <Card className="rounded-2xl border-border/60 shadow-sm overflow-hidden">
          <CardHeader className="border-b border-border/50 bg-muted/20">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <CardTitle className="text-lg font-bold">Raise New Ticket</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  Provide details so support can help faster.
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                className="rounded-xl"
                onClick={() => setView("list")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold">
                Subject <span className="text-red-500">*</span>
              </label>
              <Input
                value={newTicket.subject}
                onChange={(e) => setNewTicket((p) => ({ ...p, subject: e.target.value }))}
                placeholder="e.g., Cannot access Module video"
                className="rounded-xl h-11"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold">
                  Category <span className="text-red-500">*</span>
                </label>
                <Select
                  value={newTicket.category}
                  onValueChange={(v) => setNewTicket((p) => ({ ...p, category: v as TicketCategory }))}
                >
                  <SelectTrigger className="h-11 rounded-xl bg-background border border-border/50">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border/40 shadow-xl">
                    {categoryOptions.map((c) => (
                      <SelectItem key={c} value={c} className="rounded-lg">
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">
                  Priority <span className="text-red-500">*</span>
                </label>
                <Select
                  value={newTicket.priority}
                  onValueChange={(v) => setNewTicket((p) => ({ ...p, priority: v as TicketPriority }))}
                >
                  <SelectTrigger className="h-11 rounded-xl bg-background border border-border/50">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border/40 shadow-xl">
                    {priorityOptions.map((p) => (
                      <SelectItem key={p} value={p} className="rounded-lg">
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">
                Description <span className="text-red-500">*</span>
              </label>
              <Textarea
                value={newTicket.description}
                onChange={(e) => setNewTicket((p) => ({ ...p, description: e.target.value }))}
                placeholder="Describe your issue..."
                className="min-h-[140px] resize-none rounded-xl"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border/60 bg-background hover:bg-muted transition-colors cursor-pointer w-fit">
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => setNewTicket((p) => ({ ...p, attachment: e.target.files?.[0] ?? null }))}
                />
                <Paperclip className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground">
                  {newTicket.attachment ? newTicket.attachment.name : "Attach file (optional)"}
                </span>
              </label>

              <Button
                type="button"
                className="h-11 rounded-xl px-6 gap-2 font-bold"
                onClick={handleSubmitTicket}
              >
                <Send className="w-4 h-4" />
                Submit Ticket
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

