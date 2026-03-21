import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Award, CheckCircle2, Calendar, User, Download,
  Building2, Clock, ShieldCheck, Star,
} from "lucide-react";

// ─── Mock Data ────────────────────────────────────────────────────────────────

type InternshipStatus = "In Progress" | "Completed";

const certificateData = {
  available: true,
  status: "Available" as const,
  internshipStatus: "Completed" as InternshipStatus, // Show "Completed" (Available) state by default
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
  const isCompleted = certificateData.internshipStatus === "Completed";
  const available = isCompleted;

  const handleDownload = () => {
    // Backend integration point — PDF download will be wired here
    alert("Certificate download will be available once connected to the backend.");
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6 max-w-6xl mx-auto px-4 md:px-6 lg:px-8 pb-10">

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
                <div className="flex items-center gap-4 p-5 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/20 shadow-sm transition-all hover:bg-emerald-500/15">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 animate-pulse">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-bold text-emerald-800 dark:text-emerald-400">Certificate Available</p>
                    <p className="text-sm text-emerald-700/80 mt-0.5 font-medium">Your certificate is ready to download.</p>
                  </div>
                  <Badge className="bg-emerald-600 text-white border-none px-3 py-1 font-bold shadow-md">
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
                  <p className="text-sm font-semibold text-muted-foreground font-bold">Not Available</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Certificate not available yet.
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
          <Card className="border-border/50 shadow-md rounded-2xl overflow-hidden bg-card/40 backdrop-blur-sm">
            <CardHeader className="pb-4 px-6 pt-6 border-b border-border/10 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                Certificate Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-8 pt-4">
              {certificateData.internshipStatus === "Completed" ? (
                /* Unlocked Artwork - Full Width */
                <div className="relative w-full rounded-2xl border-[3px] border-amber-400/30 bg-gradient-to-br from-amber-50/80 via-background to-amber-50/40 dark:from-amber-950/20 dark:via-background dark:to-amber-950/10 p-12 text-center space-y-8 overflow-hidden shadow-xl">
                  {/* Decorative corner stars */}
                  <Star className="absolute top-4 left-4 w-6 h-6 text-amber-300/40 fill-amber-300/20" />
                  <Star className="absolute top-4 right-4 w-6 h-6 text-amber-300/40 fill-amber-300/20" />
                  <Star className="absolute bottom-4 left-4 w-6 h-6 text-amber-300/40 fill-amber-300/20" />
                  <Star className="absolute bottom-4 right-4 w-6 h-6 text-amber-300/40 fill-amber-300/20" />

                  {/* Logo / Issuer */}
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-400/30 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-amber-600" />
                    </div>
                    <p className="text-base font-bold tracking-widest text-amber-700 dark:text-amber-400 uppercase">
                      {certificateData.issuedBy}
                    </p>
                  </div>

                  {/* Title */}
                  <div className="space-y-1.5">
                    <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-semibold">
                      Certificate of Completion
                    </p>
                    <div className="w-24 h-px bg-amber-400/40 mx-auto" />
                  </div>

                  {/* Body text */}
                  <div className="space-y-3 max-w-lg mx-auto">
                    <p className="text-sm text-muted-foreground">This certifies that</p>
                    <p className="text-3xl font-bold tracking-tight text-foreground">
                      {certificateData.internName}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed italic">
                      has successfully completed the
                    </p>
                    <p className="text-xl font-bold text-amber-700 dark:text-amber-400">
                      {certificateData.internshipTitle}
                    </p>
                    <p className="text-sm text-muted-foreground font-medium">
                      {certificateData.duration}
                    </p>
                  </div>

                  {/* Separator */}
                  <div className="flex items-center gap-4 max-w-xs mx-auto opacity-60">
                    <div className="flex-1 h-px bg-amber-400/30" />
                    <Award className="w-5 h-5 text-amber-500" />
                    <div className="flex-1 h-px bg-amber-400/30" />
                  </div>

                  {/* Footer meta */}
                  <div className="grid grid-cols-2 gap-8 text-xs max-w-sm mx-auto">
                    <div className="text-center">
                      <p className="text-muted-foreground uppercase tracking-wider text-[10px]">Issue Date</p>
                      <p className="font-bold mt-1 text-foreground">{certificateData.issueDate}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-muted-foreground uppercase tracking-wider text-[10px]">Authorised By</p>
                      <p className="font-bold mt-1 text-foreground">{certificateData.approvedBy}</p>
                    </div>
                  </div>

                  {/* Certificate ID */}
                  <div className="pt-2">
                    <p className="text-[10px] text-muted-foreground/50 font-mono tracking-widest">
                      VERIFICATION ID: {certificateData.certificateId}
                    </p>
                  </div>
                </div>
              ) : (
                /* Locked State */
                <div className="relative w-full rounded-2xl border-2 border-dashed border-border/60 bg-muted/20 p-12 text-center flex flex-col items-center justify-center space-y-4 min-h-[350px]">
                  <div className="w-20 h-20 rounded-full bg-muted/50 border border-border/50 flex items-center justify-center shadow-inner group">
                    <Clock className="w-10 h-10 text-muted-foreground/60 transition-transform group-hover:scale-110" />
                  </div>
                  <div className="space-y-2 max-w-xs">
                    <h3 className="text-xl font-bold text-foreground">Certificate Locked</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Complete your internship and all assigned tasks to unlock your official completion certificate.
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-bold px-3 py-1">
                    Internship In Progress
                  </Badge>
                </div>
              )}
            </CardContent>

            {/* ─────────────────────────────────────────────
                Section 3: Download Button
            ───────────────────────────────────────────── */}
            {certificateData.internshipStatus === "Completed" && (
              <div className="px-6 py-6 border-t border-border/10 flex justify-end">
                <Button 
                  className="gap-2 rounded-xl shadow-lg hover:shadow-primary/20 transition-all font-medium px-5" 
                  onClick={handleDownload}
                >
                  <Download className="w-4 h-4" />
                  Download Certificate (PDF)
                </Button>
              </div>
            )}
          </Card>
        )}

      </div>
    </DashboardLayout>
  );
};

export default InternCertificates;
