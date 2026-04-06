import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Eye, X } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type RequestStatus = "Pending" | "Approved" | "Rejected";

interface TopupRequest {
    id: number;
    student: string;
    email: string;
    amount: number;
    referenceNo: string;
    requestDate: string;
    screenshotUrl: string;   // placeholder image URL
    status: RequestStatus;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const initialRequests: TopupRequest[] = [
    {
        id: 1,
        student: "Aisha Khan",
        email: "aisha@example.com",
        amount: 5000,
        referenceNo: "REF20260301A",
        requestDate: "01 Mar 2026",
        screenshotUrl: "https://placehold.co/480x320?text=Payment+Screenshot",
        status: "Pending",
    },
    {
        id: 2,
        student: "Rohan Verma",
        email: "rohan@example.com",
        amount: 10000,
        referenceNo: "REF20260301B",
        requestDate: "01 Mar 2026",
        screenshotUrl: "https://placehold.co/480x320?text=Payment+Screenshot",
        status: "Approved",
    },
    {
        id: 3,
        student: "Priya Sharma",
        email: "priya@example.com",
        amount: 7500,
        referenceNo: "REF20260228C",
        requestDate: "28 Feb 2026",
        screenshotUrl: "https://placehold.co/480x320?text=Payment+Screenshot",
        status: "Pending",
    },
    {
        id: 4,
        student: "Arjun Nair",
        email: "arjun@example.com",
        amount: 3000,
        referenceNo: "REF20260227D",
        requestDate: "27 Feb 2026",
        screenshotUrl: "https://placehold.co/480x320?text=Payment+Screenshot",
        status: "Rejected",
    },
    {
        id: 5,
        student: "Farah Sheikh",
        email: "farah@example.com",
        amount: 8000,
        referenceNo: "REF20260226E",
        requestDate: "26 Feb 2026",
        screenshotUrl: "https://placehold.co/480x320?text=Payment+Screenshot",
        status: "Approved",
    },
    {
        id: 6,
        student: "Karan Mehta",
        email: "karan@example.com",
        amount: 4500,
        referenceNo: "REF20260225F",
        requestDate: "25 Feb 2026",
        screenshotUrl: "https://placehold.co/480x320?text=Payment+Screenshot",
        status: "Pending",
    },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const statusBadge: Record<RequestStatus, string> = {
    Pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    Approved: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    Rejected: "bg-destructive/10 text-destructive border-destructive/20",
};

type FilterOption = "All" | RequestStatus;

// ─── Screenshot Modal ─────────────────────────────────────────────────────────

interface ScreenshotModalProps {
    url: string | null;
    studentName: string;
    onClose: () => void;
}

const ScreenshotModal = ({ url, studentName, onClose }: ScreenshotModalProps) => (
    <Dialog open={!!url} onOpenChange={open => { if (!open) onClose(); }}>
        <DialogContent className="max-w-lg">
            <DialogHeader className="flex flex-row items-start justify-between pr-8">
                <div>
                    <DialogTitle className="text-base font-semibold">Payment Screenshot</DialogTitle>
                    <p className="text-sm text-muted-foreground mt-0.5">{studentName}</p>
                </div>
            </DialogHeader>
            {url && (
                <div className="rounded-lg overflow-hidden border border-border/50 mt-2">
                    <img
                        src={url}
                        alt={`Payment screenshot — ${studentName}`}
                        className="w-full object-cover"
                    />
                </div>
            )}
        </DialogContent>
    </Dialog>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const WalletTopupRequests = () => {
    const [requests, setRequests] = useState<TopupRequest[]>(initialRequests);
    const [statusFilter, setStatusFilter] = useState<FilterOption>("All");
    const [previewRow, setPreviewRow] = useState<TopupRequest | null>(null);

    // ── Action handlers ──
    const handleApprove = (id: number) =>
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "Approved" } : r));

