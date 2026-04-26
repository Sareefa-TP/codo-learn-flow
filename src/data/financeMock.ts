import { 
  TrendingUp, 
  AlertCircle, 
  Wallet, 
  RotateCcw, 
  CheckCircle2, 
  BarChart3, 
  CreditCard,
  DollarSign,
  FileText,
  ShieldCheck,
  Video,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  GraduationCap
} from "lucide-react";

export const kpiData = [
  { 
    id: 1, 
    label: "Revenue this month", 
    value: "₹12.85L", 
    trend: "12.5%", 
    trendUp: true, 
    sub: "Target: 92% achieved", 
    icon: TrendingUp,
    alert: "normal"
  },
  { 
    id: 2, 
    label: "Outstanding dues", 
    value: "₹4.20L", 
    sub: "₹1.8L overdue > 30 days", 
    icon: AlertCircle,
    alert: "red"
  },
  { 
    id: 3, 
    label: "Pending payouts", 
    value: "12 Requests", 
    sub: "Total: ₹1.85L", 
    icon: Wallet,
    alert: "amber"
  },
  { 
    id: 4, 
    label: "Pending refunds", 
    value: "4 Requests", 
    sub: "Oldest: 18 hours ago", 
    icon: RotateCcw,
    alert: "red"
  },
  { 
    id: 5, 
    label: "Collection rate", 
    value: "84.2%", 
    trend: "2.1%", 
    trendUp: true, 
    sub: "Last month: 82.1%", 
    icon: CheckCircle2,
    alert: "amber" // < 90% is amber
  },
  { 
    id: 6, 
    label: "Net revenue", 
    value: "₹6.80L", 
    trend: "5.4%", 
    trendUp: true, 
    sub: "After payouts & refunds", 
    icon: BarChart3,
    alert: "normal"
  },
  { 
    id: 7, 
    label: "Wallet liability", 
    value: "₹2.45L", 
    sub: "Across all student wallets", 
    icon: CreditCard,
    alert: "amber"
  },
  { 
    id: 8, 
    label: "Unreconciled", 
    value: "8 Entries", 
    sub: "Gateway mismatches found", 
    icon: AlertCircle,
    alert: "red"
  }
];

export const revenueTrendData = [
  { month: "May 25", actual: 95000, target: 110000, status: "missed" },
  { month: "Jun 25", actual: 120000, target: 115000, status: "beat" },
  { month: "Jul 25", actual: 135000, target: 125000, status: "beat" },
  { month: "Aug 25", actual: 110000, target: 130000, status: "missed" },
  { month: "Sep 25", actual: 145000, target: 140000, status: "beat" },
  { month: "Oct 25", actual: 160000, target: 150000, status: "beat" },
  { month: "Nov 25", actual: 140000, target: 160000, status: "missed" },
  { month: "Dec 25", actual: 185000, target: 170000, status: "beat" },
  { month: "Jan 26", actual: 210000, target: 180000, status: "beat" },
  { month: "Feb 26", actual: 190000, target: 200000, status: "missed" },
  { month: "Mar 26", actual: 235000, target: 220000, status: "beat" },
  { month: "Apr 26", actual: 290000, target: 250000, status: "beat" },
];

export const revenueByCourseData = [
  { name: "Full Stack Development", revenue: 850000, students: 124, avgFee: 18500, percentage: 45, icon: GraduationCap },
  { name: "Python Backend", revenue: 540000, students: 86, avgFee: 15000, percentage: 28, icon: Layers },
  { name: "UI/UX Mastery", revenue: 420000, students: 52, avgFee: 12000, percentage: 15, icon: Video },
  { name: "Data Science Pro", revenue: 310000, students: 30, avgFee: 25000, percentage: 12, icon: BarChart3 },
];

export const agingBuckets = [
  { label: "0–30 Days", amount: "₹1.25L", count: 8, percentage: 45, color: "bg-blue-500" },
  { label: "31–60 Days", amount: "₹85K", count: 5, percentage: 30, color: "bg-amber-500" },
  { label: "61–90 Days", amount: "₹1.1L", count: 7, percentage: 40, color: "bg-orange-500" },
  { label: "90+ Days", amount: "₹1.0L", count: 4, percentage: 25, color: "bg-rose-500" },
];

