import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, Plus, X, BookOpen, User, Phone, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { mockMentors, updateMentor, addMentor } from "@/data/mockMentors";
import { Badge } from "@/components/ui/badge";
import { useRole } from "@/hooks/useRole";

interface AddEditMentorProps {
  mode: "add" | "edit";
}

const AddEditMentor = ({ mode }: AddEditMentorProps) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useRole();
  const basePath = role === "superadmin" ? "/superadmin" : "/admin";
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    status: "Active",
    assignedCourses: [] as { name: string; batches: string[] }[],
  });

  // Mock Courses and Batches for assignment
  const availableCourses = ["Full Stack Development", "Data Science", "UI/UX Design"];
  const availableBatches: Record<string, string[]> = {
    "Full Stack Development": ["FS-BATCH-001", "FS-BATCH-002", "FS-BATCH-003"],
    "Data Science": ["DS-BATCH-101", "DS-BATCH-102"],
    "UI/UX Design": ["UI-BATCH-201", "UI-BATCH-202"],
  };

  useEffect(() => {
    if (mode === "edit" && id) {
      const mentor = mockMentors.find((m) => m.id === id);
      if (mentor) {
        setFormData({
          name: mentor.name,
          email: mentor.email,
          phone: mentor.phone,
          status: mentor.status,
          assignedCourses: mentor.assignedCourses,
        });
      }
    }
  }, [mode, id]);

  const handleAddCourse = () => {
    setFormData({
      ...formData,
      assignedCourses: [...formData.assignedCourses, { name: "", batches: [] }],
    });
  };

  const handleRemoveCourse = (index: number) => {
    const updated = [...formData.assignedCourses];
    updated.splice(index, 1);
    setFormData({ ...formData, assignedCourses: updated });
  };

  const handleCourseChange = (index: number, name: string) => {
    const updated = [...formData.assignedCourses];
    updated[index] = { name, batches: [] };
    setFormData({ ...formData, assignedCourses: updated });
  };

  const handleBatchToggle = (courseIndex: number, batch: string) => {
    const updated = [...formData.assignedCourses];
    const currentBatches = updated[courseIndex].batches;
    if (currentBatches.includes(batch)) {
      updated[courseIndex].batches = currentBatches.filter((b) => b !== batch);
    } else {
      updated[courseIndex].batches = [...currentBatches, batch];
    }
    setFormData({ ...formData, assignedCourses: updated });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "edit" && id) {
      updateMentor({
        id,
        ...formData
      });
    } else if (mode === "add") {
      addMentor({
        id: `M${mockMentors.length + 1}`,
        ...formData,
        joinedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        assignedInternIds: [],
        sessions: [],
        performance: { totalSessions: 0, rating: 0 },
        studentProgress: []
      });
    }

    navigate(`${basePath}/mentors`);
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-6 bg-slate-50/50 min-h-screen">
        {/* Back Button & Title */}
        <div className="flex flex-col gap-2">
          <Button
            variant="ghost"
            onClick={() => navigate(`${basePath}/mentors`)}
            className="w-fit -ml-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Mentors
          </Button>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-900">
              {mode === "add" ? "Add New Mentor" : "Edit Mentor Profile"}
            </h1>
            <Badge className={formData.status === "Active" ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-50" : "bg-slate-100 text-slate-600 hover:bg-slate-100"}>
              {formData.status}
            </Badge>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-slate-50 bg-white">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-700 font-medium">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. John Doe"
                    required
                    className="pl-10 h-11 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-primary/20"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. john@example.com"
                    required
                    className="pl-10 h-11 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-primary/20"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-slate-700 font-medium">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +1 234 567 890"
                    className="pl-10 h-11 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-primary/20"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status" className="text-slate-700 font-medium">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(val) => setFormData({ ...formData, status: val })}
                >
                  <SelectTrigger className="h-11 bg-slate-50 border-slate-200 rounded-xl">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Assignments */}
          <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-slate-50 bg-white flex flex-row items-center justify-between py-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Course & Batch Assignments
              </CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddCourse}
                className="h-9 rounded-lg border-primary/20 text-primary hover:bg-primary/5"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Add Assignment
              </Button>
            </CardHeader>
            <CardContent className="p-6 space-y-6 bg-white">
              {formData.assignedCourses.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-2xl">
                  <BookOpen className="w-10 h-10 text-slate-200 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">No courses assigned yet</p>
                </div>
              ) : (
                formData.assignedCourses.map((assignment, courseIdx) => (
                  <div key={courseIdx} className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-4 relative group">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveCourse(courseIdx)}
                      className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-white border border-slate-200 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3.5 h-3.5 text-rose-500" />
                    </Button>

                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Select Course</Label>
                        <Select
                          value={assignment.name}
                          onValueChange={(val) => handleCourseChange(courseIdx, val)}
                        >
                          <SelectTrigger className="h-10 bg-white border-slate-200 rounded-lg">
                            <SelectValue placeholder="Choose a course" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            {availableCourses.map((c) => (
                              <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {assignment.name && (
                        <div className="space-y-2">
                          <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Select Batches</Label>
                          <div className="flex flex-wrap gap-2 pt-1">
                            {availableBatches[assignment.name]?.map((batch) => (
                              <button
                                key={batch}
                                type="button"
                                onClick={() => handleBatchToggle(courseIdx, batch)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                                  assignment.batches.includes(batch)
                                    ? "bg-primary border-primary text-white shadow-sm"
                                    : "bg-white border-slate-200 text-slate-600 hover:border-primary/30 hover:text-primary"
                                }`}
                              >
                                {batch}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`${basePath}/mentors`)}
              className="h-11 px-8 rounded-xl border-slate-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="h-11 px-10 rounded-xl bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
            >
              <Save className="w-4 h-4 mr-2" />
              {mode === "add" ? "Create Mentor" : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddEditMentor;
