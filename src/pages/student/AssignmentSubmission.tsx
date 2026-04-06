import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  ArrowLeft, 
  Clock, 
  FileText, 
  MessageSquare, 
  ExternalLink, 
  UploadCloud, 
  CheckCircle2, 
  GraduationCap,
  Calendar
} from "lucide-react";
import { useNavigate, useLocation, useParams, Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const StudentAssignmentSubmission = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { courseSlug, moduleSlug, sessionSlug } = useParams();
  
  // In a real app, we would fetch this by ID from the URL
  // For now, we'll use the data passed from the Packages page
  const assignment = location.state?.assignment || {
    title: "HTML Portfolio Page",
    submittedDate: "12 March 2026",
    dueDate: "10 March 2026",
    status: "Graded",
    grade: "A+",
    files: [
      { name: "portfolio_v1.zip", size: "2.4 MB" },
      { name: "design_system.pdf", size: "1.2 MB" }
    ],
    feedback: "Excellent use of semantic tags! Your portfolio layout is clean and professional."
  };

  return (
    <DashboardLayout>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto px-4 md:px-6 lg:px-8 pb-10">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 mb-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 overflow-x-auto whitespace-nowrap pb-2 no-scrollbar">
          <Link to="/student" className="flex items-center gap-1.5 hover:text-primary transition-colors">
            <Home className="w-3 h-3" />
            Dashboard
          </Link>
          <ChevronRight className="w-3 h-3 opacity-40" />
          <Link to="/student/my-course" className="hover:text-primary transition-colors">
            My Courses
          </Link>
          <ChevronRight className="w-3 h-3 opacity-40" />
          <Link to={`/student/my-course/${courseSlug}`} className="hover:text-primary transition-colors italic">
            Course
          </Link>
          <ChevronRight className="w-3 h-3 opacity-40" />
          <Link to={`/student/my-course/${courseSlug}/${moduleSlug}`} className="hover:text-primary transition-colors italic">
            Module
          </Link>
          <ChevronRight className="w-3 h-3 opacity-40" />
          <Link to={`/student/my-course/${courseSlug}/${moduleSlug}/${sessionSlug}`} className="hover:text-primary transition-colors italic">
            Session
          </Link>
          <ChevronRight className="w-3 h-3 opacity-40" />
          <span className="text-primary font-black whitespace-nowrap">
            Assignment Submission
          </span>
        </div>

        {/* Navigation & Header */}
        <div className="flex flex-col gap-6 mb-8">
          <Button 
            variant="ghost" 
            className="w-fit gap-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => navigate(`/student/my-course/${courseSlug}/${moduleSlug}/${sessionSlug}`)}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Course
          </Button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-bold uppercase tracking-widest text-[10px] px-2 py-0.5">
                  Submission Details
                </Badge>
                <div className={cn(
                  "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border",
                  assignment.status === "Graded" ? "text-green-600 bg-green-50 border-green-200" : "text-amber-600 bg-amber-50 border-amber-200"
                )}>
                  {assignment.status}
                </div>
              </div>
              <h1 className="text-3xl font-black tracking-tight text-foreground">{assignment.title}</h1>
              <p className="text-muted-foreground text-sm font-medium">Review your assessment submission status, files, and instructor feedback.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Submission Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-white border border-border/50 shadow-sm space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" /> Submitted On
                </p>
                <p className="text-lg font-bold text-foreground">{assignment.submittedDate}</p>
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">Verified by system timestamp</p>
              </div>
              <div className="p-6 rounded-2xl bg-white border border-border/50 shadow-sm space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" /> Deadline
                </p>
                <p className="text-lg font-bold text-foreground">{assignment.dueDate}</p>
                <p className={cn(
                  "text-[10px] font-bold uppercase tracking-tighter",
                  assignment.status === "Graded" ? "text-green-600" : "text-amber-600"
                )}>
                  Submission Received
                </p>
              </div>
            </div>

            {/* Submitted Attachments */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Submitted Attachments ({assignment.files?.length || 0})</h3>
                <span className="text-[10px] text-muted-foreground font-medium">Encrypted & Secured</span>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {assignment.files?.map((file: any, idx: number) => (
                  <div key={idx} className="group flex items-center justify-between p-4 rounded-2xl border border-border/50 bg-white hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                        <FileText className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{file.name}</p>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-tighter">{file.size} • PDF/ZIP</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pr-2">
                       <Button variant="ghost" size="sm" className="rounded-full gap-2 text-xs font-bold text-muted-foreground hover:text-primary hover:bg-primary/5">
                         <ExternalLink className="w-4 h-4" />
                         Preview
                       </Button>
                       <Button variant="outline" size="sm" className="rounded-full gap-2 text-xs font-bold border-primary/20 text-primary hover:bg-primary/5">
                         <UploadCloud className="w-4 h-4 rotate-180" />
                         Download
                       </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructor Evaluation / Feedback */}
            {assignment.feedback && (
              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-black text-foreground uppercase tracking-widest flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-primary" /> Instructor Evaluation
                  </h3>
                  <div className="h-[1px] flex-1 bg-border/50" />
                </div>
                <div className="p-8 rounded-3xl bg-primary/5 border border-primary/10 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                    <GraduationCap className="w-24 h-24 text-primary rotate-12" />
                  </div>
                  <p className="text-lg font-medium leading-relaxed italic text-foreground/80 relative z-10 max-w-2xl">
                    "{assignment.feedback}"
                  </p>
                  <div className="mt-8 flex items-center gap-4 relative z-10">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border-2 border-white shadow-sm font-black text-primary text-xs">
                      SJ
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">Sarah Jenkins</p>
                      <p className="text-[10px] text-muted-foreground font-medium">Head of Backend & Student Success</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-slate-950 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80">Final Grade</p>
                  <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px] uppercase font-black">Official</Badge>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black tracking-tighter">{assignment.grade || "N/A"}</span>
                  <span className="text-primary/60 font-bold text-sm tracking-widest uppercase">Result</span>
                </div>
                <div className="pt-4 space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-white/60">
                    <span>Performance</span>
                    <span className="text-primary">95%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[95%] rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl border border-border/50 bg-white space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">Submission Logic</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                  <p className="text-xs text-muted-foreground leading-relaxed">Files were successfully uploaded and scanned for malware.</p>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                  <p className="text-xs text-muted-foreground leading-relaxed">Assessment was matched with the latest curriculum version.</p>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                  <p className="text-xs text-muted-foreground leading-relaxed">Tutor evaluation complete and grade finalized.</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentAssignmentSubmission;
