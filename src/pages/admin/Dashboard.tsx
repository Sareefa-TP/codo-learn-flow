import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Users,
  UserCheck,
  Users2,
  Calendar,
  Clock,
  CircleDollarSign,
  TrendingUp,
  Activity,
  CheckCircle2,
  AlertCircle,
  FileText,
  CreditCard,
  User,
  MoreHorizontal,
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

// --- Mock Data ---

const summaryStats = [
  { label: "Total Students", value: "1,284", icon: Users, trend: "+12%", color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Total Tutors", value: "84", icon: UserCheck, trend: "+2%", color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Total Mentors", value: "128", icon: Users2, trend: "+8%", color: "text-indigo-600", bg: "bg-indigo-50" },
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
  <Card className="min-h-[320px] overflow-hidden rounded-xl border border-border/60 bg-card/60 shadow-sm sm:min-h-[350px]">
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
    <CardContent className="h-[240px] p-6 sm:h-[300px]">
      {children}
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  return (
    <DashboardLayout>
      <div className="animate-fade-in mx-auto w-full max-w-[1320px] space-y-6 pb-10">
        
        {/* Header */}
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
        </section>

        {/* Activity + Finance (same row like charts) */}
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <Card className="h-full overflow-hidden rounded-xl border border-border/60 bg-card/60 shadow-sm">
            <CardHeader className="border-b border-border/60 px-6 py-4">
              <CardTitle className="flex items-center gap-2 text-sm font-bold">
                <Activity className="w-4 h-4 text-primary" />
                Activity Feed
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ScrollArea className="h-[240px] w-full sm:h-[300px]">
                <div className="space-y-6">
                  {activityFeed.map((item, idx) => (
                    <div key={idx} className="group flex items-start gap-4">
                      <div className={cn("shrink-0 rounded-xl p-2 transition-transform group-hover:scale-110", item.color)}>
                        <item.icon className="h-4 w-4" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold leading-snug text-foreground">{item.text}</p>
                        <p className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
                          <Clock className="h-3 w-3" /> {item.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="h-full overflow-hidden rounded-xl border border-border/60 bg-card/60 shadow-sm">
            <CardHeader className="border-b border-border/60 bg-gradient-to-r from-cyan-50 to-transparent px-6 py-4">
              <CardTitle className="flex items-center gap-2 text-sm font-bold">
                <CircleDollarSign className="h-4 w-4 text-cyan-600" />
                Finance Snapshot
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <p className="px-1 text-[11px] font-black uppercase tracking-widest text-muted-foreground">Recent Transactions</p>
                <ScrollArea className="h-[240px] w-full sm:h-[300px]">
                  <div className="space-y-3 pr-3">
                    {financeTransactions.map((tx, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-xl border border-border/40 bg-muted/10 p-3 transition-colors hover:bg-muted/20"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-background shadow-sm">
                            <User className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-foreground">{tx.user}</p>
                            <p className="text-[10px] font-medium text-muted-foreground">{tx.id}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-extrabold text-foreground">{tx.amount}</p>
                          <Badge
                            className={cn(
                              "h-4 px-1.5 text-[9px] font-black",
                              tx.status === "Paid"
                                ? "bg-emerald-50 text-emerald-600 border-none"
                                : "bg-amber-50 text-amber-600 border-none",
                            )}
                          >
                            {tx.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </section>

      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
