import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Users,
    Search,
    MoreVertical,
    Eye,
    TrendingUp,
    GraduationCap,
    Filter,
    Mail,
    User,
    Phone,
    BookOpen,
    Save,
    ClipboardList,
    Calendar,
    Award,
    Clock,
    Activity as ActivityIcon,
} from "lucide-react";
import { toast } from "sonner";

// Mock data for assigned students
const initialStudents = [
    {
        id: "S001", name: "Aarav Mehta", email: "aarav.m@gmail.com", phone: "+91 98765 43210",
        batch: "Jan 2026 Batch", course: "Full Stack Web Dev", assignedTutor: "Dr. Sarah Mitchell",
        progress: 78, status: "Active", assignedToMe: true,
        metrics: {
            assignments: { total: 24, completed: 18, pending: 6 },
            attendance: { total: 30, attended: 26, missed: 4 },
            performance: { averageScore: 82, latestQuiz: 88 },
            activity: { lastLogin: "2026-03-15", lastActivity: "React Module - Hooks Quiz" }
        }
    },
    {
        id: "S002", name: "Diya Krishnan", email: "diya.k@gmail.com", phone: "+91 98765 43211",
        batch: "Jan 2026 Batch", course: "Data Science Mastery", assignedTutor: "James Wilson",
        progress: 92, status: "Active", assignedToMe: true,
        metrics: {
            assignments: { total: 20, completed: 19, pending: 1 },
            attendance: { total: 30, attended: 29, missed: 1 },
            performance: { averageScore: 94, latestQuiz: 91 },
            activity: { lastLogin: "2026-03-16", lastActivity: "Pandas Advanced Manipulation" }
        }
    },
    {
        id: "S003", name: "Rahul Sharma", email: "rahul.s@gmail.com", phone: "+91 98765 43212",
        batch: "Feb 2026 Python", course: "Python Backend", assignedTutor: "James Wilson",
        progress: 45, status: "Active", assignedToMe: true,
        metrics: {
            assignments: { total: 15, completed: 7, pending: 8 },
            attendance: { total: 20, attended: 15, missed: 5 },
            performance: { averageScore: 68, latestQuiz: 72 },
            activity: { lastLogin: "2026-03-14", lastActivity: "Django Auth Middleware" }
        }
    },
    {
        id: "S004", name: "Sneha Iyer", email: "sneha.i@gmail.com", phone: "+91 98765 43213",
        batch: "Jan 2026 Batch", course: "Full Stack Web Dev", assignedTutor: "Dr. Sarah Mitchell",
        progress: 85, status: "Active", assignedToMe: true,
        metrics: {
            assignments: { total: 24, completed: 21, pending: 3 },
            attendance: { total: 30, attended: 28, missed: 2 },
            performance: { averageScore: 89, latestQuiz: 95 },
            activity: { lastLogin: "2026-03-16", lastActivity: "Redux State Management" }
        }
    },
    {
        id: "S005", name: "Vikram Shah", email: "vikram.s@gmail.com", phone: "+91 98765 43214",
        batch: "Oct 2025 Cohort", course: "UI/UX Design", assignedTutor: "Elena Rodriguez",
        progress: 60, status: "Inactive", assignedToMe: false,
        metrics: {
            assignments: { total: 30, completed: 18, pending: 12 },
            attendance: { total: 45, attended: 30, missed: 15 },
            performance: { averageScore: 72, latestQuiz: 65 },
            activity: { lastLogin: "2026-03-01", lastActivity: "Figma Prototyping Phase 2" }
        }
    },
    {
        id: "S006", name: "Meera Bhat", email: "meera.b@gmail.com", phone: "+91 98765 43215",
        batch: "Feb 2026 Python", course: "React Advanced", assignedTutor: "Not Assigned",
        progress: 55, status: "Active", assignedToMe: true,
        metrics: {
            assignments: { total: 12, completed: 6, pending: 6 },
            attendance: { total: 15, attended: 12, missed: 3 },
            performance: { averageScore: 76, latestQuiz: 80 },
            activity: { lastLogin: "2026-03-15", lastActivity: "Custom Hooks & Context API" }
        }
    },
    {
        id: "S007", name: "Arjun Nair", email: "arjun.n@gmail.com", phone: "+91 98765 43216",
        batch: "Oct 2025 Cohort", course: "Full Stack Web Dev", assignedTutor: "Dr. Sarah Mitchell",
        progress: 100, status: "Active", assignedToMe: false,
        metrics: {
            assignments: { total: 40, completed: 40, pending: 0 },
            attendance: { total: 50, attended: 48, missed: 2 },
            performance: { averageScore: 98, latestQuiz: 100 },
            activity: { lastLogin: "2026-03-10", lastActivity: "Portfolio Deployment" }
        }
    },
    {
        id: "S008", name: "Priya Das", email: "priya.d@gmail.com", phone: "+91 98765 43217",
        batch: "Jan 2026 Batch", course: "Data Science Mastery", assignedTutor: "James Wilson",
        progress: 30, status: "On Leave", assignedToMe: true,
        metrics: {
            assignments: { total: 10, completed: 3, pending: 7 },
            attendance: { total: 15, attended: 8, missed: 7 },
            performance: { averageScore: 65, latestQuiz: 60 },
            activity: { lastLogin: "2026-03-05", lastActivity: "Basic SQL Queries" }
        }
    },
];

