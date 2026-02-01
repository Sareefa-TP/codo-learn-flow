import DashboardLayout from "@/components/DashboardLayout";
import PageTemplate from "@/components/PageTemplate";

const AdminMentors = () => {
  return (
    <DashboardLayout>
      <PageTemplate 
        title="Mentors" 
        description="Manage mentors and their mentee assignments"
      />
    </DashboardLayout>
  );
};

export default AdminMentors;
