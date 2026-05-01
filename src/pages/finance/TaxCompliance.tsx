import { useState, useMemo, useEffect } from "react";
import FinanceLayout, { FinanceGhostButton } from "@/components/finance/FinanceLayout";
import { Card, KeyValue, Pill } from "@/components/ui-kit";
import { 
  fmtINR, 
  fmtINRShort, 
  financeSettings 
} from "@/data/financeMock";
import { 
  useInvoicesStore, 
  usePayoutsStore, 
  parseFinanceDate 
} from "@/lib/financeStore";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { 
  Download, 
  FileSpreadsheet, 
  ShieldCheck, 
  ChevronRight,
  TrendingUp,
  FileText,
  Clock,
  ArrowUpRight,
  X,
  CheckCircle2
} from "lucide-react";
import { 
  format, 
  isSameMonth, 
  startOfMonth, 
  subMonths, 
  isWithinInterval,
  startOfYear
} from "date-fns";

// ─── Types & Helpers ────────────────────────────────────────────────────────

type TdsBreakdown = {
  name: string;
  gross: number;
  tds: number;
};

const downloadCsv = (filename: string, rows: string[][]) => {
  const csvContent = rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

// ─── Components ──────────────────────────────────────────────────────────────

const KpiCard = ({ label, value, sub, tone = "default" }: any) => {
  const borderClass = 
    tone === "primary" ? "border-primary/20 bg-primary/[0.02]" : 
    tone === "success" ? "border-emerald-500/20 bg-emerald-500/[0.02]" : 
    "border-border/40 bg-card";
  
  const valueClass = 
    tone === "primary" ? "text-primary" : 
    tone === "success" ? "text-emerald-600" :
    "text-foreground";

  return (
    <Card className={cn("rounded-2xl p-6 border shadow-soft transition-all hover:shadow-md", borderClass)}>
      <p className="uppercase tracking-widest text-[10px] font-black text-muted-foreground/60 mb-2">{label}</p>
      <h3 className={cn("font-display text-2xl font-black tabular-nums", valueClass)}>{value}</h3>
      <p className="text-[10px] font-bold text-muted-foreground mt-1.5 uppercase tracking-tight opacity-70">{sub}</p>
    </Card>
  );
};

const ReportTile = ({ name, freq, icon: Icon, onClick }: any) => (
  <Card 
    onClick={onClick}
    className="p-5 rounded-2xl border-border/40 hover:border-primary/40 cursor-pointer transition-all group flex flex-col justify-between h-40 bg-card/50 backdrop-blur-sm"
  >
    <div className="flex justify-between items-start">
      <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
        <Icon className="w-4 h-4" />
      </div>
      <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">{freq}</span>
    </div>
    <div>
      <h4 className="text-xs font-black uppercase tracking-tight leading-tight group-hover:text-primary transition-colors pr-4">{name}</h4>
      <button 
        className="mt-3 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0"
        onClick={(e) => { e.stopPropagation(); onClick(); }}
      >
        Download <ArrowUpRight className="w-3 h-3" />
      </button>
    </div>
  </Card>
);

const LegendItem = ({ color, label }: { color: string, label: string }) => (
  <div className="flex items-center gap-1.5">
    <div className={cn("w-2 h-2 rounded-full", color)} />
    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{label}</span>
  </div>
);

const PreviewModal = ({ 
  report, 
  onClose, 
  onConfirm 
}: { 
  report: { name: string; format: "csv" | "pdf"; rows: string[][] }; 
  onClose: () => void;
  onConfirm: () => void;
}) => {
  const snippet = report.rows.slice(0, 100); // Show more rows if needed, but only first 100 for performance
  const hasMore = report.rows.length > 100;

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#050505]/90 backdrop-blur-xl animate-in fade-in duration-300" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <Card 
        className="relative w-[92%] max-w-[1000px] flex flex-col rounded-[24px] border-none bg-white p-0 shadow-[0_30px_100px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-300 overflow-hidden" 
        onClick={e => e.stopPropagation()}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      >
        {/* Header Section */}
        <div className="px-10 pt-10 pb-8 border-b border-border/5 flex items-start justify-between bg-white shrink-0">
          <div>
            <h3 className="font-display text-2xl font-black tracking-tight text-foreground leading-none">GSTR-1 compatible export</h3>
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-3 opacity-50">
              {report.format.toUpperCase()} Format &middot; {report.rows.length - 1} total rows &middot; Preview report before download
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-muted transition-all active:scale-90"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content Area (Scrollable Table) */}
        <div className="flex-1 overflow-hidden flex flex-col bg-[#fafafa]">
          <div className="flex-1 overflow-y-auto px-10 py-6 max-h-[60vh]">
            <div className="overflow-x-auto border border-border/10 rounded-xl bg-white shadow-sm">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead className="sticky top-0 z-10 bg-[#f4f4f4] backdrop-blur-md">
                  <tr>
                    {snippet[0].map((h, i) => (
                      <th key={i} className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/80 border-b border-border/10">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/5">
                  {snippet.slice(1).map((row, ri) => (
                    <tr key={ri} className="hover:bg-primary/[0.03] transition-colors group">
                      {row.map((cell, ci) => (
                        <td key={ci} className="px-6 py-5 text-[12px] font-bold text-foreground/90 tabular-nums">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {hasMore && (
              <div className="py-8 text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/30 italic">
                  + {report.rows.length - 100} more rows not shown in preview
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-10 py-8 border-t border-border/5 flex items-center justify-end gap-5 bg-white shrink-0">
          <button 
            onClick={onClose} 
            className="px-6 py-3 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="flex items-center gap-4 h-14 px-12 rounded-xl bg-[#0a0a0a] text-white text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all"
          >
            {report.format === "csv" ? <FileSpreadsheet className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
            Confirm & Download
          </button>
        </div>
      </Card>
    </div>
  );
};

// ─── Main Component ─────────────────────────────────────────────────────────

const TaxCompliance = () => {
  const { invoices } = useInvoicesStore();
  const { payouts } = usePayoutsStore();
  const [previewReport, setPreviewReport] = useState<{ name: string; format: "csv" | "pdf"; rows: string[][] } | null>(null);

  // ─── Calculations ─────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const now = new Date();
    const activeInvoices = invoices.filter(i => i.status !== "Cancelled" && i.status !== "Draft");
    const currentMonthInvoices = activeInvoices.filter(i => isSameMonth(parseFinanceDate(i.date), now));

    // 1) GST THIS MONTH
    const gstThisMonth = currentMonthInvoices.reduce((sum, i) => sum + (i.gst ? i.tax : 0), 0);
    const intraStateTax = gstThisMonth * 0.70;
    const interStateTax = gstThisMonth * 0.30;
    const cgst = intraStateTax / 2;
    const sgst = intraStateTax / 2;
    const igst = interStateTax;

    // 2) INVOICE MIX
    const mix = {
      b2c: 0,
      b2b: 0,
      nonGst: 0,
      total: currentMonthInvoices.length
    };
    currentMonthInvoices.forEach(i => {
      if (!i.gst) {
        mix.nonGst++;
      } else if (/pvt|ltd|inc|llp|corp/i.test(i.student)) {
        mix.b2b++;
      } else {
        mix.b2c++;
      }
    });

    // 3) 6-MONTH TREND
    const trend = [];
    for (let k = 5; k >= 0; k--) {
      const targetMonth = startOfMonth(subMonths(now, k));
      const monthInvoices = activeInvoices.filter(i => isSameMonth(parseFinanceDate(i.date), targetMonth));
      const monthTaxTotal = monthInvoices.reduce((sum, i) => sum + (i.gst ? i.tax : 0), 0);
      
      const mIntra = monthTaxTotal * 0.70;
      const mInter = monthTaxTotal * 0.30;
      
      trend.push({
        label: format(targetMonth, "MMM"),
        cgst: (mIntra / 2) / 100000,
        sgst: (mIntra / 2) / 100000,
        igst: mInter / 100000,
        total: monthTaxTotal / 100000
      });
    }

    // 4) TDS YTD (Apr 1 → Mar 31)
    const getFinancialYearRange = (date: Date) => {
      const year = date.getMonth() >= 3 ? date.getFullYear() : date.getFullYear() - 1;
      return {
        start: new Date(year, 3, 1),
        end: new Date(year + 1, 2, 31)
      };
    };
    const fy = getFinancialYearRange(now);
    const tdsRate = financeSettings.tdsRate / 100;
    const threshold = financeSettings.tdsThreshold;

    const relevantPayouts = payouts.filter(p => {
      const d = parseFinanceDate(p.requestedOn);
      const isFY = isWithinInterval(d, { start: fy.start, end: fy.end });
      const isEligible = ["Paid", "Approved", "Settled"].includes(p.status);
      return isFY && isEligible;
    });

    const tutorGrossMap: Record<string, number> = {};
    relevantPayouts.forEach(p => {
      tutorGrossMap[p.name] = (tutorGrossMap[p.name] || 0) + p.requested;
    });

    const tdsBreakdown: TdsBreakdown[] = [];
    let tdsTotal = 0;
    Object.entries(tutorGrossMap).forEach(([name, gross]) => {
      if (gross > threshold) {
        const tds = Math.round(gross * tdsRate);
        tdsTotal += tds;
        tdsBreakdown.push({ name, gross, tds });
      }
    });
    tdsBreakdown.sort((a, b) => b.tds - a.tds);

    return {
      gstThisMonth,
      paidCount: currentMonthInvoices.filter(i => i.status === "Paid").length,
      cgst, sgst, igst,
      mix,
      trend,
      tdsTotal,
      tdsTutorCount: tdsBreakdown.length,
      tdsBreakdown
    };
  }, [invoices, payouts]);

  // ─── Export Handlers ──────────────────────────────────────────────────────

  // ─── Export Logic ──────────────────────────────────────────────────────────

  const executeDownload = (reportName: string, format: "csv" | "pdf", rows: string[][]) => {
    const stamp = new Date().toISOString().slice(0, 10);
    const filename = `${reportName.toLowerCase().replace(/\s+/g, '-')}-${stamp}.${format}`;

    if (format === "csv") {
      downloadCsv(filename, rows);
      toast.success(`${reportName} exported · ${rows.length - 1} rows`, {
        icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />
      });
    } else {
      // PDF Preview
      const subtitle = `Generated on ${new Date().toLocaleString()}`;
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${reportName}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #111; line-height: 1.5; }
            h1 { margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -0.02em; }
            .sub { color: #666; font-size: 10px; margin-top: 4px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.15em; }
            table { width: 100%; border-collapse: collapse; margin-top: 40px; }
            th { text-align: left; background: #f7f7f7; padding: 12px; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; color: #888; border-bottom: 2px solid #eee; }
            td { padding: 12px; font-size: 12px; border-bottom: 1px solid #eee; font-weight: 500; }
            tr:nth-child(even) { background: #fafafa; }
            .right { text-align: right; font-variant-numeric: tabular-nums; }
            @media print { body { padding: 0; margin: 16px; } }
          </style>
        </head>
        <body>
          <h1>${reportName}</h1>
          <div class="sub">${subtitle}</div>
          <table>
            <thead>
              <tr>${rows[0].map((h, i) => `<th class="${!isNaN(Number(rows[1]?.[i])) ? 'right' : ''}">${h}</th>`).join('')}</tr>
            </thead>
            <tbody>
              ${rows.slice(1).map(row => `
                <tr>${row.map((c, i) => `<td class="${!isNaN(Number(c)) ? 'right' : ''}">${!isNaN(Number(c)) && c !== '' ? Number(c).toLocaleString("en-IN") : c}</td>`).join('')}</tr>
              `).join('')}
            </tbody>
          </table>
          <script>window.onload = () => setTimeout(() => window.print(), 300);</script>
        </body>
        </html>
      `;

      const w = window.open("", "_blank");
      if (!w) {
        toast.error("Pop-up blocked. Allow pop-ups to download PDF.");
      } else {
        w.document.write(html);
        w.document.close();
        toast.success(`${reportName} · PDF preview opened`);
      }
    }
  };

  const exportGstr1 = (format: "csv" | "pdf" = "csv") => {
    const activeInvoices = invoices.filter(i => i.status !== "Cancelled" && i.status !== "Draft");
    const headers = ["Invoice #", "Date", "Customer", "Course/Item", "Taxable", "Tax", "Total", "GST", "Status"];
    const rows = activeInvoices.map(i => [
      i.number, i.date, i.student, i.course, 
      i.taxable.toString(), i.tax.toString(), i.total.toString(),
      i.gst ? "Yes" : "No", i.status
    ]);
    setPreviewReport({ name: "GSTR-1 compatible export", format, rows: [headers, ...rows] });
  };

  const exportTdsCert = (format: "csv" | "pdf" = "csv") => {
    const headers = ["Tutor", "Gross Paid (FY)", "TDS Deducted (10%)", "Net Paid"];
    const rows = stats.tdsBreakdown.map(b => [
      b.name, b.gross.toString(), b.tds.toString(), (b.gross - b.tds).toString()
    ]);
    setPreviewReport({ name: "Form 16A (TDS certificates)", format, rows: [headers, ...rows] });
  };

  return (
    <FinanceLayout
      eyebrow="Module 08"
      title="Tax & Compliance"
      subtitle="Live GST + TDS calculations from invoices and payouts. Compliance-ready exports."
      action={
        <div className="flex items-center gap-3">
          <FinanceGhostButton onClick={() => exportGstr1("csv")} icon={FileSpreadsheet}>
            GSTR-1 export
          </FinanceGhostButton>
          <FinanceGhostButton onClick={() => exportTdsCert("csv")} icon={Download}>
            TDS (Form 16A)
          </FinanceGhostButton>
        </div>
      }
    >
      <div className="space-y-8 animate-fade-in pb-20">
        
        {/* Section A — KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiCard 
            label={`GST Collected (${format(new Date(), "MMM")})`} 
            value={fmtINRShort(stats.gstThisMonth)} 
            sub={`${stats.paidCount} paid invoices`}
            tone="primary"
          />
          <KpiCard 
            label="CGST + SGST" 
            value={fmtINRShort(stats.cgst + stats.sgst)} 
            sub="Intra-state · 70%"
          />
          <KpiCard 
            label="IGST" 
            value={fmtINRShort(stats.igst)} 
            sub="Inter-state · 30%"
          />
          <KpiCard 
            label="TDS deducted (FY)" 
            value={fmtINRShort(stats.tdsTotal)} 
            sub={`${stats.tdsTutorCount} tutors above ₹30k`}
            tone="success"
          />
        </div>

        {/* Section B — Mix & Trend */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-8 rounded-2xl border-none shadow-soft bg-card overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-primary/20" />
            <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-8">Invoice mix</h3>
            <div className="space-y-6">
               <KeyValue label="B2C Invoices" value={stats.mix.b2c.toString()} />
               <KeyValue label="B2B (Corporate)" value={stats.mix.b2b.toString()} />
               <KeyValue label="Non-GST Billing" value={stats.mix.nonGst.toString()} />
               <div className="pt-4 border-t border-border/40">
                  <KeyValue 
                    label="Total Invoices" 
                    value={stats.mix.total.toString()} 
                    className="font-black text-primary"
                  />
               </div>
            </div>
          </Card>

          <Card className="lg:col-span-2 p-8 rounded-2xl border-none shadow-soft bg-card">
            <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-8">Tax collected — last 6 months</h3>
            
            <div className="h-[180px] flex items-end justify-between px-4">
              {stats.trend.map((m, i) => {
                const maxVal = Math.max(...stats.trend.map(t => t.total)) || 1;
                const hScale = 180 / maxVal;
                return (
                  <div key={i} className="flex flex-col items-center gap-3 group">
                    <div className="relative w-[42px] flex flex-col-reverse" style={{ height: `${m.total * hScale}px` }}>
                       <div 
                         className="w-full bg-primary/80 rounded-t-sm transition-all group-hover:brightness-110" 
                         style={{ height: `${(m.cgst / m.total) * 100}%` }}
                         title={`CGST: ₹${m.cgst.toFixed(2)}L`}
                       />
                       <div 
                         className="w-full bg-primary/55 transition-all group-hover:brightness-110" 
                         style={{ height: `${(m.sgst / m.total) * 100}%` }}
                         title={`SGST: ₹${m.sgst.toFixed(2)}L`}
                       />
                       <div 
                         className="w-full bg-blue-400/70 rounded-b-sm transition-all group-hover:brightness-110" 
                         style={{ height: `${(m.igst / m.total) * 100}%` }}
                         title={`IGST: ₹${m.igst.toFixed(2)}L`}
                       />
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground/60">{m.label}</p>
                      <p className="text-[11px] font-black tabular-nums">₹{m.total.toFixed(1)}L</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 pt-6 border-t border-border/40 flex flex-wrap gap-6 justify-center">
               <LegendItem color="bg-primary/80" label="CGST" />
               <LegendItem color="bg-primary/55" label="SGST" />
               <LegendItem color="bg-blue-400/70" label="IGST" />
            </div>
          </Card>
        </div>

        {/* Section C — TDS Breakdown */}
        {stats.tdsBreakdown.length > 0 && (
          <Card className="rounded-2xl border-none shadow-soft overflow-hidden bg-card">
            <div className="px-8 py-6 border-b border-border/40 flex items-center justify-between bg-muted/5">
              <div>
                <h3 className="text-lg font-black tracking-tight text-foreground">TDS breakdown by tutor</h3>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1 opacity-60">
                  Financial Year · Threshold ₹30,000 · Rate 10%
                </p>
              </div>
              <ShieldCheck className="w-5 h-5 text-emerald-500/40" />
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-muted/10 border-b border-border/40">
                  <tr>
                    <th className="pl-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Tutor</th>
                    <th className="py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Gross paid (FY)</th>
                    <th className="py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">TDS @ 10%</th>
                    <th className="pr-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Net</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/10">
                  {stats.tdsBreakdown.map((b, i) => (
                    <tr key={i} className="hover:bg-muted/30 transition-colors group">
                      <td className="pl-8 py-4">
                        <span className="text-sm font-black text-foreground group-hover:text-primary transition-colors">{b.name}</span>
                      </td>
                      <td className="py-4 text-right tabular-nums font-bold text-muted-foreground/60">
                        {fmtINR(b.gross)}
                      </td>
                      <td className="py-4 text-right tabular-nums font-black text-rose-500">
                        -{fmtINR(b.tds)}
                      </td>
                      <td className="pr-8 py-4 text-right tabular-nums text-sm font-black text-foreground">
                        {fmtINR(b.gross - b.tds)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Section D — Available Reports */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
             <div className="h-px flex-1 bg-border/40" />
             <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 px-2">Available reports</h3>
             <div className="h-px flex-1 bg-border/40" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <ReportTile 
              name="GSTR-1 compatible export" 
              freq="Monthly" 
              icon={FileSpreadsheet} 
              onClick={() => exportGstr1("csv")}
            />
            <ReportTile 
              name="Form 16A (TDS certificates)" 
              freq="Annual" 
              icon={Download} 
              onClick={() => exportTdsCert("csv")}
            />
            <ReportTile 
              name="Output Tax Collected" 
              freq="Monthly" 
              icon={FileSpreadsheet} 
              onClick={() => exportGstr1("csv")}
            />
            <ReportTile 
              name="Tax by invoice type" 
              freq="Monthly" 
              icon={ShieldCheck} 
              onClick={() => exportGstr1("csv")}
            />
            <ReportTile 
              name="HSN summary" 
              freq="Quarterly" 
              icon={FileText} 
              onClick={() => toast.info("HSN summary requires line-item data")}
            />
            <ReportTile 
              name="Annual tax summary" 
              freq="Annual" 
              icon={FileSpreadsheet} 
              onClick={() => exportGstr1("csv")}
            />
          </div>
        </div>
        
        {previewReport && (
          <PreviewModal 
            report={previewReport} 
            onClose={() => setPreviewReport(null)}
            onConfirm={() => {
              executeDownload(previewReport.name, previewReport.format, previewReport.rows);
              setPreviewReport(null);
            }}
          />
        )}
      </div>
    </FinanceLayout>
  );
};

export default TaxCompliance;
