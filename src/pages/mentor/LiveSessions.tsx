import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Search,
  MoreVertical,
  Eye,
  Video,
  Filter,
  Calendar,
  User,
  BookOpen,
  Clock,
  Layers,
  PlayCircle,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  CircleDot,
} from "lucide-react";
import { toast } from "sonner";
import { 
  MOCK_SESSIONS, 
  LiveSession, 
  COURSES, 
  BATCHES,
  getSessions,
  deleteSession
} from "@/data/liveSessionData";

const MentorLiveSessions = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<LiveSession[]>(getSessions());
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCardFilter, setActiveCardFilter] = useState("upcoming");
  const [filters, setFilters] = useState({
    course: "all",
    batch: "all",
    status: "all",
  });
  
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);

  const stats = useMemo(() => {
    return {
      total: sessions.length,
      upcoming: sessions.filter((s) => s.status.toLowerCase() === "upcoming").length,
      completed: sessions.filter((s) => s.status.toLowerCase() === "completed").length,
      cancelled: sessions.filter((s) => s.status.toLowerCase() === "cancelled").length,
    };
  }, [sessions]);

  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      const matchesSearch =
        session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.tutor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.topic.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCourse = filters.course === "all" || session.course === filters.course;
      const matchesBatch = filters.batch === "all" || session.batch === filters.batch;
      const matchesStatus = filters.status === "all" || session.status.toLowerCase() === filters.status.toLowerCase();
      
      const matchesCard = 
        activeCardFilter === "all" || 
        (activeCardFilter === "upcoming" && session.status.toLowerCase() === "upcoming") ||
        (activeCardFilter === "completed" && session.status.toLowerCase() === "completed") ||
        (activeCardFilter === "cancelled" && session.status.toLowerCase() === "cancelled");

      return matchesSearch && matchesCourse && matchesBatch && matchesStatus && matchesCard;
    });
  }, [searchTerm, filters, activeCardFilter, sessions]);

  const handleDeleteSession = () => {
    if (sessionToDelete) {
      deleteSession(sessionToDelete);
      setSessions(getSessions());
      toast.success("Session deleted successfully");
      setSessionToDelete(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "live":
        return (
          <Badge className="bg-red-500 hover:bg-red-600 text-white border-none animate-pulse flex items-center gap-1 px-2 py-0.5 text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-white mr-1" />
            Live
          </Badge>
        );
      case "upcoming":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20 flex items-center gap-1 capitalize text-[10px]">
            <CircleDot className="w-3 h-3" />
            Upcoming
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 flex items-center gap-1 capitalize text-[10px]">
            <CheckCircle2 className="w-3 h-3" />
            Completed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20 flex items-center gap-1 capitalize text-[10px]">
            <XCircle className="w-3 h-3" />
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-8 max-w-[1400px] mx-auto pb-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">
              Live Sessions
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage and monitor sessions across your batches
            </p>
          </div>
          <Button
            className="bg-primary text-white hover:bg-primary/90 rounded-xl px-5 h-11 shadow-lg shadow-primary/20 transition-all active:scale-95 flex items-center gap-2"
            onClick={() => navigate("/mentor/my-batches/live-sessions/schedule")}
          >
            <Plus className="w-5 h-5" />
            Schedule Session
          </Button>
        </div>


        {/* Search & Filter Bar */}
        <Card className="border-border/50 shadow-sm overflow-hidden rounded-2xl bg-muted/20">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
              <div className="lg:col-span-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Search Session</label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground" />
                  <Input
                    placeholder="Search by title, tutor or topic..."
                    className="pl-11 h-11 rounded-xl bg-background border-border/50 shadow-sm focus:ring-primary/20 text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Course</label>
                <Select value={filters.course} onValueChange={(val) => setFilters({ ...filters, course: val })}>
                  <SelectTrigger className="h-11 rounded-xl border-border/50 bg-background">
                    <SelectValue placeholder="All Courses" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="all">All Courses</SelectItem>
                    {COURSES.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Batch</label>
                <Select value={filters.batch} onValueChange={(val) => setFilters({ ...filters, batch: val })}>
                  <SelectTrigger className="h-11 rounded-xl border-border/50 bg-background">
                    <SelectValue placeholder="All Batches" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="all">All Batches</SelectItem>
                    {Object.values(BATCHES).flat().map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Status</label>
                  <Select value={filters.status} onValueChange={(val) => setFilters({ ...filters, status: val })}>
                    <SelectTrigger className="h-11 rounded-xl border-border/50 bg-background">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-11 w-11 rounded-xl border-border/50 bg-background shrink-0 self-end"
                  onClick={() => {
                    setFilters({ course: "all", batch: "all", status: "all" });
                    setSearchTerm("");
                    setActiveCardFilter("all");
                  }}
                >
                  <Filter className="w-5 h-5 text-muted-foreground" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tab-based Filters */}
        <div className="flex items-center gap-8 border-b border-border/50 px-2 mt-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
          {[
            { id: "upcoming", label: "Upcoming", count: stats.upcoming },
            { id: "completed", label: "Completed", count: stats.completed },
            { id: "cancelled", label: "Cancelled", count: stats.cancelled },
            { id: "all", label: "Total Sessions", count: stats.total },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCardFilter(tab.id)}
              className={cn(
                "pb-4 text-[11px] font-bold uppercase tracking-wider transition-all relative outline-none flex items-center gap-1.5",
                activeCardFilter === tab.id
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
              <span className={cn(
                "px-1.5 py-0.5 rounded-full text-[9px] font-bold",
                activeCardFilter === tab.id ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
              )}>
                {tab.count}
              </span>
              {activeCardFilter === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Sessions Table */}
        <Card className="border-border/50 shadow-sm overflow-hidden rounded-2xl">
          <CardHeader className="border-b bg-muted/10 px-6 py-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Video className="w-5 h-5 text-primary" />
              Session List
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/20 hover:bg-muted/20 border-b border-border/50">
                    <TableHead className="font-bold py-4 pl-6 text-xs uppercase tracking-wider">Session Details</TableHead>
                    <TableHead className="font-bold text-xs uppercase tracking-wider">Course & Batch</TableHead>
                    <TableHead className="font-bold text-xs uppercase tracking-wider">Module & Topic</TableHead>
                    <TableHead className="font-bold text-xs uppercase tracking-wider">Tutor</TableHead>
                    <TableHead className="font-bold text-xs uppercase tracking-wider">Schedule</TableHead>
                    <TableHead className="font-bold text-xs uppercase tracking-wider text-center">Status</TableHead>
                    <TableHead className="font-bold text-xs uppercase tracking-wider text-right pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSessions.length > 0 ? (
                    filteredSessions.map((session) => (
                      <TableRow key={session.id} className="hover:bg-muted/5 transition-colors border-b last:border-0 border-border/50 group">
                        <TableCell className="py-4 pl-6">
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{session.title}</span>
                            <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1 mt-0.5">
                              {session.id}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                              <BookOpen className="w-3 h-3 text-primary" />
                              {session.course}
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                              <Layers className="w-3 h-3" />
                              {session.batch}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0" />
                              {session.module}
                            </div>
                            <div className="text-[10px] text-muted-foreground pl-3">
                              {session.topic}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                             <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                                <User className="w-4 h-4 text-primary" />
                             </div>
                             <span className="text-xs font-medium text-foreground">{session.tutor}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                              <Calendar className="w-3 h-3 text-primary" />
                              {session.date}
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {session.startTime} ({session.duration})
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {getStatusBadge(session.status)}
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-muted rounded-full">
                                <MoreVertical className="w-4 h-4 text-muted-foreground" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 rounded-xl border-border/50 shadow-xl p-1">
                              <DropdownMenuLabel className="text-[10px] font-bold uppercase text-muted-foreground px-2 py-1.5">Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="gap-2.5 cursor-pointer rounded-lg py-2"
                                onClick={() => navigate(`/mentor/my-batches/live-sessions/${session.id}`)}
                              >
                                <Eye className="w-4 h-4 text-blue-500 fill-blue-500/10" /> 
                                <span className="font-medium">View Details</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="gap-2.5 cursor-pointer rounded-lg py-2"
                                onClick={() => navigate(`/mentor/my-batches/live-sessions/edit/${session.id}`)}
                              >
                                <Pencil className="w-4 h-4 text-amber-500 fill-amber-500/10" /> 
                                <span className="font-medium">Edit Session</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="gap-2.5 cursor-pointer rounded-lg py-2 text-primary focus:text-primary focus:bg-primary/5"
                                onClick={() => window.open(session.meetingLink, "_blank")}
                              >
                                <Video className="w-4 h-4" /> 
                                <span className="font-medium">Join Session</span>
                              </DropdownMenuItem>
                              {session.recordingUrl && (
                                <DropdownMenuItem 
                                  className="gap-2.5 cursor-pointer rounded-lg py-2 text-emerald-600 focus:text-emerald-600 focus:bg-emerald-50"
                                  onClick={() => window.open(session.recordingUrl, "_blank")}
                                >
                                  <PlayCircle className="w-4 h-4" /> 
                                  <span className="font-medium">View Recording</span>
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="gap-2.5 cursor-pointer rounded-lg py-2 text-red-600 focus:text-red-600 focus:bg-red-50"
                                onClick={() => setSessionToDelete(session.id)}
                              >
                                <Trash2 className="w-4 h-4" /> 
                                <span className="font-medium">Delete Session</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-32 text-center text-muted-foreground italic">
                        No live sessions found matching your criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!sessionToDelete} onOpenChange={() => setSessionToDelete(null)}>
        <AlertDialogContent className="rounded-2xl border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">Delete Session?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This action cannot be undone. This will permanently delete the live session and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel className="rounded-xl border-border hover:bg-muted">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteSession}
              className="rounded-xl bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-200"
            >
              Delete Session
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default MentorLiveSessions;
