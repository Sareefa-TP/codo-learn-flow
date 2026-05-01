import { useState, useMemo, useEffect } from "react";
import FinanceLayout, { FinanceGhostButton } from "@/components/finance/FinanceLayout";
import { Card, Bar } from "@/components/ui-kit";
import { 
  fmtINR, 
  fmtINRShort, 
} from "@/data/financeMock";
import { 
  useInvoicesStore, 
  usePayoutsStore, 
  useRefundsStore, 
  parseFinanceDate, 
  parseShortDate 
} from "@/lib/financeStore";
import { cn } from "@/lib/utils";
import { 
  Download, 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  FileText, 
  X, 
  Mail, 
  Calendar,
  RotateCcw,
  CheckCircle2,
  FileSpreadsheet
} from "lucide-react";
import { toast } from "sonner";

// ─── Helpers ────────────────────────────────────────────────────────────────

const subDays = (date: Date, days: number) => {
  const d = new Date(date);
  d.setDate(d.getDate() - days);
  return d;
};

const startOfYear = (date: Date) => {
  return new Date(date.getFullYear(), 0, 1);
};

// ─── Components ──────────────────────────────────────────────────────────────

const Kpi = ({ label, value, sub, tone }: { label: string; value: string; sub: string; tone?: "primary" }) => (
  <Card className={cn(
    "rounded-2xl border bg-card p-6 shadow-soft transition-all hover:shadow-lg",
    tone === "primary" ? "border-primary/30" : "border-border"
  )}>
    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">{label}</p>
    <h3 className="mt-2 font-display text-3xl font-black tracking-tight text-foreground tabular-nums">{value}</h3>
    <p className="mt-1 text-[11px] font-bold text-muted-foreground/40">{sub}</p>
  </Card>
);

const Legend = ({ color, label }: { color: string; label: string }) => (
  <div className="flex items-center gap-2">
    <div className={cn("h-2.5 w-2.5 rounded-full", color)} />
    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</span>
  </div>
);

const Field = ({ label, icon: Icon, children }: { label: string; icon?: any; children: React.ReactNode }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-1">{label}</label>
    <div className="relative">
      {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />}
      {children}
    </div>
  </div>
);

