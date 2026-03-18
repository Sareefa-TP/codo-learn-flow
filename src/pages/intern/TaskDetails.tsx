import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    ArrowLeft, Calendar, Clock, CheckCircle2, AlertCircle,
    Loader2, User, FileText, Presentation, FileVideo, Link2,
    Upload,
} from "lucide-react";

// ─── Shared mock data (same as Tasks.tsx) ─────────────────────────────────────

type Priority = "High" | "Medium" | "Low";
type Status = "Pending" | "Submitted" | "Completed" | "Overdue";

interface Material {
    type: "PDF" | "PPT" | "Video" | "Link";
    label: string;
}

interface TaskData {
    id: number;
    title: string;
    week: string;
    priority: Priority;
    deadline: string;
    status: Status;
    description: string;
    mentor: string;
    instructions: string;
    materials: Material[];
}

export const allTasks: TaskData[] = [
    {
        id: 1,
        title: "Build Login Page UI",
        week: "Week 2",
        priority: "High",
        deadline: "March 22, 2026",
        status: "Pending",
        description: "Design and implement the login page UI with form validation, error states, and responsive layout using React and Tailwind CSS. Ensure accessibility best practices are followed.",
        mentor: "John Doe",
        instructions: "Create a responsive login page UI using React and Tailwind. Include email/password fields, validation, and a submit button. Match the existing design system.",
        materials: [
            { type: "PDF", label: "Design Spec – Login Page.pdf" },
            { type: "Link", label: "Figma Prototype" },
        ],
    },
    {
        id: 2,
        title: "Create Dashboard Layout",
        week: "Week 3",
        priority: "High",
        deadline: "March 20, 2026",
        status: "Submitted",
        description: "Build the main dashboard layout including sidebar, header, and main content area. The layout must be responsive and use ShadCN UI components.",
        mentor: "John Doe",
        instructions: "Build the main LMS dashboard layout with sidebar navigation, sticky header, and content area. Use DashboardLayout as the wrapper.",
        materials: [
            { type: "PPT", label: "Dashboard Design.pptx" },
            { type: "Video", label: "Tutorial: Layout with Tailwind" },
        ],
    },
    {
        id: 3,
        title: "API Integration Practice",
        week: "Week 4",
        priority: "Medium",
        deadline: "March 28, 2026",
        status: "Pending",
        description: "Integrate REST APIs for user authentication and data fetching using axios. Build a custom hook for API calls with loading and error states.",
        mentor: "Sarah Mills",
        instructions: "Create a custom React hook useApi() that wraps axios. Implement login, logout, and fetch-students endpoints with proper error handling.",
        materials: [
            { type: "PDF", label: "API Documentation.pdf" },
            { type: "Link", label: "Postman Collection" },
        ],
    },
    {
        id: 4,
        title: "Database Schema Design",
        week: "Week 5",
        priority: "Medium",
        deadline: "March 15, 2026",
        status: "Overdue",
        description: "Design the relational database schema for the LMS platform including students, courses, and batches. Use an ER diagram tool and document all relationships.",
        mentor: "Sarah Mills",
        instructions: "Design an ERD covering Students, Courses, Batches, Tutors, Mentors, and Interns tables. Submit both the diagram file and a written explanation.",
        materials: [
            { type: "PDF", label: "Schema Requirements.pdf" },
        ],
    },
    {
        id: 5,
        title: "Responsive UI Improvements",
        week: "Week 6",
        priority: "Low",
        deadline: "April 05, 2026",
        status: "Completed",
        description: "Audit and fix all responsive breakpoints across the intern portal pages to ensure they look correct on mobile, tablet, and desktop screen sizes.",
        mentor: "John Doe",
        instructions: "Test every intern portal page on 375px, 768px, and 1280px breakpoints. Document issues and submit fixes as a PR.",
        materials: [
            { type: "PDF", label: "Responsive Checklist.pdf" },
            { type: "Video", label: "Walkthrough Recording" },
        ],
    },
    {
        id: 6,
        title: "Code Review Participation",
        week: "Week 3",
        priority: "Low",
        deadline: "March 18, 2026",
        status: "Completed",
        description: "Participate in peer code review sessions and submit written feedback for at least two teammates' pull requests.",
        mentor: "John Doe",
        instructions: "Review two open PRs in the shared repo. Leave inline comments and a summary review. Submit the GitHub PR links.",
        materials: [],
    },
    {
        id: 7,
        title: "Prepare Weekly Report",
        week: "Week 4",
        priority: "Medium",
        deadline: "March 25, 2026",
        status: "Submitted",
        description: "Write and submit a structured weekly progress report to your mentor covering accomplishments, blockers, and next week's plan.",
        mentor: "Sarah Mills",
        instructions: "Use the provided report template. Fill in all sections and submit as a PDF. Length: 1–2 pages.",
        materials: [
            { type: "PPT", label: "Report Template.pptx" },
        ],
    },
    {
        id: 8,
        title: "Component Library Setup",
        week: "Week 2",
        priority: "High",
        deadline: "March 10, 2026",
        status: "Completed",
        description: "Set up and document the shared component library using ShadCN UI. Create storybook-style usage examples for Button, Card, Badge, and Input.",
        mentor: "John Doe",
        instructions: "Initialize ShadCN in the project and document 4 core components with usage examples in a components/README.md file.",
        materials: [
            { type: "Link", label: "ShadCN Docs" },
            { type: "PDF", label: "Component Guidelines.pdf" },
        ],
    },
];

