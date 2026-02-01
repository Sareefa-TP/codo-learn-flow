import DashboardLayout from "@/components/DashboardLayout";
import PageTemplate from "@/components/PageTemplate";

const AdminInterns = () => {
  return (
    <DashboardLayout>
      <PageTemplate 
        title="Interns" 
        description="Manage all interns and their assignments"
      />
    </DashboardLayout>
  );
};

export default AdminInterns;
