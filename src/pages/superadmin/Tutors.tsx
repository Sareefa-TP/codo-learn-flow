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
import { StaffMember, staffMembers as initialStaff } from "@/data/superAdminData";
import { toast } from "sonner";

const SuperAdminTutors = () => {
  const [tutors, setTutors] = useState<StaffMember[]>(() =>
    JSON.parse(JSON.stringify(initialStaff.filter((s) => s.role === "tutor")))
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const emptyForm: Omit<StaffMember, "id"> = { name: "", email: "", role: "tutor", status: "active", joinedDate: new Date().toISOString().slice(0, 10), phone: "", domain: "", assignedStudents: 0 };
  const [form, setForm] = useState(emptyForm);

  const handleSave = () => {
    if (editingId) {
      setTutors((prev) => prev.map((t) => (t.id === editingId ? { ...t, ...form } : t)));
      toast.success("Tutor updated");
    } else {
      const newId = `S${String(Math.floor(Math.random() * 900) + 100)}`;
      setTutors((prev) => [...prev, { id: newId, ...form } as StaffMember]);
      toast.success("Tutor added");
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) { setTutors((prev) => prev.filter((t) => t.id !== deleteId)); toast.success("Tutor deleted"); }
    setDeleteOpen(false);
  };

  const columns: Column<StaffMember>[] = [
    { key: "name", header: "Name", sortable: true, accessor: (t) => t.name },
    { key: "email", header: "Email" },
    { key: "domain", header: "Domain", render: (t) => t.domain || "—" },
    { key: "assignedStudents", header: "Students", sortable: true, accessor: (t) => t.assignedStudents ?? 0 },
    { key: "status", header: "Status", render: (t) => <Badge variant={t.status === "active" ? "default" : "outline"} className={t.status === "active" ? "bg-primary/15 text-primary border-0" : ""}>{t.status}</Badge> },
  ];

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-semibold text-foreground tracking-tight">Tutors</h1>
            <p className="text-muted-foreground mt-1">Complete tutor management and oversight</p>
          </div>
          <Button onClick={() => { setForm(emptyForm); setEditingId(null); setModalOpen(true); }} size="sm" className="gap-2"><Plus className="w-4 h-4" /> Add Tutor</Button>
        </div>
        <DataTable data={tutors} columns={columns} searchPlaceholder="Search tutors..." searchKey={(t) => `${t.name} ${t.email} ${t.domain || ""}`} actions={(item) => (
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setForm({ ...item }); setEditingId(item.id); setModalOpen(true); }}><Pencil className="w-4 h-4" /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => { setDeleteId(item.id); setDeleteOpen(true); }}><Trash2 className="w-4 h-4" /></Button>
          </div>
        )} />
        <GenericModalForm open={modalOpen} onOpenChange={setModalOpen} title={editingId ? "Edit Tutor" : "Add Tutor"} onSubmit={handleSave} isValid={!!form.name && !!form.email}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="space-y-2"><Label>Email</Label><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div className="space-y-2"><Label>Domain</Label><Input value={form.domain || ""} onChange={(e) => setForm({ ...form, domain: e.target.value })} placeholder="React Specialist" /></div>
            <div className="space-y-2"><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            <div className="space-y-2"><Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as "active" | "inactive" })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem></SelectContent></Select>
            </div>
          </div>
        </GenericModalForm>
        <DeleteConfirmDialog open={deleteOpen} onOpenChange={setDeleteOpen} title="Delete Tutor" description="This will permanently remove this tutor. Assigned courses will show 'Unassigned'." onConfirm={handleDelete} />
      </div>
    </DashboardLayout>
  );
};

export default SuperAdminTutors;
