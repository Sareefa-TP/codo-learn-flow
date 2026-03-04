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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ClipboardList, CheckCircle, Clock, AlertCircle, Eye, Calendar, Search, FileX, Presentation, UserCheck, Timer, XCircle, Pencil } from "lucide-react";

// Types
type AssignmentStatus = "Active" | "Overdue" | "Closed";

interface Assignment {
  id: string;
  title: string;
  batch: string;
  tutor: string;
  dueDate: string;
  submitted: number;
  total: number;
  status: AssignmentStatus;
  description?: string;
  phase?: string;
}

// Mock Data
const mockAssignments: Assignment[] = [
  {
    id: "a1",
    title: "React Components Challenge",
    batch: "FSD Jan 2026",
    tutor: "Alex Johnson",
    dueDate: "2026-03-05",
    submitted: 18,
    total: 30,
    status: "Active",
    description: "Build robust modular components in React.",
    phase: "Learning",
  },
  {
    id: "a2",
    title: "Node.js API Development",
    batch: "FSD Jan 2026",
    tutor: "Sarah Williams",
    dueDate: "2026-02-25",
    submitted: 28,
    total: 30,
    status: "Overdue",
    description: "Create RESTful API endpoints using Express.",
    phase: "Learning",
  },
  {
    id: "a3",
    title: "HTML/CSS Basics",
    batch: "FSD Feb 2026",
    tutor: "Alex Johnson",
    dueDate: "2026-02-20",
    submitted: 25,
    total: 25,
    status: "Closed",
    description: "Design a landing page.",
    phase: "Learning",
  },
  {
    id: "a4",
    title: "Database Design Schema",
    batch: "FSD March 2026",
    tutor: "David Chen",
    dueDate: "2026-03-15",
    submitted: 5,
    total: 25,
    status: "Active",
    description: "Design database schemas for an e-commerce platform.",
    phase: "Internship",
  },
  {
    id: "a5",
    title: "Authentication Implementation",
    batch: "FSD Jan 2026",
    tutor: "Sarah Williams",
    dueDate: "2026-03-01",
    submitted: 22,
    total: 30,
    status: "Active",
    description: "Implement JWT based authentication.",
    phase: "Internship",
  }
];

type SubmissionStatus = "Graded" | "Pending" | "Resubmit";

interface Submission {
  id: string;
  name: string;
  email: string;
  score: string;
  status: SubmissionStatus;
}

const mockSubmissions: Submission[] = [
  { id: "s1", name: "Rahul Sharma", email: "rahul@example.com", score: "85/100", status: "Graded" },
  { id: "s2", name: "Priya Singh", email: "priya@example.com", score: "92/100", status: "Graded" },
  { id: "s3", name: "Amit Kumar", email: "amit@example.com", score: "-", status: "Pending" },
  { id: "s4", name: "Neha Gupta", email: "neha@example.com", score: "45/100", status: "Resubmit" },
  { id: "s5", name: "Sara Khan", email: "sara@example.com", score: "88/100", status: "Graded" },
];

