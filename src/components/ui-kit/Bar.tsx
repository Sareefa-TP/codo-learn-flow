import { cn } from "@/lib/utils";

interface BarProps {
  value: number; // 0 to 100
  tone?: "primary" | "warning" | "destructive" | "success";
  className?: string;
  height?: string;
}

export const Bar = ({ value, tone = "primary", className, height = "h-1.5" }: BarProps) => {
  const bgClass = 
    tone === "primary" ? "bg-primary" : 
    tone === "warning" ? "bg-amber-500" : 
    tone === "destructive" ? "bg-rose-500" : 
    "bg-emerald-500";

  return (
    <div className={cn("w-full bg-muted/30 rounded-full overflow-hidden", height, className)}>
      <div 
        className={cn("h-full transition-all duration-500 ease-out", bgClass)} 
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
};
