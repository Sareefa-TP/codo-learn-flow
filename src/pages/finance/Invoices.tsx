import { useState, useMemo } from "react";
import FinanceLayout from "@/components/finance/FinanceLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  ScrollText,
  FileText,
  Download,
  Mail,
  MoreVertical,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  Eye,
  ChevronDown,
  Check,
  Building,
  User,
  CreditCard,
  Percent,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// ─── Types & Mock Data ────────────────────────────────────────────────────────

interface Invoice {
  id: string;
  number: string;
  student: { name: string; id: string };
  course: string;
  amount: number;
  tax: number;
  total: number;
  date: string;
  dueDate: string;
  status: "Paid" | "Overdue" | "Sent" | "Draft";
  isGstEnabled: boolean;
  type: "Tax Invoice" | "Pro-forma";
}

const mockInvoices: Invoice[] = [
  { id: "1", number: "INV-2026-001", student: { name: "Aarav Sharma", id: "STU-881" }, course: "Full Stack Pro", amount: 18000, tax: 3240, total: 21240, date: "24 Apr 2026", dueDate: "01 May 2026", status: "Paid", isGstEnabled: true, type: "Tax Invoice" },
  { id: "2", number: "PRO-2026-042", student: { name: "Meera Reddy", id: "STU-102" }, course: "Full Stack Bundle", amount: 45000, tax: 0, total: 45000, date: "24 Apr 2026", dueDate: "28 Apr 2026", status: "Sent", isGstEnabled: false, type: "Pro-forma" },
  { id: "3", number: "INV-2026-003", student: { name: "John Doe", id: "STU-441" }, course: "Python Backend", amount: 15000, tax: 2700, total: 17700, date: "23 Apr 2026", dueDate: "30 Apr 2026", status: "Overdue", isGstEnabled: true, type: "Tax Invoice" },
  { id: "4", number: "INV-2026-004", student: { name: "Sarah Miller", id: "STU-223" }, course: "Data Science", amount: 25000, tax: 4500, total: 29500, date: "22 Apr 2026", dueDate: "29 Apr 2026", status: "Paid", isGstEnabled: true, type: "Tax Invoice" },
];

const statusColors = {
  Paid: "bg-emerald-50 text-emerald-600 border-emerald-200",
  Overdue: "bg-rose-50 text-rose-600 border-rose-200",
  Sent: "bg-blue-50 text-blue-600 border-blue-200",
  Draft: "bg-slate-50 text-slate-600 border-slate-200",
};

// ─── Create Invoice Modal ────────────────────────────────────────────────

interface CreateInvoiceProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateInvoiceDialog = ({ open, onOpenChange }: CreateInvoiceProps) => {
  const [isGst, setIsGst] = useState(true);
  const [baseAmount, setBaseAmount] = useState<string>("0");
  const [discount, setDiscount] = useState<string>("0");
  const [isGenerating, setIsGenerating] = useState(false);

