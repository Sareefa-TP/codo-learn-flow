import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
    Plus, Search, Eye, Edit, Trash2, CalendarIcon, UploadCloud, Users,
    AlertCircle, CheckCircle2, Clock, FileText,
} from "lucide-react";
import { toast } from "sonner";
import { TaskDatePicker } from "@/components/mentor/TaskDatePicker";

// ─── Types ────────────────────────────────────────────────────────────────────

type Priority = "High" | "Medium" | "Low";
type Status = "Active" | "Completed" | "Overdue";

interface Intern {
    id: string;
    name: string;
    email: string;
    batch: string;
}

interface Task {
    id: string;
    title: string;
    week: string;
    assignedInterns: string[];  // array of intern IDs
    dueDate: string;
    priority: Priority;
    status: Status;
    description?: string;
    instructions?: string;
    fileName?: string;
    createdDate?: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const availableInterns: Intern[] = [
    { id: "INT-001", name: "Aarav Singh", email: "aarav.s@example.com", batch: "Full Stack - Mar 2026" },
    { id: "INT-002", name: "Priya Sharma", email: "priya.s@example.com", batch: "Full Stack - Mar 2026" },
    { id: "INT-003", name: "Rahul Mehta", email: "rahul.m@example.com", batch: "Full Stack - Mar 2026" },
    { id: "INT-004", name: "Sneha Verma", email: "sneha.v@example.com", batch: "Full Stack - Mar 2026" },
    { id: "INT-005", name: "Karan Nair", email: "karan.n@example.com", batch: "Full Stack - Mar 2026" },
];

const initialTasks: Task[] = [
    {
        id: "TSK-001", title: "Build Login Page", week: "Week 1",
        assignedInterns: ["INT-001", "INT-002"],
        dueDate: "2026-03-10", priority: "High", status: "Completed",
        description: "Design and implement the login screen with email/password fields, validation states and error handling.",
        instructions: "Use Tailwind and Shadcn components. Match the Figma mockup exactly. Handle loading and error states.",
        createdDate: "2026-02-28",
    },
    {
        id: "TSK-002", title: "API Integration", week: "Week 2",
        assignedInterns: ["INT-002"],
        dueDate: "2026-03-15", priority: "Medium", status: "Active",
        description: "Integrate the REST API endpoints with the frontend application.",
        createdDate: "2026-03-01",
    },
    {
        id: "TSK-003", title: "Database Schema Design", week: "Week 1",
        assignedInterns: ["INT-004", "INT-003"],
        dueDate: "2026-03-05", priority: "High", status: "Overdue",
        description: "Design the normalized database schema for the application.",
        createdDate: "2026-02-27",
    },
    {
        id: "TSK-004", title: "Setup Authentication", week: "Week 3",
        assignedInterns: ["INT-003"],
        dueDate: "2026-03-20", priority: "Low", status: "Active",
        createdDate: "2026-03-02",
    },
    {
        id: "TSK-005", title: "UI Mockups", week: "Week 2",
        assignedInterns: ["INT-001", "INT-002", "INT-005"],
        dueDate: "2026-03-12", priority: "Medium", status: "Completed",
        description: "Create high-fidelity UI mockups for all main screens.",
        createdDate: "2026-03-01",
    },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getIntern = (id: string) => availableInterns.find(i => i.id === id);

const getInitials = (name: string) =>
    name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

const priorityStyles: Record<Priority, string> = {
    High: "bg-red-500/10 text-red-600 border-red-500/20",
    Medium: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    Low: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
};

const statusStyles: Record<Status, string> = {
    Active: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    Completed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    Overdue: "bg-rose-500/10 text-rose-600 border-rose-500/20",
};

const StatusIcon = ({ status }: { status: Status }) => {
    if (status === "Completed") return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;
    if (status === "Overdue") return <AlertCircle className="w-3.5 h-3.5 text-rose-600" />;
    return <Clock className="w-3.5 h-3.5 text-blue-600" />;
};

// ─── Intern Avatars displayed in the table ───────────────────────────────────

const InternAvatarList = ({ ids, max = 3 }: { ids: string[]; max?: number }) => {
    const visible = ids.slice(0, max);
    const extra = ids.length - max;
    return (
        <div className="flex items-center gap-1 flex-wrap">
            {visible.map(id => {
                const intern = getIntern(id);
                if (!intern) return null;
                return (
                    <span
                        key={id}
                        title={intern.name}
                        className="inline-flex items-center gap-1 text-[11px] font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/15"
                    >
                        <span className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-[9px] font-bold shrink-0">
                            {getInitials(intern.name)}
                        </span>
                        {intern.name.split(" ")[0]}
                    </span>
                );
            })}
            {extra > 0 && (
                <span className="text-[11px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full border border-border/40">
                    +{extra} more
                </span>
            )}
        </div>
    );
};

// ─── Page Component ───────────────────────────────────────────────────────────

const MentorTasks = () => {
    const [search, setSearch] = useState("");
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
    const [taskToView, setTaskToView] = useState<Task | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const emptyForm = {
        id: "", title: "", week: "", description: "", instructions: "",
        dueDate: "", priority: "" as Priority | "", fileName: "",
        assignedInterns: [] as string[],
    };
    const [formData, setFormData] = useState(emptyForm);

    const toggleIntern = (id: string) =>
        setFormData(prev => ({
            ...prev,
            assignedInterns: prev.assignedInterns.includes(id)
                ? prev.assignedInterns.filter(x => x !== id)
                : [...prev.assignedInterns, id],
        }));

    const filteredTasks = tasks.filter(t => {
        const q = search.toLowerCase();
        const internNames = t.assignedInterns.map(id => getIntern(id)?.name ?? "").join(" ").toLowerCase();
        return t.title.toLowerCase().includes(q) || internNames.includes(q);
    });

    // ─── Handlers ─────────────────────────────────────────────────────────────

    const handleOpenCreate = () => { setFormData({ ...emptyForm }); setCreateModalOpen(true); };

    const handleCreateTask = () => {
        if (!formData.title || !formData.week || !formData.dueDate || !formData.priority) {
            toast.error("Please fill in all required fields."); return;
        }
        if (formData.assignedInterns.length === 0) {
            toast.error("Please assign at least one intern."); return;
        }
        setTasks([{
            id: `TSK-00${tasks.length + 1}`,
            title: formData.title,
            week: formData.week,
            assignedInterns: formData.assignedInterns,
            dueDate: formData.dueDate,
            priority: formData.priority as Priority,
            status: "Active",
            description: formData.description,
            instructions: formData.instructions,
            fileName: formData.fileName,
            createdDate: new Date().toISOString().split("T")[0],
        }, ...tasks]);
        toast.success("Task created and assigned successfully");
        setCreateModalOpen(false);
    };

    const handleOpenEdit = (task: Task) => {
        setFormData({
            id: task.id,
            title: task.title,
            week: task.week,
            description: task.description ?? "",
            instructions: task.instructions ?? "",
            dueDate: task.dueDate,
            priority: task.priority,
            fileName: task.fileName ?? "",
            assignedInterns: task.assignedInterns,
        });
        setEditModalOpen(true);
    };

    const handleEditTask = () => {
        if (!formData.title || !formData.week || !formData.dueDate || !formData.priority) {
            toast.error("Please fill in all required fields."); return;
        }
        if (formData.assignedInterns.length === 0) {
            toast.error("Please assign at least one intern."); return;
        }
        setTasks(tasks.map(t => t.id !== formData.id ? t : {
            ...t,
            title: formData.title,
            week: formData.week,
            dueDate: formData.dueDate,
            priority: formData.priority as Priority,
            description: formData.description,
            instructions: formData.instructions,
            fileName: formData.fileName,
            assignedInterns: formData.assignedInterns,
        }));
        toast.success("Task updated successfully");
        setEditModalOpen(false);
    };

    const handleOpenDelete = (task: Task) => { setTaskToDelete(task); setDeleteModalOpen(true); };
    const confirmDelete = () => {
        if (taskToDelete) {
            setTasks(tasks.filter(t => t.id !== taskToDelete.id));
            toast.success("Task deleted");
            setDeleteModalOpen(false); setTaskToDelete(null);
        }
    };

    const handleViewTask = (task: Task) => { setTaskToView(task); setViewModalOpen(true); };

    // ─── Form Fields ─────────────────────────────────────────────────────────

    const TaskFormFields = () => (
        <div className="p-6 overflow-y-auto max-h-[70vh] space-y-5">
            <div className="space-y-2">
                <Label className="font-semibold">Task Title <span className="text-destructive">*</span></Label>
                <Input placeholder="e.g., Build Authentication Page" value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="font-semibold">Week <span className="text-destructive">*</span></Label>
                    <Select value={formData.week} onValueChange={val => setFormData({ ...formData, week: val })}>
                        <SelectTrigger><SelectValue placeholder="Select week" /></SelectTrigger>
                        <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(w => <SelectItem key={w} value={`Week ${w}`}>Week {w}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label className="font-semibold">Priority <span className="text-destructive">*</span></Label>
                    <Select value={formData.priority} onValueChange={val => setFormData({ ...formData, priority: val as Priority })}>
                        <SelectTrigger><SelectValue placeholder="Select priority" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="High">🔴 High</SelectItem>
                            <SelectItem value="Medium">🟡 Medium</SelectItem>
                            <SelectItem value="Low">🟢 Low</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <Label className="font-semibold">Due Date <span className="text-destructive">*</span></Label>
                <TaskDatePicker
                    value={formData.dueDate}
                    onChange={val => setFormData({ ...formData, dueDate: val })}
                />
            </div>

            {/* Assign Interns */}
            <div className="space-y-2">
                <Label className="font-semibold flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    Assign Interns <span className="text-destructive">*</span>
                </Label>
                <div className="border border-border/50 rounded-xl overflow-hidden divide-y divide-border/30">
                    {availableInterns.map(intern => {
                        const selected = formData.assignedInterns.includes(intern.id);
                        return (
                            <label key={intern.id} htmlFor={`intern-cb-${intern.id}`}
                                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${selected ? "bg-primary/5" : "hover:bg-muted/30"}`}>
                                <Checkbox
                                    id={`intern-cb-${intern.id}`}
                                    checked={selected}
                                    onCheckedChange={() => toggleIntern(intern.id)}
                                />
                                <div className="w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                                    {getInitials(intern.name)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium">{intern.name}</p>
                                    <p className="text-xs text-muted-foreground truncate">{intern.email}</p>
                                </div>
                                {selected && <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20 shrink-0">Selected</Badge>}
                            </label>
                        );
                    })}
                </div>
                {formData.assignedInterns.length > 0 && (
                    <p className="text-xs text-muted-foreground">{formData.assignedInterns.length} intern{formData.assignedInterns.length > 1 ? "s" : ""} selected</p>
                )}
            </div>

            <div className="space-y-2">
                <Label className="font-semibold">Description</Label>
                <Textarea placeholder="Brief overview..." rows={3} value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })} />
            </div>

            <div className="space-y-2">
                <Label className="font-semibold">Task Instructions</Label>
                <Textarea placeholder="Step-by-step instructions..." rows={4} value={formData.instructions}
                    onChange={e => setFormData({ ...formData, instructions: e.target.value })} />
            </div>

            {/* Attach Materials */}
            <div className="space-y-2">
                <Label className="font-semibold">Attach Materials</Label>
                <div className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${isDragging ? "border-primary bg-primary/10" :
                    formData.fileName ? "border-primary/40 bg-primary/5" : "border-border/60 hover:bg-muted/30"
                    }`}
                    onClick={() => document.getElementById("mentor-task-upload")?.click()}
                    onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={e => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files?.[0]; if (f) setFormData({ ...formData, fileName: f.name }); }}
                >
                    <UploadCloud className={`w-8 h-8 mb-2 mx-auto ${isDragging ? "text-primary" : "text-primary/60"}`} />
                    <Input id="mentor-task-upload" type="file" className="hidden"
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.webp,.mp4,.mov,.zip,.rar"
                        onChange={e => { const f = e.target.files?.[0]; if (f) setFormData({ ...formData, fileName: f.name }); }} />
                    {formData.fileName
                        ? <p className="text-sm font-medium">{formData.fileName}</p>
                        : <>
                            <p className={`text-sm font-medium ${isDragging ? "text-primary" : ""}`}>{isDragging ? "Drop file here" : "Click or drag to upload"}</p>
                            <p className="text-xs text-muted-foreground mt-1">Images, Documents, Archives supported</p>
                        </>
                    }
                </div>
            </div>
        </div>
    );

    // ─── Render ───────────────────────────────────────────────────────────────

    return (
        <DashboardLayout>
            <div className="animate-fade-in space-y-6 max-w-7xl mx-auto pb-10">

                {/* ── Header ── */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Tasks</h1>
                        <p className="text-muted-foreground mt-1 text-sm">Manage and assign tasks for your interns.</p>
                    </div>
                    <div className="flex gap-3">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input placeholder="Search tasks or interns..." className="pl-9 bg-background shadow-sm"
                                value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                        <Button className="gap-2 shadow-sm whitespace-nowrap" onClick={handleOpenCreate}>
                            <Plus className="w-4 h-4" /> Create Task
                        </Button>
                    </div>
                </div>

                {/* ── Table ── */}
                <Card className="border-border/50 shadow-sm rounded-xl overflow-hidden">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/30">
                                        <TableHead className="text-xs font-semibold">Task Title</TableHead>
                                        <TableHead className="text-xs font-semibold">Priority</TableHead>
                                        <TableHead className="text-xs font-semibold">Due Date</TableHead>
                                        <TableHead className="text-xs font-semibold">Week</TableHead>
                                        <TableHead className="text-xs font-semibold">Assigned Interns</TableHead>
                                        <TableHead className="text-xs font-semibold">Status</TableHead>
                                        <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredTasks.length > 0 ? filteredTasks.map(task => (
                                        <TableRow key={task.id} className="hover:bg-muted/10 transition-colors group">
                                            <TableCell className="font-medium text-sm max-w-[190px] truncate">{task.title}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={`text-[10px] font-semibold ${priorityStyles[task.priority]}`}>
                                                    {task.priority}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground whitespace-nowrap">{task.dueDate}</TableCell>
                                            <TableCell className="text-sm text-muted-foreground whitespace-nowrap">{task.week}</TableCell>
                                            <TableCell>
                                                {task.assignedInterns.length > 0
                                                    ? <InternAvatarList ids={task.assignedInterns} max={2} />
                                                    : <span className="text-xs text-muted-foreground">—</span>
                                                }
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1.5">
                                                    <StatusIcon status={task.status} />
                                                    <Badge variant="outline" className={`text-[10px] font-semibold ${statusStyles[task.status]}`}>
                                                        {task.status}
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary hover:bg-primary/10" title="View" onClick={() => handleViewTask(task)}>
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-amber-500 hover:bg-amber-500/10" title="Edit" onClick={() => handleOpenEdit(task)}>
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-red-500 hover:bg-red-500/10" title="Delete" onClick={() => handleOpenDelete(task)}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow>
                                            <TableCell colSpan={7} className="h-24 text-center text-muted-foreground text-sm">
                                                No tasks found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* ══ Modals ═══════════════════════════════════════════════════════════════ */}

                {/* View Task Modal */}
                <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
                    <DialogContent className="sm:max-w-[580px] p-0 overflow-hidden border-border/50">
                        {taskToView && (
                            <>
                                <DialogHeader className="pt-6 px-6 pb-4 border-b border-border/40 bg-muted/20">
                                    <div className="flex items-start justify-between gap-3">
                                        <DialogTitle className="text-xl font-bold pr-8">{taskToView.title}</DialogTitle>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <Badge variant="outline" className={`text-[10px] font-semibold ${priorityStyles[taskToView.priority]}`}>
                                                {taskToView.priority}
                                            </Badge>
                                            <Badge variant="outline" className={`text-[10px] font-semibold ${statusStyles[taskToView.status]}`}>
                                                {taskToView.status}
                                            </Badge>
                                        </div>
                                    </div>
                                </DialogHeader>

                                <div className="p-6 overflow-y-auto max-h-[65vh] space-y-5">
                                    {/* Meta info row */}
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="space-y-1">
                                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Week</p>
                                            <p className="text-sm font-medium">{taskToView.week}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Due Date</p>
                                            <p className="text-sm font-medium">{taskToView.dueDate}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Created</p>
                                            <p className="text-sm font-medium">{taskToView.createdDate ?? "—"}</p>
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Assigned Interns */}
                                    <div className="space-y-3">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                                            <Users className="w-3.5 h-3.5" /> Assigned Interns ({taskToView.assignedInterns.length})
                                        </p>
                                        {taskToView.assignedInterns.length > 0 ? (
                                            <div className="space-y-2">
                                                {taskToView.assignedInterns.map(id => {
                                                    const intern = getIntern(id);
                                                    if (!intern) return null;
                                                    return (
                                                        <div key={id} className="flex items-center gap-3 p-2.5 rounded-lg border border-border/40 bg-muted/10">
                                                            <div className="w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                                                                {getInitials(intern.name)}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium">{intern.name}</p>
                                                                <p className="text-xs text-muted-foreground">{intern.email} · {intern.batch}</p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-muted-foreground">No interns assigned.</p>
                                        )}
                                    </div>

                                    {/* Description */}
                                    {taskToView.description && (
                                        <>
                                            <Separator />
                                            <div className="space-y-2">
                                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Description</p>
                                                <p className="text-sm text-foreground leading-relaxed">{taskToView.description}</p>
                                            </div>
                                        </>
                                    )}

                                    {/* Instructions */}
                                    {taskToView.instructions && (
                                        <>
                                            <Separator />
                                            <div className="space-y-2">
                                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Instructions</p>
                                                <div className="bg-primary/5 border border-primary/10 rounded-lg p-4">
                                                    <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{taskToView.instructions}</p>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {/* Attached File */}
                                    {taskToView.fileName && (
                                        <>
                                            <Separator />
                                            <div className="space-y-2">
                                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Attached Material</p>
                                                <div className="flex items-center gap-3 p-3 rounded-lg border border-border/40 bg-muted/10">
                                                    <FileText className="w-5 h-5 text-blue-600 shrink-0" />
                                                    <p className="text-sm font-medium">{taskToView.fileName}</p>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="p-4 border-t border-border/40 bg-muted/20 flex justify-between items-center">
                                    <Button variant="outline" className="gap-1.5" onClick={() => { handleOpenEdit(taskToView); setViewModalOpen(false); }}>
                                        <Edit className="w-3.5 h-3.5" /> Edit Task
                                    </Button>
                                    <Button onClick={() => setViewModalOpen(false)}>Close</Button>
                                </div>
                            </>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Create Modal */}
                <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
                    <DialogContent className="sm:max-w-[620px] p-0 overflow-hidden border-border/50">
                        <DialogHeader className="pt-6 px-6 pb-4 border-b border-border/40 bg-muted/20">
                            <DialogTitle className="text-xl font-bold">Create New Task</DialogTitle>
                        </DialogHeader>
                        <TaskFormFields />
                        <DialogFooter className="p-4 border-t border-border/40 bg-muted/20 gap-2 sm:gap-0">
                            <Button variant="outline" onClick={() => setCreateModalOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreateTask}>Create Task</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Edit Modal */}
                <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
                    <DialogContent className="sm:max-w-[620px] p-0 overflow-hidden border-border/50">
                        <DialogHeader className="pt-6 px-6 pb-4 border-b border-border/40 bg-muted/20">
                            <DialogTitle className="text-xl font-bold">Edit Task</DialogTitle>
                        </DialogHeader>
                        <TaskFormFields />
                        <DialogFooter className="p-4 border-t border-border/40 bg-muted/20 gap-2 sm:gap-0">
                            <Button variant="outline" onClick={() => setEditModalOpen(false)}>Cancel</Button>
                            <Button onClick={handleEditTask}>Save Changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation */}
                <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Delete Task</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete{" "}
                                <span className="font-semibold text-foreground">{taskToDelete?.title}</span>?
                                This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
                            <Button variant="destructive" onClick={confirmDelete}>Delete Task</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

            </div>
        </DashboardLayout>
    );
};

export default MentorTasks;
