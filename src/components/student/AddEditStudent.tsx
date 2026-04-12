import { useState, useEffect, useMemo, type FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Mail,
  Phone,
  Lock,
  ChevronLeft,
  Plus,
  Trash2,
  BookOpen,
  Save,
  UserPlus,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useRole } from "@/hooks/useRole";
import { defaultMentorNameForStudentId } from "./studentDefaults";

// --- LocalStorage Student Store (frontend-only persistence) ---

const STUDENTS_STORAGE_KEY = "students";

type StudentStatus = "Active" | "Blocked" | "Completed";

type StudentCourse = { id: string; name: string };

type StoredStudent = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: StudentStatus;
  joined: string; // YYYY-MM-DD
  courses: StudentCourse[]; // must always exist
  batchId: string;
  batchName: string;
  mentorName: string;
};

function readStoredStudents(): StoredStudent[] {
  try {
    const raw = localStorage.getItem(STUDENTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return (parsed as any[])
      .map((s) => {
        if (!s || typeof s !== "object" || typeof s.id !== "string") return null;
        const rawCourses = Array.isArray(s.courses) ? s.courses : [];
        const courses: StudentCourse[] = rawCourses
          .map((c: any) => {
            if (typeof c === "string") return { id: c, name: c };
            if (!c || typeof c !== "object") return null;
            if (typeof c.id !== "string" || typeof c.name !== "string") return null;
            return { id: c.id, name: c.name };
          })
          .filter(Boolean) as StudentCourse[];
        const batchId = typeof (s as any).batchId === "string" ? (s as any).batchId : "";
        const batchName = typeof (s as any).batchName === "string" ? (s as any).batchName : "";
        const rawMentor =
          typeof (s as any).mentorName === "string" ? (s as any).mentorName.trim() : "";
        const sid = typeof (s as any).id === "string" ? (s as any).id : "";
        const mentorName = rawMentor || (sid ? defaultMentorNameForStudentId(sid) : "");
        const normalizedCourses = courses.map(normalizeStoredCourse);
        return { ...s, courses: normalizedCourses, batchId, batchName, mentorName } as StoredStudent;
      })
      .filter(Boolean) as StoredStudent[];
  } catch {
    return [];
  }
}

function writeStoredStudents(students: StoredStudent[]) {
  localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(students));
}

const AVAILABLE_COURSES = [
  { id: "c1", name: "Full Stack Development" },
  { id: "c2", name: "Python Data Science" },
  { id: "c3", name: "UI/UX Design" },
  { id: "c4", name: "Digital Marketing" },
  { id: "c5", name: "Cyber Security" },
  { id: "c6", name: "Mobile App Development" },
];

const AVAILABLE_BATCHES = [
  "FS-JAN-24", "FS-FEB-24", "PY-JAN-24", "UI-FEB-24", "DM-MAR-24", "CS-JAN-24"
];

const BATCHES = [
  { id: "b1", name: "Morning Batch" },
  { id: "b2", name: "Evening Batch" },
  { id: "b3", name: "Weekend Batch" },
];

const getCourseById = (id: string) => AVAILABLE_COURSES.find((c) => c.id === id) ?? null;
const getBatchById = (id: string) => BATCHES.find((b) => b.id === id) ?? null;

/** Align stored { id, name } with the catalog so Select values always match a SelectItem (fixes legacy id/name skew like c2 + "UI/UX Design"). */
function normalizeStoredCourse(c: StudentCourse): StudentCourse {
  const byId = AVAILABLE_COURSES.find((x) => x.id === c.id);
  if (byId && byId.name === c.name) return byId;
  const byName = AVAILABLE_COURSES.find(
    (x) => x.name.trim().toLowerCase() === c.name.trim().toLowerCase(),
  );
  if (byName) return byName;
  const byIdCi = AVAILABLE_COURSES.find((x) => x.id.toLowerCase() === c.id.toLowerCase());
  if (byIdCi) return byIdCi;
  return c;
}

function resolveBatchIdForForm(batchId: string, batchName: string): string {
  if (batchId && BATCHES.some((b) => b.id === batchId)) return batchId;
  const ci = BATCHES.find((b) => b.id.toLowerCase() === batchId.trim().toLowerCase());
  if (ci) return ci.id;
  const byName = BATCHES.find((b) => b.name.toLowerCase() === batchName.trim().toLowerCase());
  if (byName) return byName.id;
  return batchId;
}

