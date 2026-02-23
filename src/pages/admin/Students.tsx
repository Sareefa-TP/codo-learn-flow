import DashboardLayout from "@/components/DashboardLayout";
import PageTemplate from "@/components/PageTemplate";

const AdminStudents = () => {
  return (
    <DashboardLayout>
      <PageTemplate 
        title="Students" 
        description="Manage all enrolled students and their information"
      />
    </DashboardLayout>
  );
};

export default AdminStudents;
