import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  PlusCircle, 
  Users, 
  Calendar, 
  Save, 
  X, 
  Info, 
  UserCircle2, 
  GraduationCap, 
  Hash, 
  FileText,
  Check,
  ChevronRight
} from "lucide-react";
import { SHARED_BATCHES, Batch } from "@/data/batchData";
import { courses } from "@/data/courseData";
import { mockTutors } from "@/data/mockTutors";
import { mockMentors } from "@/data/mockMentors";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const BatchForm = ({ mode }: { mode: "create" | "edit" }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<Batch>>({
    name: "",
    courseId: "",
    tutorId: "",
    mentorId: "",
    studentIds: [],
    startDate: "",
    endDate: "",
    status: "Upcoming",
    batchCode: "",
    notes: "",
    duration: "3 Months",
    progress: 0,
  });

  // Mock Students for enrollment
  const allStudents = [
    { id: "S1", name: "Alice Johnson", email: "alice@example.com" },
    { id: "S2", name: "Bob Smith", email: "bob@example.com" },
    { id: "S3", name: "Charlie Davis", email: "charlie@example.com" },
    { id: "S4", name: "Diana Prince", email: "diana@example.com" },
    { id: "S5", name: "Evan Wright", email: "evan@example.com" },
    { id: "S6", name: "Fiona Glenn", email: "fiona@example.com" },
  ];

  useEffect(() => {
    if (mode === "edit" && id) {
      const batch = SHARED_BATCHES.find((b) => b.id === id);
      if (batch) {
        setFormData(batch);
      }
    }
  }, [mode, id]);

  const isFormValid = Boolean(
    formData.name?.trim() &&
    formData.courseId &&
    formData.tutorId &&
    formData.mentorId &&
    formData.startDate &&
    formData.endDate &&
    formData.studentIds && formData.studentIds.length > 0
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Debug logging
    console.log("Submitting Batch Form:", formData);
    console.log("Is Form Valid:", isFormValid);

    if (!isFormValid) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields, including at least one student.",
        variant: "destructive",
      });
      return;
    }

    // Update global state logic
    const selectedCourse = courses.find(c => c.id === formData.courseId);
    if (mode === "create") {
      const newBatch: Batch = {
        ...formData as Batch,
        id: `B-${Date.now()}`,
        courseName: selectedCourse?.name || "Unknown Course",
        progress: 0,
        status: "Upcoming",
      };
      SHARED_BATCHES.unshift(newBatch);
      toast({ title: "Batch Created", description: "The new batch has been initialized." });
    } else {
      const index = SHARED_BATCHES.findIndex(b => b.id === id);
      if (index !== -1) {
        SHARED_BATCHES[index] = { 
          ...SHARED_BATCHES[index], 
          ...formData,
          courseName: selectedCourse?.name || "Unknown Course",
        } as Batch;
        toast({ title: "Batch Updated", description: "Batch details have been saved." });
      }
    }
    navigate("/admin/batch");
  };

  return (
    <DashboardLayout>
      <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Breadcrumb & Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-black uppercase tracking-widest">
              <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => navigate("/admin/batch")}>Batch</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-slate-900">{mode === "create" ? "Create" : "Edit"} Batch</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">
              {mode === "create" ? "Create New Batch" : "Edit Batch"}
            </h1>
          </div>
          <Button 
            variant="ghost" 
            onClick={() => navigate("/admin/batch")}
            className="h-10 w-10 p-0 rounded-full hover:bg-slate-100 transition-all"
          >
            <X className="w-5 h-5 text-slate-400" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* BASIC INFO */}
              <Card className="border-none shadow-2xl rounded-3xl overflow-hidden bg-white group">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4 transition-colors group-focus-within:bg-primary/[0.02]">
                  <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <div className="p-1.5 bg-indigo-50 rounded-lg"><Info className="w-3.5 h-3.5 text-indigo-600" /></div>
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="name" className="text-slate-700 font-bold text-xs uppercase tracking-tight flex items-center gap-2">
                        Batch Name <span className="text-rose-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        placeholder="e.g. Jan 2026 Alpha Cohort"
                        className="h-12 bg-slate-50 border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all font-medium text-slate-900"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="courseId" className="text-slate-700 font-bold text-xs uppercase tracking-tight">
                        Select Course <span className="text-rose-500">*</span>
                      </Label>
                      <Select 
                        value={formData.courseId} 
                        onValueChange={(val) => setFormData({ ...formData, courseId: val })}
                      >
                        <SelectTrigger className="h-12 bg-slate-50 border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all">
                          <SelectValue placeholder="Choose Program" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-slate-100 shadow-xl p-1">
                          {courses.map((course) => (
                            <SelectItem key={course.id} value={course.id} className="rounded-xl">{course.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="batchCode" className="text-slate-700 font-bold text-xs uppercase tracking-tight">
                        Batch Code (Optional)
                      </Label>
                      <div className="relative">
                        <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 font-medium" />
                        <Input
                          id="batchCode"
                          placeholder="FSD-26-A"
                          className="pl-10 h-11 bg-slate-50 border-slate-200 rounded-2xl focus:bg-white transition-all font-medium"
                          value={formData.batchCode}
                          onChange={(e) => setFormData({ ...formData, batchCode: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-slate-700 font-bold text-xs uppercase tracking-tight">
                      Notes (Optional)
                    </Label>
                    <div className="relative">
                      <FileText className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
                      <Textarea
                        id="notes"
                        placeholder="Internal notes about this batch..."
                        className="pl-10 min-h-[120px] bg-slate-50 border-slate-200 rounded-3xl focus:bg-white transition-all font-medium py-4"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* SCHEDULE */}
              <Card className="border-none shadow-2xl rounded-3xl overflow-hidden bg-white">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4 transition-colors group-focus-within:bg-primary/[0.02]">
                  <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <div className="p-1.5 bg-rose-50 rounded-lg"><Calendar className="w-3.5 h-3.5 text-rose-600" /></div>
                    Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="startDate" className="text-slate-700 font-bold text-xs uppercase tracking-tight">Start Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                          id="startDate"
                          type="date"
                          className="pl-10 h-12 bg-slate-50 border-slate-200 rounded-2xl focus:bg-white transition-all font-medium"
                          value={formData.startDate}
                          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate" className="text-slate-700 font-bold text-xs uppercase tracking-tight">End Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                          id="endDate"
                          type="date"
                          className="pl-10 h-12 bg-slate-50 border-slate-200 rounded-2xl focus:bg-white transition-all font-medium"
                          value={formData.endDate}
                          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              {/* ASSIGN PEOPLE */}
              <Card className="border-none shadow-2xl rounded-3xl overflow-hidden bg-white lg:sticky lg:top-8">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4 transition-colors group-focus-within:bg-primary/[0.02]">
                  <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <div className="p-1.5 bg-emerald-50 rounded-lg"><Users className="w-3.5 h-3.5 text-emerald-600" /></div>
                    Assign People
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="tutorId" className="text-slate-700 font-bold text-xs uppercase tracking-tight flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Assign Tutor
                      </Label>
                      <Select 
                        value={formData.tutorId} 
                        onValueChange={(val) => setFormData({ ...formData, tutorId: val })}
                      >
                        <SelectTrigger className="h-12 bg-slate-50 border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all font-bold text-slate-900">
                          <SelectValue placeholder="Select Tutor" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-slate-100 shadow-xl p-1">
                          {mockTutors.map((t) => (
                            <SelectItem key={t.id} value={t.id} className="rounded-xl">{t.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mentorId" className="text-slate-700 font-bold text-xs uppercase tracking-tight flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Assign Mentor
                      </Label>
                      <Select 
                        value={formData.mentorId} 
                        onValueChange={(val) => setFormData({ ...formData, mentorId: val })}
                      >
                        <SelectTrigger className="h-12 bg-slate-50 border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all font-bold text-slate-900">
                          <SelectValue placeholder="Select Mentor" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-slate-100 shadow-xl p-1">
                          {mockMentors.map((m) => (
                            <SelectItem key={m.id} value={m.id} className="rounded-xl">{m.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100">
                    <Label className="text-slate-700 font-bold text-xs uppercase tracking-tight flex items-center justify-between mb-4">
                      Assign Students
                      <Badge className="bg-primary/10 text-primary border-none font-black text-[10px]">{formData.studentIds?.length || 0} Selected</Badge>
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="w-full h-14 justify-between bg-white border-dashed border-2 border-slate-200 rounded-2xl px-4 font-black text-slate-400 hover:border-primary hover:text-primary hover:bg-primary/[0.02] transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <PlusCircle className="w-5 h-5 opacity-50" />
                            {formData.studentIds?.length ? "Modify Students" : "Add Students"}
                          </div>
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-0 rounded-2xl overflow-hidden shadow-2xl border-slate-100" align="end">
                        <div className="p-3 bg-slate-50 border-b border-slate-100 font-black text-[10px] uppercase tracking-widest text-slate-400 flex items-center justify-between">
                          Available Students
                          <span className="text-primary">{allStudents.length} Students</span>
                        </div>
                        <div className="max-h-80 overflow-y-auto p-1.5 custom-scrollbar">
                          {allStudents.map((s) => (
                            <div 
                              key={s.id} 
                              className="flex items-center space-x-3 p-3 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors" 
                              onClick={() => {
                                const cur = formData.studentIds || [];
                                const updated = cur.includes(s.id) ? cur.filter(id => id !== s.id) : [...cur, s.id];
                                setFormData({ ...formData, studentIds: updated });
                              }}
                            >
                              <Checkbox checked={formData.studentIds?.includes(s.id)} className="rounded-md h-5 w-5 border-slate-300" />
                              <div className="flex flex-col">
                                <span className="text-sm font-bold text-slate-800">{s.name}</span>
                                <span className="text-[10px] font-medium text-slate-400">{s.email}</span>
                              </div>
                              {formData.studentIds?.includes(s.id) && <Check className="w-3.5 h-3.5 text-primary ml-auto stroke-[3]" />}
                            </div>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end items-center pt-8 border-t border-slate-100 mt-12 mb-8">
            <Button
              type="submit"
              disabled={!isFormValid}
              className={cn(
                "h-14 px-12 rounded-2xl font-black text-lg shadow-2xl transition-all flex items-center gap-3 active:scale-95 translate-y-[2px]",
                isFormValid 
                  ? "bg-primary hover:bg-primary/90 text-white shadow-primary/30" 
                  : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
              )}
            >
              <Save className="w-5 h-5" />
              {mode === "create" ? "Create Batch" : "Update Batch"}
            </Button>
          </div>
        </form>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </DashboardLayout>
  );
};

export default BatchForm;
