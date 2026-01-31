import DashboardLayout from "@/components/DashboardLayout";
import PageTemplate from "@/components/PageTemplate";

const StudentCertificates = () => {
  return (
    <DashboardLayout>
      <PageTemplate 
        title="Certificates" 
        description="View earned certificates and track eligibility"
      />
    </DashboardLayout>
  );
};

export default StudentCertificates;
