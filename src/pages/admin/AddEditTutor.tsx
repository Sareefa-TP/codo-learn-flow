import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  Save,
  Trash2,
  Plus,
  BookOpen,
  Info,
  CheckCircle2,
  X,
  Lock,
  UserCheck
} from "lucide-react";
import { toast } from "sonner";
import { mockTutors } from "@/data/mockTutors";
import { cn } from "@/lib/utils";

interface AddEditTutorProps {
  mode: "add" | "edit";
}

// Mock Data for logic
const availableCourses = [
  { id: "c1", name: "Full Stack Development", batches: ["FS-JAN-24", "FS-FEB-24", "FS-MAR-24"] },
  { id: "c2", name: "Python Zero to Hero", batches: ["PY-JAN-24", "PY-FEB-24"] },
  { id: "c3", name: "UI/UX Design Masterclass", batches: ["UI-JAN-24", "UI-FEB-24", "UI-MAR-24"] },
];

const AddEditTutor = ({ mode }: AddEditTutorProps) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    status: "Active",
  });

  const [assignedCourses, setAssignedCourses] = useState<{ courseId: string; batches: string[] }[]>([]);

  useEffect(() => {
    if (mode === "edit" && id) {
      const tutor = mockTutors.find(t => t.id === id);
      if (tutor) {
        setFormData({
          name: tutor.name,
          email: tutor.email,
          phone: tutor.phone,
          password: "", // Don't load password in edit
          status: tutor.status,
        });
        setAssignedCourses(tutor.courses.map(c => ({ courseId: c.id, batches: c.batches })));
      }
    }
  }, [mode, id]);

  const handleAddCourse = () => {
    setAssignedCourses([...assignedCourses, { courseId: "", batches: [] }]);
  };

  const handleRemoveCourse = (index: number) => {
    setAssignedCourses(assignedCourses.filter((_, i) => i !== index));
  };

  const handleCourseChange = (index: number, courseId: string) => {
    const updated = [...assignedCourses];
    updated[index] = { courseId, batches: [] }; // Reset batches when course changes
    setAssignedCourses(updated);
  };

  const handleBatchToggle = (courseIndex: number, batch: string) => {
    const updated = [...assignedCourses];
    const batches = updated[courseIndex].batches;
    if (batches.includes(batch)) {
      updated[courseIndex].batches = batches.filter(b => b !== batch);
    } else {
      updated[courseIndex].batches = [...batches, batch];
    }
    setAssignedCourses(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || (mode === "add" && !formData.password)) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Basic email validation
    if (!formData.email.includes("@")) {
        toast.error("Please enter a valid email address.");
        return;
    }

    toast.success(`Tutor ${mode === "add" ? "added" : "updated"} successfully!`);
    navigate("/admin/tutor");
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
                onClick={() => navigate("/admin/tutor")}
                className="rounded-xl hover:bg-slate-100 h-10 w-10 shrink-0"
              >
                <ChevronLeft className="w-5 h-5" />
            </Button>
            <div>
               <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  {mode === "add" ? "Add New Tutor" : "Edit Tutor Profile"}
               </h1>
               <p className="text-muted-foreground text-sm flex items-center gap-1.5 mt-0.5 font-medium">
                  {mode === "add" ? <Plus className="w-4 h-4 text-primary" /> : <UserCheck className="w-4 h-4 text-primary" />}
                  {mode === "add" ? "Onboard a new educator to the platform" : `Modifying profile for ${formData.name}`}
               </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <Button 
              variant="ghost" 
              onClick={() => navigate("/admin/tutor")}
              className="rounded-xl h-11 px-6 font-bold text-slate-500 hover:text-slate-900"
            >
              Cancel Operation
            </Button>
            <Button 
              onClick={handleSubmit}
              className="rounded-xl h-11 px-8 font-black uppercase tracking-tight text-xs shadow-lg shadow-primary/20 gap-2 transition-transform active:scale-95"
            >
              <Save className="w-4 h-4" /> {mode === "add" ? "Save Tutor" : "Update Profile"}
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8">
          
          {/* SECTION A: BASIC INFO */}
          <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white ring-1 ring-slate-100">
             <div className="px-8 py-5 border-b border-slate-50 flex items-center gap-3 bg-slate-50/30">
                <div className="p-2 bg-indigo-50 rounded-lg"><Info className="w-3.5 h-3.5 text-indigo-600" /></div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Identity & Credentials</h3>
             </div>
             <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name <span className="text-red-500">*</span></Label>
                  <Input 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-12 bg-slate-50/50 border-slate-100/50 rounded-xl font-bold text-slate-900" 
                    placeholder="e.g. Dr. Emily Carter"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address <span className="text-red-500">*</span></Label>
                  <Input 
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="h-12 bg-slate-50/50 border-slate-100/50 rounded-xl font-bold text-slate-900" 
                    placeholder="emily@codo.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Phone Number <span className="text-red-500">*</span></Label>
                  <Input 
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="h-12 bg-slate-50/50 border-slate-100/50 rounded-xl font-bold text-slate-900" 
                    placeholder="+91 XXXXXXXXXX"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Account Status</Label>
                  <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                    <SelectTrigger className="h-12 bg-slate-50/50 border-slate-100/50 rounded-xl font-bold text-slate-900">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-xl">
                      <SelectItem value="Active" className="font-bold py-2.5">Active Access</SelectItem>
                      <SelectItem value="Inactive" className="font-bold py-2.5">Restricted / Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {mode === "add" && (
                    <div className="space-y-2 md:col-span-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Initial Password <span className="text-red-500">*</span></Label>
                      <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                          <Input 
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="pl-11 h-12 bg-slate-50/50 border-slate-100/50 rounded-xl font-bold text-slate-900" 
                            placeholder="Min. 8 characters"
                          />
                      </div>
                    </div>
                )}
             </CardContent>
          </Card>

          {/* SECTION B: ASSIGNMENTS */}
          <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white ring-1 ring-slate-100">
             <div className="px-8 py-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-50 rounded-lg"><BookOpen className="w-3.5 h-3.5 text-purple-600" /></div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Course & Batch Logic</h3>
                </div>
                <Button 
                    type="button"
                    variant="outline" 
                    size="sm" 
                    onClick={handleAddCourse}
                    className="h-8 rounded-lg font-black text-[9px] uppercase border-slate-200 gap-1.5"
                >
                    <Plus className="w-3 h-3" /> Assign Course
                </Button>
             </div>
             <CardContent className="p-8 space-y-10">
                {assignedCourses.length > 0 ? (
                    assignedCourses.map((assignment, assignmentIndex) => {
                        const selectedCourse = availableCourses.find(c => c.id === assignment.courseId);
                        
                        return (
                            <div key={assignmentIndex} className="p-6 rounded-2xl bg-slate-50/50 border border-slate-100 relative group animate-in zoom-in-95 duration-200">
                                <Button 
                                    type="button"
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => handleRemoveCourse(assignmentIndex)}
                                    className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-white shadow-sm border border-slate-100 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </Button>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">Primary Course Track</Label>
                                        <Select 
                                            value={assignment.courseId} 
                                            onValueChange={(v) => handleCourseChange(assignmentIndex, v)}
                                        >
                                            <SelectTrigger className="h-11 bg-white border-slate-200 rounded-xl font-bold text-slate-900 shadow-sm transition-all focus:ring-primary/20">
                                                <SelectValue placeholder="Identify Course" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl border-none shadow-xl">
                                                {availableCourses.map(c => (
                                                    <SelectItem key={c.id} value={c.id} className="font-bold py-2.5 rounded-lg">{c.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="md:col-span-2 space-y-4">
                                        <Label className={cn(
                                            "text-[10px] font-black uppercase tracking-tighter block mb-3",
                                            !assignment.courseId ? "text-slate-200" : "text-slate-400"
                                        )}>
                                            Target Batches {assignment.courseId && <span className="text-primary italic">(Multiselect)</span>}
                                        </Label>
                                        
                                        {!assignment.courseId ? (
                                            <div className="h-11 flex items-center px-4 rounded-xl border border-dashed border-slate-200 bg-white/50 text-[10px] font-bold text-slate-300 italic">
                                                Select a course to populate active batches...
                                            </div>
                                        ) : (
                                            <div className="flex flex-wrap gap-2.5">
                                                {selectedCourse?.batches.map(batch => {
                                                    const isSelected = assignment.batches.includes(batch);
                                                    return (
                                                        <div 
                                                            key={batch}
                                                            onClick={() => handleBatchToggle(assignmentIndex, batch)}
                                                            className={cn(
                                                                "px-4 py-2.5 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-2 select-none",
                                                                isSelected 
                                                                    ? "border-primary bg-primary/5 text-primary shadow-sm" 
                                                                    : "border-white bg-white text-slate-400 hover:border-slate-100 hover:text-slate-600"
                                                            )}
                                                        >
                                                            <div className={cn(
                                                                "w-3.5 h-3.5 rounded flex items-center justify-center transition-all",
                                                                isSelected ? "bg-primary text-white" : "bg-slate-50 border border-slate-200"
                                                            )}>
                                                                {isSelected && <CheckCircle2 className="w-2.5 h-2.5" />}
                                                            </div>
                                                            <span className="text-[10px] font-black uppercase tracking-widest">{batch}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-3xl space-y-4 bg-slate-50/30">
                        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm">
                           <BookOpen className="w-8 h-8 text-slate-200" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-bold text-slate-600 italic">No courses currently assigned</p>
                            <p className="text-[10px] font-medium text-slate-400 mt-1">Start by clicking the 'Assign Course' button above</p>
                        </div>
                        <Button 
                            type="button"
                            variant="default" 
                            onClick={handleAddCourse}
                            className="rounded-xl h-10 px-6 font-bold text-xs"
                        >
                            Initial Assignment
                        </Button>
                    </div>
                )}
             </CardContent>
          </Card>

          {/* FINAL ACTIONS */}
          <div className="flex items-center justify-end gap-4 bg-slate-900 p-8 rounded-3xl shadow-2xl shadow-slate-900/10">
             <div className="mr-auto hidden sm:block">
                <p className="text-white text-xs font-bold leading-none">Status Verification</p>
                <p className="text-slate-400 text-[10px] font-medium mt-1">All fields marked with * are mandatory for onboarding.</p>
             </div>
             <Button 
                type="button"
                variant="ghost" 
                onClick={() => navigate("/admin/tutor")}
                className="rounded-xl h-12 px-8 font-bold text-slate-300 hover:text-white hover:bg-white/5"
              >
                Abort Changes
              </Button>
              <Button 
                onClick={handleSubmit}
                className="rounded-xl h-12 px-10 font-black uppercase tracking-widest text-[11px] shadow-xl shadow-primary/30 gap-2 transition-transform active:scale-95 bg-primary text-white"
              >
                {mode === "add" ? "Confirm & Save Educator" : "Update Records"}
              </Button>
          </div>
        </form>

      </div>
    </DashboardLayout>
  );
};

export default AddEditTutor;
