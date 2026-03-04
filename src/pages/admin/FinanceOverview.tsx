import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { IndianRupee, Users, Wallet, AlertCircle, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// ─── Types ───────────────────────────────────────────────────────────────────

type TableFilter = "all" | "paid" | "pending";

interface Student {
    id: number;
    name: string;
    email: string;
    batchId: number;
    totalFee: number;
}

interface Payment {
    id: number;
    studentId: number;
    amount: number;
}

type BatchStatus = "Active" | "Completed" | "Upcoming";

interface Batch {
    id: number;
    name: string;
    status: BatchStatus;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const batches: Batch[] = [
    { id: 1, name: "Batch Alpha – Jan 2026", status: "Completed" },
    { id: 2, name: "Batch Beta  – Feb 2026", status: "Active" },
    { id: 3, name: "Batch Gamma – Mar 2026", status: "Upcoming" },
];

const students: Student[] = [
    { id: 1, name: "Aisha Khan", email: "aisha@example.com", batchId: 1, totalFee: 45000 },
    { id: 2, name: "Rohan Verma", email: "rohan@example.com", batchId: 1, totalFee: 45000 },
    { id: 3, name: "Priya Sharma", email: "priya@example.com", batchId: 1, totalFee: 45000 },
    { id: 4, name: "Mohammed Salim", email: "salim@example.com", batchId: 1, totalFee: 45000 },
    { id: 5, name: "Neha Gupta", email: "neha@example.com", batchId: 2, totalFee: 50000 },
    { id: 6, name: "Arjun Nair", email: "arjun@example.com", batchId: 2, totalFee: 50000 },
    { id: 7, name: "Divya Menon", email: "divya@example.com", batchId: 2, totalFee: 50000 },
    { id: 8, name: "Siddharth Rao", email: "sid@example.com", batchId: 3, totalFee: 55000 },
    { id: 9, name: "Farah Sheikh", email: "farah@example.com", batchId: 3, totalFee: 55000 },
    { id: 10, name: "Karan Mehta", email: "karan@example.com", batchId: 3, totalFee: 55000 },
];

const payments: Payment[] = [
    { id: 1, studentId: 1, amount: 45000 },
    { id: 2, studentId: 2, amount: 22500 },
    { id: 3, studentId: 3, amount: 0 },
    { id: 4, studentId: 4, amount: 45000 },
    { id: 5, studentId: 5, amount: 50000 },
    { id: 6, studentId: 6, amount: 25000 },
    { id: 7, studentId: 7, amount: 0 },
    { id: 8, studentId: 8, amount: 55000 },
    { id: 9, studentId: 9, amount: 27500 },
    { id: 10, studentId: 10, amount: 0 },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatINR = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const getPaid = (studentId: number) =>
    payments.filter(p => p.studentId === studentId).reduce((s, p) => s + p.amount, 0);

// ─── Component ───────────────────────────────────────────────────────────────

const FinanceOverview = () => {
    const navigate = useNavigate();
    const tableRef = useRef<HTMLDivElement>(null);
    const [tableFilter, setTableFilter] = useState<TableFilter>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [batchStatusFilter, setBatchStatusFilter] = useState<"all" | BatchStatus>("all");

    // ── KPI Calculations ──
    const kpi = useMemo(() => {
        const totalStudents = students.length;
        const totalRevenue = students.reduce((s, st) => s + st.totalFee, 0);
        const totalCollected = students.reduce((s, st) => s + getPaid(st.id), 0);
        const totalPending = totalRevenue - totalCollected;
        return { totalStudents, totalRevenue, totalCollected, totalPending };
    }, []);

    // ── Batch Rows (full dataset) ──
    const allBatchRows = useMemo(() =>
        batches.map(batch => {
            const batchStudents = students.filter(s => s.batchId === batch.id);
            const totalAmount = batchStudents.reduce((s, st) => s + st.totalFee, 0);
            const totalCollected = batchStudents.reduce((s, st) => s + getPaid(st.id), 0);
            const totalPending = totalAmount - totalCollected;
            return { ...batch, count: batchStudents.length, totalAmount, totalCollected, totalPending };
        }), []);

    // ── Filtered Batch Rows (card filter + search + status) ──
    const visibleBatchRows = useMemo(() => {
        return allBatchRows.filter(row => {
            // Card-level payment filter
            if (tableFilter === "paid" && row.totalPending !== 0) return false;
            if (tableFilter === "pending" && row.totalPending === 0) return false;
            // Search filter
            if (searchQuery.trim() && !row.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
            // Batch status filter
            if (batchStatusFilter !== "all" && row.status !== batchStatusFilter) return false;
            return true;
        });
    }, [allBatchRows, tableFilter, searchQuery, batchStatusFilter]);

    const hasActiveFilters = searchQuery.trim() !== "" || batchStatusFilter !== "all";
    const resetFilters = () => { setSearchQuery(""); setBatchStatusFilter("all"); };

    // ── Card Click Handlers ──
    const scrollToTable = (filter: TableFilter) => {
        setTableFilter(filter);
        setTimeout(() => {
            tableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 50);
    };

    // ── KPI Card Config ──
    const kpiCards = [
        {
            key: "students",
            label: "Total Students",
            value: kpi.totalStudents,
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-100/60",
            ring: "hover:ring-2 hover:ring-blue-400/50",
            sub: `${batches.length} active batches`,
            onClick: () => scrollToTable("all"),
        },
        {
            key: "revenue",
            label: "Total Revenue",
            value: formatINR(kpi.totalRevenue),
            icon: IndianRupee,
            color: "text-emerald-600",
            bg: "bg-emerald-100/60",
            ring: "hover:ring-2 hover:ring-emerald-400/50",
            sub: "Total expected collection",
            onClick: () => scrollToTable("all"),
        },
        {
            key: "collected",
            label: "Total Collected",
            value: formatINR(kpi.totalCollected),
            icon: Wallet,
            color: "text-indigo-600",
            bg: "bg-indigo-100/60",
            ring: "hover:ring-2 hover:ring-indigo-400/50",
            sub: `${((kpi.totalCollected / kpi.totalRevenue) * 100).toFixed(0)}% of total revenue`,
            onClick: () => scrollToTable("paid"),
        },
        {
            key: "pending",
            label: "Total Pending",
            value: formatINR(kpi.totalPending),
            icon: AlertCircle,
            color: "text-amber-600",
            bg: "bg-amber-100/60",
            ring: "hover:ring-2 hover:ring-amber-400/50",
            sub: "Yet to be collected",
            onClick: () => scrollToTable("pending"),
        },
    ];

    // ── Filter label for table heading ──
    const filterLabel: Record<TableFilter, string> = {
        all: "All Batches",
        paid: "Fully Paid Batches",
        pending: "Batches with Pending Payments",
    };

    return (
        <DashboardLayout>
            <div className="animate-fade-in space-y-6 lg:space-y-8 max-w-7xl mx-auto pb-10">

                {/* Header */}
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
                        Finance Overview
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Student fee collection summary across all batches.
                    </p>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    {kpiCards.map(card => {
                        const Icon = card.icon;
                        return (
                            <Card
                                key={card.key}
                                onClick={card.onClick}
                                className={`border-border/50 shadow-sm rounded-xl cursor-pointer transition-all duration-200 ${card.ring} hover:shadow-md hover:-translate-y-0.5`}
                            >
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        {card.label}
                                    </CardTitle>
                                    <div className={`w-8 h-8 rounded-full ${card.bg} flex items-center justify-center`}>
                                        <Icon className={`w-4 h-4 ${card.color}`} />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-foreground">{card.value}</div>
                                    <p className={`text-xs mt-1 ${card.color}`}>{card.sub}</p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Batch Revenue Table */}
                <div ref={tableRef}>
                    <Card className="border-border/50 shadow-sm rounded-xl">
                        <CardHeader className="pb-4">
                            <div className="flex flex-col gap-4">
                                {/* Title row */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-lg font-semibold">Batch Summary</CardTitle>
                                        <p className="text-sm text-muted-foreground mt-0.5">
                                            Showing: <span className="font-medium text-foreground">{filterLabel[tableFilter]}</span>
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {tableFilter !== "all" && (
                                            <Button variant="outline" size="sm" onClick={() => setTableFilter("all")}>
                                                Clear Card Filter
                                            </Button>
                                        )}
                                        {hasActiveFilters && (
                                            <Button variant="outline" size="sm" onClick={resetFilters} className="gap-1.5">
                                                <X className="w-3.5 h-3.5" />
                                                Reset Filters
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                {/* Filter Bar */}
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                    <div className="relative flex-1 max-w-xs">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search by batch name..."
                                            value={searchQuery}
                                            onChange={e => setSearchQuery(e.target.value)}
                                            className="pl-9 bg-background"
                                        />
                                    </div>
                                    <Select value={batchStatusFilter} onValueChange={v => setBatchStatusFilter(v as "all" | BatchStatus)}>
                                        <SelectTrigger className="w-full sm:w-[180px] bg-background">
                                            <SelectValue placeholder="Batch Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Statuses</SelectItem>
                                            <SelectItem value="Active">Active</SelectItem>
                                            <SelectItem value="Completed">Completed</SelectItem>
                                            <SelectItem value="Upcoming">Upcoming</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-muted/30">
                                    <TableRow>
                                        <TableHead className="pl-6">Batch Name</TableHead>
                                        <TableHead className="text-center">Students</TableHead>
                                        <TableHead className="text-right">Total Amount</TableHead>
                                        <TableHead className="text-right">Collected</TableHead>
                                        <TableHead className="text-right">Pending</TableHead>
                                        <TableHead className="text-center">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {visibleBatchRows.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                                No batches found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        visibleBatchRows.map(row => (
                                            <TableRow key={row.id} className="hover:bg-muted/20">
                                                <TableCell className="pl-6 font-medium">{row.name}</TableCell>
                                                <TableCell className="text-center">{row.count}</TableCell>
                                                <TableCell className="text-right font-semibold">{formatINR(row.totalAmount)}</TableCell>
                                                <TableCell className="text-right text-emerald-600 font-medium">{formatINR(row.totalCollected)}</TableCell>
                                                <TableCell className="text-right text-amber-600 font-medium">{formatINR(row.totalPending)}</TableCell>
                                                <TableCell className="text-center">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => navigate(`/admin/finance/batch/${row.id}`)}
                                                    >
                                                        View Students
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </DashboardLayout>
    );
};

export default FinanceOverview;
