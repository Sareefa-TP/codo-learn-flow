import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Users,
  CheckCircle,
  TrendingUp,
  UserX,
  Search,
  MoreVertical,
  Eye,
  Edit,
  Repeat,
  ArrowRight,
  Power,
  Trash2,
  FileText,
  Download,
  UserPlus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AddStudentModal } from "@/components/admin/students/AddStudentModal";

// Static mock data conforming to structure
const realisticAssignments = [
  {
    id: "1",
    title: "HTML Fundamentals",
    submissionDate: "2025-01-10",
    status: "Graded",
    grade: 85,
    feedback: "Good structure and clean markup.",
    fileUrl: "https://example.com/html-assignment.pdf"
  },
  {
    id: "2",
    title: "CSS Layout Design",
    submissionDate: "2025-01-18",
    status: "Graded",
    grade: 78,
    feedback: "Improve responsiveness and spacing.",
    fileUrl: "https://example.com/css-assignment.pdf"
  },
  {
    id: "3",
    title: "JavaScript Basics",
    submissionDate: "2025-01-25",
    status: "Submitted",
    grade: null,
    feedback: "",
    fileUrl: "https://example.com/js-assignment.pdf"
  },
  {
    id: "4",
    title: "React Mini Project",
    submissionDate: null,
    status: "Missing",
    grade: null,
    feedback: "",
    fileUrl: null
  }
];

const mockAssignmentsB = [
  { id: "A1", title: "React Fundamentals", submissionDate: "10 Feb 2026", status: "Graded", grade: 85, feedback: "Good job.", fileUrl: "#" }
];

const initialStudents = [
  { id: "S1", name: "Ravi Kumar", email: "ravi@example.com", batch: "Jan 2026 Cohort", phase: "Learning", progress: 65, attendance: 85, status: "Active", mentor: "", internshipStatus: "", assignments: realisticAssignments },
  { id: "S2", name: "Priya Singh", email: "priya@example.com", batch: "Oct 2025 Cohort", phase: "Learning", progress: 100, attendance: 92, status: "Active", mentor: "", internshipStatus: "", assignments: realisticAssignments },
  { id: "S3", name: "Rahul Sharma", email: "rahul@example.com", batch: "Feb 2026 Python", phase: "Learning", progress: 40, attendance: 60, status: "Active", mentor: "", internshipStatus: "", assignments: [] },
  { id: "S4", name: "Neha Gupta", email: "neha@example.com", batch: "Jan 2026 Cohort", phase: "Learning", progress: 12, attendance: 30, status: "Inactive", mentor: "", internshipStatus: "", assignments: [] },
  { id: "S5", name: "Amit Verma", email: "amit@example.com", batch: "Oct 2025 Cohort", phase: "Learning", progress: 100, attendance: 78, status: "Active", mentor: "", internshipStatus: "", assignments: realisticAssignments },
  { id: "S6", name: "Sara Khan", email: "sara@example.com", batch: "Feb 2026 Python", phase: "Learning", progress: 85, attendance: 55, status: "Active", mentor: "", internshipStatus: "", assignments: mockAssignmentsB },
  { id: "S7", name: "Ajay Dev", email: "ajay@example.com", batch: "Jul 2025 Evening", phase: "Internship", progress: 100, attendance: 95, status: "Active", mentor: "Arun", internshipStatus: "Placed", assignments: [] } // Intern - should not appear
];

const BATCHES = ["Jan 2026 Cohort", "Oct 2025 Cohort", "Jul 2025 Evening", "Feb 2026 Python"];

