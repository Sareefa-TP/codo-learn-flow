import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Briefcase
} from "lucide-react";
import { mockMentors } from "@/data/mockMentors";

const AdminMentorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const mentor = mockMentors.find((m) => m.id === id);

  if (!mentor) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
            <Users className="w-8 h-8" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold">Mentor Not Found</h2>
            <p className="text-muted-foreground">The mentor you are looking for does not exist or has been removed.</p>
          </div>
          <Button onClick={() => navigate("/admin/mentors")} variant="outline" className="rounded-xl gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Mentors
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  // Calculate stats
  const totalBatches = mentor.assignedCourses.reduce((acc, curr) => acc + curr.batches.length, 0);
  const totalStudents = mentor.studentProgress.length;
  const sessionCount = mentor.sessions.length;
  const feedbackRating = mentor.performance.rating;

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6 max-w-[1200px] mx-auto pb-10 px-4 md:px-6">
        
        {/* SECTION A: HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full h-10 w-10 shrink-0 border-border/50 bg-white"
              onClick={() => navigate("/admin/mentors")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black tracking-tight text-slate-900">{mentor.name}</h1>
                <Badge className={
                  mentor.status === "Active" 
                    ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                    : "bg-slate-100 text-slate-600 border-slate-200"
                }>
                  {mentor.status}
                </Badge>
              </div>
              <p className="text-slate-500 text-sm font-medium">Academic Mentor Profile</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 space-y-6">
            {/* SECTION B: BASIC INFO */}
            <Card className="rounded-2xl border-none shadow-sm overflow-hidden bg-white">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4">
                <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <div className="p-1.5 bg-indigo-50 rounded-lg"><Users className="w-3.5 h-3.5 text-indigo-600" /></div>
                  Identification Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest pl-0.5 font-sans">Full Name</p>
                  <p className="text-sm font-bold text-slate-900 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">{mentor.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest pl-0.5 font-sans">Email Address</p>
                  <p className="text-sm font-bold text-slate-900 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">{mentor.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest pl-0.5 font-sans">Phone Number</p>
                  <p className="text-sm font-bold text-slate-900 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">{mentor.phone}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest pl-0.5 font-sans">Designation / Role</p>
                  <p className="text-sm font-bold text-slate-900 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">Senior Mentor</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest pl-0.5 font-sans">Joined Date</p>
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-900 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {mentor.joinedDate}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SECTION C: ASSIGNED BATCHES */}
            <Card className="rounded-2xl border-none shadow-sm overflow-hidden bg-white">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4">
                <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <div className="p-1.5 bg-emerald-50 rounded-lg"><BookOpen className="w-3.5 h-3.5 text-emerald-600" /></div>
                  Academic Assignments
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-slate-50/30">
                    <TableRow className="hover:bg-transparent border-slate-100">
                      <TableHead className="px-6 py-4 font-bold text-slate-700">Course Track</TableHead>
                      <TableHead className="px-6 py-4 font-bold text-slate-700">Assigned Batches</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mentor.assignedCourses.length > 0 ? (
                      mentor.assignedCourses.map((track, i) => (
                        <TableRow key={i} className="border-slate-50 hover:bg-slate-50/30 transition-colors">
                          <TableCell className="px-6 py-4 font-black text-slate-900 text-xs uppercase tracking-tight">{track.name}</TableCell>
                          <TableCell className="px-6 py-4">
                            <div className="flex flex-wrap gap-1.5">
                              {track.batches.map((batch, bi) => (
                                <Badge key={bi} variant="secondary" className="bg-primary/5 text-primary border-primary/10 rounded-lg text-[10px] font-bold px-2 py-0.5">
                                  {batch}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2} className="h-24 text-center text-slate-400 italic">No courses currently assigned</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* SECTION D: PERFORMANCE SUMMARY */}
            <Card className="rounded-2xl border-none shadow-sm overflow-hidden bg-white bg-gradient-to-br from-white to-slate-50/50">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4">
                <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <div className="p-1.5 bg-amber-50 rounded-lg"><TrendingUp className="w-3.5 h-3.5 text-amber-600" /></div>
                  Performance Index
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 grid grid-cols-1 gap-4">
                <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Batches</p>
                    <h4 className="text-2xl font-black text-slate-900">{totalBatches}</h4>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                    <BookOpen className="w-5 h-5" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mentored Students</p>
                    <h4 className="text-2xl font-black text-slate-900">{totalStudents}</h4>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 border border-purple-100">
                    <Users className="w-5 h-5" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Service Sessions</p>
                    <h4 className="text-2xl font-black text-slate-900">{sessionCount}</h4>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                    <Clock className="w-5 h-5" />
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center p-6 bg-primary/5 rounded-2xl border-2 border-dashed border-primary/20 mt-2">
                   <div className="flex items-center gap-1.5 mb-2">
                      <Award className="w-5 h-5 text-primary" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary">Feedback Rating</p>
                   </div>
                   <div className="flex items-baseline gap-1">
                      <h3 className="text-4xl font-black text-slate-900">{feedbackRating}</h3>
                      <span className="text-slate-400 font-bold text-lg">/5.0</span>
                   </div>
                   <div className="flex gap-1 mt-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                         <div key={star} className={`w-2 h-2 rounded-full ${star <= feedbackRating ? "bg-primary" : "bg-slate-200"}`} />
                      ))}
                   </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default AdminMentorDetails;
