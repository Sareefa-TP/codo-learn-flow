import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format, addDays } from "date-fns";
import { cn } from "@/lib/utils";

interface AttendanceDatePickerProps {
  value: string;
  onChange: (date: string) => void;
  className?: string;
}

export const AttendanceDatePicker: React.FC<AttendanceDatePickerProps> = ({ value, onChange, className }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Disable future dates
  const todayStr = new Date().toISOString().split("T")[0];
  const tomorrowStr = format(addDays(new Date(), 1), "yyyy-MM-dd");

  const handleDateSelect = (selectInfo: any) => {
    const selectedDate = selectInfo.startStr;
    onChange(selectedDate);
    setIsOpen(false);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal h-10 px-3 py-2 bg-background border-input shadow-sm",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
            {value ? format(new Date(value), "PPP") : <span>Select attendance date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 border-border/50 shadow-xl rounded-xl overflow-hidden" align="end">
          <div className="p-4 bg-card custom-attendance-calendar">
            <style>{`
              .custom-attendance-calendar .fc {
                --fc-border-color: transparent;
                font-family: inherit;
                font-size: 0.875rem;
                max-width: 300px;
              }
              .custom-attendance-calendar .fc .fc-toolbar {
                margin-bottom: 1rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
              }
              .custom-attendance-calendar .fc .fc-toolbar-title {
                font-size: 1rem;
                font-weight: 600;
              }
              .custom-attendance-calendar .fc .fc-button {
                padding: 0.25rem 0.5rem;
                font-size: 0.75rem;
                background-color: transparent;
                border: 1px solid hsl(var(--border));
                color: hsl(var(--foreground));
                transition: all 0.2s;
              }
              .custom-attendance-calendar .fc .fc-button:hover {
                background-color: hsl(var(--muted));
              }
              .custom-attendance-calendar .fc .fc-button-primary:not(:disabled):active,
              .custom-attendance-calendar .fc .fc-button-primary:not(:disabled).fc-button-active {
                background-color: hsl(var(--primary));
                border-color: hsl(var(--primary));
                color: hsl(var(--primary-foreground));
              }
              .custom-attendance-calendar .fc .fc-col-header-cell-cushion {
                padding-bottom: 0.5rem;
                color: hsl(var(--muted-foreground));
                font-weight: 500;
                text-decoration: none !important;
              }
              .custom-attendance-calendar .fc .fc-daygrid-day-number {
                padding: 4px 8px;
                text-decoration: none !important;
                color: hsl(var(--foreground));
              }
              .custom-attendance-calendar .fc .fc-daygrid-day.fc-day-today {
                background-color: hsl(var(--primary)/0.1);
              }
              .custom-attendance-calendar .fc .fc-daygrid-day.fc-day-today .fc-daygrid-day-number {
                color: hsl(var(--primary));
                font-weight: bold;
              }
              .custom-attendance-calendar .fc .fc-daygrid-day-frame:hover {
                background-color: hsl(var(--muted)/0.5);
                cursor: pointer;
              }
              .custom-attendance-calendar .fc .fc-highlight {
                background-color: hsl(var(--primary)/0.2);
              }
              .custom-attendance-calendar .fc-theme-standard td, 
              .custom-attendance-calendar .fc-theme-standard th {
                border: none;
              }
              .custom-attendance-calendar .fc-day-disabled {
                opacity: 0.3;
                background-color: transparent !important;
                pointer-events: none;
              }
            `}</style>
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: "prev",
                center: "title",
                right: "next"
              }}
              selectable={true}
              select={handleDateSelect}
              validRange={{
                end: tomorrowStr
              }}
              height="auto"
              fixedWeekCount={false}
              aspectRatio={1.35}
              initialDate={value || todayStr}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
