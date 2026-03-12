import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Calendar,
  FileText,
  CreditCard,
  Award,
  Lock,
  Wallet
} from "lucide-react";

const MultiSegmentProgress = ({
  student,
  tutor,
  total,
  studentLabel,
  tutorLabel
}: {
  student: number;
  tutor: number;
  total: number;
  studentLabel: string;
  tutorLabel: string;
}) => {
  const studentWidth = (student / total) * 100;
  const tutorOnlyWidth = ((tutor - student) / total) * 100;
  const remainingWidth = ((total - tutor) / total) * 100;

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-1">
        <span className="text-sm font-semibold text-green-600">
          {studentLabel}: <span className="text-lg font-bold">{student} / {total}</span>
        </span>
        <span className="text-sm font-semibold text-red-500">
          {tutorLabel}: <span className="text-lg font-bold">{tutor} / {total}</span>
        </span>
      </div>
      <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden flex">
        <div
          className="h-full bg-green-500 transition-all duration-500"
          style={{ width: `${studentWidth}%` }}
        />
        <div
          className="h-full bg-red-500 transition-all duration-500"
          style={{ width: `${tutorOnlyWidth}%` }}
        />
        <div
          className="h-full bg-slate-200 transition-all duration-500"
          style={{ width: `${remainingWidth}%` }}
        />
      </div>
    </div>
  );
};

