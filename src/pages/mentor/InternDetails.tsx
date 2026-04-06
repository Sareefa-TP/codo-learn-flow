import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
    ArrowLeft, Mail, BookOpen, Calendar, CheckCircle2,
    Clock, AlertCircle, BarChart3, User, ExternalLink,
    CalendarDays, UserCheck, UserX, TrendingUp, ChevronLeft, ChevronRight,
} from "lucide-react";
import { mentees, internTasks, attendanceRecords as mentorAttendanceData } from "@/data/mentorData";

// ─── Types ────────────────────────────────────────────────────────────────────
type AttendanceStatus = "Present" | "Absent" | "Late";

interface DetailedAttendanceRecord {
  date: string;
  day: string;
  checkIn: string;
  checkOut: string;
  duration: string;
  status: AttendanceStatus;
}

// ─── Mock Data (Adapted for detailed view) ───────────────────────────────────
const detailedAttendanceRecords: DetailedAttendanceRecord[] = [
  { date: "Mar 25, 2026", day: "Wednesday", checkIn: "09:00 AM", checkOut: "05:00 PM", duration: "8h 0m", status: "Present" },
  { date: "Mar 24, 2026", day: "Tuesday", checkIn: "09:05 AM", checkOut: "05:15 PM", duration: "8h 10m", status: "Late" },
  { date: "Mar 23, 2026", day: "Monday", checkIn: "08:55 AM", checkOut: "05:00 PM", duration: "8h 5m", status: "Present" },
  { date: "Mar 22, 2026", day: "Sunday", checkIn: "--", checkOut: "--", duration: "0h 0m", status: "Absent" },
  { date: "Mar 21, 2026", day: "Saturday", checkIn: "09:00 AM", checkOut: "05:05 PM", duration: "8h 5m", status: "Present" },
  { date: "Mar 20, 2026", day: "Friday", checkIn: "08:50 AM", checkOut: "05:10 PM", duration: "8h 20m", status: "Present" },
  { date: "Mar 19, 2026", day: "Thursday", checkIn: "09:02 AM", checkOut: "05:00 PM", duration: "7h 58m", status: "Present" },
  { date: "Mar 18, 2026", day: "Wednesday", checkIn: "--", checkOut: "--", duration: "0h 0m", status: "Absent" },
  { date: "Mar 17, 2026", day: "Tuesday", checkIn: "08:58 AM", checkOut: "05:15 PM", duration: "8h 17m", status: "Present" },
  { date: "Mar 16, 2026", day: "Monday", checkIn: "09:10 AM", checkOut: "05:30 PM", duration: "8h 20m", status: "Present" },
  { date: "Mar 15, 2026", day: "Sunday", checkIn: "09:00 AM", checkOut: "05:00 PM", duration: "8h 0m", status: "Present" },
  { date: "Mar 14, 2026", day: "Saturday", checkIn: "08:55 AM", checkOut: "05:05 PM", duration: "8h 10m", status: "Present" },
  { date: "Mar 13, 2026", day: "Friday", checkIn: "09:15 AM", checkOut: "05:45 PM", duration: "8h 30m", status: "Late" },
  { date: "Mar 12, 2026", day: "Thursday", checkIn: "09:00 AM", checkOut: "05:00 PM", duration: "8h 0m", status: "Present" },
  { date: "Mar 11, 2026", day: "Wednesday", checkIn: "08:50 AM", checkOut: "05:10 PM", duration: "8h 20m", status: "Present" },
];

const attendanceStatusStyles = {
    Present: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    Absent: "bg-red-500/10 text-red-600 border-red-500/20",
    Late: "bg-amber-500/10 text-amber-600 border-amber-500/20",
};

const PAGE_SIZE = 10;

