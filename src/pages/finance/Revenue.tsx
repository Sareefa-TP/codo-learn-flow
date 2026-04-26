import { useState, useMemo } from "react";
import FinanceLayout from "@/components/finance/FinanceLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Search,
  Download,
  Filter,
  TrendingUp,
  Calendar,
  CreditCard,
  MoreVertical,
  FileText,
  DollarSign,
  Layers,
  Video,
  Wallet,
  GraduationCap,
  Plus,
  X,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { revenueRows, revenueStats } from "@/data/financeMock";
import { toast } from "sonner";

// ─── Types ──────────────────────────────────────────────────────────────────

interface RevenueEntry {
  id: string;
  orderId: string;
  studentName: string;
  productName: string;
  type: string;
  gross: number;
  disc: number;
  tax: number;
  total: number;
  method: string;
  date: string;
  status: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

// ─── Manual Entry Dialog ─────────────────────────────────────────────────────

interface ManualEntryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ManualEntryDialog = ({ open, onOpenChange }: ManualEntryProps) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onOpenChange(false);
      toast.success("Manual revenue entry recorded successfully", {
        description: "Invoice generated and ledger updated.",
      });
    }, 1200);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-[2rem] border-border/60">
        <DialogHeader>
          <DialogTitle className="text-xl font-black tracking-tight">Record Manual Entry</DialogTitle>
          <DialogDescription className="text-sm font-medium">
            Capture offline payments (Cash, Cheque, NEFT) directly into the ledger.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="student" className="text-[10px] font-black uppercase tracking-widest ml-1">Student Name</Label>
              <Input id="student" placeholder="Enter student's full name" className="h-11 rounded-xl border-border/60 font-medium" required />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="product" className="text-[10px] font-black uppercase tracking-widest ml-1">Product / Course</Label>
              <Input id="product" placeholder="e.g. Full Stack Pro" className="h-11 rounded-xl border-border/60 font-medium" required />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Type</Label>
              <Select required>
                <SelectTrigger className="h-11 rounded-xl border-border/60 font-medium">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="Course">Course</SelectItem>
                  <SelectItem value="Bundle">Bundle</SelectItem>
                  <SelectItem value="Webinar">Webinar</SelectItem>
                  <SelectItem value="Subscription">Subscription</SelectItem>
                  <SelectItem value="Wallet">Wallet Top-up</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Method</Label>
              <Select required>
                <SelectTrigger className="h-11 rounded-xl border-border/60 font-medium">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Cheque">Cheque</SelectItem>
                  <SelectItem value="NEFT">NEFT</SelectItem>
                  <SelectItem value="UPI">UPI / Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="amount" className="text-[10px] font-black uppercase tracking-widest ml-1">Gross Amount (₹)</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">₹</span>
                <Input id="amount" type="number" placeholder="0.00" className="h-11 rounded-xl border-border/60 pl-8 font-black tabular-nums" required />
              </div>
            </div>
          </div>
          <DialogFooter className="pt-4 gap-3">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl font-bold uppercase tracking-widest text-[10px]">Cancel</Button>
            <Button type="submit" disabled={loading} className="rounded-xl font-bold uppercase tracking-widest text-[10px] bg-primary text-white px-8">
              {loading ? "Recording..." : "Record Entry"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// ─── Revenue Detail Dialog ────────────────────────────────────────────────────

interface DetailProps {
  entry: RevenueEntry | null;
  onClose: () => void;
}

const RevenueDetailDialog = ({ entry, onClose }: DetailProps) => {
  if (!entry) return null;

  const handleDownload = () => {
    toast.promise(new Promise(resolve => setTimeout(resolve, 1500)), {
      loading: "Generating styled invoice...",
      success: `Invoice ${entry.orderId}.html downloaded successfully`,
      error: "Failed to generate invoice",
    });
  };

  return (
    <Dialog open={!!entry} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] rounded-[2.5rem] border-border/60 p-0 overflow-hidden bg-background">
        <div className="relative p-8 pb-4">
          <div className="flex items-start justify-between mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="rounded-full bg-primary/5 text-primary border-primary/20 font-black text-[9px] uppercase px-3 py-1">
                  {entry.type}
                </Badge>
                <Badge className={cn(
                  "rounded-full font-black text-[9px] uppercase px-3 py-1 shadow-none",
                  entry.status === "Confirmed" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                  entry.status === "Pending" ? "bg-amber-50 text-amber-600 border-amber-200" : "bg-rose-50 text-rose-600 border-rose-200"
                )}>
                  {entry.status}
                </Badge>
              </div>
              <h2 className="text-3xl font-black tracking-tighter text-foreground leading-tight">
                {entry.productName}
              </h2>
              <p className="text-sm font-mono text-muted-foreground flex items-center gap-2">
                ID: {entry.orderId} <span className="opacity-30">|</span> {entry.date}
              </p>
            </div>
            <div className="p-4 rounded-3xl bg-muted/30 border border-border/60">
              <DollarSign className="w-8 h-8 text-primary" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-5 rounded-3xl border border-border/60 bg-card space-y-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Customer Info</p>
              <div className="space-y-3">
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Student</p>
                  <p className="text-sm font-black">{entry.studentName}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Method</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <CreditCard className="w-3 h-3 text-primary" />
                    <p className="text-xs font-bold uppercase tracking-tight">{entry.method}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-3xl border border-border/60 bg-muted/20 space-y-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Breakdown</p>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-muted-foreground">Gross Amount</span>
                  <span className="tabular-nums">{fmt(entry.gross)}</span>
                </div>
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-muted-foreground">Discount</span>
                  <span className="text-amber-600 tabular-nums">−{fmt(entry.disc)}</span>
                </div>
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-muted-foreground">GST (18%)</span>
                  <span className="tabular-nums">{fmt(entry.tax)}</span>
                </div>
                <div className="pt-2 mt-2 border-t border-border/60 flex justify-between">
                  <span className="text-sm font-black uppercase tracking-widest">Total</span>
                  <span className="text-lg font-black text-primary tabular-nums">{fmt(entry.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 bg-muted/30 border-t border-border/60 gap-3 sm:justify-center">
          <Button 
            onClick={handleDownload}
            className="rounded-2xl bg-foreground text-background hover:bg-foreground/90 font-black text-[10px] uppercase tracking-widest h-12 px-8 flex-1"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Invoice
          </Button>
          <Button 
            variant="outline"
            className="rounded-2xl border-border/60 bg-background font-black text-[10px] uppercase tracking-widest h-12 px-8 flex-1 group"
            onClick={() => window.location.href = `/finance/transactions?highlight=${entry.id}`}
          >
            View Transaction
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ─── Main Page ───────────────────────────────────────────────────────────────

const Revenue = () => {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<RevenueEntry | null>(null);

  const filteredData = useMemo(() => {
    return (revenueRows as RevenueEntry[]).filter(row => {
      const q = search.toLowerCase();
      const matchesSearch = row.studentName.toLowerCase().includes(q) || 
                           row.orderId.toLowerCase().includes(q) || 
                           row.productName.toLowerCase().includes(q);
      const matchesType = filterType === "all" || row.type === filterType;
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
              Module 02
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-foreground leading-none">
              Revenue ledger
            </h1>
            <p className="text-sm font-medium text-muted-foreground max-w-md">
              Every incoming payment to Codo Academy — courses, bundles, webinars, subscriptions, wallet top-ups.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="h-12 rounded-2xl font-black text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-muted/50">
              <Download className="w-4 h-4 mr-2" />
              Export Excel
            </Button>
            <Button 
              onClick={() => setIsManualOpen(true)}
              className="h-12 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-[10px] uppercase tracking-widest px-8 shadow-2xl shadow-primary/20"
            >
              <Plus className="w-4 h-4 mr-2" />
              Manual entry
            </Button>
          </div>
        </div>

        {/* ── Summary Stats ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {revenueStats.map((stat, i) => (
            <Card key={i} className="rounded-[2rem] border-border/60 bg-card/50 shadow-sm overflow-hidden group hover:bg-card transition-colors">
              <CardContent className="p-7">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3">{stat.label}</p>
                <div className="flex items-baseline gap-2 mb-1">
                  <h3 className={cn("text-3xl font-black tracking-tighter tabular-nums", stat.color)}>{stat.value}</h3>
                </div>
                <p className="text-[11px] font-bold text-muted-foreground/60 group-hover:text-muted-foreground transition-colors">{stat.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ── Table Section ── */}
        <Card className="rounded-[2.5rem] border-border/60 bg-card shadow-sm overflow-hidden border-b-0">
          <div className="p-8 pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-black tracking-tight">All revenue</h2>
              <Badge variant="secondary" className="rounded-full bg-muted/50 text-muted-foreground font-black text-[10px] px-2.5">
                {filteredData.length} rows
              </Badge>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input 
                  placeholder="Search ledger..." 
                  className="pl-11 h-11 w-full md:w-64 rounded-2xl border-border/60 bg-muted/5 focus:bg-background transition-all font-bold text-xs"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button variant="outline" className="h-11 w-11 p-0 rounded-2xl border-border/60 hover:bg-primary/5 hover:border-primary/20 hover:text-primary">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto mt-6">
            <Table>
              <TableHeader className="bg-muted/10 border-y border-border/40">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">Order</TableHead>
                  <TableHead className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">Student</TableHead>
                  <TableHead className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">Product</TableHead>
                  <TableHead className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">Type</TableHead>
                  <TableHead className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Gross</TableHead>
                  <TableHead className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Disc</TableHead>
                  <TableHead className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Tax</TableHead>
                  <TableHead className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Total</TableHead>
                  <TableHead className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">Method</TableHead>
                  <TableHead className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">Date</TableHead>
                  <TableHead className="pr-8 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((row) => (
                  <TableRow 
                    key={row.id} 
                    className="hover:bg-muted/10 transition-colors border-b border-border/30 last:border-0 group cursor-pointer"
                    onClick={() => setSelectedEntry(row)}
                  >
                    <TableCell className="pl-8 py-5">
                      <span className="text-xs font-mono font-bold text-muted-foreground group-hover:text-primary transition-colors">{row.orderId}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-black text-foreground">{row.studentName}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-tight truncate max-w-[120px] inline-block">{row.productName}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="rounded-full font-black text-[8px] uppercase px-2 py-0 border-border/60 text-muted-foreground">
                        {row.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-bold tabular-nums text-xs">{fmt(row.gross)}</TableCell>
                    <TableCell className="text-right text-xs tabular-nums text-muted-foreground">
                      {row.disc > 0 ? <span className="text-amber-600">−{fmt(row.disc)}</span> : "—"}
                    </TableCell>
                    <TableCell className="text-right text-xs tabular-nums text-muted-foreground">{fmt(row.tax)}</TableCell>
                    <TableCell className="text-right font-black tabular-nums text-sm text-foreground">{fmt(row.total)}</TableCell>
                    <TableCell>
                      <span className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">{row.method}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-[10px] font-bold text-muted-foreground whitespace-nowrap">{row.date}</span>
                    </TableCell>
                    <TableCell className="pr-8 text-right">
                      <Badge className={cn(
                        "rounded-lg border font-black text-[9px] uppercase tracking-tighter px-2.5 py-0.5 shadow-none",
                        row.status === "Confirmed" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                        row.status === "Pending" ? "bg-amber-50 text-amber-600 border-amber-200" : "bg-rose-50 text-rose-600 border-rose-200"
                      )}>
                        {row.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="p-8 border-t border-border/40 bg-muted/5 flex items-center justify-between">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
              End of ledger • FY 2026-27
            </p>
            <div className="flex items-center gap-4">
              <Button variant="ghost" disabled className="h-10 rounded-xl font-black text-[10px] uppercase tracking-widest opacity-50">Prev</Button>
              <div className="flex gap-1">
                <Button className="h-10 w-10 rounded-xl bg-primary text-white font-black text-[10px]">1</Button>
                <Button variant="ghost" className="h-10 w-10 rounded-xl font-black text-[10px]">2</Button>
              </div>
              <Button variant="ghost" className="h-10 rounded-xl font-black text-[10px] uppercase tracking-widest">Next</Button>
            </div>
          </div>
        </Card>

        {/* ── Footnote ── */}
        <div className="flex items-center justify-center py-6 gap-3 opacity-30">
          <ShieldCheck className="w-4 h-4" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em]">Operational Financial Ledger — Codo Academy</p>
        </div>
      </div>

      {/* ── Dialogs ── */}
      <ManualEntryDialog open={isManualOpen} onOpenChange={setIsManualOpen} />
      <RevenueDetailDialog entry={selectedEntry} onClose={() => setSelectedEntry(null)} />

    </FinanceLayout>
  );
};

export default Revenue;
