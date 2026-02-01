import DashboardLayout from "@/components/DashboardLayout";
import PageTemplate from "@/components/PageTemplate";

const SuperAdminIntegrations = () => {
  return (
    <DashboardLayout>
      <PageTemplate 
        title="Integrations" 
        description="Manage Google Meet, Google Drive, and payment integrations"
      />
    </DashboardLayout>
  );
};

export default SuperAdminIntegrations;