const AdminStudents = () => {
  const { toast } = useToast();

  // Data state
  const [students, setStudents] = useState(initialStudents);

  // Filters state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBatch, setFilterBatch] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterProgress, setFilterProgress] = useState("All"); // "All" or "Ready" (100%)

  // Modals state
  const [viewStudent, setViewStudent] = useState<typeof initialStudents[0] | null>(null);
  const [editStudent, setEditStudent] = useState<typeof initialStudents[0] | null>(null);
  const [changeBatchStudent, setChangeBatchStudent] = useState<typeof initialStudents[0] | null>(null);
  const [moveInternshipStudent, setMoveInternshipStudent] = useState<typeof initialStudents[0] | null>(null);
  const [deleteStudent, setDeleteStudent] = useState<typeof initialStudents[0] | null>(null);

  // Forms state
  const [editForm, setEditForm] = useState({ name: "", email: "", batch: "", status: "" });
  const [newBatchValue, setNewBatchValue] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Base learning students
  const learningStudents = students.filter(s => s.phase === "Learning");

  // Summary logic
  const totalLearning = learningStudents.length;
  const activeLearning = learningStudents.filter(s => s.status === "Active").length;
  const avgProgress = totalLearning > 0 ? Math.round(learningStudents.reduce((acc, curr) => acc + curr.progress, 0) / totalLearning) : 0;
  const readyCount = learningStudents.filter(s => s.progress === 100).length;
  const inactiveCount = learningStudents.filter(s => s.status === "Inactive").length;

  // Filtered list
  const filteredStudents = learningStudents.filter(student => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.batch.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBatch = filterBatch === "All" || student.batch === filterBatch;
    const matchesStatus = filterStatus === "All" || student.status === filterStatus;
    const matchesProgress = filterProgress === "All" || (filterProgress === "Ready" && student.progress === 100);

    return matchesSearch && matchesBatch && matchesStatus && matchesProgress;
  });

  // Actions
  const handleOpenEdit = (student: typeof initialStudents[0]) => {
    setEditForm({ name: student.name, email: student.email, batch: student.batch, status: student.status });
    setEditStudent(student);
  };

  const handleSaveEdit = () => {
    if (!editStudent) return;
    setStudents(students.map(s => s.id === editStudent.id ? { ...s, ...editForm } : s));
    toast({ title: "Student Updated", description: "Student details have been saved." });
    setEditStudent(null);
  };

  const handleSaveBatch = () => {
    if (!changeBatchStudent || !newBatchValue) return;
    setStudents(students.map(s => s.id === changeBatchStudent.id ? { ...s, batch: newBatchValue } : s));
    toast({ title: "Batch Changed", description: "Student's batch has been updated." });
    setChangeBatchStudent(null);
    setNewBatchValue("");
  };

  const handleConfirmInternship = () => {
    if (!moveInternshipStudent) return;
    setStudents(students.map(s => s.id === moveInternshipStudent.id ? { ...s, phase: "Internship" } : s));
    toast({ title: "Moved to Internship", description: `${moveInternshipStudent.name} is now in Internship phase.` });
    setMoveInternshipStudent(null);
  };

  const handleToggleStatus = (student: typeof initialStudents[0]) => {
    const newStatus = student.status === "Active" ? "Inactive" : "Active";
    setStudents(students.map(s => s.id === student.id ? { ...s, status: newStatus } : s));
    toast({ title: "Status Updated", description: `Student marked as ${newStatus}.` });
  };

  const handleSaveNewStudent = (newStudent: any) => {
    // Merge new student at top of list
    setStudents([newStudent, ...students]);
    setIsAddModalOpen(false);
    toast({
      title: "Student Created",
      description: `${newStudent.name} has been successfully enrolled.`
    });
  };

  const handleConfirmDelete = () => {
    if (!deleteStudent) return;
    setStudents(students.filter(s => s.id !== deleteStudent.id));
    toast({ title: "Student Deleted", description: "Student has been removed.", variant: "destructive" });
    setDeleteStudent(null);
  };

  // Summary Click Handlers
  const applyFilter = (type: "Total" | "Ready" | "Inactive") => {
    setSearchTerm("");
    setFilterBatch("All");
    if (type === "Total") {
      setFilterStatus("All");
      setFilterProgress("All");
    } else if (type === "Ready") {
      setFilterStatus("All");
      setFilterProgress("Ready");
    } else if (type === "Inactive") {
      setFilterStatus("Inactive");
      setFilterProgress("All");
    }
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6 lg:space-y-8 max-w-7xl mx-auto pb-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
              Learning Phase Students
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage students currently in the learning program.
            </p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Add Student
          </Button>
        </div>

        {/* 1. Summary Cards */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card
              className="group cursor-pointer hover:border-blue-500/50 hover:shadow-md transition-all"
              onClick={() => applyFilter("Total")}
            >
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground group-hover:text-blue-600 transition-colors">Total Learning Students</p>
                  <h3 className="text-2xl font-bold mt-1">{totalLearning}</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-sm transition-all shadow-sm">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Progress</p>
                  <h3 className="text-2xl font-bold mt-1">{avgProgress}%</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
              </CardContent>
            </Card>

            <Card
              className="group cursor-pointer hover:border-emerald-500/50 hover:shadow-md transition-all"
              onClick={() => applyFilter("Ready")}
            >
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground group-hover:text-emerald-600 transition-colors">Ready for Internship</p>
                  <h3 className="text-2xl font-bold mt-1">{readyCount}</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </CardContent>
            </Card>

            <Card
              className="group cursor-pointer hover:border-destructive/50 hover:shadow-md transition-all"
              onClick={() => applyFilter("Inactive")}
            >
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground group-hover:text-destructive transition-colors">Inactive Students</p>
                  <h3 className="text-2xl font-bold mt-1">{inactiveCount}</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                  <UserX className="w-5 h-5 text-destructive" />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 2. Filters & Search */}
        <section className="bg-card border border-border/50 rounded-xl p-4 md:p-5 flex flex-col md:flex-row gap-4 justify-between items-center shadow-sm">
          {/* Search Bar - 60% Width on Desktop */}
          <div className="relative w-full md:w-[60%]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or batch..."
              className="pl-9 bg-background h-10 w-full rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filters - 40% Width area (flexed) on Desktop */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="w-full sm:w-[200px]">
              <Select value={filterBatch} onValueChange={setFilterBatch}>
                <SelectTrigger className="h-10 bg-background rounded-lg">
                  <SelectValue placeholder="All Batches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Batches</SelectItem>
                  {BATCHES.map(b => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full sm:w-[160px]">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="h-10 bg-background rounded-lg">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* 3. Table */}
        <Card className="border-border/50 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="pl-6 w-[250px]">Student Details</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead className="w-[15%]">Progress</TableHead>
                  <TableHead className="w-[15%]">Attendance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="pr-6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <TableRow key={student.id} className="hover:bg-muted/20">
                      <TableCell className="pl-6">
                        <div>
                          <p className="font-medium text-foreground">{student.name}</p>
                          <p className="text-xs text-muted-foreground">{student.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-foreground">
                        {student.batch}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={student.progress} className={`h-2 flex-1 ${student.progress === 100 ? '[&>div]:bg-emerald-500' : ''}`} />
                          <span className="text-xs font-medium text-muted-foreground w-8 shrink-0">{student.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1.5 justify-center">
                          <span className="text-sm font-semibold text-foreground">{student.attendance ?? 0}%</span>
                          <Progress
                            value={student.attendance ?? 0}
                            className={`h-1.5 w-full ${(student.attendance ?? 0) >= 75 ? "[&>div]:bg-emerald-500" :
                              (student.attendance ?? 0) >= 50 ? "[&>div]:bg-yellow-500" :
                                "[&>div]:bg-destructive"
                              }`}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          student.status === "Active"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20"
                            : "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20"
                        }>
                          {student.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="w-8 h-8 hover:bg-muted">
                              <MoreVertical className="w-4 h-4 text-muted-foreground" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => setViewStudent(student)}>
                              <Eye className="w-4 h-4" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => handleOpenEdit(student)}>
                              <Edit className="w-4 h-4" /> Edit Student
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => {
                              setChangeBatchStudent(student);
                              setNewBatchValue(student.batch);
                            }}>
                              <Repeat className="w-4 h-4" /> Change Batch
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer gap-2 text-indigo-600 focus:text-indigo-600"
                              onClick={() => setMoveInternshipStudent(student)}
                            >
                              <ArrowRight className="w-4 h-4" /> Move to Internship
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer gap-2"
                              onClick={() => handleToggleStatus(student)}
                            >
                              <Power className="w-4 h-4" />
                              {student.status === "Active" ? "Deactivate Student" : "Activate Student"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer gap-2 text-destructive focus:text-destructive focus:bg-destructive/10"
                              onClick={() => setDeleteStudent(student)}
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="py-12 text-center text-muted-foreground">
                      No matching students found in the Learning Phase.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* 4. Modals */}

        {/* View Modal */}
        <Dialog open={!!viewStudent} onOpenChange={(open) => !open && setViewStudent(null)}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Student Overview</DialogTitle>
            </DialogHeader>
            {viewStudent && (
              <div className="space-y-8 py-4">

                {/* Basic Information */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-4 pb-2 border-b border-border/50">Basic Information</h3>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1">Full Name</p>
                      <p className="font-semibold text-foreground">{viewStudent.name}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Email</p>
                      <p className="font-semibold text-foreground break-all">{viewStudent.email}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Current Batch</p>
                      <p className="font-semibold text-foreground">{viewStudent.batch}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Phase</p>
                      <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20">{viewStudent.phase}</Badge>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Status</p>
                      <Badge variant="outline" className={viewStudent.status === "Active" ? "bg-emerald-500/10 text-emerald-600" : "bg-destructive/10 text-destructive"}>
                        {viewStudent.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Academic Info */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-4 pb-2 border-b border-border/50">Academic Info</h3>
                  <div className="grid grid-cols-2 gap-x-6">
                    <div>
                      <p className="text-muted-foreground mb-2 text-sm">Course Progress</p>
                      <div className="flex items-center gap-3">
                        <Progress value={viewStudent.progress} className={`h-2 flex-1 ${viewStudent.progress === 100 ? '[&>div]:bg-emerald-500' : ''}`} />
                        <span className="text-sm font-semibold">{viewStudent.progress}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-2 text-sm">Attendance</p>
                      <div className="flex items-center gap-3">
                        <Progress
                          value={viewStudent.attendance ?? 0}
                          className={`h-2 flex-1 ${(viewStudent.attendance ?? 0) >= 75 ? "[&>div]:bg-emerald-500" :
                            (viewStudent.attendance ?? 0) >= 50 ? "[&>div]:bg-yellow-500" :
                              "[&>div]:bg-destructive"
                            }`}
                        />
                        <span className="text-sm font-semibold">{viewStudent.attendance ?? 0}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Assignment History */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-4 pb-2 border-b border-border/50 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    Assignment History
                  </h3>

                  {/* Summary Row */}
                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="bg-muted/30 px-3 py-2 rounded-lg text-sm border border-border/50 flex-1 min-w-[120px]">
                      <p className="text-muted-foreground text-xs mb-0.5">Total Assignments</p>
                      <p className="font-semibold">{viewStudent.assignments?.length || 0}</p>
                    </div>
                    <div className="bg-muted/30 px-3 py-2 rounded-lg text-sm border border-border/50 flex-1 min-w-[120px]">
                      <p className="text-muted-foreground text-xs mb-0.5">Submitted</p>
                      <p className="font-semibold text-blue-600 dark:text-blue-400">
                        {viewStudent.assignments?.filter(a => a.status === "Submitted" || a.status === "Graded" || a.status === "Late").length || 0}
                      </p>
                    </div>
                    <div className="bg-muted/30 px-3 py-2 rounded-lg text-sm border border-border/50 flex-1 min-w-[120px]">
                      <p className="text-muted-foreground text-xs mb-0.5">Graded</p>
                      <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {viewStudent.assignments?.filter(a => a.status === "Graded").length || 0}
                      </p>
                    </div>
                    <div className="bg-muted/30 px-3 py-2 rounded-lg text-sm border border-border/50 flex-1 min-w-[120px]">
                      <p className="text-muted-foreground text-xs mb-0.5">Average Score</p>
                      <p className="font-semibold text-foreground">
                        {viewStudent.assignments?.filter(a => a.grade !== null).length
                          ? Math.round(viewStudent.assignments.filter(a => a.grade !== null).reduce((acc, curr) => acc + (curr.grade || 0), 0) / viewStudent.assignments.filter(a => a.grade !== null).length) + "%"
                          : "0%"}
                      </p>
                    </div>
                  </div>

                  {/* Assignments Table */}
                  <div className="rounded-md border border-border/50 overflow-hidden">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader className="bg-muted/30">
                          <TableRow>
                            <TableHead className="w-[180px]">Assignment Name</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-center">Grade</TableHead>
                            <TableHead className="min-w-[150px]">Feedback</TableHead>
                            <TableHead className="text-right">File</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {viewStudent.assignments && viewStudent.assignments.length > 0 ? (
                            viewStudent.assignments.map((assignment) => (
                              <TableRow key={assignment.id} className="hover:bg-muted/20">
                                <TableCell className="font-medium text-xs">{assignment.title}</TableCell>
                                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                                  {assignment.submissionDate ? assignment.submissionDate : "Not Submitted"}
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-5 ${assignment.status === 'Graded' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                                    assignment.status === 'Submitted' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' :
                                      assignment.status === 'Late' ? 'bg-orange-500/10 text-orange-600 border-orange-500/20' :
                                        'bg-destructive/10 text-destructive border-destructive/20'
                                    }`}>
                                    {assignment.status}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-center text-xs font-semibold">
                                  {assignment.grade !== null ? `${assignment.grade}%` : <span className="text-muted-foreground font-normal">Not Graded</span>}
                                </TableCell>
                                <TableCell className="text-xs text-muted-foreground truncate max-w-[150px]" title={assignment.feedback}>
                                  {assignment.feedback || "-"}
                                </TableCell>
                                <TableCell className="text-right">
                                  {assignment.fileUrl ? (
                                    <a href={assignment.fileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium">
                                      <Download className="w-3 h-3" /> File
                                    </a>
                                  ) : (
                                    <span className="text-xs text-muted-foreground truncate max-w-[60px] inline-block">No file</span>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={6} className="h-24 text-center text-muted-foreground text-sm">
                                No assignment records available.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Modal */}
        <Dialog open={!!editStudent} onOpenChange={(open) => !open && setEditStudent(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Student</DialogTitle>
              <DialogDescription>Modify student record details.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="batch">Batch</Label>
                <Select value={editForm.batch} onValueChange={(val) => setEditForm({ ...editForm, batch: val })}>
                  <SelectTrigger id="batch">
                    <SelectValue placeholder="Select Batch" />
                  </SelectTrigger>
                  <SelectContent>
                    {BATCHES.map(b => (
                      <SelectItem key={b} value={b}>{b}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select value={editForm.status} onValueChange={(val) => setEditForm({ ...editForm, status: val })}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditStudent(null)}>Cancel</Button>
              <Button onClick={handleSaveEdit}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Change Batch Modal */}
        <Dialog open={!!changeBatchStudent} onOpenChange={(open) => !open && setChangeBatchStudent(null)}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Change Batch</DialogTitle>
              <DialogDescription>Move {changeBatchStudent?.name} to a different batch.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-2 py-4">
              <Label>Select New Batch</Label>
              <Select value={newBatchValue} onValueChange={setNewBatchValue}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Batch" />
                </SelectTrigger>
                <SelectContent>
                  {BATCHES.map(b => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setChangeBatchStudent(null)}>Cancel</Button>
              <Button onClick={handleSaveBatch}>Confirm Change</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Move to Internship Confirmation Modal */}
        <Dialog open={!!moveInternshipStudent} onOpenChange={(open) => !open && setMoveInternshipStudent(null)}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Move to Internship</DialogTitle>
              <DialogDescription className="text-base pt-2">
                Are you sure you want to move <span className="font-semibold text-foreground">{moveInternshipStudent?.name}</span> to the Internship phase?
                This will remove them from the Learning Phase students list.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setMoveInternshipStudent(null)}>Cancel</Button>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleConfirmInternship}>Move to Internship</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <Dialog open={!!deleteStudent} onOpenChange={(open) => !open && setDeleteStudent(null)}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle className="text-destructive flex items-center gap-2">
                <Trash2 className="w-5 h-5" /> Delete Student
              </DialogTitle>
              <DialogDescription className="text-base pt-2">
                Are you sure you want to delete <span className="font-semibold text-foreground">{deleteStudent?.name}</span> ({deleteStudent?.email})?
                <div className="mt-4 p-3 bg-destructive/10 text-destructive text-sm font-medium rounded-md">
                  This action cannot be undone.
                </div>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setDeleteStudent(null)}>Cancel</Button>
              <Button variant="destructive" onClick={handleConfirmDelete}>Confirm Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Student Modal */}
        <AddStudentModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleSaveNewStudent}
          availableBatches={BATCHES}
        />

      </div>
    </DashboardLayout>
  );
};

export default AdminStudents;
