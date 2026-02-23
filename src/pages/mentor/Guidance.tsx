import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import DeleteConfirmDialog from "@/components/superadmin/DeleteConfirmDialog";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { menteeNotes as initialNotes, MenteeNote, mentees } from "@/data/mentorData";
import { toast } from "sonner";

const MentorGuidance = () => {
  const [notes, setNotes] = useState<MenteeNote[]>(() => JSON.parse(JSON.stringify(initialNotes)));
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ menteeId: "", type: "observation" as MenteeNote["type"], content: "" });

  const filtered = notes
    .filter((n) => filterType === "all" || n.type === filterType)
    .filter((n) => `${n.menteeName} ${n.content}`.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => { setForm({ menteeId: "", type: "observation", content: "" }); setEditingId(null); setModalOpen(true); };
  const openEdit = (note: MenteeNote) => { setForm({ menteeId: note.menteeId, type: note.type, content: note.content }); setEditingId(note.id); setModalOpen(true); };
  const openDelete = (id: string) => { setDeleteId(id); setDeleteOpen(true); };

  const handleSave = () => {
    const mentee = mentees.find((m) => m.id === form.menteeId);
    if (editingId) {
      setNotes((prev) => prev.map((n) => n.id === editingId ? { ...n, type: form.type, content: form.content, menteeId: form.menteeId, menteeName: mentee?.name || n.menteeName } : n));
      toast.success("Note updated");
    } else {
      const newNote: MenteeNote = {
        id: `NOTE${String(notes.length + 1).padStart(3, "0")}`,
        menteeId: form.menteeId,
        menteeName: mentee?.name || "",
        type: form.type,
        content: form.content,
        createdDate: new Date().toISOString().slice(0, 10),
      };
      setNotes((prev) => [newNote, ...prev]);
      toast.success("Note added");
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      setNotes((prev) => prev.filter((n) => n.id !== deleteId));
      toast.success("Note deleted");
    }
    setDeleteOpen(false);
  };

  const noteTypeColor = (type: string) => {
    const map: Record<string, string> = { growth: "bg-primary/10 text-primary", career: "bg-role-intern/10 text-role-intern", observation: "bg-muted text-muted-foreground", concern: "bg-destructive/10 text-destructive" };
    return map[type] || "";
  };

  const noteTypeEmoji: Record<string, string> = { growth: "🌱", career: "🎯", observation: "👁️", concern: "⚠️" };

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-semibold text-foreground tracking-tight">Guidance & Notes</h1>
            <p className="text-muted-foreground mt-1">Document observations and guidance for your mentees</p>
          </div>
          <Button onClick={openAdd} size="sm" className="gap-2">
            <Plus className="w-4 h-4" /> Add Note
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search notes..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-1">
            {["all", "growth", "career", "observation", "concern"].map((type) => (
              <Button key={type} variant={filterType === type ? "default" : "outline"} size="sm" className="capitalize" onClick={() => setFilterType(type)}>
                {type === "all" ? "All" : `${noteTypeEmoji[type]} ${type}`}
              </Button>
            ))}
          </div>
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((note, index) => (
            <Card key={note.id} className="border border-border/60 shadow-card opacity-0 animate-fade-in hover:shadow-md transition-shadow" style={{ animationDelay: `${index * 40}ms` }}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium text-sm">{note.menteeName}</p>
                    <p className="text-xs text-muted-foreground">{note.createdDate}</p>
                  </div>
                  <Badge variant="secondary" className={`${noteTypeColor(note.type)} border-0 capitalize text-xs gap-1`}>
                    {noteTypeEmoji[note.type]} {note.type}
                  </Badge>
                </div>
                <p className="text-sm text-foreground leading-relaxed">{note.content}</p>
                <div className="flex items-center gap-1 mt-4 pt-3 border-t border-border/50">
                  <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => openEdit(note)}>
                    <Pencil className="w-3 h-3 mr-1" /> Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive" onClick={() => openDelete(note.id)}>
                    <Trash2 className="w-3 h-3 mr-1" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">No notes found</div>
          )}
        </div>

        {/* Add/Edit Modal */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="sm:max-w-[480px] rounded-xl">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Note" : "Add Guidance Note"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="space-y-2">
                <Label>Mentee</Label>
                <Select value={form.menteeId} onValueChange={(v) => setForm({ ...form, menteeId: v })}>
                  <SelectTrigger><SelectValue placeholder="Select mentee" /></SelectTrigger>
                  <SelectContent>
                    {mentees.map((m) => <SelectItem key={m.id} value={m.id}>{m.name} ({m.type})</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as MenteeNote["type"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="growth">🌱 Growth</SelectItem>
                    <SelectItem value="career">🎯 Career Advice</SelectItem>
                    <SelectItem value="observation">👁️ Observation</SelectItem>
                    <SelectItem value="concern">⚠️ Concern</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Note</Label>
                <Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Write your guidance note..." rows={4} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={!form.menteeId || !form.content}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <DeleteConfirmDialog open={deleteOpen} onOpenChange={setDeleteOpen} title="Delete Note" description="This will permanently remove this guidance note." onConfirm={handleDelete} />
      </div>
    </DashboardLayout>
  );
};

export default MentorGuidance;
