import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Award, 
  Bell,
  TrendingUp,
  BookOpen,
  Star,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import CircularProgress from "@/components/CircularProgress";
import CertificateRoadmap from "@/components/student/CertificateRoadmap";
import NextClassCard from "@/components/student/NextClassCard";

// Mock state data
const mockState = {
  attendance: 94,
  balance: 0,
  nextClass: "Today 4:30PM",
  progress: 68,
};

const StudentDashboard = () => {
  // Student profile
  const student = {
    name: "Alex Rivera",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    badge: "Pro Student",
  };

  // Next class info
  const nextClass = {
    subject: "Advanced React Hooks",
    tutor: "Sarah Jenkins",
    tutorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    time: "4:30 PM",
    timeLabel: "Today",
    meetLink: "https://meet.google.com/abc-defg-hij",
  };

  // Certificate roadmap
  const certMilestones = [
    { id: "1", title: "React Fundamentals", status: "completed" as const },
    { id: "2", title: "Component Patterns", status: "completed" as const },
    { id: "3", title: "State Management", status: "completed" as const },
    { id: "4", title: "UI/UX Expert", status: "current" as const, progress: 80 },
    { id: "5", title: "Full Stack Developer", status: "upcoming" as const },
  ];

  // Course progress breakdown
  const courseProgress = [
    { name: "Advanced React Hooks", progress: 75, lessons: 12 },
    { name: "TypeScript Mastery", progress: 60, lessons: 8 },
    { name: "UI/UX Design Principles", progress: 85, lessons: 15 },
    { name: "Node.js Backend", progress: 40, lessons: 6 },
  ];

  // Notifications
  const notifications = [
    { id: 1, message: "New assignment posted: Build a Todo App with React Hooks", type: "info", unread: true },
    { id: 2, message: "Your attendance this month is excellent! Top 5% of your batch.", type: "success", unread: true },
  ];

  // Achievements
  const achievements = [
    { id: 1, title: "Perfect Week", icon: Star, earned: true },
    { id: 2, title: "Quick Learner", icon: Sparkles, earned: true },
    { id: 3, title: "Team Player", icon: Trophy, earned: false },
  ];

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6 lg:space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img 
              src={student.avatar} 
              alt={student.name}
              className="w-14 h-14 rounded-full border-2 border-primary/20"
            />
            <div>
              <h1 className="text-2xl lg:text-3xl font-semibold text-foreground tracking-tight">
                Welcome back, {student.name.split(' ')[0]}! 👋
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  <Star className="w-3 h-3 mr-1" />
                  {student.badge}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  You're making great progress. Keep up the momentum!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Hero: Next Class Card */}
        <NextClassCard 
          subject={nextClass.subject}
          tutor={nextClass.tutor}
          tutorAvatar={nextClass.tutorAvatar}
          time={nextClass.time}
          timeLabel={nextClass.timeLabel}
          meetLink={nextClass.meetLink}
        />

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Attendance Gauge */}
          <Card className="transition-all hover:shadow-hover hover:-translate-y-0.5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Attendance</p>
                  <p className="text-xs text-primary font-medium">🏆 Top 5% Student!</p>
                </div>
                <CircularProgress 
                  value={mockState.attendance} 
                  size={100} 
                  strokeWidth={8}
                  color="stroke-primary"
                >
                  <span className="text-2xl font-bold text-foreground">{mockState.attendance}%</span>
                </CircularProgress>
              </div>
            </CardContent>
          </Card>

          {/* Course Progress */}
          <Card className="transition-all hover:shadow-hover hover:-translate-y-0.5">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Course Progress</p>
                    <p className="text-2xl font-bold text-foreground">{mockState.progress}%</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-role-intern/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-role-intern" />
                  </div>
                </div>
                <Progress value={mockState.progress} className="h-2" />
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  12 lessons until your next certificate
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Certificate Status */}
          <Card className="transition-all hover:shadow-hover hover:-translate-y-0.5">
            <CardContent className="p-6">
              <CertificateRoadmap 
                title="UI/UX Expert" 
                milestones={certMilestones}
              />
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Course Breakdown */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Course Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {courseProgress.map((course) => (
                  <div key={course.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">
                        {course.name}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {course.progress}% • {course.lessons} lessons left
                      </span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Achievements */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                        achievement.earned
                          ? "bg-primary/10 border-primary/20 text-foreground"
                          : "bg-muted/50 border-muted text-muted-foreground"
                      }`}
                    >
                      <achievement.icon className={`w-4 h-4 ${achievement.earned ? "text-primary" : ""}`} />
                      <span className="text-sm font-medium">{achievement.title}</span>
                      {achievement.earned && <span className="text-xs">✓</span>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Notifications & Certificates */}
          <div className="space-y-6">
            {/* Notifications */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  Notifications
                  <Badge variant="destructive" className="ml-auto text-xs">
                    2 new
                  </Badge>
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
              </CardContent>
            </Card>

            {/* Certificates Earned */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Certificates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Award className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">React Fundamentals</p>
                    <p className="text-xs text-muted-foreground">Earned Jan 2026</p>
                  </div>
                  <Badge className="bg-primary/10 text-primary">Earned</Badge>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Award className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">JavaScript Expert</p>
                    <p className="text-xs text-muted-foreground">Earned Dec 2025</p>
                  </div>
                  <Badge className="bg-primary/10 text-primary">Earned</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
