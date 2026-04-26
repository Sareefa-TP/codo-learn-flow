import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: ReactNode;
  topbar?: ReactNode;
  withCard?: boolean;
  maxWidthClassName?: string;
  contentPaddingClassName?: string;
}

export default function AppShell({
  children,
  topbar,
  withCard = true,
  maxWidthClassName = "max-w-none",
  contentPaddingClassName = "p-4 sm:p-6 lg:p-8",
}: AppShellProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-svh w-full overflow-hidden bg-gradient-to-br from-background via-background to-muted/30">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="sticky top-0 z-20 border-b border-border/60 bg-background/75 backdrop-blur supports-[backdrop-filter]:bg-background/65 md:hidden">
            <div className="mx-auto flex w-full max-w-[1320px] items-center gap-2 px-4 py-3">
              <SidebarTrigger className="rounded-xl border border-border/60 bg-card/60 shadow-sm" />
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-foreground">CODO</div>
                <div className="truncate text-[11px] text-muted-foreground">Learning dashboard</div>
              </div>
            </div>
          </div>

          {topbar}

          <main className={cn("flex flex-1 overflow-auto", contentPaddingClassName)}>
            <div className={cn("mx-auto h-full w-full", maxWidthClassName)}>
              {withCard ? (
                <div className="min-h-full rounded-3xl border border-border/60 bg-card/80 p-4 shadow-soft backdrop-blur-sm sm:p-6 lg:p-8">
                  {children}
                </div>
              ) : (
                children
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
