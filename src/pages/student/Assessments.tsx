import DashboardLayout from "@/components/DashboardLayout";
import PageTemplate from "@/components/PageTemplate";

const StudentAssessments = () => {
  return (
    <DashboardLayout>
      <PageTemplate 
        title="Assessments" 
        description="View your quizzes, assignments, and exam results"
      />
    </DashboardLayout>
  );
};

export default StudentAssessments;
