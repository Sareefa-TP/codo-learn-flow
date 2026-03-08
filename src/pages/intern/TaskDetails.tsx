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
            <div className="animate-fade-in max-w-3xl mx-auto pb-10 space-y-5">

                {/* ── Back link ── */}
                <button
                    onClick={() => navigate("/intern/tasks")}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Tasks
                </button>

                {/* ── Task Header Card ── */}
                <Card className="border-border/50 shadow-sm rounded-xl">
                    <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                            <div className="flex-1">
                                <CardTitle className="text-xl leading-snug">{task.title}</CardTitle>
                                <p className="text-sm text-muted-foreground mt-1">{task.week}</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="outline" className={`text-xs font-semibold ${priorityStyles[task.priority]}`}>
                                    {task.priority}
                                </Badge>
                                <Badge variant="outline" className={`text-xs font-semibold gap-1 ${statusStyles[task.status]}`}>
                                    <StatusIcon className="w-3 h-3" />{task.status}
                                </Badge>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-0">

                        {/* Meta row */}
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" />
                                <span className={task.status === "Overdue" ? "text-red-500 font-medium" : ""}>
                                    Due {task.deadline}
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <User className="w-4 h-4" />
                                <span>Mentor: <strong className="text-foreground">{task.mentor}</strong></span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-1.5">
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Description</p>
                            <p className="text-sm leading-relaxed text-foreground">{task.description}</p>
                        </div>

                        {/* Instructions */}
                        <div className="space-y-1.5 bg-muted/40 rounded-lg p-4 border border-border/30">
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Task Instructions</p>
                            <p className="text-sm leading-relaxed">{task.instructions}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* ── Materials Card ── */}
                <Card className="border-border/50 shadow-sm rounded-xl">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold">Attached Materials</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        {task.materials.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No materials attached.</p>
                        ) : (
                            <div className="space-y-2">
                                {task.materials.map((mat, i) => {
                                    const Icon = matIcon[mat.type];
                                    return (
                                        <div
                                            key={i}
                                            className="flex items-center gap-3 p-3 rounded-lg border border-border/40 bg-card hover:bg-muted/20 transition-colors cursor-pointer"
                                        >
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${matColor[mat.type]}`}>
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{mat.label}</p>
                                                <p className="text-xs text-muted-foreground">{mat.type}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* ── Action Buttons ── */}
                <div className="flex items-center gap-3 flex-wrap">
                    {canSubmit ? (
                        <Button
                            className="gap-2"
                            onClick={() => navigate(`/intern/tasks/${task.id}/submit`)}
                        >
                            <Upload className="w-4 h-4" />
                            Submit Work
                        </Button>
                    ) : (
                        <Button className="gap-2" disabled>
                            <CheckCircle2 className="w-4 h-4" />
                            {task.status === "Submitted" ? "Already Submitted" : "Task Completed"}
                        </Button>
                    )}
                    <Button
                        variant="outline"
                        className="gap-2"
                        onClick={() => navigate("/intern/tasks")}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Tasks
                    </Button>
                </div>

            </div>
        </DashboardLayout>
    );
};

export default TaskDetails;
