import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Users, GraduationCap, Layers, Activity, UserPlus, MessageSquare } from "lucide-react";

const CoordinatorDashboard = () => {
  const summaryCards = [
    { title: "Total Students", value: "450", icon: GraduationCap, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Total Tutors", value: "24", icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
    { title: "Total Batches", value: "12", icon: Layers, color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  const recentActivities = [
    { id: 1, type: "enrollment", text: "New student enrolled in Full Stack Batch A", date: "2 mins ago", icon: UserPlus },
    { id: 2, type: "feedback", text: "New feedback received from Tutor Sarah", date: "1 hour ago", icon: MessageSquare },
    { id: 3, type: "batch", text: "Batch B schedule updated by Admin", date: "3 hours ago", icon: Activity },
  ];

  return (
    <div className="animate-fade-in space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Welcome back, Coordinator 👋
        </h1>
        <p className="text-muted-foreground">
          Manage and monitor overall activities
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {summaryCards.map((card, index) => (
          <Card key={index} className="border-border/50 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">{card.title}</p>
                  <h3 className="text-2xl font-bold">{card.value}</h3>
                </div>
                <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center`}>
                  <card.icon className={`w-6 h-6 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Quick Overview
            </h2>
            <div className="space-y-6">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <activity.icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{activity.text}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm bg-primary/5 border-primary/10">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full min-h-[200px]">
             <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                <Activity className="w-6 h-6" />
             </div>
             <h3 className="font-bold text-lg mb-2">More updates coming soon</h3>
             <p className="text-sm text-muted-foreground max-w-[250px]">
                We are building more insight cards to help you manage operations better.
             </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CoordinatorDashboard;
