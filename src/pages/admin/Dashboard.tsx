import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Briefcase, 
  BookOpen,
  GraduationCap,
  TrendingUp, 
  AlertCircle,
  ChevronRight,
  Calendar,
  DollarSign,
  UserCheck,
} from "lucide-react";

const AdminDashboard = () => {
  const stats = {
    totalStudents: 487,
    activeInterns: 42,
    totalTutors: 28,
    totalMentors: 15,
    activeCourses: 24,
    todayAttendance: 89,
  };

  const recentAlerts = [
    { id: 1, type: "warning", message: "5 students have attendance below 75%", time: "10 mins ago" },
    { id: 2, type: "info", message: "New tutor application from Priya Sharma", time: "1 hour ago" },
    { id: 3, type: "warning", message: "3 interns have pending task submissions", time: "2 hours ago" },
    { id: 4, type: "success", message: "Monthly salary processing completed", time: "5 hours ago" },
  ];

  const upcomingClasses = [
    { id: 1, name: "UX Design Fundamentals", tutor: "Arun Krishnan", time: "10:00 AM", students: 32 },
    { id: 2, name: "React Advanced Patterns", tutor: "Meera Nair", time: "11:30 AM", students: 28 },
    { id: 3, name: "Data Science Basics", tutor: "Rajesh Iyer", time: "2:00 PM", students: 45 },
  ];

  const performanceMetrics = [
    { label: "Student Satisfaction", value: 92, trend: "+3%" },
    { label: "Course Completion Rate", value: 78, trend: "+5%" },
    { label: "Average Assessment Score", value: 85, trend: "+2%" },
  ];

  const financeSummary = {
    monthlyRevenue: "₹24,50,000",
    pendingFees: "₹3,20,000",
    salaryDue: "₹8,75,000",
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertCircle className="w-4 h-4 text-warning" />;
      case "success":
        return <UserCheck className="w-4 h-4 text-emerald-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="opacity-0 animate-fade-in">
          <h1 className="text-2xl font-semibold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of daily operations and key metrics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <Card className="bg-card border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-role-student/10 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-role-student" />
                </div>
                <div>
                  <p className="text-2xl font-semibold">{stats.totalStudents}</p>
                  <p className="text-xs text-muted-foreground">Students</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-role-intern/10 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-role-intern" />
                </div>
                <div>
                  <p className="text-2xl font-semibold">{stats.activeInterns}</p>
                  <p className="text-xs text-muted-foreground">Interns</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-role-tutor/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-role-tutor" />
                </div>
                <div>
                  <p className="text-2xl font-semibold">{stats.totalTutors}</p>
                  <p className="text-xs text-muted-foreground">Tutors</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-role-mentor/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-role-mentor" />
                </div>
                <div>
                  <p className="text-2xl font-semibold">{stats.totalMentors}</p>
                  <p className="text-xs text-muted-foreground">Mentors</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-semibold">{stats.activeCourses}</p>
                  <p className="text-xs text-muted-foreground">Courses</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-semibold">{stats.todayAttendance}%</p>
                  <p className="text-xs text-muted-foreground">Attendance</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Alerts */}
          <Card className="lg:col-span-2 opacity-0 animate-fade-in" style={{ animationDelay: "150ms" }}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Recent Alerts</CardTitle>
                <CardDescription>Important updates requiring attention</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-primary">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <p className="text-sm">{alert.message}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Finance Summary */}
          <Card className="opacity-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
            <CardHeader>
              <CardTitle className="text-lg">Finance Overview</CardTitle>
              <CardDescription>This month's summary</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/20">
                <p className="text-xs text-muted-foreground mb-1">Monthly Revenue</p>
                <p className="text-xl font-semibold text-emerald-700 dark:text-emerald-400">{financeSummary.monthlyRevenue}</p>
              </div>
              <div className="flex gap-3">
                <div className="flex-1 p-3 rounded-lg bg-warning-muted">
                  <p className="text-xs text-muted-foreground mb-1">Pending Fees</p>
                  <p className="text-sm font-semibold text-warning">{financeSummary.pendingFees}</p>
                </div>
                <div className="flex-1 p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Salary Due</p>
                  <p className="text-sm font-semibold">{financeSummary.salaryDue}</p>
                </div>
              </div>
              <Button variant="outline" className="w-full" size="sm">
                <DollarSign className="w-4 h-4 mr-2" />
                View Full Report
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Classes */}
          <Card className="opacity-0 animate-fade-in" style={{ animationDelay: "250ms" }}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Today's Classes</CardTitle>
                <CardDescription>Upcoming sessions scheduled for today</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-primary">
                View Schedule <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingClasses.map((cls) => (
                  <div key={cls.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{cls.name}</p>
                        <p className="text-xs text-muted-foreground">{cls.tutor}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{cls.time}</p>
                      <p className="text-xs text-muted-foreground">{cls.students} students</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card className="opacity-0 animate-fade-in" style={{ animationDelay: "300ms" }}>
            <CardHeader>
              <CardTitle className="text-lg">Performance Metrics</CardTitle>
              <CardDescription>Key performance indicators this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {performanceMetrics.map((metric, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{metric.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{metric.value}%</span>
                        <Badge variant="secondary" className="text-xs text-emerald-600">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {metric.trend}
                        </Badge>
                      </div>
                    </div>
                    <Progress value={metric.value} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
