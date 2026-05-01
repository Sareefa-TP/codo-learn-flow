import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
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
  User2,
  BookOpen,
  Banknote,
  ShieldAlert,
  ReceiptIndianRupee,
  MessageSquare,
  MoreVertical,
  X,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { reconciliationSummary, unmatchedEntries } from "@/data/financeMock";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ─── Helpers ────────────────────────────────────────────────────────────────

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

// ─── Dialogs ────────────────────────────────────────────────────────────────

const ManualPaymentDialog = ({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean, matched?: boolean, log?: any) => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = useState<Date>();
  const [amount, setAmount] = useState("");
  const [gstEnabled, setGstEnabled] = useState(false);

  // Financial calculations
  const totalNum = parseFloat(amount) || 0;
  const baseAmount = totalNum / 1.18;
  const gstAmount = totalNum - baseAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const logData = {
      id: `ML-${Math.floor(1000 + Math.random() * 9000)}`,
      amount: parseFloat(amount),
      gst: gstEnabled,
      base: baseAmount,
      gstVal: gstAmount,
      date: date ? format(date, "PPP") : format(new Date(), "PPP"),
      ref: "AUDIT-REF-MANUAL"
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onOpenChange(false, false, logData);
      toast.success("Transaction verified and logged to audit ledger");
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg" variant="finance" className="p-0">
        {/* ── Header ── */}
        <div className="bg-slate-50 p-6 border-b border-slate-200/60 relative shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <ReceiptIndianRupee className="w-5 h-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-black tracking-tight text-slate-900 leading-none">Record Manual Payment Entry</DialogTitle>
              <DialogDescription className="text-[11px] font-bold text-slate-500 mt-1 uppercase tracking-wider">
                Audit Ledger Synchronization
              </DialogDescription>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Left Column: Entity & Source */}
            <div className="space-y-10">
              {/* Section A: Entity Linking */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <User2 className="w-4 h-4 text-primary" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Section A: Entity Linking</h3>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[11px] font-bold text-slate-600 ml-1">Student / User</Label>
                    <div className="relative group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                      <Input placeholder="Search by name, email or UserID..." required className="pl-11 h-12 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all font-bold text-sm" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[11px] font-bold text-slate-600 ml-1">Course / Package</Label>
                    <Select required>
                      <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-slate-50/50 font-bold text-sm">
                        <SelectValue placeholder="Select course..." />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-slate-200">
                        <SelectItem value="fsd">Full Stack Dev — ₹45,000</SelectItem>
                        <SelectItem value="data">Data Science — ₹55,000</SelectItem>
                        <SelectItem value="ui">UI/UX Design — ₹35,000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Section B: Transaction Source */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <Banknote className="w-4 h-4 text-primary" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Section B: Transaction Source</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[11px] font-bold text-slate-600 ml-1">Method</Label>
                    <Select required>
                      <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-slate-50/50 font-bold text-sm">
                        <SelectValue placeholder="Method" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl">
                        <SelectItem value="bank">Bank Transfer</SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="upi">UPI (GPay/PhonePe)</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[11px] font-bold text-slate-600 ml-1">Reference ID / UTR</Label>
                    <div className="relative group">
                      <Input placeholder="Audit Proof ID" required className="h-12 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all font-mono font-black text-xs uppercase" />
                      <ShieldAlert className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Financials & Audit */}
            <div className="space-y-10">
              {/* Section C: The Financials */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-4 h-4 text-primary" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Section C: The Financials</h3>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[11px] font-bold text-slate-600 ml-1">Total Amount Received (INR)</Label>
                    <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-400">₹</span>
                      <Input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        required
                        className="pl-12 h-20 rounded-3xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all text-4xl font-black tabular-nums tracking-tighter text-primary"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-5 rounded-3xl border border-slate-100 bg-slate-50/50">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-black text-slate-800">Generate GST Invoice</Label>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Auto-calculate 18% GST split</p>
                    </div>
                    <Switch checked={gstEnabled} onCheckedChange={setGstEnabled} className="data-[state=checked]:bg-primary" />
                  </div>

                  {/* GST Breakdown Box */}
                  <div className={cn(
                    "rounded-3xl p-6 transition-all duration-300 border",
                    gstEnabled ? "bg-primary/5 border-primary/10 opacity-100 scale-100" : "bg-slate-50 border-slate-100 opacity-60 scale-[0.98]"
                  )}>
                    {gstEnabled ? (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Base Amount</span>
                          <span className="text-sm font-black text-slate-700">{fmt(baseAmount)}</span>
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t border-primary/10">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">GST (18%)</span>
                          <span className="text-sm font-black text-primary">{fmt(gstAmount)}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 py-2 text-slate-500">
                        <ShieldAlert className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">Proceeding without GST collection</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Section D: Verification */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Section D: Verification & Notes</h3>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[11px] font-bold text-slate-600 ml-1">Payment Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="h-12 w-full rounded-2xl border-slate-200 justify-start text-left font-bold text-sm bg-slate-50/50 hover:bg-white transition-all"
                        >
                          <CalendarIcon className="mr-3 h-4 w-4 text-primary" />
                          {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 rounded-3xl border-none shadow-2xl" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          disabled={(date) => date > new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[11px] font-bold text-slate-600 ml-1">Internal Audit Notes</Label>
                    <Textarea
                      placeholder="e.g. Student paid cash at branch..."
                      className="rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all font-medium text-sm min-h-[100px] p-4"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>

        <div className="p-6 border-t border-slate-100 bg-slate-50/30 shrink-0">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 transition-all active:scale-[0.98]"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-3">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              "Review & Log Transaction"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ReconciliationMatchDialog = ({ open, onOpenChange, entry }: { open: boolean, onOpenChange: (open: boolean, matched?: boolean) => void, entry: any }) => {
  const [search, setSearch] = useState("");
  const [selectedTarget, setSelectedTarget] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!entry) return null;

  // Mock pending orders for target matching
  const pendingOrders = [
    { id: "ORD-2026-901", student: "Aisha Khan", email: "aisha@example.com", course: "Full Stack Pro", amount: 18880 },
    { id: "ORD-2026-902", student: "Rohan Verma", email: "rohan@example.com", course: "Data Science Masters", amount: 19000 },
    { id: "ORD-2026-903", student: "Sarah Miller", email: "sarah@example.com", course: "UI/UX Advanced", amount: 15000 },
  ];

  const filteredOrders = pendingOrders.filter(o =>
    o.student.toLowerCase().includes(search.toLowerCase()) ||
    o.id.toLowerCase().includes(search.toLowerCase())
  );

  const diff = selectedTarget ? entry.amount - selectedTarget.amount : 0;
  const isExactMatch = diff === 0;
  const isPartial = diff < 0;
  const isOverpayment = diff > 0;

  const handleConfirm = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onOpenChange(false, true); // Added success flag
      toast.success(`Successfully matched ${entry.id} to ${selectedTarget.student}`);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg" variant="finance" className="p-0">
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

          {/* ── Left Side: Source (Gateway) ── */}
          <div className="md:w-2/5 bg-emerald-50/40 p-8 border-r border-emerald-100 flex flex-col">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                <Banknote className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-xs font-black uppercase tracking-widest text-emerald-800">Source: Gateway Entry</h3>
            </div>

            <div className="space-y-8 mt-4">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600/60">Gateway Reference</p>
                <p className="text-xl font-black font-mono tracking-tighter text-emerald-900">{entry.gatewayId}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600/60">Transaction Amount</p>
                <p className="text-4xl font-black tracking-tighter text-emerald-600 tabular-nums">{fmt(entry.amount)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600/60">Timestamp</p>
                <p className="text-sm font-bold text-emerald-900/60 italic">{entry.timestamp}</p>
              </div>

              <div className="pt-8">
                <div className="p-4 rounded-2xl bg-emerald-600/10 border border-emerald-600/20 flex gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <p className="text-[11px] font-bold text-emerald-800 leading-snug">
                    This record is immutable. Reconciliation will link this ID to an internal student order.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Side: Target (LMS) ── */}
          <div className="flex-1 p-8 flex flex-col bg-white">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <User2 className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Target: Student Order</h3>
              </div>
              <Badge variant="outline" className="rounded-full bg-slate-50 font-black text-[9px] uppercase px-3 py-1">Internal Ledger</Badge>
            </div>

            <div className="space-y-6 flex-1 flex flex-col min-h-0">
              <div className="relative group shrink-0">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="Search Student Name, Email, or Order ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-11 h-12 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all font-bold text-sm"
                />
              </div>

              {/* Results Area */}
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3 min-h-0">
                {filteredOrders.length > 0 ? filteredOrders.map(order => (
                  <button
                    key={order.id}
                    onClick={() => setSelectedTarget(order)}
                    className={cn(
                      "w-full text-left p-4 rounded-2xl border-2 transition-all group relative overflow-hidden",
                      selectedTarget?.id === order.id
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-slate-100 hover:border-slate-200 bg-slate-50/50"
                    )}
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-black text-slate-900">{order.student}</p>
                          <span className="text-[10px] font-bold text-muted-foreground opacity-60 font-mono">{order.id}</span>
                        </div>
                        <p className="text-[11px] font-bold text-slate-500">{order.course}</p>
                      </div>
                      <p className="text-sm font-black text-slate-900">{fmt(order.amount)}</p>
                    </div>
                    {selectedTarget?.id === order.id && (
                      <div className="absolute right-0 top-0 bottom-0 w-1 bg-primary" />
                    )}
                  </button>
                )) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-30 py-10">
                    <Search className="w-10 h-10 mb-2" />
                    <p className="text-xs font-black uppercase tracking-widest">No matching pending orders</p>
                  </div>
                )}
              </div>

              {/* Reconciliation Bridge Status */}
              {selectedTarget && (
                <div className="shrink-0 pt-4 border-t border-slate-100 space-y-4">
                  <div className={cn(
                    "p-4 rounded-2xl flex items-center justify-between border",
                    isExactMatch ? "bg-emerald-50 border-emerald-100" : "bg-amber-50 border-amber-100"
                  )}>
                    <div className="flex items-center gap-3">
                      <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", isExactMatch ? "bg-emerald-500" : "bg-amber-500")}>
                        {isExactMatch ? <CheckCircle2 className="w-4 h-4 text-white" /> : <ShieldAlert className="w-4 h-4 text-white" />}
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Match Accuracy</p>
                        <p className={cn("text-xs font-black", isExactMatch ? "text-emerald-700" : "text-amber-700")}>
                          {isExactMatch ? "Exact Amount Match" :
                            isPartial ? "Amount Mismatch: Partial Payment" : "Amount Mismatch: Overpayment"}
                        </p>
                      </div>
                    </div>
                    {!isExactMatch && (
                      <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Difference</p>
                        <p className="text-xs font-black text-amber-700">{diff > 0 ? "+" : ""}{fmt(diff)}</p>
                      </div>
                    )}
                  </div>

                  {isPartial && (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[10px] font-bold text-amber-800 leading-tight">
                      Warning: Gateway amount is less than order amount. Reconciliation will mark this as a partial payment and record the remaining balance as due.
                    </div>
                  )}

                  {isOverpayment && (
                    <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-800 leading-tight flex justify-between items-center">
                      <span>Add remaining {fmt(diff)} to student's internal wallet?</span>
                      <Switch checked defaultChecked className="scale-75 data-[state=checked]:bg-blue-600" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Checkbox id="notify" defaultChecked className="rounded-md border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
            <label htmlFor="notify" className="text-xs font-black text-slate-500 uppercase tracking-widest cursor-pointer">Notify Student via Email</label>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl font-black text-[10px] uppercase tracking-widest h-11 px-6">Cancel</Button>
            <Button
              disabled={!selectedTarget || isSubmitting}
              onClick={handleConfirm}
              className={cn(
                "flex-1 md:flex-none h-11 rounded-xl text-white font-black text-[10px] uppercase tracking-widest px-8 shadow-xl transition-all",
                isExactMatch ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200" : "bg-primary hover:bg-primary/90 shadow-primary/20"
              )}
            >
              {isSubmitting ? "Linking..." : "Confirm Match & Grant Access"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ─── Component ───────────────────────────────────────────────────────────────

const Reconciliation = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [matching, setMatching] = useState(false);
  const [entries, setEntries] = useState(unmatchedEntries);
  const [manualLogs, setManualLogs] = useState<any[]>([]);

  // URL state helpers
  const modal = searchParams.get("modal");
  const isManualOpen = modal === "manual-payment";
  const isMatchOpen = modal === "reconciliation-match";

  const activeEntryId = searchParams.get("entryId");
  const activeEntry = entries.find(e => e.id === activeEntryId);

  const setModal = (name: string | null, entryId?: string) => {
    if (name) {
      searchParams.set("modal", name);
      if (entryId) searchParams.set("entryId", entryId);
    } else {
      searchParams.delete("modal");
      searchParams.delete("entryId");
    }
    setSearchParams(searchParams);
  };

  const handleMatchSuccess = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const handleManualLog = (log: any) => {
    setManualLogs(prev => [log, ...prev]);
  };

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
            <Button
              onClick={() => setModal("manual-payment")}
              className="h-12 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-[10px] uppercase tracking-widest px-8 shadow-2xl shadow-primary/20"
            >
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
              <Badge variant="secondary" className="rounded-full bg-amber-100 text-amber-700 border-amber-200 font-black text-[10px] px-3 py-1">
                {entries.length} Pending
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
                  {entries.map((entry) => (
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
                            onClick={() => setModal("reconciliation-match", entry.id)}
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

        {/* ── Recent Manual Audit Logs ── */}
        {manualLogs.length > 0 && (
          <div className="mt-12 space-y-6">
            <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
              <History className="w-5 h-5 text-primary" />
              Recent Manual Audit Logs
              <Badge className="bg-primary/10 text-primary rounded-full font-black text-[10px] px-3 py-1">
                {manualLogs.length} New Entries
              </Badge>
            </h2>

            <Card className="rounded-[2.5rem] border-primary/10 shadow-xl shadow-primary/5 overflow-hidden bg-white">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="border-b border-primary/5">
                    <TableHead className="pl-8 font-black text-[10px] uppercase tracking-widest text-slate-400">Log ID</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400">Date</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400">Base Amount</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400">GST (18%)</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400">Total Collected</TableHead>
                    <TableHead className="pr-8 text-right font-black text-[10px] uppercase tracking-widest text-slate-400">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {manualLogs.map((log) => (
                    <TableRow key={log.id} className="hover:bg-primary/5 transition-colors border-b border-primary/5 last:border-0 group">
                      <TableCell className="pl-8 py-5">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-primary opacity-40" />
                          <span className="text-xs font-black font-mono text-slate-600">{log.id}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-bold text-slate-500 italic">{log.date}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-black text-slate-700">{fmt(log.base)}</span>
                      </TableCell>
                      <TableCell>
                        <span className={cn("text-sm font-black", log.gst ? "text-primary" : "text-slate-300")}>
                          {log.gst ? fmt(log.gstVal) : "₹0"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-base font-black text-primary tracking-tight">{fmt(log.amount)}</span>
                      </TableCell>
                      <TableCell className="pr-8 text-right">
                        <Badge className="bg-emerald-100 text-emerald-700 rounded-full font-black text-[9px] uppercase px-3 py-1">
                          LOGGED
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        )}
      </div>

      {/* ── Dialogs ── */}
      <ManualPaymentDialog
        open={isManualOpen}
        onOpenChange={(open, matched, log) => {
          if (!open) {
            if (log) handleManualLog(log);
            setModal(null);
          }
        }}
      />

      <ReconciliationMatchDialog
        open={isMatchOpen}
        onOpenChange={(open, matched) => {
          if (!open) {
            if (matched && activeEntryId) handleMatchSuccess(activeEntryId);
            setModal(null);
          }
        }}
        entry={activeEntry}
      />
    </FinanceLayout>
  );
};

export default Reconciliation;
