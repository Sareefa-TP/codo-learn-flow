import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Users, ClipboardList, FileText, UserCheck,
  CheckCircle2, Clock, Eye, UserX, GraduationCap,
  Briefcase, BookOpen, Video, ExternalLink, Calendar as CalendarIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mentor = {
  name: "John Doe",
  role: "Senior Mentor",
  profilePic: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  batch: "Full Stack Internship Batch — March 2026",
};

const kpi = {
  totalStudents: 45,
  totalInterns: 18,
  totalTutors: 5,
  pendingTaskReviews: 6,
  weeklyReportsPending: 4,
  presentToday: 14,
};

const upcomingSessions = [
  { id: 1, date: "2026-03-18", time: "10:00 AM", batch: "Batch A", course: "React Fundamentals", status: "Live", link: "#" },
  { id: 2, date: "2026-03-18", time: "02:00 PM", batch: "Batch B", course: "Node.js API Design", status: "Upcoming", link: "#" },
  { id: 3, date: "2026-03-19", time: "11:00 AM", batch: "Batch A", course: "Advanced State Management", status: "Upcoming", link: "#" },
  { id: 4, date: "2026-03-20", time: "04:00 PM", batch: "Batch C", course: "Cloud Deployment", status: "Upcoming", link: "#" },
];

const taskSubmissions = [
  { id: 1, internName: "Aarav Singh", taskTitle: "Build Login Page", week: "Week 1", submittedDate: "Mar 01, 2026", status: "Pending Review" },
  { id: 2, internName: "Priya Sharma", taskTitle: "Design Dashboard Layout", week: "Week 2", submittedDate: "Mar 03, 2026", status: "Pending Review" },
  { id: 3, internName: "Rahul Mehta", taskTitle: "API Integration", week: "Week 2", submittedDate: "Mar 04, 2026", status: "Reviewed" },
];

const weeklyReports = [
  { id: 1, internName: "Aarav Singh", week: "Week 3", submittedDate: "Mar 16, 2026", status: "Pending" },
  { id: 2, internName: "Priya Sharma", week: "Week 3", submittedDate: "Mar 16, 2026", status: "Pending" },
];

const attendance = { present: 14, absent: 4, total: 18 };

// ─── Sub-components ───────────────────────────────────────────────────────────

