import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ClipboardList,
  Plus,
  Search,
  Calendar as CalendarIcon,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  FileText,
  Image as ImageIcon,
  File as FileIcon,
  Download
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Demo Data
const initialAssignments = [
  { id: "A-001", title: "HTML Portfolio Project", batch: "Jan 2026 Batch", dueDate: "10 Mar 2026", status: "Active", totalStudents: 45 },
  { id: "A-002", title: "React Hooks Deep Dive", batch: "Oct 2025 Batch", dueDate: "20 Mar 2026", status: "Active", totalStudents: 38 },
  { id: "A-003", title: "CSS Grid Fundamentals", batch: "Jan 2026 Batch", dueDate: "15 Feb 2026", status: "Closed", totalStudents: 45 },
  { id: "A-004", title: "API Integration Capstone", batch: "Oct 2025 Batch", dueDate: "01 Mar 2026", status: "Closed", totalStudents: 38 },
];

const availableBatches = [
  "Jan 2026 Batch",
  "Oct 2025 Batch",
  "Feb 2026 Batch - Evening"
];

const initialSubmissions = [
  { id: "S-1", assignmentId: "A-001", studentName: "Aarav Sharma", fileName: "aarav_portfolio.zip", fileURL: "#", fileType: "application/zip", submittedDate: "08 Mar 2026", submissionStatus: "Submitted", marks: null, feedback: "", result: "", gradingStatus: "Pending" },
  { id: "S-2", assignmentId: "A-001", studentName: "Meera Reddy", fileName: "meera_presentation.pdf", fileURL: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", fileType: "application/pdf", submittedDate: "09 Mar 2026", submissionStatus: "Submitted", marks: 90, feedback: "Excellent structure.", result: "Pass", gradingStatus: "Graded" },
  { id: "S-3", assignmentId: "A-001", studentName: "Kabir Singh", fileName: "kabir_design_mockup.png", fileURL: "https://placehold.co/800x600/f3f4f6/333333.png?text=Design+Mockup", fileType: "image/png", submittedDate: "11 Mar 2026", submissionStatus: "Late", marks: null, feedback: "", result: "", gradingStatus: "Pending" },
  { id: "S-4", assignmentId: "A-002", studentName: "Diya Patel", fileName: "diya_react_hooks.zip", fileURL: "#", fileType: "application/zip", submittedDate: "18 Mar 2026", submissionStatus: "Submitted", marks: null, feedback: "", result: "", gradingStatus: "Pending" },
];

const TutorAssignments = () => {
  const { toast } = useToast();
  const [assignments, setAssignments] = useState(initialAssignments);
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [searchQuery, setSearchQuery] = useState("");

  // Navigation States
  const [activeAssignmentId, setActiveAssignmentId] = useState<string | null>(null);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // New Assignment Form State
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    description: "",
    batch: "",
    dueDate: "",
  });

  // Grade Form State
  const [gradingSubmissionId, setGradingSubmissionId] = useState<string | null>(null);
  const [gradeData, setGradeData] = useState({
    marks: "",
    feedback: "",
    result: ""
  });

  // Preview File State
  const [previewFile, setPreviewFile] = useState<{ name: string, url: string, type: string } | null>(null);

  // Derived Info regarding focused assignment
  const activeAssignment = assignments.find(a => a.id === activeAssignmentId);
  const assignmentSubmissions = submissions.filter(s => s.assignmentId === activeAssignmentId);

  // --- HANDLERS (Create Assignment) ---

  const handleAssignmentInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewAssignment(prev => ({ ...prev, [name]: value }));
  };

  const handleAssignmentSelectChange = (value: string) => {
    setNewAssignment(prev => ({ ...prev, batch: value }));
  };

  const validateAndSubmitAssignment = () => {
    if (!newAssignment.title || !newAssignment.batch || !newAssignment.dueDate) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (Title, Batch, Due Date).",
        variant: "destructive",
      });
      return;
    }

    const formattedDate = new Date(newAssignment.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    let studentsCount = 30; // default mock
    if (newAssignment.batch === "Jan 2026 Batch") studentsCount = 45;
    if (newAssignment.batch === "Oct 2025 Batch") studentsCount = 38;
    if (newAssignment.batch === "Feb 2026 Batch - Evening") studentsCount = 21;

    const created = {
      id: `A-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      title: newAssignment.title,
      batch: newAssignment.batch,
      dueDate: formattedDate,
      status: "Active",
      totalStudents: studentsCount
    };

    setAssignments([created, ...assignments]);

    setNewAssignment({
      title: "",
      description: "",
      batch: "",
      dueDate: "",
    });
    setIsCreateModalOpen(false);

    toast({
      title: "Assignment Created",
      description: "Successfully assigned to the batch.",
    });
  };

  // --- HANDLERS (Grading) ---

  const openGradeModal = (submissionId: string) => {
    const sub = submissions.find(s => s.id === submissionId);
    if (!sub) return;

    setGradingSubmissionId(submissionId);
    setGradeData({
      marks: sub.marks !== null ? sub.marks.toString() : "",
      feedback: sub.feedback || "",
      result: sub.result || ""
    });
    setIsGradeModalOpen(true);
  };

  const handleGradeInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Auto calculate Pass/Fail
    if (name === "marks") {
      const numericVal = parseInt(value, 10);
      const newResult = (!isNaN(numericVal) && numericVal >= 40) ? "Pass" : (!isNaN(numericVal) ? "Fail" : "");
      setGradeData(prev => ({ ...prev, [name]: value, result: newResult }));
    } else {
      setGradeData(prev => ({ ...prev, [name]: value }));
    }
  };

  const saveGrade = () => {
    const numericMarks = parseInt(gradeData.marks, 10);
    if (isNaN(numericMarks) || numericMarks < 0 || numericMarks > 100) {
      toast({
        title: "Invalid Marks",
        description: "Marks must be a valid number between 0 and 100.",
        variant: "destructive",
      });
      return;
    }

    if (!gradeData.result) {
      toast({
        title: "Missing Result",
        description: "Please specify if this is a Pass or Fail.",
        variant: "destructive",
      });
      return;
    }

    setSubmissions(submissions.map(sub =>
      sub.id === gradingSubmissionId
        ? {
          ...sub,
          marks: numericMarks,
          feedback: gradeData.feedback,
          result: gradeData.result,
          gradingStatus: "Graded"
        }
        : sub
    ));

    setIsGradeModalOpen(false);
    toast({
      title: "Grade Saved",
      description: "The evaluation has been successfully applied to the student's submission.",
    });
  };

  // --- HANDLERS (File Preview) ---

  const handleFileClick = (fileName: string, fileURL: string, fileType: string) => {
    if (fileType.includes("pdf") || fileType.includes("image")) {
      setPreviewFile({ name: fileName, url: fileURL, type: fileType });
      setIsPreviewModalOpen(true);
    } else {
      // For types that cannot be natively previewed securely, force simulated download
      const link = document.createElement("a");
      link.href = fileURL;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Downloading File",
        description: "The file download has started.",
      });
    }
  };


  // --- RENDERS ---

  const filteredAssignments = assignments.filter(a =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.batch.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6 lg:space-y-8 max-w-6xl mx-auto">

        {/* If Active Assignment is NULL, show Assignments Main Table */}
        {!activeAssignmentId && (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
                  Assignments
                </h1>
                <p className="text-muted-foreground mt-2">
                  Create and manage learning exercises for your active cohorts.
                </p>
              </div>

              <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 shadow-sm">
                    <Plus className="w-4 h-4" />
                    Create Assignment
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Create New Assignment</DialogTitle>
                    <DialogDescription>
                      Deploy a new task directly to a specific learning cohort.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title" className="text-sm font-medium">Assignment Title <span className="text-destructive">*</span></Label>
                      <Input
                        id="title"
                        name="title"
                        placeholder="e.g. Build a Responsive Grid"
                        value={newAssignment.title}
                        onChange={handleAssignmentInputChange}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Provide specific instructions..."
                        value={newAssignment.description}
                        onChange={handleAssignmentInputChange}
                        className="resize-none h-24"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label className="text-sm font-medium">Target Batch <span className="text-destructive">*</span></Label>
                        <Select
                          value={newAssignment.batch}
                          onValueChange={handleAssignmentSelectChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select batch" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableBatches.map(b => (
                              <SelectItem key={b} value={b}>{b}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="dueDate" className="text-sm font-medium">Due Date <span className="text-destructive">*</span></Label>
                        <Input
                          id="dueDate"
                          name="dueDate"
                          type="date"
                          value={newAssignment.dueDate}
                          onChange={handleAssignmentInputChange}
                        />
                      </div>
                    </div>

                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={validateAndSubmitAssignment} className="gap-2">
                      Save Assignment
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="border-border/50 shadow-sm">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-primary" />
                  Active Assignments
                </CardTitle>
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search title or batch..."
                    className="pl-9 bg-muted/30"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow>
                        <TableHead className="pl-6 w-[350px]">Title</TableHead>
                        <TableHead>Target Batch</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead className="text-center">Total Students</TableHead>
                        <TableHead className="text-center">Submissions</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="pr-6 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAssignments.length > 0 ? (
                        filteredAssignments.map((assignment) => {
                          const subCount = submissions.filter(s => s.assignmentId === assignment.id).length;
                          return (
                            <TableRow key={assignment.id} className="hover:bg-muted/20 transition-colors">
                              <TableCell className="pl-6 font-medium text-foreground">
                                {assignment.title}
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary" className="font-normal text-muted-foreground">
                                  {assignment.batch}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                  <CalendarIcon className="w-4 h-4 text-warning" />
                                  {assignment.dueDate}
                                </div>
                              </TableCell>
                              <TableCell className="text-center font-medium">
                                {assignment.totalStudents}
                              </TableCell>
                              <TableCell className="text-center">
                                <span className={subCount > 0 ? "text-primary font-semibold" : "text-muted-foreground"}>
                                  {subCount}
                                </span>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className={
                                  assignment.status === "Active"
                                    ? "bg-primary/10 text-primary border-primary/20"
                                    : "bg-muted text-muted-foreground"
                                }>
                                  {assignment.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="pr-6 text-right">
                                <Button
                                  variant="ghost"
                                  className="text-primary hover:text-primary hover:bg-primary/10 h-8"
                                  onClick={() => setActiveAssignmentId(assignment.id)}
                                >
                                  View Submissions
                                </Button>
                              </TableCell>
                            </TableRow>
                          )
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            No assignments found matching your search.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* If Active Assignment is Selected, show Submissions View */}
        {activeAssignmentId && activeAssignment && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={() => setActiveAssignmentId(null)}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-foreground flex items-center gap-3">
                  {activeAssignment.title}
                </h1>
                <p className="text-muted-foreground mt-1 text-sm flex items-center gap-2">
                  <Badge variant="secondary" className="font-normal">
                    {activeAssignment.batch}
                  </Badge>
                  • Due: {activeAssignment.dueDate}
                </p>
              </div>
            </div>

            <Card className="border-border/50 shadow-sm">
              <CardHeader className="bg-muted/10 pb-4 border-b border-border/50">
                <CardTitle className="text-lg font-semibold">Student Submissions</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow>
                        <TableHead className="pl-6 w-[200px]">Student Name</TableHead>
                        <TableHead>Submitted File Name</TableHead>
                        <TableHead>Submitted Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Result</TableHead>
                        <TableHead className="pr-6 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assignmentSubmissions.length > 0 ? (
                        assignmentSubmissions.map((sub) => (
                          <TableRow key={sub.id} className="hover:bg-muted/20 transition-colors">
                            <TableCell className="pl-6 font-medium text-foreground">
                              {sub.studentName}
                            </TableCell>
                            <TableCell className="text-sm">
                              <button
                                onClick={() => handleFileClick(sub.fileName, sub.fileURL, sub.fileType)}
                                className="flex items-center gap-2 group text-left hover:bg-muted/50 p-1.5 -ml-1.5 rounded transition-colors w-fit"
                              >
                                {sub.fileType.includes("pdf") ? (
                                  <FileText className="w-4 h-4 text-destructive shrink-0 group-hover:text-primary transition-colors" />
                                ) : sub.fileType.includes("image") ? (
                                  <ImageIcon className="w-4 h-4 text-emerald-500 shrink-0 group-hover:text-primary transition-colors" />
                                ) : (
                                  <FileIcon className="w-4 h-4 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
                                )}
                                <span className="font-medium text-foreground group-hover:text-primary group-hover:underline transition-colors line-clamp-1">
                                  {sub.fileName}
                                </span>
                              </button>
                            </TableCell>
                            <TableCell className="text-sm text-foreground">
                              {sub.submittedDate}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={
                                sub.submissionStatus === "Submitted"
                                  ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                                  : "bg-orange-500/10 text-orange-600 border-orange-500/20"
                              }>
                                {sub.submissionStatus}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {sub.gradingStatus === "Graded" ? (
                                <span className="font-medium text-foreground">{sub.marks}/100</span>
                              ) : (
                                <span className="text-muted-foreground text-sm italic">Not Graded</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {sub.gradingStatus === "Graded" ? (
                                <div className="flex items-center gap-1.5 font-medium">
                                  {sub.result === "Pass" ? (
                                    <span className="text-emerald-500 flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Pass</span>
                                  ) : (
                                    <span className="text-destructive flex items-center gap-1"><XCircle className="w-4 h-4" /> Fail</span>
                                  )}
                                </div>
                              ) : (
                                "—"
                              )}
                            </TableCell>
                            <TableCell className="pr-6 text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 shadow-sm font-medium"
                                onClick={() => openGradeModal(sub.id)}
                              >
                                {sub.gradingStatus === "Graded" ? "Update Grade" : "Grade"}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                            No submissions received for this assignment yet.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

      </div>

      {/* Student Submission File Preview Modal */}
      <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
        <DialogContent className="sm:max-w-[800px] h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Student Submission Preview</DialogTitle>
            <DialogDescription>
              Viewing submitted file: {previewFile?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 min-h-0 bg-muted/20 border border-border/50 rounded-lg overflow-hidden flex items-center justify-center p-2 relative">
            {previewFile?.type.includes("pdf") ? (
              <iframe
                src={previewFile.url}
                className="w-full h-full rounded bg-white"
                title="PDF Preview"
              />
            ) : previewFile?.type.includes("image") ? (
              <img
                src={previewFile.url}
                alt="Submission Preview"
                className="max-w-full max-h-full object-contain rounded"
              />
            ) : (
              <div className="text-center text-muted-foreground">
                <FileIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Preview not available for this file type.</p>
              </div>
            )}
          </div>

          <DialogFooter className="mt-4 pt-2 border-t border-border/50">
            <Button variant="outline" onClick={() => setIsPreviewModalOpen(false)}>
              Close Preview
            </Button>
            {previewFile && (
              <Button asChild className="gap-2">
                <a href={previewFile.url} download={previewFile.name}>
                  <Download className="w-4 h-4" /> Download File
                </a>
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Grade Submission Modal */}
      <Dialog open={isGradeModalOpen} onOpenChange={setIsGradeModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Evaluate Submission</DialogTitle>
            <DialogDescription>
              Enter marks and feedback for this student's work.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="marks" className="text-sm font-medium">Marks <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <Input
                    id="marks"
                    name="marks"
                    type="number"
                    min="0"
                    max="100"
                    placeholder="0 - 100"
                    value={gradeData.marks}
                    onChange={handleGradeInputChange}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">/ 100</span>
                </div>
              </div>

              <div className="grid gap-2">
                <Label className="text-sm font-medium">Result <span className="text-destructive">*</span></Label>
                <Select
                  value={gradeData.result}
                  onValueChange={(val) => setGradeData(prev => ({ ...prev, result: val }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pass / Fail" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pass">Pass</SelectItem>
                    <SelectItem value="Fail">Fail</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="feedback" className="text-sm font-medium">Feedback Notes</Label>
              <Textarea
                id="feedback"
                name="feedback"
                placeholder="Share constructive feedback for the student..."
                value={gradeData.feedback}
                onChange={handleGradeInputChange}
                className="resize-none h-24"
              />
            </div>

          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGradeModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveGrade} className="gap-2">
              Save Grade
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default TutorAssignments;
