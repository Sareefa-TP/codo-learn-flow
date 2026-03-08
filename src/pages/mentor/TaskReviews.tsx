import { useState, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
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
    Search, ClipboardCheck, User, Calendar, FileText, Download,
    Eye as EyeIcon, CheckCircle2, XCircle, RotateCcw, Clock, SlidersHorizontal,
    FileImage, FileVideo, Archive, File,
} from "lucide-react";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

type ReviewStatus = "Pending" | "Approved" | "Needs Revision" | "Rejected";

interface SubmittedFile {
    name: string;
    size: string;
    type: "pdf" | "doc" | "zip" | "image" | "video" | "other";
}

interface Submission {
    id: string;
    internName: string;
    internEmail: string;
    batch: string;
    taskTitle: string;
    week: string;
    submittedDate: string;
    status: ReviewStatus;
    repoLink?: string;
    liveLink?: string;
    notes?: string;
    files: SubmittedFile[];
    mentorFeedback?: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const initialSubmissions: Submission[] = [
    {
        id: "SUB-001", internName: "Aarav Singh", internEmail: "aarav.s@example.com", batch: "Full Stack - Mar 2026",
        taskTitle: "Build Login Page", week: "Week 1", submittedDate: "2026-03-02", status: "Pending",
        repoLink: "https://github.com/aarav/login-page",
        notes: "Implemented form validation and error states as per instructions.",
        files: [
            { name: "login-page.pdf", size: "1.2 MB", type: "pdf" },
            { name: "screenshot.png", size: "320 KB", type: "image" },
        ],
    },
    {
        id: "SUB-002", internName: "Priya Sharma", internEmail: "priya.s@example.com", batch: "Full Stack - Mar 2026",
        taskTitle: "API Integration", week: "Week 2", submittedDate: "2026-03-04", status: "Approved",
        repoLink: "https://github.com/priya/api-integration",
        liveLink: "https://priya-demo.vercel.app",
        mentorFeedback: "Excellent work! Clean code and well-documented endpoints.",
        files: [
            { name: "api-integration.zip", size: "4.5 MB", type: "zip" },
            { name: "demo-video.mp4", size: "18 MB", type: "video" },
        ],
    },
    {
        id: "SUB-003", internName: "Sneha Verma", internEmail: "sneha.v@example.com", batch: "Full Stack - Mar 2026",
        taskTitle: "Database Schema Design", week: "Week 1", submittedDate: "2026-03-03", status: "Needs Revision",
        notes: "Attached the ER diagram and schema SQL.",
        mentorFeedback: "The schema looks good overall, but the user_roles table needs normalization. Please revise and resubmit.",
        files: [
            { name: "schema.pdf", size: "890 KB", type: "pdf" },
            { name: "er-diagram.png", size: "450 KB", type: "image" },
        ],
    },
    {
        id: "SUB-004", internName: "Rahul Mehta", internEmail: "rahul.m@example.com", batch: "Full Stack - Mar 2026",
        taskTitle: "Setup Authentication", week: "Week 3", submittedDate: "2026-03-05", status: "Pending",
        repoLink: "https://github.com/rahul/auth-setup",
        files: [
            { name: "auth-module.zip", size: "2.8 MB", type: "zip" },
        ],
    },
    {
        id: "SUB-005", internName: "Karan Nair", internEmail: "karan.n@example.com", batch: "Full Stack - Mar 2026",
        taskTitle: "UI Mockups", week: "Week 2", submittedDate: "2026-03-04", status: "Rejected",
        notes: "Attached all Figma exports.",
        mentorFeedback: "The mockups do not follow the design system specified in the brief. Please start over with the provided component library.",
        files: [
            { name: "mockups.pdf", size: "3.2 MB", type: "pdf" },
            { name: "design-v1.png", size: "1.1 MB", type: "image" },
            { name: "design-v2.png", size: "980 KB", type: "image" },
        ],
    },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const statusStyles: Record<ReviewStatus, string> = {
    Pending: "bg-amber-500/10  text-amber-600  border-amber-500/20",
    Approved: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    "Needs Revision": "bg-blue-500/10   text-blue-600   border-blue-500/20",
    Rejected: "bg-rose-500/10   text-rose-600   border-rose-500/20",
};

const StatusIcon = ({ status }: { status: ReviewStatus }) => {
    if (status === "Approved") return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;
    if (status === "Rejected") return <XCircle className="w-3.5 h-3.5 text-rose-600" />;
    if (status === "Needs Revision") return <RotateCcw className="w-3.5 h-3.5 text-blue-600" />;
    return <Clock className="w-3.5 h-3.5 text-amber-600" />;
};

const FileIcon = ({ type }: { type: SubmittedFile["type"] }) => {
    const cls = "w-8 h-8 shrink-0";
    if (type === "pdf") return <FileText className={`${cls} text-red-500`} />;
    if (type === "image") return <FileImage className={`${cls} text-blue-500`} />;
    if (type === "video") return <FileVideo className={`${cls} text-purple-500`} />;
    if (type === "zip") return <Archive className={`${cls} text-amber-500`} />;
    return <File className={`${cls} text-muted-foreground`} />;
};

const weeks = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7", "Week 8"];
const statuses: ReviewStatus[] = ["Pending", "Approved", "Needs Revision", "Rejected"];

// ─── Page ─────────────────────────────────────────────────────────────────────

const MentorTaskReviews = () => {
    const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions);

    // Filters
    const [search, setSearch] = useState("");
    const [filterWeek, setFilterWeek] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");

    // Review modal
    const [reviewOpen, setReviewOpen] = useState(false);
    const [active, setActive] = useState<Submission | null>(null);
    const [feedback, setFeedback] = useState("");

    const filtered = useMemo(() => submissions.filter(s => {
        const q = search.toLowerCase();
        const matchSearch = s.internName.toLowerCase().includes(q) || s.taskTitle.toLowerCase().includes(q);
        const matchWeek = filterWeek === "all" || s.week === filterWeek;
        const matchStatus = filterStatus === "all" || s.status === filterStatus;
        return matchSearch && matchWeek && matchStatus;
    }), [submissions, search, filterWeek, filterStatus]);

    const openReview = (sub: Submission) => {
        setActive(sub);
        setFeedback(sub.mentorFeedback ?? "");
        setReviewOpen(true);
    };

    const applyDecision = (newStatus: ReviewStatus) => {
        if (!active) return;
        if (!feedback.trim() && newStatus !== "Approved") {
            toast.error("Please write feedback before submitting.");
            return;
        }
        setSubmissions(prev => prev.map(s =>
            s.id === active.id ? { ...s, status: newStatus, mentorFeedback: feedback } : s
        ));
        toast.success(`Submission marked as "${newStatus}"`);
        setReviewOpen(false);
    };

    const pendingCount = submissions.filter(s => s.status === "Pending").length;
    const approvedCount = submissions.filter(s => s.status === "Approved").length;

    return (
        <DashboardLayout>
            <div className="animate-fade-in space-y-6 max-w-7xl mx-auto pb-10">

                {/* ── Header ── */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Task Reviews</h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Review intern task submissions and provide feedback.
                        </p>
                    </div>
                    {/* Summary pills */}
                    <div className="flex gap-2 shrink-0">
                        <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-sm font-medium text-amber-600">
                            <Clock className="w-4 h-4" />
                            {pendingCount} Pending
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-sm font-medium text-emerald-600">
                            <CheckCircle2 className="w-4 h-4" />
                            {approvedCount} Approved
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

                            {/* Search */}
                            <div className="relative flex-1 min-w-[200px]">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input placeholder="Search by intern name or task..." className="pl-9 bg-background"
                                    value={search} onChange={e => setSearch(e.target.value)} />
                            </div>

                            {/* Week */}
                            <Select value={filterWeek} onValueChange={setFilterWeek}>
                                <SelectTrigger className="w-full sm:w-36">
                                    <SelectValue placeholder="All Weeks" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Weeks</SelectItem>
                                    {weeks.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                                </SelectContent>
                            </Select>

                            {/* Status */}
                            <Select value={filterStatus} onValueChange={setFilterStatus}>
                                <SelectTrigger className="w-full sm:w-44">
                                    <SelectValue placeholder="All Statuses" />
                                </SelectTrigger>
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
                                        <TableHead className="text-xs font-semibold">Task Title</TableHead>
                                        <TableHead className="text-xs font-semibold">Week</TableHead>
                                        <TableHead className="text-xs font-semibold">Submitted Date</TableHead>
                                        <TableHead className="text-xs font-semibold">Status</TableHead>
                                        <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filtered.length > 0 ? filtered.map(sub => (
                                        <TableRow key={sub.id} className="hover:bg-muted/10 transition-colors group">
                                            <TableCell>
                                                <div>
                                                    <p className="text-sm font-medium">{sub.internName}</p>
                                                    <p className="text-xs text-muted-foreground">{sub.internEmail}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm font-medium max-w-[180px] truncate">{sub.taskTitle}</TableCell>
                                            <TableCell className="text-sm text-muted-foreground whitespace-nowrap">{sub.week}</TableCell>
                                            <TableCell className="text-sm text-muted-foreground whitespace-nowrap">{sub.submittedDate}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1.5">
                                                    <StatusIcon status={sub.status} />
                                                    <Badge variant="outline" className={`text-[10px] font-semibold whitespace-nowrap ${statusStyles[sub.status]}`}>
                                                        {sub.status}
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    size="sm"
                                                    variant={sub.status === "Pending" ? "default" : "outline"}
                                                    className="gap-1.5 h-8 text-xs"
                                                    onClick={() => openReview(sub)}
                                                >
                                                    <ClipboardCheck className="w-3.5 h-3.5" />
                                                    {sub.status === "Pending" ? "Review" : "Re-review"}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-24 text-center text-muted-foreground text-sm">
                                                No submissions match your filters.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* ══ Review Modal ══════════════════════════════════════════════════════════ */}
                <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
                    <DialogContent className="sm:max-w-[640px] p-0 overflow-hidden border-border/50">
                        {active && (
                            <>
                                {/* Header */}
                                <DialogHeader className="pt-6 px-6 pb-4 border-b border-border/40 bg-muted/20">
                                    <div className="flex items-start justify-between gap-3">
                                        <DialogTitle className="text-xl font-bold pr-6">Review Submission</DialogTitle>
                                        <Badge variant="outline" className={`text-[10px] font-semibold shrink-0 ${statusStyles[active.status]}`}>
                                            {active.status}
                                        </Badge>
                                    </div>
                                </DialogHeader>

                                <div className="p-6 overflow-y-auto max-h-[65vh] space-y-6">

                                    {/* ── Section 1: Intern Info ── */}
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                                            <User className="w-3.5 h-3.5" /> Intern Information
                                        </p>
                                        <div className="bg-muted/20 border border-border/40 rounded-xl p-4 grid grid-cols-2 gap-y-3 gap-x-6">
                                            <div>
                                                <Label className="text-[10px] uppercase tracking-wide text-muted-foreground">Intern Name</Label>
                                                <p className="text-sm font-medium mt-0.5">{active.internName}</p>
                                            </div>
                                            <div>
                                                <Label className="text-[10px] uppercase tracking-wide text-muted-foreground">Batch</Label>
                                                <p className="text-sm font-medium mt-0.5">{active.batch}</p>
                                            </div>
                                            <div>
                                                <Label className="text-[10px] uppercase tracking-wide text-muted-foreground">Task Title</Label>
                                                <p className="text-sm font-medium mt-0.5">{active.taskTitle}</p>
                                            </div>
                                            <div>
                                                <Label className="text-[10px] uppercase tracking-wide text-muted-foreground">Week</Label>
                                                <p className="text-sm font-medium mt-0.5">{active.week}</p>
                                            </div>
                                            <div className="col-span-2 flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                                                <span className="text-xs text-muted-foreground">Submitted on</span>
                                                <span className="text-xs font-semibold">{active.submittedDate}</span>
                                            </div>
                                        </div>

                                        {/* Links */}
                                        {(active.repoLink || active.liveLink) && (
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {active.repoLink && (
                                                    <a href={active.repoLink} target="_blank" rel="noreferrer"
                                                        className="text-xs text-primary underline underline-offset-2 hover:opacity-80">
                                                        🔗 GitHub Repo
                                                    </a>
                                                )}
                                                {active.liveLink && (
                                                    <a href={active.liveLink} target="_blank" rel="noreferrer"
                                                        className="text-xs text-primary underline underline-offset-2 hover:opacity-80">
                                                        🌐 Live Demo
                                                    </a>
                                                )}
                                            </div>
                                        )}

                                        {/* Intern notes */}
                                        {active.notes && (
                                            <div className="mt-3 p-3 bg-muted/30 rounded-lg border border-border/30">
                                                <p className="text-[10px] uppercase tracking-wide font-semibold text-muted-foreground mb-1">Intern Notes</p>
                                                <p className="text-sm text-foreground">{active.notes}</p>
                                            </div>
                                        )}
                                    </div>

                                    <Separator />

                                    {/* ── Section 2: Submitted Files ── */}
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                                            <FileText className="w-3.5 h-3.5" /> Submitted Files ({active.files.length})
                                        </p>
                                        <div className="space-y-2">
                                            {active.files.map((file, idx) => (
                                                <div key={idx} className="flex items-center gap-3 p-3 rounded-xl border border-border/40 bg-muted/10 hover:bg-muted/20 transition-colors">
                                                    <FileIcon type={file.type} />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium truncate">{file.name}</p>
                                                        <p className="text-xs text-muted-foreground">{file.size}</p>
                                                    </div>
                                                    <div className="flex gap-1.5 shrink-0">
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                                                            title="Preview" onClick={() => toast.info(`Preview: ${file.name}`)}>
                                                            <EyeIcon className="w-4 h-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-emerald-600 hover:bg-emerald-500/10"
                                                            title="Download" onClick={() => toast.success(`Downloading: ${file.name}`)}>
                                                            <Download className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* ── Section 3: Mentor Feedback ── */}
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                                            Mentor Feedback
                                        </p>
                                        <Textarea
                                            placeholder="Write feedback for the intern..."
                                            rows={4}
                                            value={feedback}
                                            onChange={e => setFeedback(e.target.value)}
                                            className="resize-none"
                                        />
                                        <p className="text-[11px] text-muted-foreground mt-1.5">
                                            Feedback is required for "Request Changes" and "Reject" decisions.
                                        </p>
                                    </div>
                                </div>

                                {/* ── Footer: Review Actions ── */}
                                <DialogFooter className="p-4 border-t border-border/40 bg-muted/20">
                                    <div className="flex items-center justify-between w-full gap-2 flex-wrap">
                                        <Button variant="outline" onClick={() => setReviewOpen(false)}>
                                            Cancel
                                        </Button>
                                        <div className="flex gap-2 flex-wrap">
                                            <Button
                                                variant="outline"
                                                className="gap-1.5 border-rose-500/30 text-rose-600 hover:bg-rose-500/10 hover:text-rose-700"
                                                onClick={() => applyDecision("Rejected")}
                                            >
                                                <XCircle className="w-4 h-4" /> Reject
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="gap-1.5 border-blue-500/30 text-blue-600 hover:bg-blue-500/10 hover:text-blue-700"
                                                onClick={() => applyDecision("Needs Revision")}
                                            >
                                                <RotateCcw className="w-4 h-4" /> Request Changes
                                            </Button>
                                            <Button
                                                className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                                                onClick={() => applyDecision("Approved")}
                                            >
                                                <CheckCircle2 className="w-4 h-4" /> Approve
                                            </Button>
                                        </div>
                                    </div>
                                </DialogFooter>
                            </>
                        )}
                    </DialogContent>
                </Dialog>

            </div>
        </DashboardLayout>
    );
};

export default MentorTaskReviews;
