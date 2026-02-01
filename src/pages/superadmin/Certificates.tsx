import DashboardLayout from "@/components/DashboardLayout";
import PageTemplate from "@/components/PageTemplate";

const SuperAdminCertificates = () => {
  return (
    <DashboardLayout>
      <PageTemplate 
        title="Certificates" 
        description="Manage certificate templates and issuance"
      />
    </DashboardLayout>
  );
};

export default SuperAdminCertificates;
