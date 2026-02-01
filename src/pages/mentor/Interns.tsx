import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search, Filter, MessageSquare, FileText, Clock } from "lucide-react";

const MentorInterns = () => {
  const interns = [
    { id: 1, name: "Deepak Kumar", email: "deepak.kumar@email.com", department: "Design", task: "Dashboard Redesign", progress: 75, daysLeft: 3, status: "on-track", stipend: "₹15,000" },
    { id: 2, name: "Sneha Reddy", email: "sneha.reddy@email.com", department: "Development", task: "API Integration", progress: 45, daysLeft: 1, status: "at-risk", stipend: "₹18,000" },
    { id: 3, name: "Vikram Singh", email: "vikram.singh@email.com", department: "QA", task: "Testing Module", progress: 90, daysLeft: 5, status: "ahead", stipend: "₹12,000" },
    { id: 4, name: "Kavitha Menon", email: "kavitha.menon@email.com", department: "Development", task: "Mobile App Feature", progress: 60, daysLeft: 7, status: "on-track", stipend: "₹18,000" },
    { id: 5, name: "Rahul Joshi", email: "rahul.joshi@email.com", department: "Design", task: "Brand Guidelines", progress: 85, daysLeft: 2, status: "on-track", stipend: "₹15,000" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "on-track":
        return <Badge className="bg-emerald-100 text-emerald-700">On Track</Badge>;
      case "at-risk":
        return <Badge className="bg-warning-muted text-warning">At Risk</Badge>;
      case "ahead":
        return <Badge className="bg-primary/10 text-primary">Ahead</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Interns</h1>
            <p className="text-muted-foreground mt-1">Guide and review your assigned interns</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search interns..." className="pl-9 w-64" />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {interns.map((intern, index) => (
            <Card 
              key={intern.id} 
              className="hover:shadow-md transition-shadow opacity-0 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-role-intern/10 text-role-intern font-medium">
                        {intern.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{intern.name}</h3>
                      <p className="text-xs text-muted-foreground">{intern.department}</p>
                    </div>
                  </div>
                  {getStatusBadge(intern.status)}
                </div>

                <div className="p-3 rounded-lg bg-muted/50 mb-4">
                  <p className="text-xs text-muted-foreground mb-1">Current Task</p>
                  <p className="text-sm font-medium">{intern.task}</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">Task Progress</span>
                      <span className="text-xs font-medium">{intern.progress}%</span>
                    </div>
                    <Progress value={intern.progress} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Days Left
                    </span>
                    <span className={`font-medium ${intern.daysLeft <= 2 ? "text-warning" : ""}`}>
                      {intern.daysLeft} days
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Stipend</span>
                    <span className="font-medium">{intern.stipend}/mo</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/50">
                  <Button variant="outline" size="sm" className="flex-1">
                    <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                    Message
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1">
                    <FileText className="w-3.5 h-3.5 mr-1.5" />
                    Review
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

export default MentorInterns;
