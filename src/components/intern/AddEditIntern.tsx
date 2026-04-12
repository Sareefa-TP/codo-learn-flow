import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  ChevronLeft,
  UserPlus,
  ArrowLeft,
  Save,
  Info,
  CheckCircle2,
  BookOpen,
  UserCheck
} from "lucide-react";
import { toast } from "sonner";
import { INTERNS, addIntern, Intern } from "@/data/internData";
import { useRole } from "@/hooks/useRole";

const AddEditIntern = () => {
  const navigate = useNavigate();
  const { role } = useRole();
  const basePath = role === "superadmin" ? "/superadmin" : "/admin";
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    role: "",
    batch: "",
    status: "Active" as "Active" | "Completed"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      toast.error("Full Name is required");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }
    if (!formData.email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!formData.course || !formData.role) {
      toast.error("Course / Role is required");
      return;
    }
    if (!formData.batch) {
      toast.error("Batch is required");
      return;
    }

    // Check uniqueness
    const emailExists = INTERNS.some(i => i.email.toLowerCase() === formData.email.toLowerCase());
    if (emailExists) {
      toast.error("An intern with this email already exists");
      return;
    }

    setIsSubmitting(true);

    // Simulate creation
    const newIntern: Intern = {
      id: `I${INTERNS.length + 1}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone || "Not Provided",
      course: formData.course,
      role: formData.role,
      batch: formData.batch,
      status: formData.status as "Active" | "Completed",
      joinedDate: new Date().toISOString().split('T')[0],
      performance: {
        taskCompletionRate: 0,
        submissionQuality: 0,
        attendanceRate: 0,
        overallScore: 0
      }
    };

    setTimeout(() => {
      addIntern(newIntern);
      toast.success("Intern onboarded successfully!");
      setIsSubmitting(false);
      navigate(`${basePath}/interns`);
    }, 800);
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-8 max-w-[1000px] mx-auto pb-20 px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
             <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate(`${basePath}/interns`)}
                className="rounded-xl hover:bg-muted h-10 w-10 shrink-0"
              >
                <ChevronLeft className="w-5 h-5" />
            </Button>
            <div>
               <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  Add New Intern
               </h1>
               <p className="text-muted-foreground text-sm flex items-center gap-1.5 mt-0.5 font-medium">
                  <UserPlus className="w-4 h-4 text-primary" />
                  Onboard a new intern to the platform
               </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <Button 
              variant="ghost" 
              onClick={() => navigate(`${basePath}/interns`)}
              className="rounded-xl h-11 px-6 font-bold text-muted-foreground hover:text-foreground"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="rounded-xl h-11 px-8 font-black uppercase tracking-tight text-xs shadow-lg shadow-primary/20 gap-2 transition-transform active:scale-95 bg-primary text-white"
            >
              <Save className="w-4 h-4" /> {isSubmitting ? "Creating..." : "Create Intern"}
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8">
          
          {/* SECTION A: BASIC INFO */}
          <Card className="border-border/50 shadow-sm rounded-2xl overflow-hidden bg-card">
             <div className="px-8 py-5 border-b border-border/50 flex items-center gap-3 bg-muted/30">
                <div className="p-2 bg-primary/10 rounded-lg"><Info className="w-3.5 h-3.5 text-primary" /></div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Basic Information</h3>
             </div>
             <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name <span className="text-destructive">*</span></Label>
                  <Input 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-12 bg-muted/20 border-border/50 rounded-xl font-bold" 
                    placeholder="e.g. Rahul Sharma"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address <span className="text-destructive">*</span></Label>
                  <Input 
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="h-12 bg-muted/20 border-border/50 rounded-xl font-bold" 
                    placeholder="rahul@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Phone Number</Label>
                  <Input 
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="h-12 bg-muted/20 border-border/50 rounded-xl font-bold" 
                    placeholder="+91 XXXXXXXXXX"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Current Status</Label>
                  <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as "Active" | "Completed" })}>
                    <SelectTrigger className="h-12 bg-muted/20 border-border/50 rounded-xl font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border/50 shadow-xl">
                      <SelectItem value="Active" className="font-bold py-2.5">Active</SelectItem>
                      <SelectItem value="Completed" className="font-bold py-2.5">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
             </CardContent>
          </Card>

          {/* SECTION B: ACADEMIC / ROLE INFO */}
          <Card className="border-border/50 shadow-sm rounded-2xl overflow-hidden bg-card">
             <div className="px-8 py-5 border-b border-border/50 flex items-center gap-3 bg-muted/30">
                <div className="p-2 bg-primary/10 rounded-lg"><BookOpen className="w-3.5 h-3.5 text-primary" /></div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Academic & Role Assignment</h3>
             </div>
             <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Course / Role <span className="text-destructive">*</span></Label>
                  <Select 
                    value={formData.role} 
                    onValueChange={(v) => {
                      const roleToCourse: Record<string, string> = {
                        "Frontend Intern": "Full Stack Development",
                        "Backend Intern": "Full Stack Development",
                        "Data Analyst Intern": "Python Data Science"
                      };
                      setFormData({ ...formData, role: v, course: roleToCourse[v] });
                    }}
                  >
                    <SelectTrigger className="h-12 bg-muted/20 border-border/50 rounded-xl font-bold">
                      <SelectValue placeholder="Identify Role" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border/50 shadow-xl">
                      <SelectItem value="Frontend Intern" className="font-bold py-2.5">Frontend Intern</SelectItem>
                      <SelectItem value="Backend Intern" className="font-bold py-2.5">Backend Intern</SelectItem>
                      <SelectItem value="Data Analyst Intern" className="font-bold py-2.5">Data Analyst Intern</SelectItem>
                    </SelectContent>
                  </Select>
                  {formData.course && (
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest ml-1 mt-1">
                      Mapped to: {formData.course}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Batch Assignment <span className="text-destructive">*</span></Label>
                  <Select value={formData.batch} onValueChange={(v) => setFormData({ ...formData, batch: v })}>
                    <SelectTrigger className="h-12 bg-muted/20 border-border/50 rounded-xl font-bold">
                      <SelectValue placeholder="Select Batch" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border/50 shadow-xl">
                      <SelectItem value="Jul 2025 Evening" className="font-bold py-2.5">Jul 2025 Evening</SelectItem>
                      <SelectItem value="Jan 2026 Cohort" className="font-bold py-2.5">Jan 2026 Cohort</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
             </CardContent>
          </Card>

          {/* FINAL ACTIONS */}
          <div className="flex items-center justify-end gap-4 bg-muted/30 p-8 rounded-3xl border border-border/40">
             <div className="mr-auto hidden sm:block">
                <p className="text-foreground text-xs font-bold leading-none">Onboarding Verification</p>
                <p className="text-muted-foreground text-[10px] font-medium mt-1">All fields marked with * are mandatory for creation.</p>
             </div>
             <Button 
                type="button"
                variant="outline" 
                onClick={() => navigate(`${basePath}/interns`)}
                className="rounded-xl h-12 px-8 font-bold border-border/50 hover:bg-background"
              >
                Abort
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="rounded-xl h-12 px-10 font-black uppercase tracking-widest text-[11px] shadow-xl shadow-primary/30 gap-2 transition-transform active:scale-95 bg-primary text-white"
              >
                {isSubmitting ? "Onboarding..." : "Confirm & Create Intern"}
              </Button>
          </div>
        </form>

      </div>
    </DashboardLayout>
  );
};

export default AddEditIntern;
