import DashboardLayout from "@/components/DashboardLayout";
import PageTemplate from "@/components/PageTemplate";

const AdminFinance = () => {
  return (
    <DashboardLayout>
      <PageTemplate 
        title="Finance Overview" 
        description="View financial summaries and pending transactions"
      />
    </DashboardLayout>
  );
};

export default AdminFinance;