const availableTutors = [
    "Dr. Sarah Mitchell",
    "James Wilson",
    "Elena Rodriguez",
    "Michael Chen",
    "Sarah Thompson",
    "Not Assigned"
];

const availableStatus = [
    "Active",
    "Inactive",
    "Completed",
    "Suspended"
];

const StudentManagement = () => {
    const [students, setStudents] = useState(initialStudents);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [assignedOnly, setAssignedOnly] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<typeof initialStudents[0] | null>(null);
    const [analysisStudent, setAnalysisStudent] = useState<typeof initialStudents[0] | null>(null);
    const [editData, setEditData] = useState<typeof initialStudents[0] | null>(null);

    const stats = {
        allStudents: students.length,
        myStudents: students.filter(s => s.assignedToMe).length
    };

    const filteredStudents = useMemo(() => {
        return students.filter(student => {
            const matchesSearch =
                student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.course.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === "All" || student.status === statusFilter;
            const matchesAssignment = !assignedOnly || student.assignedToMe;

            return matchesSearch && matchesStatus && matchesAssignment;
        });
    }, [students, searchTerm, statusFilter, assignedOnly]);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Active":
                return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Active</Badge>;
            case "Inactive":
                return <Badge variant="outline" className="bg-slate-500/10 text-slate-600 border-slate-500/20">Inactive</Badge>;
            case "Completed":
                return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">Completed</Badge>;
            case "Suspended":
                return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20">Suspended</Badge>;
            case "On Leave":
                return <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">On Leave</Badge>;
            default:
                return <Badge variant="outline" className="bg-muted text-muted-foreground border-border">{status}</Badge>;
        }
    };

    const handleOpenProfile = (student: typeof initialStudents[0]) => {
        setSelectedStudent(student);
        setEditData({ ...student });
    };

    const handleSaveChanges = () => {
        if (!editData) return;

        setStudents(prev => prev.map(s => s.id === editData.id ? editData : s));
        toast.success("Student profile updated successfully", {
            description: `${editData.name}'s information and tutor assignment have been saved.`
        });
        setSelectedStudent(null);
        setEditData(null);
    };

    return (
        <DashboardLayout>
            <div className="animate-fade-in space-y-8 max-w-6xl mx-auto pb-10">
                {/* Header */}
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">
                        Student Management
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Monitor and manage learning phase students assigned to you.
                    </p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Card
                        className={cn(
                            "border-border/50 shadow-sm transition-all cursor-pointer",
                            !assignedOnly ? "ring-2 ring-primary bg-primary/5 shadow-md" : "hover:bg-muted/30"
                        )}
                        onClick={() => setAssignedOnly(false)}
                    >
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                                    !assignedOnly ? "bg-blue-600 text-white" : "bg-blue-500/10 text-blue-600"
                                )}>
                                    <GraduationCap className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground tracking-wider leading-none">All Students</p>
                                    <h3 className={cn(
                                        "text-3xl font-bold mt-1.5 transition-colors",
                                        !assignedOnly ? "text-blue-700 dark:text-blue-400" : "text-blue-600"
                                    )}>{stats.allStudents}</h3>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card
                        className={cn(
                            "border-border/50 shadow-sm transition-all cursor-pointer",
                            assignedOnly ? "ring-2 ring-primary bg-primary/5 shadow-md" : "hover:bg-muted/30"
                        )}
                        onClick={() => setAssignedOnly(true)}
                    >
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                                    assignedOnly ? "bg-primary text-white" : "bg-primary/10 text-primary"
                                )}>
                                    <Users className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground tracking-wider leading-none">My Students</p>
                                    <h3 className={cn(
                                        "text-3xl font-bold mt-1.5 transition-colors",
                                        assignedOnly ? "text-primary-700 dark:text-primary-400" : "text-primary"
                                    )}>{stats.myStudents}</h3>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filter & Table Section */}
                <Card className="border-border/50 shadow-sm overflow-hidden rounded-xl">
                    <CardHeader className="border-b bg-muted/20 px-6 py-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                <GraduationCap className="w-5 h-5 text-primary" />
                                Student List
                            </CardTitle>

                            <div className="flex flex-col sm:flex-row items-center gap-3">
                                <div className="relative w-full sm:w-64">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search students..."
                                        className="pl-9 h-9 rounded-lg"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                    <Button variant="outline" size="sm" className="h-9 gap-2 rounded-lg">
                                        <Filter className="w-4 h-4" />
                                        Filter
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/30 hover:bg-muted/30 border-b">
                                        <TableHead className="font-bold py-4 pl-6">Student Name</TableHead>
                                        <TableHead className="font-bold">Email</TableHead>
                                        <TableHead className="font-bold">Batch</TableHead>
                                        <TableHead className="font-bold">Course</TableHead>
                                        <TableHead className="font-bold">Assigned Tutor</TableHead>
                                        <TableHead className="font-bold w-[15%]">Progress</TableHead>
                                        <TableHead className="font-bold">Status</TableHead>
                                        <TableHead className="font-bold text-right pr-6">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredStudents.length > 0 ? (
                                        filteredStudents.map((student) => (
                                            <TableRow key={student.id} className="hover:bg-muted/5 transition-colors border-b last:border-0 text-sm">
                                                <TableCell className="py-4 pl-6 font-medium">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                                                            {student.name.split(" ").map(n => n[0]).join("")}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="flex items-center gap-2">
                                                                {student.name}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="w-3.5 h-3.5 text-primary/40" />
                                                        {student.email}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground font-medium">{student.batch}</TableCell>
                                                <TableCell className="text-muted-foreground">{student.course}</TableCell>
                                                <TableCell className="text-muted-foreground font-medium">
                                                    {student.assignedTutor}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-1.5">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-[10px] font-medium text-muted-foreground">{student.progress}%</span>
                                                        </div>
                                                        <Progress value={student.progress} className="h-1.5" />
                                                    </div>
                                                </TableCell>
                                                <TableCell>{getStatusBadge(student.status)}</TableCell>
                                                <TableCell className="text-right pr-6">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-muted rounded-full">
                                                                <MoreVertical className="w-4 h-4 text-muted-foreground" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48 rounded-xl">
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="gap-2 cursor-pointer"
                                                                onClick={() => handleOpenProfile(student)}
                                                            >
                                                                <Eye className="w-4 h-4 text-primary" /> View Profile
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="gap-2 cursor-pointer"
                                                                onClick={() => setAnalysisStudent(student)}
                                                            >
                                                                <TrendingUp className="w-4 h-4 text-primary" /> Progress Analysis
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={8} className="h-32 text-center text-muted-foreground italic">
                                                No students found matching your criteria.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Student Profile Modal */}
                <Dialog open={!!selectedStudent} onOpenChange={(open) => {
                    if (!open) {
                        setSelectedStudent(null);
                        setEditData(null);
                    }
                }}>
                    <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden rounded-2xl border-none shadow-2xl">
                        <DialogHeader className="p-8 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-b">
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-primary/20">
                                    {selectedStudent?.name.split(" ").map(n => n[0]).join("")}
                                </div>
                                <div className="space-y-1">
                                    <DialogTitle className="text-2xl font-bold tracking-tight">Edit Student Profile</DialogTitle>
                                    <p className="text-sm font-medium text-primary/60 flex items-center gap-2">
                                        Student ID: {selectedStudent?.id}
                                    </p>
                                </div>
                            </div>
                        </DialogHeader>

                        {editData && (
                            <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
                                {/* Core Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Full Name</Label>
                                        <p className="text-base font-semibold text-foreground flex items-center gap-2 h-11 px-4 rounded-xl bg-muted/30 border border-border/50">
                                            <User className="w-4 h-4 text-primary/40" />
                                            {editData.name}
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Email Address</Label>
                                        <p className="text-base font-semibold text-foreground flex items-center gap-2 h-11 px-4 rounded-xl bg-muted/30 border border-border/50">
                                            <Mail className="w-4 h-4 text-primary/40" />
                                            {editData.email}
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Phone Number</Label>
                                        <p className="text-base font-semibold text-foreground flex items-center gap-2 h-11 px-4 rounded-xl bg-muted/30 border border-border/50">
                                            <Phone className="w-4 h-4 text-primary/40" />
                                            {editData.phone}
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Current Status</Label>
                                        <Select
                                            value={editData.status}
                                            onValueChange={(value) => setEditData({ ...editData, status: value })}
                                        >
                                            <SelectTrigger className="h-11 rounded-xl bg-background shadow-sm border-border/50">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl border-border/50">
                                                {availableStatus.map((status) => (
                                                    <SelectItem key={status} value={status} className="cursor-pointer">
                                                        <div className="flex items-center gap-2">
                                                            {getStatusBadge(status)}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Academic Assignment Section */}
                                <div className="p-6 rounded-2xl bg-muted/30 border border-border/50 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Assigned Batch</Label>
                                            <p className="text-sm font-semibold flex items-center gap-2 h-11">
                                                <BookOpen className="w-4 h-4 text-primary/40" />
                                                {editData.batch}
                                            </p>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Course Name</Label>
                                            <p className="text-sm font-semibold flex items-center gap-2 h-11">
                                                <GraduationCap className="w-4 h-4 text-primary/40" />
                                                {editData.course}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Assigned Tutor</Label>
                                        <Select
                                            value={editData.assignedTutor}
                                            onValueChange={(value) => setEditData({ ...editData, assignedTutor: value })}
                                        >
                                            <SelectTrigger className="h-11 rounded-xl bg-background shadow-sm border-border/50">
                                                <div className="flex items-center gap-2">
                                                    <User className="w-4 h-4 text-primary/40" />
                                                    <SelectValue placeholder="Select a tutor" />
                                                </div>
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl border-border/50">
                                                {availableTutors.map((tutor) => (
                                                    <SelectItem key={tutor} value={tutor} className="cursor-pointer">
                                                        {tutor}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="pt-4 border-t border-border/50">
                                        <div className="flex items-center justify-between mb-3">
                                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                                <TrendingUp className="w-3.5 h-3.5" />
                                                Learning Progress
                                            </label>
                                            <span className="text-sm font-bold text-primary">{editData.progress}%</span>
                                        </div>
                                        <Progress value={editData.progress} className="h-2.5 bg-primary/10" />
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-4 sticky bottom-0 bg-background/50 backdrop-blur-sm -mx-8 px-8 pb-4">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setSelectedStudent(null);
                                            setEditData(null);
                                        }}
                                        className="rounded-xl px-6 h-11 border-border/50"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleSaveChanges}
                                        className="rounded-xl px-8 h-11 shadow-lg shadow-primary/20 gap-2"
                                    >
                                        <Save className="w-4 h-4" />
                                        Save Changes
                                    </Button>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Progress Analysis Modal */}
                <Dialog open={!!analysisStudent} onOpenChange={(open) => !open && setAnalysisStudent(null)}>
                    <DialogContent className="sm:max-w-[750px] p-0 overflow-hidden rounded-2xl border-none shadow-2xl">
                        <DialogHeader className="p-8 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-b">
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                                        <TrendingUp className="w-8 h-8" />
                                    </div>
                                    <div className="space-y-1">
                                        <DialogTitle className="text-2xl font-bold tracking-tight">Progress Analysis</DialogTitle>
                                        <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                            Analyzing learning performance for <span className="text-foreground font-bold">{analysisStudent?.name}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="hidden sm:block text-right">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1.5">Batch</p>
                                    <p className="text-sm font-bold text-foreground">{analysisStudent?.batch}</p>
                                </div>
                            </div>
                        </DialogHeader>

                        {analysisStudent && (
                            <div className="p-8 space-y-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
                                {/* Top Section: Course Progress Overview */}
                                <div className="p-6 rounded-2xl bg-primary/[0.03] border border-primary/10 relative overflow-hidden group hover:bg-primary/[0.05] transition-colors">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <BookOpen className="w-20 h-20 -rotate-12" />
                                    </div>
                                    <div className="relative z-10 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Course Progress</h4>
                                                <p className="text-2xl font-black text-primary flex items-center gap-2">
                                                    {analysisStudent.progress}% Completed
                                                </p>
                                            </div>
                                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 rounded-full px-4 h-7 text-[10px] font-black uppercase tracking-widest">
                                                On Track
                                            </Badge>
                                        </div>
                                        <Progress value={analysisStudent.progress} className="h-3 shadow-inner bg-primary/10" />
                                        <p className="text-xs text-muted-foreground font-medium italic">
                                            Currently enrolled in <span className="text-foreground font-bold">{analysisStudent.course}</span>
                                        </p>
                                    </div>
                                </div>

                                {/* Multi-Section Metrics Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Assignment Progress */}
                                    <Card className="border-border/40 shadow-sm bg-muted/20 hover:bg-muted/30 transition-colors overflow-hidden">
                                        <CardHeader className="pb-3 border-b border-border/40 bg-muted/40 px-5 py-3">
                                            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                                <ClipboardList className="w-3.5 h-3.5 text-orange-500" />
                                                Assignment Progress
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-5 space-y-4">
                                            <div className="grid grid-cols-3 gap-2">
                                                <div className="text-center p-3 rounded-xl bg-background border border-border/50">
                                                    <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Total</p>
                                                    <p className="text-xl font-black">{analysisStudent.metrics.assignments.total}</p>
                                                </div>
                                                <div className="text-center p-3 rounded-xl bg-orange-500/5 border border-orange-500/10">
                                                    <p className="text-[10px] font-bold text-orange-600 uppercase mb-1">Done</p>
                                                    <p className="text-xl font-black text-orange-600">{analysisStudent.metrics.assignments.completed}</p>
                                                </div>
                                                <div className="text-center p-3 rounded-xl bg-muted/50 border border-border/50">
                                                    <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Pending</p>
                                                    <p className="text-xl font-black">{analysisStudent.metrics.assignments.pending}</p>
                                                </div>
                                            </div>
                                            <div className="pt-2">
                                                <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground mb-1.5 px-0.5">
                                                    <span>COMPLETION RATE</span>
                                                    <span>{Math.round((analysisStudent.metrics.assignments.completed / analysisStudent.metrics.assignments.total) * 100)}%</span>
                                                </div>
                                                <Progress value={(analysisStudent.metrics.assignments.completed / analysisStudent.metrics.assignments.total) * 100} className="h-1.5 bg-background shadow-inner" />
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Attendance Summary */}
                                    <Card className="border-border/40 shadow-sm bg-muted/20 hover:bg-muted/30 transition-colors overflow-hidden">
                                        <CardHeader className="pb-3 border-b border-border/40 bg-muted/40 px-5 py-3">
                                            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                                                Attendance Summary
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-5 space-y-4">
                                            <div className="grid grid-cols-3 gap-2">
                                                <div className="text-center p-3 rounded-xl bg-background border border-border/50">
                                                    <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Classes</p>
                                                    <p className="text-xl font-black">{analysisStudent.metrics.attendance.total}</p>
                                                </div>
                                                <div className="text-center p-3 rounded-xl bg-blue-500/5 border border-blue-500/10">
                                                    <p className="text-[10px] font-bold text-blue-600 uppercase mb-1">Present</p>
                                                    <p className="text-xl font-black text-blue-600">{analysisStudent.metrics.attendance.attended}</p>
                                                </div>
                                                <div className="text-center p-3 rounded-xl bg-red-500/5 border border-red-500/10">
                                                    <p className="text-[10px] font-bold text-red-600 uppercase mb-1">Missed</p>
                                                    <p className="text-xl font-black text-red-600">{analysisStudent.metrics.attendance.missed}</p>
                                                </div>
                                            </div>
                                            <div className="pt-2">
                                                <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground mb-1.5 px-0.5">
                                                    <span>ATTENDANCE %</span>
                                                    <span>{Math.round((analysisStudent.metrics.attendance.attended / analysisStudent.metrics.attendance.total) * 100)}%</span>
                                                </div>
                                                <Progress value={(analysisStudent.metrics.attendance.attended / analysisStudent.metrics.attendance.total) * 100} className="h-1.5 bg-background shadow-inner" />
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Performance Stats */}
                                    <Card className="border-border/40 shadow-sm bg-muted/20 hover:bg-muted/30 transition-colors overflow-hidden">
                                        <CardHeader className="pb-3 border-b border-border/40 bg-muted/40 px-5 py-3">
                                            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                                <Award className="w-3.5 h-3.5 text-emerald-500" />
                                                Performance Stats
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-5">
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow-md">
                                                            <TrendingUp className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-bold text-emerald-700/60 uppercase leading-none mb-1">Average Score</p>
                                                            <p className="text-lg font-black text-emerald-700">{analysisStudent.metrics.performance.averageScore}%</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between p-3.5 rounded-xl bg-background border border-border/50">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                                            <Award className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-bold text-muted-foreground uppercase leading-none mb-1">Latest Quiz</p>
                                                            <p className="text-lg font-black">{analysisStudent.metrics.performance.latestQuiz}%</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Recent Activity */}
                                    <Card className="border-border/40 shadow-sm bg-muted/20 hover:bg-muted/30 transition-colors overflow-hidden">
                                        <CardHeader className="pb-3 border-b border-border/40 bg-muted/40 px-5 py-3">
                                            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                                <ActivityIcon className="w-3.5 h-3.5 text-purple-500" />
                                                Recent Activity
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-5">
                                            <div className="space-y-4">
                                                <div className="space-y-1.5 p-3 rounded-xl bg-background border border-border/50 border-l-[3px] border-l-purple-500">
                                                    <p className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                                                        <Clock className="w-3 h-3" />
                                                        Last Login
                                                    </p>
                                                    <p className="text-sm font-bold">{analysisStudent.metrics.activity.lastLogin}</p>
                                                </div>
                                                <div className="space-y-1.5 p-3 rounded-xl bg-background border border-border/50 border-l-[3px] border-l-primary">
                                                    <p className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                                                        <ActivityIcon className="w-3 h-3" />
                                                        Latest Activity
                                                    </p>
                                                    <p className="text-sm font-bold truncate pr-2" title={analysisStudent.metrics.activity.lastActivity}>
                                                        {analysisStudent.metrics.activity.lastActivity}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Footer Note */}
                                <div className="p-4 rounded-xl border border-border/40 bg-muted/10 flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                                        <TrendingUp className="w-4 h-4" />
                                    </div>
                                    <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                                        Analysis generated on {new Date().toLocaleDateString()} based on student engagement data.
                                        Consistent progress observed in Assignment completion compared to last week.
                                    </p>
                                </div>

                                <div className="flex justify-end pt-2">
                                    <Button
                                        onClick={() => setAnalysisStudent(null)}
                                        className="rounded-xl px-10 h-11 shadow-lg shadow-primary/20"
                                    >
                                        Close Report
                                    </Button>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    );
};

export default StudentManagement;
