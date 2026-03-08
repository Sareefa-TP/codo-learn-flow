import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Users, ClipboardList, FileText, UserCheck,
  CheckCircle2, Clock, Eye, UserX,
} from "lucide-react";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mentor = {
  name: "John Doe",
  batch: "Full Stack Internship Batch — March 2026",
};

const kpi = {
  totalInterns: 18,
  pendingTaskReviews: 6,
  weeklyReportsPending: 4,
  presentToday: 14,
};

type SubStatus = "Pending Review" | "Reviewed";

interface TaskSubmission {
  id: number;
  internName: string;
  taskTitle: string;
  week: string;
  submittedDate: string;
  status: SubStatus;
}

const taskSubmissions: TaskSubmission[] = [
  { id: 1, internName: "Aarav Singh", taskTitle: "Build Login Page", week: "Week 1", submittedDate: "Mar 01, 2026", status: "Pending Review" },
  { id: 2, internName: "Priya Sharma", taskTitle: "Design Dashboard Layout", week: "Week 2", submittedDate: "Mar 03, 2026", status: "Pending Review" },
  { id: 3, internName: "Rahul Mehta", taskTitle: "API Integration", week: "Week 2", submittedDate: "Mar 04, 2026", status: "Reviewed" },
  { id: 4, internName: "Sneha Verma", taskTitle: "Create Component Library", week: "Week 3", submittedDate: "Mar 05, 2026", status: "Pending Review" },
  { id: 5, internName: "Karan Nair", taskTitle: "Setup Authentication", week: "Week 1", submittedDate: "Mar 02, 2026", status: "Reviewed" },
];

type ReportStatus = "Pending" | "Reviewed";

interface WeeklyReport {
  id: number;
  internName: string;
  week: string;
  submittedDate: string;
  status: ReportStatus;
}

const weeklyReports: WeeklyReport[] = [
  { id: 1, internName: "Aarav Singh", week: "Week 3", submittedDate: "Mar 16, 2026", status: "Pending" },
  { id: 2, internName: "Priya Sharma", week: "Week 3", submittedDate: "Mar 16, 2026", status: "Pending" },
  { id: 3, internName: "Sneha Verma", week: "Week 2", submittedDate: "Mar 09, 2026", status: "Reviewed" },
  { id: 4, internName: "Dev Patel", week: "Week 3", submittedDate: "Mar 17, 2026", status: "Pending" },
];

const attendance = { present: 14, absent: 4, total: 18 };

// ─── Sub-components ───────────────────────────────────────────────────────────

const taskSubStatusStyle: Record<SubStatus, string> = {
  "Pending Review": "bg-amber-500/10 text-amber-600 border-amber-500/20",
  "Reviewed": "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
};

