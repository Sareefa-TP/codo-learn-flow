import { useState, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
    Users, BookOpen, UserCheck, FileText, Activity, Eye, Play, Plus
} from "lucide-react";

//  Types
interface InternPerformance {
    id: string;
    internName: string;
    track: string;
    tasksAssigned: number;
    tasksCompleted: number;
    attendancePresent: number;
    attendanceTotal: number;
    reportsSubmitted: number;
    reportsExpected: number;
    taskPercentage?: number;
    attPercentage?: number;
    score?: number;
}

//  Mock Data
const internData: InternPerformance[] = [
    {
        id: "INT-001", internName: "Aarav Singh", track: "Full Stack - Mar 2026",
        tasksAssigned: 10, tasksCompleted: 9,
        attendancePresent: 28, attendanceTotal: 30,
        reportsSubmitted: 4, reportsExpected: 4
    },
    {
        id: "INT-002", internName: "Priya Sharma", track: "Full Stack - Mar 2026",
        tasksAssigned: 10, tasksCompleted: 10,
        attendancePresent: 30, attendanceTotal: 30,
        reportsSubmitted: 4, reportsExpected: 4
    },
    {
        id: "INT-003", internName: "Sneha Verma", track: "Full Stack - Mar 2026",
        tasksAssigned: 10, tasksCompleted: 6,
        attendancePresent: 22, attendanceTotal: 30,
        reportsSubmitted: 2, reportsExpected: 4
    },
    {
        id: "INT-004", internName: "Rahul Mehta", track: "Full Stack - Mar 2026",
        tasksAssigned: 10, tasksCompleted: 8,
        attendancePresent: 26, attendanceTotal: 30,
        reportsSubmitted: 3, reportsExpected: 4
    },
    {
        id: "INT-005", internName: "Karan Nair", track: "Full Stack - Mar 2026",
        tasksAssigned: 10, tasksCompleted: 4,
        attendancePresent: 15, attendanceTotal: 30,
        reportsSubmitted: 1, reportsExpected: 4
    },
];