    const handleReject = (id: number) =>
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "Rejected" } : r));

    // ── Filter ──
    const visible = statusFilter === "All"
        ? requests
        : requests.filter(r => r.status === statusFilter);

    // ── Derived counts for header badges ──
    const pendingCount = requests.filter(r => r.status === "Pending").length;
    const approvedCount = requests.filter(r => r.status === "Approved").length;
    const rejectedCount = requests.filter(r => r.status === "Rejected").length;

    return (
        <DashboardLayout>
            <div className="animate-fade-in space-y-6 max-w-7xl mx-auto pb-10">

                {/* ── Header ── */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
                            Wallet Top-up Requests
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Review and process student wallet top-up submissions.
                        </p>
                    </div>

                    {/* Status filter */}
                    <Select value={statusFilter} onValueChange={v => setStatusFilter(v as FilterOption)}>
                        <SelectTrigger className="w-[180px] bg-background">
                            <SelectValue placeholder="Filter by Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Approved">Approved</SelectItem>
                            <SelectItem value="Rejected">Rejected</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* ── Summary Strip ── */}
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { label: "Pending", count: pendingCount, cls: "text-amber-600" },
                        { label: "Approved", count: approvedCount, cls: "text-emerald-600" },
                        { label: "Rejected", count: rejectedCount, cls: "text-destructive" },
                    ].map(item => (
                        <Card key={item.label} className="border-border/50 shadow-sm rounded-xl">
                            <CardContent className="p-4 text-center">
                                <div className={`text-3xl font-bold ${item.cls}`}>{item.count}</div>
                                <p className="text-sm text-muted-foreground mt-0.5">{item.label}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* ── Table ── */}
                <Card className="border-border/50 shadow-sm rounded-xl">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base font-semibold">
                                Top-up Requests
                                <span className="ml-2 text-sm font-normal text-muted-foreground">
                                    ({visible.length} of {requests.length})
                                </span>
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border/50 bg-muted/30">
                                        <th className="text-left px-5 py-3 font-medium text-muted-foreground">Student</th>
                                        <th className="text-right px-4 py-3 font-medium text-muted-foreground">Amount</th>
                                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Reference No.</th>
                                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Request Date</th>
                                        <th className="text-center px-4 py-3 font-medium text-muted-foreground">Screenshot</th>
                                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                                        <th className="text-center px-4 pr-5 py-3 font-medium text-muted-foreground">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {visible.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="text-center py-12 text-muted-foreground">
                                                <X className="w-8 h-8 opacity-25 mx-auto mb-2" />
                                                No requests match this filter.
                                            </td>
                                        </tr>
                                    ) : (
                                        visible.map(row => (
                                            <tr
                                                key={row.id}
                                                className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors"
                                            >
                                                {/* Student */}
                                                <td className="px-5 py-3">
                                                    <p className="font-medium">{row.student}</p>
                                                    <p className="text-xs text-muted-foreground">{row.email}</p>
                                                </td>

                                                {/* Amount */}
                                                <td className="px-4 py-3 text-right font-semibold">
                                                    {fmt(row.amount)}
                                                </td>

                                                {/* Reference No */}
                                                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                                                    {row.referenceNo}
                                                </td>

                                                {/* Request Date */}
                                                <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                                                    {row.requestDate}
                                                </td>

                                                {/* Screenshot */}
                                                <td className="px-4 py-3 text-center">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="gap-1.5"
                                                        onClick={() => setPreviewRow(row)}
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                        View
                                                    </Button>
                                                </td>

                                                {/* Status */}
                                                <td className="px-4 py-3">
                                                    <Badge className={`shadow-none border text-xs ${statusBadge[row.status]}`}>
                                                        {row.status}
                                                    </Badge>
                                                </td>

                                                {/* Action */}
                                                <td className="px-4 pr-5 py-3 text-center">
                                                    {row.status === "Pending" ? (
                                                        <div className="flex items-center justify-center gap-2">
                                                            <Button
                                                                size="sm"
                                                                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                                                onClick={() => handleApprove(row.id)}
                                                            >
                                                                Approve
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="destructive"
                                                                onClick={() => handleReject(row.id)}
                                                            >
                                                                Reject
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground font-medium">
                                                            Processed
                                                        </span>
                                                    )}
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

            {/* ── Screenshot Preview Modal ── */}
            <ScreenshotModal
                url={previewRow?.screenshotUrl ?? null}
                studentName={previewRow?.student ?? ""}
                onClose={() => setPreviewRow(null)}
            />
        </DashboardLayout>
    );
};

export default WalletTopupRequests;