const InternDetails = () => {
    const { internId } = useParams<{ internId: string }>();
    const navigate = useNavigate();
    const [page, setPage] = useState(1);

    // Find intern data
    const intern = mentees.find(m => m.id === internId && m.type === "intern");
    const tasks = internTasks.filter(t => t.internId === internId);

    if (!intern) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
                    <div className="bg-muted p-4 rounded-full">
                        <AlertCircle className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">Intern Not Found</h2>
                        <p className="text-muted-foreground mt-1">
                            The intern you're looking for doesn't exist or is not assigned to you.
                        </p>
                    </div>
                    <Button onClick={() => navigate("/mentor/interns")} variant="outline" className="gap-2">
                        <ArrowLeft className="w-4 h-4" /> Back to Interns
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

    const internStatusStyles = {
        "on-track": "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
        "ahead": "bg-blue-500/10 text-blue-600 border-blue-500/20",
        "at-risk": "bg-rose-500/10 text-rose-600 border-rose-500/20",
        "needs-attention": "bg-amber-500/10 text-amber-600 border-amber-500/20",
    };

    const taskStatusStyles = {
        pending: "bg-slate-500/10 text-slate-600",
        in_progress: "bg-blue-500/10 text-blue-600",
        submitted: "bg-amber-500/10 text-amber-600",
        approved: "bg-emerald-500/10 text-emerald-600",
        revision: "bg-rose-500/10 text-rose-600",
    };

    // Derived stats for attendance
    const total = detailedAttendanceRecords.length;
    const presentCount = detailedAttendanceRecords.filter(r => r.status === "Present").length;
    const absentCount = detailedAttendanceRecords.filter(r => r.status === "Absent").length;
    const lateCount = detailedAttendanceRecords.filter(r => r.status === "Late").length;
    const attendanceRate = Math.round(((presentCount + lateCount) / total) * 100);

    // Pagination
    const totalPages = Math.ceil(total / PAGE_SIZE);
    const paginatedRecords = detailedAttendanceRecords.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        <DashboardLayout>
            <div className="animate-fade-in space-y-6 max-w-7xl mx-auto pb-10 px-4 md:px-0">
                {/* ── Breadcrumbs & Actions ── */}
                <div className="flex items-center justify-between">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate("/mentor/interns")}
                        className="gap-2 text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to List
                    </Button>
                </div>

                {/* ── Header Card ── */}
                <Card className="border-border/50 shadow-sm rounded-xl overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
                    <CardContent className="p-6 md:p-8">
                        <div className="flex flex-col md:flex-row gap-6 md:items-center">
                            <div className="h-24 w-24 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0">
                                <User className="w-12 h-12" />
                            </div>
                            <div className="space-y-1 flex-1">
                                <div className="flex flex-wrap items-center gap-3">
                                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{intern.name}</h1>
                                    <Badge variant="outline" className={`capitalize ${internStatusStyles[intern.status as keyof typeof internStatusStyles]}`}>
                                        {intern.status.replace("-", " ")}
                                    </Badge>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-2 gap-x-6 mt-3 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4" /> {intern.email}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <BookOpen className="w-4 h-4" /> {intern.course}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" /> Joined {intern.joinedDate}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* ── Performance & Progress ── */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="border-border/50 shadow-sm rounded-xl">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5 text-primary" />
                                    Intern Metrics
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Overall Progress</span>
                                        <span className="font-semibold">{intern.progress}%</span>
                                    </div>
                                    <Progress value={intern.progress} className="h-2" />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Attendance</span>
                                        <span className="font-semibold">{intern.attendance}%</span>
                                    </div>
                                    <Progress value={intern.attendance} className="h-2 bg-muted transition-all" />
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div className="bg-muted/30 p-4 rounded-xl text-center space-y-1 border border-border/40">
                                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Tasks Completed</span>
                                        <div className="text-2xl font-bold">{tasks.filter(t => t.status === "approved").length}</div>
                                    </div>
                                    <div className="bg-muted/30 p-4 rounded-xl text-center space-y-1 border border-border/40">
                                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Active Tasks</span>
                                        <div className="text-2xl font-bold text-primary">{tasks.filter(t => t.status === "in_progress" || t.status === "submitted").length}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                    </div>

                    {/* ── Task List ── */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-border/50 shadow-sm rounded-xl h-full flex flex-col">
                            <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 bg-muted/20 pb-4">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-primary" />
                                    Assigned Tasks
                                </CardTitle>
                                <Badge variant="secondary" className="px-3 py-1 bg-primary/10 text-primary hover:bg-primary/10 border-none rounded-lg">
                                    {tasks.length} Total
                                </Badge>
                            </CardHeader>
                            <CardContent className="p-0 flex-1">
                                {tasks.length > 0 ? (
                                    <div className="divide-y divide-border/40">
                                        {tasks.map((task) => (
                                            <div key={task.id} className="p-4 md:p-6 hover:bg-muted/5 transition-colors group">
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                    <div className="space-y-1 flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{task.title}</h3>
                                                            <Badge variant="secondary" className={`text-[10px] font-bold px-2 py-0 h-4 uppercase ${taskStatusStyles[task.status as keyof typeof taskStatusStyles]}`}>
                                                                {task.status.replace("_", " ")}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
                                                    </div>
                                                    <div className="flex flex-row md:flex-col items-center md:items-end gap-4 md:gap-1 shrink-0 text-sm">
                                                        <div className="flex items-center gap-1.5 text-muted-foreground">
                                                            <Clock className="w-3.5 h-3.5" />
                                                            <span>Due {task.deadline}</span>
                                                        </div>
                                                        {task.status === "approved" && (
                                                            <span className="text-emerald-600 font-medium flex items-center gap-1">
                                                                <CheckCircle2 className="w-3.5 h-3.5" /> Done
                                                            </span>
                                                        )}
                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="View Task Details">
                                                            <ExternalLink className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-20 flex flex-col items-center justify-center text-muted-foreground gap-3">
                                        <div className="bg-muted p-4 rounded-full">
                                            <AlertCircle className="w-8 h-8 opacity-40" />
                                        </div>
                                        <p className="text-sm">No tasks assigned to this intern yet.</p>
                                        <Button size="sm" variant="outline">Assign First Task</Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* ── Detailed Attendance History (Full Width) ── */}
                <div className="space-y-6">
                    {/* ── Page Header ── */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <CalendarDays className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">Attendance History - {intern.name}</h1>
                                <p className="text-muted-foreground text-sm mt-0.5">
                                    View detailed internship attendance records and session durations for this intern.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { label: "Total Working Days", value: total, icon: CalendarDays, bg: "bg-violet-500/10", color: "text-violet-600" },
                            { label: "Days Present", value: presentCount, icon: UserCheck, bg: "bg-emerald-500/10", color: "text-emerald-600" },
                            { label: "Days Absent", value: absentCount, icon: UserX, bg: "bg-red-500/10", color: "text-red-600" },
                            { label: "Days Late", value: lateCount, icon: TrendingUp, bg: "bg-amber-500/10", color: "text-amber-600" },
                        ].map(({ label, value, icon: Icon, bg, color }) => (
                            <Card key={label} className="border-border/50 shadow-sm rounded-xl">
                                <CardContent className="pt-5 pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${bg}`}>
                                            <Icon className={`w-5 h-5 ${color}`} />
                                        </div>
                                        <div>
                                            <p className={`text-2xl font-bold ${color}`}>{value}</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* ── Attendance Performance Card ── */}
                    <Card className="border-border/50 shadow-sm rounded-xl">
                        <CardContent className="pt-5 pb-5 space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold">Attendance Performance</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        Overall status based on {total} recorded working days
                                    </p>
                                </div>
                                <span className={`text-3xl font-bold ${attendanceRate >= 85 ? "text-emerald-600" : attendanceRate >= 70 ? "text-amber-600" : "text-red-600"}`}>
                                    {attendanceRate}%
                                </span>
                            </div>

                            {/* Progress bar */}
                            <div className="relative h-4 w-full overflow-hidden rounded-full bg-muted">
                                <div
                                    className={`h-full rounded-full transition-all duration-700 ${attendanceRate >= 85 ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                                        : attendanceRate >= 70 ? "bg-amber-500"
                                            : "bg-red-500"
                                        }`}
                                    style={{ width: `${attendanceRate}%` }}
                                />
                            </div>

                            {/* Legend */}
                            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1 text-center sm:text-left">
                                <span className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                                    Present: {presentCount}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                                    Late: {lateCount}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                                    Absent: {absentCount}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 shadow-sm rounded-xl overflow-hidden">
                        <CardHeader className="pb-3 border-b border-border/20">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    <CalendarDays className="w-4 h-4 text-primary" />
                                    Attendance Log
                                </CardTitle>
                                <span className="text-[10px] sm:text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-md border border-border/40">
                                    {total} records · Page {page} of {totalPages}
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/30">
                                            <TableHead className="text-[10px] font-bold uppercase tracking-wider w-12 text-center">#</TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase tracking-wider">Date</TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase tracking-wider">Session Time</TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase tracking-wider">Duration</TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase tracking-wider">Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {paginatedRecords.map((record, idx) => (
                                            <TableRow
                                                key={record.date}
                                                className="hover:bg-muted/10 transition-colors border-b border-border/10 last:border-0"
                                            >
                                                <TableCell className="text-xs text-muted-foreground text-center">
                                                    {(page - 1) * PAGE_SIZE + idx + 1}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-semibold text-foreground leading-tight">{record.date}</span>
                                                        <span className="text-[10px] text-muted-foreground font-medium">{record.day}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <span className="text-emerald-600 font-medium">{record.checkIn}</span>
                                                        <span className="text-muted-foreground/30">|</span>
                                                        <span className="text-orange-600 font-medium">{record.checkOut}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-sm font-bold text-foreground font-mono">
                                                    {record.duration}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className={`text-[10px] font-bold uppercase tracking-wide h-6 ${attendanceStatusStyles[record.status as keyof typeof attendanceStatusStyles]}`}
                                                    >
                                                        {record.status}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between px-4 py-3 border-t border-border/40 bg-muted/5">
                                    <p className="hidden sm:block text-[11px] text-muted-foreground font-medium">
                                        Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total}
                                    </p>
                                    <div className="flex items-center gap-1.5 mx-auto sm:mx-0">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 w-8 p-0 rounded-lg"
                                            onClick={() => setPage(p => Math.max(1, p - 1))}
                                            disabled={page === 1}
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                        </Button>
                                        <div className="flex items-center gap-1 px-1">
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                                <Button
                                                    key={p}
                                                    variant={p === page ? "default" : "ghost"}
                                                    size="sm"
                                                    className={`h-8 w-8 p-0 text-xs rounded-lg ${p === page ? "shadow-md bg-primary text-primary-foreground hover:bg-primary/90" : "text-muted-foreground"}`}
                                                    onClick={() => setPage(p)}
                                                >
                                                    {p}
                                                </Button>
                                            ))}
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 w-8 p-0 rounded-lg"
                                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                            disabled={page === totalPages}
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default InternDetails;
