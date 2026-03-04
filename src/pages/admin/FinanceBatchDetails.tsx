import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// ─── Types ───────────────────────────────────────────────────────────────────

type PaymentStatus = "Paid" | "Partial" | "Pending";
type TxnStatus = "Success" | "Failed" | "Pending";

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

interface Transaction {
    id: string;
    studentId: number;
    date: string;
    amount: number;
    method: string;
    txnId: string;
    status: TxnStatus;
}

interface Batch {
    id: number;
    name: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const batches: Batch[] = [
    { id: 1, name: "Batch Alpha – Jan 2026" },
    { id: 2, name: "Batch Beta  – Feb 2026" },
    { id: 3, name: "Batch Gamma – Mar 2026" },
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

// Mock transaction history per student
const mockTransactions: Transaction[] = [
    // Student 1 — Fully paid in two instalments
    { id: "t1", studentId: 1, date: "2026-01-05", amount: 25000, method: "UPI", txnId: "TXN20260105A1", status: "Success" },
    { id: "t2", studentId: 1, date: "2026-01-10", amount: 20000, method: "Bank Transfer", txnId: "TXN20260110B1", status: "Success" },
    // Student 2 — Partial
    { id: "t3", studentId: 2, date: "2026-01-12", amount: 22500, method: "Debit Card", txnId: "TXN20260112C2", status: "Success" },
    // Student 3 — No transactions (Pending)
    // Student 4 — Full payment, one failed attempt
    { id: "t4", studentId: 4, date: "2026-01-15", amount: 45000, method: "UPI", txnId: "TXN20260115D4", status: "Failed" },
    { id: "t5", studentId: 4, date: "2026-01-18", amount: 45000, method: "Net Banking", txnId: "TXN20260118E4", status: "Success" },
    // Student 5 — Full
    { id: "t6", studentId: 5, date: "2026-02-05", amount: 50000, method: "UPI", txnId: "TXN20260205F5", status: "Success" },
    // Student 6 — Partial
    { id: "t7", studentId: 6, date: "2026-02-08", amount: 25000, method: "Debit Card", txnId: "TXN20260208G6", status: "Success" },
    // Student 7 — Pending attempt
    { id: "t8", studentId: 7, date: "2026-02-10", amount: 50000, method: "UPI", txnId: "TXN20260210H7", status: "Pending" },
    // Student 8 — Full
    { id: "t9", studentId: 8, date: "2026-03-01", amount: 55000, method: "Net Banking", txnId: "TXN20260301I8", status: "Success" },
    // Student 9 — Partial
    { id: "t10", studentId: 9, date: "2026-03-02", amount: 27500, method: "UPI", txnId: "TXN20260302J9", status: "Success" },
    // Student 10 — No transactions
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatINR = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const getPaid = (studentId: number) =>
    payments.filter(p => p.studentId === studentId).reduce((s, p) => s + p.amount, 0);

const getPaymentStatus = (paid: number, due: number): PaymentStatus =>
    due === 0 ? "Paid" : paid === 0 ? "Pending" : "Partial";

const getStudentTxns = (studentId: number) =>
    mockTransactions.filter(t => t.studentId === studentId);

// Badge styles
const paymentBadgeClass: Record<PaymentStatus, string> = {
    Paid: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    Partial: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    Pending: "bg-destructive/10 text-destructive border-destructive/20",
};

const txnBadgeClass: Record<TxnStatus, string> = {
    Success: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    Pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    Failed: "bg-destructive/10 text-destructive border-destructive/20",
};

// ─── Transaction Modal ────────────────────────────────────────────────────────

interface ModalStudent {
    id: number;
    name: string;
    totalFee: number;
    paid: number;
    due: number;
}

interface TransactionModalProps {
    student: ModalStudent | null;
    onClose: () => void;
}

const TransactionModal = ({ student, onClose }: TransactionModalProps) => {
    if (!student) return null;

    const txns = getStudentTxns(student.id);

    return (
        <Dialog open={!!student} onOpenChange={open => { if (!open) onClose(); }}>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                <DialogHeader className="flex flex-row items-start justify-between pr-8">
                    <div>
                        <DialogTitle className="text-xl font-bold">{student.name}</DialogTitle>
                        <p className="text-sm text-muted-foreground mt-0.5">Transaction History</p>
                    </div>
                </DialogHeader>

                {/* Summary Strip */}
                <div className="grid grid-cols-3 gap-3 mt-2">
                    {[
                        { label: "Total Fee", value: formatINR(student.totalFee), color: "text-foreground" },
                        { label: "Total Paid", value: formatINR(student.paid), color: "text-emerald-600" },
                        { label: "Balance Due", value: formatINR(student.due), color: "text-amber-600" },
                    ].map(item => (
                        <div key={item.label} className="bg-muted/30 rounded-lg p-3">
                            <p className="text-xs text-muted-foreground">{item.label}</p>
                            <p className={`text-lg font-bold mt-0.5 ${item.color}`}>{item.value}</p>
                        </div>
                    ))}
                </div>

                {/* Transaction Table */}
                <div className="mt-4">
                    <h3 className="text-sm font-semibold text-foreground mb-3">Transactions</h3>

                    {txns.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-muted-foreground gap-2 border border-dashed rounded-lg">
                            <X className="w-8 h-8 opacity-30" />
                            <p className="text-sm">No transaction records found.</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                    <TableHead>Method</TableHead>
                                    <TableHead>Transaction ID</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {txns.map(txn => (
                                    <TableRow key={txn.id} className="hover:bg-muted/20">
                                        <TableCell>
                                            {new Date(txn.date).toLocaleDateString("en-IN", {
                                                day: "2-digit", month: "short", year: "numeric",
                                            })}
                                        </TableCell>
                                        <TableCell className="text-right font-semibold">
                                            {formatINR(txn.amount)}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">{txn.method}</TableCell>
                                        <TableCell className="font-mono text-xs text-muted-foreground">{txn.txnId}</TableCell>
                                        <TableCell>
                                            <Badge className={`shadow-none border ${txnBadgeClass[txn.status]}`}>
                                                {txn.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const FinanceBatchDetails = () => {
    const { batchId } = useParams<{ batchId: string }>();
    const navigate = useNavigate();

    const [selectedStudent, setSelectedStudent] = useState<ModalStudent | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | PaymentStatus>("all");

    const numericBatchId = Number(batchId);
    const batch = batches.find(b => b.id === numericBatchId);

    const studentRows = useMemo(() => {
        if (!numericBatchId) return [];
        return students
            .filter(s => s.batchId === numericBatchId)
            .map(student => {
                const paid = getPaid(student.id);
                const due = student.totalFee - paid;
                const status = getPaymentStatus(paid, due);
                return { ...student, paid, due, status };
            });
    }, [numericBatchId]);

    // ── Filtered rows (search + status) ──
    const filteredStudentRows = useMemo(() => {
        return studentRows.filter(row => {
            const matchesName = row.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === "all" || row.status === statusFilter;
            return matchesName && matchesStatus;
        });
    }, [studentRows, searchQuery, statusFilter]);

    const hasActiveFilter = searchQuery.trim() !== "" || statusFilter !== "all";
    const resetFilters = () => { setSearchQuery(""); setStatusFilter("all"); };

    const batchTotal = useMemo(() => ({
        revenue: studentRows.reduce((s, r) => s + r.totalFee, 0),
        collected: studentRows.reduce((s, r) => s + r.paid, 0),
        pending: studentRows.reduce((s, r) => s + r.due, 0),
    }), [studentRows]);

    if (!batch) {
        return (
            <DashboardLayout>
                <div className="max-w-7xl mx-auto py-10 text-center text-muted-foreground">
                    Batch not found.
                    <Button variant="link" onClick={() => navigate("/admin/finance")}>
                        Go back to Finance Overview
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="animate-fade-in space-y-6 lg:space-y-8 max-w-7xl mx-auto pb-10">

                {/* Back Button */}
                <Button
                    variant="outline"
                    size="sm"
                    className="w-fit gap-2"
                    onClick={() => navigate("/admin/finance")}
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Finance Overview
                </Button>

                {/* Header */}
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
                        {batch.name}
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Individual student fee and payment breakdown.
                    </p>
                </div>

                {/* Mini Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        { label: "Total Revenue", value: formatINR(batchTotal.revenue), color: "text-foreground" },
                        { label: "Total Collected", value: formatINR(batchTotal.collected), color: "text-emerald-600" },
                        { label: "Total Pending", value: formatINR(batchTotal.pending), color: "text-amber-600" },
                    ].map(item => (
                        <Card key={item.label} className="border-border/50 shadow-sm rounded-xl">
                            <CardHeader className="pb-1">
                                <CardTitle className="text-sm font-medium text-muted-foreground">{item.label}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className={`text-2xl font-bold ${item.color}`}>{item.value}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Student Payment Table */}
                <Card className="border-border/50 shadow-sm rounded-xl">
                    <CardHeader className="pb-4">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-semibold">
                                    Student Payments
                                    <span className="ml-2 text-sm font-normal text-muted-foreground">
                                        ({filteredStudentRows.length} of {studentRows.length})
                                    </span>
                                </CardTitle>
                                {hasActiveFilter && (
                                    <Button variant="outline" size="sm" onClick={resetFilters} className="gap-1.5">
                                        <X className="w-3.5 h-3.5" />
                                        Reset Filters
                                    </Button>
                                )}
                            </div>

                            {/* Filter Bar */}
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                <div className="relative flex-1 max-w-xs">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by student name..."
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        className="pl-9 bg-background"
                                    />
                                </div>
                                <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as "all" | PaymentStatus)}>
                                    <SelectTrigger className="w-full sm:w-[180px] bg-background">
                                        <SelectValue placeholder="Payment Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Statuses</SelectItem>
                                        <SelectItem value="Paid">Paid</SelectItem>
                                        <SelectItem value="Partial">Partial</SelectItem>
                                        <SelectItem value="Pending">Pending</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow>
                                    <TableHead className="pl-6">Student Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead className="text-right">Total Fee</TableHead>
                                    <TableHead className="text-right">Paid</TableHead>
                                    <TableHead className="text-right">Due</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-center">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredStudentRows.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                                            No students found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredStudentRows.map(row => (
                                        <TableRow key={row.id} className="hover:bg-muted/20">
                                            <TableCell className="pl-6 font-medium">{row.name}</TableCell>
                                            <TableCell className="text-muted-foreground">{row.email}</TableCell>
                                            <TableCell className="text-right font-semibold">{formatINR(row.totalFee)}</TableCell>
                                            <TableCell className="text-right text-emerald-600 font-medium">{formatINR(row.paid)}</TableCell>
                                            <TableCell className="text-right text-amber-600 font-medium">{formatINR(row.due)}</TableCell>
                                            <TableCell>
                                                <Badge className={`shadow-none border ${paymentBadgeClass[row.status]}`}>
                                                    {row.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setSelectedStudent({
                                                        id: row.id,
                                                        name: row.name,
                                                        totalFee: row.totalFee,
                                                        paid: row.paid,
                                                        due: row.due,
                                                    })}
                                                >
                                                    View Transactions
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

            {/* Transaction Modal */}
            <TransactionModal
                student={selectedStudent}
                onClose={() => setSelectedStudent(null)}
            />
        </DashboardLayout>
    );
};

export default FinanceBatchDetails;
