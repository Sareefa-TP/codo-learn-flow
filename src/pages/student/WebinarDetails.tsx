import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
    Calendar,
    User,
    ArrowLeft,
    Clock,
    PlayCircle,
    CheckCircle,
    MonitorPlay,
    ExternalLink,
    MapPin,
    Share2,
    Info
} from "lucide-react";
import { cn } from "@/lib/utils";

// Same Type Definition (should ideally be shared)
interface Webinar {
    id: string;
    courseId: string;
    title: string;
    speaker: string;
    dateTime: string;
    description: string;
    status: "Upcoming" | "Live" | "Past";
    isRegistered?: boolean;
    meetingLink?: string;
    recordingLink?: string;
    abstract?: string;
}

// Demo Data (Replicated for now to ensure consistency)
const webinars: Webinar[] = [
    {
        id: "W-001",
        courseId: "C-001",
        title: "Future of React Server Components",
        speaker: "Dr. Sarah Mitchell",
        dateTime: "25 Mar 2026, 06:00 PM",
        description: "Join us for an in-depth exploration of RSC and how it's changing the React ecosystem. We'll cover everything from performance benefits to server-side data fetching patterns.",
        abstract: "This session is designed for advanced React developers looking to stay ahead of the curve. We will demonstrate live examples of migrating client components to server components without compromising user experience.",
        status: "Upcoming",
        isRegistered: false,
        meetingLink: "https://meet.google.com/xyz-abc-def"
    },
    {
        id: "W-002",
        courseId: "C-001",
        title: "Building Scalable Microservices with Node.js",
        speaker: "James Wilson",
        dateTime: "14 Mar 2026, 02:30 PM",
        description: "Learn best practices for designing and deploying microservices in a production environment. We'll discuss containerization, service discovery, and message brokers.",
        abstract: " James will walk through a production-grade architecture using Node.js, Docker, and Kubernetes. This is a must-watch for aspiring DevOps engineers and backend architects.",
        status: "Live",
        meetingLink: "https://zoom.us/j/123456789",
        isRegistered: true
    },
    {
        id: "W-003",
        courseId: "C-002",
        title: "Python for Data Science: Beyond the Basics",
        speaker: "Elena Rodriguez",
        dateTime: "10 Mar 2026, 05:00 PM",
        description: "A deep dive into NumPy and Pandas for high-performance data analysis. Discover how to optimize your data pipelines and handle large datasets efficiently.",
        abstract: "Recording now available. The session covered advanced vectorization techniques in NumPy and window functions in Pandas for time-series analysis.",
        status: "Past",
        recordingLink: "https://vimeo.com/123456789"
    },
    {
        id: "W-004",
        courseId: "C-003",
        title: "Designing for Accessibility in 2026",
        speaker: "Michael Chen",
        dateTime: "20 Mar 2026, 11:00 AM",
        description: "Why inclusive design is more important than ever and how to implement it effectively. We'll explore WCAG 3.0 standards and AI-driven accessibility tools.",
        abstract: "As web applications become more complex, accessibility often takes a back seat. Michael shows how to make accessibility a core part of your design process from the start.",
        status: "Upcoming",
        isRegistered: false,
        meetingLink: "https://meet.google.com/asdf-qwer-zxcv"
    }
];

const WebinarDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [webinar, setWebinar] = useState<Webinar | null>(null);

    useEffect(() => {
        const found = webinars.find(w => w.id === id);
        if (found) {
            setWebinar(found);
        }
    }, [id]);

    const handleRegister = () => {
        if (!webinar) return;
        setWebinar(prev => prev ? { ...prev, isRegistered: true } : null);
        toast({
            title: "Registration Successful",
            description: `You are now registered for "${webinar.title}".`,
        });
    };

    const handleJoin = () => {
        if (webinar?.meetingLink) {
            window.open(webinar.meetingLink, "_blank");
        }
    };

    const handleWatch = () => {
        if (webinar?.recordingLink) {
            window.open(webinar.recordingLink, "_blank");
        }
    };

    if (!webinar) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                    <p className="text-muted-foreground italic">Webinar not found</p>
                    <Button variant="outline" onClick={() => navigate(-1)}>Go Back</Button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="animate-fade-in max-w-4xl mx-auto pb-20 space-y-8">
                <Button
                    variant="ghost"
                    onClick={() => navigate("/student/webinar")}
                    className="group pl-0 hover:bg-transparent text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Webinars
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Details */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="space-y-4">
                            <Badge variant={
                                webinar.status === "Live" ? "destructive" :
                                    webinar.status === "Upcoming" ? "default" : "secondary"
                            } className={cn(
                                "font-bold uppercase tracking-wider text-[11px] px-3 py-0.5",
                                webinar.status === "Live" && "animate-pulse"
                            )}>
                                {webinar.status}
                            </Badge>
                            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
                                {webinar.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2 font-medium">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <User className="w-4 h-4" />
                                    </div>
                                    {webinar.speaker}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-primary" />
                                    {webinar.dateTime.split(",")[0]}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-primary" />
                                    {webinar.dateTime.split(",")[1]}
                                </div>
                            </div>
                        </div>

                        <div className="prose prose-sm max-w-none">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Info className="w-5 h-5 text-primary" />
                                About this Webinar
                            </h3>
                            <p className="text-muted-foreground leading-relaxed text-base italic mb-6">
                                "{webinar.description}"
                            </p>
                            <div className="bg-card border rounded-xl p-6 space-y-4">
                                <h4 className="font-bold text-foreground">Session Overview</h4>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    {webinar.abstract}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Actions & Sidebar */}
                    <div className="space-y-6">
                        <Card className="border-primary/20 shadow-lg sticky top-24">
                            <CardHeader>
                                <CardTitle className="text-lg">Webinar Action</CardTitle>
                                <CardDescription>Manage your participation</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {webinar.status === "Upcoming" && (
                                    <Button
                                        className={cn(
                                            "w-full h-12 font-bold gap-2 text-base transition-all",
                                            webinar.isRegistered ? "bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100" : "bg-primary"
                                        )}
                                        onClick={() => !webinar.isRegistered && handleRegister()}
                                    >
                                        {webinar.isRegistered ? (
                                            <>
                                                <CheckCircle className="w-5 h-5" />
                                                Registered
                                            </>
                                        ) : (
                                            <>
                                                <Calendar className="w-5 h-5" />
                                                Register Now
                                            </>
                                        )}
                                    </Button>
                                )}

                                {webinar.status === "Live" && (
                                    <Button variant="destructive" className="w-full h-12 font-bold gap-2 text-base animate-pulse" onClick={handleJoin}>
                                        <ExternalLink className="w-5 h-5" />
                                        Join Now
                                    </Button>
                                )}

                                {webinar.status === "Past" && (
                                    <Button variant="outline" className="w-full h-12 font-bold gap-2 text-base hover:bg-primary/5 hover:text-primary hover:border-primary/30" onClick={handleWatch}>
                                        <MonitorPlay className="w-5 h-5" />
                                        Watch Recording
                                    </Button>
                                )}

                                <div className="pt-4 border-t space-y-4">
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                        <MapPin className="w-4 h-4" />
                                        Online Event
                                    </div>
                                    <Button variant="ghost" size="sm" className="w-full justify-start gap-2 h-9 text-muted-foreground">
                                        <Share2 className="w-4 h-4" />
                                        Share Event
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default WebinarDetails;
