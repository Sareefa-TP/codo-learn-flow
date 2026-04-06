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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { StudentRecord, studentRecords as initialRecords, getMentorName, staffMembers } from "@/data/superAdminData";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  active: "bg-primary/15 text-primary border-0",
  demo_pending: "bg-warning/15 text-warning-foreground border-0",
  completed: "bg-muted text-muted-foreground border-0",
  dropped: "bg-destructive/15 text-destructive border-0",
};

const SuperAdminStudents = () => {
  const [records, setRecords] = useState<StudentRecord[]>(() => JSON.parse(JSON.stringify(initialRecords)));
  const [typeFilter, setTypeFilter] = useState<"all" | "student" | "intern">("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const emptyForm: Omit<StudentRecord, "id"> = {
    name: "", email: "", type: "student", status: "active", course: "", joinedDate: new Date().toISOString().slice(0, 10), phone: "", mentorId: null, feePaid: 0, feeTotal: 0,
  };
  const [form, setForm] = useState(emptyForm);

  const filtered = typeFilter === "all" ? records : records.filter((r) => r.type === typeFilter);

  const openAdd = () => { setForm(emptyForm); setEditingId(null); setModalOpen(true); };
  const openEdit = (item: StudentRecord) => { setForm({ ...item }); setEditingId(item.id); setModalOpen(true); };

  const handleSave = () => {
    if (editingId) {
      setRecords((prev) => prev.map((r) => (r.id === editingId ? { ...r, ...form } : r)));
      toast.success("Record updated");
    } else {
      const prefix = form.type === "student" ? "STU" : "INT";
      const newId = `${prefix}${String(records.length + 1).padStart(3, "0")}`;
      setRecords((prev) => [...prev, { id: newId, ...form } as StudentRecord]);
      toast.success("Record added");
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      setRecords((prev) => prev.filter((r) => r.id !== deleteId));
      toast.success("Record deleted");
    }
    setDeleteOpen(false);
  };

  const mentors = staffMembers.filter((s) => s.role === "mentor");

  const columns: Column<StudentRecord>[] = [
    { key: "name", header: "Name", sortable: true, accessor: (s) => s.name },
    { key: "type", header: "Type", render: (s) => <Badge variant="outline" className="capitalize">{s.type}</Badge> },
    { key: "course", header: "Course" },
    { key: "status", header: "Status", render: (s) => <Badge variant="secondary" className={statusColors[s.status] || ""}>{s.status.replace("_", " ")}</Badge> },
    { key: "mentorId", header: "Mentor", render: (s) => getMentorName(s.mentorId) },
    ...(typeFilter !== "student" ? [
      { key: "taskCompletion" as const, header: "Tasks", render: (s: StudentRecord) => s.taskCompletion != null ? `${s.taskCompletion}%` : "—" },
      { key: "stipendStatus" as const, header: "Stipend", render: (s: StudentRecord) => s.stipendStatus ? <Badge variant="outline" className="capitalize">{s.stipendStatus}</Badge> : "—" },
    ] : []),
    ...(typeFilter !== "intern" ? [
      { key: "feePaid" as const, header: "Fee Paid", render: (s: StudentRecord) => `₹${s.feePaid.toLocaleString("en-IN")}` },
    ] : []),
  ];

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-semibold text-foreground tracking-tight">Student & Intern Registry</h1>
            <p className="text-muted-foreground mt-1">Manage all student and intern profiles</p>
          </div>
          <Button onClick={openAdd} size="sm" className="gap-2"><Plus className="w-4 h-4" /> Add Record</Button>
        </div>

        <Tabs value={typeFilter} onValueChange={(v) => setTypeFilter(v as typeof typeFilter)}>
          <TabsList>
            <TabsTrigger value="all">All ({records.length})</TabsTrigger>
            <TabsTrigger value="student">Students ({records.filter((r) => r.type === "student").length})</TabsTrigger>
            <TabsTrigger value="intern">Interns ({records.filter((r) => r.type === "intern").length})</TabsTrigger>
          </TabsList>
        </Tabs>

        <DataTable
          data={filtered}
          columns={columns}
          searchPlaceholder="Search by name, email or course..."
          searchKey={(s) => `${s.name} ${s.email} ${s.course}`}
          actions={(item) => (
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(item)}><Pencil className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => { setDeleteId(item.id); setDeleteOpen(true); }}><Trash2 className="w-4 h-4" /></Button>
            </div>
          )}
        />

        <GenericModalForm open={modalOpen} onOpenChange={setModalOpen} title={editingId ? "Edit Record" : "Add Record"} onSubmit={handleSave} isValid={!!form.name && !!form.email && !!form.course}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="space-y-2"><Label>Email</Label><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div className="space-y-2"><Label>Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as StudentRecord["type"] })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="student">Student</SelectItem><SelectItem value="intern">Intern</SelectItem></SelectContent></Select>
            </div>
            <div className="space-y-2"><Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as StudentRecord["status"] })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="demo_pending">Demo Pending</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="completed">Completed</SelectItem><SelectItem value="dropped">Dropped</SelectItem></SelectContent></Select>
            </div>
            <div className="space-y-2"><Label>Course</Label><Input value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} /></div>
            <div className="space-y-2"><Label>Mentor</Label>
              <Select value={form.mentorId || "none"} onValueChange={(v) => setForm({ ...form, mentorId: v === "none" ? null : v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="none">Unassigned</SelectItem>{mentors.map((m) => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}</SelectContent></Select>
            </div>
            <div className="space-y-2"><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            {form.type === "student" && (
              <>
                <div className="space-y-2"><Label>Fee Total (₹)</Label><Input type="number" value={form.feeTotal} onChange={(e) => setForm({ ...form, feeTotal: Number(e.target.value) })} /></div>
              </>
            )}
          </div>
        </GenericModalForm>

        <DeleteConfirmDialog open={deleteOpen} onOpenChange={setDeleteOpen} title="Delete Record" description="This will permanently remove this student/intern record." onConfirm={handleDelete} />
      </div>
    </DashboardLayout>
  );
};

export default SuperAdminStudents;
