import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
  className?: string;
  iconClassName?: string;
  valueClassName?: string;
}

const StatsCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  className,
  iconClassName,
  valueClassName,
}: StatsCardProps) => {
  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-hover hover:-translate-y-0.5",
      className
    )}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className={cn("text-2xl font-semibold text-foreground", valueClassName)}>
              {value}
            </p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
            {trend && (
              <p className={cn(
                "text-xs font-medium",
                trend.positive ? "text-primary" : "text-destructive"
              )}>
                {trend.positive ? "↑" : "↓"} {trend.value}
              </p>
            )}
          </div>
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
            iconClassName || "bg-primary/10"
          )}>
            <Icon className={cn("w-5 h-5", iconClassName?.includes("bg-") ? "text-inherit" : "text-primary")} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
