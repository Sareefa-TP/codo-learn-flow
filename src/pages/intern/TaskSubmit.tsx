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

    const [fileName, setFileName] = useState("");
    const [repoLink, setRepoLink] = useState("");
    const [liveLink, setLiveLink] = useState("");
    const [notes, setNotes] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [fileSize, setFileSize] = useState("");

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
                <div className="animate-fade-in max-w-lg mx-auto pb-10 pt-10 space-y-5 text-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h2 className="text-xl font-bold">Work Submitted!</h2>
                    <p className="text-muted-foreground text-sm">
                        Your submission for <strong>{task.title}</strong> has been sent to your mentor.
                    </p>
                    <div className="flex justify-center gap-3">
                        <Button variant="outline" onClick={() => navigate(`/intern/tasks/${task.id}`)}>
                            View Task
                        </Button>
                        <Button onClick={() => navigate("/intern/tasks")}>
                            Back to Tasks
                        </Button>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (alreadyDone) {
        return (
            <DashboardLayout>
                <div className="animate-fade-in max-w-lg mx-auto pb-10 pt-10 space-y-5 text-center">
                    <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-8 h-8 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-bold">Already {task.status}</h2>
                    <p className="text-muted-foreground text-sm">
                        This task has already been {task.status.toLowerCase()}. You cannot submit again.
                    </p>
                    <Button variant="outline" onClick={() => navigate(`/intern/tasks/${task.id}`)}>
                        <ArrowLeft className="w-4 h-4 mr-1.5" />Back to Task Details
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

    const handleSubmit = () => {
        // In production: POST to API here
        setSubmitted(true);
    };

    const isValid = fileName || repoLink || liveLink;

    return (
        <DashboardLayout>
            <div className="animate-fade-in max-w-2xl mx-auto pb-10 space-y-5">

                {/* ── Back link ── */}
                <button
                    onClick={() => navigate(`/intern/tasks/${task.id}`)}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Task Details
                </button>

                {/* ── Task Info ── */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Submit Work</h1>
                    <p className="text-muted-foreground text-sm mt-0.5">
                        Complete and submit your work for the task below
                    </p>
                </div>

                {/* ── Task Summary Card ── */}
                <Card className="border-border/50 shadow-sm rounded-xl bg-muted/20">
                    <CardContent className="pt-4 pb-4">
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                            <div>
                                <p className="font-semibold">{task.title}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{task.week} · Due {task.deadline}</p>
                            </div>
                            <Badge variant="outline" className="text-[10px] font-semibold bg-muted text-muted-foreground border-border/40">
                                Pending
                            </Badge>
                        </div>
                        <div className="mt-3 p-3 bg-background rounded-lg border border-border/30">
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">Instructions</p>
                            <p className="text-xs leading-relaxed text-foreground">{task.instructions}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* ── Submission Form ── */}
                <Card className="border-border/50 shadow-sm rounded-xl">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold">Your Submission</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5 pt-0">

                        {/* File Upload */}
                        <div className="space-y-1.5">
                            <Label className="flex items-center gap-1.5">
                                <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                                Upload File
                            </Label>
                            <div
                                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${isDragging ? "border-primary bg-primary/10" :
                                    fileName ? "border-primary/40 bg-primary/5" : "border-border/40 hover:bg-muted/20"
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
                                    const f = e.dataTransfer.files?.[0];
                                    if (f) {
                                        setFileName(f.name);
                                        setFileSize((f.size / 1024 / 1024).toFixed(2) + " MB");
                                    }
                                }}
                            >
                                <input
                                    id="file-upload"
                                    type="file"
                                    className="hidden"
                                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.webp,.svg,.mp4,.mov,.avi,.zip,.rar,.js,.ts,.html,.css"
                                    onChange={e => {
                                        const f = e.target.files?.[0];
                                        if (f) {
                                            setFileName(f.name);
                                            setFileSize((f.size / 1024 / 1024).toFixed(2) + " MB");
                                        }
                                    }}
                                />
                                <Upload className={`w-6 h-6 mx-auto mb-2 ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
                                {fileName ? (
                                    <>
                                        <p className="text-sm font-medium text-foreground">{fileName}</p>
                                        {fileSize && <p className="text-xs text-muted-foreground mt-0.5">{fileSize}</p>}
                                    </>
                                ) : (
                                    <>
                                        <p className={`text-sm font-medium ${isDragging ? "text-primary" : "text-foreground"}`}>
                                            {isDragging ? "Drop file here" : "Click or drag file to upload"}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-0.5">Images, Videos, Documents, Archives supported</p>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* GitHub Link */}
                        <div className="space-y-1.5">
                            <Label htmlFor="repo" className="flex items-center gap-1.5">
                                <Github className="w-3.5 h-3.5 text-muted-foreground" />
                                GitHub Repository Link
                            </Label>
                            <Input
                                id="repo"
                                placeholder="https://github.com/your-username/project"
                                value={repoLink}
                                onChange={e => setRepoLink(e.target.value)}
                            />
                        </div>

                        {/* Live Link */}
                        <div className="space-y-1.5">
                            <Label htmlFor="live" className="flex items-center gap-1.5">
                                <Link2 className="w-3.5 h-3.5 text-muted-foreground" />
                                Project / Live Link <span className="text-muted-foreground font-normal">(optional)</span>
                            </Label>
                            <Input
                                id="live"
                                placeholder="https://your-project.vercel.app"
                                value={liveLink}
                                onChange={e => setLiveLink(e.target.value)}
                            />
                        </div>

                        {/* Notes */}
                        <div className="space-y-1.5">
                            <Label htmlFor="notes">Notes for Mentor <span className="text-muted-foreground font-normal">(optional)</span></Label>
                            <textarea
                                id="notes"
                                rows={4}
                                placeholder="Anything you'd like your mentor to know about your submission..."
                                value={notes}
                                onChange={e => setNotes(e.target.value)}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* ── Actions ── */}
                <div className="flex items-center gap-3 flex-wrap">
                    <Button
                        className="gap-2"
                        onClick={handleSubmit}
                        disabled={!isValid}
                    >
                        <Send className="w-4 h-4" />
                        Submit Task
                    </Button>
                    <Button
                        variant="outline"
                        className="gap-2"
                        onClick={() => navigate(`/intern/tasks/${task.id}`)}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Cancel
                    </Button>
                </div>

                {!isValid && (
                    <p className="text-xs text-muted-foreground">
                        * Please upload a file or provide at least one link before submitting.
                    </p>
                )}

            </div>
        </DashboardLayout>
    );
};

export default TaskSubmit;
