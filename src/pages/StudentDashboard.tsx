import DashboardLayout from "@/components/DashboardLayout";
import {
  Video,
  Calendar,
  TrendingUp,
  Award,
  Bell,
  Clock,
  CheckCircle2,
  ChevronRight,
  BookOpen,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// Mock data
const nextClass = {
  subject: "Introduction to UX Design",
  tutor: "Dr. Sarah Mitchell",
  date: "Today",
  time: "2:00 PM",
  meetLink: "https://meet.google.com/abc-defg-hij",
};

const attendance = {
  percentage: 87,
  attended: 26,
  total: 30,
};

const courseProgress = {
  overall: 68,
  courses: [
    { name: "UX Design Fundamentals", progress: 85, color: "bg-role-student" },
    { name: "UI Development", progress: 72, color: "bg-role-intern" },
    { name: "Design Systems", progress: 45, color: "bg-role-tutor" },
  ],
};

const notifications = [
  {
    id: 1,
    type: "assignment",
    message: "New assignment posted in UX Design",
    time: "2 hours ago",
    unread: true,
  },
  {
    id: 2,
    type: "grade",
    message: "Your project has been graded",
    time: "5 hours ago",
    unread: true,
  },
  {
    id: 3,
    type: "reminder",
    message: "Class starts in 30 minutes",
    time: "Yesterday",
    unread: false,
  },
];

const certificates = {
  eligible: 2,
  inProgress: 1,
  completed: 3,
};

const StudentDashboard = () => {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="opacity-0 animate-fade-in">
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
            Good afternoon, Alex 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your learning journey today.
          </p>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - 2 cols on large screens */}
          <div className="lg:col-span-2 space-y-6">
            {/* Next Class Card */}
            <div
              className="bg-card rounded-2xl border border-border/50 shadow-card p-6 opacity-0 animate-fade-in"
              style={{ animationDelay: "50ms" }}
            >
              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <Video className="w-4 h-4" />
                <span className="text-sm font-medium">Next Class</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-foreground">
                    {nextClass.subject}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    with {nextClass.tutor}
                  </p>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mt-2">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {nextClass.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {nextClass.time}
                    </span>
                  </div>
                </div>

                <Button className="shrink-0 gap-2">
                  <Video className="w-4 h-4" />
                  Join Class
                </Button>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Attendance */}
              <div
                className="bg-card rounded-2xl border border-border/50 shadow-card p-6 opacity-0 animate-fade-in"
                style={{ animationDelay: "100ms" }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Attendance</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {attendance.attended}/{attendance.total} classes
                  </span>
                </div>

                <div className="flex items-end gap-3">
                  <span className="text-4xl font-semibold text-foreground">
                    {attendance.percentage}%
                  </span>
                  <span className="text-sm text-primary mb-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    On track
                  </span>
                </div>

                <Progress
                  value={attendance.percentage}
                  className="h-2 mt-4"
                />
              </div>

              {/* Certificate Status */}
              <div
                className="bg-card rounded-2xl border border-border/50 shadow-card p-6 opacity-0 animate-fade-in"
                style={{ animationDelay: "150ms" }}
              >
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <Award className="w-4 h-4" />
                  <span className="text-sm font-medium">Certificates</span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 rounded-xl bg-accent/50">
                    <span className="text-2xl font-semibold text-foreground">
                      {certificates.eligible}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">Eligible</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-secondary">
                    <span className="text-2xl font-semibold text-foreground">
                      {certificates.inProgress}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">In Progress</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-primary/10">
                    <span className="text-2xl font-semibold text-primary">
                      {certificates.completed}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">Earned</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Progress */}
            <div
              className="bg-card rounded-2xl border border-border/50 shadow-card p-6 opacity-0 animate-fade-in"
              style={{ animationDelay: "200ms" }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BookOpen className="w-4 h-4" />
                  <span className="text-sm font-medium">Course Progress</span>
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {courseProgress.overall}% overall
                </span>
              </div>

              <div className="space-y-5">
                {courseProgress.courses.map((course, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">
                        {course.name}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {course.progress}%
                      </span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={cn("h-full rounded-full transition-all", course.color)}
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <Button variant="ghost" className="w-full mt-6 text-muted-foreground">
                View all courses
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Notifications */}
            <div
              className="bg-card rounded-2xl border border-border/50 shadow-card p-6 opacity-0 animate-fade-in"
              style={{ animationDelay: "250ms" }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Bell className="w-4 h-4" />
                  <span className="text-sm font-medium">Notifications</span>
                </div>
                <span className="text-xs text-primary font-medium">
                  {notifications.filter((n) => n.unread).length} new
                </span>
              </div>

              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-3 rounded-xl transition-colors cursor-pointer hover:bg-accent/50",
                      notification.unread && "bg-accent/30"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      {notification.unread && (
                        <span className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                      )}
                      <div className={cn(!notification.unread && "ml-5")}>
                        <p className="text-sm text-foreground">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button variant="ghost" className="w-full mt-4 text-muted-foreground">
                View all notifications
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

            {/* Motivation card */}
            <div
              className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-primary/20 p-6 opacity-0 animate-fade-in"
              style={{ animationDelay: "300ms" }}
            >
              <div className="flex items-center gap-2 text-primary mb-3">
                <Star className="w-5 h-5 fill-primary" />
                <span className="text-sm font-medium">Keep it up!</span>
              </div>
              <p className="text-foreground font-medium">
                You're making great progress this week.
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Complete 2 more lessons to earn your next badge.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
