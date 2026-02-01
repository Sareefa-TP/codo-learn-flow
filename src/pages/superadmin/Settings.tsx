import DashboardLayout from "@/components/DashboardLayout";
import PageTemplate from "@/components/PageTemplate";

const SuperAdminSettings = () => {
  return (
    <DashboardLayout>
      <PageTemplate 
        title="System Settings" 
        description="Platform configuration and system settings"
      />
    </DashboardLayout>
  );
};

export default SuperAdminSettings;
