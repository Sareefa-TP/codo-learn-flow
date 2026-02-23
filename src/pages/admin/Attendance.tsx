import DashboardLayout from "@/components/DashboardLayout";
import PageTemplate from "@/components/PageTemplate";

const AdminAttendance = () => {
  return (
    <DashboardLayout>
      <PageTemplate 
        title="Attendance" 
        description="Monitor and manage attendance records across all users"
      />
    </DashboardLayout>
  );
};

export default AdminAttendance;
