import DashboardLayout from "@/components/DashboardLayout";
import PageTemplate from "@/components/PageTemplate";

const StudentProfile = () => {
  return (
    <DashboardLayout>
      <PageTemplate 
        title="My Profile" 
        description="Manage your personal information and preferences"
      />
    </DashboardLayout>
  );
};

export default StudentProfile;
