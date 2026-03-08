import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp, CheckCircle2, Clock, ClipboardList,
  UserCheck, MessageSquare, Calendar,
} from "lucide-react";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const overallProgress = 45;

const taskData = {
  total: 20,
  completed: 12,
  pending: 8,
};

type WeekStatus = "Reviewed" | "Pending" | "Not Submitted";

interface WeekReport {
  week: string;
  status: WeekStatus;
}

const weeklyReports: WeekReport[] = [
  { week: "Week 1", status: "Reviewed" },
  { week: "Week 2", status: "Reviewed" },
  { week: "Week 3", status: "Pending" },
  { week: "Week 4", status: "Not Submitted" },
  { week: "Week 5", status: "Not Submitted" },
  { week: "Week 6", status: "Not Submitted" },
];

interface MentorFeedback {
  week: string;
  feedback: string;
}

const mentorFeedback: MentorFeedback[] = [
  { week: "Week 1", feedback: "Good start. Improve code structure and add more comments." },
  { week: "Week 2", feedback: "Excellent dashboard implementation! Keep this momentum going." },
  { week: "Week 3", feedback: "Report pending review — no feedback yet." },
];

const attendance = {
  totalDays: 20,
  present: 18,
  absent: 2,
  percentage: 90,
};

// ─── Style Maps ───────────────────────────────────────────────────────────────

const weekStatusStyles: Record<WeekStatus, string> = {
  Reviewed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  Pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  "Not Submitted": "bg-muted text-muted-foreground border-border/40",
};

const weekStatusIcon: Record<WeekStatus, React.ElementType> = {
  Reviewed: CheckCircle2,
  Pending: Clock,
  "Not Submitted": Calendar,
};

// ─── Progress Bar ─────────────────────────────────────────────────────────────

interface ProgressBarProps {
  value: number;
  color?: string;
  height?: string;
}

const ProgressBar = ({ value, color = "bg-emerald-500", height = "h-3" }: ProgressBarProps) => (
  <div className={`relative w-full ${height} overflow-hidden rounded-full bg-muted`}>
    <div
      className={`h-full rounded-full transition-all duration-700 ${color}`}
      style={{ width: `${Math.min(value, 100)}%` }}
    />
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

const InternProgress = () => {
  const taskCompletion = Math.round((taskData.completed / taskData.total) * 100);

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6 max-w-5xl mx-auto pb-10">

        {/* ── Page Header ── */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
            Internship Progress
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Track your overall internship journey, tasks, reports, and attendance.
          </p>
        </div>

        {/* ─────────────────────────────────────────────
            Section 1: Overall Internship Progress
        ───────────────────────────────────────────── */}
        <Card className="border-border/50 shadow-sm rounded-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Overall Internship Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Completion</span>
              <span className="text-2xl font-bold text-emerald-600">{overallProgress}%</span>
            </div>
            <ProgressBar value={overallProgress} color="bg-gradient-to-r from-emerald-500 to-emerald-400" />
            <p className="text-xs text-muted-foreground">
              {100 - overallProgress}% remaining — keep going! 🚀
            </p>
          </CardContent>
        </Card>

        {/* ─────────────────────────────────────────────
            Section 2: Task Completion Summary
        ───────────────────────────────────────────── */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Task Completion
          </h2>

          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Total Tasks", value: taskData.total, icon: ClipboardList, bg: "bg-violet-500/10", color: "text-violet-600" },
              { label: "Completed Tasks", value: taskData.completed, icon: CheckCircle2, bg: "bg-emerald-500/10", color: "text-emerald-600" },
              { label: "Pending Tasks", value: taskData.pending, icon: Clock, bg: "bg-amber-500/10", color: "text-amber-600" },
            ].map(({ label, value, icon: Icon, bg, color }) => (
              <Card key={label} className="border-border/50 shadow-sm rounded-xl">
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${bg}`}>
                      <Icon className={`w-5 h-5 ${color}`} />
                    </div>
                    <div>
                      <p className={`text-2xl font-bold ${color}`}>{value}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Task progress bar */}
          <Card className="border-border/50 shadow-sm rounded-xl">
            <CardContent className="pt-5 pb-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Task Completion Rate</span>
                <span className="text-sm font-bold text-violet-600">{taskCompletion}%</span>
              </div>
              <ProgressBar value={taskCompletion} color="bg-violet-500" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{taskData.completed} of {taskData.total} tasks completed</span>
                <span>{taskData.pending} remaining</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ─────────────────────────────────────────────
            Section 3: Weekly Report Status
        ───────────────────────────────────────────── */}
        <Card className="border-border/50 shadow-sm rounded-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-primary" />
              Weekly Report Status
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {weeklyReports.map(({ week, status }) => {
                const Icon = weekStatusIcon[status];
                return (
                  <div
                    key={week}
                    className="flex items-center justify-between px-4 py-3 rounded-lg border border-border/40 bg-card hover:bg-muted/10 transition-colors"
                  >
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Icon className="w-4 h-4 text-muted-foreground" />
                      {week}
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-semibold ${weekStatusStyles[status]}`}
                    >
                      {status}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* ─────────────────────────────────────────────
            Section 4: Mentor Feedback Summary
        ───────────────────────────────────────────── */}
        <Card className="border-border/50 shadow-sm rounded-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" />
              Mentor Feedback Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {mentorFeedback.map(({ week, feedback }) => (
              <div
                key={week}
                className="rounded-lg border border-border/40 bg-muted/20 px-4 py-3 space-y-1"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {week}
                </p>
                <p className="text-sm leading-relaxed text-foreground">"{feedback}"</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* ─────────────────────────────────────────────
            Section 5: Attendance Summary
        ───────────────────────────────────────────── */}
        <Card className="border-border/50 shadow-sm rounded-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-600" />
              Attendance Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Total Days", value: attendance.totalDays, color: "text-foreground" },
                { label: "Present", value: attendance.present, color: "text-emerald-600" },
                { label: "Absent", value: attendance.absent, color: "text-red-600" },
                { label: "Attendance %", value: `${attendance.percentage}%`, color: "text-blue-600" },
              ].map(({ label, value, color }) => (
                <div
                  key={label}
                  className="flex flex-col items-center justify-center py-4 px-3 rounded-xl border border-border/40 bg-muted/20 text-center"
                >
                  <p className={`text-2xl font-bold ${color}`}>{value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{label}</p>
                </div>
              ))}
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Attendance Rate</span>
                <span className="font-bold text-blue-600">{attendance.percentage}%</span>
              </div>
              <ProgressBar value={attendance.percentage} color="bg-blue-500" height="h-2" />
            </div>
          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  );
};

export default InternProgress;
