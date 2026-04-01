import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
    CalendarDays, UserCheck, UserX, Info, Clock
} from "lucide-react";
import { format } from "date-fns";
import { AttendanceDatePicker } from "@/components/mentor/AttendanceDatePicker";

// ─── Types ────────────────────────────────────────────────────────────────────

type AttendanceStatus = "Present" | "Absent" | "Late";

interface Intern {
    id: string;
    name: string;
}

interface AttendanceRecord {
    internId: string;
    internName: string;
    checkIn: string;
    checkOut: string;
    duration: string;
    status: AttendanceStatus;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const assignedInterns: Intern[] = [
    { id: "INT-001", name: "Aarav Singh" },
    { id: "INT-002", name: "Priya Sharma" },
    { id: "INT-003", name: "Sneha Verma" },
    { id: "INT-004", name: "Rahul Mehta" },
    { id: "INT-005", name: "Karan Nair" },
    { id: "INT-006", name: "Anish Gupta" },
    { id: "INT-007", name: "Meera Reddy" },
];

// Mock data indexed by date
const mockDailyRecords: Record<string, AttendanceRecord[]> = {
    "2026-04-01": [ // Today
        { internId: "INT-001", internName: "Aarav Singh", checkIn: "08:55 AM", checkOut: "--", duration: "--", status: "Present" },
        { internId: "INT-002", internName: "Priya Sharma", checkIn: "09:12 AM", checkOut: "--", duration: "--", status: "Late" },
        { internId: "INT-003", internName: "Sneha Verma", checkIn: "--", checkOut: "--", duration: "--", status: "Absent" },
        { internId: "INT-004", internName: "Rahul Mehta", checkIn: "08:50 AM", checkOut: "--", duration: "--", status: "Present" },
        { internId: "INT-005", internName: "Karan Nair", checkIn: "09:05 AM", checkOut: "--", duration: "--", status: "Late" },
        { internId: "INT-006", internName: "Anish Gupta", checkIn: "08:45 AM", checkOut: "--", duration: "--", status: "Present" },
        { internId: "INT-007", internName: "Meera Reddy", checkIn: "--", checkOut: "--", duration: "--", status: "Absent" },
    ],
    "2026-03-31": [
        { internId: "INT-001", internName: "Aarav Singh", checkIn: "09:00 AM", checkOut: "05:00 PM", duration: "8h 0m", status: "Present" },
        { internId: "INT-002", internName: "Priya Sharma", checkIn: "09:05 AM", checkOut: "05:15 PM", duration: "8h 10m", status: "Present" },
        { internId: "INT-003", internName: "Sneha Verma", checkIn: "--", checkOut: "--", duration: "0h 0m", status: "Absent" },
        { internId: "INT-004", internName: "Rahul Mehta", checkIn: "08:55 AM", checkOut: "05:00 PM", duration: "8h 5m", status: "Present" },
        { internId: "INT-005", internName: "Karan Nair", checkIn: "09:15 AM", checkOut: "05:30 PM", duration: "8h 15m", status: "Late" },
        { internId: "INT-006", internName: "Anish Gupta", checkIn: "09:00 AM", checkOut: "05:05 PM", duration: "8h 5m", status: "Present" },
        { internId: "INT-007", internName: "Meera Reddy", checkIn: "09:02 AM", checkOut: "05:00 PM", duration: "7h 58m", status: "Present" },
    ]
};

const statusStyles: Record<AttendanceStatus, string> = {
    Present: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    Absent: "bg-red-500/10 text-red-600 border-red-500/20",
    Late: "bg-amber-500/10 text-amber-600 border-amber-500/20",
};

// ─── Component ────────────────────────────────────────────────────────────────

const CoordinatorAttendance = () => {
    const today = format(new Date(), "yyyy-MM-dd");
    const [selectedDate, setSelectedDate] = useState(today);

    const records = useMemo(() => {
        // Return mock data if exists for date, else build a default "Absent" list for all interns
        if (mockDailyRecords[selectedDate]) {
            return mockDailyRecords[selectedDate];
        }
        return assignedInterns.map(int => ({
            internId: int.id,
            internName: int.name,
            checkIn: "--",
            checkOut: "--",
            duration: "--",
            status: "Absent" as AttendanceStatus
        }));
    }, [selectedDate]);

    // Derived stats
    const totalCount = assignedInterns.length;
    const presentCount = records.filter(r => r.status === "Present" || r.status === "Late").length;
    const absentCount = records.filter(r => r.status === "Absent").length;

    return (
        <div className="animate-fade-in space-y-6 max-w-6xl mx-auto px-4 md:px-6 lg:px-8 pb-10">

                {/* ── Page Header ── */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary border border-primary/20">
                            <CalendarDays className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">Attendance Overview</h1>
                            <p className="text-muted-foreground text-sm mt-0.5">
                                View daily attendance for all interns. View-only mode.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 bg-muted/30 p-2 rounded-xl border border-border/40 px-4">
                        <span className="text-sm font-semibold text-muted-foreground">Select Date:</span>
                        <AttendanceDatePicker
                            value={selectedDate}
                            onChange={setSelectedDate}
                            className="w-[180px] h-9 shadow-sm"
                        />
                    </div>
                </div>

                {/* ── Auto-Track Message ── */}
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-600 rounded-lg border border-blue-500/20 text-xs font-semibold w-fit">
                    <Info className="w-3.5 h-3.5" />
                    Attendance is auto-tracked based on intern check-in/check-out
                </div>

                {/* ── Summary Cards ── */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        { label: "Total Interns", value: totalCount, icon: CalendarDays, bg: "bg-violet-500/10", color: "text-violet-600" },
                        { label: "Present Interns", value: presentCount, icon: UserCheck, bg: "bg-emerald-500/10", color: "text-emerald-600" },
                        { label: "Absent Interns", value: absentCount, icon: UserX, bg: "bg-red-500/10", color: "text-red-600" },
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

                {/* ── Attendance Log Table ── */}
                <Card className="border-border/50 shadow-sm rounded-xl overflow-hidden">
                    <div className="p-4 bg-muted/10 border-b border-border/20 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <h2 className="font-semibold text-sm">Attendance Records for {format(new Date(selectedDate), "MMM dd, yyyy")}</h2>
                    </div>
                    <div className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/30">
                                        <TableHead className="text-[10px] font-bold uppercase tracking-wider w-12 text-center">#</TableHead>
                                        <TableHead className="text-[10px] font-bold uppercase tracking-wider">Intern Name</TableHead>
                                        <TableHead className="text-[10px] font-bold uppercase tracking-wider text-center">Check-in</TableHead>
                                        <TableHead className="text-[10px] font-bold uppercase tracking-wider text-center">Check-out</TableHead>
                                        <TableHead className="text-[10px] font-bold uppercase tracking-wider text-center">Duration</TableHead>
                                        <TableHead className="text-[10px] font-bold uppercase tracking-wider">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {records.map((record, idx) => (
                                        <TableRow
                                            key={record.internId}
                                            className="hover:bg-muted/10 transition-colors border-b border-border/10 last:border-0"
                                        >
                                            <TableCell className="text-xs text-muted-foreground text-center">
                                                {idx + 1}
                                            </TableCell>
                                            <TableCell className="text-sm font-semibold text-foreground">
                                                {record.internName}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <span className={`text-sm font-medium ${record.checkIn === "--" ? "text-muted-foreground opacity-40" : "text-emerald-600"}`}>
                                                    {record.checkIn}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <span className={`text-sm font-medium ${record.checkOut === "--" ? "text-muted-foreground opacity-40" : "text-orange-600"}`}>
                                                    {record.checkOut}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-sm font-bold text-foreground font-mono text-center">
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
                    </div>
                </Card>

            </div>
    );
};

export default CoordinatorAttendance;
