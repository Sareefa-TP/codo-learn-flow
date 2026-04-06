import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Users, UserCheck, CalendarDays, AlertTriangle, Eye, Presentation, Hash } from "lucide-react";

// --- Types ---
interface Student {
  id: string;
  name: string;
  email: string;
}

interface Batch {
  id: string;
  name: string;
  tutorName: string;
  students: Student[];
}

interface AttendanceRecord {
  batchId: string;
  date: string;
  studentAttendance: {
    studentId: string;
    status: "Present" | "Absent";
  }[];
}

// --- Mock Data ---
const mockBatches: Batch[] = [
  {
    id: "b1",
    name: "FSD Jan 2026",
    tutorName: "Alex Johnson",
    students: [
      { id: "s1", name: "Rahul Sharma", email: "rahul@example.com" },
      { id: "s2", name: "Priya Singh", email: "priya@example.com" },
      { id: "s3", name: "Amit Kumar", email: "amit@example.com" },
      { id: "s4", name: "Neha Gupta", email: "neha@example.com" },
      { id: "s5", name: "Sara Khan", email: "sara@example.com" },
    ],
  },
  {
    id: "b2",
    name: "FSD Feb 2026",
    tutorName: "Sarah Williams",
    students: [
      { id: "s6", name: "John Doe", email: "john@example.com" },
      { id: "s7", name: "Jane Smith", email: "jane@example.com" },
      { id: "s8", name: "Mike Brown", email: "mike@example.com" },
      { id: "s9", name: "Emily Davis", email: "emily@example.com" },
    ],
  },
];

const mockAttendanceRecords: AttendanceRecord[] = [
  // FSD Jan 2026 Records
  {
    batchId: "b1",
    date: "2026-02-20",
    studentAttendance: [
      { studentId: "s1", status: "Present" },
      { studentId: "s2", status: "Present" },
      { studentId: "s3", status: "Absent" },
      { studentId: "s4", status: "Present" },
      { studentId: "s5", status: "Present" },
    ],
  },
  {
    batchId: "b1",
    date: "2026-02-21",
    studentAttendance: [
      { studentId: "s1", status: "Present" },
      { studentId: "s2", status: "Present" },
      { studentId: "s3", status: "Absent" },
      { studentId: "s4", status: "Present" },
      { studentId: "s5", status: "Present" },
    ],
  },
  {
    batchId: "b1",
    date: "2026-02-22",
    studentAttendance: [
      { studentId: "s1", status: "Present" },
      { studentId: "s2", status: "Absent" },
      { studentId: "s3", status: "Absent" },
      { studentId: "s4", status: "Present" },
      { studentId: "s5", status: "Present" },
    ],
  },
  {
    batchId: "b1",
    date: "2026-02-23",
    studentAttendance: [
      { studentId: "s1", status: "Present" },
      { studentId: "s2", status: "Present" },
      { studentId: "s3", status: "Present" },
      { studentId: "s4", status: "Present" },
      { studentId: "s5", status: "Absent" },
    ],
  },
  {
    batchId: "b1",
    date: "2026-02-24",
    studentAttendance: [
      { studentId: "s1", status: "Present" },
      { studentId: "s2", status: "Present" },
      { studentId: "s3", status: "Absent" },
      { studentId: "s4", status: "Absent" },
      { studentId: "s5", status: "Present" },
    ],
  },

  // FSD Feb 2026 Records
  {
    batchId: "b2",
    date: "2026-02-20",
    studentAttendance: [
      { studentId: "s6", status: "Present" },
      { studentId: "s7", status: "Present" },
      { studentId: "s8", status: "Present" },
      { studentId: "s9", status: "Present" },
    ],
  },
  {
    batchId: "b2",
    date: "2026-02-21",
    studentAttendance: [
      { studentId: "s6", status: "Absent" },
      { studentId: "s7", status: "Present" },
      { studentId: "s8", status: "Present" },
      { studentId: "s9", status: "Present" },
    ],
  },
  {
    batchId: "b2",
    date: "2026-02-22",
    studentAttendance: [
      { studentId: "s6", status: "Absent" },
      { studentId: "s7", status: "Present" },
      { studentId: "s8", status: "Absent" },
      { studentId: "s9", status: "Present" },
    ],
  },
  {
    batchId: "b2",
    date: "2026-02-23",
    studentAttendance: [
      { studentId: "s6", status: "Present" },
      { studentId: "s7", status: "Present" },
      { studentId: "s8", status: "Present" },
      { studentId: "s9", status: "Present" },
    ],
  },
  {
    batchId: "b2",
    date: "2026-02-24",
    studentAttendance: [
      { studentId: "s6", status: "Absent" },
      { studentId: "s7", status: "Present" },
      { studentId: "s8", status: "Present" },
      { studentId: "s9", status: "Absent" },
    ],
  },
];

