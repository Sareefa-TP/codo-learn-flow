import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  CalendarDays, UserCheck, UserX, TrendingUp, ChevronLeft, ChevronRight,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type AttendanceStatus = "Present" | "Absent" | "Late";

interface AttendanceRecord {
  date: string;
  day: string;
  checkIn: string;
  checkOut: string;
  duration: string;
  status: AttendanceStatus;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const attendanceRecords: AttendanceRecord[] = [
  { date: "Mar 25, 2026", day: "Wednesday", checkIn: "09:00 AM", checkOut: "05:00 PM", duration: "8h 0m", status: "Present" },
  { date: "Mar 24, 2026", day: "Tuesday", checkIn: "09:05 AM", checkOut: "05:15 PM", duration: "8h 10m", status: "Late" },
  { date: "Mar 23, 2026", day: "Monday", checkIn: "08:55 AM", checkOut: "05:00 PM", duration: "8h 5m", status: "Present" },
  { date: "Mar 22, 2026", day: "Sunday", checkIn: "--", checkOut: "--", duration: "0h 0m", status: "Absent" },
  { date: "Mar 21, 2026", day: "Saturday", checkIn: "09:00 AM", checkOut: "05:05 PM", duration: "8h 5m", status: "Present" },
  { date: "Mar 20, 2026", day: "Friday", checkIn: "08:50 AM", checkOut: "05:10 PM", duration: "8h 20m", status: "Present" },
  { date: "Mar 19, 2026", day: "Thursday", checkIn: "09:02 AM", checkOut: "05:00 PM", duration: "7h 58m", status: "Present" },
  { date: "Mar 18, 2026", day: "Wednesday", checkIn: "--", checkOut: "--", duration: "0h 0m", status: "Absent" },
  { date: "Mar 17, 2026", day: "Tuesday", checkIn: "08:58 AM", checkOut: "05:15 PM", duration: "8h 17m", status: "Present" },
  { date: "Mar 16, 2026", day: "Monday", checkIn: "09:10 AM", checkOut: "05:30 PM", duration: "8h 20m", status: "Present" },
  { date: "Mar 15, 2026", day: "Sunday", checkIn: "09:00 AM", checkOut: "05:00 PM", duration: "8h 0m", status: "Present" },
  { date: "Mar 14, 2026", day: "Saturday", checkIn: "08:55 AM", checkOut: "05:05 PM", duration: "8h 10m", status: "Present" },
  { date: "Mar 13, 2026", day: "Friday", checkIn: "09:15 AM", checkOut: "05:45 PM", duration: "8h 30m", status: "Late" },
  { date: "Mar 12, 2026", day: "Thursday", checkIn: "09:00 AM", checkOut: "05:00 PM", duration: "8h 0m", status: "Present" },
  { date: "Mar 11, 2026", day: "Wednesday", checkIn: "08:50 AM", checkOut: "05:10 PM", duration: "8h 20m", status: "Present" },
];

// ─── Style Maps ───────────────────────────────────────────────────────────────

const statusStyles: Record<AttendanceStatus, string> = {
  Present: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  Absent: "bg-red-500/10 text-red-600 border-red-500/20",
  Late: "bg-amber-500/10 text-amber-600 border-amber-500/20",
};

const sorted = [...attendanceRecords];

const PAGE_SIZE = 10;

// ─── Page ─────────────────────────────────────────────────────────────────────

const InternAttendance = () => {
  const [page, setPage] = useState(1);

  // Derived stats
  const total = attendanceRecords.length;
  const present = attendanceRecords.filter(r => r.status === "Present").length;
  const absent = attendanceRecords.filter(r => r.status === "Absent").length;
  const late = attendanceRecords.filter(r => r.status === "Late").length;
  const rate = Math.round(((present + late) / total) * 100); // present + late = attended

  // Pagination
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6 max-w-5xl mx-auto pb-10">

        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <CalendarDays className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">Attendance History</h1>
              <p className="text-muted-foreground text-sm mt-0.5">
                View your detailed internship attendance records and session durations.
              </p>
            </div>
          </div>
        </div>

        {/* ── Summary Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Working Days", value: total, icon: CalendarDays, bg: "bg-violet-500/10", color: "text-violet-600" },
            { label: "Days Present", value: present, icon: UserCheck, bg: "bg-emerald-500/10", color: "text-emerald-600" },
            { label: "Days Absent", value: absent, icon: UserX, bg: "bg-red-500/10", color: "text-red-600" },
            { label: "Days Late", value: late, icon: TrendingUp, bg: "bg-amber-500/10", color: "text-amber-600" },
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
                Present: {present}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                Late: {late}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                Absent: {absent}
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
                    <TableHead className="text-[10px] font-bold uppercase tracking-wider">Session Time</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-wider">Duration</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-wider">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.map((record, idx) => (
                    <TableRow
                      key={record.date}
                      className="hover:bg-muted/10 transition-colors border-b border-border/10 last:border-0"
                    >
                      <TableCell className="text-xs text-muted-foreground text-center">
                        {(page - 1) * PAGE_SIZE + idx + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-foreground leading-tight">{record.date}</span>
                          <span className="text-[10px] text-muted-foreground font-medium">{record.day}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                           <span className="text-emerald-600 font-medium">{record.checkIn}</span>
                           <span className="text-muted-foreground/30">|</span>
                           <span className="text-orange-600 font-medium">{record.checkOut}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm font-bold text-foreground font-mono">
                         {record.duration}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-bold uppercase tracking-wide h-6 ${statusStyles[record.status]}`}
                        >
                          {record.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
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

      </div>
    </DashboardLayout>
  );
};

export default InternAttendance;
