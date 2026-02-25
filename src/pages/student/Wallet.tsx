import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  IndianRupee,
  CreditCard,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Wallet
} from "lucide-react";
import { cn } from "@/lib/utils";

// Demo Data
const financialOverview = {
  totalFee: 60000,
  totalPaid: 45000,
  balance: 15000,
  completion: 75
};

const installmentTimeline = [
  { id: 1, name: "Enrollment Payment", amount: 20000, status: "Paid", date: "15 Jan 2026" },
  { id: 2, name: "Installment 1", amount: 15000, status: "Paid", date: "15 Feb 2026" },
  { id: 3, name: "Installment 2", amount: 10000, status: "Paid", date: "15 Mar 2026" },
  { id: 4, name: "Installment 3", amount: 15000, status: "Due", date: "15 Apr 2026" },
];

const nextPayment = {
  amount: 15000,
  dueDate: "15 Apr 2026",
  isOverdue: false
};

const paymentHistory = [
  {
    invoiceId: "INV-2026-0315",
    date: "15 Mar 2026",
    description: "Installment 2 - Full Stack Web Dev",
    amount: 10000,
    method: "Credit Card",
    txnId: "TXN-892341908",
    status: "Paid"
  },
  {
    invoiceId: "INV-2026-0215",
    date: "15 Feb 2026",
    description: "Installment 1 - Full Stack Web Dev",
    amount: 15000,
    method: "UPI",
    txnId: "TXN-762145902",
    status: "Paid"
  },
  {
    invoiceId: "INV-2026-0115",
    date: "15 Jan 2026",
    description: "Enrollment Payment",
    amount: 20000,
    method: "Net Banking",
    txnId: "TXN-651908234",
    status: "Paid"
  },
  {
    invoiceId: "INV-2026-0112",
    date: "12 Jan 2026",
    description: "Enrollment Payment (Failed Attempt)",
    amount: 20000,
    method: "Debit Card",
    txnId: "TXN-549012387",
    status: "Failed"
  }
];

// Reusable Metric Card
const MetricCard = ({ title, amount, icon: Icon, isPercentage = false }: { title: string; amount: number; icon: any; isPercentage?: boolean }) => (
  <Card className="transition-all hover:shadow-md border-border/50">
    <CardContent className="p-6">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-center gap-1.5">
            {!isPercentage && <IndianRupee className="w-5 h-5 text-foreground/80" />}
            <p className="text-2xl font-bold tracking-tight text-foreground">
              {isPercentage ? `${amount}%` : amount.toLocaleString("en-IN")}
            </p>
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>
      {isPercentage && (
        <Progress value={amount} className="h-1.5 mt-4 bg-muted" />
      )}
    </CardContent>
  </Card>
);

const StudentWallet = () => {
  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6 lg:space-y-8 max-w-6xl mx-auto">

        {/* Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">
            Wallet & Payments
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your course fees, track installments, and download invoices.
          </p>
        </div>

        {/* 1️⃣ Financial Overview Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="Total Course Fee" amount={financialOverview.totalFee} icon={Wallet} />
          <MetricCard title="Total Paid" amount={financialOverview.totalPaid} icon={CheckCircle2} />
          <MetricCard title="Remaining Balance" amount={financialOverview.balance} icon={Clock} />
          <MetricCard title="Payment Completion" amount={financialOverview.completion} icon={CreditCard} isPercentage />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* 2️⃣ Installment Timeline Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">Installment Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative border-l-2 border-muted/60 ml-3 md:ml-4 space-y-8 pb-4">
                  {installmentTimeline.map((item, index) => {
                    const isPaid = item.status === "Paid";
                    return (
                      <div key={item.id} className="relative pl-6 md:pl-8">
                        {/* Timeline Marker */}
                        <div className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full border-4 border-background flex items-center justify-center
                          ${isPaid ? "bg-primary" : "bg-warning"}
                        `}>
                          {isPaid ? (
                            <CheckCircle2 className="w-3 h-3 text-primary-foreground absolute" />
                          ) : (
                            <Clock className="w-3 h-3 text-warning-foreground absolute" />
                          )}
                        </div>

                        {/* Timeline Content */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 rounded-xl border bg-card hover:bg-muted/30 transition-colors">
                          <div>
                            <p className="font-semibold text-foreground">{item.name}</p>
                            <p className="text-sm text-muted-foreground mt-0.5">{item.date}</p>
                          </div>

                          <div className="flex items-center gap-4 sm:justify-end">
                            <span className="font-bold text-lg flex items-center">
                              <IndianRupee className="w-4 h-4" />
                              {item.amount.toLocaleString("en-IN")}
                            </span>
                            <Badge variant={isPaid ? "default" : "outline"} className={cn(
                              "w-16 justify-center",
                              isPaid ? "bg-primary/10 text-primary hover:bg-primary/20" : "text-warning border-warning/30"
                            )}>
                              {item.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 3️⃣ Upcoming Payment Alert */}
          <div className="lg:col-span-1">
            {financialOverview.balance > 0 && (
              <Card className="border-warning/30 bg-warning/5 shadow-sm sticky top-24">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center shrink-0">
                      <AlertCircle className="w-6 h-6 text-warning" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-warning-foreground">Next Payment Due</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Please clear your due installment before the deadline.
                      </p>
                    </div>
                  </div>

                  <div className="bg-background rounded-xl p-4 border border-warning/20 mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Amount Due</span>
                      <span className="text-sm font-medium">{nextPayment.dueDate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <IndianRupee className="w-6 h-6 text-foreground" />
                      <span className="text-3xl font-bold tracking-tight text-foreground">
                        {nextPayment.amount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  <Button className="w-full h-12 text-md font-medium shadow-sm hover:shadow-md transition-all gap-2">
                    <CreditCard className="w-5 h-5" />
                    Pay Now
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* 4️⃣ Payment History Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Payment History</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="w-full">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-[130px] pl-6">Invoice ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="min-w-[200px]">Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right pr-6">Invoice</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentHistory.map((payment) => (
                    <TableRow key={payment.invoiceId} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="pl-6 font-medium text-muted-foreground">
                        {payment.invoiceId}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{payment.date}</TableCell>
                      <TableCell className="font-medium text-foreground">{payment.description}</TableCell>
                      <TableCell>
                        <span className="flex items-center font-semibold">
                          <IndianRupee className="w-3.5 h-3.5" />
                          {payment.amount.toLocaleString("en-IN")}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{payment.method}</TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded font-mono text-muted-foreground">
                          {payment.txnId}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn(
                          payment.status === "Paid" ? "bg-primary/10 text-primary border-primary/20" :
                            payment.status === "Pending" ? "bg-warning/10 text-warning border-warning/20" :
                              "bg-destructive/10 text-destructive border-destructive/20"
                        )}>
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                          <Download className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  );
};

export default StudentWallet;
