import { useState, useMemo, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
    ChevronDown, 
    ChevronUp, 
    BookOpen, 
    PlayCircle, 
    Video, 
    FileText, 
    ClipboardList, 
    Globe, 
    Plus, 
    ChevronRight, 
    Home, 
    ArrowLeft,
    Clock,
    CheckCircle2,
    X,
    UploadCloud,
    FileImage,
    Download,
    Trash2,
    Loader2,
    Eye
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Initial Mock Data
const INITIAL_CURRICULUM_DATA: any = {
    "B-001": {
        name: "Jan 2026 Batch",
        course: "Full Stack Development",
        modules: [
            {
                id: "M1",
                title: "Module 1: HTML foundations",
                slug: "html-foundations",
                progress: 100,
                sessions: [
                    {
                        id: "S101",
                        title: "Session 1: HTML Basics & Semantic Tags",
                        slug: "html-basics",
                        liveLink: "https://meet.google.com/abc-defg-hij",
                        notes: [
                            { id: 1, name: "Introduction to HTML5.pdf", size: "1.2 MB", type: "pdf" },
                            { id: 2, name: "Semantic Elements Guide.docx", size: "850 KB", type: "doc" }
                        ],
                        assignments: [
                            { id: 101, name: "Simple Portfolio Page.png", size: "2.4 MB", type: "image" }
                        ],
                        preRecorded: [
                            { id: 201, name: "HTML Structure.mp4", size: "45 MB", type: "video" }
                        ],
                        finishedRecording: "https://vimeo.com/recorded-1"
                    },
                    {
                        id: "S102",
                        title: "Session 2: Forms & User Input",
                        slug: "forms-input",
                        liveLink: "https://meet.google.com/abc-defg-hij",
                        notes: [],
                        assignments: [],
                        preRecorded: [],
                        finishedRecording: null
                    }
                ]
            },
            {
                id: "M2",
                title: "Module 2: CSS Masterclass",
                slug: "css-masterclass",
                progress: 45,
                sessions: [
                    {
                        id: "S201",
                        title: "Session 1: Flexbox & Grid Patterns",
                        slug: "flexbox-grid",
                        liveLink: "https://meet.google.com/abc-defg-hij",
                        notes: [
                            { id: 3, name: "Flexbox Cheat Sheet.pdf", size: "400 KB", type: "pdf" }
                        ],
                        assignments: [],
                        preRecorded: [],
                        finishedRecording: null
                    }
                ]
            }
        ]
    }
};

const TutorTeachingFlow = () => {
    const { batchId, moduleSlug, sessionSlug } = useParams();
    const navigate = useNavigate();
    
    // State-managed curriculum data
    const [teachingData, setTeachingData] = useState(INITIAL_CURRICULUM_DATA);
    
    // Modal State
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [uploadingSection, setUploadingSection] = useState<string | null>(null);
    const [uploadingContext, setUploadingContext] = useState<any>(null); // { modId, sessId }

    const batchData = teachingData[batchId as string] || teachingData["B-001"];
    
    const activeModule = useMemo(() => {
        if (!moduleSlug) return null;
        return batchData.modules.find((m: any) => m.slug === moduleSlug) || null;
    }, [batchData, moduleSlug]);

    const activeSession = useMemo(() => {
        if (!activeModule || !sessionSlug) return null;
        return activeModule.sessions.find((s: any) => s.slug === sessionSlug) || null;
    }, [activeModule, sessionSlug]);

    const handleModuleClick = (mod: any) => {
        if (activeModule?.id === mod.id) {
            navigate(`/tutor/batches/${batchId}/teaching`);
        } else {
            navigate(`/tutor/batches/${batchId}/teaching/${mod.slug}`);
        }
    };

    const handleSessionClick = (session: any) => {
        if (activeSession?.id === session.id) {
            navigate(`/tutor/batches/${batchId}/teaching/${moduleSlug}`);
        } else {
            navigate(`/tutor/batches/${batchId}/teaching/${moduleSlug}/${session.slug}`);
        }
    };

    const openUploadModal = (section: string, modId: string, sessId: string) => {
        setUploadingSection(section);
        setUploadingContext({ modId, sessId });
        setIsUploadModalOpen(true);
    };

    const handleUploadComplete = (newFiles: any[]) => {
        if (!uploadingContext) return;

        setTeachingData((prev: any) => {
            const newData = { ...prev };
            const batch = newData[batchId as string] || newData["B-001"];
            const mod = batch.modules.find((m: any) => m.id === uploadingContext.modId);
            const sess = mod.sessions.find((s: any) => s.id === uploadingContext.sessId);

            const sectionKey = uploadingSection === "Study Notes & PDFs" ? "notes" : 
                              uploadingSection === "Practical Assignment" ? "assignments" : "preRecorded";
            
            sess[sectionKey] = [...sess[sectionKey], ...newFiles];
            return newData;
        });

        setIsUploadModalOpen(false);
    };

    const handleDeleteFile = (modId: string, sessId: string, section: string, fileId: number) => {
        setTeachingData((prev: any) => {
            const newData = { ...prev };
            const batch = newData[batchId as string] || newData["B-001"];
            const mod = batch.modules.find((m: any) => m.id === modId);
            const sess = mod.sessions.find((s: any) => s.id === sessId);

            const sectionKey = section === "Study Notes & PDFs" ? "notes" : 
                              section === "Practical Assignment" ? "assignments" : "preRecorded";
            
            sess[sectionKey] = sess[sectionKey].filter((f: any) => f.id !== fileId);
            return newData;
        });
        toast.error("File deleted");
    };

    return (
        <DashboardLayout>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto px-4 lg:px-8 pb-10">
                
                {/* Breadcrumb Navigation */}
                <div className="flex items-center gap-2 mb-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 overflow-x-auto whitespace-nowrap pb-2 no-scrollbar">
                    <Link to="/tutor" className="flex items-center gap-1.5 hover:text-primary transition-colors">
                        <Home className="w-3 h-3" />
                        Dashboard
                    </Link>
                    <ChevronRight className="w-3 h-3 opacity-40" />
                    <Link to="/tutor/batches" className="hover:text-primary transition-colors">
                        My Batches
                    </Link>
                    <ChevronRight className="w-3 h-3 opacity-40" />
                    <Link 
                        to={`/tutor/batches/${batchId}/teaching`} 
                        className={cn("hover:text-primary transition-colors", !moduleSlug && "text-primary font-black")}
                    >
                        {batchData.name}
                    </Link>
                    {activeModule && (
                        <>
                            <ChevronRight className="w-3 h-3 opacity-40" />
                            <Link 
                                to={`/tutor/batches/${batchId}/teaching/${activeModule.slug}`} 
                                className={cn("hover:text-primary transition-colors", moduleSlug && !sessionSlug && "text-primary font-black")}
                            >
                                {activeModule.title.split(":")[0]}
                            </Link>
                        </>
                    )}
                    {activeSession && (
                        <>
                            <ChevronRight className="w-3 h-3 opacity-40" />
                            <span className="text-primary font-black">
                                {activeSession.title.split(":")[0]}
                            </span>
                        </>
                    )}
                </div>

                {/* Header Section */}
                <div className="mb-8 flex flex-col gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-fit -ml-3 text-muted-foreground hover:text-primary transition-all group font-bold"
                        onClick={() => navigate(moduleSlug ? (sessionSlug ? `/tutor/batches/${batchId}/teaching/${moduleSlug}` : `/tutor/batches/${batchId}/teaching`) : "/tutor/batches")}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        {moduleSlug ? (sessionSlug ? "Back to Sessions" : "Back to Modules") : "Back to All Batches"}
                    </Button>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-foreground">
                            {activeSession ? activeSession.title : (activeModule ? activeModule.title : batchData.name)}
                        </h1>
                        <p className="text-muted-foreground text-sm font-medium">
                            {activeSession ? "Session Content Management" : (activeModule ? "Module Curriculum & Sessions" : "Teaching Curriculum Management")}
                        </p>
                    </div>
                </div>

                {/* Modules & Sessions List */}
                <div className="space-y-6">
                    {batchData.modules.map((mod: any) => {
                        const isModOpen = activeModule?.id === mod.id;
                        return (
                            <Card 
                                key={mod.id} 
                                className={cn(
                                    "border transition-all overflow-hidden",
                                    isModOpen ? "border-primary/30 ring-1 ring-primary/20" : "border-border/50 hover:border-border/80"
                                )}
                            >
                                <div 
                                    className="p-4 cursor-pointer flex items-center justify-between bg-card hover:bg-muted/30 transition-colors"
                                    onClick={() => handleModuleClick(mod)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
                                            mod.progress === 100 ? "bg-primary/10 text-primary" : "bg-primary/5 text-primary/70"
                                        )}>
                                            {mod.progress === 100 ? <CheckCircle2 className="w-5 h-5" /> : <BookOpen className="w-4 h-4" />}
                                        </div>
                                        <h3 className="font-bold text-base text-foreground">{mod.title}</h3>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="hidden sm:flex items-center gap-3 min-w-32">
                                            <Progress value={mod.progress} className="h-1.5 flex-1" />
                                            <span className="text-[10px] font-black w-8 text-right text-muted-foreground">{mod.progress}%</span>
                                        </div>
                                        {isModOpen ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                                    </div>
                                </div>

                                {isModOpen && (
                                    <div className="bg-muted/5 border-t border-border/10 divide-y divide-border/20">
                                        {mod.sessions.map((session: any, sIdx: number) => {
                                            const isSessionOpen = activeSession?.id === session.id;
                                            return (
                                                <div key={session.id} className="animate-in fade-in slide-in-from-top-2 duration-300">
                                                    <div 
                                                        className={cn(
                                                            "p-5 flex items-center justify-between cursor-pointer transition-colors",
                                                            isSessionOpen ? "bg-primary/5 shadow-inner" : "hover:bg-muted/40"
                                                        )}
                                                        onClick={() => handleSessionClick(session)}
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className={cn(
                                                                "w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs",
                                                                isSessionOpen ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-muted text-muted-foreground"
                                                            )}>
                                                                {sIdx + 1}
                                                            </div>
                                                            <div>
                                                                <h4 className="font-bold text-sm text-foreground">{session.title}</h4>
                                                                <div className="flex items-center gap-3 mt-1">
                                                                    <span className="text-[10px] text-muted-foreground font-black uppercase tracking-wider flex items-center gap-1">
                                                                        <Video className="w-3 h-3" />
                                                                        {session.preRecorded.length} Lessons
                                                                    </span>
                                                                    <span className="text-[10px] text-muted-foreground font-black uppercase tracking-wider flex items-center gap-1">
                                                                        <FileText className="w-3 h-3" />
                                                                        {session.notes.length} Notes
                                                                    </span>
                                                                    <span className="text-[10px] text-muted-foreground font-black uppercase tracking-wider flex items-center gap-1">
                                                                        <ClipboardList className="w-3 h-3" />
                                                                        {session.assignments.length} Tasks
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <Badge variant="outline" className={cn(
                                                                "px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest transition-all",
                                                                isSessionOpen ? "border-primary/40 text-primary bg-primary/10" : "border-border/60 text-muted-foreground"
                                                            )}>
                                                                {isSessionOpen ? "Active Session" : "Manage"}
                                                            </Badge>
                                                            {isSessionOpen ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                                                        </div>
                                                    </div>

                                                    {/* Content Sections */}
                                                    {isSessionOpen && (
                                                        <div className="p-6 bg-white border-t border-border/20 space-y-5 animate-in slide-in-from-top-4 duration-500">
                                                            
                                                            <div className="flex items-center justify-between p-4 rounded-2xl bg-blue-50/40 border border-blue-100/60 shadow-sm">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
                                                                        <Globe className="w-5 h-5" />
                                                                    </div>
                                                                    <div>
                                                                        <h5 className="font-bold text-sm text-foreground">Interactive Live Class</h5>
                                                                        <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Scheduled Session</p>
                                                                    </div>
                                                                </div>
                                                                <Button 
                                                                    size="sm" 
                                                                    className="bg-blue-600 hover:bg-blue-700 font-bold rounded-xl px-5 shadow-sm"
                                                                    onClick={() => window.open(session.liveLink, '_blank')}
                                                                >
                                                                    Join Meet
                                                                </Button>
                                                            </div>

                                                            <ContentSectionCard 
                                                                title="Study Notes & PDFs"
                                                                files={session.notes}
                                                                icon={BookOpen}
                                                                iconBg="bg-amber-500"
                                                                allowAdd
                                                                onAdd={() => openUploadModal("Study Notes & PDFs", mod.id, session.id)}
                                                                onDelete={(id: number) => handleDeleteFile(mod.id, session.id, "Study Notes & PDFs", id)}
                                                            />

                                                            <ContentSectionCard 
                                                                title="Practical Assignment"
                                                                files={session.assignments}
                                                                icon={ClipboardList}
                                                                iconBg="bg-emerald-500"
                                                                allowAdd
                                                                onAdd={() => openUploadModal("Practical Assignment", mod.id, session.id)}
                                                                onDelete={(id: number) => handleDeleteFile(mod.id, session.id, "Practical Assignment", id)}
                                                            />

                                                            <ContentSectionCard 
                                                                title="Pre-recorded Lessons"
                                                                files={session.preRecorded}
                                                                icon={PlayCircle}
                                                                iconBg="bg-indigo-500"
                                                                allowAdd
                                                                onAdd={() => openUploadModal("Pre-recorded Lessons", mod.id, session.id)}
                                                                onDelete={(id: number) => handleDeleteFile(mod.id, session.id, "Pre-recorded Lessons", id)}
                                                            />

                                                            <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/40 shadow-sm opacity-80 transition-all hover:opacity-100">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-10 h-10 rounded-xl bg-slate-400 text-white flex items-center justify-center shadow-lg shadow-slate-400/20">
                                                                        <Video className="w-5 h-5" />
                                                                    </div>
                                                                    <div>
                                                                        <h5 className="font-bold text-sm text-foreground">Finished Class Recording</h5>
                                                                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Automated Archival</p>
                                                                    </div>
                                                                </div>
                                                                <Button 
                                                                    size="sm" 
                                                                    variant="outline" 
                                                                    className="font-bold rounded-xl px-5 border-border/60 hover:bg-muted"
                                                                    disabled={!session.finishedRecording}
                                                                >
                                                                    {session.finishedRecording ? "Watch Playback" : "Not Ready"}
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </Card>
                        );
                    })}
                </div>
            </div>

            {/* Upload Modal */}
            {isUploadModalOpen && (
                <FileUploadModal 
                    isOpen={isUploadModalOpen} 
                    onClose={() => setIsUploadModalOpen(false)} 
                    sectionTitle={uploadingSection || ""}
                    onUpload={handleUploadComplete}
                />
            )}
        </DashboardLayout>
    );
};

// --- Sub-Components ---

const FileUploadModal = ({ isOpen, onClose, sectionTitle, onUpload }: any) => {
    const [dragActive, setDragActive] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
        else if (e.type === "dragleave") setDragActive(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            setSelectedFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFiles(prev => [...prev, ...Array.from(e.target.files as FileList)]);
        }
    };

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const handleUploadClick = async () => {
        if (selectedFiles.length === 0) return;
        setIsUploading(true);
        await new Promise(r => setTimeout(r, 1500)); // Simulate upload
        
        const uploadedFiles = selectedFiles.map((f, i) => ({
            id: Date.now() + i,
            name: f.name,
            size: formatSize(f.size),
            type: f.name.split('.').pop()?.toLowerCase() || 'file'
        }));

        onUpload(uploadedFiles);
        setIsUploading(false);
        toast.success(`${selectedFiles.length} files uploaded to ${sectionTitle}`);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={onClose}>
            <div className="bg-background border border-border/50 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col scale-in-center overflow-hidden" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border/50 bg-muted/10">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight">Upload {sectionTitle}</h2>
                        <p className="text-sm text-muted-foreground mt-1">Multi-file drag and drop upload system</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                    <div 
                        className={cn(
                            "relative border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center transition-all group",
                            dragActive ? "border-primary bg-primary/5 scale-[0.99]" : "border-border/60 hover:border-primary/40 hover:bg-primary/5"
                        )}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <input 
                            ref={fileInputRef}
                            type="file" 
                            multiple 
                            className="absolute inset-0 opacity-0 cursor-pointer" 
                            onChange={handleFileChange}
                        />
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                            <UploadCloud className="w-8 h-8 text-primary" />
                        </div>
                        <p className="text-sm font-bold text-foreground">Drag and drop files here</p>
                        <p className="text-xs text-muted-foreground mt-1">or <span className="text-primary font-bold">browse files</span> from your computer</p>
                        <p className="text-[10px] text-muted-foreground/60 mt-4 uppercase tracking-widest font-bold">Supported: PDF, JPG, PNG, MP4, DOCX</p>
                    </div>

                    {selectedFiles.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center justify-between">
                                Selected Files ({selectedFiles.length})
                                <button onClick={() => setSelectedFiles([])} className="text-red-500 hover:underline">Clear All</button>
                            </h3>
                            <div className="space-y-2 max-h-[250px] pr-2 overflow-y-auto custom-scrollbar">
                                {selectedFiles.map((file, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/40 group animate-in slide-in-from-right-4 duration-300">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-background border flex items-center justify-center text-primary">
                                                <FileText className="w-4 h-4" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-bold text-foreground truncate max-w-[300px]">{file.name}</p>
                                                <p className="text-[10px] text-muted-foreground font-medium">{formatSize(file.size)}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => removeFile(i)} className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 text-muted-foreground transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-border/50 bg-muted/5 flex items-center justify-end gap-3 flex-shrink-0">
                    <Button variant="outline" className="rounded-xl px-6 font-bold" onClick={onClose}>Cancel</Button>
                    <Button 
                        className="rounded-xl px-8 font-bold gap-2 min-w-[140px]" 
                        disabled={selectedFiles.length === 0 || isUploading}
                        onClick={handleUploadClick}
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Plus className="w-4 h-4" />
                                Start Upload
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

const ContentSectionCard = ({ title, files, icon: Icon, iconBg, allowAdd, onAdd, onDelete }: any) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const getFileIcon = (type: string) => {
        const t = type.toLowerCase();
        if (['jpg', 'jpeg', 'png', 'webp', 'image'].includes(t)) return <FileImage className="w-4 h-4 text-purple-500" />;
        if (['mp4', 'mov', 'video'].includes(t)) return <PlayCircle className="w-4 h-4 text-indigo-500" />;
        if (['pdf'].includes(t)) return <FileText className="w-4 h-4 text-red-500" />;
        return <FileText className="w-4 h-4 text-blue-500" />;
    };

    return (
        <div className="border border-border/60 rounded-2xl overflow-hidden bg-white shadow-sm transition-all hover:border-border/80">
            <div 
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/5 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-4">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg", iconBg)}>
                        <Icon className="w-5 h-5" />
                    </div>
                    <div>
                        <h5 className="font-bold text-sm text-foreground">{title} ({files.length})</h5>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Manageable Section</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </div>
            </div>

            {isExpanded && (
                <div className="p-4 pt-0 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center justify-between">
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Manageable Section Content</p>
                        {allowAdd && (
                            <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8 gap-2 rounded-xl border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 transition-colors font-bold px-3 text-xs"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onAdd();
                                }}
                            >
                                <Plus className="w-3.5 h-3.5" />
                                Add Content
                            </Button>
                        )}
                    </div>
                    {files.length > 0 ? (
                        <div className="space-y-1.5">
                            {files.map((file: any) => (
                                <div key={file.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/30 hover:bg-slate-50 transition-all group/file">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm group-hover/file:border-primary/20">
                                            {getFileIcon(file.type)}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold text-foreground truncate max-w-[200px] lg:max-w-[400px] leading-tight">{file.name}</p>
                                            <p className="text-[10px] text-muted-foreground font-medium">{file.size}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover/file:opacity-100 transition-all focus-within:opacity-100">
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg"
                                            onClick={() => window.open('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', '_blank')}
                                            title="View"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="h-8 w-8 p-0 text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50 rounded-lg"
                                            onClick={() => toast.success(`Downloading ${file.name}...`)}
                                            title="Download"
                                        >
                                            <Download className="w-4 h-4" />
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="h-8 w-8 p-0 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg"
                                            onClick={() => onDelete(file.id)}
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 rounded-xl border border-dashed border-border/60 flex flex-col items-center justify-center text-center">
                            <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center mb-2">
                                <FileText className="w-5 h-5 text-muted-foreground/40" />
                            </div>
                            <p className="text-xs font-medium text-muted-foreground">No files uploaded yet</p>
                            <Button 
                                variant="link" 
                                className="h-auto text-[10px] font-bold uppercase tracking-wider text-primary mt-1"
                                onClick={onAdd}
                            >
                                Click here to add
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default TutorTeachingFlow;
