import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ArrowLeft, Send } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSupportTickets } from "@/modules/supportTickets/store";
import type { SupportTicketStatus } from "@/modules/supportTickets/types";

const statusBadgeClass = (status: SupportTicketStatus) => {
  switch (status) {
    case "Open":
      return "bg-yellow-500/10 text-yellow-700 border-yellow-200";
    case "In Progress":
      return "bg-blue-500/10 text-blue-700 border-blue-200";
    case "Resolved":
      return "bg-green-500/10 text-green-700 border-green-200";
    default:
      return "";
  }
};

const AdminSupportTicketDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getTicketById, updateTicketStatus, addAdminReply } = useSupportTickets();

  const ticket = useMemo(() => (id ? getTicketById(id) : undefined), [getTicketById, id]);

  const [reply, setReply] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  const handleSend = async () => {
    const trimmed = reply.trim();
    if (!trimmed || !ticket) return;

    setIsSending(true);
    await new Promise((r) => setTimeout(r, 450));
    addAdminReply(ticket.id, trimmed);
    setReply("");
    setIsSending(false);
    setTimeout(scrollToBottom, 50);
  };

  if (!ticket) {
    return (
      <DashboardLayout>
        <div className="animate-fade-in space-y-6 max-w-[1200px] mx-auto pb-10 px-6">
          <div className="flex items-center gap-3">
            <Button variant="outline" className="rounded-xl" onClick={() => navigate("/admin/support-tickets")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
          <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
            <CardContent className="p-10 text-center">
              <p className="text-lg font-bold text-foreground">Ticket not found</p>
              <p className="text-sm text-muted-foreground mt-2">
                The ticket ID may be invalid or the data was reset.
              </p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6 max-w-[1600px] mx-auto pb-10 px-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => navigate("/admin/support-tickets")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="h-6 w-px bg-border hidden sm:block" />
            <div>
              <p className="text-xs font-mono text-muted-foreground">{ticket.id}</p>
              <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-foreground">
                {ticket.subject}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant="outline"
              className={cn("rounded-full border text-[10px] font-bold", statusBadgeClass(ticket.status))}
            >
              {ticket.status}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: main */}
          <div className="lg:col-span-8 space-y-6">
            <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
              <CardHeader className="py-4 px-6 border-b border-border/50">
                <CardTitle className="text-sm font-bold">Ticket Details</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-5">
                <div>
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Description
                  </p>
                  <p className="text-sm font-medium text-foreground mt-2 leading-relaxed">
                    {ticket.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Conversation */}
            <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
              <CardHeader className="py-4 px-6 border-b border-border/50">
                <CardTitle className="text-sm font-bold">Conversation</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-[520px] overflow-y-auto p-6 space-y-5 bg-muted/5">
                  {ticket.messages.map((m) => {
                    const isUser = m.sender === "user";
                    return (
                      <div
                        key={m.id}
                        className={cn(
                          "flex flex-col max-w-[88%] sm:max-w-[75%]",
                          isUser ? "mr-auto items-start" : "ml-auto items-end",
                        )}
                      >
                        <div
                          className={cn(
                            "rounded-2xl p-4 shadow-sm text-sm leading-relaxed",
                            isUser
                              ? "bg-card border border-border rounded-tl-none text-foreground"
                              : "bg-primary text-primary-foreground rounded-tr-none",
                          )}
                        >
                          {m.text}
                        </div>
                        <span className="text-[10px] text-muted-foreground mt-1 px-1">
                          {isUser ? `${ticket.name} (${ticket.role})` : "Admin"} •{" "}
                          {new Date(m.createdAt).toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Reply box */}
                <div className="p-6 border-t bg-card">
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Write your reply..."
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      className="min-h-[110px] resize-none rounded-2xl"
                    />
                    <div className="flex items-center justify-end gap-3">
                      <Button
                        onClick={handleSend}
                        disabled={isSending || !reply.trim()}
                        className="rounded-xl gap-2 min-w-[140px]"
                      >
                        {isSending ? (
                          <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                        Send Reply
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: info */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
              <CardHeader className="py-4 px-6 border-b border-border/50">
                <CardTitle className="text-sm font-bold">Ticket Info</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl border border-border/50 bg-muted/10">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">
                      Ticket ID
                    </p>
                    <p className="text-sm font-mono font-semibold mt-1 text-foreground">{ticket.id}</p>
                  </div>
                  <div className="p-4 rounded-2xl border border-border/50 bg-muted/10">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">
                      Created
                    </p>
                    <p className="text-sm font-semibold mt-1 text-foreground">{ticket.createdAt}</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-border/50 bg-muted/10">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">
                    User
                  </p>
                  <p className="text-sm font-semibold mt-1 text-foreground">{ticket.name}</p>
                  <p className="text-xs text-muted-foreground font-medium mt-1">{ticket.role}</p>
                </div>

                <div className="p-4 rounded-2xl border border-border/50 bg-muted/10">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">
                    Status
                  </p>
                  <Badge
                    variant="outline"
                    className={cn(
                      "mt-2 rounded-full border text-[10px] font-bold",
                      statusBadgeClass(ticket.status),
                    )}
                  >
                    {ticket.status}
                  </Badge>
                </div>

                <div className="pt-2">
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                    Update Status
                  </p>
                  <Select
                    value={ticket.status}
                    onValueChange={(v) => updateTicketStatus(ticket.id, v as SupportTicketStatus)}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Open">Open</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminSupportTicketDetails;

