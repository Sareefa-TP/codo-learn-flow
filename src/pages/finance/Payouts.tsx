import { useState, useMemo } from "react";
import FinanceLayout from "@/components/finance/FinanceLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Wallet,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  Users,
  GraduationCap,
  Briefcase,
  ChevronRight,
  Filter,
  Search,
  ArrowDownRight,
  TrendingDown,
  Info,
  DollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types & Mock Data ────────────────────────────────────────────────────────

interface PayoutRequest {
  id: string;
  recipient: { name: string; id: string; role: "Tutor" | "Mentor" | "Intern" };
  amount: number;
  taxDeducted: number; // TDS
  netAmount: number;
  period: string;
  requestDate: string;
  status: "Requested" | "Approved" | "Processing" | "Disbursed" | "Rejected";
  approvalChain: { role: string; status: "Pending" | "Approved" }[];
}

const mockPayouts: PayoutRequest[] = [
  { 
    id: "PAY-001", 
    recipient: { name: "Meera Nair", id: "TUT-102", role: "Tutor" }, 
    amount: 35000, 
    taxDeducted: 3500, 
    netAmount: 31500, 
    period: "Apr 2026", 
    requestDate: "24 Apr 2026", 
    status: "Processing",
    approvalChain: [
      { role: "Coordinator", status: "Approved" },
      { role: "Admin", status: "Approved" },
    ]
  },
  { 
    id: "PAY-002", 
    recipient: { name: "Suresh Kumar", id: "MEN-045", role: "Mentor" }, 
    amount: 28000, 
    taxDeducted: 2800, 
    netAmount: 25200, 
    period: "Apr 2026", 
    requestDate: "23 Apr 2026", 
    status: "Approved",
    approvalChain: [
      { role: "Coordinator", status: "Approved" },
      { role: "Admin", status: "Approved" },
    ]
  },
  { 
    id: "PAY-003", 
    recipient: { name: "Divya Menon", id: "INT-881", role: "Intern" }, 
    amount: 12000, 
    taxDeducted: 0, 
    netAmount: 12000, 
    period: "Apr 2026", 
    requestDate: "22 Apr 2026", 
    status: "Requested",
    approvalChain: [
      { role: "Coordinator", status: "Pending" },
    ]
  },
  { 
    id: "PAY-004", 
    recipient: { name: "Ravi Shankar", id: "TUT-099", role: "Tutor" }, 
    amount: 42000, 
    taxDeducted: 4200, 
    netAmount: 37800, 
    period: "Mar 2026", 
    requestDate: "05 Apr 2026", 
    status: "Disbursed",
    approvalChain: [
      { role: "Coordinator", status: "Approved" },
      { role: "Admin", status: "Approved" },
    ]
  },
];

const roleIcons = {
  Tutor: GraduationCap,
  Mentor: Users,
  Intern: Briefcase,
};

const statusColors = {
  "Requested": "bg-blue-50 text-blue-600 border-blue-200",
  "Approved": "bg-indigo-50 text-indigo-600 border-indigo-200",
  "Processing": "bg-amber-50 text-amber-600 border-amber-200",
  "Disbursed": "bg-emerald-50 text-emerald-600 border-emerald-200",
  "Rejected": "bg-rose-50 text-rose-600 border-rose-200",
};

// ─── Component ───────────────────────────────────────────────────────────────

