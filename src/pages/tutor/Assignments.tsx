import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable, { Column } from "@/components/superadmin/DataTable";
import GenericModalForm from "@/components/superadmin/GenericModalForm";
import DeleteConfirmDialog from "@/components/superadmin/DeleteConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Eye, ClipboardList, Clock, Users } from "lucide-react";
import { TutorAssignment, TutorSubmission, tutorAssignments as initialAssignments } from "@/data/tutorData";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const defaultForm: Omit<TutorAssignment, "id" | "submissions"> = {
  title: "", description: "", subject: "", deadline: "", totalStudents: 0, status: "active",
};

const TutorAssignments = () => {
  const [assignments, setAssignments] = useState<TutorAssignment[]>(() => JSON.parse(JSON.stringify(initialAssignments)));
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [gradeOpen, setGradeOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewAssignment, setViewAssignment] = useState<TutorAssignment | null>(null);
  const [gradingSub, setGradingSub] = useState<{ assignmentId: string; submission: TutorSubmission } | null>(null);
  const [gradeForm, setGradeForm] = useState({ grade: "", feedback: "" });
  const [form, setForm] = useState(defaultForm);

  const openAdd = () => { setForm(defaultForm); setEditingId(null); setModalOpen(true); };
  const openEdit = (item: TutorAssignment) => { setForm({ title: item.title, description: item.description, subject: item.subject, deadline: item.deadline, totalStudents: item.totalStudents, status: item.status }); setEditingId(item.id); setModalOpen(true); };
  const openDelete = (id: string) => { setDeleteId(id); setDeleteOpen(true); };
  const openView = (item: TutorAssignment) => { setViewAssignment(item); setViewOpen(true); };
  const openGrade = (assignmentId: string, sub: TutorSubmission) => { setGradingSub({ assignmentId, submission: sub }); setGradeForm({ grade: sub.grade?.toString() || "", feedback: sub.feedback || "" }); setGradeOpen(true); };

  const handleSave = () => {
    if (editingId) {
      setAssignments((prev) => prev.map((a) => (a.id === editingId ? { ...a, ...form } : a)));
      toast.success("Assignment updated");
    } else {
      const newId = `ASG${String(assignments.length + 1).padStart(3, "0")}`;
      setAssignments((prev) => [...prev, { id: newId, ...form, submissions: [] } as TutorAssignment]);
      toast.success("Assignment created");
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      setAssignments((prev) => prev.filter((a) => a.id !== deleteId));
      toast.success("Assignment deleted");
    }
    setDeleteOpen(false);
  };

  const handleGrade = () => {
    if (!gradingSub) return;
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === gradingSub.assignmentId
          ? { ...a, submissions: a.submissions.map((s) => s.id === gradingSub.submission.id ? { ...s, grade: parseInt(gradeForm.grade), feedback: gradeForm.feedback, status: "graded" as const } : s) }
          : a
      )
    );
    toast.success(`Graded ${gradingSub.submission.studentName}'s submission`);
    setGradeOpen(false);

    // Refresh view if open
    if (viewAssignment && viewAssignment.id === gradingSub.assignmentId) {
      setViewAssignment((prev) => prev ? { ...prev, submissions: prev.submissions.map((s) => s.id === gradingSub.submission.id ? { ...s, grade: parseInt(gradeForm.grade), feedback: gradeForm.feedback, status: "graded" as const } : s) } : null);
    }
  };

  const statusBadge = (status: string) => {
    const map: Record<string, string> = { active: "bg-primary/10 text-primary", closed: "bg-muted text-muted-foreground", draft: "bg-warning/10 text-warning" };
    return <Badge variant="secondary" className={`${map[status] || ""} border-0 capitalize`}>{status}</Badge>;
  };

  const subStatusBadge = (status: string) => {
    const map: Record<string, string> = { submitted: "bg-primary/10 text-primary", late: "bg-destructive/10 text-destructive", graded: "bg-primary/15 text-primary", revision: "bg-warning/10 text-warning" };
    return <Badge variant="secondary" className={`${map[status] || ""} border-0 capitalize`}>{status}</Badge>;
  };

  const columns: Column<TutorAssignment>[] = [
    { key: "title", header: "Title", sortable: true, accessor: (a) => a.title },
    { key: "subject", header: "Subject", render: (a) => <Badge variant="outline" className="text-xs">{a.subject}</Badge> },
    { key: "deadline", header: "Deadline", sortable: true, accessor: (a) => a.deadline, render: (a) => <span className="flex items-center gap-1 text-sm"><Clock className="w-3 h-3" />{a.deadline}</span> },
    { key: "submissions", header: "Submissions", render: (a) => <span className="flex items-center gap-1 text-sm"><Users className="w-3 h-3" />{a.submissions.length}/{a.totalStudents}</span> },
    { key: "status", header: "Status", render: (a) => statusBadge(a.status) },
  ];

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-semibold text-foreground tracking-tight">Assignment Engine</h1>
            <p className="text-muted-foreground mt-1">Create assignments and grade submissions</p>
          </div>
          <Button onClick={openAdd} size="sm" className="gap-2">
            <Plus className="w-4 h-4" /> Create Assignment
          </Button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border border-border/60 shadow-card p-5">
            <p className="text-sm text-muted-foreground">Active Assignments</p>
            <p className="text-2xl font-bold text-foreground">{assignments.filter((a) => a.status === "active").length}</p>
          </Card>
          <Card className="border border-border/60 shadow-card p-5">
            <p className="text-sm text-muted-foreground">Total Submissions</p>
            <p className="text-2xl font-bold text-foreground">{assignments.flatMap((a) => a.submissions).length}</p>
          </Card>
          <Card className="border border-border/60 shadow-card p-5">
            <p className="text-sm text-muted-foreground">Pending to Grade</p>
            <p className="text-2xl font-bold text-warning">{assignments.flatMap((a) => a.submissions).filter((s) => s.status === "submitted" || s.status === "late").length}</p>
          </Card>
        </div>

        <DataTable
          data={assignments}
          columns={columns}
          searchPlaceholder="Search assignments..."
          searchKey={(a) => `${a.title} ${a.subject}`}
          actions={(item) => (
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openView(item)}>
                <Eye className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(item)}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => openDelete(item.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        />

        {/* Add/Edit Modal */}
        <GenericModalForm
          open={modalOpen}
          onOpenChange={setModalOpen}
          title={editingId ? "Edit Assignment" : "Create Assignment"}
          onSubmit={handleSave}
          isValid={!!form.title && !!form.subject && !!form.deadline}
        >
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Build a Todo App" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Assignment details..." rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Subject</Label>
                <Select value={form.subject} onValueChange={(v) => setForm({ ...form, subject: v })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full Stack Web Dev">Full Stack Web Dev</SelectItem>
                    <SelectItem value="Data Science Mastery">Data Science Mastery</SelectItem>
                    <SelectItem value="UI/UX Design Pro">UI/UX Design Pro</SelectItem>
                    <SelectItem value="React Advanced">React Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as TutorAssignment["status"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Deadline</Label>
                <Input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Total Students</Label>
                <Input type="number" value={form.totalStudents} onChange={(e) => setForm({ ...form, totalStudents: parseInt(e.target.value) || 0 })} />
              </div>
            </div>
          </div>
        </GenericModalForm>

        {/* View Submissions Dialog */}
        <Dialog open={viewOpen} onOpenChange={setViewOpen}>
          <DialogContent className="sm:max-w-[640px] rounded-xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{viewAssignment?.title}</DialogTitle>
            </DialogHeader>
            {viewAssignment && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">{viewAssignment.description}</p>
                <div className="flex gap-2">
                  <Badge variant="outline">{viewAssignment.subject}</Badge>
                  <Badge variant="outline">Due: {viewAssignment.deadline}</Badge>
                  {statusBadge(viewAssignment.status)}
                </div>
                <h4 className="font-semibold text-sm mt-4">Submissions ({viewAssignment.submissions.length}/{viewAssignment.totalStudents})</h4>
                {viewAssignment.submissions.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">No submissions yet</p>
                ) : (
                  <div className="space-y-3">
                    {viewAssignment.submissions.map((sub) => (
                      <div key={sub.id} className="p-3 rounded-lg border border-border/50 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">{sub.studentName}</p>
                            <p className="text-xs text-muted-foreground">Submitted: {sub.submittedDate}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {sub.grade !== undefined && <Badge variant="secondary" className="bg-primary/10 text-primary border-0">{sub.grade}%</Badge>}
                            {subStatusBadge(sub.status)}
                          </div>
                        </div>
                        {sub.feedback && <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">{sub.feedback}</p>}
                        {(sub.status === "submitted" || sub.status === "late") && (
                          <Button size="sm" variant="outline" onClick={() => openGrade(viewAssignment.id, sub)}>
                            Grade Submission
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Grade Dialog */}
        <Dialog open={gradeOpen} onOpenChange={setGradeOpen}>
          <DialogContent className="sm:max-w-[420px] rounded-xl">
            <DialogHeader>
              <DialogTitle>Grade: {gradingSub?.submission.studentName}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="space-y-2">
                <Label>Score (0-100)</Label>
                <Input type="number" min={0} max={100} value={gradeForm.grade} onChange={(e) => setGradeForm({ ...gradeForm, grade: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Feedback</Label>
                <Textarea value={gradeForm.feedback} onChange={(e) => setGradeForm({ ...gradeForm, feedback: e.target.value })} placeholder="Great work! Consider..." rows={3} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setGradeOpen(false)}>Cancel</Button>
              <Button onClick={handleGrade} disabled={!gradeForm.grade}>Submit Grade</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <DeleteConfirmDialog open={deleteOpen} onOpenChange={setDeleteOpen} title="Delete Assignment" description="This will remove the assignment and all submissions." onConfirm={handleDelete} />
      </div>
    </DashboardLayout>
  );
};

export default TutorAssignments;
