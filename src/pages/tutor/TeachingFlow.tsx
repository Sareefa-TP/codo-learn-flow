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
    Eye,
    Pencil,
    PlusCircle,
    Save
} from "lucide-react";
import { 
    courses, 
    getCourseStudents, 
    getCourseTutors, 
    getCourseMentors,
    scheduleLiveClassForSession,
    addModuleToCourse,
    updateModuleInCourse,
    deleteModuleFromCourse,
    addSessionToModule,
    updateSessionInModule,
    deleteSessionFromModule
} from "@/data/courseData";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
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

interface TeachingFlowProps {
    role?: "tutor" | "mentor" | "admin";
}

const TutorTeachingFlow = ({ role = "tutor" }: TeachingFlowProps) => {
    const { batchId, moduleSlug, sessionSlug } = useParams();
    const navigate = useNavigate();
    const isMentor = role === "mentor";
    const isAdmin = role === "admin";
    const flowPath = isAdmin ? "teaching" : (isMentor ? "monitor" : "teaching");
    const basePath = isAdmin ? `/admin/courses/${batchId}/${flowPath}` : (isMentor ? `/mentor/my-batches/batches/${batchId}/${flowPath}` : `/tutor/batches/${batchId}/${flowPath}`);
    const dashboardPath = isAdmin ? "/admin/dashboard" : (isMentor ? "/mentor/dashboard" : "/tutor");
    const batchesPath = isAdmin ? "/admin/courses" : (isMentor ? "/mentor/my-batches/batches" : "/tutor/batches");
    
    // State-managed curriculum data
    const [teachingData, setTeachingData] = useState(INITIAL_CURRICULUM_DATA);
    
    // Modal State
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [uploadingSection, setUploadingSection] = useState<string | null>(null);
    const [uploadingContext, setUploadingContext] = useState<any>(null); // { modId, sessId }
    
    // Inline Scheduling State
    const [schedulingSessionId, setSchedulingSessionId] = useState<string | null>(null);
    const [scheduleFormData, setScheduleFormData] = useState({
        title: "",
        date: "",
        time: "",
        duration: "60 min",
        link: ""
    });

    // Module CRUD State
    const [isAddingModule, setIsAddingModule] = useState(false);
    const [newModuleName, setNewModuleName] = useState("");
    const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
    const [editingModuleName, setEditingModuleName] = useState("");

    // Session CRUD State
    const [isAddingSessionInMod, setIsAddingSessionInMod] = useState<string | null>(null);
    const [newSessionName, setNewSessionName] = useState("");
    const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
    const [editingSessionName, setEditingSessionName] = useState("");

    // Helper to map Course data to TeachingFlow format
    const mapCourseToTeachingFlow = (courseId: string) => {
        const course = courses.find(c => c.id === courseId);
        if (!course) return null;

        return {
            name: course.name,
            course: course.category,
            modules: course.modules.map(mod => ({
                id: mod.id,
                title: mod.name,
                slug: mod.slug,
                progress: 0, // Admin view doesn't need progress
                sessions: mod.sessions.map(sess => ({
                    id: sess.id,
                    title: sess.name,
                    slug: sess.slug,
                    liveLink: sess.liveClass?.meetingLink || "",
                    scheduledAt: sess.liveClass?.scheduledAt,
                    notes: sess.notes.map(n => ({ id: n.id, title: n.title, type: n.type, file: n.content })),
                    assignments: sess.assignments.map(a => ({ id: a.id, name: a.title, size: "N/A", type: "task" })),
                    preRecorded: sess.lessons.map(l => ({ id: l.id, name: l.title, size: "N/A", type: "video" })),
                    finishedRecording: sess.recording?.url || null
                }))
            }))
        };
    };

    const batchData = useMemo(() => {
        if (isAdmin) {
            return mapCourseToTeachingFlow(batchId || "") || mapCourseToTeachingFlow("C-001");
        }
        return teachingData[batchId as string] || teachingData["B-001"];
    }, [isAdmin, batchId, teachingData, courses]);
    
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
            navigate(basePath);
        } else {
            navigate(`${basePath}/${mod.slug}`);
        }
    };

    const handleSessionClick = (session: any) => {
        if (activeSession?.id === session.id) {
            navigate(`${basePath}/${moduleSlug}`);
        } else {
            navigate(`${basePath}/${moduleSlug}/${session.slug}`);
        }
    };

    const openUploadModal = (section: string, modId: string, sessId: string) => {
        setUploadingSection(section);
        setUploadingContext({ modId, sessId });
        setIsUploadModalOpen(true);
    };

    const handleScheduleSave = (modId: string, sessId: string) => {
        if (!scheduleFormData.title || !scheduleFormData.date || !scheduleFormData.time || !scheduleFormData.link) {
            toast.error("Please fill in all required fields.");
            return;
        }

        const scheduledAt = `${scheduleFormData.date}T${scheduleFormData.time}:00Z`;
        
        // Update local state if not admin (for immediate tutor feedback)
        // If admin, we update central courseData and re-map
        if (isAdmin) {
            scheduleLiveClassForSession(batchId, modId, sessId, {
                id: `LC-${Date.now()}`,
                title: scheduleFormData.title,
                scheduledAt,
                duration: scheduleFormData.duration,
                meetingLink: scheduleFormData.link,
                status: "Scheduled"
            });
            toast.success("Class scheduled successfully!");
            setSchedulingSessionId(null);
            // Refresh data binding
            setTeachingData(mapCourseToTeachingFlow(batchId));
        }
    };

    const handleCancelSession = (modId: string, sessId: string) => {
        if (isAdmin) {
            if (window.confirm("Are you sure you want to cancel this scheduled session? This will remove the meeting details.")) {
                scheduleLiveClassForSession(batchId, modId, sessId, null as any);
                toast.success("Class cancelled successfully.");
                setTeachingData(mapCourseToTeachingFlow(batchId));
            }
        }
    };

    // --- Module CRUD Handlers ---
    const handleCreateModule = () => {
        if (!newModuleName.trim()) return;
        const newModule = {
            id: `M-${Date.now()}`,
            name: newModuleName,
            slug: newModuleName.toLowerCase().replace(/\s+/g, '-'),
            sessions: []
        };
        addModuleToCourse(batchId, newModule);
        setIsAddingModule(false);
        setNewModuleName("");
        setTeachingData(mapCourseToTeachingFlow(batchId));
        toast.success("Module created successfully!");
    };

    const handleUpdateModule = (modId: string) => {
        if (!editingModuleName.trim()) return;
        updateModuleInCourse(batchId, {
            id: modId,
            name: editingModuleName,
            slug: editingModuleName.toLowerCase().replace(/\s+/g, '-')
        } as any);
        setEditingModuleId(null);
        setTeachingData(mapCourseToTeachingFlow(batchId));
        toast.success("Module updated!");
    };

    const handleDeleteModule = (modId: string) => {
        if (window.confirm("Are you sure you want to delete this module and ALL its sessions?")) {
            deleteModuleFromCourse(batchId, modId);
            setTeachingData(mapCourseToTeachingFlow(batchId));
            toast.error("Module deleted.");
        }
    };

    // --- Session CRUD Handlers ---
    const handleCreateSession = (modId: string) => {
        if (!newSessionName.trim()) return;
        const newSession = {
            id: `S-${Date.now()}`,
            name: newSessionName,
            slug: newSessionName.toLowerCase().replace(/\s+/g, '-'),
            liveClass: null,
            notes: [],
            assignments: [],
            lessons: [],
            recording: null
        };
        addSessionToModule(batchId, modId, newSession);
        setIsAddingSessionInMod(null);
        setNewSessionName("");
        setTeachingData(mapCourseToTeachingFlow(batchId));
        toast.success("Session added!");
    };

    const handleUpdateSession = (modId: string, sessId: string) => {
        if (!editingSessionName.trim()) return;
        updateSessionInModule(batchId, modId, {
            id: sessId,
            name: editingSessionName,
            slug: editingSessionName.toLowerCase().replace(/\s+/g, '-')
        } as any);
        setEditingSessionId(null);
        setTeachingData(mapCourseToTeachingFlow(batchId));
        toast.success("Session updated!");
    };

    const handleDeleteSession = (modId: string, sessId: string) => {
        if (window.confirm("Are you sure you want to delete this session?")) {
            deleteSessionFromModule(batchId, modId, sessId);
            setTeachingData(mapCourseToTeachingFlow(batchId));
            toast.error("Session deleted.");
        }
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
                    <Link to={dashboardPath} className="flex items-center gap-1.5 hover:text-primary transition-colors">
                        <Home className="w-3 h-3" />
                        Dashboard
                    </Link>
                    <ChevronRight className="w-3 h-3 opacity-40" />
                    <Link to={batchesPath} className="hover:text-primary transition-colors">
                        {isAdmin ? "Course Management" : (isMentor ? "Assigned Batches" : "My Batches")}
                    </Link>
                    <ChevronRight className="w-3 h-3 opacity-40" />
                    <Link 
                        to={basePath} 
                        className={cn("hover:text-primary transition-colors", !moduleSlug && "text-primary font-black")}
                    >
                        {batchData?.name}
                    </Link>
                    {activeModule && (
                        <>
                            <ChevronRight className="w-3 h-3 opacity-40" />
                            <Link 
                                to={`${basePath}/${activeModule.slug}`} 
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
                        onClick={() => navigate(moduleSlug ? (sessionSlug ? `${basePath}/${moduleSlug}` : basePath) : batchesPath)}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        {moduleSlug ? (sessionSlug ? "Back to Sessions" : "Back to Modules") : "Back to All Batches"}
                    </Button>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-foreground">
                            {activeSession ? activeSession.title : (activeModule ? activeModule.title : batchData?.name)}
                        </h1>
                        <p className="text-muted-foreground text-sm font-medium">
                            {activeSession ? "Session Content Management" : (activeModule ? "Module Curriculum & Sessions" : "Teaching Curriculum Management")}
                        </p>
                    </div>
                </div>

                {/* Modules & Sessions List */}
                <div className="space-y-6">
                    {/* ADMIN: ADD MODULE BUTTON */}
                    {isAdmin && !isAddingModule && (
                        <Button
                            onClick={() => setIsAddingModule(true)}
                            variant="outline"
                            className="w-full h-14 border-dashed border-2 border-primary/30 hover:border-primary/50 text-primary hover:bg-primary/5 rounded-2xl font-bold flex items-center justify-center gap-2 group"
                        >
                            <PlusCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            Add New Module
                        </Button>
                    )}

                    {isAddingModule && (
                        <Card className="border-2 border-primary/30 ring-1 ring-primary/20 overflow-hidden animate-in zoom-in-95 duration-200">
                            <div className="p-4 flex flex-col gap-4">
                                <h4 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                    <PlusCircle className="w-4 h-4" /> New Module Identity
                                </h4>
                                <div className="flex gap-2">
                                    <Input 
                                        autoFocus
                                        placeholder="e.g. Advanced State Management"
                                        value={newModuleName}
                                        onChange={(e) => setNewModuleName(e.target.value)}
                                        className="h-11 rounded-xl border-slate-200"
                                        onKeyDown={(e) => e.key === 'Enter' && handleCreateModule()}
                                    />
                                    <Button onClick={handleCreateModule} className="h-11 px-6 rounded-xl font-bold">Create</Button>
                                    <Button variant="ghost" onClick={() => setIsAddingModule(false)} className="h-11 px-4 rounded-xl font-bold text-muted-foreground">Cancel</Button>
                                </div>
                            </div>
                        </Card>
                    )}
                    {batchData?.modules.map((mod: any) => {
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
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className={cn(
                                            "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
                                            mod.progress === 100 ? "bg-primary/10 text-primary" : "bg-primary/5 text-primary/70"
                                        )}>
                                            {mod.progress === 100 ? <CheckCircle2 className="w-5 h-5" /> : <BookOpen className="w-4 h-4" />}
                                        </div>
                                        {editingModuleId === mod.id ? (
                                            <div className="flex items-center gap-2 flex-1" onClick={(e) => e.stopPropagation()}>
                                                <Input 
                                                    autoFocus
                                                    value={editingModuleName}
                                                    onChange={(e) => setEditingModuleName(e.target.value)}
                                                    className="h-9 px-3 rounded-lg border-primary/30 font-bold focus:bg-white"
                                                    onKeyDown={(e) => e.key === 'Enter' && handleUpdateModule(mod.id)}
                                                />
                                                <Button size="sm" onClick={() => handleUpdateModule(mod.id)} className="h-9 w-9 p-0 rounded-lg shrink-0">
                                                    <CheckCircle2 className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={() => setEditingModuleId(null)} className="h-9 w-9 p-0 rounded-lg shrink-0">
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <h3 className="font-bold text-base text-foreground">{mod.title}</h3>
                                        )}
                                    </div>
                                    
                                    <div className="flex items-center gap-4">
                                        {isAdmin && editingModuleId !== mod.id && (
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg"
                                                    onClick={() => {
                                                        setEditingModuleId(mod.id);
                                                        setEditingModuleName(mod.title);
                                                    }}
                                                >
                                                    <Pencil className="w-3.5 h-3.5" />
                                                </Button>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-8 w-8 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                                                    onClick={() => handleDeleteModule(mod.id)}
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </Button>
                                            </div>
                                        )}
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
                                                                {editingSessionId === session.id ? (
                                                                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                                                        <Input 
                                                                            autoFocus
                                                                            value={editingSessionName}
                                                                            onChange={(e) => setEditingSessionName(e.target.value)}
                                                                            className="h-8 px-3 rounded-lg border-primary/30 font-bold focus:bg-white text-xs"
                                                                            onKeyDown={(e) => e.key === 'Enter' && handleUpdateSession(mod.id, session.id)}
                                                                        />
                                                                        <Button size="sm" onClick={() => handleUpdateSession(mod.id, session.id)} className="h-8 w-8 p-0 rounded-lg shrink-0">
                                                                            <CheckCircle2 className="w-3 h-3" />
                                                                        </Button>
                                                                        <Button variant="ghost" size="sm" onClick={() => setEditingSessionId(null)} className="h-8 w-8 p-0 rounded-lg shrink-0">
                                                                            <X className="w-3 h-3" />
                                                                        </Button>
                                                                    </div>
                                                                ) : (
                                                                    <h4 className="font-bold text-sm text-foreground">{session.title}</h4>
                                                                )}
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
                                                            {isAdmin && editingSessionId !== session.id && (
                                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                                                                    <Button 
                                                                        variant="ghost" 
                                                                        size="icon" 
                                                                        className="h-7 w-7 text-muted-foreground hover:text-primary rounded-lg"
                                                                        onClick={() => {
                                                                            setEditingSessionId(session.id);
                                                                            setEditingSessionName(session.title);
                                                                        }}
                                                                    >
                                                                        <Pencil className="w-3 h-3" />
                                                                    </Button>
                                                                    <Button 
                                                                        variant="ghost" 
                                                                        size="icon" 
                                                                        className="h-7 w-7 text-muted-foreground hover:text-rose-600 rounded-lg"
                                                                        onClick={() => handleDeleteSession(mod.id, session.id)}
                                                                    >
                                                                        <Trash2 className="w-3 h-3" />
                                                                    </Button>
                                                                </div>
                                                            )}
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
                                                                        <p className={cn(
                                                                            "text-[10px] font-bold uppercase tracking-wider",
                                                                            session.liveLink ? "text-emerald-600" : "text-blue-600"
                                                                        )}>
                                                                            {session.liveLink ? `Scheduled: ${new Date(session.scheduledAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at ${new Date(session.scheduledAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}` : "Not Scheduled"}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    <Button 
                                                                        size="sm" 
                                                                        variant="outline"
                                                                        className="border-blue-200 text-blue-600 hover:bg-blue-50 font-bold rounded-xl px-5 shadow-sm"
                                                                        onClick={() => {
                                                                            if (schedulingSessionId === session.id) {
                                                                                setSchedulingSessionId(null);
                                                                            } else {
                                                                                setSchedulingSessionId(session.id);
                                                                                setScheduleFormData({
                                                                                    title: session.title,
                                                                                    date: "",
                                                                                    time: "",
                                                                                    duration: "60 min",
                                                                                    link: session.liveLink || ""
                                                                                });
                                                                            }
                                                                        }}
                                                                    >
                                                                        {schedulingSessionId === session.id ? "Close Form" : (session.liveLink ? "Edit Schedule" : "Schedule Class")}
                                                                    </Button>
                                                                    {session.liveLink && (
                                                                        <Button 
                                                                            size="sm" 
                                                                            className="bg-blue-600 hover:bg-blue-700 font-bold rounded-xl px-5 shadow-sm"
                                                                            onClick={() => window.open(session.liveLink, '_blank')}
                                                                        >
                                                                            Join Meet
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* INLINE SCHEDULING FORM */}
                                                            {isAdmin && schedulingSessionId === session.id && (
                                                                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 animate-in zoom-in-95 duration-300">
                                                                    <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-2">
                                                                        <h6 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-tight">
                                                                            <Clock className="w-4 h-4 text-blue-600" />
                                                                            Schedule Live Session
                                                                        </h6>
                                                                        {session.liveLink && (
                                                                            <Button 
                                                                                variant="ghost" 
                                                                                size="sm" 
                                                                                onClick={() => handleCancelSession(mod.id, session.id)}
                                                                                className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 font-bold text-xs"
                                                                            >
                                                                                Cancel Session
                                                                            </Button>
                                                                        )}
                                                                    </div>
                                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                        <div className="space-y-1.5 md:col-span-2">
                                                                            <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Meeting Title</Label>
                                                                            <Input 
                                                                                placeholder="e.g. Logic Building session"
                                                                                value={scheduleFormData.title}
                                                                                onChange={(e) => setScheduleFormData({...scheduleFormData, title: e.target.value})}
                                                                                className="h-10 rounded-xl border-slate-200 focus:bg-white"
                                                                            />
                                                                        </div>
                                                                        <div className="space-y-1.5">
                                                                            <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Scheduled Date</Label>
                                                                            <Input 
                                                                                type="date"
                                                                                value={scheduleFormData.date}
                                                                                onChange={(e) => setScheduleFormData({...scheduleFormData, date: e.target.value})}
                                                                                className="h-10 rounded-xl border-slate-200 focus:bg-white"
                                                                            />
                                                                        </div>
                                                                        <div className="space-y-1.5">
                                                                            <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Start Time</Label>
                                                                            <Input 
                                                                                type="time"
                                                                                value={scheduleFormData.time}
                                                                                onChange={(e) => setScheduleFormData({...scheduleFormData, time: e.target.value})}
                                                                                className="h-10 rounded-xl border-slate-200 focus:bg-white"
                                                                            />
                                                                        </div>
                                                                        <div className="space-y-1.5">
                                                                            <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Duration</Label>
                                                                            <Select 
                                                                                value={scheduleFormData.duration}
                                                                                onValueChange={(val) => setScheduleFormData({...scheduleFormData, duration: val})}
                                                                            >
                                                                                <SelectTrigger className="h-10 rounded-xl border-slate-200 bg-white">
                                                                                    <SelectValue placeholder="Select Duration" />
                                                                                </SelectTrigger>
                                                                                <SelectContent className="rounded-xl">
                                                                                    <SelectItem value="45 min">45 min</SelectItem>
                                                                                    <SelectItem value="60 min">60 min</SelectItem>
                                                                                    <SelectItem value="90 min">90 min</SelectItem>
                                                                                    <SelectItem value="2 hours">2 hours</SelectItem>
                                                                                </SelectContent>
                                                                            </Select>
                                                                        </div>
                                                                        <div className="space-y-1.5">
                                                                            <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Meeting Link (Google/Zoom)</Label>
                                                                            <Input 
                                                                                placeholder="https://meet.google.com/..."
                                                                                value={scheduleFormData.link}
                                                                                onChange={(e) => setScheduleFormData({...scheduleFormData, link: e.target.value})}
                                                                                className="h-10 rounded-xl border-slate-200 focus:bg-white"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex gap-2 justify-end pt-2">
                                                                        <Button 
                                                                            variant="outline" 
                                                                            size="sm" 
                                                                            onClick={() => setSchedulingSessionId(null)}
                                                                            className="rounded-xl px-6 font-bold"
                                                                        >
                                                                            Cancel
                                                                        </Button>
                                                                        <Button 
                                                                            size="sm" 
                                                                            onClick={() => handleScheduleSave(mod.id, session.id)}
                                                                            className="rounded-xl px-8 font-bold bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200"
                                                                        >
                                                                            Save Schedule
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            <ContentSectionCard 
                                                                title="Study Notes & PDFs"
                                                                files={session.notes}
                                                                icon={BookOpen}
                                                                iconBg="bg-amber-500"
                                                                allowAdd={!isMentor || isAdmin}
                                                                onAdd={() => openUploadModal("Study Notes & PDFs", mod.id, session.id)}
                                                                onDelete={(id: number) => handleDeleteFile(mod.id, session.id, "Study Notes & PDFs", id)}
                                                                isMentor={isMentor && !isAdmin}
                                                            />

                                                            <ContentSectionCard 
                                                                title="Practical Assignment"
                                                                files={session.assignments}
                                                                icon={ClipboardList}
                                                                iconBg="bg-emerald-500"
                                                                allowAdd={!isMentor || isAdmin}
                                                                onAdd={() => openUploadModal("Practical Assignment", mod.id, session.id)}
                                                                onDelete={(id: number) => handleDeleteFile(mod.id, session.id, "Practical Assignment", id)}
                                                                isMentor={isMentor && !isAdmin}
                                                            />

                                                            <ContentSectionCard 
                                                                title="Pre-recorded Lessons"
                                                                files={session.preRecorded}
                                                                icon={PlayCircle}
                                                                iconBg="bg-indigo-500"
                                                                allowAdd={!isMentor || isAdmin}
                                                                onAdd={() => openUploadModal("Pre-recorded Lessons", mod.id, session.id)}
                                                                onDelete={(id: number) => handleDeleteFile(mod.id, session.id, "Pre-recorded Lessons", id)}
                                                                isMentor={isMentor && !isAdmin}
                                                            />

                                                            <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/40 shadow-sm opacity-80 transition-all hover:opacity-100">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-10 h-10 rounded-xl bg-slate-500 text-white flex items-center justify-center shadow-lg shadow-slate-500/20">
                                                                        <Video className="w-5 h-5" />
                                                                    </div>
                                                                    <div>
                                                                        <h5 className="font-bold text-sm text-foreground">Finished Class Recording</h5>
                                                                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Automated Archive</p>
                                                                    </div>
                                                                </div>
                                                                <Button 
                                                                    size="sm" 
                                                                    variant="ghost" 
                                                                    disabled={!session.finishedRecording}
                                                                    className="text-muted-foreground hover:text-primary font-bold rounded-xl px-5"
                                                                    onClick={() => session.finishedRecording && window.open(session.finishedRecording, '_blank')}
                                                                >
                                                                    {session.finishedRecording ? "Watch Replay" : "Awaiting Recording"}
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}

                                        {/* ADMIN: ADD SESSION BUTTON */}
                                        {isAdmin && (
                                            <div className="p-4 bg-primary/5">
                                                {isAddingSessionInMod === mod.id ? (
                                                    <div className="flex gap-2 items-center animate-in slide-in-from-left-2 duration-200">
                                                        <Input 
                                                            autoFocus
                                                            placeholder="Session Name (e.g., Redux Toolkit)"
                                                            value={newSessionName}
                                                            onChange={(e) => setNewSessionName(e.target.value)}
                                                            className="h-10 rounded-xl border-primary/20 focus:bg-white"
                                                            onKeyDown={(e) => e.key === 'Enter' && handleCreateSession(mod.id)}
                                                        />
                                                        <Button size="sm" onClick={() => handleCreateSession(mod.id)} className="h-10 px-4 rounded-xl font-bold">Add</Button>
                                                        <Button variant="ghost" size="sm" onClick={() => setIsAddingSessionInMod(null)} className="h-10 px-3 rounded-xl font-bold text-muted-foreground">Cancel</Button>
                                                    </div>
                                                ) : (
                                                    <Button 
                                                        variant="ghost" 
                                                        className="w-full justify-start text-primary hover:bg-primary/10 font-bold rounded-xl gap-2 h-11"
                                                        onClick={() => setIsAddingSessionInMod(mod.id)}
                                                    >
                                                        <PlusCircle className="w-4 h-4" />
                                                        Add New Session
                                                    </Button>
                                                )}
                                            </div>
                                        )}
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

const ContentSectionCard = ({ title, files, icon: Icon, iconBg, allowAdd, onAdd, onDelete, isMentor }: any) => {
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
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                            Manageable Section
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </div>
            </div>

            {isExpanded && (
                <div className="p-4 pt-0 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center justify-between">
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                            Manageable Section Content
                        </p>
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
};


export default TutorTeachingFlow;
