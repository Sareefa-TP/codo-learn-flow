import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    ChevronLeft,
    User,
    Mail,
    BookOpen,
    Calendar,
    TrendingUp,
    ClipboardList,
    GraduationCap,
    Clock,
    PlusCircle,
    CheckCircle2,
    MessageSquare,
    FileText
} from "lucide-react";

// Mock Data
const studentData: Record<string, any> = {
    "S-101": {
        name: "Rahul Kumar",
        email: "rahul@email.com",
        photo: null,
        academicInfo: [
            { name: "Full Stack Development", status: "Ongoing", startDate: "15 Jan 2026", isCurrent: true },
            { name: "UI/UX Design Basics", status: "Completed", startDate: "10 Oct 2025", isCurrent: false },
        ],
        progressDetails: {
            percentage: 72,
            completedModules: 18,
            pendingModules: 7
        },
        assignmentStats: {
            total: 12,
            submitted: 9,
            pending: 3
        },
        attendance: {
            totalDays: 45,
            present: 42,
            absent: 3,
            percentage: 93.3
        },
        feedback: {
            fromTutor: [
                { date: "15 Mar 2026", text: "Excellent progress in React. Keep up the good work!" },
                { date: "01 Mar 2026", text: "Needs to focus more on state management concepts." }
            ],
            fromStudent: [
                { date: "10 Mar 2026", text: "The React sessions are very helpful. I'm enjoying the hands-on tasks." }
            ]
        },
        assessmentReport: {
            overallScore: 88,
            remarks: "Rahul is a dedicated student with a strong grasp of frontend technologies. He consistently submits assignments on time and participates actively in class discussions."
        },
        exams: [
            { name: "JavaScript Fundamentals", score: 92, result: "Pass", summary: "Strong logical thinking and syntax knowledge." },
            { name: "React Advanced Concepts", score: 85, result: "Pass", summary: "Good understanding of hooks and context API." },
            { name: "Node.js & Express", score: 45, result: "Fail", summary: "Needs rework on middleware and routing logic." }
        ],
        subjects: [
            { name: "HTML", progress: 100 },
            { name: "CSS", progress: 90 },
            { name: "JavaScript", progress: 65 },
            { name: "React", progress: 40 },
        ],
        assignments: [
            { name: "HTML Landing Page", date: "10 Feb 2026", status: "Submitted", grade: 85 },
            { name: "CSS Flexbox Task", date: "14 Feb 2026", status: "Submitted", grade: 90 },
            { name: "JS Calculator", date: "-", status: "Pending", grade: null },
            { name: "Portfolio Website", date: "-", status: "Not Started", grade: null },
        ]
    }
};

