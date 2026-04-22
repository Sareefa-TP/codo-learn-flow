import DashboardLayout from "@/components/DashboardLayout";
import { Download, Award } from "lucide-react";
import CourseCard from "@/components/student/CourseCard";
import PageSearch from "@/components/shared/PageSearch";
import { useState, useMemo } from "react";
import { toast } from "sonner";

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

  const filteredCertificates = useMemo(() => {
    return CERTIFICATES.filter(cert => 
      cert.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.credentialId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <DashboardLayout>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8 max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
        
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
          className="mb-10"
        />

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
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
              actionText="Download PDF"
              actionIcon={Download}
              onDetailsClick={() => {
                toast.success(`Opening preview for ${cert.courseName}`);
                console.log("Viewing certificate details:", cert.id);
              }}
              onActionClick={() => {
                toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
                  loading: 'Preparing certificate...',
                  success: 'Certificate downloaded successfully!',
                  error: 'Error'
                });
                console.log("Downloading certificate:", cert.id);
              }}
            />
          ))}

          {filteredCertificates.length === 0 && (
            <div className="col-span-full py-20 text-center bg-muted/20 rounded-3xl border border-dashed border-border/50">
              <p className="text-muted-foreground font-medium text-sm">No certificates found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentCertificates;
