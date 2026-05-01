import { useState, useMemo, useEffect } from "react";
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
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  initialInvoices, 
  fmtINR, 
  InvoiceRow 
} from "@/data/financeMock";
import { toast } from "sonner";
import { 
  Plus, 
  Download, 
  FileText, 
  Mail, 
  CheckCircle2, 
  XCircle, 
  MoreVertical, 
  Search, 
  Filter, 
  Calendar as CalendarIcon, 
  Eye, 
  ExternalLink,
  ChevronDown,
  FileSpreadsheet,
  FileArchive,
  FileJson,
  X,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parse, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import { jsPDF } from "jspdf";
import JSZip from "jszip";

// ─── Local Storage Key ──────────────────────────────────────────────────────
const STORAGE_KEY = "finance.invoices.v1";

// ─── Components ──────────────────────────────────────────────────────────────

const KpiCard = ({ label, value, count, tone = "default" }: any) => {
  const borderClass = 
    tone === "destructive" ? "border-rose-500/40" : 
    tone === "primary" ? "border-primary/30" : 
    tone === "success" ? "border-emerald-500/40" :
    "border-border";
  
  const valueClass = 
    tone === "destructive" ? "text-rose-600" : 
    tone === "success" ? "text-emerald-600" :
    "text-foreground";

  return (
    <Card className={cn("rounded-2xl bg-card border shadow-soft p-5 transition-all hover:shadow-md", borderClass)}>
      <div className="flex justify-between items-start">
        <p className="uppercase tracking-wider text-[11px] font-bold text-muted-foreground">{label}</p>
        {tone === "destructive" && <AlertCircle className="w-4 h-4 text-rose-500/40" />}
      </div>
      <div className="mt-2.5">
        <h3 className={cn("font-display text-2xl font-black", valueClass)}>{value}</h3>
        {count !== undefined && (
          <p className="text-[10px] font-bold text-muted-foreground/60 mt-1 uppercase tracking-tight">
            Across {count} invoices
          </p>
        )}
      </div>
    </Card>
  );
};

import { AlertCircle } from "lucide-react";

import { useInvoicesStore } from "@/lib/financeStore";

const FinanceInvoices = () => {
  // ─── Store ────────────────────────────────────────────────────────────────
  const { invoices, addInvoice, updateInvoice } = useInvoicesStore();

  // ─── State ────────────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [gstFilter, setGstFilter] = useState("All");
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });

  const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRow | null>(null);

  // New Invoice Form State
  const [newInvoice, setNewInvoice] = useState({
    student: "",
    course: "",
    taxable: 0,
    gst: true,
    date: new Date(),
    due: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    notes: "",
  });

  // (Removed persistence useEffect as it's now in the store)

  // ─── Filtering ────────────────────────────────────────────────────────────
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchesSearch = 
        inv.number.toLowerCase().includes(search.toLowerCase()) ||
        inv.student.toLowerCase().includes(search.toLowerCase()) ||
        inv.course.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = statusFilter === "All" || inv.status === statusFilter;
      
      const matchesGst = 
        gstFilter === "All" || 
        (gstFilter === "GST Only" && inv.gst) || 
        (gstFilter === "Non-GST Only" && !inv.gst);
      
      let matchesDate = true;
      if (dateRange.from || dateRange.to) {
        const invDate = parse(inv.date, "dd MMM yyyy", new Date());
        const start = dateRange.from ? startOfDay(dateRange.from) : new Date(0);
        const end = dateRange.to ? endOfDay(dateRange.to) : new Date(8640000000000000);
        matchesDate = isWithinInterval(invDate, { start, end });
      }

      return matchesSearch && matchesStatus && matchesGst && matchesDate;
    });
  }, [invoices, search, statusFilter, gstFilter, dateRange]);

  // ─── KPIs ─────────────────────────────────────────────────────────────────
  const kpis = useMemo(() => {
    const total = filteredInvoices.reduce((sum, inv) => sum + inv.total, 0);
    const paid = filteredInvoices.filter(i => i.status === "Paid");
    const sent = filteredInvoices.filter(i => i.status === "Sent");
    const overdue = filteredInvoices.filter(i => i.status === "Overdue");

    return {
      total: total,
      paidValue: paid.reduce((sum, inv) => sum + inv.total, 0),
      paidCount: paid.length,
      outstandingValue: sent.reduce((sum, inv) => sum + inv.total, 0),
      outstandingCount: sent.length,
      overdueValue: overdue.reduce((sum, inv) => sum + inv.total, 0),
      overdueCount: overdue.length,
    };
  }, [filteredInvoices]);

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const tax = newInvoice.gst ? Math.round(newInvoice.taxable * 0.18) : 0;
    const total = newInvoice.taxable + tax;
    const number = `INV-2026-${String(invoices.length + 1).padStart(6, "0")}`;

    const invoice: InvoiceRow = {
      number,
      student: newInvoice.student,
      course: newInvoice.course,
      date: format(newInvoice.date, "dd MMM yyyy"),
      due: format(newInvoice.due, "dd MMM yyyy"),
      taxable: newInvoice.taxable,
      tax,
      total,
      gst: newInvoice.gst,
      status: "Draft",
    };

    addInvoice(invoice);
    setIsNewInvoiceOpen(false);
    toast.success(`Invoice ${number} created successfully`);
    // Reset form
    setNewInvoice({
      student: "",
      course: "",
      taxable: 0,
      gst: true,
      date: new Date(),
      due: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      notes: "",
    });
  };

  const updateStatus = (number: string, status: InvoiceRow["status"]) => {
    updateInvoice(number, { status });
    toast.success(`Invoice ${number} marked as ${status}`);
  };

  const handleSend = (inv: InvoiceRow) => {
    updateStatus(inv.number, "Sent");
    toast.info(`Invoice emailed to ${inv.student}`, {
      description: "A tracking link has been included in the email."
    });
  };

  // ─── PDF Generation ───────────────────────────────────────────────────────
  const renderInvoiceToDoc = (doc: jsPDF, inv: InvoiceRow, startY = 20) => {
    const margin = 20;
    let y = startY;

    // Header
    doc.setFontSize(22);
    doc.setTextColor(0, 0, 0);
    doc.text("CODO ACADEMY", margin, y);
    y += 10;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("CODO AI INNOVATIONS PRIVATE LIMITED", margin, y);
    y += 5;
    doc.text("GSTIN: 29AABCC1234L1ZE", margin, y);
    y += 20;

    // Invoice Info
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(`INVOICE: ${inv.number}`, margin, y);
    doc.setFontSize(10);
    doc.text(`Status: ${inv.status}`, 150, y);
    y += 10;
    doc.text(`Date: ${inv.date}`, margin, y);
    doc.text(`Due: ${inv.due}`, 150, y);
    y += 15;

    // Bill To
    doc.setFontSize(12);
    doc.text("BILL TO:", margin, y);
    y += 7;
    doc.setFontSize(10);
    doc.text(inv.student, margin, y);
    y += 5;
    doc.text(`Course: ${inv.course}`, margin, y);
    y += 20;

    // Table Header
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, y, 170, 10, "F");
    doc.text("Description", margin + 5, y + 7);
    doc.text("Amount (INR)", 150, y + 7);
    y += 15;

    // Line Items
    doc.text(inv.course, margin + 5, y);
    doc.text(inv.taxable.toLocaleString("en-IN"), 150, y);
    y += 10;
    doc.line(margin, y, margin + 170, y);
    y += 10;

    // Totals
    const rightAlign = 140;
    doc.text("Taxable Amount:", rightAlign, y);
    doc.text(inv.taxable.toLocaleString("en-IN"), 170, y);
    y += 7;
    if (inv.gst) {
      doc.text("GST (18%):", rightAlign, y);
      doc.text(inv.tax.toLocaleString("en-IN"), 170, y);
      y += 7;
    } else {
      doc.text("GST (Non-GST):", rightAlign, y);
      doc.text("0", 170, y);
      y += 7;
    }
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Grand Total:", rightAlign, y);
    doc.text(`INR ${inv.total.toLocaleString("en-IN")}`, 165, y);
  };

  const generateSinglePDF = (inv: InvoiceRow, save = true) => {
    const doc = new jsPDF();
    renderInvoiceToDoc(doc, inv);
    if (save) {
      doc.save(`${inv.number}.pdf`);
    }
    return doc;
  };

  const handleBulkZip = async () => {
    const zip = new JSZip();
    for (const inv of filteredInvoices) {
      const doc = new jsPDF();
      renderInvoiceToDoc(doc, inv);
      const pdfBlob = doc.output("blob");
      zip.file(`${inv.number}.pdf`, pdfBlob);
    }
    const content = await zip.generateAsync({ type: "blob" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(content);
    link.download = "invoices-bundle.zip";
    link.click();
    toast.success(`ZIP created with ${filteredInvoices.length} invoices`);
  };

  const handleBulkMerged = () => {
    const mainDoc = new jsPDF();
    filteredInvoices.forEach((inv, index) => {
      if (index > 0) mainDoc.addPage();
      renderInvoiceToDoc(mainDoc, inv);
    });
    mainDoc.save("merged-invoices.pdf");
    toast.success(`Merged PDF created for ${filteredInvoices.length} invoices`);
  };

  const handleExportCSV = () => {
    const headers = ["Invoice #", "Student", "Course", "Date", "Due", "Taxable", "Tax", "Total", "GST", "Status"];
    const rows = filteredInvoices.map(i => [
      i.number,
      i.student,
      i.course,
      i.date,
      i.due,
      i.taxable,
      i.tax,
      i.total,
      i.gst ? "Yes" : "No",
      i.status
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "invoices.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV exported successfully");
  };

  return (
    <FinanceLayout
      eyebrow="Module 07"
      title="Invoices & Billing"
      subtitle="Manage all customer invoices and tax documents. Pro-forma billing and automated reminders."
      action={
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-full gap-2 font-bold text-xs uppercase tracking-widest shadow-soft border-border/40 h-10">
                <Download className="w-3.5 h-3.5" />
                Bulk Actions
                <ChevronDown className="w-3.5 h-3.5 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-xl border-border/40 p-2">
              <DropdownMenuItem onClick={handleBulkZip} className="rounded-lg gap-2 cursor-pointer font-medium py-2.5">
                <FileArchive className="w-4 h-4 text-primary" />
                ZIP of PDFs
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleBulkMerged} className="rounded-lg gap-2 cursor-pointer font-medium py-2.5">
                <FileText className="w-4 h-4 text-primary" />
                Single Merged PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportCSV} className="rounded-lg gap-2 cursor-pointer font-medium py-2.5">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                Export CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            onClick={() => setIsNewInvoiceOpen(true)}
            className="rounded-full gap-2 bg-primary hover:bg-primary/90 text-white font-black text-xs uppercase tracking-widest px-6 shadow-xl shadow-primary/20 h-10 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            New Invoice
          </Button>
        </div>
      }
    >
      <div className="space-y-8 animate-fade-in">
        
        {/* 1. KPI STRIP */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard 
            label="Total Invoiced" 
            value={fmtINR(kpis.total)} 
            count={filteredInvoices.length}
            tone="primary"
          />
          <KpiCard 
            label="Paid" 
            value={fmtINR(kpis.paidValue)} 
            count={kpis.paidCount}
            tone="success"
          />
          <KpiCard 
            label="Outstanding" 
            value={fmtINR(kpis.outstandingValue)} 
            count={kpis.outstandingCount}
          />
          <KpiCard 
            label="Overdue" 
            value={fmtINR(kpis.overdueValue)} 
            count={kpis.overdueCount}
            tone="destructive"
          />
        </div>

        {/* 2. FILTERS & SEARCH */}
        <Card className="p-4 rounded-2xl border-none shadow-soft bg-card/50 backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full lg:w-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
              <Input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search invoice #, student or course..."
                className="h-11 pl-11 pr-10 rounded-full bg-background border-border/40 focus:ring-primary/20 transition-all"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full">
                  <X className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-center lg:justify-end">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px] h-10 rounded-full bg-background border-border/40 font-bold text-[11px] uppercase tracking-wider">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/40 shadow-xl">
                  {["All", "Paid", "Sent", "Overdue", "Draft", "Cancelled"].map(s => (
                    <SelectItem key={s} value={s} className="rounded-lg cursor-pointer">{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={gstFilter} onValueChange={setGstFilter}>
                <SelectTrigger className="w-[150px] h-10 rounded-full bg-background border-border/40 font-bold text-[11px] uppercase tracking-wider">
                  <SelectValue placeholder="GST Mode" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/40 shadow-xl">
                  {["All", "GST Only", "Non-GST Only"].map(g => (
                    <SelectItem key={g} value={g} className="rounded-lg cursor-pointer">{g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-10 rounded-full border-border/40 bg-background font-bold text-[11px] uppercase tracking-wider gap-2 px-5">
                    <CalendarIcon className="w-3.5 h-3.5 opacity-50" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd")} - {format(dateRange.to, "LLL dd")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd")
                      )
                    ) : (
                      "Date Range"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-2xl border-border/40 shadow-2xl" align="end">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange.from}
                    selected={{ from: dateRange.from, to: dateRange.to }}
                    onSelect={(range: any) => setDateRange(range || { from: undefined, to: undefined })}
                    numberOfMonths={2}
                  />
                  {(dateRange.from || dateRange.to) && (
                    <div className="p-3 border-t border-border/40 flex justify-end">
                      <Button variant="ghost" size="sm" onClick={() => setDateRange({ from: undefined, to: undefined })} className="text-[10px] uppercase font-black tracking-widest text-muted-foreground hover:text-foreground">
                        Clear Dates
                      </Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </Card>

        {/* 3. TABLE */}
        <Card className="rounded-2xl border-none shadow-soft overflow-hidden bg-card">
          <div className="px-6 py-5 border-b border-border/40 flex items-center justify-between bg-muted/5">
            <div>
              <h3 className="text-lg font-black tracking-tight font-serif text-foreground">Invoice Ledger</h3>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">Search and manage student billing history</p>
            </div>
            <Pill variant="soft" className="px-3 py-1 font-black uppercase text-[9px] tracking-widest">
              {filteredInvoices.length} entries found
            </Pill>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border/40">
                  <TableHead className="text-[10px] font-black uppercase tracking-widest pl-6 py-4">Invoice #</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">Student & Course</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-right">Taxable</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-right">Tax (GST)</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-right">Total amount</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">Date / Due</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">Compliance</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">Status</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.length > 0 ? (
                  filteredInvoices.map((inv) => (
                    <TableRow 
                      key={inv.number} 
                      className="cursor-pointer hover:bg-muted/40 transition-colors border-border/40 group"
                      onClick={() => {
                        setSelectedInvoice(inv);
                        setIsDetailOpen(true);
                      }}
                    >
                      <TableCell className="pl-6 py-5">
                        <div className="flex flex-col gap-0.5">
                          <p className="font-mono text-[11px] font-bold text-foreground">{inv.number}</p>
                          <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-tight">Tax Invoice</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-black text-foreground">{inv.student}</span>
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">{inv.course}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-xs font-bold text-muted-foreground/60">
                        {inv.taxable.toLocaleString("en-IN")}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-xs font-bold text-muted-foreground/60">
                        {inv.tax > 0 ? `₹${inv.tax.toLocaleString("en-IN")}` : "₹0"}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-sm font-black text-foreground">
                        {fmtINR(inv.total)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-0.5">
                          <p className="text-xs font-bold text-foreground">{inv.date}</p>
                          <p className={cn(
                            "text-[9px] font-bold uppercase tracking-tight",
                            inv.status === "Overdue" ? "text-rose-500" : "text-muted-foreground/40"
                          )}>
                            Due: {inv.due}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {inv.gst ? (
                          <div className="flex items-center gap-1.5 text-emerald-600">
                            <CheckCircle2 className="w-3 h-3" />
                            <span className="text-[9px] font-black uppercase tracking-tight">GST REG.</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-muted-foreground/40">
                            <Clock className="w-3 h-3" />
                            <span className="text-[9px] font-black uppercase tracking-tight">NON-GST</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Pill 
                          variant={
                            inv.status === "Paid" ? "success" :
                            inv.status === "Sent" ? "primary" :
                            inv.status === "Overdue" ? "danger" :
                            inv.status === "Cancelled" ? "soft" : "default"
                          }
                          size="sm"
                          className="font-black uppercase text-[9px] tracking-wider px-2.5"
                        >
                          {inv.status}
                        </Pill>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex items-center justify-end gap-1">
                          <Button 
                            variant="ghost" size="icon" 
                            className="h-8 w-8 rounded-full text-muted-foreground/40 hover:text-foreground hover:bg-muted transition-all"
                            onClick={(e) => {
                              e.stopPropagation();
                              generateSinglePDF(inv);
                            }}
                          >
                            <Download className="w-3.5 h-3.5" />
                          </Button>
                          <Button 
                            variant="ghost" size="icon" 
                            className="h-8 w-8 rounded-full text-muted-foreground/40 hover:text-primary hover:bg-primary/5 transition-all"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSend(inv);
                            }}
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </Button>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="ghost" size="icon" 
                                className="h-8 w-8 rounded-full text-muted-foreground/40 hover:text-foreground hover:bg-muted"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVertical className="w-3.5 h-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44 rounded-xl shadow-xl border-border/40 p-1.5">
                              <DropdownMenuItem 
                                onClick={() => {
                                  setSelectedInvoice(inv);
                                  setIsDetailOpen(true);
                                }}
                                className="rounded-lg gap-2 cursor-pointer py-2 text-xs font-bold"
                              >
                                <Eye className="w-3.5 h-3.5 opacity-50" />
                                View details
                              </DropdownMenuItem>
                              {inv.status !== "Paid" && (
                                <DropdownMenuItem 
                                  onClick={() => updateStatus(inv.number, "Paid")}
                                  className="rounded-lg gap-2 cursor-pointer py-2 text-xs font-bold text-emerald-600"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  Mark as Paid
                                </DropdownMenuItem>
                              )}
                              {inv.status !== "Cancelled" && (
                                <DropdownMenuItem 
                                  onClick={() => updateStatus(inv.number, "Cancelled")}
                                  className="rounded-lg gap-2 cursor-pointer py-2 text-xs font-bold text-rose-600"
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                  Cancel Invoice
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="h-48 text-center">
                      <div className="flex flex-col items-center justify-center gap-3 grayscale opacity-30">
                        <FileText className="w-12 h-12" />
                        <p className="text-sm font-bold uppercase tracking-widest italic">No invoices matching filters</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* 4. FOOTER NOTE */}
        <p className="italic text-[11px] text-muted-foreground/50 text-center max-w-2xl mx-auto leading-relaxed">
          GST calculated at 18% for all registered courses. Compliance verified for FY 2026-27. <br />
          Single source of truth for all student billing. Overdue invoices auto-reminder scheduled every 48h.
        </p>

        {/* ─── New Invoice Dialog ─── */}
        <Dialog open={isNewInvoiceOpen} onOpenChange={setIsNewInvoiceOpen}>
          <DialogContent className="sm:max-w-[500px] p-0 rounded-3xl overflow-hidden border-none shadow-2xl bg-card">
            <form onSubmit={handleCreateInvoice}>
              <div className="p-8 border-b border-border/40 bg-muted/5">
                <DialogTitle className="font-display text-2xl font-black tracking-tight text-foreground">Create New Invoice</DialogTitle>
                <DialogDescription className="text-sm font-medium text-muted-foreground mt-1.5">
                  Generate a tax-compliant document for student payment.
                </DialogDescription>
              </div>

              <div className="p-8 space-y-5">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Student name</Label>
                  <Input 
                    required
                    value={newInvoice.student}
                    onChange={(e) => setNewInvoice(prev => ({ ...prev, student: e.target.value }))}
                    placeholder="e.g. Aanya Sharma"
                    className="h-11 rounded-xl bg-muted/30 border-border/40 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Course name</Label>
                  <Select 
                    required
                    value={newInvoice.course}
                    onValueChange={(val) => setNewInvoice(prev => ({ ...prev, course: val }))}
                  >
                    <SelectTrigger className="h-11 rounded-xl bg-muted/30 border-border/40">
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border/40 shadow-xl">
                      {["Full Stack Pro", "Python Backend", "UI/UX Mastery", "Data Science Pro", "Web Development Pro"].map(c => (
                        <SelectItem key={c} value={c} className="rounded-lg">{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Taxable amount (₹)</Label>
                    <Input 
                      required
                      type="number"
                      value={newInvoice.taxable}
                      onChange={(e) => setNewInvoice(prev => ({ ...prev, taxable: parseInt(e.target.value) || 0 }))}
                      className="h-11 rounded-xl bg-muted/30 border-border/40 focus:ring-primary/20"
                    />
                  </div>
                  <div className="flex flex-col gap-2 justify-center pt-5">
                    <div className="flex items-center space-x-3">
                      <Switch 
                        id="gst-mode" 
                        checked={newInvoice.gst}
                        onCheckedChange={(checked) => setNewInvoice(prev => ({ ...prev, gst: checked }))}
                      />
                      <Label htmlFor="gst-mode" className="text-xs font-bold cursor-pointer">
                        Apply GST (18%)
                      </Label>
                    </div>
                    <p className="text-[9px] font-bold text-muted-foreground/60 italic ml-1">
                      Total: {fmtINR(newInvoice.taxable + (newInvoice.gst ? Math.round(newInvoice.taxable * 0.18) : 0))}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Issue date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full h-11 justify-start font-medium text-xs rounded-xl bg-muted/30 border-border/40 gap-3">
                          <CalendarIcon className="w-4 h-4 opacity-40" />
                          {format(newInvoice.date, "dd MMM yyyy")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 rounded-2xl border-border/40 shadow-2xl">
                        <Calendar
                          mode="single"
                          selected={newInvoice.date}
                          onSelect={(date) => date && setNewInvoice(prev => ({ ...prev, date }))}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Due date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full h-11 justify-start font-medium text-xs rounded-xl bg-muted/30 border-border/40 gap-3">
                          <CalendarIcon className="w-4 h-4 opacity-40" />
                          {format(newInvoice.due, "dd MMM yyyy")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 rounded-2xl border-border/40 shadow-2xl">
                        <Calendar
                          mode="single"
                          selected={newInvoice.due}
                          onSelect={(date) => date && setNewInvoice(prev => ({ ...prev, due: date }))}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Notes</Label>
                  <Textarea 
                    value={newInvoice.notes}
                    onChange={(e) => setNewInvoice(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Internal reference or billing notes..."
                    className="rounded-xl bg-muted/30 border-border/40 min-h-[80px]"
                  />
                </div>
              </div>

              <div className="p-8 border-t border-border/40 bg-muted/5 flex justify-end gap-3">
                <Button 
                  type="button"
                  variant="ghost" 
                  onClick={() => setIsNewInvoiceOpen(false)}
                  className="rounded-full px-6 font-bold text-xs uppercase tracking-widest text-muted-foreground"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="rounded-full px-8 bg-primary hover:bg-primary/90 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 transition-all active:scale-95"
                >
                  Create Invoice
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* ─── Detail Dialog ─── */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="sm:max-w-2xl p-0 rounded-3xl overflow-hidden border-none shadow-2xl bg-card max-h-[90vh] flex flex-col">
            {selectedInvoice && (
              <>
                <div className="p-8 border-b border-border/40 bg-muted/5 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <Pill 
                        variant={
                          selectedInvoice.status === "Paid" ? "success" :
                          selectedInvoice.status === "Sent" ? "primary" :
                          selectedInvoice.status === "Overdue" ? "danger" :
                          selectedInvoice.status === "Cancelled" ? "soft" : "default"
                        }
                        size="sm"
                        className="font-black uppercase text-[10px] tracking-wider"
                      >
                        {selectedInvoice.status}
                      </Pill>
                      {selectedInvoice.gst && (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          <span className="text-[9px] font-black uppercase tracking-tight">GST COMPLIANT</span>
                        </div>
                      )}
                    </div>
                    <DialogTitle className="font-display text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
                      {selectedInvoice.number}
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => generateSinglePDF(selectedInvoice)}>
                        <Download className="w-4 h-4 opacity-50" />
                      </Button>
                    </DialogTitle>
                    <p className="text-xs font-medium text-muted-foreground mt-1">
                      Issued on {selectedInvoice.date} · Due by {selectedInvoice.due}
                    </p>
                  </div>
                  <button onClick={() => setIsDetailOpen(false)} className="p-2 rounded-full hover:bg-muted transition-colors">
                    <X className="w-5 h-5 text-muted-foreground/40" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                  {/* Bill To section */}
                  <div className="grid grid-cols-2 gap-10">
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mb-4 px-1">Bill To</h4>
                      <div className="rounded-2xl border border-border/40 bg-muted/30 p-5">
                        <p className="text-lg font-black text-foreground">{selectedInvoice.student}</p>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-tight mt-1">{selectedInvoice.course}</p>
                        <div className="mt-4 pt-4 border-t border-border/10">
                          <p className="text-[10px] font-bold text-muted-foreground/60 uppercase">Reference</p>
                          <p className="text-xs font-mono font-bold text-foreground mt-0.5">ORD-2026-92831</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mb-4 px-1">Academy Details</h4>
                      <div className="rounded-2xl border border-border/40 bg-muted/30 p-5 space-y-1">
                        <p className="text-xs font-black text-foreground uppercase tracking-tight">CODO Academy India</p>
                        <p className="text-[10px] font-medium text-muted-foreground leading-relaxed">
                          Whitefield Main Road, ITPL Back Gate,<br />
                          Bengaluru, Karnataka 560066<br />
                          GSTIN: 29AABCC1234L1ZE
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Line items section */}
                  <div className="rounded-2xl border border-border/40 overflow-hidden">
                    <Table>
                      <TableHeader className="bg-muted/30">
                        <TableRow className="hover:bg-transparent border-border/40">
                          <TableHead className="text-[9px] font-black uppercase tracking-widest py-3">Description</TableHead>
                          <TableHead className="text-[9px] font-black uppercase tracking-widest text-right">Quantity</TableHead>
                          <TableHead className="text-[9px] font-black uppercase tracking-widest text-right">Rate</TableHead>
                          <TableHead className="text-[9px] font-black uppercase tracking-widest text-right">Taxable</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow className="hover:bg-transparent border-border/10">
                          <TableCell className="py-4 font-bold text-xs">
                            {selectedInvoice.course} 
                            <p className="text-[10px] font-medium text-muted-foreground mt-0.5 tracking-tight uppercase">Platform Subscription & Learning Path</p>
                          </TableCell>
                          <TableCell className="text-right tabular-nums text-xs font-medium">1</TableCell>
                          <TableCell className="text-right tabular-nums text-xs font-medium">{selectedInvoice.taxable.toLocaleString("en-IN")}</TableCell>
                          <TableCell className="text-right tabular-nums text-xs font-black">{selectedInvoice.taxable.toLocaleString("en-IN")}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  {/* Totals section */}
                  <div className="flex justify-end">
                    <div className="w-64 space-y-3">
                      <div className="flex justify-between items-center text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                        <span>Taxable amount</span>
                        <span className="tabular-nums">₹{selectedInvoice.taxable.toLocaleString("en-IN")}</span>
                      </div>
                      {selectedInvoice.gst ? (
                        <>
                          <div className="flex justify-between items-center text-[10px] font-medium text-muted-foreground/60 italic ml-2">
                            <span>CGST 9%</span>
                            <span className="tabular-nums">₹{(selectedInvoice.tax / 2).toLocaleString("en-IN")}</span>
                          </div>
                          <div className="flex justify-between items-center text-[10px] font-medium text-muted-foreground/60 italic ml-2">
                            <span>SGST 9%</span>
                            <span className="tabular-nums">₹{(selectedInvoice.tax / 2).toLocaleString("en-IN")}</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex justify-between items-center text-[10px] font-medium text-muted-foreground/40 italic ml-2">
                          <span>Non-GST</span>
                          <span className="tabular-nums">₹0</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center pt-3 border-t border-border/40">
                        <span className="text-[12px] font-black uppercase tracking-widest text-foreground">Grand Total</span>
                        <span className="text-2xl font-black tabular-nums text-primary">{fmtINR(selectedInvoice.total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action row at bottom */}
                  <div className="flex flex-wrap gap-3 pt-6 border-t border-border/10">
                    {selectedInvoice.status === "Draft" && (
                      <Button 
                        onClick={() => handleSend(selectedInvoice)}
                        className="rounded-full gap-2 bg-primary hover:bg-primary/90 text-white font-black text-[10px] uppercase tracking-widest h-10 px-6"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        Send to Student
                      </Button>
                    )}
                    {selectedInvoice.status !== "Paid" && selectedInvoice.status !== "Cancelled" && (
                      <Button 
                        variant="outline"
                        onClick={() => updateStatus(selectedInvoice.number, "Paid")}
                        className="rounded-full gap-2 border-emerald-500/40 hover:bg-emerald-500/10 text-emerald-600 font-black text-[10px] uppercase tracking-widest h-10 px-6"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Mark as Paid
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      onClick={() => generateSinglePDF(selectedInvoice)}
                      className="rounded-full gap-2 border-border/40 hover:bg-muted text-foreground font-black text-[10px] uppercase tracking-widest h-10 px-6 ml-auto"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download PDF
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

      </div>
    </FinanceLayout>
  );
};

export default FinanceInvoices;
