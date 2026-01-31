import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Video, 
  Clock, 
  TrendingUp, 
  Award, 
  Bell,
  CheckCircle2,
  BookOpen,
  UserCheck,
} from "lucide-react";

const StudentDashboard = () => {
  const upcomingClass = {
    subject: "UX Design Fundamentals",
    tutor: "Sarah Mitchell",
    date: "Today",
    time: "2:00 PM - 3:30 PM",
    meetLink: "#",
  };

  const stats = {
    attendance: 87,
    coursesEnrolled: 4,
    completedLessons: 28,
    totalLessons: 42,
  };

  const courseProgress = [
    { name: "UX Design Fundamentals", progress: 85, color: "bg-role-student" },
    { name: "UI Development", progress: 72, color: "bg-role-intern" },
    { name: "Design Systems", progress: 45, color: "bg-role-tutor" },
    { name: "User Research", progress: 30, color: "bg-role-mentor" },
  ];

  const notifications = [
    { id: 1, message: "Assignment due tomorrow: Design a mobile app prototype", type: "warning", unread: true },
    { id: 2, message: "New learning material uploaded for UX Design", type: "info", unread: true },
    { id: 3, message: "Your attendance for last week: 100%", type: "success", unread: false },
  ];

  const certificates = [
    { name: "UX Fundamentals", status: "eligible", progress: 100 },
    { name: "UI Development", status: "in-progress", progress: 72 },
  ];

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-semibold text-foreground tracking-tight">
            Welcome back, Alex! 👋
          </h1>
          <p className="text-muted-foreground mt-2">
            You're making great progress. Keep up the momentum!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Next Class Card */}
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Next Class
                  </CardTitle>
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    {upcomingClass.date}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">
                      {upcomingClass.subject}
                    </h3>
                    <p className="text-muted-foreground mt-1">
                      with {upcomingClass.tutor}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{upcomingClass.time}</span>
                    </div>
                  </div>
                  <Button className="gap-2 bg-primary hover:bg-primary/90">
                    <Video className="w-4 h-4" />
                    Join Class
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-role-student/10 flex items-center justify-center">
                      <UserCheck className="w-5 h-5 text-role-student" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold">{stats.attendance}%</p>
                      <p className="text-xs text-muted-foreground">Attendance</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-role-intern/10 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-role-intern" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold">{stats.coursesEnrolled}</p>
                      <p className="text-xs text-muted-foreground">Courses</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-role-tutor/10 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-role-tutor" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold">{stats.completedLessons}</p>
                      <p className="text-xs text-muted-foreground">Lessons Done</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-role-mentor/10 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-role-mentor" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold">
                        {Math.round((stats.completedLessons / stats.totalLessons) * 100)}%
                      </p>
                      <p className="text-xs text-muted-foreground">Overall</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Course Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Course Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {courseProgress.map((course) => (
                  <div key={course.name}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">
                        {course.name}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {course.progress}%
                      </span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar Content */}
          <div className="space-y-6">
            {/* Notifications */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border transition-colors ${
                      notification.unread
                        ? "bg-primary/5 border-primary/20"
                        : "bg-muted/30 border-transparent"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {notification.unread && (
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                      )}
                      <p className="text-sm text-foreground leading-relaxed">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                ))}
                <Button variant="ghost" className="w-full text-primary hover:text-primary/90">
                  View All
                </Button>
              </CardContent>
            </Card>

            {/* Certificate Eligibility */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Certificates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {certificates.map((cert) => (
                  <div key={cert.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{cert.name}</span>
                      <Badge
                        variant={cert.status === "eligible" ? "default" : "secondary"}
                        className={
                          cert.status === "eligible"
                            ? "bg-green-500/10 text-green-600 hover:bg-green-500/20"
                            : ""
                        }
                      >
                        {cert.status === "eligible" ? "Eligible" : "In Progress"}
                      </Badge>
                    </div>
                    <Progress value={cert.progress} className="h-1.5" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
