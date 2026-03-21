import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
    FileText, Plus, Eye, X, Upload, CheckCircle2,
    Clock, AlertCircle, MessageSquare, Loader2
} from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

// ─── Types ────────────────────────────────────────────────────────────────────

type ReportStatus = "Pending" | "Reviewed" | "Rejected";

interface WeeklyReport {
    id: number;
    week: string;
    title: string;
    submittedDate: string;
    status: ReportStatus;
    mentorId: string;
    mentorFeedback: string;
    summary: string;
    challenges: string;
    learnings: string;
    fileName: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const initialReports: WeeklyReport[] = [
    {
        id: 1,
        week: "March – Week 1",
        title: "Onboarding & Project Setup",
        submittedDate: "Mar 02, 2026",
        status: "Reviewed",
        mentorId: "MNT001",
        mentorFeedback: "Great start! Keep up the structured approach.",
        summary: "Completed environment setup, onboarding tasks, and team introductions. Reviewed project structure and tooling.",
        challenges: "Setting up local development environment took longer than expected due to version conflicts.",
        learnings: "Learned how to configure Vite + React + TypeScript from scratch and understood the project architecture.",
        fileName: "week1-report.pdf",
    },
    {
        id: 2,
        week: "April – Week 2",
        title: "Frontend Component Development",
        submittedDate: "Mar 09, 2026",
        status: "Reviewed",
        mentorId: "MNT001",
        mentorFeedback: "Good progress. Focus more on code reusability.",
        summary: "Built reusable UI components including Button, Card, Badge, and Table using ShadCN UI and Tailwind CSS.",
        challenges: "Struggled with prop typing in generic components. Resolved using TypeScript generics.",
        learnings: "Deepened understanding of component composition and TypeScript interface patterns.",
        fileName: "week2-components.zip",
    },
    {
        id: 3,
        week: "April – Week 3",
        title: "API Integration & Testing",
        submittedDate: "Mar 16, 2026",
        status: "Pending",
        mentorId: "—",
        mentorFeedback: "—",
        summary: "Integrated login and student-fetch REST APIs using Axios. Built a custom useApi hook.",
        challenges: "CORS errors blocked local API testing. Fixed by configuring a Vite proxy.",
        learnings: "Learned about Axios interceptors and how to handle auth tokens in API calls.",
        fileName: "",
    },
    {
        id: 4,
        week: "April – Week 4",
        title: "Dashboard Layout Implementation",
        submittedDate: "Mar 18, 2026",
        status: "Rejected",
        mentorId: "MNT002",
        mentorFeedback: "Report is incomplete. Please add challenges section.",
        summary: "Built the main dashboard layout with sidebar, sticky header, and content grid.",
        challenges: "",
        learnings: "Practiced responsive layout design using CSS Grid and Flexbox.",
        fileName: "dashboard-layout.png",
    },
];

// ─── Style Maps ───────────────────────────────────────────────────────────────

const statusStyles: Record<ReportStatus, string> = {
    Pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    Reviewed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    Rejected: "bg-red-500/10 text-red-600 border-red-500/20",
};

const statusIcons: Record<ReportStatus, React.ElementType> = {
    Pending: Clock,
    Reviewed: CheckCircle2,
    Rejected: AlertCircle,
};

const weekOptions = Array.from({ length: 12 }, (_, i) => `Week ${i + 1}`);

// ─── Submit Report Modal ──────────────────────────────────────────────────────

interface SubmitModalProps {
    onClose: () => void;
    onSubmit: (report: Partial<WeeklyReport>) => void;
    initialData?: WeeklyReport;
}

const SubmitReportModal = ({ onClose, onSubmit, initialData }: SubmitModalProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [fileError, setFileError] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const MAX_FILES = 5;
    const MAX_FILE_SIZE_MB = 10;
    const ALLOWED_TYPES = [
        "application/pdf",
        "application/zip",
        "application/x-zip-compressed",
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const MONTHS = [
        "January", "February", "March", "April",
        "May", "June", "July", "August",
        "September", "October", "November", "December",
    ];
    const WEEKS = ["Week 1", "Week 2", "Week 3", "Week 4"] as const;

    // Parse week label if editing (e.g., "March – Week 2")
    const initialMonthMatch = initialData?.week.split(" – ")[0];
    const initialWeekMatch = initialData?.week.split(" – ")[1];

    const currentMonth = MONTHS[new Date().getMonth()];

    const [selectedMonth, setSelectedMonth] = useState(initialMonthMatch || currentMonth);
    const [selectedWeek, setSelectedWeek] = useState<string>(initialWeekMatch || "");
    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        summary: initialData?.summary || "",
        challenges: initialData?.challenges || "",
    });

