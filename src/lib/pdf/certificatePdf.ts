import { jsPDF } from "jspdf";

interface CertificatePdfInput {
  certificateId: string;
  courseName: string;
  issueDate: string;
  credentialId: string;
  studentName: string;
}

export function downloadCertificatePdf({
  certificateId,
  courseName,
  issueDate,
  credentialId,
  studentName,
}: CertificatePdfInput) {
  const doc = new jsPDF({ unit: "pt", format: "a4", orientation: "landscape" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const green: [number, number, number] = [20, 89, 63];
  const dark: [number, number, number] = [26, 38, 33];
  const muted: [number, number, number] = [98, 108, 102];
  const border: [number, number, number] = [222, 218, 206];

  doc.setFillColor(251, 248, 242);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  doc.setDrawColor(...border);
  doc.setLineWidth(2);
  doc.roundedRect(34, 34, pageWidth - 68, pageHeight - 68, 18, 18, "S");

  doc.setDrawColor(...green);
  doc.setLineWidth(1);
  doc.roundedRect(50, 50, pageWidth - 100, pageHeight - 100, 14, 14, "S");

  doc.setTextColor(...green);
  doc.setFont("times", "bold");
  doc.setFontSize(18);
  doc.text("CODO LMS", pageWidth / 2, 86, { align: "center" });

  doc.setTextColor(...dark);
  doc.setFont("times", "bold");
  doc.setFontSize(36);
  doc.text("Certificate of Completion", pageWidth / 2, 146, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(15);
  doc.setTextColor(...muted);
  doc.text("This certifies that", pageWidth / 2, 186, { align: "center" });

  doc.setTextColor(...green);
  doc.setFont("times", "bold");
  doc.setFontSize(34);
  doc.text(studentName, pageWidth / 2, 236, { align: "center" });

  doc.setDrawColor(...border);
  doc.line(pageWidth / 2 - 200, 250, pageWidth / 2 + 200, 250);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(15);
  doc.setTextColor(...muted);
  doc.text("has successfully completed", pageWidth / 2, 282, { align: "center" });

  doc.setTextColor(...dark);
  doc.setFont("times", "bold");
  doc.setFontSize(30);
  doc.text(courseName, pageWidth / 2, 328, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(13);
  doc.setTextColor(...muted);
  doc.text(`Issued on ${issueDate}`, pageWidth / 2, 368, { align: "center" });

  doc.setDrawColor(...border);
  doc.line(90, pageHeight - 118, pageWidth - 90, pageHeight - 118);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...dark);
  doc.text(`Credential ID: ${credentialId}`, 92, pageHeight - 94);
  doc.text(`Certificate ID: ${certificateId}`, 92, pageHeight - 74);

  doc.setTextColor(...green);
  doc.text("Authorized by CODO LMS", pageWidth - 92, pageHeight - 94, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...muted);
  doc.text("Digitally generated certificate", pageWidth - 92, pageHeight - 74, { align: "right" });

  doc.save(`${credentialId}.pdf`);
}
