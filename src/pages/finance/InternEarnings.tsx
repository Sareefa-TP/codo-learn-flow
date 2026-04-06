import { useMemo, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, IndianRupee, CheckCircle2, Clock, Users } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type EarningStatus = "Paid" | "Unpaid";
type StatusFilter = "all" | EarningStatus;

interface InternEarning {
    id: number;
    date: string;
    intern: string;
    month: string;
    description: string;
    amount: number;
    status: EarningStatus;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockEarnings: InternEarning[] = [
    { id: 1, date: "03 Mar 2026", intern: "Karan Mehta", month: "March 2026", description: "Monthly internship stipend", amount: 8000, status: "Unpaid" },
    { id: 2, date: "03 Mar 2026", intern: "Divya Menon", month: "March 2026", description: "Monthly internship stipend", amount: 8000, status: "Unpaid" },
    { id: 3, date: "03 Mar 2026", intern: "Rohan Singh", month: "March 2026", description: "Monthly internship stipend", amount: 10000, status: "Unpaid" },
    { id: 4, date: "03 Mar 2026", intern: "Pooja Nair", month: "March 2026", description: "Monthly internship stipend", amount: 8000, status: "Unpaid" },
    { id: 5, date: "28 Feb 2026", intern: "Karan Mehta", month: "February 2026", description: "Monthly internship stipend", amount: 8000, status: "Paid" },
    { id: 6, date: "28 Feb 2026", intern: "Divya Menon", month: "February 2026", description: "Monthly internship stipend", amount: 8000, status: "Paid" },
    { id: 7, date: "28 Feb 2026", intern: "Rohan Singh", month: "February 2026", description: "Monthly internship stipend", amount: 10000, status: "Paid" },
    { id: 8, date: "28 Feb 2026", intern: "Pooja Nair", month: "February 2026", description: "Monthly internship stipend", amount: 8000, status: "Paid" },
    { id: 9, date: "31 Jan 2026", intern: "Karan Mehta", month: "January 2026", description: "Monthly internship stipend", amount: 8000, status: "Paid" },
    { id: 10, date: "31 Jan 2026", intern: "Divya Menon", month: "January 2026", description: "Monthly internship stipend", amount: 8000, status: "Paid" },
    { id: 11, date: "31 Jan 2026", intern: "Rohan Singh", month: "January 2026", description: "Monthly internship stipend", amount: 10000, status: "Unpaid" },
    { id: 12, date: "31 Jan 2026", intern: "Pooja Nair", month: "January 2026", description: "Monthly internship stipend", amount: 8000, status: "Paid" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

// ─── KPI Card ─────────────────────────────────────────────────────────────────

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

// ─── Main Component ───────────────────────────────────────────────────────────

const InternEarnings = () => {
    const [search, setSearch] = useState("");
    const [monthFilter, setMonthFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

    // Dynamic month list from data
    const monthOptions = useMemo(
        () => Array.from(new Set(mockEarnings.map(r => r.month))),
        []
    );

    // Unique intern count
    const internCount = useMemo(
        () => new Set(mockEarnings.map(r => r.intern)).size,
        []
    );

    // Filtered rows
    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return mockEarnings.filter(r => {
            const matchSearch = !q || r.intern.toLowerCase().includes(q);
            const matchMonth = monthFilter === "all" || r.month === monthFilter;
            const matchStatus = statusFilter === "all" || r.status === statusFilter;
            return matchSearch && matchMonth && matchStatus;
        });
    }, [search, monthFilter, statusFilter]);

    // KPI — full dataset
    const totalEarnings = mockEarnings.reduce((s, r) => s + r.amount, 0);
    const unpaidEarnings = mockEarnings.filter(r => r.status === "Unpaid").reduce((s, r) => s + r.amount, 0);
    const paidEarnings = mockEarnings.filter(r => r.status === "Paid").reduce((s, r) => s + r.amount, 0);

    const hasFilter = search.trim() !== "" || monthFilter !== "all" || statusFilter !== "all";
    const reset = () => { setSearch(""); setMonthFilter("all"); setStatusFilter("all"); };

    return (
        <DashboardLayout>
            <div className="animate-fade-in space-y-6 max-w-7xl mx-auto pb-10">

                {/* ── Header ── */}
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
                        Intern Earnings
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Monthly stipend records for all interns.
                    </p>
                </div>

                {/* ── KPI Cards ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    <KpiCard
                        label="Total Intern Earnings"
                        value={fmt(totalEarnings)}
                        sub={`${mockEarnings.length} stipend records`}
                        icon={IndianRupee}
                        iconBg="bg-indigo-100/60"
                        iconColor="text-indigo-600"
                        valueColor="text-indigo-600"
                    />
                    <KpiCard
                        label="Unpaid Earnings"
                        value={fmt(unpaidEarnings)}
                        sub="Awaiting disbursement"
                        icon={Clock}
                        iconBg="bg-amber-100/60"
                        iconColor="text-amber-600"
                        valueColor="text-amber-600"
                    />
                    <KpiCard
                        label="Paid Earnings"
                        value={fmt(paidEarnings)}
                        sub="Successfully disbursed"
                        icon={CheckCircle2}
                        iconBg="bg-emerald-100/60"
                        iconColor="text-emerald-600"
                        valueColor="text-emerald-600"
                    />
                    <KpiCard
                        label="Total Interns"
                        value={String(internCount)}
                        sub="Active interns"
                        icon={Users}
                        iconBg="bg-blue-100/60"
                        iconColor="text-blue-600"
                    />
                </div>

                {/* ── Table Card ── */}
                <Card className="border-border/50 shadow-sm rounded-xl">
                    <CardHeader className="pb-4">
                        <div className="flex flex-col gap-4">

                            {/* Title + Reset */}
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base font-semibold">
                                    Stipend Records
                                    <span className="ml-2 text-sm font-normal text-muted-foreground">
                                        ({filtered.length} of {mockEarnings.length})
                                    </span>
                                </CardTitle>
                                {hasFilter && (
                                    <button
                                        onClick={reset}
                                        className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
                                    >
                                        Reset Filters
                                    </button>
                                )}
                            </div>

                            {/* Filter Bar */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                {/* Search */}
                                <div className="relative flex-1 max-w-xs">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by intern name..."
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        className="pl-9 bg-background"
                                    />
                                </div>

                                {/* Month */}
                                <Select value={monthFilter} onValueChange={setMonthFilter}>
                                    <SelectTrigger className="w-full sm:w-[180px] bg-background">
                                        <SelectValue placeholder="All Months" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Months</SelectItem>
                                        {monthOptions.map(m => (
                                            <SelectItem key={m} value={m}>{m}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {/* Status */}
                                <Select value={statusFilter} onValueChange={v => setStatusFilter(v as StatusFilter)}>
                                    <SelectTrigger className="w-full sm:w-[150px] bg-background">
                                        <SelectValue placeholder="All Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="Paid">Paid</SelectItem>
                                        <SelectItem value="Unpaid">Unpaid</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border/50 bg-muted/30">
                                        <th className="text-left px-5 py-3 font-medium text-muted-foreground">Date</th>
                                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Intern</th>
                                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Month</th>
                                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Description</th>
                                        <th className="text-right px-4 py-3 font-medium text-muted-foreground">Amount</th>
                                        <th className="text-left px-4 pr-5 py-3 font-medium text-muted-foreground">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="text-center py-12 text-muted-foreground">
                                                No records match the current filters.
                                            </td>
                                        </tr>
                                    ) : (
                                        filtered.map(r => (
                                            <tr
                                                key={r.id}
                                                className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors"
                                            >
                                                <td className="px-5 py-3 text-muted-foreground whitespace-nowrap">{r.date}</td>
                                                <td className="px-4 py-3 font-medium">{r.intern}</td>
                                                <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{r.month}</td>
                                                <td className="px-4 py-3 text-muted-foreground">{r.description}</td>
                                                <td className="px-4 py-3 text-right font-semibold">{fmt(r.amount)}</td>
                                                <td className={`px-4 pr-5 py-3 font-medium ${r.status === "Paid" ? "text-green-600" : "text-yellow-600"
                                                    }`}>
                                                    {r.status}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </DashboardLayout>
    );
};

export default InternEarnings;
