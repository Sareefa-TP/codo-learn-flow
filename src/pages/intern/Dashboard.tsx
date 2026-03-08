import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2, UserCheck, TrendingUp, User,
  ListTodo, Clock, Award, Circle, Briefcase,
} from "lucide-react";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const intern = {
  name: "Alex Johnson",
  mentor: "John Doe",
  batch: "Batch Alpha – Jan 2026",
  startDate: "Jan 2026",
  endDate: "Mar 2026",
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

const milestones = [
  { name: "Onboarding Complete", completed: true },
  { name: "First Project Delivered", completed: true },
  { name: "Mid-Internship Review", completed: false },
  { name: "Final Presentation", completed: false },
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

// ─── Main Component ───────────────────────────────────────────────────────────

const InternDashboard = () => {
  const navigate = useNavigate();

  const completionPct = Math.round((stats.tasksCompleted / stats.totalTasks) * 100);

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6 max-w-6xl mx-auto pb-10">

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

        {/* ── Main Grid: Tasks + Sidebar ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: Current Tasks + Progress */}
          <div className="lg:col-span-2 space-y-5">

            {/* Current Tasks */}
            <Card className="border-border/50 shadow-sm rounded-xl">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <ListTodo className="w-4 h-4 text-primary" />
                    Current Tasks
                    <Badge variant="outline" className="text-xs font-normal ml-1">
                      {currentTasks.filter(t => t.status !== "completed").length} pending
                    </Badge>
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs px-2.5"
                    onClick={() => navigate("/intern/tasks")}
                  >
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                {currentTasks.slice(0, 4).map(task => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border/40 bg-card hover:bg-muted/20 transition-colors"
                  >
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
                      <p className="text-sm font-medium truncate">{task.title}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className={`text-xs ${task.dueDate === "Today" ? "text-red-500 font-medium" : "text-muted-foreground"
                          }`}>
                          {task.dueDate}
                        </span>
                      </div>
                    </div>

                    {/* Priority badge */}
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-semibold flex-shrink-0 ${priorityStyles[task.priority]}`}
                    >
                      {task.priority}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Internship Progress */}
            <Card className="border-border/50 shadow-sm rounded-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  Internship Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 pt-0">
                {/* Overall */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Overall Completion</span>
                    <span className="text-sm font-bold text-emerald-600">{stats.overallProgress}%</span>
                  </div>
                  <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-700"
                      style={{ width: `${stats.overallProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    {100 - stats.overallProgress}% remaining to complete your internship
                  </p>
                </div>

                {/* Task completion */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Tasks</span>
                    <span className="text-sm text-muted-foreground">{stats.tasksCompleted} of {stats.totalTasks}</span>
                  </div>
                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-violet-500 transition-all duration-700"
                      style={{ width: `${completionPct}%` }}
                    />
                  </div>
                </div>

                {/* Attendance */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Attendance</span>
                    <span className="text-sm text-muted-foreground">{stats.attendance}%</span>
                  </div>
                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-blue-500 transition-all duration-700"
                      style={{ width: `${stats.attendance}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Milestones + Info */}
          <div className="space-y-5">

            {/* Milestones */}
            <Card className="border-border/50 shadow-sm rounded-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  Milestones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                {milestones.map((m, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {m.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-border flex-shrink-0" />
                    )}
                    <span className={`text-sm ${m.completed ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                      {m.name}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Intern Info Card */}
            <Card className="border-border/50 shadow-sm rounded-xl bg-gradient-to-br from-emerald-500/5 to-transparent">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Internship Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Name</span>
                  <span className="font-medium">{intern.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Mentor</span>
                  <span className="font-medium">{intern.mentor}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Batch</span>
                  <span className="font-medium text-right max-w-[55%] truncate">{intern.batch.split("–")[0].trim()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">{intern.startDate} – {intern.endDate}</span>
                </div>
                <div className="pt-2 border-t border-border/40">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full h-8 text-xs"
                    onClick={() => navigate("/intern/profile")}
                  >
                    View Full Profile
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

export default InternDashboard;
