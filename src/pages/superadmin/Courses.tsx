import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable, { Column } from "@/components/superadmin/DataTable";
import GenericModalForm from "@/components/superadmin/GenericModalForm";
import DeleteConfirmDialog from "@/components/superadmin/DeleteConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { CoursePackage, coursePackages as initialCourses, getTutorName, staffMembers } from "@/data/superAdminData";
import { toast } from "sonner";

const SuperAdminCourses = () => {
  const [courses, setCourses] = useState<CoursePackage[]>(() => JSON.parse(JSON.stringify(initialCourses)));
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const emptyForm: Omit<CoursePackage, "id"> = {
    name: "", duration: "", fee: 0, tutorId: "", syllabusUrl: "", driveId: "", studentsEnrolled: 0, status: "draft",
  };
  const [form, setForm] = useState(emptyForm);

  const tutors = staffMembers.filter((s) => s.role === "tutor" && s.status === "active");

  const handleSave = () => {
    if (editingId) {
      setCourses((prev) => prev.map((c) => (c.id === editingId ? { ...c, ...form } : c)));
      toast.success("Course updated");
    } else {
      const newId = `CRS${String(courses.length + 1).padStart(3, "0")}`;
      setCourses((prev) => [...prev, { id: newId, ...form } as CoursePackage]);
      toast.success("Course created");
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      setCourses((prev) => prev.filter((c) => c.id !== deleteId));
      toast.success("Course deleted");
    }
    setDeleteOpen(false);
  };

  const columns: Column<CoursePackage>[] = [
    { key: "name", header: "Course Name", sortable: true, accessor: (c) => c.name },
    { key: "duration", header: "Duration" },
    { key: "fee", header: "Fee", sortable: true, accessor: (c) => c.fee, render: (c) => `₹${c.fee.toLocaleString("en-IN")}` },
    { key: "tutorId", header: "Tutor", render: (c) => getTutorName(c.tutorId) },
    { key: "studentsEnrolled", header: "Enrolled", sortable: true, accessor: (c) => c.studentsEnrolled },
    { key: "status", header: "Status", render: (c) => (
      <Badge variant={c.status === "active" ? "default" : "outline"} className={c.status === "active" ? "bg-primary/15 text-primary border-0" : "capitalize"}>{c.status}</Badge>
    )},
  ];

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-semibold text-foreground tracking-tight">Courses & Packages</h1>
            <p className="text-muted-foreground mt-1">Manage the product catalog</p>
          </div>
          <Button onClick={() => { setForm(emptyForm); setEditingId(null); setModalOpen(true); }} size="sm" className="gap-2"><Plus className="w-4 h-4" /> Add Course</Button>
        </div>

        <DataTable
          data={courses}
          columns={columns}
          searchPlaceholder="Search courses..."
          searchKey={(c) => `${c.name} ${getTutorName(c.tutorId)}`}
          actions={(item) => (
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setForm({ ...item }); setEditingId(item.id); setModalOpen(true); }}><Pencil className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => { setDeleteId(item.id); setDeleteOpen(true); }}><Trash2 className="w-4 h-4" /></Button>
            </div>
          )}
        />

        <GenericModalForm open={modalOpen} onOpenChange={setModalOpen} title={editingId ? "Edit Course" : "Add Course"} onSubmit={handleSave} isValid={!!form.name && !!form.duration && form.fee > 0}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Course Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full Stack Web Dev" /></div>
            <div className="space-y-2"><Label>Duration</Label><Input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="6 months" /></div>
            <div className="space-y-2"><Label>Fee (₹)</Label><Input type="number" value={form.fee} onChange={(e) => setForm({ ...form, fee: Number(e.target.value) })} /></div>
            <div className="space-y-2"><Label>Tutor</Label>
              <Select value={form.tutorId} onValueChange={(v) => setForm({ ...form, tutorId: v })}><SelectTrigger><SelectValue placeholder="Select tutor" /></SelectTrigger><SelectContent>{tutors.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent></Select>
            </div>
            <div className="space-y-2"><Label>Syllabus URL</Label><Input value={form.syllabusUrl} onChange={(e) => setForm({ ...form, syllabusUrl: e.target.value })} placeholder="/syllabus/..." /></div>
            <div className="space-y-2"><Label>Google Drive ID</Label><Input value={form.driveId} onChange={(e) => setForm({ ...form, driveId: e.target.value })} placeholder="1abc_FolderName" /></div>
            <div className="space-y-2"><Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as CoursePackage["status"] })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="draft">Draft</SelectItem><SelectItem value="archived">Archived</SelectItem></SelectContent></Select>
            </div>
          </div>
        </GenericModalForm>

        <DeleteConfirmDialog open={deleteOpen} onOpenChange={setDeleteOpen} title="Delete Course" description="This will permanently remove this course package." onConfirm={handleDelete} />
      </div>
    </DashboardLayout>
  );
};

export default SuperAdminCourses;
