import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    ArrowLeft, Mail, Phone, BookOpen, Calendar, CheckCircle2,
    Clock, AlertCircle, BarChart3, User, ExternalLink
} from "lucide-react";
import { mentees, internTasks, attendanceRecords } from "@/data/mentorData";

const InternDetails = () => {
    const { internId } = useParams<{ internId: string }>();
    const navigate = useNavigate();

    // Find intern data
    const intern = mentees.find(m => m.id === internId && m.type === "intern");
    const tasks = internTasks.filter(t => t.internId === internId);
    const attendance = attendanceRecords.find(a => a.menteeId === internId);

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

    const statusStyles = {
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

    return (
        <DashboardLayout>
            <div className="animate-fade-in space-y-6 max-w-7xl mx-auto pb-10">
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
                                    <Badge variant="outline" className={`capitalize ${statusStyles[intern.status]}`}>
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
                                    <div className="bg-muted/30 p-4 rounded-xl text-center space-y-1">
                                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Tasks Completed</span>
                                        <div className="text-2xl font-bold">{tasks.filter(t => t.status === "approved").length}</div>
                                    </div>
                                    <div className="bg-muted/30 p-4 rounded-xl text-center space-y-1">
                                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Active Tasks</span>
                                        <div className="text-2xl font-bold text-primary">{tasks.filter(t => t.status === "in_progress" || t.status === "submitted").length}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Attendance History */}
                        <Card className="border-border/50 shadow-sm rounded-xl">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-primary" />
                                    Weekly Attendance
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {attendance ? (
                                    <div className="space-y-4">
                                        <div className="flex justify-around items-end h-24 gap-2">
                                            {attendance.weekly.map((val, i) => (
                                                <div key={i} className="flex flex-col items-center gap-2 w-full">
                                                    <div
                                                        className={`w-full rounded-t-lg transition-all ${val === 100 ? 'bg-primary' : val >= 80 ? 'bg-primary/60' : 'bg-rose-500'}`}
                                                        style={{ height: `${val}%` }}
                                                    />
                                                    <span className="text-[10px] text-muted-foreground font-medium uppercase">W{i + 1}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="pt-4 border-t border-border/40 flex justify-between items-center text-sm">
                                            <span className="text-muted-foreground">Monthly Average</span>
                                            <span className="font-bold text-primary">{attendance.monthlyAvg}%</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-32 flex items-center justify-center text-muted-foreground text-sm italic">
                                        No attendance data available
                                    </div>
                                )}
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
                                                            <Badge variant="secondary" className={`text-[10px] font-bold px-2 py-0 h-4 uppercase ${taskStatusStyles[task.status]}`}>
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
            </div>
        </DashboardLayout>
    );
};

export default InternDetails;