const StudentDashboard = () => {
    const { studentId } = useParams();
    const navigate = useNavigate();
    const [newNote, setNewNote] = useState("");

    // Default to Rahul Kumar if mock data doesn't exist for ID
    const student = studentData[studentId || "S-101"] || studentData["S-101"];

    const currentCourse = student.academicInfo.find((course: any) => course.isCurrent);

    return (
        <DashboardLayout>
            <div className="animate-fade-in space-y-6 lg:space-y-8 max-w-7xl mx-auto pb-10">

                {/* Back Button and Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="gap-2 -ml-2 text-muted-foreground hover:text-primary mb-2"
                            onClick={() => navigate(-1)}
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Back to Batch
                        </Button>
                        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
                            Student Profile
                        </h1>
                        <p className="text-muted-foreground text-sm">Detailed academic and performance analysis.</p>
                    </div>
                </div>

                {/* 1. Basic Information & Profile Header */}
                <Card className="border-border/50 shadow-sm rounded-xl overflow-hidden bg-gradient-to-br from-primary/[0.03] via-transparent to-transparent">
                    <CardContent className="p-8">
                        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                            <div className="relative group">
                                <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 border-2 border-primary/20 overflow-hidden shadow-inner">
                                    {student.photo ? (
                                        <img src={student.photo} alt={student.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-12 h-12 text-primary/60" />
                                    )}
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1 rounded-full border-2 border-background shadow-sm">
                                    <CheckCircle2 className="w-4 h-4" />
                                </div>
                            </div>
                            <div className="flex-1 space-y-4">
                                <div className="space-y-1">
                                    <h2 className="text-3xl font-black text-foreground tracking-tight">{student.name}</h2>
                                    <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                                        <div className="flex items-center gap-1.5 text-sm">
                                            <Mail className="w-4 h-4" />
                                            {student.email}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-sm">
                                            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/10 px-2 py-0 h-6">Student ID: {studentId || "S-101"}</Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 2. Academic Information (IMPORTANT) */}
                <Card className="border-border/50 shadow-sm rounded-xl overflow-hidden">
                    <CardHeader className="border-b border-border/40 bg-muted/20 pb-4">
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <GraduationCap className="w-5 h-5 text-primary" />
                            Academic Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {student.academicInfo.map((course: any, idx: number) => (
                                <div 
                                    key={idx} 
                                    className={`p-5 rounded-2xl border transition-all duration-300 ${
                                        course.isCurrent 
                                            ? "bg-primary/[0.02] border-primary/20 shadow-md shadow-primary/5 ring-1 ring-primary/10" 
                                            : "bg-muted/10 border-border/50 opacity-80"
                                    }`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`p-2 rounded-xl ${course.isCurrent ? "bg-primary/10" : "bg-muted"}`}>
                                            <BookOpen className={`w-5 h-5 ${course.isCurrent ? "text-primary" : "text-muted-foreground"}`} />
                                        </div>
                                        {course.isCurrent && (
                                            <Badge className="bg-primary text-primary-foreground text-[10px] uppercase font-bold tracking-wider">Current Course</Badge>
                                        )}
                                    </div>
                                    <h4 className="font-bold text-foreground text-lg mb-1">{course.name}</h4>
                                    <div className="space-y-3 mt-4">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-muted-foreground font-medium">Status</span>
                                            <Badge variant="outline" className={
                                                course.status === "Ongoing" 
                                                    ? "bg-amber-500/10 text-amber-600 border-amber-500/20" 
                                                    : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                            }>
                                                {course.status}
                                            </Badge>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-muted-foreground font-medium">Start Date</span>
                                            <span className="text-foreground font-semibold flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {course.startDate}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* 3. Progress */}
                <Card className="border-border/50 shadow-sm rounded-xl overflow-hidden">
                    <CardHeader className="border-b border-border/40 bg-muted/20 pb-4">
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-primary" />
                            Course Progress
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="flex flex-col md:flex-row items-center gap-10">
                            <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle
                                        cx="64"
                                        cy="64"
                                        r="58"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        fill="transparent"
                                        className="text-muted/30"
                                    />
                                    <circle
                                        cx="64"
                                        cy="64"
                                        r="58"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        fill="transparent"
                                        strokeDasharray={364.42}
                                        strokeDashoffset={364.42 - (364.42 * student.progressDetails.percentage) / 100}
                                        strokeLinecap="round"
                                        className="text-primary transition-all duration-1000 ease-out"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-2xl font-black text-foreground">{student.progressDetails.percentage}%</span>
                                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter text-center leading-none">Overall<br/>Complete</span>
                                </div>
                            </div>
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                                <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest leading-none mb-1">Completed</p>
                                        <p className="text-2xl font-black text-emerald-700">{student.progressDetails.completedModules} Modules</p>
                                    </div>
                                </div>
                                <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                                        <Clock className="w-6 h-6 text-amber-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-amber-600 uppercase tracking-widest leading-none mb-1">Pending</p>
                                        <p className="text-2xl font-black text-amber-700">{student.progressDetails.pendingModules} Modules</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 4. Assignments */}
                <Card className="border-border/50 shadow-sm rounded-xl overflow-hidden">
                    <CardHeader className="border-b border-border/40 bg-muted/20 pb-4">
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <ClipboardList className="w-5 h-5 text-primary" />
                            Assignments
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-8">
                        {/* Assignment Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="p-4 rounded-xl bg-muted/30 border border-border/40 text-center">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Assignments</p>
                                <p className="text-2xl font-black text-foreground">{student.assignmentStats.total}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-500/5 border border-emerald-500/20 text-center">
                                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Submitted</p>
                                <p className="text-2xl font-black text-emerald-600">{student.assignmentStats.submitted}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-500/5 border border-amber-500/20 text-center">
                                <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">Pending</p>
                                <p className="text-2xl font-black text-amber-600">{student.assignmentStats.pending}</p>
                            </div>
                        </div>

                        {/* Assignment Table */}
                        <div className="rounded-xl border border-border/50 overflow-hidden shadow-inner bg-muted/5">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/40 hover:bg-muted/40">
                                        <TableHead className="font-bold text-[10px] uppercase tracking-wider text-muted-foreground py-4">Assignment Name</TableHead>
                                        <TableHead className="font-bold text-[10px] uppercase tracking-wider text-muted-foreground py-4">Last Activity</TableHead>
                                        <TableHead className="font-bold text-[10px] uppercase tracking-wider text-muted-foreground py-4 text-center">Status</TableHead>
                                        <TableHead className="font-bold text-[10px] uppercase tracking-wider text-muted-foreground py-4 text-right">Score</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {student.assignments.map((assignment: any) => (
                                        <TableRow key={assignment.name} className="hover:bg-primary/[0.01] transition-colors border-b border-border/40 last:border-0">
                                            <TableCell className="font-bold text-sm py-4">{assignment.name}</TableCell>
                                            <TableCell className="text-sm text-muted-foreground py-4">{assignment.date}</TableCell>
                                            <TableCell className="text-center py-4">
                                                <Badge variant="outline" className={
                                                    assignment.status === "Submitted" 
                                                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" 
                                                        : assignment.status === "Pending" 
                                                            ? "bg-amber-500/10 text-amber-600 border-amber-500/20" 
                                                            : "bg-muted text-muted-foreground border-border/50"
                                                }>
                                                    {assignment.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-black text-foreground py-4">
                                                {assignment.grade ? `${assignment.grade}/100` : "-"}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* 5. Attendance */}
                <Card className="border-border/50 shadow-sm rounded-xl overflow-hidden">
                    <CardHeader className="border-b border-border/40 bg-muted/20 pb-4">
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-primary" />
                            Attendance Summary
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="space-y-2 text-center p-6 rounded-2xl bg-muted/20 border border-border/50">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Days</p>
                                <p className="text-3xl font-black text-foreground">{student.attendance.totalDays}</p>
                            </div>
                            <div className="space-y-2 text-center p-6 rounded-2xl bg-emerald-500/[0.03] border border-emerald-500/10">
                                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Present</p>
                                <p className="text-3xl font-black text-emerald-600">{student.attendance.present}</p>
                            </div>
                            <div className="space-y-2 text-center p-6 rounded-2xl bg-red-500/[0.03] border border-red-500/10">
                                <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest">Absent</p>
                                <p className="text-3xl font-black text-red-600">{student.attendance.absent}</p>
                            </div>
                            <div className="space-y-2 text-center p-6 rounded-2xl bg-primary/[0.03] border border-primary/10">
                                <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Percentage</p>
                                <p className="text-3xl font-black text-primary">{student.attendance.percentage}%</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 6. Feedback */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    {/* Tutor to Student Feedback */}
                    <Card className="border-border/50 shadow-sm rounded-xl overflow-hidden flex flex-col">
                        <CardHeader className="border-b border-border/40 bg-muted/20 pb-4">
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-primary" />
                                Feedback Given to Student
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 flex-1 space-y-6">
                            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {student.feedback.fromTutor.map((fb: any, idx: number) => (
                                    <div key={idx} className="p-4 rounded-2xl bg-primary/[0.02] border border-primary/10 space-y-3 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-2 opacity-10">
                                            <MessageSquare className="w-8 h-8 text-primary" />
                                        </div>
                                        <p className="text-sm text-foreground leading-relaxed relative z-10 font-medium">
                                            {fb.text}
                                        </p>
                                        <div className="flex justify-between items-center pt-2 border-t border-border/20">
                                            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Tutor</span>
                                            <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> {fb.date}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-3 pt-4 border-t border-border/40">
                                <Textarea
                                    placeholder="Add constructive feedback for the student..."
                                    className="min-h-[100px] bg-muted/20 border-border/60 focus:bg-background transition-all"
                                    value={newNote}
                                    onChange={(e) => setNewNote(e.target.value)}
                                />
                                <Button className="w-full gap-2 shadow-md shadow-primary/10" variant="default" onClick={() => {
                                    if (!newNote.trim()) return;
                                    // Handle adding feedback (local state update would go here)
                                    setNewNote("");
                                }}>
                                    <PlusCircle className="w-4 h-4" />
                                    Post Feedback
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Student to Tutor Feedback */}
                    <Card className="border-border/50 shadow-sm rounded-xl overflow-hidden flex flex-col">
                        <CardHeader className="border-b border-border/40 bg-muted/20 pb-4">
                            <CardTitle className="text-lg font-bold flex items-center gap-2 text-indigo-600">
                                <User className="w-5 h-5" />
                                Feedback Received from Student
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 flex-1 bg-indigo-50/5 dark:bg-indigo-500/[0.02]">
                            <div className="space-y-4 max-h-[460px] overflow-y-auto pr-2 custom-scrollbar">
                                {student.feedback.fromStudent.length > 0 ? (
                                    student.feedback.fromStudent.map((fb: any, idx: number) => (
                                        <div key={idx} className="p-4 rounded-2xl bg-background border border-indigo-500/10 shadow-sm space-y-3">
                                            <p className="text-sm text-foreground leading-relaxed italic">
                                                "{fb.text}"
                                            </p>
                                            <div className="flex justify-between items-center pt-2 border-t border-border/20">
                                                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">{student.name}</span>
                                                <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                                                    <Clock className="w-3 h-3" /> {fb.date}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground italic text-sm">
                                        No feedback received from student yet.
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* 7. Assessment Report */}
                <Card className="border-border/50 shadow-sm rounded-xl overflow-hidden bg-primary/[0.01]">
                    <CardHeader className="border-b border-border/40 bg-muted/20 pb-4">
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <FileText className="w-5 h-5 text-primary" />
                            Assessment Report
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="w-full md:w-48 p-6 rounded-2xl bg-background border-2 border-primary/20 flex flex-col items-center justify-center text-center shrink-0">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Overall Evaluation</p>
                                <p className="text-5xl font-black text-primary">{student.assessmentReport.overallScore}</p>
                                <p className="text-xs font-bold text-muted-foreground mt-1">/ 100</p>
                            </div>
                            <div className="flex-1 p-6 rounded-2xl bg-background border border-border/50 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                                <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-3">Tutor Remarks</h4>
                                <p className="text-base text-foreground leading-relaxed">
                                    {student.assessmentReport.remarks}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 8. Exams */}
                <Card className="border-border/50 shadow-sm rounded-xl overflow-hidden">
                    <CardHeader className="border-b border-border/40 bg-muted/20 pb-4">
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <ClipboardList className="w-5 h-5 text-primary" />
                            Exam History & Performance
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/40 hover:bg-muted/40">
                                        <TableHead className="font-bold text-[10px] uppercase tracking-wider text-muted-foreground py-4">Exam Name</TableHead>
                                        <TableHead className="font-bold text-[10px] uppercase tracking-wider text-muted-foreground py-4 text-center">Score</TableHead>
                                        <TableHead className="font-bold text-[10px] uppercase tracking-wider text-muted-foreground py-4 text-center">Result</TableHead>
                                        <TableHead className="font-bold text-[10px] uppercase tracking-wider text-muted-foreground py-4">Tutor Summary</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {student.exams.map((exam: any, idx: number) => (
                                        <TableRow key={idx} className="hover:bg-primary/[0.01] transition-colors border-b border-border/40 last:border-0">
                                            <TableCell className="font-bold text-sm py-4">{exam.name}</TableCell>
                                            <TableCell className="text-center font-black text-foreground py-4 text-sm">{exam.score}%</TableCell>
                                            <TableCell className="text-center py-4">
                                                <Badge variant="outline" className={
                                                    exam.result === "Pass" 
                                                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" 
                                                        : "bg-red-500/10 text-red-600 border-red-500/20"
                                                }>
                                                    {exam.result === "Pass" ? "PASS" : "FAIL"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground py-4 leading-normal italic min-w-[200px]">
                                                {exam.summary}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </DashboardLayout>
    );
};

export default StudentDashboard;
