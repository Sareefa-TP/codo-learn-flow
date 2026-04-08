import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { InternAttendanceRecord } from "@/modules/intern/attendance/store";
import { calculateDurationLabel, formatDateLabel, formatDayLabel, formatTimeLabel } from "@/modules/intern/attendance/store";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export function CheckOutDialog({
  open,
  onOpenChange,
  onSubmit,
  submitting,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { tasksCompleted: string; blockers: string }) => void;
  submitting: boolean;
}) {
  const [tasksCompleted, setTasksCompleted] = useState("");
  const [blockers, setBlockers] = useState("");

  const canSubmit = tasksCompleted.trim().length > 0 && !submitting;

  useEffect(() => {
    if (!open) {
      setTasksCompleted("");
      setBlockers("");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px] rounded-2xl">
        <DialogHeader>
          <DialogTitle>Check Out</DialogTitle>
          <DialogDescription>What tasks did you complete today?</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
              Tasks Completed <span className="text-red-500">*</span>
            </p>
            <Textarea
              value={tasksCompleted}
              onChange={(e) => setTasksCompleted(e.target.value)}
              placeholder="Describe your work..."
              className="min-h-[120px] rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Blockers / Issues</p>
            <Textarea
              value={blockers}
              onChange={(e) => setBlockers(e.target.value)}
              placeholder="Blockers / Issues"
              className="min-h-[90px] rounded-xl"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl" disabled={submitting}>
            Cancel
          </Button>
          <Button
            onClick={() => onSubmit({ tasksCompleted: tasksCompleted.trim(), blockers: blockers.trim() })}
            className="rounded-xl bg-orange-600 hover:bg-orange-700"
            disabled={!canSubmit}
          >
            {submitting ? "Submitting…" : "Submit & Check Out"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function AttendanceDetailsDialog({
  open,
  onOpenChange,
  record,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: InternAttendanceRecord | null;
}) {
  const dateLabel = useMemo(() => (record ? formatDateLabel(record.dateISO) : "--"), [record]);
  const dayLabel = useMemo(() => (record ? formatDayLabel(record.dateISO) : "--"), [record]);

  if (!open || !record) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div
        className="bg-background border border-border/50 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Attendance Details"
      >
        {/* Header (matches Weekly Report modal) */}
        <div className="flex items-center justify-between p-6 border-b border-border/50 bg-muted/5 flex-shrink-0">
          <div className="min-w-0">
            <h2 className="text-xl font-bold tracking-tight">Attendance Details</h2>
            <p className="text-sm text-muted-foreground mt-1 truncate">
              {dateLabel} • {dayLabel}
            </p>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground flex-shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="rounded-full">
              {record.status === "checked-out" ? "Checked Out" : "Checked In"}
            </Badge>
            <Badge variant="secondary" className="rounded-full tabular-nums">
              Duration: {calculateDurationLabel(record.checkInTime, record.checkOutTime)}
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-muted/30 border border-border/40">
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Check In</p>
              <div className="text-sm font-semibold leading-relaxed bg-background rounded-xl px-4 py-3 border border-border/50 tabular-nums">
                {formatTimeLabel(record.checkInTime)}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Check Out</p>
              <div className="text-sm font-semibold leading-relaxed bg-background rounded-xl px-4 py-3 border border-border/50 tabular-nums">
                {formatTimeLabel(record.checkOutTime)}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Tasks Completed</p>
            <div className="rounded-2xl border border-border/50 bg-card p-4">
              <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                {record.tasksCompleted || "--"}
              </p>
            </div>
          </div>

          {record.blockers && record.blockers.trim().length > 0 && (
            <div className="space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Blockers / Issues</p>
              <div className="rounded-2xl border border-border/50 bg-card p-4">
                <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">{record.blockers}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border/50 bg-muted/5 flex items-center justify-end gap-3 flex-shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl px-6">
            Close
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

