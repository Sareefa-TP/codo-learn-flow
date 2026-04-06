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
  category: string;
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
    id: "JOB-CODO-001",
    companyName: "Codo Agency",
    role: "Full Stack Developer",
    category: "Engineering",
    location: "Trivandrum (Hybrid)",
    deadline: "Apr 15, 2026",
    status: "Open",
    description: "Join our core engineering team to build and maintain high-performance web applications. You will work on both frontend and backend technologies, ensuring seamless integration and superior user experiences. This role involves collaborating with designers and product managers to deliver scalable solutions.",
    package: "₹4.5 LPA - ₹6.5 LPA",
    requirements: "• Proficiency in React, Node.js, and PostgreSQL\n• Strong understanding of RESTful APIs\n• Excellent problem-solving and communication skills\n• Minimum 6 months of internship or project experience"
  },
  {
    id: "JOB-CODO-002",
    companyName: "Codo Agency",
    role: "Mobile App Developer",
    category: "Mobile Team",
    location: "Trivandrum",
    deadline: "Apr 20, 2026",
    status: "Open",
    description: "We are looking for a passionate Mobile App Developer to join our team. You will be responsible for developing and maintaining native or cross-platform mobile applications that provide a smooth and engaging user experience across all devices.",
    package: "₹4.0 LPA - ₹6.0 LPA",
    requirements: "• Experience with Flutter or React Native\n• Understanding of mobile UI/UX principles\n• Familiarity with Firebase and mobile state management\n• Strong debugging and optimization skills"
  },
  {
    id: "JOB-CODO-003",
    companyName: "Codo Agency",
    role: "Software Tester",
    category: "Quality Assurance",
    location: "Remote",
    deadline: "Apr 10, 2026",
    status: "Open",
    description: "Ensure the quality and reliability of our software products. As a Software Tester, you will design and execute test cases, identify bugs, and collaborate with the development team to ensure a defect-free release.",
    package: "₹3.5 LPA - ₹5.0 LPA",
    requirements: "• Knowledge of manual and automated testing practices\n• Familiarity with testing tools like Selenium or Jest\n• Strong attention to detail\n• Ability to write clear and concise bug reports"
  },
  {
    id: "JOB-CODO-004",
    companyName: "Codo Agency",
    role: "UI/UX Designer",
    category: "Design Department",
    location: "Trivandrum",
    deadline: "Mar 25, 2026",
    status: "Closed",
    description: "Transform complex requirements into intuitive and beautiful designs. You will work closely with stakeholders to create wireframes, prototypes, and final high-fidelity designs for our web and mobile platforms.",
    package: "₹4.0 LPA - ₹5.5 LPA",
    requirements: "• Strong portfolio in UI/UX design\n• Proficiency in Figma or Adobe XD\n• Understanding of user-centric design principles\n• Experience with design systems is a plus"
  },
  {
    id: "JOB-CODO-005",
    companyName: "Codo Agency",
    role: "Backend Developer",
    category: "Infrastructure",
    location: "Hybrid",
    deadline: "Apr 30, 2026",
    status: "Open",
    description: "Focus on the server-side logic and database management of our applications. You will build secure, efficient, and scalable backend services that power our web and mobile experiences.",
    package: "₹4.8 LPA - ₹7.0 LPA",
    requirements: "• Deep knowledge of Node.js or Python\n• Experience with SQL and NoSQL databases\n• Understanding of cloud infrastructure (AWS/Azure)\n• Strong focus on security and performance"
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
    <Card className="border-border/50 shadow-sm rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg group border-l-4 border-l-primary/10 hover:border-l-primary bg-background/50 backdrop-blur-sm">
      <CardContent className="p-0">
        <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-all duration-300 shadow-inner border border-primary/10">
              <Building2 className="w-7 h-7 text-primary/70" />
            </div>
            
            <div className="space-y-1.5">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="font-bold text-xl leading-tight text-foreground group-hover:text-primary transition-colors">
                  {job.role}
                </h3>
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/10 font-semibold px-2 py-0 text-[10px] uppercase">
                  {job.category}
                </Badge>
              </div>
              
              <div className="flex items-center gap-x-4 gap-y-1 text-xs text-muted-foreground flex-wrap font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="text-foreground/90 font-bold">{job.companyName}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-primary/60" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-primary/60" />
                  <span>Due: {job.deadline}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between md:justify-end gap-4 shrink-0">
            <Badge className={cn("px-3 py-1 rounded-full font-bold text-[10px] flex items-center gap-1.5 border uppercase tracking-wider", getStatusStyle(job.status))}>
              {getStatusIcon(job.status)}
              {job.status}
            </Badge>

            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onViewDetails(job)}
                className="h-10 px-4 rounded-xl hover:bg-muted font-bold text-xs gap-1.5"
              >
                <Eye className="w-4 h-4" />
                Details
              </Button>
              
              {job.status === "Open" ? (
                <Button 
                  onClick={() => onApply(job.id)}
                  className="h-10 px-5 rounded-xl bg-primary hover:bg-primary/90 font-bold text-xs shadow-md shadow-primary/20"
                >
                  Apply Now
                </Button>
              ) : (
                <Button 
                  disabled 
                  variant="outline"
                  className={cn(
                    "h-10 px-5 rounded-xl font-bold text-xs",
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
        className="bg-background border border-border/50 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/50 bg-muted/5">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Opportunity Details</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Internal placement at Codo Agency
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
          
          {/* Main Info Card */}
          <div className="flex items-start gap-6 p-6 rounded-2xl bg-primary/5 border border-primary/10">
            <div className="w-20 h-20 rounded-2xl bg-background flex items-center justify-center shrink-0 shadow-sm border border-primary/10">
              <Building2 className="w-10 h-10 text-primary" />
            </div>
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-bold text-foreground leading-tight">{job.role}</h3>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-bold uppercase tracking-wider text-[10px]">
                  {job.category}
                </Badge>
              </div>
              <p className="text-lg font-bold text-primary/80">{job.companyName}</p>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-muted/30 border border-border/30 space-y-1 hover:bg-muted/40 transition-colors">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">Department</p>
              <div className="flex items-center gap-2 font-bold text-foreground">
                <Briefcase className="w-4 h-4 text-primary/70" />
                <span className="text-sm">{job.category}</span>
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-muted/30 border border-border/30 space-y-1 hover:bg-muted/40 transition-colors">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">Location</p>
              <div className="flex items-center gap-2 font-bold text-foreground">
                <MapPin className="w-4 h-4 text-primary/70" />
                <span className="text-sm">{job.location}</span>
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-muted/30 border border-border/30 space-y-1 hover:bg-muted/40 transition-colors">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">Package</p>
              <div className="flex items-center gap-2 font-bold text-foreground">
                <DollarSign className="w-4 h-4 text-primary/70" />
                <span className="text-sm">{job.package}</span>
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-muted/30 border border-border/30 space-y-1 hover:bg-muted/40 transition-colors">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">Application Deadline</p>
              <div className="flex items-center gap-2 font-bold text-foreground">
                <Calendar className="w-4 h-4 text-primary/70" />
                <span className="text-sm">{job.deadline}</span>
              </div>
            </div>
          </div>

          {/* Description Sector */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold flex items-center gap-2 text-foreground/90 uppercase tracking-wide">
              <FileText className="w-4 h-4 text-primary/70" />
              Role Description
            </h4>
            <div className="text-sm leading-relaxed text-muted-foreground bg-muted/20 p-6 rounded-2xl border border-border/30 font-medium">
              {job.description}
            </div>
          </div>

          {/* Requirements Sector */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold flex items-center gap-2 text-foreground/90 uppercase tracking-wide">
              <CheckCircle2 className="w-4 h-4 text-primary/70" />
              Requirements & Skills
            </h4>
            <div className="text-sm leading-relaxed text-muted-foreground bg-muted/20 p-6 rounded-2xl border border-border/30 whitespace-pre-line font-medium border-l-4 border-l-primary/30">
              {job.requirements}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border/50 bg-muted/5 flex items-center justify-end gap-3">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="rounded-xl px-6 font-bold hover:bg-muted"
          >
            Close
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
      job.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
    toast.success("Application submitted successfully to Codo Agency!");
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-8 max-w-6xl mx-auto px-4 md:px-6 lg:px-8 pb-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 shadow-sm border border-primary/20">
              <Briefcase className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
                Internal Placements
              </h1>
              <p className="text-muted-foreground text-sm mt-0.5 font-medium">
                Exclusive career opportunities for Codo Academy interns at Codo Agency
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filters Container */}
        <div className="space-y-6">
          {/* Global Search Bar */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search by role or department (e.g., Engineering, QA)..." 
              className="pl-12 h-14 bg-background/80 backdrop-blur-sm border-border/50 rounded-2xl shadow-sm focus-visible:ring-primary/20 transition-all text-base font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter Bar (Match Tasks UI) */}
          <div className="flex items-center gap-2 p-1.5 bg-muted/40 border border-border/40 rounded-2xl w-fit overflow-x-auto max-w-full no-scrollbar shadow-inner mt-2">
            {filters.map(filter => {
              const isActive = activeTab === filter;
              const count = getCount(filter);
              
              return (
                <button
                  key={filter}
                  onClick={() => setActiveTab(filter)}
                  className={cn(
                    "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap",
                    isActive 
                      ? "bg-background text-primary shadow-md scale-[1.02]" 
                      : "text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {filter}
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      "px-2 py-0 min-w-[22px] h-5 justify-center font-bold text-[10px] rounded-md transition-all duration-300",
                      isActive ? "bg-primary/10 text-primary border-primary/20" : "bg-muted/50 text-muted-foreground/60"
                    )}
                  >
                    {count}
                  </Badge>
                </button>
              );
            })}
          </div>
        </div>

        {/* Job Listings */}
        <div className="space-y-5">
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
            <Card className="border-dashed border-2 border-border/40 bg-muted/5 flex flex-col items-center justify-center p-16 rounded-[2.5rem] text-center animate-in fade-in zoom-in duration-500 shadow-inner">
              <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center mb-6 shadow-sm border border-border/30">
                <Search className="w-10 h-10 text-muted-foreground/40" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">No matches found</h3>
              <p className="text-muted-foreground text-sm max-w-sm mt-2 font-medium">
                We couldn't find any internal opportunities matching your criteria. Try adjusting your search or filters.
              </p>
              <Button 
                variant="outline" 
                className="mt-8 rounded-xl font-bold px-8 h-11 hover:bg-muted"
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
