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

const SuperAdminMentors = () => {
  const [mentors, setMentors] = useState<StaffMember[]>(() =>
    JSON.parse(JSON.stringify(initialStaff.filter((s) => s.role === "mentor")))
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const emptyForm: Omit<StaffMember, "id"> = { name: "", email: "", role: "mentor", status: "active", joinedDate: new Date().toISOString().slice(0, 10), phone: "", domain: "", assignedStudents: 0 };
  const [form, setForm] = useState(emptyForm);

  const handleSave = () => {
    if (editingId) {
      setMentors((prev) => prev.map((m) => (m.id === editingId ? { ...m, ...form } : m)));
      toast.success("Mentor updated");
    } else {
      const newId = `S${String(Math.floor(Math.random() * 900) + 100)}`;
      setMentors((prev) => [...prev, { id: newId, ...form } as StaffMember]);
      toast.success("Mentor added");
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) { setMentors((prev) => prev.filter((m) => m.id !== deleteId)); toast.success("Mentor deleted"); }
    setDeleteOpen(false);
  };

  const columns: Column<StaffMember>[] = [
    { key: "name", header: "Name", sortable: true, accessor: (m) => m.name },
    { key: "email", header: "Email" },
    { key: "domain", header: "Domain", render: (m) => m.domain || "—" },
    { key: "assignedStudents", header: "Mentees", sortable: true, accessor: (m) => m.assignedStudents ?? 0 },
    { key: "status", header: "Status", render: (m) => <Badge variant={m.status === "active" ? "default" : "outline"} className={m.status === "active" ? "bg-primary/15 text-primary border-0" : ""}>{m.status}</Badge> },
  ];

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-semibold text-foreground tracking-tight">Mentors</h1>
            <p className="text-muted-foreground mt-1">Complete mentor management and oversight</p>
          </div>
          <Button onClick={() => { setForm(emptyForm); setEditingId(null); setModalOpen(true); }} size="sm" className="gap-2"><Plus className="w-4 h-4" /> Add Mentor</Button>
        </div>
        <DataTable data={mentors} columns={columns} searchPlaceholder="Search mentors..." searchKey={(m) => `${m.name} ${m.email} ${m.domain || ""}`} actions={(item) => (
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setForm({ ...item }); setEditingId(item.id); setModalOpen(true); }}><Pencil className="w-4 h-4" /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => { setDeleteId(item.id); setDeleteOpen(true); }}><Trash2 className="w-4 h-4" /></Button>
          </div>
        )} />
        <GenericModalForm open={modalOpen} onOpenChange={setModalOpen} title={editingId ? "Edit Mentor" : "Add Mentor"} onSubmit={handleSave} isValid={!!form.name && !!form.email}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="space-y-2"><Label>Email</Label><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div className="space-y-2"><Label>Domain</Label><Input value={form.domain || ""} onChange={(e) => setForm({ ...form, domain: e.target.value })} placeholder="UI/UX Lead" /></div>
            <div className="space-y-2"><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            <div className="space-y-2"><Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as "active" | "inactive" })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem></SelectContent></Select>
            </div>
          </div>
        </GenericModalForm>
        <DeleteConfirmDialog open={deleteOpen} onOpenChange={setDeleteOpen} title="Delete Mentor" description="Assigned students/interns will show 'Unassigned'." onConfirm={handleDelete} />
      </div>
    </DashboardLayout>
  );
};

export default SuperAdminMentors;
