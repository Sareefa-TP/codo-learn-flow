import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Video,
  Calendar,
  Clock,
  BookOpen,
  Layers,
  User,
  Users,
  PlayCircle,
  Pencil,
  Trash2,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Search,
  Users2,
  Trophy,
  Activity,
  UserCheck2,
  UserX2,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { getSessions, MOCK_ATTENDANCE, LiveSession } from "@/data/liveSessionData";

const MentorSessionDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [session, setSession] = useState<LiveSession | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    if (id) {
      const sessions = getSessions();
      const found = sessions.find(s => s.id === id);
      if (found) {
        setSession(found);
      } else {
        toast.error("Session not found");
        navigate("/mentor/my-batches/live-sessions");
      }
    }
  }, [id, navigate]);

  const filteredAttendance = useMemo(() => {
    return MOCK_ATTENDANCE.filter(student => 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const stats = useMemo(() => {
    const total = MOCK_ATTENDANCE.length;
    const present = MOCK_ATTENDANCE.filter(s => s.status === "Present").length;
    const absent = total - present;
    const highEngagement = MOCK_ATTENDANCE.filter(s => s.engagement === "High").length;
    
    return {
      total,
      present,
      absent,
      engagement: Math.round((highEngagement / total) * 100),
      avgScore: 85, // Mock
    };
  }, []);

  if (!session) return null;

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
        case "live":
          return (
            <Badge className="bg-red-500 hover:bg-red-600 text-white border-none animate-pulse flex items-center gap-1 px-3 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white mr-1" />
              Live Now
            </Badge>
          );
        case "upcoming":
          return (
            <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20 px-3 py-1">
              Upcoming
            </Badge>
          );
        case "completed":
          return (
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 px-3 py-1">
              Completed
            </Badge>
          );
        case "cancelled":
          return (
            <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20 px-3 py-1">
              Cancelled
            </Badge>
          );
        default:
          return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-8 max-w-7xl mx-auto pb-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-6">
          <div className="flex items-center gap-4">
            <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full hover:bg-muted shrink-0"
                onClick={() => navigate("/mentor/my-batches/live-sessions")}
              >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">{session.title}</h1>
                {getStatusBadge(session.status)}
              </div>
              <p className="text-muted-foreground font-medium flex items-center gap-2">
                Session ID: <span className="text-foreground">{session.id}</span>
                <span className="w-1 h-1 rounded-full bg-border" />
                {session.module}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <Button variant="outline" className="rounded-xl px-5 h-11" onClick={() => navigate(`/mentor/my-batches/live-sessions/edit/${session.id}`)}>
               <Pencil className="w-4 h-4 mr-2" />
               Edit Session
             </Button>
             <Button className="bg-primary text-white hover:bg-primary/90 rounded-xl px-6 h-11 shadow-lg shadow-primary/20 transition-all active:scale-95" onClick={() => window.open(session.meetingLink, "_blank")}>
               <Video className="w-4 h-4 mr-2" />
               Join / Launch
             </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Stats & Data */}
            <div className="lg:col-span-2 space-y-8">
                 {/* Detail Card */}
                 <Card className="rounded-2xl border-border/50 shadow-sm overflow-hidden">
                    <CardHeader className="bg-muted/30 pb-4">
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                           <Activity className="w-5 h-5 text-primary" />
                           Session Overview
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="space-y-1">
                                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Course</Label>
                                <p className="text-sm font-semibold flex items-center gap-2">
                                    <BookOpen className="w-3.5 h-3.5 text-primary/60" />
                                    {session.course}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Batch</Label>
                                <p className="text-sm font-semibold flex items-center gap-2">
                                    <Layers className="w-3.5 h-3.5 text-primary/60" />
                                    {session.batch}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Module</Label>
                                <p className="text-sm font-semibold flex items-center gap-2">
                                    <Activity className="w-3.5 h-3.5 text-primary/60" />
                                    {session.module}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Topic</Label>
                                <p className="text-sm font-semibold">
                                    {session.topic}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Tutor</Label>
                                <p className="text-sm font-semibold flex items-center gap-2">
                                    <User className="w-3.5 h-3.5 text-primary/60" />
                                    {session.tutor}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Date</Label>
                                <p className="text-sm font-semibold flex items-center gap-2">
                                    <Calendar className="w-3.5 h-3.5 text-primary/60" />
                                    {session.date}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Start Time</Label>
                                <p className="text-sm font-semibold flex items-center gap-2">
                                    <Clock className="w-3.5 h-3.5 text-primary/60" />
                                    {session.startTime}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Duration</Label>
                                <p className="text-sm font-semibold">
                                    {session.duration}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                 </Card>

                 {/* Attendance Table */}
                 <Card className="rounded-2xl border-border/50 shadow-sm overflow-hidden">
                    <CardHeader className="bg-muted/10 border-b pb-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                    <Users2 className="w-5 h-5 text-primary" />
                                    Attendee List
                                </CardTitle>
                                <CardDescription className="text-xs">Individual attendance and engagement tracking</CardDescription>
                            </div>
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input 
                                    placeholder="Search student..." 
                                    className="pl-9 h-9 border-border/50" 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/30">
                                        <TableHead className="font-bold py-3 pl-6 text-[10px] uppercase tracking-wider text-muted-foreground">Student Name</TableHead>
                                        <TableHead className="font-bold text-[10px] uppercase tracking-wider text-muted-foreground">Email</TableHead>
                                        <TableHead className="font-bold text-[10px] uppercase tracking-wider text-muted-foreground text-center">Status</TableHead>
                                        <TableHead className="font-bold text-[10px] uppercase tracking-wider text-muted-foreground text-center">Engagement</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredAttendance.map((student) => (
                                        <TableRow key={student.id} className="hover:bg-muted/5 transition-colors border-b last:border-0 border-border/50">
                                            <TableCell className="py-3 pl-6 font-semibold text-sm">{student.name}</TableCell>
                                            <TableCell className="text-xs text-muted-foreground">{student.email}</TableCell>
                                            <TableCell className="text-center">
                                                {student.status === "Present" ? (
                                                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] py-0 px-2 h-5">Present</Badge>
                                                ) : (
                                                    <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20 text-[10px] py-0 px-2 h-5">Absent</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge 
                                                    className={cn(
                                                        "text-[10px] py-0 px-2 h-5",
                                                        student.engagement === "High" ? "bg-emerald-500 text-white" : 
                                                        student.engagement === "Medium" ? "bg-amber-500 text-white" : "bg-red-500 text-white"
                                                    )}
                                                >
                                                    {student.engagement}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                 </Card>
            </div>

            {/* Right Column: Sidebar Panels */}
            <div className="space-y-8">
                 {/* Performance Summary */}
                 <Card className="rounded-2xl border-border/50 shadow-sm overflow-hidden">
                    <CardHeader className="bg-muted/10 border-b pb-4">
                        <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                           <Trophy className="w-4 h-4 text-amber-500" />
                           Metrics
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-200/50 flex flex-col items-center justify-center text-center">
                                <UserCheck2 className="w-6 h-6 text-emerald-600 mb-2" />
                                <span className="text-2xl font-bold text-foreground">{stats.present}</span>
                                <span className="text-[10px] font-bold text-muted-foreground uppercase">Present</span>
                            </div>
                            <div className="p-4 rounded-xl bg-red-500/5 border border-red-200/50 flex flex-col items-center justify-center text-center">
                                <UserX2 className="w-6 h-6 text-red-600 mb-2" />
                                <span className="text-2xl font-bold text-foreground">{stats.absent}</span>
                                <span className="text-[10px] font-bold text-muted-foreground uppercase">Absent</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                             <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-bold text-muted-foreground uppercase">Engagement Score</span>
                                    <span className="font-bold text-primary">{stats.engagement}%</span>
                                </div>
                                <div className="h-2 w-full bg-muted rounded-full overflow-hidden flex">
                                    <div className="h-full bg-primary" style={{ width: `${stats.engagement}%` }} />
                                </div>
                             </div>
                             <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-bold text-muted-foreground uppercase">Average Performance</span>
                                    <span className="font-bold text-amber-600">{stats.avgScore}%</span>
                                </div>
                                <div className="h-2 w-full bg-muted rounded-full overflow-hidden flex">
                                    <div className="h-full bg-amber-500" style={{ width: `${stats.avgScore}%` }} />
                                </div>
                             </div>
                        </div>
                    </CardContent>
                 </Card>

                 {/* Quick Links */}
                 <Card className="rounded-2xl border-border/50 shadow-sm overflow-hidden bg-primary/5 border-primary/20">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-sm font-bold uppercase tracking-wider text-primary">Session Assets</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-0 space-y-4">
                        <div className="space-y-2">
                             <Label className="text-[10px] font-bold text-muted-foreground uppercase">Meeting URL</Label>
                             <div className="flex items-center gap-2 p-3 rounded-xl bg-background border border-border/50">
                                <Video className="w-4 h-4 text-primary shrink-0" />
                                <span className="text-xs truncate font-medium text-foreground flex-1 underline">{session.meetingLink}</span>
                                <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg" onClick={() => window.open(session.meetingLink, "_blank")}>
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </Button>
                             </div>
                        </div>

                        {session.status === "completed" && session.recordingUrl && (
                             <div className="space-y-2">
                                <Label className="text-[10px] font-bold text-muted-foreground uppercase">Recording</Label>
                                <Button className="w-full h-11 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 shadow-md gap-2" onClick={() => window.open(session.recordingUrl, "_blank")}>
                                    <PlayCircle className="w-4 h-4" />
                                    Watch Recording
                                </Button>
                             </div>
                        )}

                        {session.status === "completed" && !session.recordingUrl && (
                             <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs flex items-start gap-2">
                                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                                <p>Recording is being processed and will be available within 24 hours.</p>
                             </div>
                        )}
                    </CardContent>
                 </Card>

                 {/* Dangerous Zone */}
                 <div className="pt-4 mt-8 border-t border-dashed">
                      <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl gap-2 font-semibold">
                         <Trash2 className="w-4 h-4" />
                         Delete Session
                      </Button>
                 </div>
            </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MentorSessionDetails;
