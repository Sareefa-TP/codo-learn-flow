import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  label?: string;
  onClick?: () => void;
  className?: string;
}

export default function BackButton({
  label = "Back",
  onClick,
  className,
}: BackButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onClick}
      className={cn(
        "group h-10 rounded-xl border-border/70 bg-card px-4 text-sm font-semibold text-foreground shadow-soft hover:bg-muted/40",
        className,
      )}
    >
      <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
      {label}
    </Button>
  );
}
