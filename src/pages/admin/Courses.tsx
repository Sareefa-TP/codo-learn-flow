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
  TableRow
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Calendar,
  GraduationCap,
  Users,
  LayoutDashboard,
  CheckCircle,
  Eye,
  FileText
} from "lucide-react";

// Mock Data
type Phase = "Learning" | "Internship" | "Completed" | "Upcoming";
type ViewMode = Phase | "All" | "Students";

interface Batch {
  id: string;
  name: string;
  startDate: string;
  learningEndDate?: string;
  internshipStartDate?: string;
  endDate: string;
  phase: Phase;
  totalStudents: number;
  capacity: number;
}

const mockBatches: Batch[] = [
  { id: "B1", name: "FSD Jan 2026", startDate: "2026-01-05", learningEndDate: "2026-03-05", internshipStartDate: "2026-03-06", endDate: "2026-04-05", phase: "Learning", totalStudents: 25, capacity: 30 },
  { id: "B2", name: "FSD Feb 2026", startDate: "2026-02-10", learningEndDate: "2026-04-10", internshipStartDate: "2026-04-11", endDate: "2026-05-10", phase: "Learning", totalStudents: 28, capacity: 30 },
  { id: "B3", name: "FSD Nov 2025", startDate: "2025-11-15", learningEndDate: "2026-01-15", internshipStartDate: "2026-01-16", endDate: "2026-02-15", phase: "Internship", totalStudents: 20, capacity: 25 },
  { id: "B4", name: "FSD Oct 2025", startDate: "2025-10-01", learningEndDate: "2025-12-01", internshipStartDate: "2025-12-02", endDate: "2026-01-01", phase: "Completed", totalStudents: 22, capacity: 25 },
  { id: "B5", name: "FSD Sep 2025", startDate: "2025-09-10", learningEndDate: "2025-11-10", internshipStartDate: "2025-11-11", endDate: "2025-12-10", phase: "Completed", totalStudents: 28, capacity: 30 },
  { id: "B6", name: "FSD Mar 2026", startDate: "2026-03-05", learningEndDate: "2026-05-05", internshipStartDate: "2026-05-06", endDate: "2026-06-05", phase: "Upcoming", totalStudents: 15, capacity: 30 },
  { id: "B7", name: "FSD Apr 2026", startDate: "2026-04-01", learningEndDate: "2026-06-01", internshipStartDate: "2026-06-02", endDate: "2026-07-01", phase: "Upcoming", totalStudents: 5, capacity: 30 },
  { id: "B8", name: "FSD Dec 2025", startDate: "2025-12-05", learningEndDate: "2026-02-05", internshipStartDate: "2026-02-06", endDate: "2026-03-05", phase: "Internship", totalStudents: 24, capacity: 30 },
];

interface Student {
  id: string;
  name: string;
  email: string;
  batchName: string;
  phase: Phase;
  progress: number;
  status: "Active" | "Completed" | "Inactive";
}

const mockAllStudents: Student[] = [
  { id: "S1", name: "Rahul Sharma", email: "rahul@example.com", batchName: "FSD Jan 2026", phase: "Learning", progress: 45, status: "Active" },
  { id: "S2", name: "Priya Singh", email: "priya@example.com", batchName: "FSD Jan 2026", phase: "Learning", progress: 80, status: "Active" },
  { id: "S3", name: "Amit Kumar", email: "amit@example.com", batchName: "FSD Oct 2025", phase: "Completed", progress: 100, status: "Completed" },
  { id: "S4", name: "Neha Gupta", email: "neha@example.com", batchName: "FSD Feb 2026", phase: "Learning", progress: 20, status: "Active" },
  { id: "S5", name: "Sara Khan", email: "sara@example.com", batchName: "FSD Nov 2025", phase: "Internship", progress: 65, status: "Active" },
  { id: "S6", name: "Arun Verma", email: "arun@example.com", batchName: "FSD Nov 2025", phase: "Internship", progress: 95, status: "Active" },
  { id: "S7", name: "Divya Patel", email: "divya@example.com", batchName: "FSD Sep 2025", phase: "Completed", progress: 100, status: "Completed" },
  { id: "S8", name: "Vikram Das", email: "vikram@example.com", batchName: "FSD Feb 2026", phase: "Learning", progress: 5, status: "Inactive" },
  { id: "S9", name: "Anjali Ray", email: "anjali@example.com", batchName: "FSD Jan 2026", phase: "Learning", progress: 50, status: "Active" },
  { id: "S10", name: "Rohit Krishnan", email: "rohit@example.com", batchName: "FSD Dec 2025", phase: "Internship", progress: 78, status: "Active" },
  { id: "S11", name: "Pooja Reddy", email: "pooja@example.com", batchName: "FSD Mar 2026", phase: "Upcoming", progress: 0, status: "Active" },
  { id: "S12", name: "Suresh Pillai", email: "suresh@example.com", batchName: "FSD Oct 2025", phase: "Completed", progress: 100, status: "Completed" },
  { id: "S13", name: "Meera Nair", email: "meera@example.com", batchName: "FSD Sep 2025", phase: "Completed", progress: 100, status: "Completed" },
  { id: "S14", name: "Kunal Singh", email: "kunal@example.com", batchName: "FSD Feb 2026", phase: "Learning", progress: 30, status: "Active" },
];

