import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
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
import {
    Users,
    Search,
    CheckCircle2,
    XCircle,
    Mail,
    Video,
    MessageSquare,
    Eye
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CourseBatch {
    course: string;
    batches: string[];
}

interface SessionRecord {
    id: string;
    title: string;
    batch: string;
    date: string;
    status: "Upcoming" | "Completed" | "Cancelled";
}

interface Tutor {
    id: string;
    name: string;
    email: string;
    phone: string;
    courses: string[];
    batches: string[];
    sessionsConducted: number;
    status: "Active" | "Inactive";
    assignedDetails: CourseBatch[];
    sessionHistory: SessionRecord[];
    attendanceConsistency: string;
    studentFeedback: string;
}

const mockTutors: Tutor[] = [
    {
        id: "1", 
        name: "Arjun Mehta", 
        email: "arjun.m@codo.com", 
        phone: "+91 98765 43210",
        courses: ["MERN Stack", "Next.js Mastery"],
        batches: ["B1", "B4", "NX1"],
        sessionsConducted: 48,
        status: "Active",
        assignedDetails: [
            { course: "MERN Stack", batches: ["B1", "B4"] },
            { course: "Next.js Mastery", batches: ["NX1"] }
        ],
        sessionHistory: [
            { id: "S101", title: "Introduction to MongoDB", batch: "B1", date: "Oct 12, 2023", status: "Completed" },
            { id: "S102", title: "Express.js Routing", batch: "B4", date: "Oct 15, 2023", status: "Completed" },
            { id: "S103", title: "React Context API", batch: "B1", date: "Oct 18, 2023", status: "Cancelled" },
            { id: "S104", title: "Next.js SSR vs SSG", batch: "NX1", date: "Oct 20, 2023", status: "Upcoming" }
        ],
        attendanceConsistency: "98%",
        studentFeedback: "4.8/5"
    },
    {
        id: "2", 
        name: "Priya Sharma", 
        email: "priya.s@codo.com", 
        phone: "+91 87654 32109",
        courses: ["Python Data Science"],
        batches: ["P1", "P2"],
        sessionsConducted: 32,
        status: "Active",
        assignedDetails: [
            { course: "Python Data Science", batches: ["P1", "P2"] }
        ],
        sessionHistory: [
            { id: "S201", title: "Pandas DataFrames", batch: "P1", date: "Oct 14, 2023", status: "Completed" },
            { id: "S202", title: "Matplotlib Basics", batch: "P2", date: "Oct 16, 2023", status: "Completed" },
        ],
        attendanceConsistency: "95%",
        studentFeedback: "4.7/5"
    }
];

const TutorManagement = () => {
    const navigate = useNavigate();
    const [tutors] = useState<Tutor[]>(mockTutors);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [courseFilter, setCourseFilter] = useState<string>("all");
    const [batchFilter, setBatchFilter] = useState<string>("all");

    const stats = {
        total: tutors.length,
        active: tutors.filter(t => t.status === "Active").length,
        inactive: tutors.filter(t => t.status === "Inactive").length,
        sessions: tutors.reduce((acc, t) => acc + t.sessionsConducted, 0)
    };

    const filteredTutors = useMemo(() => {
        return tutors.filter(tutor => {
            const matchesSearch = tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tutor.email.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus = statusFilter === "all" || tutor.status === statusFilter;
            const matchesCourse = courseFilter === "all" || tutor.courses.includes(courseFilter);
            const matchesBatch = batchFilter === "all" || tutor.batches.includes(batchFilter);

            return matchesSearch && matchesStatus && matchesCourse && matchesBatch;
        });
    }, [tutors, searchQuery, statusFilter, courseFilter, batchFilter]);

    const getStatusBadge = (status: Tutor["status"]) => {
        switch (status) {
            case "Active":
                return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Active</Badge>;
            case "Inactive":
                return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20">Inactive</Badge>;
        }
    };

    return (
        <DashboardLayout>
            <div className="animate-fade-in space-y-6 max-w-[1600px] mx-auto pb-10 px-4 mt-4">
                {/* Header */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">Tutors</h1>
                    <p className="text-slate-500 font-medium">Monitor tutors in your assigned batches</p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: "Total Tutors", value: stats.total, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
                        { label: "Active Tutors", value: stats.active, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
                        { label: "Inactive Tutors", value: stats.inactive, icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
                        { label: "Sessions Conducted", value: stats.sessions, icon: Video, color: "text-purple-600", bg: "bg-purple-50" },
                    ].map((card, i) => (
                        <Card key={i} className="p-5 bg-white rounded-[16px] shadow-sm border-none">
                            <div className="flex items-center gap-4">
                                <div className={cn("p-3 rounded-xl", card.bg)}>
                                    <card.icon className={cn("w-6 h-6", card.color)} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-500">{card.label}</p>
                                    <h3 className="text-2xl font-bold text-slate-800">{card.value}</h3>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Filters */}
                <Card className="p-4 bg-white rounded-[16px] shadow-sm border-none">
                    <div className="flex flex-wrap gap-4 items-center">
                        <div className="relative flex-1 min-w-[240px] max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="Search by name or email..."
                                className="pl-10 h-11 bg-slate-50 border-none rounded-xl focus-visible:ring-indigo-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Select value={courseFilter} onValueChange={setCourseFilter}>
                                <SelectTrigger className="w-[180px] h-11 bg-slate-50 border-none rounded-xl">
                                    <SelectValue placeholder="Course" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Courses</SelectItem>
                                    <SelectItem value="MERN Stack">MERN Stack</SelectItem>
                                    <SelectItem value="Next.js Mastery">Next.js Mastery</SelectItem>
                                    <SelectItem value="Python Data Science">Python Data Science</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={batchFilter} onValueChange={setBatchFilter}>
                                <SelectTrigger className="w-[150px] h-11 bg-slate-50 border-none rounded-xl">
                                    <SelectValue placeholder="Batch" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Batches</SelectItem>
                                    <SelectItem value="B1">Batch B1</SelectItem>
                                    <SelectItem value="B4">Batch B4</SelectItem>
                                    <SelectItem value="NX1">Batch NX1</SelectItem>
                                    <SelectItem value="P1">Batch P1</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[130px] h-11 bg-slate-50 border-none rounded-xl">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="Active">Active</SelectItem>
                                    <SelectItem value="Inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </Card>

                {/* Tutors Table */}
                <Card className="bg-white rounded-[16px] shadow-sm border-none overflow-hidden">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b bg-slate-50/50 hover:bg-slate-50/50">
                                    <TableHead className="w-[280px] py-4 font-semibold text-slate-600 pl-6">Tutor Name</TableHead>
                                    <TableHead className="font-semibold text-slate-600">Contact</TableHead>
                                    <TableHead className="font-semibold text-slate-600">Courses</TableHead>
                                    <TableHead className="font-semibold text-slate-600 text-center">Sessions</TableHead>
                                    <TableHead className="font-semibold text-slate-600">Status</TableHead>
                                    <TableHead className="text-right font-semibold text-slate-600 pr-6">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredTutors.length > 0 ? (
                                    filteredTutors.map((tutor) => (
                                        <TableRow key={tutor.id} className="hover:bg-slate-50/50 border-b border-slate-100 transition-colors">
                                            <TableCell className="py-4 pl-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-100">
                                                        {tutor.name.split(" ").map(n => n[0]).join("")}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-900">{tutor.name}</p>
                                                        <p className="text-xs text-slate-500">{tutor.email}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-0.5">
                                                    <p className="text-sm font-medium text-slate-700">{tutor.phone}</p>
                                                    <p className="text-xs text-slate-400">Primary Contact</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                                                    {tutor.courses.map((course, idx) => (
                                                        <Badge key={idx} variant="secondary" className="bg-slate-100 text-slate-600 border-none rounded-md px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider">
                                                            {course}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center font-bold text-slate-700">
                                                {tutor.sessionsConducted}
                                            </TableCell>
                                            <TableCell>{getStatusBadge(tutor.status)}</TableCell>
                                            <TableCell className="text-right pr-6">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm" 
                                                        className="h-8 w-8 p-0 hover:bg-indigo-50 hover:text-indigo-600"
                                                        title="Chat"
                                                    >
                                                        <MessageSquare className="h-4 w-4" />
                                                    </Button>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm" 
                                                        className="h-8 w-8 p-0 hover:bg-purple-50 hover:text-purple-600"
                                                        title="View Sessions"
                                                    >
                                                        <Video className="h-4 w-4" />
                                                    </Button>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm" 
                                                        className="h-9 px-3 hover:bg-indigo-600 hover:text-white group transition-all"
                                                        onClick={() => navigate(`/mentor/my-batches/tutors/${tutor.id}`)}
                                                    >
                                                        <Eye className="mr-2 h-4 w-4 group-hover:text-white" />
                                                        Details
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-[300px] text-center">
                                            <div className="flex flex-col items-center justify-center text-slate-400 gap-3 font-medium">
                                                <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center">
                                                    <Users className="w-8 h-8 opacity-20" />
                                                </div>
                                                <p>No tutors found matching your criteria</p>
                                                <Button variant="outline" size="sm" onClick={() => {
                                                    setSearchQuery("");
                                                    setCourseFilter("all");
                                                    setBatchFilter("all");
                                                    setStatusFilter("all");
                                                }}>
                                                    Clear All Filters
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default TutorManagement;
