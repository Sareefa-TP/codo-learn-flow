import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  AlertCircle,
  CreditCard,
  ArrowDownToLine,
  CheckCircle2,
  BarChart2,
  IndianRupee,
  Sparkles,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface MonthData {
  label: string;
  revenue: number;
  earnings: number;
  totalProfit: number;
  pendingTopups: number;
  pendingPayoutAmount: number;
  unpaidEarningsCount: number;
  walletBalance: number;
  walletTopups: number;
  payoutCompleted: number;
  topupRows: TopupRow[];
  earningsRows: EarningsRow[];
}

interface TopupRow {
  id: number;
  student: string;
  batch: string;
  amount: string;
  date: string;
  status: "Pending" | "Approved" | "Rejected";
}

interface EarningsRow {
  id: number;
  recipient: string;
  role: string;
  amount: string;
  month: string;
  status: "Unpaid" | "Paid" | "Processing";
}

interface KpiCard {
  label: string;
  value: string;
  sub: string;
  trend?: string;
  trendUp?: boolean;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  valueColor?: string;
  href?: string;            // optional navigation target
}

// ─── Mock Data (per month) ────────────────────────────────────────────────────

const monthlyData: Record<string, MonthData> = {
  "2026-03": {
    label: "March 2026",
    revenue: 1_35_000,
    earnings: 95_000,
    totalProfit: 8_42_500,
    pendingTopups: 8,
    pendingPayoutAmount: 1_15_000,
    unpaidEarningsCount: 12,
    walletBalance: 2_48_500,
    walletTopups: 33_500,
    payoutCompleted: 75_000,
    topupRows: [
      { id: 1, student: "Aisha Khan", batch: "Batch Alpha", amount: "₹5,000", date: "01 Mar 2026", status: "Pending" },
      { id: 2, student: "Rohan Verma", batch: "Batch Beta", amount: "₹10,000", date: "01 Mar 2026", status: "Approved" },
      { id: 3, student: "Priya Sharma", batch: "Batch Alpha", amount: "₹7,500", date: "28 Feb 2026", status: "Pending" },
      { id: 4, student: "Arjun Nair", batch: "Batch Gamma", amount: "₹3,000", date: "27 Feb 2026", status: "Rejected" },
      { id: 5, student: "Farah Sheikh", batch: "Batch Gamma", amount: "₹8,000", date: "26 Feb 2026", status: "Approved" },
    ],
    earningsRows: [
      { id: 1, recipient: "Meera Nair", role: "Tutor", amount: "₹35,000", month: "Mar 2026", status: "Unpaid" },
      { id: 2, recipient: "Suresh Kumar", role: "Mentor", amount: "₹28,000", month: "Mar 2026", status: "Paid" },
      { id: 3, recipient: "Divya Menon", role: "Intern", amount: "₹12,000", month: "Mar 2026", status: "Processing" },
      { id: 4, recipient: "Kiran Reddy", role: "Tutor", amount: "₹40,000", month: "Mar 2026", status: "Unpaid" },
      { id: 5, recipient: "Ananya Singh", role: "Mentor", amount: "₹30,000", month: "Mar 2026", status: "Paid" },
    ],
  },
  "2026-02": {
    label: "February 2026",
    revenue: 1_20_000,
    earnings: 88_000,
    totalProfit: 8_02_500,
    pendingTopups: 5,
    pendingPayoutAmount: 90_000,
    unpaidEarningsCount: 8,
    walletBalance: 2_15_000,
    walletTopups: 28_000,
    payoutCompleted: 62_000,
    topupRows: [
      { id: 1, student: "Neha Gupta", batch: "Batch Beta", amount: "₹6,000", date: "12 Feb 2026", status: "Approved" },
      { id: 2, student: "Karan Mehta", batch: "Batch Gamma", amount: "₹4,500", date: "10 Feb 2026", status: "Pending" },
      { id: 3, student: "Siddharth Rao", batch: "Batch Gamma", amount: "₹9,000", date: "08 Feb 2026", status: "Approved" },
      { id: 4, student: "Mohammed Salim", batch: "Batch Alpha", amount: "₹3,500", date: "05 Feb 2026", status: "Rejected" },
      { id: 5, student: "Divya Menon", batch: "Batch Beta", amount: "₹7,000", date: "02 Feb 2026", status: "Pending" },
    ],
    earningsRows: [
      { id: 1, recipient: "Ravi Shankar", role: "Tutor", amount: "₹32,000", month: "Feb 2026", status: "Paid" },
      { id: 2, recipient: "Lakshmi Rao", role: "Mentor", amount: "₹25,000", month: "Feb 2026", status: "Unpaid" },
      { id: 3, recipient: "Rahul Das", role: "Intern", amount: "₹10,000", month: "Feb 2026", status: "Processing" },
      { id: 4, recipient: "Sunita Verma", role: "Tutor", amount: "₹38,000", month: "Feb 2026", status: "Paid" },
      { id: 5, recipient: "Amit Kapoor", role: "Mentor", amount: "₹27,000", month: "Feb 2026", status: "Unpaid" },
    ],
  },
  "2026-01": {
    label: "January 2026",
    revenue: 1_10_000,
    earnings: 80_000,
    totalProfit: 7_62_500,
    pendingTopups: 3,
    pendingPayoutAmount: 72_000,
    unpaidEarningsCount: 6,
    walletBalance: 1_90_000,
    walletTopups: 22_000,
    payoutCompleted: 58_000,
    topupRows: [
      { id: 1, student: "Aisha Khan", batch: "Batch Alpha", amount: "₹5,000", date: "20 Jan 2026", status: "Approved" },
      { id: 2, student: "Rohan Verma", batch: "Batch Beta", amount: "₹8,000", date: "18 Jan 2026", status: "Approved" },
      { id: 3, student: "Priya Sharma", batch: "Batch Alpha", amount: "₹4,000", date: "15 Jan 2026", status: "Pending" },
      { id: 4, student: "Farah Sheikh", batch: "Batch Gamma", amount: "₹5,000", date: "10 Jan 2026", status: "Approved" },
      { id: 5, student: "Karan Mehta", batch: "Batch Gamma", amount: "₹3,000", date: "07 Jan 2026", status: "Rejected" },
    ],
    earningsRows: [
      { id: 1, recipient: "Meera Nair", role: "Tutor", amount: "₹30,000", month: "Jan 2026", status: "Paid" },
      { id: 2, recipient: "Suresh Kumar", role: "Mentor", amount: "₹24,000", month: "Jan 2026", status: "Paid" },
      { id: 3, recipient: "Kiran Reddy", role: "Tutor", amount: "₹36,000", month: "Jan 2026", status: "Paid" },
      { id: 4, recipient: "Divya Menon", role: "Intern", amount: "₹10,000", month: "Jan 2026", status: "Paid" },
      { id: 5, recipient: "Ananya Singh", role: "Mentor", amount: "₹26,000", month: "Jan 2026", status: "Processing" },
    ],
  },
};

