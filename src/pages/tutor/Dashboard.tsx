import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Users, 
  Video, 
  Clock,
  Calendar,
  FileText,
  BarChart3,
  DollarSign,
} from "lucide-react";

const TutorDashboard = () => {
  const stats = {
    totalStudents: 48,
    classesToday: 3,
    materialsUploaded: 24,
    avgRating: 4.8,
  };

  const todaysClasses = [
    { id: 1, subject: "UX Design Fundamentals", time: "10:00 AM", students: 12, status: "upcoming" },
    { id: 2, subject: "UI Development", time: "2:00 PM", students: 8, status: "upcoming" },
    { id: 3, subject: "Design Systems", time: "4:30 PM", students: 15, status: "upcoming" },
  ];

  const recentEvaluations = [
    { student: "Emma Wilson", assignment: "Mobile App Mockup", score: 92, date: "Today" },
    { student: "James Chen", assignment: "Wireframe Exercise", score: 88, date: "Yesterday" },
    { student: "Sofia Garcia", assignment: "User Flow Diagram", score: 95, date: "Yesterday" },
  ];

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-semibold text-foreground tracking-tight">
            Good morning, Sarah! 📚
          </h1>
          <p className="text-muted-foreground mt-2">
            You have {stats.classesToday} classes scheduled for today.
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
                    <div className="w-10 h-10 rounded-xl bg-role-tutor/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-role-tutor" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold">{stats.totalStudents}</p>
                      <p className="text-xs text-muted-foreground">Students</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-role-student/10 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-role-student" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold">{stats.classesToday}</p>
                      <p className="text-xs text-muted-foreground">Today</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-role-intern/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-role-intern" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold">{stats.materialsUploaded}</p>
                      <p className="text-xs text-muted-foreground">Materials</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-role-mentor/10 flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-role-mentor" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold">{stats.avgRating}</p>
                      <p className="text-xs text-muted-foreground">Rating</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Today's Classes */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Today's Classes
                  </CardTitle>
                  <Button variant="outline" size="sm">View Schedule</Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {todaysClasses.map((classItem) => (
                  <div
                    key={classItem.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-role-tutor/10 flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-role-tutor" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{classItem.subject}</p>
                        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {classItem.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {classItem.students} students
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" className="gap-2">
                      <Video className="w-4 h-4" />
                      Start Class
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Evaluations */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    Recent Evaluations
                  </CardTitle>
                  <Button variant="outline" size="sm">View All</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentEvaluations.map((evaluation, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div>
                        <p className="font-medium text-foreground">{evaluation.student}</p>
                        <p className="text-sm text-muted-foreground">{evaluation.assignment}</p>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant="secondary"
                          className={
                            evaluation.score >= 90 
                              ? "bg-green-500/10 text-green-600" 
                              : "bg-amber-500/10 text-amber-600"
                          }
                        >
                          {evaluation.score}%
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">{evaluation.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <FileText className="w-4 h-4" />
                  Upload Material
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <BookOpen className="w-4 h-4" />
                  Create Assignment
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Grade Submissions
                </Button>
              </CardContent>
            </Card>

            {/* Salary Summary */}
            <Card className="border-role-tutor/20 bg-gradient-to-br from-role-tutor/5 to-transparent">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-role-tutor" />
                  Salary Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">This Month</span>
                    <span className="font-semibold text-foreground">$3,200</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Classes Taken</span>
                    <span className="font-semibold text-foreground">28</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Bonus</span>
                    <span className="font-semibold text-green-600">+$150</span>
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

export default TutorDashboard;
