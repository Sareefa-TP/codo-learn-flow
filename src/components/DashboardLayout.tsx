import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-svh w-full overflow-hidden bg-gradient-to-br from-background via-background to-muted/30">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile header: gives an always-available sidebar trigger */}
          <div className="sticky top-0 z-20 border-b border-border/60 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
            <div className="mx-auto flex w-full max-w-[1320px] items-center gap-2 px-4 py-3">
              <SidebarTrigger className="rounded-xl border border-border/60 bg-card/60 shadow-sm" />
              <div className="min-w-0">
                <div className="text-sm font-semibold text-foreground truncate">CODO</div>
                <div className="text-[11px] text-muted-foreground truncate">Learning dashboard</div>
              </div>
            </div>
          </div>

          <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
            <div className="mx-auto w-full max-w-[1320px]">
              <div className="rounded-3xl border border-border/60 bg-card/75 p-4 shadow-sm backdrop-blur-sm sm:p-6 lg:p-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;

