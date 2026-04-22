import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
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
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageSearch from "@/components/shared/PageSearch";
import CourseCard from "@/components/student/CourseCard";

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
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [webinarList, setWebinarList] = useState<Webinar[]>(initialWebinars);

    const handleRegister = (webinarId: string, title: string) => {
        setWebinarList(prev => prev.map(w =>
            w.id === webinarId ? { ...w, isRegistered: true } : w
        ));

        toast.success("Registration Successful", {
            description: `You are now registered for "${title}". A calendar invite will be sent to your email.`,
        });
    };

    const handleJoin = (link?: string) => {
        if (!link) {
            toast.error("Link unavailable", {
                description: "The meeting link is not available yet."
            });
            return;
        }
        toast.info("Opening meeting...");
        window.open(link, "_blank");
    };

    const handleWatch = (link?: string) => {
        if (!link) {
            toast.error("Recording unavailable", {
                description: "The recording for this session is being processed."
            });
            return;
        }
        toast.info("Loading recording...");
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
        let actionClassName = "";
        
        if (webinar.status === "Live") {
            actionText = "Join Now";
            ActionIcon = ExternalLink;
        } else if (webinar.status === "Past") {
            actionText = "Watch Recording";
            ActionIcon = MonitorPlay;
        } else if (webinar.isRegistered) {
            actionText = "Registered";
            ActionIcon = CheckCircle;
            actionClassName = "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20";
        }

        return (
            <CourseCard
                key={webinar.id}
                title={webinar.title}
                category={webinar.status}
                categoryVariant={
                    webinar.status === "Live" ? "destructive" :
                    webinar.status === "Upcoming" ? "default" : "secondary"
                }
                duration={webinar.dateTime}
                description={webinar.description}
                showProgress={false}
                icon={Video}
                onDetailsClick={() => {
                    toast.info(`Loading webinar details...`);
                    navigate(`/student/webinar/${webinar.id}`);
                }}
                onActionClick={() => {
                    if (webinar.status === "Live") handleJoin(webinar.meetingLink);
                    else if (webinar.status === "Past") handleWatch(webinar.recordingLink);
                    else if (!webinar.isRegistered) handleRegister(webinar.id, webinar.title);
                }}
                actionText={actionText}
                actionIcon={ActionIcon}
                actionClassName={cn(
                    "flex-1 transition-all",
                    actionClassName,
                    webinar.status === "Live" && "animate-pulse"
                )}
            />
        );
    };


    return (
        <DashboardLayout>
            <div className="animate-fade-in space-y-0 max-w-6xl mx-auto pb-10 px-4 md:px-6 lg:px-8">
                {/* Header Section */}
                <div className="mb-6 pt-6">
                    <div className="space-y-1.5 text-center sm:text-left">
                        <div className="flex items-center justify-center sm:justify-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/10">
                                <MonitorPlay className="w-6 h-6" />
                            </div>
                            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
                                Webinars
                            </h1>
                        </div>
                        <p className="text-slate-500 text-sm font-medium leading-relaxed sm:pl-13">
                            Exclusive sessions with industry leaders to boost your learning journey.
                        </p>
                    </div>
                </div>

                {/* Search Bar - Positioned as the "Mid" element */}
                <PageSearch
                    placeholder="Search by webinar title, course, or speaker..."
                    onSearch={setSearchQuery}
                    className="mb-8"
                />

                {/* Tabs for Organization */}
                <Tabs defaultValue="upcoming" className="space-y-8">
                    <TabsList className="grid grid-cols-1 md:grid-cols-3 gap-1.5 bg-white p-1.5 rounded-full w-full h-auto shadow-sm border border-border/40">
                        <TabsTrigger 
                            value="upcoming" 
                            className="flex items-center justify-center gap-2 px-6 h-11 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all duration-300 data-[state=active]:bg-[#28B485] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-[#28B485]/20 text-[#94A3B8] hover:bg-slate-50"
                        >
                            <Calendar className="w-4 h-4 shrink-0" />
                            <span>Upcoming Sessions</span>
                            <span className={cn(
                                "text-[10px] px-2 py-0.5 rounded-full font-black ml-1",
                                "bg-slate-100 text-[#94A3B8] group-data-[state=active]:bg-white/20 group-data-[state=active]:text-white"
                            )}>
                                {categorizedWebinars.upcoming.length}
                            </span>
                        </TabsTrigger>
                        
                        <TabsTrigger 
                            value="registered" 
                            className="flex items-center justify-center gap-2 px-6 h-11 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all duration-300 data-[state=active]:bg-[#28B485] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-[#28B485]/20 text-[#94A3B8] hover:bg-slate-50"
                        >
                            <CheckCircle className="w-4 h-4 shrink-0" />
                            <span>Registered</span>
                            <span className={cn(
                                "text-[10px] px-2 py-0.5 rounded-full font-black ml-1",
                                "bg-slate-100 text-[#94A3B8] group-data-[state=active]:bg-white/20 group-data-[state=active]:text-white"
                            )}>
                                {categorizedWebinars.registered.length}
                            </span>
                        </TabsTrigger>

                        <TabsTrigger 
                            value="past" 
                            className="flex items-center justify-center gap-2 px-6 h-11 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all duration-300 data-[state=active]:bg-[#28B485] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-[#28B485]/20 text-[#94A3B8] hover:bg-slate-50"
                        >
                            <PlayCircle className="w-4 h-4 shrink-0" />
                            <span>Recorded/Past</span>
                            <span className={cn(
                                "text-[10px] px-2 py-0.5 rounded-full font-black ml-1",
                                "bg-slate-100 text-[#94A3B8] group-data-[state=active]:bg-white/20 group-data-[state=active]:text-white"
                            )}>
                                {categorizedWebinars.past.length}
                            </span>
                        </TabsTrigger>
                    </TabsList>

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
