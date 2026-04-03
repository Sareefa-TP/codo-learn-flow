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
  MoreHorizontal
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
  <Card className="border-none shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300 group">
    <CardContent className="p-5 flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-4">
        <div className={cn("p-2.5 rounded-xl group-hover:scale-110 transition-transform duration-300", stat.bg, stat.color)}>
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
        <h3 className="text-2xl font-bold text-foreground mb-1">{stat.value}</h3>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
      </div>
    </CardContent>
  </Card>
);

const ChartCard = ({ title, children, icon: Icon }: { title: string, children: React.ReactNode, icon?: any }) => (
  <Card className="border-none shadow-sm rounded-2xl overflow-hidden min-h-[350px]">
    <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b border-border/50">
      <CardTitle className="text-sm font-bold flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-primary" />}
        {title}
      </CardTitle>
      <MoreHorizontal className="w-4 h-4 text-muted-foreground cursor-pointer" />
    </CardHeader>
    <CardContent className="p-6 h-[300px]">
      {children}
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6 max-w-[1600px] mx-auto pb-10 px-6">
        
        {/* Header + Quick Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
              Platform Overview
            </h1>
            <p className="text-muted-foreground mt-1 font-medium">
              Welcome back, Admin. Here's what's happening across the system today.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <Button className="rounded-xl shadow-sm hover:shadow-md transition-all gap-2 bg-primary">
              <Plus className="w-4 h-4" /> Add Course
            </Button>
            <Button variant="outline" className="rounded-xl shadow-sm hover:shadow-md transition-all gap-2 bg-background">
              <Calendar className="w-4 h-4" /> Create Batch
            </Button>
            <Button variant="outline" className="rounded-xl shadow-sm hover:shadow-md transition-all gap-2 bg-background">
              <UserCheck className="w-4 h-4" /> Approve Users
            </Button>
            <Button variant="outline" className="rounded-xl shadow-sm hover:shadow-md transition-all gap-2 bg-background">
              <Plus className="w-4 h-4" /> Add Tutor
            </Button>
            <Button variant="outline" className="rounded-xl shadow-sm hover:shadow-md transition-all gap-2 bg-background">
              <Activity className="w-4 h-4" /> Create Announcement
            </Button>
          </div>
        </div>

        {/* Section 1: Summary Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {summaryStats.map((stat, idx) => (
            <StatCard key={idx} stat={stat} />
          ))}
        </section>

        {/* Section 2: Charts Section */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
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
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Recent Registrations (Role Overview) */}
          <Card className="border-none shadow-sm rounded-2xl overflow-hidden xl:col-span-2">
            <CardHeader className="border-b border-border/50 py-4 px-6 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
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
                  <tbody className="divide-y divide-border/50">
                    {recentRegistrations.map((user, idx) => (
                      <tr key={idx} className="hover:bg-muted/10 transition-colors">
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
          <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-border/50 py-4 px-6">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
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
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Card className="border-none shadow-sm rounded-2xl overflow-hidden xl:col-span-1">
            <CardHeader className="border-b border-border/50 py-4 px-6 bg-gradient-to-r from-cyan-50 to-transparent">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <CircleDollarSign className="w-4 h-4 text-cyan-600" />
                Finance Snapshot
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted/20 rounded-2xl border border-border/50">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Revenue</p>
                  <p className="text-xl font-black text-foreground">$45,280</p>
                  <div className="flex items-center text-[10px] text-emerald-600 font-bold mt-1">
                    <ArrowUpRight className="w-3 h-3" /> 12.5%
                  </div>
                </div>
                <div className="p-4 bg-muted/20 rounded-2xl border border-border/50">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Pending</p>
                  <p className="text-xl font-black text-foreground">$8,420</p>
                  <div className="flex items-center text-[10px] text-amber-600 font-bold mt-1">
                    <ArrowDownRight className="w-3 h-3" /> 3.2%
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest px-1">Recent Transactions</p>
                <div className="space-y-3">
                  {financeTransactions.map((tx, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-muted/10 rounded-xl hover:bg-muted/20 transition-all border border-border/20">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center border border-border shadow-sm">
                          <User className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-foreground">{tx.user}</p>
                          <p className="text-[10px] text-muted-foreground font-medium">{tx.id}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black text-foreground">{tx.amount}</p>
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
