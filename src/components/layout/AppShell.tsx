import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { cn } from "@/lib/utils";
import { Bell } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";

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
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const role = pathname.split("/")[1] || "student";
  const notificationPath = `/${role}/notifications`;
  const showNotificationAction = role !== "login" && role !== "forgot-password";

  return (
    <SidebarProvider>
      <div className="flex min-h-svh w-full overflow-hidden bg-gradient-to-br from-background via-background to-muted/30">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="sticky top-0 z-20 border-b border-border/60 bg-background/75 backdrop-blur supports-[backdrop-filter]:bg-background/65 md:hidden">
            <div className="mx-auto flex w-full max-w-[1320px] items-center justify-between gap-3 px-4 py-3">
              <div className="flex min-w-0 items-center gap-2">
                <SidebarTrigger
                  className="h-10 w-10 rounded-xl border-0 bg-transparent shadow-none hover:bg-transparent"
                >
                  <span className="inline-flex flex-col items-center gap-1">
                    <span className="h-1 w-7 rounded-full bg-foreground" />
                    <span className="h-1 w-7 rounded-full bg-foreground" />
                    <span className="h-1 w-5 rounded-full bg-foreground" />
                  </span>
                </SidebarTrigger>
                <Logo
                  size="sm"
                  tone="dark"
                  className="min-w-0 [&_img]:h-8 [&_img]:max-w-[190px] [&_img]:w-auto"
                />
              </div>
              {showNotificationAction && (
                <button
                  type="button"
                  onClick={() => navigate(notificationPath)}
                  className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-card/60 text-muted-foreground shadow-sm transition-colors hover:text-foreground"
                  aria-label="Open notifications"
                >
                  <Bell className="h-4 w-4" />
                  <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
                </button>
              )}
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