  const subtotal = Math.max(0, parseFloat(baseAmount || "0") - parseFloat(discount || "0"));
  const gstAmount = isGst ? subtotal * 0.18 : 0;
  const totalAmount = subtotal + gstAmount;

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      onOpenChange(false);
      toast.success("Invoice Generated", {
        description: "The tax invoice has been generated and emailed to the student."
      });
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[950px] max-w-[950px] rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl bg-[#FDFCF8] max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-8 border-b border-slate-100 bg-white/50 flex items-center justify-between flex-shrink-0">
          <div className="space-y-1">
            <DialogTitle className="text-3xl font-black tracking-tighter text-slate-900 leading-none font-serif">
               Generate New Billing Entry
            </DialogTitle>
            <p className="text-sm font-medium text-muted-foreground">
               Create tax-compliant invoices or pro-forma billing for students.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-sm">
             <div className="space-y-0.5">
                <Label className="text-[9px] font-black uppercase tracking-widest text-slate-500">GST Registration</Label>
                <p className="text-[10px] font-bold text-slate-900">{isGst ? "Registered (18%)" : "Non-GST"}</p>
             </div>
             <Switch 
               checked={isGst} 
               onCheckedChange={setIsGst}
               className="data-[state=checked]:bg-[#1A4D3E]"
             />
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
           <div className="grid grid-cols-12 gap-12">
              {/* Left Column: Entity Details */}
              <div className="col-span-6 space-y-8">
                 <div className="space-y-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Section 1: Entity Details</p>
                    
                    <div className="space-y-2">
                       <Label className="text-[11px] font-black uppercase text-slate-500">Select Student</Label>
                       <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <select className="w-full h-12 pl-12 pr-4 rounded-2xl border-slate-200 bg-white font-bold text-xs appearance-none outline-none shadow-sm focus:ring-2 focus:ring-[#1A4D3E]/10">
                             <option>Search student name...</option>
                             <option>Aarav Sharma (STU-881)</option>
                             <option>Meera Reddy (STU-102)</option>
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <Label className="text-[11px] font-black uppercase text-slate-500">Billing Address</Label>
                       <Textarea 
                         placeholder="Full address of the recipient..."
                         className="min-h-[100px] rounded-2xl border-slate-200 bg-white shadow-sm focus:ring-[#1A4D3E]/10 resize-none font-bold text-xs p-4"
                       />
                    </div>

                    <div className="space-y-2">
                       <Label className="text-[11px] font-black uppercase text-slate-500">Place of Supply</Label>
                       <div className="relative">
                          <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <select className="w-full h-12 pl-12 pr-4 rounded-2xl border-slate-200 bg-white font-bold text-xs appearance-none outline-none shadow-sm focus:ring-2 focus:ring-[#1A4D3E]/10">
                             <option>Karnataka (State Code: 29)</option>
                             <option>Maharashtra (State Code: 27)</option>
                             <option>Delhi (State Code: 07)</option>
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                       </div>
                    </div>
                 </div>
              </div>

              {/* Right Column: Itemization */}
              <div className="col-span-6 space-y-8">
                 <div className="space-y-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Section 2: Itemization</p>
                    
                    <div className="space-y-2">
                       <Label className="text-[11px] font-black uppercase text-slate-500">Course / Item</Label>
                       <div className="relative">
                          <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <select className="w-full h-12 pl-12 pr-4 rounded-2xl border-slate-200 bg-white font-bold text-xs appearance-none outline-none shadow-sm focus:ring-2 focus:ring-[#1A4D3E]/10">
                             <option>Select course bundle...</option>
                             <option>Full Stack Pro Mastery</option>
                             <option>Python Backend Development</option>
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <Label className="text-[11px] font-black uppercase text-slate-500">Base Amount (₹)</Label>
                          <Input 
                            type="number"
                            value={baseAmount}
                            onChange={(e) => setBaseAmount(e.target.value)}
                            className="h-12 rounded-2xl border-slate-200 bg-white font-black text-xs px-4"
                          />
                       </div>
                       <div className="space-y-2">
                          <Label className="text-[11px] font-black uppercase text-slate-500">Discount (₹)</Label>
                          <div className="relative">
                             <Percent className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                             <Input 
                               type="number"
                               value={discount}
                               onChange={(e) => setDiscount(e.target.value)}
                               className="h-12 pl-12 rounded-2xl border-slate-200 bg-white font-black text-xs px-4"
                             />
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Calculation Summary */}
                 <div className="pt-8 border-t border-slate-100">
                    <div className="bg-slate-50/50 rounded-[2.5rem] p-8 space-y-4 border border-slate-100">
                       <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                          <span>Subtotal</span>
                          <span>₹{subtotal.toLocaleString()}</span>
                       </div>
                       <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                          <span>GST (18%)</span>
                          <span>₹{gstAmount.toLocaleString()}</span>
                       </div>
                       <div className="pt-4 border-t border-slate-200 flex justify-between items-end">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Invoice Value</span>
                          <span className="text-4xl font-black tracking-tighter text-[#1A4D3E] tabular-nums leading-none">
                             ₹{totalAmount.toLocaleString()}
                          </span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-slate-100 bg-white sticky bottom-0 flex items-center justify-between flex-shrink-0 z-10">
           <button 
             type="button"
             onClick={() => onOpenChange(false)}
             className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600 transition-colors"
           >
              Save as Draft
           </button>
           <div className="flex items-center gap-4">
              <button 
                onClick={() => onOpenChange(false)}
                className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600"
              >
                 Cancel
              </button>
              <Button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="h-14 px-10 rounded-2xl bg-[#1A4D3E] hover:bg-[#1A4D3E]/90 text-white font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-emerald-100"
              >
                 {isGenerating ? "Generating Invoice..." : "Generate & Email Invoice"}
              </Button>
           </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ─── Component ───────────────────────────────────────────────────────────────

const Invoices = () => {
  const [globalGst, setGlobalGst] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <FinanceLayout>
      <div className="animate-fade-in space-y-8 max-w-[1440px] mx-auto pb-20">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
              <ScrollText className="w-8 h-8 text-primary" />
              Invoices & Billing
            </h1>
            <p className="text-sm font-medium text-muted-foreground">
              Manage tax invoices, pro-forma billing and automated reminders.
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 bg-muted/20 px-4 py-2 rounded-2xl border border-border/40">
               <ShieldCheck className={cn("w-5 h-5", globalGst ? "text-primary" : "text-muted-foreground")} />
               <div className="space-y-0.5">
                  <Label htmlFor="gst-mode" className="text-[10px] font-black uppercase tracking-widest leading-none">GST Mode</Label>
                  <p className="text-[9px] font-medium text-muted-foreground">{globalGst ? "Enabled (18%)" : "Disabled (0%)"}</p>
               </div>
               <Switch 
                  id="gst-mode" 
                  checked={globalGst} 
                  onCheckedChange={setGlobalGst}
                  className="data-[state=checked]:bg-primary"
               />
            </div>
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="h-11 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-widest px-6 shadow-xl shadow-primary/20"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Invoice
            </Button>
          </div>
        </div>

        {/* Invoice Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="rounded-[2rem] border-border/60 bg-card shadow-sm p-8">
            <div className="flex items-center justify-between mb-4">
               <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total Outstanding</p>
               <AlertCircle className="w-5 h-5 text-rose-600" />
            </div>
            <h2 className="text-3xl font-black tracking-tight text-rose-600">₹4.20L</h2>
            <p className="text-xs font-medium text-muted-foreground mt-2">Across 24 overdue invoices.</p>
          </Card>
          
          <Card className="rounded-[2rem] border-border/60 bg-card shadow-sm p-8">
            <div className="flex items-center justify-between mb-4">
               <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Collection Target</p>
               <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-3xl font-black tracking-tight">84.2%</h2>
            <Progress value={84} className="h-2 bg-emerald-50 mt-4" />
          </Card>

          <Card className="rounded-[2rem] border-border/60 bg-card shadow-sm p-8">
            <div className="flex items-center justify-between mb-4">
               <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Automated Reminders</p>
               <Mail className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-3xl font-black tracking-tight">Active</h2>
            <p className="text-xs font-medium text-muted-foreground mt-2">12 emails sent in the last 24h.</p>
          </Card>
        </div>

        {/* Invoice Management */}
        <Card className="rounded-[2rem] border-border/60 bg-card shadow-sm overflow-hidden">
          <CardHeader className="p-8 border-b border-border/40 bg-muted/5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-1">
                <CardTitle className="text-xl font-black tracking-tight text-foreground">Invoice Ledger</CardTitle>
                <CardDescription className="text-xs font-medium uppercase tracking-wider">Search and manage student billing history</CardDescription>
              </div>
              <div className="flex items-center gap-3">
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search invoice number..." className="h-10 w-64 rounded-xl border-border/60 pl-10" />
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
                  <TableHead className="w-[180px] pl-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Invoice #</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Student & Course</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Amount</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Tax (GST)</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Date / Due</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Compliance</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</TableHead>
                  <TableHead className="pr-8 text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockInvoices.map((inv) => (
                  <TableRow key={inv.id} className="hover:bg-muted/5 transition-colors border-b border-border/40 last:border-0 group">
                    <TableCell className="pl-8 py-6">
                      <span className="text-sm font-black text-foreground group-hover:text-primary transition-colors">{inv.number}</span>
                      <p className="text-[10px] font-medium text-muted-foreground mt-0.5">{inv.type}</p>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-bold text-foreground">{inv.student.name}</p>
                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest truncate max-w-[150px]">{inv.course}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-black text-foreground">₹{inv.total.toLocaleString()}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium text-muted-foreground">₹{inv.tax.toLocaleString()}</span>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-xs font-bold text-foreground">{inv.date}</p>
                        <p className={cn(
                          "text-[10px] font-black uppercase tracking-widest mt-0.5",
                          inv.status === "Overdue" ? "text-rose-600" : "text-muted-foreground"
                        )}>Due: {inv.dueDate}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                         {inv.isGstEnabled ? (
                            <div className="flex items-center gap-1 text-[9px] font-black text-emerald-600 uppercase tracking-tighter">
                               <CheckCircle2 className="w-3 h-3" />
                               GST Reg.
                            </div>
                         ) : (
                            <div className="flex items-center gap-1 text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                               <Clock className="w-3 h-3" />
                               Non-GST
                            </div>
                         )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn("rounded-lg border font-black text-[9px] uppercase tracking-tighter px-2.5 py-0.5 shadow-none", statusColors[inv.status as keyof typeof statusColors])}>
                        {inv.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-8 text-right">
                       <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-primary/5 hover:text-primary">
                             <Download className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-primary/5 hover:text-primary">
                             <Mail className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-primary/5 hover:text-primary">
                             <Eye className="w-4 h-4" />
                          </Button>
                       </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
        <CreateInvoiceDialog 
          open={showCreateModal} 
          onOpenChange={setShowCreateModal} 
        />
      </div>
    </FinanceLayout>
  );
};

export default Invoices;
