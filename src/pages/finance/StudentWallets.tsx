import { useMemo, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, Wallet, Users, CircleDollarSign, AlertCircle, X, ArrowUpRight, ArrowDownLeft } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StudentWallet {
    id: number;
    name: string;
    email: string;
    batch: string;
    balance: number;
    lastUpdated: string;
}

type BalanceFilter = "all" | "with-balance" | "zero-balance";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockStudents: StudentWallet[] = [
    { id: 1, name: "Aisha Khan", email: "aisha@example.com", batch: "Batch Alpha – Jan 2026", balance: 5000, lastUpdated: "01 Mar 2026" },
    { id: 2, name: "Rohan Verma", email: "rohan@example.com", batch: "Batch Alpha – Jan 2026", balance: 0, lastUpdated: "28 Feb 2026" },
    { id: 3, name: "Priya Sharma", email: "priya@example.com", batch: "Batch Alpha – Jan 2026", balance: 7500, lastUpdated: "01 Mar 2026" },
    { id: 4, name: "Mohammed Salim", email: "salim@example.com", batch: "Batch Alpha – Jan 2026", balance: 0, lastUpdated: "15 Feb 2026" },
    { id: 5, name: "Neha Gupta", email: "neha@example.com", batch: "Batch Beta – Feb 2026", balance: 3000, lastUpdated: "02 Mar 2026" },
    { id: 6, name: "Arjun Nair", email: "arjun@example.com", batch: "Batch Beta – Feb 2026", balance: 10000, lastUpdated: "01 Mar 2026" },
    { id: 7, name: "Divya Menon", email: "divya@example.com", batch: "Batch Beta – Feb 2026", balance: 0, lastUpdated: "20 Feb 2026" },
    { id: 8, name: "Siddharth Rao", email: "sid@example.com", batch: "Batch Gamma – Mar 2026", balance: 2500, lastUpdated: "03 Mar 2026" },
    { id: 9, name: "Farah Sheikh", email: "farah@example.com", batch: "Batch Gamma – Mar 2026", balance: 8000, lastUpdated: "02 Mar 2026" },
    { id: 10, name: "Karan Mehta", email: "karan@example.com", batch: "Batch Gamma – Mar 2026", balance: 0, lastUpdated: "01 Mar 2026" },
];

// ─── Transaction Mock Data ────────────────────────────────────────────────────

interface Transaction {
    id: number;
    date: string;
    type: "Credit" | "Debit";
    description: string;
    amount: number;
}

