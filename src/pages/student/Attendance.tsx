import DashboardLayout from "@/components/DashboardLayout";
import PageTemplate from "@/components/PageTemplate";

const StudentAttendance = () => {
  return (
    <DashboardLayout>
      <PageTemplate 
        title="Attendance" 
        description="Track your class attendance automatically via Google Meet"
      />
    </DashboardLayout>
  );
};

export default StudentAttendance;