const AddEditStudent = ({ mode = "add" }: { mode?: "add" | "edit" }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useRole();
  const basePath = role === "superadmin" ? "/superadmin" : "/admin";
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    status: "Active",
  });

  const [selectedCourses, setSelectedCourses] = useState<StudentCourse[]>([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const courseSelectOptions = useMemo(() => {
    const catalogIds = new Set(AVAILABLE_COURSES.map((c) => c.id));
    const extras = selectedCourses.filter((c) => !catalogIds.has(c.id));
    return [...AVAILABLE_COURSES, ...extras];
  }, [selectedCourses]);

  useEffect(() => {
    if (mode === "edit" && id) {
      const meta = readStoredStudents().find((s) => s.id === id) ?? null;
      setFormData({
        name: meta?.name ?? "Sarah Connor",
        email: meta?.email ?? "sarah.c@example.com",
        phone: meta?.phone ?? "+1 234 567 890",
        password: "", // Don't show password in edit
        status: meta?.status ?? "Active",
      });
      const loaded = (meta?.courses ?? []).map(normalizeStoredCourse);
      setSelectedCourses(loaded);
      setSelectedBatch(resolveBatchIdForForm(meta?.batchId ?? "", meta?.batchName ?? ""));
    }
  }, [mode, id]);

  const handleAddCourse = (course: StudentCourse) => {
    setSelectedCourses((prev) => (prev.some((c) => c.id === course.id) ? prev : [...prev, course]));
  };

  const handleRemoveCourse = (courseId: string) => {
    setSelectedCourses((prev) => prev.filter((c) => c.id !== courseId));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = "Full Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (mode === "add" && !formData.password) newErrors.password = "Password is required";
    if (selectedCourses.length === 0) newErrors.courses = "At least one course must be assigned";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields.",
        variant: "destructive"
      });
      return;
    }

    const students = readStoredStudents();
    const batch = getBatchById(selectedBatch);
    const batchId = selectedBatch || "";
    const batchName = batch?.name || "";

    if (mode === "edit" && id) {
      const updated = students.map((s) =>
        s.id === id
          ? {
              ...s,
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              status: formData.status as StudentStatus,
              courses: selectedCourses,
              batchId,
              batchName,
            }
          : s,
      );
      writeStoredStudents(updated);
    } else {
      const today = new Date().toISOString().slice(0, 10);
      const newId = Date.now().toString();
      const newStudent: StoredStudent = {
        id: newId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        status: formData.status as StudentStatus,
        joined: today,
        courses: selectedCourses ?? [],
        batchId,
        batchName,
        mentorName: defaultMentorNameForStudentId(newId),
      };
      const updated = [...students, newStudent];
      writeStoredStudents(updated);
    }

    toast({
      title: mode === "add" ? "Student Enrolled" : "Profile Updated",
      description: `${formData.name} has been successfully ${mode === "add" ? "added to the system" : "updated"}.`,
    });
    navigate(`${basePath}/students`);
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6 max-w-[1000px] mx-auto pb-10 px-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate(`${basePath}/students`)}
            className="rounded-xl gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 -ml-4"
          >
            <ChevronLeft className="w-4 h-4" /> Cancel
          </Button>
          <div className="text-right">
            <h1 className="text-2xl font-black text-foreground">{mode === "add" ? "Enroll New Student" : "Edit Student Profile"}</h1>
            <p className="text-xs text-muted-foreground font-bold tracking-tight uppercase opacity-70">
              {mode === "add" ? "Onboarding Phase" : `Student ID: ${id}`}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Basic Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
              <CardHeader className="py-5 px-8 border-b border-border/50 bg-muted/5">
                <CardTitle className="text-[11px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-primary" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest opacity-70 flex items-center gap-2">
                      Full Name {errors.name && <AlertCircle className="w-3 h-3 text-red-500" />}
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                      <Input 
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="pl-11 h-12 bg-muted/20 border-none rounded-xl focus-visible:ring-primary/20 font-bold" 
                        placeholder="e.g. John Doe"
                      />
                    </div>
                    {errors.name && <p className="text-[10px] font-bold text-red-500 pl-1 uppercase">{errors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest opacity-70 flex items-center gap-2">
                      Email Address {errors.email && <AlertCircle className="w-3 h-3 text-red-500" />}
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                      <Input 
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="pl-11 h-12 bg-muted/20 border-none rounded-xl focus-visible:ring-primary/20 font-bold" 
                        placeholder="john@example.com"
                      />
                    </div>
                    {errors.email && <p className="text-[10px] font-bold text-red-500 pl-1 uppercase">{errors.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest opacity-70">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                      <Input 
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="pl-11 h-12 bg-muted/20 border-none rounded-xl focus-visible:ring-primary/20 font-bold" 
                        placeholder="+1 234 567 890"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest opacity-70">Status</Label>
                    <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val })}>
                      <SelectTrigger className="h-12 bg-muted/20 border-none rounded-xl focus-visible:ring-primary/20 font-bold">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-none shadow-xl">
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Blocked">Blocked</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {mode === "add" && (
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-widest opacity-70 flex items-center gap-2">
                        Initial Password {errors.password && <AlertCircle className="w-3 h-3 text-red-500" />}
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                        <Input 
                          type="password"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          className="pl-11 h-12 bg-muted/20 border-none rounded-xl focus-visible:ring-primary/20 font-bold" 
                          placeholder="••••••••"
                        />
                      </div>
                      {errors.password && <p className="text-[10px] font-bold text-red-500 pl-1 uppercase">{errors.password}</p>}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Section: Course Assignment */}
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
              <CardHeader className="py-5 px-8 border-b border-border/50 bg-muted/5 flex flex-row items-center justify-between">
                <CardTitle className="text-[11px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-primary" />
                  Course Enrollment
                </CardTitle>
                <Button 
                  type="button" 
                  onClick={() => handleAddCourse(AVAILABLE_COURSES[0])}
                  variant="outline" 
                  size="sm" 
                  className="rounded-lg h-8 px-3 text-[10px] font-black uppercase tracking-widest border-primary/20 text-primary hover:bg-primary/5"
                >
                  <Plus className="w-3 h-3 mr-1" /> Add Course
                </Button>
              </CardHeader>
              <CardContent className="p-8 space-y-4">
                {selectedCourses.length === 0 ? (
                  <div className="py-12 text-center space-y-4 bg-muted/5 rounded-3xl border border-dashed border-border/50">
                    <div className="w-12 h-12 bg-muted/50 rounded-full flex items-center justify-center mx-auto">
                      <BookOpen className="w-6 h-6 text-muted-foreground/50" />
                    </div>
                    <p className="text-xs font-bold text-muted-foreground">No courses assigned yet.</p>
                  </div>
                ) : (
                  selectedCourses.map((course, rowIndex) => (
                    <div
                      key={`${course.id}-${rowIndex}`}
                      className="flex flex-col md:flex-row items-center gap-4 p-5 bg-muted/10 rounded-2xl border border-border/30 group animate-in slide-in-from-left-4 duration-300"
                    >
                      <div className="flex-1 w-full space-y-1">
                        <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground pl-1">Course</Label>
                        <Select
                          value={course.id}
                          onValueChange={(val) => {
                            const picked =
                              courseSelectOptions.find((c) => c.id === val) ?? getCourseById(val);
                            if (!picked) return;
                            setSelectedCourses((prev) =>
                              prev.map((c, i) =>
                                i === rowIndex ? { id: picked.id, name: picked.name } : c,
                              ),
                            );
                          }}
                        >
                          <SelectTrigger className="h-10 bg-background border-none rounded-xl font-bold text-xs ring-1 ring-border/50">
                            <SelectValue placeholder="Select Course" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-none shadow-xl">
                            {courseSelectOptions.map((c) => (
                              <SelectItem key={c.id} value={c.id}>
                                {c.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex-1 w-full space-y-1">
                        <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground pl-1">Batch</Label>
                        <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                          <SelectTrigger className="h-10 bg-background border-none rounded-xl font-bold text-xs ring-1 ring-border/50">
                            <SelectValue placeholder="Select Batch" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-none shadow-xl">
                            {BATCHES.map((b) => (
                              <SelectItem key={b.id} value={b.id}>
                                {b.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button 
                        type="button" 
                        onClick={() => handleRemoveCourse(course.id)}
                        variant="ghost" 
                        size="icon" 
                        className="h-10 w-10 rounded-xl text-red-500 hover:bg-red-50 shrink-0 md:mt-5"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                )}
                {errors.courses && <p className="text-[10px] font-bold text-red-500 pl-1 uppercase mt-2">{errors.courses}</p>}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Actions & Tips */}
          <div className="space-y-6">
            <Card className="border-none shadow-lg shadow-black/5 rounded-3xl overflow-hidden bg-primary text-white">
              <CardContent className="p-8 space-y-6">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                  {mode === "add" ? <UserPlus className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="text-xl font-black leading-tight">
                    {mode === "add" ? "Ready to enroll?" : "Save your changes?"}
                  </h3>
                  <p className="text-xs font-medium text-white/70 mt-2 leading-relaxed">
                    Ensure all information is accurate. Students will receive an email with their login credentials upon successful enrollment.
                  </p>
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-white text-primary hover:bg-white/90 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-black/10"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {mode === "add" ? "Enroll Student" : "Save Changes"}
                </Button>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
              <CardHeader className="py-4 px-6 border-b border-border/50 bg-muted/5">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Admin Checklist</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-4">
                  {[
                    "Verified email address",
                    "Assigned correct batch",
                    "Selected payment plan",
                    "Profile photo uploaded"
                  ].map((tip, i) => (
                    <li key={i} className="flex items-center gap-3 text-xs font-bold text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

        </form>

      </div>
    </DashboardLayout>
  );
};

export default AddEditStudent;
