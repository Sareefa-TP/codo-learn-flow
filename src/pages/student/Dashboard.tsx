import { useMemo, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import {
  Award,
  BookOpen,
  Briefcase,
  Calendar,
  FileText,
  Lock,
  Sparkles,
  Target,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

const MultiSegmentProgress = ({
  student,
  tutor,
  total,
  studentLabel,
  tutorLabel,
}: {
  student: number;
  tutor: number;
  total: number;
  studentLabel: string;
  tutorLabel: string;
}) => {
  const safeTotal = Math.max(total, 1);
  const studentWidth = (student / safeTotal) * 100;
  const tutorOnlyWidth = Math.max(((tutor - student) / safeTotal) * 100, 0);
  const remainingWidth = Math.max(((safeTotal - tutor) / safeTotal) * 100, 0);

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <span className="text-sm font-semibold text-success">
          {studentLabel}: <span className="text-lg font-bold">{student} / {total}</span>
        </span>
        <span className="text-sm font-semibold text-destructive">
          {tutorLabel}: <span className="text-lg font-bold">{tutor} / {total}</span>
        </span>
      </div>
      <div className="flex h-3.5 w-full overflow-hidden rounded-full border border-border/70 bg-muted/40">
        <div
          className="h-full bg-success transition-all duration-500"
          style={{ width: `${studentWidth}%` }}
        />
        <div
          className="h-full bg-destructive/85 transition-all duration-500"
          style={{ width: `${tutorOnlyWidth}%` }}
        />
        <div
          className="h-full bg-muted/70 transition-all duration-500"
          style={{ width: `${remainingWidth}%` }}
        />
      </div>
    </div>
  );
};

type CourseRecord = {
  id: string;
  name: string;
  icon: "dev" | "data" | "design" | "ai";
  cohort: string;
  progress: {
    teacher: { current: number; total: number };
    student: { current: number; total: number };
  };
  assignmentProgress: {
    teacher: { current: number; total: number };
    student: { current: number; total: number };
  };
  attendance: {
    total: number;
    attended: number;
    percentage: number;
  };
  assessments: {
    pre: {
      date: string;
      status: "Passed" | "Average" | "Needs Improvement";
    };
  };
};

const StudentDashboard = () => {
  const navigate = useNavigate();

  // Enhanced mock data for dashboard variety.
  const studentInfo = {
    name: "Sareefa",
    enrolledCourse: "Multi-track Learning Path",
    mentorName: "John Doe",
    walletBalance: 2500,
    activeTracks: 3,
    monthlyStreak: 11,
    todayDate: new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  };

  const upcomingClasses = [
    {
      id: 1,
      title: "Advanced React Patterns & Performance",
      mentor: "John Doe",
      date: "22 April 2026",
      time: "07:00 PM - 08:30 PM",
      link: "https://meet.google.com/xyz-demo-link",
      timestamp: new Date("2026-04-22T19:00:00").getTime(),
      type: "Workshop",
    },
    {
      id: 2,
      title: "Building Scalable APIs with Node.js",
      mentor: "Jane Smith",
      date: "25 April 2026",
      time: "06:00 PM - 07:30 PM",
      link: "https://meet.google.com/abc-demo-link",
      timestamp: new Date("2026-04-25T18:00:00").getTime(),
      type: "Live Coding",
    },
    {
      id: 3,
      title: "Design Critique: Landing Pages",
      mentor: "Nadia Fernandez",
      date: "30 April 2026",
      time: "05:30 PM - 06:30 PM",
      link: "https://meet.google.com/uiux-demo-link",
      timestamp: new Date("2026-04-30T17:30:00").getTime(),
      type: "Review Session",
    },
  ];

  const nearestClass = upcomingClasses
    .filter(cls => cls.timestamp > Date.now())
    .sort((a, b) => a.timestamp - b.timestamp)[0];

  const courses: CourseRecord[] = [
    {
      id: "fsd",
      name: "Full Stack Development",
      icon: "dev",
      cohort: "Cohort A2",
      progress: {
        teacher: { current: 14, total: 20 },
        student: { current: 9, total: 20 },
      },
      assignmentProgress: {
        teacher: { current: 10, total: 12 },
        student: { current: 7, total: 12 },
      },
      attendance: {
        total: 40,
        attended: 32,
        percentage: 80,
      },
      assessments: {
        pre: {
          date: "10 Feb 2026",
          status: "Passed",
        },
      },
    },
    {
      id: "ds",
      name: "Data Science",
      icon: "data",
      cohort: "Cohort B1",
      progress: {
        teacher: { current: 8, total: 20 },
        student: { current: 5, total: 20 },
      },
      assignmentProgress: {
        teacher: { current: 6, total: 10 },
        student: { current: 4, total: 10 },
      },
      attendance: {
        total: 25,
        attended: 18,
        percentage: 72,
      }
      ,
      assessments: {
        pre: {
          date: "10 Feb 2026",
          status: "Average",
        },
      },
    },
    {
      id: "uiux",
      name: "UI/UX Design",
      icon: "design",
      cohort: "Cohort C3",
      progress: {
        teacher: { current: 18, total: 20 },
        student: { current: 12, total: 20 },
      },
      assignmentProgress: {
        teacher: { current: 14, total: 15 },
        student: { current: 11, total: 15 },
      },
      attendance: {
        total: 30,
        attended: 28,
        percentage: 93,
      },
      assessments: {
        pre: {
          date: "11 Feb 2026",
          status: "Passed",
        },
      },
    },
    {
      id: "ai",
      name: "AI Product Engineering",
      icon: "ai",
      cohort: "Cohort X1",
      progress: {
        teacher: { current: 6, total: 16 },
        student: { current: 4, total: 16 },
      },
      assignmentProgress: {
        teacher: { current: 5, total: 8 },
        student: { current: 3, total: 8 },
      },
      attendance: {
        total: 18,
        attended: 13,
        percentage: 78,
      },
      assessments: {
        pre: {
          date: "20 Mar 2026",
          status: "Needs Improvement",
        },
      },
    },
  ];

  const [selectedCourseId, setSelectedCourseId] = useState(courses[0].id);
  const currentCourse = useMemo(
    () => courses.find(c => c.id === selectedCourseId) || courses[0],
    [courses, selectedCourseId],
  );

  const getAttendanceColor = (pct: number) => {
    if (pct >= 90) return "bg-success";
    if (pct >= 75) return "bg-warning";
    return "bg-destructive";
  };

  const getAttendanceLabel = (pct: number) => {
    if (pct >= 90) return "Excellent consistency";
    if (pct >= 75) return "Good standing";
    return "Needs attention";
  };

  const getCourseIcon = (icon: CourseRecord["icon"]) => {
    if (icon === "dev") return <TrendingUp className="h-4 w-4" />;
    if (icon === "data") return <BookOpen className="h-4 w-4" />;
    if (icon === "ai") return <Sparkles className="h-4 w-4" />;
    return <Briefcase className="h-4 w-4" />;
  };

  const getAssessmentBadgeClass = (status: CourseRecord["assessments"]["pre"]["status"]) => {
    if (status === "Passed") return "bg-success/15 text-success";
    if (status === "Average") return "bg-warning/15 text-warning";
    return "bg-destructive/15 text-destructive";
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-6 px-4 pb-10 pt-1 md:px-6 lg:px-8">

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
          <Card className="card-soft animate-fade-in border-primary/20 bg-gradient-to-br from-primary-soft/70 via-background to-secondary/40 xl:col-span-3">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4">
                <div className="space-y-2">
                  <h1 className="text-2xl font-display text-foreground sm:text-3xl">
                    Welcome back, {studentInfo.name} 👋
                  </h1>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm font-medium text-muted-foreground">
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
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-primary-soft text-primary">
                      {studentInfo.activeTracks} Active Tracks
                    </Badge>
                    <Badge variant="secondary" className="bg-accent/15 text-accent-foreground">
                      {studentInfo.monthlyStreak}-Day Consistency Streak
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-soft animate-fade-in [animation-delay:120ms]">
            <CardContent className="flex h-full flex-col justify-between p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">Wallet Balance</span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-soft text-primary">
                    <Wallet className="h-4 w-4" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-foreground">₹{studentInfo.walletBalance}</p>
                </div>
              </div>
              <Button asChild variant="outline" className="mt-5 w-full">
                <Link to="/student/wallet">View Wallet</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-xl font-semibold">
              <Calendar className="w-5 h-5 text-primary" />
              Upcoming Live Class
            </h2>
          </div>
          {nearestClass ? (
            <Card className="animate-fade-in overflow-hidden border-primary/20 bg-primary-soft/40 shadow-soft">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  <div className="p-6 flex-1">
                    <Badge className="mb-3 border-none bg-primary/15 text-primary hover:bg-primary/15">
                      {nearestClass.type}
                    </Badge>
                    <h3 className="font-bold text-xl mb-2">{nearestClass.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 flex items-center gap-1">
                      Mentor: <span className="text-foreground font-semibold">{nearestClass.mentor}</span>
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm font-medium">
                      <span className="flex items-center gap-2 rounded-lg border border-border/70 bg-background/85 px-3 py-1.5 shadow-soft">
                        <Calendar className="w-4 h-4 text-primary" />
                        {nearestClass.date}
                      </span>
                      <span className="flex items-center gap-2 rounded-lg border border-border/70 bg-background/85 px-3 py-1.5 shadow-soft">
                        <FileText className="w-4 h-4 text-primary" />
                        {nearestClass.time}
                      </span>
                    </div>
                  </div>
                  {nearestClass.link && (
                    <div className="flex items-center justify-center border-primary/10 px-6 pb-6 sm:w-48 sm:border-l sm:border-t-0 sm:bg-primary/10 sm:p-0">
                      <Button asChild size="lg" className="mx-6 w-full shadow-soft sm:w-auto">
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
              <CardContent className="flex flex-col items-center gap-3 p-12 text-center text-muted-foreground">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <Calendar className="w-6 h-6" />
                </div>
                <p className="font-medium">No upcoming live class scheduled</p>
              </CardContent>
            </Card>
          )}
        </section>
        
        <div className="rounded-3xl border border-border/70 bg-card/70 p-2 shadow-soft backdrop-blur-sm">
          <div className="grid grid-cols-12 gap-2">
            {courses.map((course) => {
              const isActive = selectedCourseId === course.id;

              return (
                <button
                  key={course.id}
                  onClick={() => setSelectedCourseId(course.id)}
                  className={cn(
                    "group col-span-12 flex items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 text-left transition-all duration-300 sm:col-span-6 xl:col-span-3",
                    isActive 
                      ? "border-primary bg-primary text-primary-foreground shadow-emerald" 
                      : "border-border/70 bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
                  )}
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <div className={cn("shrink-0", isActive ? "text-primary-foreground" : "text-muted-foreground")}>
                      {getCourseIcon(course.icon)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-black uppercase tracking-[0.12em]">{course.name}</p>
                      <p className={cn("mt-0.5 text-[11px]", isActive ? "text-primary-foreground/85" : "text-muted-foreground")}>
                        {course.cohort}
                      </p>
                    </div>
                  </div>
                  <div className={cn(
                    "flex h-6 min-w-[26px] items-center justify-center rounded-full px-2 text-[10px] font-black",
                    isActive ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}>
                    {course.attendance.total}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card className="card-soft overflow-hidden">
            <CardHeader className="bg-muted/20 pb-2">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Course Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 flex-1">
              <MultiSegmentProgress
                student={currentCourse.progress.student.current}
                tutor={currentCourse.progress.teacher.current}
                total={currentCourse.progress.teacher.total}
                studentLabel="Student Completed"
                tutorLabel="Tutor Covered"
              />
            </CardContent>
          </Card>

          <Card className="card-soft overflow-hidden">
            <CardHeader className="bg-muted/20 pb-2">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Assignment Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 flex-1">
              <MultiSegmentProgress
                student={currentCourse.assignmentProgress.student.current}
                tutor={currentCourse.assignmentProgress.teacher.current}
                total={currentCourse.assignmentProgress.teacher.total}
                studentLabel="Student Completed"
                tutorLabel="Tutor Assigned"
              />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 pb-6 lg:grid-cols-2">
          <Card className="card-soft h-full overflow-hidden">
            <CardHeader className="bg-muted/20 pb-2">
              <CardTitle className="text-lg font-bold">Attendance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Classes</p>
                  <p className="text-2xl font-bold">{currentCourse.attendance.total}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Attended</p>
                  <p className="text-2xl font-bold">{currentCourse.attendance.attended}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold">Overall Attendance: {currentCourse.attendance.percentage}%</span>
                </div>
                <div className="h-4 w-full overflow-hidden rounded-full border border-border/70 bg-muted/30">
                  <div
                    className={`h-full transition-all duration-700 ${getAttendanceColor(currentCourse.attendance.percentage)}`}
                    style={{ width: `${currentCourse.attendance.percentage}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-border/70 bg-card/70 p-3 shadow-soft">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Missed Classes</p>
                  <p className="mt-1 text-xl font-bold text-foreground">
                    {Math.max(currentCourse.attendance.total - currentCourse.attendance.attended, 0)}
                  </p>
                </div>
                <div className="rounded-2xl border border-border/70 bg-card/70 p-3 shadow-soft">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Current Streak</p>
                  <p className="mt-1 text-xl font-bold text-foreground">
                    {Math.max(Math.round(currentCourse.attendance.percentage / 10), 1)} classes
                  </p>
                </div>
                <div className="rounded-2xl border border-border/70 bg-card/70 p-3 shadow-soft">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Attendance Status</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {getAttendanceLabel(currentCourse.attendance.percentage)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-soft h-full overflow-hidden">
            <CardHeader className="bg-muted/20 pb-2">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                Assessments
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5 sm:pt-6">
              <div className="grid h-full grid-cols-1 gap-4 xl:grid-cols-2">
                <Card className="h-full border-primary/20 bg-gradient-to-br from-card to-primary-soft/20 shadow-soft transition-all hover:border-primary/35">
                  <CardContent className="flex h-full flex-col p-4 sm:p-5">
                    <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                      <Badge
                        variant="secondary"
                        className={cn("border-none px-3 py-1 text-xs font-semibold", getAssessmentBadgeClass(currentCourse.assessments.pre.status))}
                      >
                        Pre Assessment
                      </Badge>
                      <span className="rounded-md bg-background/80 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                        {currentCourse.assessments.pre.date}
                      </span>
                    </div>
                    <p className="mb-2 text-sm font-medium text-muted-foreground">
                      Status: <span className="font-semibold text-foreground">{currentCourse.assessments.pre.status}</span>
                    </p>
                    <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                      Track benchmark for {currentCourse.name}.
                    </p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mt-auto w-full rounded-xl border border-primary/15 bg-background/80 text-sm font-semibold text-primary hover:bg-primary/5"
                      onClick={() => navigate('/student/assessment-report')}
                    >
                      View Report
                    </Button>
                  </CardContent>
                </Card>

                <Card className="group relative h-full overflow-hidden border-2 border-dashed border-border/70 bg-muted/10">
                  <CardContent className="flex min-h-[160px] flex-col items-center justify-center space-y-2.5 p-4 text-center sm:min-h-[180px]">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted transition-colors group-hover:bg-muted/80">
                      <Lock className="h-4.5 w-4.5 text-muted-foreground" />
                    </div>
                    <h3 className="font-display text-xl text-foreground sm:text-2xl">Post Assessment</h3>
                    <p className="max-w-[16rem] text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground sm:text-xs">
                      Complete the course to unlock post assessment
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="card-soft">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-xl bg-primary-soft p-2 text-primary">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.1em] text-muted-foreground">Current Focus</p>
                <p className="text-sm font-semibold">{currentCourse.name} - Weekly Sprint</p>
              </div>
            </CardContent>
          </Card>
          <Card className="card-soft">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-xl bg-success/15 p-2 text-success">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.1em] text-muted-foreground">Upcoming Sessions</p>
                <p className="text-sm font-semibold">{upcomingClasses.length} scheduled this week</p>
              </div>
            </CardContent>
          </Card>
          <Card className="card-soft">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-xl bg-accent/15 p-2 text-accent-foreground">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.1em] text-muted-foreground">Momentum</p>
                <p className="text-sm font-semibold">Consistency improving across tracks</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
