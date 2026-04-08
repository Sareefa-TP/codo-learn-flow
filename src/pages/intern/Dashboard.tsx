import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2, UserCheck, TrendingUp, User,
  ListTodo, Clock, Briefcase, LogOut, ArrowRightCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { CheckOutDialog } from "@/modules/intern/attendance/dialogs";
import { todayISO, upsertCheckIn, updateCheckOut } from "@/modules/intern/attendance/store";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const intern = {
  name: "Alex Johnson",
  mentor: "John Doe",
  batch: "Batch Alpha – Jan 2026",
  startDate: "Jan 2026",
  endDate: "Mar 2026",
};

const INTERN_ID = "intern-1";

type LocalAttendance = {
  date: string; // yyyy-mm-dd
  checkInTime?: string; // ISO
  checkOutTime?: string; // ISO
  tasksCompleted?: string;
  blockers?: string;
  status: "checked-in" | "checked-out";
};

const ATTENDANCE_KEY = "attendance";

const readAttendance = (): LocalAttendance | null => {
  const raw = localStorage.getItem(ATTENDANCE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as LocalAttendance;
  } catch {
    return null;
  }
};

const writeAttendance = (data: LocalAttendance) => {
  localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(data));
};
const stats = {
  tasksCompleted: 12,
  totalTasks: 18,
  attendance: 94,
  overallProgress: 72,
};

type Priority = "High" | "Medium" | "Low";

interface Task {
  id: number;
  title: string;
  status: "in-progress" | "pending" | "completed";
  priority: Priority;
  dueDate: string;
}

const currentTasks: Task[] = [
  { id: 1, title: "Complete UI mockups for dashboard", status: "in-progress", priority: "High", dueDate: "Today" },
  { id: 2, title: "Review design system documentation", status: "pending", priority: "Medium", dueDate: "Tomorrow" },
  { id: 3, title: "Prepare weekly progress report", status: "pending", priority: "Low", dueDate: "Mar 07" },
  { id: 4, title: "Attend code review session", status: "pending", priority: "High", dueDate: "Today" },
  { id: 5, title: "Submit intern feedback form", status: "pending", priority: "Medium", dueDate: "Mar 10" },
];


// ─── Helpers ──────────────────────────────────────────────────────────────────

const priorityStyles: Record<Priority, string> = {
  High: "bg-red-500/10 text-red-600 border-red-500/20",
  Medium: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  Low: "bg-muted text-muted-foreground border-border/40",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  valueColor?: string;
}

const StatCard = ({ label, value, sub, icon: Icon, iconBg, iconColor, valueColor }: StatCardProps) => (
  <Card className="border-border/50 shadow-sm rounded-xl">
    <CardContent className="pt-5 pb-4">
      <div className="flex items-center gap-3">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <div>
          <p className={`text-2xl font-bold leading-tight ${valueColor ?? "text-foreground"}`}>{value}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
          {sub && <p className="text-[10px] text-muted-foreground">{sub}</p>}
        </div>
      </div>
    </CardContent>
  </Card>
);

// ─── Attendance Card Component ───────────────────────────────────────────────

