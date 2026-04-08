import { Component, type ReactNode, useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  CalendarDays, UserCheck, TrendingUp, ChevronLeft, ChevronRight, Eye,
} from "lucide-react";
import { AttendanceDetailsDialog } from "@/modules/intern/attendance/dialogs";
import type { InternAttendanceRecord } from "@/modules/intern/attendance/store";
import {
  formatDateLabel,
  formatDayLabel,
  getAttendanceForIntern,
} from "@/modules/intern/attendance/store";

class AttendanceErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("InternAttendance crashed:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 rounded-2xl border border-dashed border-border/50 bg-muted/10 text-center space-y-2">
          <h2 className="text-base font-bold text-foreground">Attendance Page Working</h2>
          <p className="text-sm text-muted-foreground">
            The Attendance UI crashed while rendering. Check the browser console for the exact error.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────

type AttendanceStatus = "Checked In" | "Checked Out";

const INTERN_ID = "intern-1";

/** Demo rows when no real data exists in localStorage (UI-only). */
function buildDummyInternAttendance(internId: string): InternAttendanceRecord[] {
  const taskNotes = [
    "Completed UI tasks on dashboard; fixed responsive layout issues.",
    "Attended mentor sync; updated weekly report draft.",
    "Code review session + refactored attendance store helpers.",
    "Implemented Materials search; paired on Meet module.",
    "Documentation pass for intern onboarding flow.",
    "Bug fixes on Progress page; wrote unit tests for helpers.",
    "Prepared demo for sprint review; addressed PR feedback.",
    "Explored API integration patterns; stubbed error states.",
    "Design QA for spacing and dark mode on Feedback page.",
    "Sprint planning notes; prioritized next week’s tasks.",
    "Fixed lint issues across intern pages; smoke-tested routes.",
    "Shadowed senior on deployment checklist; updated runbook.",
  ];

  const rows: InternAttendanceRecord[] = [];
  for (let daysAgo = 1; daysAgo <= 12; daysAgo += 1) {
    const day = new Date();
    day.setDate(day.getDate() - daysAgo);
    const dateISO = day.toISOString().split("T")[0];

    const checkIn = new Date(day);
    checkIn.setHours(9, 5 + (daysAgo % 4), 0, 0);
    const checkOut = new Date(day);
    checkOut.setHours(17, 20 + (daysAgo % 3), 0, 0);

    rows.push({
      internId,
      dateISO,
      checkInTime: checkIn.toISOString(),
      checkOutTime: checkOut.toISOString(),
      status: "checked-out",
      tasksCompleted: taskNotes[(daysAgo - 1) % taskNotes.length],
      blockers: daysAgo === 7 ? "Waiting on staging credentials from mentor." : "",
    });
  }

  return rows.sort((a, b) => (a.dateISO < b.dateISO ? 1 : -1));
}

// ─── Style Maps ───────────────────────────────────────────────────────────────

const statusStyles: Record<AttendanceStatus, string> = {
  "Checked In": "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  "Checked Out": "bg-blue-500/10 text-blue-600 border-blue-500/20",
};

const PAGE_SIZE = 10;

// ─── Page ─────────────────────────────────────────────────────────────────────

const InternAttendance = () => {
  const [page, setPage] = useState(1);
  const [records, setRecords] = useState<InternAttendanceRecord[]>([]);
  const [isDemoData, setIsDemoData] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [activeRecord, setActiveRecord] = useState<InternAttendanceRecord | null>(null);

  const refresh = () => {
    const stored = getAttendanceForIntern(INTERN_ID);
    if (stored.length > 0) {
      setRecords(stored);
      setIsDemoData(false);
    } else {
      setRecords(buildDummyInternAttendance(INTERN_ID));
      setIsDemoData(true);
    }
  };

  useEffect(() => {
    refresh();
    const onUpdated = () => refresh();
    window.addEventListener("intern-attendance-updated", onUpdated as EventListener);
    return () => window.removeEventListener("intern-attendance-updated", onUpdated as EventListener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Derived stats
  const total = records.length;
  const checkedOut = records.filter(r => r.status === "checked-out").length;
  const checkedIn = records.filter(r => r.status === "checked-in").length;
  const rate = total > 0 ? Math.round((checkedOut / total) * 100) : 0;

  // Pagination
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const paginated = useMemo(() => records.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [records, page]);

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6 max-w-5xl mx-auto w-full px-4 md:px-6 lg:px-8 pb-10">
        <AttendanceErrorBoundary>

        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <CalendarDays className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">Attendance History</h1>
                {isDemoData && (
                  <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-wider">
                    Sample data
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground text-sm mt-0.5">
                {isDemoData
                  ? "Preview rows below are sample data. After you use Check-In / Check-Out on the dashboard, your real records will appear here."
                  : "View your detailed internship attendance records and session durations."}
              </p>
            </div>
          </div>
        </div>

        {/* ── Summary Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Working Days", value: total, icon: CalendarDays, bg: "bg-violet-500/10", color: "text-violet-600" },
            { label: "Checked Out Days", value: checkedOut, icon: UserCheck, bg: "bg-emerald-500/10", color: "text-emerald-600" },
            { label: "Checked In (Open)", value: checkedIn, icon: TrendingUp, bg: "bg-amber-500/10", color: "text-amber-600" },
            { label: "Completion Rate", value: `${rate}%`, icon: TrendingUp, bg: "bg-blue-500/10", color: "text-blue-600" },
          ].map(({ label, value, icon: Icon, bg, color }) => (
            <Card key={label} className="border-border/50 shadow-sm rounded-xl">
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${bg}`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <div>
                    <p className={`text-2xl font-bold ${color}`}>{value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ── Attendance Rate Card ── */}
        <Card className="border-border/50 shadow-sm rounded-xl">
          <CardContent className="pt-5 pb-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Attendance Performance</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Overall status based on {total} recorded working days
                </p>
              </div>
              <span className={`text-3xl font-bold ${rate >= 85 ? "text-emerald-600" : rate >= 70 ? "text-amber-600" : "text-red-600"}`}>
                {rate}%
              </span>
            </div>

            {/* Progress bar */}
            <div className="relative h-4 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full rounded-full transition-all duration-700 ${rate >= 85 ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                  : rate >= 70 ? "bg-amber-500"
                    : "bg-red-500"
                  }`}
                style={{ width: `${rate}%` }}
              />
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1 text-center sm:text-left">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                Checked Out: {checkedOut}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                Checked In: {checkedIn}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* ── Attendance History Table ── */}
        <Card className="border-border/50 shadow-sm rounded-xl overflow-hidden">
          <CardHeader className="pb-3 border-b border-border/20">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-primary" />
                Attendance Log
              </CardTitle>
              <span className="text-[10px] sm:text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-md border border-border/40">
                 {total} records · Page {page} of {totalPages}
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="text-[10px] font-bold uppercase tracking-wider w-12 text-center">#</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-wider">Date</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-wider">Status</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-wider text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.length > 0 ? (
                    paginated.map((record, idx) => (
                      <TableRow
                        key={record.dateISO}
                        className="hover:bg-muted/10 transition-colors border-b border-border/10 last:border-0"
                      >
                        <TableCell className="text-xs text-muted-foreground text-center">
                          {(page - 1) * PAGE_SIZE + idx + 1}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-foreground leading-tight">{formatDateLabel(record.dateISO)}</span>
                            <span className="text-[10px] text-muted-foreground font-medium">{formatDayLabel(record.dateISO)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`text-[10px] font-bold uppercase tracking-wide h-6 ${
                              statusStyles[record.status === "checked-out" ? "Checked Out" : "Checked In"]
                            }`}
                          >
                            {record.status === "checked-out" ? "Checked Out" : "Checked In"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 rounded-xl text-xs font-bold gap-2"
                            disabled={record.status !== "checked-out"}
                            onClick={() => {
                              setActiveRecord(record);
                              setDetailsOpen(true);
                            }}
                            title={record.status !== "checked-out" ? "Available after you check out" : undefined}
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="p-10 text-center text-sm text-muted-foreground">
                        No attendance data yet. Use Check-In / Check-Out from the dashboard to create today’s record.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-border/40 bg-muted/5">
                <p className="hidden sm:block text-[11px] text-muted-foreground font-medium">
                  Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total}
                </p>
                <div className="flex items-center gap-1.5 mx-auto sm:mx-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-lg"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <div className="flex items-center gap-1 px-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                      <Button
                        key={p}
                        variant={p === page ? "default" : "ghost"}
                        size="sm"
                        className={`h-8 w-8 p-0 text-xs rounded-lg ${p === page ? "shadow-md bg-primary text-primary-foreground hover:bg-primary/90" : "text-muted-foreground"}`}
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-lg"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <AttendanceDetailsDialog open={detailsOpen} onOpenChange={setDetailsOpen} record={activeRecord} />
        </AttendanceErrorBoundary>
      </div>
    </DashboardLayout>
  );
};

export default InternAttendance;
