import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  User,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  Clock,
  BookOpen,
  Trophy,
  FileText,
  CreditCard,
  Target,
  ChevronLeft,
  Edit,
  ArrowUpRight,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Mock Data ---

const studentProfile = {
  id: "S1001",
  name: "Sarah Connor",
  email: "sarah.c@example.com",
  phone: "+1 234 567 890",
  status: "Active",
  joined: "2024-01-15",
  avatar: "SC",
  courses: [
    {
      id: "C1",
      name: "Full Stack Development",
      batch: "FS-JAN-24",
      startDate: "2024-01-20",
      tutor: "Arun Krishnan",
      progress: {
        percentage: 75,
        completed: 12,
        pending: 4
      },
      attendance: {
        total: 40,
        attended: 36,
        missed: 4,
        percentage: 90
      },
      assignments: {
        submitted: 10,
        pending: 2,
        avgScore: 88
      },
      exams: [
        { name: "Frontend Basics", marks: 85, status: "Pass" },
        { name: "Backend Logic", marks: 78, status: "Pass" },
        { name: "Database Design", marks: 92, status: "Pass" }
      ],
      assessments: {
        quizScore: 90,
        remarks: "Excellent logical thinking and technical implementation."
      },
      payments: {
        totalFee: "$1,200",
        paid: "$800",
        pending: "$400",
        history: [
          { date: "2024-01-16", amount: "$400", status: "Paid" },
          { date: "2024-02-15", amount: "$400", status: "Paid" }
        ]
      }
    },
    {
      id: "C2",
      name: "UI/UX Design",
      batch: "UI-FEB-24",
      startDate: "2024-02-05",
      tutor: "Anjali Desai",
      progress: {
        percentage: 30,
        completed: 4,
        pending: 10
      },
      attendance: {
        total: 20,
        attended: 18,
        missed: 2,
        percentage: 90
      },
      assignments: {
        submitted: 3,
        pending: 5,
        avgScore: 82
      },
      exams: [
        { name: "Design Theory", marks: 82, status: "Pass" }
      ],
      assessments: {
        quizScore: 85,
        remarks: "Strong aesthetic sense, needs to focus on user journey mapping."
      },
      payments: {
        totalFee: "$800",
        paid: "$400",
        pending: "$400",
        history: [
          { date: "2024-02-06", amount: "$400", status: "Paid" }
        ]
      }
    }
  ]
};

const DataCard = ({ icon: Icon, title, children }: { icon: any, title: string, children: React.ReactNode }) => (
  <Card className="border-none shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300">
    <CardHeader className="py-4 px-6 border-b border-border/50 bg-muted/5">
      <CardTitle className="text-[11px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
        <Icon className="w-3.5 h-3.5 text-primary" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="p-6">
      {children}
    </CardContent>
  </Card>
);

const StudentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeCourse, setActiveCourse] = useState(studentProfile.courses[0].id);

  const selectedCourse = studentProfile.courses.find(c => c.id === activeCourse) || studentProfile.courses[0];

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6 max-w-[1600px] mx-auto pb-10 px-6">
        
        {/* Header Navigation */}
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/admin/students")}
            className="rounded-xl gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 -ml-4"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Students
          </Button>
          <Button 
            onClick={() => navigate(`/admin/students/edit/${id}`)}
            variant="outline"
            className="rounded-xl gap-2 shadow-sm border-border/50"
          >
            <Edit className="w-4 h-4" /> Edit Profile
          </Button>
        </div>

        {/* Section A: Global Basic Info */}
        <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-24 h-24 rounded-3xl bg-primary flex items-center justify-center font-bold text-3xl text-white shadow-xl shadow-primary/20 shrink-0">
                {studentProfile.avatar}
              </div>
              <div className="flex-1 text-center md:text-left space-y-4">
                <div>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-1">
                    <h1 className="text-3xl font-black text-foreground">{studentProfile.name}</h1>
                    <Badge className="bg-emerald-50 text-emerald-600 font-black text-[10px] uppercase h-5 px-2 rounded-full border-none shadow-none">
                      {studentProfile.status}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground font-medium flex items-center justify-center md:justify-start gap-2 text-sm">
                    Student ID: <span className="text-foreground font-bold">{studentProfile.id}</span>
                  </p>
                </div>
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-8 gap-y-4 pt-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-muted/50 rounded-lg"><Mail className="w-4 h-4 text-primary" /></div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-black text-muted-foreground uppercase opacity-70">Email</p>
                      <p className="text-xs font-bold text-foreground">{studentProfile.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-muted/50 rounded-lg"><Phone className="w-4 h-4 text-primary" /></div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-black text-muted-foreground uppercase opacity-70">Phone</p>
                      <p className="text-xs font-bold text-foreground">{studentProfile.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-muted/50 rounded-lg"><Calendar className="w-4 h-4 text-primary" /></div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-black text-muted-foreground uppercase opacity-70">Join Date</p>
                      <p className="text-xs font-bold text-foreground">{studentProfile.joined}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section B: Course Tabs */}
        <section>
          <Tabs value={activeCourse} onValueChange={setActiveCourse} className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <h2 className="text-lg font-black text-foreground tracking-tight">Active Enrollments</h2>
              <TabsList className="bg-muted/10 p-1 rounded-2xl border border-border/50 h-auto">
                {studentProfile.courses.map((course) => (
                  <TabsTrigger 
                    key={course.id} 
                    value={course.id}
                    className="rounded-xl px-6 py-2.5 text-xs font-black transition-all data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:shadow-black/5"
                  >
                    {course.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* Section C: Selected Course Data */}
            <TabsContent value={activeCourse} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* 1. Course Info */}
                <DataCard title="Course Information" icon={BookOpen}>
                  <div className="space-y-5">
                    <div className="flex items-start gap-4">
                      <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl shrink-0"><BookOpen className="w-4 h-4" /></div>
                      <div>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Batch</p>
                        <p className="text-sm font-bold text-foreground">{selectedCourse.batch}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl shrink-0"><Calendar className="w-4 h-4" /></div>
                      <div>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Start Date</p>
                        <p className="text-sm font-bold text-foreground">{selectedCourse.startDate}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl shrink-0"><User className="w-4 h-4" /></div>
                      <div>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Lead Tutor</p>
                        <p className="text-sm font-bold text-foreground">{selectedCourse.tutor}</p>
                      </div>
                    </div>
                  </div>
                </DataCard>

                {/* 2. Progress */}
                <DataCard title="Course Progress" icon={TrendingUp}>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-end justify-between">
                        <p className="text-2xl font-black text-foreground">{selectedCourse.progress.percentage}%</p>
                        <p className="text-[10px] font-bold text-muted-foreground">OVERALL COMPLETION</p>
                      </div>
                      <Progress value={selectedCourse.progress.percentage} className="h-3 rounded-full bg-muted/20 [&>div]:bg-primary" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-50">
                        <p className="text-xl font-black text-emerald-600">{selectedCourse.progress.completed}</p>
                        <p className="text-[10px] font-black text-emerald-600/80 uppercase">Completed</p>
                      </div>
                      <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-50">
                        <p className="text-xl font-black text-amber-600">{selectedCourse.progress.pending}</p>
                        <p className="text-[10px] font-black text-amber-600/80 uppercase">Pending</p>
                      </div>
                    </div>
                  </div>
                </DataCard>

                {/* 3. Attendance */}
                <DataCard title="Attendance Report" icon={Clock}>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-black text-foreground">{selectedCourse.attendance.percentage}%</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Average Presence</p>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Clock className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold px-2">
                        <span className="text-muted-foreground">Sessions Attended</span>
                        <span className="text-emerald-600">{selectedCourse.attendance.attended} / {selectedCourse.attendance.total}</span>
                      </div>
                      <Progress value={(selectedCourse.attendance.attended / selectedCourse.attendance.total) * 100} className="h-1.5 [&>div]:bg-emerald-500 bg-muted/20" />
                      
                      <div className="flex items-center justify-between text-xs font-bold px-2 mt-2">
                        <span className="text-muted-foreground">Sessions Missed</span>
                        <span className="text-red-500">{selectedCourse.attendance.missed}</span>
                      </div>
                      <Progress value={(selectedCourse.attendance.missed / selectedCourse.attendance.total) * 100} className="h-1.5 [&>div]:bg-red-500 bg-muted/20" />
                    </div>
                  </div>
                </DataCard>

                {/* 4. Assignments */}
                <DataCard title="Assignment Performance" icon={FileText}>
                  <div className="space-y-6">
                    <div className="flex items-end justify-between">
                      <div className="space-y-1">
                        <p className="text-3xl font-black text-foreground">{selectedCourse.assignments.avgScore}</p>
                        <p className="text-[10px] font-black text-muted-foreground uppercase opacity-70">AVERAGE GRADE</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge className="bg-primary/10 text-primary font-black text-[10px] rounded-full px-2.5">
                          TOP 10%
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/20 border border-border/50">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <span className="text-xs font-black text-foreground">Submitted</span>
                        </div>
                        <span className="text-xs font-black text-foreground">{selectedCourse.assignments.submitted}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/20 border border-border/50">
                        <div className="flex items-center gap-3">
                          <Clock className="w-4 h-4 text-amber-500" />
                          <span className="text-xs font-black text-foreground">Pending</span>
                        </div>
                        <span className="text-xs font-black text-foreground">{selectedCourse.assignments.pending}</span>
                      </div>
                    </div>
                  </div>
                </DataCard>

                {/* 5. Exams */}
                <DataCard title="Exam Achievements" icon={Trophy}>
                  <div className="space-y-3">
                    {selectedCourse.exams.map((exam, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-muted/10 border border-border/30 group hover:bg-muted/20 transition-all">
                        <div className="space-y-0.5">
                          <p className="text-xs font-black text-foreground">{exam.name}</p>
                          <p className="text-[10px] font-bold text-muted-foreground">SCORE: {exam.marks}/100</p>
                        </div>
                        <Badge className="bg-emerald-50 text-emerald-600 font-bold text-[9px] rounded-lg border-none shadow-none">
                          {exam.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </DataCard>

                {/* 6. Assessments */}
                <DataCard title="Technical Assessment" icon={Target}>
                  <div className="space-y-6">
                    <div className="p-5 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl border border-primary/10">
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Quiz Accuracy</p>
                      <p className="text-2xl font-black text-foreground">{selectedCourse.assessments.quizScore}%</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-muted-foreground uppercase opacity-70 tracking-widest pl-1">Mentor Remarks</p>
                      <div className="p-4 bg-muted/20 rounded-2xl border border-border/50">
                        <p className="text-xs font-medium text-foreground italic leading-relaxed">
                          "{selectedCourse.assessments.remarks}"
                        </p>
                      </div>
                    </div>
                  </div>
                </DataCard>

                {/* 7. Payments */}
                <DataCard title="Financial Snapshot" icon={CreditCard}>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between px-1">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-muted-foreground uppercase">Total Fees</p>
                        <p className="text-xl font-black text-foreground">{selectedCourse.payments.totalFee}</p>
                      </div>
                      <div className="h-10 w-[1px] bg-border/50" />
                      <div className="space-y-1 text-right">
                        <p className="text-[10px] font-black text-amber-600 uppercase">Outstanding</p>
                        <p className="text-xl font-black text-amber-600">{selectedCourse.payments.pending}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <p className="text-[10px] font-black text-muted-foreground uppercase pl-1">Payment History</p>
                      {selectedCourse.payments.history.map((tx, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50/30 border border-emerald-50 group hover:shadow-sm transition-all">
                          <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-white rounded-lg border border-emerald-100 shadow-sm"><ArrowUpRight className="w-3 h-3 text-emerald-500" /></div>
                            <div className="space-y-0.5">
                              <p className="text-xs font-black text-foreground">{tx.amount}</p>
                              <p className="text-[9px] font-bold text-muted-foreground">{tx.date}</p>
                            </div>
                          </div>
                          <Badge className="bg-white/50 text-emerald-600 text-[9px] font-black h-4 px-1.5 border-emerald-100">
                            {tx.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </DataCard>

              </div>
            </TabsContent>
          </Tabs>
        </section>

      </div>
    </DashboardLayout>
  );
};

export default StudentDetails;
