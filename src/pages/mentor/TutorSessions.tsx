import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
    ChevronLeft, 
    Search,
    Video,
    Calendar,
    Filter,
    Layers,
    Clock,
    BookOpen
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";

interface SessionRecord {
    id: string;
    title: string;
    batch: string;
    date: string;
    status: "Completed" | "Cancelled" | "Upcoming";
    course: string;
    startTime: string;
    duration: string;
}

interface Tutor {
    id: string;
    name: string;
    role: string;
}

// Mock database (simulating fetching by ID)
const mockTutors = [
    { id: "1", name: "Arjun Mehta", role: "Sr. MERN Stack Tutor" },
    { id: "2", name: "Priya Sharma", role: "Python Expert" }
];

const mockSessions: Record<string, SessionRecord[]> = {
    "1": [
        { id: "s1", title: "Introduction to MongoDB", batch: "B1", date: "Oct 12, 2023", status: "Completed", course: "MERN Stack", startTime: "10:00 AM", duration: "1.5h" },
        { id: "s2", title: "Express.js Routing", batch: "B4", date: "Oct 15, 2023", status: "Completed", course: "MERN Stack", startTime: "11:30 AM", duration: "1.5h" },
        { id: "s3", title: "React Context API", batch: "B1", date: "Oct 18, 2023", status: "Cancelled", course: "MERN Stack", startTime: "02:00 PM", duration: "1.5h" },
        { id: "s4", title: "Next.js SSR vs SSG", batch: "NX1", date: "Oct 20, 2023", status: "Upcoming", course: "Next.js Mastery", startTime: "04:00 PM", duration: "1h" },
        { id: "s5", title: "Node.js Middleware", batch: "B1", date: "Oct 22, 2023", status: "Upcoming", course: "MERN Stack", startTime: "10:00 AM", duration: "1.5h" },
        { id: "s6", title: "Deployment to AWS", batch: "B4", date: "Oct 25, 2023", status: "Upcoming", course: "MERN Stack", startTime: "11:30 AM", duration: "2h" },
    ],
    "2": [
        { id: "s7", title: "Pandas DataFrames", batch: "P1", date: "Oct 14, 2023", status: "Completed", course: "Python Data Science", startTime: "09:00 AM", duration: "1.5h" },
        { id: "s8", title: "Matplotlib Basics", batch: "P2", date: "Oct 16, 2023", status: "Completed", course: "Python Data Science", startTime: "03:00 PM", duration: "1.5h" }
    ]
};

const TutorSessions = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    
    const tutor = mockTutors.find(t => t.id === id);
    const sessions = mockSessions[id || ""] || [];

    const filteredSessions = useMemo(() => {
        return sessions.filter(session => {
            const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 session.batch.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 session.course.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === "All" || session.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [sessions, searchTerm, statusFilter]);

    const getStatusBadge = (status: SessionRecord["status"]) => {
        switch (status) {
            case "Completed":
                return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Completed</Badge>;
            case "Cancelled":
                return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20">Cancelled</Badge>;
            case "Upcoming":
                return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">Upcoming</Badge>;
        }
    };

    if (!tutor) {
        return (
            <DashboardLayout>
                <div className="p-6">
                    <Button variant="ghost" onClick={() => navigate("/mentor/my-batches/tutors")} className="mb-6">
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back to Tutors
                    </Button>
                    <div className="text-center py-20">
                        <h2 className="text-2xl font-bold text-gray-500">Tutor not found</h2>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="p-6 max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4">
                    <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigate(`/mentor/my-batches/tutors/${id}`)} 
                        className="w-fit -ml-2 text-gray-500 hover:text-gray-900"
                    >
                        <ChevronLeft className="mr-1 h-4 w-4" />
                        Back to Tutor Profile
                    </Button>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Session History</h1>
                            <p className="text-gray-500 mt-1">
                                Full history for <span className="font-semibold text-gray-900">{tutor.name}</span> ({tutor.role})
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                             <div className="flex bg-gray-100 p-1 rounded-xl">
                                {["All", "Upcoming", "Completed", "Cancelled"].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => setStatusFilter(status)}
                                        className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                            statusFilter === status 
                                            ? "bg-white text-indigo-600 shadow-sm" 
                                            : "text-gray-500 hover:text-gray-700"
                                        }`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <Card className="rounded-2xl border-none shadow-sm bg-gray-50/50">
                    <CardContent className="p-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input 
                                placeholder="Search by session title, batch or course..." 
                                className="pl-10 h-11 bg-white border-gray-200 rounded-xl focus:ring-indigo-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Sessions Table */}
                <Card className="rounded-2xl border-none shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Session Details</th>
                                    <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Batch & Course</th>
                                    <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
                                    <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredSessions.length > 0 ? (
                                    filteredSessions.map((session) => (
                                        <tr key={session.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                                        <Video className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-900">{session.title}</p>
                                                        <p className="text-xs text-gray-500">ID: {session.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-1.5">
                                                        <Layers className="h-3 w-3 text-gray-400" />
                                                        <span className="text-sm font-medium text-gray-700">Batch {session.batch}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <BookOpen className="h-3 w-3 text-gray-400" />
                                                        <span className="text-xs text-gray-500">{session.course}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-1.5 text-sm text-gray-700">
                                                        <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                                                        {session.date}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                        <Clock className="h-3 h-3" />
                                                        {session.startTime} ({session.duration})
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(session.status)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg">
                                                    View Details
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-20 text-center text-gray-500 italic">
                                            No sessions found matching your search.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default TutorSessions;