    const hasFormData = formData.title.trim() !== "" || formData.summary.trim() !== "" || formData.challenges.trim() !== "" || files.length > 0 || selectedWeek !== "";

    const validateAndAddFiles = (incoming: FileList | null) => {
        if (!incoming) return;
        setFileError("");
        const toAdd: File[] = [];
        const errors: string[] = [];

        Array.from(incoming).forEach(file => {
            if (files.length + toAdd.length >= MAX_FILES) {
                errors.push(`Max ${MAX_FILES} files allowed.`);
                return;
            }
            if (!ALLOWED_TYPES.includes(file.type)) {
                errors.push(`"${file.name}" is not a supported file type.`);
                return;
            }
            if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
                errors.push(`"${file.name}" exceeds the ${MAX_FILE_SIZE_MB}MB limit.`);
                return;
            }
            toAdd.push(file);
        });

        if (errors.length) setFileError(errors[0]);
        if (toAdd.length) setFiles(prev => [...prev, ...toAdd]);
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
        setFileError("");
    };

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const handleCloseRequest = () => {
        if (hasFormData) {
            setShowDiscardConfirm(true);
        } else {
            onClose();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedWeek) {
            toast.error("Please select a week");
            return;
        }
        if (!formData.title || !formData.summary) {
            toast.error("Please fill all required fields");
            return;
        }

        const weekLabel = `${selectedMonth} – ${selectedWeek}`;

        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        onSubmit({
            id: initialData?.id, // Keep ID if updating
            ...formData,
            week: weekLabel,
            submittedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
            status: "Pending",
            mentorId: "—",
            mentorFeedback: "—",
            fileName: files.length > 0 ? files.map(f => f.name).join(", ") : initialData?.fileName || "",
            learnings: initialData?.learnings || "",
        });
        
        setIsSubmitting(false);
        toast.success("Report submitted successfully");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div
                className="bg-background border border-border/50 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200"
                onClick={e => e.stopPropagation()}
            >
                {/* Discard Confirmation Dialog */}
                {showDiscardConfirm && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 rounded-2xl">
                        <div className="bg-background border border-border/60 rounded-2xl shadow-xl p-6 mx-6 max-w-sm w-full">
                            <h3 className="text-base font-bold mb-1">Discard changes?</h3>
                            <p className="text-sm text-muted-foreground mb-6">You have unsaved input. If you leave, your progress will be lost.</p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setShowDiscardConfirm(false)}
                                    className="px-4 py-2 rounded-xl text-sm font-semibold border border-border/50 hover:bg-muted transition-colors"
                                >
                                    Stay
                                </button>
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 rounded-xl text-sm font-semibold bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                                >
                                    Discard
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border/50 bg-muted/5">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight">
                            {initialData ? "Resubmit Weekly Report" : "Submit Weekly Report"}
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            {initialData ? "Update your report details and resubmit for review." : "Fill in the details for your weekly progress."}
                        </p>
                    </div>
                    <button onClick={handleCloseRequest} className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">

                    {/* Month + Week selector */}
                    <div className="space-y-4 p-4 rounded-xl bg-muted/30 border border-border/40">
                        {/* Month dropdown */}
                        <div className="space-y-2">
                            <Label htmlFor="month" className="text-sm font-semibold">
                                Month <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                                <select
                                    id="month"
                                    value={selectedMonth}
                                    onChange={e => setSelectedMonth(e.target.value)}
                                    className="w-full h-10 rounded-xl border border-border/50 bg-background px-3 py-2 text-sm font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40 pr-10"
                                >
                                    {MONTHS.map(m => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Week radio buttons */}
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">
                                Week <span className="text-red-500">*</span>
                            </Label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {WEEKS.map(w => (
                                    <label
                                        key={w}
                                        className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border-2 cursor-pointer text-sm font-semibold transition-all duration-150 select-none ${
                                            selectedWeek === w
                                                ? "border-primary bg-primary/10 text-primary"
                                                : "border-border/40 bg-background hover:border-primary/40 hover:bg-primary/5 text-muted-foreground"
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="week"
                                            value={w}
                                            checked={selectedWeek === w}
                                            onChange={() => setSelectedWeek(w)}
                                            className="sr-only"
                                        />
                                        {w}
                                    </label>
                                ))}
                            </div>
                            {selectedWeek && selectedMonth && (
                                <p className="text-xs text-primary font-semibold flex items-center gap-1.5 pt-1">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    Selected: {selectedMonth} – {selectedWeek}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Report Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm font-semibold">Report Title <span className="text-red-500">*</span></Label>
                        <Input
                            id="title"
                            placeholder="e.g., UI Components & Auth Integration"
                            value={formData.title}
                            onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="summary" className="text-sm font-semibold">Tasks Completed <span className="text-red-500">*</span></Label>
                        <Textarea 
                            id="summary" 
                            placeholder="Describe the tasks you completed this week..." 
                            className="min-h-[120px] resize-none"
                            value={formData.summary}
                            onChange={e => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="challenges" className="text-sm font-semibold">Challenges Faced (Optional)</Label>
                        <Textarea 
                            id="challenges" 
                            placeholder="Describe any blockers or challenges you encountered..." 
                            className="min-h-[100px] resize-none"
                            value={formData.challenges}
                            onChange={e => setFormData(prev => ({ ...prev, challenges: e.target.value }))}
                        />
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm font-semibold">Attachments (Optional)</Label>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                files.length >= MAX_FILES
                                    ? "bg-red-500/10 text-red-600"
                                    : "bg-muted text-muted-foreground"
                            }`}>
                                {files.length} / {MAX_FILES} files
                            </span>
                        </div>

                        {/* Drop Zone */}
                        {files.length < MAX_FILES && (
                            <div
                                className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${
                                    isDragging
                                        ? "border-primary bg-primary/5"
                                        : "border-border/50 hover:border-primary/50 hover:bg-muted/10 bg-muted/5"
                                }`}
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={e => {
                                    e.preventDefault();
                                    setIsDragging(false);
                                    validateAndAddFiles(e.dataTransfer.files);
                                }}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    multiple
                                    accept=".pdf,.zip,.jpg,.jpeg,.png,.webp,.gif,.doc,.docx"
                                    onChange={e => { validateAndAddFiles(e.target.files); e.target.value = ""; }}
                                />
                                <div className="flex flex-col items-center gap-2">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                                        isDragging ? "bg-primary/20" : "bg-primary/10"
                                    }`}>
                                        <Upload className={`w-5 h-5 ${isDragging ? "text-primary scale-110" : "text-primary"} transition-transform`} />
                                    </div>
                                    <p className="text-sm font-medium">
                                        {isDragging ? "Drop files here" : "Click to upload or drag & drop"}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        PDF, ZIP, Images, DOCX · Max {MAX_FILE_SIZE_MB}MB each · Up to {MAX_FILES} files
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Error message */}
                        {fileError && (
                            <p className="text-xs font-medium text-destructive flex items-center gap-1.5">
                                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                                {fileError}
                            </p>
                        )}

                        {/* File List */}
                        {files.length > 0 && (
                            <ul className="space-y-2">
                                {files.map((file, idx) => (
                                    <li
                                        key={idx}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/30 border border-border/40 group"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <FileText className="w-4 h-4 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate leading-tight">{file.name}</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">{formatSize(file.size)}</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeFile(idx)}
                                            className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100"
                                            title="Remove file"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </form>

                {/* Footer */}
                <div className="p-6 border-t border-border/50 bg-muted/5 flex items-center justify-end gap-3">
                    <Button 
                        variant="outline" 
                        onClick={handleCloseRequest}
                        disabled={isSubmitting}
                        className="rounded-xl px-6"
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSubmit}
                        disabled={isSubmitting || !formData.title || !formData.summary || !selectedWeek}
                        className="rounded-xl px-6 bg-primary hover:bg-primary/90"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                {initialData ? "Updating..." : "Submitting..."}
                            </>
                        ) : (initialData ? "Resubmit Report" : "Submit Report")}
                    </Button>
                </div>
            </div>
        </div>
    );
};

// ─── View Report Modal ────────────────────────────────────────────────────────

interface ViewModalProps {
    report: WeeklyReport;
    onClose: () => void;
}

const ViewReportModal = ({ report, onClose }: ViewModalProps) => {
    const StatusIcon = statusIcons[report.status];

    // Support comma-separated file names from multi-file submissions
    const fileNames = report.fileName
        ? report.fileName.split(",").map(f => f.trim()).filter(Boolean)
        : [];

    const sections = [
        { label: "Tasks Completed", value: report.summary },
        { label: "Challenges Faced", value: report.challenges },
        { label: "Learning Outcomes", value: report.learnings },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div
                className="bg-background border border-border/50 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border/50 bg-muted/5 flex-shrink-0">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight">Weekly Report Details</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            {report.week} · Submitted {report.submittedDate}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground flex-shrink-0">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    {/* Status + Meta row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">Week / Date</p>
                            <div className="flex items-center gap-2 bg-muted/50 rounded-xl px-4 py-3 border border-border/30">
                                <span className="text-sm font-semibold">{report.week}</span>
                                <span className="text-muted-foreground/50">·</span>
                                <span className="text-sm text-muted-foreground">{report.submittedDate}</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">Status</p>
                            <div className="bg-muted/50 rounded-xl px-4 py-3 border border-border/30 flex items-center">
                                <Badge variant="outline" className={`text-[11px] font-bold gap-1.5 px-2.5 py-1 ${statusStyles[report.status]}`}>
                                    <StatusIcon className="w-3.5 h-3.5" />
                                    {report.status}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Report Title */}
                    <div className="space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">Report Title</p>
                        <p className="text-sm font-semibold leading-relaxed bg-muted/30 rounded-xl px-4 py-3 border border-border/30">
                            {report.title || "—"}
                        </p>
                    </div>

                    {/* Content sections */}
                    {sections.map(sec => (
                        <div key={sec.label} className="space-y-2">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">{sec.label}</p>
                            <p className="text-sm leading-relaxed bg-muted/30 rounded-xl px-4 py-3 border border-border/30 min-h-[60px]">
                                {sec.value || <span className="text-muted-foreground italic">Not provided</span>}
                            </p>
                        </div>
                    ))}

                    {/* Attachments */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">Attachments</p>
                            {fileNames.length > 0 && (
                                <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                    {fileNames.length} file{fileNames.length !== 1 ? "s" : ""}
                                </span>
                            )}
                        </div>
                        {fileNames.length > 0 ? (
                            <ul className="space-y-2">
                                {fileNames.map((name, idx) => (
                                    <li
                                        key={idx}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/30 border border-border/40 group"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <FileText className="w-4 h-4 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate leading-tight">{name}</p>
                                        </div>
                                        <button
                                            type="button"
                                            className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100"
                                            title="Download file"
                                        >
                                            <Upload className="w-4 h-4 rotate-180" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-muted-foreground bg-muted/30 rounded-xl px-4 py-3 border border-border/30">
                                No files attached
                            </p>
                        )}
                    </div>

                    {/* Mentor Feedback */}
                    <div className="space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 flex items-center gap-1.5">
                            <MessageSquare className="w-3.5 h-3.5" /> Mentor Feedback
                        </p>
                        <div className={`text-sm leading-relaxed rounded-xl px-4 py-3 border ${
                            report.status === "Reviewed"
                                ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-700"
                                : report.status === "Rejected"
                                    ? "bg-red-500/5 border-red-500/20 text-red-700"
                                    : "bg-muted/30 border-border/30 text-muted-foreground"
                        }`}>
                            {report.mentorFeedback || "No feedback yet"}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-border/50 bg-muted/5 flex justify-end flex-shrink-0">
                    <Button variant="outline" className="rounded-xl px-6" onClick={onClose}>Close</Button>
                </div>
            </div>
        </div>
    );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const WeeklyReport = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [reports, setReports] = useState<WeeklyReport[]>(initialReports);
    const [viewingReport, setViewingReport] = useState<WeeklyReport | null>(null);
    const [resubmittingReport, setResubmittingReport] = useState<WeeklyReport | null>(null);
    const [activeFilter, setActiveFilter] = useState<ReportStatus | null>(null);

    const isSubmitModalOpen = location.pathname === "/intern/weekly-report/submit-weekly-report" || !!resubmittingReport;

    const filteredReports = activeFilter
        ? reports.filter(r => r.status === activeFilter)
        : reports;

    const handleCardClick = (status: ReportStatus) => {
        setActiveFilter(prev => (prev === status ? null : status));
    };

    const handleNewSubmission = (newReport: Partial<WeeklyReport>) => {
        if (newReport.id) {
            // Update existing report (Resubmission)
            setReports(prev => prev.map(r => 
                r.id === newReport.id 
                    ? { ...r, ...newReport, id: r.id } as WeeklyReport 
                    : r
            ));
            setResubmittingReport(null);
        } else {
            // Create new report
            const report: WeeklyReport = {
                id: reports.length + 1,
                week: newReport.week || "",
                title: newReport.title || "",
                submittedDate: newReport.submittedDate || "",
                status: "Pending",
                mentorId: "—",
                mentorFeedback: "—",
                summary: newReport.summary || "",
                challenges: newReport.challenges || "",
                learnings: "",
                fileName: newReport.fileName || "",
            };
            setReports(prev => [report, ...prev]);
        }
    };

    const handleOpenResubmit = (report: WeeklyReport) => {
        setResubmittingReport(report);
    };

    const handleCloseSubmit = () => {
        setResubmittingReport(null);
        if (location.pathname === "/intern/weekly-report/submit-weekly-report") {
            navigate("/intern/weekly-report");
        }
    };

    return (
        <>
            <DashboardLayout>
                <div className="animate-fade-in space-y-6 max-w-6xl mx-auto px-4 md:px-6 lg:px-8 pb-10">

                    {/* ── Page Header ── */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">Weekly Reports</h1>
                            <p className="text-muted-foreground mt-1 text-sm">
                                Submit and manage your internship weekly reports.
                            </p>
                        </div>
                        <Button
                            className="gap-2 flex-shrink-0 rounded-xl px-5"
                            onClick={() => navigate("/intern/weekly-report/submit-weekly-report")}
                        >
                            <Plus className="w-4 h-4" />
                            Submit Weekly Report
                        </Button>
                    </div>

                    {/* ── Summary Strip ── */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {(["Reviewed", "Pending", "Rejected"] as ReportStatus[]).map(s => {
                            const count = reports.filter(r => r.status === s).length;
                            const Icon = statusIcons[s];
                            const isActive = activeFilter === s;
                            return (
                                <Card
                                    key={s}
                                    onClick={() => handleCardClick(s)}
                                    className={`border-border/50 shadow-sm rounded-2xl overflow-hidden cursor-pointer select-none transition-all duration-200 ${
                                        isActive
                                            ? "ring-2 ring-primary border-primary/60 shadow-md scale-[1.02]"
                                            : "hover:shadow-md hover:scale-[1.01] hover:border-border"
                                    }`}
                                >
                                    <CardContent className="p-5 flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors ${
                                            isActive
                                                ? statusStyles[s].split(" ").slice(0, 1).join(" ") + " opacity-100"
                                                : statusStyles[s].split(" ").slice(0, 1).join(" ")
                                        }`}>
                                            <Icon className={`w-6 h-6 ${isActive ? statusStyles[s].split(" ").slice(1, 2).join(" ") : statusStyles[s].split(" ").slice(1, 2).join(" ")}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-2xl font-black tracking-tight leading-none transition-colors ${isActive ? "text-primary" : ""}`}>{count}</p>
                                            <p className={`text-xs font-semibold mt-1 uppercase tracking-wider transition-colors ${isActive ? "text-primary/80" : "text-muted-foreground"}`}>{s}</p>
                                        </div>
                                        {isActive && (
                                            <div className="flex-shrink-0">
                                                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-full border border-primary/20">
                                                    Active
                                                </span>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {/* ── Reports Table ── */}
                    <Card className="border-border/50 shadow-sm rounded-2xl overflow-hidden bg-card/50 backdrop-blur-sm">
                        <CardHeader className="pb-3 px-6 pt-6">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-bold flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <FileText className="w-4 h-4 text-primary" />
                                    </div>
                                    {activeFilter ? `${activeFilter} Reports` : "Report History"}
                                </CardTitle>
                                {activeFilter && (
                                    <button
                                        onClick={() => setActiveFilter(null)}
                                        className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-muted transition-colors border border-border/50"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                        Clear filter
                                    </button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {filteredReports.length === 0 ? (
                                <div className="text-center py-20 text-muted-foreground">
                                    <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                                        <FileText className="w-8 h-8 opacity-20" />
                                    </div>
                                    {activeFilter ? (
                                        <>
                                            <p className="font-bold text-lg">No {activeFilter} reports</p>
                                            <p className="text-sm mt-1">You have no reports with "{activeFilter}" status.</p>
                                            <button
                                                onClick={() => setActiveFilter(null)}
                                                className="mt-4 text-sm font-semibold text-primary hover:underline"
                                            >
                                                Show all reports
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <p className="font-bold text-lg">No reports submitted yet.</p>
                                            <p className="text-sm mt-1">Click "Submit Weekly Report" to get started.</p>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-muted/50 hover:bg-muted/50 border-y border-border/50">
                                                <TableHead className="text-xs font-bold uppercase tracking-wider px-6 h-12">Week</TableHead>
                                                <TableHead className="text-xs font-bold uppercase tracking-wider h-12">Report Title</TableHead>
                                                <TableHead className="text-xs font-bold uppercase tracking-wider h-12">Submitted Date</TableHead>
                                                <TableHead className="text-xs font-bold uppercase tracking-wider h-12">Status</TableHead>
                                                <TableHead className="text-xs font-bold uppercase tracking-wider h-12">Mentor ID</TableHead>
                                                <TableHead className="text-xs font-bold uppercase tracking-wider h-12">Mentor Feedback</TableHead>
                                                <TableHead className="text-xs font-bold uppercase tracking-wider text-right px-6 h-12 w-[220px]">Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredReports.map(report => {
                                                const StatusIcon = statusIcons[report.status];
                                                return (
                                                    <TableRow key={report.id} className="hover:bg-muted/20 transition-colors border-b border-border/50 group">
                                                        <TableCell className="px-6 py-4 text-sm font-bold">{report.week}</TableCell>
                                                        <TableCell className="py-4 text-sm font-medium max-w-[200px]">
                                                            <p className="truncate">{report.title}</p>
                                                        </TableCell>
                                                        <TableCell className="py-4 text-sm text-muted-foreground font-medium">{report.submittedDate}</TableCell>
                                                        <TableCell className="py-4">
                                                            <Badge
                                                                variant="outline"
                                                                className={`text-[10px] font-bold px-2 py-0.5 gap-1.5 rounded-lg ${statusStyles[report.status]}`}
                                                            >
                                                                <StatusIcon className="w-3 h-3" />
                                                                {report.status}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="py-4">
                                                            {report.mentorId && report.mentorId !== "—" ? (
                                                                <span className="text-xs font-bold font-mono bg-muted px-2.5 py-1 rounded-lg border border-border/50 text-foreground tracking-wider">
                                                                    {report.mentorId}
                                                                </span>
                                                            ) : (
                                                                <span className="text-sm text-muted-foreground">—</span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="py-4 text-sm text-muted-foreground max-w-[250px] font-medium italic">
                                                            <p className="line-clamp-2 leading-relaxed">{report.mentorFeedback}</p>
                                                        </TableCell>
                                                        <TableCell className="py-4 px-6 text-right">
                                                            <div className="flex items-center justify-end gap-2 isolate">
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="h-9 px-4 gap-2 rounded-xl font-bold border-border/50 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200"
                                                                    onClick={() => setViewingReport(report)}
                                                                >
                                                                    <Eye className="w-4 h-4" />
                                                                    View
                                                                </Button>
                                                                {report.status === "Rejected" && (
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        className="h-9 px-4 gap-2 rounded-xl font-bold border-red-500/50 text-red-600 hover:bg-red-500 hover:text-white transition-all duration-200"
                                                                        onClick={() => handleOpenResubmit(report)}
                                                                    >
                                                                        <Upload className="w-4 h-4" />
                                                                        Resubmit
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                </div>
            </DashboardLayout>

            {isSubmitModalOpen && (
                <SubmitReportModal
                    onClose={handleCloseSubmit}
                    onSubmit={handleNewSubmission}
                    initialData={resubmittingReport || undefined}
                />
            )}

            {viewingReport && (
                <ViewReportModal
                    report={viewingReport}
                    onClose={() => setViewingReport(null)}
                />
            )}
        </>
    );
};

export default WeeklyReport;
