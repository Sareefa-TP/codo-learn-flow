import { useState } from "react";
import FinanceLayout from "@/components/finance/FinanceLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  RefreshCw,
  Plus,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Link as LinkIcon,
  Search,
  Filter,
  CreditCard,
  ArrowRight,
  ShieldCheck,
  History,
  Clock,
  User,
  MessageSquare,
  MoreVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { reconciliationSummary, unmatchedEntries } from "@/data/financeMock";
import { toast } from "sonner";

// ─── Helpers ────────────────────────────────────────────────────────────────

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

// ─── Component ───────────────────────────────────────────────────────────────

const Reconciliation = () => {
  const [matching, setMatching] = useState(false);

  const handleReRunMatch = () => {
    setMatching(true);
    toast.promise(new Promise(resolve => setTimeout(resolve, 2000)), {
      loading: "Running reconciliation engine...",
      success: "Reconciliation complete. 12 entries matched automatically.",
      error: "Engine failed to run",
      finally: () => setMatching(false),
    });
  };

  return (
    <FinanceLayout>
      <div className="animate-fade-in space-y-8 max-w-7xl mx-auto pb-20">
        
        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1.5">
            <Badge variant="outline" className="rounded-full bg-primary/5 text-primary border-primary/20 font-black text-[9px] uppercase px-3 py-1 tracking-widest mb-2">
              Module 03
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-foreground leading-none">
              Payments & Reconciliation
            </h1>
            <p className="text-sm font-medium text-muted-foreground max-w-lg mt-2">
              Verify your books by matching gateway collections (Razorpay/Stripe) against LMS internal records.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={handleReRunMatch}
              disabled={matching}
              className="h-12 rounded-2xl font-black text-[10px] uppercase tracking-widest border-border/60 hover:bg-primary/5 hover:text-primary transition-all"
            >
              <RefreshCw className={cn("w-4 h-4 mr-2", matching && "animate-spin")} />
              Re-run match
            </Button>
            <Button className="h-12 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-[10px] uppercase tracking-widest px-8 shadow-2xl shadow-primary/20">
              <Plus className="w-4 h-4 mr-2" />
              Manual payment
            </Button>
          </div>
        </div>

        {/* ── Daily Summary ── */}
        <Card className="rounded-[2.5rem] border-border/60 bg-card shadow-sm overflow-hidden">
          <div className="p-8 pb-0">
            <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
              <History className="w-5 h-5 text-primary" />
              Daily Reconciliation <span className="text-muted-foreground font-medium text-sm ml-2">(Last 5 Days)</span>
            </h2>
          </div>
          
          <div className="overflow-x-auto mt-6">
            <Table>
              <TableHeader className="bg-muted/10 border-y border-border/40">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">Settlement Date</TableHead>
                  <TableHead className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">Gateway</TableHead>
                  <TableHead className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Collected (GW)</TableHead>
                  <TableHead className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Recorded (LMS)</TableHead>
                  <TableHead className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Fees</TableHead>
                  <TableHead className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Net Expected</TableHead>
                  <TableHead className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Diff</TableHead>
                  <TableHead className="pr-8 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reconciliationSummary.map((row, i) => (
                  <TableRow key={i} className="hover:bg-muted/5 transition-colors border-b border-border/30 last:border-0 group">
                    <TableCell className="pl-8 py-5">
                      <span className="text-sm font-bold text-foreground">{row.date}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn(
                        "rounded-full font-black text-[8px] uppercase px-2.5 py-0.5",
                        row.gateway === "Razorpay" ? "bg-blue-50 text-blue-600 border-blue-200" :
                        row.gateway === "Stripe" ? "bg-indigo-50 text-indigo-600 border-indigo-200" : "bg-emerald-50 text-emerald-600 border-emerald-200"
                      )}>
                        {row.gateway}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-bold tabular-nums text-sm">{fmt(row.collected)}</TableCell>
                    <TableCell className="text-right font-medium tabular-nums text-sm text-muted-foreground">{fmt(row.recorded)}</TableCell>
                    <TableCell className="text-right font-medium tabular-nums text-xs text-rose-500">−{fmt(row.fees)}</TableCell>
                    <TableCell className="text-right font-black tabular-nums text-sm text-primary">{fmt(row.net)}</TableCell>
                    <TableCell className="text-right">
                      <span className={cn(
                        "text-sm font-black tabular-nums",
                        row.diff > 0 ? "text-rose-600" : "text-emerald-600"
                      )}>
                        {row.diff === 0 ? "—" : fmt(row.diff)}
                      </span>
                    </TableCell>
                    <TableCell className="pr-8 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className={cn(
                          "text-[10px] font-black uppercase tracking-tighter",
                          row.status === "Matched" ? "text-emerald-600" : "text-rose-600"
                        )}>
                          {row.status}
                        </span>
                        {row.status === "Matched" ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-rose-500 animate-pulse" />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* ── Action Queue (Table) ── */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-4">
            <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              Unmatched Gateway Entries
              <Badge className="bg-amber-100 text-amber-700 ml-2 rounded-full border-amber-200 font-black text-[10px] px-2.5">
                {unmatchedEntries.length} Pending
              </Badge>
            </h2>
            <div className="flex items-center gap-3">
               <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input 
                    placeholder="Search IDs..." 
                    className="pl-9 h-9 w-48 rounded-xl border border-border/60 bg-muted/5 focus:bg-background transition-all font-bold text-[10px] uppercase tracking-widest outline-none focus:ring-2 focus:ring-primary/20"
                  />
               </div>
               <Button variant="ghost" className="h-9 w-9 p-0 rounded-xl hover:bg-muted/50">
                 <Filter className="w-4 h-4 text-muted-foreground" />
               </Button>
            </div>
          </div>

          <Card className="rounded-[2.5rem] border-amber-200/60 bg-amber-50/20 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-amber-100/50 border-b border-amber-200/40">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="pl-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-amber-800">Entry ID</TableHead>
                    <TableHead className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-800">Gateway Ref</TableHead>
                    <TableHead className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-800">Suggested User</TableHead>
                    <TableHead className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-800">Resolution Reason</TableHead>
                    <TableHead className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-800 text-right">Amount</TableHead>
                    <TableHead className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-800 text-right">Timestamp</TableHead>
                    <TableHead className="pr-8 text-right text-[9px] font-black uppercase tracking-[0.2em] text-amber-800">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {unmatchedEntries.map((entry) => (
                    <TableRow key={entry.id} className="hover:bg-amber-100/30 transition-colors border-b border-amber-200/20 last:border-0 group">
                      <TableCell className="pl-8 py-5">
                        <span className="text-xs font-black font-mono text-amber-700">{entry.id}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="rounded-md font-black text-[8px] uppercase px-1.5 py-0 border-amber-200/60 text-amber-600 bg-white">
                            {entry.gateway}
                          </Badge>
                          <span className="text-[10px] font-mono font-bold text-muted-foreground">{entry.gatewayId}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center">
                            <User className="w-2.5 h-2.5 text-amber-700" />
                          </div>
                          <span className="text-xs font-black text-foreground">{entry.student}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 max-w-[200px]">
                          <AlertCircle className="w-3 h-3 text-rose-500 shrink-0" />
                          <span className="text-[11px] font-bold text-rose-700 leading-tight">
                            {entry.reason}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-black tabular-nums text-sm text-foreground">
                        {fmt(entry.amount)}
                      </TableCell>
                      <TableCell className="text-right text-[10px] font-bold text-muted-foreground">
                        {entry.timestamp}
                      </TableCell>
                      <TableCell className="pr-8 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="outline"
                            className="h-8 rounded-lg border-amber-200 bg-white text-amber-700 font-black text-[9px] uppercase tracking-widest px-3 hover:bg-amber-600 hover:text-white transition-all shadow-sm"
                            onClick={() => toast.success(`Matched ${entry.id} manually`)}
                          >
                            <LinkIcon className="w-2.5 h-2.5 mr-1.5" />
                            Match
                          </Button>
                          <Button 
                            variant="ghost"
                            className="h-8 w-8 p-0 rounded-lg hover:bg-amber-100 text-amber-700"
                            onClick={() => toast.info(`Options for ${entry.id}`)}
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>

        {/* ── Footnote ── */}
        <div className="flex items-center justify-center py-6 gap-3 opacity-30">
          <ShieldCheck className="w-4 h-4" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em]">CODO Matching Engine v2.4 — Live Status</p>
        </div>
      </div>
    </FinanceLayout>
  );
};

export default Reconciliation;
