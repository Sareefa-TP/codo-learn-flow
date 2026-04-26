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
          <div className="space-y-2">
            <p className="text-sm font-bold text-primary uppercase tracking-[0.2em]">{today}</p>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-foreground">
              Hello, Alex <span className="text-muted-foreground/30 font-light">👋</span>
            </h1>
            <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> 12 pending payouts</span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> 4 refunds to process</span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> 8 unreconciled entries</span>
            </div>
          </div>
        </div>

        {/* 2. KPI Grid (8 metrics) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {kpiData.map((kpi) => (
            <Card key={kpi.id} className="rounded-3xl border-border/40 bg-white shadow-sm hover:shadow-md transition-all group">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={cn(
                    "p-2.5 rounded-2xl border transition-colors",
                    kpi.alert === 'red' ? "bg-rose-50 border-rose-100 text-rose-600" :
                    kpi.alert === 'amber' ? "bg-amber-50 border-amber-100 text-amber-600" :
                    "bg-primary/5 border-primary/10 text-primary"
                  )}>
                    <kpi.icon className="w-5 h-5" />
                  </div>
                  {kpi.trend && (
                    <div className={cn(
                      "flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg border",
                      kpi.trendUp ? "text-emerald-600 bg-emerald-50 border-emerald-100" : "text-rose-600 bg-rose-50 border-rose-100"
                    )}>
                      {kpi.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {kpi.trend}
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{kpi.label}</p>
                  <h3 className="text-2xl font-black tracking-tight text-foreground group-hover:text-primary transition-colors">{kpi.value}</h3>
                  <p className="text-[11px] font-medium text-muted-foreground">{kpi.sub}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid (8/12 and 4/12) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column — Analytics (8/12) */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* A. Revenue — Target vs Actual */}
            <Card className="rounded-[2.5rem] border-border/40 shadow-sm overflow-hidden bg-white">
              <CardHeader className="px-8 pt-8 pb-4 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-black tracking-tight">Revenue Performance</CardTitle>
                  <CardDescription className="text-xs font-medium uppercase tracking-wider mt-1">Target vs Actual · Last 12 Months</CardDescription>
                </div>
                <Button 
                  onClick={() => navigate("/finance/reports")}
                  variant="ghost" 
                  className="text-xs font-bold text-primary hover:bg-primary/5 rounded-xl gap-2"
                >
                  Open Report <ArrowUpRight className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="px-6 pb-8">
                <div className="h-[380px] w-full">
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
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '12px' }}
                      />
                      <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', paddingBottom: '20px' }} />
                      <Bar name="Target" dataKey="target" fill="#f1f5f9" radius={[6, 6, 0, 0]} barSize={20} />
                      <Bar name="Actual" dataKey="actual" radius={[6, 6, 0, 0]} barSize={20}>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* B. Revenue by Course */}
              <Card className="rounded-[2.5rem] border-border/40 shadow-sm bg-white">
                <CardHeader className="px-8 pt-8 pb-4">
                  <CardTitle className="text-xl font-black tracking-tight">Revenue by Course</CardTitle>
                  <CardDescription className="text-xs font-medium uppercase tracking-wider">Top performing programs this month</CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-8 space-y-6">
                  {revenueByCourseData.map((course) => (
                    <div key={course.name} className="space-y-2 group cursor-pointer" onClick={() => navigate("/finance/revenue")}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-muted/5 group-hover:bg-primary/5 transition-colors">
                            <course.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                          </div>
                          <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{course.name}</p>
                        </div>
                        <span className="text-sm font-black text-foreground">₹{(course.revenue/1000).toFixed(0)}k</span>
                      </div>
                      <Progress value={course.percentage} className="h-1.5 bg-muted/30" />
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        <span>{course.students} Students</span>
                        <span>Avg. ₹{(course.avgFee/1000).toFixed(1)}k</span>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full mt-2 rounded-xl h-12 font-black text-[10px] uppercase tracking-widest border-border/60 hover:bg-primary hover:text-white hover:border-primary transition-all">
                    View All Categories
                  </Button>
                </CardContent>
              </Card>

              {/* C. Outstanding Dues — Aging Buckets */}
              <Card className="rounded-[2.5rem] border-border/40 shadow-sm bg-white">
                <CardHeader className="px-8 pt-8 pb-4">
                  <CardTitle className="text-xl font-black tracking-tight">Outstanding Dues</CardTitle>
                  <CardDescription className="text-xs font-medium uppercase tracking-wider">Aging analysis of unpaid invoices</CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-8 space-y-6">
                  {agingBuckets.map((bucket) => (
                    <div key={bucket.label} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">{bucket.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-foreground">{bucket.amount}</span>
                          <span className="text-[10px] font-bold text-muted-foreground">({bucket.count} inv.)</span>
                        </div>
                      </div>
                      <div className="relative h-2.5 w-full bg-muted/20 rounded-full overflow-hidden shadow-inner">
                        <div 
                          className={cn("absolute inset-y-0 left-0 transition-all duration-1000 ease-out", bucket.color)} 
                          style={{ width: `${bucket.percentage}%` }} 
                        />
                      </div>
                    </div>
                  ))}
                  <Button 
                    onClick={() => navigate("/finance/invoices")}
                    variant="outline" 
                    className="w-full mt-2 rounded-xl h-12 font-black text-[10px] uppercase tracking-widest border-border/60 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all"
                  >
                    Manage Receivables
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column — Action Center (4/12) */}
          <div className="lg:col-span-4 space-y-10">
            
            {/* A. Action Items (Dark Themed) */}
            <Card className="rounded-[2.5rem] border-none bg-slate-950 shadow-2xl overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
                <TrendingUp className="w-32 h-32 text-primary" strokeWidth={0.5} />
              </div>
              <CardHeader className="p-8 pb-4 relative">
                <CardTitle className="text-xl font-black tracking-tight text-white">Action Items</CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Immediate attention required</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-4 space-y-4 relative">
                {actionItems.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => navigate(item.href)}
                    className="flex items-center gap-4 p-5 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10 transition-all cursor-pointer group/item"
                  >
                    <div className={cn(
                      "p-3 rounded-xl border transition-transform group-hover/item:scale-110",
                      item.color === 'red' ? "bg-rose-500/10 border-rose-500/20 text-rose-500" :
                      item.color === 'amber' ? "bg-amber-500/10 border-amber-500/20 text-amber-500" :
                      "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                    )}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-200 group-hover/item:text-white">{item.title}</p>
                      <p className="text-[10px] font-medium text-slate-500">{item.meta}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover/item:text-white transition-transform group-hover/item:translate-x-1" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* B. Quick Actions (6-button grid) */}
            <div className="grid grid-cols-2 gap-4">
              <QuickActionButton icon={Plus} label="Manual Payment" onClick={() => navigate("/finance/payments")} />
              <QuickActionButton icon={DollarSign} label="Process Payout" onClick={() => navigate("/finance/payouts")} />
              <QuickActionButton icon={FileText} label="Generate Invoice" onClick={() => navigate("/finance/invoices")} />
              <QuickActionButton icon={Download} label="Monthly Report" onClick={() => {}} isDownload />
              <QuickActionButton icon={ShieldCheck} label="GST Summary" onClick={() => navigate("/finance/tax")} />
              <QuickActionButton icon={RotateCcw} label="Process Refund" onClick={() => navigate("/finance/refunds")} />
            </div>

            {/* C. Recent Transactions Feed */}
            <Card className="rounded-[2.5rem] border-border/40 shadow-sm bg-white overflow-hidden">
              <CardHeader className="px-8 pt-8 pb-4 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-black tracking-tight">Live Feed</CardTitle>
                  <CardDescription className="text-xs font-medium uppercase tracking-wider">Recent transactions</CardDescription>
                </div>
                <Button 
                  onClick={() => navigate("/finance/transactions")}
                  variant="ghost" 
                  className="text-xs font-bold text-primary hover:bg-primary/5 px-2"
                >
                  See All
                </Button>
              </CardHeader>
              <CardContent className="px-4 pb-8 h-[460px] overflow-auto">
                <div className="space-y-1">
                  {recentTransactions.map((txn) => (
                    <div 
                      key={txn.id}
                      onClick={() => navigate("/finance/transactions")}
                      className="flex items-center gap-4 p-4 rounded-2xl hover:bg-muted/5 transition-all cursor-pointer group/txn"
                    >
                      <div className={cn(
                        "p-2.5 rounded-xl border transition-colors",
                        txn.direction === 'in' ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-rose-50 border-rose-100 text-rose-600"
                      )}>
                        {txn.direction === 'in' ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-bold text-foreground truncate group-hover/txn:text-primary">{txn.user}</p>
                          <span className={cn(
                            "text-sm font-black",
                            txn.direction === 'in' ? "text-emerald-600" : "text-rose-600"
                          )}>
                            {txn.direction === 'in' ? '+' : '-'}₹{txn.amount.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">{txn.type} · {txn.time}</p>
                          <Badge variant="ghost" className="text-[9px] font-black uppercase tracking-tighter p-0 h-auto">
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
        </div>
      </div>
    </FinanceLayout>
  );
};

const QuickActionButton = ({ icon: Icon, label, onClick, isDownload = false }: any) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center justify-center gap-3 p-6 rounded-[2rem] border border-border/40 bg-white shadow-sm hover:shadow-lg hover:border-primary/40 hover:bg-primary/5 transition-all group text-center h-40"
  >
    <div className="p-3 rounded-2xl bg-muted/5 group-hover:bg-primary/10 text-muted-foreground group-hover:text-primary transition-colors">
      <Icon className="w-6 h-6" />
    </div>
    <span className="text-[10px] font-black uppercase tracking-widest leading-relaxed text-muted-foreground group-hover:text-foreground">
      {label}
    </span>
  </button>
);

export default Dashboard;
