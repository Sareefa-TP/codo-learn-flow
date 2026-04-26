import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  ChevronRight,
  BookOpen,
  Layout,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import CourseCard from "@/components/student/CourseCard";
import { Wallet as WalletIcon } from "lucide-react";
import PageSearch from "@/components/shared/PageSearch";
import { toast } from "sonner";
import { PageHeader, PageSection } from "@/components/shared/PageScaffold";
import BackButton from "@/components/shared/BackButton";
import { studentData } from "@/data/studentData";
import { downloadInvoicePdf } from "@/lib/pdf/invoicePdf";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Types
interface Message {
  id: string;
  sender: "Student" | "Support";
  text: string;
  timestamp: string;
}

interface Installment {
  id: number;
  name: string;
  amount: number;
  status: "Paid" | "Due" | "Upcoming";
  date: string;
}

interface Transaction {
  invoiceId: string;
  date: string;
  description: string;
  amount: number;
  method: string;
  txnId: string;
  status: "Paid" | "Pending" | "Failed";
}

interface CourseFinance {
  id: string;
  courseName: string;
  category: string;
  duration: string;
  totalFee: number;
  totalPaid: number;
  balance: number;
  walletBalance: number;
  completion: number;
  installments: Installment[];
  nextPayment: {
    amount: number;
    dueDate: string;
    isOverdue: boolean;
  };
  paymentHistory: Transaction[];
}

