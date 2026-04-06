import { useState, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
  Search,
  Calendar as CalendarIcon,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  FileText,
  Download,
  BookOpen,
  Layers,
  ChevronRight,
  Users,
  GraduationCap,
  Clock,
  PlayCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// Types
interface Course {
  id: string;
  name: string;
  description: string;
  studentCount: number;
  moduleCount: number;
  image: string;
}

interface Module {
  id: string;
  name: string;
  courseId: string;
}

interface Assignment {
  id: string;
  title: string;
  moduleId: string;
  courseId: string;
  dueDate: string;
  status: "Active" | "Closed";
  totalSubmissions: number;
}

interface Submission {
  id: string;
  assignmentId: string;
  studentName: string;
  fileName: string;
  fileURL: string;
  submittedDate: string;
  status: "Submitted" | "Late";
  marks: number | null;
  feedback: string;
  result: "Pass" | "Fail" | "";
}

// Demo Data
const courses: Course[] = [
  {
    id: "C-001",
    name: "Full Stack Development",
    description: "Master modern web development from HTML to advanced React and Node.js.",
    studentCount: 124,
    moduleCount: 12,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: "C-002",
    name: "Python Backend Development",
    description: "Build robust backend systems with Python, Django, and PostgreSQL.",
    studentCount: 86,
    moduleCount: 8,
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: "C-003",
    name: "UI/UX Design",
    description: "Learn user interface and experience design principles with Figma.",
    studentCount: 52,
    moduleCount: 6,
    image: "https://images.unsplash.com/photo-1586717791821-3f44a563dc4c?w=800&auto=format&fit=crop&q=60"
  }
];

const modules: Module[] = [
  { id: "MOD-001", name: "Module 1 – HTML Basics", courseId: "C-001" },
  { id: "MOD-002", name: "Module 2 – CSS Fundamentals", courseId: "C-001" },
  { id: "MOD-003", name: "Module 3 – JavaScript Core", courseId: "C-001" },
  { id: "MOD-004", name: "Module 1 – Python Syntax", courseId: "C-002" },
  { id: "MOD-005", name: "Module 1 – Design Principles", courseId: "C-003" },
];

const initialAssignments: Assignment[] = [
  { id: "ASG-001", title: "HTML Portfolio Project", moduleId: "MOD-001", courseId: "C-001", dueDate: "10 Mar 2026", status: "Active", totalSubmissions: 45 },
  { id: "ASG-002", title: "CSS Layout Challenge", moduleId: "MOD-002", courseId: "C-001", dueDate: "20 Mar 2026", status: "Active", totalSubmissions: 38 },
  { id: "ASG-003", title: "JavaScript Todo App", moduleId: "MOD-003", courseId: "C-001", dueDate: "25 Mar 2026", status: "Active", totalSubmissions: 12 },
  { id: "ASG-004", title: "Python Data Parser", moduleId: "MOD-004", courseId: "C-002", dueDate: "15 Mar 2026", status: "Closed", totalSubmissions: 80 },
];

const initialSubmissions: Submission[] = [
  { id: "SUB-001", assignmentId: "ASG-001", studentName: "Aarav Sharma", fileName: "aarav_portfolio.zip", fileURL: "#", submittedDate: "08 Mar 2026", status: "Submitted", marks: null, feedback: "", result: "" },
  { id: "SUB-002", assignmentId: "ASG-001", studentName: "Meera Reddy", fileName: "meera_site.pdf", fileURL: "#", submittedDate: "09 Mar 2026", status: "Submitted", marks: 92, feedback: "Great work on the layout!", result: "Pass" },
  { id: "SUB-003", assignmentId: "ASG-001", studentName: "Kabir Singh", fileName: "portfolio_final.zip", fileURL: "#", submittedDate: "11 Mar 2026", status: "Late", marks: null, feedback: "", result: "" },
];

const TutorAssignments = () => {
  const { toast } = useToast();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [courseSearch, setCourseSearch] = useState("");
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions);

  // Grading Modal State
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [gradingSubmission, setGradingSubmission] = useState<Submission | null>(null);
  const [gradeData, setGradeData] = useState({
    marks: "",
    feedback: "",
    result: "" as Submission["result"]
  });

  // Derived list of all assignments with course data
  const allAssignments = useMemo(() => {
    return assignments.map(asg => {
      const course = courses.find(c => c.id === asg.courseId);
      return {
        ...asg,
        courseName: course?.name || "Unknown Course",
        courseStudents: course?.studentCount || 0
      };
    }).filter(asg => 
      asg.title.toLowerCase().includes(courseSearch.toLowerCase()) ||
      asg.courseName.toLowerCase().includes(courseSearch.toLowerCase())
    );
  }, [assignments, courseSearch]);

  // Submissions for selected assignment
  const currentSubmissions = useMemo(() => {
    if (!selectedAssignment) return [];
    return submissions.filter(s => s.assignmentId === selectedAssignment.id);
  }, [submissions, selectedAssignment]);

  // Grading Handlers
  const openGradeModal = (submission: Submission) => {
    setGradingSubmission(submission);
    setGradeData({
      marks: submission.marks?.toString() || "",
      feedback: submission.feedback || "",
      result: submission.result || ""
    });
    setIsGradeModalOpen(true);
  };

  const handleSaveGrade = () => {
    if (!gradingSubmission) return;
    const marks = parseInt(gradeData.marks);
    if (isNaN(marks) || marks < 0 || marks > 100) {
      toast({ title: "Invalid Marks", description: "Please enter marks between 0 and 100.", variant: "destructive" });
      return;
    }

    setSubmissions(submissions.map(s =>
      s.id === gradingSubmission.id
        ? { ...s, marks, feedback: gradeData.feedback, result: gradeData.result }
        : s
    ));
    setIsGradeModalOpen(false);
    toast({ title: "Grade Saved", description: `Evaluation sent to ${gradingSubmission.studentName}.` });
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6 lg:space-y-8 max-w-6xl mx-auto pb-10">

        {/* Unified View: Assignment Cards Grid */}
        {!selectedAssignment && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                  <ClipboardList className="w-8 h-8 text-primary" />
                  Assignments
                </h1>
                <p className="text-muted-foreground mt-2">
                  Review and manage student work across all your assigned batches.
                </p>
              </div>
            </div>

            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search assignments or courses..."
                className="pl-10 h-11 bg-card"
                value={courseSearch}
                onChange={(e) => setCourseSearch(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allAssignments.map((asg) => {
                const submissionProgress = Math.round((asg.totalSubmissions / asg.courseStudents) * 100);
                return (
                  <Card key={asg.id} className="border-border/50 hover:border-primary/50 transition-all hover:shadow-md overflow-hidden flex flex-col">
                    <CardContent className="p-0 flex flex-col h-full">
                      <div className="p-6 flex-1 space-y-4">
                        <div className="flex justify-between items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                            <ClipboardList className="w-6 h-6 text-primary" />
                          </div>
                          <Badge variant="outline" className={cn(
                            "border-primary/20 font-bold",
                            asg.status === "Active" ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-muted text-muted-foreground"
                          )}>
                            {asg.status}
                          </Badge>
                        </div>

                        <div>
                          <h2 className="text-xl font-bold text-foreground line-clamp-1">{asg.title}</h2>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-bold uppercase text-[10px] tracking-wider">
                              {asg.courseName}
                            </Badge>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider bg-muted px-2 py-0.5 rounded">
                              Jan 2026 Batch
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4 pt-2">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2 text-muted-foreground font-medium">
                              <CalendarIcon className="w-3.5 h-3.5 text-primary" />
                              <span>Due Date:</span>
                            </div>
                            <span className="font-bold text-foreground">{asg.dueDate}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2 text-muted-foreground font-medium">
                              <Users className="w-3.5 h-3.5 text-blue-500" />
                              <span>Total Students:</span>
                            </div>
                            <span className="font-bold text-foreground">{asg.courseStudents}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2 text-muted-foreground font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                              <span>Submitted:</span>
                            </div>
                            <span className="font-bold text-foreground">{asg.totalSubmissions}</span>
                          </div>

                          <div className="space-y-2 pt-1">
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                              <span>Submission Progress</span>
                              <span className="text-primary">{submissionProgress}%</span>
                            </div>
                            <Progress value={submissionProgress} className="h-1.5" />
                          </div>
                        </div>
                      </div>

                      <div className="p-4 border-t border-border/50 bg-muted/20 flex flex-col gap-2">
                        <Button
                          className="w-full justify-center bg-primary hover:bg-primary/90 text-primary-foreground gap-2 font-bold shadow-sm"
                          onClick={() => setSelectedAssignment(asg)}
                        >
                          <PlayCircle className="w-4 h-4" />
                          View Submissions
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-center hover:bg-primary/10 hover:text-primary gap-2 font-bold border-border/60"
                          onClick={() => toast({ title: "Edit Mode", description: "This will open the assignment editor." })}
                        >
                          <ClipboardList className="w-4 h-4" />
                          Edit Assignment
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Detail View: Submissions Review */}
        {selectedAssignment && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => setSelectedAssignment(null)} className="h-10 w-10">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase font-bold tracking-wider">
                    <BookOpen className="w-3 h-3" />
                    {selectedCourse?.name}
                  </div>
                  <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-foreground mt-0.5">
                    {selectedAssignment.title}
                  </h1>
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/20 px-4 py-2 rounded-lg flex items-center gap-3">
                <div className="text-center border-r border-primary/20 pr-3">
                  <p className="text-[10px] uppercase font-bold text-primary">Submissions</p>
                  <p className="text-xl font-black text-primary">{currentSubmissions.length}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">Due Date</p>
                  <p className="text-sm font-bold text-foreground">{selectedAssignment.dueDate}</p>
                </div>
              </div>
            </div>

            <Card className="border-border/50 shadow-sm overflow-hidden">
              <CardHeader className="bg-muted/10 border-b border-border/50">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  Student Roster & Submissions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-muted/20">
                      <TableRow>
                        <TableHead className="pl-6 w-[220px]">Student Name</TableHead>
                        <TableHead>Submission</TableHead>
                        <TableHead>Submitted On</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Evaluation</TableHead>
                        <TableHead className="pr-6 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentSubmissions.length > 0 ? (
                        currentSubmissions.map((sub) => (
                          <TableRow key={sub.id} className="hover:bg-muted/10 transition-colors">
                            <TableCell className="pl-6 font-bold">{sub.studentName}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2 text-sm text-foreground/80 hover:text-primary cursor-pointer group">
                                <FileText className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                                <span className="font-medium underline decoration-primary/20">{sub.fileName}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                <Clock className="w-3.5 h-3.5" />
                                {sub.submittedDate}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={cn(
                                "text-[10px] h-5 font-bold uppercase",
                                sub.status === "Submitted" ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-orange-50 text-orange-600 border-orange-200"
                              )}>
                                {sub.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {sub.marks !== null ? (
                                <span className="font-black text-foreground">{sub.marks}/100</span>
                              ) : (
                                <span className="text-muted-foreground italic text-xs">Pending</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {sub.result ? (
                                <div className={cn(
                                  "flex items-center gap-1.5 text-xs font-bold",
                                  sub.result === "Pass" ? "text-emerald-600" : "text-rose-600"
                                )}>
                                  {sub.result === "Pass" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                                  {sub.result}
                                </div>
                              ) : "—"}
                            </TableCell>
                            <TableCell className="pr-6 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                                        <Download className="w-4 h-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Download Submission</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 font-bold text-xs"
                                  onClick={() => openGradeModal(sub)}
                                >
                                  {sub.marks !== null ? "Re-evaluate" : "Grade"}
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="h-40 text-center text-muted-foreground">
                            No submissions received yet for this assignment.
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

      {/* Grading Dialog */}
      <Dialog open={isGradeModalOpen} onOpenChange={setIsGradeModalOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-primary" />
              Evaluate Submission
            </DialogTitle>
            <DialogDescription>
              Grading submission for <strong>{gradingSubmission?.studentName}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="font-bold">Final Marks (0-100)</Label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="e.g. 85"
                    value={gradeData.marks}
                    onChange={(e) => {
                      const val = e.target.value;
                      const num = parseInt(val);
                      setGradeData(prev => ({
                        ...prev,
                        marks: val,
                        result: (!isNaN(num) && num >= 40) ? "Pass" : (!isNaN(num) ? "Fail" : "")
                      }));
                    }}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-xs">/ 100</span>
                </div>
              </div>
              <div className="grid gap-2">
                <Label className="font-bold">Result Status</Label>
                <Select value={gradeData.result} onValueChange={(v) => setGradeData(prev => ({ ...prev, result: v as any }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pass">Pass</SelectItem>
                    <SelectItem value="Fail">Fail</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label className="font-bold">Constructive Feedback</Label>
              <Textarea
                placeholder="Write detailed feedback for the student..."
                className="min-h-[120px] resize-none"
                value={gradeData.feedback}
                onChange={(e) => setGradeData(prev => ({ ...prev, feedback: e.target.value }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGradeModalOpen(false)} className="font-bold">Cancel</Button>
            <Button onClick={handleSaveGrade} className="font-bold min-w-[120px]">Submit Evaluation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </DashboardLayout>
  );
};

export default TutorAssignments;
