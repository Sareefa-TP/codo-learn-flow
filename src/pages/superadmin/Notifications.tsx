import DashboardLayout from "@/components/DashboardLayout";
import PageTemplate from "@/components/PageTemplate";

const SuperAdminNotifications = () => {
  return (
    <DashboardLayout>
      <PageTemplate 
        title="Notifications" 
        description="System-wide notifications and alerts"
      />
    </DashboardLayout>
  );
};

export default SuperAdminNotifications;
