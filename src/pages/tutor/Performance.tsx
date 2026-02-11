import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { gradebookEntries } from "@/data/tutorData";

const TutorPerformance = () => {
  const [search, setSearch] = useState("");

  const filtered = gradebookEntries.filter((e) =>
    `${e.studentName} ${e.course}`.toLowerCase().includes(search.toLowerCase())
  );

  const getAverage = (e: typeof gradebookEntries[0]) => {
    const scores = [e.quiz1, e.quiz2, e.midterm, e.project, e.final].filter((s): s is number => s !== null);
    if (scores.length === 0) return 0;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  };

  const getPerformanceStatus = (avg: number) => {
    if (avg >= 85) return { label: "Excellent", color: "text-primary", icon: TrendingUp, bg: "bg-primary/10" };
    if (avg >= 70) return { label: "Good", color: "text-foreground", icon: Minus, bg: "bg-muted" };
    return { label: "Needs Help", color: "text-destructive", icon: TrendingDown, bg: "bg-destructive/10" };
  };

  // Course-level stats
  const courseStats = Object.entries(
    filtered.reduce((acc, e) => {
      const avg = getAverage(e);
      if (!acc[e.course]) acc[e.course] = { total: 0, sum: 0, count: 0 };
      acc[e.course].total++;
      acc[e.course].sum += avg;
      acc[e.course].count++;
      return acc;
    }, {} as Record<string, { total: number; sum: number; count: number }>)
  ).map(([course, data]) => ({ course, avgScore: Math.round(data.sum / data.count), students: data.total }));

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-semibold text-foreground tracking-tight">Student Performance</h1>
          <p className="text-muted-foreground mt-1">Track and analyze student progress across courses</p>
        </div>

        {/* Course Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {courseStats.map((cs) => (
            <Card key={cs.course} className="border border-border/60 shadow-card">
              <CardContent className="p-5">
                <p className="text-xs text-muted-foreground">{cs.course}</p>
                <p className="text-2xl font-bold mt-1">{cs.avgScore}%</p>
                <p className="text-xs text-muted-foreground">{cs.students} students</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Student Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((entry, index) => {
            const avg = getAverage(entry);
            const perf = getPerformanceStatus(avg);
            const Icon = perf.icon;

            return (
              <Card key={entry.id} className="border border-border/60 shadow-card opacity-0 animate-fade-in" style={{ animationDelay: `${index * 40}ms` }}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                          {entry.studentName.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{entry.studentName}</p>
                        <p className="text-xs text-muted-foreground">{entry.course}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className={`${perf.bg} ${perf.color} border-0 gap-1`}>
                      <Icon className="w-3 h-3" /> {perf.label}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Overall Average</span>
                        <span className="font-semibold">{avg}%</span>
                      </div>
                      <Progress value={avg} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Attendance</span>
                        <span className="font-semibold">{entry.attendance}%</span>
                      </div>
                      <Progress value={entry.attendance} className="h-2" />
                    </div>
                    <div className="grid grid-cols-5 gap-1 pt-2">
                      {["Q1", "Q2", "Mid", "Proj", "Final"].map((label, i) => {
                        const val = [entry.quiz1, entry.quiz2, entry.midterm, entry.project, entry.final][i];
                        return (
                          <div key={label} className="text-center">
                            <p className="text-[10px] text-muted-foreground">{label}</p>
                            <p className={`text-xs font-semibold ${val === null ? "text-muted-foreground" : val >= 85 ? "text-primary" : val >= 70 ? "text-foreground" : "text-destructive"}`}>
                              {val ?? "—"}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TutorPerformance;
