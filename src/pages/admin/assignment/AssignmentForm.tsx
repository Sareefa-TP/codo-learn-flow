import { useState, useEffect, useRef } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Save, 
  Upload, 
  Link as LinkIcon, 
  FileText,
  Layers,
  GraduationCap,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  Search,
  X,
  Plus,
  Pencil
} from "lucide-react";
import { SHARED_ASSIGNMENTS, addAssignment, updateAssignment, getAssignmentById } from "@/data/assignmentData";
import { courses, Course, Module, Session } from "@/data/courseData";
import { SHARED_BATCHES } from "@/data/batchData";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface AssignmentFormProps {
  mode: "create" | "edit";
}

const AssignmentForm = ({ mode }: AssignmentFormProps) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    courseId: "",
    moduleId: "",
    sessionId: "",
    batchId: "",
    studentIds: [] as string[],
    dueDate: "",
    maxMarks: 100,
    files: [] as string[],
    status: "Published" as "Draft" | "Published",
    allowLateSubmission: false,
    externalLink: "",
    createdAt: ""
  });

  // Dynamic Data
  const [availableModules, setAvailableModules] = useState<Module[]>([]);
  const [availableSessions, setAvailableSessions] = useState<Session[]>([]);
  const [availableBatches, setAvailableBatches] = useState<any[]>([]);

  useEffect(() => {
    if (mode === "edit" && id) {
      const assignment = getAssignmentById(id);
      if (assignment) {
        setFormData({
          ...formData,
          ...assignment,
          allowLateSubmission: (assignment as any).allowLateSubmission || false,
          externalLink: (assignment as any).externalLink || ""
        });
      }
    }
  }, [mode, id]);

  // Update modules and batches when course changes
  useEffect(() => {
    if (formData.courseId) {
      const course = courses.find(c => c.id === formData.courseId);
      if (course) {
        setAvailableModules(course.modules);
        setAvailableBatches(SHARED_BATCHES.filter(b => b.courseId === formData.courseId));
      }
    } else {
      setAvailableModules([]);
      setAvailableBatches([]);
    }
  }, [formData.courseId]);

  // Update sessions when module changes
  useEffect(() => {
    if (formData.moduleId && formData.courseId) {
      const course = courses.find(c => c.id === formData.courseId);
      const module = course?.modules.find(m => m.id === formData.moduleId);
      if (module) {
        setAvailableSessions(module.sessions);
      }
    } else {
      setAvailableSessions([]);
    }
  }, [formData.moduleId, formData.courseId]);

  // Update students when batch changes
  useEffect(() => {
    if (formData.batchId && mode === "create") {
      const batch = SHARED_BATCHES.find(b => b.id === formData.batchId);
      if (batch) {
        setFormData(prev => ({ ...prev, studentIds: batch.studentIds }));
      }
    }
  }, [formData.batchId, mode]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      console.log("Selected files:", selectedFiles);
      const fileNames = Array.from(selectedFiles).map(file => file.name);
      setFormData(prev => ({ ...prev, files: [...prev.files, ...fileNames] }));
      
      toast({
        title: "Files Attached",
        description: `Successfully attached ${selectedFiles.length} file(s).`,
      });
    }
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === "create") {
      const newId = `A-${Math.floor(1000 + Math.random() * 9000)}`;
      addAssignment({
        ...formData,
        id: newId,
        createdAt: new Date().toISOString()
      });
      toast({
        title: "Assignment Created",
        description: `Successfully created "${formData.title}"`,
      });
    } else {
      updateAssignment({
        ...formData,
        createdAt: formData.createdAt || new Date().toISOString()
      });
      toast({
        title: "Assignment Updated",
        description: `Successfully updated "${formData.title}"`,
      });
    }
    
    navigate("/admin/assignments");
  };

  const isFormValid = formData.title && formData.description && formData.courseId && formData.batchId && formData.dueDate;

  return (
    <DashboardLayout>
      <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Breadcrumb & Header */}
        <div className="flex flex-col gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/admin/assignments")}
            className="w-fit gap-2 font-bold text-slate-500 hover:text-primary transition-colors p-0 hover:bg-transparent"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Assignments
          </Button>
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-black tracking-tight text-slate-900">
              {mode === "create" ? "Create New Assignment" : "Edit Assignment"}
            </h1>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100 font-bold text-slate-500 text-sm">
              {mode === "create" ? <Plus className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
              {mode === "create" ? "Draft Mode" : "Modifying"}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 pb-12">
          {/* SECTION 1: BASIC INFO */}
          <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 p-8 border-b border-slate-100 flex flex-row items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-primary">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-2xl font-black text-slate-900">Basic Information</CardTitle>
                <p className="text-slate-500 font-medium text-sm">Set the core details of the assignment</p>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                <Label className="text-slate-700 font-bold text-xs uppercase tracking-tight">Assignment Title <span className="text-rose-500">*</span></Label>
                <Input
                  placeholder="e.g. React Components Challenge"
                  className="h-12 bg-slate-50 border-slate-200 rounded-2xl transition-all"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700 font-bold text-xs uppercase tracking-tight">Description <span className="text-rose-500">*</span></Label>
                <Textarea
                  placeholder="Provide clear instructions for students..."
                  className="min-h-[120px] bg-slate-50 border-slate-200 rounded-2xl transition-all p-4"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* SECTION 2: LINK STRUCTURE */}
          <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 p-8 border-b border-slate-100 flex flex-row items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-amber-500">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-2xl font-black text-slate-900">Link Structure</CardTitle>
                <p className="text-slate-500 font-medium text-sm">Link assignment to course, module, and session</p>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-slate-700 font-bold text-xs uppercase tracking-tight">Select Course <span className="text-rose-500">*</span></Label>
                  <Select 
                    value={formData.courseId} 
                    onValueChange={(val) => setFormData({ ...formData, courseId: val, moduleId: "", sessionId: "", batchId: "" })}
                  >
                    <SelectTrigger className="h-12 bg-slate-50 border-slate-200 rounded-2xl font-bold">
                      <SelectValue placeholder="Choose a course" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                      {courses.map(course => (
                        <SelectItem key={course.id} value={course.id}>{course.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-700 font-bold text-xs uppercase tracking-tight">Select Batch <span className="text-rose-500">*</span></Label>
                  <Select 
                    value={formData.batchId} 
                    onValueChange={(val) => setFormData({ ...formData, batchId: val })}
                    disabled={!formData.courseId}
                  >
                    <SelectTrigger className="h-12 bg-slate-50 border-slate-200 rounded-2xl font-bold">
                      <SelectValue placeholder={formData.courseId ? "Choose a batch" : "Select a course first"} />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                      {availableBatches.map(batch => (
                        <SelectItem key={batch.id} value={batch.id}>{batch.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-700 font-bold text-xs uppercase tracking-tight">Select Module</Label>
                  <Select 
                    value={formData.moduleId} 
                    onValueChange={(val) => setFormData({ ...formData, moduleId: val, sessionId: "" })}
                    disabled={!formData.courseId}
                  >
                    <SelectTrigger className="h-12 bg-slate-50 border-slate-200 rounded-2xl">
                      <SelectValue placeholder={formData.courseId ? "Choose a module" : "Select a course first"} />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                      {availableModules.map(module => (
                        <SelectItem key={module.id} value={module.id}>{module.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-700 font-bold text-xs uppercase tracking-tight">Select Session</Label>
                  <Select 
                    value={formData.sessionId} 
                    onValueChange={(val) => setFormData({ ...formData, sessionId: val })}
                    disabled={!formData.moduleId}
                  >
                    <SelectTrigger className="h-12 bg-slate-50 border-slate-200 rounded-2xl">
                      <SelectValue placeholder={formData.moduleId ? "Choose a session" : "Select a module first"} />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                      {availableSessions.map(session => (
                        <SelectItem key={session.id} value={session.id}>{session.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SECTION 3: DEADLINE & CONTENT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white h-fit">
              <CardHeader className="bg-slate-50/50 p-8 border-b border-slate-100 flex flex-row items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-rose-500">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-black text-slate-900">Deadline & Scoring</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <Label className="text-slate-700 font-bold text-xs uppercase tracking-tight">Due Date <span className="text-rose-500">*</span></Label>
                  <Input
                    type="date"
                    className="h-12 bg-slate-50 border-slate-200 rounded-2xl"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-700 font-bold text-xs uppercase tracking-tight">Maximum Marks <span className="text-rose-500">*</span></Label>
                  <Input
                    type="number"
                    className="h-12 bg-slate-50 border-slate-200 rounded-2xl font-bold"
                    value={formData.maxMarks}
                    onChange={(e) => setFormData({ ...formData, maxMarks: parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="space-y-0.5">
                    <Label className="font-bold text-slate-900">Allow Late Submission</Label>
                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">Post-deadline grading</p>
                  </div>
                  <Switch 
                    checked={formData.allowLateSubmission}
                    onCheckedChange={(checked) => setFormData({ ...formData, allowLateSubmission: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white h-fit">
              <CardHeader className="bg-slate-50/50 p-8 border-b border-slate-100 flex flex-row items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-500">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-black text-slate-900">Resources & Settings</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <Label className="text-slate-700 font-bold text-xs uppercase tracking-tight">External Link (Optional)</Label>
                  <div className="relative">
                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="https://github.com/..."
                      className="h-12 bg-slate-50 border-slate-200 rounded-2xl pl-12"
                      value={formData.externalLink}
                      onChange={(e) => setFormData({ ...formData, externalLink: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-700 font-bold text-xs uppercase tracking-tight">Publication Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(val: "Draft" | "Published") => setFormData({ ...formData, status: val })}
                  >
                    <SelectTrigger className="h-12 bg-slate-50 border-slate-200 rounded-2xl font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                      <SelectItem value="Published">Published (Live for students)</SelectItem>
                      <SelectItem value="Draft">Draft (Only visible to admin)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    multiple
                    className="hidden"
                    id="assignment-files"
                  />
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-14 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-500 font-bold gap-2"
                  >
                    <Upload className="w-5 h-5" />
                    Attach Instructions PDF
                  </Button>
                  
                  {formData.files.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Attached Files</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.files.map((fileName, idx) => (
                          <Badge key={idx} variant="secondary" className="bg-slate-100 text-slate-600 border-slate-200 py-1.5 px-3 rounded-xl flex items-center gap-2 group">
                            <FileText className="w-3 h-3 text-slate-400" />
                            <span className="max-w-[150px] truncate font-bold text-xs">{fileName}</span>
                            <button 
                              type="button"
                              onClick={() => removeFile(idx)}
                              className="text-slate-400 hover:text-rose-500 transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* SECTION 4: STUDENT ASSIGNMENT */}
          <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
            <CardHeader className="bg-slate-50/50 p-8 border-b border-slate-100 flex flex-row items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-emerald-500">
                <Users className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl font-black text-slate-900">Student Assignment</CardTitle>
                <p className="text-slate-500 font-medium text-sm">Review students assigned to this assignment</p>
              </div>
              <Badge className="h-8 rounded-xl bg-emerald-100 text-emerald-700 px-4 font-black">
                {formData.studentIds.length} Students
              </Badge>
            </CardHeader>
            <CardContent className="p-8">
              {!formData.batchId ? (
                <div className="p-12 text-center border-2 border-dashed border-slate-100 rounded-[2rem] space-y-4">
                  <div className="p-4 bg-slate-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto text-slate-300">
                    <Users className="w-8 h-8" />
                  </div>
                  <p className="text-slate-400 font-bold">Select a batch to load student list</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-[300px] overflow-y-auto px-2 custom-scrollbar">
                  {formData.studentIds.map(sid => (
                    <div key={sid} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-xs font-black text-slate-400 border border-slate-100">
                        {sid}
                      </div>
                      <span className="text-xs font-bold text-slate-700 truncate">Student {sid}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

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
              {mode === "create" ? "Create Assignment" : "Update Assignment"}
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

export default AssignmentForm;
