import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Layout, Clock, PlayCircle } from "lucide-react";


interface CourseCardProps {
  title: string;
  topLabel?: string; // Optional small label above title
  category?: string; // Top right badge
  duration?: string; // Subtitle/info
  description?: string;
  progress?: number;
  showProgress?: boolean;
  progressLabel?: string;
  icon?: any;
  onDetailsClick?: () => void;
  onActionClick?: () => void;
  detailsText?: string;
  actionText?: string;
  actionIcon?: any;
  actionClassName?: string;
  categoryVariant?: "default" | "secondary" | "destructive" | "outline";
}

const CourseCard = ({
  title,
  topLabel,
  category,
  duration,
  description,
  progress = 0,
  showProgress = true,
  progressLabel = "Course Progress",
  icon: Icon = Layout,
  onDetailsClick,
  onActionClick,
  detailsText = "Details",
  actionText = "Resume Learning",
  actionIcon: ActionIcon = PlayCircle,
  actionClassName,
  categoryVariant = "default"
}: CourseCardProps) => {
  return (
    <Card className="group overflow-hidden border-border/50 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 rounded-3xl flex flex-col h-full bg-card">
      <div className="h-24 sm:h-32 bg-slate-100 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
        <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center relative z-10 transition-transform duration-500 group-hover:scale-110">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        {category && (
          <Badge 
            variant={categoryVariant}
            className={cn(
              "absolute top-4 right-4 text-[10px] uppercase font-black tracking-widest px-2 shadow-sm",
              categoryVariant === "default" || !categoryVariant ? "bg-white/90 text-slate-900 border-none backdrop-blur-sm" : ""
            )}
          >
            {category}
          </Badge>
        )}
      </div>
      <CardContent className="p-4 sm:p-6 flex-1 flex flex-col space-y-5 sm:space-y-6">
        <div className="space-y-1">
          {topLabel && (
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">
              {topLabel}
            </p>
          )}
          <h3 className="text-lg font-bold text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-2 min-h-[3rem]">
            {title}
          </h3>
          {duration && (
            <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5 pt-1">
              <Clock className="w-3.5 h-3.5 text-primary" /> {duration}
            </p>
          )}
        </div>

        {description && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {description}
          </p>
        )}

        {showProgress && (
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <span>{progressLabel}</span>
              <span className="text-primary">{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        )}

        <div className="flex items-center justify-between gap-3 pt-4 mt-auto">
          {onDetailsClick && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="rounded-xl text-[10px] uppercase font-black tracking-widest text-muted-foreground hover:text-primary px-3"
              onClick={(e) => {
                e.stopPropagation();
                onDetailsClick();
              }}
            >
              {detailsText}
            </Button>
          )}
          <Button 
            className={cn(
              "flex-1 bg-primary hover:bg-primary/90 gap-2 rounded-xl h-10 font-bold text-xs shadow-md shadow-primary/20",
              actionClassName
            )}
            onClick={(e) => {
              e.stopPropagation();
              onActionClick?.();
            }}
          >
            {actionText} <ActionIcon className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};


export default CourseCard;
