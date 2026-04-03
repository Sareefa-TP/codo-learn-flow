import { useState, useEffect } from "react";
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

// --- Mock Data ---

const AVAILABLE_COURSES = [
  "Full Stack Development",
  "Python Data Science",
  "UI/UX Design",
  "Digital Marketing",
  "Cyber Security",
  "Mobile App Development"
];

const AVAILABLE_BATCHES = [
  "FS-JAN-24", "FS-FEB-24", "PY-JAN-24", "UI-FEB-24", "DM-MAR-24", "CS-JAN-24"
];

interface EnrolledCourse {
  courseName: string;
  batch: string;
}

const AddEditStudent = ({ mode = "add" }: { mode?: "add" | "edit" }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    status: "Active",
  });

  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (mode === "edit" && id) {
      // Mock fetching student data
      setFormData({
        name: "Sarah Connor",
        email: "sarah.c@example.com",
        phone: "+1 234 567 890",
        password: "", // Don't show password in edit
        status: "Active",
      });
      setEnrolledCourses([
        { courseName: "Full Stack Development", batch: "FS-JAN-24" },
        { courseName: "UI/UX Design", batch: "UI-FEB-24" }
      ]);
    }
  }, [mode, id]);

  const handleAddCourse = () => {
    setEnrolledCourses([...enrolledCourses, { courseName: "", batch: "" }]);
  };

  const handleRemoveCourse = (index: number) => {
    setEnrolledCourses(enrolledCourses.filter((_, i) => i !== index));
  };

  const handleCourseChange = (index: number, field: keyof EnrolledCourse, value: string) => {
    const updated = [...enrolledCourses];
    updated[index][field] = value;
    setEnrolledCourses(updated);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = "Full Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (mode === "add" && !formData.password) newErrors.password = "Password is required";
    if (enrolledCourses.length === 0) newErrors.courses = "At least one course must be assigned";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Logic for saving data...
    toast({
      title: mode === "add" ? "Student Enrolled" : "Profile Updated",
      description: `${formData.name} has been successfully ${mode === "add" ? "added to the system" : "updated"}.`,
    });
    navigate("/admin/students");
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6 max-w-[1000px] mx-auto pb-10 px-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/admin/students")}
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
                  onClick={handleAddCourse}
                  variant="outline" 
                  size="sm" 
                  className="rounded-lg h-8 px-3 text-[10px] font-black uppercase tracking-widest border-primary/20 text-primary hover:bg-primary/5"
                >
                  <Plus className="w-3 h-3 mr-1" /> Add Course
                </Button>
              </CardHeader>
              <CardContent className="p-8 space-y-4">
                {enrolledCourses.length === 0 ? (
                  <div className="py-12 text-center space-y-4 bg-muted/5 rounded-3xl border border-dashed border-border/50">
                    <div className="w-12 h-12 bg-muted/50 rounded-full flex items-center justify-center mx-auto">
                      <BookOpen className="w-6 h-6 text-muted-foreground/50" />
                    </div>
                    <p className="text-xs font-bold text-muted-foreground">No courses assigned yet.</p>
                  </div>
                ) : (
                  enrolledCourses.map((ec, idx) => (
                    <div key={idx} className="flex flex-col md:flex-row items-center gap-4 p-5 bg-muted/10 rounded-2xl border border-border/30 group animate-in slide-in-from-left-4 duration-300">
                      <div className="flex-1 w-full space-y-1">
                        <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground pl-1">Course</Label>
                        <Select value={ec.courseName} onValueChange={(val) => handleCourseChange(idx, "courseName", val)}>
                          <SelectTrigger className="h-10 bg-background border-none rounded-xl font-bold text-xs ring-1 ring-border/50">
                            <SelectValue placeholder="Select Course" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-none shadow-xl">
                            {AVAILABLE_COURSES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex-1 w-full space-y-1">
                        <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground pl-1">Batch</Label>
                        <Select value={ec.batch} onValueChange={(val) => handleCourseChange(idx, "batch", val)}>
                          <SelectTrigger className="h-10 bg-background border-none rounded-xl font-bold text-xs ring-1 ring-border/50">
                            <SelectValue placeholder="Select Batch" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-none shadow-xl">
                            {AVAILABLE_BATCHES.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button 
                        type="button" 
                        onClick={() => handleRemoveCourse(idx)}
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
