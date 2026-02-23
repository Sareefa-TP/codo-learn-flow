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
import { Plus, Pencil, Trash2, FileText, Video, FolderOpen, Link2 } from "lucide-react";
import { TutorResource, tutorResources as initialResources } from "@/data/tutorData";
import { toast } from "sonner";

const defaultForm: Omit<TutorResource, "id"> = {
  title: "", subject: "", type: "pdf", url: "", uploadedDate: new Date().toISOString().slice(0, 10), size: "",
};

const typeIcons: Record<string, React.ReactNode> = {
  pdf: <FileText className="w-4 h-4 text-destructive" />,
  video: <Video className="w-4 h-4 text-primary" />,
  drive_folder: <FolderOpen className="w-4 h-4 text-warning" />,
  link: <Link2 className="w-4 h-4 text-muted-foreground" />,
};

const TutorMaterials = () => {
  const [resources, setResources] = useState<TutorResource[]>(() => JSON.parse(JSON.stringify(initialResources)));
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);

  const openAdd = () => { setForm(defaultForm); setEditingId(null); setModalOpen(true); };
  const openEdit = (item: TutorResource) => { setForm({ ...item }); setEditingId(item.id); setModalOpen(true); };
  const openDelete = (id: string) => { setDeleteId(id); setDeleteOpen(true); };

  const handleSave = () => {
    if (editingId) {
      setResources((prev) => prev.map((r) => (r.id === editingId ? { ...r, ...form } : r)));
      toast.success("Resource updated successfully");
    } else {
      const newId = `RES${String(resources.length + 1).padStart(3, "0")}`;
      setResources((prev) => [...prev, { id: newId, ...form } as TutorResource]);
      toast.success("Resource uploaded successfully");
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      setResources((prev) => prev.filter((r) => r.id !== deleteId));
      toast.success("Resource deleted");
    }
    setDeleteOpen(false);
  };

  const columns: Column<TutorResource>[] = [
    { key: "type", header: "Type", render: (r) => <div className="flex items-center gap-2">{typeIcons[r.type]}<span className="text-xs uppercase text-muted-foreground">{r.type.replace("_", " ")}</span></div> },
    { key: "title", header: "Title", sortable: true, accessor: (r) => r.title },
    { key: "subject", header: "Subject", render: (r) => <Badge variant="outline" className="text-xs">{r.subject}</Badge> },
    { key: "uploadedDate", header: "Uploaded", sortable: true, accessor: (r) => r.uploadedDate },
    { key: "size", header: "Size", render: (r) => <span className="text-sm text-muted-foreground">{r.size || "—"}</span> },
  ];

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-semibold text-foreground tracking-tight">Resource Library</h1>
            <p className="text-muted-foreground mt-1">Upload and manage course materials</p>
          </div>
          <Button onClick={openAdd} size="sm" className="gap-2">
            <Plus className="w-4 h-4" /> Upload Resource
          </Button>
        </div>

        {/* Summary */}
        <div className="flex items-center gap-4">
          {Object.entries(resources.reduce((acc, r) => { acc[r.type] = (acc[r.type] || 0) + 1; return acc; }, {} as Record<string, number>)).map(([type, count]) => (
            <Badge key={type} variant="secondary" className="gap-1.5 py-1.5 px-3">
              {typeIcons[type]} {count} {type.replace("_", " ")}s
            </Badge>
          ))}
        </div>

        <DataTable
          data={resources}
          columns={columns}
          searchPlaceholder="Search resources..."
          searchKey={(r) => `${r.title} ${r.subject} ${r.type}`}
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

        <GenericModalForm
          open={modalOpen}
          onOpenChange={setModalOpen}
          title={editingId ? "Edit Resource" : "Upload Resource"}
          description={editingId ? "Update resource details" : "Add a new learning resource"}
          onSubmit={handleSave}
          isValid={!!form.title && !!form.subject && !!form.url}
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="React Hooks Cheat Sheet" />
            </div>
            <div className="space-y-2">
              <Label>Subject</Label>
              <Select value={form.subject} onValueChange={(v) => setForm({ ...form, subject: v })}>
                <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full Stack Web Dev">Full Stack Web Dev</SelectItem>
                  <SelectItem value="Data Science Mastery">Data Science Mastery</SelectItem>
                  <SelectItem value="UI/UX Design Pro">UI/UX Design Pro</SelectItem>
                  <SelectItem value="React Advanced">React Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as TutorResource["type"] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="drive_folder">Drive Folder</SelectItem>
                  <SelectItem value="link">Link</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 col-span-2">
              <Label>URL / Path</Label>
              <Input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label>File Size (optional)</Label>
              <Input value={form.size || ""} onChange={(e) => setForm({ ...form, size: e.target.value })} placeholder="2.4 MB" />
            </div>
          </div>
        </GenericModalForm>

        <DeleteConfirmDialog open={deleteOpen} onOpenChange={setDeleteOpen} title="Delete Resource" description="This will permanently remove this resource." onConfirm={handleDelete} />
      </div>
    </DashboardLayout>
  );
};

export default TutorMaterials;