const ScheduleModal = ({ onClose }: { onClose: () => void }) => {
  const [email, setEmail] = useState("priya@codo.in");
  const [report, setReport] = useState("Revenue report");
  const [freq, setFreq] = useState("weekly");
  const [format, setFormat] = useState("pdf");

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, []);

  const submit = () => {
    if (!email.includes("@")) {
      toast.error("Enter a valid email");
      return;
    }
    toast.success(`Scheduled · ${report} · ${freq} · ${format.toUpperCase()} → ${email}`);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#050505]/90 backdrop-blur-xl animate-in fade-in duration-300" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <Card 
        className="relative w-[90%] max-w-[600px] flex flex-col rounded-[24px] border-none bg-white p-0 shadow-[0_30px_100px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-300 overflow-hidden" 
        onClick={e => e.stopPropagation()}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      >
        <div className="px-10 pt-10 pb-8 border-b border-border/5 flex items-start justify-between bg-white shrink-0">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">Automation</p>
            <h3 className="mt-1 font-display text-2xl font-black tracking-tight text-foreground leading-none">Schedule delivery</h3>
          </div>
          <button 
            onClick={onClose} 
            className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-muted transition-all active:scale-90"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-10 py-10 space-y-8 bg-[#fafafa]">
          <Field label="Report">
            <div className="relative">
              <select 
                value={report}
                onChange={e => setReport(e.target.value)}
                className="w-full h-14 pl-5 pr-10 rounded-xl border border-border/20 bg-white text-sm font-bold shadow-sm focus:ring-2 focus:ring-primary/20 appearance-none outline-none"
              >
                {["Revenue report", "Net revenue", "Collection report", "Refund report", "Payout report", "GST report"].map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                <TrendingUp className="h-4 w-4 text-muted-foreground/40 rotate-90" />
              </div>
            </div>
          </Field>

          <Field label="Recipient email" icon={Mail}>
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full h-14 pl-14 pr-5 rounded-xl border border-border/20 bg-white text-sm font-bold shadow-sm focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Field label="Frequency" icon={Calendar}>
              <div className="grid grid-cols-3 gap-2">
                {["daily", "weekly", "monthly"].map(f => (
                  <button
                    key={f}
                    onClick={() => setFreq(f)}
                    className={cn(
                      "h-12 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all",
                      freq === f ? "border-[#0a0a0a] bg-[#0a0a0a] text-white shadow-lg" : "border-border/20 bg-white text-muted-foreground hover:border-primary/40 hover:bg-muted/30"
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Format">
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "csv", label: "Excel / CSV" },
                  { id: "pdf", label: "PDF" }
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setFormat(f.id)}
                    className={cn(
                      "h-12 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all",
                      format === f.id ? "border-[#0a0a0a] bg-[#0a0a0a] text-white shadow-lg" : "border-border/20 bg-white text-muted-foreground hover:border-primary/40 hover:bg-muted/30"
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </Field>
          </div>
        </div>

        <div className="px-10 py-8 border-t border-border/5 flex items-center justify-end gap-5 bg-white shrink-0">
          <button 
            onClick={onClose} 
            className="px-6 py-3 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={submit}
            className="h-14 px-12 rounded-xl bg-[#0a0a0a] text-white text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all"
          >
            Schedule
          </button>
        </div>
      </Card>
    </div>
  );
};

const PreviewModal = ({ 
  report, 
  onClose, 
  onConfirm 
}: { 
  report: { name: string; format: "csv" | "pdf"; rows: string[][] }; 
  onClose: () => void;
  onConfirm: () => void;
}) => {
  const snippet = report.rows.slice(0, 100);
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
        <div className="px-10 pt-10 pb-8 border-b border-border/5 flex items-start justify-between bg-white shrink-0">
          <div>
            <h3 className="font-display text-2xl font-black tracking-tight text-foreground leading-none">{report.name}</h3>
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

const ReportsAnalytics = () => {
  const { invoices } = useInvoicesStore();
  const { payouts } = usePayoutsStore();
  const { refunds } = useRefundsStore();

  const [range, setRange] = useState<"7d" | "30d" | "90d" | "ytd" | "all">("90d");
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [previewReport, setPreviewReport] = useState<{ name: string; format: "csv" | "pdf"; rows: string[][] } | null>(null);

  // ─── Date Filtering ───────────────────────────────────────────────────────
  
  const rangeConfig = useMemo(() => {
    const today = new Date();
    const start = 
      range === "7d" ? subDays(today, 7) :
      range === "30d" ? subDays(today, 30) :
      range === "90d" ? subDays(today, 90) :
      range === "ytd" ? startOfYear(today) :
      null;
    
    const labels = {
      "7d": "Last 7 days",
      "30d": "Last 30 days",
      "90d": "Last 90 days",
      "ytd": "Year to date",
      "all": "All time"
    };
    
    return { start, label: labels[range] };
  }, [range]);

  // ─── Computations ──────────────────────────────────────────────────────────

  const data = useMemo(() => {
    const { start } = rangeConfig;

    // A) Filters
    const billable = invoices.filter(inv => inv.status !== "Cancelled" && inv.status !== "Draft");
    const billableInRange = start 
      ? billable.filter(inv => parseFinanceDate(inv.date) >= start)
      : billable;

    const refundsProcessed = refunds.filter(r => r.status === "Processed" || r.status === "Completed" || r.status === "Processing");
    const refundsInRange = start
      ? refunds.filter(r => parseShortDate(r.requestedOn) >= start)
      : refunds;
    const refundsProcessedInRange = refundsProcessed.filter(r => start ? parseShortDate(r.requestedOn) >= start : true);

    const payoutsPaid = payouts.filter(p => p.status === "Paid" || p.status === "Approved");
    const payoutsInRange = start
      ? payouts.filter(p => parseShortDate(p.requestedOn) >= start)
      : payouts;
    const payoutsPaidInRange = payoutsPaid.filter(p => start ? parseShortDate(p.requestedOn) >= start : true);

    // B) Headline Numbers
    const totalRevenue = billableInRange.reduce((sum, i) => sum + i.total, 0);
    const totalPayouts = payoutsPaidInRange.reduce((sum, p) => sum + p.net, 0);
    const totalRefunds = refundsProcessedInRange.reduce((sum, r) => sum + r.refundAmount, 0);
    const netRevenue = totalRevenue - totalPayouts - totalRefunds;
    const refundRate = totalRevenue > 0 ? (totalRefunds / totalRevenue) * 100 : 0;

    // C) 6-Month Trend (Last 6 months fixed context)
    const trend = [];
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    for (let k = 5; k >= 0; k--) {
      const monthDate = new Date(currentYear, currentMonth - k, 1);
      const monthLabel = monthDate.toLocaleDateString("en-GB", { month: "short", year: "2-digit" });
      
      const inMonth = (d: Date) => d.getMonth() === monthDate.getMonth() && d.getFullYear() === monthDate.getFullYear();

      const rev = billable.filter(i => inMonth(parseFinanceDate(i.date))).reduce((sum, i) => sum + i.total, 0);
      const pay = payoutsPaid.filter(p => inMonth(parseShortDate(p.requestedOn))).reduce((sum, p) => sum + p.net, 0);
      const ref = refundsProcessed.filter(r => inMonth(parseShortDate(r.requestedOn))).reduce((sum, r) => sum + r.refundAmount, 0);
      
      trend.push({
        month: monthLabel,
        revenue: rev / 100000,
        payouts: pay / 100000,
        refunds: ref / 100000,
        net: (rev - pay - ref) / 100000
      });
    }

    // D) Refund Reasons
    const reasonsMap: Record<string, { count: number; amount: number }> = {};
    refundsProcessedInRange.forEach(r => {
      const cat = r.reason || "Other";
      if (!reasonsMap[cat]) reasonsMap[cat] = { count: 0, amount: 0 };
      reasonsMap[cat].count++;
      reasonsMap[cat].amount += r.refundAmount;
    });
    const refundReasons = Object.entries(reasonsMap)
      .map(([reason, d]) => ({ reason, ...d }))
      .sort((a, b) => b.amount - a.amount);

    // E) Revenue by Course
    const courseMap: Record<string, { revenue: number; count: number }> = {};
    billableInRange.forEach(inv => {
      const baseCourse = inv.course.split(" EMI")[0];
      if (!courseMap[baseCourse]) courseMap[baseCourse] = { revenue: 0, count: 0 };
      courseMap[baseCourse].revenue += inv.total;
      courseMap[baseCourse].count++;
    });
    const revenueByCourse = Object.entries(courseMap)
      .map(([course, d]) => ({ course, ...d }))
      .sort((a, b) => b.revenue - a.revenue);

    return {
      totalRevenue,
      totalPayouts,
      totalRefunds,
      netRevenue,
      refundRate,
      trend,
      refundReasons,
      revenueByCourse,
      counts: {
        invoices: billableInRange.length,
        refunds: refundsInRange.length,
        payouts: payoutsInRange.length
      }
    };
  }, [invoices, payouts, refunds, rangeConfig]);

  // ─── Export Logic ──────────────────────────────────────────────────────────

  const reportBuilders: Record<string, () => { name: string; rows: string[][] }> = {
    "Revenue report": () => ({
      name: "revenue-report",
      rows: [
        ["Month", "Revenue (₹L)", "Payouts (₹L)", "Refunds (₹L)", "Net (₹L)"],
        ...data.trend.map(t => [t.month, t.revenue.toFixed(2), t.payouts.toFixed(2), t.refunds.toFixed(2), t.net.toFixed(2)])
      ]
    }),
    "Revenue by course": () => ({
      name: "revenue-by-course",
      rows: [
        ["Course", "Invoices", "Revenue (₹)"],
        ...data.revenueByCourse.map(c => [c.course, c.count.toString(), c.revenue.toString()])
      ]
    }),
    "Revenue by tutor": () => {
      const tutorMap: Record<string, number> = {};
      payouts.forEach(p => {
        if (!tutorMap[p.name]) tutorMap[p.name] = 0;
        tutorMap[p.name] += p.requested;
      });
      return {
        name: "revenue-by-tutor",
        rows: [
          ["Tutor", "Gross paid (₹)"],
          ...Object.entries(tutorMap).sort((a, b) => b[1] - a[1]).map(([name, val]) => [name, val.toString()])
        ]
      };
    },
    "Collection report": () => {
      const paid = invoices.filter(i => i.status === "Paid").reduce((sum, i) => sum + i.total, 0);
      const pending = invoices.filter(i => i.status === "Sent" || i.status === "Overdue").reduce((sum, i) => sum + i.total, 0);
      const total = paid + pending;
      return {
        name: "collection-report",
        rows: [
          ["Metric", "Amount (₹)", "Share (%)"],
          ["Paid", paid.toString(), total > 0 ? ((paid/total)*100).toFixed(1) : "0"],
          ["Outstanding", pending.toString(), total > 0 ? ((pending/total)*100).toFixed(1) : "0"]
        ]
      };
    },
    "Overdue report": () => ({
      name: "overdue-report",
      rows: [
        ["Invoice #", "Student", "Course", "Due", "Total (₹)"],
        ...invoices.filter(i => i.status === "Overdue").map(i => [i.number, i.student, i.course, i.due, i.total.toString()])
      ]
    }),
    "Refund report": () => ({
      name: "refund-report",
      rows: [
        ["Refund ID", "Student", "Course", "Reason", "Amount (₹)", "Status"],
        ...refunds.map(r => [r.id, r.student, r.product, r.reason, r.refundAmount.toString(), r.status])
      ]
    }),
    "Refund rate": () => ({
      name: "refund-rate",
      rows: [
        ["Period", "Revenue (₹)", "Refunds (₹)", "Rate (%)"],
        [range.toUpperCase(), data.totalRevenue.toString(), data.totalRefunds.toString(), data.refundRate.toFixed(2)]
      ]
    }),
    "Payout report": () => ({
      name: "payout-report",
      rows: [
        ["Payout ID", "Tutor", "Period", "Gross (₹)", "TDS (₹)", "Net (₹)", "Status"],
        ...payouts.map(p => [p.id, p.name, p.period, p.requested.toString(), p.tds.toString(), p.net.toString(), p.status])
      ]
    }),
    "Commission report": () => ({
      name: "commission-report",
      rows: [
        ["Tutor", "Gross (₹)", "Tutor Share (60%)", "Platform Share (40%)"],
        ...payouts.map(p => [p.name, p.requested.toString(), (p.requested * 0.6).toFixed(0), (p.requested * 0.4).toFixed(0)])
      ]
    }),
    "Net revenue": () => ({
      name: "net-revenue-report",
      rows: [
        ["Metric", "Amount (₹)"],
        ["Revenue", data.totalRevenue.toString()],
        ["- Payouts", data.totalPayouts.toString()],
        ["- Refunds", data.totalRefunds.toString()],
        ["Net Revenue", data.netRevenue.toString()]
      ]
    }),
    "GST report": () => ({
      name: "gst-report",
      rows: [
        ["Invoice #", "Date", "Customer", "Taxable (₹)", "Tax (₹)", "Total (₹)", "GST Status"],
        ...invoices.filter(i => i.status !== "Cancelled" && i.status !== "Draft").map(i => [i.number, i.date, i.student, i.taxable.toString(), i.tax.toString(), i.total.toString(), i.gst ? "Yes" : "No"])
      ]
    }),
    "Wallet liability": () => {
      const issued = data.totalRefunds; 
      return {
        name: "wallet-liability",
        rows: [
          ["Metric", "Amount (₹)"],
          ["Credits Held", issued.toString()],
          ["Monthly Usage (Est 40%)", (issued * 0.4).toFixed(0)],
          ["Outstanding (60%)", (issued * 0.6).toFixed(0)]
        ]
      };
    }
  };

  const executeDownload = (reportName: string, format: "csv" | "pdf", rows: string[][]) => {
    const builder = reportBuilders[reportName];
    if (!builder) return;
    const { name: slug } = builder();
    const stamp = new Date().toISOString().slice(0, 10);

    if (format === "csv") {
      const csvContent = rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${slug}-${stamp}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success(`${reportName} exported · ${rows.length - 1} rows`, {
        icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />
      });
    } else {
      const title = reportName;
      const subtitle = `${rangeConfig.label} · ${rows.length - 1} rows`;
      const generatedAt = new Date().toLocaleString();

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${title}</title>
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
          <h1>${title}</h1>
          <div class="sub">${subtitle} &middot; Generated ${generatedAt}</div>
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

  const exportReport = (reportName: string, format: "csv" | "pdf") => {
    const builder = reportBuilders[reportName];
    if (!builder) return;
    const { rows } = builder();
    setPreviewReport({ name: reportName, format, rows });
  };

  return (
    <FinanceLayout
      eyebrow="Module 09"
      title="Reports & Analytics"
      subtitle="Live dashboards from invoices, payouts, and refunds. Exportable to Excel/PDF."
      action={
        <FinanceGhostButton 
          icon={Download} 
          onClick={() => setScheduleOpen(true)}
        >
          Schedule delivery
        </FinanceGhostButton>
      }
    >
      <div className="space-y-10 animate-fade-in pb-20">
        
        {/* ─── Date Range Filter ────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="inline-flex p-1.5 rounded-2xl bg-muted/50 border shadow-inner">
            {[
              { id: "7d", label: "Last 7 days" },
              { id: "30d", label: "Last 30 days" },
              { id: "90d", label: "Last 90 days" },
              { id: "ytd", label: "Year to date" },
              { id: "all", label: "All time" }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setRange(f.id as any)}
                className={cn(
                  "px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  range === f.id ? "bg-card text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
            {data.counts.invoices} invoices · {data.counts.refunds} refunds · {data.counts.payouts} payouts in range
          </div>
        </div>

        {/* ─── KPI Row ───────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Kpi 
            label="Revenue" 
            value={fmtINRShort(data.totalRevenue)} 
            sub={rangeConfig.label} 
            tone="primary" 
          />
          <Kpi 
            label="Payouts" 
            value={fmtINRShort(data.totalPayouts)} 
            sub="Paid + approved" 
          />
          <Kpi 
            label="Refunds" 
            value={fmtINRShort(data.totalRefunds)} 
            sub={`${data.refundRate.toFixed(2)}% rate`} 
          />
          <Kpi 
            label="Net revenue" 
            value={fmtINRShort(data.netRevenue)} 
            sub="Revenue − Payouts − Refunds" 
            tone="primary" 
          />
        </div>

        {/* ─── Charts Row ────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card A: Net Revenue Trend */}
          <Card className="rounded-[2.5rem] border bg-card p-10 shadow-soft overflow-hidden">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h4 className="text-xl font-black tracking-tight">Net revenue trend</h4>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mt-1">6-month · Revenue − Payouts − Refunds (₹L)</p>
              </div>
            </div>

            <div className="flex items-end justify-between gap-4 h-[180px] pb-8 relative">
              {data.trend.map(t => {
                const maxTrend = Math.max(...data.trend.map(x => x.revenue), 0.1);
                return (
                  <div key={t.month} className="flex-1 flex flex-col items-center group relative h-full">
                    <div className="w-full max-w-[42px] flex flex-col justify-end gap-[2px] transition-all duration-500 group-hover:scale-105 h-[120px]">
                      <div 
                        title={`Refunds: ₹${t.refunds}L`}
                        className="bg-destructive/60 rounded-sm w-full" 
                        style={{ height: `${(t.refunds / maxTrend) * 100}%` }} 
                      />
                      <div 
                        title={`Payouts: ₹${t.payouts}L`}
                        className="bg-warning/60 rounded-sm w-full" 
                        style={{ height: `${(t.payouts / maxTrend) * 100}%` }} 
                      />
                      <div 
                        title={`Net: ₹${t.net}L`}
                        className="bg-primary rounded-sm w-full shadow-lg shadow-primary/10" 
                        style={{ height: `${Math.max(0, t.net / maxTrend) * 100}%` }} 
                      />
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">{t.month}</p>
                      <p className="text-[11px] font-black text-primary tabular-nums mt-0.5">₹{t.net.toFixed(1)}L</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-center gap-10 mt-6 pt-6 border-t border-border/40">
              <Legend color="bg-primary" label="Net" />
              <Legend color="bg-warning/60" label="Payouts" />
              <Legend color="bg-destructive/60" label="Refunds" />
            </div>
          </Card>

          {/* Card B: Refund Reasons */}
          <Card className="rounded-[2.5rem] border bg-card p-10 shadow-soft">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h4 className="text-xl font-black tracking-tight">Refund reasons</h4>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mt-1">{rangeConfig.label}</p>
              </div>
            </div>

            <div className="space-y-8">
              {data.refundReasons.length > 0 ? data.refundReasons.map(r => (
                <div key={r.reason} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase tracking-widest text-foreground">{r.reason}</span>
                    <span className="text-[11px] font-bold text-muted-foreground tabular-nums">
                      {r.count} · {fmtINRShort(r.amount)}
                    </span>
                  </div>
                  <Bar 
                    value={(r.amount / Math.max(...data.refundReasons.map(x => x.amount), 1)) * 100} 
                    tone="warning" 
                    className="h-1.5" 
                  />
                </div>
              )) : (
                <div className="flex flex-col items-center justify-center py-8 opacity-40">
                  <RotateCcw className="h-10 w-10 text-muted-foreground mb-4" />
                  <p className="text-xs font-bold text-muted-foreground">No refunds in this range.</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* ─── Revenue by Course Card ───────────────────────────────────────── */}
        <Card className="rounded-[2.5rem] border bg-card p-10 shadow-soft">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h4 className="text-xl font-black tracking-tight">Revenue by course</h4>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mt-1">Top performing · live</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-20 gap-y-10">
            {data.revenueByCourse.length > 0 ? data.revenueByCourse.map(c => (
              <div key={c.course} className="space-y-3 pb-6 border-b border-border/60 last:border-0 md:[&:nth-last-child(2)]:border-0">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-widest text-foreground truncate max-w-[200px]">{c.course}</span>
                  <span className="text-[11px] font-bold text-muted-foreground tabular-nums">
                    {fmtINR(c.revenue)} · {c.count} inv
                  </span>
                </div>
                <Bar 
                  value={(c.revenue / Math.max(...data.revenueByCourse.map(x => x.revenue), 1)) * 100} 
                  tone="primary" 
                  className="h-1.5" 
                />
              </div>
            )) : (
              <div className="col-span-2 flex flex-col items-center justify-center py-20 opacity-40">
                <BarChart3 className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-xs font-bold text-muted-foreground">No revenue in this range.</p>
              </div>
            )}
          </div>
        </Card>

        {/* ─── All Reports Grid ─────────────────────────────────────────────── */}
        <div className="space-y-6 pt-10">
          <h2 className="font-display text-2xl font-black tracking-tight text-foreground">All reports</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { id: "Revenue report", icon: BarChart3, desc: "Day/month/year — target vs actual" },
              { id: "Revenue by course", icon: PieChart, desc: "INR + invoice count per course" },
              { id: "Revenue by tutor", icon: BarChart3, desc: "Earnings generated per tutor" },
              { id: "Collection report", icon: BarChart3, desc: "Invoiced vs collected vs outstanding" },
              { id: "Overdue report", icon: FileText, desc: "All invoices in Overdue state" },
              { id: "Refund report", icon: PieChart, desc: "Counts, INR, reason mix" },
              { id: "Refund rate", icon: TrendingUp, desc: "% of revenue refunded over time" },
              { id: "Payout report", icon: BarChart3, desc: "Gross, TDS, net by period" },
              { id: "Commission report", icon: PieChart, desc: "Platform vs tutor share" },
              { id: "Net revenue", icon: TrendingUp, desc: "Revenue − payouts − refunds" },
              { id: "GST report", icon: FileText, desc: "Taxable / tax / total per invoice" },
              { id: "Wallet liability", icon: TrendingUp, desc: "Credits held + monthly usage" }
            ].map(r => (
              <Card 
                key={r.id}
                onClick={() => exportReport(r.id, "csv")}
                className="group flex flex-col p-6 rounded-[2rem] border bg-card shadow-soft hover:border-primary/40 hover:shadow-xl transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary transition-all group-hover:scale-110">
                    <r.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-black text-foreground group-hover:text-primary transition-colors truncate">{r.id}</h5>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5 truncate">{r.desc}</p>
                  </div>
                </div>
                
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/40">
                  <button 
                    onClick={e => { e.stopPropagation(); exportReport(r.id, "csv"); }}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:opacity-70 transition-all"
                  >
                    <Download className="h-3 w-3" />
                    Excel / CSV
                  </button>
                  <button 
                    onClick={e => { e.stopPropagation(); exportReport(r.id, "pdf"); }}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all"
                  >
                    <FileText className="h-3 w-3" />
                    PDF
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* ─── Modals ─── */}
        {scheduleOpen && <ScheduleModal onClose={() => setScheduleOpen(false)} />}
        
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

export default ReportsAnalytics;
