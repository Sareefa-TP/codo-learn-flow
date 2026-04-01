import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Layout, Clock, PlayCircle } from "lucide-react";

interface CourseCardProps {
  title: string;
  category: string;
  duration: string;
  progress: number;
  onDetailsClick?: () => void;
  onActionClick?: () => void;
  actionText?: string;
  actionIcon?: any;
}

const CourseCard = ({
  title,
  category,
  duration,
  progress,
  onDetailsClick,
  onActionClick,
  actionText = "Resume Learning",
  actionIcon: ActionIcon = PlayCircle
}: CourseCardProps) => {
  return (
    <Card className="group overflow-hidden border-border/50 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 rounded-3xl flex flex-col h-full">
      <div className="h-32 bg-slate-100 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
        <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center relative z-10">
          <Layout className="w-6 h-6 text-primary" />
        </div>
        <Badge className="absolute top-4 right-4 bg-white/90 text-[10px] font-black uppercase text-slate-900 border-none shadow-sm backdrop-blur-sm">
          {category}
        </Badge>
      </div>
      <CardContent className="p-6 flex-1 flex flex-col space-y-6">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5 pt-1">
            <Clock className="w-3 h-3 text-primary" /> {duration} Program
          </p>
        </div>
        <div className="space-y-2 pt-2">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <span>Course Progress</span>
            <span className="text-primary">{progress}%</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
        <div className="flex items-center justify-between gap-4 pt-4 mt-auto">
          <Button 
            variant="ghost" 
            size="sm" 
            className="rounded-xl text-[10px] uppercase font-black tracking-widest text-muted-foreground hover:text-primary px-3"
            onClick={(e) => {
              e.stopPropagation();
              onDetailsClick?.();
            }}
          >
            Details
          </Button>
          <Button 
            className="bg-primary hover:bg-primary/90 gap-2 rounded-xl h-10 font-bold text-xs shadow-md shadow-primary/20"
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
