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
import { Search, IndianRupee, ReceiptText, GraduationCap, Users } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Role = "Tutor" | "Mentor" | "Intern";
type RoleFilter = "all" | Role;
type MonthFilter = "all" | "January 2026" | "February 2026" | "March 2026";

interface Payout {
    id: number;
    paymentDate: string;
    month: string;
    name: string;
    role: Role;
    batch: string;
    amount: number;
    method: "Bank" | "UPI";
    referenceId: string;
    paidBy: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockPayouts: Payout[] = [
    { id: 1, paymentDate: "05 Mar 2026", month: "February 2026", name: "Meera Nair", role: "Tutor", batch: "Batch Alpha – Jan 2026", amount: 30000, method: "Bank", referenceId: "TXN-2026-001", paidBy: "Admin" },
    { id: 2, paymentDate: "05 Mar 2026", month: "February 2026", name: "Suresh Kumar", role: "Tutor", batch: "Batch Beta – Feb 2026", amount: 27000, method: "Bank", referenceId: "TXN-2026-002", paidBy: "Admin" },
    { id: 3, paymentDate: "05 Mar 2026", month: "February 2026", name: "Ravi Shankar", role: "Tutor", batch: "Batch Gamma – Mar 2026", amount: 36000, method: "Bank", referenceId: "TXN-2026-003", paidBy: "Admin" },
    { id: 4, paymentDate: "05 Mar 2026", month: "February 2026", name: "Anjali Desai", role: "Mentor", batch: "Batch Alpha – Jan 2026", amount: 9600, method: "UPI", referenceId: "TXN-2026-004", paidBy: "Admin" },
    { id: 5, paymentDate: "05 Mar 2026", month: "February 2026", name: "Vikram Pillai", role: "Mentor", batch: "Batch Beta – Feb 2026", amount: 9600, method: "UPI", referenceId: "TXN-2026-005", paidBy: "Admin" },
    { id: 6, paymentDate: "05 Mar 2026", month: "February 2026", name: "Karan Mehta", role: "Intern", batch: "Batch Gamma – Mar 2026", amount: 8000, method: "UPI", referenceId: "TXN-2026-006", paidBy: "Admin" },
    { id: 7, paymentDate: "05 Mar 2026", month: "February 2026", name: "Divya Menon", role: "Intern", batch: "Batch Alpha – Jan 2026", amount: 8000, method: "UPI", referenceId: "TXN-2026-007", paidBy: "Admin" },
    { id: 8, paymentDate: "03 Feb 2026", month: "January 2026", name: "Meera Nair", role: "Tutor", batch: "Batch Alpha – Jan 2026", amount: 30000, method: "Bank", referenceId: "TXN-2026-008", paidBy: "Admin" },
    { id: 9, paymentDate: "03 Feb 2026", month: "January 2026", name: "Suresh Kumar", role: "Tutor", batch: "Batch Beta – Feb 2026", amount: 30000, method: "Bank", referenceId: "TXN-2026-009", paidBy: "Admin" },
    { id: 10, paymentDate: "03 Feb 2026", month: "January 2026", name: "Anjali Desai", role: "Mentor", batch: "Batch Beta – Feb 2026", amount: 8000, method: "UPI", referenceId: "TXN-2026-010", paidBy: "Admin" },
    { id: 11, paymentDate: "03 Feb 2026", month: "January 2026", name: "Karan Mehta", role: "Intern", batch: "Batch Alpha – Jan 2026", amount: 8000, method: "UPI", referenceId: "TXN-2026-011", paidBy: "Admin" },
    { id: 12, paymentDate: "03 Feb 2026", month: "January 2026", name: "Pooja Nair", role: "Intern", batch: "Batch Gamma – Mar 2026", amount: 8000, method: "UPI", referenceId: "TXN-2026-012", paidBy: "Admin" },
];

const MONTHS: MonthFilter[] = ["January 2026", "February 2026", "March 2026"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const roleColor: Record<Role, string> = {
    Tutor: "text-blue-600",
    Mentor: "text-purple-600",
    Intern: "text-green-600",
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

const Payouts = () => {
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
    const [monthFilter, setMonthFilter] = useState<MonthFilter | "all">("all");

    // Filtered rows
    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return mockPayouts.filter(p => {
            const matchSearch = !q || p.name.toLowerCase().includes(q);
            const matchRole = roleFilter === "all" || p.role === roleFilter;
            const matchMonth = monthFilter === "all" || p.month === monthFilter;
            return matchSearch && matchRole && matchMonth;
        });
    }, [search, roleFilter, monthFilter]);

    // KPI — full dataset
    const totalAmount = mockPayouts.reduce((s, p) => s + p.amount, 0);
    const totalCount = mockPayouts.length;
    const tutorCount = mockPayouts.filter(p => p.role === "Tutor").length;
    const mentorInternCount = mockPayouts.filter(p => p.role === "Mentor" || p.role === "Intern").length;

    const hasFilter = search.trim() !== "" || roleFilter !== "all" || monthFilter !== "all";
    const reset = () => { setSearch(""); setRoleFilter("all"); setMonthFilter("all"); };

    return (
        <DashboardLayout>
            <div className="animate-fade-in space-y-6 max-w-7xl mx-auto pb-10">

                {/* ── Header ── */}
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
                        Payout History
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Completed payouts for tutors, mentors, and interns.
                    </p>
                </div>

                {/* ── KPI Cards ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    <KpiCard
                        label="Total Paid Amount"
                        value={fmt(totalAmount)}
                        sub={`Across ${totalCount} records`}
                        icon={IndianRupee}
                        iconBg="bg-emerald-100/60"
                        iconColor="text-emerald-600"
                        valueColor="text-emerald-600"
                    />
                    <KpiCard
                        label="Total Payout Records"
                        value={String(totalCount)}
                        sub="All disbursements"
                        icon={ReceiptText}
                        iconBg="bg-blue-100/60"
                        iconColor="text-blue-600"
                    />
                    <KpiCard
                        label="Tutors Paid"
                        value={String(tutorCount)}
                        sub="Tutor payout records"
                        icon={GraduationCap}
                        iconBg="bg-indigo-100/60"
                        iconColor="text-indigo-600"
                    />
                    <KpiCard
                        label="Mentors & Interns Paid"
                        value={String(mentorInternCount)}
                        sub="Combined payout records"
                        icon={Users}
                        iconBg="bg-violet-100/60"
                        iconColor="text-violet-600"
                    />
                </div>

                {/* ── Table Card ── */}
                <Card className="border-border/50 shadow-sm rounded-xl">
                    <CardHeader className="pb-4">
                        <div className="flex flex-col gap-4">

                            {/* Title + Reset */}
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base font-semibold">
                                    Payout Records
                                    <span className="ml-2 text-sm font-normal text-muted-foreground">
                                        ({filtered.length} of {mockPayouts.length})
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
                                        placeholder="Search by name..."
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        className="pl-9 bg-background"
                                    />
                                </div>

                                {/* Role */}
                                <Select value={roleFilter} onValueChange={v => setRoleFilter(v as RoleFilter)}>
                                    <SelectTrigger className="w-full sm:w-[150px] bg-background">
                                        <SelectValue placeholder="All Roles" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Roles</SelectItem>
                                        <SelectItem value="Tutor">Tutor</SelectItem>
                                        <SelectItem value="Mentor">Mentor</SelectItem>
                                        <SelectItem value="Intern">Intern</SelectItem>
                                    </SelectContent>
                                </Select>

                                {/* Month */}
                                <Select value={monthFilter} onValueChange={v => setMonthFilter(v as MonthFilter | "all")}>
                                    <SelectTrigger className="w-full sm:w-[170px] bg-background">
                                        <SelectValue placeholder="All Months" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Months</SelectItem>
                                        {MONTHS.map(m => (
                                            <SelectItem key={m} value={m}>{m}</SelectItem>
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
                                        <th className="text-left px-5 py-3 font-medium text-muted-foreground">Payment Date</th>
                                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Role</th>
                                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Batch</th>
                                        <th className="text-right px-4 py-3 font-medium text-muted-foreground">Amount</th>
                                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Method</th>
                                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Reference ID</th>
                                        <th className="text-left px-4 pr-5 py-3 font-medium text-muted-foreground">Paid By</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="text-center py-12 text-muted-foreground">
                                                No payout records match the current filters.
                                            </td>
                                        </tr>
                                    ) : (
                                        filtered.map(p => (
                                            <tr
                                                key={p.id}
                                                className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors"
                                            >
                                                <td className="px-5 py-3 text-muted-foreground whitespace-nowrap">{p.paymentDate}</td>
                                                <td className="px-4 py-3 font-medium">{p.name}</td>
                                                <td className={`px-4 py-3 font-medium ${roleColor[p.role]}`}>{p.role}</td>
                                                <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{p.batch}</td>
                                                <td className="px-4 py-3 text-right font-semibold text-emerald-600">{fmt(p.amount)}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full border ${p.method === "Bank"
                                                            ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                                                            : "bg-violet-500/10 text-violet-600 border-violet-500/20"
                                                        }`}>
                                                        {p.method}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{p.referenceId}</td>
                                                <td className="px-4 pr-5 py-3 text-muted-foreground">{p.paidBy}</td>
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

export default Payouts;
