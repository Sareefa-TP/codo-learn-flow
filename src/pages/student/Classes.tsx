import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  User,
  Video,
  ArrowLeft,
  PlayCircle,
  CheckCircle2,
  Lock,
  Search,
  BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";

// Centralized Course Data (matching Packages.tsx and Assignments.tsx)
const coursesData = [
  {
    id: 1,
    title: "Full Stack Development",
    category: "Web Development",
    duration: "3 Months",
    status: "Active",
    description: "Master both frontend and backend development in this comprehensive 3-month bootcamp.",
    modulesCount: 8
  },
  {
    id: 2,
    title: "Python Backend Development",
    category: "Software Engineering",
    duration: "2 Months",
    status: "Upcoming",
    description: "Dive deep into robust backend services using Python, FastAPI, and advanced database modeling.",
    modulesCount: 2
  },
  {
    id: 3,
    title: "UI/UX Design Masterclass",
    category: "Design",
    duration: "4 Weeks",
    status: "Enrolled",
    description: "Learn modern design principles and master Figma to create stunning user interfaces.",
    modulesCount: 2
  }
];

// Mock Live Sessions Data
const liveSessionsData: Record<number, any[]> = {
  1: [ // Full Stack Development
    {
      id: 101,
      title: "React State Management & Hooks",
      status: "Live Now",
      date: "13 March 2026",
      time: "2:00 PM – 3:30 PM",
      tutor: "Arjun Mehta",
      meeting_link: "https://meet.google.com/live-demo"
    },
    {
      id: 102,
      title: "Advanced CSS Grid & Flexbox",
      status: "Upcoming",
      date: "15 March 2026",
      time: "10:00 AM – 11:30 AM",
      tutor: "Sarah Jenkins",
      meeting_link: "https://meet.google.com/upcoming-demo"
    },
    {
      id: 103,
      title: "Introduction to HTML5 Semantic Tags",
      status: "Completed",
      date: "10 March 2026",
      time: "11:00 AM – 12:30 PM",
      tutor: "Arjun Mehta",
      recording_link: "https://youtube.com/watch?v=html-basics"
    }
  ],
  2: [], // Python Backend Development
  3: [ // UI/UX Design
    {
      id: 301,
      title: "Figma Prototyping Workshop",
      status: "Upcoming",
      date: "18 March 2026",
      time: "4:00 PM – 5:30 PM",
      tutor: "Elena Rodriguez",
      meeting_link: "https://meet.google.com/design-demo"
    }
  ]
};

