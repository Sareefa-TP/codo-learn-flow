import { useMemo, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video, Calendar, Clock, PlayCircle, User, Info, RefreshCw, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { createPortal } from "react-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { MeetRegularSession, MeetSession, MeetTabId } from "@/modules/meet/types";
import { InternSearchBar } from "@/components/inputs/InternSearchBar";

const STATUS_UI: Record<MeetSession["status"], { label: string; className: string }> = {
  live: { label: "Live Now", className: "bg-red-500/10 text-red-600 border-red-500/20" },
  upcoming: { label: "Upcoming", className: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  completed: { label: "Recording", className: "bg-slate-500/10 text-slate-600 border-slate-500/20" },
};

const MeetHeader = () => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 shadow-inner border border-primary/10">
          <Video className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
        </div>
        <div className="min-w-0">
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">Meet</h1>
          <p className="text-muted-foreground text-sm font-medium mt-1">
            Join your live sessions and view recordings
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 text-[11px] font-bold text-muted-foreground bg-muted/30 py-2 rounded-xl border border-border/20 w-fit">
          <Clock className="w-3.5 h-3.5" />
          <span>TimeZone: IST (UTC+5:30)</span>
        </div>
      </div>
    </div>
  );
};

const MeetTabs = ({
  activeTab,
  onTabChange,
  counts,
}: {
  activeTab: MeetTabId;
  onTabChange: (tab: MeetTabId) => void;
  counts: Record<MeetTabId, number>;
}) => {
  const tabs: Array<{ id: MeetTabId; label: string }> = [
    { id: "live", label: "Live Now" },
    { id: "upcoming", label: "Upcoming" },
    { id: "recordings", label: "Recordings" },
    { id: "regular", label: "Regular" },
  ];

  return (
    <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-2xl border border-border/40 w-fit flex-wrap shadow-sm">
      {tabs.map((t) => {
        const isActive = activeTab === t.id;
        const count = counts[t.id];
        return (
          <button
            key={t.id}
            onClick={() => onTabChange(t.id)}
            className={cn(
              "flex items-center gap-2 px-4 h-10 rounded-xl text-xs font-bold transition-all relative focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              isActive
                ? "bg-background shadow-sm text-foreground border border-border/60"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50",
            )}
          >
            <span className="relative flex items-center gap-2">
              {t.label}
              {t.id === "live" && count > 0 && (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              )}
            </span>
            <span
              className={cn(
                "text-[10px] px-2 py-0.5 rounded-full font-black tabular-nums min-w-[28px] text-center",
                isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
              )}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

const SessionRow = ({
  session,
  demoRecordingMp4,
}: {
  session: MeetSession;
  demoRecordingMp4: string;
}) => {
  const [isJoining, setIsJoining] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isRecordingOpen, setIsRecordingOpen] = useState(false);
  const statusUi = STATUS_UI[session.status];

  const action =
    session.status === "live" ? (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            size="sm"
            className="h-9 rounded-xl px-5 text-xs font-bold bg-primary hover:bg-primary/90 shadow-sm"
            disabled={isJoining}
          >
            {isJoining ? "Joining…" : "Join Now"}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="max-w-[400px] rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Join this live session?</AlertDialogTitle>
            <AlertDialogDescription>This will open your meeting link in a new tab.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl" disabled={isJoining}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="rounded-xl"
              onClick={() => {
                setIsJoining(true);
                window.open(session.meetLink, "_blank");
                window.setTimeout(() => setIsJoining(false), 700);
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    ) : (
      <Button
        size="sm"
        variant={session.status === "completed" ? "outline" : "secondary"}
        className={cn(
          "h-9 rounded-xl px-5 text-xs font-bold w-full sm:w-auto",
          session.status === "completed" && "hover:border-primary/50 hover:bg-primary/5 hover:text-primary",
        )}
        onClick={() => {
          if (session.status === "completed") {
            setIsRecordingOpen(true);
            return;
          }
          setIsDetailsOpen(true);
        }}
        disabled={false}
      >
        {session.status === "completed" ? (
          <span className="inline-flex items-center gap-2">
            <PlayCircle className="w-4 h-4" />
            Watch
          </span>
        ) : (
          "Details"
        )}
      </Button>
    );

  return (
    <>
      <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 hover:bg-muted/20 transition-colors">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className={cn(
              "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border",
              session.status === "live"
                ? "bg-primary text-primary-foreground border-primary/20"
                : "bg-muted/40 text-muted-foreground border-border/50",
            )}
          >
            <Video className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <div className="font-semibold text-foreground truncate">{session.title}</div>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-primary/70" />
                <span className="font-medium">{session.mentor}</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{session.date}</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {session.time} ({session.duration})
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
          <span
            className={cn(
              "text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border w-fit",
              statusUi.className,
            )}
          >
            {statusUi.label}
          </span>
          {action}
        </div>
      </div>

      {isDetailsOpen &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div
              className="bg-background border border-border/50 rounded-2xl shadow-2xl w-full max-w-[600px] max-h-[90vh] min-h-[520px] sm:min-h-[560px] flex flex-col animate-in fade-in zoom-in duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-border/50 bg-muted/5 flex-shrink-0">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Session Details</h2>
                  <p className="text-sm text-muted-foreground mt-1">Quick overview of this session.</p>
                </div>
                <button
                  onClick={() => setIsDetailsOpen(false)}
                  className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">Title</p>
                    <div className="text-sm font-semibold leading-relaxed bg-muted/50 rounded-xl px-4 py-3 border border-border/30">
                      {session.title}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">Mentor</p>
                    <div className="text-sm font-semibold leading-relaxed bg-muted/50 rounded-xl px-4 py-3 border border-border/30">
                      {session.mentor}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">Date</p>
                    <div className="text-sm font-semibold leading-relaxed bg-muted/50 rounded-xl px-4 py-3 border border-border/30">
                      {session.date}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">Time / Duration</p>
                    <div className="text-sm font-semibold leading-relaxed bg-muted/50 rounded-xl px-4 py-3 border border-border/30">
                      {session.time} • {session.duration}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-border/50 bg-muted/5 flex items-center justify-end gap-3 flex-shrink-0">
                <Button variant="outline" onClick={() => setIsDetailsOpen(false)} className="rounded-xl px-6">
                  Cancel
                </Button>
                <Button
                  onClick={() => window.open(session.meetLink, "_blank")}
                  className="rounded-xl px-6 bg-primary hover:bg-primary/90"
                >
                  Open Link
                </Button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {isRecordingOpen &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div
              className="bg-background border border-border/50 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-border/50 bg-muted/5 flex-shrink-0">
                <div className="min-w-0">
                  <h2 className="text-xl font-bold tracking-tight truncate">{session.title}</h2>
                  <p className="text-sm text-muted-foreground mt-1 truncate">
                    {session.mentor} • {session.date} • {session.time} ({session.duration})
                  </p>
                </div>
                <button
                  onClick={() => setIsRecordingOpen(false)}
                  className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground flex-shrink-0"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-auto p-6">
                <div className="rounded-2xl border border-border/60 bg-black overflow-hidden shadow-sm">
                  <video src={session.recordingLink ?? demoRecordingMp4} controls className="w-full h-auto max-h-[60vh]" />
                </div>
              </div>

              <div className="p-6 border-t border-border/50 bg-muted/5 flex items-center justify-end gap-3 flex-shrink-0">
                <Button variant="outline" onClick={() => setIsRecordingOpen(false)} className="rounded-xl px-6">
                  Close
                </Button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

const RegularSessionRow = ({ session }: { session: MeetRegularSession }) => {
  const [isJoining, setIsJoining] = useState(false);

  return (
    <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 hover:bg-muted/20 transition-colors">
      <div className="flex min-w-0 items-start gap-3">
        <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 bg-muted/40 text-muted-foreground border border-border/50">
          <RefreshCw className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <div className="font-semibold text-foreground truncate">{session.title}</div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-primary/70" />
              <span className="font-medium">{session.mentor}</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {session.schedule} • {session.time}
              </span>
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
        <span
          className={cn(
            "text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border w-fit",
            session.isActive ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-slate-500/10 text-slate-600 border-slate-500/20",
          )}
        >
          {session.isActive ? "Active" : "Scheduled"}
        </span>

        {session.isActive ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                className="h-9 rounded-xl px-5 text-xs font-bold bg-primary hover:bg-primary/90 shadow-sm"
                disabled={isJoining}
              >
                {isJoining ? "Joining…" : "Join Now"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-[400px] rounded-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle>Join this session?</AlertDialogTitle>
                <AlertDialogDescription>This will open your meeting link in a new tab.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-xl" disabled={isJoining}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  className="rounded-xl"
                  onClick={() => {
                    setIsJoining(true);
                    window.open(session.meetLink, "_blank");
                    window.setTimeout(() => setIsJoining(false), 700);
                  }}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <Button size="sm" variant="outline" className="h-9 rounded-xl px-5 text-xs font-bold w-full sm:w-auto" disabled>
            View
          </Button>
        )}
      </div>
    </div>
  );
};

export function MeetPage({
  basePath,
  initialSessions,
  fixedSessions,
  demoRecordingMp4 = "https://www.w3schools.com/html/mov_bbb.mp4",
  enableSearch = false,
  searchPlaceholder = "Search meetings...",
}: {
  basePath: string;
  initialSessions: MeetSession[];
  fixedSessions: MeetRegularSession[];
  demoRecordingMp4?: string;
  enableSearch?: boolean;
  searchPlaceholder?: string;
}) {
  const { tab } = useParams();
  const navigate = useNavigate();
  const activeTab = (tab || "live") as MeetTabId;

  const [sessionsState] = useState<MeetSession[]>(initialSessions);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!tab) {
      navigate(`${basePath}/live`, { replace: true });
    }
  }, [tab, navigate, basePath]);

  const handleTabChange = (value: MeetTabId) => {
    navigate(`${basePath}/${value}`);
  };

  const { liveSessions, upcomingSessions, completedSessions, regularSessions } = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const matches = (haystack: Array<string | undefined | null>) =>
      q.length === 0 || haystack.some((v) => (v ?? "").toLowerCase().includes(q));

    const live = sessionsState.filter((s) =>
      s.status === "live" && matches([s.title, s.mentor, (s as any).topic]),
    );
    const upcoming = sessionsState
      .filter((s) => s.status === "upcoming" && matches([s.title, s.mentor, (s as any).topic]))
      .sort((a, b) => Date.parse(a.startTime) - Date.parse(b.startTime));
    const completed = sessionsState.filter((s) =>
      s.status === "completed" && matches([s.title, s.mentor, (s as any).topic]),
    );
    const regular = fixedSessions.filter((s) => matches([s.title, s.mentor, s.schedule]));

    return { liveSessions: live, upcomingSessions: upcoming, completedSessions: completed, regularSessions: regular };
  }, [sessionsState, fixedSessions, searchQuery]);

  const counts: Record<MeetTabId, number> = {
    live: liveSessions.length,
    upcoming: upcomingSessions.length,
    recordings: completedSessions.length,
    regular: regularSessions.length,
  };

  const EmptyState = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center space-y-4 animate-in fade-in zoom-in-95 duration-500 bg-muted/5 border border-dashed border-border/40 rounded-3xl">
      <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center">
        <Info className="w-10 h-10 text-muted-foreground/30" />
      </div>
      <div className="max-w-xs">
        <p className="text-muted-foreground font-medium">{message}</p>
        <p className="text-xs text-muted-foreground/60 mt-2">New sessions will appear here once scheduled by your mentor.</p>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6 max-w-6xl mx-auto px-4 md:px-6 lg:px-8 pb-10">
        <MeetHeader />

        <div className="flex flex-col gap-4">
          {enableSearch && (
            <InternSearchBar
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={setSearchQuery}
            />
          )}

          <MeetTabs activeTab={activeTab} onTabChange={handleTabChange} counts={counts} />

          <Card className="border-border/60 bg-card/80 shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="p-4 sm:p-6 border-b border-border/60 bg-muted/5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-base sm:text-lg">Sessions</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activeTab === "live" && "Join sessions that are live right now."}
                    {activeTab === "upcoming" && "Upcoming sessions scheduled by your mentor."}
                    {activeTab === "recordings" && "Replay completed sessions anytime."}
                    {activeTab === "regular" && "Recurring sessions you can join regularly."}
                  </p>
                </div>
                <Badge variant="secondary" className="rounded-full tabular-nums">
                  {activeTab === "live" && liveSessions.length}
                  {activeTab === "upcoming" && upcomingSessions.length}
                  {activeTab === "recordings" && completedSessions.length}
                  {activeTab === "regular" && fixedSessions.length}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {activeTab === "live" &&
                  (liveSessions.length > 0 ? (
                    liveSessions.map((s) => <SessionRow key={s.id} session={s} demoRecordingMp4={demoRecordingMp4} />)
                  ) : (
                    <div className="p-6">
                      <EmptyState message={enableSearch && searchQuery.trim() ? "No meetings found" : "No sessions are live right now"} />
                    </div>
                  ))}

                {activeTab === "upcoming" &&
                  (upcomingSessions.length > 0 ? (
                    upcomingSessions.map((s) => <SessionRow key={s.id} session={s} demoRecordingMp4={demoRecordingMp4} />)
                  ) : (
                    <div className="p-6">
                      <EmptyState message={enableSearch && searchQuery.trim() ? "No meetings found" : "No upcoming sessions available"} />
                    </div>
                  ))}

                {activeTab === "recordings" &&
                  (completedSessions.length > 0 ? (
                    completedSessions.map((s) => <SessionRow key={s.id} session={s} demoRecordingMp4={demoRecordingMp4} />)
                  ) : (
                    <div className="p-6">
                      <EmptyState message={enableSearch && searchQuery.trim() ? "No meetings found" : "No recordings found"} />
                    </div>
                  ))}

                {activeTab === "regular" &&
                  (regularSessions.length > 0 ? (
                    regularSessions.map((s) => <RegularSessionRow key={s.id} session={s} />)
                  ) : (
                    <div className="p-6">
                      <EmptyState message={enableSearch && searchQuery.trim() ? "No meetings found" : "No regular sessions scheduled"} />
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

