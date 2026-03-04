import { useMemo, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCheck, FileText, AlertTriangle, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// --- Mock Data ---
const initialStudents = [
    { id: 1, name: "A", batchId: 1 },
    { id: 2, name: "B", batchId: 1 },
    { id: 3, name: "C", batchId: 2 }
];

const initialAttendanceRecords = [
    { studentId: 1, status: "Present", date: "2026-02-28T10:00:00Z" },
    { studentId: 1, status: "Absent", date: "2026-01-15T10:00:00Z" }, // Older record
    { studentId: 2, status: "Present", date: "2026-02-25T10:00:00Z" },
    { studentId: 3, status: "Present", date: "2026-02-10T10:00:00Z" } // 30 days range
];

const initialAssignments = [
    { id: 1, batchId: 1 },
    { id: 2, batchId: 2 }
];

const initialSubmissions = [
    { assignmentId: 1, studentId: 1, date: "2026-02-27T10:00:00Z" },
    { assignmentId: 1, studentId: 2, date: "2026-02-15T10:00:00Z" }
];

const initialTutors = [
    { id: 1, name: "Tutor A", avgReviewDays: 2 },
    { id: 2, name: "Tutor B", avgReviewDays: 5 }
];

const AdminReports = () => {
    // Using useState to align with requirements, though we're strictly reading them.
    const [students] = useState(initialStudents);
    const [attendanceRecords] = useState(initialAttendanceRecords);
    const [assignments] = useState(initialAssignments);
    const [submissions] = useState(initialSubmissions);
    const [tutors] = useState(initialTutors);

    const [activeReport, setActiveReport] = useState<null | string>(null);
    const [selectedBatch, setSelectedBatch] = useState("all");
    const [dateRange, setDateRange] = useState("all");

    // --- Dynamic Filtering ---
    const filteredDataset = useMemo(() => {
        const now = new Date("2026-02-28T21:54:09+05:30"); // System fixed logic check
        let thresholdDate: Date | null = null;

        if (dateRange === "7days") {
            thresholdDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        } else if (dateRange === "30days") {
            thresholdDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        }

        // Filter valid students based on active batch selected.
        const validStudentIds = new Set(
            students
                .filter(s => selectedBatch === "all" || s.batchId.toString() === selectedBatch)
                .map(s => s.id)
        );

        const filteredAttendance = attendanceRecords.filter(r => {
            if (!validStudentIds.has(r.studentId)) return false;
            if (thresholdDate && r.date) {
                return new Date(r.date) >= thresholdDate;
            }
            return true;
        });

        // Filter assignments matching current batch scope.
        const filteredAssignments = assignments.filter(a => {
            return selectedBatch === "all" || a.batchId.toString() === selectedBatch;
        });

        const validAssignmentIds = new Set(filteredAssignments.map(a => a.id));

        const filteredSubmissions = submissions.filter(s => {
            if (!validStudentIds.has(s.studentId)) return false;
            if (!validAssignmentIds.has(s.assignmentId)) return false;
            if (thresholdDate && s.date) {
                return new Date(s.date) >= thresholdDate;
            }
            return true;
        });

        return {
            students: students.filter(s => selectedBatch === "all" || s.batchId.toString() === selectedBatch),
            attendanceRecords: filteredAttendance,
            assignments: filteredAssignments,
            submissions: filteredSubmissions,
            tutors: tutors // Keep untouched for generic performance scope unless bounded to batch mapping later.
        };
    }, [students, attendanceRecords, assignments, submissions, tutors, selectedBatch, dateRange]);


    // --- Calculations ---
    const averageAttendance = useMemo(() => {
        if (filteredDataset.attendanceRecords.length === 0) return 0;
        const presentCount = filteredDataset.attendanceRecords.filter(r => r.status === "Present").length;
        return (presentCount / filteredDataset.attendanceRecords.length) * 100;
    }, [filteredDataset]);

    const assignmentSubmissionRate = useMemo(() => {
        let expectedSubmissions = 0;
        filteredDataset.assignments.forEach(assignment => {
            const batchStudents = filteredDataset.students.filter(s => s.batchId === assignment.batchId);
            expectedSubmissions += batchStudents.length;
        });

        if (expectedSubmissions === 0) return 0;
        return (filteredDataset.submissions.length / expectedSubmissions) * 100;
    }, [filteredDataset]);

    const riskStudentsCount = useMemo(() => {
        let riskCount = 0;

        filteredDataset.students.forEach(student => {
            // Calculate individual attendance
            const studentRecords = filteredDataset.attendanceRecords.filter(r => r.studentId === student.id);
            let attendancePercentage = 100; // Assume 100% if no records exist
            if (studentRecords.length > 0) {
                const presentCnt = studentRecords.filter(r => r.status === "Present").length;
                attendancePercentage = (presentCnt / studentRecords.length) * 100;
            }

            // Calculate missed assignments
            const studentExpectedAssignments = filteredDataset.assignments.filter(a => a.batchId === student.batchId);
            const studentActualSubmissions = filteredDataset.submissions.filter(s => s.studentId === student.id);
            const missedAssignments = studentExpectedAssignments.length - studentActualSubmissions.length;

            // Risk condition Check
            if (attendancePercentage < 75 || missedAssignments > 1) {
                riskCount++;
            }
        });

        return riskCount;
    }, [filteredDataset]);

    const tutorsNeedAttention = useMemo(() => {
        return filteredDataset.tutors.filter(t => t.avgReviewDays > 3).length;
    }, [filteredDataset]);

    return (
        <DashboardLayout>
            <div className="animate-fade-in space-y-6 lg:space-y-8 max-w-7xl mx-auto pb-10">

                {/* Header & Controls Array */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-2">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
                            Reports
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Key Performance Indicators across active cohorts and staff operations.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Date Range:</span>
                            <Select value={dateRange} onValueChange={setDateRange}>
                                <SelectTrigger className="w-full sm:w-[150px] bg-background">
                                    <SelectValue placeholder="All Time" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Time</SelectItem>
                                    <SelectItem value="7days">Last 7 Days</SelectItem>
                                    <SelectItem value="30days">Last 30 Days</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Batch:</span>
                            <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                                <SelectTrigger className="w-full sm:w-[150px] bg-background">
                                    <SelectValue placeholder="All Batches" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Batches</SelectItem>
                                    {Array.from(new Set(students.map(s => s.batchId))).map(bId => (
                                        <SelectItem key={bId} value={bId.toString()}>Batch {bId}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* 4 Equal KPI Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">

                    <Card
                        className={`border-border/50 shadow-sm relative overflow-hidden cursor-pointer transition-all hover:border-blue-500/50 hover:shadow-md ${activeReport === "attendance" ? "ring-2 ring-blue-500 bg-blue-50/50 dark:bg-blue-950/20" : ""}`}
                        onClick={() => setActiveReport("attendance")}
                    >
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className={`text-sm font-medium z-10 ${activeReport === "attendance" ? "text-blue-700 dark:text-blue-400" : "text-muted-foreground"}`}>
                                Average Attendance
                            </CardTitle>
                            <div className="w-8 h-8 rounded-full bg-blue-100/50 flex items-center justify-center z-10">
                                <UserCheck className="w-4 h-4 text-blue-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">
                                {averageAttendance.toFixed(1)}%
                            </div>
                        </CardContent>
                    </Card>

                    <Card
                        className={`border-border/50 shadow-sm relative overflow-hidden cursor-pointer transition-all hover:border-indigo-500/50 hover:shadow-md ${activeReport === "submission" ? "ring-2 ring-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20" : ""}`}
                        onClick={() => setActiveReport("submission")}
                    >
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className={`text-sm font-medium z-10 ${activeReport === "submission" ? "text-indigo-700 dark:text-indigo-400" : "text-muted-foreground"}`}>
                                Submission Rate
                            </CardTitle>
                            <div className="w-8 h-8 rounded-full bg-indigo-100/50 flex items-center justify-center z-10">
                                <FileText className="w-4 h-4 text-indigo-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">
                                {assignmentSubmissionRate.toFixed(1)}%
                            </div>
                        </CardContent>
                    </Card>

                    <Card
                        className={`border-border/50 shadow-sm relative overflow-hidden cursor-pointer transition-all hover:border-destructive/50 hover:shadow-md ${activeReport === "risk" ? "ring-2 ring-destructive bg-destructive/10" : ""}`}
                        onClick={() => setActiveReport("risk")}
                    >
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className={`text-sm font-medium z-10 ${activeReport === "risk" ? "text-destructive" : "text-muted-foreground"}`}>
                                Risk Students
                            </CardTitle>
                            <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center z-10">
                                <AlertTriangle className="w-4 h-4 text-destructive" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">
                                {riskStudentsCount}
                            </div>
                        </CardContent>
                    </Card>

                    <Card
                        className={`border-border/50 shadow-sm relative overflow-hidden cursor-pointer transition-all hover:border-amber-500/50 hover:shadow-md ${activeReport === "tutor" ? "ring-2 ring-amber-500 bg-amber-50/50 dark:bg-amber-950/20" : ""}`}
                        onClick={() => setActiveReport("tutor")}
                    >
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className={`text-sm font-medium z-10 ${activeReport === "tutor" ? "text-amber-700 dark:text-amber-400" : "text-muted-foreground"}`}>
                                Tutor Performance
                            </CardTitle>
                            <div className="w-8 h-8 rounded-full bg-amber-100/50 flex items-center justify-center z-10">
                                <Users className="w-4 h-4 text-amber-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">
                                {tutorsNeedAttention}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Tutors Need Attention
                            </p>
                        </CardContent>
                    </Card>

                </div>

                {/* --- Dynamic Detail Tables --- */}
                {activeReport === "attendance" && (
                    <Card className="border-border/50 shadow-sm animate-fade-in fade-in-0 duration-300">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Detailed Attendance View</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-muted/30">
                                    <TableRow>
                                        <TableHead className="pl-6">Student Name</TableHead>
                                        <TableHead>Batch</TableHead>
                                        <TableHead>Attendance %</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredDataset.students.map(student => {
                                        const studentRecords = filteredDataset.attendanceRecords.filter(r => r.studentId === student.id);
                                        let attendancePercentage = 100;
                                        if (studentRecords.length > 0) {
                                            const presentCnt = studentRecords.filter(r => r.status === "Present").length;
                                            attendancePercentage = Math.round((presentCnt / studentRecords.length) * 100);
                                        }

                                        let statusLabel = "Good";
                                        let badgeColor = "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";

                                        if (attendancePercentage < 60) {
                                            statusLabel = "Critical";
                                            badgeColor = "bg-destructive/10 text-destructive border-destructive/20";
                                        } else if (attendancePercentage < 80) {
                                            statusLabel = "Warning";
                                            badgeColor = "bg-amber-500/10 text-amber-600 border-amber-500/20";
                                        }

                                        return (
                                            <TableRow key={student.id} className="hover:bg-muted/20">
                                                <TableCell className="pl-6 font-medium">{student.name}</TableCell>
                                                <TableCell>Batch {student.batchId}</TableCell>
                                                <TableCell>{attendancePercentage}%</TableCell>
                                                <TableCell>
                                                    <Badge className={`shadow-none hover:${badgeColor} ${badgeColor}`}>{statusLabel}</Badge>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}

                {activeReport === "submission" && (
                    <Card className="border-border/50 shadow-sm animate-fade-in fade-in-0 duration-300">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Detailed Submission View</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-muted/30">
                                    <TableRow>
                                        <TableHead className="pl-6">Assignment</TableHead>
                                        <TableHead>Batch</TableHead>
                                        <TableHead className="text-center">Total Students</TableHead>
                                        <TableHead className="text-center">Submitted</TableHead>
                                        <TableHead className="text-center">Pending</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredDataset.assignments.map(assignment => {
                                        const batchStudentsCount = filteredDataset.students.filter(s => s.batchId === assignment.batchId).length;
                                        const actualSubmissions = filteredDataset.submissions.filter(s => s.assignmentId === assignment.id).length;
                                        const pending = batchStudentsCount - actualSubmissions;

                                        return (
                                            <TableRow key={assignment.id} className="hover:bg-muted/20">
                                                <TableCell className="pl-6 font-medium">Assignment {assignment.id}</TableCell>
                                                <TableCell>Batch {assignment.batchId}</TableCell>
                                                <TableCell className="text-center">{batchStudentsCount}</TableCell>
                                                <TableCell className="text-center font-medium text-emerald-600">{actualSubmissions}</TableCell>
                                                <TableCell className="text-center font-medium text-destructive">{pending}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}

                {activeReport === "risk" && (
                    <Card className="border-border/50 shadow-sm animate-fade-in fade-in-0 duration-300">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Detailed Risk Students View</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-muted/30">
                                    <TableRow>
                                        <TableHead className="pl-6">Student Name</TableHead>
                                        <TableHead>Batch</TableHead>
                                        <TableHead className="text-center">Attendance %</TableHead>
                                        <TableHead className="text-center">Missed Assignments</TableHead>
                                        <TableHead>Risk Reason</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredDataset.students.map(student => {
                                        // Calculate attendance
                                        const studentRecords = filteredDataset.attendanceRecords.filter(r => r.studentId === student.id);
                                        let attendancePercentage = 100;
                                        if (studentRecords.length > 0) {
                                            const presentCnt = studentRecords.filter(r => r.status === "Present").length;
                                            attendancePercentage = Math.round((presentCnt / studentRecords.length) * 100);
                                        }

                                        // Calculate missed assignments
                                        const studentExpectedAssignments = filteredDataset.assignments.filter(a => a.batchId === student.batchId);
                                        const studentActualSubmissions = filteredDataset.submissions.filter(s => s.studentId === student.id);
                                        const missedAssignments = studentExpectedAssignments.length - studentActualSubmissions.length;

                                        if (attendancePercentage >= 75 && missedAssignments <= 1) {
                                            return null; // Don't render if not at risk
                                        }

                                        let reason = [];
                                        if (attendancePercentage < 75) reason.push(`Low Attendance (${attendancePercentage}%)`);
                                        if (missedAssignments > 1) reason.push(`Missed ${missedAssignments} Assignments`);

                                        return (
                                            <TableRow key={`risk-${student.id}`} className="hover:bg-muted/20">
                                                <TableCell className="pl-6 font-medium">{student.name}</TableCell>
                                                <TableCell>Batch {student.batchId}</TableCell>
                                                <TableCell className="text-center">{attendancePercentage}%</TableCell>
                                                <TableCell className="text-center text-destructive font-medium">{missedAssignments}</TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-1">
                                                        {reason.map((r, idx) => (
                                                            <span key={idx} className="text-xs text-destructive bg-destructive/10 px-2 py-0.5 rounded-sm inline-block w-max">
                                                                {r}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}

                {activeReport === "tutor" && (
                    <Card className="border-border/50 shadow-sm animate-fade-in fade-in-0 duration-300">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Detailed Tutor Performance</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-muted/30">
                                    <TableRow>
                                        <TableHead className="pl-6">Tutor Name</TableHead>
                                        <TableHead className="text-center">Avg Review Days</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredDataset.tutors.map(tutor => {
                                        const isAttention = tutor.avgReviewDays > 3;
                                        const badgeClass = isAttention ? "bg-amber-500/10 text-amber-600 border-amber-500/20" : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";

                                        return (
                                            <TableRow key={tutor.id} className="hover:bg-muted/20">
                                                <TableCell className="pl-6 font-medium">{tutor.name}</TableCell>
                                                <TableCell className="text-center">
                                                    <span className={isAttention ? "text-amber-600 font-medium" : "text-emerald-600 font-medium"}>
                                                        {tutor.avgReviewDays} Days
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={`shadow-none hover:${badgeClass} ${badgeClass}`}>
                                                        {isAttention ? "Needs Attention" : "Good"}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}

            </div>
        </DashboardLayout>
    );
};

export default AdminReports;
