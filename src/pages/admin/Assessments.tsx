import DashboardLayout from "@/components/DashboardLayout";
import PageTemplate from "@/components/PageTemplate";

const AdminAssessments = () => {
  return (
    <DashboardLayout>
      <PageTemplate 
        title="Assessments & Performance" 
        description="View and manage assessments, scores, and performance metrics"
      />
    </DashboardLayout>
  );
};

export default AdminAssessments;
