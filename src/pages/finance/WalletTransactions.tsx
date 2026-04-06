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
import { Badge } from "@/components/ui/badge";
import { Search, ArrowUpRight, ArrowDownLeft, TrendingUp } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type TxType = "Credit" | "Debit";
type TxStatus = "Completed" | "Pending" | "Failed";
type TypeFilter = "all" | TxType;

interface WalletTx {
    id: number;
    date: string;
    student: string;
    type: TxType;
    description: string;
    amount: number;
    status: TxStatus;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockTxns: WalletTx[] = [
    { id: 1, date: "03 Mar 2026", student: "Aisha Khan", type: "Credit", description: "Wallet top-up", amount: 5000, status: "Completed" },
    { id: 2, date: "03 Mar 2026", student: "Farah Sheikh", type: "Credit", description: "Wallet top-up", amount: 8000, status: "Completed" },
    { id: 3, date: "02 Mar 2026", student: "Arjun Nair", type: "Credit", description: "Wallet top-up", amount: 10000, status: "Completed" },
    { id: 4, date: "02 Mar 2026", student: "Siddharth Rao", type: "Credit", description: "Wallet top-up", amount: 2500, status: "Completed" },
    { id: 5, date: "02 Mar 2026", student: "Neha Gupta", type: "Credit", description: "Wallet top-up", amount: 3000, status: "Pending" },
    { id: 6, date: "01 Mar 2026", student: "Priya Sharma", type: "Credit", description: "Wallet top-up", amount: 7500, status: "Completed" },
    { id: 7, date: "01 Mar 2026", student: "Arjun Nair", type: "Debit", description: "Course material fee", amount: 1500, status: "Completed" },
    { id: 8, date: "28 Feb 2026", student: "Aisha Khan", type: "Debit", description: "Lab session fee", amount: 1000, status: "Completed" },
    { id: 9, date: "25 Feb 2026", student: "Farah Sheikh", type: "Debit", description: "Certificate fee", amount: 3000, status: "Completed" },
    { id: 10, date: "20 Feb 2026", student: "Siddharth Rao", type: "Debit", description: "Exam registration fee", amount: 500, status: "Completed" },
    { id: 11, date: "18 Feb 2026", student: "Priya Sharma", type: "Debit", description: "Course material fee", amount: 2500, status: "Failed" },
    { id: 12, date: "15 Feb 2026", student: "Rohan Verma", type: "Credit", description: "Wallet top-up", amount: 12000, status: "Completed" },
    { id: 13, date: "10 Feb 2026", student: "Rohan Verma", type: "Debit", description: "Lab session fee", amount: 2000, status: "Completed" },
    { id: 14, date: "08 Feb 2026", student: "Karan Mehta", type: "Credit", description: "Wallet top-up", amount: 4500, status: "Pending" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const statusBadge: Record<TxStatus, string> = {
    Completed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    Pending: "bg-amber-500/10  text-amber-600  border-amber-500/20",
    Failed: "bg-destructive/10 text-destructive border-destructive/20",
};

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

const WalletTransactions = () => {
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");

    // Filtered rows
    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return mockTxns.filter(tx => {
            const matchSearch = !q || tx.student.toLowerCase().includes(q);
            const matchType = typeFilter === "all" || tx.type === typeFilter;
            return matchSearch && matchType;
        });
    }, [search, typeFilter]);

    // KPI totals — always from full dataset
    const totalCredit = mockTxns.filter(t => t.type === "Credit").reduce((s, t) => s + t.amount, 0);
    const totalDebit = mockTxns.filter(t => t.type === "Debit").reduce((s, t) => s + t.amount, 0);
    const netFlow = totalCredit - totalDebit;

    return (
        <DashboardLayout>
            <div className="animate-fade-in space-y-6 max-w-7xl mx-auto pb-10">

                {/* ── Header ── */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
                            Wallet Transactions
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            All wallet credit and debit activity across student accounts.
                        </p>
                    </div>
                </div>

                {/* ── Summary Cards ── */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
                    <KpiCard
                        label="Total Credit"
                        value={fmt(totalCredit)}
                        sub={`${mockTxns.filter(t => t.type === "Credit").length} credit transactions`}
                        icon={ArrowUpRight}
                        iconBg="bg-emerald-100/60"
                        iconColor="text-emerald-600"
                        valueColor="text-emerald-600"
                    />
                    <KpiCard
                        label="Total Debit"
                        value={fmt(totalDebit)}
                        sub={`${mockTxns.filter(t => t.type === "Debit").length} debit transactions`}
                        icon={ArrowDownLeft}
                        iconBg="bg-destructive/10"
                        iconColor="text-destructive"
                        valueColor="text-destructive"
                    />
                    <KpiCard
                        label="Net Wallet Flow"
                        value={fmt(Math.abs(netFlow))}
                        sub={netFlow >= 0 ? "Net positive flow" : "Net negative flow"}
                        icon={TrendingUp}
                        iconBg="bg-blue-100/60"
                        iconColor="text-blue-600"
                        valueColor={netFlow >= 0 ? "text-emerald-600" : "text-destructive"}
                    />
                </div>

                {/* ── Table Card ── */}
                <Card className="border-border/50 shadow-sm rounded-xl">
                    <CardHeader className="pb-4">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base font-semibold">
                                    Transaction History
                                    <span className="ml-2 text-sm font-normal text-muted-foreground">
                                        ({filtered.length} of {mockTxns.length})
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
                                <Select value={typeFilter} onValueChange={v => setTypeFilter(v as TypeFilter)}>
                                    <SelectTrigger className="w-full sm:w-[160px] bg-background">
                                        <SelectValue placeholder="All Types" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Types</SelectItem>
                                        <SelectItem value="Credit">Credit</SelectItem>
                                        <SelectItem value="Debit">Debit</SelectItem>
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
                                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Type</th>
                                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Description</th>
                                        <th className="text-right px-4 py-3 font-medium text-muted-foreground">Amount</th>
                                        <th className="text-left px-4 pr-5 py-3 font-medium text-muted-foreground">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="text-center py-12 text-muted-foreground">
                                                No transactions match the current filters.
                                            </td>
                                        </tr>
                                    ) : (
                                        filtered.map(tx => (
                                            <tr
                                                key={tx.id}
                                                className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors"
                                            >
                                                {/* Date */}
                                                <td className="px-5 py-3 text-muted-foreground whitespace-nowrap">{tx.date}</td>

                                                {/* Student */}
                                                <td className="px-4 py-3 font-medium">{tx.student}</td>

                                                {/* Type badge */}
                                                <td className="px-4 py-3">
                                                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${tx.type === "Credit"
                                                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                                            : "bg-destructive/10 text-destructive border-destructive/20"
                                                        }`}>
                                                        {tx.type === "Credit"
                                                            ? <ArrowUpRight className="w-3 h-3" />
                                                            : <ArrowDownLeft className="w-3 h-3" />}
                                                        {tx.type}
                                                    </span>
                                                </td>

                                                {/* Description */}
                                                <td className="px-4 py-3 text-muted-foreground">{tx.description}</td>

                                                {/* Amount */}
                                                <td className={`px-4 py-3 text-right font-semibold ${tx.type === "Credit" ? "text-green-600" : "text-red-600"
                                                    }`}>
                                                    {tx.type === "Credit" ? "+" : "−"}{fmt(tx.amount)}
                                                </td>

                                                {/* Status */}
                                                <td className="px-4 pr-5 py-3">
                                                    <Badge className={`shadow-none border text-xs ${statusBadge[tx.status]}`}>
                                                        {tx.status}
                                                    </Badge>
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

export default WalletTransactions;