export const actionItems = [
  { id: 1, title: "Payout requests overdue", meta: "12 requests • ₹1.85L", priority: "high", color: "red", icon: Wallet, href: "/finance/payouts" },
  { id: 2, title: "Large refund approved", meta: "₹45,000 for ORD-2026-004", priority: "high", color: "red", icon: RotateCcw, href: "/finance/refunds" },
  { id: 3, title: "Unpaid invoices to chase", meta: "24 invoices • ₹4.2L", priority: "medium", color: "amber", icon: FileText, href: "/finance/invoices" },
  { id: 4, title: "Monthly GST reconciliation", meta: "Due in 4 days", priority: "low", color: "green", icon: ShieldCheck, href: "/finance/tax" },
];

export const recentTransactions = [
  { id: "TXN-001", user: "Aarav Sharma", type: "Payment", amount: 18000, direction: "in", status: "Confirmed", time: "2 mins ago" },
  { id: "TXN-002", user: "Meera Nair", type: "Payout", amount: 35000, direction: "out", status: "Processed", time: "15 mins ago" },
  { id: "TXN-003", user: "John Doe", type: "Refund", amount: 5000, direction: "out", status: "Pending", time: "1 hour ago" },
  { id: "TXN-004", user: "Siddharth Rao", type: "Top-up", amount: 10000, direction: "in", status: "Confirmed", time: "3 hours ago" },
  { id: "TXN-005", user: "Michael Brown", type: "Payment", amount: 12000, direction: "in", status: "Confirmed", time: "5 hours ago" },
  { id: "TXN-006", user: "Sarah Miller", type: "Payout", amount: 28000, direction: "out", status: "Processed", time: "Yesterday" },
  { id: "TXN-007", user: "Emily Chen", type: "Payment", amount: 45000, direction: "in", status: "Confirmed", time: "Yesterday" },
  { id: "TXN-008", user: "Rohan Verma", type: "Payment", amount: 15000, direction: "in", status: "Confirmed", time: "Yesterday" },
];

export const revenueRows = [
  { id: "1", orderId: "ORD-2026-0042", studentName: "Aisha Khan", productName: "Full Stack Pro", type: "Course", gross: 18000, disc: 2000, tax: 2880, total: 18880, method: "Razorpay", date: "24 Apr 2026", status: "Confirmed" },
  { id: "2", orderId: "ORD-2026-0043", studentName: "Rohan Verma", productName: "UI/UX Mastery", type: "Course", gross: 12000, disc: 0, tax: 2160, total: 14160, method: "UPI", date: "24 Apr 2026", status: "Confirmed" },
  { id: "3", orderId: "ORD-2026-0044", studentName: "Priya Sharma", productName: "Python Backend", type: "Course", gross: 15000, disc: 1500, tax: 2430, total: 15930, method: "Razorpay", date: "23 Apr 2026", status: "Confirmed" },
  { id: "4", orderId: "ORD-2026-0045", studentName: "Mohammed Salim", productName: "Wallet Top-up", type: "Wallet", gross: 5000, disc: 0, tax: 0, total: 5000, method: "Cash", date: "23 Apr 2026", status: "Confirmed" },
  { id: "5", orderId: "ORD-2026-0046", studentName: "Neha Gupta", productName: "System Design Webinar", type: "Webinar", gross: 499, disc: 0, tax: 90, total: 589, method: "Razorpay", date: "22 Apr 2026", status: "Confirmed" },
  { id: "6", orderId: "ORD-2026-0047", studentName: "Arjun Nair", productName: "Full Stack Bundle", type: "Bundle", gross: 45000, disc: 5000, tax: 7200, total: 47200, method: "NEFT", date: "22 Apr 2026", status: "Pending" },
  { id: "7", orderId: "ORD-2026-0048", studentName: "Divya Menon", productName: "Placement Prep", type: "Subscription", gross: 2999, disc: 0, tax: 540, total: 3539, method: "Razorpay", date: "21 Apr 2026", status: "Confirmed" },
  { id: "8", orderId: "ORD-2026-0049", studentName: "Siddharth Rao", productName: "Full Stack Pro", type: "Course", gross: 18000, disc: 2000, tax: 2880, total: 18880, method: "Cheque", date: "21 Apr 2026", status: "Confirmed" },
  { id: "9", orderId: "ORD-2026-0050", studentName: "Farah Sheikh", productName: "UI/UX Mastery", type: "Course", gross: 12000, disc: 0, tax: 2160, total: 14160, method: "Razorpay", date: "20 Apr 2026", status: "Refunded" },
  { id: "10", orderId: "ORD-2026-0051", studentName: "Karan Mehta", productName: "Python Backend", type: "Course", gross: 15000, disc: 0, tax: 2700, total: 17700, method: "Manual", date: "20 Apr 2026", status: "Confirmed" },
];

