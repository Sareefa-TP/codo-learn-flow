import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  Briefcase, 
  TrendingUp, 
  Calendar, 
  Clock,
  MessageSquare,
  ChevronRight,
  Star,
  FileText,
} from "lucide-react";

const MentorDashboard = () => {
  // Demo data with Indian names
  const stats = {
    totalStudents: 24,
    totalInterns: 8,
    pendingReviews: 5,
    upcomingMeetings: 3,
  };

  const assignedStudents = [
    { id: 1, name: "Ananya Sharma", course: "UX Design", progress: 78, avatar: "" },
    { id: 2, name: "Rohan Mehta", course: "Full Stack Dev", progress: 65, avatar: "" },
    { id: 3, name: "Priya Patel", course: "Data Science", progress: 92, avatar: "" },
    { id: 4, name: "Karthik Iyer", course: "UI Development", progress: 54, avatar: "" },
  ];

  const assignedInterns = [
    { id: 1, name: "Deepak Kumar", task: "Dashboard Redesign", daysLeft: 3, status: "on-track" },
    { id: 2, name: "Sneha Reddy", task: "API Integration", daysLeft: 1, status: "at-risk" },
    { id: 3, name: "Vikram Singh", task: "Testing Module", daysLeft: 5, status: "ahead" },
  ];

  const upcomingMeetings = [
    { id: 1, title: "1:1 with Ananya", time: "Today, 2:00 PM", type: "student" },
    { id: 2, title: "Intern Review - Deepak", time: "Today, 4:30 PM", type: "intern" },
    { id: 3, title: "Group Progress Call", time: "Tomorrow, 10:00 AM", type: "group" },
  ];

  const recentNotes = [
    { id: 1, student: "Priya Patel", note: "Excellent progress on ML project. Ready for advanced topics.", date: "2 hours ago" },
    { id: 2, student: "Rohan Mehta", note: "Needs additional support with React hooks concepts.", date: "Yesterday" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on-track": return "bg-emerald-100 text-emerald-700";
      case "at-risk": return "bg-warning-muted text-warning";
      case "ahead": return "bg-primary/10 text-primary";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="opacity-0 animate-fade-in">
          <h1 className="text-2xl font-semibold text-foreground">Good morning, Mentor! 👋</h1>
          <p className="text-muted-foreground mt-1">Here's an overview of your mentees and upcoming activities.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <Card className="bg-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Assigned Students</p>
                  <p className="text-2xl font-semibold mt-1">{stats.totalStudents}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-role-student/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-role-student" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Assigned Interns</p>
                  <p className="text-2xl font-semibold mt-1">{stats.totalInterns}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-role-intern/10 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-role-intern" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Reviews</p>
                  <p className="text-2xl font-semibold mt-1">{stats.pendingReviews}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Upcoming Meetings</p>
                  <p className="text-2xl font-semibold mt-1">{stats.upcomingMeetings}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Students Overview */}
          <Card className="lg:col-span-2 opacity-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Student Progress</CardTitle>
                <CardDescription>Track learning progress of your assigned students</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-primary">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assignedStudents.map((student) => (
                  <div key={student.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={student.avatar} />
                      <AvatarFallback className="bg-role-student/10 text-role-student">
                        {student.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-sm truncate">{student.name}</p>
                        <span className="text-sm text-muted-foreground">{student.progress}%</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress value={student.progress} className="h-2 flex-1" />
                        <Badge variant="secondary" className="text-xs">{student.course}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Meetings */}
          <Card className="opacity-0 animate-fade-in" style={{ animationDelay: "250ms" }}>
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Meetings</CardTitle>
              <CardDescription>Your scheduled sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingMeetings.map((meeting) => (
                  <div key={meeting.id} className="p-3 rounded-lg border border-border/50 hover:border-primary/30 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{meeting.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{meeting.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                View Calendar
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Intern Tasks */}
          <Card className="opacity-0 animate-fade-in" style={{ animationDelay: "300ms" }}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Intern Task Status</CardTitle>
                <CardDescription>Current assignments and deadlines</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-primary">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {assignedInterns.map((intern) => (
                  <div key={intern.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-9 h-9">
                        <AvatarFallback className="bg-role-intern/10 text-role-intern text-sm">
                          {intern.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{intern.name}</p>
                        <p className="text-xs text-muted-foreground">{intern.task}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(intern.status)}>
                        {intern.daysLeft}d left
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Notes */}
          <Card className="opacity-0 animate-fade-in" style={{ animationDelay: "350ms" }}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Recent Guidance Notes</CardTitle>
                <CardDescription>Your latest mentee observations</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-primary">
                Add Note <MessageSquare className="w-4 h-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentNotes.map((note) => (
                  <div key={note.id} className="p-3 rounded-lg border border-border/50">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-sm">{note.student}</p>
                      <span className="text-xs text-muted-foreground">{note.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{note.note}</p>
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

export default MentorDashboard;
