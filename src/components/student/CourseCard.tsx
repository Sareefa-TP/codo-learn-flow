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
  onCardClick?: () => void;
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
  categoryVariant = "default",
  onCardClick,
}: CourseCardProps) => {
  return (
    <Card
      className="group flex h-full flex-col overflow-hidden rounded-3xl border-border/60 bg-card transition-all duration-500 hover:border-primary/20 hover:shadow-lift"
      onClick={onCardClick}
      role={onCardClick ? "button" : undefined}
      tabIndex={onCardClick ? 0 : undefined}
      onKeyDown={
        onCardClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onCardClick();
              }
            }
          : undefined
      }
    >
      <div className="relative flex h-24 items-center justify-center overflow-hidden bg-muted/40 sm:h-28">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
        <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl border border-border/40 bg-card shadow-soft transition-transform duration-500 group-hover:scale-110">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        {category && (
          <Badge 
            variant={categoryVariant}
            className={cn(
              "absolute right-3 top-3 max-w-[62%] truncate px-2 text-[10px] uppercase tracking-widest shadow-sm",
              categoryVariant === "default" || !categoryVariant ? "bg-card/90 text-foreground border-none backdrop-blur-sm" : ""
            )}
          >
            {category}
          </Badge>
        )}
      </div>
      <CardContent className="flex flex-1 flex-col space-y-4 p-4 sm:space-y-5 sm:p-5">
        <div className="space-y-1">
          {topLabel && (
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">
              {topLabel}
            </p>
          )}
          <h3 className="line-clamp-2 min-h-[2.8rem] text-xl font-display leading-tight text-foreground transition-colors group-hover:text-primary sm:min-h-[3rem]">
            {title}
          </h3>
          {duration && (
            <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5 pt-1">
              <Clock className="w-3.5 h-3.5 text-primary" /> {duration}
            </p>
          )}
        </div>

        {description && (
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}

        {showProgress && (
          <div className="space-y-2 pt-1">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <span>{progressLabel}</span>
              <span className="text-primary">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <div className="mt-auto flex flex-col-reverse gap-2 pt-3 sm:flex-row sm:items-center sm:justify-between">
          {onDetailsClick && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="justify-start rounded-xl px-2 text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary sm:justify-center"
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
              "h-10 w-full gap-2 rounded-xl bg-primary text-xs font-bold shadow-md shadow-primary/20 hover:bg-primary/90 sm:h-11 sm:w-auto sm:min-w-[160px]",
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