const getStatusBadge = (status: AssignmentStatus) => {
  switch (status) {
    case "Active":
      return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 shadow-none hover:bg-blue-500/20">Active</Badge>;
    case "Overdue":
      return <Badge className="bg-destructive/10 text-destructive border-destructive/20 shadow-none hover:bg-destructive/20">Overdue</Badge>;
    case "Closed":
      return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 shadow-none hover:bg-emerald-500/20">Closed</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getComputedStatus = (assignment: Assignment): AssignmentStatus => {
  if (assignment.status === "Active" && new Date(assignment.dueDate) < new Date()) {
    return "Overdue";
  }
  return assignment.status;
};

const AdminAssessments = () => {
  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "overdue" | "closed">("all");

  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editForm, setEditForm] = useState<Assignment | null>(null);

  const openDrawer = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setIsEditMode(false);
    setEditForm(null);
    setIsDrawerOpen(true);
  };

  const handleSave = () => {
    if (editForm) {
      setAssignments(assignments.map(a => a.id === editForm.id ? editForm : a));
      setSelectedAssignment(editForm);
      setIsEditMode(false);
    }
  };

  const handleCancel = () => {
    setEditForm(null);
    setIsEditMode(false);
  };

  const filteredAssignments = assignments.filter((assignment) => {
    // 1. Status Filter
    const matchesFilter =
      activeFilter === "all" ||
      getComputedStatus(assignment).toLowerCase() === activeFilter;

    // 2. Search Filter
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      assignment.title.toLowerCase().includes(searchLower) ||
      assignment.batch.toLowerCase().includes(searchLower) ||
      assignment.tutor.toLowerCase().includes(searchLower);

    return matchesFilter && matchesSearch;
  });

  // Derived Summary Analytics
  const totalAssignments = assignments.length;
  const activeAssignments = assignments.filter(a => getComputedStatus(a) === "Active").length;
  const overdueAssignments = assignments.filter(a => getComputedStatus(a) === "Overdue").length;
  const avgSubmissionRate = totalAssignments > 0
    ? Math.round((assignments.reduce((acc, curr) => acc + (curr.submitted / curr.total), 0) / totalAssignments) * 100)
    : 0;

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6 lg:space-y-8 max-w-7xl mx-auto pb-10">

        {/* Header Section */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
            Assignments Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitor assignments created by tutors across all batches.
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
                Total Assignments
              </CardTitle>
              <div className="w-8 h-8 rounded-full bg-indigo-100/50 flex items-center justify-center">
                <ClipboardList className="w-4 h-4 text-indigo-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAssignments}</div>
            </CardContent>
          </Card>

          <Card
            className={`border-border/50 shadow-sm cursor-pointer transition-all hover:border-blue-500/50 hover:shadow-md ${activeFilter === "active" ? "ring-2 ring-blue-500 bg-blue-50/50 dark:bg-blue-950/20" : ""}`}
            onClick={() => setActiveFilter("active")}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className={`text-sm font-medium ${activeFilter === "active" ? "text-blue-700 dark:text-blue-400" : "text-muted-foreground"}`}>
                Active Assignments
              </CardTitle>
              <div className="w-8 h-8 rounded-full bg-blue-100/50 flex items-center justify-center">
                <Clock className="w-4 h-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeAssignments}</div>
            </CardContent>
          </Card>

          <Card
            className={`border-border/50 shadow-sm cursor-pointer transition-all hover:border-destructive/50 hover:shadow-md ${activeFilter === "overdue" ? "ring-2 ring-destructive bg-destructive/10" : ""}`}
            onClick={() => setActiveFilter("overdue")}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className={`text-sm font-medium ${activeFilter === "overdue" ? "text-destructive" : "text-muted-foreground"}`}>
                Overdue Assignments
              </CardTitle>
              <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-destructive" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overdueAssignments}</div>
            </CardContent>
          </Card>

          <Card
            className={`border-border/50 shadow-sm cursor-pointer transition-all hover:border-emerald-500/50 hover:shadow-md ${activeFilter === "closed" ? "ring-2 ring-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20" : ""}`}
            onClick={() => setActiveFilter("all")} // Keep as "all" for now
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg Submission Rate
              </CardTitle>
              <div className="w-8 h-8 rounded-full bg-emerald-100/50 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgSubmissionRate}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Action Bar (Search) */}
        <div className="flex justify-between items-center bg-card p-4 rounded-xl border border-border/50 shadow-sm">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, batch, or tutor..."
              className="pl-9 w-full bg-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Assignments Table */}
        <Card className="border-border/50 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="pl-6 w-[25%]">Title</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead>Tutor</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Submissions</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssignments.length > 0 ? (
                  filteredAssignments.map((assignment) => (
                    <TableRow key={assignment.id} className="hover:bg-muted/20">
                      <TableCell className="pl-6 font-medium text-foreground">
                        {assignment.title}
                      </TableCell>
                      <TableCell>
                        {assignment.batch}
                      </TableCell>
                      <TableCell>
                        {assignment.tutor}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                          {assignment.dueDate}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{assignment.submitted}</span>
                          <span className="text-muted-foreground text-sm">/ {assignment.total}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(getComputedStatus(assignment))}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                          title="View details"
                          onClick={() => openDrawer(assignment)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-48 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <FileX className="w-10 h-10 mb-3 opacity-20" />
                        <p className="font-medium text-foreground">No assignments found</p>
                        <p className="text-sm mt-1 mb-4 max-w-xs text-center">Try adjusting your search keyword.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

      </div>

      {/* View Assignment Drawer */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-full sm:max-w-md md:max-w-xl lg:max-w-2xl overflow-y-auto">
          {selectedAssignment && (
            <div className="flex flex-col gap-6 py-4">
              <SheetHeader className="pb-4 border-b">
                <div className="flex justify-between items-start pt-4">
                  <div className="w-full">
                    {isEditMode ? (
                      <div className="space-y-4 pr-6 w-full">
                        <Input
                          value={editForm?.title || ""}
                          onChange={(e) => setEditForm(prev => ({ ...prev!, title: e.target.value }))}
                          className="text-lg font-bold w-full"
                          placeholder="Assignment Title"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleSave}>Save</Button>
                          <Button size="sm" variant="outline" onClick={handleCancel}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center w-full">
                        <div>
                          <SheetTitle className="text-2xl font-bold flex items-center gap-3">
                            {selectedAssignment.title}
                            {getStatusBadge(getComputedStatus(selectedAssignment))}
                          </SheetTitle>
                          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                            <Presentation className="w-4 h-4" />
                            <span>{selectedAssignment.batch}</span>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="gap-2" onClick={() => { setIsEditMode(true); setEditForm(selectedAssignment); }}>
                          <Pencil className="w-4 h-4" /> Edit
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetHeader>

              {/* SECTION A: Assignment Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2 border-b pb-2">
                  <ClipboardList className="w-5 h-5 text-indigo-500" />
                  Assignment Info
                </h3>
                <Card className="shadow-none border-border/50 bg-muted/20">
                  <CardContent className="p-4 grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground w-full block">Batch Name</span>
                      <span className="text-sm font-medium">{selectedAssignment.batch}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground w-full block">Tutor Assigned</span>
                      <span className="text-sm font-medium">{selectedAssignment.tutor}</span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground w-full block">Due Date</span>
                      {isEditMode ? (
                        <Input
                          type="date"
                          value={editForm?.dueDate || ""}
                          onChange={(e) => setEditForm(prev => ({ ...prev!, dueDate: e.target.value }))}
                        />
                      ) : (
                        <span className="text-sm font-medium flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-muted-foreground" />{selectedAssignment.dueDate}</span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground w-full block">Status</span>
                      {isEditMode ? (
                        <Select value={editForm?.status} onValueChange={(val: any) => setEditForm(prev => ({ ...prev!, status: val }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Overdue">Overdue</SelectItem>
                            <SelectItem value="Closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className="text-sm font-medium mt-1 block">{getStatusBadge(getComputedStatus(selectedAssignment))}</span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground w-full block">Phase</span>
                      {isEditMode ? (
                        <Select value={editForm?.phase || "Learning"} onValueChange={(val: any) => setEditForm(prev => ({ ...prev!, phase: val }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Learning">Learning</SelectItem>
                            <SelectItem value="Internship">Internship</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className="text-sm font-medium">{selectedAssignment.phase || "Learning"}</span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground w-full block">Total Submissions</span>
                      <span className="text-sm font-medium">{selectedAssignment.submitted} / {selectedAssignment.total}</span>
                    </div>

                    <div className="space-y-1 col-span-2">
                      <span className="text-xs text-muted-foreground w-full block mb-1">Description</span>
                      {isEditMode ? (
                        <textarea
                          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={editForm?.description || ""}
                          onChange={(e) => setEditForm(prev => ({ ...prev!, description: e.target.value }))}
                        />
                      ) : (
                        <span className="text-sm font-medium">{selectedAssignment.description || "No description provided."}</span>
                      )}
                    </div>

                  </CardContent>
                </Card>
              </div>

              {/* SECTION B: Submission Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Card className="shadow-none border-border/50 flex flex-col items-center justify-center p-3">
                  <span className="text-xs text-muted-foreground text-center line-clamp-1 mb-1 border-b w-full pb-1">Graded</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="font-bold text-lg">12</span>
                  </div>
                </Card>
                <Card className="shadow-none border-border/50 flex flex-col items-center justify-center p-3">
                  <span className="text-xs text-muted-foreground text-center line-clamp-1 mb-1 border-b w-full pb-1">Pending</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Timer className="w-3.5 h-3.5 text-blue-500" />
                    <span className="font-bold text-lg">4</span>
                  </div>
                </Card>
                <Card className="shadow-none border-border/50 flex flex-col items-center justify-center p-3">
                  <span className="text-xs text-muted-foreground text-center line-clamp-1 mb-1 border-b w-full pb-1">Resubmit</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <XCircle className="w-3.5 h-3.5 text-destructive" />
                    <span className="font-bold text-lg">2</span>
                  </div>
                </Card>
                <Card className="shadow-none border-border/50 flex flex-col items-center justify-center p-3 bg-muted/30">
                  <span className="text-xs text-muted-foreground text-center line-clamp-1 mb-1 border-b w-full pb-1">Avg Score</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="font-bold text-lg text-indigo-600">82%</span>
                  </div>
                </Card>
              </div>

              {/* SECTION C: Submissions Table */}
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-indigo-500" />
                    Student Submissions
                  </h3>
                </div>

                <div className="border border-border/50 rounded-md overflow-hidden bg-card">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Score</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockSubmissions.map((sub) => (
                        <TableRow key={sub.id} className="hover:bg-muted/10">
                          <TableCell>
                            <div className="font-medium text-sm">{sub.name}</div>
                            <div className="text-muted-foreground text-xs">{sub.email}</div>
                          </TableCell>
                          <TableCell>
                            {sub.status === "Graded" && <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 shadow-none">Graded</Badge>}
                            {sub.status === "Pending" && <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 shadow-none">Pending</Badge>}
                            {sub.status === "Resubmit" && <Badge className="bg-destructive/10 text-destructive border-destructive/20 shadow-none">Resubmit</Badge>}
                          </TableCell>
                          <TableCell className="text-right font-medium text-sm">
                            {sub.score}
                          </TableCell>
                        </TableRow>
                      ))}
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

export default AdminAssessments;
