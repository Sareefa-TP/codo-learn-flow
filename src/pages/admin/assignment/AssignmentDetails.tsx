import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Pencil, 
  Calendar, 
  Clock, 
  Users, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp,
  GraduationCap,
  Layers,
  Search,
  ExternalLink,
  Download,
  MoreVertical,
  Star,
  Timer,
  XCircle,
  ChevronRight,
  Eye
} from "lucide-react";
import { 
  getAssignmentById, 
  getSubmissionsForAssignment, 
  Assignment,
  AssignmentSubmission
} from "@/data/assignmentData";
import { courses } from "@/data/courseData";
import { SHARED_BATCHES } from "@/data/batchData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

const AssignmentDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const assignment = getAssignmentById(id || "");
  const submissions = getSubmissionsForAssignment(id || "");

  if (!assignment) {
    return (
      <DashboardLayout>
        <div className="p-20 text-center">
          <h1 className="text-2xl font-black text-slate-900">Assignment not found</h1>
          <Button onClick={() => navigate("/admin/assignments")} className="mt-4">Back to List</Button>
        </div>
      </DashboardLayout>
    );
  }

  const course = courses.find(c => c.id === assignment.courseId);
  const batch = SHARED_BATCHES.find(b => b.id === assignment.batchId);

  // Analytics Calculations
  const totalStudents = assignment.studentIds.length;
  const submittedCount = submissions.filter(s => s.status === "Submitted" || s.status === "Late").length;
  const pendingCount = totalStudents - submittedCount;
  const gradedCount = submissions.filter(s => s.marks !== undefined).length;
  const averageScore = gradedCount > 0 
    ? Math.round(submissions.reduce((acc, curr) => acc + (curr.marks || 0), 0) / gradedCount)
    : 0;

  const getStatusBadge = (status: Assignment["status"]) => {
    switch (status) {
      case "Published":
        return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100 gap-1.5 px-3 py-1.5 rounded-full font-black text-xs uppercase tracking-wider shadow-sm">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> {status}
        </Badge>;
      case "Draft":
        return <Badge className="bg-slate-100 text-slate-600 border-slate-200 gap-1.5 px-3 py-1.5 rounded-full font-black text-xs uppercase tracking-wider shadow-sm">
          <Clock className="w-3 h-3" /> {status}
        </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getSubmissionStatusBadge = (status: AssignmentSubmission["status"]) => {
    switch (status) {
      case "Submitted":
        return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 font-bold">Submitted</Badge>;
      case "Late":
        return <Badge className="bg-amber-50 text-amber-700 border-amber-100 font-bold">Late Submission</Badge>;
      case "Pending":
        return <Badge className="bg-rose-50 text-rose-700 border-rose-100 font-bold">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8 space-y-8 animate-in fade-in duration-700 max-w-7xl mx-auto">
        {/* Breadcrumb & Header */}
        <div className="flex flex-col gap-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/admin/assignments")}
            className="w-fit gap-2 font-bold text-slate-500 hover:text-primary transition-colors p-0 hover:bg-transparent"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Assignments
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-indigo-50 rounded-[2rem] flex items-center justify-center shadow-inner">
                <FileText className="w-10 h-10 text-indigo-600" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-black tracking-tight text-slate-900">{assignment.title}</h1>
                  {getStatusBadge(assignment.status)}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-slate-500">
                  <span className="flex items-center gap-1.5"><GraduationCap className="w-4 h-4 text-primary" /> {course?.name}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                  <span className="flex items-center gap-1.5"><Layers className="w-4 h-4 text-amber-500" /> {batch?.name}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-rose-500" /> Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <Button 
              onClick={() => navigate(`/admin/assignments/${assignment.id}/edit`)}
              className="bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-100 h-12 px-8 rounded-2xl font-black gap-2 transition-all shadow-sm active:scale-95"
            >
              <Pencil className="w-5 h-5 text-amber-500" />
              Edit Setup
            </Button>
          </div>
        </div>

        {/* TABS DASHBOARD */}
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 flex w-fit">
            <TabsTrigger value="overview" className="rounded-xl px-8 py-3 font-black text-xs uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Overview</TabsTrigger>
            <TabsTrigger value="submissions" className="rounded-xl px-8 py-3 font-black text-xs uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Submissions</TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-xl px-8 py-3 font-black text-xs uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-0 focus-visible:ring-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Details */}
              <div className="lg:col-span-2 space-y-8">
                <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
                  <CardHeader className="bg-slate-50/50 p-8 border-b border-slate-100">
                    <CardTitle className="text-2xl font-black text-slate-900">Assignment Description</CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <p className="text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">
                      {assignment.description}
                    </p>
                    
                    {assignment.files.length > 0 && (
                      <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Attached Resources</p>
                        <div className="flex flex-wrap gap-4">
                          {assignment.files.map((file, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 shadow-sm group cursor-pointer hover:border-primary transition-all">
                              <div className="w-10 h-10 bg-rose-50 rounded-lg flex items-center justify-center text-rose-500">
                                <FileText className="w-5 h-5" />
                              </div>
                              <div className="pr-4">
                                <p className="text-xs font-black text-slate-700 leading-none">Resource_{i+1}.pdf</p>
                                <p className="text-[10px] font-bold text-slate-400 mt-1">1.2 MB • PDF</p>
                              </div>
                              <Download className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column: Metadata */}
              <div className="space-y-8">
                <Card className="border-none shadow-2xl rounded-[2.5rem] bg-indigo-600 text-white overflow-hidden">
                  <CardContent className="p-8 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                        <TrendingUp className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">Max Score</p>
                        <p className="text-3xl font-black leading-none mt-1">{assignment.maxMarks} Marks</p>
                      </div>
                    </div>
                    <div className="h-px bg-white/10 w-full" />
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">Students</p>
                        <p className="text-xl font-bold mt-1">{totalStudents}</p>
                      </div>
                      <div>
                        <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">Late Allowed</p>
                        <p className="text-xl font-bold mt-1">Yes</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
                  <CardHeader className="p-8 border-b border-slate-100 flex flex-row items-center justify-between">
                    <CardTitle className="text-xl font-black text-slate-900">Timeline</CardTitle>
                    <Badge variant="outline" className="rounded-xl font-black text-[10px] uppercase tracking-widest border-slate-100 text-slate-400 px-3">Lifecycle</Badge>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6">
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-5 h-5 rounded-full bg-primary border-4 border-primary/20 shadow-lg z-10" />
                        <div className="w-0.5 h-12 bg-slate-100" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Created At</p>
                        <p className="text-sm font-bold text-slate-900">{new Date(assignment.createdAt).toLocaleString('en-GB')}</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-5 h-5 rounded-full bg-emerald-500 border-4 border-emerald-500/20 shadow-lg z-10" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Due Date</p>
                        <p className="text-sm font-bold text-slate-900">{new Date(assignment.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="submissions" className="mt-0 focus-visible:ring-0">
            <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
              <CardHeader className="p-8 bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-primary">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-black text-slate-900">Student Submissions</CardTitle>
                    <p className="text-slate-500 font-medium text-sm">Monitor results and provide grading</p>
                  </div>
                </div>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input placeholder="Search students..." className="h-10 pl-11 rounded-xl w-64 bg-white border-slate-200" />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/30 border-slate-100">
                      <TableHead className="pl-8 py-5 font-black text-[10px] uppercase tracking-widest text-slate-400">Student Info</TableHead>
                      <TableHead className="py-5 font-black text-[10px] uppercase tracking-widest text-slate-400">Status</TableHead>
                      <TableHead className="py-5 font-black text-[10px] uppercase tracking-widest text-slate-400">Submission Date</TableHead>
                      <TableHead className="py-5 font-black text-[10px] uppercase tracking-widest text-slate-400 text-center">Marks</TableHead>
                      <TableHead className="pr-8 py-5 font-black text-[10px] uppercase tracking-widest text-slate-400 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.map((sub) => (
                      <TableRow key={sub.id} className="group border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <TableCell className="pl-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-black text-xs uppercase shadow-inner">
                              {sub.studentName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{sub.studentName}</p>
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mt-0.5">ID: {sub.studentId}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getSubmissionStatusBadge(sub.status)}
                        </TableCell>
                        <TableCell>
                          <span className="text-xs font-bold text-slate-600">
                            {sub.submittedDate ? new Date(sub.submittedDate).toLocaleString('en-GB') : "—"}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className={cn(
                            "inline-flex flex-col items-center justify-center w-16 py-1.5 rounded-xl border font-black shadow-sm",
                            sub.marks ? "bg-indigo-50 border-indigo-100 text-indigo-700" : "bg-slate-50 border-slate-100 text-slate-400"
                          )}>
                            <p className="text-lg leading-none">{sub.marks || "—"}</p>
                            <p className="text-[8px] uppercase tracking-widest text-indigo-400 mt-1">/ {assignment.maxMarks}</p>
                          </div>
                        </TableCell>
                        <TableCell className="pr-8 text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" className="w-9 h-9 rounded-xl hover:bg-white hover:shadow-md transition-all">
                              <Eye className="w-4 h-4 text-blue-500" />
                            </Button>
                            <Button variant="ghost" size="icon" className="w-9 h-9 rounded-xl hover:bg-white hover:shadow-md transition-all">
                              <Star className="w-4 h-4 text-amber-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="mt-0 focus-visible:ring-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="border-none shadow-2xl rounded-[2.2rem] bg-white p-6 flex flex-col gap-4">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100/50">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Students</p>
                  <p className="text-3xl font-black text-slate-900">{totalStudents}</p>
                </div>
              </Card>
              <Card className="border-none shadow-2xl rounded-[2.2rem] bg-white p-6 flex flex-col gap-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100/50">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-1">Submitted</p>
                  <p className="text-3xl font-black text-slate-900">{submittedCount}</p>
                </div>
              </Card>
              <Card className="border-none shadow-2xl rounded-[2.2rem] bg-white p-6 flex flex-col gap-4">
                <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 shadow-sm border border-rose-100/50">
                   <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-rose-400 mb-1">Pending</p>
                  <p className="text-3xl font-black text-slate-900">{pendingCount}</p>
                </div>
              </Card>
              <Card className="border-none shadow-2xl rounded-[2.2rem] bg-white p-6 flex flex-col gap-4">
                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 shadow-sm border border-amber-100/50">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-1">Average Score</p>
                  <p className="text-3xl font-black text-slate-900">{averageScore}%</p>
                </div>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white p-8">
                <CardHeader className="p-0 mb-6">
                  <CardTitle className="text-xl font-black text-slate-900">Performance Summary</CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-6">
                   <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-700">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-slate-800">Submission Rate</span>
                      </div>
                      <span className="text-2xl font-black text-emerald-600">{Math.round((submittedCount / totalStudents) * 100)}%</span>
                   </div>
                   <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-700">
                          <Star className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-slate-800">Grading Status</span>
                      </div>
                      <span className="text-2xl font-black text-indigo-600">{Math.round((gradedCount / submittedCount) * 100)}%</span>
                   </div>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-2xl rounded-[2.5rem] bg-slate-900 text-white p-8 overflow-hidden relative">
                 <div className="relative z-10 space-y-6">
                   <h3 className="text-2xl font-black">Ready to re-evaluate?</h3>
                   <p className="text-white/60 font-medium">You can manually bulk grade or export the submission results to a CSV for external analysis.</p>
                   <div className="pt-4 flex gap-3">
                     <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl h-12 px-6 font-bold shadow-lg shadow-primary/20">Export CSV</Button>
                     <Button variant="ghost" className="text-white hover:bg-white/10 rounded-xl h-12 px-6 font-bold">Manage Results</Button>
                   </div>
                 </div>
                 <Layers className="absolute -bottom-20 -right-20 w-80 h-80 text-white/5 opacity-40 rotate-12" />
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AssignmentDetails;
