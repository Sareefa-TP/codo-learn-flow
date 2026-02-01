import DashboardLayout from "@/components/DashboardLayout";
import PageTemplate from "@/components/PageTemplate";

const AdminTutors = () => {
  return (
    <DashboardLayout>
      <PageTemplate 
        title="Tutors" 
        description="Manage tutors and their class assignments"
      />
    </DashboardLayout>
  );
};

export default AdminTutors;
