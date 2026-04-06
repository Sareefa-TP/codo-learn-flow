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
  { id: "LC-2", batch: "Oct 2025 Batch", topic: "Redux State Management", date: "25 Feb 2026", time: "02:00 PM", duration: "45 mins", link: "https://meet.google.com/xyz-abcd-efg", status: "Completed" },
  { id: "LC-3", batch: "Feb 2026 Batch", topic: "Node.js Basics", date: new Date(Date.now() + 86400000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }), time: "11:30 AM", duration: "90 mins", link: "https://meet.google.com/qrs-tuvw-xyz", status: "Upcoming" }
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

  // Logic for Next Session & Upcoming
  const allUpcoming = useMemo(() => {
    return liveClasses
      .filter(lc => {
        if (lc.status !== "Upcoming") return false;
        const sessionTime = parseSessionDateTime(lc.date, lc.time);
        return sessionTime >= now;
      })
      .sort((a, b) => {
        const timeA = parseSessionDateTime(a.date, a.time).getTime();
        const timeB = parseSessionDateTime(b.date, b.time).getTime();
        return timeA - timeB;
      });
  }, [liveClasses]);

  const nextSession = allUpcoming[0] || null;
  const upcoming24h = allUpcoming.slice(1).filter(lc => {
    const sessionTime = parseSessionDateTime(lc.date, lc.time);
    return sessionTime <= twentyFourHoursFromNow;
  });

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-10 lg:space-y-12 max-w-5xl mx-auto pb-10">

        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/50 pb-10 mt-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-black text-foreground tracking-tight">
              {getGreeting()}, John
            </h1>
            <p className="text-muted-foreground font-medium mt-2 text-lg">
              Here’s your schedule and updates for today
            </p>
          </div>
          <div className="text-left md:text-right space-y-3">
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{todayStr}</p>
            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-black px-4 py-1.5 rounded-lg text-xs">
              {sessionsToday} Sessions Today
            </Badge>
          </div>
        </div>

        {/* 1. Next Sessions (Priority 1) */}
        <div className="space-y-5">
           <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
              <Video className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Next Session</h2>
          </div>

          {nextSession ? (
            <Card className="border-2 border-primary/20 bg-primary/5 shadow-xl shadow-primary/5 overflow-hidden rounded-2xl relative group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-primary/20 transition-all duration-500" />
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between p-6 md:p-8 gap-6 relative z-10">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-2xl bg-primary text-white flex flex-col items-center justify-center shadow-lg shadow-primary/30 shrink-0">
                      <span className="text-[10px] font-bold uppercase opacity-80 mb-0.5">Time</span>
                      <span className="text-xl font-black tracking-tighter">{nextSession.time}</span>
                    </div>
                    <div>
                      <Badge className="bg-primary/20 text-primary border-primary/20 hover:bg-primary/30 transition-all font-bold uppercase text-[10px] mb-2 px-3">
                        {nextSession.batch}
                      </Badge>
                      <h3 className="text-2xl font-bold text-foreground tracking-tight">{nextSession.topic}</h3>
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground font-semibold">
                          <Clock className="w-4 h-4 text-primary" />
                          <span>Duration: {nextSession.duration}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground font-semibold border-l pl-4">
                          <CalendarIcon className="w-4 h-4 text-primary" />
                          <span>{nextSession.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center gap-4 border-t md:border-t-0 pt-6 md:pt-0">
                    <a href={nextSession.link} target="_blank" rel="noopener noreferrer" className="w-full">
                      <Button className="w-full md:w-auto h-14 px-10 rounded-xl font-bold shadow-lg shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-700 gap-2 text-base transition-all hover:scale-[1.02]">
                        Start Session
                      </Button>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="p-10 border-2 border-dashed border-border/60 rounded-3xl text-center bg-muted/10">
              <p className="text-muted-foreground font-medium">No sessions scheduled at the moment.</p>
            </div>
          )}
        </div>

        {/* 2. Upcoming Sessions (Next 24 Hours) (Priority 2) */}
        <div className="space-y-5">
           <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <CalendarIcon className="w-4 h-4 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-foreground font-display">Upcoming (Next 24 Hours)</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcoming24h.length > 0 ? (
              upcoming24h.map((lc) => (
                <Card key={lc.id} className="border-border/50 hover:border-primary/30 transition-all shadow-sm group">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-muted w-14 h-14 rounded-xl flex flex-col items-center justify-center shrink-0 border border-border/50 group-hover:bg-primary/5 group-hover:border-primary/20 transition-colors">
                          <span className="text-[9px] font-bold uppercase opacity-60">Time</span>
                          <span className="text-sm font-black">{lc.time}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest mb-0.5">{lc.batch}</p>
                          <h4 className="font-bold text-foreground text-sm truncate">{lc.topic}</h4>
                          <div className="flex items-center gap-1.5 mt-1">
                             <CalendarIcon className="w-3 h-3 text-muted-foreground" />
                             <p className="text-[10px] text-muted-foreground font-semibold">{lc.date}</p>
                          </div>
                        </div>
                      </div>
                      <a href={lc.link} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="h-9 px-4 font-bold text-[11px] rounded-lg border-primary/20 hover:bg-primary hover:text-white transition-all shadow-sm shadow-primary/5">Join</Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full p-8 border border-dashed border-border/60 rounded-2xl text-center bg-muted/5">
                <p className="text-muted-foreground text-sm font-medium italic opacity-70">No other sessions scheduled for the next 24 hours.</p>
              </div>
            )}
          </div>
        </div>

        {/* 3. Cancelled Classes (Priority 3) */}
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
              <XCircle className="w-4 h-4 text-rose-600" />
            </div>
            <h2 className="text-xl font-bold text-foreground tracking-tight">Cancelled Classes</h2>
          </div>
          <div className="space-y-4">
            {cancelledClasses.map((cc) => (
              <Card key={cc.id} className="border-border/40 bg-card/60 backdrop-blur-sm hover:border-rose-300 transition-all group overflow-hidden">
                <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-rose-50 flex items-center justify-center border border-rose-100 text-rose-600 shrink-0 group-hover:scale-95 transition-transform">
                      <CalendarIcon className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-foreground text-base tracking-tight">{cc.batch}</h4>
                        <Badge variant="outline" className="h-5 text-[9px] border-rose-200 bg-rose-50 text-rose-600 font-black tracking-widest">CANCELLED</Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-xs text-muted-foreground/80 font-bold flex items-center gap-1">
                          <CalendarIcon className="w-3 h-3" /> {cc.date}
                        </p>
                        <p className="text-xs text-muted-foreground/80 font-bold flex items-center gap-1 border-l pl-3">
                          <Clock className="w-3 h-3" /> {cc.time}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right border-t sm:border-t-0 pt-3 sm:pt-0">
                    <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest opacity-80">Reason for cancellation</p>
                    <p className="text-sm font-bold text-muted-foreground italic mt-0.5 group-hover:text-rose-600 transition-colors">"{cc.reason}"</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* 4. Assignment Reviews (Priority 4) */}
        <div className="space-y-5 pb-12">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
              <ClipboardList className="w-4 h-4 text-orange-600" />
            </div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-foreground">Assignment Reviews</h2>
              <Badge className="bg-orange-100 text-orange-700 border-orange-200 font-black h-5 px-3">
                {pendingSubmissions.length} Action Items
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingSubmissions.map((sub) => (
              <Card key={sub.id} className="border-border/50 hover:border-primary/40 transition-all shadow-sm flex flex-col h-full bg-card/40 group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full blur-xl -translate-y-1/2 translate-x-1/2" />
                <CardContent className="p-6 flex flex-col h-full space-y-5 relative z-10">
                  <div className="flex-1">
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest">{sub.batch}</p>
                      <Badge variant="secondary" className="text-[9px] h-4 font-bold bg-muted/80 border-border/40">PENDING</Badge>
                    </div>
                    <h4 className="font-extrabold text-foreground text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2 underline-offset-4 decoration-primary/20 decoration-2">
                      {sub.assignment}
                    </h4>
                    <div className="flex items-center gap-2 mt-5 text-xs text-muted-foreground font-bold p-2 bg-muted/30 rounded-lg">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      <span>Submitted: {sub.date}</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full font-black text-xs h-11 bg-primary/5 hover:bg-primary hover:text-white border border-primary/20 transition-all shadow-md shadow-primary/5 mt-auto text-primary rounded-xl"
                    onClick={() => navigate("/tutor/assignments")}
                  >
                    Review Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* 5. Earnings Section (Priority 5) */}
        <div className="space-y-5 pb-12">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <span className="text-lg font-bold text-emerald-600">₹</span>
            </div>
            <h2 className="text-xl font-bold text-foreground">Earnings</h2>
          </div>

          <Card className="border-border/50 shadow-sm bg-card hover:border-primary/30 transition-all overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
            <CardContent className="p-8 relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex flex-col sm:flex-row sm:items-center gap-8">
                  <div className="space-y-1">
                    <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">This Month Earnings</p>
                    <h3 className="text-4xl font-black text-foreground tracking-tight">₹18,000</h3>
                  </div>
                  <div className="hidden sm:block w-px h-12 bg-border/60" />
                  <div className="space-y-4">
                    <div className="flex items-center gap-10">
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Hours Worked</p>
                        <p className="text-lg font-black text-foreground">90 Hours</p>
                      </div>
                      <div className="space-y-0.5 text-right">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Hourly Rate</p>
                        <p className="text-lg font-black text-emerald-600">₹200/hr</p>
                      </div>
                    </div>
                  </div>
                </div>
                <Button 
                  className="bg-primary hover:bg-primary/90 font-bold px-8 h-12 rounded-xl shadow-lg shadow-primary/10 transition-all hover:scale-105 active:scale-95"
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
