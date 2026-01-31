import DashboardLayout from "@/components/DashboardLayout";
import PageTemplate from "@/components/PageTemplate";

const StudentPackages = () => {
  return (
    <DashboardLayout>
      <PageTemplate 
        title="Package Recommendations" 
        description="Explore learning packages tailored to your goals"
      />
    </DashboardLayout>
  );
};

export default StudentPackages;
