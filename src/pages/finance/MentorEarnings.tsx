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

interface MentorEarning {
    id: number;
    date: string;
    mentor: string;
    batch: string;
    reviews: number;
    ratePerReview: number;
    status: EarningStatus;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockEarnings: MentorEarning[] = [
    { id: 1, date: "03 Mar 2026", mentor: "Anjali Desai", batch: "Batch Alpha – Jan 2026", reviews: 15, ratePerReview: 800, status: "Unpaid" },
    { id: 2, date: "03 Mar 2026", mentor: "Vikram Pillai", batch: "Batch Beta – Feb 2026", reviews: 12, ratePerReview: 800, status: "Paid" },
    { id: 3, date: "03 Mar 2026", mentor: "Deepa Menon", batch: "Batch Gamma – Mar 2026", reviews: 18, ratePerReview: 1000, status: "Unpaid" },
    { id: 4, date: "28 Feb 2026", mentor: "Anjali Desai", batch: "Batch Beta – Feb 2026", reviews: 10, ratePerReview: 800, status: "Paid" },
    { id: 5, date: "28 Feb 2026", mentor: "Vikram Pillai", batch: "Batch Alpha – Jan 2026", reviews: 14, ratePerReview: 800, status: "Paid" },
    { id: 6, date: "28 Feb 2026", mentor: "Shalini Roy", batch: "Batch Gamma – Mar 2026", reviews: 20, ratePerReview: 1000, status: "Unpaid" },
    { id: 7, date: "20 Feb 2026", mentor: "Deepa Menon", batch: "Batch Alpha – Jan 2026", reviews: 12, ratePerReview: 1000, status: "Paid" },
    { id: 8, date: "20 Feb 2026", mentor: "Shalini Roy", batch: "Batch Beta – Feb 2026", reviews: 16, ratePerReview: 1000, status: "Paid" },
    { id: 9, date: "15 Feb 2026", mentor: "Anjali Desai", batch: "Batch Gamma – Mar 2026", reviews: 18, ratePerReview: 800, status: "Unpaid" },
    { id: 10, date: "15 Feb 2026", mentor: "Vikram Pillai", batch: "Batch Gamma – Mar 2026", reviews: 14, ratePerReview: 800, status: "Paid" },
    { id: 11, date: "10 Feb 2026", mentor: "Shalini Roy", batch: "Batch Alpha – Jan 2026", reviews: 10, ratePerReview: 1000, status: "Paid" },
    { id: 12, date: "05 Feb 2026", mentor: "Deepa Menon", batch: "Batch Beta – Feb 2026", reviews: 8, ratePerReview: 1000, status: "Unpaid" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const amount = (r: MentorEarning) => r.reviews * r.ratePerReview;

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

const MentorEarnings = () => {
    const [search, setSearch] = useState("");
    const [batchFilter, setBatchFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

    // Dynamic batch list
    const batchOptions = useMemo(
        () => Array.from(new Set(mockEarnings.map(r => r.batch))).sort(),
        []
    );

    // Unique mentor count
    const mentorCount = useMemo(
        () => new Set(mockEarnings.map(r => r.mentor)).size,
        []
    );

    // Filtered rows
    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return mockEarnings.filter(r => {
            const matchSearch = !q || r.mentor.toLowerCase().includes(q);
            const matchBatch = batchFilter === "all" || r.batch === batchFilter;
            const matchStatus = statusFilter === "all" || r.status === statusFilter;
            return matchSearch && matchBatch && matchStatus;
        });
    }, [search, batchFilter, statusFilter]);

    // KPI — full dataset
    const totalEarnings = mockEarnings.reduce((s, r) => s + amount(r), 0);
    const unpaidEarnings = mockEarnings.filter(r => r.status === "Unpaid").reduce((s, r) => s + amount(r), 0);
    const paidEarnings = mockEarnings.filter(r => r.status === "Paid").reduce((s, r) => s + amount(r), 0);

    const hasFilter = search.trim() !== "" || batchFilter !== "all" || statusFilter !== "all";
    const reset = () => { setSearch(""); setBatchFilter("all"); setStatusFilter("all"); };

    return (
        <DashboardLayout>
            <div className="animate-fade-in space-y-6 max-w-7xl mx-auto pb-10">

                {/* ── Header ── */}
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
                        Mentor Earnings
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Review-based earnings for all mentors across batches.
                    </p>
                </div>

                {/* ── KPI Cards ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    <KpiCard
                        label="Total Mentor Earnings"
                        value={fmt(totalEarnings)}
                        sub={`${mockEarnings.length} earning records`}
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
                        label="Total Mentors"
                        value={String(mentorCount)}
                        sub="Active across all batches"
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
                                    Earnings Records
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
                                        placeholder="Search by mentor name..."
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        className="pl-9 bg-background"
                                    />
                                </div>

                                {/* Batch */}
                                <Select value={batchFilter} onValueChange={setBatchFilter}>
                                    <SelectTrigger className="w-full sm:w-[220px] bg-background">
                                        <SelectValue placeholder="All Batches" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Batches</SelectItem>
                                        {batchOptions.map(b => (
                                            <SelectItem key={b} value={b}>{b}</SelectItem>
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
                                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Mentor</th>
                                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Batch</th>
                                        <th className="text-center px-4 py-3 font-medium text-muted-foreground">Reviews</th>
                                        <th className="text-right px-4 py-3 font-medium text-muted-foreground">Rate / Review</th>
                                        <th className="text-right px-4 py-3 font-medium text-muted-foreground">Amount</th>
                                        <th className="text-left px-4 pr-5 py-3 font-medium text-muted-foreground">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="text-center py-12 text-muted-foreground">
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
                                                <td className="px-4 py-3 font-medium">{r.mentor}</td>
                                                <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{r.batch}</td>
                                                <td className="px-4 py-3 text-center text-muted-foreground">{r.reviews}</td>
                                                <td className="px-4 py-3 text-right text-muted-foreground">{fmt(r.ratePerReview)}</td>
                                                <td className="px-4 py-3 text-right font-semibold">{fmt(amount(r))}</td>
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

export default MentorEarnings;
