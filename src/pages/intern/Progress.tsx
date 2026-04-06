import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp, CheckCircle2, Clock, ClipboardList,
  UserCheck, MessageSquare, Calendar, Eye, Download, FileText, X, ChevronDown
} from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const internshipDays = {
  total: 90,
  completed: 41,
};
const dayProgressPercentage = Math.round((internshipDays.completed / internshipDays.total) * 100);

const taskData = {
  total: 20,
  completed: 12,
  pending: 8,
};

type WeekStatus = "Reviewed" | "Pending" | "Not Submitted";

interface WeekReport {
  week: string;
  status: WeekStatus;
  title: string;
  summary: string;
  challenges: string;
  fileName: string;
}

const weeklyReports: WeekReport[] = [
  { 
    week: "March – Week 1", 
    status: "Reviewed",
    title: "Onboarding & Environment Setup",
    summary: "Completed internship orientation, set up development environment, and initialized the main project repository.",
    challenges: "Initial issues with Node.js versions, resolved by using NVM.",
    fileName: "onboarding-setup.pdf"
  },
  { 
    week: "April – Week 2", 
    status: "Reviewed",
    title: "Dashboard UI Components",
    summary: "Implemented reusable UI components like Cards, Badges, and progress bars using ShadCN and Tailwind CSS.",
    challenges: "Aligning responsive grid layouts for mobile devices.",
    fileName: "dashboard-components.zip"
  },
  { 
    week: "April – Week 3", 
    status: "Pending",
    title: "Authentication Module",
    summary: "Developed login and signup pages with client-side validation using Zod.",
    challenges: "Handling persistent session state across page refreshes.",
    fileName: "auth-module.png"
  },
  { 
    week: "April – Week 4", 
    status: "Not Submitted",
    title: "",
    summary: "",
    challenges: "",
    fileName: ""
  },
];

interface MentorFeedback {
  week: string;
  feedback: string;
}

