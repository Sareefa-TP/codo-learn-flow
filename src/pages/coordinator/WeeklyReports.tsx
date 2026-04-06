import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
    Search, SlidersHorizontal, Eye, CheckCircle2, RotateCcw, Clock,
    AlertCircle, User, Calendar, FileText, Download, BookOpen,
    Lightbulb, Layers, Paperclip,
} from "lucide-react";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

type ReportStatus = "Pending" | "Approved" | "Needs Revision";

interface ReportFile {
    name: string;
    size: string;
}

interface WeeklyReport {
    id: string;
    internName: string;
    internEmail: string;
    batch: string;
    week: string;
    submittedDate: string;
    status: ReportStatus;
    // report content
    reportTitle: string;
    workSummary: string;
    challengesFaced: string;
    learningOutcomes: string;
    files: ReportFile[];
    coordinatorFeedback?: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const initialReports: WeeklyReport[] = [
    {
        id: "RPT-001", internName: "Aarav Singh", internEmail: "aarav.s@example.com", batch: "Full Stack - Mar 2026",
        week: "Week 1", submittedDate: "2026-03-02", status: "Pending",
        reportTitle: "Week 1 Progress Report",
        workSummary: "This week I focused on setting up the development environment, understanding the project structure, and completing the login page task. I also attended the kickoff meeting and reviewed the coding guidelines.",
        challengesFaced: "I faced some difficulty configuring the Vite build settings with custom path aliases. Took some time to understand the tsconfig.json file structure.",
        learningOutcomes: "Learned how to structure a React project with Shadcn UI components, understood TypeScript path aliases, and got a good grasp of the Tailwind CSS utility-first methodology.",
        files: [
            { name: "week1-progress.pdf", size: "1.2 MB" },
            { name: "login-screenshot.png", size: "320 KB" },
        ],
    },
    {
        id: "RPT-002", internName: "Priya Sharma", internEmail: "priya.s@example.com", batch: "Full Stack - Mar 2026",
        week: "Week 2", submittedDate: "2026-03-04", status: "Approved",
        reportTitle: "API Integration - Week 2",
        workSummary: "Completed the REST API integration for user authentication and profile management endpoints. Tested all endpoints using Postman and wrote documentation.",
        challengesFaced: "Handling async state updates with race conditions was tricky. Resolved it using AbortController for request cancellation.",
        learningOutcomes: "Deepened understanding of React Query for server state management, learned error boundary patterns, and practiced writing clean async/await code.",
        files: [],
        coordinatorFeedback: "Excellent work Priya! Clean code and well-documented. Keep it up.",
    },
    {
        id: "RPT-003", internName: "Sneha Verma", internEmail: "sneha.v@example.com", batch: "Full Stack - Mar 2026",
        week: "Week 1", submittedDate: "2026-03-03", status: "Needs Revision",
        reportTitle: "Database Schema - Week 1",
        workSummary: "Designed the initial database schema including user, role, and session tables.",
        challengesFaced: "Unsure about normalization requirements for the role_permissions table.",
        learningOutcomes: "Practiced ER diagram design and SQL schema writing.",
        files: [{ name: "schema-v1.pdf", size: "890 KB" }],
        coordinatorFeedback: "Good start Sneha! The report needs more detail in the Work Summary section. Also please elaborate on what specific challenges you resolved, not just what was unclear.",
    },
    {
        id: "RPT-004", internName: "Rahul Mehta", internEmail: "rahul.m@example.com", batch: "Full Stack - Mar 2026",
        week: "Week 3", submittedDate: "2026-03-05", status: "Pending",
        reportTitle: "Auth Setup Progress",
        workSummary: "Started implementing JWT-based authentication middleware for the backend API.",
        challengesFaced: "Struggled with token refresh logic on the frontend side.",
        learningOutcomes: "Learned about JWT expiry handling, refresh token patterns, and secure storage strategies.",
        files: [{ name: "auth-notes.docx", size: "540 KB" }],
    },
    {
        id: "RPT-005", internName: "Karan Nair", internEmail: "karan.n@example.com", batch: "Full Stack - Mar 2026",
        week: "Week 2", submittedDate: "2026-03-04", status: "Pending",
        reportTitle: "UI Design Week 2",
        workSummary: "Created high-fidelity wireframes for the dashboard and profile screens. Participated in design review session with the team.",
        challengesFaced: "Maintaining design consistency across different screen sizes was challenging.",
        learningOutcomes: "Improved Figma skills, learned about responsive design breakpoints and layout grid systems.",
        files: [
            { name: "wireframes.pdf", size: "3.2 MB" },
            { name: "design-system.pdf", size: "1.8 MB" },
        ],
    },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const statusStyles: Record<ReportStatus, string> = {
    Pending: "bg-amber-500/10  text-amber-600  border-amber-500/20",
    Approved: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    "Needs Revision": "bg-blue-500/10   text-blue-600   border-blue-500/20",
};

const StatusIcon = ({ status }: { status: ReportStatus }) => {
    if (status === "Approved") return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;
    if (status === "Needs Revision") return <AlertCircle className="w-3.5 h-3.5 text-blue-600" />;
    return <Clock className="w-3.5 h-3.5 text-amber-600" />;
};

const weeks = Array.from({ length: 8 }, (_, i) => `Week ${i + 1}`);
const statuses: ReportStatus[] = ["Pending", "Approved", "Needs Revision"];

// ─── Read-Only Field ──────────────────────────────────────────────────────────

const ReadField = ({ icon: Icon, label, children }: { icon: React.ElementType; label: string; children: React.ReactNode }) => (
    <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Icon className="w-3.5 h-3.5" /> {label}
        </p>
        <div className="bg-muted/20 border border-border/30 rounded-xl p-4 text-sm text-foreground leading-relaxed whitespace-pre-wrap">
            {children || <span className="text-muted-foreground italic">Not provided.</span>}
        </div>
    </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

const CoordinatorWeeklyReports = () => {
    const [reports, setReports] = useState<WeeklyReport[]>(initialReports);

    // Filters
    const [search, setSearch] = useState("");
    const [filterWeek, setFilterWeek] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");

    // Review modal
    const [reviewOpen, setReviewOpen] = useState(false);
    const [active, setActive] = useState<WeeklyReport | null>(null);
    const [feedback, setFeedback] = useState("");

    const filtered = useMemo(() => reports.filter(r => {
        const q = search.toLowerCase();
        const matchSearch = r.internName.toLowerCase().includes(q) || r.reportTitle.toLowerCase().includes(q);
        const matchWeek = filterWeek === "all" || r.week === filterWeek;
        const matchStatus = filterStatus === "all" || r.status === filterStatus;
        return matchSearch && matchWeek && matchStatus;
    }), [reports, search, filterWeek, filterStatus]);

    const pendingCount = reports.filter(r => r.status === "Pending").length;
    const approvedCount = reports.filter(r => r.status === "Approved").length;

    const openReview = (report: WeeklyReport) => {
        setActive(report);
        setFeedback(report.coordinatorFeedback ?? "");
        setReviewOpen(true);
    };

    const applyDecision = (newStatus: ReportStatus) => {
        if (!active) return;
        if (!feedback.trim() && newStatus === "Needs Revision") {
            toast.error("Please write feedback before requesting a revision."); return;
        }
        setReports(prev => prev.map(r =>
            r.id === active.id ? { ...r, status: newStatus, coordinatorFeedback: feedback } : r
        ));
        toast.success(`Report marked as "${newStatus}"`);
        setReviewOpen(false);
    };

    return (
        <div className="animate-fade-in space-y-6 max-w-6xl mx-auto px-4 md:px-6 lg:px-8 pb-10">

            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Weekly Reports</h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Review and approve intern weekly progress reports.
                    </p>
                </div>
                <div className="flex gap-2 shrink-0">
                    <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-sm font-medium text-amber-600">
                        <Clock className="w-4 h-4" /> {pendingCount} Pending
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-sm font-medium text-emerald-600">
                        <CheckCircle2 className="w-4 h-4" /> {approvedCount} Approved
                    </div>
                </div>
            </div>

            {/* ── Filters ── */}
            <Card className="border-border/50 shadow-sm rounded-xl">
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                        <div className="flex items-center gap-2 text-muted-foreground shrink-0">
                            <SlidersHorizontal className="w-4 h-4" />
                            <span className="text-sm font-medium">Filters</span>
                        </div>
                        <Separator orientation="vertical" className="hidden sm:block h-5" />
                        <div className="relative flex-1 min-w-[200px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input placeholder="Search by intern name or report title..." className="pl-9 bg-background"
                                value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                        <Select value={filterWeek} onValueChange={setFilterWeek}>
                            <SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="All Weeks" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Weeks</SelectItem>
                                {weeks.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger className="w-full sm:w-44"><SelectValue placeholder="All Statuses" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                {statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        {(search || filterWeek !== "all" || filterStatus !== "all") && (
                            <Button variant="ghost" size="sm" className="text-muted-foreground"
                                onClick={() => { setSearch(""); setFilterWeek("all"); setFilterStatus("all"); }}>
                                Clear
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* ── Table ── */}
            <Card className="border-border/50 shadow-sm rounded-xl overflow-hidden">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/30">
                                    <TableHead className="text-xs font-semibold">Intern Name</TableHead>
                                    <TableHead className="text-xs font-semibold">Report Title</TableHead>
                                    <TableHead className="text-xs font-semibold">Week</TableHead>
                                    <TableHead className="text-xs font-semibold">Submitted Date</TableHead>
                                    <TableHead className="text-xs font-semibold">Status</TableHead>
                                    <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.length > 0 ? filtered.map(report => (
                                    <TableRow key={report.id} className="hover:bg-muted/10 transition-colors group">
                                        <TableCell>
                                            <div>
                                                <p className="text-sm font-medium">{report.internName}</p>
                                                <p className="text-xs text-muted-foreground">{report.internEmail}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm font-medium max-w-[200px] truncate">{report.reportTitle}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">{report.week}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">{report.submittedDate}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1.5">
                                                <StatusIcon status={report.status} />
                                                <Badge variant="outline" className={`text-[10px] font-semibold whitespace-nowrap ${statusStyles[report.status]}`}>
                                                    {report.status}
                                                </Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                size="sm"
                                                variant={report.status === "Pending" ? "default" : "outline"}
                                                className="gap-1.5 h-8 text-xs"
                                                onClick={() => openReview(report)}
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                                {report.status === "Pending" ? "View Report" : "Re-review"}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center text-muted-foreground text-sm">
                                            No reports match your filters.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* ══ Review Weekly Report Modal ════════════════════════════════════════════ */}
            <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
                <DialogContent className="sm:max-w-[680px] p-0 overflow-hidden border-border/50">
                    {active && (
                        <>
                            {/* Modal Header */}
                            <DialogHeader className="pt-6 px-6 pb-4 border-b border-border/40 bg-muted/20">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <DialogTitle className="text-xl font-bold">Review Weekly Report</DialogTitle>
                                        <p className="text-sm text-muted-foreground mt-0.5">{active.reportTitle}</p>
                                    </div>
                                    <Badge variant="outline" className={`text-[10px] font-semibold shrink-0 mt-1 ${statusStyles[active.status]}`}>
                                        {active.status}
                                    </Badge>
                                </div>
                            </DialogHeader>

                            <div className="overflow-y-auto max-h-[70vh] divide-y divide-border/30">

                                {/* ── SECTION 1: Intern Information ── */}
                                <div className="px-6 py-5 space-y-4">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                        <User className="w-3.5 h-3.5" /> Intern Information
                                    </p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <Label className="text-[10px] uppercase tracking-wide text-muted-foreground">Intern Name</Label>
                                            <p className="text-sm font-medium">{active.internName}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-[10px] uppercase tracking-wide text-muted-foreground">Batch</Label>
                                            <p className="text-sm font-medium">{active.batch}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-[10px] uppercase tracking-wide text-muted-foreground">Week</Label>
                                            <p className="text-sm font-medium">{active.week}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-[10px] uppercase tracking-wide text-muted-foreground">Submitted Date</Label>
                                            <p className="text-sm font-medium flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                                                {active.submittedDate}
                                            </p>
                                        </div>
                                        <div className="space-y-1 col-span-2">
                                            <Label className="text-[10px] uppercase tracking-wide text-muted-foreground">Report Status</Label>
                                            <div className="flex items-center gap-1.5">
                                                <StatusIcon status={active.status} />
                                                <Badge variant="outline" className={`text-[10px] font-semibold ${statusStyles[active.status]}`}>
                                                    {active.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* ── SECTION 2: Intern Weekly Report ── */}
                                <div className="px-6 py-5 space-y-4">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                        <FileText className="w-3.5 h-3.5" /> Intern Weekly Report <span className="text-[10px] normal-case font-normal">(read-only)</span>
                                    </p>

                                    <ReadField icon={Layers} label="Report Title">
                                        {active.reportTitle}
                                    </ReadField>

                                    <ReadField icon={BookOpen} label="Work Summary">
                                        {active.workSummary}
                                    </ReadField>

                                    <ReadField icon={AlertCircle} label="Challenges Faced">
                                        {active.challengesFaced}
                                    </ReadField>

                                    <ReadField icon={Lightbulb} label="Learning Outcomes">
                                        {active.learningOutcomes}
                                    </ReadField>
                                </div>

                                {/* ── SECTION 3: Attachments ── */}
                                <div className="px-6 py-5 space-y-4">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                        <Paperclip className="w-3.5 h-3.5" /> Attachments
                                    </p>

                                    {active.files.length > 0 ? (
                                        <div className="space-y-2">
                                            {active.files.map((file, idx) => (
                                                <div key={idx} className="flex items-center gap-3 p-3 rounded-xl border border-border/40 bg-muted/10 hover:bg-muted/20 transition-colors">
                                                    <FileText className="w-8 h-8 text-primary/60 shrink-0" />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium truncate">{file.name}</p>
                                                        <p className="text-xs text-muted-foreground">{file.size}</p>
                                                    </div>
                                                    <div className="flex gap-1.5 shrink-0">
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary hover:bg-primary/10"
                                                            title="View" onClick={() => toast.info(`Viewing: ${file.name}`)}>
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-emerald-600 hover:bg-emerald-500/10"
                                                            title="Download" onClick={() => toast.success(`Downloading: ${file.name}`)}>
                                                            <Download className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground py-3">
                                            <Paperclip className="w-4 h-4 opacity-40" />
                                            No attachments provided.
                                        </div>
                                    )}
                                </div>

                                {/* ── SECTION 4: Coordinator Feedback ── */}
                                <div className="px-6 py-5 space-y-3">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Coordinator Feedback
                                    </p>
                                    <Textarea
                                        placeholder="Write feedback for the intern..."
                                        rows={5}
                                        value={feedback}
                                        onChange={e => setFeedback(e.target.value)}
                                        className="resize-none"
                                    />
                                    <p className="text-[11px] text-muted-foreground">
                                        Feedback is required when requesting a revision.
                                    </p>
                                </div>
                            </div>

                            {/* ── SECTION 5: Review Actions Footer ── */}
                            <DialogFooter className="p-4 border-t border-border/40 bg-muted/20">
                                <div className="flex items-center justify-between w-full gap-2 flex-wrap">
                                    <Button variant="outline" onClick={() => setReviewOpen(false)}>
                                        Cancel
                                    </Button>
                                    <div className="flex gap-2 flex-wrap">
                                        <Button
                                            variant="outline"
                                            className="gap-1.5 border-orange-500/30 text-orange-600 hover:bg-orange-500/10 hover:text-orange-700 hover:border-orange-500/50"
                                            onClick={() => applyDecision("Needs Revision")}
                                        >
                                            <RotateCcw className="w-4 h-4" />
                                            Request Revision
                                        </Button>
                                        <Button
                                            className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                                            onClick={() => applyDecision("Approved")}
                                        >
                                            <CheckCircle2 className="w-4 h-4" />
                                            Approve Report
                                        </Button>
                                    </div>
                                </div>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>

        </div>
    );
};

export default CoordinatorWeeklyReports;
