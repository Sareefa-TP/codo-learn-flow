import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  ArrowLeft, 
  Save, 
  X, 
  Image as ImageIcon, 
  Clock, 
  BarChart, 
  Layers,
  BookOpen,
  Users,
  Calendar,
  Check,
  PlusCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { courses, addCourse, updateCourse, Course } from "@/data/courseData";
import { mockTutors } from "@/data/mockTutors";
import { mockMentors } from "@/data/mockMentors";
import { SHARED_BATCHES } from "@/data/batchData";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

/**
 * ADMIN PERMISSION COMPLIANCE:
 * Per requirements, the Admin must have FULL control over all course fields
 * regardless of the 'Draft' or 'Published' status. No fields should be disabled.
 */

interface AddEditCourseProps {
  mode: "create" | "edit";
}

const AddEditCourse = ({ mode }: AddEditCourseProps) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<Course>>({
    name: "",
    description: "",
    category: "",
    duration: "",
    level: "Beginner",
    status: "Draft",
    thumbnail: "",
    tutors: [],
    mentors: [],
    students: [],
    batches: [],
    startDate: "",
    endDate: "",
  });

  // Mock Students for Selection
  const mockStudents = [
    { id: "S1", name: "Alice Johnson" },
    { id: "S2", name: "Bob Smith" },
    { id: "S3", name: "Charlie Davis" },
    { id: "S4", name: "Diana Prince" },
    { id: "S5", name: "Evan Wright" },
  ];

  useEffect(() => {
    if (mode === "edit" && id) {
      const course = courses.find((c) => c.id === id);
      if (course) {
        setFormData(course);
      }
    }
  }, [mode, id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "create") {
      const newCourse: Course = {
        id: `C-${Date.now()}`,
        name: formData.name || "",
        description: formData.description || "" || "",
        category: formData.category || "",
        duration: formData.duration || "",
        level: formData.level as any || "Beginner",
        status: formData.status as any || "Draft",
        thumbnail: formData.thumbnail || "",
        createdDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        modules: [],
        totalStudents: formData.students?.length || 0,
        totalBatches: formData.batches?.length || 0,
        tutors: formData.tutors || [],
        mentors: formData.mentors || [],
        students: formData.students || [],
        batches: formData.batches || [],
        startDate: formData.startDate,
        endDate: formData.endDate
      };
      addCourse(newCourse);
      toast({ title: "Course Created", description: "Successfully created new course." });
    } else {
      updateCourse(formData as Course);
      toast({ title: "Course Updated", description: "Changes saved successfully." });
    }

    navigate("/admin/courses");
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 max-w-4xl mx-auto pb-10">
        {/* PAGE HEADER */}
        <div className="flex flex-col gap-2">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/admin/courses")}
            className="w-fit -ml-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Button>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-900">
              {mode === "create" ? "Create New Course" : `Edit Course: ${formData.name}`}
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* SECTION A: BASIC INFO */}
          <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <div className="p-1.5 bg-indigo-50 rounded-lg"><BookOpen className="w-3.5 h-3.5 text-indigo-600" /></div>
                Course Identity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5 bg-white">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-700 font-bold text-xs uppercase tracking-tight">Course Name <span className="text-rose-500">*</span></Label>
                <Input
                  id="name"
                  placeholder="e.g. Full Stack Development"
                  className="h-11 bg-slate-50 border-slate-200 rounded-xl focus:bg-white"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-700 font-bold text-xs uppercase tracking-tight">Full Description <span className="text-rose-500">*</span></Label>
                <Textarea
                  id="description"
                  placeholder="Provide a detailed overview of the course content and learning outcomes..."
                  className="min-h-[120px] bg-slate-50 border-slate-200 rounded-xl focus:bg-white"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-slate-700 font-bold text-xs uppercase tracking-tight">Category <span className="text-rose-500">*</span></Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(val) => setFormData({ ...formData, category: val })}
                  >
                    <SelectTrigger className="h-11 bg-slate-50 border-slate-200 rounded-xl focus:bg-white">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="Web Development">Web Development</SelectItem>
                      <SelectItem value="Data Science">Data Science</SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="thumbnail" className="text-slate-700 font-bold text-xs uppercase tracking-tight">Thumbnail URL (Optional)</Label>
                  <div className="relative">
                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="thumbnail"
                      placeholder="https://example.com/image.jpg"
                      className="pl-10 h-11 bg-slate-50 border-slate-200 rounded-xl focus:bg-white"
                      value={formData.thumbnail}
                      onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SECTION B: SETTINGS */}
          <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <div className="p-1.5 bg-amber-50 rounded-lg"><Layers className="w-3.5 h-3.5 text-amber-600" /></div>
                Course Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-slate-700 font-bold text-xs uppercase tracking-tight flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" /> Duration
                  </Label>
                  <Input
                    id="duration"
                    placeholder="e.g. 12 Weeks"
                    className="h-11 bg-slate-50 border-slate-200 rounded-xl focus:bg-white"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="level" className="text-slate-700 font-bold text-xs uppercase tracking-tight flex items-center gap-2">
                    <BarChart className="w-3.5 h-3.5" /> Skill Level
                  </Label>
                  <Select 
                    value={formData.level} 
                    onValueChange={(val: any) => setFormData({ ...formData, level: val })}
                  >
                    <SelectTrigger className="h-11 bg-slate-50 border-slate-200 rounded-xl focus:bg-white">
                      <SelectValue placeholder="Select Level" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-slate-700 font-bold text-xs uppercase tracking-tight flex items-center gap-2">
                    <BarChart className="w-3.5 h-3.5" /> Status
                  </Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(val: any) => setFormData({ ...formData, status: val })}
                  >
                    <SelectTrigger className="h-11 bg-slate-50 border-slate-200 rounded-xl focus:bg-white">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SECTION C: ASSIGNMENTS */}
          <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <div className="p-1.5 bg-emerald-50 rounded-lg"><Users className="w-3.5 h-3.5 text-emerald-600" /></div>
                Assignments
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ASSIGN TUTORS */}
                <div className="space-y-2">
                  <Label className="text-slate-700 font-bold text-xs uppercase tracking-tight">Assign Tutors</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button type="button" variant="outline" className="w-full h-11 justify-between bg-slate-50 border-slate-200 rounded-xl px-3 font-medium text-slate-600">
                        {formData.tutors?.length ? `${formData.tutors.length} Tutors Selected` : "Select Tutors"}
                        <PlusCircle className="w-4 h-4 ml-2 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-0 rounded-xl overflow-hidden shadow-xl" align="start">
                      <div className="p-2 bg-slate-50 border-b border-slate-100 font-black text-[10px] uppercase tracking-widest text-slate-400">Available Tutors</div>
                      <div className="max-h-64 overflow-y-auto p-1">
                        {mockTutors.map((t) => (
                          <div key={t.id} className="flex items-center space-x-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors" onClick={() => {
                            const cur = formData.tutors || [];
                            const updated = cur.includes(t.id) ? cur.filter(id => id !== t.id) : [...cur, t.id];
                            setFormData({ ...formData, tutors: updated });
                          }}>
                            <Checkbox checked={formData.tutors?.includes(t.id)} />
                            <span className="text-sm font-medium">{t.name}</span>
                            {formData.tutors?.includes(t.id) && <Check className="w-3 h-3 text-primary ml-auto" />}
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* ASSIGN MENTORS */}
                <div className="space-y-2">
                  <Label className="text-slate-700 font-bold text-xs uppercase tracking-tight">Assign Mentors</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button type="button" variant="outline" className="w-full h-11 justify-between bg-slate-50 border-slate-200 rounded-xl px-3 font-medium text-slate-600">
                        {formData.mentors?.length ? `${formData.mentors.length} Mentors Selected` : "Select Mentors"}
                        <PlusCircle className="w-4 h-4 ml-2 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-0 rounded-xl overflow-hidden shadow-xl" align="start">
                      <div className="p-2 bg-slate-50 border-b border-slate-100 font-black text-[10px] uppercase tracking-widest text-slate-400">Available Mentors</div>
                      <div className="max-h-64 overflow-y-auto p-1">
                        {mockMentors.map((m) => (
                          <div key={m.id} className="flex items-center space-x-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors" onClick={() => {
                            const cur = formData.mentors || [];
                            const updated = cur.includes(m.id) ? cur.filter(id => id !== m.id) : [...cur, m.id];
                            setFormData({ ...formData, mentors: updated });
                          }}>
                            <Checkbox checked={formData.mentors?.includes(m.id)} />
                            <span className="text-sm font-medium">{m.name}</span>
                            {formData.mentors?.includes(m.id) && <Check className="w-3 h-3 text-primary ml-auto" />}
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* ASSIGN STUDENTS */}
                <div className="space-y-2">
                  <Label className="text-slate-700 font-bold text-xs uppercase tracking-tight">Assign Students</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button type="button" variant="outline" className="w-full h-11 justify-between bg-slate-50 border-slate-200 rounded-xl px-3 font-medium text-slate-600">
                        {formData.students?.length ? `${formData.students.length} Students Selected` : "Select Students"}
                        <PlusCircle className="w-4 h-4 ml-2 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-0 rounded-xl overflow-hidden shadow-xl" align="start">
                      <div className="p-2 bg-slate-50 border-b border-slate-100 font-black text-[10px] uppercase tracking-widest text-slate-400">Available Students</div>
                      <div className="max-h-64 overflow-y-auto p-1">
                        {mockStudents.map((s) => (
                          <div key={s.id} className="flex items-center space-x-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors" onClick={() => {
                            const cur = formData.students || [];
                            const updated = cur.includes(s.id) ? cur.filter(id => id !== s.id) : [...cur, s.id];
                            setFormData({ ...formData, students: updated });
                          }}>
                            <Checkbox checked={formData.students?.includes(s.id)} />
                            <span className="text-sm font-medium">{s.name}</span>
                            {formData.students?.includes(s.id) && <Check className="w-3 h-3 text-primary ml-auto" />}
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* ASSIGN BATCHES */}
                <div className="space-y-2">
                  <Label className="text-slate-700 font-bold text-xs uppercase tracking-tight">Assign Batches</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button type="button" variant="outline" className="w-full h-11 justify-between bg-slate-50 border-slate-200 rounded-xl px-3 font-medium text-slate-600">
                        {formData.batches?.length ? `${formData.batches.length} Batches Selected` : "Select Batches"}
                        <PlusCircle className="w-4 h-4 ml-2 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-0 rounded-xl overflow-hidden shadow-xl" align="start">
                      <div className="p-2 bg-slate-50 border-b border-slate-100 font-black text-[10px] uppercase tracking-widest text-slate-400">Available Batches</div>
                      <div className="max-h-64 overflow-y-auto p-1">
                        {SHARED_BATCHES.map((b) => (
                          <div key={b.id} className="flex items-center space-x-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors" onClick={() => {
                            const cur = formData.batches || [];
                            const updated = cur.includes(b.id) ? cur.filter(id => id !== b.id) : [...cur, b.id];
                            setFormData({ ...formData, batches: updated });
                          }}>
                            <Checkbox checked={formData.batches?.includes(b.id)} />
                            <span className="text-sm font-medium">{b.name}</span>
                            {formData.batches?.includes(b.id) && <Check className="w-3 h-3 text-primary ml-auto" />}
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SECTION D: SCHEDULE */}
          <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <div className="p-1.5 bg-rose-50 rounded-lg"><Calendar className="w-3.5 h-3.5 text-rose-600" /></div>
                Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-slate-700 font-bold text-xs uppercase tracking-tight">Start Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <Input
                      id="startDate"
                      type="date"
                      className="pl-10 h-11 bg-slate-50 border-slate-200 rounded-xl focus:bg-white"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-slate-700 font-bold text-xs uppercase tracking-tight">End Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <Input
                      id="endDate"
                      type="date"
                      className="pl-10 h-11 bg-slate-50 border-slate-200 rounded-xl focus:bg-white"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FORM ACTIONS */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/courses")}
              className="h-12 px-8 rounded-xl border-slate-200 text-slate-600 font-bold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="h-12 px-10 rounded-xl bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 font-bold"
            >
              <Save className="w-4 h-4 mr-2" />
              {mode === "create" ? "Create Course" : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddEditCourse;
