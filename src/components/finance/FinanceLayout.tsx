import { ReactNode, useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Search, Bell, Command as CommandIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
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

interface FinanceLayoutProps {
  children: ReactNode;
}

const FinanceLayout = ({ children }: FinanceLayoutProps) => {
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
    <SidebarProvider>
      <div className="flex min-h-svh w-full overflow-hidden bg-[#fafafa]">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Header Bar */}
          <header className="sticky top-0 z-30 flex h-20 items-center justify-between px-8 bg-white/80 backdrop-blur-md border-b border-border/40">
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

          <main className="flex-1 overflow-auto p-8 lg:p-10">
            <div className="mx-auto w-full max-w-[1440px]">
              {children}
            </div>
          </main>
        </div>
      </div>

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
    </SidebarProvider>
  );
};

export default FinanceLayout;