const mentorFeedback: MentorFeedback[] = [
  { week: "March – Week 1", feedback: "Good start. Improve code structure and add more comments." },
  { week: "April – Week 2", feedback: "Excellent dashboard implementation! Keep this momentum going." },
  { week: "April – Week 3", feedback: "Your current task logic is coming along well. Keep it up!" },
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
// ─── View Report Modal ────────────────────────────────────────────────────────

const ViewReportModal = ({ report, onClose }: { report: WeekReport; onClose: () => void }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const [month, currentWeek] = report.week.split(" – ");
  const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div 
        className="bg-background border border-border/50 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in zoom-in duration-300 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-8 pb-6 relative">
          <button onClick={onClose} className="absolute top-8 right-8 p-1.5 rounded-full hover:bg-muted transition-colors text-muted-foreground/60">
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Submit Weekly Report</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Fill in the details for your weekly progress.
          </p>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-8 pb-8 space-y-6">
          
          {/* Month */}
          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-1 text-foreground/80">
              Month <span className="text-destructive">*</span>
            </label>
            <div className="w-full px-4 py-3 rounded-xl bg-muted/30 border border-border/40 text-sm font-medium flex items-center justify-between text-foreground/70">
              {month}
              <ChevronDown className="w-4 h-4 text-muted-foreground/50" />
            </div>
          </div>

          {/* Week */}
          <div className="space-y-3">
            <label className="text-sm font-semibold flex items-center gap-1 text-foreground/80">
              Week <span className="text-destructive">*</span>
            </label>
            <div className="grid grid-cols-4 gap-3">
              {weeks.map((w) => (
                <div 
                  key={w}
                  className={`py-3 px-2 rounded-xl text-center text-sm font-medium border transition-all ${
                    w === currentWeek 
                      ? "bg-primary/5 border-primary/40 text-primary shadow-sm" 
                      : "bg-background border-border/50 text-muted-foreground/60"
                  }`}
                >
                  {w}
                </div>
              ))}
            </div>
          </div>

          {/* Report Title */}
          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-1 text-foreground/80">
              Report Title <span className="text-destructive">*</span>
            </label>
            <div className="w-full px-4 py-3 rounded-xl bg-background border border-border/50 text-sm placeholder:text-muted-foreground/40 min-h-[48px] flex items-center text-foreground/80 font-medium">
              {report.title || <span className="text-muted-foreground/40 italic">e.g., UI Components & Auth Integration</span>}
            </div>
          </div>

          {/* Tasks Completed */}
          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-1 text-foreground/80">
              Tasks Completed <span className="text-destructive">*</span>
            </label>
            <div className="w-full px-4 py-3 rounded-xl bg-background border border-border/50 text-sm text-foreground/80 leading-relaxed min-h-[140px] whitespace-pre-wrap">
              {report.summary || <span className="text-muted-foreground/40 italic">Describe the tasks you completed this week...</span>}
            </div>
          </div>

          {/* Challenges Faced */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground/80">
              Challenges Faced (Optional)
            </label>
            <div className="w-full px-4 py-3 rounded-xl bg-background border border-border/50 text-sm text-foreground/80 leading-relaxed min-h-[100px] whitespace-pre-wrap">
              {report.challenges || <span className="text-muted-foreground/40 italic">Any blockers or difficulties...</span>}
            </div>
          </div>

          {/* Attachments (View Only) */}
          {report.fileName && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground/80 border-t border-border/20 pt-6 mt-6 block">Attachments</label>
              <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-muted/30 border border-border/40 group">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground/60 font-medium mb-0.5">Report Attachment</p>
                    <p className="text-sm font-semibold truncate leading-tight text-foreground/80">{report.fileName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                        const url = report.fileName.toLowerCase().endsWith('.pdf') 
                            ? 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
                            : 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?q=80&w=1000&auto=format&fit=crop';
                        window.open(url, '_blank');
                    }}
                    className="p-2 rounded-lg text-muted-foreground/60 hover:text-primary hover:bg-primary/10 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toast.success(`Downloading ${report.fileName}...`)}
                    className="p-2 rounded-lg text-muted-foreground/60 hover:text-primary hover:bg-primary/10 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-border/50 bg-muted/5 flex items-center justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold border border-border/50 hover:bg-muted transition-colors bg-background text-foreground/70"
          >
            Cancel
          </button>
          <button 
            disabled
            className="px-6 py-2.5 rounded-xl text-sm font-bold bg-primary/20 text-primary border border-primary/20 cursor-not-allowed"
          >
            Submit Report
          </button>
        </div>
      </div>
    </div>
  );
};



// ─── Page ─────────────────────────────────────────────────────────────────────

const InternProgress = () => {
  const navigate = useNavigate();
  const [viewingReport, setViewingReport] = useState<WeekReport | null>(null);
  const taskCompletion = Math.round((taskData.completed / taskData.total) * 100);

  return (
    <>
      <DashboardLayout>
        <div className="animate-fade-in space-y-6 max-w-6xl mx-auto px-4 md:px-6 lg:px-8 pb-10">

          {/* ── Page Header ── */}
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
              Internship Progress
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Track your overall internship journey, tasks, reports, and attendance.
            </p>
          </div>

          {/* ... regular sections ... */}

        {/* ─────────────────────────────────────────────
            Section 1: Overall Internship Progress
        ───────────────────────────────────────────── */}
        <Card className="border-border/50 shadow-sm rounded-xl overflow-hidden">
          <CardHeader className="pb-3 border-b border-border/50 bg-muted/5">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Overall Internship Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="flex items-end justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground font-medium">Internship Duration</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-foreground">{internshipDays.completed}</span>
                  <span className="text-sm text-muted-foreground font-medium">/ {internshipDays.total} Days</span>
                </div>
              </div>
              <div className="text-right space-y-1">
                <p className="text-sm text-muted-foreground font-medium">Progress</p>
                <span className="text-3xl font-bold text-emerald-600">{dayProgressPercentage}%</span>
              </div>
            </div>

            <div className="space-y-2">
              <ProgressBar 
                value={dayProgressPercentage} 
                color="bg-gradient-to-r from-emerald-500 to-emerald-400" 
                height="h-4"
              />
              <div className="flex justify-between items-center text-xs text-muted-foreground font-medium px-1">
                <span>Started</span>
                <span>{internshipDays.total - internshipDays.completed} Days Remaining</span>
                <span>Completed</span>
              </div>
            </div>
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
              {weeklyReports.slice(0, 4).map((report) => {
                const Icon = weekStatusIcon[report.status];
                return (
                  <div
                    key={report.week}
                    className="flex items-center justify-between px-4 py-3 rounded-lg border border-border/40 bg-card hover:bg-muted/10 transition-colors group"
                  >
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Icon className="w-4 h-4 text-muted-foreground" />
                      {report.week}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-semibold ${weekStatusStyles[report.status]}`}
                      >
                        {report.status}
                      </Badge>
                      {report.status !== "Not Submitted" && (
                        <button
                          onClick={() => setViewingReport(report)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors opacity-100 sm:opacity-0 group-hover:opacity-100"
                          title="View Report Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                    </div>
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
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-600" />
              Attendance Summary
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 text-xs px-3 font-semibold text-primary hover:bg-primary/5"
              onClick={() => navigate("/intern/attendance")}
            >
              View
            </Button>
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

    {/* View Report Modal rendered outside DashboardLayout for full screen overlay */}
    {viewingReport && (
      <ViewReportModal 
        report={viewingReport} 
        onClose={() => setViewingReport(null)} 
      />
    )}
    </>
  );
};

export default InternProgress;
