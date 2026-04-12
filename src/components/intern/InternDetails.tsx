import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  LayoutDashboard,
  CheckCircle,
  Clock,
  Briefcase,
  ListTodo,
  FileText,
  UserCheck,
  TrendingUp,
  Download,
  Plus,
  Trash2,
  Edit2,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Search,
  Users
} from "lucide-react";
import { 
  INTERNS, 
  TASKS as MOCK_TASKS, 
  SUBMISSIONS as MOCK_SUBMISSIONS, 
  REPORTS as MOCK_REPORTS, 
  ATTENDANCE as MOCK_ATTENDANCE,
  Intern,
  Task,
  Submission,
  WeeklyReport,
  AttendanceRecord
} from "@/data/internData";
import { toast } from "sonner";
import { useRole } from "@/hooks/useRole";

const AdminInternDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useRole();
  const basePath = role === "superadmin" ? "/superadmin" : "/admin";
  const [activeTab, setActiveTab] = useState("overview");

  // Find intern data
  const intern = useMemo(() => INTERNS.find(i => i.id === id), [id]);
  
  // Local state for interactive elements (simulated)
  const [tasks, setTasks] = useState<Task[]>(id ? MOCK_TASKS[id] || [] : []);
  const [submissions, setSubmissions] = useState<Submission[]>(id ? MOCK_SUBMISSIONS[id] || [] : []);
  const [reports, setReports] = useState<WeeklyReport[]>(id ? MOCK_REPORTS[id] || [] : []);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(id ? MOCK_ATTENDANCE[id] || [] : []);

  if (!intern) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
            <Users className="w-8 h-8" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold">Intern Not Found</h2>
            <p className="text-muted-foreground">The intern you are looking for does not exist or has been removed.</p>
          </div>
          <Button onClick={() => navigate(`${basePath}/interns`)} variant="outline" className="rounded-xl gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Interns
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6 max-w-[1600px] mx-auto pb-10">
        
        {/* SECTION A: HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full h-10 w-10 shrink-0 border-border/50"
              onClick={() => navigate(`${basePath}/interns`)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">{intern.name}</h1>
                <Badge className={
                  intern.status === "Active" 
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" 
                    : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                }>
                  {intern.status}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm font-medium">{intern.role} • {intern.batch}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Action buttons removed as requested */}
          </div>
        </div>

        {/* SECTION B: TAB NAVIGATION */}
        <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="bg-muted/40 p-1 rounded-2xl border border-border/40 mb-6 h-auto flex flex-wrap justify-start gap-1">
            <TabsTrigger value="overview" className="rounded-xl py-2.5 px-5 font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all gap-2">
              <LayoutDashboard className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="tasks" className="rounded-xl py-2.5 px-5 font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all gap-2">
              <ListTodo className="w-4 h-4" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="submissions" className="rounded-xl py-2.5 px-5 font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all gap-2">
              <CheckCircle className="w-4 h-4" />
              Submissions
            </TabsTrigger>
            <TabsTrigger value="reports" className="rounded-xl py-2.5 px-5 font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all gap-2">
              <FileText className="w-4 h-4" />
              Weekly Reports
            </TabsTrigger>
            <TabsTrigger value="attendance" className="rounded-xl py-2.5 px-5 font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all gap-2">
              <UserCheck className="w-4 h-4" />
              Attendance
            </TabsTrigger>
            <TabsTrigger value="performance" className="rounded-xl py-2.5 px-5 font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all gap-2">
              <TrendingUp className="w-4 h-4" />
              Performance
            </TabsTrigger>
          </TabsList>

          {/* SECTION C: TAB CONTENT */}

          {/* 1. OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Profile Details */}
              <Card className="rounded-2xl border-border/50 shadow-sm col-span-1 lg:col-span-2 overflow-hidden">
                <CardHeader className="bg-muted/30 pb-4">
                  <CardTitle className="text-base font-bold">General Information</CardTitle>
                </CardHeader>
                <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest pl-0.5">Full Name</p>
                    <p className="text-sm font-bold text-foreground bg-muted/20 p-2.5 rounded-xl border border-border/40">{intern.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest pl-0.5">Email Address</p>
                    <p className="text-sm font-bold text-foreground bg-muted/20 p-2.5 rounded-xl border border-border/40">{intern.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest pl-0.5">Phone Number</p>
                    <p className="text-sm font-bold text-foreground bg-muted/20 p-2.5 rounded-xl border border-border/40">{intern.phone}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest pl-0.5">Course / Role</p>
                    <p className="text-sm font-bold text-foreground bg-muted/20 p-2.5 rounded-xl border border-border/40">{intern.role} ({intern.course})</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest pl-0.5">Batch</p>
                    <p className="text-sm font-bold text-foreground bg-muted/20 p-2.5 rounded-xl border border-border/40">{intern.batch}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest pl-0.5">Joined Date</p>
                    <p className="text-sm font-bold text-foreground bg-muted/20 p-2.5 rounded-xl border border-border/40">{intern.joinedDate}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats Summary */}
              <div className="grid grid-cols-1 gap-4">
                <Card className="rounded-2xl border-border/50 shadow-sm p-4 flex items-center justify-between bg-blue-50/50">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-600">Total Tasks</p>
                    <h4 className="text-2xl font-black">{tasks.length}</h4>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-600">
                    <ListTodo className="w-5 h-5" />
                  </div>
                </Card>
                <Card className="rounded-2xl border-border/50 shadow-sm p-4 flex items-center justify-between bg-emerald-50/50">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Completed</p>
                    <h4 className="text-2xl font-black">{tasks.filter(t => t.status === "Reviewed").length}</h4>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-600/10 flex items-center justify-center text-emerald-600">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                </Card>
                <Card className="rounded-2xl border-border/50 shadow-sm p-4 flex items-center justify-between bg-amber-50/50">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-amber-600">Attendance</p>
                    <h4 className="text-2xl font-black">{intern.performance.attendanceRate}%</h4>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-amber-600/10 flex items-center justify-center text-amber-600">
                    <UserCheck className="w-5 h-5" />
                  </div>
                </Card>
                <Card className="rounded-2xl border-border/50 shadow-sm p-4 flex items-center justify-between bg-indigo-50/50">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Performance</p>
                    <h4 className="text-2xl font-black">{intern.performance.overallScore}/100</h4>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/10 flex items-center justify-center text-indigo-600">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* 2. TASKS TAB */}
          <TabsContent value="tasks" className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between bg-card border border-border/50 rounded-2xl p-4 shadow-sm">
              <div>
                <h3 className="text-lg font-bold">Assigned Tasks ({tasks.length})</h3>
                <p className="text-sm text-muted-foreground">Create and manage tasks assigned to this intern.</p>
              </div>
              <Button className="rounded-xl gap-2 font-bold px-5" onClick={() => toast.success("Create Task Modal opened")}>
                <Plus className="w-4 h-4" /> Create Task
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <Card key={task.id} className="rounded-2xl border-border/50 shadow-sm overflow-hidden group hover:border-primary/30 transition-colors">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row items-stretch">
                        <div className="p-6 flex-1 space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="text-base font-bold text-foreground">{task.title}</h4>
                            <Badge className={
                              task.status === "Reviewed" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                              task.status === "Submitted" ? "bg-blue-500/10 text-blue-600 border-blue-500/20" :
                              "bg-muted text-muted-foreground border-border/40"
                            }>
                              {task.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
                          <div className="flex items-center gap-4 pt-2">
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                              <Clock className="w-3.5 h-3.5" />
                              Deadline: {task.deadline}
                            </div>
                          </div>
                        </div>
                        <div className="bg-muted/20 md:w-48 border-t md:border-t-0 md:border-l border-border/50 p-4 flex flex-col justify-center gap-2">
                          <Button variant="outline" size="sm" className="rounded-xl font-bold bg-background gap-2" onClick={() => toast.info("Task edit triggered")}>
                            <Edit2 className="w-3.5 h-3.5" /> Edit
                          </Button>
                          <Button variant="outline" size="sm" className="rounded-xl font-bold bg-background gap-2 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => toast.error("Task deletion triggered")}>
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center p-20 border-2 border-dashed border-border/50 rounded-2xl bg-muted/10">
                  <ListTodo className="w-12 h-12 text-muted-foreground/30 mb-3" />
                  <p className="text-muted-foreground font-medium">No tasks assigned yet</p>
                  <Button variant="link" className="text-primary font-bold" onClick={() => toast.success("Create Task Modal opened")}>
                    Assign First Task
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* 3. SUBMISSIONS TAB */}
          <TabsContent value="submissions" className="space-y-6 animate-fade-in">
            <Card className="rounded-2xl border-border/50 shadow-sm overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow className="hover:bg-transparent border-border/60">
                    <TableHead className="py-4 pl-6 text-foreground font-bold">Task Name</TableHead>
                    <TableHead className="text-foreground font-bold">File / Link</TableHead>
                    <TableHead className="text-foreground font-bold">Submission Date</TableHead>
                    <TableHead className="text-foreground font-bold">Status</TableHead>
                    <TableHead className="text-right pr-6 text-foreground font-bold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.length > 0 ? (
                    submissions.map((sub) => (
                      <TableRow key={sub.id} className="border-border/40 hover:bg-muted/20 transition-colors">
                        <TableCell className="py-4 pl-6 font-semibold">{sub.taskName}</TableCell>
                        <TableCell>
                          <Button variant="link" className="p-0 text-blue-600 font-bold gap-2 h-auto" onClick={() => toast.info(`Downloading ${sub.fileName}`)}>
                            <Download className="w-4 h-4" /> {sub.fileName}
                          </Button>
                        </TableCell>
                        <TableCell className="text-muted-foreground font-medium">{sub.submissionDate}</TableCell>
                        <TableCell>
                          <Badge className={
                            sub.status === "Approved" ? "bg-emerald-500/10 text-emerald-600" :
                            sub.status === "Rejected" ? "bg-destructive/10 text-destructive" :
                            "bg-amber-500/10 text-amber-600"
                          }>
                            {sub.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <div className="flex items-center justify-end gap-2">
                             <Button size="sm" variant="outline" className="rounded-xl h-8 font-bold border-emerald-200 text-emerald-600 hover:bg-emerald-50" onClick={() => toast.success("Submission Approved")}>
                               <ThumbsUp className="w-3.5 h-3.5" /> Approve
                             </Button>
                             <Button size="sm" variant="outline" className="rounded-xl h-8 font-bold border-red-200 text-destructive hover:bg-red-50" onClick={() => toast.error("Submission Rejected")}>
                               <ThumbsDown className="w-3.5 h-3.5" /> Reject
                             </Button>
                             <Button size="sm" variant="ghost" className="rounded-xl h-8 w-8 p-0" title="Add Feedback" onClick={() => toast.info("Feedback modal opened")}>
                               <MessageSquare className="w-4 h-4" />
                             </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-40 text-center text-muted-foreground">No submissions yet.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* 4. REPORTS TAB */}
          <TabsContent value="reports" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 gap-6">
              {reports.length > 0 ? (
                reports.map((report) => (
                  <Card key={report.id} className="rounded-2xl border-border/50 shadow-sm overflow-hidden group">
                    <CardHeader className="bg-muted/30 pb-4 flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-base font-bold">{report.week}</CardTitle>
                        <CardDescription className="text-[10px] font-bold uppercase tracking-wider">{report.date}</CardDescription>
                      </div>
                      <Button variant="outline" size="sm" className="rounded-xl font-bold bg-background" onClick={() => toast.info("Viewing report details")}>
                        View Full Report
                      </Button>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-1.5">
                          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest pl-0.5">Work Done</p>
                          <div className="bg-muted/20 p-3 rounded-xl border border-border/40 text-sm italic line-clamp-3">"{report.workDone}"</div>
                        </div>
                        <div className="space-y-1.5">
                          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest pl-0.5">Challenges</p>
                          <div className="bg-muted/20 p-3 rounded-xl border border-border/40 text-sm italic line-clamp-3">"{report.challenges}"</div>
                        </div>
                        <div className="space-y-1.5">
                          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest pl-0.5">Learnings</p>
                          <div className="bg-muted/20 p-3 rounded-xl border border-border/40 text-sm italic line-clamp-3">"{report.learnings}"</div>
                        </div>
                      </div>
                      {report.feedback && (
                        <div className="p-3.5 bg-primary/5 rounded-xl border border-primary/20 flex items-start gap-3">
                          <MessageSquare className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                          <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary">Admin Feedback</p>
                            <p className="text-xs font-medium">{report.feedback}</p>
                          </div>
                        </div>
                      )}
                      {!report.feedback && (
                        <Button variant="link" className="h-auto p-0 text-primary font-bold text-xs" onClick={() => toast.info("Feedback form opened")}>
                          + Add Feedback
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="h-60 flex flex-col items-center justify-center border-2 border-dashed border-border/50 rounded-2xl bg-muted/10 gap-3">
                   <FileText className="w-10 h-10 text-muted-foreground/30" />
                   <p className="text-muted-foreground font-medium">No weekly reports submitted yet</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* 5. ATTENDANCE TAB */}
          <TabsContent value="attendance" className="space-y-6 animate-fade-in">
            <div className="bg-card border border-border/50 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
                <div className="flex items-center gap-4 w-full md:w-auto">
                   <div className="relative w-full md:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input placeholder="Filter by date..." className="pl-9 h-10 rounded-xl bg-muted/30 border-border/50 text-sm" />
                   </div>
                   <Button variant="outline" className="rounded-xl h-10 gap-2 font-bold whitespace-nowrap">
                      Select Date Range
                   </Button>
                </div>
                <div className="flex items-center gap-6">
                   <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Present</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-destructive"></div>
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Absent</span>
                   </div>
                </div>
            </div>

            <Card className="rounded-2xl border-border/50 shadow-sm overflow-hidden">
               <Table>
                  <TableHeader className="bg-muted/40">
                     <TableRow className="hover:bg-transparent border-border/60">
                        <TableHead className="py-4 pl-6 text-foreground font-bold">Date</TableHead>
                        <TableHead className="text-foreground font-bold">Status</TableHead>
                        <TableHead className="text-right pr-6 text-foreground font-bold">Actions</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {attendance.length > 0 ? (
                        attendance.map((record) => (
                           <TableRow key={record.id} className="border-border/40 hover:bg-muted/20 transition-colors">
                              <TableCell className="py-4 pl-6 font-semibold">{record.date}</TableCell>
                              <TableCell>
                                 <Badge className={
                                    record.status === "Present" 
                                       ? "bg-emerald-500/10 text-emerald-600" 
                                       : "bg-destructive/10 text-destructive"
                                 }>
                                    {record.status}
                                 </Badge>
                              </TableCell>
                              <TableCell className="text-right pr-6">
                                 <Button variant="ghost" size="sm" className="rounded-xl h-8 font-bold text-primary hover:bg-primary/5 px-4" onClick={() => toast.info(`Modifying attendance for ${record.date}`)}>
                                    Edit
                                 </Button>
                              </TableCell>
                           </TableRow>
                        ))
                     ) : (
                        <TableRow>
                           <TableCell colSpan={3} className="h-40 text-center text-muted-foreground">No attendance records found.</TableCell>
                        </TableRow>
                     )}
                  </TableBody>
               </Table>
            </Card>
          </TabsContent>

          {/* 6. PERFORMANCE TAB */}
          <TabsContent value="performance" className="space-y-6 animate-fade-in">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="rounded-2xl border-border/50 shadow-sm p-6 space-y-4">
                   <div className="flex items-center justify-between">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Completion Rate</p>
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                   </div>
                   <div className="space-y-2">
                      <h3 className="text-3xl font-black">{intern.performance.taskCompletionRate}%</h3>
                      <Progress value={intern.performance.taskCompletionRate} className="h-2 rounded-full [&>div]:bg-emerald-500" />
                   </div>
                </Card>
                <Card className="rounded-2xl border-border/50 shadow-sm p-6 space-y-4">
                   <div className="flex items-center justify-between">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Quality Score</p>
                      <Award className="w-5 h-5 text-blue-600" />
                   </div>
                   <div className="space-y-2">
                      <h3 className="text-3xl font-black">{intern.performance.submissionQuality}%</h3>
                      <Progress value={intern.performance.submissionQuality} className="h-2 rounded-full [&>div]:bg-blue-600" />
                   </div>
                </Card>
                <Card className="rounded-2xl border-border/50 shadow-sm p-6 space-y-4">
                   <div className="flex items-center justify-between">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Attendance</p>
                      <UserCheck className="w-5 h-5 text-amber-600" />
                   </div>
                   <div className="space-y-2">
                      <h3 className="text-3xl font-black">{intern.performance.attendanceRate}%</h3>
                      <Progress value={intern.performance.attendanceRate} className="h-2 rounded-full [&>div]:bg-amber-600" />
                   </div>
                </Card>
                <Card className="rounded-2xl border-border/50 shadow-sm p-6 space-y-4">
                   <div className="flex items-center justify-between">
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary font-black">Overall Score</p>
                      <TrendingUp className="w-5 h-5 text-primary" />
                   </div>
                   <div className="space-y-2">
                      <h3 className="text-3xl font-black">{intern.performance.overallScore}/100</h3>
                      <Progress value={intern.performance.overallScore} className="h-2 rounded-full" />
                   </div>
                </Card>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
                {/* Add Rating / Marks */}
                <Card className="rounded-2xl border-border/50 shadow-sm overflow-hidden">
                   <CardHeader className="bg-muted/30 pb-4">
                      <CardTitle className="text-base font-bold text-foreground">Update Rating & Remarks</CardTitle>
                   </CardHeader>
                   <CardContent className="p-6 space-y-6">
                      <div className="space-y-3">
                         <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground pl-1">Performance Rating (1-100)</Label>
                         <Input type="number" defaultValue={intern.performance.overallScore} className="h-11 rounded-xl bg-muted/20 border-border/50 font-bold" />
                      </div>
                      <div className="space-y-3">
                         <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground pl-1">Admin Remarks</Label>
                         <textarea 
                           className="w-full min-h-[150px] rounded-xl bg-muted/20 border border-border/50 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                           placeholder="Add observations, feedback or specific notes about this intern's journey..."
                           defaultValue={intern.performance.remarks || ""}
                         />
                      </div>
                      <Button className="w-full rounded-xl font-bold h-12 shadow-md shadow-primary/20" onClick={() => toast.success("Performance rating updated")}>
                         Save Performance Update
                      </Button>
                   </CardContent>
                </Card>

                {/* Analytical Insights placeholder */}
                <Card className="rounded-2xl border-border/50 shadow-sm flex flex-col items-center justify-center p-10 bg-gradient-to-br from-primary/5 to-blue-50/50 text-center">
                   <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                      <TrendingUp className="w-8 h-8" />
                   </div>
                   <h3 className="text-xl font-black mb-2">Performance Insights</h3>
                   <p className="text-sm text-muted-foreground max-w-sm mb-6 font-medium">Intern is performing <span className="text-emerald-600 font-bold">12% above</span> the batch average. Strong growth in technical aptitude over the last 3 reports.</p>
                   <Button variant="outline" className="rounded-xl font-bold bg-background shadow-sm hover:translate-y-[-2px] transition-transform" onClick={() => toast.info("Insights dashboard expansion coming soon")}>
                      View Comparative Analysis
                   </Button>
                </Card>
             </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminInternDetails;

const Award = ({ className }: { className?: string }) => <TrendingUp className={className} />;
