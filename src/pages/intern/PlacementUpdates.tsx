import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Briefcase, 
  MapPin, 
  Calendar, 
  Building2, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  Eye,
  XCircle,
  X,
  DollarSign,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// --- Types ---

type JobStatus = "Open" | "Applied" | "Closed";

interface JobOpportunity {
  id: string;
  companyName: string;
  role: string;
  location: string;
  deadline: string;
  status: JobStatus;
  description: string;
  package: string;
  requirements: string;
}

// --- Mock Data ---

const initialJobs: JobOpportunity[] = [
  {
    id: "JOB-001",
    companyName: "Google",
    role: "Front-end Developer Intern",
    location: "Bangalore (Remote)",
    deadline: "Mar 30, 2026",
    status: "Open",
    description: "Join Google as a Front-end Developer Intern and work on cutting-edge features for global products. You will collaborate with senior engineers to build responsive and intuitive user interfaces. You'll gain hands-on experience with modern web technologies and contribute to projects seen by millions.",
    package: "₹45,000 - ₹60,000 per month",
    requirements: "• Proficiency in React, TypeScript, and Tailwind CSS\n• Strong problem-solving skills and algorithmic knowledge\n• Passion for building great user experiences\n• Currently pursuing a degree in Computer Science or related field"
  },
  {
    id: "JOB-002",
    companyName: "Microsoft",
    role: "Full Stack Engineer",
    location: "Hyderabad",
    deadline: "Apr 05, 2026",
    status: "Open",
    description: "Microsoft's development team is looking for a Full Stack Engineer who is passionate about building scalable cloud services. You will work on both frontend and backend components, ensuring high performance and reliability.",
    package: "₹18 LPA - ₹24 LPA",
    requirements: "• Strong experience with C#/.NET or Node.js\n• Familiarity with Azure or AWS services\n• Experience with React or Angular\n• 0-2 years of relevant industry experience"
  },
  {
    id: "JOB-003",
    companyName: "Meta",
    role: "Product Designer",
    location: "Mumbai",
    deadline: "Mar 20, 2026",
    status: "Closed",
    description: "Collaborate with cross-functional teams to design meaningful experiences for our community. You'll work on everything from visual design to interaction flows and user research.",
    package: "₹20 LPA+",
    requirements: "• Portfolio demonstrating strong UX/UI design skills\n• Proficiency in Figma or Adobe XD\n• Ability to solve complex design problems\n• Strong communication and collaboration skills"
  },
  {
    id: "JOB-004",
    companyName: "Amazon",
    role: "Software Development Engineer",
    location: "Pune",
    deadline: "Apr 15, 2026",
    status: "Applied",
    description: "Work on large-scale distributed systems and help us build the future of e-commerce. You'll be responsible for designing, developing, and deploying high-availability services.",
    package: "₹25 LPA - ₹30 LPA",
    requirements: "• Strong knowledge of Java, C++, or Python\n• Understanding of data structures and algorithms\n• Experience with AWS is a plus\n• Excellent analytical and problem-solving abilities"
  },
  {
    id: "JOB-005",
    companyName: "Netflix",
    role: "UI/UX Developer",
    location: "Remote",
    deadline: "Mar 28, 2026",
    status: "Open",
    description: "Help us create a seamless streaming experience for our global audience. You will bridge the gap between design and technical implementation, taking an active role in defining how the application looks as well as how it works.",
    package: "₹22 LPA - ₹28 LPA",
    requirements: "• Expert knowledge of HTML, CSS, and JavaScript\n• Experience with animations and micro-interactions\n• Strong attention to visual detail\n• Ability to work independently in a fast-paced environment"
  },
];

// --- Sub-components ---

