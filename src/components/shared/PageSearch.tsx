import { Search, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PageSearchProps {
  /** Placeholder text for the input */
  placeholder?: string;
  /** Initial or controlled value */
  value?: string;
  /** Handler called on every change (optional for controlled behavior) */
  onChange?: (value: string) => void;
  /** Handler called after debounce delay (preferred for filtering) */
  onSearch?: (value: string) => void;
  /** Delay in milliseconds for debouncing (default: 300) */
  debounceMs?: number;
  /** Extra container classes */
  className?: string;
  /** Whether to show the entry animation (default: true) */
  animate?: boolean;
}

/**
 * A standardized, premium search bar component for module-level filtering.
 * Features: Search icon, Clear button, Debounced callback, and consistent UI.
 */
const PageSearch = ({
  placeholder = "Search...",
  value: controlledValue,
  onChange,
  onSearch,
  debounceMs = 300,
  className,
  animate = true,
}: PageSearchProps) => {
  const [inputValue, setInputValue] = useState(controlledValue || "");

  // Update internal state if controlled value changes
  useEffect(() => {
    if (controlledValue !== undefined) {
      setInputValue(controlledValue);
    }
  }, [controlledValue]);

  // Debounce logic
  useEffect(() => {
    if (!onSearch) return;

    const timer = setTimeout(() => {
      onSearch(inputValue);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [inputValue, onSearch, debounceMs]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setInputValue(newVal);
    if (onChange) onChange(newVal);
  };

  const handleClear = () => {
    setInputValue("");
    if (onChange) onChange("");
    if (onSearch) onSearch("");
  };

  return (
    <div
      className={cn(
        "relative group max-w-5xl mx-auto w-full",
        animate && "animate-in fade-in slide-in-from-top-4 duration-700 delay-100",
        className
      )}
    >
      <Search className="absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-all duration-300 group-focus-within:text-primary" />
      <Input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        className="h-12 rounded-2xl border-border/70 bg-card pl-11 pr-12 font-medium"
      />
      {inputValue && (
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={handleClear}
          title="Clear search"
          className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-xl text-muted-foreground hover:text-destructive"
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

export default PageSearch;
