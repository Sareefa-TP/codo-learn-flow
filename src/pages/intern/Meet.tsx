import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video, Calendar, Clock, PlayCircle, User, Info, Timer, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Types ---

interface Session {
  id: string;
  title: string;
  mentor: string;
  date: string;
  time: string;
  startTime: string; // ISO string for timer calculation
  duration: string;
  status: "upcoming" | "live" | "completed";
}

interface RegularSession {
  id: string;
  title: string;
  mentor: string;
  schedule: string;
  time: string;
  isActive: boolean;
}

// --- Mock Data ---
const now = new Date();
const tonight = new Date(now);
tonight.setHours(20, 0, 0, 0);

const initialSessions: Session[] = [
  {
    id: "1",
    title: "Advanced React Patterns & Performance",
    mentor: "John Doe",
    date: "Today",
    time: "10:00 AM",
    startTime: new Date(now.getTime() - 1800000).toISOString(),
    duration: "90 min",
    status: "live",
  },
  {
    id: "2",
    title: "Backend Scalability: Moving from Monolith to Microservices",
    mentor: "Jane Smith",
    date: "Today",
    time: "Starting Soon",
    startTime: new Date(now.getTime() + 125000).toISOString(),
    duration: "60 min",
    status: "upcoming",
  },
  {
    id: "3",
    title: "UI/UX Best Practices for Enterprise Dashboards",
    mentor: "Alex Rivera",
    date: tonight.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    time: "08:00 PM",
    startTime: tonight.toISOString(),
    duration: "45 min",
    status: "upcoming",
  },
  {
    id: "4",
    title: "Introduction to Docker & Kubernetes",
    mentor: "Sarah Chen",
    date: "Mar 20, 2026",
    time: "10:00 AM",
    startTime: new Date("2026-03-20T10:00:00").toISOString(),
    duration: "120 min",
    status: "completed",
  },
  {
    id: "5",
    title: "State Management Deep Dive",
    mentor: "John Doe",
    date: "Mar 18, 2026",
    time: "04:00 PM",
    startTime: new Date("2026-03-18T16:00:00").toISOString(),
    duration: "75 min",
    status: "completed",
  },
];

const fixedSessions: RegularSession[] = [
  {
    id: "fs1",
    title: "Growth Glimps",
    mentor: "Team Codo",
    schedule: "Every Tue & Thu",
    time: "10:00 AM",
    isActive: true,
  },
  {
    id: "fs2",
    title: "Weekly Meet",
    mentor: "Team Codo",
    schedule: "Every Mon",
    time: "04:00 PM",
    isActive: true,
  },
];

// --- Helpers ---

const getTimeRemaining = (startTime: string) => {
  const total = Date.parse(startTime) - Date.parse(new Date().toString());
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return {
    total,
    days,
    hours,
    minutes,
    seconds
  };
};

const formatCountdown = (startTime: string) => {
  const { total, hours, minutes, seconds } = getTimeRemaining(startTime);
  if (total <= 0) return "00h : 00m : 00s";
  
  const h = String(hours).padStart(2, '0');
  const m = String(minutes).padStart(2, '0');
  const s = String(seconds).padStart(2, '0');
  
  return `${h}h : ${m}m : ${s}s`;
};

// --- Sub-components ---

