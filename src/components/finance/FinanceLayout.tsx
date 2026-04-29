import { ReactNode, useEffect, useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Search, Bell, Command as CommandIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useNavigate } from "react-router-dom";
import AppShell from "@/components/layout/AppShell";

interface FinanceLayoutProps {
  children: ReactNode;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
}

export const FinanceGhostButton = ({ children, icon: Icon, ...props }: any) => (
  <Button variant="ghost" className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-2xl gap-3 h-11 px-6 transition-all" {...props}>
    {children}
    {Icon && <Icon className="w-4 h-4" />}
  </Button>
);

const FinanceLayout = ({ children, eyebrow, title, subtitle, action }: FinanceLayoutProps) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <AppShell withCard={false} maxWidthClassName="max-w-[1440px]" contentPaddingClassName="p-6 md:p-8 lg:p-10" topbar={
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-border/40 bg-background/80 px-6 backdrop-blur-md lg:px-8">
            <div className="flex items-center gap-6 flex-1">
              <SidebarTrigger className="md:hidden" />
              
              {/* Search Bar with ⌘K */}
              <div 
                onClick={() => setOpen(true)}
                className="relative max-w-md w-full group cursor-pointer"
              >
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
                  <Search className="w-4 h-4" />
                </div>
                <div className="flex h-11 w-full items-center rounded-2xl border border-border/60 bg-muted/5 px-10 text-sm text-muted-foreground hover:bg-muted/10 transition-all">
                  Search invoices, students...
                </div>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-white border border-border/80 px-1.5 py-0.5 rounded-lg text-[10px] font-bold text-muted-foreground shadow-sm">
                  <CommandIcon className="w-2.5 h-2.5" /> K
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* FY Badge */}
              <Badge variant="outline" className="h-10 px-4 rounded-xl border-border/60 bg-white font-bold text-[10px] uppercase tracking-widest text-muted-foreground shadow-sm">
                FY 2026–27 · INR
              </Badge>

              {/* Notifications */}
              <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-border/60 bg-white shadow-sm relative group">
                <Bell className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
              </Button>
            </div>
          </header>
      }>
        <div className="space-y-10">
          {(title || eyebrow) && (
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-1.5">
                {eyebrow && (
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] ml-1">
                    {eyebrow}
                  </p>
                )}
                {title && (
                  <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-foreground font-serif">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="text-sm font-medium text-muted-foreground max-w-2xl ml-1">
                    {subtitle}
                  </p>
                )}
              </div>
              {action && (
                <div className="shrink-0 pb-1">
                  {action}
                </div>
              )}
            </div>
          )}
          {children}
        </div>
      </AppShell>
      {/* Command Menu */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Finance Pages">
            <CommandItem onSelect={() => { navigate("/finance/revenue"); setOpen(false); }}>Revenue</CommandItem>
            <CommandItem onSelect={() => { navigate("/finance/invoices"); setOpen(false); }}>Invoices</CommandItem>
            <CommandItem onSelect={() => { navigate("/finance/payouts"); setOpen(false); }}>Payouts</CommandItem>
            <CommandItem onSelect={() => { navigate("/finance/refunds"); setOpen(false); }}>Refunds</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default FinanceLayout;
