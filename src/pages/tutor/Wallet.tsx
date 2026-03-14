import { useState, useMemo } from "react";
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
    Building2
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
type TransactionType = "Live Class Earnings" | "Assignment Review" | "Mentoring" | "Bonus" | "Payout" | "All";
type TransactionStatus = "Paid" | "Pending" | "Processing" | "All";

interface Transaction {
    id: string;
    date: string;
    description: string;
    credit: number;
    debit: number;
    status: "Paid" | "Pending" | "Processing";
    type: Exclude<TransactionType, "All">;
}

// Demo Data
const initialWalletMetrics = {
    walletBalance: 42500,
    availableBalance: 32000,
    pendingAmount: 10500,
    lastPaymentDate: "05 Mar 2026"
};

const initialTransactions: Transaction[] = [
    { id: "TXN-005", date: "30 Mar 2026", description: "Mentoring Sessions - Batch B1", credit: 2000, debit: 0, status: "Processing", type: "Mentoring" },
    { id: "TXN-004", date: "28 Mar 2026", description: "Live Class Earnings - React Advanced", credit: 8500, debit: 0, status: "Pending", type: "Live Class Earnings" },
    { id: "TXN-001", date: "05 Mar 2026", description: "Monthly Payout - February", credit: 0, debit: 35000, status: "Paid", type: "Payout" },
    { id: "TXN-002", date: "15 Feb 2026", description: "Assignment Grading Bonus", credit: 2500, debit: 0, status: "Paid", type: "Bonus" },
    { id: "TXN-003", date: "05 Feb 2026", description: "Monthly Payout - January", credit: 0, debit: 32000, status: "Paid", type: "Payout" },
    { id: "TXN-006", date: "10 Jan 2026", description: "Bank Withdrawal", credit: 0, debit: 5000, status: "Paid", type: "Payout" },
    { id: "TXN-007", date: "01 Jan 2026", description: "New Year Tutor Reward", credit: 1000, debit: 0, status: "Paid", type: "Bonus" },
];

const MetricCard = ({ title, amount, subtext, icon: Icon }: { title: string; amount: number | string; subtext?: string; icon: any }) => (
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
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-primary/10 text-primary">
                    <Icon className="w-5 h-5" />
                </div>
            </div>
        </CardContent>
    </Card>
);

