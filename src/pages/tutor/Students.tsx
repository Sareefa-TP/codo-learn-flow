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
import { Progress } from "@/components/ui/progress";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Users,
    Search,
    BookOpen,
    ClipboardList,
    TrendingUp,
    CheckCircle2,
    XCircle,
    Clock,
    User,
    Mail,
    ArrowRight
} from "lucide-react";
import { useState, useEffect } from "react";

// Helper function to auto-calculate progress
const calculateProgress = (graded: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((graded / total) * 100);
};

// Demo Data mapped with auto-calculated progress
const initialStudentList = [
    { id: 1, name: "Aarav Sharma", batch: "Jan 2026 Batch", email: "aarav.s@example.com", gradedAssignments: 4, totalAssignments: 5, avgMarks: 88 },
    { id: 2, name: "Diya Patel", batch: "Oct 2025 Batch", email: "diya.p@example.com", gradedAssignments: 3, totalAssignments: 5, avgMarks: 75 },
    { id: 3, name: "Kabir Singh", batch: "Jan 2026 Batch", email: "kabir.s@example.com", gradedAssignments: 2, totalAssignments: 5, avgMarks: 45 },
    { id: 4, name: "Ananya Iyer", batch: "Oct 2025 Batch", email: "ananya.i@example.com", gradedAssignments: 5, totalAssignments: 5, avgMarks: 92 },
    { id: 5, name: "Rohan Das", batch: "Feb 2026 Batch - Evening", email: "rohan.d@example.com", gradedAssignments: 4, totalAssignments: 5, avgMarks: 78 },
    { id: 6, name: "Meera Reddy", batch: "Jan 2026 Batch", email: "meera.r@example.com", gradedAssignments: 1, totalAssignments: 5, avgMarks: 30 },
    { id: 7, name: "Vikram Gupta", batch: "Oct 2025 Batch", email: "vikram.g@example.com", gradedAssignments: 5, totalAssignments: 5, avgMarks: 85 },
].map((student) => {
    const progress = calculateProgress(student.gradedAssignments, student.totalAssignments);
    return {
        ...student,
        progress,
        status: progress === 100 ? "Completed" : "Active"
    };
});

// Dynamic mock mapping for Assignments table
// (In a real app, this would be retrieved dynamically mapped by studentId)
const getAssignmentsForStudent = (studentId: number) => {
    const assignments = [
        { id: "A1", name: "HTML Portfolio Project", marks: 90, result: "Pass", status: "Graded" },
        { id: "A2", name: "CSS Grid Fundamentals", marks: 85, result: "Pass", status: "Graded" },
        { id: "A3", name: "Javascript Async Concepts", marks: null, result: "-", status: "Pending" },
        { id: "A4", name: "React Hooks Deep Dive", marks: 45, result: "Fail", status: "Graded" },
        { id: "A5", name: "API Integration Capstone", marks: null, result: "-", status: "Pending" }
    ];

    // Simulate grading based on the student's graded assignments count
    const student = initialStudentList.find(s => s.id === studentId);
    if (!student) return assignments;

    return assignments.map((assignment, index) => {
        if (index < student.gradedAssignments) {
            // Simulate a graded Assignment
            return { ...assignment, marks: assignment.marks || student.avgMarks, result: (assignment.marks || student.avgMarks) >= 40 ? "Pass" : "Fail", status: "Graded" };
        }
        // Simulate pending
        return { ...assignment, marks: null, result: "-", status: "Pending" };
    });
};

