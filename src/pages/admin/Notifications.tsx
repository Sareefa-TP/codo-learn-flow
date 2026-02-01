import DashboardLayout from "@/components/DashboardLayout";
import PageTemplate from "@/components/PageTemplate";

const AdminNotifications = () => {
  return (
    <DashboardLayout>
      <PageTemplate 
        title="Notifications" 
        description="System alerts and important updates"
      />
    </DashboardLayout>
  );
};

export default AdminNotifications;
