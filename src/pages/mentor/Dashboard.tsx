import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import SuperAdminStatCard from "@/components/superadmin/SuperAdminStatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  Briefcase,
  AlertTriangle,
  UserCheck,
  ChevronRight,
  Clock,
  Bell,
} from "lucide-react";
import {
  mentorProfile,
  mentees,
  mentorActivityLog,
  getAtRiskMentees,
  getPendingTaskReviews,
  getAttendanceAlerts,
  getMenteesByType,
} from "@/data/mentorData";

const activityTypeIcon: Record<string, string> = {
  task: "📋",
  attendance: "📊",
  progress: "🚀",
  system: "⚙️",
};

const MentorDashboard = () => {
  const totalMentees = mentees.length;
  const atRisk = getAtRiskMentees().length;
  const attendanceAlerts = getAttendanceAlerts().length;
  const pendingReviews = getPendingTaskReviews().length;
  const students = getMenteesByType("student");
  const interns = getMenteesByType("intern");

  const statusColor = (status: string) => {
    const map: Record<string, string> = {
      "on-track": "bg-primary/10 text-primary",
      "ahead": "bg-primary/15 text-primary",
      "at-risk": "bg-destructive/10 text-destructive",
      "needs-attention": "bg-warning/10 text-warning",
    };
    return map[status] || "bg-muted text-muted-foreground";
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-semibold text-foreground tracking-tight">
            Good morning, {mentorProfile.name}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            You have {pendingReviews} task reviews pending and {atRisk} mentees at risk.
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <SuperAdminStatCard
            title="Total Mentees"
            value={totalMentees}
            subtitle={`${students.length} students, ${interns.length} interns`}
            icon={Users}
            trend={{ value: "+2 this month", positive: true }}
          />
          <SuperAdminStatCard
            title="Interns At Risk"
            value={atRisk}
            subtitle="Low task completion or attendance"
            icon={AlertTriangle}
            trend={{ value: atRisk > 0 ? "Action needed" : "All clear", positive: atRisk === 0 }}
          />
          <SuperAdminStatCard
            title="Attendance Alerts"
            value={attendanceAlerts}
            subtitle="Below 80% threshold"
            icon={UserCheck}
            trend={{ value: attendanceAlerts > 0 ? "Review needed" : "Healthy", positive: attendanceAlerts === 0 }}
          />
          <SuperAdminStatCard
            title="Pending Reviews"
            value={pendingReviews}
            subtitle="Intern task submissions"
            icon={Briefcase}
            trend={{ value: pendingReviews > 2 ? "Backlog growing" : "Manageable", positive: pendingReviews <= 2 }}
          />
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Mentee Overview */}
          <Card className="xl:col-span-2 border border-border/60 shadow-card">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Mentee Overview</CardTitle>
                <Badge variant="secondary">{totalMentees} total</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {mentees.slice(0, 6).map((mentee) => (
                <div key={mentee.id} className="flex items-center gap-4 p-3 rounded-xl border border-border/50 hover:bg-muted/30 transition-colors">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className={`${mentee.type === "intern" ? "bg-role-intern/10 text-role-intern" : "bg-primary/10 text-primary"} text-sm`}>
                      {mentee.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm truncate">{mentee.name}</p>
                      <Badge variant="outline" className="text-[10px] h-5">{mentee.type}</Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={mentee.progress} className="h-1.5 flex-1 max-w-[120px]" />
                      <span className="text-xs text-muted-foreground">{mentee.progress}%</span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground">{mentee.course}</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className={`${statusColor(mentee.status)} border-0 text-xs capitalize`}>
                    {mentee.status.replace("-", " ")}
                  </Badge>
                </div>
              ))}
              {totalMentees > 6 && (
                <Button variant="ghost" size="sm" className="w-full text-primary" asChild>
                  <a href="/mentor/students">View All <ChevronRight className="w-4 h-4 ml-1" /></a>
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card className="border border-border/60 shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Bell className="w-4 h-4 text-primary" />
                Mentee Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-0 p-0">
              <div className="divide-y divide-border max-h-[400px] overflow-y-auto">
                {mentorActivityLog.map((log) => (
                  <div key={log.id} className={`px-5 py-3 flex items-start gap-3 hover:bg-muted/30 transition-colors ${!log.read ? "bg-primary/5" : ""}`}>
                    <span className="text-lg mt-0.5">{activityTypeIcon[log.type]}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{log.message}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {log.timestamp}
                      </p>
                    </div>
                    {!log.read && <span className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* At-Risk Alerts */}
        {getAtRiskMentees().length > 0 && (
          <Card className="border border-destructive/20 bg-destructive/5 shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2 text-destructive">
                <AlertTriangle className="w-4 h-4" /> Mentees Requiring Attention
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {getAtRiskMentees().map((mentee) => (
                  <div key={mentee.id} className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border/50">
                    <Avatar className="w-9 h-9">
                      <AvatarFallback className="bg-destructive/10 text-destructive text-sm">
                        {mentee.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{mentee.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {mentee.type === "intern" ? `${mentee.progress}% task completion` : `${mentee.attendance}% attendance`} · Last active: {mentee.lastActive}
                      </p>
                    </div>
                    <Badge variant="secondary" className="bg-destructive/10 text-destructive border-0 capitalize text-xs">
                      {mentee.status.replace("-", " ")}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MentorDashboard;
