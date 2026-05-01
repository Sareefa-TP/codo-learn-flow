import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FinanceLayout, { FinanceGhostButton } from "@/components/finance/FinanceLayout";
import { Card, Pill } from "@/components/ui-kit";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  payoutQueue, 
  fmtINR, 
  PayoutRow 
} from "@/data/financeMock";
import { toast } from "sonner";
import { 
  CheckCircle2, 
  Building2, 
  Download, 
  Search, 
  ShieldCheck, 
  Calendar, 
  User, 
  Receipt, 
  Wallet,
  X,
  TrendingUp,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import PayoutStatementModal from "./PayoutStatementModal";

// ─── Local Data ──────────────────────────────────────────────────────────────

const adminApprovals: Record<string, { by: string; on: string }> = {
  "PAY-2026-0214": { by: "Admin · Karthik R", on: "25 Apr, 09:14" },
  "PAY-2026-0215": { by: "Admin · Sarah J", on: "25 Apr, 11:20" },
  "PAY-2026-0217": { by: "Admin · Karthik R", on: "26 Apr, 09:45" },
  "PAY-2026-0218": { by: "Admin · Michael B", on: "26 Apr, 16:30" },
  "PAY-2026-0219": { by: "Admin · Sarah J", on: "27 Apr, 10:15" },
  "PAY-2026-0220": { by: "Admin · Karthik R", on: "27 Apr, 12:00" },
};

// ─── Components ──────────────────────────────────────────────────────────────

const KpiCard = ({ label, value, tone = "default", count }: any) => {
  const borderClass = 
    tone === "warning" ? "border-amber-500/40" : 
    tone === "primary" ? "border-primary/30" : 
    "border-border";
  
  const valueClass = 
    tone === "primary" ? "text-primary" : 
    "text-foreground";

  return (
    <Card className={cn("rounded-2xl bg-card border shadow-soft p-4 transition-all hover:shadow-md", borderClass)}>
      <p className="uppercase tracking-wider text-[11px] font-bold text-muted-foreground">{label}</p>
      <div className="mt-1.5 flex items-baseline gap-2">
        <h3 className={cn("font-display text-2xl font-black", valueClass)}>{value}</h3>
        {count !== undefined && (
          <Pill variant="warning" size="sm" className="ml-2">{count}</Pill>
        )}
      </div>
    </Card>
  );
};

const DetailLine = ({ icon: Icon, label, value, isMono = false }: any) => (
  <div className="flex items-center justify-between py-2 border-b border-border/10 last:border-0">
    <div className="flex items-center gap-2">
      <Icon className="w-3.5 h-3.5 text-muted-foreground/60" />
      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{label}</span>
    </div>
    <span className={cn("text-xs font-bold text-foreground text-right", isMono && "font-mono")}>
      {value}
    </span>
  </div>
);

const Payouts = () => {
  const { payoutId } = useParams();
  const navigate = useNavigate();

  // Local State
  const [nameQuery, setNameQuery] = useState("");
  const [roleTab, setRoleTab] = useState<"all" | "Tutor" | "Mentor">("all");
  const [paidRecords, setPaidRecords] = useState<Record<string, { utr: string }>>({});
  const [confirm, setConfirm] = useState<PayoutRow | null>(null);
  const [showStatementModal, setShowStatementModal] = useState(false);

  // Derived State for Dialog
  const detail = useMemo(() => {
    if (!payoutId) return null;
    const payout = payoutQueue.find(p => p.id === payoutId);
    if (!payout) return null;
    
    // Determine section based on status/paidRecords
    const isPaid = payout.status === "Paid" || paidRecords[payout.id];
    return { ...payout, _section: (isPaid ? "paid" : "ready") as "paid" | "ready" };
  }, [payoutId, paidRecords]);

  // Derived State for Table
  const filteredRows = useMemo(() => {
    return payoutQueue.filter(row => {
      const matchesName = row.name.toLowerCase().includes(nameQuery.toLowerCase());
      const matchesRole = roleTab === "all" || row.role === roleTab;
      return matchesName && matchesRole;
    });
  }, [nameQuery, roleTab]);

  const ready = useMemo(() => {
    return filteredRows.filter(row => row.status !== "Paid" && !paidRecords[row.id]);
  }, [filteredRows, paidRecords]);

  const paid = useMemo(() => {
    return filteredRows.filter(row => row.status === "Paid" || paidRecords[row.id]);
  }, [filteredRows, paidRecords]);

  const kpis = useMemo(() => {
    const totalRequested = ready.reduce((sum, r) => sum + r.requested, 0);
    const totalTds = ready.reduce((sum, r) => sum + r.tds, 0);
    const totalNet = ready.reduce((sum, r) => sum + r.net, 0);
    return {
      count: ready.length,
      requested: totalRequested,
      tds: totalTds,
      net: totalNet
    };
  }, [ready]);

  // Handlers
  const handleMarkAsPaid = (payout: PayoutRow) => {
    const utr = `UTR${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 90 + 10)}`;
    setPaidRecords(prev => ({ ...prev, [payout.id]: { utr } }));
    toast.success(`Payout ${payout.id} marked as paid`, {
      description: `UTR generated: ${utr}`
    });
    setConfirm(null);
    navigate("/finance/payouts");
  };

  const openDetail = (id: string) => {
    navigate(`/finance/payouts/${id}`);
  };

  const closeDetail = () => {
    navigate("/finance/payouts");
  };

  return (
    <FinanceLayout
      eyebrow="Module 06"
      title="Payouts"
      subtitle="Disburse Admin-approved payouts to tutors and mentors. TDS already deducted as per policy."
      action={
        <FinanceGhostButton 
          icon={Download} 
          onClick={() => setShowStatementModal(true)}
        >
          Payout statement
        </FinanceGhostButton>
      }
    >
      <div className="space-y-8 animate-fade-in">
        
        {/* 1. KPI STRIP */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiCard 
            label="Approved · awaiting payment" 
            value={kpis.count} 
            tone="warning" 
            count={kpis.count}
          />
          <KpiCard 
            label="Total requested" 
            value={fmtINR(kpis.requested)} 
          />
          <KpiCard 
            label="TDS deducted" 
            value={fmtINR(kpis.tds)} 
          />
          <KpiCard 
            label="Net to disburse" 
            value={fmtINR(kpis.net)} 
            tone="primary" 
          />
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* 2. SEARCH BAR */}
          <div className="relative max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
            <Input 
              value={nameQuery}
              onChange={(e) => setNameQuery(e.target.value)}
              placeholder="Search by name..."
              className="h-11 pl-11 pr-12 rounded-full bg-card border shadow-soft focus:ring-primary/20"
            />
            {nameQuery && (
              <button 
                onClick={() => setNameQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            )}
          </div>

          {/* 3. ROLE TABS */}
          <div className="inline-flex p-1 rounded-full bg-muted/50 border">
            {(["all", "Tutor", "Mentor"] as const).map((role) => {
              const isActive = roleTab === role;
              const count = role === "all" 
                ? payoutQueue.length 
                : payoutQueue.filter(r => r.role === role).length;
              
              return (
                <button
                  key={role}
                  onClick={() => setRoleTab(role)}
                  className={cn(
                    "flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all",
                    isActive 
                      ? "bg-card text-foreground shadow-soft" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span className="capitalize">{role}</span>
                  <Pill 
                    variant={isActive ? "primary" : "default"} 
                    size="sm"
                    className="px-1.5 py-0 border-none shadow-none"
                  >
                    {count}
                  </Pill>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. MAIN TABLE */}
        <Card className="rounded-2xl border-none shadow-soft overflow-hidden bg-card">
          <div className="px-6 py-5 border-b border-border/40 flex items-center justify-between bg-muted/5">
            <div>
              <h3 className="text-lg font-black tracking-tight font-serif">Approved by Admin — Ready to Pay</h3>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">{ready.length} awaiting disbursement</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border/40">
                  <TableHead className="text-[10px] font-black uppercase tracking-widest pl-6">Request</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">Name</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">Period</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-right">Requested</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-right">TDS</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-right">Net payable</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">Bank</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">Approved by</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-right pr-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ready.length > 0 ? ready.map((row) => (
                  <TableRow 
                    key={row.id} 
                    className="cursor-pointer hover:bg-muted/40 transition-colors border-border/40 group"
                    onClick={() => openDetail(row.id)}
                  >
                    <TableCell className="pl-6 py-4">
                      <p className="font-mono text-[11px] font-bold text-foreground">{row.id}</p>
                      <p className="text-[10px] font-medium text-muted-foreground/60 mt-0.5 uppercase">Req: {row.requestedOn}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-foreground">{row.name}</span>
                          <Pill variant="soft" size="sm">{row.role}</Pill>
                        </div>
                        <p className="text-[10px] font-bold text-muted-foreground/40 leading-tight">{row.batches}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-bold text-muted-foreground/80">{row.period}</TableCell>
                    <TableCell className="text-right tabular-nums text-xs font-bold">{fmtINR(row.requested)}</TableCell>
                    <TableCell className="text-right tabular-nums text-xs font-bold text-rose-500/80">−{fmtINR(row.tds)}</TableCell>
                    <TableCell className="text-right tabular-nums text-sm font-black text-primary">{fmtINR(row.net)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Building2 className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-bold uppercase tracking-tight">{row.bank.split(' · ')[0]}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5 text-emerald-600">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-black uppercase tracking-tight">
                            {adminApprovals[row.id]?.by.split(' · ')[1]}
                          </span>
                        </div>
                        <p className="text-[9px] font-bold text-muted-foreground/40 ml-5 uppercase">{adminApprovals[row.id]?.on}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirm(row);
                        }}
                        className="h-8 rounded-full bg-primary hover:bg-primary/90 text-white font-black text-[9px] uppercase tracking-widest gap-2 shadow-soft px-4"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        Mark as paid
                      </Button>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={9} className="h-32 text-center text-muted-foreground/40 italic text-sm">
                      No payouts awaiting disbursement.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* 5. RECENTLY PAID TABLE */}
        <Card className="rounded-2xl border-none shadow-soft overflow-hidden bg-card">
          <div className="px-6 py-5 border-b border-border/40 flex items-center justify-between bg-muted/5">
            <div>
              <h3 className="text-lg font-black tracking-tight font-serif text-muted-foreground">Recently paid</h3>
              <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mt-0.5">{paid.length} disbursed</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border/40">
                  <TableHead className="text-[10px] font-black uppercase tracking-widest pl-6">Request</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">Name</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">Period</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-right">Net paid</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">Bank</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest pr-6">UTR</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paid.length > 0 ? paid.map((row) => {
                  const paidInfo = paidRecords[row.id] || { utr: row.utr };
                  return (
                    <TableRow 
                      key={row.id} 
                      className="cursor-pointer hover:bg-muted/40 transition-colors border-border/40"
                      onClick={() => openDetail(row.id)}
                    >
                      <TableCell className="pl-6 py-4">
                        <p className="font-mono text-[11px] font-bold text-muted-foreground">{row.id}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-muted-foreground">{row.name}</span>
                          <Pill variant="default" size="sm">{row.role}</Pill>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs font-bold text-muted-foreground/60">{row.period}</TableCell>
                      <TableCell className="text-right tabular-nums text-sm font-black text-emerald-600">{fmtINR(row.net)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-muted-foreground/60">
                          <Building2 className="w-3.5 h-3.5" />
                          <span className="text-[11px] font-bold uppercase tracking-tight">{row.bank.split(' · ')[0]}</span>
                        </div>
                      </TableCell>
                      <TableCell className="pr-6">
                        <p className="font-mono text-[11px] font-bold text-primary tracking-tighter">{paidInfo.utr}</p>
                      </TableCell>
                    </TableRow>
                  );
                }) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground/40 italic text-sm">
                      No payouts disbursed yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* 6. FOOTER NOTE */}
        <p className="italic text-[11px] text-muted-foreground/50 text-center max-w-2xl mx-auto leading-relaxed">
          Approval is handled by Admin. Finance only disburses approved payouts. <br />
          Tiers: &lt; ₹50k single approval · ₹50k–₹1L dual approval · &gt; ₹1L Super Admin.
        </p>

        {/* ─── Detail Dialog ─── */}
        <Dialog open={!!detail} onOpenChange={(open) => !open && closeDetail()}>
          <DialogContent 
            size="md"
            variant="finance"
            className="p-0 max-h-[85vh] flex flex-col"
            onPointerDownOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
          >
            {detail && (
              <>
                <div className="p-8 border-b border-border/40 bg-muted/5">
                  <div className="flex items-center gap-3 mb-4">
                    <Pill variant="primary">{detail.role}</Pill>
                    <Pill variant={detail._section === "ready" ? "warning" : "success"}>
                      {detail._section === "ready" ? "Ready to pay" : "Paid"}
                    </Pill>
                  </div>
                  <DialogTitle className="font-display text-2xl font-black tracking-tight text-foreground">{detail.name}</DialogTitle>
                  <DialogDescription className="font-mono text-[10px] font-bold text-muted-foreground mt-1 tracking-widest">
                    {detail.id}
                  </DialogDescription>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                  {/* A) Amount breakdown */}
                  <div className="rounded-2xl border bg-muted/30 p-5 space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                      <span>Requested gross</span>
                      <span className="tabular-nums">{fmtINR(detail.requested)}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                      <span>Available balance</span>
                      <span className="tabular-nums">{fmtINR(detail.available)}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-rose-500/80">
                      <span>TDS deducted (10%)</span>
                      <span className="tabular-nums">−{fmtINR(detail.tds)}</span>
                    </div>
                    <div className="pt-3 border-t border-border/40 flex justify-between items-center">
                      <span className="text-[11px] font-black uppercase tracking-widest text-foreground">Net payable</span>
                      <span className="text-xl font-black tabular-nums text-primary">{fmtINR(detail.net)}</span>
                    </div>
                  </div>

                  {/* B) Two-column grid */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 px-1">Request Panel</p>
                      <div className="rounded-2xl border bg-muted/30 p-4 space-y-1">
                        <DetailLine icon={User} label="Name" value={detail.name} />
                        <DetailLine icon={Calendar} label="Period" value={detail.period} />
                        <DetailLine icon={Receipt} label="Batches" value={detail.batches} />
                        <DetailLine icon={Clock} label="Requested" value={detail.requestedOn} />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 px-1">Bank & UTR Panel</p>
                      <div className="rounded-2xl border bg-muted/30 p-4 space-y-1">
                        <DetailLine icon={Building2} label="Bank" value={detail.bank} />
                        {detail._section === "paid" && (
                          <DetailLine 
                            icon={Receipt} 
                            label="UTR" 
                            value={paidRecords[detail.id]?.utr || detail.utr} 
                            isMono 
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* C) Admin approval */}
                  <div className="rounded-2xl border bg-muted/30 p-5 space-y-3">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs font-black text-foreground">Approved by {adminApprovals[detail.id]?.by}</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">On {adminApprovals[detail.id]?.on}</p>
                      </div>
                    </div>
                  </div>

                  {/* D) Action */}
                  {detail._section === "ready" && (
                    <Button
                      onClick={() => setConfirm(detail)}
                      className="w-full h-11 rounded-full bg-primary hover:bg-primary/90 text-white font-black text-xs uppercase tracking-widest gap-2 shadow-xl shadow-primary/20 transition-all active:scale-95"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Mark as paid
                    </Button>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* ─── Confirm Dialog ─── */}
        <AlertDialog open={!!confirm} onOpenChange={(open) => !open && setConfirm(null)}>
          <AlertDialogContent variant="finance" className="sm:max-w-[400px] p-8">
            {confirm && (
              <>
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-display text-2xl font-black tracking-tight font-serif">Mark payout as paid?</AlertDialogTitle>
                  <AlertDialogDescription className="text-sm font-medium text-muted-foreground leading-relaxed mt-2">
                    You are about to mark as paid payout <span className="font-mono text-xs font-bold text-foreground bg-muted px-1.5 py-0.5 rounded">{confirm.id}</span> for <span className="font-bold text-foreground">{confirm.name}</span> ({confirm.role}). 
                    A UTR will be generated and the payout will move to Recently paid.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="my-6 rounded-xl bg-muted/40 p-3 text-xs space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Requested · TDS</span>
                    <span className="font-bold">{fmtINR(confirm.requested)} · {fmtINR(confirm.tds)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1.5 border-t border-border/10">
                    <span className="font-black uppercase tracking-widest text-foreground">Net payable</span>
                    <span className="text-base font-black text-primary">{fmtINR(confirm.net)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1.5 border-t border-border/10">
                    <span className="text-muted-foreground">Bank</span>
                    <span className="font-bold">{confirm.bank}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Approved by</span>
                    <span className="font-bold">{adminApprovals[confirm.id]?.by}</span>
                  </div>
                </div>

                <AlertDialogFooter className="gap-3">
                  <AlertDialogCancel className="h-11 rounded-full border-none bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground font-black text-[10px] uppercase tracking-widest px-8">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleMarkAsPaid(confirm)}
                    className="h-11 rounded-full bg-primary hover:bg-primary/90 text-white font-black text-[10px] uppercase tracking-widest px-8 shadow-lg shadow-primary/20"
                  >
                    Yes, mark as paid
                  </AlertDialogAction>
                </AlertDialogFooter>
              </>
            )}
          </AlertDialogContent>
        </AlertDialog>

        <PayoutStatementModal 
          open={showStatementModal} 
          onOpenChange={setShowStatementModal} 
          paidRecords={paidRecords}
        />
      </div>
    </FinanceLayout>
  );
};

export default Payouts;