const Payouts = () => {
  return (
    <FinanceLayout>
      <div className="animate-fade-in space-y-8 max-w-[1440px] mx-auto pb-20">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
              <Wallet className="w-8 h-8 text-primary" />
              Payout Management
            </h1>
            <p className="text-sm font-medium text-muted-foreground">
              Earnings disbursement queue for Tutors, Mentors and Interns.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" className="h-11 rounded-xl font-bold text-xs uppercase tracking-widest border-border/60">
              Commission Rules
            </Button>
            <Button className="h-11 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-widest px-6 shadow-xl shadow-primary/20">
              Bulk Disburse
            </Button>
          </div>
        </div>

        {/* Payout Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="rounded-[2rem] border-border/60 bg-card shadow-sm p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Payout Liquidity</p>
              <h2 className="text-3xl font-black tracking-tight">₹12.4L</h2>
              <div className="space-y-2">
                 <div className="flex justify-between text-[10px] font-black uppercase">
                    <span>Approved & Ready</span>
                    <span>₹4.2L</span>
                 </div>
                 <Progress value={65} className="h-2 bg-primary/10" />
              </div>
            </div>
          </Card>
          
          <Card className="rounded-[2rem] border-border/60 bg-card shadow-sm p-8">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-6">Request Queue</p>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                  <p className="text-2xl font-black">12</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Awaiting Approval</p>
               </div>
               <div className="space-y-1">
                  <p className="text-2xl font-black">4</p>
                  <p className="text-[10px] font-bold text-amber-600 uppercase tracking-tighter">In Process</p>
               </div>
            </div>
          </Card>

          <Card className="rounded-[2rem] border-border/60 bg-card shadow-sm p-8">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-6">TDS Summary (Month)</p>
            <div className="flex items-center gap-4">
               <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
                  <TrendingDown className="w-6 h-6" />
               </div>
               <div>
                  <h3 className="text-xl font-black tracking-tight">₹42,000</h3>
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Withheld for Compliance</p>
               </div>
            </div>
          </Card>

          <Card className="rounded-[2rem] border-border/60 bg-card shadow-sm p-8">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-6">Settlement Avg.</p>
            <div className="flex items-center gap-4">
               <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
                  <Clock className="w-6 h-6" />
               </div>
               <div>
                  <h3 className="text-xl font-black tracking-tight">1.2 Days</h3>
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Time to disburse</p>
               </div>
            </div>
          </Card>
        </div>

        {/* Payout Queue */}
        <Card className="rounded-[2rem] border-border/60 bg-card shadow-sm overflow-hidden">
          <CardHeader className="p-8 border-b border-border/40 bg-muted/5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-1">
                <CardTitle className="text-xl font-black tracking-tight text-foreground">Payout Queue</CardTitle>
                <CardDescription className="text-xs font-medium uppercase tracking-wider">Approval pipeline and disbursement control</CardDescription>
              </div>
              <div className="flex items-center gap-3">
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search recipients..." className="h-10 w-64 rounded-xl border-border/60 pl-10" />
                 </div>
                 <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl">
                    <Filter className="w-4 h-4" />
                 </Button>
              </div>
            </div>
          </CardHeader>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/10 border-b border-border/40">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[180px] pl-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Request ID</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Recipient & Role</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Gross Amount</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">TDS (10%)</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Net Payable</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Approval Path</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</TableHead>
                  <TableHead className="pr-8 text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPayouts.map((payout) => {
                  const RoleIcon = roleIcons[payout.recipient.role as keyof typeof roleIcons];
                  return (
                    <TableRow key={payout.id} className="hover:bg-muted/5 transition-colors border-b border-border/40 last:border-0 group">
                      <TableCell className="pl-8 py-6">
                        <span className="text-sm font-black text-foreground group-hover:text-primary transition-colors">{payout.id}</span>
                        <p className="text-[10px] font-medium text-muted-foreground mt-0.5">{payout.requestDate}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-primary/5 text-primary">
                            <RoleIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground">{payout.recipient.name}</p>
                            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">{payout.recipient.role}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-bold text-foreground">₹{payout.amount.toLocaleString()}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-bold text-rose-600">-₹{payout.taxDeducted.toLocaleString()}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-black text-foreground">₹{payout.netAmount.toLocaleString()}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                           {payout.approvalChain.map((step, idx) => (
                             <div key={idx} className="flex items-center gap-1.5">
                                <Badge className={cn(
                                   "rounded-full p-1",
                                   step.status === "Approved" ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-muted text-muted-foreground border-border/60"
                                )}>
                                   <CheckCircle2 className="w-3 h-3" />
                                </Badge>
                                {idx < payout.approvalChain.length - 1 && <ArrowDownRight className="w-3 h-3 text-muted-foreground/30 rotate-[-45deg]" />}
                             </div>
                           ))}
                           <Info className="w-3.5 h-3.5 text-muted-foreground ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("rounded-lg border font-black text-[9px] uppercase tracking-tighter px-2.5 py-0.5 shadow-none", statusColors[payout.status as keyof typeof statusColors])}>
                          {payout.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="pr-8 text-right">
                        <Button 
                          className={cn(
                            "h-9 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg",
                            payout.status === "Approved" ? "bg-primary hover:bg-primary/90 text-white shadow-primary/20" : "bg-muted text-muted-foreground cursor-not-allowed shadow-none"
                          )}
                        >
                          {payout.status === "Approved" ? "Disburse Funds" : "Details"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </Card>

      </div>
    </FinanceLayout>
  );
};

export default Payouts;
