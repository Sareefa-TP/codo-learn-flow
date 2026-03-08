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
  status: AttendanceStatus;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const attendanceRecords: AttendanceRecord[] = [
  { date: "Mar 01, 2026", day: "Sunday", status: "Present" },
  { date: "Mar 02, 2026", day: "Monday", status: "Present" },
  { date: "Mar 03, 2026", day: "Tuesday", status: "Present" },
  { date: "Mar 04, 2026", day: "Wednesday", status: "Absent" },
  { date: "Mar 05, 2026", day: "Thursday", status: "Present" },
  { date: "Mar 06, 2026", day: "Friday", status: "Late" },
  { date: "Mar 07, 2026", day: "Saturday", status: "Present" },
  { date: "Mar 08, 2026", day: "Sunday", status: "Present" },
  { date: "Mar 09, 2026", day: "Monday", status: "Present" },
  { date: "Mar 10, 2026", day: "Tuesday", status: "Absent" },
  { date: "Mar 11, 2026", day: "Wednesday", status: "Present" },
  { date: "Mar 12, 2026", day: "Thursday", status: "Present" },
  { date: "Mar 13, 2026", day: "Friday", status: "Late" },
  { date: "Mar 14, 2026", day: "Saturday", status: "Present" },
  { date: "Mar 15, 2026", day: "Sunday", status: "Present" },
  { date: "Mar 16, 2026", day: "Monday", status: "Present" },
  { date: "Mar 17, 2026", day: "Tuesday", status: "Present" },
  { date: "Mar 18, 2026", day: "Wednesday", status: "Absent" },
  { date: "Mar 19, 2026", day: "Thursday", status: "Present" },
  { date: "Mar 20, 2026", day: "Friday", status: "Present" },
  { date: "Mar 21, 2026", day: "Saturday", status: "Present" },
  { date: "Mar 22, 2026", day: "Sunday", status: "Absent" },
  { date: "Mar 23, 2026", day: "Monday", status: "Present" },
  { date: "Mar 24, 2026", day: "Tuesday", status: "Late" },
  { date: "Mar 25, 2026", day: "Wednesday", status: "Present" },
];

// ─── Style Maps ───────────────────────────────────────────────────────────────

const statusStyles: Record<AttendanceStatus, string> = {
  Present: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  Absent: "bg-red-500/10 text-red-600 border-red-500/20",
  Late: "bg-amber-500/10 text-amber-600 border-amber-500/20",
};

const sorted = [...attendanceRecords].reverse();

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
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">Attendance</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            View your internship attendance records. This page is read-only.
          </p>
        </div>

        {/* ── Summary Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
                <p className="text-sm font-semibold">Attendance Rate</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Based on {total} working days recorded
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
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
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
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-primary" />
                Attendance History
              </CardTitle>
              <span className="text-xs text-muted-foreground">
                {total} records · Page {page} of {totalPages}
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="text-xs font-semibold w-12 text-center">#</TableHead>
                    <TableHead className="text-xs font-semibold">Date</TableHead>
                    <TableHead className="text-xs font-semibold">Day</TableHead>
                    <TableHead className="text-xs font-semibold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.map((record, idx) => (
                    <TableRow
                      key={record.date}
                      className="hover:bg-muted/10 transition-colors"
                    >
                      <TableCell className="text-xs text-muted-foreground text-center">
                        {(page - 1) * PAGE_SIZE + idx + 1}
                      </TableCell>
                      <TableCell className="text-sm font-medium">{record.date}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{record.day}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-semibold ${statusStyles[record.status]}`}
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
              <div className="flex items-center justify-between px-4 py-3 border-t border-border/40">
                <p className="text-xs text-muted-foreground">
                  Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total}
                </p>
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <Button
                      key={p}
                      variant={p === page ? "default" : "outline"}
                      size="sm"
                      className="h-7 w-7 p-0 text-xs"
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
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
