import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Award,
  CheckCircle2,
  Download,
  Linkedin,
  Hash,
  Calendar,
  Clock,
  ShieldCheck
} from "lucide-react";

// Static Demo Data 
const certificateData = {
  studentName: "Sareefa",
  courseName: "Full Stack Development",
  completionDate: "15 April 2026",
  certificateId: "FSD-2026-001",
  issuedBy: "LMS Academy",
  instructor: "John Mathew",
  duration: "6 Months",
  verificationCode: "VERIFY-FSD-001"
};

const StudentCertificates = () => {
  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6 lg:space-y-8 max-w-5xl mx-auto">

        {/* 1️⃣ Page Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">
            Certificate
          </h1>
          <p className="text-muted-foreground mt-2">
            View and download your course completion certificate
          </p>
        </div>

        {/* 2️⃣ Certificate Status Section (Top Card) */}
        <Card className="border-primary/20 bg-primary/5 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-foreground">Course Completed</h3>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      Available ✅
                    </Badge>
                  </div>
                  <p className="text-sm text-primary/80 mt-1 font-medium">
                    Congratulations! You have successfully completed the {certificateData.courseName} course.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3️⃣ Certificate Preview Section */}
        <div className="flex flex-col items-center mt-8">
          <Card className="w-full max-w-4xl bg-white border-2 border-[#D4AF37]/30 shadow-2xl relative overflow-hidden ring-1 ring-[#D4AF37]/20 rounded-sm">

            {/* Elegant Corner Ornaments (CSS pseudo-elements concept simulated with borders inside) */}
            <div className="absolute top-0 right-0 w-32 h-32 border-t-8 border-r-8 border-[#D4AF37]/20 rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-32 h-32 border-b-8 border-l-8 border-[#D4AF37]/20 rounded-bl-lg" />

            <CardContent className="p-10 sm:p-16 text-center relative z-10 flex flex-col items-center justify-center min-h-[500px]">

              {/* Institute Logo Placeholder */}
              <div className="w-20 h-20 mb-6 rounded-full bg-[#f8f9fa] border border-[#e9ecef] flex items-center justify-center shadow-inner">
                <Award className="w-10 h-10 text-[#D4AF37]" strokeWidth={1.5} />
              </div>

              <h2 className="text-[#D4AF37] uppercase tracking-widest text-sm font-bold mb-3">
                {certificateData.issuedBy}
              </h2>

              <h1 className="text-4xl sm:text-5xl font-serif text-gray-900 mb-6 drop-shadow-sm">
                Certificate of Completion
              </h1>

              <p className="text-gray-500 italic text-lg sm:text-xl mb-4 font-serif">
                This is to certify that
              </p>

              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 border-b-2 border-gray-200 pb-2 mb-6 px-12 inline-block">
                {certificateData.studentName}
              </h2>

              <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
                has successfully completed all requirements and is officially certified in
                <br />
                <span className="font-bold text-gray-900 mt-2 block text-2xl">
                  {certificateData.courseName}
                </span>
              </p>

              <div className="flex flex-col sm:flex-row justify-between w-full mt-16 pt-8 items-center border-t border-gray-100">
                {/* Date Side */}
                <div className="text-center mb-6 sm:mb-0">
                  <p className="text-gray-800 font-semibold mb-1 text-lg">{certificateData.completionDate}</p>
                  <div className="h-px w-32 bg-gray-300 mx-auto my-1"></div>
                  <p className="text-gray-500 text-xs font-semibold tracking-wide uppercase">Date Earned</p>
                </div>

                {/* Badge Center */}
                <div className="mb-6 sm:mb-0 transform hover:scale-105 transition-transform duration-300">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#AA8A2A] flex items-center justify-center shadow-lg border-4 border-white">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Signature Side */}
                <div className="text-center">
                  <p className="text-gray-800 font-serif italic text-2xl pr-2">{certificateData.instructor}</p>
                  <div className="h-px w-32 bg-gray-300 mx-auto my-1"></div>
                  <p className="text-gray-500 text-xs font-semibold tracking-wide uppercase">Lead Instructor</p>
                </div>
              </div>

              <p className="text-gray-400 text-[10px] mt-8 tracking-wider">
                CERTIFICATE ID: {certificateData.certificateId}
              </p>

            </CardContent>
          </Card>
        </div>

        {/* 4️⃣ Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <Button size="lg" className="w-full sm:w-auto gap-2 shadow-md">
            <Download className="w-5 h-5" />
            Download Certificate
          </Button>
          <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 border-[#0077b5] text-[#0077b5] hover:bg-[#0077b5]/10">
            <Linkedin className="w-5 h-5" />
            Share on LinkedIn
          </Button>
        </div>

        {/* 5️⃣ Certificate Details Section */}
        <Card className="mt-8 border-border/50 shadow-sm max-w-3xl mx-auto">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              Certificate Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Hash className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Certificate ID</p>
                  <p className="font-medium text-foreground">{certificateData.certificateId}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Issue Date</p>
                  <p className="font-medium text-foreground">{certificateData.completionDate}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Verification Code</p>
                  <p className="font-medium text-foreground">{certificateData.verificationCode}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Course Duration</p>
                  <p className="font-medium text-foreground">{certificateData.duration}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  );
};

export default StudentCertificates;
