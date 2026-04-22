import { Search, X } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

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
      <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-all duration-300" />
      <input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-12 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm placeholder:text-slate-400 text-slate-900"
      />
      {inputValue && (
        <button
          onClick={handleClear}
          title="Clear search"
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-xl text-slate-400 hover:text-destructive hover:bg-destructive/5 transition-all outline-none focus:ring-2 focus:ring-destructive/20"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default PageSearch;
