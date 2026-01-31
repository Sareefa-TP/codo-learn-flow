import DashboardLayout from "@/components/DashboardLayout";
import PageTemplate from "@/components/PageTemplate";

const StudentRecordings = () => {
  return (
    <DashboardLayout>
      <PageTemplate 
        title="Recorded Classes" 
        description="Watch past class recordings from Google Drive"
      />
    </DashboardLayout>
  );
};

export default StudentRecordings;
