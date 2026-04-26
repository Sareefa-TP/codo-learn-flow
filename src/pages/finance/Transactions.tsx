import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  MoreVertical,
  Calendar,
  User,
  CreditCard,
  Link as LinkIcon,
  Copy,
  Receipt,
  Flag,
  ArrowRight,
  History,
  ShieldCheck,
  Building2,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { transactionsList, transactionStats } from "@/data/financeMock";
import { toast } from "sonner";

// ─── Helpers ────────────────────────────────────────────────────────────────

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

// ─── Transaction Detail Drawer ───────────────────────────────────────────────

interface DetailProps {
  transaction: any | null;
  onClose: () => void;
}

const TransactionDetailDrawer = ({ transaction, onClose }: DetailProps) => {
  if (!transaction) return null;

  const isInflow = transaction.direction === "in";

  return (
    <Sheet open={!!transaction} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-[500px] border-l border-border/60 p-0 overflow-y-auto">
        {/* Header Section */}
        <div className={cn(
          "p-8 pb-10 border-b border-border/40",
          isInflow ? "bg-emerald-50/30" : "bg-rose-50/30"
        )}>
          <div className="flex items-center justify-between mb-8">
             <div className="flex gap-2">
                <Badge variant="outline" className="rounded-full bg-white font-black text-[9px] uppercase px-3 py-1 border-border/40">
                  {transaction.type}
                </Badge>
                <Badge className={cn(
                  "rounded-full font-black text-[9px] uppercase px-3 py-1 shadow-none",
                  transaction.status === "Success" ? "bg-emerald-500 text-white" :
                  transaction.status === "Pending" ? "bg-amber-500 text-white" : "bg-rose-500 text-white"
                )}>
                  {transaction.status}
                </Badge>
             </div>
             <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-black/5">
                <XCircle className="w-5 h-5 text-muted-foreground" />
             </Button>
          </div>
          
          <div className="space-y-1">
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Amount</p>
             <h2 className={cn(
               "text-5xl font-black tracking-tighter tabular-nums",
               isInflow ? "text-emerald-600" : "text-rose-600"
             )}>
               {isInflow ? "+" : "−"}{fmt(transaction.amount)}
             </h2>
             <p className="text-xs font-mono font-bold text-muted-foreground opacity-60">
               {transaction.id} • {transaction.date}
             </p>
          </div>
        </div>

        <div className="p-8 space-y-10">
          {/* Parties Block */}
          <div className="space-y-4">
             <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Parties & Method</p>
             <div className="p-5 rounded-3xl border border-border/60 bg-muted/5 space-y-4">
                <div className="flex items-center justify-between">
                   <div className="space-y-1">
                      <p className="text-[9px] font-bold text-muted-foreground uppercase">From</p>
                      <p className="text-sm font-black">{isInflow ? transaction.party : "Codo Academy"}</p>
                   </div>
                   <ArrowRight className="w-4 h-4 text-muted-foreground opacity-30" />
                   <div className="space-y-1 text-right">
                      <p className="text-[9px] font-bold text-muted-foreground uppercase">To</p>
                      <p className="text-sm font-black">{isInflow ? "Codo Academy" : transaction.party}</p>
                   </div>
                </div>
                <div className="pt-4 border-t border-border/40 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-primary" />
                      <span className="text-xs font-bold uppercase tracking-tight">{transaction.method}</span>
                   </div>
                   <span className="text-[10px] font-mono font-bold text-muted-foreground">REF: {transaction.gatewayRef}</span>
                </div>
             </div>
          </div>

          {/* Linked Records */}
          <div className="space-y-4">
             <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Linked Records</p>
             <div className="grid grid-cols-1 gap-2">
                <Button variant="outline" className="justify-between h-12 rounded-2xl border-border/60 font-bold text-xs group">
                   <div className="flex items-center gap-3">
                      <Receipt className="w-4 h-4 text-primary" />
                      <span>Original Order/Invoice</span>
                   </div>
                   <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
                <Button variant="outline" className="justify-between h-12 rounded-2xl border-border/60 font-bold text-xs group">
                   <div className="flex items-center gap-3">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <span>Reconciliation Entry</span>
                   </div>
                   <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
             </div>
          </div>

          {/* Timeline */}
          <div className="space-y-6">
             <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Activity Timeline</p>
             <div className="relative pl-6 space-y-8 before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-[2px] before:bg-muted/40">
                <div className="relative">
                   <div className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                   <p className="text-xs font-black">Transaction Initiated</p>
                   <p className="text-[10px] font-medium text-muted-foreground">10:42 AM • Student triggered</p>
                </div>
                <div className="relative">
                   <div className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                   <p className="text-xs font-black">Gateway Authorization</p>
                   <p className="text-[10px] font-medium text-muted-foreground">10:42 AM • Sent to {transaction.method}</p>
                </div>
                <div className="relative opacity-50">
                   <div className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-muted border-2 border-white" />
                   <p className="text-xs font-bold text-muted-foreground">Bank Settlement</p>
                   <p className="text-[10px] font-medium text-muted-foreground">T+2 Working Days</p>
                </div>
             </div>
          </div>
        </div>

        <SheetFooter className="absolute bottom-0 left-0 right-0 p-8 bg-background border-t border-border/60 gap-3">
          <Button variant="ghost" className="rounded-2xl font-black text-[10px] uppercase tracking-widest flex-1 h-12">
            <Flag className="w-4 h-4 mr-2" />
            Flag
          </Button>
          <Button className="rounded-2xl bg-primary text-white font-black text-[10px] uppercase tracking-widest flex-1 h-12">
            <Receipt className="w-4 h-4 mr-2" />
            Receipt
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

// ─── Main Page ───────────────────────────────────────────────────────────────

const Transactions = () => {
  const [searchParams] = useSearchParams();
  const highlightedId = searchParams.get("highlight");

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedTxn, setSelectedTxn] = useState<any | null>(null);

  const filteredData = useMemo(() => {
    return transactionsList.filter(txn => {
      const q = search.toLowerCase();
      const matchesSearch = txn.id.toLowerCase().includes(q) || 
                           txn.party.toLowerCase().includes(q) || 
                           txn.gatewayRef.toLowerCase().includes(q);
      const matchesType = filterType === "all" || txn.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [search, filterType]);

  return (
    <FinanceLayout>
      <div className="animate-fade-in space-y-8 max-w-7xl mx-auto pb-20">
        
        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1.5">
            <Badge variant="outline" className="rounded-full bg-primary/5 text-primary border-primary/20 font-black text-[9px] uppercase px-3 py-1 tracking-widest mb-2">
              Module 04
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-foreground leading-none">
              Transactions
            </h1>
            <p className="text-sm font-medium text-muted-foreground max-w-md">
              Unified ledger of every individual money movement across all gateways and accounts.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="h-12 rounded-2xl font-black text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-muted/50">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button className="h-12 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-[10px] uppercase tracking-widest px-8 shadow-2xl shadow-primary/20">
              <Plus className="w-4 h-4 mr-2" />
              New Transaction
            </Button>
          </div>
        </div>

        {/* ── KPI Summary ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {transactionStats.map((stat, i) => (
            <Card key={i} className="rounded-[2rem] border-border/60 bg-card/50 shadow-sm hover:bg-card transition-all">
              <CardContent className="p-7">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3">{stat.label}</p>
                <h3 className={cn("text-3xl font-black tracking-tighter tabular-nums", stat.color)}>{stat.value}</h3>
                <p className="text-[11px] font-bold text-muted-foreground/60 mt-1">{stat.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ── Ledger Section ── */}
        <Card className="rounded-[2.5rem] border-border/60 bg-card shadow-sm overflow-hidden border-b-0">
          {/* Filter Bar */}
          <div className="p-8 pb-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
             <div className="flex items-center gap-3">
                <h2 className="text-xl font-black tracking-tight">Main Ledger</h2>
                <Badge variant="secondary" className="rounded-full bg-muted/50 text-muted-foreground font-black text-[10px] px-2.5">
                   Live Feed
                </Badge>
             </div>

             <div className="flex flex-wrap items-center gap-3">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input 
                    placeholder="Search transactions..." 
                    className="pl-11 h-11 w-full md:w-64 rounded-2xl border-border/60 bg-muted/5 focus:bg-background transition-all font-bold text-xs"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="h-11 rounded-2xl border-border/60 font-black text-[10px] uppercase tracking-widest w-[140px] bg-muted/5">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="all" className="text-xs font-black uppercase tracking-widest">All Types</SelectItem>
                    <SelectItem value="Charge" className="text-xs font-black uppercase tracking-widest">Charge</SelectItem>
                    <SelectItem value="Refund" className="text-xs font-black uppercase tracking-widest">Refund</SelectItem>
                    <SelectItem value="Payout" className="text-xs font-black uppercase tracking-widest">Payout</SelectItem>
                    <SelectItem value="Fee" className="text-xs font-black uppercase tracking-widest">Fee</SelectItem>
                    <SelectItem value="Adjustment" className="text-xs font-black uppercase tracking-widest">Adjustment</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" className="h-11 w-11 p-0 rounded-2xl border-border/60 hover:bg-primary/5 hover:border-primary/20 hover:text-primary">
                  <Calendar className="w-4 h-4" />
                </Button>
             </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto mt-6">
            <Table>
              <TableHeader className="bg-muted/10 border-y border-border/40">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">Txn ID</TableHead>
                  <TableHead className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">Date / Time</TableHead>
                  <TableHead className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">Type</TableHead>
                  <TableHead className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">Party</TableHead>
                  <TableHead className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">Method</TableHead>
                  <TableHead className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Amount</TableHead>
                  <TableHead className="pr-8 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((txn) => {
                  const isInflow = txn.direction === "in";
                  const isHighlighted = highlightedId === txn.id;

                  return (
                    <TableRow 
                      key={txn.id} 
                      onClick={() => setSelectedTxn(txn)}
                      className={cn(
                        "hover:bg-muted/10 transition-colors border-b border-border/30 last:border-0 group cursor-pointer",
                        isHighlighted && "bg-primary/5 border-l-4 border-l-primary"
                      )}
                    >
                      <TableCell className="pl-8 py-5">
                        <span className="text-xs font-mono font-bold text-muted-foreground group-hover:text-primary transition-colors">{txn.id}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-bold text-muted-foreground">{txn.date}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="rounded-full font-black text-[8px] uppercase px-2 py-0 border-border/60 text-muted-foreground">
                          {txn.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                           <span className="text-sm font-black text-foreground">{txn.party}</span>
                           <span className="text-[10px] font-medium text-muted-foreground truncate max-w-[150px]">{txn.desc}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                           <CreditCard className="w-3.5 h-3.5 text-muted-foreground" />
                           <span className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">{txn.method}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className={cn(
                          "text-sm font-black tabular-nums",
                          isInflow ? "text-emerald-600" : "text-rose-600"
                        )}>
                          {isInflow ? "+" : "−"}{fmt(txn.amount)}
                        </div>
                      </TableCell>
                      <TableCell className="pr-8 text-right">
                        <div className="flex items-center justify-end gap-2">
                           <span className={cn(
                             "text-[9px] font-black uppercase tracking-tighter",
                             txn.status === "Success" ? "text-emerald-600" :
                             txn.status === "Pending" ? "text-amber-600" : "text-rose-600"
                           )}>
                             {txn.status}
                           </span>
                           {txn.status === "Success" ? (
                             <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                           ) : txn.status === "Pending" ? (
                             <Clock className="w-3.5 h-3.5 text-amber-500" />
                           ) : (
                             <XCircle className="w-3.5 h-3.5 text-rose-500" />
                           )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          
          <div className="p-8 border-t border-border/40 bg-muted/5 flex items-center justify-center">
             <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-muted-foreground opacity-30" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-40">
                  Unified Transaction Ledger • End of Feed
                </p>
             </div>
          </div>
        </Card>
      </div>

      <TransactionDetailDrawer transaction={selectedTxn} onClose={() => setSelectedTxn(null)} />
    </FinanceLayout>
  );
};

export default Transactions;