// --- Calculation Helpers ---
const computeStudentAttendance = (studentId: string, batchRecords: AttendanceRecord[]) => {
  const totalDays = batchRecords.length;
  if (totalDays === 0) return { present: 0, absent: 0, percentage: 0 };

  const presentDays = batchRecords.reduce((count, record) => {
    const studentStatus = record.studentAttendance.find(s => s.studentId === studentId)?.status;
    return count + (studentStatus === "Present" ? 1 : 0);
  }, 0);

  const absentDays = totalDays - presentDays;
  const percentage = Math.round((presentDays / totalDays) * 100);

  return { present: presentDays, absent: absentDays, percentage };
};

const computeBatchAttendance = (batch: Batch) => {
  const batchRecords = mockAttendanceRecords.filter(r => r.batchId === batch.id);
  const totalDays = batchRecords.length;

  if (totalDays === 0) return { avgPercentage: 0, lowCount: 0, recordsCount: 0 };

  let totalPercentageSum = 0;
  let lowCount = 0;

  batch.students.forEach(student => {
    const { percentage } = computeStudentAttendance(student.id, batchRecords);
    totalPercentageSum += percentage;
    if (percentage < 75) {
      lowCount++;
    }
  });

  const avgPercentage = batch.students.length > 0 ? Math.round(totalPercentageSum / batch.students.length) : 0;

  return { avgPercentage, lowCount, recordsCount: totalDays };
};

