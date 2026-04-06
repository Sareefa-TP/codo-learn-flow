import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CalendarIcon, AlertCircle, FileText, CheckCircle2, Clock } from "lucide-react";

// ─── Mock Data ───────────────────────────────────────────────────────────────

const mockTaskInfo = {
    id: "TSK-001",
    title: "Build Login Page",
    week: "Week 1",
    dueDate: "Mar 10, 2026",
    priority: "High" as const,
    status: "Active" as const,
    description: "Create a fully functional login page with email and password fields, validation, and error states. Ensure it matches the approved Figma designs exactly.",
    instructions: "1. Match color scheme precisely.\n2. Handle loading states on submit.\n3. Show toast notification on error.\n4. Route to dashboard on success.",
    materials: [
        { name: "login-mockup.pdf", size: "1.2 MB" },
        { name: "brand-colors.zip", size: "4.5 MB" }
    ]
};

const priorityStyles = {
    High: "bg-red-500/10 text-red-600 border-red-500/20",
    Medium: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    Low: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
};

const statusStyles = {
    Active: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    Completed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    Overdue: "bg-rose-500/10 text-rose-600 border-rose-500/20",
};

// ─── Page Component ──────────────────────────────────────────────────────────

const MentorTaskDetails = () => {
    const { taskId } = useParams();
    const navigate = useNavigate();

    // In a real app, you would fetch task details using the taskId
    const task = mockTaskInfo; // Using mock data for now

    return (
        <DashboardLayout>
            <div className="animate-fade-in space-y-6 max-w-4xl mx-auto pb-10">

                {/* ── Back Button & Header ── */}
                <div>
                    <Button
                        variant="ghost"
                        className="mb-4 -ml-4 gap-2 text-muted-foreground hover:text-foreground"
                        onClick={() => navigate("/mentor/tasks")}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Tasks
                    </Button>

                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Badge variant="outline" className="text-[10px] font-medium bg-muted text-muted-foreground">
                                    {task.week}
                                </Badge>
                                <Badge variant="outline" className={`text-[10px] font-semibold ${priorityStyles[task.priority]}`}>
                                    {task.priority} Priority
                                </Badge>
                                <Badge variant="outline" className={`text-[10px] font-semibold ${statusStyles[task.status]}`}>
                                    {task.status === "Active" ? <Clock className="w-3 h-3 mr-1" /> : task.status === "Completed" ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                                    {task.status}
                                </Badge>
                            </div>
                            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
                                {task.title}
                            </h1>
                            <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1.5">
                                <CalendarIcon className="w-4 h-4" />
                                Due: <span className="font-medium text-foreground">{task.dueDate}</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-border/50 shadow-sm rounded-xl">
                            <CardHeader className="pb-3 border-b border-border/40 bg-muted/10">
                                <CardTitle className="text-base font-semibold">Description</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-5 flex flex-col gap-4">
                                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                                    {task.description}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-border/50 shadow-sm rounded-xl">
                            <CardHeader className="pb-3 border-b border-border/40 bg-muted/10">
                                <CardTitle className="text-base font-semibold">Instructions & Guidelines</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-5">
                                <div className="bg-primary/5 border border-primary/10 rounded-lg p-4">
                                    <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                                        {task.instructions}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar / Attachments */}
                    <div className="space-y-6">
                        <Card className="border-border/50 shadow-sm rounded-xl">
                            <CardHeader className="pb-3 border-b border-border/40 bg-muted/10">
                                <CardTitle className="text-base font-semibold">Attached Materials</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-5 space-y-3">
                                {task.materials && task.materials.length > 0 ? (
                                    task.materials.map((file, idx) => (
                                        <div key={idx} className="flex items-center gap-3 p-3 rounded-lg border border-border/40 hover:bg-muted/30 transition-colors cursor-pointer group">
                                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                                <FileText className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{file.name}</p>
                                                <p className="text-xs text-muted-foreground">{file.size}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center py-4">No materials attached.</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
};

export default MentorTaskDetails;
