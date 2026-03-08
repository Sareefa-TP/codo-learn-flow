import { useState, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
    Calendar as CalendarIcon, CheckCircle2, XCircle, Clock, Save, History,
    UserCheck, Users, CalendarClock
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

// ─── Types ────────────────────────────────────────────────────────────────────

type AttendanceStatus = "Present" | "Absent" | "Leave" | "Late" | "Unmarked";

interface Intern {
    id: string;
    name: string;
    program: string;
}

interface AttendanceRecord {
    id: string;
    date: string;
    internId: string;
    internName: string;
    status: AttendanceStatus;
    notes: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const assignedInterns: Intern[] = [
    { id: "INT-001", name: "Aarav Singh", program: "Full Stack - Mar 2026" },
    { id: "INT-002", name: "Priya Sharma", program: "Full Stack - Mar 2026" },
    { id: "INT-003", name: "Sneha Verma", program: "Full Stack - Mar 2026" },
    { id: "INT-004", name: "Rahul Mehta", program: "Full Stack - Mar 2026" },
    { id: "INT-005", name: "Karan Nair", program: "Full Stack - Mar 2026" },
];

const initialHistory: AttendanceRecord[] = [
    { id: "ATT-101", date: "2026-03-05", internId: "INT-001", internName: "Aarav Singh", status: "Present", notes: "" },
    { id: "ATT-102", date: "2026-03-05", internId: "INT-002", internName: "Priya Sharma", status: "Present", notes: "" },
    { id: "ATT-103", date: "2026-03-05", internId: "INT-003", internName: "Sneha Verma", status: "Absent", notes: "Sick leave reported" },
    { id: "ATT-104", date: "2026-03-05", internId: "INT-004", internName: "Rahul Mehta", status: "Present", notes: "" },
    { id: "ATT-105", date: "2026-03-05", internId: "INT-005", internName: "Karan Nair", status: "Late", notes: "Traffic" },

    { id: "ATT-096", date: "2026-03-04", internId: "INT-001", internName: "Aarav Singh", status: "Present", notes: "" },
    { id: "ATT-097", date: "2026-03-04", internId: "INT-002", internName: "Priya Sharma", status: "Present", notes: "" },
    { id: "ATT-098", date: "2026-03-04", internId: "INT-003", internName: "Sneha Verma", status: "Present", notes: "" },
    { id: "ATT-099", date: "2026-03-04", internId: "INT-004", internName: "Rahul Mehta", status: "Present", notes: "" },
    { id: "ATT-100", date: "2026-03-04", internId: "INT-005", internName: "Karan Nair", status: "Present", notes: "" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const statusStyles: Record<AttendanceStatus, string> = {
    Present: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    Absent: "bg-rose-500/10    text-rose-600    border-rose-500/20",
    Leave: "bg-blue-500/10    text-blue-600    border-blue-500/20",
    Late: "bg-amber-500/10   text-amber-600   border-amber-500/20",
    Unmarked: "bg-muted          text-muted-foreground border-border/40",
};

const StatusIcon = ({ status, className = "w-4 h-4" }: { status: AttendanceStatus, className?: string }) => {
    if (status === "Present") return <CheckCircle2 className={`${className} text-emerald-600`} />;
    if (status === "Absent") return <XCircle className={`${className} text-rose-600`} />;
    if (status === "Late") return <Clock className={`${className} text-amber-600`} />;
    if (status === "Leave") return <CalendarClock className={`${className} text-blue-600`} />;
    return <UserCheck className={`${className} text-muted-foreground opacity-50`} />;
};

// ─── Component ────────────────────────────────────────────────────────────────

const MentorAttendance = () => {
    // Current marking date
    const today = format(new Date(), "yyyy-MM-dd");
    const [selectedDate, setSelectedDate] = useState(today);

    // History
    const [history, setHistory] = useState<AttendanceRecord[]>(initialHistory);

    // Current marking state: mapping of internId -> { status, notes }
    const [markingData, setMarkingData] = useState<Record<string, { status: AttendanceStatus, notes: string }>>(() => {
        // Initialize with default 'Present' or Unmarked
        const initial: Record<string, { status: AttendanceStatus, notes: string }> = {};
        assignedInterns.forEach(int => {
            initial[int.id] = { status: "Unmarked", notes: "" };
        });
        return initial;
    });

    // Handle date change (load existing records if any, otherwise reset)
    const handleDateChange = (newDate: string) => {
        setSelectedDate(newDate);

        const recordsForDate = history.filter(h => h.date === newDate);
        const newData: Record<string, { status: AttendanceStatus, notes: string }> = {};

        assignedInterns.forEach(int => {
            const existing = recordsForDate.find(r => r.internId === int.id);
            if (existing) {
                newData[int.id] = { status: existing.status, notes: existing.notes };
            } else {
                newData[int.id] = { status: "Unmarked", notes: "" };
            }
        });

        setMarkingData(newData);
    };

    // Current metrics for summary cards (based on current marking state)
    const metrics = useMemo(() => {
        const total = assignedInterns.length;
        let present = 0;
        let absent = 0;
        let unmarked = 0;

        Object.values(markingData).forEach(st => {
            if (st.status === "Present" || st.status === "Late") present++;
            else if (st.status === "Absent" || st.status === "Leave") absent++;
            else unmarked++;
        });

        const markedCount = total - unmarked;
        const rate = markedCount > 0 ? Math.round((present / markedCount) * 100) : 0;

        return { total, present, absent, rate, unmarked };
    }, [markingData]);

    // Bulk actions
    const markAll = (status: AttendanceStatus) => {
        setMarkingData(prev => {
            const next = { ...prev };
            Object.keys(next).forEach(id => {
                next[id] = { ...next[id], status };
            });
            return next;
        });
        toast.info(`All marked as ${status}`);
    };

    // Save
    const handleSave = () => {
        const hasUnmarked = Object.values(markingData).some(d => d.status === "Unmarked");
        if (hasUnmarked) {
            toast.error("Please select a status for all interns before saving.");
            return;
        }

        const newRecords: AttendanceRecord[] = assignedInterns.map(int => ({
            id: `ATT-${Date.now()}-${int.id}`,
            date: selectedDate,
            internId: int.id,
            internName: int.name,
            status: markingData[int.id].status,
            notes: markingData[int.id].notes,
        }));

        // Remove old records for this date, add new ones
        const filteredHistory = history.filter(h => h.date !== selectedDate);
        setHistory([...newRecords, ...filteredHistory]);

        toast.success(`Attendance saved for ${selectedDate}`);
    };

    // Sort history newest first
    const sortedHistory = useMemo(() => {
        return [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [history]);

    return (
        <DashboardLayout>
            <div className="animate-fade-in space-y-8 max-w-7xl mx-auto pb-10">

                {/* Header & Date Picker */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Intern Attendance</h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Mark and monitor daily attendance for your interns.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Label className="font-semibold text-muted-foreground whitespace-nowrap">Date:</Label>
                        <div className="relative">
                            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                            <Input
                                type="date"
                                className="pl-9 bg-background shadow-sm w-[160px]"
                                value={selectedDate}
                                onChange={(e) => handleDateChange(e.target.value)}
                                max={today}
                            />
                        </div>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="border-border/50 shadow-sm rounded-xl">
                        <CardContent className="p-5 flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                <Users className="w-4 h-4" />
                                <span className="text-sm font-medium">Total Interns</span>
                            </div>
                            <span className="text-2xl font-bold">{metrics.total}</span>
                        </CardContent>
                    </Card>
                    <Card className="border-border/50 shadow-sm rounded-xl">
                        <CardContent className="p-5 flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-emerald-600 mb-1">
                                <CheckCircle2 className="w-4 h-4" />
                                <span className="text-sm font-medium">Present</span>
                            </div>
                            <span className="text-2xl font-bold">{metrics.present}</span>
                        </CardContent>
                    </Card>
                    <Card className="border-border/50 shadow-sm rounded-xl">
                        <CardContent className="p-5 flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-rose-600 mb-1">
                                <XCircle className="w-4 h-4" />
                                <span className="text-sm font-medium">Absent / Leave</span>
                            </div>
                            <span className="text-2xl font-bold">{metrics.absent}</span>
                        </CardContent>
                    </Card>
                    <Card className="border-border/50 shadow-sm rounded-xl">
                        <CardContent className="p-5 flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-blue-600 mb-1">
                                <CalendarClock className="w-4 h-4" />
                                <span className="text-sm font-medium">Attendance Rate</span>
                            </div>
                            <span className="text-2xl font-bold">{metrics.rate}%</span>
                            {metrics.unmarked > 0 && <span className="text-xs text-muted-foreground">({metrics.unmarked} unmarked)</span>}
                        </CardContent>
                    </Card>
                </div>

                {/* Marking Section */}
                <Card className="border-border/50 shadow-sm rounded-xl overflow-hidden">
                    <div className="p-4 bg-muted/30 border-b border-border/40 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <UserCheck className="w-5 h-5 text-primary" />
                            <h2 className="font-semibold text-lg">Mark Attendance</h2>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={() => markAll("Present")}>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Mark All Present
                            </Button>
                            <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={() => markAll("Absent")}>
                                <XCircle className="w-3.5 h-3.5 text-rose-600" /> Mark All Absent
                            </Button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/10">
                                    <TableHead className="w-[200px] font-semibold">Intern Name</TableHead>
                                    <TableHead className="font-semibold">Program</TableHead>
                                    <TableHead className="w-[180px] font-semibold">Status</TableHead>
                                    <TableHead className="font-semibold">Notes (Optional)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {assignedInterns.map(intern => {
                                    const data = markingData[intern.id];
                                    return (
                                        <TableRow key={intern.id} className="hover:bg-muted/5">
                                            <TableCell className="font-medium text-sm">{intern.name}</TableCell>
                                            <TableCell className="text-sm text-muted-foreground">{intern.program}</TableCell>
                                            <TableCell>
                                                <Select
                                                    value={data.status}
                                                    onValueChange={(val: AttendanceStatus) => setMarkingData(p => ({ ...p, [intern.id]: { ...p[intern.id], status: val } }))}
                                                >
                                                    <SelectTrigger className={`h-8 text-xs font-semibold ${data.status !== "Unmarked" ? statusStyles[data.status] : ""
                                                        }`}>
                                                        <div className="flex items-center gap-2">
                                                            {data.status !== "Unmarked" && <StatusIcon status={data.status} className="w-3.5 h-3.5" />}
                                                            <SelectValue placeholder="Select status" />
                                                        </div>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Present">Present</SelectItem>
                                                        <SelectItem value="Absent">Absent</SelectItem>
                                                        <SelectItem value="Late">Late</SelectItem>
                                                        <SelectItem value="Leave">Leave</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    placeholder="Add note..."
                                                    className="h-8 text-sm"
                                                    value={data.notes}
                                                    onChange={e => setMarkingData(p => ({ ...p, [intern.id]: { ...p[intern.id], notes: e.target.value } }))}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="p-4 bg-muted/10 border-t border-border/40 flex justify-end">
                        <Button onClick={handleSave} className="gap-2">
                            <Save className="w-4 h-4" /> Save Attendance
                        </Button>
                    </div>
                </Card>

                {/* History Section */}
                <div className="space-y-4 pt-6">
                    <div className="flex items-center gap-2 px-1">
                        <History className="w-5 h-5 text-muted-foreground" />
                        <h2 className="text-lg font-semibold">Attendance History</h2>
                    </div>

                    <Card className="border-border/50 shadow-sm rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/30">
                                        <TableHead className="text-xs font-semibold w-[120px]">Date</TableHead>
                                        <TableHead className="text-xs font-semibold w-[200px]">Intern Name</TableHead>
                                        <TableHead className="text-xs font-semibold w-[140px]">Status</TableHead>
                                        <TableHead className="text-xs font-semibold">Notes</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sortedHistory.length > 0 ? sortedHistory.map(record => (
                                        <TableRow key={record.id} className="hover:bg-muted/5">
                                            <TableCell className="text-sm font-medium whitespace-nowrap">{record.date}</TableCell>
                                            <TableCell className="text-sm text-foreground">{record.internName}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1.5">
                                                    <StatusIcon status={record.status} className="w-3.5 h-3.5" />
                                                    <Badge variant="outline" className={`text-[10px] font-semibold ${statusStyles[record.status]}`}>
                                                        {record.status}
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {record.notes || <span className="italic opacity-50">None</span>}
                                            </TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-24 text-center text-muted-foreground text-sm">
                                                No attendance history found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                </div>

            </div>
        </DashboardLayout>
    );
};

export default MentorAttendance;
