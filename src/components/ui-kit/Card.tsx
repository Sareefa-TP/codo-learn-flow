import { cn } from "@/lib/utils";
import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "soft";
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl border bg-card text-card-foreground shadow-sm",
          variant === "glass" && "bg-white/10 backdrop-blur-md border-white/20 shadow-xl",
          variant === "soft" && "border-none bg-muted/30 shadow-none",
          "shadow-soft",
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";
