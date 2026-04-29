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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
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
  Upload,
  Banknote,
  Search as SearchIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { transactionsList, transactionStats } from "@/data/financeMock";
import { toast } from "sonner";

// ─── Helpers ────────────────────────────────────────────────────────────────

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

// ─── Transaction Detail Dialog ───────────────────────────────────────────────

interface DetailProps {
  transaction: any | null;
  onClose: () => void;
}

const TransactionDetailDialog = ({ transaction, onClose }: DetailProps) => {
  if (!transaction) return null;

  const isInflow = transaction.direction === "in";

  return (
    <Dialog open={!!transaction} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl rounded-[2rem] border-none p-0 overflow-hidden bg-white shadow-2xl max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/50 bg-muted/5 flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">Transaction Details</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Internal reference and activity audit log.
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          {/* Amount Summary Section */}
          <div className={cn(
            "p-8 rounded-[2rem] border transition-colors duration-500 text-center space-y-2",
            isInflow ? "bg-primary/5 border-primary/10" : "bg-rose-50 border-rose-100"
          )}>
            <div className="flex justify-center gap-2 mb-4">
                <Badge variant="outline" className="rounded-full bg-white font-black text-[9px] uppercase px-3 py-1 border-border/40">
                  {transaction.type}
                </Badge>
                <Badge className={cn(
                  "rounded-full font-black text-[9px] uppercase px-3 py-1 shadow-none",
                  transaction.status === "Success" ? "bg-primary text-white" :
                  transaction.status === "Pending" ? "bg-amber-500 text-white" : "bg-rose-500 text-white"
                )}>
                  {transaction.status}
                </Badge>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Amount Transacted</p>
            <h2 className={cn(
              "text-5xl font-black tracking-tighter tabular-nums",
              isInflow ? "text-primary" : "text-rose-600"
            )}>
              {isInflow ? "+" : "−"}{fmt(transaction.amount)}
            </h2>
            <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
              <span>{transaction.id}</span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
              <span>{transaction.date}</span>
            </div>
          </div>
          {/* Parties & Method */}
          <div className="space-y-4">
             <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Parties & Method</p>
             <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-4 p-5 rounded-3xl bg-slate-50 border border-slate-100">
                <div className="space-y-1">
                   <p className="text-[8px] font-black uppercase text-slate-400">From</p>
                   <p className="text-sm font-black text-slate-700">{transaction.party}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300" />
                <div className="space-y-1 text-right">
                   <p className="text-[8px] font-black uppercase text-slate-400">To</p>
                   <p className="text-sm font-black text-slate-700">CODO Academy</p>
                </div>
                <div className="col-span-3 h-[1px] bg-slate-200/60 my-2" />
                <div className="flex items-center gap-2">
                   <CreditCard className="w-4 h-4 text-slate-400" />
                   <span className="text-[10px] font-black uppercase tracking-tighter text-slate-500">{transaction.method}</span>
                </div>
                <div className="col-span-2 text-right">
                   <p className="text-[9px] font-bold text-slate-400 tabular-nums">REF: {transaction.gatewayRef}</p>
                </div>
             </div>
          </div>

          {/* Linked Records */}
          <div className="space-y-3">
             <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Linked Records</p>
             <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="justify-between h-12 rounded-2xl border-border/60 font-bold text-xs group">
                   <div className="flex items-center gap-3">
                      <Receipt className="w-4 h-4 text-primary" />
                      <span>Original Order/Invoice</span>
                   </div>
                   <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
                <Button variant="outline" className="justify-between h-12 rounded-2xl border-border/60 font-bold text-xs group">
                   <div className="flex items-center gap-3">
                      <ShieldCheck className="w-4 h-4 text-primary" />
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
                   <div className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-primary border-2 border-white" />
                   <p className="text-xs font-black">Transaction Initiated</p>
                   <p className="text-[10px] font-medium text-muted-foreground">10:42 AM • Student triggered</p>
                </div>
                <div className="relative">
                   <div className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-primary border-2 border-white" />
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

        <DialogFooter className="p-6 bg-muted/5 border-t border-border/50 flex items-center justify-center gap-3">
          <Button variant="ghost" className="rounded-2xl font-black text-[10px] uppercase tracking-widest h-12 px-8">
            <Flag className="w-4 h-4 mr-2" />
            Flag Transaction
          </Button>
          <Button className="rounded-2xl bg-primary text-white font-black text-[10px] uppercase tracking-widest px-10 h-12 shadow-lg shadow-primary/20">
            <Receipt className="w-4 h-4 mr-2" />
            Download Receipt
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ExportPreviewDialog = ({ open, onOpenChange, data }: { open: boolean, onOpenChange: (open: boolean) => void, data: any[] }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleConfirmExport = () => {
    setIsExporting(true);
    
    // Generate CSV
    const headers = ["Transaction ID", "Date", "Type", "Party", "Method", "Amount", "Status"];
    const rows = data.map(txn => [
      txn.id,
      txn.date,
      txn.type,
      `"${txn.party}"`, // Wrap in quotes for safety
      txn.method,
      String(txn.amount).replace(/₹|,/g, ""), // Convert to string before replace
      txn.status
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Transactions_Audit_${new Date().toISOString().split('T')[0]}.csv`);
    
    setTimeout(() => {
      link.click();
      URL.revokeObjectURL(url);
      setIsExporting(false);
      onOpenChange(false);
      toast.success("CSV Export successful", {
        description: `${data.length} records exported to your downloads folder.`
      });
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl rounded-[2.5rem] border-border/60 p-0 overflow-hidden bg-white shadow-2xl">
        <div className="p-8">
           <DialogHeader className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                 <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Download className="w-5 h-5 text-primary" />
                 </div>
                 <div>
                    <DialogTitle className="text-2xl font-black tracking-tight">Export Audit Ledger</DialogTitle>
                    <DialogDescription className="text-sm font-medium">Verify the records below before generating the CSV export.</DialogDescription>
                 </div>
              </div>
           </DialogHeader>

           <div className="rounded-2xl border border-border/40 overflow-hidden mb-6">
              <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                 <Table>
                    <TableHeader className="bg-slate-50 sticky top-0 z-10">
                       <TableRow>
                          <TableHead className="font-black text-[9px] uppercase tracking-widest pl-6">ID</TableHead>
                          <TableHead className="font-black text-[9px] uppercase tracking-widest">Party</TableHead>
                          <TableHead className="font-black text-[9px] uppercase tracking-widest">Type</TableHead>
                          <TableHead className="font-black text-[9px] uppercase tracking-widest pr-6 text-right">Amount</TableHead>
                       </TableRow>
                    </TableHeader>
                    <TableBody>
                       {data.map((txn) => (
                         <TableRow key={txn.id} className="border-b border-border/20 last:border-0">
                            <TableCell className="font-mono text-[10px] font-black pl-6">{txn.id}</TableCell>
                            <TableCell className="text-xs font-bold text-slate-600">{txn.party}</TableCell>
                            <TableCell>
                               <Badge variant="secondary" className="rounded-full text-[8px] font-black uppercase px-2 py-0.5">
                                  {txn.type}
                               </Badge>
                            </TableCell>
                            <TableCell className="text-xs font-black text-right pr-6">{txn.amount}</TableCell>
                         </TableRow>
                       ))}
                    </TableBody>
                 </Table>
              </div>
              <div className="p-4 bg-slate-50 border-t border-border/20 text-center">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Showing full preview of {data.length} / {data.length} records
                 </p>
              </div>
           </div>

           <div className="flex items-center gap-4 p-4 rounded-2xl bg-primary/5 border border-primary/10">
              <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
              <p className="text-xs font-bold text-primary/80 leading-relaxed">
                 The exported file will be CSV format and compatible with Excel, Google Sheets, and standard accounting software.
              </p>
           </div>
        </div>

        <DialogFooter className="bg-slate-50 p-6 gap-3">
           <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl font-black text-[10px] uppercase tracking-widest h-11 px-8">
              Cancel
           </Button>
           <Button 
              onClick={handleConfirmExport} 
              disabled={isExporting}
              className="rounded-xl bg-primary hover:bg-primary/90 text-white font-black text-[10px] uppercase tracking-widest h-11 px-10 shadow-lg shadow-primary/20"
           >
              {isExporting ? "Compiling CSV..." : "Confirm & Download CSV"}
           </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const NewTransactionDialog = ({ open, onOpenChange, onSuccess }: { open: boolean, onOpenChange: (open: boolean) => void, onSuccess: (txn: any) => void }) => {
  const [type, setType] = useState<"in" | "out">("in");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [party, setParty] = useState("");
  const [method, setMethod] = useState("");
  const [refId, setRefId] = useState("");
  const [notes, setNotes] = useState("");
  const [gstEnabled, setGstEnabled] = useState(false);
  const [gstRate, setGstRate] = useState("18");
  const [date, setDate] = useState<Date>(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const txnId = useMemo(() => `TXN-M-${format(new Date(), "yyyyMMdd")}-${Math.floor(1000 + Math.random() * 9000)}`, []);

  // GST Calculations
  const total = parseFloat(amount) || 0;
  const rate = parseFloat(gstRate) / 100;
  const baseAmount = total / (1 + rate);
  const gstAmount = total - baseAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newTxn = {
      id: txnId,
      date: format(date, "dd MMM yyyy, HH:mm"),
      type: category.toUpperCase() || "MANUAL",
      party: party || "Unknown Party",
      desc: description || "Manual Ledger Entry",
      method: method.toUpperCase() || "CASH",
      amount: total,
      direction: type,
      status: "Success",
      gatewayRef: refId || "M-REF-00"
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess(newTxn);
      onOpenChange(false);
      
      // Clear form
      setDescription("");
      setAmount("");
      setParty("");
      setRefId("");

      toast.success("Transaction posted to ledger", {
        description: `Reference: ${txnId}`
      });
    }, 1500);
  };

  const isDark = type === "out";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl bg-white max-h-[90vh] flex flex-col">
        <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
           {/* Modal Header */}
           <div className="flex items-center justify-between p-6 border-b border-border/50 bg-muted/5 flex-shrink-0">
              <div className="space-y-1">
                 <div className="flex items-center gap-2">
                    <DialogTitle className="text-xl font-bold tracking-tight text-slate-900">New Ledger Entry</DialogTitle>
                    <Badge variant="outline" className={cn("rounded-md font-mono text-[9px] uppercase", isDark ? "border-rose-200 text-rose-700 bg-white" : "border-primary/20 text-primary bg-white")}>
                       {txnId}
                    </Badge>
                 </div>
                 <p className="text-sm text-muted-foreground">Record a manual transaction movement in the internal ledger.</p>
              </div>
           </div>

           <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              {/* Type Selector */}
              <div className="space-y-3">
                 <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Transaction Classification</Label>
                 <Tabs value={type} onValueChange={(v) => setType(v as any)} className="w-full">
                    <TabsList className="w-full h-14 p-1.5 rounded-2xl bg-slate-100/50 border border-slate-200">
                       <TabsTrigger 
                         value="in" 
                         className="flex-1 rounded-xl h-full font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 transition-all"
                       >
                          <ArrowDownRight className="w-4 h-4 mr-2" />
                          Inflow (+ Credit)
                       </TabsTrigger>
                       <TabsTrigger 
                         value="out" 
                         className="flex-1 rounded-xl h-full font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-rose-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-rose-200 transition-all"
                       >
                          <ArrowUpRight className="w-4 h-4 mr-2" />
                          Outflow (- Debit)
                       </TabsTrigger>
                    </TabsList>
                 </Tabs>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                 <div className="col-span-2 space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description / Title</Label>
                    <Input 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="e.g. Monthly Server Cost, Course Enrollment..." 
                      className="h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all font-bold text-sm" 
                      required
                    />
                 </div>

                 <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Category</Label>
                    <Select value={category} onValueChange={setCategory} required>
                       <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-slate-50/50 font-bold text-sm">
                          <SelectValue placeholder="Select Category" />
                       </SelectTrigger>
                       <SelectContent className="rounded-xl">
                          <SelectItem value="Operating Expense">Operating Expense</SelectItem>
                          <SelectItem value="Course Sale">Course Sale</SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                          <SelectItem value="Payroll">Payroll</SelectItem>
                          <SelectItem value="Payout">Gateway Payout</SelectItem>
                       </SelectContent>
                    </Select>
                 </div>

                 <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Amount (INR)</Label>
                    <div className="relative group">
                       <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black">₹</span>
                       <Input 
                         type="number" 
                         value={amount}
                         onChange={(e) => setAmount(e.target.value)}
                         placeholder="0.00" 
                         className={cn(
                           "h-12 rounded-xl border-slate-200 pl-8 font-black text-lg tabular-nums transition-all",
                           isDark ? "focus:ring-rose-500/10 focus:border-rose-500" : "focus:ring-primary/10 focus:border-primary"
                         )} 
                         required
                       />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Related Party</Label>
                    <div className="relative group">
                       <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                       <Input 
                         value={party}
                         onChange={(e) => setParty(e.target.value)}
                         placeholder="Vendor or Student Name..." 
                         className="h-12 rounded-xl border-slate-200 pl-11 font-bold text-sm bg-slate-50/50 focus:bg-white" 
                       />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Payment Method</Label>
                    <Select value={method} onValueChange={setMethod} required>
                       <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-slate-50/50 font-bold text-sm">
                          <SelectValue placeholder="Select Method" />
                       </SelectTrigger>
                       <SelectContent className="rounded-xl">
                          <SelectItem value="Cash">Cash</SelectItem>
                          <SelectItem value="Bank">Bank Transfer</SelectItem>
                          <SelectItem value="UPI">GPay / UPI</SelectItem>
                          <SelectItem value="Petty Cash">Petty Cash</SelectItem>
                       </SelectContent>
                    </Select>
                 </div>

                 <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Transaction Date</Label>
                    <Popover>
                       <PopoverTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="w-full h-12 rounded-xl border-slate-200 bg-slate-50/50 font-bold text-sm justify-start px-4"
                          >
                             <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                             {date ? format(date, "PPP") : <span>Pick a date</span>}
                          </Button>
                       </PopoverTrigger>
                       <PopoverContent className="w-auto p-0 rounded-2xl border-none shadow-2xl overflow-hidden" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={date}
                            onSelect={(d) => d && setDate(d)}
                            initialFocus
                          />
                       </PopoverContent>
                    </Popover>
                 </div>

                 <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ref ID / Voucher</Label>
                    <Input 
                      value={refId}
                      onChange={(e) => setRefId(e.target.value)}
                      placeholder="Optional receipt #" 
                      className="h-12 rounded-xl border-slate-200 bg-slate-50/50 font-bold text-sm" 
                    />
                 </div>
              </div>

              {/* Tax Management */}
              <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-200 space-y-6">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <Receipt className="w-4 h-4 text-slate-400" />
                       <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Tax Management (GST)</h4>
                    </div>
                    <div className="flex items-center gap-2">
                       <Label htmlFor="gst" className="text-[10px] font-black uppercase tracking-widest cursor-pointer">Calculate GST</Label>
                       <Switch id="gst" checked={gstEnabled} onCheckedChange={setGstEnabled} className="scale-75 data-[state=checked]:bg-primary" />
                    </div>
                 </div>

                 {gstEnabled && (
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200 animate-in fade-in slide-in-from-top-2 duration-300">
                       <div className="space-y-1">
                          <p className="text-[9px] font-black uppercase text-slate-400">Base Amount</p>
                          <p className="text-sm font-black text-slate-700 tabular-nums">{fmt(baseAmount)}</p>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[9px] font-black uppercase text-slate-400">GST Rate</p>
                          <Select value={gstRate} onValueChange={setGstRate}>
                             <SelectTrigger className="h-7 border-none bg-white p-0 px-2 rounded-md font-bold text-xs w-20">
                                <SelectValue />
                             </SelectTrigger>
                             <SelectContent className="rounded-lg">
                                <SelectItem value="5">5%</SelectItem>
                                <SelectItem value="12">12%</SelectItem>
                                <SelectItem value="18">18%</SelectItem>
                             </SelectContent>
                          </Select>
                       </div>
                       <div className="space-y-1 text-right">
                          <p className="text-[9px] font-black uppercase text-slate-400">GST Amount</p>
                          <p className="text-sm font-black text-primary tabular-nums">{fmt(gstAmount)}</p>
                       </div>
                    </div>
                 )}
              </div>

              {/* Proof & Notes */}
              <div className="grid grid-cols-2 gap-8">
                 <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Upload Receipt Proof</Label>
                    <div className="h-24 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-colors cursor-pointer group bg-slate-50/50">
                       <Upload className="w-6 h-6 text-slate-300 group-hover:text-primary transition-colors" />
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Drop receipt here</span>
                    </div>
                 </div>
                 <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Internal Auditor Notes</Label>
                    <Textarea 
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Approved by CEO..." 
                      className="min-h-[96px] rounded-2xl border-slate-200 bg-slate-50/50 font-bold text-xs" 
                    />
                 </div>
              </div>
           </div>

           {/* Modal Footer */}
           <div className="p-6 bg-muted/5 border-t border-border/50 flex items-center justify-between">
              <Button type="reset" variant="ghost" className="rounded-xl font-black text-[10px] uppercase tracking-widest h-11 px-8">Clear Form</Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className={cn(
                  "rounded-xl text-white font-black text-[10px] uppercase tracking-widest h-11 px-10 shadow-2xl transition-all",
                  isDark ? "bg-rose-600 hover:bg-rose-700 shadow-rose-200" : "bg-primary hover:bg-primary/90 shadow-primary/20"
                )}
              >
                {isSubmitting ? "Posting..." : "Post Transaction to Ledger"}
              </Button>
           </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// ─── Main Page ───────────────────────────────────────────────────────────────

const Transactions = () => {
  const [searchParams] = useSearchParams();
  const highlightedId = searchParams.get("highlight");

  const [transactions, setTransactions] = useState(transactionsList);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedTxn, setSelectedTxn] = useState<any | null>(null);
  const [exportPreviewOpen, setExportPreviewOpen] = useState(false);
  const [newTxnOpen, setNewTxnOpen] = useState(false);

  const filteredData = useMemo(() => {
    return transactions.filter(txn => {
      const q = search.toLowerCase();
      const matchesSearch = txn.id.toLowerCase().includes(q) || 
                           txn.party.toLowerCase().includes(q) || 
                           txn.gatewayRef.toLowerCase().includes(q);
      const matchesType = filterType === "all" || txn.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [search, filterType, transactions]);

  return (
    <FinanceLayout>
      <div className="animate-fade-in space-y-8 max-w-7xl mx-auto pb-20">
        
        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1.5">
            <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-foreground leading-none">
              Transactions
            </h1>
            <p className="text-sm font-medium text-muted-foreground max-w-md">
              Unified ledger of every individual money movement across all gateways and accounts.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              onClick={() => setExportPreviewOpen(true)}
              className="h-12 rounded-2xl font-black text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-muted/50"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button 
              onClick={() => setNewTxnOpen(true)}
              className="h-12 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-[10px] uppercase tracking-widest px-8 shadow-2xl shadow-primary/20"
            >
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

      <TransactionDetailDialog 
        transaction={selectedTxn} 
        onClose={() => setSelectedTxn(null)} 
      />

      <ExportPreviewDialog 
        open={exportPreviewOpen} 
        onOpenChange={setExportPreviewOpen} 
        data={filteredData} 
      />

      <NewTransactionDialog
        open={newTxnOpen}
        onOpenChange={setNewTxnOpen}
        onSuccess={(txn) => setTransactions(prev => [txn, ...prev])}
      />
    </FinanceLayout>
  );
};

export default Transactions;
