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
  ChevronRight,
  DollarSign,
  Server,
  Shield,
  Activity,
  Zap,
  Database,
  Globe,
} from "lucide-react";

const SuperAdminDashboard = () => {
  const platformStats = {
    totalUsers: 572,
    activeToday: 342,
    totalCourses: 48,
    totalRevenue: "₹1.2 Cr",
  };

  const userBreakdown = [
    { role: "Students", count: 487, icon: GraduationCap, color: "bg-role-student" },
    { role: "Interns", count: 42, icon: Briefcase, color: "bg-role-intern" },
    { role: "Tutors", count: 28, icon: BookOpen, color: "bg-role-tutor" },
    { role: "Mentors", count: 15, icon: Users, color: "bg-role-mentor" },
  ];

  const systemHealth = [
    { service: "Authentication", status: "operational", uptime: "99.9%" },
    { service: "Database", status: "operational", uptime: "99.8%" },
    { service: "Video Streaming", status: "operational", uptime: "99.5%" },
    { service: "Payment Gateway", status: "operational", uptime: "100%" },
  ];

  const recentActivity = [
    { action: "New student enrolled", user: "Ananya Sharma", time: "5 mins ago" },
    { action: "Course published", user: "Admin Team", time: "1 hour ago" },
    { action: "Salary batch processed", user: "Finance", time: "3 hours ago" },
    { action: "System backup completed", user: "System", time: "6 hours ago" },
  ];

  const financialKPIs = [
    { label: "Monthly Recurring Revenue", value: "₹24.5L", trend: "+12%" },
    { label: "Average Revenue Per User", value: "₹4,280", trend: "+5%" },
    { label: "Collection Rate", value: "94%", trend: "+2%" },
  ];

  const integrations = [
    { name: "Google Meet", status: "connected", lastSync: "2 mins ago" },
    { name: "Google Drive", status: "connected", lastSync: "5 mins ago" },
    { name: "Razorpay", status: "connected", lastSync: "Real-time" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between opacity-0 animate-fade-in">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Platform Overview</h1>
            <p className="text-muted-foreground mt-1">Complete system control and governance</p>
          </div>
          <Badge className="bg-emerald-100 text-emerald-700 px-3 py-1">
            <Activity className="w-3 h-3 mr-1.5" />
            All Systems Operational
          </Badge>
        </div>

        {/* Platform Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-3xl font-bold mt-1">{platformStats.totalUsers}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-3 h-3 text-emerald-600" />
                    <span className="text-xs text-emerald-600">+23 this week</span>
                  </div>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
                  <Users className="w-7 h-7 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Today</p>
                  <p className="text-3xl font-bold mt-1">{platformStats.activeToday}</p>
                  <p className="text-xs text-muted-foreground mt-2">60% of total users</p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center">
                  <Zap className="w-7 h-7 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Courses</p>
                  <p className="text-3xl font-bold mt-1">{platformStats.totalCourses}</p>
                  <p className="text-xs text-muted-foreground mt-2">8 categories</p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-role-tutor/20 flex items-center justify-center">
                  <BookOpen className="w-7 h-7 text-role-tutor" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20 border-emerald-200/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue (FY)</p>
                  <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-400 mt-1">{platformStats.totalRevenue}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-3 h-3 text-emerald-600" />
                    <span className="text-xs text-emerald-600">+18% YoY</span>
                  </div>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                  <DollarSign className="w-7 h-7 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Breakdown */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 opacity-0 animate-fade-in" style={{ animationDelay: "150ms" }}>
          {userBreakdown.map((item, index) => (
            <Card key={index} className="bg-card border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${item.color}/10 flex items-center justify-center`}>
                    <item.icon className={`w-5 h-5 ${item.color.replace("bg-", "text-")}`} />
                  </div>
                  <div>
                    <p className="text-xl font-semibold">{item.count}</p>
                    <p className="text-xs text-muted-foreground">{item.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* System Health */}
          <Card className="opacity-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">System Health</CardTitle>
              </div>
              <CardDescription>Infrastructure status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {systemHealth.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-sm font-medium">{service.service}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{service.uptime}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Financial KPIs */}
          <Card className="opacity-0 animate-fade-in" style={{ animationDelay: "250ms" }}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">Financial KPIs</CardTitle>
              </div>
              <CardDescription>Key performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {financialKPIs.map((kpi, index) => (
                  <div key={index} className="p-3 rounded-lg border border-border/50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">{kpi.label}</span>
                      <Badge variant="secondary" className="text-xs text-emerald-600">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {kpi.trend}
                      </Badge>
                    </div>
                    <p className="text-lg font-semibold">{kpi.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Integrations */}
          <Card className="opacity-0 animate-fade-in" style={{ animationDelay: "300ms" }}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">Integrations</CardTitle>
              </div>
              <CardDescription>Connected services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {integrations.map((integration, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Shield className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{integration.name}</p>
                        <p className="text-xs text-muted-foreground">{integration.lastSync}</p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700 text-xs">Connected</Badge>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4" size="sm">
                Manage Integrations
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="opacity-0 animate-fade-in" style={{ animationDelay: "350ms" }}>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <CardDescription>Latest platform activities</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-primary">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="p-4 rounded-lg border border-border/50">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.user}</p>
                  <p className="text-xs text-muted-foreground mt-2">{activity.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SuperAdminDashboard;
