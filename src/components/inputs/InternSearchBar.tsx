import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function InternSearchBar({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <div className="relative w-full group">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-11 h-12 bg-muted/40 border-border/40 focus:bg-background transition-all rounded-xl text-sm shadow-inner"
      />
    </div>
  );
}

