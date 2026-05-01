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
  { id: "11", orderId: "ORD-2026-0052", studentName: "Vikram Singh", productName: "Data Science Pro", type: "Course", gross: 25000, disc: 2500, tax: 4050, total: 26550, method: "Razorpay", date: "19 Apr 2026", status: "Confirmed" },
  { id: "12", orderId: "ORD-2026-0053", studentName: "Ananya Iyer", productName: "Full Stack Pro", type: "Course", gross: 18000, disc: 0, tax: 3240, total: 21240, method: "UPI", date: "19 Apr 2026", status: "Confirmed" },
  { id: "13", orderId: "ORD-2026-0054", studentName: "Kabir Das", productName: "Wallet Top-up", type: "Wallet", gross: 10000, disc: 0, tax: 0, total: 10000, method: "Razorpay", date: "18 Apr 2026", status: "Confirmed" },
  { id: "14", orderId: "ORD-2026-0055", studentName: "Sanya Mirza", productName: "UI/UX Mastery", type: "Course", gross: 12000, disc: 1200, tax: 1944, total: 12744, method: "Stripe", date: "18 Apr 2026", status: "Confirmed" },
  { id: "15", orderId: "ORD-2026-0056", studentName: "Rahul Dravid", productName: "Placement Prep", type: "Subscription", gross: 2999, disc: 0, tax: 540, total: 3539, method: "Razorpay", date: "17 Apr 2026", status: "Confirmed" },
  { id: "16", orderId: "ORD-2026-0057", studentName: "Ishani Bose", productName: "Full Stack Bundle", type: "Bundle", gross: 45000, disc: 4500, tax: 7290, total: 47790, method: "NEFT", date: "17 Apr 2026", status: "Confirmed" },
  { id: "17", orderId: "ORD-2026-0058", studentName: "Amitabh Bachchan", productName: "Data Science Pro", type: "Course", gross: 25000, disc: 0, tax: 4500, total: 29500, method: "Razorpay", date: "16 Apr 2026", status: "Confirmed" },
  { id: "18", orderId: "ORD-2026-0059", studentName: "Deepika Padukone", productName: "Python Backend", type: "Course", gross: 15000, disc: 1500, tax: 2430, total: 15930, method: "UPI", date: "16 Apr 2026", status: "Confirmed" },
  { id: "19", orderId: "ORD-2026-0060", studentName: "Ranveer Singh", productName: "Wallet Top-up", type: "Wallet", gross: 2000, disc: 0, tax: 0, total: 2000, method: "Razorpay", date: "15 Apr 2026", status: "Confirmed" },
  { id: "20", orderId: "ORD-2026-0061", studentName: "Alia Bhatt", productName: "System Design Webinar", type: "Webinar", gross: 499, disc: 0, tax: 90, total: 589, method: "Razorpay", date: "15 Apr 2026", status: "Confirmed" },
  { id: "21", orderId: "ORD-2026-0062", studentName: "Varun Dhawan", productName: "Full Stack Pro", type: "Course", gross: 18000, disc: 2000, tax: 2880, total: 18880, method: "Stripe", date: "14 Apr 2026", status: "Confirmed" },
  { id: "22", orderId: "ORD-2026-0063", studentName: "Kriti Sanon", productName: "UI/UX Mastery", type: "Course", gross: 12000, disc: 0, tax: 2160, total: 14160, method: "UPI", date: "14 Apr 2026", status: "Confirmed" },
  { id: "23", orderId: "ORD-2026-0064", studentName: "Ayushmann Khurrana", productName: "Python Backend", type: "Course", gross: 15000, disc: 1500, tax: 2430, total: 15930, method: "Razorpay", date: "13 Apr 2026", status: "Confirmed" },
  { id: "24", orderId: "ORD-2026-0065", studentName: "Rajkummar Rao", productName: "Wallet Top-up", type: "Wallet", gross: 5000, disc: 0, tax: 0, total: 5000, method: "Cash", date: "13 Apr 2026", status: "Confirmed" },
  { id: "25", orderId: "ORD-2026-0066", studentName: "Pankaj Tripathi", productName: "Data Science Pro", type: "Course", gross: 25000, disc: 2500, tax: 4050, total: 26550, method: "Razorpay", date: "12 Apr 2026", status: "Confirmed" },
  { id: "26", orderId: "ORD-2026-0067", studentName: "Nawazuddin Siddiqui", productName: "Full Stack Pro", type: "Course", gross: 18000, disc: 0, tax: 3240, total: 21240, method: "UPI", date: "12 Apr 2026", status: "Confirmed" },
  { id: "27", orderId: "ORD-2026-0068", studentName: "Vicky Kaushal", productName: "Wallet Top-up", type: "Wallet", gross: 10000, disc: 0, tax: 0, total: 10000, method: "Razorpay", date: "11 Apr 2026", status: "Confirmed" },
  { id: "28", orderId: "ORD-2026-0069", studentName: "Katrina Kaif", productName: "UI/UX Mastery", type: "Course", gross: 12000, disc: 1200, tax: 1944, total: 12744, method: "Stripe", date: "11 Apr 2026", status: "Confirmed" },
  { id: "29", orderId: "ORD-2026-0070", studentName: "Shah Rukh Khan", productName: "Placement Prep", type: "Subscription", gross: 2999, disc: 0, tax: 540, total: 3539, method: "Razorpay", date: "10 Apr 2026", status: "Confirmed" },
  { id: "30", orderId: "ORD-2026-0071", studentName: "Salman Khan", productName: "Full Stack Bundle", type: "Bundle", gross: 45000, disc: 4500, tax: 7290, total: 47790, method: "NEFT", date: "10 Apr 2026", status: "Confirmed" },
  { id: "31", orderId: "ORD-2026-0072", studentName: "Aamir Khan", productName: "Data Science Pro", type: "Course", gross: 25000, disc: 0, tax: 4500, total: 29500, method: "Razorpay", date: "09 Apr 2026", status: "Confirmed" },
  { id: "32", orderId: "ORD-2026-0073", studentName: "Kareena Kapoor", productName: "Python Backend", type: "Course", gross: 15000, disc: 1500, tax: 2430, total: 15930, method: "UPI", date: "09 Apr 2026", status: "Confirmed" },
  { id: "33", orderId: "ORD-2026-0074", studentName: "Saif Ali Khan", productName: "Wallet Top-up", type: "Wallet", gross: 2000, disc: 0, tax: 0, total: 2000, method: "Razorpay", date: "08 Apr 2026", status: "Confirmed" },
  { id: "34", orderId: "ORD-2026-0075", studentName: "Hrithik Roshan", productName: "System Design Webinar", type: "Webinar", gross: 499, disc: 0, tax: 90, total: 589, method: "Razorpay", date: "08 Apr 2026", status: "Confirmed" },
  { id: "35", orderId: "ORD-2026-0076", studentName: "Tiger Shroff", productName: "Full Stack Pro", type: "Course", gross: 18000, disc: 2000, tax: 2880, total: 18880, method: "Stripe", date: "07 Apr 2026", status: "Confirmed" },
  { id: "36", orderId: "ORD-2026-0077", studentName: "Disha Patani", productName: "UI/UX Mastery", type: "Course", gross: 12000, disc: 0, tax: 2160, total: 14160, method: "UPI", date: "07 Apr 2026", status: "Confirmed" },
  { id: "37", orderId: "ORD-2026-0078", studentName: "Ranbir Kapoor", productName: "Python Backend", type: "Course", gross: 15000, disc: 1500, tax: 2430, total: 15930, method: "Razorpay", date: "06 Apr 2026", status: "Confirmed" },
  { id: "38", orderId: "ORD-2026-0079", studentName: "Anushka Sharma", productName: "Wallet Top-up", type: "Wallet", gross: 5000, disc: 0, tax: 0, total: 5000, method: "Cash", date: "06 Apr 2026", status: "Confirmed" },
  { id: "39", orderId: "ORD-2026-0080", studentName: "Virat Kohli", productName: "Data Science Pro", type: "Course", gross: 25000, disc: 2500, tax: 4050, total: 26550, method: "Razorpay", date: "05 Apr 2026", status: "Confirmed" },
  { id: "40", orderId: "ORD-2026-0081", studentName: "MS Dhoni", productName: "Full Stack Pro", type: "Course", gross: 18000, disc: 0, tax: 3240, total: 21240, method: "UPI", date: "05 Apr 2026", status: "Confirmed" },
  { id: "41", orderId: "ORD-2026-0082", studentName: "Sachin Tendulkar", productName: "Wallet Top-up", type: "Wallet", gross: 10000, disc: 0, tax: 0, total: 10000, method: "Razorpay", date: "04 Apr 2026", status: "Confirmed" },
  { id: "42", orderId: "ORD-2026-0083", studentName: "Saurav Ganguly", productName: "UI/UX Mastery", type: "Course", gross: 12000, disc: 1200, tax: 1944, total: 12744, method: "Stripe", date: "04 Apr 2026", status: "Confirmed" },
  { id: "43", orderId: "ORD-2026-0084", studentName: "Kapil Dev", productName: "Placement Prep", type: "Subscription", gross: 2999, disc: 0, tax: 540, total: 3539, method: "Razorpay", date: "03 Apr 2026", status: "Confirmed" },
  { id: "44", orderId: "ORD-2026-0085", studentName: "Sunil Gavaskar", productName: "Full Stack Bundle", type: "Bundle", gross: 45000, disc: 4500, tax: 7290, total: 47790, method: "NEFT", date: "03 Apr 2026", status: "Confirmed" },
  { id: "45", orderId: "ORD-2026-0086", studentName: "Yuvraj Singh", productName: "Data Science Pro", type: "Course", gross: 25000, disc: 0, tax: 4500, total: 29500, method: "Razorpay", date: "02 Apr 2026", status: "Confirmed" },
  { id: "46", orderId: "ORD-2026-0087", studentName: "Harbhajan Singh", productName: "Python Backend", type: "Course", gross: 15000, disc: 1500, tax: 2430, total: 15930, method: "UPI", date: "02 Apr 2026", status: "Confirmed" },
  { id: "47", orderId: "ORD-2026-0088", studentName: "Gautam Gambhir", productName: "Wallet Top-up", type: "Wallet", gross: 2000, disc: 0, tax: 0, total: 2000, method: "Razorpay", date: "01 Apr 2026", status: "Confirmed" },
  { id: "48", orderId: "ORD-2026-0089", studentName: "Suresh Raina", productName: "System Design Webinar", type: "Webinar", gross: 499, disc: 0, tax: 90, total: 589, method: "Razorpay", date: "01 Apr 2026", status: "Confirmed" },
  { id: "49", orderId: "ORD-2026-0090", studentName: "Ravindra Jadeja", productName: "Full Stack Pro", type: "Course", gross: 18000, disc: 2000, tax: 2880, total: 18880, method: "Stripe", date: "31 Mar 2026", status: "Confirmed" },
  { id: "50", orderId: "ORD-2026-0091", studentName: "Rohit Sharma", productName: "UI/UX Mastery", type: "Course", gross: 12000, disc: 0, tax: 2160, total: 14160, method: "UPI", date: "31 Mar 2026", status: "Confirmed" },
  { id: "51", orderId: "ORD-2026-0092", studentName: "Shikhar Dhawan", productName: "Python Backend", type: "Course", gross: 15000, disc: 1500, tax: 2430, total: 15930, method: "Razorpay", date: "30 Mar 2026", status: "Confirmed" },
  { id: "52", orderId: "ORD-2026-0093", studentName: "KL Rahul", productName: "Wallet Top-up", type: "Wallet", gross: 5000, disc: 0, tax: 0, total: 5000, method: "Cash", date: "30 Mar 2026", status: "Confirmed" },
  { id: "53", orderId: "ORD-2026-0094", studentName: "Hardik Pandya", productName: "Data Science Pro", type: "Course", gross: 25000, disc: 2500, tax: 4050, total: 26550, method: "Razorpay", date: "29 Mar 2026", status: "Confirmed" },
  { id: "54", orderId: "ORD-2026-0095", studentName: "Jasprit Bumrah", productName: "Full Stack Pro", type: "Course", gross: 18000, disc: 0, tax: 3240, total: 21240, method: "UPI", date: "29 Mar 2026", status: "Confirmed" },
  { id: "55", orderId: "ORD-2026-0096", studentName: "Rishabh Pant", productName: "Wallet Top-up", type: "Wallet", gross: 10000, disc: 0, tax: 0, total: 10000, method: "Razorpay", date: "28 Mar 2026", status: "Confirmed" },
  { id: "56", orderId: "ORD-2026-0097", studentName: "Shreyas Iyer", productName: "UI/UX Mastery", type: "Course", gross: 12000, disc: 1200, tax: 1944, total: 12744, method: "Stripe", date: "28 Mar 2026", status: "Confirmed" },
  { id: "57", orderId: "ORD-2026-0098", studentName: "Prithvi Shaw", productName: "Placement Prep", type: "Subscription", gross: 2999, disc: 0, tax: 540, total: 3539, method: "Razorpay", date: "27 Mar 2026", status: "Confirmed" },
  { id: "58", orderId: "ORD-2026-0099", studentName: "Shubman Gill", productName: "Full Stack Bundle", type: "Bundle", gross: 45000, disc: 4500, tax: 7290, total: 47790, method: "NEFT", date: "27 Mar 2026", status: "Confirmed" },
  { id: "59", orderId: "ORD-2026-0100", studentName: "Mayank Agarwal", productName: "Data Science Pro", type: "Course", gross: 25000, disc: 0, tax: 4500, total: 29500, method: "Razorpay", date: "26 Mar 2026", status: "Confirmed" },
  { id: "60", orderId: "ORD-2026-0101", studentName: "Hanuma Vihari", productName: "Python Backend", type: "Course", gross: 15000, disc: 1500, tax: 2430, total: 15930, method: "UPI", date: "26 Mar 2026", status: "Confirmed" },
  { id: "61", orderId: "ORD-2026-0102", studentName: "Ajinkya Rahane", productName: "Wallet Top-up", type: "Wallet", gross: 2000, disc: 0, tax: 0, total: 2000, method: "Razorpay", date: "25 Mar 2026", status: "Confirmed" },
  { id: "62", orderId: "ORD-2026-0103", studentName: "Cheteshwar Pujara", productName: "System Design Webinar", type: "Webinar", gross: 499, disc: 0, tax: 90, total: 589, method: "Razorpay", date: "25 Mar 2026", status: "Confirmed" },
  { id: "63", orderId: "ORD-2026-0104", studentName: "Ishant Sharma", productName: "Full Stack Pro", type: "Course", gross: 18000, disc: 2000, tax: 2880, total: 18880, method: "Stripe", date: "24 Mar 2026", status: "Confirmed" },
  { id: "64", orderId: "ORD-2026-0105", studentName: "Mohammed Shami", productName: "UI/UX Mastery", type: "Course", gross: 12000, disc: 0, tax: 2160, total: 14160, method: "UPI", date: "24 Mar 2026", status: "Confirmed" },
  { id: "65", orderId: "ORD-2026-0106", studentName: "Umesh Yadav", productName: "Python Backend", type: "Course", gross: 15000, disc: 1500, tax: 2430, total: 15930, method: "Razorpay", date: "23 Mar 2026", status: "Confirmed" },
  { id: "66", orderId: "ORD-2026-0107", studentName: "Ravichandran Ashwin", productName: "Wallet Top-up", type: "Wallet", gross: 5000, disc: 0, tax: 0, total: 5000, method: "Cash", date: "23 Mar 2026", status: "Confirmed" },
  { id: "67", orderId: "ORD-2026-0108", studentName: "Wriddhiman Saha", productName: "Data Science Pro", type: "Course", gross: 25000, disc: 2500, tax: 4050, total: 26550, method: "Razorpay", date: "22 Mar 2026", status: "Confirmed" },
  { id: "68", orderId: "ORD-2026-0109", studentName: "Kuldeep Yadav", productName: "Full Stack Pro", type: "Course", gross: 18000, disc: 0, tax: 3240, total: 21240, method: "UPI", date: "22 Mar 2026", status: "Confirmed" },
  { id: "69", orderId: "ORD-2026-0110", studentName: "Yuzvendra Chahal", productName: "Wallet Top-up", type: "Wallet", gross: 10000, disc: 0, tax: 0, total: 10000, method: "Razorpay", date: "21 Mar 2026", status: "Confirmed" },
  { id: "70", orderId: "ORD-2026-0111", studentName: "Bhuvneshwar Kumar", productName: "UI/UX Mastery", type: "Course", gross: 12000, disc: 1200, tax: 1944, total: 12744, method: "Stripe", date: "21 Mar 2026", status: "Confirmed" },
  { id: "71", orderId: "ORD-2026-0112", studentName: "Navdeep Saini", productName: "Placement Prep", type: "Subscription", gross: 2999, disc: 0, tax: 540, total: 3539, method: "Razorpay", date: "20 Mar 2026", status: "Confirmed" },
  { id: "72", orderId: "ORD-2026-0113", studentName: "Shardul Thakur", productName: "Full Stack Bundle", type: "Bundle", gross: 45000, disc: 4500, tax: 7290, total: 47790, method: "NEFT", date: "20 Mar 2026", status: "Confirmed" },
  { id: "73", orderId: "ORD-2026-0114", studentName: "Washington Sundar", productName: "Data Science Pro", type: "Course", gross: 25000, disc: 0, tax: 4500, total: 29500, method: "Razorpay", date: "19 Mar 2026", status: "Confirmed" },
  { id: "74", orderId: "ORD-2026-0115", studentName: "T Natarajan", productName: "Python Backend", type: "Course", gross: 15000, disc: 1500, tax: 2430, total: 15930, method: "UPI", date: "19 Mar 2026", status: "Confirmed" },
  { id: "75", orderId: "ORD-2026-0116", studentName: "Axar Patel", productName: "Wallet Top-up", type: "Wallet", gross: 2000, disc: 0, tax: 0, total: 2000, method: "Razorpay", date: "18 Mar 2026", status: "Confirmed" },
  { id: "76", orderId: "ORD-2026-0117", studentName: "Mohammed Siraj", productName: "System Design Webinar", type: "Webinar", gross: 499, disc: 0, tax: 90, total: 589, method: "Razorpay", date: "18 Mar 2026", status: "Confirmed" },
  { id: "77", orderId: "ORD-2026-0118", studentName: "Deepak Chahar", productName: "Full Stack Pro", type: "Course", gross: 18000, disc: 2000, tax: 2880, total: 18880, method: "Stripe", date: "17 Mar 2026", status: "Confirmed" },
  { id: "78", orderId: "ORD-2026-0119", studentName: "Sanju Samson", productName: "UI/UX Mastery", type: "Course", gross: 12000, disc: 0, tax: 2160, total: 14160, method: "UPI", date: "17 Mar 2026", status: "Confirmed" },
  { id: "79", orderId: "ORD-2026-0120", studentName: "Ishan Kishan", productName: "Python Backend", type: "Course", gross: 15000, disc: 1500, tax: 2430, total: 15930, method: "Razorpay", date: "16 Mar 2026", status: "Confirmed" },
  { id: "80", orderId: "ORD-2026-0121", studentName: "Suryakumar Yadav", productName: "Wallet Top-up", type: "Wallet", gross: 5000, disc: 0, tax: 0, total: 5000, method: "Cash", date: "16 Mar 2026", status: "Confirmed" },
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

