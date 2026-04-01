import { useState, useMemo, useEffect } from "react";
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
    Input
} from "@/components/ui/input";
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
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    IndianRupee,
    CreditCard,
    Download,
    Wallet,
    Clock,
    CheckCircle2,
    Calendar,
    AlertCircle,
    ArrowDownLeft,
    ArrowUpRight,
    ClipboardList,
    Search,
    FilterX,
    Filter,
    FileText,
    TrendingUp,
    PlayCircle,
    Eye,
    Users,
    X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    Cell
} from "recharts";

// Types
interface EarningRecord {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    duration: number; // in hours
    batchName: string;
    amount: number;
    status: "Pending" | "Approved" | "Paid";
}

interface Payslip {
    id: string;
    month: string;
    year: number;
    totalHours: number;
    hourlyRate: number;
    grossEarnings: number;
    netPayable: number;
    status: "Paid" | "Generated";
    attachment?: string;
}

// Fixed Rate
const HOURLY_RATE = 200;

// Demo Data
const earningsTrend = [
    { month: "Oct", amount: 12500 },
    { month: "Nov", amount: 15800 },
    { month: "Dec", amount: 14200 },
    { month: "Jan", amount: 18500 },
    { month: "Feb", amount: 16400 },
    { month: "Mar", amount: 12600 },
];

const initialEarnings: EarningRecord[] = [
    { id: "ERN-001", date: "30 Mar 2026", startTime: "10:00 AM", endTime: "12:00 PM", duration: 2, batchName: "Jan 2026 Batch", amount: 400, status: "Pending" },
    { id: "ERN-002", date: "29 Mar 2026", startTime: "02:00 PM", endTime: "05:00 PM", duration: 3, batchName: "Feb 2026 Batch", amount: 600, status: "Approved" },
    { id: "ERN-003", date: "28 Mar 2026", startTime: "06:00 PM", endTime: "08:00 PM", duration: 2, batchName: "Jan 2026 Batch", amount: 400, status: "Approved" },
    { id: "ERN-004", date: "27 Mar 2026", startTime: "11:00 AM", endTime: "01:00 PM", duration: 2, batchName: "Project Batch A", amount: 400, status: "Approved" },
    { id: "ERN-005", date: "25 Mar 2026", startTime: "03:00 PM", endTime: "06:00 PM", duration: 3, batchName: "Feb 2026 Batch", amount: 600, status: "Paid" },
    { id: "ERN-006", date: "24 Mar 2026", startTime: "09:00 AM", endTime: "12:00 PM", duration: 3, batchName: "Jan 2026 Batch", amount: 600, status: "Paid" },
    { id: "ERN-007", date: "22 Mar 2026", startTime: "04:00 PM", endTime: "06:00 PM", duration: 2, batchName: "Project Batch A", amount: 400, status: "Paid" },
];

const initialPayslips: Payslip[] = [
    { id: "PS-2026-03", month: "March", year: 2026, totalHours: 62, hourlyRate: 200, grossEarnings: 12400, netPayable: 12400, status: "Generated" },
    { id: "PS-2026-02", month: "February", year: 2026, totalHours: 82, hourlyRate: 200, grossEarnings: 16400, netPayable: 16400, status: "Paid", attachment: "salary-slip-february.pdf" },
    { id: "PS-2026-01", month: "January", year: 2026, totalHours: 92, hourlyRate: 200, grossEarnings: 18400, netPayable: 18400, status: "Paid", attachment: "salary-slip-january.pdf" },
];