const TutorWallet = () => {
    const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
    const [walletMetrics, setWalletMetrics] = useState(initialWalletMetrics);
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState<TransactionType>("All");
    const [statusFilter, setStatusFilter] = useState<TransactionStatus>("All");
    const [dateFilter, setDateFilter] = useState("All");

    // Payout Modal State
    const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
    const [withdrawalAmount, setWithdrawalAmount] = useState("");
    const [selectedBank, setSelectedBank] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const minWithdrawal = 1000;

    // Filtering Logic
    const filteredTransactions = useMemo(() => {
        return transactions.filter((tx) => {
            const matchesSearch = tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tx.id.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesType = typeFilter === "All" || tx.type === typeFilter;
            const matchesStatus = statusFilter === "All" || tx.status === statusFilter;

            const matchesDate = dateFilter === "All" ||
                (dateFilter === "This Month" && tx.date.includes("Mar 2026")) ||
                (dateFilter === "Last Month" && tx.date.includes("Feb 2026"));

            return matchesSearch && matchesType && matchesStatus && matchesDate;
        });
    }, [transactions, searchQuery, typeFilter, statusFilter, dateFilter]);

    const resetFilters = () => {
        setSearchQuery("");
        setTypeFilter("All");
        setStatusFilter("All");
        setDateFilter("All");
    };

    const handlePayoutSubmit = () => {
        const amount = parseFloat(withdrawalAmount);
        if (isNaN(amount) || amount < minWithdrawal || amount > walletMetrics.availableBalance || !selectedBank) {
            return;
        }

        setIsSubmitting(true);

        // Simulate API delay
        setTimeout(() => {
            const newTransaction: Transaction = {
                id: `TXN-${Math.floor(Math.random() * 900) + 100}`,
                date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                description: `Withdrawal Request - ${selectedBank}`,
                credit: 0,
                debit: amount,
                status: "Processing",
                type: "Payout"
            };

            setTransactions([newTransaction, ...transactions]);
            setWalletMetrics({
                ...walletMetrics,
                availableBalance: walletMetrics.availableBalance - amount
            });

            setIsSubmitting(false);
            setIsPayoutModalOpen(false);
            setWithdrawalAmount("");
            setSelectedBank("");
        }, 1000);
    };

    const isAmountValid = withdrawalAmount !== "" && parseFloat(withdrawalAmount) >= minWithdrawal && parseFloat(withdrawalAmount) <= walletMetrics.availableBalance;

    return (
        <DashboardLayout>
            <div className="animate-fade-in space-y-6 lg:space-y-8 max-w-6xl mx-auto pb-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">
                            My Wallet
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Manage your finances, track every credit and debit, and request payouts.
                        </p>
                    </div>
                </div>

                {/* 1. Wallet Balance Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <MetricCard
                        title="Wallet Balance"
                        amount={walletMetrics.walletBalance}
                        subtext="Total lifetime earnings"
                        icon={Wallet}
                    />
                    <MetricCard
                        title="Available Balance"
                        amount={walletMetrics.availableBalance}
                        subtext="Ready for payout"
                        icon={CheckCircle2}
                    />
                    <MetricCard
                        title="Pending Amount"
                        amount={walletMetrics.pendingAmount}
                        subtext="Work under review"
                        icon={Clock}
                    />
                    <MetricCard
                        title="Last Payout"
                        amount={walletMetrics.lastPaymentDate}
                        subtext="Successfully transferred"
                        icon={Calendar}
                    />
                </div>

                {/* 2. Request Payout Section */}
                <Card className="border-primary/20 bg-primary/5 overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 font-medium">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <CreditCard className="w-6 h-6" />
                                </div>
                                <div className="text-center md:text-left">
                                    <div className="text-sm text-muted-foreground">Available for Withdrawal</div>
                                    <div className="text-2xl font-bold flex items-center justify-center md:justify-start">
                                        <IndianRupee className="w-5 h-5 mr-0.5" />
                                        {walletMetrics.availableBalance.toLocaleString("en-IN")}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-sm text-muted-foreground border-y md:border-y-0 md:border-x border-primary/20 py-4 md:py-0 md:px-8">
                                <AlertCircle className="w-4 h-4 text-primary shrink-0" />
                                <span>Minimum withdrawal amount: <strong>₹{minWithdrawal.toLocaleString("en-IN")}</strong></span>
                            </div>

                            <Button
                                onClick={() => setIsPayoutModalOpen(true)}
                                className="w-full md:w-auto h-12 px-8 font-bold gap-2 shadow-lg shadow-primary/20"
                            >
                                <ArrowUpRight className="w-5 h-5" />
                                Request Payout Now
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* 3. Transaction History Section */}
                <div className="space-y-4">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                                <ClipboardList className="w-5 h-5 text-primary" />
                                Transaction History
                            </h2>
                            {(searchQuery || typeFilter !== "All" || statusFilter !== "All" || dateFilter !== "All") && (
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-card p-4 rounded-xl border border-border/50 shadow-sm">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search transactions..."
                                    className="pl-9 bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary h-10"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <Select value={dateFilter} onValueChange={setDateFilter}>
                                <SelectTrigger className="h-10 bg-muted/30 border-none focus:ring-1 focus:ring-primary">
                                    <SelectValue placeholder="All Dates" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">All Dates</SelectItem>
                                    <SelectItem value="This Month">This Month</SelectItem>
                                    <SelectItem value="Last Month">Last Month</SelectItem>
                                    <SelectItem value="Last 3 Months">Last 3 Months</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as TransactionType)}>
                                <SelectTrigger className="h-10 bg-muted/30 border-none focus:ring-1 focus:ring-primary">
                                    <SelectValue placeholder="All Types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">All Types</SelectItem>
                                    <SelectItem value="Live Class Earnings">Live Class Earnings</SelectItem>
                                    <SelectItem value="Assignment Review">Assignment Review</SelectItem>
                                    <SelectItem value="Mentoring">Mentoring</SelectItem>
                                    <SelectItem value="Bonus">Bonus</SelectItem>
                                    <SelectItem value="Payout">Payout</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as TransactionStatus)}>
                                <SelectTrigger className="h-10 bg-muted/30 border-none focus:ring-1 focus:ring-primary">
                                    <SelectValue placeholder="All Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">All Status</SelectItem>
                                    <SelectItem value="Paid">Paid</SelectItem>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="Processing">Processing</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Card className="border-border/50 shadow-sm overflow-hidden">
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-muted/40">
                                        <TableRow className="hover:bg-transparent border-b-border/50">
                                            <TableHead className="pl-6 h-12 font-bold text-foreground">Date</TableHead>
                                            <TableHead className="h-12 font-bold text-foreground">Description</TableHead>
                                            <TableHead className="h-12 font-bold text-foreground">Credit (+)</TableHead>
                                            <TableHead className="h-12 font-bold text-foreground">Debit (-)</TableHead>
                                            <TableHead className="h-12 font-bold text-foreground">Status</TableHead>
                                            <TableHead className="pr-6 h-12 font-bold text-foreground text-right">Invoice</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredTransactions.length > 0 ? (
                                            filteredTransactions.map((row) => (
                                                <TableRow key={row.id} className="hover:bg-muted/20 transition-colors border-b-border/30 last:border-0">
                                                    <TableCell className="pl-6 py-5 text-sm font-medium text-muted-foreground">
                                                        {row.date}
                                                    </TableCell>
                                                    <TableCell className="py-5 font-bold text-foreground">
                                                        <div className="flex flex-col">
                                                            <span>{row.description}</span>
                                                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60">{row.type}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-5">
                                                        {row.credit > 0 ? (
                                                            <div className="flex items-center font-black text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded w-fit">
                                                                <ArrowDownLeft className="w-3.5 h-3.5 mr-1" />
                                                                <IndianRupee className="w-3.5 h-3.5 mr-0.5" />
                                                                {row.credit.toLocaleString("en-IN")}
                                                            </div>
                                                        ) : (
                                                            <span className="text-muted-foreground/30 ml-4">-</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="py-5">
                                                        {row.debit > 0 ? (
                                                            <div className="flex items-center font-black text-rose-600 bg-rose-500/10 px-2 py-1 rounded w-fit">
                                                                <ArrowUpRight className="w-3.5 h-3.5 mr-1" />
                                                                <IndianRupee className="w-3.5 h-3.5 mr-0.5" />
                                                                {row.debit.toLocaleString("en-IN")}
                                                            </div>
                                                        ) : (
                                                            <span className="text-muted-foreground/30 ml-4">-</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="py-5">
                                                        <Badge
                                                            variant="outline"
                                                            className={cn(
                                                                "font-bold uppercase text-[10px] tracking-wider px-2 py-0.5",
                                                                row.status === "Paid" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                                                                    row.status === "Pending" ? "bg-orange-500/10 text-orange-600 border-orange-500/20" :
                                                                        "bg-blue-500/10 text-blue-600 border-blue-500/20"
                                                            )}
                                                        >
                                                            {row.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="pr-6 py-5 text-right">
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors">
                                                            <Download className="w-4 h-4" />
                                                        </Button>
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
                                                            <p className="text-lg font-bold text-foreground">No transactions found</p>
                                                            <p className="text-sm text-muted-foreground">Try adjusting your filters or search terms.</p>
                                                        </div>
                                                        <Button variant="outline" size="sm" onClick={resetFilters} className="mt-2 font-bold">
                                                            Reset All Filters
                                                        </Button>
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

            {/* Payout Request Modal */}
            <Dialog open={isPayoutModalOpen} onOpenChange={setIsPayoutModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <ArrowUpRight className="w-5 h-5 text-primary" />
                            Request Payout
                        </DialogTitle>
                        <DialogDescription>
                            Withdraw funds from your available balance to your bank account.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-6 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-muted/50 p-3 rounded-lg border border-border/50">
                                <Label className="text-[10px] uppercase text-muted-foreground font-bold">Available</Label>
                                <div className="text-lg font-bold flex items-center text-foreground">
                                    <IndianRupee className="w-4 h-4 mr-0.5" />
                                    {walletMetrics.availableBalance.toLocaleString("en-IN")}
                                </div>
                            </div>
                            <div className="bg-muted/50 p-3 rounded-lg border border-border/50">
                                <Label className="text-[10px] uppercase text-muted-foreground font-bold">Minimum</Label>
                                <div className="text-lg font-bold flex items-center text-foreground">
                                    <IndianRupee className="w-4 h-4 mr-0.5" />
                                    {minWithdrawal.toLocaleString("en-IN")}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="amount" className="font-bold">Withdrawal Amount</Label>
                            <div className="relative">
                                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="amount"
                                    type="number"
                                    placeholder="Enter amount"
                                    className="pl-9 h-11"
                                    value={withdrawalAmount}
                                    onChange={(e) => setWithdrawalAmount(e.target.value)}
                                />
                            </div>
                            {withdrawalAmount !== "" && parseFloat(withdrawalAmount) < minWithdrawal && (
                                <p className="text-[11px] text-rose-500 font-medium">Minimum withdrawal is ₹{minWithdrawal}</p>
                            )}
                            {parseFloat(withdrawalAmount) > walletMetrics.availableBalance && (
                                <p className="text-[11px] text-rose-500 font-medium">Insufficient balance</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label className="font-bold">Select Bank Account</Label>
                            <Select value={selectedBank} onValueChange={setSelectedBank}>
                                <SelectTrigger className="h-11">
                                    <SelectValue placeholder="Choose account" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="HDFC Bank (**** 4512)">
                                        <div className="flex items-center gap-2">
                                            <Building2 className="w-4 h-4 text-muted-foreground" />
                                            <span>HDFC Bank (**** 4512)</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="ICICI Bank (**** 9821)">
                                        <div className="flex items-center gap-2">
                                            <Building2 className="w-4 h-4 text-muted-foreground" />
                                            <span>ICICI Bank (**** 9821)</span>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="ghost" onClick={() => setIsPayoutModalOpen(false)} className="font-bold">
                            Cancel
                        </Button>
                        <Button
                            onClick={handlePayoutSubmit}
                            disabled={!isAmountValid || !selectedBank || isSubmitting}
                            className="font-bold min-w-[140px]"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                    Processing...
                                </div>
                            ) : (
                                "Submit Request"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
};

export default TutorWallet;
