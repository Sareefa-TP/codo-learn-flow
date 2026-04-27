import { useMemo, useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video, Calendar, Clock, PlayCircle, User, Info, RefreshCw, X, Radio, CheckCircle2, Play, Pause, Volume2, VolumeX, Maximize, Minimize } from "lucide-react";
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
import PageSearch from "@/components/shared/PageSearch";

const STATUS_UI: Record<MeetSession["status"], { label: string; className: string }> = {
  live: { label: "Active", className: "bg-red-500/10 text-red-600 border-red-500/20" },
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
  const tabs: Array<{ id: MeetTabId; label: string; icon: any }> = [
    { id: "live", label: "Active", icon: Radio },
    { id: "upcoming", label: "Upcoming", icon: Calendar },
    { id: "completed", label: "Completed", icon: CheckCircle2 },
    { id: "recordings", label: "Recordings", icon: PlayCircle },
    { id: "regular", label: "Regular", icon: RefreshCw },
  ];

  return (
    <div className="no-scrollbar flex gap-1.5 overflow-x-auto bg-white p-1.5 rounded-full w-full shadow-sm border border-border/40 mb-2 md:grid md:grid-cols-5 md:overflow-visible">
      {tabs.map((t) => {
        const isActive = activeTab === t.id;
        const count = counts[t.id];
        const Icon = t.icon;
        return (
          <button
            key={t.id}
            onClick={() => onTabChange(t.id)}
            className={cn(
              "flex min-w-max shrink-0 whitespace-nowrap items-center justify-center gap-2 px-3 h-11 rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.14em] md:tracking-widest transition-all duration-300 relative focus:outline-none md:min-w-0 md:w-full md:shrink",
              isActive
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
            )}
          >
            <Icon className={cn("w-4 h-4", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              {t.label}
              {isActive && t.id === "live" && (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
              )}
            </span>
            {count > 0 && (
              <span
                className={cn(
                  "text-[10px] px-2 py-0.5 rounded-full font-black tabular-nums min-w-[24px] text-center ml-0.5 shrink-0",
                  isActive ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground",
                )}
              >
                {count}
              </span>
            )}
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
            onClick={(e) => e.stopPropagation()}
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
    ) : session.status === "completed" ? (
      <Button
        size="sm"
        variant="outline"
        className={cn(
          "h-9 rounded-xl px-5 text-xs font-bold w-full md:w-auto hover:border-primary/50 hover:bg-primary/5 hover:text-primary",
        )}
        onClick={(e) => {
          e.stopPropagation();
          setIsRecordingOpen(true);
        }}
        disabled={false}
      >
        <span className="inline-flex items-center gap-2">
          <PlayCircle className="w-4 h-4" />
          Watch
        </span>
      </Button>
    ) : null;

  return (
    <>
      <div
        className="flex flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between md:gap-4 hover:bg-muted/20 transition-colors cursor-pointer"
        onClick={() => setIsDetailsOpen(true)}
      >
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

              <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar">
                {(() => {
                  const tutorName = session.tutor || session.mentor;
                  const coordinatorName = session.coordinator || "Team CODO";
                  const advisorName = session.advisor || "Support Desk";
                  return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2 rounded-2xl border border-primary/20 bg-primary/[0.03] p-4 sm:p-5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/70 mb-2">Session Title</p>
                    <p className="text-lg sm:text-xl font-extrabold leading-tight text-foreground">{session.title}</p>
                  </div>

                  <div className="rounded-2xl border border-blue-200/70 bg-blue-50/50 p-4 sm:p-5">
                    <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-700/80 mb-2">
                      <User className="w-3.5 h-3.5" />
                      Mentor
                    </div>
                    <p className="text-lg font-bold text-foreground">{session.mentor}</p>
                  </div>

                  <div className="rounded-2xl border border-cyan-200/70 bg-cyan-50/50 p-4 sm:p-5">
                    <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-cyan-700/80 mb-2">
                      <User className="w-3.5 h-3.5" />
                      Tutor
                    </div>
                    <p className="text-lg font-bold text-foreground">{tutorName}</p>
                  </div>

                  <div className="rounded-2xl border border-orange-200/70 bg-orange-50/50 p-4 sm:p-5">
                    <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-orange-700/80 mb-2">
                      <User className="w-3.5 h-3.5" />
                      Coordinator
                    </div>
                    <p className="text-lg font-bold text-foreground">{coordinatorName}</p>
                  </div>

                  <div className="rounded-2xl border border-teal-200/70 bg-teal-50/50 p-4 sm:p-5">
                    <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-teal-700/80 mb-2">
                      <User className="w-3.5 h-3.5" />
                      Advisor
                    </div>
                    <p className="text-lg font-bold text-foreground">{advisorName}</p>
                  </div>

                  <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50/50 p-4 sm:p-5">
                    <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-700/80 mb-2">
                      <Info className="w-3.5 h-3.5" />
                      Status
                    </div>
                    <p className="text-lg font-bold text-foreground capitalize">{session.status}</p>
                  </div>

                  <div className="rounded-2xl border border-amber-200/70 bg-amber-50/50 p-4 sm:p-5">
                    <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-amber-700/80 mb-2">
                      <Calendar className="w-3.5 h-3.5" />
                      Date
                    </div>
                    <p className="text-lg font-bold text-foreground">{session.date}</p>
                  </div>

                  <div className="rounded-2xl border border-violet-200/70 bg-violet-50/50 p-4 sm:p-5">
                    <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-violet-700/80 mb-2">
                      <Clock className="w-3.5 h-3.5" />
                      Time / Duration
                    </div>
                    <p className="text-lg font-bold text-foreground">{session.time} • {session.duration}</p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
                    <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-600 mb-2">
                      <Video className="w-3.5 h-3.5" />
                      Platform
                    </div>
                    <p className="text-base sm:text-lg font-bold text-foreground">Google Meet</p>
                  </div>
                </div>
                  );
                })()}
              </div>

              <div className="p-6 border-t border-border/50 bg-muted/5 flex items-center justify-center gap-3 flex-wrap flex-shrink-0">
                {session.recordingLink && (
                  <Button
                    variant="outline"
                    onClick={() => setIsRecordingOpen(true)}
                    className="rounded-xl px-6 h-11 font-bold hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                  >
                    <span className="inline-flex items-center gap-2">
                      <PlayCircle className="w-4 h-4" />
                      Recording
                    </span>
                  </Button>
                )}
                <Button
                  onClick={() => window.open(session.meetLink, "_blank")}
                  className="rounded-xl px-8 h-11 bg-primary hover:bg-primary/90 font-bold shadow-lg shadow-primary/20"
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
              <div className="flex items-start justify-between p-4 sm:p-6 border-b border-border/50 bg-muted/5 flex-shrink-0 gap-3">
                <div className="min-w-0">
                  <h2 className="text-lg sm:text-xl font-bold tracking-tight break-words">{session.title}</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 break-words">
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
                  <CustomVideoPlayer src={session.recordingLink ?? demoRecordingMp4} />
                </div>
              </div>

              <div className="p-6 border-t border-border/50 bg-muted/5 flex-shrink-0" />
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

const CustomVideoPlayer = ({ src }: { src: string }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  const formatTime = (value: number) => {
    const total = Math.max(0, Math.floor(value));
    const min = Math.floor(total / 60);
    const sec = total % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  const onTogglePlay = async () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      await video.play();
    } else {
      video.pause();
    }
  };

  const onSeek = (next: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = next;
    setCurrentTime(next);
  };

  const onToggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const onVolume = (next: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = next;
    video.muted = next === 0;
    setVolume(next);
    setIsMuted(video.muted);
  };

  const onToggleFullscreen = async () => {
    const el = wrapperRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      await el.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const onFull = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFull);
    return () => document.removeEventListener("fullscreenchange", onFull);
  }, []);

  return (
    <div ref={wrapperRef} className="relative bg-black">
      <video
        ref={videoRef}
        src={src}
        className="w-full h-auto max-h-[60vh]"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
        onLoadedMetadata={() => {
          setDuration(videoRef.current?.duration || 0);
          setVolume(videoRef.current?.volume ?? 1);
        }}
        onVolumeChange={() => {
          setIsMuted(Boolean(videoRef.current?.muted));
          setVolume(videoRef.current?.volume ?? 1);
        }}
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 sm:p-4">
        <input
          type="range"
          min={0}
          max={Math.max(duration, 0)}
          step={0.1}
          value={currentTime}
          onChange={(e) => onSeek(Number(e.target.value))}
          className="w-full accent-white"
        />
        <div className="mt-2 flex items-center gap-2 text-white">
          <Button size="icon" variant="ghost" onClick={onTogglePlay} className="h-8 w-8 rounded-full hover:bg-white/20 text-white">
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </Button>
          <span className="text-xs tabular-nums min-w-[72px]">{formatTime(currentTime)} / {formatTime(duration)}</span>
          <Button size="icon" variant="ghost" onClick={onToggleMute} className="h-8 w-8 rounded-full hover:bg-white/20 text-white">
            {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={isMuted ? 0 : volume}
            onChange={(e) => onVolume(Number(e.target.value))}
            className="hidden sm:block w-24 accent-white"
          />
          <div className="ml-auto">
            <Button size="icon" variant="ghost" onClick={onToggleFullscreen} className="h-8 w-8 rounded-full hover:bg-white/20 text-white">
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const RegularSessionRow = ({ session }: { session: MeetRegularSession }) => {
  const [isJoining, setIsJoining] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  return (
    <>
    <div
      className="flex flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between md:gap-4 hover:bg-muted/20 transition-colors cursor-pointer"
      onClick={() => setIsDetailsOpen(true)}
    >
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

      <div className="flex w-full flex-col items-stretch gap-2 md:w-auto md:flex-row md:items-center md:justify-end md:gap-3">
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
                className="h-9 w-full rounded-xl px-5 text-xs font-bold bg-primary hover:bg-primary/90 shadow-sm md:w-auto"
                disabled={isJoining}
                onClick={(e) => e.stopPropagation()}
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
          <Button size="sm" variant="outline" className="h-9 rounded-xl px-5 text-xs font-bold w-full md:w-auto" disabled onClick={(e) => e.stopPropagation()}>
            View
          </Button>
        )}
      </div>
    </div>
    {isDetailsOpen &&
      createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div
            className="bg-background border border-border/50 rounded-2xl shadow-2xl w-full max-w-[600px] max-h-[90vh] min-h-[500px] sm:min-h-[540px] flex flex-col animate-in fade-in zoom-in duration-200"
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
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 rounded-2xl border border-primary/20 bg-primary/[0.03] p-4 sm:p-5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary/70 mb-2">Session Title</p>
                  <p className="text-lg sm:text-xl font-extrabold leading-tight text-foreground">{session.title}</p>
                </div>
                <div className="rounded-2xl border border-blue-200/70 bg-blue-50/50 p-4 sm:p-5">
                  <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-700/80 mb-2">
                    <User className="w-3.5 h-3.5" />
                    Mentor
                  </div>
                  <p className="text-lg font-bold text-foreground">{session.mentor}</p>
                </div>
                <div className="rounded-2xl border border-violet-200/70 bg-violet-50/50 p-4 sm:p-5">
                  <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-violet-700/80 mb-2">
                    <Calendar className="w-3.5 h-3.5" />
                    Schedule
                  </div>
                  <p className="text-lg font-bold text-foreground">{session.schedule}</p>
                </div>
                <div className="rounded-2xl border border-amber-200/70 bg-amber-50/50 p-4 sm:p-5">
                  <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-amber-700/80 mb-2">
                    <Clock className="w-3.5 h-3.5" />
                    Time
                  </div>
                  <p className="text-lg font-bold text-foreground">{session.time}</p>
                </div>
                <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50/50 p-4 sm:p-5">
                  <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-700/80 mb-2">
                    <Info className="w-3.5 h-3.5" />
                    Status
                  </div>
                  <p className="text-lg font-bold text-foreground">{session.isActive ? "Active" : "Scheduled"}</p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-border/50 bg-muted/5 flex items-center justify-center flex-shrink-0">
              <Button
                onClick={() => window.open(session.meetLink, "_blank")}
                className="rounded-xl px-8 h-11 bg-primary hover:bg-primary/90 font-bold shadow-lg shadow-primary/20"
              >
                Open Link
              </Button>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
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

  const { liveSessions, upcomingSessions, completedSessions, recordingSessions, regularSessions } = useMemo(() => {
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
    const recordings = completed.filter(s => !!s.recordingLink);
    const regular = fixedSessions.filter((s) => matches([s.title, s.mentor, s.schedule]));

    return { liveSessions: live, upcomingSessions: upcoming, completedSessions: completed, recordingSessions: recordings, regularSessions: regular };
  }, [sessionsState, fixedSessions, searchQuery]);

  const counts: Record<MeetTabId, number> = {
    live: liveSessions.length,
    upcoming: upcomingSessions.length,
    completed: completedSessions.length,
    recordings: recordingSessions.length,
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
            <PageSearch
              placeholder={searchPlaceholder}
              onSearch={setSearchQuery}
              className="max-w-none mb-0"
              animate={false}
            />
          )}

          <MeetTabs activeTab={activeTab} onTabChange={handleTabChange} counts={counts} />

          <Card className="border-border/60 bg-card/80 shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="p-4 sm:p-6 border-b border-border/60 bg-muted/5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-base sm:text-lg">Sessions</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activeTab === "live" && "Join sessions that are active right now."}
                    {activeTab === "upcoming" && "Upcoming sessions scheduled by your mentor."}
                    {activeTab === "completed" && "History of your previous sessions."}
                    {activeTab === "recordings" && "Replay completed sessions anytime."}
                    {activeTab === "regular" && "Recurring sessions you can join regularly."}
                  </p>
                </div>
                <Badge variant="secondary" className="rounded-full tabular-nums">
                  {activeTab === "live" && liveSessions.length}
                  {activeTab === "upcoming" && upcomingSessions.length}
                  {activeTab === "completed" && completedSessions.length}
                  {activeTab === "recordings" && recordingSessions.length}
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
                      <EmptyState message={enableSearch && searchQuery.trim() ? "No meetings found" : "No sessions are active right now"} />
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

                {activeTab === "completed" &&
                  (completedSessions.length > 0 ? (
                    completedSessions.map((s) => <SessionRow key={s.id} session={s} demoRecordingMp4={demoRecordingMp4} />)
                  ) : (
                    <div className="p-6">
                      <EmptyState message={enableSearch && searchQuery.trim() ? "No meetings found" : "No completed sessions found"} />
                    </div>
                  ))}

                {activeTab === "recordings" &&
                  (recordingSessions.length > 0 ? (
                    recordingSessions.map((s) => <SessionRow key={s.id} session={s} demoRecordingMp4={demoRecordingMp4} />)
                  ) : (
                    <div className="p-6">
                      <EmptyState message={enableSearch && searchQuery.trim() ? "No meetings found" : "No recordings available"} />
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

