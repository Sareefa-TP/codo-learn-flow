import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Users,
  UserCheck,
  GraduationCap,
  Users2,
  BookOpen,
  Briefcase,
  Calendar,
  Clock,
  CircleDollarSign,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Plus,
  CheckCircle2,
  AlertCircle,
  FileText,
  CreditCard,
  User,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Layers
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

// --- Mock Data ---

const summaryStats = [
  { label: "Total Students", value: "1,284", icon: Users, trend: "+12%", color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Total Interns", value: "456", icon: GraduationCap, trend: "+5%", color: "text-purple-600", bg: "bg-purple-50" },
  { label: "Total Tutors", value: "84", icon: UserCheck, trend: "+2%", color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Total Mentors", value: "128", icon: Users2, trend: "+8%", color: "text-indigo-600", bg: "bg-indigo-50" },
  { label: "Total Courses", value: "32", icon: BookOpen, trend: "0%", color: "text-orange-600", bg: "bg-orange-50" },
  { label: "Active Batches", value: "18", icon: Calendar, trend: "+3", color: "text-pink-600", bg: "bg-pink-50" },
  { label: "Pending Approvals", value: "24", icon: Clock, trend: "-15%", color: "text-amber-600", bg: "bg-amber-50" },
  { label: "Total Revenue", value: "$45.2k", icon: CircleDollarSign, trend: "+18%", color: "text-cyan-600", bg: "bg-cyan-50" },
];

const growthData = [
  { name: "Jan", students: 400 },
  { name: "Feb", students: 600 },
  { name: "Mar", students: 800 },
  { name: "Apr", students: 1000 },
  { name: "May", students: 1284 },
];

const revenueData = [
  { name: "Jan", revenue: 4000 },
  { name: "Feb", revenue: 5500 },
  { name: "Mar", revenue: 7000 },
  { name: "Apr", revenue: 8500 },
  { name: "May", revenue: 12000 },
];

const enrollmentData = [
  { name: "React", count: 450 },
  { name: "Python", count: 320 },
  { name: "UI/UX", count: 280 },
  { name: "Node.js", count: 190 },
];

const userActivityData = [
  { name: "Students", value: 65, color: "#2563eb" },
  { name: "Tutors", value: 15, color: "#10b981" },
  { name: "Mentors", value: 20, color: "#8b5cf6" },
];

const recentRegistrations = [
  { name: "Sarah Connor", role: "Student", status: "Active", time: "2 mins ago" },
  { name: "John Smith", role: "Tutor", status: "Pending", time: "15 mins ago" },
  { name: "Elena Gilbert", role: "Mentor", status: "Active", time: "1 hour ago" },
  { name: "Stefan Salvatore", role: "Student", status: "Active", time: "2 hours ago" },
  { name: "Bonnie Bennett", role: "Tutor", status: "Pending", time: "3 hours ago" },
];

const activityFeed = [
  { icon: Users, text: "New student registered: Sarah Connor", time: "2 mins ago", color: "bg-blue-100 text-blue-600" },
  { icon: FileText, text: "Assignment submitted in 'React Advanced'", time: "10 mins ago", color: "bg-purple-100 text-purple-600" },
  { icon: Calendar, text: "New batch 'Web Dev Apr-24' created", time: "1 hour ago", color: "bg-emerald-100 text-emerald-600" },
  { icon: CreditCard, text: "Payment completed by John Doe", time: "3 hours ago", color: "bg-amber-100 text-amber-600" },
  { icon: CheckCircle2, text: "Tutor 'Alex Rivera' approved", time: "5 hours ago", color: "bg-cyan-100 text-cyan-600" },
];

const financeTransactions = [
  { id: "TX1001", user: "John Doe", amount: "$150.00", status: "Paid" },
  { id: "TX1002", user: "Jane Smith", amount: "$200.00", status: "Pending" },
  { id: "TX1003", user: "Mike Ross", amount: "$120.00", status: "Paid" },
];

// --- Sub-components ---

const StatCard = ({ stat }: { stat: typeof summaryStats[0] }) => (
  <Card className="group rounded-xl border border-border/60 bg-card/60 shadow-sm transition-colors hover:border-primary/20">
    <CardContent className="flex h-full flex-col justify-between p-5">
      <div className="flex items-center justify-between mb-4">
        <div className={cn("rounded-xl p-2.5 transition-transform duration-300 group-hover:scale-[1.04]", stat.bg, stat.color)}>
          <stat.icon className="w-5 h-5" />
        </div>
        <div className={cn(
          "text-[10px] font-bold px-2 py-0.5 rounded-full",
          stat.trend.startsWith("+") ? "bg-emerald-50 text-emerald-600" : stat.trend === "0%" ? "bg-gray-50 text-gray-400" : "bg-red-50 text-red-600"
        )}>
          {stat.trend}
        </div>
      </div>
      <div>
        <h3 className="mb-1 text-2xl font-extrabold tracking-tight text-foreground">{stat.value}</h3>
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{stat.label}</p>
      </div>
    </CardContent>
  </Card>
);

const ChartCard = ({ title, children, icon: Icon }: { title: string, children: React.ReactNode, icon?: any }) => (
  <Card className="min-h-[350px] overflow-hidden rounded-xl border border-border/60 bg-card/60 shadow-sm">
    <CardHeader className="flex flex-row items-center justify-between border-b border-border/60 px-6 py-4">
      <CardTitle className="flex items-center gap-2 text-sm font-bold">
        {Icon && <Icon className="w-4 h-4 text-primary" />}
        {title}
      </CardTitle>
      <button
        type="button"
        className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label="More"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
    </CardHeader>
    <CardContent className="p-6 h-[300px]">
      {children}
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: "Add Course",
      description: "Create and publish a new course",
      icon: BookOpen,
      iconWrap: "bg-primary/10 text-primary border-primary/20",
      to: "/admin/courses/create",
      variant: "default" as const,
    },
    {
      title: "Create Batch",
      description: "Set up a new batch schedule",
      icon: Layers,
      iconWrap: "bg-blue-500/10 text-blue-600 border-blue-200",
      // Note: existing route in this repo is singular: /admin/batch/create
      to: "/admin/batch/create",
      variant: "outline" as const,
    },
    {
      title: "Add Tutor",
      description: "Onboard a tutor to the platform",
      icon: GraduationCap,
      iconWrap: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
      // Note: existing route in this repo is singular: /admin/tutor/add
      to: "/admin/tutor/add",
      variant: "outline" as const,
    },
    {
      title: "Add Mentor",
      description: "Create a mentor profile",
      icon: Users2,
      iconWrap: "bg-purple-500/10 text-purple-600 border-purple-200",
      // Note: existing route in this repo is /admin/mentors/add
      to: "/admin/mentors/add",
      variant: "outline" as const,
    },
    {
      title: "Add Student",
      description: "Register a student manually",
      icon: Users,
      iconWrap: "bg-amber-500/10 text-amber-700 border-amber-200",
      // Note: existing route in this repo is /admin/students/add
      to: "/admin/students/add",
      variant: "outline" as const,
    },
    {
      title: "Add Intern",
      description: "Create a new intern entry",
      icon: Briefcase,
      iconWrap: "bg-cyan-500/10 text-cyan-700 border-cyan-200",
      // Note: existing route in this repo is /admin/interns/create
      to: "/admin/interns/create",
      variant: "outline" as const,
    },
  ];

  return (
    <DashboardLayout>
      <div className="animate-fade-in mx-auto w-full max-w-[1320px] space-y-6 pb-10">
        
        {/* Header + Quick Actions */}
        <div className="grid grid-cols-1 gap-5 rounded-xl border border-border/60 bg-background/40 p-6 shadow-sm backdrop-blur-sm lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-8">
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground lg:text-3xl">
              Platform Overview
            </h1>
            <p className="mt-1 text-sm font-medium text-muted-foreground sm:text-base">
              Welcome back, Admin. Here's what's happening across the system today.
            </p>
          </div>
        </div>

        {/* Quick Actions (clickable navigation cards) */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((a) => (
            <button
              key={a.title}
              type="button"
              onClick={() => navigate(a.to)}
              className={cn(
                "group w-full cursor-pointer rounded-xl border border-border/60 bg-card/60 text-left shadow-sm transition-colors",
                "hover:border-primary/20 hover:bg-card/80",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              )}
            >
              <div className="flex h-full items-start gap-4 p-5">
                <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border", a.iconWrap)}>
                  <a.icon className="w-5 h-5" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <p className="text-sm font-extrabold tracking-tight text-foreground transition-colors group-hover:text-primary">
                    {a.title}
                  </p>
                  <p className="mt-1 text-xs font-medium text-muted-foreground">
                    {a.description}
                  </p>
                  <div className="mt-4 pt-2">
                    <Button
                      variant={a.variant}
                      size="sm"
                      className={cn(
                        "pointer-events-none gap-2 rounded-xl",
                        a.variant === "default" && "bg-primary shadow-sm shadow-primary/10",
                      )}
                    >
                      <Plus className="w-4 h-4" />
                      {a.title}
                    </Button>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </section>

        {/* Section 1: Summary Cards */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {summaryStats.map((stat, idx) => (
            <StatCard key={idx} stat={stat} />
          ))}
        </section>

        {/* Section 2: Charts Section */}
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <ChartCard title="Student Growth" icon={TrendingUp}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip />
                <Line type="monotone" dataKey="students" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: "#2563eb" }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Revenue Overview" icon={CircleDollarSign}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Course Enrollment" icon={BarChart3}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={enrollmentData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Active Users Distribution" icon={PieChart}>
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={userActivityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {userActivityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </RePieChart>
            </ResponsiveContainer>
          </ChartCard>
        </section>

        {/* Section 3 & 4: Role Overview + Activity & Finance */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          
          {/* Recent Registrations (Role Overview) */}
          <Card className="overflow-hidden rounded-xl border border-border/60 bg-card/60 shadow-sm xl:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border/60 px-6 py-4">
              <CardTitle className="flex items-center gap-2 text-sm font-bold">
                <Users className="w-4 h-4 text-primary" />
                Recent Registrations
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-xs text-primary font-bold">View All</Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-muted/30 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-6 py-3">Name</th>
                      <th className="px-6 py-3">Role</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {recentRegistrations.map((user, idx) => (
                      <tr key={idx} className="transition-colors hover:bg-muted/10">
                        <td className="px-6 py-4 font-semibold text-sm">{user.name}</td>
                        <td className="px-6 py-4 text-xs font-medium text-muted-foreground">{user.role}</td>
                        <td className="px-6 py-4">
                          <Badge variant={user.status === "Active" ? "default" : "secondary"} className={cn(
                            "text-[10px] font-bold px-2 py-0.5",
                            user.status === "Active" ? "bg-emerald-50 text-emerald-600 border-none shadow-none" : "bg-amber-50 text-amber-600 border-none shadow-none"
                          )}>
                            {user.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-xs text-muted-foreground">{user.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card className="overflow-hidden rounded-xl border border-border/60 bg-card/60 shadow-sm">
            <CardHeader className="border-b border-border/60 px-6 py-4">
              <CardTitle className="flex items-center gap-2 text-sm font-bold">
                <Activity className="w-4 h-4 text-primary" />
                Activity Feed
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ScrollArea className="h-[300px] w-full">
                <div className="space-y-6">
                  {activityFeed.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4 group">
                      <div className={cn("p-2 rounded-xl shrink-0 group-hover:scale-110 transition-transform", item.color)}>
                        <item.icon className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-foreground leading-snug">{item.text}</p>
                        <p className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {item.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Section 4: Finance Snapshot */}
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <Card className="overflow-hidden rounded-xl border border-border/60 bg-card/60 shadow-sm xl:col-span-1">
            <CardHeader className="border-b border-border/60 bg-gradient-to-r from-cyan-50 to-transparent px-6 py-4">
              <CardTitle className="flex items-center gap-2 text-sm font-bold">
                <CircleDollarSign className="w-4 h-4 text-cyan-600" />
                Finance Snapshot
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Revenue</p>
                  <p className="text-xl font-extrabold tracking-tight text-foreground">$45,280</p>
                  <div className="flex items-center text-[10px] text-emerald-600 font-bold mt-1">
                    <ArrowUpRight className="w-3 h-3" /> 12.5%
                  </div>
                </div>
                <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Pending</p>
                  <p className="text-xl font-extrabold tracking-tight text-foreground">$8,420</p>
                  <div className="flex items-center text-[10px] text-amber-600 font-bold mt-1">
                    <ArrowDownRight className="w-3 h-3" /> 3.2%
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest px-1">Recent Transactions</p>
                <div className="space-y-3">
                  {financeTransactions.map((tx, idx) => (
                    <div key={idx} className="flex items-center justify-between rounded-xl border border-border/40 bg-muted/10 p-3 transition-colors hover:bg-muted/20">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-background shadow-sm">
                          <User className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-foreground">{tx.user}</p>
                          <p className="text-[10px] text-muted-foreground font-medium">{tx.id}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-extrabold text-foreground">{tx.amount}</p>
                        <Badge className={cn(
                          "text-[9px] font-black h-4 px-1.5",
                          tx.status === "Paid" ? "bg-emerald-50 text-emerald-600 border-none" : "bg-amber-50 text-amber-600 border-none"
                        )}>
                          {tx.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
