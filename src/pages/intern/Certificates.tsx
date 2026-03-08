import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Award, CheckCircle2, Calendar, User, Download,
  Building2, Clock, ShieldCheck, Star,
} from "lucide-react";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const certificateData = {
  available: true,
  status: "Available" as const,
  completionDate: "March 30, 2026",
  approvedBy: "Admin",
  internName: "Alex Johnson",
  internshipTitle: "Full Stack Development Internship",
  duration: "January 2026 – March 2026 (3 Months)",
  issuedBy: "Codo Academy",
  issueDate: "April 01, 2026",
  certificateId: "CODO-CERT-2026-0042",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const InternCertificates = () => {
  const { available } = certificateData;

  const handleDownload = () => {
    // Backend integration point — PDF download will be wired here
    alert("Certificate download will be available once connected to the backend.");
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6 max-w-3xl mx-auto pb-10">

        {/* ── Page Header ── */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">Certificates</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            View and download your internship completion certificate.
          </p>
        </div>

        {/* ─────────────────────────────────────────────
            Section 1: Certificate Status
        ───────────────────────────────────────────── */}
        <Card className="border-border/50 shadow-sm rounded-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              Certificate Status
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            {available ? (
              <>
                {/* Status row */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-emerald-700">Certificate Available</p>
                    <p className="text-xs text-emerald-600/70 mt-0.5">Your certificate is ready to download.</p>
                  </div>
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] font-semibold">
                    Available
                  </Badge>
                </div>

                {/* Detail fields */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { icon: Calendar, label: "Completion Date", value: certificateData.completionDate },
                    { icon: User, label: "Approved By", value: certificateData.approvedBy },
                    { icon: Award, label: "Certificate ID", value: certificateData.certificateId },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-2.5 p-3 rounded-lg border border-border/40 bg-muted/20">
                      <Icon className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
                        <p className="text-sm font-medium mt-0.5">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              /* Not available state */
              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30 border border-border/40">
                <Clock className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold">Not Available Yet</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Certificate will be issued after internship completion and admin approval.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ─────────────────────────────────────────────
            Section 2: Certificate Preview
        ───────────────────────────────────────────── */}
        {available && (
          <Card className="border-border/50 shadow-sm rounded-xl overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                Certificate Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">

              {/* Certificate artwork */}
              <div className="relative rounded-xl border-2 border-amber-400/40 bg-gradient-to-br from-amber-50/60 via-background to-amber-50/30 dark:from-amber-950/20 dark:via-background dark:to-amber-950/10 p-8 text-center space-y-5 overflow-hidden">

                {/* Decorative corner stars */}
                <Star className="absolute top-3 left-3 w-5 h-5 text-amber-300/60 fill-amber-300/40" />
                <Star className="absolute top-3 right-3 w-5 h-5 text-amber-300/60 fill-amber-300/40" />
                <Star className="absolute bottom-3 left-3 w-5 h-5 text-amber-300/60 fill-amber-300/40" />
                <Star className="absolute bottom-3 right-3 w-5 h-5 text-amber-300/60 fill-amber-300/40" />

                {/* Logo / Issuer */}
                <div className="flex items-center justify-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-400/30 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-amber-600" />
                  </div>
                  <p className="text-sm font-bold tracking-wide text-amber-700 dark:text-amber-400 uppercase">
                    {certificateData.issuedBy}
                  </p>
                </div>

                {/* Title */}
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">
                    Certificate of Completion
                  </p>
                  <div className="w-16 h-px bg-amber-400/40 mx-auto" />
                </div>

                {/* Body text */}
                <div className="space-y-2 max-w-md mx-auto">
                  <p className="text-xs text-muted-foreground">This certifies that</p>
                  <p className="text-2xl font-bold tracking-tight text-foreground">
                    {certificateData.internName}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    has successfully completed the
                  </p>
                  <p className="text-base font-semibold text-amber-700 dark:text-amber-400">
                    {certificateData.internshipTitle}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {certificateData.duration}
                  </p>
                </div>

                {/* Separator */}
                <div className="flex items-center gap-3 max-w-xs mx-auto">
                  <div className="flex-1 h-px bg-border/50" />
                  <Award className="w-4 h-4 text-amber-400" />
                  <div className="flex-1 h-px bg-border/50" />
                </div>

                {/* Footer meta */}
                <div className="grid grid-cols-2 gap-4 text-xs max-w-sm mx-auto">
                  <div className="text-center">
                    <p className="text-muted-foreground">Issue Date</p>
                    <p className="font-semibold mt-0.5">{certificateData.issueDate}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground">Issued By</p>
                    <p className="font-semibold mt-0.5">{certificateData.approvedBy}</p>
                  </div>
                </div>

                {/* Certificate ID */}
                <p className="text-[10px] text-muted-foreground/60 font-mono tracking-wider">
                  ID: {certificateData.certificateId}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ─────────────────────────────────────────────
            Section 3: Download Button
        ───────────────────────────────────────────── */}
        {available && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Button className="gap-2" onClick={handleDownload}>
              <Download className="w-4 h-4" />
              Download Certificate (PDF)
            </Button>
            <p className="text-xs text-muted-foreground">
              PDF download · Certificate ID: {certificateData.certificateId}
            </p>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default InternCertificates;