const SessionCard = ({ session }: { session: Session }) => {
  const isLive = session.status === "live";
  const [countdown, setCountdown] = useState(formatCountdown(session.startTime));

  useEffect(() => {
    if (session.status !== "upcoming") return;

    const timer = setInterval(() => {
      setCountdown(formatCountdown(session.startTime));
    }, 1000);

    return () => clearInterval(timer);
  }, [session.startTime, session.status]);

  return (
    <Card className={cn(
      "border-border/50 shadow-sm rounded-xl overflow-hidden transition-all duration-200 hover:shadow-md group",
      isLive && "border-primary/50 shadow-primary/5 bg-primary/[0.02]"
    )}>
      <CardContent className="p-0">
        <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
              isLive ? "bg-primary text-primary-foreground animate-pulse" : "bg-muted text-muted-foreground"
            )}>
              <Video className="w-6 h-6" />
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-lg leading-tight text-foreground line-clamp-1">
                  {session.title}
                </h3>
                {isLive && (
                  <Badge className="bg-red-500 hover:bg-red-600 text-[10px] font-black uppercase tracking-wider h-5 flex items-center shadow-sm whitespace-nowrap">
                    Live Now
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-primary/70" />
                  <span className="font-medium">{session.mentor}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{session.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{session.time} ({session.duration})</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end md:self-center">
            {session.status === "upcoming" && (
              <div className="flex flex-col items-end gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                  <Timer className="w-3 h-3" /> Starts In
                </span>
                <div className="bg-primary/5 border border-primary/20 rounded-lg px-4 py-1.5 font-mono text-sm font-bold text-primary flex items-center gap-1 shadow-inner">
                  {countdown}
                </div>
              </div>
            )}
            {session.status === "live" && (
              <Button size="sm" className="h-10 text-xs font-bold rounded-lg px-8 bg-primary hover:bg-primary/90 shadow-md shadow-primary/20 animate-in zoom-in-95 duration-300">
                Join Now
              </Button>
            )}
            {session.status === "completed" && (
              <Button variant="outline" size="sm" className="h-9 gap-2 text-xs font-semibold rounded-lg hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all group/play">
                <PlayCircle className="w-4 h-4 text-primary group-hover/play:scale-110 transition-transform" />
                Watch Recording
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const RegularSessionCard = ({ session }: { session: RegularSession }) => {
  return (
    <Card className="border-border/50 shadow-sm rounded-xl overflow-hidden transition-all duration-200 hover:shadow-md group">
      <CardContent className="p-0">
        <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300"
            )}>
              <RefreshCw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-700" />
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-lg leading-tight text-foreground line-clamp-1">
                  {session.title}
                </h3>
                {session.isActive && (
                  <Badge className="bg-emerald-500 hover:bg-emerald-600 text-[10px] font-black uppercase tracking-wider h-5 flex items-center shadow-sm">
                    Active
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-primary/70" />
                  <span className="font-medium">{session.mentor}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="font-semibold text-primary/80">
                    {session.schedule} <span className="mx-1 text-muted-foreground/30 font-light">|</span> {session.time}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end md:self-center">
            {session.isActive ? (
              <Button size="sm" className="h-10 text-xs font-bold rounded-lg px-8 bg-primary hover:bg-primary/90 shadow-md shadow-primary/20">
                Join Now
              </Button>
            ) : (
              <div className="text-right px-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap mb-1">Next Session</p>
                <Badge variant="outline" className="text-xs font-bold py-1 bg-muted/30">
                  {session.schedule} @ {session.time}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// --- Main Page ---

const Meet = () => {
  const { tab } = useParams();
  const navigate = useNavigate();
  const activeTab = tab || "live";

  const [sessionsState, setSessionsState] = useState<Session[]>(initialSessions);

  useEffect(() => {
    if (!tab) {
      navigate("/intern/meet/live", { replace: true });
    }
  }, [tab, navigate]);

  const handleTabChange = (value: string) => {
    navigate(`/intern/meet/${value}`);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setSessionsState(prevSessions => {
        let changed = false;
        const newSessions = prevSessions.map(session => {
          if (session.status !== "upcoming") return session;
          
          const { total } = getTimeRemaining(session.startTime);
          if (total <= 0) {
            changed = true;
            return { ...session, status: "live" as const };
          }
          return session;
        });
        
        return changed ? newSessions : prevSessions;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const liveSessions = sessionsState.filter(s => s.status === "live");
  const upcomingSessions = sessionsState.filter(s => s.status === "upcoming");
  const completedSessions = sessionsState.filter(s => s.status === "completed");

  const EmptyState = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center space-y-4 animate-in fade-in zoom-in-95 duration-500 bg-muted/5 border border-dashed border-border/40 rounded-3xl">
      <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center">
        <Info className="w-10 h-10 text-muted-foreground/30" />
      </div>
      <div className="max-w-xs">
        <p className="text-muted-foreground font-medium">{message}</p>
        <p className="text-xs text-muted-foreground/60 mt-2">
          New sessions will appear here once scheduled by your mentor.
        </p>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-8 max-w-6xl mx-auto px-4 md:px-6 lg:px-8 pb-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/10 pb-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 shadow-inner">
              <Video className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
                Meet
              </h1>
              <p className="text-muted-foreground text-sm font-medium mt-1">
                Join your live sessions and view recordings
              </p>
            </div>
          </div>
        </div>

        {/* Tabs Section - Aligned with Tasks UI */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 bg-muted/50 p-1 rounded-xl w-fit border border-border/40 flex-wrap">
              {[
                { id: "live", label: "Live Now", count: liveSessions.length },
                { id: "upcoming", label: "Upcoming", count: upcomingSessions.length },
                { id: "recordings", label: "Recordings", count: completedSessions.length },
                { id: "regular", label: "Regular", count: fixedSessions.length },
              ].map((tabInfo) => (
                <button
                  key={tabInfo.id}
                  onClick={() => handleTabChange(tabInfo.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all relative",
                    activeTab === tabInfo.id
                      ? "bg-background shadow-sm text-foreground border border-border/50"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span className="relative flex items-center gap-2">
                    {tabInfo.label}
                    {tabInfo.id === "live" && tabInfo.count > 0 && (
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                      </span>
                    )}
                  </span>
                  <span className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded-full font-black",
                    activeTab === tabInfo.id
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  )}>
                    {tabInfo.count}
                  </span>
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-2 px-3 text-[11px] font-bold text-muted-foreground bg-muted/30 py-2 rounded-xl border border-border/20 w-fit">
              <Clock className="w-3.5 h-3.5" />
              <span>TimeZone: IST (UTC+5:30)</span>
            </div>
          </div>

          {/* Content Rendering based on activeTab */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-[300px]">
            {activeTab === "live" && (
              <div className="space-y-4">
                {liveSessions.length > 0 ? (
                  <div className="grid gap-4">
                    {liveSessions.map(session => (
                      <SessionCard key={session.id} session={session} />
                    ))}
                  </div>
                ) : (
                  <EmptyState message="No sessions are live right now" />
                )}
              </div>
            )}
            
            {activeTab === "upcoming" && (
              <div className="space-y-4">
                {upcomingSessions.length > 0 ? (
                  <div className="grid gap-4">
                    {upcomingSessions.map(session => (
                      <SessionCard key={session.id} session={session} />
                    ))}
                  </div>
                ) : (
                  <EmptyState message="No upcoming sessions available" />
                )}
              </div>
            )}

            {activeTab === "recordings" && (
              <div className="space-y-4">
                {completedSessions.length > 0 ? (
                  <div className="grid gap-4">
                    {completedSessions.map(session => (
                      <SessionCard key={session.id} session={session} />
                    ))}
                  </div>
                ) : (
                  <EmptyState message="No recordings found" />
                )}
              </div>
            )}

            {activeTab === "regular" && (
              <div className="space-y-4">
                {fixedSessions.length > 0 ? (
                  <div className="grid gap-4">
                    {fixedSessions.map(session => (
                      <RegularSessionCard key={session.id} session={session} />
                    ))}
                  </div>
                ) : (
                  <EmptyState message="No regular sessions scheduled" />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Meet;
