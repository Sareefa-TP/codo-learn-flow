import { Award, CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Milestone {
  id: string;
  title: string;
  status: "completed" | "current" | "upcoming";
  progress?: number;
}

interface CertificateRoadmapProps {
  title: string;
  milestones: Milestone[];
  className?: string;
}

const CertificateRoadmap = ({ title, milestones, className }: CertificateRoadmapProps) => {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-2">
        <Award className="w-5 h-5 text-primary" />
        <h4 className="font-medium text-foreground">{title}</h4>
      </div>
      
      <div className="relative">
        {/* Progress line */}
        <div className="absolute left-3 top-3 bottom-3 w-0.5 bg-border" />
        
        {/* Milestones */}
        <div className="space-y-4">
          {milestones.map((milestone, index) => (
            <div key={milestone.id} className="relative flex items-start gap-4 pl-0">
              {/* Icon */}
              <div className={cn(
                "relative z-10 w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all",
                milestone.status === "completed" && "bg-primary text-primary-foreground",
                milestone.status === "current" && "bg-primary/20 text-primary ring-4 ring-primary/10",
                milestone.status === "upcoming" && "bg-muted text-muted-foreground"
              )}>
                {milestone.status === "completed" ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : milestone.status === "current" ? (
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                ) : (
                  <Circle className="w-3 h-3" />
                )}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0 pt-0.5">
                <p className={cn(
                  "text-sm font-medium",
                  milestone.status === "upcoming" ? "text-muted-foreground" : "text-foreground"
                )}>
                  {milestone.title}
                </p>
                {milestone.status === "current" && milestone.progress !== undefined && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${milestone.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{milestone.progress}%</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CertificateRoadmap;
