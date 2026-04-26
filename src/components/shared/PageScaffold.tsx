import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <header className={cn("mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-start sm:justify-between", className)}>
      <div className="min-w-0">
        <h1 className="text-3xl font-display text-foreground sm:text-4xl">{title}</h1>
        {description ? <p className="mt-2 text-sm text-muted-foreground sm:text-base">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </header>
  );
}

interface PageSectionProps {
  children: ReactNode;
  className?: string;
}

export function PageSection({ children, className }: PageSectionProps) {
  return <section className={cn("card-soft rounded-3xl p-4 sm:p-6", className)}>{children}</section>;
}

interface PageFiltersBarProps {
  left: ReactNode;
  right?: ReactNode;
  className?: string;
}

export function PageFiltersBar({ left, right, className }: PageFiltersBarProps) {
  return (
    <section className={cn("mb-6 flex flex-col gap-3 rounded-2xl border border-border/70 bg-card/90 p-3 shadow-soft sm:mb-8 sm:flex-row sm:items-center sm:justify-between sm:p-4", className)}>
      <div className="min-w-0 flex-1">{left}</div>
      {right ? <div className="flex shrink-0 items-center gap-2">{right}</div> : null}
    </section>
  );
}

interface PageEmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function PageEmptyState({ title, description, icon, action, className }: PageEmptyStateProps) {
  return (
    <div className={cn("flex min-h-[220px] flex-col items-center justify-center rounded-3xl border border-dashed border-border/80 bg-muted/30 p-6 text-center", className)}>
      {icon ? <div className="mb-3">{icon}</div> : null}
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-1 max-w-xl text-sm text-muted-foreground">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
