import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format, parseISO } from "date-fns";
import {
    Search,
    MoreVertical,
    Eye,
    Video,
    Filter,
    Calendar,
    User,
    UserCheck,
    BookOpen,
    Clock,
    Layers,
    ExternalLink,
    PlayCircle,
    Info,
} from "lucide-react";
import { toast } from "sonner";

// Initial data for live sessions
const INITIAL_SESSIONS = [
    {
        id: "LS001",
        title: "React Hooks Deep Dive",
        course: "Full Stack Web Dev",
        batch: "Jan 2026 Batch",
        tutor: "Dr. Sarah Mitchell",
        date: "2026-03-16",
        startTime: "10:00 AM",
        duration: "1.5 hrs",
        status: "Live",
        type: "Class",
        meetingLink: "https://meet.google.com/abc-defg-hij",
        recordingUrl: null,
    },
    {
        id: "LS002",
        title: "Node.js API Design",
        course: "Full Stack Web Dev",
        batch: "Jan 2026 Batch",
        tutor: "James Wilson",
        date: "2026-03-16",
        startTime: "02:00 PM",
        duration: "2 hrs",
        status: "Scheduled",
        type: "Class",
        meetingLink: "https://meet.google.com/pqr-stuv-wxy",
        recordingUrl: null,
    },
    {
        id: "LS007",
        title: "Mentor ↔ Tutor Sync",
        course: "N/A",
        batch: "Internal",
        tutor: "James Wilson",
        date: "2026-03-16",
        startTime: "04:00 PM",
        duration: "30 mins",
        status: "Scheduled",
        type: "Meeting",
        meetingLink: "https://zoom.us/j/123456789",
        recordingUrl: null,
    },
    {
        id: "LS003",
        title: "Python Data Structures",
        course: "Data Science Mastery",
        batch: "Feb 2026 Python",
        tutor: "Elena Rodriguez",
        date: "2026-03-17",
        startTime: "11:00 AM",
        duration: "1.5 hrs",
        status: "Scheduled",
        type: "Class",
        meetingLink: "https://meet.google.com/mno-pqrs-tuv",
        recordingUrl: null,
    },
    {
        id: "LS004",
        title: "Figma Prototyping",
        course: "UI/UX Design Pro",
        batch: "Oct 2025 Cohort",
        tutor: "Michael Chen",
        date: "2026-03-15",
        startTime: "03:00 PM",
        duration: "1 hr",
        status: "Completed",
        type: "Class",
        meetingLink: "https://meet.google.com/completed-link",
        recordingUrl: "https://vimeo.com/123456789",
    },
    {
        id: "LS008",
        title: "Mentor ↔ Admin Strategy",
        course: "N/A",
        batch: "Management",
        tutor: "Admin Team",
        date: "2026-03-18",
        startTime: "11:00 AM",
        duration: "1 hr",
        status: "Scheduled",
        type: "Meeting",
        meetingLink: "https://meet.google.com/admin-sync",
        recordingUrl: null,
    },
    {
        id: "LS005",
        title: "Redux State Management",
        course: "Full Stack Web Dev",
        batch: "Feb 2026 Python",
        tutor: "Sarah Thompson",
        date: "2026-03-18",
        startTime: "10:30 AM",
        duration: "2 hrs",
        status: "Scheduled",
        type: "Class",
        meetingLink: "https://meet.google.com/redux-link",
        recordingUrl: null,
    },
    {
        id: "LS006",
        title: "Machine Learning Basics",
        course: "Data Science Mastery",
        batch: "Jan 2026 Batch",
        tutor: "Elena Rodriguez",
        date: "2026-03-14",
        startTime: "09:00 AM",
        duration: "3 hrs",
        status: "Completed",
        type: "Class",
        meetingLink: "https://meet.google.com/ml-link",
        recordingUrl: "https://youtube.com/watch?v=recorded",
    },
];

const availableCourses = ["Full Stack Web Dev", "Data Science Mastery", "UI/UX Design Pro", "Digital Marketing", "Cyber Security"];
const availableBatches = ["Jan 2026 Batch", "Feb 2026 Python", "Oct 2025 Cohort", "March 2026 Intake"];
const availableTutors = ["Dr. Sarah Mitchell", "James Wilson", "Elena Rodriguez", "Michael Chen", "Sarah Thompson", "Admin Team"];

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 11 }, (_, i) => (currentYear + 5 - i).toString()); // 5 years back to 5 years forward for sessions

