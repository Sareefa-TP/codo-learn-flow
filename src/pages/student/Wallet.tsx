import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Clock,
  Plus,
  FileText,
  Download,
  CreditCard,
  Smartphone,
  Building,
  AlertCircle,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Receipt,
  Bell,
  User,
  Hash,
  IndianRupee,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Demo Data
const walletProfile = {
  studentName: "Rahul Sharma",
  studentId: "STU-1024",
  course: "Full Stack Web Development",
  walletBalance: 2450,
  walletStatus: "Active",
  lastUpdated: "12 Aug 2026, 10:42 AM",
};

const walletSummary = {
  currentBalance: 2450,
  totalAdded: 10000,
  totalSpent: 7550,
  pendingPayments: 1500,
};

const feeStatus = {
  courseFee: 3000,
  paidViaWallet: 1500,
  pendingAmount: 1500,
  dueDate: "15 Aug 2026",
  status: "Partially Paid",
};

const transactions = [
  {
    id: "WAL-90871",
    date: "12 Aug 2026",
    time: "10:42 AM",
    type: "debit" as const,
    description: "Monthly Course Fee – August",
    amount: 1500,
    balanceAfter: 2450,
  },
  {
    id: "WAL-90214",
    date: "01 Aug 2026",
    time: "09:15 AM",
    type: "credit" as const,
    description: "Wallet Top-up (UPI)",
    amount: 3000,
    balanceAfter: 3950,
  },
  {
    id: "WAL-88902",
    date: "15 Jul 2026",
    time: "02:30 PM",
    type: "debit" as const,
    description: "Assessment Fee",
    amount: 500,
    balanceAfter: 950,
  },
  {
    id: "WAL-87655",
    date: "10 Jul 2026",
    time: "11:00 AM",
    type: "credit" as const,
    description: "Wallet Top-up (Card)",
    amount: 5000,
    balanceAfter: 1450,
  },
  {
    id: "WAL-86011",
    date: "01 Jul 2026",
    time: "09:00 AM",
    type: "debit" as const,
    description: "Monthly Course Fee – July",
    amount: 1500,
    balanceAfter: null,
  },
];

const quickAmounts = [500, 1000, 2000, 5000];

const paymentMethods = [
  { id: "upi", label: "UPI", icon: Smartphone, description: "Google Pay, PhonePe, Paytm" },
  { id: "debit", label: "Debit Card", icon: CreditCard, description: "Visa, Mastercard, RuPay" },
  { id: "credit", label: "Credit Card", icon: CreditCard, description: "Visa, Mastercard, Amex" },
  { id: "netbanking", label: "Net Banking", icon: Building, description: "All major banks" },
];

const notifications = [
  { type: "success", message: "₹3,000 added to your wallet successfully.", time: "01 Aug 2026" },
  { type: "warning", message: "Monthly course fee of ₹1,500 is due on 15 Aug.", time: "10 Aug 2026" },
  { type: "info", message: "Invoice generated for your August course payment.", time: "12 Aug 2026" },
];

const invoiceData = {
  invoiceId: "INV-2026-0812",
  studentName: "Rahul Sharma",
  paymentMethod: "Wallet",
  amountPaid: 1500,
  paymentDate: "12 Aug 2026",
  status: "Paid",
  courseName: "Full Stack Web Development",
  billingPeriod: "August 2026",
};

// Wallet Summary Card Component
const WalletSummaryCard = ({
  title,
  amount,
  icon: Icon,
  trend,
  className,
  accentColor,
}: {
  title: string;
  amount: number;
  icon: React.ElementType;
  trend?: "up" | "down" | "neutral";
  className?: string;
  accentColor?: string;
}) => (
  <Card className={cn("transition-lift card-elevated hover:card-elevated-hover", className)}>
    <CardContent className="p-6">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-semibold tracking-tight flex items-center gap-1">
            <IndianRupee className="h-5 w-5" />
            {amount.toLocaleString("en-IN")}
          </p>
        </div>
        <div className={cn("p-3 rounded-xl", accentColor || "bg-accent")}>
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
    </CardContent>
  </Card>
);