const MONTHS = [
  { key: "2026-03", label: "March 2026" },
  { key: "2026-02", label: "February 2026" },
  { key: "2026-01", label: "January 2026" },
];

const chartBars: Record<string, { label: string; revenue: number; earnings: number }[]> = {
  "2026-03": [
    { label: "Oct", revenue: 63, earnings: 44 },
    { label: "Nov", revenue: 70, earnings: 52 },
    { label: "Dec", revenue: 78, earnings: 58 },
    { label: "Jan", revenue: 66, earnings: 48 },
    { label: "Feb", revenue: 82, earnings: 60 },
    { label: "Mar", revenue: 90, earnings: 66 },
  ],
  "2026-02": [
    { label: "Sep", revenue: 55, earnings: 38 },
    { label: "Oct", revenue: 63, earnings: 44 },
    { label: "Nov", revenue: 70, earnings: 52 },
    { label: "Dec", revenue: 78, earnings: 58 },
    { label: "Jan", revenue: 66, earnings: 48 },
    { label: "Feb", revenue: 82, earnings: 60 },
  ],
  "2026-01": [
    { label: "Aug", revenue: 48, earnings: 35 },
    { label: "Sep", revenue: 55, earnings: 38 },
    { label: "Oct", revenue: 63, earnings: 44 },
    { label: "Nov", revenue: 70, earnings: 52 },
    { label: "Dec", revenue: 78, earnings: 58 },
    { label: "Jan", revenue: 66, earnings: 48 },
  ],
};

