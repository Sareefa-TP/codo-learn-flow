import { useState } from "react";
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
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";
import SupportTicketModal from "@/components/coordinator/SupportTicketModal";

// --- Types ---

type TicketStatus = "Open" | "In Progress" | "Resolved";

interface Ticket {
  id: string;
  title: string;
  category: string;
  status: TicketStatus;
  priority: string;
  createdAt: string;
}

// --- Mock Data ---

const initialTickets: Ticket[] = [
  {
    id: "TIC-501",
    title: "Intern Attendance not reflecting correctly for Batch A",
    category: "Attendance",
    status: "In Progress",
    priority: "High",
    createdAt: "Today",
  },
  {
    id: "TIC-482",
    title: "Request for new Task module access",
    category: "Task",
    status: "Resolved",
    priority: "Medium",
    createdAt: "Mar 28, 2026",
  },
  {
    id: "TIC-450",
    title: "General inquiry about internship certificates",
    category: "Other",
    status: "Open",
    priority: "Low",
    createdAt: "Mar 25, 2026",
  },
];

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

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "High": return "text-rose-600 bg-rose-50 border-rose-100";
      case "Medium": return "text-amber-600 bg-amber-50 border-amber-100";
      default: return "text-blue-600 bg-blue-50 border-blue-100";
    }
  };

  return (
    <Card className="border-border/50 shadow-sm rounded-xl overflow-hidden transition-all duration-200 hover:shadow-md group border-l-4 border-l-primary/10 hover:border-l-primary scale-100 hover:scale-[1.005]">
      <CardContent className="p-0">
        <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-primary/5 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors shadow-inner">
              <MessageCircle className="w-5 h-5 text-primary/70" />
            </div>
            
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold text-muted-foreground/60 tracking-wider font-mono">#{ticket.id}</span>
                <h3 className="font-bold text-base leading-tight text-foreground group-hover:text-primary transition-colors">
                  {ticket.title}
                </h3>
              </div>
              
              <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                <Badge variant="secondary" className="bg-muted/50 text-muted-foreground font-bold rounded-lg px-2 py-0 h-5 text-[10px] uppercase">
                  {ticket.category}
                </Badge>
                <Badge variant="outline" className={cn("font-bold rounded-lg px-2 py-0 h-5 text-[10px] uppercase border", getPriorityStyle(ticket.priority))}>
                  {ticket.priority} Priority
                </Badge>
                <div className="flex items-center gap-1.5 opacity-70 font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Created {ticket.createdAt}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between md:justify-end gap-6 shrink-0 border-t md:border-0 pt-4 md:pt-0">
            <Badge className={cn("px-3 py-1 rounded-full font-bold text-[10px] flex items-center gap-1.5 border uppercase tracking-wider", getStatusStyle(ticket.status))}>
              {getStatusIcon(ticket.status)}
              {ticket.status}
            </Badge>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-xl hover:bg-primary/10 hover:text-primary transition-all">
                <Eye className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-xl hover:bg-primary/10 hover:text-primary transition-all">
                <Reply className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// --- Main Page ---

const CoordinatorSupportTicket = () => {
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

  const handleTicketSubmission = (ticketData: { title: string; priority: string; module?: string }) => {
    const ticketToAdd: Ticket = {
      id: `TIC-${Math.floor(Math.random() * 900) + 100}`,
      title: ticketData.title,
      category: ticketData.module || "General",
      status: "Open",
      priority: ticketData.priority,
      createdAt: "Just now",
    };

    setTickets([ticketToAdd, ...tickets]);
    setIsModalOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-8 max-w-6xl mx-auto px-4 md:px-6 lg:px-8 pb-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-b border-border/10 pb-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0 shadow-inner border border-primary/10">
              <LifeBuoy className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-4xl font-bold tracking-tight text-foreground">
                Support Tickets
              </h1>
              <p className="text-muted-foreground text-sm font-medium mt-1">
                Raised tickets as a Coordinator and monitor responses.
              </p>
            </div>
          </div>

          <Button 
            onClick={() => setIsModalOpen(true)}
            className="h-12 rounded-xl px-8 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 gap-2.5 font-bold transition-all hover:scale-[1.02] active:scale-[0.98] text-primary-foreground"
          >
            <Plus className="w-5.5 h-5.5 text-primary-foreground" />
            Raise New Ticket
          </Button>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <SupportTicketModal 
            onClose={() => setIsModalOpen(false)} 
            onSubmit={handleTicketSubmission}
          />
        )}

        {/* Filters Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 bg-muted/30 p-1.5 rounded-2xl w-fit border border-border/40 flex-wrap shadow-sm">
            {filterTabs.map(tab => (
              <button
                key={tab.label}
                onClick={() => setActiveFilter(tab.label)}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all relative",
                  activeFilter === tab.label
                    ? "bg-background shadow-md text-foreground border border-border/50 ring-1 ring-black/5"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {tab.label}
                <span className={cn(
                  "text-[10px] px-2 py-0.5 rounded-full font-black min-w-[20px]",
                  activeFilter === tab.label
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
                )}>
                  {tab.count}
                </span>
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
              <div className="flex flex-col items-center justify-center py-20 px-4 text-center space-y-5 bg-muted/5 border border-dashed border-border/60 rounded-[2rem]">
                <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center">
                  <Info className="w-10 h-10 text-muted-foreground/30" />
                </div>
                <div className="max-w-xs">
                  <p className="text-muted-foreground font-black text-xl">No tickets found</p>
                  <p className="text-sm text-muted-foreground/60 mt-1 font-medium">
                    {activeFilter === "All" 
                      ? "You haven't raised any support tickets yet." 
                      : `You don't have any tickets with status "${activeFilter}".`}
                  </p>
                  {activeFilter !== "All" && (
                    <Button 
                      variant="link" 
                      className="text-primary font-bold mt-3 h-auto p-0"
                      onClick={() => setActiveFilter("All")}
                    >
                      View all tickets
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

export default CoordinatorSupportTicket;
