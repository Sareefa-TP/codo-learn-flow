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

const CoordinatorProgress = () => {
  const chartData = mentees.map((m) => ({
    name: m.name.split(" ")[0],
    progress: m.progress,
    attendance: m.attendance,
  }));

  return (
    <div className="animate-fade-in space-y-6 max-w-6xl mx-auto px-4 md:px-6 lg:px-8 pb-10">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">Progress Reports</h1>
        <p className="text-muted-foreground mt-1 text-sm">View and compare intern progress and attendance</p>
      </div>

      {/* Chart */}
      <Card className="border-border/50 shadow-sm rounded-xl overflow-hidden">
        <CardHeader className="pb-2 bg-muted/20 border-b">
          <CardTitle className="text-base font-semibold">Progress vs Attendance</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12, fontWeight: 500 }} 
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12, fontWeight: 500 }} 
                  domain={[0, 100]} 
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: 'hsl(var(--muted)/0.2)' }}
                  contentStyle={{
                    borderRadius: "1rem",
                    border: "1px solid hsl(var(--border))",
                    background: "hsl(var(--card))",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                />
                <Bar dataKey="progress" name="Progress" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={32} />
                <Bar dataKey="attendance" name="Attendance" fill="hsl(var(--role-intern))" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Heatmap */}
      <Card className="border-border/50 shadow-sm rounded-xl overflow-hidden">
        <CardHeader className="pb-2 bg-muted/20 border-b">
          <CardTitle className="text-base font-semibold">Weekly Attendance Heatmap</CardTitle>
          <p className="text-xs text-muted-foreground font-medium mt-1">Last 5 weeks · Values represent attendance percentage per week</p>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Header */}
            <div className="grid grid-cols-[200px_repeat(5,1fr)_80px] gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2">
              <span>Intern</span>
              {["W1", "W2", "W3", "W4", "W5"].map((w) => <span key={w} className="text-center">{w}</span>)}
              <span className="text-center">Avg</span>
            </div>
            <div className="space-y-2">
              {attendanceRecords.map((record) => {
                const mentee = mentees.find((m) => m.id === record.menteeId);
                return (
                  <div key={record.menteeId} className="grid grid-cols-[200px_repeat(5,1fr)_80px] gap-3 items-center p-2 rounded-xl hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8 rounded-lg border border-border/50">
                        <AvatarFallback className={`text-[10px] font-bold ${record.type === "intern" ? "bg-role-intern/10 text-role-intern" : "bg-primary/10 text-primary"}`}>
                          {record.menteeName.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate text-foreground">{record.menteeName}</p>
                        <Badge variant="outline" className="text-[9px] h-4 font-bold border-border/40 uppercase tracking-tighter">
                          {record.type}
                        </Badge>
                      </div>
                    </div>
                    {record.weekly.map((val, i) => {
                      const style = val >= 90 
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" 
                        : val >= 70 
                          ? "bg-amber-500/10 text-amber-600 border-amber-500/20" 
                          : "bg-rose-500/10 text-rose-600 border-rose-500/20";
                      return (
                        <div key={i} className={`text-center text-xs font-bold py-2.5 rounded-lg border flex items-center justify-center ${style}`}>
                          {val}%
                        </div>
                      );
                    })}
                    <div className="flex justify-center">
                      <Badge variant="secondary" className={`border-0 font-bold px-2.5 py-1 rounded-lg ${record.monthlyAvg >= 85 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : record.monthlyAvg >= 75 ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"}`}>
                        {record.monthlyAvg}%
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {mentees.map((mentee) => (
          <Card key={mentee.id} className="border-border/50 shadow-sm rounded-xl hover:shadow-md transition-all duration-300 group overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="w-10 h-10 rounded-xl border border-border/50 group-hover:scale-110 transition-transform duration-300">
                  <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                    {mentee.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-bold truncate group-hover:text-primary transition-colors">{mentee.name}</p>
                  <p className="text-[10px] text-muted-foreground font-medium truncate uppercase tracking-wider">{mentee.course}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-bold uppercase tracking-tight">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="text-primary">{mentee.progress}%</span>
                  </div>
                  <Progress value={mentee.progress} className="h-1.5 bg-primary/10" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-bold uppercase tracking-tight">
                    <span className="text-muted-foreground">Attendance</span>
                    <span className="text-role-intern">{mentee.attendance}%</span>
                  </div>
                  <Progress value={mentee.attendance} className="h-1.5 bg-role-intern/10" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CoordinatorProgress;
