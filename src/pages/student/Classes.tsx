import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  User,
  Video
} from "lucide-react";

const StudentClasses = () => {
  const weeklySchedule = [
    { day: "Monday", topic: "HTML Foundations" },
    { day: "Tuesday", topic: "CSS Basics" },
    { day: "Wednesday", topic: "JavaScript DOM" },
    { day: "Thursday", topic: "React Components" },
    { day: "Friday", topic: "Python Introduction" },
  ];

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6 lg:space-y-8 max-w-5xl mx-auto">

        {/* Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">
            Live Sessions
          </h1>
          <p className="text-muted-foreground mt-2">
            Your live learning phase class schedule and upcoming sessions.
          </p>
        </div>

        {/* SECTION 1 - Upcoming Class */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Upcoming Class</h2>
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="bg-primary text-primary-foreground">Live Class</Badge>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">
                      React State Management
                    </h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5 focus-visible:outline-none">
                      <Calendar className="w-4 h-4" />
                      25 March 2026
                    </span>
                    <span className="flex items-center gap-1.5 focus-visible:outline-none">
                      <Clock className="w-4 h-4" />
                      7:00 PM – 8:30 PM
                    </span>
                    <span className="flex items-center gap-1.5 focus-visible:outline-none">
                      <User className="w-4 h-4" />
                      Mentor: Arjun
                    </span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center justify-center md:justify-end">
                  <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 w-full md:w-auto">
                    <a
                      href="https://meet.google.com/demo-class-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Video className="w-5 h-5" />
                      Join Google Meet
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* SECTION 2 - Weekly Schedule */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Weekly Schedule</h2>
            <Badge variant="outline" className="text-muted-foreground">Monday – Friday</Badge>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {weeklySchedule.map((schedule, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 hover:bg-muted/30 transition-colors gap-3 sm:gap-4"
                  >
                    <div className="flex items-center gap-4 min-w-[120px]">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Calendar className="w-5 h-5 text-primary" />
                      </div>
                      <span className="font-medium text-foreground">{schedule.day}</span>
                    </div>

                    <div className="flex-1 sm:text-right">
                      <span className="text-foreground/90 font-medium">{schedule.topic}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

      </div>
    </DashboardLayout>
  );
};

export default StudentClasses;
