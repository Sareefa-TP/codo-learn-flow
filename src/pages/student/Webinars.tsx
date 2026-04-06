import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Search,
    Video,
    Calendar,
    User,
    ChevronRight,
    ArrowLeft,
    Clock,
    PlayCircle,
    CheckCircle,
    MonitorPlay,
    ExternalLink,
    Filter
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Types
interface Webinar {
    id: string;
    courseId: string;
    courseName: string;
    title: string;
    speaker: string;
    dateTime: string;
    description: string;
    status: "Upcoming" | "Live" | "Past";
    isRegistered?: boolean;
    meetingLink?: string;
    recordingLink?: string;
}

// Demo Data (Enriched with courseName)
const initialWebinars: Webinar[] = [
    {
        id: "W-001",
        courseId: "C-001",
        courseName: "Full Stack Development",
        title: "Future of React Server Components",
        speaker: "Dr. Sarah Mitchell",
        dateTime: "25 Mar 2026, 06:00 PM",
        description: "Join us for an in-depth exploration of RSC and how it's changing the React ecosystem.",
        status: "Upcoming",
        isRegistered: false,
        meetingLink: "https://meet.google.com/xyz-abc-def"
    },
    {
        id: "W-002",
        courseId: "C-001",
        courseName: "Full Stack Development",
        title: "Building Scalable Microservices with Node.js",
        speaker: "James Wilson",
        dateTime: "14 Mar 2026, 02:30 PM",
        description: "Learn best practices for designing and deploying microservices in a production environment.",
        status: "Live",
        meetingLink: "https://zoom.us/j/123456789",
        isRegistered: true
    },
    {
        id: "W-003",
        courseId: "C-002",
        courseName: "Python Backend Development",
        title: "Python for Data Science: Beyond the Basics",
        speaker: "Elena Rodriguez",
        dateTime: "10 Mar 2026, 05:00 PM",
        description: "A deep dive into NumPy and Pandas for high-performance data analysis.",
        status: "Past",
        recordingLink: "https://vimeo.com/123456789"
    },
    {
        id: "W-004",
        courseId: "C-003",
        courseName: "UI/UX Design",
        title: "Designing for Accessibility in 2026",
        speaker: "Michael Chen",
        dateTime: "20 Mar 2026, 11:00 AM",
        description: "Why inclusive design is more important than ever and how to implement it effectively.",
        status: "Upcoming",
        isRegistered: false,
        meetingLink: "https://meet.google.com/asdf-qwer-zxcv"
    }
];

