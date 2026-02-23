import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown,
  ChevronRight,
  DollarSign,
  Users,
  Briefcase,
  BookOpen,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";

const FinanceDashboard = () => {
  const summary = {
    totalRevenue: "₹42,85,000",
    monthlyIncome: "₹24,50,000",
    pendingCollections: "₹5,40,000",
    totalDisbursed: "₹18,25,000",
  };

  const revenueBreakdown = [
    { label: "Course Fees", amount: "₹18,50,000", percentage: 75 },
    { label: "Package Upgrades", amount: "₹4,20,000", percentage: 17 },
    { label: "Certificate Fees", amount: "₹1,80,000", percentage: 8 },
  ];

  const pendingPayments = [
    { id: 1, name: "Rahul Sharma", type: "Student Fee", amount: "₹45,000", dueDate: "Feb 5, 2026", status: "overdue" },
    { id: 2, name: "Priya Patel", type: "Student Fee", amount: "₹38,000", dueDate: "Feb 8, 2026", status: "due-soon" },
    { id: 3, name: "Vikram Singh", type: "Student Fee", amount: "₹42,000", dueDate: "Feb 15, 2026", status: "pending" },
  ];

  const upcomingDisbursements = [
    { id: 1, category: "Tutor Salaries", count: 28, amount: "₹8,40,000", dueDate: "Feb 1, 2026" },
    { id: 2, category: "Mentor Salaries", count: 15, amount: "₹4,50,000", dueDate: "Feb 1, 2026" },
    { id: 3, category: "Intern Stipends", count: 42, amount: "₹5,35,000", dueDate: "Feb 5, 2026" },
  ];

  const recentTransactions = [
    { id: 1, description: "Fee payment - Ananya Sharma", amount: "+₹45,000", time: "2 hours ago", type: "credit" },
    { id: 2, description: "Tutor salary - Meera Nair", amount: "-₹35,000", time: "5 hours ago", type: "debit" },
    { id: 3, description: "Fee payment - Karthik Iyer", amount: "+₹38,000", time: "Yesterday", type: "credit" },
    { id: 4, description: "Intern stipend - Deepak Kumar", amount: "-₹15,000", time: "Yesterday", type: "debit" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "overdue":
        return <Badge className="bg-destructive/10 text-destructive">Overdue</Badge>;
      case "due-soon":
        return <Badge className="bg-warning-muted text-warning">Due Soon</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="opacity-0 animate-fade-in">
          <h1 className="text-2xl font-semibold text-foreground">Finance Dashboard</h1>
          <p className="text-muted-foreground mt-1">Financial overview and transaction management</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20 border-emerald-200/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue (FY)</p>
                  <p className="text-2xl font-semibold text-emerald-700 dark:text-emerald-400 mt-1">{summary.totalRevenue}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-3 h-3 text-emerald-600" />
                    <span className="text-xs text-emerald-600">+12% from last year</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Income</p>
                  <p className="text-2xl font-semibold mt-1">{summary.monthlyIncome}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-3 h-3 text-emerald-600" />
                    <span className="text-xs text-emerald-600">+8% from last month</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Collections</p>
                  <p className="text-2xl font-semibold text-warning mt-1">{summary.pendingCollections}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <AlertCircle className="w-3 h-3 text-warning" />
                    <span className="text-xs text-warning">12 students</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Disbursed</p>
                  <p className="text-2xl font-semibold mt-1">{summary.totalDisbursed}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span className="text-xs text-muted-foreground">This month</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Breakdown */}
          <Card className="opacity-0 animate-fade-in" style={{ animationDelay: "150ms" }}>
            <CardHeader>
              <CardTitle className="text-lg">Revenue Breakdown</CardTitle>
              <CardDescription>This month's income sources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {revenueBreakdown.map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">{item.label}</span>
                      <span className="text-sm font-medium">{item.amount}</span>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Payments */}
          <Card className="lg:col-span-2 opacity-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Pending Payments</CardTitle>
                <CardDescription>Student fees requiring follow-up</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-primary">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-role-student/10 flex items-center justify-center">
                        <Users className="w-5 h-5 text-role-student" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{payment.name}</p>
                        <p className="text-xs text-muted-foreground">{payment.type} • Due: {payment.dueDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">{payment.amount}</span>
                      {getStatusBadge(payment.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Disbursements */}
          <Card className="opacity-0 animate-fade-in" style={{ animationDelay: "250ms" }}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Upcoming Disbursements</CardTitle>
                <CardDescription>Scheduled salary and stipend payments</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingDisbursements.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        {item.category.includes("Tutor") && <BookOpen className="w-5 h-5 text-primary" />}
                        {item.category.includes("Mentor") && <Users className="w-5 h-5 text-primary" />}
                        {item.category.includes("Intern") && <Briefcase className="w-5 h-5 text-primary" />}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{item.category}</p>
                        <p className="text-xs text-muted-foreground">{item.count} recipients • {item.dueDate}</p>
                      </div>
                    </div>
                    <span className="font-semibold">{item.amount}</span>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4" size="sm">
                Process Payments
              </Button>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="opacity-0 animate-fade-in" style={{ animationDelay: "300ms" }}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Recent Transactions</CardTitle>
                <CardDescription>Latest financial activities</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-primary">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                    <div>
                      <p className="text-sm">{tx.description}</p>
                      <p className="text-xs text-muted-foreground">{tx.time}</p>
                    </div>
                    <span className={`font-semibold ${tx.type === "credit" ? "text-emerald-600" : "text-muted-foreground"}`}>
                      {tx.amount}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FinanceDashboard;
