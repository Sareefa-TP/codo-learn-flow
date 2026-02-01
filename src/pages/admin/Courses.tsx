import DashboardLayout from "@/components/DashboardLayout";
import PageTemplate from "@/components/PageTemplate";

const AdminCourses = () => {
  return (
    <DashboardLayout>
      <PageTemplate 
        title="Classes & Courses" 
        description="Manage courses, schedules, and class configurations"
      />
    </DashboardLayout>
  );
};

export default AdminCourses;
