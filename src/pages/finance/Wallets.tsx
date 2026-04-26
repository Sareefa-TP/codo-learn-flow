import FinanceLayout from "@/components/finance/FinanceLayout";
import PageTemplate from "@/components/PageTemplate";

const FinanceWallets = () => {
  return (
    <FinanceLayout>
      <PageTemplate 
        title="Wallet Management" 
        description="Manage student wallet balances and transactions"
      />
    </FinanceLayout>
  );
};

export default FinanceWallets;