export type RefundRow = {
  id: string;
  orderId: string;
  student: string;
  product: string;
  originalAmount: number;
  refundAmount: number;
  reason: string;
  requestedOn: string;
  status: "Requested" | "Approved" | "Completed" | "Rejected" | "Processing" | "Processed";
  note: string;
  requestedBy: string;
  deductions: { label: string; amount: number }[];
};

export const refundsList: RefundRow[] = [
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

export const fmtINR = (n: number) => "₹" + n.toLocaleString("en-IN");

export const fmtINRShort = (n: number) => {
  if (n >= 100000) return "₹" + (n / 100000).toFixed(2) + "L";
  if (n >= 1000) return "₹" + (n / 1000).toFixed(1) + "K";
  return "₹" + n.toString();
};

export const financeSettings = {
  coolingPeriodDays: 14,
  minPayout: 1000,
  maxPayout: 100000,
  payoutCycle: "Bi-weekly",
  tdsThreshold: 30000,
  tdsRate: 10,
  defaultCommissionPct: 60,
  mentorBonusPct: 8,
};

export type PayoutRow = {
  id: string;
  name: string;
  role: "Tutor" | "Mentor";
  batches: string;
  period: string;
  requested: number;
  available: number;
  tds: number;
  net: number;
  requestedOn: string;
  status: "Pending" | "Approved" | "Paid" | "Rejected";
  bank: string;
  utr?: string;
};

export const payoutQueue: PayoutRow[] = [
  {
    id: "PAY-2026-0214",
    name: "Karthik Raghavan",
    role: "Tutor",
    batches: "PY-Apr26-A, PY-Apr26-B",
    period: "1–15 Apr 2026",
    requested: 45000,
    available: 52000,
    tds: 4500,
    net: 40500,
    requestedOn: "24 Apr, 18:02",
    status: "Approved",
    bank: "HDFC ••8821 · IFSC HDFC0000123",
  },
  {
    id: "PAY-2026-0215",
    name: "Meera Nair",
    role: "Tutor",
    batches: "UI-Apr26-C",
    period: "1–15 Apr 2026",
    requested: 28000,
    available: 30000,
    tds: 2800,
    net: 25200,
    requestedOn: "24 Apr, 19:15",
    status: "Pending",
    bank: "ICICI ••4412 · IFSC ICIC0000456",
  },
  {
    id: "PAY-2026-0216",
    name: "Suresh Kumar",
    role: "Mentor",
    batches: "MEN-Apr26-M1",
    period: "1–15 Apr 2026",
    requested: 124000,
    available: 135000,
    tds: 12400,
    net: 111600,
    requestedOn: "25 Apr, 08:30",
    status: "Paid",
    bank: "Axis ••9901 · IFSC UTIB0000789",
    utr: "UTR9827364510",
  },
  {
    id: "PAY-2026-0217",
    name: "Divya Menon",
    role: "Mentor",
    batches: "MEN-Apr26-M2",
    period: "1–15 Apr 2026",
    requested: 35000,
    available: 40000,
    tds: 3500,
    net: 31500,
    requestedOn: "25 Apr, 10:45",
    status: "Approved",
    bank: "SBI ••2234 · IFSC SBIN0001234",
  },
  {
    id: "PAY-2026-0218",
    name: "Rahul Dravid",
    role: "Tutor",
    batches: "JS-Apr26-D",
    period: "1–15 Apr 2026",
    requested: 55000,
    available: 60000,
    tds: 5500,
    net: 49500,
    requestedOn: "26 Apr, 14:20",
    status: "Approved",
    bank: "Kotak ••5567 · IFSC KKBK0000567",
  },
  {
    id: "PAY-2026-0219",
    name: "Ananya Iyer",
    role: "Tutor",
    batches: "PY-Apr26-C",
    period: "1–15 Apr 2026",
    requested: 32000,
    available: 35000,
    tds: 3200,
    net: 28800,
    requestedOn: "26 Apr, 16:50",
    status: "Pending",
    bank: "HDFC ••1122 · IFSC HDFC0000123",
  },
  {
    id: "PAY-2026-0220",
    name: "Vikram Singh",
    role: "Mentor",
    batches: "MEN-Apr26-M3",
    period: "1–15 Apr 2026",
    requested: 88000,
    available: 95000,
    tds: 8800,
    net: 79200,
    requestedOn: "27 Apr, 09:10",
    status: "Approved",
    bank: "ICICI ••3344 · IFSC ICIC0000456",
  },
];

export type InvoiceRow = {
  number: string;
  student: string;
  course: string;
  date: string;
  due: string;
  taxable: number;
  tax: number;
  total: number;
  gst: boolean;
  status: "Paid" | "Sent" | "Overdue" | "Draft" | "Cancelled";
};

export const initialInvoices: InvoiceRow[] = [
  {
    number: "INV-2026-001",
    student: "Aarav Sharma",
    course: "Full Stack Pro",
    date: "24 Apr 2026",
    due: "01 May 2026",
    taxable: 18000,
    tax: 3240,
    total: 21240,
    gst: true,
    status: "Paid",
  },
  {
    number: "PRO-2026-042",
    student: "Meera Reddy",
    course: "Full Stack Bundle",
    date: "24 Apr 2026",
    due: "28 Apr 2026",
    taxable: 45000,
    tax: 0,
    total: 45000,
    gst: false,
    status: "Sent",
  },
  {
    number: "INV-2026-003",
    student: "John Doe",
    course: "Python Backend",
    date: "23 Apr 2026",
    due: "30 Apr 2026",
    taxable: 15000,
    tax: 2700,
    total: 17700,
    gst: true,
    status: "Overdue",
  },
  {
    number: "INV-2026-004",
    student: "Sarah Miller",
    course: "Data Science Pro",
    date: "22 Apr 2026",
    due: "29 Apr 2026",
    taxable: 25000,
    tax: 4500,
    total: 29500,
    gst: true,
    status: "Paid",
  },
  {
    number: "INV-2026-005",
    student: "Karan Singh",
    course: "UI/UX Mastery",
    date: "21 Apr 2026",
    due: "28 Apr 2026",
    taxable: 12000,
    tax: 2160,
    total: 14160,
    gst: true,
    status: "Draft",
  },
  {
    number: "INV-2026-006",
    student: "Sneha Roy",
    course: "Full Stack Development",
    date: "20 Apr 2026",
    due: "27 Apr 2026",
    taxable: 18500,
    tax: 3330,
    total: 21830,
    gst: true,
    status: "Sent",
  },
  {
    number: "PRO-2026-043",
    student: "Arjun Nair",
    course: "Data Science 101",
    date: "19 Apr 2026",
    due: "26 Apr 2026",
    taxable: 10000,
    tax: 0,
    total: 10000,
    gst: false,
    status: "Cancelled",
  },
  {
    number: "INV-2026-008",
    student: "Divya Menon",
    course: "Python Pro",
    date: "18 Apr 2026",
    due: "25 Apr 2026",
    taxable: 15000,
    tax: 2700,
    total: 17700,
    gst: true,
    status: "Paid",
  },
  {
    number: "INV-2026-009",
    student: "Siddharth Rao",
    course: "Full Stack Pro",
    date: "17 Apr 2026",
    due: "24 Apr 2026",
    taxable: 18000,
    tax: 3240,
    total: 21240,
    gst: true,
    status: "Overdue",
  },
  {
    number: "INV-2026-010",
    student: "Farah Sheikh",
    course: "UI/UX Mastery",
    date: "16 Apr 2026",
    due: "23 Apr 2026",
    taxable: 12000,
    tax: 2160,
    total: 14160,
    gst: true,
    status: "Paid",
  },
  {
    number: "INV-2026-011",
    student: "Karan Mehta",
    course: "Python Backend",
    date: "15 Apr 2026",
    due: "22 Apr 2026",
    taxable: 15000,
    tax: 2700,
    total: 17700,
    gst: true,
    status: "Sent",
  },
  {
    number: "INV-2026-012",
    student: "Aanya Sharma",
    course: "Full Stack Bundle",
    date: "14 Apr 2026",
    due: "21 Apr 2026",
    taxable: 45000,
    tax: 8100,
    total: 53100,
    gst: true,
    status: "Paid",
  },
];
