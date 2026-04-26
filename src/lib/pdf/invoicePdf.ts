import { jsPDF } from "jspdf";

type InvoiceStatus = "Paid" | "Pending" | "Failed";

interface InvoiceTransaction {
  invoiceId: string;
  date: string;
  description: string;
  amount: number;
  method: string;
  txnId: string;
  status: InvoiceStatus;
}

interface InvoiceGeneratorInput {
  studentName: string;
  courseName: string;
  category: string;
  transaction: InvoiceTransaction;
}

const currency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export function downloadInvoicePdf({
  studentName,
  courseName,
  category,
  transaction,
}: InvoiceGeneratorInput) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 48;

  const brandGreen: [number, number, number] = [20, 89, 63];
  const textDark: [number, number, number] = [24, 35, 31];
  const textMuted: [number, number, number] = [102, 112, 105];
  const border: [number, number, number] = [222, 218, 206];

  // Header
  doc.setFillColor(...brandGreen);
  doc.rect(0, 0, pageWidth, 92, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("CODO LMS", margin, 42);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("Official Payment Invoice", margin, 62);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("INVOICE", pageWidth - margin, 42, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(transaction.invoiceId, pageWidth - margin, 62, { align: "right" });

  let y = 126;

  // Bill to + metadata block
  doc.setDrawColor(...border);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 140, 10, 10, "FD");

  doc.setTextColor(...textMuted);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("BILL TO", margin + 16, y + 24);
  doc.text("COURSE", margin + 16, y + 72);

  doc.text("DATE", pageWidth / 2 + 10, y + 24);
  doc.text("PAYMENT METHOD", pageWidth / 2 + 10, y + 48);
  doc.text("TRANSACTION ID", pageWidth / 2 + 10, y + 72);
  doc.text("STATUS", pageWidth / 2 + 10, y + 96);

  doc.setTextColor(...textDark);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(studentName, margin + 16, y + 42);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`${courseName} (${category})`, margin + 16, y + 90);

  doc.text(transaction.date, pageWidth / 2 + 10, y + 24);
  doc.text(transaction.method, pageWidth / 2 + 10, y + 48);
  doc.text(transaction.txnId, pageWidth / 2 + 10, y + 72);

  const statusColor: Record<InvoiceStatus, [number, number, number]> = {
    Paid: [26, 140, 99],
    Pending: [242, 162, 43],
    Failed: [225, 61, 61],
  };
  const [sr, sg, sb] = statusColor[transaction.status];
  doc.setTextColor(sr, sg, sb);
  doc.setFont("helvetica", "bold");
  doc.text(transaction.status, pageWidth / 2 + 10, y + 96);

  y += 170;

  // Line item table
  doc.setTextColor(...textDark);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Line Items", margin, y);

  y += 16;
  doc.setDrawColor(...border);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 92, 8, 8, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...textMuted);
  doc.text("DESCRIPTION", margin + 16, y + 20);
  doc.text("AMOUNT", pageWidth - margin - 16, y + 20, { align: "right" });

  doc.setDrawColor(...border);
  doc.line(margin + 12, y + 28, pageWidth - margin - 12, y + 28);

  doc.setTextColor(...textDark);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(transaction.description, margin + 16, y + 52);

  doc.setFont("helvetica", "bold");
  doc.text(currency(transaction.amount), pageWidth - margin - 16, y + 52, {
    align: "right",
  });

  y += 120;

  // Total block
  doc.setFillColor(250, 248, 242);
  doc.roundedRect(pageWidth - margin - 220, y, 220, 72, 10, 10, "F");

  doc.setTextColor(...textMuted);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("TOTAL PAID", pageWidth - margin - 204, y + 24);

  doc.setTextColor(...textDark);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text(currency(transaction.amount), pageWidth - margin - 16, y + 50, {
    align: "right",
  });

  // Footer
  doc.setTextColor(...textMuted);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(
    "This is a system-generated invoice and does not require a physical signature.",
    margin,
    doc.internal.pageSize.getHeight() - 34,
  );

  doc.save(`${transaction.invoiceId}.pdf`);
}
