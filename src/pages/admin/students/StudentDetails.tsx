import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  User,
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
  TrendingUp,
  GraduationCap,
  Percent,
  Wallet,
  ListChecks,
  XCircle,
  LayoutGrid
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Mock Data ---

const STUDENTS_STORAGE_KEY = "students";

type StoredStudent = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "Active" | "Blocked" | "Completed";
  joined: string;
  courses: string[];
  batch: string;
  enrolledCourses?: { courseName: string; batch: string }[];
};

function readStoredStudents(): StoredStudent[] {
  try {
    const raw = localStorage.getItem(STUDENTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as StoredStudent[];
  } catch {
    return [];
  }
}

const baseStudents = [
  { id: "S1001", name: "Sarah Connor", email: "sarah.c@example.com", phone: "+1 234 567 890", status: "Active", joined: "2024-01-15" },
  { id: "S1002", name: "John Smith", email: "john.s@example.com", phone: "+1 234 567 891", status: "Active", joined: "2024-02-10" },
  { id: "S1003", name: "Elena Gilbert", email: "elena.g@example.com", phone: "+1 234 567 892", status: "Blocked", joined: "2024-03-05" },
  { id: "S1004", name: "Stefan Salvatore", email: "stefan.s@example.com", phone: "+1 234 567 893", status: "Completed", joined: "2024-01-20" },
  { id: "S1005", name: "Bonnie Bennett", email: "bonnie.b@example.com", phone: "+1 234 567 894", status: "Active", joined: "2024-02-15" },
];

// Keep this consistent with the list page mock IDs for now.
const listStudentsDirectory = Array.from({ length: 1000 }).map((_, i) => {
  const s = baseStudents[i % baseStudents.length];
  const n = i + 1;
  const sid = `S${String(1000 + n)}`;
  const emailPrefix = s.email.split("@")[0] ?? "student";
  return {
    ...s,
    id: sid,
    name: `${s.name} ${n}`,
    email: `${emailPrefix}.${n}@example.com`,
    phone: `+1 234 567 ${String(800 + n).padStart(3, "0")}`,
  };
});

type StudentMeta = (typeof listStudentsDirectory)[number];

type CourseProfile = (typeof studentProfile.courses)[number];

const baseCourseSets: Array<CourseProfile[]> = [
  // Full Stack + UI/UX
  [
    {
      id: "C1",
      name: "Full Stack Development",
      batch: "FS-JAN-24",
      startDate: "2024-01-20",
      tutor: "Arun Krishnan",
      progress: { percentage: 75, completed: 12, pending: 4 },
      attendance: { total: 40, attended: 36, missed: 4, percentage: 90 },
      assignments: { submitted: 10, pending: 2, avgScore: 88 },
      exams: [
        { name: "Frontend Basics", marks: 85, status: "Pass" },
        { name: "Backend Logic", marks: 78, status: "Pass" },
        { name: "Database Design", marks: 92, status: "Pass" },
      ],
      assessments: { quizScore: 90, remarks: "Excellent logical thinking and technical implementation." },
      payments: {
        totalFee: "$1,200",
        paid: "$800",
        pending: "$400",
        history: [
          { date: "2024-01-16", amount: "$400", status: "Paid" },
          { date: "2024-02-15", amount: "$400", status: "Paid" },
        ],
      },
    },
    {
      id: "C2",
      name: "UI/UX Design",
      batch: "UI-FEB-24",
      startDate: "2024-02-05",
      tutor: "Anjali Desai",
      progress: { percentage: 30, completed: 4, pending: 10 },
      attendance: { total: 20, attended: 18, missed: 2, percentage: 90 },
      assignments: { submitted: 3, pending: 5, avgScore: 82 },
      exams: [{ name: "Design Theory", marks: 82, status: "Pass" }],
      assessments: { quizScore: 85, remarks: "Strong aesthetic sense, needs to focus on user journey mapping." },
      payments: {
        totalFee: "$800",
        paid: "$400",
        pending: "$400",
        history: [{ date: "2024-02-06", amount: "$400", status: "Paid" }],
      },
    },
  ],
  // Python DS only
  [
    {
      id: "C3",
      name: "Python Data Science",
      batch: "PY-FEB-24",
      startDate: "2024-02-12",
      tutor: "Meera Nair",
      progress: { percentage: 58, completed: 7, pending: 5 },
      attendance: { total: 28, attended: 22, missed: 6, percentage: 79 },
      assignments: { submitted: 6, pending: 2, avgScore: 76 },
      exams: [
        { name: "Python Basics", marks: 74, status: "Pass" },
        { name: "EDA & Stats", marks: 68, status: "Pass" },
      ],
      assessments: { quizScore: 78, remarks: "Solid progress; improve consistency in practice sessions." },
      payments: {
        totalFee: "$900",
        paid: "$900",
        pending: "$0",
        history: [{ date: "2024-02-13", amount: "$900", status: "Paid" }],
      },
    },
  ],
  // Digital Marketing only
  [
    {
      id: "C4",
      name: "Digital Marketing",
      batch: "DM-MAR-24",
      startDate: "2024-03-10",
      tutor: "Rahul Varma",
      progress: { percentage: 40, completed: 4, pending: 6 },
      attendance: { total: 18, attended: 12, missed: 6, percentage: 67 },
      assignments: { submitted: 2, pending: 3, avgScore: 70 },
      exams: [{ name: "SEO Fundamentals", marks: 65, status: "Pass" }],
      assessments: { quizScore: 72, remarks: "Good understanding; needs improvement in campaign planning." },
      payments: {
        totalFee: "$700",
        paid: "$350",
        pending: "$350",
        history: [{ date: "2024-03-11", amount: "$350", status: "Paid" }],
      },
    },
  ],
];

function buildStudentProfile(meta: StudentMeta) {
  const baseIndex = baseStudents.findIndex((b) => meta.name.startsWith(b.name));
  const setIndex = baseIndex === -1 ? 0 : baseIndex % baseCourseSets.length;
  return {
    id: meta.id,
    name: meta.name,
    email: meta.email,
    phone: meta.phone,
    status: meta.status,
    joined: meta.joined,
    avatar: meta.name
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase(),
    courses: baseCourseSets[setIndex],
  };
}

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

type LucideIcon = React.ComponentType<{ className?: string }>;

function parseMoneyDisplay(amount: string): number {
  const n = parseFloat(String(amount).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function formatProfileDate(iso: string): string {
  if (!iso) return "—";
  const d = new Date(/^\d{4}-\d{2}-\d{2}$/.test(iso) ? `${iso}T12:00:00` : iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

/** Demo-friendly fields not yet stored on the student record; stable per student id. */
function personalDemographicsFromStudentId(id: string) {
  const n = parseInt(id.replace(/\D/g, "") || "0", 10);
  const dob = ["12 May 2002", "3 Aug 2001", "22 Nov 2000", "15 Jun 2003", "9 Jan 2001"];
  const gender = ["Male", "Female", "Other"];
  const blood = ["O+", "A+", "B+", "AB+", "O-"];
  const referral = ["John Mathew", "Sarah Kurian", "David Paul", "—"];
  const address = [
    "Block 4, Technopark Campus, Trivandrum, Kerala - 695581",
    "12 MG Road, Bengaluru, Karnataka - 560001",
    "—",
  ];
  return {
    dateOfBirth: dob[n % dob.length],
    gender: gender[n % gender.length],
    bloodGroup: blood[n % blood.length],
    referralName: referral[n % referral.length],
    address: address[n % address.length],
  };
}

function estimatedCourseDurationMonths(course: { progress: { completed: number; pending: number } }): string {
  const total = course.progress.completed + course.progress.pending;
  if (total <= 0) return "—";
  const months = Math.max(3, Math.min(12, Math.round((total / 8) * 6)));
  return `${months} Months`;
}

function courseIsCompleted(course: {
  progress: { percentage: number; completed: number; pending: number };
}): boolean {
  const total = course.progress.completed + course.progress.pending;
  return course.progress.percentage >= 100 || (total > 0 && course.progress.completed >= total);
}

function overallProgressWeekLabel(course: { progress: { percentage: number } }): string {
  if (course.progress.percentage >= 100) return "Completed";
  const w = Math.max(1, Math.round((course.progress.percentage / 100) * 24));
  return `Week ${w}`;
}

const OverallInfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="py-3.5 first:pt-0 last:pb-0">
    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</p>
    <p className="mt-1 text-sm font-bold text-foreground break-words">{value || "—"}</p>
  </div>
);

const KpiMiniCard = ({
  icon: Icon,
  label,
  value,
  hint,
  progress,
  progressClassName,
  iconWrapClassName,
}: {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
  hint?: string;
  progress?: number;
  progressClassName?: string;
  iconWrapClassName?: string;
}) => (
  <Card className="border-none shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300 bg-card/80">
    <CardContent className="p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div
          className={cn(
            "p-2.5 rounded-xl bg-muted/40 text-primary shrink-0",
            iconWrapClassName
          )}
        >
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-3xl font-black text-foreground tracking-tight tabular-nums leading-none">{value}</p>
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{label}</p>
        {hint ? <p className="text-xs font-medium text-muted-foreground pt-1">{hint}</p> : null}
      </div>
      {typeof progress === "number" ? (
        <Progress
          value={Math.min(100, Math.max(0, progress))}
          className={cn("h-2 rounded-full bg-muted/25", progressClassName)}
        />
      ) : null}
    </CardContent>
  </Card>
);

const StudentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const studentMeta = useMemo(() => {
    if (!id) return null;
    return readStoredStudents().find((s) => s.id === id) ?? null;
  }, [id]);

  const profile = useMemo(() => {
    if (!studentMeta) return studentProfile;
    // Use stored data for header + pick a course set to drive the UI.
    const metaForBuilder = {
      id: studentMeta.id,
      name: studentMeta.name,
      email: studentMeta.email,
      phone: studentMeta.phone,
      status: studentMeta.status,
      joined: studentMeta.joined,
    } as unknown as StudentMeta;
    return buildStudentProfile(metaForBuilder);
  }, [studentMeta]);

  const [activeCourse, setActiveCourse] = useState(profile.courses[0]?.id ?? studentProfile.courses[0].id);
  const [activeTab, setActiveTab] = useState<
    | "overall"
    | "academic"
    | "course"
    | "attendance"
    | "assignment"
    | "exam"
    | "technical"
    | "financial"
  >("overall");

  useEffect(() => {
    setActiveCourse(profile.courses[0]?.id ?? studentProfile.courses[0].id);
  }, [profile.id]);

  const selectedCourse = profile.courses.find((c) => c.id === activeCourse) || profile.courses[0] || studentProfile.courses[0];

  const moduleTotal = selectedCourse.progress.completed + selectedCourse.progress.pending;
  const moduleCompletionPct =
    moduleTotal > 0 ? Math.round((selectedCourse.progress.completed / moduleTotal) * 100) : 0;
  const completionStatusLabel =
    selectedCourse.progress.percentage >= 100
      ? "Completed"
      : moduleCompletionPct >= 75
        ? "On track"
        : moduleCompletionPct >= 40
          ? "In progress"
          : "Getting started";

  const paidNum = parseMoneyDisplay(selectedCourse.payments.paid);
  const totalNum = parseMoneyDisplay(selectedCourse.payments.totalFee);
  const feeProgressPct = totalNum > 0 ? Math.min(100, Math.round((paidNum / totalNum) * 100)) : 0;

  const headerBatchLabel = useMemo(() => {
    const raw = studentMeta as { batchName?: string } | null;
    const bn = raw?.batchName && typeof raw.batchName === "string" ? raw.batchName.trim() : "";
    return bn || selectedCourse.batch;
  }, [studentMeta, selectedCourse.batch]);

  const statusBadgeClass =
    profile.status === "Active"
      ? "bg-emerald-50 text-emerald-700 border-emerald-100/80"
      : profile.status === "Blocked"
        ? "bg-red-50 text-red-700 border-red-100/80"
        : "bg-sky-50 text-sky-700 border-sky-100/80";

  const personalDemo = useMemo(() => personalDemographicsFromStudentId(profile.id), [profile.id]);
  const storedMentor = (() => {
    if (!studentMeta) return "";
    const m = studentMeta as unknown as { mentorName?: string };
    return typeof m.mentorName === "string" ? m.mentorName.trim() : "";
  })();

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6 max-w-[1600px] mx-auto pb-10 px-4 sm:px-6">
        {/* Profile header — compact dashboard style (matches intern-style reference) */}
        <Card className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 shrink-0 rounded-full border-border/60 bg-background shadow-sm hover:bg-muted/40"
                  onClick={() => navigate("/admin/students")}
                  aria-label="Back to students"
                >
                  <ChevronLeft className="h-4 w-4 text-foreground" />
                </Button>
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                      {profile.name}
                    </h1>
                    <Badge
                      className={cn(
                        "rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide shadow-none",
                        statusBadgeClass,
                      )}
                    >
                      {profile.status === "Blocked" ? "Inactive" : profile.status}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {selectedCourse.name}
                    <span className="mx-1.5 text-muted-foreground/60" aria-hidden>
                      •
                    </span>
                    {headerBatchLabel}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Student ID:{" "}
                    <span className="font-semibold text-foreground/90">{profile.id}</span>
                  </p>
                </div>
              </div>
              <Button
                type="button"
                onClick={() => navigate(`/admin/students/edit/${id}`)}
                variant="outline"
                className="h-10 w-full shrink-0 gap-2 rounded-xl border-border/60 bg-background shadow-sm sm:w-auto"
              >
                <Edit className="h-4 w-4" /> Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Course selector + Section Tabs */}
        <section className="space-y-6">
          <Tabs value={activeCourse} onValueChange={setActiveCourse} className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <h2 className="text-lg font-black text-foreground tracking-tight">Active Enrollments</h2>
              <TabsList className="bg-muted/10 p-1 rounded-2xl border border-border/50 h-auto">
                {profile.courses.map((course) => (
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
          </Tabs>

          <div className="overflow-x-auto">
            <div className="min-w-max">
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
                <TabsList className="bg-muted/10 p-1 rounded-2xl border border-border/50 h-auto">
                  <TabsTrigger
                    value="overall"
                    className="inline-flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-xs font-black"
                  >
                    <LayoutGrid className="h-3.5 w-3.5 shrink-0 opacity-70" />
                    Overall
                  </TabsTrigger>
                  <TabsTrigger value="academic" className="rounded-xl px-5 py-2.5 text-xs font-black">
                    Academic
                  </TabsTrigger>
                  <TabsTrigger value="course" className="rounded-xl px-5 py-2.5 text-xs font-black">
                    Course Information
                  </TabsTrigger>
                  <TabsTrigger value="attendance" className="rounded-xl px-5 py-2.5 text-xs font-black">
                    Attendance Report
                  </TabsTrigger>
                  <TabsTrigger value="assignment" className="rounded-xl px-5 py-2.5 text-xs font-black">
                    Assignment Performance
                  </TabsTrigger>
                  <TabsTrigger value="exam" className="rounded-xl px-5 py-2.5 text-xs font-black">
                    Exam Achievements
                  </TabsTrigger>
                  <TabsTrigger value="technical" className="rounded-xl px-5 py-2.5 text-xs font-black">
                    Technical Assessment
                  </TabsTrigger>
                  <TabsTrigger value="financial" className="rounded-xl px-5 py-2.5 text-xs font-black">
                    Financial Snapshot
                  </TabsTrigger>
                </TabsList>

                <div className="pt-6 space-y-6">
                  <TabsContent value="overall" className="m-0">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
                      <Card className="border-none shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300">
                        <CardHeader className="border-b border-border/50 bg-muted/5 py-4 px-6">
                          <CardTitle className="flex items-center gap-2 text-sm font-black text-foreground">
                            <User className="h-4 w-4 text-primary" />
                            Personal information
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="divide-y divide-border/40 p-6">
                          <OverallInfoRow label="Full name" value={profile.name} />
                          <OverallInfoRow label="Email address" value={profile.email} />
                          <OverallInfoRow label="Phone number" value={profile.phone} />
                          <OverallInfoRow label="Date of birth" value={personalDemo.dateOfBirth} />
                          <OverallInfoRow label="Gender" value={personalDemo.gender} />
                          <OverallInfoRow label="Blood group" value={personalDemo.bloodGroup} />
                          <OverallInfoRow label="Join date" value={formatProfileDate(profile.joined)} />
                          <OverallInfoRow label="Referral name" value={personalDemo.referralName} />
                          {storedMentor ? (
                            <OverallInfoRow label="Assigned mentor" value={storedMentor} />
                          ) : null}
                          <OverallInfoRow label="Address" value={personalDemo.address} />
                        </CardContent>
                      </Card>

                      <Card className="border-none shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300">
                        <CardHeader className="border-b border-border/50 bg-muted/5 py-4 px-6">
                          <CardTitle className="flex items-center gap-2 text-sm font-black text-foreground">
                            <BookOpen className="h-4 w-4 text-primary" />
                            Academic information
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5 p-6">
                          {profile.courses.map((c) => {
                            const totalMods = c.progress.completed + c.progress.pending;
                            const done = courseIsCompleted(c);
                            return (
                              <div
                                key={c.id}
                                className="rounded-2xl border border-border/40 bg-muted/10 p-5 transition-colors hover:bg-muted/15"
                              >
                                <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
                                  <h3 className="text-sm font-black text-foreground">{c.name}</h3>
                                  <Badge
                                    className={cn(
                                      "rounded-full border-none text-[10px] font-black uppercase tracking-wide shadow-none",
                                      done
                                        ? "bg-muted text-muted-foreground"
                                        : "bg-emerald-50 text-emerald-700",
                                    )}
                                  >
                                    {done ? "Completed" : "Ongoing"}
                                  </Badge>
                                </div>
                                <div className="grid grid-cols-1 gap-2 text-xs font-bold text-muted-foreground sm:grid-cols-2">
                                  <p>
                                    <span className="text-[10px] font-black uppercase tracking-wide opacity-70">
                                      Batch
                                    </span>
                                    <br />
                                    <span className="text-foreground">{c.batch}</span>
                                  </p>
                                  <p>
                                    <span className="text-[10px] font-black uppercase tracking-wide opacity-70">
                                      Start date
                                    </span>
                                    <br />
                                    <span className="text-foreground">{formatProfileDate(c.startDate)}</span>
                                  </p>
                                  <p>
                                    <span className="text-[10px] font-black uppercase tracking-wide opacity-70">
                                      Duration
                                    </span>
                                    <br />
                                    <span className="text-foreground">{estimatedCourseDurationMonths(c)}</span>
                                  </p>
                                  <p>
                                    <span className="text-[10px] font-black uppercase tracking-wide opacity-70">
                                      Modules
                                    </span>
                                    <br />
                                    <span className="text-foreground">
                                      {c.progress.completed} / {totalMods || "—"}
                                    </span>
                                  </p>
                                  <p className="sm:col-span-2">
                                    <span className="text-[10px] font-black uppercase tracking-wide opacity-70">
                                      Progress
                                    </span>
                                    <br />
                                    <span className="text-foreground">{overallProgressWeekLabel(c)}</span>
                                  </p>
                                </div>
                                <Progress
                                  value={c.progress.percentage}
                                  className="mt-4 h-2.5 rounded-full bg-muted/30 [&>div]:bg-primary"
                                />
                              </div>
                            );
                          })}
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="academic" className="m-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
                      <KpiMiniCard
                        icon={TrendingUp}
                        label="Overall progress"
                        value={`${selectedCourse.progress.percentage}%`}
                        hint={`${selectedCourse.progress.completed} done · ${selectedCourse.progress.pending} pending`}
                        progress={selectedCourse.progress.percentage}
                        progressClassName="[&>div]:bg-primary"
                      />
                      <KpiMiniCard
                        icon={GraduationCap}
                        label="Average grade"
                        value={selectedCourse.assignments.avgScore}
                        hint="Based on submitted assignments"
                        progress={selectedCourse.assignments.avgScore}
                        progressClassName="[&>div]:bg-violet-500"
                        iconWrapClassName="bg-violet-500/10 text-violet-600"
                      />
                      <KpiMiniCard
                        icon={Percent}
                        label="Attendance"
                        value={`${selectedCourse.attendance.percentage}%`}
                        hint={`${selectedCourse.attendance.attended} of ${selectedCourse.attendance.total} sessions`}
                        progress={selectedCourse.attendance.percentage}
                        progressClassName="[&>div]:bg-sky-500"
                        iconWrapClassName="bg-sky-500/10 text-sky-600"
                      />
                      <KpiMiniCard
                        icon={ListChecks}
                        label="Completion status"
                        value={completionStatusLabel}
                        hint={`Modules: ${selectedCourse.progress.completed}/${moduleTotal || "—"}`}
                        progress={moduleTotal ? moduleCompletionPct : undefined}
                        progressClassName="[&>div]:bg-emerald-500"
                        iconWrapClassName="bg-emerald-500/10 text-emerald-600"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="course" className="m-0">
                    <Card className="border-none shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300">
                      <CardHeader className="py-4 px-6 border-b border-border/50 bg-muted/5">
                        <CardTitle className="text-[11px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                          <BookOpen className="w-3.5 h-3.5 text-primary" />
                          Course information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 md:p-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                          <div className="flex items-start gap-4">
                            <div className="p-2.5 bg-primary/10 text-primary rounded-xl shrink-0">
                              <BookOpen className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 space-y-1">
                              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Batch name</p>
                              <p className="text-sm font-bold text-foreground">{selectedCourse.batch}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-4">
                            <div className="p-2.5 bg-emerald-500/10 text-emerald-600 rounded-xl shrink-0">
                              <Calendar className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 space-y-1">
                              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Start date</p>
                              <p className="text-sm font-bold text-foreground">{selectedCourse.startDate}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-4">
                            <div className="p-2.5 bg-muted/50 text-muted-foreground rounded-xl shrink-0">
                              <Calendar className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 space-y-1">
                              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">End date</p>
                              <p className="text-sm font-bold text-foreground">—</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-4 md:col-span-2 xl:col-span-1">
                            <div className="p-2.5 bg-violet-500/10 text-violet-600 rounded-xl shrink-0">
                              <User className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 space-y-1">
                              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Assigned tutor</p>
                              <p className="text-sm font-bold text-foreground">{selectedCourse.tutor}</p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Enrolled courses</p>
                          <div className="flex flex-wrap gap-2">
                            {profile.courses.map((c) => (
                              <Badge
                                key={c.id}
                                variant="secondary"
                                className={cn(
                                  "rounded-full px-3 py-1 text-xs font-bold border-none shadow-none",
                                  c.id === selectedCourse.id
                                    ? "bg-primary/15 text-primary"
                                    : "bg-muted/60 text-foreground"
                                )}
                              >
                                {c.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="attendance" className="m-0">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
                      <Card className="border-none shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300">
                        <CardContent className="p-6 md:p-7 space-y-6">
                          <div className="flex items-center justify-between gap-4">
                            <div className="space-y-1">
                              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Attendance rate</p>
                              <p className="text-4xl font-black text-foreground tabular-nums leading-none">
                                {selectedCourse.attendance.percentage}%
                              </p>
                            </div>
                            <div className="p-3 rounded-2xl bg-primary/10 text-primary shrink-0">
                              <Clock className="w-7 h-7" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs font-bold">
                              <span className="text-muted-foreground">Presence across sessions</span>
                              <span className="text-foreground tabular-nums">
                                {selectedCourse.attendance.attended}/{selectedCourse.attendance.total}
                              </span>
                            </div>
                            <Progress
                              value={selectedCourse.attendance.percentage}
                              className="h-3 rounded-full bg-muted/25 [&>div]:bg-primary"
                            />
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="border-none shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300">
                        <CardContent className="p-6 md:p-7 space-y-6">
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Session breakdown</p>
                          <div className="space-y-5">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm font-bold">
                                <span className="flex items-center gap-2 text-emerald-600">
                                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                                  Sessions attended
                                </span>
                                <span className="tabular-nums text-foreground">{selectedCourse.attendance.attended}</span>
                              </div>
                              <Progress
                                value={
                                  selectedCourse.attendance.total > 0
                                    ? (selectedCourse.attendance.attended / selectedCourse.attendance.total) * 100
                                    : 0
                                }
                                className="h-2.5 rounded-full bg-muted/25 [&>div]:bg-emerald-500"
                              />
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm font-bold">
                                <span className="flex items-center gap-2 text-red-600">
                                  <XCircle className="w-4 h-4 shrink-0" />
                                  Sessions missed
                                </span>
                                <span className="tabular-nums text-foreground">{selectedCourse.attendance.missed}</span>
                              </div>
                              <Progress
                                value={
                                  selectedCourse.attendance.total > 0
                                    ? (selectedCourse.attendance.missed / selectedCourse.attendance.total) * 100
                                    : 0
                                }
                                className="h-2.5 rounded-full bg-muted/25 [&>div]:bg-red-500"
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="assignment" className="m-0">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5">
                      <Card className="lg:col-span-2 border-none shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300">
                        <CardHeader className="py-4 px-6 border-b border-border/50 bg-muted/5">
                          <CardTitle className="text-[11px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <FileText className="w-3.5 h-3.5 text-primary" />
                            Average score
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 md:p-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                          <div>
                            <p className="text-5xl font-black text-foreground tabular-nums leading-none">
                              {selectedCourse.assignments.avgScore}
                            </p>
                            <p className="text-xs font-bold text-muted-foreground mt-2">Out of 100 · submitted work</p>
                          </div>
                          <div className="space-y-2 max-w-sm w-full">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                              <span>Performance</span>
                              <span className="text-foreground">{selectedCourse.assignments.avgScore}%</span>
                            </div>
                            <Progress
                              value={selectedCourse.assignments.avgScore}
                              className="h-3 rounded-full bg-muted/25 [&>div]:bg-violet-500"
                            />
                          </div>
                        </CardContent>
                      </Card>
                      <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                        <Card className="border-none shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300 bg-emerald-500/[0.06]">
                          <CardContent className="p-5 space-y-2">
                            <Badge className="w-fit rounded-full bg-emerald-500/15 text-emerald-700 border-none font-black text-[10px] uppercase">
                              Submitted
                            </Badge>
                            <p className="text-3xl font-black text-emerald-700 tabular-nums">
                              {selectedCourse.assignments.submitted}
                            </p>
                            <p className="text-[10px] font-bold text-emerald-700/80 uppercase tracking-wide">Turned in</p>
                          </CardContent>
                        </Card>
                        <Card className="border-none shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300 bg-amber-500/[0.07]">
                          <CardContent className="p-5 space-y-2">
                            <Badge className="w-fit rounded-full bg-amber-500/20 text-amber-800 border-none font-black text-[10px] uppercase">
                              Pending
                            </Badge>
                            <p className="text-3xl font-black text-amber-900 tabular-nums">
                              {selectedCourse.assignments.pending}
                            </p>
                            <p className="text-[10px] font-bold text-amber-800/80 uppercase tracking-wide">Awaiting</p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="exam" className="m-0">
                    <div className="space-y-3 md:space-y-4">
                      {selectedCourse.exams.map((exam, idx) => (
                        <Card
                          key={idx}
                          className="border-none shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300"
                        >
                          <CardContent className="p-5 md:px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-start gap-4 min-w-0">
                              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 shrink-0">
                                <Trophy className="w-4 h-4" />
                              </div>
                              <div className="min-w-0 space-y-1">
                                <p className="text-sm font-black text-foreground truncate">{exam.name}</p>
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Exam</p>
                              </div>
                            </div>
                            <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 sm:gap-2 shrink-0">
                              <p className="text-2xl font-black text-foreground tabular-nums">{exam.marks}</p>
                              <Badge
                                className={cn(
                                  "font-black text-[10px] rounded-full px-3 py-0.5 border-none shadow-none",
                                  exam.status === "Pass"
                                    ? "bg-emerald-500/15 text-emerald-700"
                                    : "bg-red-500/15 text-red-700"
                                )}
                              >
                                {exam.status}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="technical" className="m-0">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
                      <Card className="border-none shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300">
                        <CardHeader className="py-4 px-6 border-b border-border/50 bg-muted/5">
                          <CardTitle className="text-[11px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <Target className="w-3.5 h-3.5 text-primary" />
                            Quiz accuracy
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 md:p-8 space-y-4">
                          <p className="text-5xl font-black text-foreground tabular-nums leading-none">
                            {selectedCourse.assessments.quizScore}%
                          </p>
                          <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                              <span>Score</span>
                              <span className="text-foreground">{selectedCourse.assessments.quizScore}%</span>
                            </div>
                            <Progress
                              value={selectedCourse.assessments.quizScore}
                              className="h-3 rounded-full bg-muted/25 [&>div]:bg-primary"
                            />
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="border-none shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300">
                        <CardHeader className="py-4 px-6 border-b border-border/50 bg-muted/5">
                          <CardTitle className="text-[11px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <User className="w-3.5 h-3.5 text-primary" />
                            Mentor remarks
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 md:p-8">
                          <div className="rounded-2xl bg-muted/30 border border-border/40 p-5 md:p-6">
                            <p className="text-sm font-medium text-foreground italic leading-relaxed">
                              {selectedCourse.assessments.remarks}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="financial" className="m-0 space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
                      <KpiMiniCard
                        icon={Wallet}
                        label="Total fees"
                        value={selectedCourse.payments.totalFee}
                        iconWrapClassName="bg-muted/50 text-foreground"
                      />
                      <KpiMiniCard
                        icon={CheckCircle2}
                        label="Paid amount"
                        value={selectedCourse.payments.paid}
                        progress={feeProgressPct}
                        progressClassName="[&>div]:bg-emerald-500"
                        iconWrapClassName="bg-emerald-500/10 text-emerald-600"
                      />
                      <KpiMiniCard
                        icon={CreditCard}
                        label="Pending amount"
                        value={selectedCourse.payments.pending}
                        hint="Outstanding balance"
                        iconWrapClassName="bg-red-500/10 text-red-600"
                      />
                    </div>
                    <Card className="border-none shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300">
                      <CardHeader className="py-4 px-6 border-b border-border/50 bg-muted/5">
                        <CardTitle className="text-[11px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                          <ArrowUpRight className="w-3.5 h-3.5 text-primary" />
                          Payment history
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 space-y-3">
                        {selectedCourse.payments.history.map((tx, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 md:p-4 rounded-2xl bg-emerald-500/[0.06] border border-emerald-500/10 hover:shadow-sm transition-all"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="p-2 bg-background/80 rounded-xl border border-border/40 shadow-sm shrink-0">
                                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
                              </div>
                              <div className="min-w-0 space-y-0.5">
                                <p className="text-sm font-black text-foreground truncate">{tx.amount}</p>
                                <p className="text-[10px] font-bold text-muted-foreground">{tx.date}</p>
                              </div>
                            </div>
                            <Badge className="shrink-0 bg-emerald-500/15 text-emerald-700 text-[10px] font-black rounded-full px-2.5 border-none">
                              {tx.status}
                            </Badge>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>
        </section>

      </div>
    </DashboardLayout>
  );
};

export default StudentDetails;