// Main Component
const AdminAttendance = () => {
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"all" | "lowAttendance">("all");

  // Compute Globals
  let globalTotalPercentageSum = 0;
  let globalTotalStudents = 0;
  let globalLowCount = 0;
  let globalRecordedDays = 0; // Using max recorded days across batches for summary

  const computedBatches = mockBatches.map(batch => {
    const computed = computeBatchAttendance(batch);

    globalTotalPercentageSum += (computed.avgPercentage * batch.students.length);
    globalTotalStudents += batch.students.length;
    globalLowCount += computed.lowCount;
    if (computed.recordsCount > globalRecordedDays) {
      globalRecordedDays = computed.recordsCount;
    }

    return { ...batch, ...computed };
  });

  const filteredBatches = computedBatches.filter(batch => {
    if (activeFilter === "lowAttendance") {
      return batch.lowCount > 0;
    }
    return true;
  });

  const overallAttendance = globalTotalStudents > 0 ? Math.round(globalTotalPercentageSum / globalTotalStudents) : 0;

  const openDrawer = (batch: Batch) => {
    setSelectedBatch(batch);
    setIsDrawerOpen(true);
  };

  const selectedBatchRecords = selectedBatch ? mockAttendanceRecords.filter(r => r.batchId === selectedBatch.id) : [];

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6 lg:space-y-8 max-w-7xl mx-auto pb-10">

        {/* Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
            Attendance Monitoring
          </h1>
          <p className="text-muted-foreground mt-2">
            Track batch attendance performance and identify low attendance students.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <Card
            className={`border-border/50 shadow-sm cursor-pointer transition-all hover:border-indigo-500/50 hover:shadow-md ${activeFilter === "all" ? "ring-2 ring-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20" : ""}`}
            onClick={() => setActiveFilter("all")}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className={`text-sm font-medium ${activeFilter === "all" ? "text-indigo-700 dark:text-indigo-400" : "text-muted-foreground"}`}>
                Total Batches
              </CardTitle>
              <div className="w-8 h-8 rounded-full bg-indigo-100/50 flex items-center justify-center">
                <Presentation className="w-4 h-4 text-indigo-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockBatches.length}</div>
            </CardContent>
          </Card>

          <Card
            className="border-border/50 shadow-sm cursor-pointer transition-all hover:border-blue-500/50 hover:shadow-md"
            onClick={() => setActiveFilter("all")}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Overall Attendance
              </CardTitle>
              <div className="w-8 h-8 rounded-full bg-blue-100/50 flex items-center justify-center">
                <UserCheck className="w-4 h-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallAttendance}%</div>
            </CardContent>
          </Card>

          <Card
            className={`border-border/50 shadow-sm cursor-pointer transition-all hover:border-destructive/50 hover:shadow-md ${activeFilter === "lowAttendance" ? "ring-2 ring-destructive bg-destructive/10" : ""}`}
            onClick={() => setActiveFilter("lowAttendance")}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className={`text-sm font-medium ${activeFilter === "lowAttendance" ? "text-destructive" : "text-muted-foreground"}`}>
                Low Attendance {"(<75%)"}
              </CardTitle>
              <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-destructive" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{globalLowCount} Students</div>
            </CardContent>
          </Card>

          <Card
            className="border-border/50 shadow-sm cursor-pointer transition-all hover:border-emerald-500/50 hover:shadow-md"
            onClick={() => setActiveFilter("all")}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Recorded Days
              </CardTitle>
              <div className="w-8 h-8 rounded-full bg-emerald-100/50 flex items-center justify-center">
                <CalendarDays className="w-4 h-4 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{globalRecordedDays}</div>
            </CardContent>
          </Card>
        </div>

        {/* Batch Summary Table */}
        <Card className="border-border/50 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="pl-6">Batch Name</TableHead>
                  <TableHead>Tutor Name</TableHead>
                  <TableHead>Total Students</TableHead>
                  <TableHead>Avg Attendance</TableHead>
                  <TableHead>Low Attendance Count</TableHead>
                  <TableHead className="text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBatches.map((batch) => (
                  <TableRow key={batch.id} className="hover:bg-muted/20">
                    <TableCell className="pl-6 font-medium text-foreground">
                      {batch.name}
                    </TableCell>
                    <TableCell>{batch.tutorName}</TableCell>
                    <TableCell>{batch.students.length}</TableCell>
                    <TableCell>
                      <Badge className={
                        batch.avgPercentage >= 75 ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 shadow-none hover:bg-emerald-500/20" :
                          batch.avgPercentage >= 60 ? "bg-amber-500/10 text-amber-600 border-amber-500/20 shadow-none hover:bg-amber-500/20" :
                            "bg-destructive/10 text-destructive border-destructive/20 shadow-none hover:bg-destructive/20"
                      }>
                        {batch.avgPercentage}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {batch.lowCount > 0 ? (
                        <div className="flex items-center gap-1.5 text-destructive font-medium">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          {batch.lowCount}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">0</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                        title="View details"
                        onClick={() => openDrawer(batch)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      {/* Batch Detail Drawer */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-full sm:max-w-md md:max-w-xl lg:max-w-3xl overflow-y-auto">
          {selectedBatch && (
            <div className="flex flex-col gap-6 py-4">
              <SheetHeader className="pb-4 border-b">
                <SheetTitle className="text-2xl font-bold flex items-center gap-3">
                  {selectedBatch.name} Attendance
                </SheetTitle>
              </SheetHeader>

              {/* Section A: Batch Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2 border-b pb-2">
                  <Presentation className="w-5 h-5 text-indigo-500" />
                  Batch Info
                </h3>
                <Card className="shadow-none border-border/50 bg-muted/20">
                  <CardContent className="p-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground w-full block">Tutor Name</span>
                      <span className="text-sm font-medium line-clamp-1">{selectedBatch.tutorName}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground w-full block">Total Students</span>
                      <span className="text-sm font-medium flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-muted-foreground" />{selectedBatch.students.length}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground w-full block">Avg Attendance</span>
                      <span className="text-sm font-medium">{computeBatchAttendance(selectedBatch).avgPercentage}%</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground w-full block">Recorded Days</span>
                      <span className="text-sm font-medium flex items-center gap-1.5"><Hash className="w-3.5 h-3.5 text-muted-foreground" />{selectedBatchRecords.length}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Section B: Student Attendance Table */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2 border-b pb-2">
                  <UserCheck className="w-5 h-5 text-indigo-500" />
                  Student Performance
                </h3>

                <div className="border border-border/50 rounded-md overflow-hidden bg-card">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow>
                        <TableHead>Student Name</TableHead>
                        <TableHead className="text-center">Present</TableHead>
                        <TableHead className="text-center">Absent</TableHead>
                        <TableHead className="text-center">Attendance %</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedBatch.students.map((student) => {
                        const stats = computeStudentAttendance(student.id, selectedBatchRecords);

                        let statusConfig = {
                          label: "Good",
                          className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        };

                        if (stats.percentage < 60) {
                          statusConfig = {
                            label: "Critical",
                            className: "bg-destructive/10 text-destructive border-destructive/20"
                          };
                        } else if (stats.percentage < 75) {
                          statusConfig = {
                            label: "Warning",
                            className: "bg-amber-500/10 text-amber-600 border-amber-500/20"
                          };
                        }

                        return (
                          <TableRow key={student.id} className="hover:bg-muted/10">
                            <TableCell>
                              <div className="font-medium text-sm">{student.name}</div>
                              <div className="text-muted-foreground text-xs">{student.email}</div>
                            </TableCell>
                            <TableCell className="text-center font-medium text-emerald-600">{stats.present}</TableCell>
                            <TableCell className="text-center font-medium text-destructive">{stats.absent}</TableCell>
                            <TableCell className="text-center font-medium">{stats.percentage}%</TableCell>
                            <TableCell className="text-right">
                              <Badge className={`shadow-none ${statusConfig.className}`}>
                                {statusConfig.label}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="pt-4 border-t border-border/50 flex justify-end">
                <Button variant="outline" onClick={() => setIsDrawerOpen(false)}>Close Panel</Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

    </DashboardLayout>
  );
};

export default AdminAttendance;
