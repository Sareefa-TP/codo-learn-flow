import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
  Mail,
  Phone,
  Calendar,
  Users,
  BookOpen,
  Award,
  TrendingUp,
  Clock,
  ExternalLink,
  Edit2
} from "lucide-react";
import { mockMentors } from "@/data/mockMentors";

const AdminMentorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const mentor = mockMentors.find((m) => m.id === id);

  if (!mentor) {
    return (
      <DashboardLayout>
        <div className="p-6 text-center">
          <h2 className="text-xl font-semibold">Mentor not found</h2>
          <Button onClick={() => navigate("/admin/mentor")} className="mt-4">
            Back to Mentors
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 bg-slate-50/50 min-h-screen">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/admin/mentor")}
            className="w-fit -ml-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Mentors
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold border border-primary/20 shadow-sm">
                {mentor.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{mentor.name}</h1>
                <div className="flex flex-wrap gap-3 mt-1">
                  <span className="flex items-center text-sm text-slate-500"><Mail className="w-3.5 h-3.5 mr-1.5" /> {mentor.email}</span>
                  <span className="flex items-center text-sm text-slate-500"><Phone className="w-3.5 h-3.5 mr-1.5" /> {mentor.phone}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={mentor.status === "Active" ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-100" : "bg-slate-100 text-slate-600"}>
                {mentor.status}
              </Badge>
              <Button 
                variant="outline" 
                className="rounded-xl border-slate-200"
                onClick={() => navigate(`/admin/mentor/edit/${mentor.id}`)}
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-none shadow-sm rounded-2xl bg-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{mentor.assignedCourses.length}</p>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Courses</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm rounded-2xl bg-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{mentor.studentProgress.length}</p>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Students</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm rounded-2xl bg-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{mentor.performance.studentSatisfaction}%</p>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Satisfaction</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm rounded-2xl bg-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{mentor.performance.sessionAttendance}%</p>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Attendance</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white p-1 rounded-xl shadow-sm border border-slate-100 overflow-x-auto inline-flex whitespace-nowrap">
            <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white px-6">Overview</TabsTrigger>
            <TabsTrigger value="students" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white px-6">Students & Progress</TabsTrigger>
            <TabsTrigger value="sessions" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white px-6">Session History</TabsTrigger>
            <TabsTrigger value="performance" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white px-6">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Assigned Batches */}
              <Card className="border-none shadow-sm rounded-2xl bg-white">
                <CardHeader className="border-b border-slate-50">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    Current Assignments
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="px-6">Course</TableHead>
                        <TableHead className="px-6">Batches</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mentor.assignedCourses.map((c, i) => (
                        <TableRow key={i} className="hover:bg-slate-50/30">
                          <TableCell className="px-6 font-medium text-slate-900">{c.courseName}</TableCell>
                          <TableCell className="px-6">
                            <div className="flex flex-wrap gap-1">
                              {c.batches.map((b, bi) => (
                                <Badge key={bi} variant="secondary" className="bg-slate-100 text-slate-700 border-none rounded-md px-2 py-0">
                                  {b}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Performance Summary */}
              <Card className="border-none shadow-sm rounded-2xl bg-white">
                <CardHeader className="border-b border-slate-50">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Performance Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-600 font-medium whitespace-nowrap">Average Student Progress</span>
                      <span className="text-slate-900 font-bold">{mentor.performance.averageStudentProgress}%</span>
                    </div>
                    <Progress value={mentor.performance.averageStudentProgress} className="h-2 rounded-full" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-600 font-medium whitespace-nowrap">Review Session Completion</span>
                      <span className="text-slate-900 font-bold">{mentor.performance.sessionAttendance}%</span>
                    </div>
                    <Progress value={mentor.performance.sessionAttendance} className="h-2 rounded-full bg-slate-100 shadow-inner overflow-hidden" />
                  </div>
                  <div className="pt-4 grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-2xl text-center">
                      <p className="text-2xl font-bold text-slate-900">{mentor.performance.studentSatisfaction}/100</p>
                      <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-widest whitespace-nowrap overflow-hidden text-ellipsis">Satisfaction Index</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl text-center">
                      <p className="text-2xl font-bold text-slate-900">{mentor.sessions.length}</p>
                      <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-widest whitespace-nowrap overflow-hidden text-ellipsis">Total Sessions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50 border-b border-slate-100">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="py-4 px-6 font-semibold text-slate-700">Student Name</TableHead>
                      <TableHead className="py-4 px-6 font-semibold text-slate-700">Batch</TableHead>
                      <TableHead className="py-4 px-6 font-semibold text-slate-700">Attendance</TableHead>
                      <TableHead className="py-4 px-6 font-semibold text-slate-700">Assignments</TableHead>
                      <TableHead className="py-4 px-6 font-semibold text-slate-700">Progress</TableHead>
                      <TableHead className="py-4 px-6 font-semibold text-slate-700 text-right">Last Activity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mentor.studentProgress.map((student) => (
                      <TableRow key={student.id} className="hover:bg-slate-50/50 border-b border-slate-50">
                        <TableCell className="py-4 px-6 font-medium text-slate-900">{student.name}</TableCell>
                        <TableCell className="py-4 px-6 text-slate-600">{student.batch}</TableCell>
                        <TableCell className="py-4 px-6 text-slate-600">{student.attendanceRate}%</TableCell>
                        <TableCell className="py-4 px-6 text-slate-600">{student.assignmentCompletion}%</TableCell>
                        <TableCell className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden min-w-[60px]">
                              <div 
                                className={`h-full rounded-full ${
                                  student.overallProgress > 80 ? "bg-emerald-500" : student.overallProgress > 50 ? "bg-amber-500" : "bg-rose-500"
                                }`} 
                                style={{ width: `${student.overallProgress}%` }} 
                              />
                            </div>
                            <span className="text-xs font-bold text-slate-700">{student.overallProgress}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-6 text-right text-xs text-slate-500">2 days ago</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="sessions" className="space-y-6">
            <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50 border-b border-slate-100">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="py-4 px-6 font-semibold text-slate-700">Session Name</TableHead>
                      <TableHead className="py-4 px-6 font-semibold text-slate-700">Date & Time</TableHead>
                      <TableHead className="py-4 px-6 font-semibold text-slate-700">Batch</TableHead>
                      <TableHead className="py-4 px-6 font-semibold text-slate-700">Duration</TableHead>
                      <TableHead className="py-4 px-6 font-semibold text-slate-700">Status</TableHead>
                      <TableHead className="py-4 px-6 font-semibold text-slate-700 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mentor.sessions.map((session) => (
                      <TableRow key={session.id} className="hover:bg-slate-50/50 border-b border-slate-50">
                        <TableCell className="py-4 px-6 font-medium text-slate-900">{session.title}</TableCell>
                        <TableCell className="py-4 px-6">
                          <div className="flex flex-col">
                            <span className="text-slate-900">{session.date}</span>
                            <span className="text-xs text-slate-500">{session.time}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-6 text-slate-600 font-medium">{session.batch}</TableCell>
                        <TableCell className="py-4 px-6 text-slate-600 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {session.duration}</TableCell>
                        <TableCell className="py-4 px-6">
                          <Badge className={`rounded-lg px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            session.status === "Completed" 
                              ? "bg-slate-100 text-slate-600" 
                              : session.status === "Upcoming" 
                              ? "bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-100" 
                              : "bg-emerald-50 text-emerald-700"
                          }`}>
                            {session.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4 px-6 text-right">
                          <Button variant="ghost" size="sm" className="h-8 rounded-lg hover:bg-slate-100 text-primary">
                            <ExternalLink className="w-4 h-4 mr-1.5" /> Session Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-none shadow-sm rounded-2xl bg-white p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <Badge className="bg-emerald-50 text-emerald-700 border-none rounded-md px-2 py-0.5 text-[10px]">EXCELLENT</Badge>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-color-primary flex items-center gap-2 mb-2 p-1.5 rounded-lg border-primary/10">Teaching Quality</h4>
                  <p className="text-3xl font-bold text-slate-900">4.8<span className="text-slate-400 text-base font-medium ml-1">/5.0</span></p>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">Based on student feedback and review session audits conducted by administrators.</p>
                </div>
              </Card>

              <Card className="border-none shadow-sm rounded-2xl bg-white p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <Badge className="bg-blue-50 text-blue-700 border-none rounded-md px-2 py-0.5 text-[10px]">ON TRACK</Badge>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-color-primary flex items-center gap-2 mb-2 p-1.5 rounded-lg border-primary/10">Punctuality</h4>
                  <p className="text-3xl font-bold text-slate-900">96<span className="text-slate-400 text-base font-medium ml-1">%</span></p>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">System-tracked attendance and start time consistency for all scheduled mentor sessions.</p>
                </div>
              </Card>

              <Card className="border-none shadow-sm rounded-2xl bg-white p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
                    <Users className="w-6 h-6" />
                  </div>
                  <Badge className="bg-purple-50 text-purple-700 border-none rounded-md px-2 py-0.5 text-[10px]">IMPROVING</Badge>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-color-primary flex items-center gap-2 mb-2 p-1.5 rounded-lg border-primary/10">Response Time</h4>
                  <p className="text-3xl font-bold text-slate-900">2.4<span className="text-slate-400 text-base font-medium ml-1">hrs</span></p>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">Average time taken to respond to student queries and evaluation requests in the system.</p>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminMentorDetails;
