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
        <div className="absolute bottom-3 left-4 z-10 flex h-12 w-12 items-center justify-center rounded-2xl border border-border/40 bg-card shadow-soft transition-transform duration-500 group-hover:scale-110 sm:static sm:left-auto sm:bottom-auto">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        {category && (
          <Badge 
            variant={categoryVariant}
            className={cn(
              "absolute right-2.5 top-2.5 max-w-[58%] truncate px-2 py-0.5 text-[9px] uppercase tracking-widest shadow-sm sm:right-3 sm:top-3 sm:max-w-[62%] sm:text-[10px]",
              categoryVariant === "default" || !categoryVariant ? "bg-card/90 text-foreground border-none backdrop-blur-sm" : ""
            )}
          >
            {category}
          </Badge>
        )}
      </div>
      <CardContent className="flex flex-1 flex-col space-y-3.5 p-4 sm:space-y-5 sm:p-5">
        <div className="space-y-1">
          {topLabel && (
            <p className="mb-1 text-[clamp(0.65rem,0.62rem+0.15vw,0.75rem)] font-bold uppercase tracking-widest text-primary">
              {topLabel}
            </p>
          )}
          <h3 className="line-clamp-2 min-h-[2.75rem] text-[clamp(1rem,0.9rem+0.45vw,1.25rem)] font-display leading-tight text-foreground transition-colors group-hover:text-primary sm:min-h-[3rem]">
            {title}
          </h3>
          {duration && (
            <p className="flex items-center gap-1.5 pt-1 text-[clamp(0.8125rem,0.78rem+0.2vw,0.9375rem)] font-medium text-muted-foreground">
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

        <div className="mt-auto flex flex-col-reverse gap-2.5 pt-2.5 lg:flex-row lg:items-center lg:justify-between sm:pt-3">
          {onDetailsClick && (
            <Button 
              variant="outline"
              size="sm" 
              className="min-h-11 w-full justify-center rounded-xl border-border/70 bg-background px-3 text-xs font-semibold uppercase tracking-widest text-foreground hover:bg-muted/50 lg:min-h-[44px] lg:w-auto"
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
              "min-h-11 w-full justify-center gap-2 rounded-xl bg-primary px-4 text-xs font-bold shadow-md shadow-primary/20 hover:bg-primary/90 lg:min-h-[44px] lg:w-auto lg:max-w-full",
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