const StudentClasses = () => {
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const activeCourse = coursesData.find(c => c.id === selectedCourseId);

  // Filtering Logic
  const filteredCourses = coursesData.filter(course => {
    const matchesCourse = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const sessions = liveSessionsData[course.id] || [];
    const matchesSession = sessions.some(s =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.tutor.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return matchesCourse || matchesSession;
  });

  const rawSessions = selectedCourseId ? liveSessionsData[selectedCourseId] || [] : [];
  const filteredSessions = rawSessions.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.tutor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sessionsLive = filteredSessions.filter(s => s.status === "Live Now");
  const sessionsUpcoming = filteredSessions.filter(s => s.status === "Upcoming");
  const sessionsPast = filteredSessions.filter(s => s.status === "Completed");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Live Now":
        return <Badge className="bg-destructive hover:bg-destructive animate-pulse text-white border-0">Live Now</Badge>;
      case "Upcoming":
        return <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">Upcoming</Badge>;
      case "Completed":
        return <Badge variant="outline" className="bg-muted text-muted-foreground border-border">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6 lg:space-y-8 max-w-5xl mx-auto">

        {!selectedCourseId ? (
          /* Step 1: Course Selection List */
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">
                  Live Sessions
                </h1>
                <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                  Select a course to view scheduled live classes and recordings.
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search live sessions, courses or tutors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
              />
            </div>

            {filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <Card key={course.id} className="flex flex-col border-border/50 hover:border-primary/20 transition-colors shadow-sm hover:shadow-md">
                    <div className="bg-primary/5 p-5 border-b border-primary/10">
                      <div className="flex justify-between items-start mb-3 gap-2">
                        <h3 className="font-semibold text-lg leading-tight line-clamp-2">{course.title}</h3>
                        <Badge variant={course.status === 'Active' ? 'default' : 'secondary'} className={course.status === 'Active' ? 'bg-primary text-primary-foreground' : ''}>
                          {course.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
                        {course.description}
                      </p>
                    </div>
                    <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-5">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-muted/30 p-2.5 rounded-lg border flex items-center gap-2">
                          <Video className="w-3.5 h-3.5 text-primary" />
                          <div className="flex flex-col">
                            <span className="text-[10px] text-muted-foreground font-medium uppercase leading-none mb-1">Sessions</span>
                            <span className="text-xs font-semibold leading-none">
                              {liveSessionsData[course.id]?.length || 0}
                            </span>
                          </div>
                        </div>
                        <div className="bg-muted/30 p-2.5 rounded-lg border flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-primary" />
                          <div className="flex flex-col">
                            <span className="text-[10px] text-muted-foreground font-medium uppercase leading-none mb-1">Modules</span>
                            <span className="text-xs font-semibold leading-none">{course.modulesCount}</span>
                          </div>
                        </div>
                      </div>

                      <Button
                        className="w-full text-xs gap-1.5"
                        onClick={() => {
                          setSelectedCourseId(course.id);
                          window.scrollTo(0, 0);
                        }}
                      >
                        <Video className="w-3.5 h-3.5" />
                        View Live Sessions
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center bg-muted/20 rounded-2xl border border-dashed border-border animate-in fade-in zoom-in-95">
                <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground">No live sessions found</h3>
                <p className="text-muted-foreground max-w-xs mx-auto mt-1">
                  We couldn't find any courses or sessions matching "{searchQuery}". Try a different search term.
                </p>
                <Button
                  variant="outline"
                  className="mt-6"
                  onClick={() => setSearchQuery("")}
                >
                  Clear Search
                </Button>
              </div>
            )}
          </div>
        ) : (
          /* Step 2: Course-specific Sessions Dashboard */
          <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <Button
                variant="ghost"
                className="w-fit text-muted-foreground hover:text-foreground pl-0 group"
                onClick={() => setSelectedCourseId(null)}
              >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to courses
              </Button>

              {/* Search Bar in Step 2 */}
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search in this course..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">
                  {activeCourse?.title}
                </h1>
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                  Live Phase
                </Badge>
              </div>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                Join live classes, interact with tutors, and view session history.
              </p>
            </div>

            <div className="space-y-10">
              {filteredSessions.length > 0 ? (
                <>
                  {/* 1. Live Now Section */}
                  {sessionsLive.length > 0 && (
                    <section className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                        <h2 className="text-lg font-bold text-foreground uppercase tracking-wider">Live Now</h2>
                      </div>
                      <div className="grid gap-4">
                        {sessionsLive.map((session) => (
                          <Card key={session.id} className="border-destructive/30 bg-destructive/5 overflow-hidden">
                            <CardContent className="p-6">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="space-y-3 flex-1">
                                  <div>
                                    <h3 className="text-xl font-bold text-foreground">{session.title}</h3>
                                    <p className="text-muted-foreground text-sm mt-1 flex items-center gap-2">
                                      <User className="w-4 h-4" />
                                      Tutor: {session.tutor}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-4 text-sm font-medium text-destructive">
                                    <span className="flex items-center gap-1.5">
                                      <Clock className="w-4 h-4" />
                                      Ends: {session.time.split('–')[1]}
                                    </span>
                                  </div>
                                </div>
                                <Button asChild className="bg-destructive hover:bg-destructive/90 text-white gap-2 h-12 px-8 shadow-lg shadow-destructive/20">
                                  <a href={session.meeting_link} target="_blank" rel="noopener noreferrer">
                                    <Video className="w-5 h-5" />
                                    Join Now
                                  </a>
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* 2. Upcoming Sessions Section */}
                  <section className="space-y-4">
                    <h2 className="text-lg font-bold text-foreground uppercase tracking-wider">Upcoming Sessions</h2>
                    {sessionsUpcoming.length > 0 ? (
                      <div className="grid gap-4">
                        {sessionsUpcoming.map((session) => (
                          <Card key={session.id} className="border-border/50 hover:border-primary/20 transition-all hover:shadow-sm">
                            <CardContent className="p-5 sm:p-6">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="space-y-3 flex-1">
                                  <div className="flex items-center gap-3">
                                    <h3 className="text-lg font-semibold text-foreground">{session.title}</h3>
                                    {getStatusBadge(session.status)}
                                  </div>
                                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1.5 font-medium text-foreground/80">
                                      <Calendar className="w-4 h-4 text-primary" />
                                      {session.date}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                      <Clock className="w-4 h-4" />
                                      {session.time}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                      <User className="w-4 h-4" />
                                      {session.tutor}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3">
                                  <Button variant="outline" className="gap-2 border-primary/20 hover:bg-primary/5 text-primary">
                                    <Calendar className="w-4 h-4" />
                                    Add to Calendar
                                  </Button>
                                  <Button disabled className="gap-2 opacity-50 cursor-not-allowed">
                                    <Lock className="w-4 h-4" />
                                    Join at {session.time.split('–')[0]}
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="p-10 text-center bg-muted/20 rounded-2xl border border-dashed border-border">
                        <p className="text-muted-foreground">No upcoming sessions matching your search.</p>
                      </div>
                    )}
                  </section>

                  {/* 3. Past Sessions Section */}
                  {sessionsPast.length > 0 && (
                    <section className="space-y-4">
                      <h2 className="text-lg font-bold text-foreground uppercase tracking-wider">Past Sessions</h2>
                      <div className="grid gap-4">
                        {sessionsPast.map((session) => (
                          <Card key={session.id} className="opacity-80 hover:opacity-100 transition-opacity border-border/50">
                            <CardContent className="p-5">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                                    <Video className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-foreground">{session.title}</h3>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                      <Calendar className="w-3 h-3" />
                                      Completed on {session.date}
                                    </p>
                                  </div>
                                </div>
                                <Button asChild variant="ghost" size="sm" className="gap-2 text-primary hover:text-primary hover:bg-primary/5">
                                  <a href={session.recording_link} target="_blank" rel="noopener noreferrer">
                                    <PlayCircle className="w-4 h-4" />
                                    Watch Recording
                                  </a>
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </section>
                  )}
                </>
              ) : (
                <div className="p-12 text-center bg-muted/20 rounded-2xl border border-dashed border-border animate-in fade-in zoom-in-95">
                  <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground">No sessions found in this course</h3>
                  <p className="text-muted-foreground max-w-xs mx-auto mt-1">
                    We couldn't find any sessions matching "{searchQuery}". Try a different search term.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-6"
                    onClick={() => setSearchQuery("")}
                  >
                    Clear Search
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentClasses;
