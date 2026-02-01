import DashboardLayout from "@/components/DashboardLayout";
import PageTemplate from "@/components/PageTemplate";

const SuperAdminCourses = () => {
  return (
    <DashboardLayout>
      <PageTemplate 
        title="Courses & Packages" 
        description="Manage courses, packages, and curriculum"
      />
    </DashboardLayout>
  );
};

export default SuperAdminCourses;
