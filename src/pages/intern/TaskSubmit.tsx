import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft, Upload, Github, Link2, FileText,
    CheckCircle2, AlertCircle, Send,
} from "lucide-react";
import { allTasks } from "./TaskDetails";

// ─── Page ─────────────────────────────────────────────────────────────────────

const TaskSubmit = () => {
    const { taskId } = useParams<{ taskId: string }>();
    const navigate = useNavigate();

    const task = allTasks.find(t => t.id === Number(taskId));

    const [files, setFiles] = useState<{ name: string; size: string; file: File }[]>([]);
    const [repoLink, setRepoLink] = useState("");
    const [liveLink, setLiveLink] = useState("");
    const [notes, setNotes] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    if (!task) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground space-y-4">
                    <AlertCircle className="w-10 h-10 opacity-30" />
                    <p className="font-medium">Task not found.</p>
                    <Button variant="outline" size="sm" onClick={() => navigate("/intern/tasks")}>
                        <ArrowLeft className="w-4 h-4 mr-1.5" />Back to Tasks
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

    // If already submitted/completed show info state
    const alreadyDone = task.status === "Submitted" || task.status === "Completed";

    if (submitted) {
        return (
            <DashboardLayout>
                <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 sm:p-8">
                    <div className="w-full max-w-lg mx-auto text-center space-y-8 animate-in fade-in zoom-in duration-500">
                        <div className="relative inline-block">
                            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto ring-8 ring-primary/5">
                                <CheckCircle2 className="w-12 h-12 text-primary" />
                            </div>
                            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-background border-4 border-primary/20 flex items-center justify-center animate-bounce">
                                <Send className="w-3 h-3 text-primary" />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Work Successfully Submitted!</h2>
                            <p className="text-muted-foreground text-lg font-medium max-w-sm mx-auto">
                                Great job! Your assignment has been sent to your mentor for review.
                            </p>
                        </div>

                        <div className="pt-4">
                            <Button
                                className="w-full h-14 rounded-xl text-base font-bold shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                onClick={() => navigate("/intern/tasks")}
                            >
                                Return to Task
                            </Button>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (alreadyDone) {
        return (
            <DashboardLayout>
                <div className="animate-fade-in w-full px-4 md:px-6 lg:px-8 pb-10 pt-20 flex flex-col items-center justify-center text-center">
                    <div className="max-w-lg space-y-6">
                        <div className="w-20 h-20 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-6 shadow-sm border border-blue-500/20">
                            <CheckCircle2 className="w-10 h-10 text-blue-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-foreground">Already {task.status}</h2>
                        <p className="text-muted-foreground text-base max-w-sm mx-auto">
                            This task was already {task.status.toLowerCase()} on our records. Multiple submissions are not permitted for this assignment.
                        </p>
                        <Button variant="outline" className="h-11 px-8 rounded-xl mt-4" onClick={() => navigate("/intern/tasks")}>
                            <ArrowLeft className="w-4 h-4 mr-2" />Back to Task
                        </Button>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    const handleSubmit = () => {
        // In production: POST to API here
        setSubmitted(true);
    };

    const isValid = files.length > 0 || repoLink || liveLink;

    const handleFileChange = (newFiles: FileList | null) => {
        if (!newFiles) return;

        const validExtensions = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.txt', '.jpg', '.jpeg', '.png', '.webp', '.svg', '.mp4', '.mov', '.avi', '.zip', '.rar', '.js', '.ts', '.html', '.css'];

        const addedFiles = Array.from(newFiles).map(f => {
            const ext = f.name.substring(f.name.lastIndexOf('.')).toLowerCase();
            if (!validExtensions.includes(ext)) {
                // Optional: show error toast here
                return null;
            }
            if (f.size > 50 * 1024 * 1024) { // 50MB limit
                return null;
            }
            return {
                name: f.name,
                size: (f.size / 1024 / 1024).toFixed(2) + " MB",
                file: f
            };
        }).filter(Boolean) as { name: string; size: string; file: File }[];

        setFiles(prev => [...prev, ...addedFiles]);
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <DashboardLayout>
            <div className="animate-fade-in max-w-6xl mx-auto w-full px-4 md:px-6 lg:px-8 pb-10 space-y-6">

                {/* ── Back link ── */}
                <button
                    onClick={() => navigate("/intern/tasks")}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group w-fit"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    Back to Task
                </button>

                {/* ── Page Header ── */}
                <div className="flex flex-col gap-1.5 border-b border-border/10 pb-5">
                    <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">Submit Your Work</h1>
                    <p className="text-muted-foreground text-sm">
                        Upload your project files and provide necessary links for your mentor to evaluate your progress.
                    </p>
                </div>

                <div className="space-y-6">
                    {/* Submission Form */}
                    <Card className="border-border/50 shadow-sm rounded-xl overflow-hidden">
                        <CardHeader className="pb-4 px-6 pt-6 border-b border-border/10 bg-muted/5">
                            <CardTitle className="text-base font-bold flex items-center gap-2">
                                <Send className="w-4 h-4 text-primary" />
                                Submission Form
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">

                            {/* File Upload */}
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                    <FileText className="w-4 h-4 text-muted-foreground" />
                                    Project Asset / Documentation
                                </Label>
                                <div
                                    className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${isDragging ? "border-primary bg-primary/5 ring-4 ring-primary/5" :
                                        files.length > 0 ? "border-primary/30 bg-primary/5" : "border-border/40 hover:bg-muted/10 hover:border-border/60"
                                        }`}
                                    onClick={() => document.getElementById("file-upload")?.click()}
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        setIsDragging(true);
                                    }}
                                    onDragLeave={() => setIsDragging(false)}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        setIsDragging(false);
                                        handleFileChange(e.dataTransfer.files);
                                    }}
                                >
                                    <input
                                        id="file-upload"
                                        type="file"
                                        multiple
                                        className="hidden"
                                        accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.webp,.svg,.mp4,.mov,.avi,.zip,.rar,.js,.ts,.html,.css"
                                        onChange={e => handleFileChange(e.target.files)}
                                    />
                                    <div className={`w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-3 transition-colors ${isDragging ? "bg-primary/20" : ""}`}>
                                        <Upload className={`w-6 h-6 ${isDragging ? "text-primary scale-110" : "text-muted-foreground"} transition-all`} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className={`text-sm font-semibold ${isDragging ? "text-primary" : "text-foreground"}`}>
                                            {isDragging ? "Drop files here" : "Drag & drop files here or click to upload"}
                                        </p>
                                        <p className="text-xs text-muted-foreground">Supported: PDF, PPTX, MP4, ZIP, Images (Max 50MB)</p>
                                    </div>
                                </div>

                                {/* Selected Files List */}
                                {files.length > 0 && (
                                    <div className="mt-4 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-1">Selected Files ({files.length})</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {files.map((file, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/40 group hover:border-border/80 transition-all"
                                                >
                                                    <div className="flex items-center gap-2.5 min-w-0">
                                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                            <FileText className="w-4 h-4 text-primary" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-semibold text-foreground truncate max-w-[120px] sm:max-w-none">{file.name}</p>
                                                            <p className="text-[10px] text-muted-foreground font-medium">{file.size}</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            removeFile(idx);
                                                        }}
                                                        className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                                                        title="Remove file"
                                                    >
                                                        <AlertCircle className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* GitHub Link */}
                                <div className="space-y-2">
                                    <Label htmlFor="repo" className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                        <Github className="w-4 h-4 text-muted-foreground" />
                                        Repository Link
                                    </Label>
                                    <Input
                                        id="repo"
                                        className="rounded-xl h-11 border-border/40 focus:ring-primary/20 bg-muted/5 font-medium"
                                        placeholder="https://github.com/alex/project-ui"
                                        value={repoLink}
                                        onChange={e => setRepoLink(e.target.value)}
                                    />
                                </div>

                                {/* Live Link */}
                                <div className="space-y-2">
                                    <Label htmlFor="live" className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                        <Link2 className="w-4 h-4 text-muted-foreground" />
                                        Live Preview Link
                                    </Label>
                                    <Input
                                        id="live"
                                        className="rounded-xl h-11 border-border/40 focus:ring-primary/20 bg-muted/5 font-medium"
                                        placeholder="https://project.vercel.app"
                                        value={liveLink}
                                        onChange={e => setLiveLink(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="space-y-2">
                                <Label htmlFor="notes" className="text-sm font-semibold text-foreground block">
                                    Additional Notes <span className="text-muted-foreground font-normal text-xs ml-1">(Optional)</span>
                                </Label>
                                <textarea
                                    id="notes"
                                    rows={5}
                                    placeholder="Add any specific details, blockers you faced, or instructions for the mentor reviewing your code..."
                                    value={notes}
                                    onChange={e => setNotes(e.target.value)}
                                    className="w-full rounded-xl border border-border/40 bg-muted/5 px-4 py-3 text-sm font-medium shadow-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all resize-none"
                                />
                            </div>
                        </CardContent>
                    </Card>


                    {/* Actions Area (Prominent Submit Button) */}
                    <div className="pt-2 pb-10">
                        <Button
                            className="w-full h-14 rounded-xl shadow-lg shadow-primary/20 text-base font-bold gap-3 transition-all hover:scale-[1.01] active:scale-[0.99]"
                            onClick={handleSubmit}
                            disabled={!isValid}
                        >
                            <Send className="w-5 h-5" />
                            Submit Your Assignment
                        </Button>
                        {!isValid && (
                            <div className="flex items-center justify-center gap-2 text-[11px] text-amber-600 font-bold uppercase tracking-widest mt-4">
                                <AlertCircle className="w-4 h-4" />
                                Submission Requirement: File or Link
                            </div>
                        )}
                        <p className="text-[10px] text-muted-foreground font-semibold leading-relaxed text-center mt-6 max-w-md mx-auto">
                            * Your submission will be timestamped and assigned to your mentor for valuation.
                            You can update your submission until the review process begins.
                        </p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default TaskSubmit;
