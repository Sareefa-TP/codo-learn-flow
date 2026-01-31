import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  ListTodo, 
  TrendingUp, 
  UserCheck, 
  Clock,
  CheckCircle2,
  Circle,
  DollarSign,
  Award,
} from "lucide-react";

const InternDashboard = () => {
  const stats = {
    tasksCompleted: 12,
    totalTasks: 18,
    attendance: 94,
    overallProgress: 72,
  };

  const currentTasks = [
    { id: 1, title: "Complete UI mockups for dashboard", status: "in-progress", priority: "high", dueDate: "Today" },
    { id: 2, title: "Review design system documentation", status: "pending", priority: "medium", dueDate: "Tomorrow" },
    { id: 3, title: "Prepare weekly progress report", status: "pending", priority: "low", dueDate: "Feb 2" },
  ];

  const milestones = [
    { name: "Onboarding Complete", completed: true },
    { name: "First Project Delivered", completed: true },
    { name: "Mid-Internship Review", completed: false },
    { name: "Final Presentation", completed: false },
  ];

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-semibold text-foreground tracking-tight">
            Welcome back, Alex! 💼
          </h1>
          <p className="text-muted-foreground mt-2">
            You're doing great! Keep building those skills.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-role-intern/10 flex items-center justify-center">
                      <ListTodo className="w-5 h-5 text-role-intern" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold">{stats.tasksCompleted}/{stats.totalTasks}</p>
                      <p className="text-xs text-muted-foreground">Tasks Done</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

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
                    <div className="w-10 h-10 rounded-xl bg-role-tutor/10 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-role-tutor" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold">{stats.overallProgress}%</p>
                      <p className="text-xs text-muted-foreground">Progress</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-role-mentor/10 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-role-mentor" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold">$850</p>
                      <p className="text-xs text-muted-foreground">This Month</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Current Tasks */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ListTodo className="w-5 h-5 text-primary" />
                    Current Tasks
                  </CardTitle>
                  <Button variant="outline" size="sm">View All</Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {currentTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-muted/30 transition-colors"
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      task.status === "in-progress" 
                        ? "border-role-intern bg-role-intern/10" 
                        : "border-muted-foreground/30"
                    }`}>
                      {task.status === "in-progress" && (
                        <div className="w-2 h-2 rounded-full bg-role-intern" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{task.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{task.dueDate}</span>
                      </div>
                    </div>
                    <Badge 
                      variant="secondary"
                      className={
                        task.priority === "high" 
                          ? "bg-red-500/10 text-red-600" 
                          : task.priority === "medium"
                          ? "bg-amber-500/10 text-amber-600"
                          : "bg-muted text-muted-foreground"
                      }
                    >
                      {task.priority}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Overall Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Internship Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Overall Completion</span>
                    <span className="text-sm text-muted-foreground">{stats.overallProgress}%</span>
                  </div>
                  <Progress value={stats.overallProgress} className="h-3" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Milestones */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Milestones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {milestones.map((milestone, index) => (
                  <div key={milestone.name} className="flex items-center gap-3">
                    {milestone.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground/40 shrink-0" />
                    )}
                    <span className={`text-sm ${milestone.completed ? "text-foreground" : "text-muted-foreground"}`}>
                      {milestone.name}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Stipend Summary */}
            <Card className="border-role-intern/20 bg-gradient-to-br from-role-intern/5 to-transparent">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-role-intern" />
                  Stipend Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">This Month</span>
                    <span className="font-semibold text-foreground">$850</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Earned</span>
                    <span className="font-semibold text-foreground">$2,550</span>
                  </div>
                  <div className="pt-2 border-t">
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InternDashboard;
