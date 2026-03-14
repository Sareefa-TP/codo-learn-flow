import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    ExternalLink
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Types
interface Course {
    id: string;
    name: string;
    description: string;
    image: string;
}

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
}

// Demo Data
const initialCourses: Course[] = [
    {
        id: "C-001",
        name: "Full Stack Development",
        description: "Master modern web development from HTML to advanced React and Node.js.",
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=60"
    },
    {
        id: "C-002",
        name: "Python Backend Development",
        description: "Build robust backend systems with Python, Django, and PostgreSQL.",
        image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&auto=format&fit=crop&q=60"
    },
    {
        id: "C-003",
        name: "UI/UX Design",
        description: "Learn user interface and experience design principles with Figma.",
        image: "https://images.unsplash.com/photo-1586717791821-3f44a563dc4c?w=800&auto=format&fit=crop&q=60"
    }
];

const initialWebinars: Webinar[] = [
    {
        id: "W-001",
        courseId: "C-001",
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
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [webinarList, setWebinarList] = useState<Webinar[]>(initialWebinars);

    const filteredWebinars = useMemo(() => {
        if (!selectedCourse) return [];
        return webinarList.filter(w =>
            w.courseId === selectedCourse.id &&
            w.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [selectedCourse, searchQuery, webinarList]);

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

    return (
        <DashboardLayout>
            <div className="animate-fade-in space-y-6 lg:space-y-8 max-w-6xl mx-auto pb-10">

                {!selectedCourse ? (
                    /* View 1: Course Selection Dashboard */
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                                <MonitorPlay className="w-8 h-8 text-primary" />
                                Expert Webinars
                            </h1>
                            <p className="text-muted-foreground mt-2">
                                Exclusive sessions with industry leaders to boost your learning journey.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {initialCourses.map((course) => (
                                <Card
                                    key={course.id}
                                    className="group overflow-hidden hover:border-primary/50 transition-all hover:shadow-xl cursor-pointer"
                                    onClick={() => setSelectedCourse(course)}
                                >
                                    <div className="aspect-video overflow-hidden relative">
                                        <img src={course.image} alt={course.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                                        <div className="absolute bottom-4 left-4 right-4 text-white">
                                            <h3 className="text-lg font-bold line-clamp-1">{course.name}</h3>
                                            <p className="text-xs text-white/70 mt-1 flex items-center gap-1">
                                                <Video className="w-3 h-3" />
                                                {webinarList.filter(w => w.courseId === course.id).length} Webinars Available
                                            </p>
                                        </div>
                                    </div>
                                    <CardContent className="p-5">
                                        <Button className="w-full gap-2 font-bold group-hover:bg-primary transition-colors">
                                            Explore Webinars
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                ) : (
                    /* View 2: Webinar List View */
                    <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <Button variant="ghost" size="icon" onClick={() => setSelectedCourse(null)} className="h-10 w-10 rounded-full hover:bg-primary/10">
                                    <ArrowLeft className="w-5 h-5" />
                                </Button>
                                <div>
                                    <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-foreground">
                                        {selectedCourse.name} Webinars
                                    </h1>
                                    <p className="text-sm text-muted-foreground">
                                        Browse all special sessions for this course.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="relative max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search webinar title..."
                                className="pl-10 h-11 bg-card"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredWebinars.length > 0 ? (
                                filteredWebinars.map((webinar) => (
                                    <Card key={webinar.id} className="border-border/50 shadow-sm hover:shadow-md transition-all overflow-hidden border-l-4 border-l-transparent hover:border-l-primary">
                                        <CardHeader className="pb-4 relative">
                                            <div className="absolute top-6 right-6">
                                                <Badge variant={
                                                    webinar.status === "Live" ? "destructive" :
                                                        webinar.status === "Upcoming" ? "default" : "secondary"
                                                } className={cn(
                                                    "font-bold uppercase tracking-wider text-[10px] px-2",
                                                    webinar.status === "Live" && "animate-pulse"
                                                )}>
                                                    {webinar.status}
                                                </Badge>
                                            </div>
                                            <CardTitle className="pr-16 text-xl">{webinar.title}</CardTitle>
                                            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mt-2">
                                                <div className="flex items-center gap-1.5 font-medium transition-colors hover:text-primary cursor-pointer">
                                                    <User className="w-3.5 h-3.5" />
                                                    {webinar.speaker}
                                                </div>
                                                <div className="flex items-center gap-1.5 font-medium border-l border-border pl-4">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {webinar.dateTime.split(",")[0]}
                                                </div>
                                                <div className="flex items-center gap-1.5 font-medium border-l border-border pl-4">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {webinar.dateTime.split(",")[1]}
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                {webinar.description}
                                            </p>

                                            <div className="flex flex-wrap gap-3">
                                                {webinar.status === "Upcoming" && (
                                                    <Button
                                                        variant={webinar.isRegistered ? "outline" : "default"}
                                                        className={cn(
                                                            "flex-1 font-bold gap-2 transition-all",
                                                            webinar.isRegistered && "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100"
                                                        )}
                                                        onClick={() => !webinar.isRegistered && handleRegister(webinar.id, webinar.title)}
                                                    >
                                                        {webinar.isRegistered ? (
                                                            <>
                                                                <CheckCircle className="w-4 h-4" />
                                                                Registered
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Calendar className="w-4 h-4" />
                                                                Register
                                                            </>
                                                        )}
                                                    </Button>
                                                )}
                                                {webinar.status === "Live" && (
                                                    <Button variant="destructive" className="flex-1 font-bold gap-2 animate-pulse" onClick={() => handleJoin(webinar.meetingLink)}>
                                                        <ExternalLink className="w-4 h-4" />
                                                        Join Now
                                                    </Button>
                                                )}
                                                {webinar.status === "Past" && (
                                                    <Button variant="outline" className="flex-1 font-bold gap-2 hover:bg-primary/5 hover:text-primary hover:border-primary/30" onClick={() => handleWatch(webinar.recordingLink)}>
                                                        <MonitorPlay className="w-4 h-4" />
                                                        Watch Recording
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    className="px-3"
                                                    title="More Info"
                                                    onClick={() => navigate(`/student/my-courses/webinars/${webinar.id}`)}
                                                >
                                                    Details
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <div className="col-span-full h-64 flex flex-col items-center justify-center text-center space-y-4 bg-muted/20 border-2 border-dashed border-border/50 rounded-2xl">
                                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                                        <Search className="w-6 h-6 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-bold">No webinars found</p>
                                        <p className="text-sm text-muted-foreground">Try adjusting your search query or check back later.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

            </div>
        </DashboardLayout>
    );
};

export default StudentWebinars;
