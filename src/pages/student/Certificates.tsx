import DashboardLayout from "@/components/DashboardLayout";
import { Download, Award } from "lucide-react";
import CourseCard from "@/components/student/CourseCard";
import PageSearch from "@/components/shared/PageSearch";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { studentData } from "@/data/studentData";
import { downloadCertificatePdf } from "@/lib/pdf/certificatePdf";

// Mock Certificates Data
const CERTIFICATES = [
  {
    id: "FSD-2026-001",
    courseName: "Python Basics",
    issueDate: "18 Apr 2026",
    credentialId: "CODO-PY-8842",
    category: "COMPLETED",
  },
  {
    id: "HTML-2026-720",
    courseName: "HTML & CSS Mastery",
    issueDate: "02 Mar 2026",
    credentialId: "CODO-WEB-7201",
    category: "COMPLETED",
  },
  {
    id: "DATA-2026-905",
    courseName: "Data Science for Beginners",
    issueDate: "15 Jan 2026",
    credentialId: "CODO-DS-9054",
    category: "COMPLETED",
  }
];

const StudentCertificates = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [previewCertId, setPreviewCertId] = useState<string | null>(null);

  const filteredCertificates = useMemo(() => {
    return CERTIFICATES.filter(cert => 
      cert.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.credentialId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const previewCertificate = useMemo(
    () => CERTIFICATES.find((cert) => cert.id === previewCertId) || null,
    [previewCertId],
  );

  const handleDownload = (cert: (typeof CERTIFICATES)[number]) => {
    downloadCertificatePdf({
      certificateId: cert.id,
      courseName: cert.courseName,
      issueDate: cert.issueDate,
      credentialId: cert.credentialId,
      studentName: studentData.profile.name,
    });
    toast.success(`${cert.courseName} certificate downloaded`);
  };

  return (
    <DashboardLayout>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 mx-auto w-full max-w-7xl space-y-8 px-4 md:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="space-y-2 text-left">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">
            My Certificates
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            Download and share the certificates you've earned across your completed courses.
          </p>
        </div>

        {/* Search Bar - Standardized PageSearch */}
        <PageSearch
          placeholder="Search certificates by course name or ID..."
          onSearch={setSearchQuery}
          className="mb-6"
        />

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 gap-4 pb-12 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6">
          {filteredCertificates.map((cert) => (
            <CourseCard
              key={cert.id}
              title={cert.courseName}
              topLabel="Certificate of Completion"
              category={cert.category}
              duration={`Issued ${cert.issueDate} - ${cert.credentialId}`}
              showProgress={false}
              icon={Award}
              detailsText="Preview"
              actionText="Download"
              actionIcon={Download}
              onDetailsClick={() => {
                setPreviewCertId(cert.id);
              }}
              onActionClick={() => {
                handleDownload(cert);
              }}
            />
          ))}

          {filteredCertificates.length === 0 && (
            <div className="col-span-full py-20 text-center bg-muted/20 rounded-3xl border border-dashed border-border/50">
              <p className="text-muted-foreground font-medium text-sm">No certificates found matching your search.</p>
            </div>
          )}
        </div>

        <Dialog open={!!previewCertificate} onOpenChange={(open) => !open && setPreviewCertId(null)}>
          <DialogContent className="max-w-4xl rounded-3xl">
            <DialogHeader>
              <DialogTitle>Certificate Preview</DialogTitle>
            </DialogHeader>
            {previewCertificate ? (
              <div className="space-y-5">
                <div className="rounded-2xl border border-border/70 bg-gradient-to-br from-card via-card to-muted/20 p-6 sm:p-8">
                  <div className="mx-auto max-w-3xl rounded-2xl border border-primary/20 bg-background/80 p-6 text-center shadow-soft sm:p-8">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">CODO LMS</p>
                    <h3 className="mt-3 font-display text-3xl text-foreground sm:text-4xl">Certificate of Completion</h3>
                    <p className="mt-5 text-sm text-muted-foreground">This certifies that</p>
                    <p className="mt-2 font-display text-3xl text-primary sm:text-4xl">{studentData.profile.name}</p>
                    <p className="mt-5 text-sm text-muted-foreground">has successfully completed</p>
                    <p className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">{previewCertificate.courseName}</p>
                    <div className="mx-auto mt-6 h-px w-full max-w-md bg-border" />
                    <p className="mt-4 text-sm text-muted-foreground">Issued on {previewCertificate.issueDate}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                      Credential ID: {previewCertificate.credentialId}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                  <Button variant="outline" onClick={() => setPreviewCertId(null)}>
                    Close
                  </Button>
                  <Button onClick={() => handleDownload(previewCertificate)}>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                </div>
              </div>
            ) : null}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default StudentCertificates;
