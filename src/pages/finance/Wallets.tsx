import DashboardLayout from "@/components/DashboardLayout";
import PageTemplate from "@/components/PageTemplate";

const FinanceWallets = () => {
  return (
    <DashboardLayout>
      <PageTemplate 
        title="Wallet Management" 
        description="Manage student wallet balances and transactions"
      />
    </DashboardLayout>
  );
};

export default FinanceWallets;