const StudentDashboard = () => {
  // Mock data for student dashboard
  const studentInfo = {
    name: "Sareefa",
    enrolledCourse: "Full Stack Development",
    mentorName: "John Doe",
    walletBalance: 2500,
    todayDate: new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  };

  const upcomingClasses = [
    {
      id: 1,
      title: "React State Management & Context API",
      mentor: "John Doe",
      date: "25 March 2026",
      time: "07:00 PM - 08:30 PM",
      link: "https://meet.google.com/xyz-demo-link",
      timestamp: new Date("2026-03-25T19:00:00").getTime(),
    },
    {
      id: 2,
      title: "Introduction to Node.js & Express",
      mentor: "Jane Smith",
      date: "28 March 2026",
      time: "06:00 PM - 07:30 PM",
      link: "https://meet.google.com/abc-demo-link",
      timestamp: new Date("2026-03-28T18:00:00").getTime(),
    },
  ];

  // Get only the nearest upcoming class
  const nearestClass = upcomingClasses
    .filter(cls => cls.timestamp > Date.now())
    .sort((a, b) => a.timestamp - b.timestamp)[0];

  const progressData = {
    course: {
      teacher: { current: 14, total: 20 },
      student: { current: 9, total: 20 },
    },
    assignments: {
      teacher: { current: 10, total: 12 },
      student: { current: 7, total: 12 },
    },
    attendance: {
      total: 40,
      attended: 32,
      percentage: 80,
    },
  };

  const assessments = {
    pre: {
      score: "85%",
      date: "10 Feb 2026",
      status: "Completed",
    },
    post: {
      isAvailable: false, // Course not completed yet
      score: "-",
      date: "-",
      status: "Available after course completion",
    },
  };

  // Helper to get attendance color
  const getAttendanceColor = (pct: number) => {
    if (pct >= 90) return "bg-green-500";
    if (pct >= 75) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6 lg:space-y-8">

        {/* 1 & 2. Welcome & Wallet Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Welcome Section */}
          <Card className="lg:col-span-3 border-none shadow-sm bg-gradient-to-br from-primary/10 via-primary/5 to-background">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Welcome back, {studentInfo.name} 👋
                  </h1>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground font-medium">
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-primary" />
                      {studentInfo.enrolledCourse}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-primary" />
                      Mentor: {studentInfo.mentorName}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-primary" />
                      {studentInfo.todayDate}
                    </span>
                  </div>
                </div>
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 shadow-md group">
                  <Link to="/student/my-course">
                    Continue Learning
                    <BookOpen className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Wallet Balance Card */}
          <Card className="border-none shadow-sm bg-card hover:shadow-md transition-shadow border-primary/5 border">
            <CardContent className="p-6 flex flex-col justify-between h-full">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Wallet Balance</span>
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Wallet className="w-4 h-4" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-foreground">₹{studentInfo.walletBalance}</p>
                </div>
              </div>
              <Button asChild variant="outline" className="mt-4 w-full border-primary/20 hover:bg-primary/5 hover:text-primary transition-colors">
                <Link to="/student/wallet">View Wallet</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 3. Upcoming Live Class Section (Full Width) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Upcoming Live Class
            </h2>
          </div>
          {nearestClass ? (
            <Card className="overflow-hidden border-primary/20 bg-primary/5 hover:border-primary/40 transition-all shadow-md">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  <div className="p-6 flex-1">
                    <Badge className="mb-3 bg-primary/20 text-primary border-none hover:bg-primary/20">Nearest Session</Badge>
                    <h3 className="font-bold text-xl mb-2">{nearestClass.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 flex items-center gap-1">
                      Mentor: <span className="text-foreground font-semibold">{nearestClass.mentor}</span>
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm font-medium">
                      <span className="bg-background/80 px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-sm border border-primary/5">
                        <Calendar className="w-4 h-4 text-primary" />
                        {nearestClass.date}
                      </span>
                      <span className="bg-background/80 px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-sm border border-primary/5">
                        <FileText className="w-4 h-4 text-primary" />
                        {nearestClass.time}
                      </span>
                    </div>
                  </div>
                  {nearestClass.link && (
                    <div className="px-6 pb-6 sm:p-0 sm:w-48 flex items-center justify-center sm:bg-primary/10 border-t sm:border-t-0 sm:border-l border-primary/10">
                      <Button asChild size="lg" className="w-full sm:w-auto mx-6 shadow-lg hover:scale-105 transition-transform">
                        <a href={nearestClass.link} target="_blank" rel="noopener noreferrer">
                          Join Class
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed bg-muted/20">
              <CardContent className="p-12 text-center text-muted-foreground flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <Calendar className="w-6 h-6" />
                </div>
                <p className="font-medium">No upcoming live class scheduled</p>
              </CardContent>
            </Card>
          )}
        </section>

        {/* 4 & 5. Progress Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 4. Course Progress */}
          <Card className="border-primary/10 shadow-sm overflow-hidden flex flex-col">
            <CardHeader className="pb-2 bg-slate-50/50">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Course Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 flex-1">
              <MultiSegmentProgress
                student={progressData.course.student.current}
                tutor={progressData.course.teacher.current}
                total={progressData.course.teacher.total}
                studentLabel="Student Completed"
                tutorLabel="Tutor Covered"
              />
            </CardContent>
          </Card>

          {/* 5. Assignment Progress */}
          <Card className="border-primary/10 shadow-sm overflow-hidden flex flex-col">
            <CardHeader className="pb-2 bg-slate-50/50">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Assignment Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 flex-1">
              <MultiSegmentProgress
                student={progressData.assignments.student.current}
                tutor={progressData.assignments.teacher.current}
                total={progressData.assignments.teacher.total}
                studentLabel="Student Completed"
                tutorLabel="Tutor Assigned"
              />
            </CardContent>
          </Card>
        </div>

        {/* 6 & 7. Attendance & Assessments Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
          {/* 6. Attendance */}
          <Card className="border-primary/10 shadow-sm overflow-hidden h-full">
            <CardHeader className="pb-2 bg-slate-50/50">
              <CardTitle className="text-lg font-bold">Attendance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Classes</p>
                  <p className="text-2xl font-bold">{progressData.attendance.total}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Attended</p>
                  <p className="text-2xl font-bold">{progressData.attendance.attended}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold">Overall Attendance: {progressData.attendance.percentage}%</span>
                </div>
                <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className={`h-full transition-all duration-700 ${getAttendanceColor(progressData.attendance.percentage)}`}
                    style={{ width: `${progressData.attendance.percentage}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 7. Assessments */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Assessments
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Pre Assessment */}
              <Card className="border-primary/10 hover:border-primary/30 transition-colors shadow-sm">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-700 border-none">Pre Assessment</Badge>
                    <span className="text-xs text-muted-foreground font-medium">{assessments.pre.date}</span>
                  </div>
                  <h3 className="font-bold text-lg mb-1">{assessments.pre.score}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{assessments.pre.status}</p>
                  <Button variant="ghost" size="sm" className="w-full text-xs font-bold text-primary hover:bg-primary/5">View Report</Button>
                </CardContent>
              </Card>

              {/* Post Assessment */}
              <Card className="border-dashed border-2 bg-muted/5 opacity-80 relative overflow-hidden group">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center min-h-[140px] space-y-2">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-muted/80 transition-colors">
                    <Lock className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <h3 className="font-bold text-sm">Post Assessment</h3>
                  <p className="text-[10px] text-muted-foreground leading-tight px-4 font-medium uppercase tracking-tight">
                    Complete the course to unlock Post Assessment
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
