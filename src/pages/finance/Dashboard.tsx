import { useState, useMemo } from "react";
import FinanceLayout from "@/components/finance/FinanceLayout";
import { 
  kpiData, 
  revenueTrendData, 
  revenueByCourseData, 
  agingBuckets, 
  actionItems, 
  recentTransactions 
} from "@/data/financeMock";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  ChevronRight, 
  Download, 
  Plus, 
  DollarSign, 
  FileText, 
  TrendingUp, 
  RotateCcw,
  Wallet,
  ShieldCheck,
  ArrowRight
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  Legend
} from "recharts";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString('en-GB', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <FinanceLayout>
      <div className="animate-fade-in space-y-10 pb-20">
        
        {/* 1. Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-primary uppercase tracking-[0.25em] ml-1">{today}</p>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-tight">
              Hello, Alex <span className="text-muted-foreground/30 font-light">👋</span>
            </h1>
            <div className="flex items-center gap-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest ml-1 pt-2">
              <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500 shadow-sm shadow-amber-500/20" /> 12 pending payouts</span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-rose-500 shadow-sm shadow-rose-500/20" /> 4 refunds to process</span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500 shadow-sm shadow-blue-500/20" /> 8 unreconciled</span>
            </div>
          </div>
        </div>

        {/* 2. KPI Grid (8 metrics) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {kpiData.map((kpi) => (
            <Card key={kpi.id} className="rounded-[2rem] border-border/40 bg-white shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 group">
              <CardContent className="p-7">
                <div className="flex items-start justify-between mb-5">
                  <div className={cn(
                    "p-3 rounded-2xl border transition-colors",
                    kpi.alert === 'red' ? "bg-rose-50 border-rose-100 text-rose-600" :
                    kpi.alert === 'amber' ? "bg-amber-50 border-amber-100 text-amber-600" :
                    "bg-primary/5 border-primary/10 text-primary"
                  )}>
                    <kpi.icon className="w-5 h-5" />
                  </div>
                  {kpi.trend && (
                    <div className={cn(
                      "flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1.5 rounded-xl border",
                      kpi.trendUp ? "text-emerald-600 bg-emerald-50 border-emerald-100" : "text-rose-600 bg-rose-50 border-rose-100"
                    )}>
                      {kpi.trendUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                      {kpi.trend}
                    </div>
                  )}
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em]">{kpi.label}</p>
                  <h3 className="text-3xl font-black tracking-tighter text-foreground group-hover:text-primary transition-colors">{kpi.value}</h3>
                  <p className="text-[11px] font-bold text-muted-foreground/40">{kpi.sub}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 3. Row 1: Primary Analytics & Urgent Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* Left: Revenue Performance (8/12) */}
          <div className="lg:col-span-8">
            <Card className="rounded-[3rem] border-border/40 shadow-sm overflow-hidden bg-white flex flex-col h-full">
              <CardHeader className="px-10 pt-10 pb-4 flex flex-row items-center justify-between shrink-0">
                <div>
                  <CardTitle className="text-2xl font-black tracking-tight">Revenue Performance</CardTitle>
                  <CardDescription className="text-xs font-bold uppercase tracking-widest mt-2 text-muted-foreground/40">Target vs Actual · Last 12 Months</CardDescription>
                </div>
                <Button 
                  onClick={() => navigate("/finance/reports")}
                  variant="ghost" 
                  className="text-xs font-black uppercase tracking-widest text-primary hover:bg-primary/5 rounded-2xl gap-3 h-12 px-6"
                >
                  Open Detailed Report <ArrowUpRight className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="px-6 pb-10 flex-1 flex items-center min-h-[400px]">
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="month" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fontWeight: 900, fill: '#888' }}
                        dy={15}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fontWeight: 900, fill: '#888' }}
                        tickFormatter={(val) => `₹${val/1000}k`}
                      />
                      <Tooltip 
                        cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                        contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', padding: '20px' }}
                      />
                      <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', paddingBottom: '30px', letterSpacing: '0.1em' }} />
                      <Bar name="Target" dataKey="target" fill="#f8fafc" radius={[8, 8, 0, 0]} barSize={24} />
                      <Bar name="Actual" dataKey="actual" radius={[8, 8, 0, 0]} barSize={24}>
                        {revenueTrendData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.status === 'beat' ? 'hsl(var(--primary))' : '#fbbf24'} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Action Items (4/12) */}
          <div className="lg:col-span-4">
            <Card className="rounded-[3rem] border-none bg-slate-950 shadow-2xl overflow-hidden relative group h-full flex flex-col">
              <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity">
                <TrendingUp className="w-48 h-48 text-primary" strokeWidth={0.2} />
              </div>
              <CardHeader className="p-10 pb-4 relative shrink-0">
                <CardTitle className="text-2xl font-black tracking-tight text-white">Action Items</CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mt-1">Immediate attention required</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pb-12 pt-4 space-y-4 relative flex-1 flex flex-col justify-center">
                {actionItems.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => navigate(item.href)}
                    className="flex items-center gap-5 p-5 rounded-3xl border border-white/5 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/10 transition-all cursor-pointer group/item"
                  >
                    <div className={cn(
                      "p-3.5 rounded-2xl border transition-all duration-500 group-hover/item:scale-110",
                      item.color === 'red' ? "bg-rose-500/10 border-rose-500/20 text-rose-500 shadow-lg shadow-rose-500/10" :
                      item.color === 'amber' ? "bg-amber-500/10 border-amber-500/20 text-amber-500 shadow-lg shadow-amber-500/10" :
                      "bg-emerald-500/10 border-emerald-500/20 text-emerald-500 shadow-lg shadow-emerald-500/10"
                    )}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-slate-100 group-hover/item:text-white tracking-tight">{item.title}</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{item.meta}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-all group-hover/item:translate-x-1">
                      <ChevronRight className="w-4 h-4 text-white" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 4. Row 2: Secondary Analytics & Quick Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch mt-10">
          {/* Left Column — Course & Dues (8/12) */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch">
            {/* Revenue by Course */}
            <Card className="rounded-[3rem] border-border/40 shadow-sm bg-white flex flex-col h-full overflow-hidden">
              <CardHeader className="px-10 pt-10 pb-4 shrink-0">
                <CardTitle className="text-2xl font-black tracking-tight">Revenue by Course</CardTitle>
                <CardDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground/40 mt-1">Top performing programs</CardDescription>
              </CardHeader>
              <CardContent className="px-10 pb-8 flex-1 flex flex-col justify-between min-h-0">
                <div className="space-y-5 overflow-auto pr-2 scrollbar-hide">
                  {revenueByCourseData.map((course) => (
                    <div key={course.name} className="space-y-2 group cursor-pointer" onClick={() => navigate("/finance/revenue")}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-muted/5 group-hover:bg-primary/5 transition-colors border border-transparent group-hover:border-primary/10">
                            <course.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                          <p className="text-[12px] font-black text-foreground group-hover:text-primary transition-colors uppercase tracking-tight">{course.name}</p>
                        </div>
                        <span className="text-[12px] font-black text-foreground tabular-nums">₹{(course.revenue/1000).toFixed(0)}k</span>
                      </div>
                      <Progress value={course.percentage} className="h-1.5 bg-slate-100" />
                      <div className="flex justify-between text-[8px] font-black uppercase tracking-[0.15em] text-muted-foreground/50 ml-1">
                        <span>{course.students} Students</span>
                        <span>Avg. ₹{(course.avgFee/1000).toFixed(1)}k</span>
                      </div>
                    </div>
                  ))}
                </div>
                <Button 
                  onClick={() => navigate("/finance/revenue")}
                  variant="outline" 
                  className="w-full mt-4 rounded-2xl h-12 font-black text-[10px] uppercase tracking-[0.2em] border-border/40 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm shrink-0"
                >
                  View All Categories
                </Button>
              </CardContent>
            </Card>

            {/* Outstanding Dues */}
            <Card className="rounded-[3rem] border-border/40 shadow-sm bg-white flex flex-col h-full overflow-hidden">
              <CardHeader className="px-10 pt-10 pb-4 shrink-0">
                <CardTitle className="text-2xl font-black tracking-tight text-rose-600">Outstanding Dues</CardTitle>
                <CardDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground/40 mt-1">Aging analysis</CardDescription>
              </CardHeader>
              <CardContent className="px-10 pb-8 flex-1 flex flex-col justify-between min-h-0">
                <div className="space-y-6 pt-1 overflow-auto pr-2 scrollbar-hide">
                  {agingBuckets.map((bucket) => (
                    <div key={bucket.label} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">{bucket.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[12px] font-black text-foreground tabular-nums">{bucket.amount}</span>
                          <span className="text-[8px] font-bold text-muted-foreground/40">({bucket.count} items)</span>
                        </div>
                      </div>
                      <div className="relative h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={cn("absolute inset-y-0 left-0 transition-all duration-1000 ease-out rounded-full", bucket.color)} 
                          style={{ width: `${bucket.percentage}%` }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <Button 
                  onClick={() => navigate("/finance/invoices")}
                  variant="outline" 
                  className="w-full mt-4 rounded-2xl h-12 font-black text-[10px] uppercase tracking-[0.2em] border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all shadow-sm shrink-0"
                >
                  Manage Receivables
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column — Quick Actions (4/12) */}
          <div className="lg:col-span-4">
            {/* B. Quick Actions */}
            <div className="grid grid-cols-2 gap-6 h-full">
              <QuickActionButton icon={Plus} label="Manual Payment" onClick={() => navigate("/finance/payments")} />
              <QuickActionButton icon={DollarSign} label="Process Payout" onClick={() => navigate("/finance/payouts")} />
              <QuickActionButton icon={FileText} label="Generate Invoice" onClick={() => navigate("/finance/invoices")} />
              <QuickActionButton icon={Download} label="Monthly Report" onClick={() => {}} isDownload />
              <QuickActionButton icon={ShieldCheck} label="GST Summary" onClick={() => navigate("/finance/tax")} />
              <QuickActionButton icon={RotateCcw} label="Process Refund" onClick={() => navigate("/finance/refunds")} />
            </div>
          </div>
        </div>
        {/* 5. Wide Live Feed Row (12/12) */}
        <Card className="rounded-[3rem] border-border/40 shadow-sm bg-white overflow-hidden mt-10">
          <CardHeader className="px-10 pt-10 pb-6 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-black tracking-tight text-foreground">Live Feed</CardTitle>
              <CardDescription className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/40 mt-1">Recent Transactions · Real-time activity hub</CardDescription>
            </div>
            <Button 
              onClick={() => navigate("/finance/transactions")}
              variant="ghost" 
              className="text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:bg-primary/5 px-6 rounded-2xl h-12 border border-primary/10 gap-3"
            >
              See All Activity <ArrowRight className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="px-10 pb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentTransactions.slice(0, 6).map((txn) => (
                <div 
                  key={txn.id}
                  onClick={() => navigate("/finance/transactions")}
                  className="flex items-center gap-5 p-5 rounded-[2.5rem] hover:bg-slate-50 transition-all cursor-pointer group/txn border border-slate-50 hover:border-slate-200"
                >
                  <div className={cn(
                    "p-3.5 rounded-2xl border transition-all duration-300",
                    txn.direction === 'in' ? "bg-emerald-50 border-emerald-100 text-emerald-600 shadow-sm shadow-emerald-500/5" : "bg-rose-50 border-rose-100 text-rose-600 shadow-sm shadow-rose-500/5"
                  )}>
                    {txn.direction === 'in' ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-black text-foreground truncate group-hover/txn:text-primary transition-colors tracking-tight">{txn.user}</p>
                      <span className={cn(
                        "text-sm font-black tabular-nums",
                        txn.direction === 'in' ? "text-emerald-600" : "text-rose-600"
                      )}>
                        {txn.direction === 'in' ? '+' : '-'}₹{txn.amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.15em]">{txn.type} · {txn.time}</p>
                      <Badge variant="outline" className="text-[9px] font-black uppercase tracking-[0.1em] px-2 py-0 border-none bg-slate-100/50 text-muted-foreground/40">
                        {txn.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </FinanceLayout>
  );
};

const QuickActionButton = ({ icon: Icon, label, onClick, isDownload = false }: any) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center justify-center gap-4 p-8 rounded-[3rem] border border-border/40 bg-white shadow-sm hover:shadow-xl hover:border-primary/40 hover:bg-primary/5 transition-all group text-center h-44 hover:translate-y-[-4px] duration-300"
  >
    <div className="p-4 rounded-2xl bg-muted/5 group-hover:bg-primary/10 text-muted-foreground group-hover:text-primary transition-all duration-300">
      <Icon className="w-7 h-7" />
    </div>
    <span className="text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed text-muted-foreground/60 group-hover:text-foreground transition-colors">
      {label}
    </span>
  </button>
);

export default Dashboard;
