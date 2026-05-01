import { cn } from "@/lib/utils";

interface KeyValueProps {
  label: string;
  value: string;
  className?: string;
}

export const KeyValue = ({ label, value, className }: KeyValueProps) => {
  return (
    <div className={cn("flex justify-between items-center py-1", className)}>
      <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{label}</span>
      <span className="text-xs font-black text-foreground tabular-nums">{value}</span>
    </div>
  );
};
