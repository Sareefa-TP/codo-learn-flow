import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable, { Column } from "@/components/superadmin/DataTable";
import SuperAdminStatCard from "@/components/superadmin/SuperAdminStatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IndianRupee, ArrowUpRight, ArrowDownRight, CheckCircle } from "lucide-react";
import { Transaction, transactions as initialTxns, getWalletBalance } from "@/data/superAdminData";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  paid: "bg-primary/15 text-primary border-0",
  pending: "bg-warning/15 text-warning-foreground border-0",
  overdue: "bg-destructive/15 text-destructive border-0",
  approved: "bg-accent text-accent-foreground border-0",
};

const SuperAdminFinance = () => {
  const [txns, setTxns] = useState<Transaction[]>(() => JSON.parse(JSON.stringify(initialTxns)));
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filtered = typeFilter === "all" ? txns : txns.filter((t) => t.type === typeFilter);
  const { credits, debits, balance } = getWalletBalance();

  const pendingCount = txns.filter((t) => t.status === "pending" || t.status === "overdue").length;

  const handleApprove = (id: string) => {
    setTxns((prev) => prev.map((t) => (t.id === id ? { ...t, status: "paid" as const } : t)));
    toast.success("Transaction approved");
  };

  const columns: Column<Transaction>[] = [
    { key: "date", header: "Date", sortable: true, accessor: (t) => t.date },
    { key: "description", header: "Description" },
    { key: "entityName", header: "Entity" },
    { key: "type", header: "Type", render: (t) => <Badge variant="outline" className="capitalize text-xs">{t.type.replace(/_/g, " ")}</Badge> },
    { key: "amount", header: "Amount", sortable: true, accessor: (t) => t.amount, render: (t) => (
      <span className={`font-medium ${t.direction === "credit" ? "text-primary" : "text-destructive"}`}>
        {t.direction === "credit" ? "+" : "−"}₹{t.amount.toLocaleString("en-IN")}
      </span>
    )},
    { key: "status", header: "Status", render: (t) => <Badge variant="secondary" className={statusColors[t.status] || ""}>{t.status}</Badge> },
  ];

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-semibold text-foreground tracking-tight">Finance & Payroll</h1>
          <p className="text-muted-foreground mt-1">Track student fees, salaries, stipends & wallet</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <SuperAdminStatCard title="Total Credits" value={`₹${(credits/1000).toFixed(0)}K`} icon={ArrowUpRight} />
          <SuperAdminStatCard title="Total Debits" value={`₹${(debits/1000).toFixed(0)}K`} icon={ArrowDownRight} />
          <SuperAdminStatCard title="Net Balance" value={`₹${(balance/1000).toFixed(0)}K`} icon={IndianRupee} trend={{ value: balance >= 0 ? "Healthy" : "Deficit", positive: balance >= 0 }} />
          <SuperAdminStatCard title="Pending Actions" value={pendingCount} subtitle="Need approval" icon={CheckCircle} />
        </div>

        <Tabs value={typeFilter} onValueChange={setTypeFilter}>
          <TabsList className="flex-wrap">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="student_fee">Student Fees</TabsTrigger>
            <TabsTrigger value="tutor_salary">Tutor Salaries</TabsTrigger>
            <TabsTrigger value="mentor_salary">Mentor Salaries</TabsTrigger>
            <TabsTrigger value="stipend">Stipends</TabsTrigger>
          </TabsList>
        </Tabs>

        <DataTable
          data={filtered}
          columns={columns}
          searchPlaceholder="Search transactions..."
          searchKey={(t) => `${t.description} ${t.entityName}`}
          actions={(item) => (
            item.status === "pending" || item.status === "overdue" ? (
              <Button variant="outline" size="sm" onClick={() => handleApprove(item.id)} className="text-xs">
                Approve
              </Button>
            ) : null
          )}
        />
      </div>
    </DashboardLayout>
  );
};

export default SuperAdminFinance;