const parseTimeToMinutes = (timeStr: string) => {
    const [time, period] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    return hours * 60 + minutes;
};

const LiveSessions = () => {
    const [sessions, setSessions] = useState(INITIAL_SESSIONS);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCardFilter, setActiveCardFilter] = useState("all");
    const [selectedSession, setSelectedSession] = useState<any>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newSession, setNewSession] = useState({
        title: "",
        course: "",
        batch: "",
        tutor: "",
        date: "",
        startTime: "",
        duration: "",
        meetingLink: "",
        description: ""
    });
    const [monthView, setMonthView] = useState<Date>(new Date());

    // "Today" constant based on system time
    const TODAY_DATE = "2026-03-16";

    const stats = useMemo(() => {
        return {
            today: sessions.filter(s => s.type === "Class" && s.date === TODAY_DATE).length,
            upcoming: sessions.filter(s => s.type === "Class" && s.date > TODAY_DATE).length,
            completed: sessions.filter(s => s.type === "Class" && s.status === "Completed").length,
            meet: sessions.filter(s => s.type === "Meeting").length,
        };
    }, [sessions]);

    const filteredSessions = useMemo(() => {
        let filtered = sessions.filter(session => {
            const searchLower = searchTerm.toLowerCase();
            const matchesGlobal =
                session.title.toLowerCase().includes(searchLower) ||
                session.tutor.toLowerCase().includes(searchLower) ||
                session.course.toLowerCase().includes(searchLower) ||
                session.batch.toLowerCase().includes(searchLower) ||
                session.date.toLowerCase().includes(searchLower) ||
                session.status.toLowerCase().includes(searchLower);

            if (!matchesGlobal) return false;

            // Apply card filter
            switch (activeCardFilter) {
                case "today": return session.type === "Class" && session.date === TODAY_DATE;
                case "upcoming": return session.type === "Class" && session.date > TODAY_DATE;
                case "completed": return session.type === "Class" && session.status === "Completed";
                case "meet": return session.type === "Meeting";
                default: return true;
            }
        });

        // Sort by Date (asc) and then by Time (asc)
        return filtered.sort((a, b) => {
            const dateCompare = a.date.localeCompare(b.date);
            if (dateCompare !== 0) return dateCompare;
            return parseTimeToMinutes(a.startTime) - parseTimeToMinutes(b.startTime);
        });
    }, [searchTerm, activeCardFilter, sessions]);

    const handleJoinSession = (link: string) => {
        window.open(link, "_blank", "noopener,noreferrer");
        toast.success("Opening session link...");
    };

    const handleViewRecording = (url: string | null) => {
        if (url) {
            window.open(url, "_blank", "noopener,noreferrer");
            toast.success("Opening recording...");
        } else {
            toast.error("Recording not available for this session.");
        }
    };

    const handleViewDetails = (session: any) => {
        setSelectedSession(session);
        setIsDetailsOpen(true);
    };

    const handleCreateSession = () => {
        if (!newSession.title || !newSession.course || !newSession.batch || !newSession.tutor || !newSession.date || !newSession.startTime) {
            toast.error("Please fill in all required fields.");
            return;
        }

        const sessionToAdd = {
            id: `LS${(sessions.length + 1).toString().padStart(3, '0')}`,
            ...newSession,
            duration: `${newSession.duration} mins`,
            status: "Scheduled",
            type: newSession.course === "N/A" ? "Meeting" : "Class",
            recordingUrl: null
        };

        setSessions([...sessions, sessionToAdd]);
        setIsCreateModalOpen(false);
        setNewSession({
            title: "",
            course: "",
            batch: "",
            tutor: "",
            date: "",
            startTime: "",
            duration: "",
            meetingLink: "",
            description: ""
        });
        setMonthView(new Date()); // Reset calendar view
        toast.success("Live session created successfully!");
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Live":
                return (
                    <Badge className="bg-red-500 hover:bg-red-600 text-white border-none animate-pulse flex items-center gap-1 px-2 py-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-white mr-1" />
                        Live
                    </Badge>
                );
            case "Scheduled":
                return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">Scheduled</Badge>;
            case "Completed":
                return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Completed</Badge>;
            default:
                return <Badge variant="outline" className="bg-muted text-muted-foreground border-border">{status}</Badge>;
        }
    };

    return (
        <DashboardLayout>
            <div className="animate-fade-in space-y-8 max-w-6xl mx-auto pb-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">
                            Live Sessions
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Monitor and manage live learning sessions across all batches.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {activeCardFilter !== "all" && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setActiveCardFilter("all")}
                                className="text-primary hover:text-primary/80 font-medium"
                            >
                                Reset Filters
                            </Button>
                        )}
                        <Button
                            className="bg-primary text-white hover:bg-primary/90 rounded-xl px-5 h-11 shadow-lg shadow-primary/20 transition-all active:scale-95"
                            onClick={() => setIsCreateModalOpen(true)}
                        >
                            <Video className="w-4.5 h-4.5 mr-2" />
                            Create Session
                        </Button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { id: "today", label: "Today", value: stats.today, color: "blue", icon: Calendar },
                        { id: "upcoming", label: "Upcoming", value: stats.upcoming, color: "purple", icon: Clock },
                        { id: "completed", label: "Completed", value: stats.completed, color: "emerald", icon: UserCheck },
                        { id: "meet", label: "Meet", value: stats.meet, color: "red", icon: Video }
                    ].map((card) => (
                        <Card
                            key={card.id}
                            className={cn(
                                "relative overflow-hidden cursor-pointer transition-all duration-300 border-border/50 group h-24",
                                activeCardFilter === card.id ? "ring-2 ring-primary border-transparent shadow-md" : "hover:shadow-md hover:bg-muted/30"
                            )}
                            onClick={() => setActiveCardFilter(activeCardFilter === card.id ? "all" : card.id)}
                        >
                            <CardContent className="p-4 flex flex-col justify-center h-full">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 group-hover:text-primary transition-colors">
                                    {card.label}
                                </p>
                                <div className="flex items-center justify-between">
                                    <h3 className="text-2xl font-bold tracking-tight text-foreground">{card.value}</h3>
                                    <div className={cn(
                                        "p-2 rounded-xl group-hover:scale-110 transition-transform",
                                        card.id === "today" && "bg-blue-500/10 text-blue-600",
                                        card.id === "upcoming" && "bg-purple-500/10 text-purple-600",
                                        card.id === "completed" && "bg-emerald-500/10 text-emerald-600",
                                        card.id === "meet" && "bg-red-500/10 text-red-600"
                                    )}>
                                        <card.icon className="w-5 h-5" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Global Search Bar Section */}
                <Card className="border-border/50 shadow-sm overflow-hidden rounded-2xl bg-muted/20">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-end gap-4">
                            <div className="flex-1">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Global Session Search</label>
                                <div className="relative">
                                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by title, tutor, course, batch, date or status..."
                                        className="pl-11 h-12 rounded-xl bg-background border-border/50 shadow-sm focus:ring-primary/20 text-sm transition-all"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                            <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-border/50 shrink-0 hidden md:flex">
                                <Filter className="w-5 h-5 text-muted-foreground" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Table Section */}
                <Card className="border-border/50 shadow-sm overflow-hidden rounded-2xl">
                    <CardHeader className="border-b bg-muted/10 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                <Video className="w-5 h-5 text-primary" />
                                Session List
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/20 hover:bg-muted/20 border-b border-border/50">
                                        <TableHead className="font-bold py-4 pl-6">Session Title</TableHead>
                                        <TableHead className="font-bold">Course</TableHead>
                                        <TableHead className="font-bold">Batch</TableHead>
                                        <TableHead className="font-bold">Tutor</TableHead>
                                        <TableHead className="font-bold">Start Time</TableHead>
                                        <TableHead className="font-bold">Duration</TableHead>
                                        <TableHead className="font-bold">Status</TableHead>
                                        <TableHead className="font-bold text-right pr-6">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredSessions.length > 0 ? (
                                        filteredSessions.map((session) => (
                                            <TableRow key={session.id} className="hover:bg-muted/5 transition-colors border-b last:border-0 text-sm border-border/50">
                                                <TableCell className="py-4 pl-6 font-semibold">
                                                    <div className="flex flex-col">
                                                        <span className="text-foreground">{session.title}</span>
                                                        <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                                                            <Calendar className="w-2.5 h-2.5" />
                                                            {new Date(session.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    <div className="flex items-center gap-2">
                                                        <BookOpen className="w-3.5 h-3.5 text-primary/40" />
                                                        {session.course}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground font-medium">
                                                    <div className="flex items-center gap-2">
                                                        <Layers className="w-3.5 h-3.5 text-primary/40" />
                                                        {session.batch}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-2">
                                                        <User className="w-3.5 h-3.5 text-primary/40" />
                                                        {session.tutor}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground font-medium">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-3.5 h-3.5 text-primary/40" />
                                                        {session.startTime}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">{session.duration}</TableCell>
                                                <TableCell>{getStatusBadge(session.status)}</TableCell>
                                                <TableCell className="text-right pr-6">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-muted rounded-full">
                                                                <MoreVertical className="w-4 h-4 text-muted-foreground" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48 rounded-xl border-border/50">
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="gap-2 cursor-pointer"
                                                                onClick={() => handleViewDetails(session)}
                                                            >
                                                                <Eye className="w-4 h-4 text-primary" /> View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="gap-2 cursor-pointer text-blue-600 focus:text-blue-600 focus:bg-blue-50"
                                                                onClick={() => handleJoinSession(session.meetingLink)}
                                                            >
                                                                <Video className="w-4 h-4" /> Join Session
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="gap-2 cursor-pointer"
                                                                onClick={() => handleViewRecording(session.recordingUrl)}
                                                            >
                                                                <PlayCircle className="w-4 h-4 text-emerald-600" /> View Recording
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={8} className="h-32 text-center text-muted-foreground italic">
                                                No live sessions found matching your criteria.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Session Details Modal */}
                <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                    <DialogContent className="sm:max-w-[500px] rounded-3xl border-border shadow-2xl p-0 overflow-hidden bg-background">
                        <div className="bg-primary/5 p-6 border-b border-border/50">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                                    <Info className="w-5 h-5 text-primary" />
                                    Session Information
                                </DialogTitle>
                                <DialogDescription className="text-muted-foreground mt-1">
                                    Review the complete details of this learning session.
                                </DialogDescription>
                            </DialogHeader>
                        </div>

                        {selectedSession && (
                            <div className="p-6 space-y-6">
                                {/* Title Section */}
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Session Title</label>
                                    <p className="text-lg font-bold text-foreground tracking-tight">{selectedSession.title}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Badge variant="outline" className={cn(
                                            "rounded-lg px-2 py-0.5 pointer-events-none capitalize",
                                            selectedSession.type === "Meeting" ? "bg-purple-500/10 text-purple-600 border-purple-200" : "bg-blue-500/10 text-blue-600 border-blue-200"
                                        )}>
                                            {selectedSession.type}
                                        </Badge>
                                        {getStatusBadge(selectedSession.status)}
                                    </div>
                                </div>

                                {/* Detail Grid */}
                                <div className="grid grid-cols-2 gap-6 pt-2">
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <BookOpen className="w-3.5 h-3.5" />
                                            <span className="text-[10px] font-bold uppercase tracking-wider">Course</span>
                                        </div>
                                        <p className="text-sm font-semibold text-foreground">{selectedSession.course}</p>
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Layers className="w-3.5 h-3.5" />
                                            <span className="text-[10px] font-bold uppercase tracking-wider">Batch</span>
                                        </div>
                                        <p className="text-sm font-semibold text-foreground">{selectedSession.batch}</p>
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <User className="w-3.5 h-3.5" />
                                            <span className="text-[10px] font-bold uppercase tracking-wider">Tutor / Host</span>
                                        </div>
                                        <p className="text-sm font-semibold text-foreground">{selectedSession.tutor}</p>
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span className="text-[10px] font-bold uppercase tracking-wider">Duration</span>
                                        </div>
                                        <p className="text-sm font-semibold text-foreground">{selectedSession.duration}</p>
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span className="text-[10px] font-bold uppercase tracking-wider">Date</span>
                                        </div>
                                        <p className="text-sm font-semibold text-foreground">
                                            {new Date(selectedSession.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </p>
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span className="text-[10px] font-bold uppercase tracking-wider">Start Time</span>
                                        </div>
                                        <p className="text-sm font-semibold text-foreground">{selectedSession.startTime}</p>
                                    </div>
                                </div>

                                {/* Link Section */}
                                <div className="pt-4 border-t border-dashed border-border/50">
                                    <div className="bg-muted/30 rounded-2xl p-4 flex items-center justify-between gap-4">
                                        <div className="flex-1 overflow-hidden">
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Meeting Link</p>
                                            <p className="text-xs font-mono text-primary truncate underline cursor-pointer hover:text-primary/80">
                                                {selectedSession.meetingLink}
                                            </p>
                                        </div>
                                        <Button
                                            size="sm"
                                            className="rounded-xl h-10 px-4 shrink-0 transition-transform active:scale-95 shadow-sm"
                                            onClick={() => handleJoinSession(selectedSession.meetingLink)}
                                        >
                                            <ExternalLink className="w-4 h-4 mr-2" />
                                            Join Now
                                        </Button>
                                    </div>
                                </div>

                                {/* Recording Section */}
                                {selectedSession.status === "Completed" && (
                                    <div className="pt-2">
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full h-12 rounded-2xl border-border/50 font-semibold gap-2 transition-all",
                                                selectedSession.recordingUrl ? "text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200" : "text-muted-foreground opacity-50 cursor-not-allowed"
                                            )}
                                            onClick={() => handleViewRecording(selectedSession.recordingUrl)}
                                            disabled={!selectedSession.recordingUrl}
                                        >
                                            <PlayCircle className="w-5 h-5" />
                                            {selectedSession.recordingUrl ? "Watch Session Recording" : "Recording Pending"}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="p-4 bg-muted/20 border-t border-border/50 flex justify-end">
                            <Button variant="ghost" className="rounded-xl px-6" onClick={() => setIsDetailsOpen(false)}>
                                Close
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Create Session Modal */}
                <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                    <DialogContent className="sm:max-w-[600px] rounded-3xl border-border shadow-2xl p-0 overflow-hidden bg-background">
                        <div className="bg-primary/5 p-6 border-b border-border/50">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                                    <Video className="w-5 h-5 text-primary" />
                                    Schedule New Session
                                </DialogTitle>
                                <DialogDescription className="text-muted-foreground mt-1">
                                    Fill in the details below to create a new live learning session or meeting.
                                </DialogDescription>
                            </DialogHeader>
                        </div>

                        <div className="p-6 overflow-y-auto max-h-[70vh]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="md:col-span-2 space-y-1.5">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider pl-1">Session Title</label>
                                    <Input
                                        placeholder="e.g. Advanced Frontend Architecture"
                                        className="rounded-xl h-11 border-border/50 focus:ring-primary/20"
                                        value={newSession.title}
                                        onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider pl-1">Course</label>
                                    <Select
                                        value={newSession.course}
                                        onValueChange={(value) => setNewSession({ ...newSession, course: value })}
                                    >
                                        <SelectTrigger className="rounded-xl h-11 border-border/50 focus:ring-primary/20">
                                            <SelectValue placeholder="Select Course" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-border/50">
                                            {availableCourses.map(course => (
                                                <SelectItem key={course} value={course}>{course}</SelectItem>
                                            ))}
                                            <SelectItem value="N/A">Internal Meeting (N/A)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider pl-1">Batch</label>
                                    <Select
                                        value={newSession.batch}
                                        onValueChange={(value) => setNewSession({ ...newSession, batch: value })}
                                    >
                                        <SelectTrigger className="rounded-xl h-11 border-border/50 focus:ring-primary/20">
                                            <SelectValue placeholder="Select Batch" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-border/50">
                                            {availableBatches.map(batch => (
                                                <SelectItem key={batch} value={batch}>{batch}</SelectItem>
                                            ))}
                                            <SelectItem value="Internal">Internal</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider pl-1">Assign Tutor / Host</label>
                                    <Select
                                        value={newSession.tutor}
                                        onValueChange={(value) => setNewSession({ ...newSession, tutor: value })}
                                    >
                                        <SelectTrigger className="rounded-xl h-11 border-border/50 focus:ring-primary/20">
                                            <SelectValue placeholder="Select Tutor" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-border/50">
                                            {availableTutors.map(tutor => (
                                                <SelectItem key={tutor} value={tutor}>{tutor}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider pl-1">Session Date</label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-full h-11 justify-start text-left font-normal rounded-xl bg-background border-border/50 focus:ring-primary/20",
                                                    !newSession.date && "text-muted-foreground"
                                                )}
                                            >
                                                <Calendar className="mr-2 h-4 w-4 text-primary" />
                                                {newSession.date ? (
                                                    format(parseISO(newSession.date), "dd MMMM yyyy")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-4 rounded-2xl border-border/50 shadow-xl" align="start">
                                            <div className="flex items-center gap-2 mb-4">
                                                <Select
                                                    value={months[monthView.getMonth()]}
                                                    onValueChange={(val) => {
                                                        const newMonth = months.indexOf(val);
                                                        const newDate = new Date(monthView);
                                                        newDate.setMonth(newMonth);
                                                        setMonthView(newDate);
                                                    }}
                                                >
                                                    <SelectTrigger className="h-9 rounded-lg bg-muted/50 border-none text-xs font-bold">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="max-h-64 rounded-xl">
                                                        {months.map(m => (
                                                            <SelectItem key={m} value={m} className="text-xs font-medium">{m}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>

                                                <Select
                                                    value={monthView.getFullYear().toString()}
                                                    onValueChange={(val) => {
                                                        const newYear = parseInt(val);
                                                        const newDate = new Date(monthView);
                                                        newDate.setFullYear(newYear);
                                                        setMonthView(newDate);
                                                    }}
                                                >
                                                    <SelectTrigger className="h-9 rounded-lg bg-muted/50 border-none text-xs font-bold">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="max-h-64 rounded-xl">
                                                        {years.map(y => (
                                                            <SelectItem key={y} value={y} className="text-xs font-medium">{y}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <CalendarComponent
                                                mode="single"
                                                month={monthView}
                                                onMonthChange={setMonthView}
                                                selected={newSession.date ? parseISO(newSession.date) : undefined}
                                                onSelect={(date) => {
                                                    if (date) {
                                                        setNewSession({ ...newSession, date: format(date, "yyyy-MM-dd") });
                                                    }
                                                }}
                                                initialFocus
                                                className="rounded-xl p-0"
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider pl-1">Start Time</label>
                                    <div className="relative">
                                        <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                        <Input
                                            placeholder="e.g. 10:00 AM"
                                            className="rounded-xl h-11 pl-10 border-border/50 focus:ring-primary/20"
                                            value={newSession.startTime}
                                            onChange={(e) => setNewSession({ ...newSession, startTime: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider pl-1">Duration (minutes)</label>
                                    <Input
                                        type="number"
                                        placeholder="e.g. 45"
                                        className="rounded-xl h-11 border-border/50 focus:ring-primary/20"
                                        value={newSession.duration}
                                        onChange={(e) => setNewSession({ ...newSession, duration: e.target.value })}
                                    />
                                </div>

                                <div className="md:col-span-2 space-y-1.5">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider pl-1">Meeting Link</label>
                                    <div className="relative">
                                        <ExternalLink className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                        <Input
                                            placeholder="https://meet.google.com/..."
                                            className="rounded-xl h-11 pl-10 border-border/50 focus:ring-primary/20"
                                            value={newSession.meetingLink}
                                            onChange={(e) => setNewSession({ ...newSession, meetingLink: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="md:col-span-2 space-y-1.5">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider pl-1">Description (Optional)</label>
                                    <textarea
                                        className="w-full min-h-[100px] rounded-2xl border border-border/50 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background transition-all"
                                        placeholder="Add any specific instructions or agenda for this session..."
                                        value={newSession.description}
                                        onChange={(e) => setNewSession({ ...newSession, description: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-muted/20 border-t border-border/50 flex items-center justify-end gap-3">
                            <Button
                                variant="ghost"
                                className="rounded-xl px-6 h-11 font-medium"
                                onClick={() => setIsCreateModalOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="rounded-xl px-8 h-11 font-bold shadow-lg shadow-primary/20"
                                onClick={handleCreateSession}
                            >
                                Create Session
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    );
};

export default LiveSessions;
