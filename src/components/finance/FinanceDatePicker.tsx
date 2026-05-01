import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface FinanceDatePickerProps {
  date?: Date;
  onSelect: (date: Date | undefined) => void;
  label?: string;
  className?: string;
}

export function FinanceDatePicker({
  date,
  onSelect,
  label,
  className,
}: FinanceDatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "h-9 px-4 justify-start text-left font-bold rounded-xl border-none shadow-soft bg-white hover:bg-slate-50 transition-all",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-primary/40" />
          <span className="text-xs uppercase tracking-tight">
            {date ? format(date, "dd/MM/yyyy") : <span>{label || "Pick a date"}</span>}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 border-none shadow-2xl rounded-2xl overflow-hidden z-[100]" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onSelect}
          initialFocus
          className="p-4 bg-white"
          classNames={{
            day_selected: "bg-primary text-white hover:bg-primary/90 focus:bg-primary focus:text-white rounded-xl",
            day_today: "bg-slate-100 text-slate-900 rounded-xl",
            day: "h-9 w-9 p-0 font-bold text-xs hover:bg-slate-50 rounded-xl transition-colors",
            nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 border border-slate-100 rounded-lg",
            caption_label: "text-xs font-black uppercase tracking-widest",
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