const TutorStudents = () => {
    const [students, setStudents] = useState(initialStudentList);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStudent, setSelectedStudent] = useState<typeof initialStudentList[0] | null>(null);

    // This generic recalculation function exposes a purely frontend logic hook
    // that could theoretically be called when tutor grades an assignment.
    const recalculateAndSyncStudentProgress = (studentId: number, newlyGradedCount: number) => {
        setStudents(prev => prev.map(s => {
            if (s.id === studentId) {
                const newProgress = calculateProgress(newlyGradedCount, s.totalAssignments);
                const updatedStudent = {
                    ...s,
                    gradedAssignments: newlyGradedCount,
                    progress: newProgress,
                    status: newProgress === 100 ? "Completed" : "Active"
                };

                // If they are currently active in the modal, update local select state too
                if (selectedStudent?.id === studentId) {
                    setSelectedStudent(updatedStudent);
                }
                return updatedStudent;
            }
            return s;
        }));
    };

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.batch.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <DashboardLayout>
            <div className="animate-fade-in space-y-6 lg:space-y-8 max-w-6xl mx-auto pb-10">

                {/* Header Section */}
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
                        Students
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Overview and progress metrics for all students assigned to your Learning Phase cohorts.
                    </p>
                </div>

                {/* Students Table Card */}
                <Card className="border-border/50 shadow-sm">
                    <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                            <Users className="w-5 h-5 text-primary" />
                            Student roster
                        </CardTitle>
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search name, email, or batch..."
                                className="pl-9 bg-muted/30"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-muted/30">
                                    <TableRow>
                                        <TableHead className="pl-6 w-[250px]">Student Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Batch</TableHead>
                                        <TableHead className="w-[20%]">Progress</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="pr-6 text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredStudents.length > 0 ? (
                                        filteredStudents.map((student) => (
                                            <TableRow key={student.id} className="hover:bg-muted/20 transition-colors">
                                                <TableCell className="pl-6 font-medium">
                                                    <button
                                                        className="text-primary hover:underline font-semibold focus:outline-none focus:ring-2 focus:ring-primary/50 rounded px-1 -mx-1"
                                                        onClick={() => setSelectedStudent(student)}
                                                    >
                                                        {student.name}
                                                    </button>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground text-sm">
                                                    {student.email}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary" className="font-normal text-muted-foreground">
                                                        {student.batch}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Progress value={student.progress} className="h-2 flex-1 min-w-[100px]" />
                                                        <span className="text-xs font-medium text-muted-foreground w-8">{student.progress}%</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {student.status === "Completed" ? (
                                                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Completed</Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">Active</Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="pr-6 text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-primary hover:bg-primary/10 font-bold gap-2"
                                                        onClick={() => setSelectedStudent(student)}
                                                    >
                                                        View Profile
                                                        <ArrowRight className="w-4 h-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                                No students found matching "{searchQuery}"
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

            </div>

            {/* Student Quick View Modal */}
            <Dialog open={!!selectedStudent} onOpenChange={(open) => !open && setSelectedStudent(null)}>
                <DialogContent className="sm:max-w-[700px] h-[85vh] sm:h-auto sm:max-h-[90vh] overflow-y-auto flex flex-col p-0">
                    <DialogHeader className="p-6 pb-4 border-b border-border/50 bg-muted/10">
                        <DialogTitle className="text-xl flex items-center gap-2">
                            <User className="w-5 h-5 text-primary" />
                            Student Overview
                        </DialogTitle>
                    </DialogHeader>

                    {selectedStudent && (
                        <div className="p-6 space-y-6 flex-1 overflow-y-auto">

                            {/* Section 1 - Basic Info */}
                            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">Student Name</p>
                                    <p className="font-semibold text-foreground text-lg">{selectedStudent.name}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                                    <div className="flex items-center gap-2 text-foreground">
                                        <Mail className="w-4 h-4 text-muted-foreground" />
                                        {selectedStudent.email}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">Batch</p>
                                    <div className="flex items-center gap-2">
                                        <BookOpen className="w-4 h-4 text-muted-foreground" />
                                        <Badge variant="secondary" className="font-normal">{selectedStudent.batch}</Badge>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">Phase & Status</p>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Learning Phase</Badge>
                                        {selectedStudent.status === "Completed" ? (
                                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Completed</Badge>
                                        ) : (
                                            <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">Active</Badge>
                                        )}
                                    </div>
                                </div>
                            </section>

                            {/* Section 2 - Progress Overview */}
                            <section>
                                <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2 uppercase tracking-wide">
                                    <TrendingUp className="w-4 h-4 text-primary" />
                                    Progress Overview
                                </h4>
                                <Card className="border-border/50 shadow-sm bg-muted/10">
                                    <CardContent className="p-4 sm:p-5 space-y-6">

                                        <div>
                                            <div className="flex justify-between items-end mb-2">
                                                <span className="text-sm font-medium text-muted-foreground">Course Progress</span>
                                                <span className="font-bold text-foreground text-lg">{selectedStudent.progress}%</span>
                                            </div>
                                            <Progress value={selectedStudent.progress} className="h-2.5" />
                                        </div>

                                        <div className="grid grid-cols-3 gap-4 divide-x divide-border/50">
                                            <div className="text-center">
                                                <p className="text-xs text-muted-foreground mb-1">Assignments Submitted</p>
                                                <p className="text-xl font-bold text-emerald-600">{selectedStudent.gradedAssignments}</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-xs text-muted-foreground mb-1">Assignments Pending</p>
                                                <p className="text-xl font-bold text-orange-600">{selectedStudent.totalAssignments - selectedStudent.gradedAssignments}</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-xs text-muted-foreground mb-1">Average Marks</p>
                                                <p className="text-xl font-bold text-blue-600">{selectedStudent.avgMarks}%</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </section>

                            {/* Section 3 - Assignment Performance Table */}
                            <section>
                                <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2 uppercase tracking-wide">
                                    <ClipboardList className="w-4 h-4 text-primary" />
                                    Assignment Performance
                                </h4>
                                <Card className="border-border/50 shadow-sm overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader className="bg-muted/30">
                                                <TableRow>
                                                    <TableHead className="w-[200px] pl-4">Assignment Name</TableHead>
                                                    <TableHead className="text-center">Marks</TableHead>
                                                    <TableHead className="text-center">Result</TableHead>
                                                    <TableHead className="pr-4 text-right">Status</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {getAssignmentsForStudent(selectedStudent.id).map((assignment) => (
                                                    <TableRow key={assignment.id} className="hover:bg-muted/20 transition-colors group">
                                                        <TableCell className="pl-4 font-medium text-foreground">
                                                            {assignment.name}
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            {assignment.status === "Graded" ? (
                                                                <span className="font-semibold">{assignment.marks}/100</span>
                                                            ) : (
                                                                <span className="text-muted-foreground text-xl">—</span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            {assignment.result === "Pass" ? (
                                                                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 gap-1.5 font-medium">
                                                                    <CheckCircle2 className="w-3.5 h-3.5" /> Pass
                                                                </Badge>
                                                            ) : assignment.result === "Fail" ? (
                                                                <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 gap-1.5 font-medium">
                                                                    <XCircle className="w-3.5 h-3.5" /> Fail
                                                                </Badge>
                                                            ) : (
                                                                <span className="text-muted-foreground">—</span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="pr-4 text-right">
                                                            {assignment.status === "Graded" ? (
                                                                <Badge variant="secondary" className="font-normal text-muted-foreground">
                                                                    Graded
                                                                </Badge>
                                                            ) : (
                                                                <Badge variant="outline" className="font-normal text-orange-600 border-orange-500/20 bg-orange-500/10 gap-1.5">
                                                                    <Clock className="w-3 h-3" /> Pending
                                                                </Badge>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </Card>
                            </section>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

        </DashboardLayout>
    );
};

export default TutorStudents;
