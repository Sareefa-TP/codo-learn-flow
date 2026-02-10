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
import { StudentRecord, studentRecords as initialRecords, getMentorName, staffMembers } from "@/data/superAdminData";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  active: "bg-primary/15 text-primary border-0",
  completed: "bg-muted text-muted-foreground border-0",
};

const SuperAdminInterns = () => {
  const [records, setRecords] = useState<StudentRecord[]>(() =>
    JSON.parse(JSON.stringify(initialRecords.filter((r) => r.type === "intern")))
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const emptyForm: Omit<StudentRecord, "id"> = {
    name: "", email: "", type: "intern", status: "active", course: "", joinedDate: new Date().toISOString().slice(0, 10), phone: "", mentorId: null, stipendStatus: "unpaid", taskCompletion: 0, feePaid: 0, feeTotal: 0,
  };
  const [form, setForm] = useState(emptyForm);
  const mentors = staffMembers.filter((s) => s.role === "mentor");

  const handleSave = () => {
    if (editingId) {
      setRecords((prev) => prev.map((r) => (r.id === editingId ? { ...r, ...form } : r)));
      toast.success("Intern updated");
    } else {
      const newId = `INT${String(records.length + 10).padStart(3, "0")}`;
      setRecords((prev) => [...prev, { id: newId, ...form } as StudentRecord]);
      toast.success("Intern added");
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) { setRecords((prev) => prev.filter((r) => r.id !== deleteId)); toast.success("Intern deleted"); }
    setDeleteOpen(false);
  };

  const columns: Column<StudentRecord>[] = [
    { key: "name", header: "Name", sortable: true, accessor: (s) => s.name },
    { key: "course", header: "Program" },
    { key: "status", header: "Status", render: (s) => <Badge variant="secondary" className={statusColors[s.status] || ""}>{s.status}</Badge> },
    { key: "mentorId", header: "Mentor", render: (s) => getMentorName(s.mentorId) },
    { key: "taskCompletion", header: "Task %", render: (s) => `${s.taskCompletion ?? 0}%` },
    { key: "stipendStatus", header: "Stipend", render: (s) => <Badge variant="outline" className="capitalize">{s.stipendStatus ?? "—"}</Badge> },
  ];

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-semibold text-foreground tracking-tight">Interns</h1>
            <p className="text-muted-foreground mt-1">Complete intern management and oversight</p>
          </div>
          <Button onClick={() => { setForm(emptyForm); setEditingId(null); setModalOpen(true); }} size="sm" className="gap-2"><Plus className="w-4 h-4" /> Add Intern</Button>
        </div>
        <DataTable data={records} columns={columns} searchPlaceholder="Search interns..." searchKey={(s) => `${s.name} ${s.email} ${s.course}`} actions={(item) => (
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setForm({ ...item }); setEditingId(item.id); setModalOpen(true); }}><Pencil className="w-4 h-4" /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => { setDeleteId(item.id); setDeleteOpen(true); }}><Trash2 className="w-4 h-4" /></Button>
          </div>
        )} />
        <GenericModalForm open={modalOpen} onOpenChange={setModalOpen} title={editingId ? "Edit Intern" : "Add Intern"} onSubmit={handleSave} isValid={!!form.name && !!form.email}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="space-y-2"><Label>Email</Label><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div className="space-y-2"><Label>Program</Label><Input value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} /></div>
            <div className="space-y-2"><Label>Mentor</Label>
              <Select value={form.mentorId || "none"} onValueChange={(v) => setForm({ ...form, mentorId: v === "none" ? null : v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="none">Unassigned</SelectItem>{mentors.map((m) => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}</SelectContent></Select>
            </div>
            <div className="space-y-2"><Label>Stipend Status</Label>
              <Select value={form.stipendStatus || "unpaid"} onValueChange={(v) => setForm({ ...form, stipendStatus: v as "paid" | "unpaid" | "partial" })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="paid">Paid</SelectItem><SelectItem value="unpaid">Unpaid</SelectItem><SelectItem value="partial">Partial</SelectItem></SelectContent></Select>
            </div>
            <div className="space-y-2"><Label>Task Completion %</Label><Input type="number" min={0} max={100} value={form.taskCompletion ?? 0} onChange={(e) => setForm({ ...form, taskCompletion: Number(e.target.value) })} /></div>
          </div>
        </GenericModalForm>
        <DeleteConfirmDialog open={deleteOpen} onOpenChange={setDeleteOpen} title="Delete Intern" description="This will permanently remove this intern record." onConfirm={handleDelete} />
      </div>
    </DashboardLayout>
  );
};

export default SuperAdminInterns;