const AttendanceCard = () => {
  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCheckOutOpen, setIsCheckOutOpen] = useState(false);
  const [isSubmittingCheckOut, setIsSubmittingCheckOut] = useState(false);

  useEffect(() => {
    // Read Check-In state from localStorage["attendance"]
    const today = todayISO();
    const data = readAttendance();
    if (data && data.date === today) {
      setCheckIn(data.checkInTime ?? null);
      setCheckOut(data.checkOutTime ?? null);
    } else {
      setCheckIn(null);
      setCheckOut(null);
    }

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCheckIn = () => {
    const now = new Date().toISOString();
    setCheckIn(now);
    const today = todayISO();
    writeAttendance({
      date: today,
      checkInTime: now,
      status: "checked-in",
    });
    // keep history store in sync (for Attendance page list/details)
    upsertCheckIn(INTERN_ID, today, now);
    toast.success("Checked in successfully!");
  };

  const handleCheckOutClick = () => {
    // Rule: clicking Check Out opens modal first.
    const today = todayISO();
    const data = readAttendance();
    if (!data || data.date !== today) {
      toast.error("No check-in found for today. Please check-in first.");
      return;
    }
    if (data.status !== "checked-in" || !data.checkInTime) {
      toast.error("No check-in found for today. Please check-in first.");
      return;
    }
    setIsCheckOutOpen(true);
  };

  const handleSubmitCheckOut = async (data: { tasksCompleted: string; blockers: string }) => {
    if (!data.tasksCompleted.trim()) return;

    setIsSubmittingCheckOut(true);
    try {
      const now = new Date().toISOString();
      const today = todayISO();
      const stored = readAttendance();
      if (!stored || stored.date !== today || stored.status !== "checked-in" || !stored.checkInTime) {
        toast.error("No check-in found for today. Please check-in first.");
        return;
      }

      const next: LocalAttendance = {
        ...stored,
        checkOutTime: now,
        tasksCompleted: data.tasksCompleted.trim(),
        blockers: data.blockers.trim(),
        status: "checked-out",
      };
      writeAttendance(next);

      // keep history store in sync (for Attendance page list/details)
      updateCheckOut(INTERN_ID, today, {
        checkOutTime: now,
        tasksCompleted: next.tasksCompleted,
        blockers: next.blockers,
      });

      setCheckOut(now);
      setIsCheckOutOpen(false);
      toast.success("Checked out successfully!");
    } finally {
      setIsSubmittingCheckOut(false);
    }
  };

  const formatTime = (isoString: string | null) => {
    if (!isoString) return "--:--";
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const calculateDuration = () => {
    if (!checkIn) return "0h 0m";
    const start = new Date(checkIn).getTime();
    const end = checkOut ? new Date(checkOut).getTime() : currentTime.getTime();
    const diffMs = Math.max(0, end - start);
    const diffHrs = Math.floor(diffMs / 3600000);
    const diffMins = Math.floor((diffMs % 3600000) / 60000);
    return `${diffHrs}h ${diffMins}m`;
  };

  const status = !checkIn ? "Not Started" : (!checkOut ? "Working" : "Completed");

  return (
    <>
      <Card className="border-border/50 shadow-sm rounded-xl overflow-hidden group">
      <CardHeader className="pb-3 px-6 pt-5 border-b border-border/20 bg-muted/5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-primary" />
            Today's Attendance
          </CardTitle>
          <Badge variant="outline" className={`text-[10px] font-bold uppercase tracking-wider ${
            status === "Working" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
            status === "Completed" ? "bg-blue-500/10 text-blue-600 border-blue-500/20" :
            "bg-muted text-muted-foreground border-border/40"
          }`}>
            {status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="flex items-center gap-4 group-hover:translate-x-1 transition-transform">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
              <ArrowRightCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">Check-In Time</p>
              <p className="text-lg font-bold text-foreground leading-tight">{formatTime(checkIn)}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 group-hover:translate-x-1 transition-transform duration-300">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0">
              <LogOut className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">Check-Out Time</p>
              <p className="text-lg font-bold text-foreground leading-tight">{formatTime(checkOut)}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {!checkIn ? (
              <Button onClick={handleCheckIn} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl h-11 shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                Check-In
              </Button>
            ) : !checkOut ? (
              <Button onClick={handleCheckOutClick} className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl h-11 shadow-md shadow-orange-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                Check-Out
              </Button>
            ) : (
              <Button disabled className="w-full bg-muted text-muted-foreground font-bold rounded-xl h-11 border border-border/50">
                Attendance Completed
              </Button>
            )}
            <div className="flex items-center justify-center gap-1.5 py-1">
              <div className={`w-1.5 h-1.5 rounded-full ${status === 'Working' ? 'bg-emerald-500 animate-pulse' : 'bg-muted-foreground/30'}`} />
              <p className="text-[11px] text-muted-foreground font-semibold">
                Working Duration: <span className="text-foreground font-bold tabular-nums">{calculateDuration()}</span>
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      </Card>

      <CheckOutDialog
        open={isCheckOutOpen}
        onOpenChange={setIsCheckOutOpen}
        submitting={isSubmittingCheckOut}
        onSubmit={handleSubmitCheckOut}
      />
    </>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const InternDashboard = () => {
  const navigate = useNavigate();

  const completionPct = Math.round((stats.tasksCompleted / stats.totalTasks) * 100);

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6 max-w-6xl mx-auto px-4 md:px-6 lg:px-8 pb-10">

        {/* ── Welcome Section ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
              <Briefcase className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
                Welcome back, {intern.name.split(" ")[0]}!
              </h1>
              <p className="text-muted-foreground text-sm mt-0.5">
                Keep building your skills. 🚀
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-2 rounded-lg border border-border/40">
            <span>{intern.batch}</span>
            <span className="text-border/70">·</span>
            <span>{intern.startDate} – {intern.endDate}</span>
          </div>
        </div>

        {/* ── Attendance Card ── */}
        <AttendanceCard />

        {/* ── 4 KPI Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Tasks Completed"
            value={`${stats.tasksCompleted} / ${stats.totalTasks}`}
            sub={`${completionPct}% done`}
            icon={CheckCircle2}
            iconBg="bg-violet-500/10"
            iconColor="text-violet-600"
            valueColor="text-violet-600"
          />
          <StatCard
            label="Attendance"
            value={`${stats.attendance}%`}
            sub="This month"
            icon={UserCheck}
            iconBg="bg-blue-500/10"
            iconColor="text-blue-600"
            valueColor="text-blue-600"
          />
          <StatCard
            label="Progress"
            value={`${stats.overallProgress}%`}
            sub="Overall completion"
            icon={TrendingUp}
            iconBg="bg-emerald-500/10"
            iconColor="text-emerald-600"
            valueColor="text-emerald-600"
          />
          <StatCard
            label="Mentor"
            value={intern.mentor}
            sub="Your assigned mentor"
            icon={User}
            iconBg="bg-amber-500/10"
            iconColor="text-amber-600"
          />
        </div>

        {/* ── Main Content: Tasks + Progress (Full Width) ── */}
        <div className="space-y-6">

          {/* Current Tasks */}
          <Card className="border-border/50 shadow-sm rounded-xl">
            <CardHeader className="pb-3 px-6 pt-5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold flex items-center gap-2 text-foreground">
                  <ListTodo className="w-4 h-4 text-primary" />
                  Current Tasks
                  <Badge variant="outline" className="text-xs font-normal ml-1 bg-primary/5 text-primary border-primary/20">
                    {currentTasks.filter(t => t.status !== "completed").length} pending
                  </Badge>
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs px-3 font-semibold text-primary hover:bg-primary/5"
                  onClick={() => navigate("/intern/tasks")}
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 pb-6 px-6 pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentTasks.slice(0, 4).map(task => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-4 rounded-xl border border-border/40 bg-card hover:bg-muted/10 transition-all duration-200 group relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary/0 group-hover:bg-primary/40 transition-all" />

                    {/* Status dot */}
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${task.status === "in-progress"
                        ? "border-emerald-500 bg-emerald-500/10"
                        : "border-border"
                        }`}
                    >
                      {task.status === "in-progress" && (
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      )}
                    </div>

                    {/* Title + deadline */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{task.title}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className={`text-[11px] ${task.dueDate === "Today" ? "text-red-500 font-bold" : "text-muted-foreground font-medium"
                          }`}>
                          {task.dueDate}
                        </span>
                      </div>
                    </div>

                    {/* Priority badge */}
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-bold uppercase tracking-wider h-5 flex items-center justify-center ${priorityStyles[task.priority]}`}
                    >
                      {task.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Internship Progress */}
          <Card className="border-border/50 shadow-sm rounded-xl overflow-hidden bg-card">
            <CardHeader className="pb-4 px-6 pt-5 border-b border-border/20">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Internship Progress Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Overall */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">Overall Completion</span>
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 shadow-none font-bold">
                      {stats.overallProgress}%
                    </Badge>
                  </div>
                  <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-muted shadow-inner">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-1000"
                      style={{ width: `${stats.overallProgress}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground italic">
                    Keep it up! {100 - stats.overallProgress}% left to reach your goal.
                  </p>
                </div>

                {/* Task completion */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">Task Mastery</span>
                    <span className="text-xs font-bold text-violet-600 bg-violet-500/10 px-2 py-0.5 rounded-md">
                      {stats.tasksCompleted} / {stats.totalTasks}
                    </span>
                  </div>
                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-violet-500 transition-all duration-1000"
                      style={{ width: `${completionPct}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    Focusing on quality and delivery.
                  </p>
                </div>

                {/* Attendance */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">Consistency</span>
                    <span className="text-xs font-bold text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded-md">
                      {stats.attendance}% Presence
                    </span>
                  </div>
                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-blue-500 transition-all duration-1000"
                      style={{ width: `${stats.attendance}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <UserCheck className="w-3 h-3 text-emerald-500" />
                    Excellent attendance rate.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InternDashboard;
