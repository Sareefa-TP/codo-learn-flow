import DashboardLayout from "@/components/DashboardLayout";
import SuperAdminStatCard from "@/components/superadmin/SuperAdminStatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IndianRupee, TrendingDown, Wallet, UserCog } from "lucide-react";
import {
  transactions,
  activityLogs,
  financialChartData,
  getWalletBalance,
  staffMembers,
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
  const totalAdmins = staffMembers.filter((s) => s.role === "admin").length;
  const { credits, debits, balance } = getWalletBalance();

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
            title="Total Credits"
            value={`₹${(credits / 1000).toFixed(0)}K`}
            subtitle="All time income"
            icon={IndianRupee}
            trend={{ value: "Updated now", positive: true }}
          />
          <SuperAdminStatCard
            title="Total Debits"
            value={`₹${(debits / 1000).toFixed(0)}K`}
            subtitle="All time expenses"
            icon={TrendingDown}
            trend={{ value: "Updated now", positive: false }}
          />
          <SuperAdminStatCard
            title="Net Balance"
            value={`₹${(balance / 1000).toFixed(1)}K`}
            subtitle="Current surplus"
            icon={Wallet}
            trend={{ value: balance >= 0 ? "Positive" : "Negative", positive: balance >= 0 }}
          />
          <SuperAdminStatCard
            title="Total Admin"
            value={totalAdmins}
            subtitle="Platform managers"
            icon={UserCog}
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

      </div>
    </DashboardLayout>
  );
};

export default SuperAdminDashboard;
