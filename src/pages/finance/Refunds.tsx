import { useState, useMemo, useEffect } from "react";
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
  ChevronDown,
  Info,
  CreditCard,
  Building,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { refundsList, refundStats, transactionsList, RefundRow } from "@/data/financeMock";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

// ─── Helpers ────────────────────────────────────────────────────────────────

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

// ─── Refund Detail Drawer ────────────────────────────────────────────────────

interface DetailProps {
  refund: RefundRow | null;
  onClose: () => void;
  onStatusUpdate: (id: string, newStatus: RefundRow['status']) => void;
}

const RefundDetailDialog = ({ refund, onClose, onStatusUpdate }: DetailProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  
  if (!refund) return null;

  const isCompleted = refund.status === "Completed";
  const isRejected = refund.status === "Rejected";

  const handleAction = (status: RefundRow['status']) => {
    setIsProcessing(true);
    setTimeout(() => {
      onStatusUpdate(refund.id, status);
      setIsProcessing(false);
      onClose();
      toast.success(`Refund ${status}`, {
        description: `Reference ${refund.id} has been marked as ${status.toLowerCase()}.`
      });
    }, 1000);
  };

  return (
    <Dialog open={!!refund} onOpenChange={(open) => !open && onClose()}>
      <DialogContent size="md" variant="finance" className="p-0">
        <DialogHeader className="p-8 border-b bg-muted/5">
          <DialogTitle className="text-2xl font-black tracking-tight text-foreground">
            Refund Details
          </DialogTitle>
        </DialogHeader>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
          {/* Header Summary Section */}
          <div className={cn(
            "p-8 rounded-[2rem] border transition-colors duration-500 text-center space-y-2",
            isRejected ? "bg-slate-50 border-slate-200" : "bg-rose-50 border-rose-100"
          )}>
            <div className="flex justify-center gap-2 mb-4">
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
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Total Refund Amount</p>
            <h2 className="text-5xl font-black tracking-tighter tabular-nums text-rose-600">
               {fmt(refund.refundAmount)}
            </h2>
            <div className="flex items-center justify-center gap-2 mt-2">
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

          {/* Student Context */}
          <div className="space-y-4">
             <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Student & Context</p>
             <div className="p-6 rounded-[2rem] border border-border/60 bg-muted/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-lg">
                      {refund.student.charAt(0)}
                   </div>
                   <div>
                      <p className="text-base font-black text-slate-800">{refund.student}</p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">{refund.product}</p>
                   </div>
                </div>
                <div className="text-right">
                   <p className="text-[9px] font-bold text-muted-foreground uppercase">Original Pay</p>
                   <p className="text-sm font-black text-slate-700">{fmt(refund.originalAmount)}</p>
                </div>
             </div>
          </div>

          {/* Refund Details */}
          <div className="space-y-4">
             <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Refund Details</p>
                <Badge variant="secondary" className="rounded-full font-black text-[8px] uppercase px-2 py-0">
                   By {refund.requestedBy}
                </Badge>
             </div>
             <div className="p-6 rounded-[2rem] border border-border/60 bg-white space-y-4 shadow-sm">
                <div className="flex items-start gap-3">
                   <MessageSquare className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                   <p className="text-sm font-medium leading-relaxed text-slate-600">
                      {refund.note}
                   </p>
                </div>
             </div>
          </div>

          {/* Money Breakdown */}
          <div className="space-y-4">
             <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Settlement Breakdown</p>
             <div className="p-8 rounded-[2.5rem] border border-border/60 bg-slate-50/50 space-y-4">
                <div className="flex justify-between text-sm font-medium">
                   <span className="text-slate-500">Original Amount</span>
                   <span className="tabular-nums font-bold text-slate-700">{fmt(refund.originalAmount)}</span>
                </div>
                {refund.deductions.map((d: any, i: number) => (
                   <div key={i} className="flex justify-between text-sm font-medium">
                      <span className="text-slate-500">{d.label}</span>
                      <span className="text-rose-600 tabular-nums">−{fmt(d.amount)}</span>
                   </div>
                ))}
                <div className="pt-6 mt-4 border-t border-slate-200 flex justify-between items-end">
                   <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Net Refunded</span>
                   <span className="text-4xl font-black text-rose-600 tabular-nums leading-none">{fmt(refund.refundAmount)}</span>
                </div>
             </div>
          </div>

          {/* Approval Chain */}
          <div className="space-y-6">
             <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Approval Chain</p>
             <div className="relative pl-8 space-y-10 before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-[2px] before:bg-slate-100">
                <div className="relative">
                   <div className="absolute -left-[35px] top-1 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white shadow-sm" />
                   <p className="text-sm font-black text-slate-800">Requested</p>
                   <p className="text-[11px] font-medium text-slate-500">{refund.requestedOn} • {refund.requestedBy}</p>
                </div>
                <div className="relative">
                   <div className={cn(
                     "absolute -left-[35px] top-1 w-4 h-4 rounded-full border-4 border-white shadow-sm",
                     refund.status !== "Requested" ? "bg-emerald-500" : "bg-slate-200"
                   )} />
                   <p className={cn("text-sm font-black", refund.status === "Requested" ? "text-slate-400" : "text-slate-800")}>Finance Review</p>
                   {refund.status !== "Requested" && <p className="text-[11px] font-medium text-slate-500">Approved by Finance Team</p>}
                </div>
                <div className="relative">
                   <div className={cn(
                     "absolute -left-[35px] top-1 w-4 h-4 rounded-full border-4 border-white shadow-sm",
                     isCompleted ? "bg-emerald-500" : "bg-slate-200"
                   )} />
                   <p className={cn("text-sm font-black", !isCompleted ? "text-slate-400" : "text-slate-800")}>Gateway Processed</p>
                   {isCompleted && <p className="text-[11px] font-medium text-slate-500">Successfully settled via Razorpay</p>}
                </div>
             </div>
          </div>
        </div>

        <DialogFooter className="p-6 bg-muted/5 border-t border-border/50 flex items-center justify-center gap-3">
          {refund.status === "Requested" ? (
             <>
                <Button 
                  variant="ghost" 
                  disabled={isProcessing}
                  onClick={() => handleAction("Rejected")}
                  className="rounded-2xl font-black text-[10px] uppercase tracking-widest h-12 px-8 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                >
                   <XCircle className="w-4 h-4 mr-2" />
                   {isProcessing ? "Wait..." : "Reject Request"}
                </Button>
                <Button 
                  disabled={isProcessing}
                  onClick={() => handleAction("Approved")}
                  className="rounded-2xl bg-primary text-white font-black text-[10px] uppercase tracking-widest px-10 h-12 shadow-lg shadow-primary/20"
                >
                   <CheckCircle2 className="w-4 h-4 mr-2" />
                   {isProcessing ? "Processing..." : "Approve Refund"}
                </Button>
             </>
          ) : (
             <>
                <Button variant="outline" className="rounded-2xl font-black text-[10px] uppercase tracking-widest h-12 border-border/60 px-8">
                   <FileText className="w-4 h-4 mr-2" />
                   Credit Note
                </Button>
                <Button variant="outline" className="rounded-2xl font-black text-[10px] uppercase tracking-widest h-12 border-border/60 px-8">
                   <Wallet className="w-4 h-4 mr-2" />
                   Wallet Cr.
                </Button>
             </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ─── Initiate Refund Modal ──────────────────────────────────────────────────

interface NewRefundProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (newRefund: RefundRow) => void;
}

const InitiateRefundDialog = ({ open, onOpenChange, onSuccess }: NewRefundProps) => {
  const [selectedTxnId, setSelectedTxnId] = useState("");
  const [refundType, setRefundType] = useState<"full" | "partial">("full");
  const [refundAmount, setRefundAmount] = useState("");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [destination, setDestination] = useState("original");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Derived: Find selected transaction details
  const linkedTxn = useMemo(() => {
    return transactionsList.find(t => t.id === selectedTxnId);
  }, [selectedTxnId]);

  // Effect: Auto-fill amount if "Full" is selected
  useEffect(() => {
    if (refundType === "full" && linkedTxn) {
      setRefundAmount(linkedTxn.amount.toString());
    }
  }, [refundType, linkedTxn]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTxnId || !refundAmount || !reason) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API Call
    setTimeout(() => {
      const newRefund: RefundRow = {
        id: `RFD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        orderId: linkedTxn?.id || "ORD-MOCK",
        student: linkedTxn?.party || "Unknown Student",
        product: "Course Enrollment",
        refundAmount: parseFloat(refundAmount),
        originalAmount: linkedTxn?.amount || 0,
        status: "Requested",
        reason: reason.toUpperCase(),
        requestedOn: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        requestedBy: "Finance Admin",
        note: notes,
        deductions: refundType === "partial" ? [{ label: "Processing Fee", amount: (linkedTxn?.amount || 0) - parseFloat(refundAmount) }] : []
      };

      onSuccess(newRefund);
      setIsSubmitting(false);
      toast.success("Refund request initiated successfully");
      onOpenChange(false);
      
      // Reset
      setSelectedTxnId("");
      setRefundType("full");
      setRefundAmount("");
      setReason("");
      setNotes("");
    }, 1200);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="md" variant="finance" className="max-h-[85vh] flex flex-col">
        <DialogHeader className="p-8 pb-0 border-none bg-transparent">
          <DialogTitle className="text-3xl font-black tracking-tighter text-slate-900 leading-none font-serif">
             Initiate Refund Request
          </DialogTitle>
          <p className="text-sm font-medium text-rose-600/70">
             Transactions can only be refunded if the original status is 'Success'.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
             {/* Section 1: Search & Link */}
             <div className="mb-8 space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Section 1: Search & Link</p>
                <div className="space-y-4">
                   <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <select 
                        className="w-full h-12 pl-12 pr-4 rounded-2xl border-slate-200 bg-white font-bold text-xs appearance-none focus:ring-2 focus:ring-rose-500/20 outline-none transition-all shadow-sm"
                        value={selectedTxnId}
                        onChange={(e) => setSelectedTxnId(e.target.value)}
                        required
                      >
                         <option value="">Select Original Transaction/Order...</option>
                         {transactionsList.filter(t => t.status === "Success").map(t => (
                            <option key={t.id} value={t.id}>{t.id} — {t.party} ({fmt(t.amount)})</option>
                         ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                   </div>

                   {linkedTxn && (
                      <div className="p-6 rounded-[2rem] bg-white border border-rose-100 shadow-sm animate-in zoom-in-95 duration-300">
                         <div className="flex items-center justify-between">
                            <div className="space-y-1">
                               <p className="text-[9px] font-black uppercase text-slate-400">Linked Student</p>
                               <p className="text-sm font-black text-slate-800">{linkedTxn.party}</p>
                            </div>
                            <div className="text-right space-y-1">
                               <p className="text-[9px] font-black uppercase text-slate-400">Original Amount Paid</p>
                               <p className="text-xl font-black text-[#1A4D3E] tabular-nums">{fmt(linkedTxn.amount)}</p>
                            </div>
                         </div>
                      </div>
                   )}
                </div>
             </div>

             {/* Section 2: Refund Logic */}
             <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="space-y-3">
                   <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Refund Type</p>
                   <div className="flex p-1.5 bg-slate-100 rounded-2xl gap-1">
                      <button 
                        type="button"
                        onClick={() => setRefundType("full")}
                        className={cn("flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", refundType === "full" ? "bg-white shadow-sm text-slate-900" : "text-slate-400 hover:text-slate-600")}
                      >
                         Full Refund
                      </button>
                      <button 
                        type="button"
                        onClick={() => setRefundType("partial")}
                        className={cn("flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", refundType === "partial" ? "bg-white shadow-sm text-slate-900" : "text-slate-400 hover:text-slate-600")}
                      >
                         Partial
                      </button>
                   </div>
                </div>
                <div className="space-y-3">
                   <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Refund Amount (₹)</p>
                   <div className="relative">
                      <Input 
                        type="number" 
                        value={refundAmount}
                        onChange={(e) => setRefundAmount(e.target.value)}
                        readOnly={refundType === "full"}
                        className={cn("h-11 rounded-2xl border-slate-200 font-black text-sm shadow-inner", refundType === "full" ? "bg-slate-50 text-slate-400" : "bg-white")}
                        placeholder="0.00"
                        required
                      />
                   </div>
                </div>
             </div>

             {/* Section 3: Compliance */}
             <div className="mb-8 space-y-6">
                <div className="space-y-3">
                   <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Reason for Refund</p>
                   <div className="relative">
                     <select 
                       required
                       value={reason}
                       onChange={(e) => setReason(e.target.value)}
                       className="w-full h-11 px-4 rounded-2xl border-slate-200 bg-white font-bold text-xs focus:ring-2 focus:ring-rose-500/20 outline-none appearance-none shadow-sm"
                     >
                        <option value="">Select a reason...</option>
                        <option value="Course Cancellation">Course Cancellation</option>
                        <option value="Duplicate Payment">Duplicate Payment</option>
                        <option value="Quality Issue">Quality Issue</option>
                        <option value="Accidental Purchase">Accidental Purchase</option>
                     </select>
                     <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                   </div>
                </div>
                <div className="space-y-3">
                   <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Internal Audit Notes</p>
                   <Textarea 
                     value={notes}
                     onChange={(e) => setNotes(e.target.value)}
                     className="rounded-[1.5rem] border-slate-200 min-h-[100px] font-medium text-sm p-4 shadow-sm" 
                     placeholder="Document why this refund is being processed..." 
                   />
                </div>
             </div>

             {/* Section 4: Payout Destination */}
             <div className="mb-4 space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Payout Destination</p>
                <RadioGroup value={destination} onValueChange={setDestination} className="grid grid-cols-2 gap-4">
                   <Label 
                     className={cn(
                       "flex flex-col gap-3 p-5 rounded-[2rem] border-2 cursor-pointer transition-all",
                       destination === "original" ? "border-[#1A4D3E] bg-emerald-50/50" : "border-slate-100 bg-white hover:border-slate-200"
                     )}
                   >
                      <div className="flex items-center justify-between">
                         <CreditCard className={cn("w-5 h-5", destination === "original" ? "text-[#1A4D3E]" : "text-slate-400")} />
                         <RadioGroupItem value="original" className="border-[#1A4D3E] text-[#1A4D3E]" />
                      </div>
                      <div className="space-y-1">
                         <p className="text-xs font-black uppercase tracking-tight">Original Method</p>
                         <p className="text-[10px] font-medium text-slate-500">Refund back to Card/Netbanking</p>
                      </div>
                   </Label>
                   <Label 
                     className={cn(
                       "flex flex-col gap-3 p-5 rounded-[2rem] border-2 cursor-pointer transition-all",
                       destination === "wallet" ? "border-[#1A4D3E] bg-emerald-50/50" : "border-slate-100 bg-white hover:border-slate-200"
                     )}
                   >
                      <div className="flex items-center justify-between">
                         <Wallet className={cn("w-5 h-5", destination === "wallet" ? "text-[#1A4D3E]" : "text-slate-400")} />
                         <RadioGroupItem value="wallet" className="border-[#1A4D3E] text-[#1A4D3E]" />
                      </div>
                      <div className="space-y-1">
                         <p className="text-xs font-black uppercase tracking-tight">CODO Wallet Credits</p>
                         <p className="text-[10px] font-medium text-slate-500">Refund to student's internal wallet</p>
                      </div>
                   </Label>
                </RadioGroup>
             </div>
          </div>

          {/* Modal Footer */}
          <DialogFooter className="p-8 bg-muted/5 border-t border-border/40">
             <button 
               type="button"
               onClick={() => onOpenChange(false)}
               className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-slate-600 transition-colors"
             >
                Cancel
             </button>
             <Button 
               type="submit"
               disabled={isSubmitting}
               className="h-12 px-10 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-rose-200"
             >
                {isSubmitting ? "Processing..." : "Process Refund"}
             </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// ─── Export Refunds Modal ──────────────────────────────────────────────────

interface ExportProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: any[];
}

const ExportRefundsDialog = ({ open, onOpenChange, data }: ExportProps) => {
  const [format, setFormat] = useState("csv");
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    
    // Simulate real file generation
    setTimeout(() => {
      const fileName = `Refund_Ledger_${new Date().toISOString().split('T')[0]}.${format}`;
      const content = "ID,Student,Order,Reason,Amount,Status\n" + 
                     data.map(r => `${r.id},${r.student},${r.orderId},${r.reason},${r.refundAmount},${r.status}`).join("\n");
      
      const blob = new Blob([content], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsExporting(false);
      onOpenChange(false);
      toast.success(`${format.toUpperCase()} Ledger Downloaded`, {
        description: `Check your browser downloads for ${fileName}`,
      });
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg" variant="finance" className="p-0">
        <DialogHeader className="p-8 border-b bg-muted/5">
          <DialogTitle className="text-3xl font-black tracking-tighter text-slate-900 leading-none font-serif">
            Export Refund Ledger
          </DialogTitle>
          <p className="text-sm font-medium text-muted-foreground mt-1">
            Review records and select format before processing the download.
          </p>
        </DialogHeader>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {/* Export Summary */}
          <div className="grid grid-cols-2 gap-4 mb-8">
             <div className="p-6 rounded-[2rem] bg-white border border-slate-100 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Total Records</p>
                <p className="text-2xl font-black text-slate-900 tabular-nums">{data.length}</p>
             </div>
             <div className="p-6 rounded-[2rem] bg-white border border-slate-100 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Date Range</p>
                <p className="text-xs font-black text-slate-900 uppercase">Apr 01 — Apr 27, 2026</p>
             </div>
          </div>

          {/* Data Preview */}
          <div className="mb-8 space-y-4">
             <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Live Preview (Top 4 Records)</p>
             <div className="rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-sm">
                <Table>
                   <TableHeader className="bg-slate-50">
                      <TableRow>
                         <TableHead className="text-[9px] font-black uppercase tracking-widest">ID</TableHead>
                         <TableHead className="text-[9px] font-black uppercase tracking-widest">Student</TableHead>
                         <TableHead className="text-[9px] font-black uppercase tracking-widest text-right">Amount</TableHead>
                      </TableRow>
                   </TableHeader>
                   <TableBody>
                      {data.slice(0, 4).map((row) => (
                         <TableRow key={row.id}>
                            <TableCell className="text-[10px] font-mono font-bold text-slate-400">{row.id}</TableCell>
                            <TableCell className="text-xs font-black text-slate-800">{row.student}</TableCell>
                            <TableCell className="text-xs font-black text-rose-600 text-right">{fmt(row.refundAmount)}</TableCell>
                         </TableRow>
                      ))}
                   </TableBody>
                </Table>
             </div>
          </div>

          {/* Format Selection */}
          <div className="space-y-4">
             <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Export Format</p>
             <RadioGroup value={format} onValueChange={setFormat} className="grid grid-cols-2 gap-4">
                <Label 
                  className={cn(
                    "flex items-center justify-between p-5 rounded-2xl border-2 cursor-pointer transition-all",
                    format === "csv" ? "border-[#1A4D3E] bg-emerald-50/30" : "border-slate-100 bg-white hover:border-slate-200"
                  )}
                >
                   <div className="flex items-center gap-3">
                      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", format === "csv" ? "bg-[#1A4D3E]/10 text-[#1A4D3E]" : "bg-slate-50 text-slate-400")}>
                         <FileText className="w-5 h-5" />
                      </div>
                      <div>
                         <p className="text-xs font-black uppercase">CSV Ledger</p>
                         <p className="text-[9px] font-medium text-slate-500">Universal data format</p>
                      </div>
                   </div>
                   <RadioGroupItem value="csv" className="border-[#1A4D3E] text-[#1A4D3E]" />
                </Label>
                <Label 
                  className={cn(
                    "flex items-center justify-between p-5 rounded-2xl border-2 cursor-pointer transition-all",
                    format === "xlsx" ? "border-[#1A4D3E] bg-emerald-50/30" : "border-slate-100 bg-white hover:border-slate-200"
                  )}
                >
                   <div className="flex items-center gap-3">
                      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", format === "xlsx" ? "bg-[#1A4D3E]/10 text-[#1A4D3E]" : "bg-slate-50 text-slate-400")}>
                         <TrendingUp className="w-5 h-5" />
                      </div>
                      <div>
                         <p className="text-xs font-black uppercase">MS Excel</p>
                         <p className="text-[9px] font-medium text-slate-500">Optimized for reporting</p>
                      </div>
                   </div>
                   <RadioGroupItem value="xlsx" className="border-[#1A4D3E] text-[#1A4D3E]" />
                </Label>
             </RadioGroup>
          </div>
        </div>

        {/* Modal Footer */}
        <DialogFooter className="p-8 bg-muted/5 border-t border-border/40">
           <button 
             type="button"
             onClick={() => onOpenChange(false)}
             className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-slate-600"
           >
              Cancel
           </button>
           <Button 
             onClick={handleExport}
             disabled={isExporting}
             className="h-12 px-10 rounded-2xl bg-primary text-white font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-primary/20"
           >
              {isExporting ? "Processing..." : "Confirm & Download Ledger"}
           </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ─── Main Page ───────────────────────────────────────────────────────────────

const Refunds = () => {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedRefund, setSelectedRefund] = useState<RefundRow | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showInitiateModal, setShowInitiateModal] = useState(false);
  const [localRefunds, setLocalRefunds] = useState(refundsList);

  const filteredData = useMemo(() => {
    return localRefunds.filter(row => {
      const q = search.toLowerCase();
      const matchesSearch = row.student.toLowerCase().includes(q) || 
                           row.id.toLowerCase().includes(q) || 
                           row.orderId.toLowerCase().includes(q);
      const matchesStatus = filterStatus === "all" || row.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [search, filterStatus, localRefunds]);

  const handleStatusUpdate = (id: string, newStatus: RefundRow['status']) => {
    setLocalRefunds(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  const handleRefundSuccess = (newRefund: RefundRow) => {
    setLocalRefunds(prev => [newRefund, ...prev]);
  };

  return (
    <FinanceLayout>
      <div className="animate-fade-in space-y-8 max-w-7xl mx-auto pb-20">
        
        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1.5">
            <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-foreground leading-none">
              Refunds
            </h1>
            <p className="text-sm font-medium text-muted-foreground max-w-md">
              Process course cancellations, quality claims, and duplicate payment returns with policy checks.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              onClick={() => setShowExportModal(true)}
              className="h-12 rounded-2xl font-black text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-muted/50"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Refunds
            </Button>
            <Button 
              onClick={() => setShowInitiateModal(true)}
              className="h-12 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-[10px] uppercase tracking-widest px-8 shadow-2xl shadow-rose-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Refund
            </Button>
          </div>
        </div>

        {/* Export Refunds Modal */}
        <ExportRefundsDialog 
          open={showExportModal} 
          onOpenChange={setShowExportModal} 
          data={filteredData}
        />

        {/* Initiate Refund Modal */}
        <InitiateRefundDialog 
          open={showInitiateModal} 
          onOpenChange={setShowInitiateModal} 
          onSuccess={handleRefundSuccess}
        />

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

      <RefundDetailDialog 
        refund={selectedRefund} 
        onClose={() => setSelectedRefund(null)} 
        onStatusUpdate={handleStatusUpdate}
      />
    </FinanceLayout>
  );
};

export default Refunds;
