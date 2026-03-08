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
    Activity
} from "lucide-react";

// Mock Data
const studentData: Record<string, any> = {
    "S-101": {
        name: "Rahul Kumar",
        email: "rahul@email.com",
        batch: "Jan 2026 Batch",
        joinDate: "15 Jan 2026",
        overallProgress: 72,
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
        ],
        summary: {
            avgGrade: 87,
            highestScore: 92,
            completed: 5,
            total: 7
        },
        notes: [
            { id: 1, text: "Good progress in CSS. Shows strong understanding of layouts.", date: "16 Feb 2026" },
            { id: 2, text: "Needs improvement in JavaScript logic, particularly async/await concepts.", date: "28 Feb 2026" },
        ],
        activity: [
            { text: "Logged in 2 hours ago", time: "2 hours ago", icon: Clock },
            { text: "Submitted \"CSS Flexbox Task\"", time: "2 days ago", icon: CheckCircle2 },
            { text: "Viewed \"React Basics Lesson\"", time: "3 days ago", icon: BookOpen },
        ]
    }
};

const StudentDashboard = () => {
    const { studentId } = useParams();
    const navigate = useNavigate();
    const [newNote, setNewNote] = useState("");

    // Default to Rahul Kumar if mock data doesn't exist for ID
    const student = studentData[studentId || "S-101"] || studentData["S-101"];

    const [notes, setNotes] = useState(student.notes);

    const handleAddNote = () => {
        if (!newNote.trim()) return;
        const note = {
            id: Date.now(),
            text: newNote,
            date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        };
        setNotes([note, ...notes]);
        setNewNote("");
    };

    return (
        <DashboardLayout>
            <div className="animate-fade-in space-y-6 lg:space-y-8 max-w-7xl mx-auto pb-10">

                {/* Back Button and Header */}
                <div className="space-y-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 -ml-2 text-muted-foreground hover:text-primary"
                        onClick={() => navigate(-1)}
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back
                    </Button>
                    <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
                        Student Dashboard
                    </h1>
                </div>

                {/* Top: Student Info Card */}
                <Card className="border-border/50 shadow-sm rounded-xl overflow-hidden bg-gradient-to-r from-primary/5 via-transparent to-transparent">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border-2 border-primary/20">
                                <User className="w-10 h-10 text-primary" />
                            </div>
                            <div className="flex-1 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Student Name</p>
                                        <p className="text-xl font-bold text-foreground">{student.name}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Batch Name</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant="secondary" className="font-medium">{student.batch}</Badge>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Joined Date</p>
                                        <div className="flex items-center gap-2 mt-1 text-sm text-foreground">
                                            <Calendar className="w-4 h-4 text-muted-foreground" />
                                            {student.joinDate}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Overall Progress</p>
                                        <div className="flex items-center gap-3 mt-1">
                                            <Progress value={student.overallProgress} className="h-2 flex-1 min-w-[60px]" />
                                            <span className="text-sm font-bold text-primary">{student.overallProgress}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Middle Section: Progress and Grades */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    {/* Middle Left: Progress Graph */}
                    <Card className="lg:col-span-2 border-border/50 shadow-sm rounded-xl overflow-hidden">
                        <CardHeader className="border-b border-border/40 bg-muted/20 pb-4">
                            <CardTitle className="text-lg font-bold flex items-center gap-2 lowercase first-letter:uppercase">
                                <TrendingUp className="w-5 h-5 text-primary" />
                                Learning Progress
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            {student.subjects.map((subject: any) => (
                                <div key={subject.name} className="space-y-2">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="font-medium text-foreground">{subject.name}</span>
                                        <span className="text-muted-foreground font-semibold uppercase tracking-tight text-xs bg-muted px-1.5 py-0.5 rounded">
                                            {subject.progress}% Complete
                                        </span>
                                    </div>
                                    <Progress value={subject.progress} className="h-2.5" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Middle Right: Grades Summary */}
                    <Card className="border-border/50 shadow-sm rounded-xl overflow-hidden flex flex-col">
                        <CardHeader className="border-b border-border/40 bg-muted/20 pb-4">
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <GraduationCap className="w-5 h-5 text-blue-600" />
                                Grades Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 flex-1 flex flex-col justify-center gap-8">
                            <div className="text-center space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Average Grade</p>
                                <p className="text-5xl font-black text-primary">{student.summary.avgGrade}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/40">
                                <div className="text-center space-y-1">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Highest Score</p>
                                    <p className="text-xl font-bold text-foreground">{student.summary.highestScore}</p>
                                </div>
                                <div className="text-center space-y-1">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Completed</p>
                                    <p className="text-xl font-bold text-emerald-600">{student.summary.completed} / {student.summary.total}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Below: Assignments Table */}
                <Card className="border-border/50 shadow-sm rounded-xl overflow-hidden">
                    <CardHeader className="border-b border-border/40 bg-muted/20 pb-4">
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <ClipboardList className="w-5 h-5 text-primary" />
                            Assignments
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/30">
                                        <TableHead className="font-semibold text-xs">Assignment Name</TableHead>
                                        <TableHead className="font-semibold text-xs">Submission Date</TableHead>
                                        <TableHead className="font-semibold text-xs text-center">Status</TableHead>
                                        <TableHead className="font-semibold text-xs text-right">Grade</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {student.assignments.map((assignment: any) => (
                                        <TableRow key={assignment.name} className="hover:bg-muted/10 transition-colors">
                                            <TableCell className="font-medium text-sm">{assignment.name}</TableCell>
                                            <TableCell className="text-sm text-muted-foreground">{assignment.date}</TableCell>
                                            <TableCell className="text-center">
                                                {assignment.status === "Submitted" ? (
                                                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                                                        {assignment.status}
                                                    </Badge>
                                                ) : assignment.status === "Pending" ? (
                                                    <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                                                        {assignment.status}
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="bg-muted text-muted-foreground border-border/50">
                                                        {assignment.status}
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right font-bold text-foreground">
                                                {assignment.grade || "-"}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Bottom Section: Mentor Notes & Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    {/* Mentor Notes */}
                    <Card className="border-border/50 shadow-sm rounded-xl overflow-hidden flex flex-col">
                        <CardHeader className="border-b border-border/40 bg-muted/20 pb-4">
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-primary" />
                                Mentor Notes
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 flex-1 space-y-6">
                            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                                {notes.map((note: any) => (
                                    <div key={note.id} className="p-4 rounded-lg bg-muted/30 border border-border/40 relative group">
                                        <p className="text-sm text-foreground pr-10">{note.text}</p>
                                        <span className="absolute top-4 right-4 text-[10px] uppercase font-bold text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity">
                                            {note.date}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 pt-4 border-t border-border/40">
                                <Textarea
                                    placeholder="Add a new note for this student..."
                                    className="min-h-[100px] bg-muted/20"
                                    value={newNote}
                                    onChange={(e) => setNewNote(e.target.value)}
                                />
                                <Button className="w-full gap-2" onClick={handleAddNote}>
                                    <PlusCircle className="w-4 h-4" />
                                    Add Note
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <Card className="border-border/50 shadow-sm rounded-xl overflow-hidden">
                        <CardHeader className="border-b border-border/40 bg-muted/20 pb-4">
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <Activity className="w-5 h-5 text-primary" />
                                Recent Activity
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-8 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-px before:bg-border/50">
                                {student.activity.map((act: any, idx: number) => (
                                    <div key={idx} className="flex gap-4 relative">
                                        <div className="w-7 h-7 rounded-full bg-background border border-border flex items-center justify-center shrink-0 z-10 shadow-sm">
                                            <act.icon className="w-3.5 h-3.5 text-primary" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-foreground">{act.text}</p>
                                            <p className="text-xs text-muted-foreground">{act.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </DashboardLayout>
    );
};

export default StudentDashboard;