//  Helpers
const getStatusBadge = (score: number) => {
    if (score >= 85) return { label: "Excellent", className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" };
    if (score >= 70) return { label: "Good", className: "bg-blue-500/10 text-blue-600 border-blue-500/20" };
    if (score >= 50) return { label: "Average", className: "bg-amber-500/10 text-amber-600 border-amber-500/20" };
    return { label: "Needs Attention", className: "bg-rose-500/10 text-rose-600 border-rose-500/20" };
};

const MentorPerformance = () => {

    const [modalOpen, setModalOpen] = useState(false);
    const [activeIntern, setActiveIntern] = useState<InternPerformance | null>(null);

    const openDetails = (intern: InternPerformance) => {
        setActiveIntern(intern);
        setModalOpen(true);
    };

    // Calculate processed list
    const processedInterns = useMemo(() => {
        return internData.map(intern => {
            const taskVal = intern.tasksAssigned > 0 ? (intern.tasksCompleted / intern.tasksAssigned) * 100 : 0;
            const attVal = intern.attendanceTotal > 0 ? (intern.attendancePresent / intern.attendanceTotal) * 100 : 0;
            const repVal = intern.reportsExpected > 0 ? (intern.reportsSubmitted / intern.reportsExpected) * 100 : 0;

            // Score Weighting: Task 50%, Attendance 30%, Reports 20%
            const score = (taskVal * 0.50) + (attVal * 0.30) + (repVal * 0.20);

            return {
                ...intern,
                taskPercentage: Math.round(taskVal),
                attPercentage: Math.round(attVal),
                score: Math.round(score),
            };
        });
    }, []);

    // Global Stats
    const metrics = useMemo(() => {
        const totalInterns = processedInterns.length;
        if (totalInterns === 0) return { total: 0, avgTask: 0, attRate: 0, reportsSubmitted: 0, reportsExpected: 0 };

        const avgTask = processedInterns.reduce((acc, curr) => acc + curr.taskPercentage, 0) / totalInterns;
        const attRate = processedInterns.reduce((acc, curr) => acc + curr.attPercentage, 0) / totalInterns;
        const totalRepSub = processedInterns.reduce((acc, curr) => acc + curr.reportsSubmitted, 0);
        const totalRepExp = processedInterns.reduce((acc, curr) => acc + curr.reportsExpected, 0);

        return {
            total: totalInterns,
            avgTask: Math.round(avgTask),
            attRate: Math.round(attRate),
            reportsSubmitted: totalRepSub,
            reportsExpected: totalRepExp,
        };
    }, [processedInterns]);

    return (
        <DashboardLayout>
            <div className="animate-fade-in space-y-8 max-w-7xl mx-auto pb-10">

                {/*  Page Header  */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Intern Performance</h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Monitor intern progress, task completion, attendance, and weekly report submissions.
                        </p>
                    </div>
                </div>

                {/*  Summary Cards  */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="border-border/50 shadow-sm rounded-xl">
                        <CardContent className="p-5 flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                <Users className="w-4 h-4" />
                                <span className="text-sm font-medium">Total Interns</span>
                            </div>
                            <span className="text-2xl font-bold">{metrics.total}</span>
                        </CardContent>
                    </Card>
                    <Card className="border-border/50 shadow-sm rounded-xl">
                        <CardContent className="p-5 flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-primary/80 mb-1">
                                <BookOpen className="w-4 h-4" />
                                <span className="text-sm font-medium">Task Completion</span>
                            </div>
                            <span className="text-2xl font-bold">{metrics.avgTask}%</span>
                        </CardContent>
                    </Card>
                    <Card className="border-border/50 shadow-sm rounded-xl">
                        <CardContent className="p-5 flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-emerald-600 mb-1">
                                <UserCheck className="w-4 h-4" />
                                <span className="text-sm font-medium">Attendance Rate</span>
                            </div>
                            <span className="text-2xl font-bold">{metrics.attRate}%</span>
                        </CardContent>
                    </Card>
                    <Card className="border-border/50 shadow-sm rounded-xl">
                        <CardContent className="p-5 flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-blue-600 mb-1">
                                <FileText className="w-4 h-4" />
                                <span className="text-sm font-medium">Reports Submitted</span>
                            </div>
                            <span className="text-2xl font-bold">{metrics.reportsSubmitted} <span className="text-muted-foreground text-lg">/ {metrics.reportsExpected}</span></span>
                        </CardContent>
                    </Card>
                </div>

                {/*  Intern Performance Table  */}
                <Card className="border-border/50 shadow-sm rounded-xl overflow-hidden">
                    <div className="p-4 bg-muted/30 border-b border-border/40 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-primary" />
                        <h2 className="font-semibold text-lg">Performance Leaderboard</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/10">
                                    <TableHead className="font-semibold w-[180px]">Intern Name</TableHead>
                                    <TableHead className="font-semibold">Track</TableHead>
                                    <TableHead className="font-semibold text-center">Tasks Assig.</TableHead>
                                    <TableHead className="font-semibold text-center">Tasks Comp.</TableHead>
                                    <TableHead className="font-semibold text-center">Task %</TableHead>
                                    <TableHead className="font-semibold text-center">Att. %</TableHead>
                                    <TableHead className="font-semibold text-center">Reports</TableHead>
                                    <TableHead className="font-semibold text-center text-primary">Score</TableHead>
                                    <TableHead className="font-semibold">Status</TableHead>
                                    <TableHead className="font-semibold text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {processedInterns.map(intern => {
                                    const status = getStatusBadge(intern.score);
                                    return (
                                        <TableRow key={intern.id} className="hover:bg-muted/5 transition-colors group">
                                            <TableCell className="font-medium text-sm whitespace-nowrap">{intern.internName}</TableCell>
                                            <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{intern.track}</TableCell>
                                            <TableCell className="text-center text-sm">{intern.tasksAssigned}</TableCell>
                                            <TableCell className="text-center text-sm">{intern.tasksCompleted}</TableCell>
                                            <TableCell className="text-center text-sm font-medium">{intern.taskPercentage}%</TableCell>
                                            <TableCell className="text-center text-sm font-medium">{intern.attPercentage}%</TableCell>
                                            <TableCell className="text-center text-sm">{intern.reportsSubmitted} / {intern.reportsExpected}</TableCell>
                                            <TableCell className="text-center text-sm font-bold text-primary">{intern.score}%</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={`text-[10px] font-semibold whitespace-nowrap ${status.className}`}>
                                                    {status.label}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button size="sm" variant="outline" className="gap-1.5 h-8 text-xs" onClick={() => openDetails(intern)}>
                                                    <Eye className="w-3.5 h-3.5" /> View Details
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </Card>

                {/*  Details Modal Placeholder  */}
                <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                    <DialogContent className="sm:max-w-[500px] border-border/50 shadow-lg">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold">Performance Details</DialogTitle>
                        </DialogHeader>

                        {activeIntern && (
                            <div className="space-y-4 py-4">
                                <div className="p-4 bg-muted/20 border border-border/40 rounded-xl space-y-4">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Intern Name</p>
                                        <p className="text-lg font-bold mt-1">{activeIntern.internName}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Task Completion</p>
                                            <p className="text-2xl font-bold mt-1 text-primary">{activeIntern.taskPercentage}%</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">{activeIntern.tasksCompleted} / {activeIntern.tasksAssigned} tasks</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Attendance</p>
                                            <p className="text-2xl font-bold mt-1 text-emerald-600">{activeIntern.attPercentage}%</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">{activeIntern.attendancePresent} / {activeIntern.attendanceTotal} days</p>
                                        </div>
                                        <div className="col-span-2 border-t border-border/40 pt-4 mt-2">
                                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Weekly Reports</p>
                                            <p className="text-2xl font-bold mt-1 text-blue-600">{activeIntern.reportsSubmitted} <span className="text-muted-foreground text-xl">/ {activeIntern.reportsExpected}</span></p>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-border/40 flex justify-between items-center">
                                        <p className="text-sm font-semibold text-muted-foreground">Overall Score</p>
                                        <Badge variant="outline" className={`px-2 py-1 text-sm ${getStatusBadge(activeIntern.score).className}`}>
                                            {activeIntern.score}% - {getStatusBadge(activeIntern.score).label}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        )}

                        <DialogFooter>
                            <Button onClick={() => setModalOpen(false)}>Close</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

            </div>
        </DashboardLayout>
    );
};

export default MentorPerformance;
