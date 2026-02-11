import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { attendanceRecords, mentees } from "@/data/mentorData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const MentorProgress = () => {
  const chartData = mentees.map((m) => ({
    name: m.name.split(" ")[0],
    progress: m.progress,
    attendance: m.attendance,
  }));

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-semibold text-foreground tracking-tight">Progress Reports</h1>
          <p className="text-muted-foreground mt-1">View and compare mentee progress and attendance</p>
        </div>

        {/* Chart */}
        <Card className="border border-border/60 shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Progress vs Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "0.75rem",
                      border: "1px solid hsl(var(--border))",
                      background: "hsl(var(--card))",
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="progress" name="Progress" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="attendance" name="Attendance" fill="hsl(var(--role-intern))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Heatmap */}
        <Card className="border border-border/60 shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Weekly Attendance Heatmap</CardTitle>
            <p className="text-xs text-muted-foreground">Last 5 weeks · Values represent attendance percentage per week</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Header */}
              <div className="grid grid-cols-[200px_repeat(5,1fr)_80px] gap-2 text-xs font-medium text-muted-foreground">
                <span>Mentee</span>
                {["W1", "W2", "W3", "W4", "W5"].map((w) => <span key={w} className="text-center">{w}</span>)}
                <span className="text-center">Avg</span>
              </div>
              {attendanceRecords.map((record) => {
                const mentee = mentees.find((m) => m.id === record.menteeId);
                return (
                  <div key={record.menteeId} className="grid grid-cols-[200px_repeat(5,1fr)_80px] gap-2 items-center">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-7 h-7">
                        <AvatarFallback className={`text-[10px] ${record.type === "intern" ? "bg-role-intern/10 text-role-intern" : "bg-primary/10 text-primary"}`}>
                          {record.menteeName.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium truncate">{record.menteeName}</p>
                        <Badge variant="outline" className="text-[9px] h-4">{record.type}</Badge>
                      </div>
                    </div>
                    {record.weekly.map((val, i) => {
                      const bg = val >= 90 ? "bg-primary/20 text-primary" : val >= 70 ? "bg-warning/15 text-warning" : "bg-destructive/15 text-destructive";
                      return (
                        <div key={i} className={`text-center text-xs font-medium py-2 rounded-lg ${bg}`}>
                          {val}%
                        </div>
                      );
                    })}
                    <div className="text-center">
                      <Badge variant="secondary" className={`border-0 ${record.monthlyAvg >= 85 ? "bg-primary/10 text-primary" : record.monthlyAvg >= 75 ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"}`}>
                        {record.monthlyAvg}%
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Individual Progress Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {mentees.map((mentee) => (
            <Card key={mentee.id} className="border border-border/60 shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                      {mentee.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{mentee.name}</p>
                    <p className="text-[10px] text-muted-foreground">{mentee.course}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Progress</span>
                      <span>{mentee.progress}%</span>
                    </div>
                    <Progress value={mentee.progress} className="h-1.5" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Attendance</span>
                      <span>{mentee.attendance}%</span>
                    </div>
                    <Progress value={mentee.attendance} className="h-1.5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MentorProgress;
