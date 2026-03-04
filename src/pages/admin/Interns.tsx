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
  Search,
  MoreVertical,
  Eye,
  UserPlus,
  RefreshCw,
  Award,
  FileText,
  Download,
  Briefcase
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Static mock data
const mockTasksA = [
  { id: "T1", title: "Project Setup", submissionDate: "2025-02-01", status: "Reviewed", reviewedByMentor: "Reviewed", mentorFeedback: "Good start on the architecture.", fileUrl: "https://example.com/setup.pdf" },
  { id: "T2", title: "API Integration", submissionDate: "2025-02-10", status: "Submitted", reviewedByMentor: "Pending", mentorFeedback: "", fileUrl: "https://example.com/api.pdf" },
  { id: "T3", title: "Unit Testing", submissionDate: null, status: "Missing", reviewedByMentor: "Pending", mentorFeedback: "", fileUrl: null },
  { id: "T4", title: "Deployment Prep", submissionDate: "2025-02-25", status: "Late", reviewedByMentor: "Pending", mentorFeedback: "", fileUrl: "https://example.com/deploy.pdf" }
];

const mockTasksB = [
  { id: "T1", title: "Final Application", submissionDate: "2025-01-20", status: "Reviewed", reviewedByMentor: "Reviewed", mentorFeedback: "Excellent execution of all requirements. Highly commendable performance.", fileUrl: "https://example.com/final.pdf" }
];

const mockTasksC = [
  { id: "T1", title: "Task 1", submissionDate: "2026-02-01", status: "Reviewed", reviewedByMentor: "Reviewed", mentorFeedback: "Good work.", fileUrl: "https://example.com/t1.pdf" },
  { id: "T2", title: "Task 2", submissionDate: "2026-02-05", status: "Reviewed", reviewedByMentor: "Reviewed", mentorFeedback: "Well done.", fileUrl: "https://example.com/t2.pdf" },
  { id: "T3", title: "Task 3", submissionDate: "2026-02-10", status: "Reviewed", reviewedByMentor: "Reviewed", mentorFeedback: "Needs a bit of optimization.", fileUrl: "https://example.com/t3.pdf" },
  { id: "T4", title: "Task 4", submissionDate: "2026-02-18", status: "Submitted", reviewedByMentor: "Pending", mentorFeedback: "", fileUrl: "https://example.com/t4.pdf" },
  { id: "T5", title: "Task 5", submissionDate: "2026-02-20", status: "Submitted", reviewedByMentor: "Pending", mentorFeedback: "", fileUrl: "https://example.com/t5.pdf" }
];

const initialInterns = [
  {
    id: "I1", name: "Ajay Dev", batch: "Jul 2025 Evening", phase: "Internship", mentor: "Arun", internshipStartDate: "2025-01-15", internshipStatus: "Ongoing", internshipAttendance: 95, internshipTasks: mockTasksA
  },
  {
    id: "I2", name: "Riya Patel", batch: "Jan 2026 Cohort", phase: "Internship", mentor: "", internshipStartDate: "2025-02-01", internshipStatus: "Ongoing", internshipAttendance: 80, internshipTasks: []
  },
  {
    id: "I3", name: "Vikram Singh", batch: "Jul 2025 Evening", phase: "Internship", mentor: "Neha", internshipStartDate: "2024-11-01", internshipStatus: "Completed", internshipAttendance: 100, internshipTasks: mockTasksB
  },
  {
    id: "I4", name: "Suresh Pillai", batch: "Oct 2025 Cohort", phase: "Internship", mentor: "Arun", internshipStartDate: "2025-01-20", internshipStatus: "Ongoing", internshipAttendance: 60, internshipTasks: mockTasksA
  },
  {
    id: "I5", name: "Meera Krishnan", batch: "Feb 2026 Python", phase: "Internship", mentor: "", internshipStartDate: "2025-02-15", internshipStatus: "Ongoing", internshipAttendance: 0, internshipTasks: []
  },
  {
    id: "I6", name: "Aisha Rahman", batch: "MERN Stack - Feb 2026", phase: "Internship", mentor: "Rahul", internshipStartDate: "2026-01-10", internshipStatus: "Ongoing", internshipAttendance: 100, internshipTasks: mockTasksC
  }
];

const MENTORS = ["Arun", "Neha", "Rahul", "Priya"];
const BATCHES = ["Jan 2026 Cohort", "Oct 2025 Cohort", "Jul 2025 Evening", "Feb 2026 Python", "MERN Stack - Feb 2026"];