// ─── Style Maps ───────────────────────────────────────────────────────────────

const priorityStyles: Record<Priority, string> = {
    High: "bg-red-500/10 text-red-600 border-red-500/20",
    Medium: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    Low: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
};

const statusStyles: Record<Status, string> = {
    Pending: "bg-muted text-muted-foreground border-border/40",
    Submitted: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    Completed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    Overdue: "bg-red-500/10 text-red-600 border-red-500/20",
};

const statusIcons: Record<Status, React.ElementType> = {
    Pending: Clock,
    Submitted: Loader2,
    Completed: CheckCircle2,
    Overdue: AlertCircle,
};

const matIcon: Record<Material["type"], React.ElementType> = {
    PDF: FileText,
    PPT: Presentation,
    Video: FileVideo,
    Link: Link2,
};

const matColor: Record<Material["type"], string> = {
    PDF: "bg-red-500/10 text-red-600",
    PPT: "bg-amber-500/10 text-amber-600",
    Video: "bg-blue-500/10 text-blue-600",
    Link: "bg-violet-500/10 text-violet-600",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const TaskDetails = () => {
    const { taskId } = useParams<{ taskId: string }>();
    const navigate = useNavigate();

    const task = allTasks.find(t => t.id === Number(taskId));

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

    const StatusIcon = statusIcons[task.status];
    const canSubmit = task.status === "Pending" || task.status === "Overdue";

    return (
        <DashboardLayout>
            <div className="animate-fade-in space-y-6 max-w-6xl mx-auto w-full px-4 md:px-6 lg:px-8 pb-10">

                {/* ── Back link ── */}
                <button
                    onClick={() => navigate("/intern/tasks")}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Tasks
                </button>

                {/* ── Main Grid: Task Details + Sidebar ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                    {/* Left Column: Context + Details */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Task Header Card */}
                        <Card className="border-border/50 shadow-sm rounded-xl overflow-hidden">
                            <CardHeader className="pb-4 px-6 pt-6 border-b border-border/10 bg-muted/5">
                                <div className="flex items-start justify-between gap-4 flex-wrap">
                                    <div className="flex-1">
                                        <CardTitle className="text-xl lg:text-2xl font-bold tracking-tight text-foreground leading-tight">
                                            {task.title}
                                        </CardTitle>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-primary/5 text-primary border-primary/10">
                                                {task.week}
                                            </Badge>
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground ml-1">
                                                <User className="w-3.5 h-3.5" />
                                                <span>Mentor: <strong className="text-foreground">{task.mentor}</strong></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant="outline" className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 ${priorityStyles[task.priority]}`}>
                                            {task.priority} Priority
                                        </Badge>
                                        <Badge variant="outline" className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 gap-1.5 ${statusStyles[task.status]}`}>
                                            <StatusIcon className="w-3.5 h-3.5" />{task.status}
                                        </Badge>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                {/* Meta Info */}
                                <div className="flex items-center gap-5 text-sm">
                                    <div className="flex items-center gap-2 text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-lg border border-border/40">
                                        <Calendar className="w-4 h-4 text-primary" />
                                        <span className={task.status === "Overdue" ? "text-red-500 font-bold" : "font-medium text-foreground"}>
                                            Deadline: {task.deadline}
                                        </span>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Detailed Description</h4>
                                    <p className="text-sm leading-relaxed text-foreground/90 font-medium">
                                        {task.description}
                                    </p>
                                </div>

                                {/* Instructions */}
                                <div className="space-y-3 bg-muted/20 rounded-2xl p-5 border border-border/40 relative overflow-hidden group">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-primary/20" />
                                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                                        Task Instructions
                                    </h4>
                                    <p className="text-sm leading-relaxed text-foreground/80">
                                        {task.instructions}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Action Buttons (Desktop) */}
                        <div className="hidden lg:flex items-center gap-3">
                            {canSubmit ? (
                                <Button
                                    className="gap-2 px-6 shadow-sm shadow-primary/20"
                                    onClick={() => navigate(`/intern/tasks/${task.id}/submit`)}
                                >
                                    <Upload className="w-4 h-4" />
                                    Submit Final Work
                                </Button>
                            ) : (
                                <Button className="gap-2 px-6" disabled>
                                    <CheckCircle2 className="w-4 h-4" />
                                    Submission {task.status}
                                </Button>
                            )}
                            <Button
                                variant="outline"
                                className="gap-2 px-6"
                                onClick={() => navigate("/intern/tasks")}
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to All Tasks
                            </Button>
                        </div>
                    </div>

                    {/* Right Column: Materials & Status Sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Materials Card */}
                        <Card className="border-border/50 shadow-sm rounded-xl overflow-hidden">
                            <CardHeader className="pb-4 px-6 pt-6 border-b border-border/10 bg-muted/5">
                                <CardTitle className="text-base font-bold flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-primary" />
                                    Reference Materials
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-5">
                                {task.materials.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-8 text-center bg-muted/10 rounded-xl border border-dashed border-border/40">
                                        <FileText className="w-8 h-8 text-muted-foreground opacity-20 mb-2" />
                                        <p className="text-xs text-muted-foreground">No materials provided for this task.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {task.materials.map((mat, i) => {
                                            const Icon = matIcon[mat.type];
                                            return (
                                                <div
                                                    key={i}
                                                    className="flex items-center gap-3 p-3 rounded-xl border border-border/40 bg-card hover:bg-muted/10 hover:border-border/80 transition-all cursor-pointer group"
                                                >
                                                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 ${matColor[mat.type]}`}>
                                                        <Icon className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-[13px] font-semibold text-foreground truncate">{mat.label}</p>
                                                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-0.5">{mat.type}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Mobile Action Buttons */}
                        <div className="flex lg:hidden flex-col gap-3">
                            {canSubmit ? (
                                <Button
                                    className="w-full gap-2 h-11"
                                    onClick={() => navigate(`/intern/tasks/${task.id}/submit`)}
                                >
                                    <Upload className="w-4 h-4" />
                                    Submit Work
                                </Button>
                            ) : (
                                <Button className="w-full gap-2 h-11" disabled>
                                    <CheckCircle2 className="w-4 h-4" />
                                    {task.status === "Submitted" ? "Work Submitted" : "Task Completed"}
                                </Button>
                            )}
                            <Button
                                variant="outline"
                                className="w-full gap-2 h-11"
                                onClick={() => navigate("/intern/tasks")}
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Tasks
                            </Button>
                        </div>
                    </div>

                </div>

            </div>
        </DashboardLayout>
    );
};

export default TaskDetails;