const JobCard = ({ 
  job, 
  onApply,
  onViewDetails
}: { 
  job: JobOpportunity; 
  onApply: (id: string) => void;
  onViewDetails: (job: JobOpportunity) => void;
}) => {
  const getStatusStyle = (status: JobStatus) => {
    switch (status) {
      case "Open":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "Applied":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "Closed":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: JobStatus) => {
    switch (status) {
      case "Open":
        return <CheckCircle2 className="w-3 h-3" />;
      case "Applied":
        return <Clock className="w-3 h-3" />;
      case "Closed":
        return <XCircle className="w-3 h-3" />;
    }
  };

  return (
    <Card className="border-border/50 shadow-sm rounded-xl overflow-hidden transition-all duration-200 hover:shadow-md group border-l-4 border-l-primary/10 hover:border-l-primary">
      <CardContent className="p-0">
        <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors shadow-inner">
              <Building2 className="w-6 h-6 text-primary/70" />
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-lg leading-tight text-foreground group-hover:text-primary transition-colors">
                  {job.role}
                </h3>
              </div>
              
              <div className="flex items-center gap-x-4 gap-y-1 text-sm text-muted-foreground flex-wrap font-medium">
                <div className="flex items-center gap-1.5 capitalize">
                  <span className="text-foreground/80">{job.companyName}</span>
                </div>
                <div className="flex items-center gap-1.5 opacity-80">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-1.5 opacity-80">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Deadline: {job.deadline}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between md:justify-end gap-6 shrink-0">
            <Badge className={cn("px-2.5 py-0.5 rounded-full font-bold text-[10px] flex items-center gap-1.5 border uppercase tracking-wider", getStatusStyle(job.status))}>
              {getStatusIcon(job.status)}
              {job.status}
            </Badge>

            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onViewDetails(job)}
                className="h-9 px-4 rounded-xl hover:bg-muted font-bold text-xs gap-1.5"
              >
                <Eye className="w-4 h-4" />
                View Details
              </Button>
              
              {job.status === "Open" ? (
                <Button 
                  onClick={() => onApply(job.id)}
                  className="h-9 px-4 rounded-xl bg-primary hover:bg-primary/90 font-bold text-xs"
                >
                  Apply Now
                </Button>
              ) : (
                <Button 
                  disabled 
                  variant="outline"
                  className={cn(
                    "h-9 px-4 rounded-xl font-bold text-xs",
                    job.status === "Applied" ? "bg-blue-500/5 text-blue-600 border-blue-200" : "bg-muted"
                  )}
                >
                  {job.status === "Applied" ? "Applied" : "Closed"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// --- Job Details Modal ---

interface JobDetailsModalProps {
  job: JobOpportunity;
  onClose: () => void;
  onApply: (id: string) => void;
}

const JobDetailsModal = ({ job, onClose, onApply }: JobDetailsModalProps) => {
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-hidden">
      <div 
        className="bg-background border border-border/50 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/50 bg-muted/5">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Job Details</h2>
            <p className="text-sm text-muted-foreground mt-1">
              View complete information about this opportunity
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          
          {/* Main Info Card */}
          <div className="flex items-start gap-5 p-6 rounded-2xl bg-primary/5 border border-primary/10">
            <div className="w-16 h-16 rounded-2xl bg-background flex items-center justify-center shrink-0 shadow-sm border border-primary/10">
              <Building2 className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-foreground leading-tight">{job.role}</h3>
              <p className="text-lg font-semibold text-primary/80">{job.companyName}</p>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-muted/30 border border-border/30 space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Location</p>
              <div className="flex items-center gap-2 font-semibold">
                <MapPin className="w-4 h-4 text-primary/70" />
                <span className="text-sm">{job.location}</span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border border-border/30 space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Deadline</p>
              <div className="flex items-center gap-2 font-semibold">
                <Calendar className="w-4 h-4 text-primary/70" />
                <span className="text-sm">{job.deadline}</span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border border-border/30 space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Package</p>
              <div className="flex items-center gap-2 font-semibold">
                <DollarSign className="w-4 h-4 text-primary/70" />
                <span className="text-sm">{job.package}</span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border border-border/30 space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Status</p>
              <div className="flex items-center gap-2">
                <Badge className={cn(
                  "px-2.5 py-0.5 rounded-full font-bold text-[10px] border uppercase tracking-wider",
                  job.status === "Open" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                  job.status === "Applied" ? "bg-blue-500/10 text-blue-600 border-blue-500/20" :
                  "bg-red-500/10 text-red-600 border-red-500/20"
                )}>
                  {job.status}
                </Badge>
              </div>
            </div>
          </div>

          {/* Description Sector */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold flex items-center gap-2 text-foreground/80">
              <FileText className="w-4 h-4 text-primary/70" />
              Job Description
            </h4>
            <div className="text-sm leading-relaxed text-muted-foreground bg-muted/20 p-5 rounded-2xl border border-border/30">
              {job.description}
            </div>
          </div>

          {/* Requirements Sector */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold flex items-center gap-2 text-foreground/80">
              <CheckCircle2 className="w-4 h-4 text-primary/70" />
              Requirements
            </h4>
            <div className="text-sm leading-relaxed text-muted-foreground bg-muted/20 p-5 rounded-2xl border border-border/30 whitespace-pre-line">
              {job.requirements}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border/50 bg-muted/5 flex items-center justify-end gap-3">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="rounded-xl px-6 font-bold"
          >
            Cancel
          </Button>
          {job.status === "Open" && (
            <Button 
              onClick={() => {
                onApply(job.id);
                onClose();
              }}
              className="rounded-xl px-8 bg-primary hover:bg-primary/90 font-bold shadow-lg shadow-primary/20"
            >
              Apply Now
            </Button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

// --- Main Page ---

const PlacementUpdates = () => {
  const [jobs, setJobs] = useState<JobOpportunity[]>(initialJobs);
  const [activeTab, setActiveTab] = useState<JobStatus | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewingJob, setViewingJob] = useState<JobOpportunity | null>(null);

  const filters: (JobStatus | "All")[] = ["All", "Open", "Applied", "Closed"];

  const filteredJobs = jobs.filter(job => {
    const matchesTab = activeTab === "All" || job.status === activeTab;
    const matchesSearch = 
      job.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getCount = (status: JobStatus | "All") => {
    if (status === "All") return jobs.length;
    return jobs.filter(j => j.status === status).length;
  };

  const handleApply = (id: string) => {
    setJobs(prev => prev.map(job => 
      job.id === id ? { ...job, status: "Applied" } : job
    ));
    toast.success("Application submitted successfully!");
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-8 max-w-6xl mx-auto px-4 md:px-6 lg:px-8 pb-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 shadow-sm">
              <Briefcase className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
                Placement Updates
              </h1>
              <p className="text-muted-foreground text-sm mt-0.5">
                Explore job opportunities and track your applications
              </p>
            </div>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search by company or job role..." 
            className="pl-11 h-12 bg-background border-border/50 rounded-2xl shadow-sm focus-visible:ring-primary/20 transition-all text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter Bar (Match Tasks UI) */}
        <div className="flex items-center gap-2 p-1.5 bg-muted/40 border border-border/40 rounded-2xl w-fit overflow-x-auto max-w-full no-scrollbar shadow-inner">
          {filters.map(filter => {
            const isActive = activeTab === filter;
            const count = getCount(filter);
            
            return (
              <button
                key={filter}
                onClick={() => setActiveTab(filter)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 whitespace-nowrap",
                  isActive 
                    ? "bg-background text-primary shadow-sm" 
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                {filter}
                <Badge 
                  variant="secondary" 
                  className={cn(
                    "px-1.5 py-0 min-w-[20px] h-5 justify-center font-bold text-[10px] rounded-md transition-colors",
                    isActive ? "bg-primary/10 text-primary border-primary/20" : "bg-muted/50 text-muted-foreground/70"
                  )}
                >
                  {count}
                </Badge>
              </button>
            );
          })}
        </div>

        {/* Job Listings */}
        <div className="space-y-4">
          {filteredJobs.length > 0 ? (
            filteredJobs.map(job => (
              <JobCard 
                key={job.id} 
                job={job} 
                onApply={handleApply}
                onViewDetails={setViewingJob}
              />
            ))
          ) : (
            <Card className="border-dashed border-2 border-border/50 bg-muted/5 flex flex-col items-center justify-center p-12 rounded-3xl text-center animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <h3 className="text-xl font-bold text-foreground">No opportunities available</h3>
              <p className="text-muted-foreground text-sm max-w-xs mt-1">
                We couldn't find any job opportunities matching your current search or filters.
              </p>
              <Button 
                variant="outline" 
                className="mt-6 rounded-xl font-bold"
                onClick={() => { setSearchQuery(""); setActiveTab("All"); }}
              >
                Clear all filters
              </Button>
            </Card>
          )}
        </div>

        {/* Job Details Modal */}
        {viewingJob && (
          <JobDetailsModal 
            job={viewingJob} 
            onClose={() => setViewingJob(null)}
            onApply={handleApply}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default PlacementUpdates;
