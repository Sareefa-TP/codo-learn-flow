import { ReactNode } from "react";
import AppShell from "@/components/layout/AppShell";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return <AppShell>{children}</AppShell>;
};

export default DashboardLayout;

