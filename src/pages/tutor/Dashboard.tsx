import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import SuperAdminStatCard from "@/components/superadmin/SuperAdminStatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  BookOpen,
  Users,
  Video,
  Clock,
  Calendar,
  ClipboardList,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import {
  tutorProfile,
  getTodaysClasses,
  getActiveAssignments,
  getPendingSubmissions,
  getAverageAttendance,
  tutorAssignments,
  gradebookEntries,
} from "@/data/tutorData";
import { toast } from "sonner";

const TutorDashboard = () => {
  const [meetModalOpen, setMeetModalOpen] = useState(false);
  const [meetLink, setMeetLink] = useState("https://meet.google.com/");
  const [meetSubject, setMeetSubject] = useState("");

  const todaysClasses = getTodaysClasses();
  const pendingToGrade = getPendingSubmissions().length;
  const avgAttendance = getAverageAttendance();

  const recentGraded = tutorAssignments
    .flatMap((a) => a.submissions)
    .filter((s) => s.status === "graded")
    .slice(0, 4);

  const handleStartClass = () => {
    if (meetLink && meetSubject) {
      toast.success(`Live class started for "${meetSubject}"`);
      setMeetModalOpen(false);
      setMeetLink("https://meet.google.com/");
      setMeetSubject("");
    }
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-semibold text-foreground tracking-tight">
              Good morning, {tutorProfile.name}! 📚
            </h1>
            <p className="text-muted-foreground mt-1">
              You have {todaysClasses.length} classes scheduled for today.
            </p>
          </div>
          <Button onClick={() => setMeetModalOpen(true)} className="gap-2">
            <Video className="w-4 h-4" />
            Start Live Class
          </Button>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <SuperAdminStatCard
            title="Active Classes Today"
            value={todaysClasses.length}
            subtitle={`${todaysClasses.filter((c) => c.status === "scheduled").length} upcoming`}
            icon={BookOpen}
            trend={{ value: "On schedule", positive: true }}
          />
          <SuperAdminStatCard
            title="Pending to Grade"
            value={pendingToGrade}
            subtitle="Submissions awaiting review"
            icon={ClipboardList}
            trend={{ value: pendingToGrade > 3 ? "Needs attention" : "Manageable", positive: pendingToGrade <= 3 }}
          />
          <SuperAdminStatCard
            title="Avg. Attendance"
            value={`${avgAttendance}%`}
            subtitle="Across all courses"
            icon={Users}
            trend={{ value: "+2% vs last month", positive: true }}
          />
          <SuperAdminStatCard
            title="Total Students"
            value={gradebookEntries.length}
            subtitle="Across all courses"
            icon={TrendingUp}
            trend={{ value: "+2 this month", positive: true }}
          />
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Today's Classes */}
          <Card className="xl:col-span-2 border border-border/60 shadow-card">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Today's Classes
                </CardTitle>
                <Badge variant="secondary">{todaysClasses.length} sessions</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {todaysClasses.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">No classes scheduled for today</p>
              ) : (
                todaysClasses.map((cls) => (
                  <div key={cls.id} className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{cls.subject}</p>
                        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {cls.time}
                          </span>
                          <span>·</span>
                          <span>{cls.duration}</span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" /> {cls.studentsEnrolled}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" className="gap-2" onClick={() => { setMeetSubject(cls.subject); setMeetLink(cls.meetLink); setMeetModalOpen(true); }}>
                      <Video className="w-4 h-4" /> Join
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Quick Actions + Recent Grades */}
          <div className="space-y-6">
            <Card className="border border-border/60 shadow-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start gap-2" onClick={() => setMeetModalOpen(true)}>
                  <Video className="w-4 h-4" /> Start Live Class
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2" asChild>
                  <a href="/tutor/materials">
                    <BookOpen className="w-4 h-4" /> Upload Material
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2" asChild>
                  <a href="/tutor/assignments">
                    <ClipboardList className="w-4 h-4" /> Create Assignment
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2" asChild>
                  <a href="/tutor/evaluations">
                    <BarChart3 className="w-4 h-4" /> Grade Submissions
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="border border-border/60 shadow-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Recent Grades</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentGraded.map((sub) => (
                  <div key={sub.id} className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium">{sub.studentName}</p>
                      <p className="text-xs text-muted-foreground">{sub.submittedDate}</p>
                    </div>
                    <Badge variant="secondary" className={sub.grade && sub.grade >= 85 ? "bg-primary/10 text-primary border-0" : "bg-warning/10 text-warning border-0"}>
                      {sub.grade}%
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Google Meet Modal */}
      <Dialog open={meetModalOpen} onOpenChange={setMeetModalOpen}>
        <DialogContent className="sm:max-w-[480px] rounded-xl">
          <DialogHeader>
            <DialogTitle>Start Live Class</DialogTitle>
            <DialogDescription>Configure Google Meet for your class session</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Subject / Topic</Label>
              <Input value={meetSubject} onChange={(e) => setMeetSubject(e.target.value)} placeholder="e.g. React Hooks Deep Dive" />
            </div>
            <div className="space-y-2">
              <Label>Google Meet Link</Label>
              <Input value={meetLink} onChange={(e) => setMeetLink(e.target.value)} placeholder="https://meet.google.com/xxx-xxxx-xxx" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMeetModalOpen(false)}>Cancel</Button>
            <Button onClick={handleStartClass} disabled={!meetSubject || !meetLink} className="gap-2">
              <Video className="w-4 h-4" /> Start Class
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default TutorDashboard;