export const revenueStats = [
  { label: "Gross revenue", value: "₹18.42L", sub: "142 Entries this month", color: "text-foreground" },
  { label: "Discounts", value: "₹1.25L", sub: "Coupon usage: 12%", color: "text-amber-600" },
  { label: "Tax collected", value: "₹2.84L", sub: "GST 18% (Average)", color: "text-foreground" },
  { label: "Total invoiced", value: "₹20.01L", sub: "Net + Tax", color: "text-emerald-600" },
];

export const reconciliationSummary = [
  { date: "24 Apr 2026", gateway: "Razorpay", collected: 85000, recorded: 85000, fees: 1700, net: 83300, diff: 0, status: "Matched" },
  { date: "24 Apr 2026", gateway: "Stripe", collected: 42000, recorded: 42000, fees: 1260, net: 40740, diff: 0, status: "Matched" },
  { date: "23 Apr 2026", gateway: "Razorpay", collected: 110000, recorded: 108500, fees: 2200, net: 107800, diff: 1500, status: "Mismatch" },
  { date: "23 Apr 2026", gateway: "UPI", collected: 15000, recorded: 15000, fees: 0, net: 15000, diff: 0, status: "Matched" },
  { date: "22 Apr 2026", gateway: "Razorpay", collected: 95000, recorded: 95000, fees: 1900, net: 93100, diff: 0, status: "Matched" },
];

export const unmatchedEntries = [
  { 
    id: "UM-2904", 
    gatewayId: "pay_NkX91ab", 
    student: "Aisha Khan", 
    reason: "Timing offset (Webhook delayed)", 
    amount: 18880, 
    timestamp: "24 Apr, 14:22",
    gateway: "Razorpay"
  },
  { 
    id: "UM-2905", 
    gatewayId: "ch_3Mv8Xp", 
    student: "Unidentified", 
    reason: "Amount mismatch (Coupon not applied in LMS)", 
    amount: 4500, 
    timestamp: "23 Apr, 09:15",
    gateway: "Stripe"
  },
  { 
    id: "UM-2906", 
    gatewayId: "txn_00912", 
    student: "Rohan Verma", 
    reason: "Duplicate entry in LMS", 
    amount: 12000, 
    timestamp: "22 Apr, 18:45",
    gateway: "UPI"
  },
];

export const transactionStats = [
  { label: "Total inflow", value: "₹24.8L", sub: "+12.5% vs last month", color: "text-emerald-600" },
  { label: "Total outflow", value: "₹8.4L", sub: "Payouts & Refunds", color: "text-rose-600" },
  { label: "Net movement", value: "₹16.4L", sub: "Available liquidity", color: "text-primary" },
  { label: "Pending count", value: "18", sub: "Awaiting settlement", color: "text-amber-600" },
];

