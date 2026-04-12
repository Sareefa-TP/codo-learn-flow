import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Users, 
  Calendar, 
  Clock, 
  BookOpen, 
  UserCircle2, 
  Layers, 
  CheckCircle2, 
  BarChart3, 
  ArrowLeft, 
  Video,
  Trophy,
  AlertCircle,
  GraduationCap,
  TrendingUp
} from "lucide-react";
import { SHARED_BATCHES, Batch } from "@/data/batchData";
import { courses } from "@/data/courseData";
import { mockTutors } from "@/data/mockTutors";
import { mockMentors } from "@/data/mockMentors";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useRole } from "@/hooks/useRole";

const BatchDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useRole();
  const basePath = `/${role}/batches`;
  
  const [activeTab, setActiveTab] = useState("overview");

  const batch = SHARED_BATCHES.find((b) => b.id === id);
  const course = courses.find((c) => c.id === batch?.courseId);
  const tutor = mockTutors.find((t) => t.id === batch?.tutorId);
  const mentor = mockMentors.find((m) => m.id === batch?.mentorId);

  // Mock student list based on batch studentIds
  const enrolledStudents = (batch?.studentIds || []).map(sid => ({
    id: sid,
    name: `Student ${sid}`,
    email: `${sid.toLowerCase()}@example.com`,
    progress: Math.floor(Math.random() * 60) + 40,
    attendance: Math.floor(Math.random() * 20) + 80,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${sid}`
  }));

  if (!batch) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[80vh] space-y-6">
          <div className="p-6 bg-slate-50 rounded-full animate-bounce"><AlertCircle className="w-12 h-12 text-slate-300" /></div>
          <div className="text-center">
             <h2 className="text-2xl font-black text-slate-900 mb-2">Batch Not Found</h2>
             <p className="text-slate-500 font-medium">The batch you're looking for doesn't exist or has been removed.</p>
          </div>
          <Button onClick={() => navigate(basePath)} variant="outline" className="rounded-2xl gap-2 font-bold px-8">
            <ArrowLeft className="w-4 h-4" /> Back to List
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
        {/* Header Navigation */}
        <div className="flex items-center justify-between">
          <Button 
            onClick={() => navigate(basePath)}
            variant="ghost" 
            className="group rounded-full pl-2 pr-6 hover:bg-white text-slate-500 hover:text-slate-900 transition-all gap-2 font-bold"
          >
            <div className="p-1 bg-slate-100 rounded-full group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </div>
            Back to Batches
          </Button>
          <div className="flex items-center gap-3">
             <Button variant="outline" className="rounded-2xl border-slate-200 font-bold px-6" onClick={() => navigate(`${basePath}/${id}/edit`)}>Edit Batch</Button>
             <Button className="rounded-2xl bg-primary text-white shadow-lg shadow-primary/20 font-bold px-6">Generate Report</Button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent rounded-3xl opacity-50 blur-3xl" />
          <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-6 p-8 bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-200/50">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <Badge className="bg-primary/10 text-primary border-none font-black text-[10px] uppercase tracking-widest px-3 h-6">{batch.batchCode}</Badge>
                 <Badge className="bg-emerald-50 text-emerald-700 border-none font-black text-[10px] uppercase tracking-widest px-3 h-6">{batch.status}</Badge>
              </div>
              <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">{batch.name}</h1>
                <p className="text-slate-500 font-bold flex items-center gap-2 italic uppercase text-xs tracking-tight mt-1">
                  <BookOpen className="w-4 h-4 text-slate-400" />
                  Program: <span className="text-primary not-italic text-sm">{batch.courseName}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
               <div className="flex flex-col">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Batch Schedule</p>
                  <div className="flex items-center gap-3 font-black text-slate-700 text-sm">
                     <Calendar className="w-4 h-4 text-primary" />
                     {new Date(batch.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* TABS Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="bg-white p-1.5 rounded-3xl border border-slate-100 shadow-sm flex items-center mb-8 inline-block overflow-x-auto w-full md:w-auto custom-scrollbar">
            <TabsList className="bg-transparent border-none p-0 flex gap-1">
              {[
                { id: "overview", label: "Overview", icon: Layers },
                { id: "students", label: "Students", icon: Users },
                { id: "staff", label: "Tutor & Mentor", icon: UserCircle2 },
                { id: "sessions", label: "Live Sessions", icon: Video },
                { id: "attendance", label: "Attendance", icon: BarChart3 },
                { id: "performance", label: "Performance", icon: Trophy }
              ].map(tab => (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id}
                  className="rounded-2xl px-6 py-2.5 font-bold text-sm data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 transition-all flex items-center gap-2 h-11"
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-gradient-to-br from-white to-primary/[0.02]">
                    <CardContent className="p-8 space-y-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-3xl font-black text-slate-900 tracking-tight">{batch.studentIds.length}</h4>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest text-[10px]">Total Enrolled Students</p>
                      </div>
                      <Progress value={85} className="h-2 rounded-full bg-slate-100" />
                      <p className="text-[10px] font-bold text-slate-400">Steady enrollment health</p>
                    </CardContent>
                  </Card>
                  <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white">
                    <CardContent className="p-8 space-y-4">
                      <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="text-3xl font-black text-slate-900 tracking-tight">{batch.progress}%</h4>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest text-[10px]">Overall Progress</p>
                      </div>
                      <Progress value={batch.progress} className="h-2 rounded-full bg-slate-100" />
                      <p className="text-[10px] font-bold text-slate-400 italic">Moving as per timeline</p>
                    </CardContent>
                  </Card>
                </div>

                <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white">
                  <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4">
                    <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2 italic">
                      Batch Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <p className="text-slate-600 font-medium leading-relaxed italic">
                      {batch.notes || "No additional notes provided for this batch execution."}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-8">
                <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white">
                  <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4">
                    <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-500 italic">Quick Details</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                      <span className="text-xs font-black text-slate-400 uppercase">Duration</span>
                      <span className="text-sm font-black text-slate-900">{batch.duration}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                      <span className="text-xs font-black text-slate-400 uppercase">Tutor</span>
                      <span className="text-sm font-black text-slate-900">{tutor?.name || "Unassigned"}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                      <span className="text-xs font-black text-slate-400 uppercase">Mentor</span>
                      <span className="text-sm font-black text-slate-900">{mentor?.name || "Unassigned"}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* STUDENTS TAB */}
          <TabsContent value="students">
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white p-4 rounded-3xl border border-slate-100 shadow-sm pr-6">
                <div className="flex items-center gap-4 pl-4">
                  <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600"><Users className="w-5 h-5" /></div>
                  <div>
                    <p className="text-sm font-black text-slate-900">Enrolled Students</p>
                    <p className="text-xs font-bold text-slate-400 italic">Managing {enrolledStudents.length} Students</p>
                  </div>
                </div>
                <Button variant="outline" className="rounded-2xl gap-2 font-bold bg-white text-primary border-primary/20">
                  <CheckCircle2 className="w-4 h-4" /> Manage Students
                </Button>
              </div>

              <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-50">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow className="hover:bg-transparent border-slate-100">
                      <TableHead className="font-black text-[11px] uppercase tracking-widest text-slate-500 pl-8 h-14">Student</TableHead>
                      <TableHead className="font-black text-[11px] uppercase tracking-widest text-slate-500 h-14">Attendance</TableHead>
                      <TableHead className="font-black text-[11px] uppercase tracking-widest text-slate-500 h-14 text-right pr-8">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {enrolledStudents.map((s) => (
                      <TableRow key={s.id} className="hover:bg-slate-50/50 transition-all border-slate-50 group">
                        <TableCell className="pl-8 py-4">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-2 ring-primary/10">
                              <AvatarImage src={s.avatar} />
                              <AvatarFallback>{s.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="font-black text-slate-800 text-sm">{s.name}</span>
                              <span className="text-[10px] font-bold text-slate-400 uppercase">{s.email}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn(
                            "rounded-full px-2.5 h-6 font-black text-[10px] uppercase",
                            s.attendance > 90 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                          )}>
                            {s.attendance}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right pr-8">
                          <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-rose-50 hover:text-rose-600 rounded-lg">
                            <Trash2 className="w-4 h-4 text-rose-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          {/* STAFF TAB */}
          <TabsContent value="staff">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-none shadow-2xl rounded-3xl overflow-hidden bg-white">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-50 rounded-2xl"><UserCircle2 className="w-6 h-6 text-emerald-600" /></div>
                    <CardTitle className="text-xl font-black text-slate-900">Lead Tutor</CardTitle>
                  </div>
                  <Button variant="outline" className="rounded-xl font-bold bg-white h-9 border-slate-200">Reassign</Button>
                </CardHeader>
                <CardContent className="p-8 pt-10 text-center space-y-4">
                  <Avatar className="h-28 w-28 ring-8 ring-emerald-50 shadow-2xl mx-auto">
                    <AvatarImage src={tutor?.avatar} />
                    <AvatarFallback className="bg-slate-100 font-black text-2xl">{tutor?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">{tutor?.name || "Unassigned"}</h3>
                    <p className="text-sm font-bold text-primary italic">@{tutor?.email.split('@')[0] || "staff"}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-2xl rounded-3xl overflow-hidden bg-white">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-50 rounded-2xl"><GraduationCap className="w-6 h-6 text-indigo-600" /></div>
                    <CardTitle className="text-xl font-black text-slate-900">Assigned Mentor</CardTitle>
                  </div>
                  <Button variant="outline" className="rounded-xl font-bold bg-white h-9 border-slate-200">Reassign</Button>
                </CardHeader>
                <CardContent className="p-8 pt-10 text-center space-y-4">
                  <Avatar className="h-28 w-28 ring-8 ring-indigo-50 shadow-2xl mx-auto">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${mentor?.name}`} />
                    <AvatarFallback className="bg-slate-100 font-black text-2xl">{mentor?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">{mentor?.name || "Unassigned"}</h3>
                    <p className="text-sm font-bold text-indigo-600 italic">@{mentor?.email.split('@')[0] || "staff"}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* SESSIONS TAB */}
          <TabsContent value="sessions">
            <div className="space-y-8">
              {course?.modules.map((module, mIdx) => (
                <div key={module.id} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center font-black text-[10px]">
                      {mIdx + 1}
                    </div>
                    <h3 className="text-xl font-black text-slate-800">{module.name}</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-11">
                    {module.sessions.map((session) => (
                      <Card key={session.id} className="border-none shadow-xl rounded-3xl overflow-hidden bg-white p-6 flex justify-between items-center group hover:shadow-2xl transition-all">
                        <div className="space-y-1">
                          <h4 className="font-black text-slate-800">{session.name}</h4>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Live session scheduled
                          </span>
                        </div>
                        <Button className="rounded-xl bg-primary text-white h-10 px-4 font-bold shadow-lg shadow-primary/20">Join Meet</Button>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* ATTENDANCE TAB */}
          <TabsContent value="attendance">
            <Card className="border-none shadow-2xl rounded-3xl overflow-hidden bg-white">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8 flex flex-row items-center justify-between">
                <CardTitle className="text-2xl font-black text-slate-900">Attendance Log</CardTitle>
                <Button className="rounded-xl bg-white text-indigo-600 border border-indigo-100 hover:bg-indigo-50 font-bold px-6">Export Logs</Button>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-slate-100/50">
                    <TableRow className="hover:bg-transparent border-slate-100">
                      <TableHead className="font-black text-[11px] uppercase tracking-widest text-slate-600 pl-8 h-14">Student Name</TableHead>
                      <TableHead className="font-black text-[11px] uppercase tracking-widest text-slate-600 h-14">Last Session</TableHead>
                      <TableHead className="font-black text-[11px] uppercase tracking-widest text-slate-600 h-14 text-right pr-8">Avg Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {enrolledStudents.map((s) => (
                      <TableRow key={s.id} className="hover:bg-slate-50 transition-all border-slate-50">
                        <TableCell className="pl-8 py-4 font-bold text-slate-800">{s.name}</TableCell>
                        <TableCell>
                          <Badge className="bg-emerald-50 text-emerald-700 border-none font-black text-[8px] uppercase px-1.5 h-5">Present</Badge>
                        </TableCell>
                        <TableCell className="text-right pr-8">
                           <span className={cn("text-xs font-black", s.attendance > 90 ? "text-emerald-600" : "text-amber-500")}>
                                 {s.attendance}%
                            </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PERFORMANCE TAB */}
          <TabsContent value="performance">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="border-none shadow-2xl rounded-3xl overflow-hidden bg-white">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
                  <CardTitle className="text-2xl font-black text-slate-900">Task Completion</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow className="hover:bg-transparent border-slate-100">
                        <TableHead className="font-black text-[11px] uppercase tracking-widest text-slate-500 pl-8 h-14">Student</TableHead>
                        <TableHead className="font-black text-[11px] uppercase tracking-widest text-slate-500 h-14 text-right pr-8">Grade</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {enrolledStudents.map((s) => (
                        <TableRow key={s.id} className="hover:bg-slate-50/50 transition-colors border-slate-50">
                          <TableCell className="pl-8 py-4 font-bold text-slate-700">{s.name}</TableCell>
                          <TableCell className="text-right pr-8 italic font-black text-primary">A+</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card className="border-none shadow-2xl rounded-3xl overflow-hidden bg-slate-900 p-8 text-white">
                <div className="space-y-4">
                  <div className="p-3 bg-white/10 w-fit rounded-2xl">
                    <TrendingUp className="w-6 h-6 text-amber-400" />
                  </div>
                  <h4 className="text-xl font-black tracking-tight italic">Batch Performance Analytics</h4>
                  <p className="text-slate-400 text-sm leading-relaxed italic">
                    The overall batch performance is at 92.4%, which is 8% higher than the previous cohort.
                  </p>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </DashboardLayout>
  );
};

export default BatchDetails;
