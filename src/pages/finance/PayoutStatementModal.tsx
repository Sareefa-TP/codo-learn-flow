import { useState, useMemo } from "react";
import { format } from "date-fns";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription 
} from "@/components/ui/dialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pill, Card } from "@/components/ui-kit";
import { 
  fmtINR, 
  PayoutRow, 
  payoutQueue 
} from "@/data/financeMock";
import { 
  Download, 
  Mail, 
  X, 
  CheckCircle2,
  ShieldAlert,
  FileText
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { FinanceDatePicker } from "@/components/finance/FinanceDatePicker";

interface PayoutStatementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paidRecords: Record<string, { utr: string }>;
}

const PayoutStatementModal = ({ open, onOpenChange, paidRecords }: PayoutStatementModalProps) => {
  // Filters
  const [fromDate, setFromDate] = useState<Date | undefined>(new Date("2026-04-01"));
  const [toDate, setToDate] = useState<Date | undefined>(new Date("2027-03-31"));
  const [roleFilter, setRoleFilter] = useState<"All" | "Tutor" | "Mentor">("All");
  const [statusFilter, setStatusFilter] = useState<"All" | "Paid" | "Awaiting">("All");
  
  // Email Sub-modal
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailAddress, setEmailAddress] = useState("accounts@codo.academy");

  // Filtered Data
  const filteredData = useMemo(() => {
    return payoutQueue.filter(row => {
      const isPaid = row.status === "Paid" || !!paidRecords[row.id];
      const status = isPaid ? "Paid" : "Awaiting";
      
      const matchesRole = roleFilter === "All" || row.role === roleFilter;
      const matchesStatus = statusFilter === "All" || status === statusFilter;
      
      // In a real app we'd parse fromDate/toDate and row.requestedOn
      return matchesRole && matchesStatus;
    });
  }, [roleFilter, statusFilter, paidRecords]);

  // KPIs
  const kpis = useMemo(() => {
    const totalCount = filteredData.length;
    const gross = filteredData.reduce((sum, r) => sum + r.requested, 0);
    const tds = filteredData.reduce((sum, r) => sum + r.tds, 0);
    const net = gross - tds;
    
    const tutors = filteredData.filter(r => r.role === "Tutor").length;
    const mentors = filteredData.filter(r => r.role === "Mentor").length;
    const paid = filteredData.filter(r => r.status === "Paid" || !!paidRecords[r.id]).length;
    const awaiting = totalCount - paid;

    return { totalCount, gross, tds, net, tutors, mentors, paid, awaiting };
  }, [filteredData, paidRecords]);

  // CSV Logic
  const handleCSV = () => {
    const headers = ["Payout ID", "Name", "Role", "Period", "Gross", "TDS", "Net", "Bank"];
    const rows = filteredData.map(r => [
      r.id,
      `"${r.name}"`,
      r.role,
      `"${r.period}"`,
      r.requested,
      r.tds,
      r.net,
      `"${r.bank.split(' · ')[0]}"`
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    const fromStr = fromDate ? format(fromDate, "yyyy-MM-dd") : "start";
    const toStr = toDate ? format(toDate, "yyyy-MM-dd") : "end";
    link.setAttribute("download", `payout-statement_${fromStr}_to_${toStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV Statement downloaded");
  };

  // PDF / Print Logic
  const handlePDF = () => {
     window.print();
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Statement emailed to ${emailAddress}`, {
      description: `Includes ${kpis.totalCount} records totaling ${fmtINR(kpis.net)}`
    });
    setShowEmailModal(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg" variant="finance" className="p-0 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-8 border-b border-border/40 bg-muted/5 shrink-0 relative">
          <div className="flex items-center gap-3 mb-4">
             <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-widest text-primary">Statement</div>
             <div className="px-3 py-1 rounded-full bg-muted/50 text-[10px] font-black uppercase tracking-widest text-muted-foreground">FY 2026–27</div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-3xl font-black tracking-tighter text-foreground font-serif">Payout Statement</DialogTitle>
              <DialogDescription className="text-sm font-medium text-muted-foreground mt-1">
                1 May 2026, 2:14 PM | Priya Iyer · FIN-014
              </DialogDescription>
            </div>
          </div>
          <button 
            onClick={() => onOpenChange(false)}
            className="absolute top-8 right-8 p-2 rounded-full hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Filter Strip */}
        <div className="px-8 py-4 bg-slate-50 border-b border-border/40 flex items-center gap-6 shrink-0 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] font-black uppercase text-muted-foreground/40 px-1">From</span>
            <FinanceDatePicker 
              date={fromDate}
              onSelect={setFromDate}
              className="w-36"
            />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] font-black uppercase text-muted-foreground/40 px-1">To</span>
            <FinanceDatePicker 
              date={toDate}
              onSelect={setToDate}
              className="w-36"
            />
          </div>
          
          <div className="h-4 w-px bg-border/40" />

          <div className="flex items-center gap-2 shrink-0">
             <span className="text-[10px] font-black uppercase text-muted-foreground/40">Role</span>
             <select 
               value={roleFilter} 
               onChange={(e: any) => setRoleFilter(e.target.value)}
               className="h-9 bg-white px-3 rounded-xl text-xs font-bold border-none shadow-soft focus:ring-0 outline-none cursor-pointer"
             >
               <option value="All">All Roles</option>
               <option value="Tutor">Tutors</option>
               <option value="Mentor">Mentors</option>
             </select>
          </div>

          <div className="flex items-center gap-2 shrink-0">
             <span className="text-[10px] font-black uppercase text-muted-foreground/40">Status</span>
             <select 
               value={statusFilter} 
               onChange={(e: any) => setStatusFilter(e.target.value)}
               className="h-9 bg-white px-3 rounded-xl text-xs font-bold border-none shadow-soft focus:ring-0 outline-none cursor-pointer"
             >
               <option value="All">All Status</option>
               <option value="Paid">Paid Only</option>
               <option value="Awaiting">Awaiting Only</option>
             </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
           {/* KPI Cards */}
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Kpi label="Total Payouts" value={kpis.totalCount} sub="Records" />
              <Kpi label="Gross" value={fmtINR(kpis.gross)} sub="Requested" />
              <Kpi label="TDS Deducted" value={fmtINR(kpis.tds)} sub="Amber Tone" tone="warning" />
              <Kpi label="Net Amount" value={fmtINR(kpis.net)} sub="Emerald Tone" tone="primary" />
           </div>

           {/* Breakdown Pills */}
           <div className="flex flex-wrap items-center gap-3">
              <BreakdownPill label="Tutors" count={kpis.tutors} />
              <BreakdownPill label="Mentors" count={kpis.mentors} />
              <BreakdownPill label="Paid" count={kpis.paid} icon={CheckCircle2} color="text-emerald-500" />
              <BreakdownPill label="Awaiting" count={kpis.awaiting} icon={ShieldAlert} color="text-amber-500" />
           </div>

           {/* Data Table */}
           <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 px-1">Statement Preview</p>
              <div className="rounded-2xl border border-border/40 overflow-hidden bg-card shadow-soft">
                <div className="max-h-[256px] overflow-y-auto custom-scrollbar">
                  <Table>
                    <TableHeader className="sticky top-0 bg-white/90 backdrop-blur-sm z-10 border-b border-border/40">
                      <TableRow className="hover:bg-transparent border-none">
                        <TableHead className="text-[9px] font-black uppercase tracking-widest pl-6 h-10">ID</TableHead>
                        <TableHead className="text-[9px] font-black uppercase tracking-widest h-10">Name</TableHead>
                        <TableHead className="text-[9px] font-black uppercase tracking-widest h-10">Period</TableHead>
                        <TableHead className="text-[9px] font-black uppercase tracking-widest text-right h-10">Net</TableHead>
                        <TableHead className="text-[9px] font-black uppercase tracking-widest pr-6 h-10">Status/UTR</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.length > 0 ? filteredData.map((row) => {
                        const isPaid = row.status === "Paid" || !!paidRecords[row.id];
                        const utr = paidRecords[row.id]?.utr || row.utr;
                        return (
                          <TableRow key={row.id} className="border-border/40 hover:bg-muted/10 transition-colors">
                            <TableCell className="pl-6 py-3 font-mono text-[10px] font-bold text-muted-foreground">{row.id}</TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="text-xs font-black text-foreground">{row.name}</span>
                                <span className="text-[9px] font-bold text-muted-foreground/40 uppercase leading-none mt-0.5">{row.bank.split(' · ')[0]}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-[11px] font-bold text-muted-foreground/60">{row.period}</TableCell>
                            <TableCell className="text-right tabular-nums text-sm font-black text-emerald-600">{fmtINR(row.net)}</TableCell>
                            <TableCell className="pr-6">
                              {isPaid ? (
                                <span className="font-mono text-[10px] font-bold text-primary tracking-tighter">{utr}</span>
                              ) : (
                                <Pill variant="warning" size="sm" className="px-2 py-0.5 border-none shadow-none text-[9px]">Awaiting</Pill>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      }) : (
                        <TableRow>
                          <TableCell colSpan={5} className="h-32 text-center text-muted-foreground/40 italic text-sm">
                            No records matching the current filters.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
           </div>
        </div>

        {/* Footer */}
        <DialogFooter className="p-8 border-t border-border/40 bg-muted/5 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-4">
           <Button 
             variant="ghost" 
             onClick={() => onOpenChange(false)}
             className="h-11 rounded-full px-8 text-xs font-black uppercase tracking-widest text-muted-foreground hover:bg-muted/80 w-full sm:w-auto order-last sm:order-first"
           >
             Close
           </Button>
           <div className="flex flex-wrap items-center justify-center gap-3 w-full sm:w-auto">
              <Button 
                variant="outline" 
                onClick={() => setShowEmailModal(true)}
                className="h-11 rounded-full px-5 text-[10px] font-black uppercase tracking-widest gap-2 border-border/40 hover:bg-card"
              >
                <Mail className="w-4 h-4" />
                Email to Accountant
              </Button>
              <Button 
                variant="outline" 
                onClick={handleCSV}
                className="h-11 rounded-full px-5 text-[10px] font-black uppercase tracking-widest gap-2 border-border/40 hover:bg-card"
              >
                <Download className="w-4 h-4" />
                Download CSV
              </Button>
              <Button 
                onClick={handlePDF}
                className="h-11 rounded-full px-8 bg-foreground text-background font-black text-[10px] uppercase tracking-widest gap-2 shadow-xl shadow-foreground/10 hover:bg-foreground/90"
              >
                <FileText className="w-4 h-4" />
                Download PDF
              </Button>
           </div>
        </DialogFooter>

        {/* Email Overlay */}
        {showEmailModal && (
          <div className="absolute inset-0 z-[60] bg-white/80 backdrop-blur-md animate-in fade-in duration-300 flex items-center justify-center p-8">
            <Card className="w-full max-w-md p-8 rounded-[2rem] border-none shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] bg-white space-y-6 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1.5 bg-primary" />
               
               <div className="space-y-1">
                 <h4 className="text-xl font-black tracking-tight text-foreground">Email Statement</h4>
                 <p className="text-xs font-medium text-muted-foreground">Send the current filtered view to your accounting team.</p>
               </div>
               
               <form onSubmit={handleSendEmail} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-1">Recipient Email</Label>
                    <Input 
                      type="email" 
                      required 
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      className="h-12 rounded-2xl bg-muted/30 border-none shadow-inner font-bold text-sm focus-visible:ring-primary/20"
                    />
                  </div>
                  <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-foreground leading-tight">Attachment: payout_statement.pdf</p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase mt-0.5">{kpis.totalCount} records • {fmtINR(kpis.net)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pt-4">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      onClick={() => setShowEmailModal(false)}
                      className="flex-1 h-12 rounded-2xl font-black text-[10px] uppercase tracking-widest text-muted-foreground"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1 h-12 rounded-2xl bg-primary text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20"
                    >
                      Send Statement
                    </Button>
                  </div>
               </form>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

const Kpi = ({ label, value, sub, tone }: any) => (
  <div className={cn(
    "p-5 rounded-2xl border bg-white flex flex-col gap-1 transition-all",
    tone === "warning" ? "border-amber-500/20 bg-amber-50/5" : 
    tone === "primary" ? "border-emerald-500/20 bg-emerald-50/5" : 
    "border-border/40"
  )}>
    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">{label}</p>
    <p className={cn(
      "text-2xl font-black tabular-nums tracking-tighter leading-none my-1",
      tone === "warning" ? "text-amber-600" :
      tone === "primary" ? "text-emerald-600" :
      "text-foreground"
    )}>{value}</p>
    <p className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-tight">{sub}</p>
  </div>
);

const BreakdownPill = ({ label, count, icon: Icon, color }: any) => (
  <div className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-border/40 bg-white shadow-soft transition-all hover:border-border/80">
    {Icon && <Icon className={cn("w-3.5 h-3.5", color || "text-muted-foreground/40")} />}
    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</span>
    <span className="text-xs font-black text-foreground tabular-nums">{count}</span>
  </div>
);

export default PayoutStatementModal;
