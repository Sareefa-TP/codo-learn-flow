import { useState } from "react";
import FinanceLayout from "@/components/finance/FinanceLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  PieChart as LucidePieChart,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  PieChart,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
  PieChart as RePieChart,
  Pie,
  AreaChart,
  Area,
} from "recharts";
import { cn } from "@/lib/utils";

// ─── Mock Data ───────────────────────────────────────────────────────────────

const revenueMix = [
  { name: "Subscription", value: 320000, color: "#0ea5e9" },
  { name: "One-time Fee", value: 850000, color: "#8b5cf6" },
  { name: "Webinars", value: 45000, color: "#ec4899" },
  { name: "Manual", value: 120000, color: "#10b981" },
];

const profitTrend = [
  { month: "Jan", revenue: 120, cost: 80, profit: 40 },
  { month: "Feb", revenue: 145, cost: 95, profit: 50 },
  { month: "Mar", revenue: 115, cost: 85, profit: 30 },
  { month: "Apr", revenue: 160, cost: 110, profit: 50 },
  { month: "May", revenue: 185, cost: 130, profit: 55 },
  { month: "Jun", revenue: 170, cost: 120, profit: 50 },
];

// ─── Component ───────────────────────────────────────────────────────────────

const ReportsAnalytics = () => {
  return (
    <FinanceLayout>
      <div className="animate-fade-in space-y-8 max-w-[1440px] mx-auto pb-20">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
              <PieChart className="w-8 h-8 text-primary" />
              Reports & Analytics
            </h1>
            <p className="text-sm font-medium text-muted-foreground">
              Deep-dive financial performance, profitability trends and unit economics.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" className="h-11 rounded-xl font-bold text-xs uppercase tracking-widest border-border/60">
              <Calendar className="w-4 h-4 mr-2" />
              Q2 2026
            </Button>
            <Button className="h-11 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-widest px-6 shadow-xl shadow-primary/20">
              <Download className="w-4 h-4 mr-2" />
              Export Full Report
            </Button>
          </div>
        </div>

        {/* Top Insights Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <Card className="rounded-[2rem] border-border/60 bg-card shadow-sm p-8">
              <div className="flex items-center justify-between mb-4">
                 <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Net Profit Margin</p>
                 <div className="flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                    <ArrowUpRight className="w-3 h-3" />
                    2.4%
                 </div>
              </div>
              <h2 className="text-3xl font-black tracking-tight text-foreground">34.8%</h2>
              <p className="text-xs font-medium text-muted-foreground mt-2">Up from 32.4% in Q1.</p>
           </Card>
           
           <Card className="rounded-[2rem] border-border/60 bg-card shadow-sm p-8">
              <div className="flex items-center justify-between mb-4">
                 <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">LTV to CAC Ratio</p>
                 <div className="flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                    <TrendingUp className="w-3 h-3" />
                    Healthy
                 </div>
              </div>
              <h2 className="text-3xl font-black tracking-tight text-foreground">5.2x</h2>
              <p className="text-xs font-medium text-muted-foreground mt-2">Avg. lifetime value vs acquisition cost.</p>
           </Card>

           <Card className="rounded-[2rem] border-border/60 bg-card shadow-sm p-8">
              <div className="flex items-center justify-between mb-4">
                 <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Revenue Per Student</p>
                 <div className="flex items-center gap-1 text-[10px] font-black text-rose-600 bg-rose-50 px-2 py-1 rounded-lg">
                    <ArrowDownRight className="w-3 h-3" />
                    ₹850
                 </div>
              </div>
              <h2 className="text-3xl font-black tracking-tight text-foreground">₹18,450</h2>
              <p className="text-xs font-medium text-muted-foreground mt-2">Gross average including top-ups.</p>
           </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           
           {/* Profitability Trend Area Chart */}
           <Card className="lg:col-span-8 rounded-[2rem] border-border/60 bg-card shadow-sm overflow-hidden">
              <CardHeader className="p-8 border-b border-border/40">
                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                       <CardTitle className="text-xl font-black tracking-tight">Gross Profitability Trend</CardTitle>
                       <CardDescription className="text-xs font-medium uppercase tracking-wider">Revenue vs Cost of Sales (Payouts + Refunds)</CardDescription>
                    </div>
                    <div className="flex items-center gap-6">
                       <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-primary" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Revenue</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-rose-500" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Costs</span>
                       </div>
                    </div>
                 </div>
              </CardHeader>
              <CardContent className="p-8">
                 <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                       <AreaChart data={profitTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                          <defs>
                             <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                             </linearGradient>
                             <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                             </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: "hsl(var(--muted-foreground))" }} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(val) => `₹${val}k`} />
                          <Tooltip contentStyle={{ borderRadius: '16px', border: '1px solid hsl(var(--border))' }} />
                          <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={3} />
                          <Area type="monotone" dataKey="cost" stroke="#f43f5e" fillOpacity={1} fill="url(#colorCost)" strokeWidth={3} />
                       </AreaChart>
                    </ResponsiveContainer>
                 </div>
              </CardContent>
           </Card>

           {/* Revenue Mix Donut Chart */}
           <Card className="lg:col-span-4 rounded-[2rem] border-border/60 bg-card shadow-sm overflow-hidden">
              <CardHeader className="p-8 border-b border-border/40">
                 <CardTitle className="text-xl font-black tracking-tight">Revenue Stream Mix</CardTitle>
                 <CardDescription className="text-xs font-medium uppercase tracking-wider">Distribution of incoming value</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                 <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                       <RePieChart>
                          <Pie data={revenueMix} innerRadius={70} outerRadius={110} paddingAngle={8} dataKey="value">
                             {revenueMix.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                             ))}
                          </Pie>
                          <Tooltip />
                       </RePieChart>
                    </ResponsiveContainer>
                 </div>
                 <div className="mt-8 space-y-3">
                    {revenueMix.map((item) => (
                       <div key={item.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                             <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                             <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{item.name}</span>
                          </div>
                          <span className="text-xs font-black">₹{(item.value / 1000).toFixed(0)}k</span>
                       </div>
                    ))}
                 </div>
              </CardContent>
           </Card>
        </div>

      </div>
    </FinanceLayout>
  );
};

export default ReportsAnalytics;
