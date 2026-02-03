import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video, Clock, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface NextClassCardProps {
  subject: string;
  tutor: string;
  tutorAvatar?: string;
  time: string;
  timeLabel: string;
  meetLink: string;
  className?: string;
}

const NextClassCard = ({
  subject,
  tutor,
  tutorAvatar,
  time,
  timeLabel,
  meetLink,
  className,
}: NextClassCardProps) => {
  const handleJoinMeet = () => {
    window.open(meetLink, "_blank");
  };

  return (
    <Card className={cn(
      "relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-accent/30",
      className
    )}>
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/20 rounded-full translate-y-1/2 -translate-x-1/2" />
      
      <CardContent className="relative p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left content */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary font-medium">
                <Sparkles className="w-3 h-3 mr-1" />
                Next Class
              </Badge>
              <Badge variant="outline" className="text-muted-foreground">
                {timeLabel}
              </Badge>
            </div>
            
            <div>
              <h2 className="text-xl lg:text-2xl font-semibold text-foreground mb-2">
                {subject}
              </h2>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  {tutorAvatar ? (
                    <img 
                      src={tutorAvatar} 
                      alt={tutor}
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                  <span className="text-sm">with {tutor}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">{time}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Join button */}
          <Button 
            onClick={handleJoinMeet}
            size="lg"
            className="gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] group"
          >
            <Video className="w-5 h-5" />
            <span>Join Google Meet</span>
            {/* Pulsing indicator */}
            <span className="relative flex h-2 w-2 ml-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-foreground opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-foreground"></span>
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NextClassCard;
