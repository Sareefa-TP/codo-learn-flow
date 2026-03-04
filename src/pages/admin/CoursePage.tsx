import { useState, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    BookOpen, Clock, Briefcase, Pencil, ChevronDown, ChevronUp,
    Plus, Trash2, FileText, FileVideo, Link2, Presentation,
    X, Check, Upload, Calendar,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type MaterialType = "PDF" | "PPT" | "VIDEO" | "LINK";

interface Material {
    id: number;
    title: string;
    type: MaterialType;
    fileName: string;
    link: string;
    uploadedDate: string;
}

interface Module {
    id: number;
    title: string;
    description: string;
    materials: Material[];
}

interface CourseInfo {
    title: string;
    learningDuration: string;
    internshipDuration: string;
    description: string;
}

// ─── Seed Data ────────────────────────────────────────────────────────────────

const seedModules: Module[] = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    title: `Week ${i + 1}`,
    description: "",
    materials: [],
}));

const seedCourse: CourseInfo = {
    title: "Full Stack Development",
    learningDuration: "2 Months",
    internshipDuration: "1 Month",
    description:
        "A comprehensive full-stack web development program covering modern frontend & backend technologies, culminating in a real-world internship.",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

let materialId = 1;
const today = () =>
    new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

const typeIcon: Record<MaterialType, React.ElementType> = {
    PDF: FileText,
    PPT: Presentation,
    VIDEO: FileVideo,
    LINK: Link2,
};

const typeColor: Record<MaterialType, string> = {
    PDF: "bg-red-500/10 text-red-600 border-red-500/20",
    PPT: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    VIDEO: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    LINK: "bg-violet-500/10 text-violet-600 border-violet-500/20",
};

// ─── Add Material Modal ───────────────────────────────────────────────────────

interface AddMaterialModalProps {
    moduleTitle: string;
    onClose: () => void;
    onAdd: (m: Material) => void;
}

const AddMaterialModal = ({ moduleTitle, onClose, onAdd }: AddMaterialModalProps) => {
    const [title, setTitle] = useState("");
    const [type, setType] = useState<MaterialType>("PDF");
    const [fileName, setFileName] = useState("");
    const [link, setLink] = useState("");
    const fileRef = useRef<HTMLInputElement>(null);

    const needsFile = type !== "LINK";
    const needsLink = type === "LINK" || type === "VIDEO";
    const isValid = title.trim() && (type === "LINK" ? link.trim() : fileName || link.trim());

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f) setFileName(f.name);
    };

    const handleAdd = () => {
        if (!isValid) return;
        onAdd({
            id: materialId++,
            title: title.trim(),
            type,
            fileName: needsFile ? fileName : "",
            link: link.trim(),
            uploadedDate: today(),
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
            <div
                className="bg-background border border-border/50 rounded-xl shadow-2xl w-full max-w-md mx-4"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-border/50">
                    <div>
                        <h2 className="text-base font-semibold">Add Material</h2>
                        <p className="text-xs text-muted-foreground mt-0.5">{moduleTitle}</p>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-5 space-y-4">
                    {/* Title */}
                    <div className="space-y-1.5">
                        <Label htmlFor="mat-title">Material Title <span className="text-destructive">*</span></Label>
                        <Input
                            id="mat-title"
                            placeholder="e.g. Introduction to HTML"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                        />
                    </div>

                    {/* Type */}
                    <div className="space-y-1.5">
                        <Label>Material Type <span className="text-destructive">*</span></Label>
                        <Select value={type} onValueChange={v => { setType(v as MaterialType); setFileName(""); setLink(""); }}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PDF">PDF Document</SelectItem>
                                <SelectItem value="PPT">Presentation (PPT)</SelectItem>
                                <SelectItem value="VIDEO">Video File</SelectItem>
                                <SelectItem value="LINK">External Video Link</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* File Upload */}
                    {needsFile && (
                        <div className="space-y-1.5">
                            <Label>Upload File</Label>
                            <div
                                className="border-2 border-dashed border-border/50 rounded-lg p-4 text-center cursor-pointer hover:bg-muted/30 transition-colors"
                                onClick={() => fileRef.current?.click()}
                            >
                                <input ref={fileRef} type="file" className="hidden" onChange={handleFile}
                                    accept={type === "PDF" ? ".pdf" : type === "PPT" ? ".ppt,.pptx" : ".mp4,.mov,.avi"} />
                                <Upload className="w-5 h-5 mx-auto text-muted-foreground mb-1" />
                                {fileName
                                    ? <p className="text-sm font-medium truncate">{fileName}</p>
                                    : <p className="text-sm text-muted-foreground">Click to browse file</p>}
                            </div>
                        </div>
                    )}

                    {/* External Link */}
                    {needsLink && (
                        <div className="space-y-1.5">
                            <Label htmlFor="mat-link">{type === "LINK" ? "Video URL *" : "External Link (optional)"}</Label>
                            <Input
                                id="mat-link"
                                placeholder="https://youtube.com/..."
                                value={link}
                                onChange={e => setLink(e.target.value)}
                            />
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-2 px-5 pb-5">
                    <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
                    <Button size="sm" onClick={handleAdd} disabled={!isValid}>
                        <Plus className="w-3.5 h-3.5 mr-1.5" />
                        Add Material
                    </Button>
                </div>
            </div>
        </div>
    );
};

// ─── Edit Course Modal ────────────────────────────────────────────────────────

interface EditCourseModalProps {
    course: CourseInfo;
    onClose: () => void;
    onSave: (c: CourseInfo) => void;
}

const EditCourseModal = ({ course, onClose, onSave }: EditCourseModalProps) => {
    const [form, setForm] = useState<CourseInfo>({ ...course });
    const set = (k: keyof CourseInfo) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm(f => ({ ...f, [k]: e.target.value }));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
            <div
                className="bg-background border border-border/50 rounded-xl shadow-2xl w-full max-w-md mx-4"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-5 border-b border-border/50">
                    <h2 className="text-base font-semibold">Edit Course Info</h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <div className="p-5 space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="c-title">Course Title</Label>
                        <Input id="c-title" value={form.title} onChange={set("title")} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="c-learn">Learning Duration</Label>
                            <Input id="c-learn" value={form.learningDuration} onChange={set("learningDuration")} placeholder="e.g. 2 Months" />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="c-intern">Internship Duration</Label>
                            <Input id="c-intern" value={form.internshipDuration} onChange={set("internshipDuration")} placeholder="e.g. 1 Month" />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="c-desc">Description</Label>
                        <Input id="c-desc" value={form.description} onChange={set("description")} />
                    </div>
                </div>
                <div className="flex justify-end gap-2 px-5 pb-5">
                    <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
                    <Button size="sm" onClick={() => { onSave(form); onClose(); }}>
                        <Check className="w-3.5 h-3.5 mr-1.5" />
                        Save Changes
                    </Button>
                </div>
            </div>
        </div>
    );
};

// ─── Module Row ───────────────────────────────────────────────────────────────

interface ModuleRowProps {
    module: Module;
    onUpdate: (m: Module) => void;
}

const ModuleRow = ({ module, onUpdate }: ModuleRowProps) => {
    const [open, setOpen] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingTitle, setEditingTitle] = useState(false);
    const [editingDesc, setEditingDesc] = useState(false);
    const [tempTitle, setTempTitle] = useState(module.title);
    const [tempDesc, setTempDesc] = useState(module.description);
    const [editingMatId, setEditingMatId] = useState<number | null>(null);
    const [editingMatTitle, setEditingMatTitle] = useState("");

    const saveTitle = () => {
        onUpdate({ ...module, title: tempTitle.trim() || module.title });
        setEditingTitle(false);
    };
    const saveDesc = () => {
        onUpdate({ ...module, description: tempDesc });
        setEditingDesc(false);
    };
    const deleteMat = (id: number) =>
        onUpdate({ ...module, materials: module.materials.filter(m => m.id !== id) });
    const startEditMat = (mat: Material) => { setEditingMatId(mat.id); setEditingMatTitle(mat.title); };
    const saveEditMat = () => {
        onUpdate({
            ...module,
            materials: module.materials.map(m =>
                m.id === editingMatId ? { ...m, title: editingMatTitle.trim() || m.title } : m
            ),
        });
        setEditingMatId(null);
    };
    const addMaterial = (mat: Material) =>
        onUpdate({ ...module, materials: [...module.materials, mat] });

    return (
        <>
            <Card className={`border-border/50 shadow-sm rounded-xl overflow-hidden transition-all duration-200 ${open ? "shadow-md" : ""}`}>
                {/* Module Header */}
                <button
                    className="w-full flex items-center justify-between p-4 hover:bg-muted/20 transition-colors text-left"
                    onClick={() => setOpen(o => !o)}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-primary">{module.id}</span>
                        </div>
                        <div>
                            <p className="font-semibold text-sm">{module.title}</p>
                            {module.description && (
                                <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{module.description}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                        <Badge variant="outline" className="text-xs">{module.materials.length} materials</Badge>
                        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                    </div>
                </button>

                {/* Expanded Body */}
                {open && (
                    <div className="border-t border-border/30 bg-muted/10 p-5 space-y-5">

                        {/* Editable Title */}
                        <div className="space-y-1">
                            <Label className="text-xs">Module Title</Label>
                            {editingTitle ? (
                                <div className="flex gap-2">
                                    <Input value={tempTitle} onChange={e => setTempTitle(e.target.value)} className="h-8 text-sm" autoFocus />
                                    <Button size="sm" className="h-8 px-3" onClick={saveTitle}><Check className="w-3 h-3" /></Button>
                                    <Button size="sm" variant="ghost" className="h-8 px-3" onClick={() => setEditingTitle(false)}><X className="w-3 h-3" /></Button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">{module.title}</span>
                                    <button onClick={() => setEditingTitle(true)} className="text-muted-foreground hover:text-foreground transition-colors">
                                        <Pencil className="w-3 h-3" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Editable Description */}
                        <div className="space-y-1">
                            <Label className="text-xs">Module Description</Label>
                            {editingDesc ? (
                                <div className="flex gap-2">
                                    <Input value={tempDesc} onChange={e => setTempDesc(e.target.value)} className="h-8 text-sm" placeholder="Brief overview of this week..." autoFocus />
                                    <Button size="sm" className="h-8 px-3" onClick={saveDesc}><Check className="w-3 h-3" /></Button>
                                    <Button size="sm" variant="ghost" className="h-8 px-3" onClick={() => setEditingDesc(false)}><X className="w-3 h-3" /></Button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">{module.description || "No description yet."}</span>
                                    <button onClick={() => setEditingDesc(true)} className="text-muted-foreground hover:text-foreground transition-colors">
                                        <Pencil className="w-3 h-3" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Materials */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label className="text-xs">Learning Materials</Label>
                                <Button size="sm" variant="outline" className="h-7 text-xs px-2.5 gap-1.5" onClick={() => setShowAddModal(true)}>
                                    <Plus className="w-3 h-3" />
                                    Add Material
                                </Button>
                            </div>

                            {module.materials.length === 0 ? (
                                <div className="text-center py-6 text-muted-foreground border border-dashed border-border/40 rounded-lg">
                                    <Upload className="w-6 h-6 mx-auto opacity-30 mb-1.5" />
                                    <p className="text-xs">No materials yet. Add PDF, PPT, Video, or Link.</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {module.materials.map(mat => {
                                        const Icon = typeIcon[mat.type];
                                        return (
                                            <div
                                                key={mat.id}
                                                className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border/40 hover:border-border/70 transition-colors group"
                                            >
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border ${typeColor[mat.type]}`}>
                                                    <Icon className="w-3.5 h-3.5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    {editingMatId === mat.id ? (
                                                        <div className="flex gap-2">
                                                            <Input
                                                                value={editingMatTitle}
                                                                onChange={e => setEditingMatTitle(e.target.value)}
                                                                className="h-7 text-xs"
                                                                autoFocus
                                                            />
                                                            <button onClick={saveEditMat} className="text-emerald-600 hover:text-emerald-700"><Check className="w-3.5 h-3.5" /></button>
                                                            <button onClick={() => setEditingMatId(null)} className="text-muted-foreground hover:text-foreground"><X className="w-3.5 h-3.5" /></button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-sm font-medium truncate">{mat.title}</p>
                                                            <button
                                                                onClick={() => startEditMat(mat)}
                                                                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-all"
                                                            >
                                                                <Pencil className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className={`text-[10px] font-medium px-1.5 py-0 rounded-full border ${typeColor[mat.type]}`}>{mat.type}</span>
                                                        {mat.fileName && <span className="text-[10px] text-muted-foreground truncate">{mat.fileName}</span>}
                                                        <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                                                            <Calendar className="w-2.5 h-2.5" />{mat.uploadedDate}
                                                        </span>
                                                    </div>
                                                </div>
                                                {mat.link && (
                                                    <a href={mat.link} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline flex-shrink-0">
                                                        <Link2 className="w-3.5 h-3.5" />
                                                    </a>
                                                )}
                                                <button
                                                    onClick={() => deleteMat(mat.id)}
                                                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all flex-shrink-0"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Card>

            {showAddModal && (
                <AddMaterialModal
                    moduleTitle={module.title}
                    onClose={() => setShowAddModal(false)}
                    onAdd={addMaterial}
                />
            )}
        </>
    );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const CoursePage = () => {
    const [course, setCourse] = useState<CourseInfo>(seedCourse);
    const [modules, setModules] = useState<Module[]>(seedModules);
    const [showEditCourse, setShowEditCourse] = useState(false);

    const totalMaterials = modules.reduce((s, m) => s + m.materials.length, 0);

    const updateModule = (updated: Module) =>
        setModules(ms => ms.map(m => m.id === updated.id ? updated : m));

    return (
        <>
            <DashboardLayout>
                <div className="animate-fade-in space-y-6 max-w-5xl mx-auto pb-10">

                    {/* ── Page Header ── */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
                                Course Management
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                Manage the course structure, weekly modules and learning materials.
                            </p>
                        </div>
                    </div>

                    {/* ── Course Info Card ── */}
                    <Card className="border-border/50 shadow-sm rounded-xl">
                        <CardHeader className="pb-4">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <BookOpen className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl">{course.title}</CardTitle>
                                        <p className="text-sm text-muted-foreground mt-0.5">Sole program · {totalMaterials} materials across {modules.length} modules</p>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" className="gap-2 flex-shrink-0" onClick={() => setShowEditCourse(true)}>
                                    <Pencil className="w-3.5 h-3.5" />
                                    Edit Course Info
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">{course.description}</p>
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                    <Clock className="w-4 h-4 text-blue-600" />
                                    <div>
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Learning</p>
                                        <p className="text-sm font-semibold text-blue-600">{course.learningDuration}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                    <Briefcase className="w-4 h-4 text-emerald-600" />
                                    <div>
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Internship</p>
                                        <p className="text-sm font-semibold text-emerald-600">{course.internshipDuration}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-violet-500/10 border border-violet-500/20">
                                    <BookOpen className="w-4 h-4 text-violet-600" />
                                    <div>
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Modules</p>
                                        <p className="text-sm font-semibold text-violet-600">{modules.length} Weeks</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* ── Module List ── */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-base font-semibold">Weekly Modules</h2>
                            <span className="text-xs text-muted-foreground">{modules.length} modules · {totalMaterials} total materials</span>
                        </div>
                        <div className="space-y-3">
                            {modules.map(mod => (
                                <ModuleRow key={mod.id} module={mod} onUpdate={updateModule} />
                            ))}
                        </div>
                    </div>

                </div>
            </DashboardLayout>

            {showEditCourse && (
                <EditCourseModal
                    course={course}
                    onClose={() => setShowEditCourse(false)}
                    onSave={setCourse}
                />
            )}
        </>
    );
};

export default CoursePage;
