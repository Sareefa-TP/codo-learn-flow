import { cn } from "@/lib/utils";
import React from "react";

export interface PillProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "primary" | "warning" | "success" | "danger" | "soft";
  size?: "sm" | "md" | "lg";
}

export const Pill = React.forwardRef<HTMLDivElement, PillProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    const variants = {
      default: "bg-muted text-muted-foreground border-transparent",
      primary: "bg-primary/10 text-primary border-primary/20",
      warning: "bg-amber-500/10 text-amber-600 border-amber-500/20",
      success: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      danger: "bg-rose-500/10 text-rose-600 border-rose-500/20",
      soft: "bg-background text-foreground border-border/40 shadow-sm",
    };

    const sizes = {
      sm: "px-2 py-0.5 text-[9px]",
      md: "px-3 py-1 text-[10px]",
      lg: "px-4 py-1.5 text-xs",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full border font-black uppercase tracking-widest transition-all",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Pill.displayName = "Pill";