const mockTransactions: Record<number, Transaction[]> = {
    1: [
        { id: 1, date: "01 Mar 2026", type: "Credit", description: "Wallet top-up", amount: 5000 },
        { id: 2, date: "15 Feb 2026", type: "Debit", description: "Course material fee", amount: 1500 },
        { id: 3, date: "10 Feb 2026", type: "Credit", description: "Wallet top-up", amount: 1500 },
    ],
    3: [
        { id: 1, date: "01 Mar 2026", type: "Credit", description: "Wallet top-up", amount: 10000 },
        { id: 2, date: "20 Feb 2026", type: "Debit", description: "Lab session fee", amount: 2500 },
    ],
    5: [
        { id: 1, date: "02 Mar 2026", type: "Credit", description: "Wallet top-up", amount: 3000 },
    ],
    6: [
        { id: 1, date: "01 Mar 2026", type: "Credit", description: "Wallet top-up", amount: 15000 },
        { id: 2, date: "25 Feb 2026", type: "Debit", description: "Certificate fee", amount: 3000 },
        { id: 3, date: "18 Feb 2026", type: "Debit", description: "Course material fee", amount: 2000 },
    ],
    8: [
        { id: 1, date: "03 Mar 2026", type: "Credit", description: "Wallet top-up", amount: 2500 },
    ],
    9: [
        { id: 1, date: "02 Mar 2026", type: "Credit", description: "Wallet top-up", amount: 10000 },
        { id: 2, date: "28 Feb 2026", type: "Debit", description: "Exam registration fee", amount: 2000 },
    ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

// ─── KPI Card ─────────────────────────────────────────────────────────────────

interface KpiProps {
    label: string;
    value: string | number;
    icon: React.ElementType;
    iconBg: string;
    iconColor: string;
    valueColor?: string;
    sub?: string;
    isActive?: boolean;
    onClick?: () => void;
}

const KpiCard = ({ label, value, icon: Icon, iconBg, iconColor, valueColor, sub, isActive, onClick }: KpiProps) => (
    <Card
        onClick={onClick}
        className={`border-border/50 shadow-sm rounded-xl transition-all duration-200
            ${onClick ? "cursor-pointer hover:shadow-md" : ""}
            ${isActive ? "ring-2 ring-blue-500" : ""}
        `}
    >
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

// ─── Wallet Transaction Modal ─────────────────────────────────────────────────

interface ModalProps {
    student: StudentWallet | null;
    onClose: () => void;
}

const WalletTransactionModal = ({ student, onClose }: ModalProps) => {
    if (!student) return null;
    const txns = mockTransactions[student.id] ?? [];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
            <div
                className="bg-background border border-border/50 rounded-xl shadow-2xl w-full max-w-xl mx-4 max-h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="flex items-start justify-between p-5 border-b border-border/50">
                    <div>
                        <h2 className="text-base font-semibold text-foreground">{student.name}</h2>
                        <p className="text-sm text-muted-foreground mt-0.5">{student.email}</p>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-muted-foreground">Current Balance:</span>
                            <span className={`text-sm font-bold ${student.balance > 0 ? "text-emerald-600" : "text-muted-foreground"
                                }`}>
                                {fmt(student.balance)}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Transaction Table */}
                <div className="overflow-y-auto flex-1">
                    {txns.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-14 text-muted-foreground">
                            <Wallet className="w-8 h-8 opacity-25 mb-2" />
                            <p className="text-sm">No transactions found.</p>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead className="sticky top-0 bg-muted/30 border-b border-border/50">
                                <tr>
                                    <th className="text-left px-5 py-2.5 font-medium text-muted-foreground">Date</th>
                                    <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Type</th>
                                    <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Description</th>
                                    <th className="text-right px-4 pr-5 py-2.5 font-medium text-muted-foreground">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {txns.map(tx => (
                                    <tr key={tx.id} className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors">
                                        <td className="px-5 py-3 text-muted-foreground whitespace-nowrap">{tx.date}</td>
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
                                        <td className="px-4 py-3">{tx.description}</td>
                                        <td className={`px-4 pr-5 py-3 text-right font-semibold ${tx.type === "Credit" ? "text-emerald-600" : "text-destructive"
                                            }`}>
                                            {tx.type === "Credit" ? "+" : "-"}{fmt(tx.amount)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const StudentWallets = () => {
    const [search, setSearch] = useState("");
    const [batchFilter, setBatchFilter] = useState("all");
    const [balanceFilter, setBalanceFilter] = useState<BalanceFilter>("all");
    const [activeCard, setActiveCard] = useState<"all" | "with-balance" | "zero">("all");
    const [selectedStudent, setSelectedStudent] = useState<StudentWallet | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (s: StudentWallet) => { setSelectedStudent(s); setIsModalOpen(true); };
    const closeModal = () => { setIsModalOpen(false); setSelectedStudent(null); };

    // Dynamic batch list from data
    const batchOptions = useMemo(() => {
        const unique = Array.from(new Set(mockStudents.map(s => s.batch)));
        return unique.sort();
    }, []);

    // Filtered rows — combines search, batch, dropdown balance, and card filter
    const filtered = useMemo(() => {
        return mockStudents.filter(s => {
            const query = search.toLowerCase();
            const matchSearch = !query || s.name.toLowerCase().includes(query) || s.email.toLowerCase().includes(query);
            const matchBatch = batchFilter === "all" || s.batch === batchFilter;
            const matchDropdown =
                balanceFilter === "all" ? true :
                    balanceFilter === "with-balance" ? s.balance > 0 :
                        s.balance === 0;
            const matchCard =
                activeCard === "all" ? true :
                    activeCard === "with-balance" ? s.balance > 0 :
                        s.balance === 0;
            return matchSearch && matchBatch && matchDropdown && matchCard;
        });
    }, [search, batchFilter, balanceFilter, activeCard]);

    // KPI derived values (always from full dataset)
    const totalLiability = mockStudents.reduce((sum, s) => sum + s.balance, 0);
    const withBalanceCount = mockStudents.filter(s => s.balance > 0).length;
    const zeroBalanceCount = mockStudents.filter(s => s.balance === 0).length;

    const hasActiveFilter = search.trim() !== "" || batchFilter !== "all" || balanceFilter !== "all" || activeCard !== "all";
    const resetFilters = () => { setSearch(""); setBatchFilter("all"); setBalanceFilter("all"); setActiveCard("all"); };

    return (
        <>
            <DashboardLayout>
                <div className="animate-fade-in space-y-6 max-w-7xl mx-auto pb-10">

                    {/* ── Header ── */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
                                Student Wallets
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                Monitor wallet balances and transactions across all students.
                            </p>
                        </div>
                    </div>

                    {/* ── KPI Cards ── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                        <KpiCard
                            label="Total Wallet Liability"
                            value={fmt(totalLiability)}
                            icon={CircleDollarSign}
                            iconBg="bg-indigo-100/60"
                            iconColor="text-indigo-600"
                            valueColor="text-indigo-600"
                            sub="Sum of all wallet balances"
                            isActive={activeCard === "all"}
                            onClick={() => setActiveCard("all")}
                        />
                        <KpiCard
                            label="Students With Balance"
                            value={withBalanceCount}
                            icon={Wallet}
                            iconBg="bg-emerald-100/60"
                            iconColor="text-emerald-600"
                            valueColor="text-emerald-600"
                            sub="Balance greater than ₹0"
                            isActive={activeCard === "with-balance"}
                            onClick={() => setActiveCard("with-balance")}
                        />
                        <KpiCard
                            label="Zero Balance Students"
                            value={zeroBalanceCount}
                            icon={AlertCircle}
                            iconBg="bg-amber-100/60"
                            iconColor="text-amber-600"
                            valueColor="text-amber-600"
                            sub="No wallet funds"
                            isActive={activeCard === "zero"}
                            onClick={() => setActiveCard("zero")}
                        />
                        <KpiCard
                            label="Total Students"
                            value={mockStudents.length}
                            icon={Users}
                            iconBg="bg-blue-100/60"
                            iconColor="text-blue-600"
                            sub="Across all batches"
                            isActive={activeCard === "all"}
                            onClick={() => setActiveCard("all")}
                        />
                    </div>

                    {/* ── Table Card ── */}
                    <Card className="border-border/50 shadow-sm rounded-xl">
                        <CardHeader className="pb-4">
                            <div className="flex flex-col gap-4">

                                {/* Title + Reset */}
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base font-semibold">
                                        Wallet Balances
                                        <span className="ml-2 text-sm font-normal text-muted-foreground">
                                            ({filtered.length} of {mockStudents.length})
                                        </span>
                                    </CardTitle>
                                    {hasActiveFilter && (
                                        <Button variant="outline" size="sm" onClick={resetFilters} className="gap-1.5 text-xs">
                                            Reset Filters
                                        </Button>
                                    )}
                                </div>

                                {/* Filter Bar */}
                                <div className="flex flex-col sm:flex-row gap-3">
                                    {/* Search */}
                                    <div className="relative flex-1 max-w-xs">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search by name or email..."
                                            value={search}
                                            onChange={e => setSearch(e.target.value)}
                                            className="pl-9 bg-background"
                                        />
                                    </div>

                                    {/* Batch filter */}
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

                                    {/* Balance filter */}
                                    <Select value={balanceFilter} onValueChange={v => setBalanceFilter(v as BalanceFilter)}>
                                        <SelectTrigger className="w-full sm:w-[180px] bg-background">
                                            <SelectValue placeholder="All Balances" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Balances</SelectItem>
                                            <SelectItem value="with-balance">With Balance</SelectItem>
                                            <SelectItem value="zero-balance">Zero Balance</SelectItem>
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
                                            <th className="text-left px-5 py-3 font-medium text-muted-foreground">Student</th>
                                            <th className="text-left px-4 py-3 font-medium text-muted-foreground">Email</th>
                                            <th className="text-left px-4 py-3 font-medium text-muted-foreground">Batch</th>
                                            <th className="text-right px-4 py-3 font-medium text-muted-foreground">Wallet Balance</th>
                                            <th className="text-left px-4 py-3 font-medium text-muted-foreground">Last Updated</th>
                                            <th className="text-center px-4 pr-5 py-3 font-medium text-muted-foreground">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="text-center py-12 text-muted-foreground">
                                                    No students match the current filters.
                                                </td>
                                            </tr>
                                        ) : (
                                            filtered.map(row => (
                                                <tr
                                                    key={row.id}
                                                    className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors"
                                                >
                                                    <td className="px-5 py-3 font-medium">{row.name}</td>
                                                    <td className="px-4 py-3 text-muted-foreground">{row.email}</td>
                                                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{row.batch}</td>
                                                    <td className={`px-4 py-3 text-right font-semibold ${row.balance > 0 ? "text-foreground" : "text-muted-foreground"}`}>
                                                        {fmt(row.balance)}
                                                    </td>
                                                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{row.lastUpdated}</td>
                                                    <td className="px-4 pr-5 py-3 text-center">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => openModal(row)}
                                                        >
                                                            View Transactions
                                                        </Button>
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

            {/* ── Transaction Modal ── */}
            {isModalOpen && <WalletTransactionModal student={selectedStudent} onClose={closeModal} />}
        </>
    );
};

export default StudentWallets;