const statusStyle = {
  Live: "bg-red-500/10 text-red-600 border-red-500/20 animate-pulse",
  Upcoming: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  Completed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const MentorDashboard = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="animate-fade-in max-w-7xl mx-auto pb-10 px-4 lg:px-6">

        {/* Welcome Section (Top Level) */}
        <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-card p-6 lg:p-8 shadow-sm">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <GraduationCap className="w-32 h-32" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
            <Avatar className="w-20 h-20 border-4 border-primary/10 shadow-xl">
              <AvatarImage src={mentor.profilePic} />
              <AvatarFallback className="bg-primary/5 text-primary text-2xl font-bold">
                {mentor.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-foreground">
                  Hello, {mentor.name}! 👋
                </h1>
                <Badge variant="secondary" className="rounded-lg bg-primary/10 text-primary border-none font-bold uppercase tracking-widest text-[10px] px-2.5 py-0.5">
                  {mentor.role}
                </Badge>
              </div>
              <p className="text-muted-foreground font-medium text-sm lg:text-base leading-relaxed">
                You are currently overseeing the <span className="text-foreground font-bold underline decoration-primary/30 decoration-2 underline-offset-4">{mentor.batch}</span>.
              </p>
            </div>
          </div>
        </div>

        {/* ── Main Dashboard Grid (70/30) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mt-6">

          {/* ── Left Column: Main Content (70%) ── */}
          <div className="lg:col-span-8 space-y-6">

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "Total Students", value: kpi.totalStudents, icon: GraduationCap, color: "text-blue-600", bg: "bg-blue-500/10", route: "/mentor/students" },
                { label: "Total Interns", value: kpi.totalInterns, icon: Briefcase, color: "text-indigo-600", bg: "bg-indigo-500/10", route: "/mentor/interns" },
                { label: "Total Tutors", value: kpi.totalTutors, icon: BookOpen, color: "text-emerald-600", bg: "bg-emerald-500/10", route: "/mentor/tutors" }
              ].map(({ label, value, icon: Icon, color, bg, route }) => (
                <Card
                  key={label}
                  className="group border-border/50 shadow-sm rounded-3xl cursor-pointer hover:shadow-md hover:ring-2 hover:ring-primary/10 transition-all duration-300 relative overflow-hidden active:scale-[0.98] h-full"
                  onClick={() => navigate(route)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner shrink-0", bg)}>
                        <Icon className={cn("w-6 h-6", color)} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest truncate">{label}</p>
                        <h3 className="text-2xl font-black text-foreground tabular-nums">{value}</h3>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Upcoming Sessions */}
            <Card className="border-border/50 shadow-sm rounded-3xl overflow-hidden bg-card">
              <CardHeader className="px-6 py-5 border-b border-border/40">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <CardTitle className="text-lg font-black flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5 text-primary" />
                      Upcoming Sessions
                    </CardTitle>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Live Schedule Radar</p>
                  </div>
                  <Button variant="ghost" className="text-primary hover:bg-primary/5 font-bold text-xs gap-2 rounded-xl h-8" onClick={() => navigate("/mentor/live-sessions")}>
                    View All <CalendarIcon className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4 lg:p-6">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/10 border-b border-border/40 hover:bg-muted/10">
                        <TableHead className="py-4 pl-4 font-bold text-[10px] uppercase tracking-wider text-muted-foreground whitespace-nowrap">Date & Time</TableHead>
                        <TableHead className="py-4 font-bold text-[10px] uppercase tracking-wider text-muted-foreground whitespace-nowrap">Batch</TableHead>
                        <TableHead className="py-4 font-bold text-[10px] uppercase tracking-wider text-muted-foreground whitespace-nowrap">Course/Topic</TableHead>
                        <TableHead className="py-4 font-bold text-[10px] uppercase tracking-wider text-muted-foreground text-center whitespace-nowrap">Status</TableHead>
                        <TableHead className="py-4 pr-4 font-bold text-[10px] uppercase tracking-wider text-muted-foreground text-right whitespace-nowrap">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {upcomingSessions.map((session) => (
                        <TableRow key={session.id} className="group hover:bg-muted/5 transition-colors border-b border-border/20 last:border-0 hover:rounded-2xl">
                          <TableCell className="py-4 pl-4">
                            <div className="space-y-0.5">
                              <p className="font-bold text-foreground text-sm tracking-tight">{session.date}</p>
                              <p className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1">
                                <Clock className="w-3 h-3 text-primary/40" /> {session.time}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <Badge variant="outline" className="rounded-lg bg-muted text-foreground text-[9px] font-bold border-none px-2 py-0 shadow-none uppercase">
                              {session.batch}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-4">
                            <span className="text-sm font-bold text-foreground/80 tracking-tight">{session.course}</span>
                          </TableCell>
                          <TableCell className="py-4 text-center">
                            <Badge className={cn(
                              "rounded-full px-3 py-0 text-[9px] font-bold uppercase tracking-widest border shadow-none bg-background",
                              statusStyle[session.status as keyof typeof statusStyle]
                            )}>
                              {session.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-4 pr-4 text-right">
                            <div className="flex justify-end min-w-[100px] h-full items-center">
                              {session.status === "Live" ? (
                                <Button size="sm" className="bg-red-500 hover:bg-red-600 rounded-xl px-4 font-bold shadow-lg shadow-red-500/20 text-[10px] h-7">
                                  Join Now
                                </Button>
                              ) : (
                                <Button size="sm" variant="outline" className="rounded-xl border-border/50 hover:bg-background h-7 font-bold text-[10px] px-3" onClick={() => navigate("/mentor/live-sessions")}>
                                  Details
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ── Right Column: Side Panels (30%) ── */}
          <div className="lg:col-span-4 space-y-6">

            {/* Today's Pulse */}
            <Card className="border-border/50 shadow-sm rounded-3xl overflow-hidden bg-card h-fit">
              <CardHeader className="bg-primary/5 px-6 py-5 border-b border-primary/10">
                <CardTitle className="text-lg font-black flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-primary" />
                  Today's Pulse
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    <span>Attendance Rate</span>
                    <span className="text-emerald-600">{Math.round((attendance.present / attendance.total) * 100)}%</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-muted overflow-hidden border border-border/50 shadow-inner">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-indigo-500 transition-all duration-1000"
                      style={{ width: `${(attendance.present / attendance.total) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-emerald-500/5 p-4 rounded-2xl border border-emerald-500/20 text-center">
                    <p className="text-2xl font-black text-emerald-600">{attendance.present}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Present</p>
                  </div>
                  <div className="bg-rose-500/5 p-4 rounded-2xl border border-rose-500/20 text-center">
                    <p className="text-2xl font-black text-rose-600">{attendance.absent}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Absent</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Review Center */}
            <Card className="border-border/50 shadow-sm rounded-3xl overflow-hidden bg-card h-fit">
              <CardHeader className="bg-indigo-600/5 px-6 py-5 border-b border-indigo-500/10">
                <CardTitle className="text-lg font-black flex items-center gap-2 text-indigo-700">
                  <ClipboardList className="w-5 h-5" />
                  Review Center
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-1">
                {[
                  {
                    label: "Task Review",
                    count: kpi.pendingTaskReviews,
                    icon: Briefcase,
                    route: "/mentor/task-reviews",
                    color: "text-indigo-600",
                    bg: "bg-indigo-50"
                  },
                  {
                    label: "Weekly Report Review",
                    count: kpi.weeklyReportsPending,
                    icon: FileText,
                    route: "/mentor/weekly-reports",
                    color: "text-rose-600",
                    bg: "bg-rose-50"
                  }
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between p-3 rounded-2xl hover:bg-muted/50 transition-all cursor-pointer group active:scale-[0.98]"
                    onClick={() => navigate(item.route)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", item.bg)}>
                        <item.icon className={cn("w-5 h-5", item.color)} />
                      </div>
                      <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[9px] font-bold shadow-none whitespace-nowrap">
                        {item.count} Pending
                      </Badge>
                      <Eye className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MentorDashboard;