// Add Money Dialog Component
const AddMoneyDialog = () => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("upi");
  const [step, setStep] = useState<"amount" | "method" | "confirm">("amount");

  const amount = selectedAmount || Number(customAmount) || 0;

  const handleReset = () => {
    setSelectedAmount(null);
    setCustomAmount("");
    setSelectedMethod("upi");
    setStep("amount");
  };

  return (
    <Dialog onOpenChange={(open) => !open && handleReset()}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Money
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Money to Wallet</DialogTitle>
          <DialogDescription>
            Top up your wallet to pay course fees and assessments.
          </DialogDescription>
        </DialogHeader>

        {step === "amount" && (
          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Quick Select</Label>
              <div className="grid grid-cols-4 gap-2">
                {quickAmounts.map((amt) => (
                  <Button
                    key={amt}
                    variant={selectedAmount === amt ? "default" : "outline"}
                    className="h-12"
                    onClick={() => {
                      setSelectedAmount(amt);
                      setCustomAmount("");
                    }}
                  >
                    ₹{amt.toLocaleString()}
                  </Button>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">or enter amount</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="customAmount">Custom Amount</Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="customAmount"
                  type="number"
                  placeholder="Enter amount"
                  className="pl-9"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedAmount(null);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {step === "method" && (
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
              <span className="text-sm text-muted-foreground">Amount</span>
              <span className="font-semibold">₹{amount.toLocaleString("en-IN")}</span>
            </div>
            <Label className="text-sm font-medium">Payment Method</Label>
            <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod} className="space-y-2">
              {paymentMethods.map((method) => (
                <div key={method.id} className="relative">
                  <RadioGroupItem
                    value={method.id}
                    id={method.id}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={method.id}
                    className="flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-accent hover:bg-muted/50"
                  >
                    <method.icon className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium">{method.label}</p>
                      <p className="text-xs text-muted-foreground">{method.description}</p>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        {step === "confirm" && (
          <div className="space-y-4 py-4">
            <div className="p-4 bg-accent rounded-xl space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Amount</span>
                <span className="font-medium">₹{amount.toLocaleString("en-IN")}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Payment Method</span>
                <span className="font-medium">{paymentMethods.find(m => m.id === selectedMethod)?.label}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Processing Fee</span>
                <span className="font-medium text-primary">Free</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg">
                <span className="font-medium">Total</span>
                <span className="font-semibold">₹{amount.toLocaleString("en-IN")}</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              By proceeding, you agree to our payment terms. Amount will be added instantly.
            </p>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          {step !== "amount" && (
            <Button
              variant="outline"
              onClick={() => setStep(step === "confirm" ? "method" : "amount")}
            >
              Back
            </Button>
          )}
          <Button
            disabled={amount <= 0}
            onClick={() => {
              if (step === "amount") setStep("method");
              else if (step === "method") setStep("confirm");
              else {
                // Handle payment - would integrate with payment gateway
                handleReset();
              }
            }}
          >
            {step === "confirm" ? "Proceed to Pay" : "Continue"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Invoice Dialog Component
const InvoiceDialog = () => (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="outline" size="sm" className="gap-2">
        <FileText className="h-4 w-4" />
        View Invoice
      </Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>Invoice Details</DialogTitle>
        <DialogDescription>Invoice for your recent payment</DialogDescription>
      </DialogHeader>
      <div className="space-y-6 py-4">
        {/* Invoice Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-primary">CODO</p>
            <p className="text-xs text-muted-foreground">Academy</p>
          </div>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            {invoiceData.status}
          </Badge>
        </div>

        <Separator />

        {/* Invoice Details Grid */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <p className="text-muted-foreground flex items-center gap-1">
              <Hash className="h-3 w-3" /> Invoice ID
            </p>
            <p className="font-medium">{invoiceData.invoiceId}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" /> Payment Date
            </p>
            <p className="font-medium">{invoiceData.paymentDate}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground flex items-center gap-1">
              <User className="h-3 w-3" /> Student Name
            </p>
            <p className="font-medium">{invoiceData.studentName}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground flex items-center gap-1">
              <Wallet className="h-3 w-3" /> Payment Method
            </p>
            <p className="font-medium">{invoiceData.paymentMethod}</p>
          </div>
        </div>

        <Separator />

        {/* Line Items */}
        <div className="space-y-3">
          <p className="font-medium">Payment Details</p>
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{invoiceData.courseName}</span>
              <span>₹{invoiceData.amountPaid.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Billing Period</span>
              <span>{invoiceData.billingPeriod}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Total */}
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium">Total Paid</span>
          <span className="text-2xl font-bold flex items-center">
            <IndianRupee className="h-5 w-5" />
            {invoiceData.amountPaid.toLocaleString("en-IN")}
          </span>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

// Transaction Row Component
const TransactionRow = ({ transaction }: { transaction: typeof transactions[0] }) => (
  <TableRow className="group hover:bg-muted/50 transition-colors">
    <TableCell>
      <div>
        <p className="font-medium text-sm">{transaction.date}</p>
        <p className="text-xs text-muted-foreground">{transaction.time}</p>
      </div>
    </TableCell>
    <TableCell>
      <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
        {transaction.id}
      </code>
    </TableCell>
    <TableCell>
      <Badge
        variant="outline"
        className={cn(
          "gap-1",
          transaction.type === "credit"
            ? "bg-primary/10 text-primary border-primary/20"
            : "bg-warning/10 text-warning-foreground border-warning/20"
        )}
      >
        {transaction.type === "credit" ? (
          <ArrowDownLeft className="h-3 w-3" />
        ) : (
          <ArrowUpRight className="h-3 w-3" />
        )}
        {transaction.type === "credit" ? "Credit" : "Debit"}
      </Badge>
    </TableCell>
    <TableCell className="max-w-[200px]">
      <p className="truncate text-sm">{transaction.description}</p>
    </TableCell>
    <TableCell className="text-right">
      <span
        className={cn(
          "font-semibold",
          transaction.type === "credit" ? "text-primary" : "text-foreground"
        )}
      >
        {transaction.type === "credit" ? "+" : "-"}₹{transaction.amount.toLocaleString("en-IN")}
      </span>
    </TableCell>
    <TableCell className="text-right">
      {transaction.balanceAfter !== null ? (
        <span className="text-sm">₹{transaction.balanceAfter.toLocaleString("en-IN")}</span>
      ) : (
        <span className="text-xs text-muted-foreground">Adjusted</span>
      )}
    </TableCell>
  </TableRow>
);

const StudentWallet = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Wallet & Payments</h1>
            <p className="text-muted-foreground mt-1">
              Manage your balance, transactions, and payment methods
            </p>
          </div>
          <div className="flex items-center gap-3">
            <InvoiceDialog />
            <AddMoneyDialog />
          </div>
        </div>

        {/* Wallet Profile Banner */}
        <Card className="bg-gradient-to-r from-primary/5 via-primary/10 to-accent border-primary/10">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Wallet className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-lg">{walletProfile.studentName}</p>
                  <p className="text-sm text-muted-foreground">
                    {walletProfile.studentId} • {walletProfile.course}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  {walletProfile.walletStatus}
                </Badge>
                <p className="text-xs text-muted-foreground">
                  Last updated: {walletProfile.lastUpdated}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Wallet Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <WalletSummaryCard
            title="Current Balance"
            amount={walletSummary.currentBalance}
            icon={Wallet}
            accentColor="bg-primary/10"
          />
          <WalletSummaryCard
            title="Total Added"
            amount={walletSummary.totalAdded}
            icon={TrendingUp}
            accentColor="bg-accent"
          />
          <WalletSummaryCard
            title="Total Spent"
            amount={walletSummary.totalSpent}
            icon={TrendingDown}
            accentColor="bg-muted"
          />
          <WalletSummaryCard
            title="Pending Payments"
            amount={walletSummary.pendingPayments}
            icon={Clock}
            accentColor="bg-warning/10"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Fee Status Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Monthly Fee Status</CardTitle>
              <CardDescription>Your current course fee payment status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Course Fee</span>
                  <span className="font-semibold">₹{feeStatus.courseFee.toLocaleString("en-IN")}/month</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Paid via Wallet</span>
                  <span className="font-medium text-primary">₹{feeStatus.paidViaWallet.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Pending Amount</span>
                  <span className="font-medium text-warning">₹{feeStatus.pendingAmount.toLocaleString("en-IN")}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Due Date</span>
                  <span className="font-medium">{feeStatus.dueDate}</span>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm text-warning-foreground">Partially Paid</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Please add ₹{feeStatus.pendingAmount.toLocaleString("en-IN")} before {feeStatus.dueDate} to avoid interruptions.
                    </p>
                  </div>
                </div>
              </div>

              <Button className="w-full gap-2">
                <CreditCard className="h-4 w-4" />
                Pay Remaining ₹{feeStatus.pendingAmount.toLocaleString("en-IN")}
              </Button>
            </CardContent>
          </Card>

          {/* Notifications Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Wallet Notifications
              </CardTitle>
              <CardDescription>Recent updates about your wallet</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notifications.map((notification, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-start gap-3 p-4 rounded-lg border transition-colors",
                      notification.type === "success" && "bg-primary/5 border-primary/10",
                      notification.type === "warning" && "bg-warning/5 border-warning/10",
                      notification.type === "info" && "bg-muted border-muted"
                    )}
                  >
                    {notification.type === "success" && (
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                    )}
                    {notification.type === "warning" && (
                      <AlertCircle className="h-5 w-5 text-warning shrink-0" />
                    )}
                    {notification.type === "info" && (
                      <Receipt className="h-5 w-5 text-muted-foreground shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg">Transaction History</CardTitle>
                <CardDescription>All your wallet credits and debits</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Export Statement
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">Date</TableHead>
                    <TableHead className="w-[120px]">Transaction ID</TableHead>
                    <TableHead className="w-[100px]">Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right w-[120px]">Amount</TableHead>
                    <TableHead className="text-right w-[120px]">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TransactionRow key={transaction.id} transaction={transaction} />
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Empty/Edge State Examples (Hidden by default, for reference) */}
        {false && (
          <div className="space-y-4">
            {/* Low Balance State */}
            <Card className="border-warning/30 bg-warning/5">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-warning/10">
                    <AlertCircle className="h-6 w-6 text-warning" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Your wallet balance is low</p>
                    <p className="text-sm text-muted-foreground">
                      Add funds to avoid interruptions in your learning journey.
                    </p>
                  </div>
                  <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Money
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* No Transactions State */}
            <Card>
              <CardContent className="p-12 text-center">
                <div className="p-4 rounded-full bg-muted inline-block mb-4">
                  <Wallet className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-1">Your wallet is ready</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Add money to get started with payments.
                </p>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Money
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentWallet;