// Complex Multi-Course Mock Data
const COURSES_FINANCE: Record<string, CourseFinance> = {
  "full-stack-web": {
    id: "full-stack-web",
    courseName: "Full Stack Web Development",
    category: "Web Development",
    duration: "3 Months",
    totalFee: 60000,
    totalPaid: 45000,
    balance: 15000,
    walletBalance: 25400,
    completion: 75,
    installments: [
      { id: 1, name: "Enrollment Payment", amount: 20000, status: "Paid", date: "15 Jan 2026" },
      { id: 2, name: "Installment 1", amount: 15000, status: "Paid", date: "15 Feb 2026" },
      { id: 3, name: "Installment 2", amount: 10000, status: "Paid", date: "15 Mar 2026" },
      { id: 4, name: "Installment 3", amount: 15000, status: "Due", date: "15 Apr 2026" },
      { id: 5, name: "Installment 4", amount: 0, status: "Upcoming", date: "15 May 2026" },
    ],
    nextPayment: { amount: 15000, dueDate: "15 Apr 2026", isOverdue: false },
    paymentHistory: [
      { invoiceId: "INV-2026-0402", date: "02 Apr 2026", description: "Late Fee Waiver Credit", amount: 500, method: "Wallet Credit", txnId: "TXN-991245673", status: "Paid" },
      { invoiceId: "INV-2026-0328", date: "28 Mar 2026", description: "Installment 3 Attempt", amount: 15000, method: "Debit Card", txnId: "TXN-910238445", status: "Pending" },
      { invoiceId: "INV-2026-0315", date: "15 Mar 2026", description: "Installment 2 - Full Stack Web Dev", amount: 10000, method: "Credit Card", txnId: "TXN-892341908", status: "Paid" },
      { invoiceId: "INV-2026-0308", date: "08 Mar 2026", description: "Gateway Retry Charge", amount: 10000, method: "UPI", txnId: "TXN-882110477", status: "Failed" },
      { invoiceId: "INV-2026-0215", date: "15 Feb 2026", description: "Installment 1 - Full Stack Web Dev", amount: 15000, method: "UPI", txnId: "TXN-762145902", status: "Paid" },
      { invoiceId: "INV-2026-0115", date: "15 Jan 2026", description: "Enrollment Payment", amount: 20000, method: "Net Banking", txnId: "TXN-651908234", status: "Paid" },
    ]
  },
  "data-science-pro": {
    id: "data-science-pro",
    courseName: "Data Science Professional",
    category: "Data Science",
    duration: "6 Months",
    totalFee: 85000,
    totalPaid: 35000,
    balance: 50000,
    walletBalance: 12800,
    completion: 41.1,
    installments: [
      { id: 1, name: "Enrollment Payment", amount: 35000, status: "Paid", date: "01 Feb 2026" },
      { id: 2, name: "Installment 1", amount: 25000, status: "Due", date: "01 May 2026" },
      { id: 3, name: "Installment 2", amount: 25000, status: "Upcoming", date: "01 Aug 2026" },
      { id: 4, name: "Certification Fee", amount: 0, status: "Upcoming", date: "15 Aug 2026" },
    ],
    nextPayment: { amount: 25000, dueDate: "01 May 2026", isOverdue: false },
    paymentHistory: [
      { invoiceId: "INV-DS2026-04", date: "20 Apr 2026", description: "Installment 1 Attempt", amount: 25000, method: "Net Banking", txnId: "TXN-990776451", status: "Pending" },
      { invoiceId: "INV-DS2026-03", date: "12 Apr 2026", description: "Bank Reconciliation Retry", amount: 25000, method: "Credit Card", txnId: "TXN-985422700", status: "Failed" },
      { invoiceId: "INV-DS2026-02", date: "05 Mar 2026", description: "Platform Service Credit", amount: 1200, method: "Wallet Credit", txnId: "TXN-973154860", status: "Paid" },
      { invoiceId: "INV-DS2026-01", date: "01 Feb 2026", description: "Enrollment Fee - Data Science", amount: 35000, method: "UPI", txnId: "TXN-998877665", status: "Paid" },
    ]
  }
};

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
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState<CourseFinance | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Coupon state (applies to the "Next Payment Due" amount)
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [paymentDescription, setPaymentDescription] = useState("");
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [isSubmittingPaymentProof, setIsSubmittingPaymentProof] = useState(false);
  const [isPendingVerification, setIsPendingVerification] = useState(false);
  const [verificationSubmittedAt, setVerificationSubmittedAt] = useState("");

  const coupons: Array<{ code: string; type: "percentage" | "fixed"; value: number }> = [
    { code: "WELCOME10", type: "percentage", value: 10 },
    { code: "SAVE500", type: "fixed", value: 500 },
    { code: "STUDENT20", type: "percentage", value: 20 },
  ];

  useEffect(() => {
    if (courseId && COURSES_FINANCE[courseId]) {
      setCourseData(COURSES_FINANCE[courseId]);
    } else {
      setCourseData(null);
    }
  }, [courseId]);

  useEffect(() => {
    const amount = courseData?.nextPayment.amount ?? 0;
    setFinalAmount(amount);
    setDiscountAmount(0);
    setCouponApplied(false);
    setMessage("");
    setErrorMessage("");
    setCouponCode("");
    setIsPaymentDialogOpen(false);
    setPaymentDescription("");
    setPaymentScreenshot(null);
    setIsSubmittingPaymentProof(false);
    setIsPendingVerification(false);
    setVerificationSubmittedAt("");
  }, [courseData?.id, courseData?.nextPayment.amount]);

  const handleSubmitPaymentProof = () => {
    if (!courseData || isSubmittingPaymentProof) return;
    if (!paymentDescription.trim()) {
      toast.error("Please add a payment description.");
      return;
    }
    if (!paymentScreenshot) {
      toast.error("Please upload your payment screenshot.");
      return;
    }

    setIsSubmittingPaymentProof(true);

    setTimeout(() => {
      const submittedAt = new Date().toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      const pendingEntry: Transaction = {
        invoiceId: `INV-VERIFY-${Date.now().toString().slice(-6)}`,
        date: submittedAt.split(",")[0],
        description: `Payment Proof Submitted - ${paymentDescription.trim()}`,
        amount: finalAmount,
        method: "Manual Verification",
        txnId: `TXN-VERIFY-${Date.now().toString().slice(-8)}`,
        status: "Pending",
      };

      setCourseData((prev) =>
        prev
          ? {
              ...prev,
              paymentHistory: [pendingEntry, ...prev.paymentHistory],
            }
          : prev,
      );

      setVerificationSubmittedAt(submittedAt);
      setIsPendingVerification(true);
      setIsPaymentDialogOpen(false);
      setIsSubmittingPaymentProof(false);
      setPaymentDescription("");
      setPaymentScreenshot(null);

      toast.success("Payment proof sent to Admin & Finance. Status: Pending Verification.");
    }, 900);
  };

  const applyCoupon = () => {
    if (couponApplied) return;

    const code = couponCode.trim().toUpperCase();
    if (!code) {
      setErrorMessage("Please enter a coupon code");
      setMessage("");
      return;
    }

    setErrorMessage("");
    setMessage("");

    const original = courseData?.nextPayment.amount ?? 0;
    const match = coupons.find((c) => c.code === code);
    if (!match) {
      setErrorMessage("Invalid coupon code");
      return;
    }

    const rawDiscount =
      match.type === "percentage" ? (original * match.value) / 100 : match.value;

    const appliedDiscount = Math.min(Math.max(0, Math.round(rawDiscount)), original);
    const nextFinal = Math.max(0, original - appliedDiscount);

    setCouponApplied(true);
    setCouponCode(code);
    setDiscountAmount(appliedDiscount);
    setFinalAmount(nextFinal);
    setMessage("Coupon applied successfully!");
    setErrorMessage("");
  };

  const removeCoupon = () => {
    const original = courseData?.nextPayment.amount ?? 0;
    setCouponApplied(false);
    setCouponCode("");
    setDiscountAmount(0);
    setFinalAmount(original);
    setMessage("");
    setErrorMessage("");
  };

  const filteredCourses = Object.values(COURSES_FINANCE).filter(course =>
    course.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderCourseList = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
      <PageHeader
        title="Wallet & Payments"
        description="Select a course to view your financial detailed breakdown and clear dues."
      />
      <div className="mb-6">
        <PageSearch
          placeholder="Search courses by name or category..."
          onSearch={setSearchQuery}
          className="mb-0"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <CourseCard
            key={course.id}
            title={course.courseName}
            category={course.category}
            duration={`${course.duration} Program`}
            progress={course.completion}
            progressLabel="Payment Completion"
            actionText="View Payments"
            actionIcon={ChevronRight}
            onActionClick={() => {
              toast.info(`Viewing payment details for ${course.courseName}`);
              navigate(`/student/payments/${course.id}`);
            }}
            onDetailsClick={() => {
              toast.info(`Loading statement for ${course.courseName}`);
              navigate(`/student/payments/${course.id}`);
            }}
          />
        ))}
      </div>
    </div>
  );

  const renderWalletDetails = () => {
    if (!courseData) return null;

    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6 lg:space-y-8 max-w-6xl mx-auto px-4 md:px-6 lg:px-8 pb-10">
        {/* Navigation & Header */}
        <div className="space-y-4">
          <BackButton label="Back to Courses" onClick={() => navigate("/student/payments")} />

          <PageSection className="mb-0 bg-primary/5 p-4">
            <PageHeader
              title={courseData.courseName}
              description={`Financial ID: WAL-${courseData.id.toUpperCase()} • Last update: Just now`}
              className="mb-0"
            />
          </PageSection>
        </div>

        {/* 1️⃣ Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <MetricCard title="Total Course Fee" amount={courseData.totalFee} icon={WalletIcon} />
          <MetricCard title="Total Paid" amount={courseData.totalPaid} icon={CheckCircle2} />
          <MetricCard title="Remaining Balance" amount={courseData.balance} icon={Clock} />
          <MetricCard title="Wallet Balance" amount={courseData.walletBalance} icon={IndianRupee} />
          <MetricCard title="Payment Completion" amount={courseData.completion} icon={CreditCard} isPercentage />
          <MetricCard title="Next Payment Due" amount={courseData.nextPayment.amount} icon={AlertCircle} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* 2️⃣ Timeline */}
          <div className="lg:col-span-2">
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Installment Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative border-l-2 border-muted/60 ml-3 md:ml-4 space-y-8 pb-4">
                  {courseData.installments.map((item) => {
                    const isPaid = item.status === "Paid";
                    const isDue = item.status === "Due";
                    return (
                      <div key={item.id} className="relative pl-6 md:pl-8">
                        <div className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full border-4 border-background flex items-center justify-center
                          ${isPaid ? "bg-primary" : isDue ? "bg-warning" : "bg-muted"}
                        `}>
                          {isPaid ? (
                            <CheckCircle2 className="w-3 h-3 text-primary-foreground absolute" />
                          ) : (
                            <Clock className={`w-3 h-3 ${isDue ? "text-warning-foreground" : "text-muted-foreground"} absolute`} />
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border bg-card hover:bg-muted/30 transition-colors">
                          <div>
                            <p className="font-bold text-foreground">{item.name}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{item.date}</p>
                          </div>

                          <div className="flex items-center gap-4 sm:justify-end">
                            <span className="font-bold flex items-center">
                              <IndianRupee className="w-3.5 h-3.5" />
                              {item.amount.toLocaleString("en-IN")}
                            </span>
                            <Badge variant={isPaid ? "default" : "outline"} className={cn(
                              "w-16 justify-center text-[10px] font-bold h-5 px-1.5",
                              isPaid ? "bg-primary/10 text-primary hover:bg-primary/20" : 
                              isDue ? "text-warning border-warning/30 bg-warning/5" : "text-muted-foreground border-muted-foreground/30"
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

          {/* 3️⃣ Pay Now Sticky */}
          <div className="lg:col-span-1 h-full">
            {courseData.balance > 0 && (
              <Card className="h-full border-warning/30 bg-warning/5 shadow-sm">
                <CardContent className="flex h-full flex-col p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center shrink-0">
                      <AlertCircle className="w-6 h-6 text-warning" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-warning-foreground">Next Payment Due</h3>

                    </div>
                  </div>

                  <div className="bg-background rounded-xl p-4 border border-warning/20 mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-muted-foreground uppercase">Amount Due</span>
                      <span className="text-xs font-bold text-warning-foreground">{courseData.nextPayment.dueDate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <IndianRupee className="w-6 h-6 text-foreground" />
                      <span className="text-3xl font-bold tracking-tight text-foreground">
                        {finalAmount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  {/* Coupon Code */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Coupon Code"
                        value={couponCode}
                        disabled={couponApplied}
                        onChange={(e) => {
                          const next = e.target.value.toUpperCase();
                          setCouponCode(next);
                          if (errorMessage) setErrorMessage("");
                          if (message) setMessage("");
                        }}
                        className="h-11 rounded-xl"
                      />

                      {couponApplied ? (
                        <Button
                          type="button"
                          variant="outline"
                          className="h-11 rounded-xl font-bold"
                          onClick={removeCoupon}
                        >
                          Remove
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          className="h-11 rounded-xl font-bold"
                          onClick={applyCoupon}
                        >
                          Apply
                        </Button>
                      )}
                    </div>

                    {errorMessage ? (
                      <p className="text-xs font-semibold text-destructive">{errorMessage}</p>
                    ) : message ? (
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-primary">{message}</p>
                        {discountAmount > 0 && (
                          <p className="text-xs font-semibold text-muted-foreground">
                            You saved <span className="text-foreground">₹{discountAmount.toLocaleString("en-IN")}</span>
                          </p>
                        )}
                      </div>
                    ) : null}
                  </div>

                  {/* Price Breakdown */}
                  <div className="bg-background rounded-xl p-4 border border-warning/20 mb-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                        <span>Original Price</span>
                        <span className="flex items-center">
                          <IndianRupee className="w-3.5 h-3.5" />
                          {(courseData.nextPayment.amount ?? 0).toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                        <span>Discount</span>
                        <span className={cn(
                          "flex items-center",
                          discountAmount > 0 ? "text-primary" : "text-muted-foreground"
                        )}>
                          <span className="mr-0.5">-</span>
                          <IndianRupee className="w-3.5 h-3.5" />
                          {discountAmount.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="h-px bg-warning/15" />
                      <div className="flex items-center justify-between text-sm font-bold text-foreground">
                        <span>Final Amount</span>
                        <span className="flex items-center">
                          <IndianRupee className="w-4 h-4" />
                          {finalAmount.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto pt-2">
                    {isPendingVerification ? (
                      <div className="rounded-xl border border-warning/30 bg-warning/10 p-3 text-center">
                        <p className="text-xs font-bold uppercase tracking-wide text-warning">
                          Pending Verification
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Submitted to Admin & Finance on {verificationSubmittedAt}
                        </p>
                      </div>
                    ) : null}
                    <Button
                      className="w-full h-12 text-md font-bold shadow-md hover:shadow-lg transition-all gap-2 rounded-xl mt-3"
                      disabled={isPendingVerification}
                      onClick={() => setIsPaymentDialogOpen(true)}
                    >
                    <CreditCard className="w-5 h-5" />
                    {isPendingVerification ? "Awaiting Verification" : "Pay Now"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* 4️⃣ Payment History */}
        <Card className="shadow-sm">
          <CardHeader className="border-b">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Payment History
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="w-full">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-[130px] pl-6 h-12 text-[10px] uppercase font-bold text-muted-foreground">Invoice ID</TableHead>
                    <TableHead className="h-12 text-[10px] uppercase font-bold text-muted-foreground">Date</TableHead>
                    <TableHead className="min-w-[200px] h-12 text-[10px] uppercase font-bold text-muted-foreground">Description</TableHead>
                    <TableHead className="h-12 text-[10px] uppercase font-bold text-muted-foreground">Amount</TableHead>
                    <TableHead className="h-12 text-[10px] uppercase font-bold text-muted-foreground">Method</TableHead>
                    <TableHead className="h-12 text-[10px] uppercase font-bold text-muted-foreground">Transaction ID</TableHead>
                    <TableHead className="h-12 text-[10px] uppercase font-bold text-muted-foreground">Status</TableHead>
                    <TableHead className="text-right pr-6 h-12 text-[10px] uppercase font-bold text-muted-foreground">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courseData.paymentHistory.map((payment) => (
                    <TableRow key={payment.invoiceId} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="pl-6 font-mono text-xs text-muted-foreground">
                        {payment.invoiceId}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-xs font-medium">{payment.date}</TableCell>
                      <TableCell className="font-bold text-sm text-foreground">{payment.description}</TableCell>
                      <TableCell>
                        <span className="flex items-center font-bold text-sm">
                          <IndianRupee className="w-3.5 h-3.5" />
                          {payment.amount.toLocaleString("en-IN")}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs font-medium text-muted-foreground">{payment.method}</TableCell>
                      <TableCell>
                        <code className="text-[10px] bg-muted px-2 py-1 rounded font-mono text-muted-foreground border">
                          {payment.txnId}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn(
                          "text-[10px] font-bold px-1.5 h-5",
                          payment.status === "Paid" ? "bg-primary/10 text-primary border-primary/20" :
                            payment.status === "Pending" ? "bg-warning/10 text-warning border-warning/20" :
                              "bg-destructive/10 text-destructive border-destructive/20"
                        )}>
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/5"
                          onClick={() => {
                            downloadInvoicePdf({
                              studentName: studentData.profile.name,
                              courseName: courseData.courseName,
                              category: courseData.category,
                              transaction: payment,
                            });
                            toast.success(`Invoice ${payment.invoiceId} downloaded`);
                          }}
                        >
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

        <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
          <DialogContent className="max-w-lg rounded-2xl">
            <DialogHeader>
              <DialogTitle>Submit Payment for Verification</DialogTitle>
              <DialogDescription>
                Share transaction details and screenshot. This request will be sent to Admin & Finance for verification.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="rounded-xl border border-border/70 bg-muted/20 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Amount to verify</p>
                <p className="mt-1 text-2xl font-bold text-foreground">₹{finalAmount.toLocaleString("en-IN")}</p>
                <p className="text-xs text-muted-foreground mt-1">Due date: {courseData?.nextPayment.dueDate}</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Payment Description</label>
                <Input
                  placeholder="Example: UPI transfer via GPay, Ref ID 2345..."
                  value={paymentDescription}
                  onChange={(e) => setPaymentDescription(e.target.value)}
                  className="h-11 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Upload Payment Screenshot</label>
                <Input
                  type="file"
                  accept=".png,.jpg,.jpeg,.webp,.pdf"
                  onChange={(e) => setPaymentScreenshot(e.target.files?.[0] || null)}
                  className="h-11 rounded-xl"
                />
                {paymentScreenshot ? (
                  <p className="text-xs text-muted-foreground">Selected: {paymentScreenshot.name}</p>
                ) : null}
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => setIsPaymentDialogOpen(false)}
                disabled={isSubmittingPaymentProof}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmitPaymentProof} disabled={isSubmittingPaymentProof}>
                {isSubmittingPaymentProof ? "Sending..." : "Send for Verification"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  };

  return (
    <DashboardLayout>
      {courseId ? renderWalletDetails() : renderCourseList()}
    </DashboardLayout>
  );
};

export default StudentWallet;
