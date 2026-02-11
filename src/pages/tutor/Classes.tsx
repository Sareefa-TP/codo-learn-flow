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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Pencil, Trash2, Video, Calendar, Clock, Users } from "lucide-react";
import { TutorClass, tutorClasses as initialClasses } from "@/data/tutorData";
import { toast } from "sonner";

const defaultForm: Omit<TutorClass, "id"> = {
  subject: "", course: "", date: "", time: "", duration: "1.5 hrs", meetLink: "", syllabusUrl: "", studentsEnrolled: 0, status: "scheduled",
};

const TutorClasses = () => {
  const [classes, setClasses] = useState<TutorClass[]>(() => JSON.parse(JSON.stringify(initialClasses)));
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [view, setView] = useState<"list" | "calendar">("list");

  const openAdd = () => { setForm(defaultForm); setEditingId(null); setModalOpen(true); };
  const openEdit = (item: TutorClass) => { setForm({ ...item }); setEditingId(item.id); setModalOpen(true); };
  const openDelete = (id: string) => { setDeleteId(id); setDeleteOpen(true); };

  const handleSave = () => {
    if (editingId) {
      setClasses((prev) => prev.map((c) => (c.id === editingId ? { ...c, ...form } : c)));
      toast.success("Class updated successfully");
    } else {
      const newId = `CLS${String(classes.length + 1).padStart(3, "0")}`;
      setClasses((prev) => [...prev, { id: newId, ...form } as TutorClass]);
      toast.success("Class scheduled successfully");
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      setClasses((prev) => prev.filter((c) => c.id !== deleteId));
      toast.success("Class deleted");
    }
    setDeleteOpen(false);
  };

  const statusBadge = (status: TutorClass["status"]) => {
    const map = { scheduled: "bg-primary/10 text-primary", live: "bg-destructive/10 text-destructive", completed: "bg-muted text-muted-foreground", cancelled: "bg-warning/10 text-warning" };
    return <Badge variant="secondary" className={`${map[status]} border-0 capitalize`}>{status}</Badge>;
  };

  const columns: Column<TutorClass>[] = [
    { key: "subject", header: "Subject", sortable: true, accessor: (c) => c.subject },
    { key: "course", header: "Course", render: (c) => <span className="text-sm text-muted-foreground">{c.course}</span> },
    { key: "date", header: "Date", sortable: true, accessor: (c) => c.date, render: (c) => <span className="text-sm">{c.date}</span> },
    { key: "time", header: "Time", render: (c) => <span className="flex items-center gap-1 text-sm"><Clock className="w-3 h-3" />{c.time}</span> },
    { key: "duration", header: "Duration" },
    { key: "studentsEnrolled", header: "Students", sortable: true, accessor: (c) => c.studentsEnrolled, render: (c) => <span className="flex items-center gap-1 text-sm"><Users className="w-3 h-3" />{c.studentsEnrolled}</span> },
    { key: "status", header: "Status", render: (c) => statusBadge(c.status) },
  ];

  // Calendar view - group by date
  const groupedByDate = classes.reduce((acc, cls) => {
    (acc[cls.date] = acc[cls.date] || []).push(cls);
    return acc;
  }, {} as Record<string, TutorClass[]>);

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-semibold text-foreground tracking-tight">Class Scheduler</h1>
            <p className="text-muted-foreground mt-1">Create and manage your class schedule</p>
          </div>
          <div className="flex items-center gap-2">
            <Tabs value={view} onValueChange={(v) => setView(v as "list" | "calendar")}>
              <TabsList>
                <TabsTrigger value="list">List</TabsTrigger>
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button onClick={openAdd} size="sm" className="gap-2">
              <Plus className="w-4 h-4" /> Add Class
            </Button>
          </div>
        </div>

        {view === "list" ? (
          <DataTable
            data={classes}
            columns={columns}
            searchPlaceholder="Search by subject or course..."
            searchKey={(c) => `${c.subject} ${c.course}`}
            actions={(item) => (
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { window.open(item.meetLink, "_blank"); }}>
                  <Video className="w-4 h-4" />
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
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedByDate).sort(([a], [b]) => a.localeCompare(b)).map(([date, items]) => (
              <div key={date}>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> {new Date(date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short", year: "numeric" })}
                </h3>
                <div className="space-y-2">
                  {items.map((cls) => (
                    <div key={cls.id} className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-card hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                          {cls.time.split(":")[0]}
                        </div>
                        <div>
                          <p className="font-medium">{cls.subject}</p>
                          <p className="text-xs text-muted-foreground">{cls.course} · {cls.time} · {cls.duration} · {cls.studentsEnrolled} students</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {statusBadge(cls.status)}
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(cls)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <GenericModalForm
          open={modalOpen}
          onOpenChange={setModalOpen}
          title={editingId ? "Edit Class" : "Schedule New Class"}
          description={editingId ? "Update class details" : "Add a new class to your schedule"}
          onSubmit={handleSave}
          isValid={!!form.subject && !!form.date && !!form.time}
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label>Subject / Topic</Label>
              <Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="React Hooks Deep Dive" />
            </div>
            <div className="space-y-2">
              <Label>Course</Label>
              <Select value={form.course} onValueChange={(v) => setForm({ ...form, course: v })}>
                <SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full Stack Web Dev">Full Stack Web Dev</SelectItem>
                  <SelectItem value="Data Science Mastery">Data Science Mastery</SelectItem>
                  <SelectItem value="UI/UX Design Pro">UI/UX Design Pro</SelectItem>
                  <SelectItem value="React Advanced">React Advanced</SelectItem>
                  <SelectItem value="Cloud & DevOps">Cloud & DevOps</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as TutorClass["status"] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="live">Live</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Time</Label>
              <Input value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} placeholder="10:00 AM" />
            </div>
            <div className="space-y-2">
              <Label>Duration</Label>
              <Input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="1.5 hrs" />
            </div>
            <div className="space-y-2">
              <Label>Students</Label>
              <Input type="number" value={form.studentsEnrolled} onChange={(e) => setForm({ ...form, studentsEnrolled: parseInt(e.target.value) || 0 })} />
            </div>
            <div className="space-y-2 col-span-2">
              <Label>Google Meet Link</Label>
              <Input value={form.meetLink} onChange={(e) => setForm({ ...form, meetLink: e.target.value })} placeholder="https://meet.google.com/..." />
            </div>
            <div className="space-y-2 col-span-2">
              <Label>Syllabus URL</Label>
              <Input value={form.syllabusUrl} onChange={(e) => setForm({ ...form, syllabusUrl: e.target.value })} placeholder="/syllabus/topic.pdf" />
            </div>
          </div>
        </GenericModalForm>

        <DeleteConfirmDialog open={deleteOpen} onOpenChange={setDeleteOpen} title="Delete Class" description="This will permanently remove this class from the schedule." onConfirm={handleDelete} />
      </div>
    </DashboardLayout>
  );
};

export default TutorClasses;