const MetricCard = ({ title, amount, subtext, icon: Icon, colorClass }: { title: string; amount: number | string; subtext?: string; icon: any; colorClass?: string }) => (
    <Card className="transition-all hover:shadow-md border-border/50 shadow-sm bg-card">
        <CardContent className="p-6">
            <div className="flex items-start justify-between">
                <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <div className="flex items-center gap-1.5">
                        {typeof amount === "number" && <IndianRupee className="w-5 h-5 text-foreground/80" />}
                        <p className="text-2xl font-bold tracking-tight text-foreground">
                            {typeof amount === "number" ? amount.toLocaleString("en-IN") : amount}
                        </p>
                    </div>
                    {subtext && <p className="text-xs text-muted-foreground font-medium">{subtext}</p>}
                </div>
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-primary/10 text-primary", colorClass)}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
        </CardContent>
    </Card>
);

const TutorWallet = () => {
    const [earnings, setEarnings] = useState<EarningRecord[]>(initialEarnings);
    const [payslips] = useState<Payslip[]>(initialPayslips);
    const [searchQuery, setSearchQuery] = useState("");
    const [batchFilter, setBatchFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");
    const [monthFilter, setMonthFilter] = useState("All");

    // Modal States
    const [isPayslipModalOpen, setIsPayslipModalOpen] = useState(false);
    const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);
    const HOURLY_RATE = 200;

    // Body scroll lock
    useEffect(() => {
        if (isPayslipModalOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isPayslipModalOpen]);

    // Summary Metrics Calculation
    const totalEarnings = useMemo(() => earnings.reduce((sum, item) => sum + (item.status !== "Pending" ? item.amount : 0), 92000), [earnings]);
    const thisMonthEarnings = useMemo(() => earnings.reduce((sum, item) => sum + item.amount, 0), [earnings]);
    const pendingAmount = useMemo(() => earnings.filter(e => e.status === "Pending").reduce((sum, item) => sum + item.amount, 0), [earnings]);
    const paidAmount = useMemo(() => earnings.filter(e => e.status === "Paid").reduce((sum, item) => sum + item.amount, 80000), [earnings]);

    // Filtering Logic
    const filteredEarnings = useMemo(() => {
        return earnings.filter((record) => {
            const matchesBatch = batchFilter === "All" || record.batchName === batchFilter;
            const matchesStatus = statusFilter === "All" || record.status === statusFilter;
            const matchesMonth = monthFilter === "All" || record.date.includes(monthFilter);
            
            return matchesBatch && matchesStatus && matchesMonth;
        });
    }, [earnings, batchFilter, statusFilter, monthFilter]);

    const resetFilters = () => {
        setSearchQuery("");
        setBatchFilter("All");
        setStatusFilter("All");
        setMonthFilter("All");
    };

    const isMonthEnd = (monthStr: string) => {
        // Simple mock logic: for "March", only show generated payslip if we are in April or late March
        return true; 
    };

    return (
        <DashboardLayout>
            <div className="animate-fade-in space-y-6 lg:space-y-8 max-w-6xl mx-auto pb-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight flex items-center gap-2">
                            <Wallet className="w-8 h-8 text-primary" />
                            Earnings & Wallet
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Track your session-based earnings and generate monthly payslips.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="gap-2 font-bold">
                            <Download className="w-4 h-4" />
                            Export Data
                        </Button>
                    </div>
                </div>

                {/* 1. Summary Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <MetricCard
                        title="Total Earnings"
                        amount={totalEarnings}
                        subtext="Lifetime approved earnings"
                        icon={TrendingUp}
                        colorClass="bg-emerald-500/10 text-emerald-600"
                    />
                    <MetricCard
                        title="This Month"
                        amount={thisMonthEarnings}
                        subtext="Ongoing earnings for March"
                        icon={Calendar}
                        colorClass="bg-blue-500/10 text-blue-600"
                    />
                    <MetricCard
                        title="Pending Amount"
                        amount={pendingAmount}
                        subtext="Sessions under review"
                        icon={Clock}
                        colorClass="bg-orange-500/10 text-orange-600"
                    />
                    <MetricCard
                        title="Paid Amount"
                        amount={paidAmount}
                        subtext="Successfully transferred"
                        icon={CheckCircle2}
                        colorClass="bg-indigo-500/10 text-indigo-600"
                    />
                </div>

                {/* 2. Earnings Trend & Quick Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2 border-border/50 shadow-sm overflow-hidden">
                        <CardHeader className="bg-muted/30 border-b border-border/50">
                            <CardTitle className="text-base font-bold flex items-center gap-2 text-foreground">
                                <TrendingUp className="w-4 h-4 text-primary" />
                                Earnings Overview
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="h-[250px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={earningsTrend}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                        <XAxis 
                                            dataKey="month" 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fontSize: 12, fill: '#888' }}
                                        />
                                        <YAxis 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fontSize: 12, fill: '#888' }}
                                            tickFormatter={(value) => `₹${value/1000}k`}
                                        />
                                        <Tooltip 
                                            cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                                            contentStyle={{ 
                                                borderRadius: '12px', 
                                                border: '1px solid rgba(0,0,0,0.05)',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                                            }}
                                            formatter={(value) => [`₹${value.toLocaleString()}`, 'Earnings']}
                                        />
                                        <Bar dataKey="amount" radius={[4, 4, 0, 0]} barSize={40}>
                                            {earningsTrend.map((entry, index) => (
                                                <Cell 
                                                    key={`cell-${index}`} 
                                                    fill={index === earningsTrend.length - 1 ? "hsl(var(--primary))" : "rgba(15, 23, 42, 0.1)"} 
                                                />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 shadow-sm overflow-hidden flex flex-col">
                        <CardHeader className="bg-muted/30 border-b border-border/50 py-4">
                            <CardTitle className="text-base font-bold flex items-center gap-2 text-foreground">
                                <FileText className="w-4 h-4 text-primary" />
                                Monthly Payslips
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 flex-1 overflow-auto">
                            <div className="divide-y divide-border/30">
                                {payslips.map((slip) => (
                                    <div key={slip.id} className="p-4 hover:bg-muted/20 transition-colors group">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <div className="font-bold text-sm">{slip.month} {slip.year}</div>
                                                <div className="text-[10px] text-muted-foreground flex items-center gap-2">
                                                    <Clock className="w-3 h-3" />
                                                    {slip.totalHours} Hours Worked
                                                </div>
                                            </div>
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                className="h-8 px-2 text-primary font-bold gap-1 group-hover:bg-primary/5"
                                                onClick={() => {
                                                    setSelectedPayslip(slip);
                                                    setIsPayslipModalOpen(true);
                                                }}
                                            >
                                                <Eye className="w-4 h-4" />
                                                View
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                        <div className="p-3 bg-muted/20 border-t border-border/30">
                            <p className="text-[10px] text-center text-muted-foreground px-2">
                                * New payslips are generated on the 1st of every month.
                            </p>
                        </div>
                    </Card>
                </div>

                {/* 3. Session History & Filters */}
                <div className="space-y-4">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                                <ClipboardList className="w-5 h-5 text-primary" />
                                Earnings History
                            </h2>
                            {(batchFilter !== "All" || statusFilter !== "All" || monthFilter !== "All") && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={resetFilters}
                                    className="text-primary font-bold gap-2 hover:bg-primary/5"
                                >
                                    <FilterX className="w-4 h-4" />
                                    Clear Filters
                                </Button>
                            )}
                        </div>

                        {/* Filter Bar */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 bg-card p-4 rounded-xl border border-border/50 shadow-sm font-bold">
                            <Select value={batchFilter} onValueChange={setBatchFilter}>
                                <SelectTrigger className="h-10 bg-muted/30 border-none focus:ring-1 focus:ring-primary">
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4 text-muted-foreground" />
                                        <SelectValue placeholder="All Batches" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">All Batches</SelectItem>
                                    <SelectItem value="Jan 2026 Batch">Jan 2026 Batch</SelectItem>
                                    <SelectItem value="Feb 2026 Batch">Feb 2026 Batch</SelectItem>
                                    <SelectItem value="Project Batch A">Project Batch A</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={monthFilter} onValueChange={setMonthFilter}>
                                <SelectTrigger className="h-10 bg-muted/30 border-none focus:ring-1 focus:ring-primary">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-muted-foreground" />
                                        <SelectValue placeholder="All Months" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">All Months</SelectItem>
                                    <SelectItem value="Mar 2026">March 2026</SelectItem>
                                    <SelectItem value="Feb 2026">February 2026</SelectItem>
                                    <SelectItem value="Jan 2026">January 2026</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="h-10 bg-muted/30 border-none focus:ring-1 focus:ring-primary">
                                    <div className="flex items-center gap-2">
                                        <Filter className="w-4 h-4 text-muted-foreground" />
                                        <SelectValue placeholder="All Status" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">All Status</SelectItem>
                                    <SelectItem value="Paid">Paid</SelectItem>
                                    <SelectItem value="Approved">Approved</SelectItem>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Card className="border-border/50 shadow-sm overflow-hidden font-medium">
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-muted/40">
                                        <TableRow className="hover:bg-transparent border-b-border/50 font-bold">
                                            <TableHead className="pl-6 h-12 font-bold text-foreground">Date</TableHead>
                                            <TableHead className="h-12 font-bold text-foreground uppercase text-[10px] tracking-wider">Batch Name</TableHead>
                                            <TableHead className="h-12 font-bold text-foreground">Session Time</TableHead>
                                            <TableHead className="h-12 font-bold text-foreground text-center">Duration</TableHead>
                                            <TableHead className="h-12 font-bold text-foreground text-right border-x border-border/10 px-6">Amount</TableHead>
                                            <TableHead className="h-12 font-bold text-foreground text-center pr-6">Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredEarnings.length > 0 ? (
                                            filteredEarnings.map((row) => (
                                                <TableRow key={row.id} className="hover:bg-muted/20 transition-colors border-b-border/30 last:border-0">
                                                    <TableCell className="pl-6 py-5 text-sm font-bold text-muted-foreground">
                                                        {row.date}
                                                    </TableCell>
                                                    <TableCell className="py-5 font-black text-foreground">
                                                        {row.batchName}
                                                    </TableCell>
                                                    <TableCell className="py-5">
                                                        <div className="flex items-center gap-2 text-sm text-foreground/80 font-bold">
                                                            <Clock className="w-3.5 h-3.5 text-primary" />
                                                            {row.startTime} - {row.endTime}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-5 text-center text-sm font-bold">
                                                        {row.duration} hrs
                                                    </TableCell>
                                                    <TableCell className="py-5 text-right font-black text-foreground border-x border-border/10 px-6">
                                                        <div className="flex items-center justify-end">
                                                            <IndianRupee className="w-3.5 h-3.5 mr-0.5" />
                                                            {row.amount.toLocaleString("en-IN")}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-5 text-center pr-6">
                                                        <Badge
                                                            variant="outline"
                                                            className={cn(
                                                                "font-bold uppercase text-[10px] tracking-wider px-2 py-0.5 min-w-[80px] justify-center",
                                                                row.status === "Paid" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                                                                    row.status === "Approved" ? "bg-blue-500/10 text-blue-600 border-blue-500/20" :
                                                                        "bg-orange-500/10 text-orange-600 border-orange-500/20"
                                                            )}
                                                        >
                                                            {row.status}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={6} className="h-64 text-center">
                                                    <div className="flex flex-col items-center justify-center space-y-3">
                                                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                                                            <Search className="w-6 h-6 text-muted-foreground" />
                                                        </div>
                                                        <div>
                                                            <p className="text-lg font-bold text-foreground">No records found</p>
                                                            <p className="text-sm text-muted-foreground">Adjust filters to find session earnings.</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>

            {/* View Payslip Modal */}
            {isPayslipModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setIsPayslipModalOpen(false)}>
                    <div 
                        className="bg-background border border-border/50 rounded-2xl shadow-2xl w-full max-w-2xl h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-border/50 bg-muted/5 flex-shrink-0">
                            <div>
                                <h2 className="text-xl font-bold tracking-tight">Monthly Payslip</h2>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {selectedPayslip?.month} {selectedPayslip?.year} • {selectedPayslip?.id}
                                </p>
                            </div>
                            <button onClick={() => setIsPayslipModalOpen(false)} className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground flex-shrink-0">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                            {/* Tutor Details */}
                            <div className="flex justify-between items-start border-b border-border/50 pb-6">
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase text-muted-foreground font-black tracking-widest">Tutor Details</p>
                                    <div className="text-lg font-bold text-foreground line-clamp-1">Alex Johnson</div>
                                    <div className="text-xs text-muted-foreground font-bold">Senior Full Stack Tutor</div>
                                </div>
                                <div className="text-right space-y-1">
                                    <p className="text-[10px] uppercase text-muted-foreground font-black tracking-widest">Pay Period</p>
                                    <div className="text-sm font-bold text-foreground">{selectedPayslip?.month} {selectedPayslip?.year}</div>
                                    <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-none font-bold text-[10px] mt-1">
                                        {selectedPayslip?.status}
                                    </Badge>
                                </div>
                            </div>

                            {/* Financial Breakdown */}
                            <div className="space-y-4">
                                <p className="text-[10px] uppercase text-muted-foreground font-black tracking-widest">Earnings Breakdown</p>
                                
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center py-2 border-b border-dashed border-border/50 text-sm">
                                        <span className="font-bold text-muted-foreground">Total Sessions Duration</span>
                                        <span className="font-black text-foreground">{selectedPayslip?.totalHours} Hours</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-dashed border-border/50 text-sm">
                                        <span className="font-bold text-muted-foreground">Rate Per Hour</span>
                                        <span className="font-black text-foreground">₹{HOURLY_RATE}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-4 text-base">
                                        <span className="font-black text-foreground uppercase tracking-tight">Net Payable Amount</span>
                                        <span className="text-xl font-black text-primary flex items-center">
                                            <IndianRupee className="w-5 h-5 mr-0.5" />
                                            {selectedPayslip?.netPayable.toLocaleString("en-IN")}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Attachment Section */}
                            <div className="space-y-3">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">Attachment</p>
                                {selectedPayslip?.attachment ? (
                                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/30 border border-border/40 group">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <FileText className="w-4 h-4 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate leading-tight">{selectedPayslip.attachment}</p>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                className="h-8 px-3 text-xs font-bold gap-1.5 hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground"
                                                onClick={() => window.open('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', '_blank')}
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                                View
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                className="h-8 px-3 text-xs font-bold gap-1.5 hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground"
                                                onClick={() => toast.success(`Downloading ${selectedPayslip.attachment}...`)}
                                            >
                                                <Download className="w-3.5 h-3.5" />
                                                Download
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground bg-muted/30 rounded-xl px-4 py-3 border border-border/30">
                                        No attachment available
                                    </p>
                                )}
                            </div>

                            {/* Info Note */}
                            <div className="bg-muted/30 p-4 rounded-xl border border-border/50 flex gap-3">
                                <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                                    This is a computer-generated payslip and does not require a signature. For any discrepancies, please contact the finance department within 3 business days.
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-border/50 bg-muted/5 flex items-center justify-end gap-3 flex-shrink-0">
                            <Button 
                                variant="outline" 
                                className="rounded-xl px-6"
                                onClick={() => setIsPayslipModalOpen(false)} 
                            >
                                Close
                            </Button>
                            <Button className="rounded-xl px-6 bg-primary hover:bg-primary/90 gap-2">
                                <Download className="w-4 h-4" />
                                Download PDF
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default TutorWallet;
