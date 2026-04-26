import { useState, useMemo } from "react";
import FinanceLayout from "@/components/finance/FinanceLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Search,
  Download,
  Filter,
  Plus,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  MoreVertical,
  Calendar,
  User,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  Wallet,
  FileText,
  AlertCircle,
  TrendingUp,
  History,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { refundsList, refundStats } from "@/data/financeMock";
import { toast } from "sonner";

// ─── Helpers ────────────────────────────────────────────────────────────────

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

// ─── Refund Detail Drawer ────────────────────────────────────────────────────

interface DetailProps {
  refund: any | null;
  onClose: () => void;
}

const RefundDetailDrawer = ({ refund, onClose }: DetailProps) => {
  if (!refund) return null;

  const isCompleted = refund.status === "Completed";
  const isRejected = refund.status === "Rejected";

  return (
    <Sheet open={!!refund} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-[500px] border-l border-border/60 p-0 overflow-y-auto">
        {/* Header Section */}
        <div className={cn(
          "p-8 pb-10 border-b border-border/40",
          isRejected ? "bg-slate-50/50" : "bg-rose-50/30"
        )}>
          <div className="flex items-center justify-between mb-8">
             <div className="flex gap-2">
                <Badge variant="outline" className="rounded-full bg-white font-black text-[9px] uppercase px-3 py-1 border-border/40">
                  {refund.reason}
                </Badge>
                <Badge className={cn(
                  "rounded-full font-black text-[9px] uppercase px-3 py-1 shadow-none",
                  refund.status === "Completed" ? "bg-emerald-500 text-white" :
                  refund.status === "Requested" ? "bg-amber-500 text-white" :
                  refund.status === "Approved" ? "bg-blue-500 text-white" :
                  refund.status === "Processing" ? "bg-indigo-500 text-white" : "bg-slate-600 text-white"
                )}>
                  {refund.status}
                </Badge>
             </div>
             <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-black/5">
                <XCircle className="w-5 h-5 text-muted-foreground" />
             </Button>
          </div>
          
          <div className="space-y-1">
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Refund Amount</p>
             <h2 className="text-5xl font-black tracking-tighter tabular-nums text-rose-600">
               {fmt(refund.refundAmount)}
             </h2>
             <div className="flex items-center gap-2 mt-2">
                <p className="text-xs font-mono font-bold text-muted-foreground opacity-60">
                   {refund.id}
                </p>
                <span className="opacity-20">|</span>
                <button className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1 hover:underline">
                   Order {refund.orderId}
                   <ExternalLink className="w-2.5 h-2.5" />
                </button>
             </div>
          </div>
        </div>

        <div className="p-8 space-y-10">
          {/* Student Context */}
          <div className="space-y-4">
             <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Student & Context</p>
             <div className="p-5 rounded-3xl border border-border/60 bg-muted/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-sm">
                      {refund.student.charAt(0)}
                   </div>
                   <div>
                      <p className="text-sm font-black">{refund.student}</p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">{refund.product}</p>
                   </div>
                </div>
                <div className="text-right">
                   <p className="text-[9px] font-bold text-muted-foreground uppercase">Original Pay</p>
                   <p className="text-xs font-black">{fmt(refund.originalAmount)}</p>
                </div>
             </div>
          </div>

          {/* Refund Reason & Note */}
          <div className="space-y-4">
             <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Refund Details</p>
                <Badge variant="secondary" className="rounded-full font-black text-[8px] uppercase px-2 py-0">
                   By {refund.requestedBy}
                </Badge>
             </div>
             <div className="p-5 rounded-3xl border border-border/60 bg-white space-y-4 shadow-sm">
                <div className="flex items-start gap-3">
                   <MessageSquare className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                   <p className="text-xs font-medium leading-relaxed text-muted-foreground">
                      {refund.note}
                   </p>
                </div>
             </div>
          </div>

          {/* Money Breakdown */}
          <div className="space-y-4">
             <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Money Breakdown</p>
             <div className="p-6 rounded-[2rem] border border-border/60 bg-muted/5 space-y-3">
                <div className="flex justify-between text-xs font-medium">
                   <span className="text-muted-foreground">Original Amount</span>
                   <span className="tabular-nums font-bold">{fmt(refund.originalAmount)}</span>
                </div>
                {refund.deductions.map((d: any, i: number) => (
                   <div key={i} className="flex justify-between text-xs font-medium">
                      <span className="text-muted-foreground">{d.label}</span>
                      <span className="text-rose-600 tabular-nums">−{fmt(d.amount)}</span>
                   </div>
                ))}
                <div className="pt-4 mt-2 border-t border-border/40 flex justify-between items-end">
                   <span className="text-[10px] font-black uppercase tracking-[0.2em]">Final Refund</span>
                   <span className="text-2xl font-black text-rose-600 tabular-nums leading-none">{fmt(refund.refundAmount)}</span>
                </div>
             </div>
          </div>

          {/* Timeline */}
          <div className="space-y-6">
             <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Approval Chain</p>
             <div className="relative pl-6 space-y-8 before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-[2px] before:bg-muted/40">
                <div className="relative">
                   <div className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-sm" />
                   <p className="text-xs font-black">Requested</p>
                   <p className="text-[10px] font-medium text-muted-foreground">{refund.requestedOn} • {refund.requestedBy}</p>
                </div>
                <div className="relative">
                   <div className={cn(
                     "absolute -left-[27px] top-1 w-3 h-3 rounded-full border-2 border-white shadow-sm",
                     refund.status !== "Requested" ? "bg-emerald-500" : "bg-muted"
                   )} />
                   <p className={cn("text-xs font-black", refund.status === "Requested" && "text-muted-foreground")}>Finance Review</p>
                   {refund.status !== "Requested" && <p className="text-[10px] font-medium text-muted-foreground">Approved by Finance Team</p>}
                </div>
                <div className="relative">
                   <div className={cn(
                     "absolute -left-[27px] top-1 w-3 h-3 rounded-full border-2 border-white shadow-sm",
                     isCompleted ? "bg-emerald-500" : "bg-muted"
                   )} />
                   <p className={cn("text-xs font-black", !isCompleted && "text-muted-foreground")}>Gateway Processed</p>
                   {isCompleted && <p className="text-[10px] font-medium text-muted-foreground">Successfully settled via Razorpay</p>}
                </div>
             </div>
          </div>
        </div>

        <SheetFooter className="absolute bottom-0 left-0 right-0 p-8 bg-background border-t border-border/60 gap-3">
          {refund.status === "Requested" ? (
             <>
                <Button variant="ghost" className="rounded-2xl font-black text-[10px] uppercase tracking-widest flex-1 h-12 text-rose-600 hover:bg-rose-50 hover:text-rose-700">
                   <XCircle className="w-4 h-4 mr-2" />
                   Reject
                </Button>
                <Button className="rounded-2xl bg-primary text-white font-black text-[10px] uppercase tracking-widest flex-1 h-12 shadow-xl shadow-primary/20">
                   <CheckCircle2 className="w-4 h-4 mr-2" />
                   Approve
                </Button>
             </>
          ) : (
             <>
                <Button variant="outline" className="rounded-2xl font-black text-[10px] uppercase tracking-widest flex-1 h-12 border-border/60">
                   <FileText className="w-4 h-4 mr-2" />
                   Credit Note
                </Button>
                <Button variant="outline" className="rounded-2xl font-black text-[10px] uppercase tracking-widest flex-1 h-12 border-border/60">
                   <Wallet className="w-4 h-4 mr-2" />
                   Wallet Cr.
                </Button>
             </>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

// ─── Main Page ───────────────────────────────────────────────────────────────

const Refunds = () => {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedRefund, setSelectedRefund] = useState<any | null>(null);

  const filteredData = useMemo(() => {
    return refundsList.filter(row => {
      const q = search.toLowerCase();
      const matchesSearch = row.student.toLowerCase().includes(q) || 
                           row.id.toLowerCase().includes(q) || 
                           row.orderId.toLowerCase().includes(q);
      const matchesStatus = filterStatus === "all" || row.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [search, filterStatus]);

  return (
    <FinanceLayout>
      <div className="animate-fade-in space-y-8 max-w-7xl mx-auto pb-20">
        
        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1.5">
            <Badge variant="outline" className="rounded-full bg-primary/5 text-primary border-primary/20 font-black text-[9px] uppercase px-3 py-1 tracking-widest mb-2">
              Module 05
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-foreground leading-none">
              Refunds
            </h1>
            <p className="text-sm font-medium text-muted-foreground max-w-md">
              Process course cancellations, quality claims, and duplicate payment returns with policy checks.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="h-12 rounded-2xl font-black text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-muted/50">
              <Download className="w-4 h-4 mr-2" />
              Export Refunds
            </Button>
            <Button className="h-12 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-[10px] uppercase tracking-widest px-8 shadow-2xl shadow-rose-200">
              <Plus className="w-4 h-4 mr-2" />
              New Refund
            </Button>
          </div>
        </div>

        {/* ── KPI Summary ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {refundStats.map((stat, i) => (
            <Card key={i} className="rounded-[2rem] border-border/60 bg-card/50 shadow-sm hover:bg-card transition-all group">
              <CardContent className="p-7">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3">{stat.label}</p>
                <div className="flex items-baseline justify-between">
                   <h3 className={cn("text-3xl font-black tracking-tighter tabular-nums", stat.color)}>{stat.value}</h3>
                   {stat.label === "Refund rate" && (
                     <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                        <TrendingUp className="w-4 h-4" />
                     </div>
                   )}
                </div>
                <p className="text-[11px] font-bold text-muted-foreground/60 mt-1 group-hover:text-muted-foreground transition-colors">{stat.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ── Table Section ── */}
        <Card className="rounded-[2.5rem] border-border/60 bg-card shadow-sm overflow-hidden border-b-0">
          {/* Toolbar */}
          <div className="p-8 pb-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
             <div className="flex items-center gap-3">
                <h2 className="text-xl font-black tracking-tight">Processing Queue</h2>
                <Badge variant="secondary" className="rounded-full bg-muted/50 text-muted-foreground font-black text-[10px] px-2.5">
                   {filteredData.length} Requests
                </Badge>
             </div>

             <div className="flex flex-wrap items-center gap-3">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input 
                    placeholder="Search IDs or Student..." 
                    className="pl-11 h-11 w-full md:w-64 rounded-2xl border-border/60 bg-muted/5 focus:bg-background transition-all font-bold text-xs"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="h-11 rounded-2xl border-border/60 font-black text-[10px] uppercase tracking-widest w-[140px] bg-muted/5">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="all" className="text-xs font-black uppercase tracking-widest">All Status</SelectItem>
                    <SelectItem value="Requested" className="text-xs font-black uppercase tracking-widest">Requested</SelectItem>
                    <SelectItem value="Approved" className="text-xs font-black uppercase tracking-widest">Approved</SelectItem>
                    <SelectItem value="Completed" className="text-xs font-black uppercase tracking-widest">Completed</SelectItem>
                    <SelectItem value="Rejected" className="text-xs font-black uppercase tracking-widest">Rejected</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" className="h-11 w-11 p-0 rounded-2xl border-border/60 hover:bg-primary/5 hover:border-primary/20 hover:text-primary">
                  <Calendar className="w-4 h-4" />
                </Button>
             </div>
          </div>

          <div className="overflow-x-auto mt-6">
            <Table>
              <TableHeader className="bg-muted/10 border-y border-border/40">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">Refund ID</TableHead>
                  <TableHead className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">Original Order</TableHead>
                  <TableHead className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">Student</TableHead>
                  <TableHead className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">Reason</TableHead>
                  <TableHead className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Orig. Pay</TableHead>
                  <TableHead className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Refund Amt</TableHead>
                  <TableHead className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">Requested</TableHead>
                  <TableHead className="pr-8 text-right text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((row) => (
                  <TableRow 
                    key={row.id} 
                    onClick={() => setSelectedRefund(row)}
                    className="hover:bg-muted/10 transition-colors border-b border-border/30 last:border-0 group cursor-pointer"
                  >
                    <TableCell className="pl-8 py-5">
                      <span className="text-xs font-mono font-bold text-muted-foreground group-hover:text-rose-600 transition-colors">{row.id}</span>
                    </TableCell>
                    <TableCell>
                       <span className="text-[10px] font-mono font-black text-muted-foreground/60">{row.orderId}</span>
                    </TableCell>
                    <TableCell>
                       <div className="flex flex-col">
                          <span className="text-sm font-black text-foreground">{row.student}</span>
                          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight">{row.product}</span>
                       </div>
                    </TableCell>
                    <TableCell>
                       <Badge variant="outline" className="rounded-full font-black text-[8px] uppercase px-2 py-0 border-border/60 text-muted-foreground">
                          {row.reason}
                       </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums text-xs text-muted-foreground">{fmt(row.originalAmount)}</TableCell>
                    <TableCell className="text-right font-black tabular-nums text-sm text-rose-600">{fmt(row.refundAmount)}</TableCell>
                    <TableCell>
                       <span className="text-[10px] font-bold text-muted-foreground">{row.requestedOn}</span>
                    </TableCell>
                    <TableCell className="pr-8 text-right">
                       <div className="flex items-center justify-end gap-2">
                          <span className={cn(
                             "text-[9px] font-black uppercase tracking-tighter",
                             row.status === "Completed" ? "text-emerald-600" :
                             row.status === "Rejected" ? "text-slate-500" : "text-amber-600"
                          )}>
                             {row.status}
                          </span>
                          <div className={cn(
                             "w-1.5 h-1.5 rounded-full",
                             row.status === "Completed" ? "bg-emerald-500" :
                             row.status === "Rejected" ? "bg-slate-400" : "bg-amber-500 animate-pulse"
                          )} />
                       </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="p-8 border-t border-border/40 bg-muted/5 flex items-center justify-center">
             <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-muted-foreground opacity-30" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-40">
                  Refund Settlement Workspace • FY 2026-27
                </p>
             </div>
          </div>
        </Card>
      </div>

      <RefundDetailDrawer refund={selectedRefund} onClose={() => setSelectedRefund(null)} />
    </FinanceLayout>
  );
};

export default Refunds;
