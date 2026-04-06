import { useMemo, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    TrendingUp, TrendingDown, ArrowUpRight, Landmark, Download,
    Users, Briefcase, BookOpen, Wallet, CreditCard, BadgeDollarSign,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type DateFilter = "this-month" | "last-month" | "this-year";

interface MonthData {
    month: string;
    revenue: number;
    earnings: number;
    payout: number;
}

// ─── Mock Dataset ─────────────────────────────────────────────────────────────

const allMonths: MonthData[] = [
    { month: "October 2025", revenue: 180000, earnings: 144000, payout: 85000 },
    { month: "November 2025", revenue: 195000, earnings: 156000, payout: 91000 },
    { month: "December 2025", revenue: 210000, earnings: 168000, payout: 97000 },
    { month: "January 2026", revenue: 225000, earnings: 180000, payout: 103000 },
    { month: "February 2026", revenue: 240000, earnings: 192000, payout: 109000 },
    { month: "March 2026", revenue: 255000, earnings: 204000, payout: 115000 },
];

// All the per-period breakdown data stays same shape, just sliced differently
const breakdownByFilter: Record<DateFilter, {
    coursePayments: number; walletRecharges: number; otherIncome: number;
    tutorPayments: number; mentorPayments: number; internStipend: number;
    totalStudents: number; totalStaff: number;
}> = {
    "this-month": {
        coursePayments: 166500, walletRecharges: 72000, otherIncome: 16500,
        tutorPayments: 63000, mentorPayments: 28800, internStipend: 23200,
        totalStudents: 48, totalStaff: 11,
    },
    "last-month": {
        coursePayments: 156000, walletRecharges: 67200, otherIncome: 16800,
        tutorPayments: 59000, mentorPayments: 27200, internStipend: 22800,
        totalStudents: 44, totalStaff: 11,
    },
    "this-year": {
        coursePayments: 726000, walletRecharges: 540000, otherIncome: 39000,
        tutorPayments: 285000, mentorPayments: 120000, internStipend: 95000,
        totalStudents: 48, totalStaff: 11,
    },
};

const sliceForFilter = (f: DateFilter): MonthData[] => {
    if (f === "this-month") return allMonths.slice(-1);
    if (f === "last-month") return allMonths.slice(-2, -1);
    return allMonths;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

// ─── Sub-components ───────────────────────────────────────────────────────────

interface KpiProps {
    label: string;
    value: string;
    sub?: string;
    icon: React.ElementType;
    iconBg: string;
    iconColor: string;
    valueColor?: string;
}

const KpiCard = ({ label, value, sub, icon: Icon, iconBg, iconColor, valueColor }: KpiProps) => (
    <Card className="border-border/50 shadow-sm rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
            <div className={`w-9 h-9 rounded-full flex items-center justify-center ${iconBg}`}>
                <Icon className={`w-4 h-4 ${iconColor}`} />
            </div>
        </CardHeader>
        <CardContent>
            <div className={`text-3xl font-bold ${valueColor ?? "text-foreground"}`}>{value}</div>
            {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
        </CardContent>
    </Card>
);

interface SmallCardProps {
    label: string;
    value: string;
    icon: React.ElementType;
    iconBg: string;
    iconColor: string;
    valueColor?: string;
}

const SmallCard = ({ label, value, icon: Icon, iconBg, iconColor, valueColor }: SmallCardProps) => (
    <Card className="border-border/50 shadow-sm rounded-xl">
        <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center ${iconBg}`}>
                    <Icon className={`w-4 h-4 ${iconColor}`} />
                </div>
                <div>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className={`text-lg font-bold ${valueColor ?? "text-foreground"}`}>{value}</p>
                </div>
            </div>
        </CardContent>
    </Card>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const FinanceReports = () => {
    const [dateFilter, setDateFilter] = useState<DateFilter>("this-month");

    const bd = breakdownByFilter[dateFilter];
    const months = useMemo(() => sliceForFilter(dateFilter), [dateFilter]);

    // Aggregate KPI totals from the sliced month data
    const totalRevenue = months.reduce((s, m) => s + m.revenue, 0);
    const totalEarnings = months.reduce((s, m) => s + m.earnings, 0);
    const totalPayout = months.reduce((s, m) => s + m.payout, 0);
    const netProfit = totalRevenue - totalPayout;

    return (
        <DashboardLayout>
            <div className="animate-fade-in space-y-7 max-w-7xl mx-auto pb-10">

                {/* ── Header ── */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
                            Finance Reports
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Aggregated financial summary across all streams.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Select value={dateFilter} onValueChange={v => setDateFilter(v as DateFilter)}>
                            <SelectTrigger className="w-40 bg-background">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="this-month">This Month</SelectItem>
                                <SelectItem value="last-month">Last Month</SelectItem>
                                <SelectItem value="this-year">This Year</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            Export
                        </Button>
                    </div>
                </div>

                {/* ── 6 KPI Summary Cards ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                    <KpiCard
                        label="Total Revenue"
                        value={fmt(totalRevenue)}
                        sub="All income streams"
                        icon={TrendingUp}
                        iconBg="bg-emerald-100/60"
                        iconColor="text-emerald-600"
                        valueColor="text-emerald-600"
                    />
                    <KpiCard
                        label="Total Earnings"
                        value={fmt(totalEarnings)}
                        sub="Revenue after cost"
                        icon={ArrowUpRight}
                        iconBg="bg-blue-100/60"
                        iconColor="text-blue-600"
                        valueColor="text-blue-600"
                    />
                    <KpiCard
                        label="Total Payout"
                        value={fmt(totalPayout)}
                        sub="Tutors, mentors, interns"
                        icon={Landmark}
                        iconBg="bg-amber-100/60"
                        iconColor="text-amber-600"
                        valueColor="text-amber-600"
                    />
                    <KpiCard
                        label="Net Profit"
                        value={fmt(netProfit)}
                        sub="Revenue − Payout"
                        icon={netProfit >= 0 ? TrendingUp : TrendingDown}
                        iconBg={netProfit >= 0 ? "bg-emerald-100/60" : "bg-destructive/10"}
                        iconColor={netProfit >= 0 ? "text-emerald-600" : "text-destructive"}
                        valueColor={netProfit >= 0 ? "text-emerald-600" : "text-destructive"}
                    />
                    <KpiCard
                        label="Total Students"
                        value={String(bd.totalStudents)}
                        sub="Enrolled across all batches"
                        icon={Users}
                        iconBg="bg-violet-100/60"
                        iconColor="text-violet-600"
                    />
                    <KpiCard
                        label="Total Active Staff"
                        value={String(bd.totalStaff)}
                        sub="Tutors, mentors & interns"
                        icon={Briefcase}
                        iconBg="bg-indigo-100/60"
                        iconColor="text-indigo-600"
                    />
                </div>

                {/* ── Revenue & Expense Breakdown ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Revenue Breakdown */}
                    <Card className="border-border/50 shadow-sm rounded-xl">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                Revenue Breakdown
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <SmallCard
                                label="Course Payments"
                                value={fmt(bd.coursePayments)}
                                icon={BookOpen}
                                iconBg="bg-emerald-100/60"
                                iconColor="text-emerald-600"
                                valueColor="text-emerald-600"
                            />
                            <SmallCard
                                label="Wallet Recharges"
                                value={fmt(bd.walletRecharges)}
                                icon={Wallet}
                                iconBg="bg-blue-100/60"
                                iconColor="text-blue-600"
                                valueColor="text-blue-600"
                            />
                            <SmallCard
                                label="Other Income"
                                value={fmt(bd.otherIncome)}
                                icon={CreditCard}
                                iconBg="bg-indigo-100/60"
                                iconColor="text-indigo-600"
                                valueColor="text-indigo-600"
                            />
                        </CardContent>
                    </Card>

                    {/* Expense Breakdown */}
                    <Card className="border-border/50 shadow-sm rounded-xl">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-amber-500" />
                                Expense Breakdown
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <SmallCard
                                label="Tutor Payments"
                                value={fmt(bd.tutorPayments)}
                                icon={BadgeDollarSign}
                                iconBg="bg-amber-100/60"
                                iconColor="text-amber-600"
                                valueColor="text-amber-600"
                            />
                            <SmallCard
                                label="Mentor Payments"
                                value={fmt(bd.mentorPayments)}
                                icon={BadgeDollarSign}
                                iconBg="bg-orange-100/60"
                                iconColor="text-orange-600"
                                valueColor="text-orange-600"
                            />
                            <SmallCard
                                label="Intern Stipend"
                                value={fmt(bd.internStipend)}
                                icon={BadgeDollarSign}
                                iconBg="bg-destructive/10"
                                iconColor="text-destructive"
                                valueColor="text-destructive"
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* ── Monthly Overview Table ── */}
                <Card className="border-border/50 shadow-sm rounded-xl">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base font-semibold">
                            Monthly Overview
                            <span className="ml-2 text-sm font-normal text-muted-foreground">
                                ({months.length} {months.length === 1 ? "month" : "months"})
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border/50 bg-muted/30">
                                        <th className="text-left px-5 py-3 font-medium text-muted-foreground">Month</th>
                                        <th className="text-right px-4 py-3 font-medium text-muted-foreground">Revenue (₹)</th>
                                        <th className="text-right px-4 py-3 font-medium text-muted-foreground">Earnings (₹)</th>
                                        <th className="text-right px-4 py-3 font-medium text-muted-foreground">Payout (₹)</th>
                                        <th className="text-right px-4 pr-5 py-3 font-medium text-muted-foreground">Net Profit (₹)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {months.map((m, i) => {
                                        const profit = m.revenue - m.payout;
                                        return (
                                            <tr
                                                key={i}
                                                className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors"
                                            >
                                                <td className="px-5 py-3 font-medium">{m.month}</td>
                                                <td className="px-4 py-3 text-right text-emerald-600 font-semibold">{fmt(m.revenue)}</td>
                                                <td className="px-4 py-3 text-right text-blue-600 font-semibold">{fmt(m.earnings)}</td>
                                                <td className="px-4 py-3 text-right text-amber-600 font-semibold">{fmt(m.payout)}</td>
                                                <td className={`px-4 pr-5 py-3 text-right font-bold ${profit >= 0 ? "text-emerald-600" : "text-destructive"}`}>
                                                    {fmt(profit)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {/* ── Totals Row ── */}
                                    <tr className="bg-muted/40 border-t-2 border-border/50">
                                        <td className="px-5 py-3 font-bold">Total</td>
                                        <td className="px-4 py-3 text-right font-bold text-emerald-600">{fmt(totalRevenue)}</td>
                                        <td className="px-4 py-3 text-right font-bold text-blue-600">{fmt(totalEarnings)}</td>
                                        <td className="px-4 py-3 text-right font-bold text-amber-600">{fmt(totalPayout)}</td>
                                        <td className={`px-4 pr-5 py-3 text-right font-bold ${netProfit >= 0 ? "text-emerald-600" : "text-destructive"}`}>
                                            {fmt(netProfit)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </DashboardLayout>
    );
};

export default FinanceReports;
