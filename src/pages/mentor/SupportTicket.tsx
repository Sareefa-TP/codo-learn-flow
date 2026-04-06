import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect, useRef } from "react";
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
    X
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
type TicketCategory = "Technical Issue" | "Interns" | "Tasks" | "Materials" | "Other";

interface Message {
    id: string;
    sender: "Mentor" | "Support";
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
        id: "MTR-9210",
        subject: "Intern Assessment Tool Bug",
        category: "Technical Issue",
        priority: "Medium",
        status: "Open",
        date: "28 March 2026",
        lastUpdate: "3 hours ago",
        messages: [
            {
                id: "m1",
                sender: "Mentor",
                text: "I am unable to submit the weekly report review for one of my interns. The 'Submit' button is greyed out.",
                timestamp: "28 March 2026, 02:30 PM"
            }
        ]
    }
];

const MentorSupportTicket = () => {
    const [view, setView] = useState<"list" | "create" | "details">("list");
    const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Form State
    const [newTicket, setNewTicket] = useState({
        subject: "",
        category: "" as TicketCategory,
        priority: "" as TicketPriority,
        message: ""
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [replyText, setReplyText] = useState("");
    const [replyFile, setReplyFile] = useState<File | null>(null);
    const [isSending, setIsSending] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const replyFileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom helper
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Auto-scroll when messages change or entering details view
    useEffect(() => {
        if (view === "details" && selectedTicket) {
            setTimeout(scrollToBottom, 100);
        }
    }, [view, selectedTicket?.messages]);

    const ALLOWED_TYPES = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/zip',
        'application/x-zip-compressed'
    ];
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB

    const filteredTickets = tickets.filter(t =>
        t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusColor = (status: TicketStatus) => {
        switch (status) {
            case "Open": return "bg-blue-500/10 text-blue-600 border-blue-200";
            case "In Progress": return "bg-amber-500/10 text-amber-600 border-amber-200";
            case "Resolved": return "bg-green-500/10 text-green-600 border-green-200";
            case "Closed": return "bg-gray-500/10 text-gray-600 border-gray-200";
            default: return "";
        }
    };

    const getPriorityColor = (priority: TicketPriority) => {
        switch (priority) {
            case "Urgent": return "text-destructive font-black";
            case "High": return "text-orange-600 font-bold";
            case "Medium": return "text-amber-600 font-medium";
            case "Low": return "text-blue-600 font-normal";
            default: return "";
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isReply: boolean = false) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation
        if (!ALLOWED_TYPES.includes(file.type) && !file.name.match(/\.(pdf|jpg|jpeg|png|doc|docx|zip)$/i)) {
            toast.error("Invalid file type. Please upload PDF, JPG, PNG, DOC, DOCX, or ZIP.");
            return;
        }

        if (file.size > MAX_SIZE) {
            toast.error("File is too large. Maximum size is 10MB.");
            return;
        }

        if (isReply) {
            setReplyFile(file);
        } else {
            setSelectedFile(file);
        }
    };

    const handleCreateTicket = (e: React.FormEvent) => {
        e.preventDefault();
        const ticket: Ticket = {
            id: `MTR-${Math.floor(1000 + Math.random() * 9000)}`,
            subject: newTicket.subject,
            category: newTicket.category,
            priority: newTicket.priority,
            status: "Open",
            date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
            lastUpdate: "Just now",
            messages: [{
                id: "m1",
                sender: "Mentor",
                text: newTicket.message,
                timestamp: new Date().toLocaleString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
                attachment_url: selectedFile ? `/uploads/tickets/${selectedFile.name}` : undefined,
                attachment_name: selectedFile ? selectedFile.name : undefined
            }]
        };
        setTickets([ticket, ...tickets]);
        setView("list");
        setNewTicket({ subject: "", category: "" as TicketCategory, priority: "" as TicketPriority, message: "" });
        setSelectedFile(null);
        toast.success("Ticket raised successfully!");
    };

    const handleSendReply = () => {
        if ((!replyText.trim() && !replyFile) || !selectedTicket) {
            toast.error("Please enter a message or attach a file.");
            return;
        }

        setIsSending(true);

        // Simulate sending delay
        setTimeout(() => {
            const newMessage: Message = {
                id: Date.now().toString(),
                sender: "Mentor",
                text: replyText,
                timestamp: new Date().toLocaleString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
                attachment_url: replyFile ? `/uploads/tickets/${replyFile.name}` : undefined,
                attachment_name: replyFile ? replyFile.name : undefined
            };

            const updatedTicket = {
                ...selectedTicket,
                messages: [...selectedTicket.messages, newMessage],
                lastUpdate: "Just now"
            };

            setTickets(tickets.map(t => t.id === selectedTicket.id ? updatedTicket : t));
            setSelectedTicket(updatedTicket);
            setReplyText("");
            setReplyFile(null);
            setIsSending(false);
            toast.success("Reply sent!");
            
            // Scroll to bottom after state update
            setTimeout(scrollToBottom, 100);
        }, 800);
    };

    const handleDownload = (url: string, filename: string) => {
        toast.info(`Downloading ${filename}...`);
        console.log(`Downloading from ${url}`);
    };

    return (
        <DashboardLayout>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto px-4 md:px-6 lg:px-8 pb-10">
                {/* Header Section */}
                <div className="mb-8 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <h1 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">
                                Mentor Support Tickets
                            </h1>
                            <p className="text-muted-foreground text-sm font-medium">
                                Raise a ticket for any issues regarding intern management, tasks, or system tools.
                            </p>
                        </div>
                        {view === "list" && (
                            <Button onClick={() => setView("create")} className="w-full sm:w-auto gap-2 shadow-md">
                                <Plus className="w-4 h-4" />
                                Raise New Ticket
                            </Button>
                        )}
                    </div>
                </div>

                {/* 1️⃣ Ticket List View */}
                {view === "list" && (
                    <div className="space-y-6">
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

                        <div className="grid gap-4">
                            {filteredTickets.length > 0 ? (
                                filteredTickets.map(ticket => (
                                    <Card key={ticket.id} className="group hover:border-primary/30 transition-all cursor-pointer shadow-sm overflow-hidden" onClick={() => {
                                        setSelectedTicket(ticket);
                                        setView("details");
                                    }}>
                                        <CardContent className="p-0">
                                            <div className="flex flex-col sm:flex-row sm:items-center p-5 gap-4">
                                                <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                                                    <MessageSquare className="w-6 h-6 text-primary" />
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-xs font-mono font-medium text-muted-foreground">{ticket.id}</span>
                                                        <Badge variant="outline" className={cn("text-[10px] uppercase font-bold px-1.5 h-4", getStatusColor(ticket.status))}>
                                                            {ticket.status}
                                                        </Badge>
                                                    </div>
                                                    <h3 className="font-semibold text-lg leading-tight truncate pr-4">{ticket.subject}</h3>
                                                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <ShieldQuestion className="w-3.5 h-3.5" />
                                                            {ticket.category}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-3.5 h-3.5" />
                                                            Updated {ticket.lastUpdate}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-t-0 pt-4 sm:pt-0">
                                                    <div className="text-right sm:block hidden">
                                                        <p className="text-[10px] uppercase font-bold text-muted-foreground mb-0.5">Priority</p>
                                                        <p className={cn("text-xs font-bold", getPriorityColor(ticket.priority))}>{ticket.priority}</p>
                                                    </div>
                                                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-1" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <div className="text-center py-20 bg-muted/20 rounded-2xl border border-dashed flex flex-col items-center">
                                    <LifeBuoy className="w-12 h-12 text-muted-foreground/30 mb-4" />
                                    <p className="text-muted-foreground">
                                        {searchQuery ? `No tickets found matching "${searchQuery}"` : "You haven't raised any tickets yet."}
                                    </p>
                                    {searchQuery && (
                                        <Button variant="link" onClick={() => setSearchQuery("")} className="mt-2 text-primary">
                                            Clear Search
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* 2️⃣ Create Ticket Form */}
                {view === "create" && (
                    <Card className="animate-in slide-in-from-bottom-4 duration-300">
                        <CardHeader className="border-b">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-xl">Raise a New Support Ticket</CardTitle>
                                <Button variant="ghost" size="sm" onClick={() => setView("list")}>
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Cancel
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8">
                            <form onSubmit={handleCreateTicket} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2 col-span-full">
                                        <label className="text-sm font-semibold">Subject</label>
                                        <Input
                                            required
                                            placeholder="Briefly describe your issue..."
                                            value={newTicket.subject}
                                            onChange={e => setNewTicket({ ...newTicket, subject: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold">Related Module (Optional)</label>
                                        <Select required onValueChange={v => setNewTicket({ ...newTicket, category: v as TicketCategory })}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select one" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Technical Issue">Technical Issue</SelectItem>
                                                <SelectItem value="Interns">Interns</SelectItem>
                                                <SelectItem value="Tasks">Tasks</SelectItem>
                                                <SelectItem value="Materials">Materials</SelectItem>
                                                <SelectItem value="Other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold">Priority</label>
                                        <Select required onValueChange={v => setNewTicket({ ...newTicket, priority: v as TicketPriority })}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select priority" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Low">Low</SelectItem>
                                                <SelectItem value="Medium">Medium</SelectItem>
                                                <SelectItem value="High">High</SelectItem>
                                                <SelectItem value="Urgent">Urgent</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2 col-span-full">
                                        <label className="text-sm font-semibold">Description</label>
                                        <Textarea
                                            required
                                            placeholder="Explain your issue in detail..."
                                            className="min-h-[150px] resize-none"
                                            value={newTicket.message}
                                            onChange={e => setNewTicket({ ...newTicket, message: e.target.value })}
                                        />
                                    </div>

                                    <div className="col-span-full pt-4 border-t">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div className="space-y-2">
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    className="hidden"
                                                    onChange={(e) => handleFileChange(e)}
                                                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.zip"
                                                />
                                                <div className="flex items-center gap-3">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => fileInputRef.current?.click()}
                                                        className={cn("gap-2", selectedFile && "border-primary text-primary bg-primary/5")}
                                                    >
                                                        <Paperclip className="w-4 h-4" />
                                                        {selectedFile ? "Change Attachment" : "Attach File"}
                                                    </Button>
                                                    {selectedFile && (
                                                        <div className="flex items-center gap-2 bg-muted px-2 py-1 rounded-md text-xs">
                                                            <span className="truncate max-w-[150px]">{selectedFile.name}</span>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-4 w-4 text-muted-foreground hover:text-destructive"
                                                                onClick={() => setSelectedFile(null)}
                                                            >
                                                                 <X className="w-3 h-3" />
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-[10px] text-muted-foreground">
                                                    Max 10MB. Supported: PDF, JPG, PNG, DOC, DOCX, ZIP
                                                </p>
                                            </div>
                                            <Button type="submit" className="w-full sm:w-auto gap-2 font-bold tracking-tight">
                                                Submit Ticket
                                                <Send className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* 3️⃣ Ticket Details View */}
                {view === "details" && selectedTicket && (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                        <div className="flex items-center gap-3">
                            <Button variant="outline" size="sm" onClick={() => setView("list")}>
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Tickets
                            </Button>
                            <div className="h-4 w-px bg-border mx-2" />
                            <span className="text-sm font-mono text-muted-foreground">{selectedTicket.id}</span>
                        </div>

                        <Card className="border-primary/20 bg-card overflow-hidden">
                            <CardHeader className="bg-primary/5 border-b p-6">
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <CardTitle className="text-2xl font-bold">{selectedTicket.subject}</CardTitle>
                                            <Badge variant="outline" className={cn(getStatusColor(selectedTicket.status))}>
                                                {selectedTicket.status}
                                            </Badge>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mt-2">
                                            <span className="flex items-center gap-1.5 font-bold">
                                                <ShieldQuestion className="w-4 h-4" />
                                                Role: Mentor
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <ShieldQuestion className="w-4 h-4" />
                                                Category: {selectedTicket.category}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <AlertCircle className={cn("w-4 h-4", getPriorityColor(selectedTicket.priority))} />
                                                Priority: {selectedTicket.priority}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Clock className="w-4 h-4" />
                                                Raised on {selectedTicket.date}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="p-0">
                                <div className="max-h-[500px] overflow-y-auto p-6 space-y-6 bg-muted/5">
                                    {selectedTicket.messages.map((msg, idx) => (
                                        <div key={msg.id} className={cn(
                                            "flex flex-col max-w-[85%] sm:max-w-[70%]",
                                            msg.sender === "Mentor" ? "ml-auto items-end" : "mr-auto items-start"
                                        )}>
                                            <div className={cn(
                                                "rounded-2xl p-4 shadow-sm text-sm leading-relaxed",
                                                msg.sender === "Mentor"
                                                    ? "bg-primary text-primary-foreground rounded-tr-none"
                                                    : "bg-card border border-border rounded-tl-none text-foreground"
                                            )}>
                                                {msg.text}
                                                {msg.attachment_url && (
                                                    <div className={cn(
                                                        "mt-3 p-3 rounded-lg border flex items-center gap-3 bg-muted/50 border-border/50 transition-all hover:bg-muted",
                                                        msg.sender === "Mentor" ? "bg-white/10 border-white/20 hover:bg-white/20" : "bg-card hover:border-primary/30"
                                                    )}>
                                                        <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center shrink-0">
                                                            <Paperclip className="w-4 h-4 text-primary" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs font-medium truncate mb-0.5">
                                                                {msg.attachment_name || "attachment"}
                                                            </p>
                                                            <p className="text-[10px] opacity-70">
                                                                File Attachment
                                                            </p>
                                                        </div>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="h-8 w-8 hover:bg-primary/20"
                                                            onClick={() => handleDownload(msg.attachment_url!, msg.attachment_name || "file")}
                                                        >
                                                            <Download className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-[10px] text-muted-foreground mt-1 px-1 font-medium">
                                                {msg.sender === "Support" ? "Support Executive" : "You (Mentor)"} • {msg.timestamp}
                                            </span>
                                        </div>
                                    ))}

                                    {selectedTicket.status === "Resolved" && (
                                        <div className="flex items-center justify-center p-4">
                                            <div className="bg-green-500/10 text-green-600 border border-green-200 rounded-full px-6 py-2 flex items-center gap-2 text-sm font-bold uppercase tracking-tight">
                                                <CheckCircle2 className="w-4 h-4" />
                                                Ticket Resolved Successfully
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {selectedTicket.status !== "Closed" && (
                                    <div className="p-6 border-t bg-card">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <MessageSquare className="w-4 h-4 text-primary" />
                                                <h4 className="text-sm font-bold tracking-tight">Reply to Support Team</h4>
                                            </div>
                                            <div className="relative">
                                                <Textarea
                                                    placeholder="Type your reply..."
                                                    className="min-h-[100px] pb-12 resize-none focus:ring-primary/20 font-medium"
                                                    value={replyText}
                                                    onChange={e => setReplyText(e.target.value)}
                                                />
                                                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                                                    <input
                                                        type="file"
                                                        ref={replyFileInputRef}
                                                        className="hidden"
                                                        onChange={(e) => handleFileChange(e, true)}
                                                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.zip"
                                                    />
                                                    <div className="flex items-center gap-2">
                                                        {replyFile && (
                                                            <div className="flex items-center gap-2 bg-muted px-2 py-1 rounded-md text-[10px] animate-in fade-in slide-in-from-right-2 border font-medium">
                                                                <span className="max-w-[100px] truncate">{replyFile.name}</span>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-3 w-3 hover:text-destructive"
                                                                    onClick={() => setReplyFile(null)}
                                                                >
                                                                    <X className="w-2 h-2" />
                                                                </Button>
                                                            </div>
                                                        )}
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className={cn("h-9 w-9 shadow-sm", replyFile && "border-primary text-primary bg-primary/5")}
                                                            onClick={() => replyFileInputRef.current?.click()}
                                                        >
                                                            <Paperclip className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                    <Button 
                                                        onClick={handleSendReply} 
                                                        size="sm" 
                                                        className="h-9 gap-2 min-w-[120px] font-bold tracking-tight" 
                                                        disabled={isSending || (!replyText.trim() && !replyFile)}
                                                    >
                                                        {isSending ? (
                                                            <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                                        ) : (
                                                            <>
                                                                Send Reply
                                                                <Send className="w-4 h-4" />
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default MentorSupportTicket;
