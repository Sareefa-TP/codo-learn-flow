import DashboardLayout from "@/components/DashboardLayout";
import SuperAdminStatCard from "@/components/superadmin/SuperAdminStatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, GraduationCap } from "lucide-react";
import { studentRecords, staffMembers } from "@/data/superAdminData";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--role-intern))",
  "hsl(var(--role-tutor))",
  "hsl(var(--role-mentor))",
];

const SuperAdminReports = () => {
  const statusBreakdown = [
    { name: "Active", value: studentRecords.filter((s) => s.status === "active").length },
    { name: "Demo Pending", value: studentRecords.filter((s) => s.status === "demo_pending").length },
    { name: "Completed", value: studentRecords.filter((s) => s.status === "completed").length },
    { name: "Dropped", value: studentRecords.filter((s) => s.status === "dropped").length },
  ];

  const roleBreakdown = [
    { name: "Tutors", count: staffMembers.filter((s) => s.role === "tutor").length },
    { name: "Mentors", count: staffMembers.filter((s) => s.role === "mentor").length },
    { name: "Admins", count: staffMembers.filter((s) => s.role === "admin").length },
  ];

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-semibold text-foreground tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1">Platform-wide insights and metrics</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <SuperAdminStatCard title="Total Users" value={studentRecords.length + staffMembers.length} icon={Users} />
          <SuperAdminStatCard title="Active Students" value={studentRecords.filter((s) => s.status === "active").length} icon={GraduationCap} />
          <SuperAdminStatCard title="Conversion Rate" value="62%" subtitle="Demo → Enrolled" icon={TrendingUp} />
          <SuperAdminStatCard title="Avg Fee Collection" value="78%" subtitle="Across all students" icon={BarChart3} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border border-border/60 shadow-card">
            <CardHeader><CardTitle className="text-base">Student/Intern Status</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                      {statusBreakdown.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/60 shadow-card">
            <CardHeader><CardTitle className="text-base">Staff Distribution</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={roleBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                    <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                    <Tooltip contentStyle={{ borderRadius: "0.75rem", border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SuperAdminReports;
