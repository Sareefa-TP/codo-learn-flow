import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ClipboardList, Clock, CheckCircle2, AlertCircle, Loader2,
  Calendar, Eye, Upload,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Priority = "High" | "Medium" | "Low";
type Status = "Pending" | "Submitted" | "Completed" | "Overdue";

interface Task {
  id: number;
  title: string;
  week: string;
  priority: Priority;
  deadline: string;
  status: Status;
  description: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const tasks: Task[] = [
  {
    id: 1,
    title: "Build Login Page UI",
    week: "Week 2",
    priority: "High",
    deadline: "March 22, 2026",
    status: "Pending",
    description: "Design and implement the login page UI with form validation, error states, and responsive layout.",
  },
  {
    id: 2,
    title: "Create Dashboard Layout",
    week: "Week 3",
    priority: "High",
    deadline: "March 20, 2026",
    status: "Submitted",
    description: "Build the main dashboard layout including sidebar, header, and main content area.",
  },
  {
    id: 3,
    title: "API Integration Practice",
    week: "Week 4",
    priority: "Medium",
    deadline: "March 28, 2026",
    status: "Pending",
    description: "Integrate REST APIs for user authentication and data fetching using axios.",
  },
  {
    id: 4,
    title: "Database Schema Design",
    week: "Week 5",
    priority: "Medium",
    deadline: "March 15, 2026",
    status: "Overdue",
    description: "Design the relational database schema for the LMS platform including students, courses, and batches.",
  },
  {
    id: 5,
    title: "Responsive UI Improvements",
    week: "Week 6",
    priority: "Low",
    deadline: "April 05, 2026",
    status: "Completed",
    description: "Audit and fix all responsive breakpoints across the intern portal pages.",
  },
  {
    id: 6,
    title: "Code Review Participation",
    week: "Week 3",
    priority: "Low",
    deadline: "March 18, 2026",
    status: "Completed",
    description: "Participate in peer code review sessions and submit written feedback.",
  },
  {
    id: 7,
    title: "Prepare Weekly Report",
    week: "Week 4",
    priority: "Medium",
    deadline: "March 25, 2026",
    status: "Submitted",
    description: "Write and submit a structured weekly progress report to your mentor.",
  },
  {
    id: 8,
    title: "Component Library Setup",
    week: "Week 2",
    priority: "High",
    deadline: "March 10, 2026",
    status: "Completed",
    description: "Set up and document the shared component library using ShadCN UI.",
  },
];

// ─── Style Maps ───────────────────────────────────────────────────────────────

const priorityStyles: Record<Priority, string> = {
  High: "bg-red-500/10 text-red-600 border-red-500/20",
  Medium: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  Low: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
};

const statusStyles: Record<Status, string> = {
  Pending: "bg-muted text-muted-foreground border-border/40",
  Submitted: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  Completed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  Overdue: "bg-red-500/10 text-red-600 border-red-500/20",
};

const statusIcons: Record<Status, React.ElementType> = {
  Pending: Clock,
  Submitted: Loader2,
  Completed: CheckCircle2,
  Overdue: AlertCircle,
};

type FilterTab = "All" | Status;
const filterTabs: FilterTab[] = ["All", "Pending", "Submitted", "Completed", "Overdue"];

// ─── Sub-components ───────────────────────────────────────────────────────────

interface SummaryCardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  valueColor?: string;
}

