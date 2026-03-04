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
import { Search, IndianRupee, ReceiptText, Calculator } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CoursePayment {
    id: number;
    date: string;
    student: string;
    course: string;
    batch: string;
    amount: number;
    method: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockPayments: CoursePayment[] = [
    { id: 1, date: "03 Mar 2026", student: "Aisha Khan", course: "Full Stack Development", batch: "Batch Alpha – Jan 2026", amount: 45000, method: "Wallet" },
    { id: 2, date: "03 Mar 2026", student: "Priya Sharma", course: "Full Stack Development", batch: "Batch Alpha – Jan 2026", amount: 45000, method: "Wallet" },
    { id: 3, date: "02 Mar 2026", student: "Arjun Nair", course: "Full Stack Development", batch: "Batch Beta – Feb 2026", amount: 42000, method: "Wallet" },
    { id: 4, date: "02 Mar 2026", student: "Neha Gupta", course: "Full Stack Development", batch: "Batch Beta – Feb 2026", amount: 42000, method: "Wallet" },
    { id: 5, date: "01 Mar 2026", student: "Farah Sheikh", course: "Full Stack Development", batch: "Batch Gamma – Mar 2026", amount: 48000, method: "Wallet" },
    { id: 6, date: "01 Mar 2026", student: "Siddharth Rao", course: "Full Stack Development", batch: "Batch Gamma – Mar 2026", amount: 48000, method: "Wallet" },
    { id: 7, date: "28 Feb 2026", student: "Rohan Verma", course: "Full Stack Development", batch: "Batch Alpha – Jan 2026", amount: 45000, method: "Wallet" },
    { id: 8, date: "28 Feb 2026", student: "Mohammed Salim", course: "Full Stack Development", batch: "Batch Alpha – Jan 2026", amount: 45000, method: "Wallet" },
    { id: 9, date: "27 Feb 2026", student: "Divya Menon", course: "Full Stack Development", batch: "Batch Beta – Feb 2026", amount: 42000, method: "Wallet" },
    { id: 10, date: "26 Feb 2026", student: "Karan Mehta", course: "Full Stack Development", batch: "Batch Gamma – Mar 2026", amount: 48000, method: "Wallet" },
    { id: 11, date: "25 Feb 2026", student: "Sunita Verma", course: "Full Stack Development", batch: "Batch Beta – Feb 2026", amount: 42000, method: "Wallet" },
    { id: 12, date: "24 Feb 2026", student: "Rahul Das", course: "Full Stack Development", batch: "Batch Gamma – Mar 2026", amount: 48000, method: "Wallet" },
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

const CoursePayments = () => {
    const [search, setSearch] = useState("");
    const [batchFilter, setBatchFilter] = useState("all");

    // Dynamic batch list
    const batchOptions = useMemo(
        () => Array.from(new Set(mockPayments.map(p => p.batch))).sort(),
        []
    );

    // Filtered rows
    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return mockPayments.filter(p => {
            const matchSearch = !q || p.student.toLowerCase().includes(q);
            const matchBatch = batchFilter === "all" || p.batch === batchFilter;
            return matchSearch && matchBatch;
        });
    }, [search, batchFilter]);

    // KPI — always from full dataset
    const totalRevenue = mockPayments.reduce((s, p) => s + p.amount, 0);
    const totalCount = mockPayments.length;
    const average = Math.round(totalRevenue / totalCount);

    return (
        <DashboardLayout>
            <div className="animate-fade-in space-y-6 max-w-7xl mx-auto pb-10">

                {/* ── Header ── */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
                            Course Payments
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            All course fee payments received from students.
                        </p>
                    </div>
                </div>

                {/* ── KPI Cards ── */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
                    <KpiCard
                        label="Total Course Revenue"
                        value={fmt(totalRevenue)}
                        sub={`Across ${totalCount} payments`}
                        icon={IndianRupee}
                        iconBg="bg-emerald-100/60"
                        iconColor="text-emerald-600"
                        valueColor="text-emerald-600"
                    />
                    <KpiCard
                        label="Total Payments Count"
                        value={String(totalCount)}
                        sub="All fee transactions"
                        icon={ReceiptText}
                        iconBg="bg-blue-100/60"
                        iconColor="text-blue-600"
                    />
                    <KpiCard
                        label="Average Payment Amount"
                        value={fmt(average)}
                        sub="Per student average"
                        icon={Calculator}
                        iconBg="bg-violet-100/60"
                        iconColor="text-violet-600"
                        valueColor="text-violet-600"
                    />
                </div>

                {/* ── Table Card ── */}
                <Card className="border-border/50 shadow-sm rounded-xl">
                    <CardHeader className="pb-4">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base font-semibold">
                                    Payment Records
                                    <span className="ml-2 text-sm font-normal text-muted-foreground">
                                        ({filtered.length} of {mockPayments.length})
                                    </span>
                                </CardTitle>
                            </div>

                            {/* Filter Bar */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="relative flex-1 max-w-xs">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by student name..."
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        className="pl-9 bg-background"
                                    />
                                </div>
                                <Select value={batchFilter} onValueChange={setBatchFilter}>
                                    <SelectTrigger className="w-full sm:w-[240px] bg-background">
                                        <SelectValue placeholder="All Batches" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Batches</SelectItem>
                                        {batchOptions.map(b => (
                                            <SelectItem key={b} value={b}>{b}</SelectItem>
                                        ))}
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
                                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Student</th>
                                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Course</th>
                                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Batch</th>
                                        <th className="text-right px-4 py-3 font-medium text-muted-foreground">Amount</th>
                                        <th className="text-left px-4 pr-5 py-3 font-medium text-muted-foreground">Method</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="text-center py-12 text-muted-foreground">
                                                No payments match the current filters.
                                            </td>
                                        </tr>
                                    ) : (
                                        filtered.map(p => (
                                            <tr
                                                key={p.id}
                                                className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors"
                                            >
                                                <td className="px-5 py-3 text-muted-foreground whitespace-nowrap">{p.date}</td>
                                                <td className="px-4 py-3 font-medium">{p.student}</td>
                                                <td className="px-4 py-3 text-muted-foreground">{p.course}</td>
                                                <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{p.batch}</td>
                                                <td className="px-4 py-3 text-right font-semibold text-emerald-600">
                                                    {fmt(p.amount)}
                                                </td>
                                                <td className="px-4 pr-5 py-3">
                                                    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20">
                                                        {p.method}
                                                    </span>
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

export default CoursePayments;
