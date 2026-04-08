import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Search, SlidersHorizontal, Eye, LifeBuoy } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSupportTickets } from "@/modules/supportTickets/store";
import type { SupportTicketPriority, SupportTicketRole, SupportTicketStatus } from "@/modules/supportTickets/types";

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

const priorityBadgeClass = (priority: SupportTicketPriority) => {
  switch (priority) {
    case "Low":
      return "bg-gray-500/10 text-gray-700 border-gray-200";
    case "Medium":
      return "bg-orange-500/10 text-orange-700 border-orange-200";
    case "High":
      return "bg-red-500/10 text-red-700 border-red-200";
    default:
      return "";
  }
};

const SummaryCard = ({
  title,
  count,
  accentClass,
}: {
  title: string;
  count: number;
  accentClass: string;
}) => (
  <Card className="border-none shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300">
    <CardContent className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            {title}
          </p>
          <p className="text-2xl font-black text-foreground mt-1">{count}</p>
        </div>
        <div className={cn("w-11 h-11 rounded-2xl flex items-center justify-center border", accentClass)}>
          <LifeBuoy className="w-5 h-5" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const AdminSupportTickets = () => {
  const navigate = useNavigate();
  const { tickets } = useSupportTickets();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<SupportTicketStatus | "All">("All");
  const [priority, setPriority] = useState<SupportTicketPriority | "All">("All");
  const [role, setRole] = useState<SupportTicketRole | "All">("All");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  const summary = useMemo(() => {
    const open = tickets.filter((t) => t.status === "Open").length;
    const inProgress = tickets.filter((t) => t.status === "In Progress").length;
    const resolved = tickets.filter((t) => t.status === "Resolved").length;
    const highPriority = tickets.filter((t) => t.priority === "High").length;
    return { open, inProgress, resolved, highPriority };
  }, [tickets]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tickets.filter((t) => {
      if (q) {
        const hay = `${t.id} ${t.name} ${t.subject}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }

      if (status !== "All" && t.status !== status) return false;
      if (priority !== "All" && t.priority !== priority) return false;
      if (role !== "All" && t.role !== role) return false;

      if (dateFrom && t.createdAt < dateFrom) return false;
      if (dateTo && t.createdAt > dateTo) return false;

      return true;
    });
  }, [tickets, search, status, priority, role, dateFrom, dateTo]);

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6 max-w-[1600px] mx-auto pb-10 px-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
              Support Tickets
            </h1>
            <p className="text-muted-foreground mt-1 font-medium">
              View, filter, and manage tickets from students and advisors.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full lg:w-auto">
            <div className="relative w-full sm:w-[320px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or ticket ID"
                className="pl-9 rounded-xl"
              />
            </div>
            <Button variant="outline" className="rounded-xl gap-2 bg-background">
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </Button>
          </div>
        </div>

        {/* Summary cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <SummaryCard
            title="Open Tickets"
            count={summary.open}
            accentClass="bg-yellow-500/10 text-yellow-700 border-yellow-200"
          />
          <SummaryCard
            title="In Progress"
            count={summary.inProgress}
            accentClass="bg-blue-500/10 text-blue-700 border-blue-200"
          />
          <SummaryCard
            title="Resolved"
            count={summary.resolved}
            accentClass="bg-green-500/10 text-green-700 border-green-200"
          />
          <SummaryCard
            title="High Priority"
            count={summary.highPriority}
            accentClass="bg-red-500/10 text-red-700 border-red-200"
          />
        </section>

        {/* Filters */}
        <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="py-4 px-6 border-b border-border/50">
            <CardTitle className="text-sm font-bold">Filters</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  Status
                </p>
                <Select value={status} onValueChange={(v) => setStatus(v as any)}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  Priority
                </p>
                <Select value={priority} onValueChange={(v) => setPriority(v as any)}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  Role
                </p>
                <Select value={role} onValueChange={(v) => setRole(v as any)}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Student">Student</SelectItem>
                    <SelectItem value="Advisor">Advisor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  Date From
                </p>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  Date To
                </p>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="rounded-xl"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ticket list table */}
        <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="py-4 px-6 border-b border-border/50">
            <div className="flex items-center justify-between gap-4">
              <CardTitle className="text-sm font-bold">Ticket List</CardTitle>
              <div className="text-xs text-muted-foreground font-medium">
                Showing <span className="font-bold text-foreground">{filtered.length}</span> tickets
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/20">
                  <TableHead>Ticket ID</TableHead>
                  <TableHead>User Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length > 0 ? (
                  filtered.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="font-mono text-xs text-muted-foreground">{t.id}</TableCell>
                      <TableCell className="font-semibold">{t.name}</TableCell>
                      <TableCell className="text-xs font-medium text-muted-foreground">{t.role}</TableCell>
                      <TableCell className="max-w-[420px] truncate font-medium">{t.subject}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn("rounded-full border text-[10px] font-bold", priorityBadgeClass(t.priority))}>
                          {t.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn("rounded-full border text-[10px] font-bold", statusBadgeClass(t.status))}>
                          {t.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{t.createdAt}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-xl gap-2"
                          onClick={() => navigate(`/admin/support-tickets/${t.id}`)}
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="py-16">
                      <div className="flex flex-col items-center justify-center text-center gap-2">
                        <div className="w-12 h-12 rounded-2xl bg-muted/40 flex items-center justify-center border border-border/50">
                          <LifeBuoy className="w-6 h-6 text-muted-foreground/60" />
                        </div>
                        <p className="text-sm font-semibold text-foreground">No tickets found</p>
                        <p className="text-xs text-muted-foreground max-w-sm">
                          Try adjusting your search or filter values.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminSupportTickets;