const SummaryCard = ({ label, value, icon: Icon, iconBg, iconColor, valueColor }: SummaryCardProps) => (
  <Card className="border-border/50 shadow-sm rounded-xl">
    <CardContent className="pt-5 pb-4">
      <div className="flex items-center gap-3">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <div>
          <p className={`text-2xl font-bold leading-tight ${valueColor ?? "text-foreground"}`}>{value}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

interface TaskCardProps {
  task: Task;
  onView: (id: number) => void;
  onSubmit: (id: number) => void;
}

const TaskCard = ({ task, onView, onSubmit }: TaskCardProps) => {
  const StatusIcon = statusIcons[task.status];

  return (
    <Card className="border-border/50 shadow-sm rounded-xl hover:shadow-md transition-all duration-200 border-l-4 border-l-transparent hover:border-l-primary group">
      <CardContent className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">

        {/* Left Side: Task Info */}
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-sm lg:text-base text-foreground truncate group-hover:text-primary transition-colors">
              {task.title}
            </h3>
            <Badge variant="outline" className={`text-[10px] font-bold uppercase tracking-wider h-5 flex items-center ${priorityStyles[task.priority]}`}>
              {task.priority}
            </Badge>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium flex-wrap">
            <div className="flex items-center gap-1.5">
              <ClipboardList className="w-3.5 h-3.5 text-primary/60" />
              <span>{task.week}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-primary/60" />
              <span className={task.status === "Overdue" ? "text-red-500 font-bold" : ""}>
                {task.deadline}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Status + Actions Combined */}
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap md:flex-nowrap">
          {/* Status Badge */}
          <Badge
            variant="outline"
            className={`text-[11px] font-bold uppercase tracking-widest h-9 px-3 gap-2 flex-shrink-0 border-2 ${statusStyles[task.status]}`}
          >
            <StatusIcon className="w-4 h-4" />
            {task.status}
          </Badge>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {(task.status === "Pending" || task.status === "Overdue") && (
              <Button
                size="sm"
                className="h-9 text-xs px-4 gap-2 rounded-lg shadow-sm shadow-primary/10"
                onClick={() => onSubmit(task.id)}
              >
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">Submit Work</span>
                <span className="sm:hidden">Submit</span>
              </Button>
            )}

            <Button
              size="sm"
              variant="outline"
              className="h-9 text-xs px-4 gap-2 rounded-lg border-border/60 hover:border-primary/40 hover:bg-primary/5"
              onClick={() => onView(task.id)}
            >
              <Eye className="w-4 h-4 text-primary" />
              <span className="hidden sm:inline">View Details</span>
              <span className="sm:hidden">Details</span>
            </Button>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const InternTasks = () => {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("All");
  const navigate = useNavigate();

  // Summary counts
  const total = tasks.length;
  const pending = tasks.filter(t => t.status === "Pending").length;
  const submitted = tasks.filter(t => t.status === "Submitted").length;
  const completed = tasks.filter(t => t.status === "Completed").length;
  const overdue = tasks.filter(t => t.status === "Overdue").length;

  // Filtered list
  const filtered = activeFilter === "All"
    ? tasks
    : tasks.filter(t => t.status === activeFilter);

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6 max-w-6xl mx-auto px-4 md:px-6 lg:px-8 pb-10">

        {/* ── Page Header ── */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">Tasks</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            View and complete your assigned internship tasks
          </p>
        </div>

        {/* ── Summary Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard
            label="Total Tasks"
            value={total}
            icon={ClipboardList}
            iconBg="bg-violet-500/10"
            iconColor="text-violet-600"
            valueColor="text-violet-600"
          />
          <SummaryCard
            label="Pending"
            value={pending}
            icon={Clock}
            iconBg="bg-muted"
            iconColor="text-muted-foreground"
          />
          <SummaryCard
            label="Submitted"
            value={submitted}
            icon={Loader2}
            iconBg="bg-blue-500/10"
            iconColor="text-blue-600"
            valueColor="text-blue-600"
          />
          <SummaryCard
            label="Completed"
            value={completed}
            icon={CheckCircle2}
            iconBg="bg-emerald-500/10"
            iconColor="text-emerald-600"
            valueColor="text-emerald-600"
          />
        </div>

        {/* ── Filter Tabs ── */}
        <div className="flex items-center gap-1.5 bg-muted/50 p-1 rounded-xl w-fit border border-border/40 flex-wrap">
          {filterTabs.map(tab => {
            const count =
              tab === "All" ? total :
                tab === "Pending" ? pending :
                  tab === "Submitted" ? submitted :
                    tab === "Completed" ? completed : overdue;
            return (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeFilter === tab
                  ? "bg-background shadow-sm text-foreground border border-border/50"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {tab}
                <span className={`text-[10px] px-1.5 py-0 rounded-full font-semibold ${activeFilter === tab
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground"
                  }`}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* ── Task Grid ── */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground border border-dashed border-border/40 rounded-xl">
            <ClipboardList className="w-10 h-10 mx-auto opacity-20 mb-3" />
            <p className="font-medium">No tasks found</p>
            <p className="text-xs mt-1">No {activeFilter.toLowerCase()} tasks at the moment.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onView={id => navigate(`/intern/tasks/${id}`)}
                onSubmit={id => navigate(`/intern/tasks/${id}/submit`)}
              />
            ))}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default InternTasks;