const reportStatusStyle: Record<ReportStatus, string> = {
  Pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  Reviewed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const MentorDashboard = () => {
  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6 max-w-6xl mx-auto pb-10">

        {/* ── Welcome Section ── */}
        <div className="rounded-xl border border-border/50 bg-gradient-to-r from-primary/5 via-background to-background p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Welcome Back, {mentor.name} 👋
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                You are mentoring the{" "}
                <span className="font-medium text-foreground">{mentor.batch}</span>.
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">
                Monitor intern tasks, reports and attendance.
              </p>
            </div>
          </div>
        </div>

        {/* ── KPI Summary Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Total Interns",
              value: kpi.totalInterns,
              icon: Users,
              bg: "bg-violet-500/10",
              color: "text-violet-600",
            },
            {
              label: "Pending Task Reviews",
              value: kpi.pendingTaskReviews,
              icon: ClipboardList,
              bg: "bg-amber-500/10",
              color: "text-amber-600",
            },
            {
              label: "Reports Pending Review",
              value: kpi.weeklyReportsPending,
              icon: FileText,
              bg: "bg-rose-500/10",
              color: "text-rose-600",
            },
            {
              label: "Today's Attendance",
              value: `${kpi.presentToday} / ${attendance.total}`,
              icon: UserCheck,
              bg: "bg-emerald-500/10",
              color: "text-emerald-600",
            },
          ].map(({ label, value, icon: Icon, bg, color }) => (
            <Card key={label} className="border-border/50 shadow-sm rounded-xl">
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${bg}`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <div>
                    <p className={`text-2xl font-bold leading-tight ${color}`}>{value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-tight">{label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ── Two-column bottom grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Section: Recent Task Submissions (wider) ── */}
          <div className="lg:col-span-2 space-y-0">
            <Card className="border-border/50 shadow-sm rounded-xl overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <ClipboardList className="w-4 h-4 text-primary" />
                    Recent Task Submissions
                  </CardTitle>
                  <Badge variant="outline" className="text-[10px] font-semibold bg-amber-500/10 text-amber-600 border-amber-500/20">
                    {taskSubmissions.filter(t => t.status === "Pending Review").length} Pending
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead className="text-xs font-semibold">Intern</TableHead>
                        <TableHead className="text-xs font-semibold">Task</TableHead>
                        <TableHead className="text-xs font-semibold">Week</TableHead>
                        <TableHead className="text-xs font-semibold">Submitted</TableHead>
                        <TableHead className="text-xs font-semibold">Status</TableHead>
                        <TableHead className="text-xs font-semibold text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {taskSubmissions.map(sub => (
                        <TableRow key={sub.id} className="hover:bg-muted/10 transition-colors">
                          <TableCell className="text-sm font-medium">{sub.internName}</TableCell>
                          <TableCell className="text-sm text-muted-foreground max-w-[160px]">
                            <p className="truncate">{sub.taskTitle}</p>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">{sub.week}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{sub.submittedDate}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`text-[10px] font-semibold ${taskSubStatusStyle[sub.status]}`}
                            >
                              {sub.status === "Pending Review"
                                ? <Clock className="w-2.5 h-2.5 mr-1" />
                                : <CheckCircle2 className="w-2.5 h-2.5 mr-1" />
                              }
                              {sub.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs px-2.5 gap-1.5"
                            >
                              <Eye className="w-3 h-3" />
                              Review
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ── Right column: Attendance Overview ── */}
          <div className="space-y-4">
            <Card className="border-border/50 shadow-sm rounded-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  Today's Attendance
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Attendance Rate</span>
                    <span className="font-semibold text-emerald-600">
                      {Math.round((attendance.present / attendance.total) * 100)}%
                    </span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-700"
                      style={{ width: `${Math.round((attendance.present / attendance.total) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Stat tiles */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {[
                    { label: "Present", value: attendance.present, icon: UserCheck, color: "text-emerald-600", bg: "bg-emerald-500/10" },
                    { label: "Absent", value: attendance.absent, icon: UserX, color: "text-red-600", bg: "bg-red-500/10" },
                    { label: "Total", value: attendance.total, icon: Users, color: "text-violet-600", bg: "bg-violet-500/10" },
                  ].map(({ label, value, icon: Icon, color, bg }) => (
                    <div key={label} className={`flex flex-col items-center py-3 rounded-lg ${bg}`}>
                      <Icon className={`w-4 h-4 ${color} mb-1`} />
                      <p className={`text-lg font-bold ${color}`}>{value}</p>
                      <p className="text-[10px] text-muted-foreground">{label}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ── Section: Weekly Reports Pending ── */}
        <Card className="border-border/50 shadow-sm rounded-xl overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                Weekly Reports Waiting for Review
              </CardTitle>
              <Badge variant="outline" className="text-[10px] font-semibold bg-rose-500/10 text-rose-600 border-rose-500/20">
                {weeklyReports.filter(r => r.status === "Pending").length} Pending
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="text-xs font-semibold">Intern</TableHead>
                    <TableHead className="text-xs font-semibold">Week</TableHead>
                    <TableHead className="text-xs font-semibold">Submitted Date</TableHead>
                    <TableHead className="text-xs font-semibold">Status</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {weeklyReports.map(report => (
                    <TableRow key={report.id} className="hover:bg-muted/10 transition-colors">
                      <TableCell className="text-sm font-medium">{report.internName}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{report.week}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{report.submittedDate}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-semibold ${reportStatusStyle[report.status]}`}
                        >
                          {report.status === "Pending"
                            ? <Clock className="w-2.5 h-2.5 mr-1 inline" />
                            : <CheckCircle2 className="w-2.5 h-2.5 mr-1 inline" />
                          }
                          {report.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs px-2.5 gap-1.5"
                        >
                          <Eye className="w-3 h-3" />
                          Review Report
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  );
};

export default MentorDashboard;