const StudentWebinars = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [webinarList, setWebinarList] = useState<Webinar[]>(initialWebinars);

    const handleRegister = (webinarId: string, title: string) => {
        setWebinarList(prev => prev.map(w =>
            w.id === webinarId ? { ...w, isRegistered: true } : w
        ));

        toast({
            title: "Registration Successful",
            description: `You are now registered for "${title}". A calendar invite will be sent to your email.`,
        });
    };

    const handleJoin = (link?: string) => {
        if (!link) {
            toast({
                title: "Link unavailable",
                description: "The meeting link is not available yet.",
                variant: "destructive"
            });
            return;
        }
        window.open(link, "_blank");
    };

    const handleWatch = (link?: string) => {
        if (!link) {
            toast({
                title: "Recording unavailable",
                description: "The recording for this session is being processed.",
                variant: "destructive"
            });
            return;
        }
        window.open(link, "_blank");
    };

    const filteredWebinars = useMemo(() => {
        return webinarList.filter(w =>
            w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            w.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            w.speaker.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, webinarList]);

    const categorizedWebinars = {
        upcoming: filteredWebinars.filter(w => w.status === "Upcoming" || w.status === "Live"),
        registered: filteredWebinars.filter(w => w.isRegistered),
        past: filteredWebinars.filter(w => w.status === "Past"),
    };

    const WebinarCard = ({ webinar }: { webinar: Webinar }) => {
        let actionText = "Register";
        let ActionIcon = Calendar;
        
        if (webinar.status === "Live") {
            actionText = "Join Now";
            ActionIcon = ExternalLink;
        } else if (webinar.status === "Past") {
            actionText = "Watch Recording";
            ActionIcon = MonitorPlay;
        } else if (webinar.isRegistered) {
            actionText = "Registered";
            ActionIcon = CheckCircle;
        }

        return (
            <Card key={webinar.id} className="group overflow-hidden border-border/50 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 rounded-3xl flex flex-col h-full bg-card">
                <div className="h-40 bg-slate-100 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center relative z-10 transition-transform duration-500 group-hover:scale-110">
                        <Video className="w-7 h-7 text-primary" />
                    </div>
                    <Badge variant={
                        webinar.status === "Live" ? "destructive" :
                            webinar.status === "Upcoming" ? "default" : "secondary"
                    } className={cn(
                        "absolute top-4 right-4 font-black uppercase text-[10px] tracking-widest px-2 shadow-sm",
                        webinar.status === "Live" && "animate-pulse"
                    )}>
                        {webinar.status}
                    </Badge>
                </div>
                <CardContent className="p-6 flex-1 flex flex-col space-y-6">
                    <div className="space-y-1">
                        <div className="flex items-center justify-between">
                            <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">{webinar.courseName}</p>
                        </div>
                        <h3 className="text-lg font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                            {webinar.title}
                        </h3>
                        <p className="text-[11px] text-muted-foreground font-medium flex items-center gap-1.5 pt-1">
                            <Clock className="w-3.5 h-3.5 text-primary" /> {webinar.dateTime}
                        </p>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                        {webinar.description}
                    </p>

                    <div className="flex items-center justify-between gap-4 pt-4 mt-auto">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-xl text-[10px] uppercase font-black tracking-widest text-muted-foreground hover:text-primary px-3"
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/student/webinar/${webinar.id}`);
                            }}
                        >
                            Details
                        </Button>
                        <Button
                            className={cn(
                                "flex-1 bg-primary hover:bg-primary/90 gap-2 rounded-xl h-10 font-bold text-xs shadow-md shadow-primary/20 transition-all",
                                webinar.isRegistered && webinar.status === "Upcoming" && "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20"
                            )}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (webinar.status === "Live") handleJoin(webinar.meetingLink);
                                else if (webinar.status === "Past") handleWatch(webinar.recordingLink);
                                else if (!webinar.isRegistered) handleRegister(webinar.id, webinar.title);
                            }}
                        >
                            {actionText} <ActionIcon className="w-4 h-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <DashboardLayout>
            <div className="animate-fade-in space-y-0 max-w-6xl mx-auto pb-10 px-4 md:px-6 lg:px-8">
                {/* Header Section */}
                <div className="mb-8 pt-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/10">
                                <MonitorPlay className="w-6 h-6" />
                            </div>
                            <h1 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">
                                Webinars
                            </h1>
                        </div>
                        <p className="text-muted-foreground text-sm font-medium ml-13">
                            Exclusive sessions with industry leaders to boost your learning journey.
                        </p>
                    </div>
                </div>

                {/* Standardized Search Bar */}
                <div className="relative mb-10 group animate-in fade-in slide-in-from-top-4 duration-700 delay-100">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-all duration-300" />
                    <input
                        type="text"
                        placeholder="Search by webinar title, course, or speaker..."
                        className="w-full bg-card border border-border/60 rounded-[1.25rem] py-4 pl-12 pr-6 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm placeholder:text-muted-foreground/50"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Tabs for Organization */}
                <Tabs defaultValue="upcoming" className="space-y-8">
                    <div className="flex items-center justify-between border-b pb-2">
                        <TabsList className="bg-transparent h-auto p-0 gap-8">
                            <TabsTrigger value="upcoming" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3 font-bold text-sm text-muted-foreground transition-all">
                                Upcoming Sessions
                                <Badge variant="secondary" className="ml-2 bg-primary/5 text-primary border-none pointer-events-none text-[10px]">
                                    {categorizedWebinars.upcoming.length}
                                </Badge>
                            </TabsTrigger>
                            <TabsTrigger value="registered" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3 font-bold text-sm text-muted-foreground transition-all">
                                Registered
                                <Badge variant="secondary" className="ml-2 bg-primary/5 text-primary border-none pointer-events-none text-[10px]">
                                    {categorizedWebinars.registered.length}
                                </Badge>
                            </TabsTrigger>
                            <TabsTrigger value="past" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3 font-bold text-sm text-muted-foreground transition-all">
                                Recorded/Past
                                <Badge variant="secondary" className="ml-2 bg-primary/5 text-primary border-none pointer-events-none text-[10px]">
                                    {categorizedWebinars.past.length}
                                </Badge>
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="upcoming" className="mt-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {categorizedWebinars.upcoming.length > 0 ? (
                                categorizedWebinars.upcoming.map(webinar => (
                                    <WebinarCard key={webinar.id} webinar={webinar} />
                                ))
                            ) : (
                                <EmptyState message="No upcoming webinars found." />
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="registered" className="mt-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {categorizedWebinars.registered.length > 0 ? (
                                categorizedWebinars.registered.map(webinar => (
                                    <WebinarCard key={webinar.id} webinar={webinar} />
                                ))
                            ) : (
                                <EmptyState message="You haven't registered for any webinars yet." />
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="past" className="mt-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {categorizedWebinars.past.length > 0 ? (
                                categorizedWebinars.past.map(webinar => (
                                    <WebinarCard key={webinar.id} webinar={webinar} />
                                ))
                            ) : (
                                <EmptyState message="No past webinars available." />
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    );
};

const EmptyState = ({ message }: { message: string }) => (
    <div className="col-span-full h-64 flex flex-col items-center justify-center text-center space-y-4 bg-muted/20 border-2 border-dashed border-border/50 rounded-2xl">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <Video className="w-6 h-6 text-muted-foreground" />
        </div>
        <div>
            <p className="text-lg font-bold">No sessions found</p>
            <p className="text-sm text-muted-foreground">{message}</p>
        </div>
    </div>
);

export default StudentWebinars;
