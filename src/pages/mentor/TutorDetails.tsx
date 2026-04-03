import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
    ChevronLeft, 
    Mail, 
    Phone, 
    Video, 
    CheckCircle2, 
    XCircle,
    Clock,
    BookOpen,
    Users
} from "lucide-react";
import { useState, useEffect } from "react";

// Reuse the Tutor interface or define it here if needed
interface CourseBatch {
    course: string;
    batches: string[];
}

interface SessionRecord {
    id: string;
    title: string;
    batch: string;
    date: string;
    status: "Completed" | "Cancelled" | "Upcoming";
}

interface Tutor {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: "Active" | "Inactive";
    courses: string[];
    batches: string[];
    sessionsConducted: number;
    assignedData: CourseBatch[];
    sessionHistory: SessionRecord[];
    consistency: number;
    feedback: number;
}

// Mock database (simulating fetching by ID)
const mockTutors: Tutor[] = [
    {
        id: "1",
        name: "Arjun Mehta",
        email: "arjun.m@codo.com",
        phone: "+91 98765 43210",
        status: "Active",
        courses: ["MERN Stack", "Next.js Mastery"],
        batches: ["B1", "B4", "NX1"],
        sessionsConducted: 48,
        consistency: 95,
        feedback: 4.8,
        assignedData: [
            { course: "MERN Stack", batches: ["B1", "B4"] },
            { course: "Next.js Mastery", batches: ["NX1"] }
        ],
        sessionHistory: [
            { id: "s1", title: "Introduction to MongoDB", batch: "B1", date: "Oct 12, 2023", status: "Completed" },
            { id: "s2", title: "Express.js Routing", batch: "B4", date: "Oct 15, 2023", status: "Completed" },
            { id: "s3", title: "React Context API", batch: "B1", date: "Oct 18, 2023", status: "Cancelled" },
            { id: "s4", title: "Next.js SSR vs SSG", batch: "NX1", date: "Oct 20, 2023", status: "Upcoming" }
        ]
    },
    {
        id: "2",
        name: "Priya Sharma",
        email: "priya.s@codo.com",
        phone: "+91 87654 32109",
        status: "Active",
        courses: ["Python Data Science"],
        batches: ["P1", "P2"],
        sessionsConducted: 32,
        consistency: 92,
        feedback: 4.7,
        assignedData: [
            { course: "Python Data Science", batches: ["P1", "P2"] }
        ],
        sessionHistory: [
            { id: "s5", title: "Pandas DataFrames", batch: "P1", date: "Oct 14, 2023", status: "Completed" },
            { id: "s6", title: "Matplotlib Basics", batch: "P2", date: "Oct 16, 2023", status: "Completed" }
        ]
    }
];

const TutorDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [tutor, setTutor] = useState<Tutor | null>(null);

    useEffect(() => {
        // Find tutor from mock data
        const foundTutor = mockTutors.find(t => t.id === id);
        if (foundTutor) {
            setTutor(foundTutor);
        }
    }, [id]);

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

    const getStatusBadge = (status: Tutor["status"]) => {
        switch (status) {
            case "Active":
                return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 px-3 py-1">Active</Badge>;
            case "Inactive":
                return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20 px-3 py-1">Inactive</Badge>;
        }
    };

    const getSessionStatusBadge = (status: SessionRecord["status"]) => {
        switch (status) {
            case "Completed":
                return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Completed</Badge>;
            case "Cancelled":
                return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20">Cancelled</Badge>;
            case "Upcoming":
                return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">Upcoming</Badge>;
        }
    };

    return (
        <DashboardLayout>
            <div className="p-6 max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4">
                    <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigate("/mentor/my-batches/tutors")} 
                        className="w-fit -ml-2 text-gray-500 hover:text-gray-900"
                    >
                        <ChevronLeft className="mr-1 h-4 w-4" />
                        Back to Tutors
                    </Button>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                                {tutor.name.split(" ").map(n => n[0]).join("")}
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-gray-900">{tutor.name}</h1>
                                <div className="flex items-center gap-2 mt-1">
                                    {getStatusBadge(tutor.status)}
                                    <span className="text-sm text-gray-500 flex items-center gap-1">
                                        <Mail className="h-3 w-3" /> {tutor.email}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Basic Info & Assignments */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="rounded-2xl border-none shadow-sm overflow-hidden">
                            <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                    <Users className="h-5 w-5 text-indigo-500" />
                                    Contact Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                                    <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Email Address</p>
                                        <p className="text-sm font-semibold text-gray-900">{tutor.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                                    <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                                        <Phone className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Phone Number</p>
                                        <p className="text-sm font-semibold text-gray-900">{tutor.phone}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl border-none shadow-sm">
                            <CardHeader className="border-b border-gray-100">
                                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                    <BookOpen className="h-5 w-5 text-indigo-500" />
                                    Assigned Courses
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-6">
                                {tutor.assignedData.map((data, idx) => (
                                    <div key={idx} className="space-y-3">
                                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-indigo-500" />
                                            {data.course}
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {data.batches.map(batch => (
                                                <Badge key={batch} variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-none px-3 py-1">
                                                    Batch {batch}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Performance & History */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Performance Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card className="rounded-2xl border-none shadow-sm">
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                                            <Video className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Total Sessions</p>
                                            <p className="text-2xl font-bold text-gray-900">{tutor.sessionsConducted}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="rounded-2xl border-none shadow-sm">
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                                            <Clock className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Consistency</p>
                                            <p className="text-2xl font-bold text-gray-900">{tutor.consistency}%</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="rounded-2xl border-none shadow-sm">
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
                                            <CheckCircle2 className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Avg Feedback</p>
                                            <p className="text-2xl font-bold text-gray-900">{tutor.feedback}/5.0</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Session History Table */}
                        <Card className="rounded-2xl border-none shadow-sm overflow-hidden">
                            <CardHeader className="border-b border-gray-100 flex flex-row items-center justify-between">
                                <CardTitle className="text-lg font-semibold">Session History</CardTitle>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="rounded-lg h-8 text-xs"
                                    onClick={() => navigate(`/mentor/my-batches/tutors/${id}/sessions`)}
                                >
                                    View All Sessions
                                </Button>
                            </CardHeader>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50/50 border-b border-gray-100">
                                            <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Meet Title</th>
                                            <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Batch</th>
                                            <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {tutor.sessionHistory.map((session) => (
                                            <tr key={session.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <p className="text-sm font-semibold text-gray-900">{session.title}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge variant="secondary" className="bg-gray-100 text-gray-600 border-none font-medium">
                                                        Batch {session.batch}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-gray-600">{session.date}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {getSessionStatusBadge(session.status)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default TutorDetails;