const AdminCourses = () => {
  const [filterMode, setFilterMode] = useState<ViewMode>("All");
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const totalBatches = mockBatches.length;
  const learningBatches = mockBatches.filter(b => b.phase === "Learning").length;
  const internshipBatches = mockBatches.filter(b => b.phase === "Internship").length;
  const completedBatches = mockBatches.filter(b => b.phase === "Completed").length;
  const totalStudents = mockBatches.reduce((acc, curr) => acc + curr.totalStudents, 0);

  const filteredBatches = (filterMode === "All" || filterMode === "Students")
    ? mockBatches
    : mockBatches.filter(b => b.phase === filterMode);

  const getPhaseBadge = (phase: Phase) => {
    switch (phase) {
      case "Learning":
        return <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-blue-500/20">Learning</Badge>;
      case "Internship":
        return <Badge className="bg-purple-500/10 text-purple-600 hover:bg-purple-500/20 border-purple-500/20">Internship</Badge>;
      case "Completed":
        return <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20">Completed</Badge>;
      case "Upcoming":
        return <Badge variant="outline" className="text-muted-foreground">Upcoming</Badge>;
      default:
        return <Badge>{phase}</Badge>;
    }
  };

  const handleViewBatch = (batch: Batch) => {
    setSelectedBatch(batch);
    setIsDrawerOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6 lg:space-y-8 max-w-7xl mx-auto pb-10">

        {/* Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
            Course & Classes
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage program structure and class batches.
          </p>
        </div>

        {/* Program Overview */}
        <section>
          <Card className="border-border/50 shadow-sm overflow-hidden bg-gradient-to-br from-indigo-50/50 to-white dark:from-indigo-950/20 dark:to-background">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex justify-between items-center">
                <span>Program Overview</span>
                <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                  Single Track Program
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Program Name</p>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-500" />
                    <span className="font-semibold text-foreground">Full Stack Development</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Duration</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-500" />
                    <span className="font-semibold text-foreground">3 Months</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Learning Phase</p>
                  <div className="flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4 text-blue-500" />
                    <span className="font-semibold text-foreground">2 Months</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Internship Phase</p>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-purple-500" />
                    <span className="font-semibold text-foreground">1 Month</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Summary Cards */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            <Card
              className={`cursor-pointer transition-all shadow-sm hover:shadow-md ${filterMode === "All" ? "ring-2 ring-indigo-500 border-indigo-500" : ""}`}
              onClick={() => setFilterMode("All")}
            >
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Batches</p>
                  <h3 className="text-2xl font-bold mt-1">{totalBatches}</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <LayoutDashboard className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </div>
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer transition-all shadow-sm hover:shadow-md ${filterMode === "Learning" ? "ring-2 ring-blue-500 border-blue-500" : ""}`}
              onClick={() => setFilterMode("Learning")}
            >
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Learning</p>
                  <h3 className="text-2xl font-bold mt-1">{learningBatches}</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer transition-all shadow-sm hover:shadow-md ${filterMode === "Internship" ? "ring-2 ring-purple-500 border-purple-500" : ""}`}
              onClick={() => setFilterMode("Internship")}
            >
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Internship</p>
                  <h3 className="text-2xl font-bold mt-1">{internshipBatches}</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer transition-all shadow-sm hover:shadow-md ${filterMode === "Completed" ? "ring-2 ring-emerald-500 border-emerald-500" : ""}`}
              onClick={() => setFilterMode("Completed")}
            >
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <h3 className="text-2xl font-bold mt-1">{completedBatches}</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer transition-all shadow-sm hover:shadow-md ${filterMode === "Students" ? "ring-2 ring-indigo-500 border-indigo-500" : ""}`}
              onClick={() => setFilterMode("Students")}
            >
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                  <h3 className="text-2xl font-bold mt-1">{totalStudents}</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                  <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Dynamic Table Section */}
        <section>
          {filterMode === "Students" ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-foreground">
                  All Students across Batches
                </h2>
              </div>
              <Card className="border-border/50 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow>
                        <TableHead className="pl-6">Student Details</TableHead>
                        <TableHead>Batch Name</TableHead>
                        <TableHead>Phase</TableHead>
                        <TableHead className="w-[15%]">Progress</TableHead>
                        <TableHead className="pr-6">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockAllStudents.length > 0 ? (
                        mockAllStudents.map((student) => (
                          <TableRow key={student.id} className="hover:bg-muted/20">
                            <TableCell className="pl-6">
                              <div>
                                <p className="font-medium text-foreground">{student.name}</p>
                                <p className="text-xs text-muted-foreground">{student.email}</p>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-foreground">
                              {student.batchName}
                            </TableCell>
                            <TableCell>
                              {getPhaseBadge(student.phase)}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-1.5 justify-center">
                                <div className="flex items-center gap-2">
                                  <Progress value={student.progress} className={`h-2 flex-1 ${student.progress === 100 ? '[&>div]:bg-emerald-500' : ''}`} />
                                  <span className="text-xs font-medium text-muted-foreground w-8 shrink-0">{student.progress}%</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="pr-6">
                              <Badge variant="outline" className={
                                student.status === "Active"
                                  ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                                  : student.status === "Completed"
                                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                    : "bg-destructive/10 text-destructive border-destructive/20"
                              }>
                                {student.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                            No students found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-foreground">
                  {filterMode === "All" ? "All Batches" : `${filterMode} Batches`}
                </h2>
              </div>
              <Card className="border-border/50 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow>
                        <TableHead className="pl-6">Batch Name</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>End Date</TableHead>
                        <TableHead>Phase</TableHead>
                        <TableHead>Students</TableHead>
                        <TableHead className="text-right pr-6">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBatches.length > 0 ? (
                        filteredBatches.map((batch) => (
                          <TableRow key={batch.id} className="hover:bg-muted/20">
                            <TableCell className="pl-6 font-medium text-foreground">
                              {batch.name}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {batch.startDate}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {batch.endDate}
                            </TableCell>
                            <TableCell>
                              {getPhaseBadge(batch.phase)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1.5">
                                <Users className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm font-medium">{batch.totalStudents}</span>
                                <span className="text-xs text-muted-foreground">/ {batch.capacity}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right pr-6">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="gap-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                                onClick={() => handleViewBatch(batch)}
                              >
                                <Eye className="w-4 h-4" /> View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                            No batches found for the selected phase.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </>
          )}
        </section>

        {/* Batch Detail Drawer */}
        <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <SheetContent className="w-full sm:max-w-xl overflow-y-auto pb-10">
            {selectedBatch && (
              <>
                <SheetHeader className="mb-6 text-left">
                  <SheetTitle className="text-2xl font-bold flex items-center gap-3">
                    <span>{selectedBatch.name}</span>
                    {getPhaseBadge(selectedBatch.phase)}
                  </SheetTitle>
                  <SheetDescription>
                    {selectedBatch.startDate} to {selectedBatch.endDate}
                  </SheetDescription>
                </SheetHeader>

                <div className="space-y-8">
                  {/* SECTION 2 — Batch Information Card */}
                  <Card className="border-border/50 shadow-sm">
                    <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        Batch Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-2 gap-y-5 gap-x-6 text-sm">
                        <div>
                          <p className="text-muted-foreground mb-1">Start Date</p>
                          <p className="font-semibold text-foreground">{selectedBatch.startDate}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">Learning End Date</p>
                          <p className="font-semibold text-foreground">{selectedBatch.learningEndDate || "-"}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">Internship Start Date</p>
                          <p className="font-semibold text-foreground">{selectedBatch.internshipStartDate || "-"}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">End Date</p>
                          <p className="font-semibold text-foreground">{selectedBatch.endDate}</p>
                        </div>
                        <div className="col-span-2 border-t border-border/50 pt-4 mt-1 grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-muted-foreground mb-1">Capacity</p>
                            <p className="font-semibold text-foreground">{selectedBatch.capacity}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">Enrolled</p>
                            <p className="font-semibold text-foreground">{selectedBatch.totalStudents}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">Remaining</p>
                            <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                              {selectedBatch.capacity - selectedBatch.totalStudents} Seats
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* SECTION 3 — Progress Section */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        Student Capacity
                      </h3>
                      <span className="text-sm font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                        {Math.round((selectedBatch.totalStudents / selectedBatch.capacity) * 100)}% Filled
                      </span>
                    </div>
                    <Progress value={(selectedBatch.totalStudents / selectedBatch.capacity) * 100} className="h-2.5" />
                  </div>

                  {/* SECTION 4 — Student List Table */}
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3 pb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      Enrolled Students
                    </h3>
                    <div className="border border-border/50 rounded-md overflow-hidden bg-card">
                      <Table>
                        <TableHeader className="bg-muted/30">
                          <TableRow>
                            <TableHead>Student</TableHead>
                            <TableHead>Progress</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockAllStudents.slice(0, 5).map((student) => (
                            <TableRow key={student.id} className="hover:bg-muted/20">
                              <TableCell>
                                <div className="font-medium text-sm text-foreground">{student.name}</div>
                                <div className="text-xs text-muted-foreground">{student.email}</div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col gap-1">
                                  <span className="text-xs font-medium">{student.progress}%</span>
                                  <Progress value={student.progress} className="h-1.5 w-16" />
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className={`font-normal ${student.status === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : student.status === "Inactive" ? "bg-destructive/10 text-destructive border-destructive/20" : "bg-blue-500/10 text-blue-600 border-blue-500/20"}`}>
                                  {student.status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </DashboardLayout>
  );
};

export default AdminCourses;