// ─── Badge maps ───────────────────────────────────────────────────────────────

const topupBadge: Record<TopupRow["status"], string> = {
  Pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  Approved: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  Rejected: "bg-destructive/10 text-destructive border-destructive/20",
};

const earningsBadge: Record<EarningsRow["status"], string> = {
  Unpaid: "bg-destructive/10 text-destructive border-destructive/20",
  Processing: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  Paid: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const SectionHeading = ({ title, sub }: { title: string; sub?: string }) => (
  <div className="mb-4">
    <h2 className="text-lg font-semibold text-foreground">{title}</h2>
    {sub && <p className="text-sm text-muted-foreground mt-0.5">{sub}</p>}
  </div>
);

const StatCard = ({ card, onClick }: { card: KpiCard; onClick?: () => void }) => {
  const Icon = card.icon;
  return (
    <Card
      onClick={onClick}
      className={`border-border/50 shadow-sm rounded-xl transition-all duration-200 ${onClick ? "cursor-pointer hover:shadow-lg hover:scale-[1.02]" : ""
        }`}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{card.label}</CardTitle>
        <div className={`w-9 h-9 rounded-full flex items-center justify-center ${card.iconBg}`}>
          <Icon className={`w-4 h-4 ${card.iconColor}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${card.valueColor ?? "text-foreground"}`}>
          {card.value}
        </div>
        {card.trend && (
          <div className="flex items-center gap-1 mt-1">
            {card.trendUp
              ? <TrendingUp className="w-3 h-3 text-emerald-600" />
              : <TrendingDown className="w-3 h-3 text-destructive" />}
            <span className={`text-xs font-medium ${card.trendUp ? "text-emerald-600" : "text-destructive"}`}>
              {card.trend}
            </span>
          </div>
        )}
        <p className="text-xs text-muted-foreground mt-1">{card.sub}</p>
      </CardContent>
    </Card>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const FinanceDashboard = () => {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState("2026-03");
  const d = monthlyData[selectedMonth];
  const profit = d.revenue - d.earnings;

  // Section 1 – Financial Health
  const healthCards: KpiCard[] = [
    {
      label: "This Month Revenue",
      value: fmt(d.revenue),
      sub: `Total fees collected in ${d.label}`,
      trend: "+9% vs last month",
      trendUp: true,
      icon: IndianRupee,
      iconBg: "bg-emerald-100/60",
      iconColor: "text-emerald-600",
      valueColor: "text-emerald-600",
      href: "/finance/reports/revenue",
    },
    {
      label: "This Month Earnings",
      value: fmt(d.earnings),
      sub: "Tutor + Mentor + Intern",
      trend: "+5% vs last month",
      trendUp: true,
      icon: BarChart2,
      iconBg: "bg-violet-100/60",
      iconColor: "text-violet-600",
      href: "/finance/reports/expense",
    },
    {
      label: "This Month Profit",
      value: fmt(profit),
      sub: "Revenue minus Earnings",
      trend: profit > 0 ? "Positive margin" : "Negative",
      trendUp: profit > 0,
      icon: TrendingUp,
      iconBg: "bg-blue-100/60",
      iconColor: "text-blue-600",
      valueColor: profit > 0 ? "text-emerald-600" : "text-destructive",
      href: "/finance/reports/profit",
    },
    {
      label: "Total Profit (All Time)",
      value: fmt(d.totalProfit),
      sub: "Cumulative net profit",
      icon: Sparkles,
      iconBg: "bg-amber-100/60",
      iconColor: "text-amber-600",
      valueColor: "text-amber-600",
      href: "/finance/reports/overview",
    },
  ];

  // Section 2 – Operational Alerts
  const alertCards: KpiCard[] = [
    {
      label: "Pending Top-up Requests",
      value: String(d.pendingTopups),
      sub: "Awaiting admin approval",
      icon: CreditCard,
      iconBg: "bg-amber-100/60",
      iconColor: "text-amber-600",
      valueColor: "text-amber-600",
      href: "/finance/wallets/topup",
    },
    {
      label: "Pending Payout Amount",
      value: fmt(d.pendingPayoutAmount),
      sub: "Scheduled disbursements",
      icon: ArrowDownToLine,
      iconBg: "bg-destructive/10",
      iconColor: "text-destructive",
      valueColor: "text-destructive",
      href: "/finance/payouts/pending",
    },
    {
      label: "Unpaid Earnings Count",
      value: String(d.unpaidEarningsCount),
      sub: "Tutors, mentors & interns",
      icon: AlertCircle,
      iconBg: "bg-orange-100/60",
      iconColor: "text-orange-600",
      valueColor: "text-orange-600",
      href: "/finance/payouts/unpaid",
    },
    {
      label: "Total Wallet Balance (Liability)",
      value: fmt(d.walletBalance),
      sub: "Across all student wallets",
      icon: Wallet,
      iconBg: "bg-indigo-100/60",
      iconColor: "text-indigo-600",
      href: "/finance/wallets/students",
    },
  ];

  // Section 3
  const flowCards: KpiCard[] = [
    {
      label: "Wallet Top-ups",
      value: fmt(d.walletTopups),
      sub: "Student wallet credits",
      icon: Wallet,
      iconBg: "bg-blue-100/60",
      iconColor: "text-blue-600",
    },
    {
      label: "Course Revenue",
      value: fmt(d.revenue),
      sub: "From active batches",
      icon: IndianRupee,
      iconBg: "bg-emerald-100/60",
      iconColor: "text-emerald-600",
      valueColor: "text-emerald-600",
    },
    {
      label: "Earnings Generated",
      value: fmt(d.earnings),
      sub: "Tutor + Mentor + Intern",
      icon: BarChart2,
      iconBg: "bg-violet-100/60",
      iconColor: "text-violet-600",
    },
    {
      label: "Payout Completed",
      value: fmt(d.payoutCompleted),
      sub: "Successfully disbursed",
      icon: CheckCircle2,
      iconBg: "bg-emerald-100/60",
      iconColor: "text-emerald-600",
      valueColor: "text-emerald-600",
    },
  ];

  const bars = chartBars[selectedMonth];

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-10 max-w-7xl mx-auto pb-10">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
              Finance Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Financial health, operational alerts, and monthly activity overview.
            </p>
          </div>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[180px] bg-background">
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map(m => (
                <SelectItem key={m.key} value={m.key}>{m.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* ── Section 1: Financial Health ── */}
        <section>
          <SectionHeading title="Financial Health" sub={`Revenue, earnings and profit — ${d.label}`} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {healthCards.map(c => <StatCard key={c.label} card={c} onClick={c.href ? () => navigate(c.href!) : undefined} />)}
          </div>
        </section>

        {/* ── Section 2: Operational Alerts ── */}
        <section>
          <SectionHeading title="Operational Alerts" sub="Items requiring immediate action." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {alertCards.map(c => <StatCard key={c.label} card={c} onClick={c.href ? () => navigate(c.href!) : undefined} />)}
          </div>
        </section>

        {/* ── Section 3: Monthly Flow Movement ── */}
        <section>
          <SectionHeading title="Monthly Flow Movement" sub={`Cash movement breakdown — ${d.label}`} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {flowCards.map(c => <StatCard key={c.label} card={c} />)}
          </div>
        </section>

        {/* ── Section 4: Chart Placeholder ── */}
        <section>
          <SectionHeading
            title="Revenue vs Earnings (Monthly Trend)"
            sub={`Last 6 months ending ${d.label} — placeholder view.`}
          />
          <Card className="border-border/50 shadow-sm rounded-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">
                Revenue vs Earnings — {bars[0].label} to {bars[5].label}
              </CardTitle>
              <CardDescription>
                Representative bars. Integrate Recharts or Chart.js for live data.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-3 h-44 px-2 pt-4">
                {bars.map(bar => (
                  <div key={bar.label} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex items-end gap-0.5 h-32">
                      <div
                        className="flex-1 bg-emerald-500/25 rounded-t border border-emerald-500/30 transition-all duration-500"
                        style={{ height: `${bar.revenue}%` }}
                      />
                      <div
                        className="flex-1 bg-violet-500/20 rounded-t border border-violet-500/25 transition-all duration-500"
                        style={{ height: `${bar.earnings}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{bar.label}</span>
                  </div>
                ))}
                <div className="ml-4 flex flex-col gap-2 justify-center pb-5">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground whitespace-nowrap">
                    <span className="w-3 h-3 rounded-sm bg-emerald-500/30 border border-emerald-500/40 inline-block shrink-0" />
                    Revenue
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground whitespace-nowrap">
                    <span className="w-3 h-3 rounded-sm bg-violet-500/25 border border-violet-500/30 inline-block shrink-0" />
                    Earnings
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* ── Section 5: Recent Activity ── */}
        <section>
          <SectionHeading
            title="Recent Activity"
            sub={`Latest top-up requests and earnings — ${d.label}`}
          />
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

            {/* Top-up Requests Table */}
            <Card className="border-border/50 shadow-sm rounded-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Recent Top-up Requests</CardTitle>
                <CardDescription>5 most recent wallet top-up submissions</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50 bg-muted/30">
                        <th className="text-left px-5 py-2.5 font-medium text-muted-foreground">Student</th>
                        <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Batch</th>
                        <th className="text-right px-3 py-2.5 font-medium text-muted-foreground">Amount</th>
                        <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Date</th>
                        <th className="text-left px-3 pr-5 py-2.5 font-medium text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {d.topupRows.map(row => (
                        <tr key={row.id} className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors">
                          <td className="px-5 py-3 font-medium">{row.student}</td>
                          <td className="px-3 py-3 text-muted-foreground">{row.batch}</td>
                          <td className="px-3 py-3 text-right font-semibold">{row.amount}</td>
                          <td className="px-3 py-3 text-muted-foreground whitespace-nowrap">{row.date}</td>
                          <td className="px-3 pr-5 py-3">
                            <Badge className={`shadow-none border text-xs ${topupBadge[row.status]}`}>
                              {row.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Earnings Table */}
            <Card className="border-border/50 shadow-sm rounded-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Recent Earnings Generated</CardTitle>
                <CardDescription>Latest tutor, mentor & intern earnings</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50 bg-muted/30">
                        <th className="text-left px-5 py-2.5 font-medium text-muted-foreground">Recipient</th>
                        <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Role</th>
                        <th className="text-right px-3 py-2.5 font-medium text-muted-foreground">Amount</th>
                        <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Month</th>
                        <th className="text-left px-3 pr-5 py-2.5 font-medium text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {d.earningsRows.map(row => (
                        <tr key={row.id} className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors">
                          <td className="px-5 py-3 font-medium">{row.recipient}</td>
                          <td className="px-3 py-3 text-muted-foreground">{row.role}</td>
                          <td className="px-3 py-3 text-right font-semibold">{row.amount}</td>
                          <td className="px-3 py-3 text-muted-foreground whitespace-nowrap">{row.month}</td>
                          <td className="px-3 pr-5 py-3">
                            <Badge className={`shadow-none border text-xs ${earningsBadge[row.status]}`}>
                              {row.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

          </div>
        </section>

      </div>
    </DashboardLayout>
  );
};

export default FinanceDashboard;
