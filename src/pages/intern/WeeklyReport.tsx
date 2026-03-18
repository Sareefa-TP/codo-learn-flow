import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
    Clock, AlertCircle, MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

// ─── Types ────────────────────────────────────────────────────────────────────
// ... (rest of the file remains same but I'll replace the relevant parts)

// ─── Types ────────────────────────────────────────────────────────────────────

type ReportStatus = "Pending" | "Reviewed" | "Rejected";

interface WeeklyReport {
    id: number;
    week: string;
    title: string;
    submittedDate: string;
    status: ReportStatus;
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
        week: "Week 1",
        title: "Onboarding & Project Setup",
        submittedDate: "Mar 02, 2026",
        status: "Reviewed",
        mentorFeedback: "Great start! Keep up the structured approach.",
        summary: "Completed environment setup, onboarding tasks, and team introductions. Reviewed project structure and tooling.",
        challenges: "Setting up local development environment took longer than expected due to version conflicts.",
        learnings: "Learned how to configure Vite + React + TypeScript from scratch and understood the project architecture.",
        fileName: "week1-report.pdf",
    },
    {
        id: 2,
        week: "Week 2",
        title: "Frontend Component Development",
        submittedDate: "Mar 09, 2026",
        status: "Reviewed",
        mentorFeedback: "Good progress. Focus more on code reusability.",
        summary: "Built reusable UI components including Button, Card, Badge, and Table using ShadCN UI and Tailwind CSS.",
        challenges: "Struggled with prop typing in generic components. Resolved using TypeScript generics.",
        learnings: "Deepened understanding of component composition and TypeScript interface patterns.",
        fileName: "week2-components.zip",
    },
    {
        id: 3,
        week: "Week 3",
        title: "API Integration & Testing",
        submittedDate: "Mar 16, 2026",
        status: "Pending",
        mentorFeedback: "—",
        summary: "Integrated login and student-fetch REST APIs using Axios. Built a custom useApi hook.",
        challenges: "CORS errors blocked local API testing. Fixed by configuring a Vite proxy.",
        learnings: "Learned about Axios interceptors and how to handle auth tokens in API calls.",
        fileName: "",
    },
    {
        id: 4,
        week: "Week 4",
        title: "Dashboard Layout Implementation",
        submittedDate: "Mar 18, 2026",
        status: "Rejected",
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

// ─── View Report Modal ────────────────────────────────────────────────────────

interface ViewModalProps {
    report: WeeklyReport;
    onClose: () => void;
}

const ViewReportModal = ({ report, onClose }: ViewModalProps) => {
    const StatusIcon = statusIcons[report.status];

    const sections: { label: string; value: string; }[] = [
        { label: "Work Summary", value: report.summary || "—" },
        { label: "Challenges Faced", value: report.challenges || "—" },
        { label: "Learning Outcomes", value: report.learnings || "—" },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
            <div
                className="bg-background border border-border/50 rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-start justify-between p-5 border-b border-border/50 flex-shrink-0">
                    <div>
                        <h2 className="text-base font-semibold">{report.title}</h2>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {report.week} · Submitted {report.submittedDate}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground flex-shrink-0">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Scrollable Body */}
                <div className="p-5 space-y-4 overflow-y-auto flex-1">

                    {/* Week + Status row */}
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full font-medium">{report.week}</span>
                        <Badge variant="outline" className={`text-[10px] font-semibold gap-1 ${statusStyles[report.status]}`}>
                            <StatusIcon className="w-3 h-3" />{report.status}
                        </Badge>
                    </div>

                    {/* Content sections */}
                    {sections.map(sec => (
                        <div key={sec.label} className="space-y-1.5">
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{sec.label}</p>
                            <p className="text-sm leading-relaxed bg-muted/30 rounded-lg px-3 py-2.5 border border-border/30">
                                {sec.value}
                            </p>
                        </div>
                    ))}

                    {/* Attached file */}
                    <div className="space-y-1.5">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Attached File</p>
                        {report.fileName ? (
                            <div className="flex items-center gap-2 bg-muted/30 rounded-lg px-3 py-2.5 border border-border/30">
                                <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                                <span className="text-sm truncate">{report.fileName}</span>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground bg-muted/30 rounded-lg px-3 py-2.5 border border-border/30">No file attached</p>
                        )}
                    </div>

                    {/* Mentor Feedback */}
                    <div className="space-y-1.5">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                            <MessageSquare className="w-3 h-3" /> Mentor Feedback
                        </p>
                        <p className={`text-sm leading-relaxed rounded-lg px-3 py-2.5 border ${report.status === "Reviewed"
                            ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-700"
                            : report.status === "Rejected"
                                ? "bg-red-500/5 border-red-500/20 text-red-700"
                                : "bg-muted/30 border-border/30 text-muted-foreground"
                            }`}>
                            {report.mentorFeedback}
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end px-5 py-4 border-t border-border/50 flex-shrink-0">
                    <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
                </div>
            </div>
        </div>
    );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const WeeklyReport = () => {
    const navigate = useNavigate();
    const [reports, setReports] = useState<WeeklyReport[]>(initialReports);
    const [viewingReport, setViewingReport] = useState<WeeklyReport | null>(null);

    return (
        <>
            <DashboardLayout>
                <div className="animate-fade-in space-y-6 max-w-5xl mx-auto pb-10">

                    {/* ── Page Header ── */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">Weekly Reports</h1>
                            <p className="text-muted-foreground mt-1 text-sm">
                                Submit and manage your internship weekly reports.
                            </p>
                        </div>
                        <Button
                            className="gap-2 flex-shrink-0"
                            onClick={() => navigate("/intern/weekly-report/submit-weekly-report")}
                        >
                            <Plus className="w-4 h-4" />
                            Submit Weekly Report
                        </Button>
                    </div>

                    {/* ── Summary Strip ── */}
                    <div className="grid grid-cols-3 gap-4">
                        {(["Reviewed", "Pending", "Rejected"] as ReportStatus[]).map(s => {
                            const count = reports.filter(r => r.status === s).length;
                            const Icon = statusIcons[s];
                            return (
                                <Card key={s} className="border-border/50 shadow-sm rounded-xl">
                                    <CardContent className="pt-4 pb-4 flex items-center gap-3">
                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${statusStyles[s].split(" ").slice(0, 1).join(" ")}`}>
                                            <Icon className={`w-4 h-4 ${statusStyles[s].split(" ").slice(1, 2).join(" ")}`} />
                                        </div>
                                        <div>
                                            <p className="text-xl font-bold leading-tight">{count}</p>
                                            <p className="text-xs text-muted-foreground">{s}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {/* ── Reports Table ── */}
                    <Card className="border-border/50 shadow-sm rounded-xl overflow-hidden">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <FileText className="w-4 h-4 text-primary" />
                                Report History
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {reports.length === 0 ? (
                                <div className="text-center py-14 text-muted-foreground">
                                    <FileText className="w-10 h-10 mx-auto opacity-20 mb-3" />
                                    <p className="font-medium">No reports submitted yet.</p>
                                    <p className="text-xs mt-1">Click "Submit Weekly Report" to get started.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-muted/30">
                                                <TableHead className="text-xs font-semibold">Week</TableHead>
                                                <TableHead className="text-xs font-semibold">Report Title</TableHead>
                                                <TableHead className="text-xs font-semibold">Submitted Date</TableHead>
                                                <TableHead className="text-xs font-semibold">Status</TableHead>
                                                <TableHead className="text-xs font-semibold">Mentor Feedback</TableHead>
                                                <TableHead className="text-xs font-semibold text-right">Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {reports.map(report => {
                                                const StatusIcon = statusIcons[report.status];
                                                return (
                                                    <TableRow key={report.id} className="hover:bg-muted/10 transition-colors">
                                                        <TableCell className="text-sm font-medium">{report.week}</TableCell>
                                                        <TableCell className="text-sm max-w-[200px]">
                                                            <p className="truncate">{report.title}</p>
                                                        </TableCell>
                                                        <TableCell className="text-sm text-muted-foreground">{report.submittedDate}</TableCell>
                                                        <TableCell>
                                                            <Badge
                                                                variant="outline"
                                                                className={`text-[10px] font-semibold gap-1 ${statusStyles[report.status]}`}
                                                            >
                                                                <StatusIcon className="w-3 h-3" />
                                                                {report.status}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-sm text-muted-foreground max-w-[200px]">
                                                            <p className="truncate">{report.mentorFeedback}</p>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="h-7 text-xs px-2.5 gap-1.5"
                                                                onClick={() => setViewingReport(report)}
                                                            >
                                                                <Eye className="w-3 h-3" />
                                                                View Report
                                                            </Button>
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
