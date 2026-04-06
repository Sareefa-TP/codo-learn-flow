import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface TaskDatePickerProps {
    value: string;
    onChange: (date: string) => void;
    className?: string;
}

export const TaskDatePicker: React.FC<TaskDatePickerProps> = ({ value, onChange, className }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Disable past dates
    const todayStr = new Date().toISOString().split("T")[0];

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
                            "w-full justify-start text-left font-normal h-10 px-3 py-2 bg-background border-input",
                            !value && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {value ? format(new Date(value), "PPP") : <span>Pick a due date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 border-border/50 shadow-xl rounded-xl overflow-hidden" align="start">
                    <div className="p-4 bg-card custom-fullcalendar-container">
                        <style>{`
              .custom-fullcalendar-container .fc {
                --fc-border-color: transparent;
                --fc-daygrid-dot-event-width: 8px;
                font-family: inherit;
                font-size: 0.875rem;
                max-width: 300px;
              }
              .custom-fullcalendar-container .fc .fc-toolbar {
                margin-bottom: 1rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
              }
              .custom-fullcalendar-container .fc .fc-toolbar-title {
                font-size: 1rem;
                font-weight: 600;
              }
              .custom-fullcalendar-container .fc .fc-button {
                padding: 0.25rem 0.5rem;
                font-size: 0.75rem;
                background-color: transparent;
                border: 1px solid hsl(var(--border));
                color: hsl(var(--foreground));
                transition: all 0.2s;
              }
              .custom-fullcalendar-container .fc .fc-button:hover {
                background-color: hsl(var(--muted));
              }
              .custom-fullcalendar-container .fc .fc-button-primary:not(:disabled):active,
              .custom-fullcalendar-container .fc .fc-button-primary:not(:disabled).fc-button-active {
                background-color: hsl(var(--primary));
                border-color: hsl(var(--primary));
                color: hsl(var(--primary-foreground));
              }
              .custom-fullcalendar-container .fc .fc-col-header-cell-cushion {
                padding-bottom: 0.5rem;
                color: hsl(var(--muted-foreground));
                font-weight: 500;
                text-decoration: none !important;
              }
              .custom-fullcalendar-container .fc .fc-daygrid-day-number {
                padding: 4px 8px;
                text-decoration: none !important;
                color: hsl(var(--foreground));
              }
              .custom-fullcalendar-container .fc .fc-daygrid-day.fc-day-today {
                background-color: hsl(var(--primary)/0.1);
              }
              .custom-fullcalendar-container .fc .fc-daygrid-day.fc-day-today .fc-daygrid-day-number {
                color: hsl(var(--primary));
                font-weight: bold;
              }
              .custom-fullcalendar-container .fc .fc-daygrid-day-frame:hover {
                background-color: hsl(var(--muted)/0.5);
                cursor: pointer;
              }
              .custom-fullcalendar-container .fc .fc-highlight {
                background-color: hsl(var(--primary)/0.2);
              }
              .custom-fullcalendar-container .fc-theme-standard td, 
              .custom-fullcalendar-container .fc-theme-standard th {
                border: none;
              }
              .custom-fullcalendar-container .fc-day-disabled {
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
                                start: todayStr
                            }}
                            height="auto"
                            fixedWeekCount={false}
                            aspectRatio={1.35}
                        />
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
};
