import { useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import SuperAdminStatCard from "@/components/superadmin/SuperAdminStatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, GraduationCap, IndianRupee, TrendingDown } from "lucide-react";
import {
  studentRecords,
  transactions,
  activityLogs,
  financialChartData,
  getWalletBalance,
} from "@/data/superAdminData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const activityTypeIcon: Record<string, string> = {
  user: "👤",
  finance: "💰",
  course: "📚",
  system: "⚙️",
};

const SuperAdminDashboard = () => {
  const totalStudents = studentRecords.filter((s) => s.type === "student").length;
  const activeInterns = studentRecords.filter((s) => s.type === "intern" && s.status === "active").length;
  const { credits, debits, balance } = getWalletBalance();

  const monthlyRevenue = useMemo(() => {
    return transactions
      .filter((t) => t.direction === "credit" && t.date.startsWith("2025-01"))
      .reduce((a, t) => a + t.amount, 0);
  }, []);

  const totalPayouts = useMemo(() => {
    return transactions
      .filter((t) => t.direction === "debit" && t.date.startsWith("2025-01"))
      .reduce((a, t) => a + t.amount, 0);
  }, []);

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-semibold text-foreground tracking-tight">
            Super Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Platform overview — CODO Academy
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <SuperAdminStatCard
            title="Total Students"
            value={totalStudents}
            subtitle={`${studentRecords.filter((s) => s.status === "active" && s.type === "student").length} active`}
            icon={GraduationCap}
            trend={{ value: "+3 this month", positive: true }}
          />
          <SuperAdminStatCard
            title="Active Interns"
            value={activeInterns}
            subtitle={`${studentRecords.filter((s) => s.type === "intern").length} total`}
            icon={Users}
            trend={{ value: "+1 this month", positive: true }}
          />
          <SuperAdminStatCard
            title="Monthly Revenue"
            value={`₹${(monthlyRevenue / 1000).toFixed(0)}K`}
            subtitle="Jan 2025 student fees"
            icon={IndianRupee}
            trend={{ value: "+18% vs Dec", positive: true }}
          />
          <SuperAdminStatCard
            title="Total Payouts"
            value={`₹${(totalPayouts / 1000).toFixed(0)}K`}
            subtitle="Salaries + Stipends"
            icon={TrendingDown}
            trend={{ value: "On track", positive: true }}
          />
        </div>

        {/* Charts & Activity */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Financial Health Chart */}
          <Card className="xl:col-span-2 border border-border/60 shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Financial Health</CardTitle>
              <p className="text-xs text-muted-foreground">Income vs Expenses — last 6 months</p>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={financialChartData} barGap={2}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                    <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} tickFormatter={(v) => `₹${v / 1000}K`} />
                    <Tooltip
                      formatter={(value: number) => `₹${value.toLocaleString("en-IN")}`}
                      contentStyle={{
                        borderRadius: "0.75rem",
                        border: "1px solid hsl(var(--border))",
                        background: "hsl(var(--card))",
                        fontSize: 12,
                      }}
                    />
                    <Legend />
                    <Bar dataKey="studentFees" name="Student Fees" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="tutorSalaries" name="Tutor Salaries" fill="hsl(var(--role-tutor))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="mentorSalaries" name="Mentor Salaries" fill="hsl(var(--role-mentor))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="stipends" name="Stipends" fill="hsl(var(--role-intern))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card className="border border-border/60 shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-0 p-0">
              <div className="divide-y divide-border max-h-[340px] overflow-y-auto">
                {activityLogs.map((log) => (
                  <div key={log.id} className="px-5 py-3 flex items-start gap-3 hover:bg-muted/30 transition-colors">
                    <span className="text-lg mt-0.5">{activityTypeIcon[log.type]}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate">{log.action}</p>
                      <p className="text-xs text-muted-foreground">{log.user} · {log.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Wallet Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border border-border/60 shadow-card p-5">
            <p className="text-sm text-muted-foreground">Total Credits</p>
            <p className="text-xl font-bold text-primary">₹{credits.toLocaleString("en-IN")}</p>
          </Card>
          <Card className="border border-border/60 shadow-card p-5">
            <p className="text-sm text-muted-foreground">Total Debits</p>
            <p className="text-xl font-bold text-destructive">₹{debits.toLocaleString("en-IN")}</p>
          </Card>
          <Card className="border border-border/60 shadow-card p-5">
            <p className="text-sm text-muted-foreground">Net Balance</p>
            <p className={`text-xl font-bold ${balance >= 0 ? "text-primary" : "text-destructive"}`}>
              ₹{balance.toLocaleString("en-IN")}
            </p>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SuperAdminDashboard;