const AdminInterns = () => {
  const { toast } = useToast();

  // Data state
  const [interns, setInterns] = useState(initialInterns);

  // Filters state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMentor, setFilterMentor] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterBatch, setFilterBatch] = useState("All");

  // Modals state
  const [viewIntern, setViewIntern] = useState<typeof initialInterns[0] | null>(null);
  const [assignMentorIntern, setAssignMentorIntern] = useState<typeof initialInterns[0] | null>(null);
  const [completeIntern, setCompleteIntern] = useState<typeof initialInterns[0] | null>(null);
  const [viewFeedbackTask, setViewFeedbackTask] = useState<{ intern: typeof initialInterns[0], task: typeof initialInterns[0]['internshipTasks'][0] } | null>(null);

  // Forms state
  const [selectedMentor, setSelectedMentor] = useState("");

  // Base internship students
  const internshipStudents = interns.filter(s => s.phase === "Internship");

  // Summary logic
  const totalInterns = internshipStudents.length;
  const mentorAssigned = internshipStudents.filter(s => s.mentor !== "").length;
  const mentorNotAssigned = internshipStudents.filter(s => s.mentor === "").length;
  const ongoingCount = internshipStudents.filter(s => s.internshipStatus === "Ongoing").length;
  const completedCount = internshipStudents.filter(s => s.internshipStatus === "Completed").length;

  // Filtered list
  const filteredInterns = internshipStudents.filter(intern => {
    const matchesSearch =
      intern.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intern.batch.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intern.mentor.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesMentor =
      filterMentor === "All" ? true :
        filterMentor === "Assigned" ? intern.mentor !== "" :
          filterMentor === "Not Assigned" ? intern.mentor === "" : true;

    const matchesStatus = filterStatus === "All" || intern.internshipStatus === filterStatus;
    const matchesBatch = filterBatch === "All" || intern.batch === filterBatch;

    return matchesSearch && matchesMentor && matchesStatus && matchesBatch;
  });

  // Actions
  const handleAssignMentor = () => {
    if (!assignMentorIntern || !selectedMentor) return;
    setInterns(interns.map(i => i.id === assignMentorIntern.id ? { ...i, mentor: selectedMentor } : i));
    toast({ title: "Mentor Assigned", description: `Mentor ${selectedMentor} assigned successfully.` });
    setAssignMentorIntern(null);
    setSelectedMentor("");
  };

  const handleCompleteInternship = () => {
    if (!completeIntern) return;
    setInterns(interns.map(i => i.id === completeIntern.id ? { ...i, internshipStatus: "Completed" } : i));
    toast({ title: "Internship Completed", description: "The internship status has been updated." });
    setCompleteIntern(null);
  };

  const applyCardFilter = (type: "Total" | "Assigned" | "Unassigned" | "Ongoing" | "Completed") => {
    setSearchTerm("");
    setFilterBatch("All");
    if (type === "Total") {
      setFilterMentor("All");
      setFilterStatus("All");
    } else if (type === "Assigned") {
      setFilterMentor("Assigned");
      setFilterStatus("All");
    } else if (type === "Unassigned") {
      setFilterMentor("Not Assigned");
      setFilterStatus("All");
    } else if (type === "Ongoing") {
      setFilterMentor("All");
      setFilterStatus("Ongoing");
    } else if (type === "Completed") {
      setFilterMentor("All");
      setFilterStatus("Completed");
    }
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6 lg:space-y-8 max-w-[1600px] mx-auto pb-10">

        {/* Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
            Interns Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitor and manage students in the Internship Phase.
          </p>
        </div>

        {/* 1. Summary Cards */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <Card className="group cursor-pointer hover:border-blue-500/50 hover:shadow-md transition-all shadow-sm" onClick={() => applyCardFilter("Total")}>
              <CardContent className="p-4 flex flex-col justify-center">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold">{totalInterns}</h3>
                </div>
                <p className="text-sm font-medium text-muted-foreground group-hover:text-blue-600 transition-colors">Total Interns</p>
              </CardContent>
            </Card>

            <Card className="group cursor-pointer hover:border-indigo-500/50 hover:shadow-md transition-all shadow-sm" onClick={() => applyCardFilter("Assigned")}>
              <CardContent className="p-4 flex flex-col justify-center">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                    <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-2xl font-bold">{mentorAssigned}</h3>
                </div>
                <p className="text-sm font-medium text-muted-foreground group-hover:text-indigo-600 transition-colors">Mentor Assigned</p>
              </CardContent>
            </Card>

            <Card className="group cursor-pointer hover:border-orange-500/50 hover:shadow-md transition-all shadow-sm" onClick={() => applyCardFilter("Unassigned")}>
              <CardContent className="p-4 flex flex-col justify-center">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                    <UserPlus className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="text-2xl font-bold">{mentorNotAssigned}</h3>
                </div>
                <p className="text-sm font-medium text-muted-foreground group-hover:text-orange-600 transition-colors">Mentor Not Assigned</p>
              </CardContent>
            </Card>

            <Card className="group cursor-pointer hover:border-emerald-500/50 hover:shadow-md transition-all shadow-sm" onClick={() => applyCardFilter("Ongoing")}>
              <CardContent className="p-4 flex flex-col justify-center">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <RefreshCw className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-bold">{ongoingCount}</h3>
                </div>
                <p className="text-sm font-medium text-muted-foreground group-hover:text-emerald-600 transition-colors">Internship Ongoing</p>
              </CardContent>
            </Card>

            <Card className="group cursor-pointer hover:border-purple-500/50 hover:shadow-md transition-all shadow-sm" onClick={() => applyCardFilter("Completed")}>
              <CardContent className="p-4 flex flex-col justify-center">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold">{completedCount}</h3>
                </div>
                <p className="text-sm font-medium text-muted-foreground group-hover:text-purple-600 transition-colors">Internship Completed</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 2. Filters & Search */}
        <section className="bg-card border border-border/50 rounded-xl p-4 md:p-5 flex flex-col xl:flex-row gap-4 justify-between items-center shadow-sm">
          {/* Search Bar */}
          <div className="relative w-full xl:w-[45%]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, batch, or mentor..."
              className="pl-9 bg-background h-10 w-full rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
            <div className="w-full sm:w-[150px]">
              <Select value={filterMentor} onValueChange={setFilterMentor}>
                <SelectTrigger className="h-10 bg-background rounded-lg">
                  <SelectValue placeholder="Mentor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Mentors</SelectItem>
                  <SelectItem value="Assigned">Assigned</SelectItem>
                  <SelectItem value="Not Assigned">Not Assigned</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full sm:w-[180px]">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="h-10 bg-background rounded-lg">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Status</SelectItem>
                  <SelectItem value="Ongoing">Ongoing</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full sm:w-[180px]">
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
          </div>
        </section>

        {/* 3. Table */}
        <Card className="border-border/50 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="pl-6 w-[220px]">Intern Name</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead>Mentor</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[12%]">Attendance</TableHead>
                  <TableHead className="text-center">Tasks Submitted</TableHead>
                  <TableHead className="pr-6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInterns.length > 0 ? (
                  filteredInterns.map((intern) => {
                    const submittedTasks = intern.internshipTasks.filter(t => t.status === "Submitted" || t.status === "Reviewed" || t.status === "Late").length;
                    const totalTasks = intern.internshipTasks.length;

                    return (
                      <TableRow key={intern.id} className="hover:bg-muted/20">
                        <TableCell className="pl-6 font-medium text-foreground">
                          {intern.name}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                          {intern.batch}
                        </TableCell>
                        <TableCell>
                          {intern.mentor ? (
                            <span className="text-sm font-medium">{intern.mentor}</span>
                          ) : (
                            <Badge variant="secondary" className="bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 text-[10px] uppercase">Unassigned</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-foreground whitespace-nowrap">
                          {intern.internshipStartDate}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={
                            intern.internshipStatus === "Ongoing"
                              ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                              : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                          }>
                            {intern.internshipStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1.5 justify-center">
                            <span className="text-xs font-semibold text-foreground">{intern.internshipAttendance}%</span>
                            <Progress
                              value={intern.internshipAttendance}
                              className={`h-1.5 w-full ${intern.internshipAttendance >= 75 ? "[&>div]:bg-emerald-500" :
                                intern.internshipAttendance >= 50 ? "[&>div]:bg-yellow-500" :
                                  "[&>div]:bg-destructive"
                                }`}
                            />
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="text-sm font-semibold">{totalTasks > 0 ? `${submittedTasks}/${totalTasks}` : "-"}</span>
                        </TableCell>
                        <TableCell className="pr-6 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="w-8 h-8 hover:bg-muted">
                                <MoreVertical className="w-4 h-4 text-muted-foreground" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => setViewIntern(intern)}>
                                <Eye className="w-4 h-4" /> View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => {
                                setAssignMentorIntern(intern);
                                setSelectedMentor(intern.mentor);
                              }}>
                                <UserPlus className="w-4 h-4" /> {intern.mentor ? "Change Mentor" : "Assign Mentor"}
                              </DropdownMenuItem>
                              {intern.internshipStatus === "Ongoing" && (
                                <DropdownMenuItem
                                  className="cursor-pointer gap-2 text-emerald-600 focus:text-emerald-600"
                                  onClick={() => setCompleteIntern(intern)}
                                >
                                  <Award className="w-4 h-4" /> Mark as Completed
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="py-12 text-center text-muted-foreground">
                      No interns match your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* 4. Modals */}

        {/* Assign Mentor Modal */}
        <Dialog open={!!assignMentorIntern} onOpenChange={(open) => !open && setAssignMentorIntern(null)}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>{assignMentorIntern?.mentor ? "Change Mentor" : "Assign Mentor"}</DialogTitle>
              <DialogDescription>
                Assign a tutor to mentor <span className="font-semibold text-foreground">{assignMentorIntern?.name}</span> during their internship.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-2 py-4">
              <Label>Select Mentor</Label>
              <Select value={selectedMentor} onValueChange={setSelectedMentor}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a mentor..." />
                </SelectTrigger>
                <SelectContent>
                  {MENTORS.map(m => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAssignMentorIntern(null)}>Cancel</Button>
              <Button onClick={handleAssignMentor} disabled={!selectedMentor || selectedMentor === assignMentorIntern?.mentor}>Confirm Assignment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Mark Completed Modal */}
        <Dialog open={!!completeIntern} onOpenChange={(open) => !open && setCompleteIntern(null)}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Complete Internship</DialogTitle>
              <DialogDescription className="text-base pt-2">
                Are you sure you want to mark <span className="font-semibold text-foreground">{completeIntern?.name}'s</span> internship as completed?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setCompleteIntern(null)}>Cancel</Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleCompleteInternship}>Mark Completed</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Details Modal */}
        <Dialog open={!!viewIntern} onOpenChange={(open) => !open && setViewIntern(null)}>
          <DialogContent className="sm:max-w-[850px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Internship Details</DialogTitle>
            </DialogHeader>
            {viewIntern && (
              <div className="space-y-8 py-4">

                {/* Basic & Mentor Info Rows */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Basic Information */}
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-4 pb-2 border-b border-border/50">Basic Info</h3>
                    <div className="space-y-4 text-sm">
                      <div className="grid grid-cols-2">
                        <p className="text-muted-foreground">Full Name</p>
                        <p className="font-semibold text-foreground">{viewIntern.name}</p>
                      </div>
                      <div className="grid grid-cols-2">
                        <p className="text-muted-foreground">Current Batch</p>
                        <p className="font-semibold text-foreground">{viewIntern.batch}</p>
                      </div>
                      <div className="grid grid-cols-2">
                        <p className="text-muted-foreground">Start Date</p>
                        <p className="font-semibold text-foreground">{viewIntern.internshipStartDate}</p>
                      </div>
                      <div className="grid grid-cols-2">
                        <p className="text-muted-foreground">Status</p>
                        <div>
                          <Badge variant="outline" className={viewIntern.internshipStatus === "Ongoing" ? "bg-blue-500/10 text-blue-600" : "bg-emerald-500/10 text-emerald-600"}>
                            {viewIntern.internshipStatus}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mentor Info */}
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-4 pb-2 border-b border-border/50">Mentor Info</h3>
                    <div className="space-y-4 text-sm">
                      <div className="grid grid-cols-2">
                        <p className="text-muted-foreground">Assigned Mentor</p>
                        <div>
                          {viewIntern.mentor ? (
                            <span className="font-semibold text-foreground">{viewIntern.mentor}</span>
                          ) : (
                            <span className="text-orange-500 font-medium italic">Pending Assignment</span>
                          )}
                        </div>
                      </div>
                      <div className="pt-2">
                        <Button variant="outline" size="sm" onClick={() => {
                          setAssignMentorIntern(viewIntern);
                          setSelectedMentor(viewIntern.mentor);
                        }}>
                          <UserPlus className="w-4 h-4 mr-2" />
                          {viewIntern.mentor ? "Change Mentor" : "Assign Mentor"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Internship Tasks */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-4 pb-2 border-b border-border/50 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    Internship Tasks
                  </h3>

                  {/* Summary Row */}
                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="bg-muted/30 px-3 py-2 rounded-lg text-sm border border-border/50 flex-1 min-w-[120px]">
                      <p className="text-muted-foreground text-xs mb-0.5">Total Tasks</p>
                      <p className="font-semibold">{viewIntern.internshipTasks.length}</p>
                    </div>
                    <div className="bg-muted/30 px-3 py-2 rounded-lg text-sm border border-border/50 flex-1 min-w-[120px]">
                      <p className="text-muted-foreground text-xs mb-0.5">Submitted</p>
                      <p className="font-semibold text-blue-600 dark:text-blue-400">
                        {viewIntern.internshipTasks.filter(t => t.status === "Submitted" || t.status === "Reviewed" || t.status === "Late").length}
                      </p>
                    </div>
                    <div className="bg-muted/30 px-3 py-2 rounded-lg text-sm border border-border/50 flex-1 min-w-[120px]">
                      <p className="text-muted-foreground text-xs mb-0.5">Reviewed</p>
                      <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {viewIntern.internshipTasks.filter(t => t.reviewedByMentor === "Reviewed").length}
                      </p>
                    </div>
                    <div className="bg-muted/30 px-3 py-2 rounded-lg text-sm border border-border/50 flex-1 min-w-[120px]">
                      <p className="text-muted-foreground text-xs mb-0.5">Pending Review</p>
                      <p className="font-semibold text-orange-600 dark:text-orange-400">
                        {viewIntern.internshipTasks.filter(t => t.reviewedByMentor === "Pending" && (t.status === "Submitted" || t.status === "Late")).length}
                      </p>
                    </div>
                  </div>

                  {/* Tasks Table */}
                  <div className="rounded-md border border-border/50 overflow-hidden">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader className="bg-muted/30">
                          <TableRow>
                            <TableHead className="w-[180px]">Task Title</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Review</TableHead>
                            <TableHead className="min-w-[150px]">Feedback</TableHead>
                            <TableHead className="text-right">File</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {viewIntern.internshipTasks.length > 0 ? (
                            viewIntern.internshipTasks.map((task) => (
                              <TableRow key={task.id} className="hover:bg-muted/20">
                                <TableCell className="font-medium text-xs">{task.title}</TableCell>
                                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                                  {task.submissionDate ? task.submissionDate : "Not Submitted"}
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-5 ${task.status === 'Reviewed' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                                    task.status === 'Submitted' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' :
                                      task.status === 'Late' ? 'bg-orange-500/10 text-orange-600 border-orange-500/20' :
                                        'bg-destructive/10 text-destructive border-destructive/20'
                                    }`}>
                                    {task.status}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-xs font-semibold">
                                  {task.reviewedByMentor === "Reviewed" ? (
                                    <span className="text-emerald-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Reviewed</span>
                                  ) : (
                                    <span className="text-orange-500">Pending Review</span>
                                  )}
                                </TableCell>
                                <TableCell className="text-xs max-w-[200px]">
                                  {task.reviewedByMentor === "Reviewed" && task.mentorFeedback ? (
                                    <div className="flex items-center gap-1">
                                      <span className="text-muted-foreground truncate">
                                        {task.mentorFeedback.length > 40 ? `${task.mentorFeedback.substring(0, 40)}...` : task.mentorFeedback}
                                      </span>
                                      <button
                                        onClick={() => viewIntern && setViewFeedbackTask({ intern: viewIntern, task })}
                                        className="text-primary hover:underline font-medium text-[10px] whitespace-nowrap cursor-pointer"
                                      >
                                        [View]
                                      </button>
                                    </div>
                                  ) : (
                                    <span className="text-muted-foreground">-</span>
                                  )}
                                </TableCell>
                                <TableCell className="text-right">
                                  {task.fileUrl ? (
                                    <a href={task.fileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium">
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
                                No internship tasks available.
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

        {/* View Feedback Modal */}
        <Dialog open={!!viewFeedbackTask} onOpenChange={(open) => !open && setViewFeedbackTask(null)}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Mentor Feedback</DialogTitle>
            </DialogHeader>
            {viewFeedbackTask && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-lg border border-border/50">
                  <div>
                    <p className="text-muted-foreground mb-1 text-xs">Task Title</p>
                    <p className="font-semibold text-foreground">{viewFeedbackTask.task.title}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1 text-xs">Submission Date</p>
                    <p className="font-semibold text-foreground">{viewFeedbackTask.task.submissionDate || "Not Submitted"}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground mb-1 text-xs">Reviewed By</p>
                    <p className="font-semibold text-foreground">{viewFeedbackTask.intern.mentor || "Unknown Mentor"}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-2">Feedback</h4>
                  <div className="bg-muted/10 p-4 rounded-lg border border-border/50 text-sm text-foreground whitespace-pre-wrap max-h-[40vh] overflow-y-auto">
                    {viewFeedbackTask.task.mentorFeedback}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

      </div>
    </DashboardLayout>
  );
};

export default AdminInterns;
