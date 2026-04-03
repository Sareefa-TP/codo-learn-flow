import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
  ChevronLeft, 
  Mail, 
  Phone, 
  BookOpen, 
  Calendar, 
  Trophy, 
  AlertCircle, 
  Send,
  User,
  CheckCircle2,
  XCircle,
  FileText
} from "lucide-react";
import { toast } from "sonner";

// Mock student details data based on ID
const mockStudentDetails: Record<string, any> = {
  S001: {
    id: "S001",
    name: "Aarav Mehta",
    email: "aarav.m@gmail.com",
    phone: "+91 98765 43210",
    course: "Full Stack Web Dev",
    batch: "Jan 2026 Batch",
    status: "Active",
    progress: 78,
    attendance: 85,
    assignmentsStats: "18/24",
    assignments: [
      { name: "HTML/CSS Fundamentals", status: "Submitted", score: 92 },
      { name: "JavaScript Basics Quiz", status: "Submitted", score: 88 },
      { name: "React Components Lab", status: "Pending", score: 0 },
      { name: "Node.js API Development", status: "Submitted", score: 85 },
    ],
    exams: [
      { name: "Module 1 Assessment", score: 90, result: "Pass" },
      { name: "Mid-Term Project", score: 85, result: "Pass" },
    ],
    attendanceHistory: [
      { date: "2026-03-20", status: "Present" },
      { date: "2026-03-19", status: "Present" },
      { date: "2026-03-18", status: "Absent" },
      { date: "2026-03-17", status: "Present" },
    ],
    feedback: [
      { date: "2026-03-10", author: "Mentor", text: "Excellent progress in the latest project. Keep focusing on backend logic." },
      { date: "2026-02-25", author: "Mentor", text: "Regular attendance and active participation in class." },
    ],
  },
  S003: {
    id: "S003",
    name: "Rahul Sharma",
    email: "rahul.s@gmail.com",
    phone: "+91 98765 43212",
    course: "Python Backend",
    batch: "Feb 2026 Python",
    status: "At Risk",
    progress: 45,
    attendance: 65,
    assignmentsStats: "7/15",
    assignments: [
      { name: "Python Syntax", status: "Submitted", score: 75 },
      { name: "Data Structures", status: "Pending", score: 0 },
      { name: "Flask Basics", status: "Pending", score: 0 },
    ],
    exams: [
      { name: "Intro to Algorithms", score: 62, result: "Fail" },
    ],
    attendanceHistory: [
      { date: "2026-03-20", status: "Absent" },
      { date: "2026-03-19", status: "Absent" },
      { date: "2026-03-18", status: "Present" },
    ],
    feedback: [
      { date: "2026-03-15", author: "Mentor", text: "Urgent: Student has missed two consecutive weeks of assignments. Needs intervention." },
    ],
  }
};

const StudentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newFeedback, setNewFeedback] = useState("");

  const student = mockStudentDetails[id || ""] || mockStudentDetails["S001"];

  const handleAddFeedback = () => {
    if (!newFeedback.trim()) return;
    toast.success("Feedback added successfully");
    setNewFeedback("");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Active</Badge>;
      case "At Risk":
        return <Badge className="bg-red-500/10 text-red-600 border-red-500/20">At Risk</Badge>;
      case "Completed":
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-xl border-none bg-muted/30 hover:bg-muted"
              onClick={() => navigate("/mentor/my-batches/students")}
            >
              <ChevronLeft size={20} />
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{student.name}</h1>
                {getStatusBadge(student.status)}
              </div>
              <p className="text-muted-foreground text-sm">Student Monitoring Profile</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Basic Info & Progress Overview */}
          <div className="lg:col-span-1 space-y-6">
            {/* Basic Info */}
            <Card className="border-none shadow-sm rounded-[16px]">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User size={18} className="text-primary" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/20">
                  <Mail size={16} className="text-muted-foreground" />
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Email</span>
                    <span className="text-sm font-medium">{student.email}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/20">
                  <Phone size={16} className="text-muted-foreground" />
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Phone</span>
                    <span className="text-sm font-medium">{student.phone}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/20">
                  <BookOpen size={16} className="text-muted-foreground" />
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Course</span>
                    <span className="text-sm font-medium">{student.course}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/20">
                  <Calendar size={16} className="text-muted-foreground" />
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Batch</span>
                    <span className="text-sm font-medium">{student.batch}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Progress Overview */}
            <Card className="border-none shadow-sm rounded-[16px]">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trophy size={18} className="text-primary" />
                  Progress Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Course Progress</span>
                    <span className="text-sm font-bold text-primary">{student.progress}%</span>
                  </div>
                  <Progress value={student.progress} className="h-2 bg-primary/10" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Attendance</span>
                    <span className={`text-sm font-bold ${student.attendance < 75 ? "text-red-600" : "text-emerald-600"}`}>
                      {student.attendance}%
                    </span>
                  </div>
                  <Progress value={student.attendance} className="h-2 bg-muted" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Assignments Completed</span>
                    <span className="text-sm font-bold">{student.assignmentsStats}</span>
                  </div>
                  <Progress 
                    value={(parseInt(student.assignmentsStats.split("/")[0]) / parseInt(student.assignmentsStats.split("/")[1])) * 100} 
                    className="h-2 bg-muted" 
                  />
                </div>
              </CardContent>
            </Card>

            {/* Risk Indicator */}
            {(student.status === "At Risk" || student.attendance < 75 || student.progress < 50) && (
              <Card className="border-none shadow-sm rounded-[16px] bg-red-50/50 border border-red-100">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-red-600 font-bold">
                    <AlertCircle size={18} />
                    Risk Indicator
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {student.attendance < 75 && (
                      <div className="flex items-start gap-2 text-sm text-red-700 bg-red-100/50 p-3 rounded-xl">
                        <AlertCircle size={16} className="mt-0.5 shrink-0" />
                        <span>Low attendance detected ({student.attendance}%). Requires follow-up.</span>
                      </div>
                    )}
                    {student.progress < 50 && (
                      <div className="flex items-start gap-2 text-sm text-yellow-700 bg-yellow-100/50 p-3 rounded-xl border border-yellow-200">
                        <AlertCircle size={16} className="mt-0.5 shrink-0" />
                        <span>Slow course progress detected ({student.progress}%). Monitor closely.</span>
                      </div>
                    )}
                    {student.status === "At Risk" && (
                      <div className="flex items-start gap-2 text-sm text-red-700 bg-red-100 p-3 rounded-xl">
                        <AlertCircle size={16} className="mt-0.5 shrink-0" />
                        <span>Student is officially marked as At Risk. Prioritize mentorship.</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column: Assignments, Exams, Attendance, Feedback */}
          <div className="lg:col-span-2 space-y-6">
            {/* Assignments Table */}
            <Card className="border-none shadow-sm rounded-[16px] overflow-hidden">
              <CardHeader className="bg-muted/30">
                <CardTitle className="text-lg">Assignments</CardTitle>
              </CardHeader>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Assignment Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {student.assignments.map((as: any, i: number) => (
                    <TableRow key={i} className="hover:bg-muted/5 transition-colors border-none">
                      <TableCell className="py-4 font-medium">{as.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={as.status === "Submitted" ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-muted text-muted-foreground"}>
                          {as.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-bold">{as.score > 0 ? `${as.score}%` : "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

            {/* Exams Table */}
            <Card className="border-none shadow-sm rounded-[16px] overflow-hidden">
              <CardHeader className="bg-muted/30">
                <CardTitle className="text-lg">Exams / Assessments</CardTitle>
              </CardHeader>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Exam Name</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead className="text-right">Result</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {student.exams.map((ex: any, i: number) => (
                    <TableRow key={i} className="hover:bg-muted/5 transition-colors border-none">
                      <TableCell className="py-4 font-medium">{ex.name}</TableCell>
                      <TableCell className="font-bold">{ex.score}%</TableCell>
                      <TableCell className="text-right">
                        <Badge className={ex.result === "Pass" ? "bg-emerald-600" : "bg-red-600"}>
                          {ex.result}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Attendance History */}
              <Card className="border-none shadow-sm rounded-[16px] overflow-hidden">
                <CardHeader className="bg-muted/30">
                  <CardTitle className="text-lg">Attendance History</CardTitle>
                </CardHeader>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {student.attendanceHistory.map((att: any, i: number) => (
                      <TableRow key={i} className="hover:bg-muted/5 transition-colors border-none text-sm">
                        <TableCell className="py-3 font-medium">{att.date}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {att.status === "Present" ? (
                              <CheckCircle2 size={14} className="text-emerald-500" />
                            ) : (
                              <XCircle size={14} className="text-red-500" />
                            )}
                            <span className={att.status === "Present" ? "text-emerald-600 font-medium" : "text-red-600 font-medium"}>
                              {att.status}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>

              {/* Feedback Section */}
              <Card className="border-none shadow-sm rounded-[16px]">
                <CardHeader className="bg-muted/30">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText size={18} className="text-primary" />
                      Mentor Feedback
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div className="space-y-4 max-h-[250px] overflow-y-auto px-1 custom-scrollbar">
                    {student.feedback.map((f: any, i: number) => (
                      <div key={i} className="bg-muted/20 p-3 rounded-xl space-y-1 relative group hover:bg-muted/30 transition-colors">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{f.author}</span>
                          <span className="text-[10px] text-muted-foreground">{f.date}</span>
                        </div>
                        <p className="text-sm text-foreground/80 leading-relaxed">{f.text}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-4 border-t border-muted/20 flex flex-col gap-2">
                    <Textarea 
                      placeholder="Add new feedback..." 
                      className="min-h-[80px] rounded-xl bg-muted/10 border-none focus-visible:ring-primary/20"
                      value={newFeedback}
                      onChange={(e) => setNewFeedback(e.target.value)}
                    />
                    <Button 
                      className="w-full rounded-xl shadow-lg shadow-primary/20 gap-2"
                      onClick={handleAddFeedback}
                    >
                      <Send size={16} />
                      Post Feedback
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDetails;
