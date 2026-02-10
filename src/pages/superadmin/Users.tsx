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
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { StaffMember, staffMembers as initialStaff } from "@/data/superAdminData";
import { toast } from "sonner";

const defaultForm: Omit<StaffMember, "id"> = {
  name: "", email: "", role: "tutor", status: "active", joinedDate: new Date().toISOString().slice(0, 10), phone: "", domain: "", assignedStudents: 0,
};

const SuperAdminUsers = () => {
  const [staff, setStaff] = useState<StaffMember[]>(() => JSON.parse(JSON.stringify(initialStaff)));
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);

  const openAdd = () => { setForm(defaultForm); setEditingId(null); setModalOpen(true); };
  const openEdit = (item: StaffMember) => { setForm({ ...item }); setEditingId(item.id); setModalOpen(true); };
  const openDelete = (id: string) => { setDeleteId(id); setDeleteOpen(true); };

  const handleSave = () => {
    if (editingId) {
      setStaff((prev) => prev.map((s) => (s.id === editingId ? { ...s, ...form } : s)));
      toast.success("User updated successfully");
    } else {
      const newId = `S${String(staff.length + 1).padStart(3, "0")}`;
      setStaff((prev) => [...prev, { id: newId, ...form } as StaffMember]);
      toast.success("User added successfully");
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      setStaff((prev) => prev.filter((s) => s.id !== deleteId));
      toast.success("User deleted");
    }
    setDeleteOpen(false);
  };

  const columns: Column<StaffMember>[] = [
    { key: "name", header: "Name", sortable: true, accessor: (s) => s.name },
    { key: "role", header: "Role", render: (s) => (
      <Badge variant="secondary" className="capitalize">{s.role}</Badge>
    )},
    { key: "email", header: "Email" },
    { key: "domain", header: "Domain", render: (s) => s.domain || "—" },
    { key: "status", header: "Status", render: (s) => (
      <Badge variant={s.status === "active" ? "default" : "outline"} className={s.status === "active" ? "bg-primary/15 text-primary border-0" : ""}>{s.status}</Badge>
    )},
    { key: "joinedDate", header: "Joined", sortable: true, accessor: (s) => s.joinedDate },
  ];

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-semibold text-foreground tracking-tight">User Management</h1>
            <p className="text-muted-foreground mt-1">Manage Admins, Tutors & Mentors</p>
          </div>
          <Button onClick={openAdd} size="sm" className="gap-2">
            <Plus className="w-4 h-4" /> Add User
          </Button>
        </div>

        <DataTable
          data={staff}
          columns={columns}
          searchPlaceholder="Search by name or email..."
          searchKey={(s) => `${s.name} ${s.email} ${s.role}`}
          actions={(item) => (
            <div className="flex gap-1">
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
          title={editingId ? "Edit User" : "Add New User"}
          description={editingId ? "Update user details" : "Enter details for the new staff member"}
          onSubmit={handleSave}
          isValid={!!form.name && !!form.email}
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Rajesh Kumar" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@codo.academy" />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as StaffMember["role"] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="tutor">Tutor</SelectItem>
                  <SelectItem value="mentor">Mentor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as StaffMember["status"] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" />
            </div>
            <div className="space-y-2">
              <Label>Domain (optional)</Label>
              <Input value={form.domain || ""} onChange={(e) => setForm({ ...form, domain: e.target.value })} placeholder="React Specialist" />
            </div>
          </div>
        </GenericModalForm>

        <DeleteConfirmDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title="Delete User"
          description="This will permanently remove this user. Any assigned students will show 'Unassigned'."
          onConfirm={handleDelete}
        />
      </div>
    </DashboardLayout>
  );
};

export default SuperAdminUsers;
