import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search, Filter, MessageSquare, TrendingUp, ChevronRight } from "lucide-react";

const MentorStudents = () => {
  const students = [
    { id: 1, name: "Ananya Sharma", email: "ananya.sharma@email.com", course: "UX Design Fundamentals", progress: 78, attendance: 92, lastActive: "2 hours ago", status: "active" },
    { id: 2, name: "Rohan Mehta", email: "rohan.mehta@email.com", course: "Full Stack Development", progress: 65, attendance: 85, lastActive: "1 day ago", status: "active" },
    { id: 3, name: "Priya Patel", email: "priya.patel@email.com", course: "Data Science", progress: 92, attendance: 98, lastActive: "30 mins ago", status: "active" },
    { id: 4, name: "Karthik Iyer", email: "karthik.iyer@email.com", course: "UI Development", progress: 54, attendance: 76, lastActive: "3 days ago", status: "needs-attention" },
    { id: 5, name: "Meera Nair", email: "meera.nair@email.com", course: "Product Management", progress: 88, attendance: 94, lastActive: "5 hours ago", status: "active" },
    { id: 6, name: "Arjun Reddy", email: "arjun.reddy@email.com", course: "Digital Marketing", progress: 71, attendance: 88, lastActive: "Yesterday", status: "active" },
  ];

  const getStatusBadge = (status: string) => {
    if (status === "needs-attention") {
      return <Badge className="bg-warning-muted text-warning">Needs Attention</Badge>;
    }
    return <Badge className="bg-emerald-100 text-emerald-700">On Track</Badge>;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Students</h1>
            <p className="text-muted-foreground mt-1">Monitor and support your assigned students</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search students..." className="pl-9 w-64" />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {students.map((student, index) => (
            <Card 
              key={student.id} 
              className="hover:shadow-md transition-shadow opacity-0 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-role-student/10 text-role-student font-medium">
                        {student.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{student.name}</h3>
                      <p className="text-xs text-muted-foreground">{student.course}</p>
                    </div>
                  </div>
                  {getStatusBadge(student.status)}
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">Course Progress</span>
                      <span className="text-xs font-medium">{student.progress}%</span>
                    </div>
                    <Progress value={student.progress} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Attendance</span>
                    <span className="font-medium">{student.attendance}%</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Last Active</span>
                    <span className="text-xs">{student.lastActive}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/50">
                  <Button variant="outline" size="sm" className="flex-1">
                    <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                    Message
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1">
                    <TrendingUp className="w-3.5 h-3.5 mr-1.5" />
                    Progress
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MentorStudents;
