import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Video,
  Clock,
  Calendar as CalendarIcon,
  ClipboardList,
  XCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Demo Data
const initialLiveClasses = [
  { id: "LC-1", batch: "Jan 2026 Batch", topic: "Advanced React Hooks", date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }), time: "10:00 AM", duration: "60 mins", link: "https://meet.google.com/abc-defg-hij", status: "Upcoming" },
  { id: "LC-2", batch: "Feb 2026 Batch", topic: "Node.js Basics", date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }), time: "01:30 PM", duration: "90 mins", link: "https://meet.google.com/qrs-tuvw-xyz", status: "Upcoming" },
  { id: "LC-3", batch: "Oct 2025 Batch", topic: "System Design Patterns", date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }), time: "04:00 PM", duration: "120 mins", link: "https://meet.google.com/xyz-abcd-efg", status: "Upcoming" },
  { id: "LC-4", batch: "Dec 2025 Batch", topic: "Redux State Management", date: "25 Feb 2026", time: "02:00 PM", duration: "45 mins", link: "https://meet.google.com/xyz-abcd-efg", status: "Completed" },
];

const cancelledClasses = [
  { id: "CC-1", batch: "Feb 2026 Batch", date: "28 Mar 2026", time: "10:00 AM", reason: "Technical Issue" },
  { id: "CC-2", batch: "Oct 2025 Batch", date: "20 Mar 2026", time: "04:00 PM", reason: "Public Holiday" },
];

const pendingSubmissions = [
  { id: "PS-1", assignment: "HTML Portfolio Project", batch: "Jan 2026 Batch", date: "30 Mar 2026" },
  { id: "PS-2", assignment: "CSS Flexbox Challenge", batch: "Feb 2026 Batch", date: "29 Mar 2026" },
  { id: "PS-3", assignment: "JavaScript Form Validation", batch: "Jan 2026 Batch", date: "28 Mar 2026" },
];

const TutorDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [liveClasses] = useState(initialLiveClasses);

  const now = new Date();
  const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const parseSessionDateTime = (dateStr: string, timeStr: string) => {
    try {
      // Handle DD MMM YYYY format
      return new Date(`${dateStr} ${timeStr}`);
    } catch (e) {
      return new Date(0);
    }
  };
  const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const sessionsToday = liveClasses.filter(lc => lc.date === todayStr).length;

  const formatTimeParts = (timeStr: string): { hhmm: string; meridiem?: string } => {
    const trimmed = timeStr.trim();
    const match = trimmed.match(/^(\d{1,2}:\d{2})\s*(AM|PM)$/i);
    if (!match) return { hhmm: trimmed };
    return { hhmm: match[1], meridiem: match[2].toUpperCase() };
  };

  // Logic for Upcoming Sessions (Today: 12 AM - 12 AM)
  const upcomingToday = useMemo(() => {
    return liveClasses
      .filter(lc => lc.date === todayStr && lc.status === "Upcoming")
      .sort((a, b) => {
        const timeA = parseSessionDateTime(a.date, a.time).getTime();
        const timeB = parseSessionDateTime(b.date, b.time).getTime();
        return timeA - timeB;
      });
  }, [liveClasses, todayStr]);

  return (
    <DashboardLayout>
      <div className="animate-fade-in mx-auto w-full max-w-[1320px] space-y-8 pb-10">

        {/* Welcome Header */}
        <div className="grid grid-cols-1 gap-6 rounded-xl border border-border/60 bg-background/40 p-6 shadow-sm backdrop-blur-sm md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              {getGreeting()}, John
            </h1>
            <p className="mt-2 text-sm font-medium text-muted-foreground sm:text-base">
              Here’s your schedule and updates for today
            </p>
          </div>
          <div className="space-y-2 text-left md:col-span-4 md:text-right">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{todayStr}</p>
            <Badge className="inline-flex bg-emerald-500/10 text-emerald-700 border-emerald-500/20 font-bold px-3.5 py-1.5 rounded-xl text-xs">
              {sessionsToday} Sessions Today
            </Badge>
          </div>
        </div>

        {/* 1. Upcoming Sessions (Today: 12 AM - 12 AM) */}
        <div className="space-y-5">
           <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
              <Video className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">Upcoming Sessions (Today)</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {upcomingToday.length > 0 ? (
              upcomingToday.map((lc) => (
                <Card key={lc.id} className="group rounded-xl border border-border/60 bg-card/40 shadow-sm transition-colors hover:border-primary/30">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-start gap-4">
                        <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl border border-border/60 bg-muted/40 transition-colors group-hover:border-primary/20 group-hover:bg-primary/5">
                          <span className="text-[9px] font-bold uppercase opacity-60">Time</span>
                          <span className="text-sm font-extrabold leading-none">
                            {formatTimeParts(lc.time).hhmm}
                          </span>
                          {formatTimeParts(lc.time).meridiem ? (
                            <span className="mt-0.5 text-[9px] font-bold uppercase text-muted-foreground/80">
                              {formatTimeParts(lc.time).meridiem}
                            </span>
                          ) : null}
                        </div>
                        <div className="min-w-0">
                          <p className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-primary">{lc.batch}</p>
                          <h4 className="truncate text-sm font-bold text-foreground">{lc.topic}</h4>
                          <div className="mt-1 flex items-center gap-1.5">
                             <Clock className="w-3 h-3 text-muted-foreground" />
                             <p className="text-[10px] text-muted-foreground font-semibold">{lc.duration}</p>
                          </div>
                        </div>
                      </div>
                      <a href={lc.link} target="_blank" rel="noopener noreferrer">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 rounded-xl border-emerald-500/20 px-4 text-[11px] font-bold shadow-sm shadow-emerald-500/5 transition-colors hover:bg-emerald-600 hover:text-white"
                        >
                          Join Session
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full rounded-xl border border-dashed border-border/60 bg-muted/5 p-8 text-center">
                <p className="text-muted-foreground text-sm font-medium italic opacity-70">No other sessions scheduled for today.</p>
              </div>
            )}
          </div>
        </div>

        {/* 3. Cancelled Classes (Priority 3) */}
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-rose-500/20 bg-rose-500/10">
              <XCircle className="w-4 h-4 text-rose-600" />
            </div>
            <h2 className="text-base font-bold tracking-tight text-foreground sm:text-lg">Cancelled Classes</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {cancelledClasses.map((cc) => (
              <Card key={cc.id} className="group rounded-xl border border-border/60 bg-card/40 shadow-sm transition-colors hover:border-rose-300">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl border border-border/60 bg-muted/40 transition-colors group-hover:border-rose-200 group-hover:bg-rose-50/50">
                        <CalendarIcon className="w-6 h-6 text-rose-600/70" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-[9px] font-black uppercase tracking-widest text-rose-700/80">{cc.batch}</p>
                          <Badge variant="outline" className="h-4 rounded-lg border-rose-200 bg-rose-50 px-1.5 text-[8px] font-black tracking-tighter text-rose-700">
                            CANCELLED
                          </Badge>
                        </div>
                        <h4 className="truncate text-[13px] font-bold text-foreground">Reason: "{cc.reason}"</h4>
                        <div className="mt-1 flex items-center gap-3">
                           <div className="flex items-center gap-1">
                             <CalendarIcon className="w-3 h-3 text-muted-foreground" />
                             <p className="text-[10px] text-muted-foreground font-semibold">{cc.date}</p>
                           </div>
                           <div className="flex items-center gap-1 border-l pl-3">
                             <Clock className="w-3 h-3 text-muted-foreground" />
                             <p className="text-[10px] text-muted-foreground font-semibold">{cc.time}</p>
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* 4. Assignment Reviews (Priority 4) */}
        <div className="space-y-5 pb-12">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10">
              <ClipboardList className="w-4 h-4 text-orange-600" />
            </div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold tracking-tight text-foreground sm:text-lg">Assignment Reviews</h2>
              <Badge className="h-6 rounded-xl bg-orange-100 px-3 text-xs font-bold text-orange-800 border-orange-200">
                {pendingSubmissions.length} Action Items
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {pendingSubmissions.map((sub) => (
              <Card key={sub.id} className="group rounded-xl border border-border/60 bg-card/40 shadow-sm transition-colors hover:border-orange-300">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl border border-border/60 bg-muted/40 transition-colors group-hover:border-orange-200 group-hover:bg-orange-50/50">
                        <ClipboardList className="w-6 h-6 text-orange-600/70" />
                      </div>
                      <div className="min-w-0">
                        <p className="mb-0.5 text-[9px] font-black uppercase tracking-widest text-orange-700/80">{sub.batch}</p>
                        <h4 className="truncate text-[13px] font-bold text-foreground">{sub.assignment}</h4>
                        <div className="mt-1 flex items-center gap-1.5">
                           <Clock className="w-3 h-3 text-muted-foreground/60" />
                           <p className="text-[10px] text-muted-foreground font-medium">Submitted: {sub.date}</p>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate("/tutor/assignments")}
                      className="h-9 rounded-xl border-orange-500/20 px-4 text-[11px] font-bold shadow-sm shadow-orange-500/5 transition-colors hover:bg-orange-600 hover:text-white"
                    >
                      Review Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* 5. Earnings Section (Priority 5) */}
        <div className="space-y-5 pb-12">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10">
              <span className="text-base font-bold text-emerald-700">₹</span>
            </div>
            <h2 className="text-base font-bold tracking-tight text-foreground sm:text-lg">Earnings</h2>
          </div>

          <Card className="relative overflow-hidden rounded-xl border border-border/60 bg-card/60 shadow-sm transition-colors hover:border-primary/30">
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-500/5 blur-3xl" />
            <CardContent className="p-8 relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex flex-col sm:flex-row sm:items-center gap-8">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">This Month</p>
                    <h3 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">₹18,000</h3>
                  </div>
                  <div className="hidden sm:block w-px h-12 bg-border/60" />
                  <div className="space-y-4">
                    <div className="flex items-center gap-10">
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Hours Worked</p>
                        <p className="text-lg font-extrabold text-foreground">90 Hours</p>
                      </div>
                      <div className="space-y-0.5 text-right">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Hourly Rate</p>
                        <p className="text-lg font-extrabold text-emerald-700">₹200/hr</p>
                      </div>
                    </div>
                  </div>
                </div>
                <Button 
                  className="h-12 rounded-xl bg-primary px-8 font-bold shadow-sm shadow-primary/10 transition-colors hover:bg-primary/90"
                  onClick={() => navigate("/tutor/wallet")}
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TutorDashboard;
