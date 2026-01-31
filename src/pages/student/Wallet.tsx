import DashboardLayout from "@/components/DashboardLayout";
import PageTemplate from "@/components/PageTemplate";

const StudentWallet = () => {
  return (
    <DashboardLayout>
      <PageTemplate 
        title="Wallet & Payments" 
        description="Manage your balance, transactions, and payment methods"
      />
    </DashboardLayout>
  );
};

export default StudentWallet;
