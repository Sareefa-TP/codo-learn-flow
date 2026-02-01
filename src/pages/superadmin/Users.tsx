import DashboardLayout from "@/components/DashboardLayout";
import PageTemplate from "@/components/PageTemplate";

const SuperAdminUsers = () => {
  return (
    <DashboardLayout>
      <PageTemplate 
        title="User Management" 
        description="Manage all platform users and their roles"
      />
    </DashboardLayout>
  );
};

export default SuperAdminUsers;