export const transactionsList = [
  { 
    id: "TXN-2026-04-2891", 
    date: "24 Apr 2026, 14:22", 
    type: "Charge", 
    party: "Aisha Khan", 
    desc: "Full Stack Pro Enrollment", 
    method: "Razorpay", 
    gatewayRef: "pay_NkX91ab", 
    amount: 18880, 
    direction: "in", 
    status: "Success" 
  },
  { 
    id: "TXN-2026-04-2892", 
    date: "24 Apr 2026, 11:15", 
    type: "Payout", 
    party: "HDFC Bank (Settlement)", 
    desc: "Weekly Gateway Settlement", 
    method: "NEFT", 
    gatewayRef: "setl_82910", 
    amount: 450000, 
    direction: "out", 
    status: "Success" 
  },
  { 
    id: "TXN-2026-04-2893", 
    date: "23 Apr 2026, 16:45", 
    type: "Refund", 
    party: "Mohammed Salim", 
    desc: "Duplicate payment refund", 
    method: "Razorpay", 
    gatewayRef: "rfnd_91201", 
    amount: 5000, 
    direction: "out", 
    status: "Success" 
  },
  { 
    id: "TXN-2026-04-2894", 
    date: "23 Apr 2026, 09:20", 
    type: "Fee", 
    party: "Razorpay", 
    desc: "Transaction processing fees", 
    method: "Deduction", 
    gatewayRef: "fee_00129", 
    amount: 1240, 
    direction: "out", 
    status: "Success" 
  },
  { 
    id: "TXN-2026-04-2895", 
    date: "22 Apr 2026, 18:30", 
    type: "Wallet", 
    party: "Rohan Verma", 
    desc: "Wallet Top-up (Cash)", 
    method: "Manual", 
    gatewayRef: "man_88291", 
    amount: 10000, 
    direction: "in", 
    status: "Pending" 
  },
  { 
    id: "TXN-2026-04-2896", 
    date: "22 Apr 2026, 14:10", 
    type: "Adjustment", 
    party: "Internal Audit", 
    desc: "Accounting correction", 
    method: "Journal", 
    gatewayRef: "adj_99102", 
    amount: 2500, 
    direction: "in", 
    status: "Success" 
  },
  { 
    id: "TXN-2026-04-2897", 
    date: "21 Apr 2026, 10:05", 
    type: "Charge", 
    party: "Priya Sharma", 
    desc: "Python Backend Course", 
    method: "UPI", 
    gatewayRef: "upi_77120", 
    amount: 15930, 
    direction: "in", 
    status: "Success" 
  },
];

export const refundStats = [
  { label: "Total refunded (MTD)", value: "₹42,850", sub: "12 Refunds processed", color: "text-rose-600" },
  { label: "Pending requests", value: "8", sub: "Awaiting approval", color: "text-amber-600" },
  { label: "Refund rate", value: "2.4%", sub: "Healthy (< 5%)", color: "text-emerald-600" },
  { label: "Avg processing time", value: "1.2 days", sub: "Target: < 2 days", color: "text-primary" },
];

export const refundsList = [
  { 
    id: "RFD-2026-0142", 
    orderId: "ORD-2026-0042", 
    student: "Aisha Khan", 
    product: "Full Stack Pro", 
    originalAmount: 18880, 
    refundAmount: 16990, 
    reason: "Cancellation", 
    requestedOn: "24 Apr 2026", 
    status: "Requested",
    note: "Student decided to pursue a different career path. Request within 7-day window.",
    requestedBy: "Student",
    deductions: [
      { label: "Gateway fee", amount: 450 },
      { label: "Admin fee", amount: 1440 }
    ]
  },
  { 
    id: "RFD-2026-0143", 
    orderId: "ORD-2026-0012", 
    student: "Rohan Verma", 
    product: "UI/UX Mastery", 
    originalAmount: 12000, 
    refundAmount: 12000, 
    reason: "Duplicate", 
    requestedOn: "23 Apr 2026", 
    status: "Approved",
    note: "Accidental double charge on Razorpay.",
    requestedBy: "Support",
    deductions: []
  },
  { 
    id: "RFD-2026-0144", 
    orderId: "ORD-2025-0982", 
    student: "Meera Nair", 
    product: "Python Backend", 
    originalAmount: 15000, 
    refundAmount: 7500, 
    reason: "Quality", 
    requestedOn: "22 Apr 2026", 
    status: "Completed",
    note: "Unsatisfied with course pace. 50% refund as per policy (30 days passed).",
    requestedBy: "Student",
    deductions: [
      { label: "Course usage (50%)", amount: 7500 }
    ]
  },
  { 
    id: "RFD-2026-0145", 
    orderId: "ORD-2026-0055", 
    student: "Mohammed Salim", 
    product: "Wallet Top-up", 
    originalAmount: 5000, 
    refundAmount: 5000, 
    reason: "Other", 
    requestedOn: "21 Apr 2026", 
    status: "Rejected",
    note: "Wallet top-ups are non-refundable as per terms.",
    requestedBy: "Admin",
    deductions: []
  },
];
