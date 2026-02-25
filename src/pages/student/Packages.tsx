import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, PlayCircle, BookOpen, Clock, CheckCircle2 } from "lucide-react";
import { useState } from "react";

// Mock Data
const courseData = {
  title: "Full Stack Development",
  duration: "3 Months",
  status: "Active",
  progress: 35,
  modules: [
    {
      id: 1,
      title: "Module 1: HTML Foundations",
      progress: 100,
      lessons: [
        "Introduction to HTML",
        "Tags & Structure",
        "Forms",
        "Semantic HTML"
      ]
    },
    {
      id: 2,
      title: "Module 2: CSS & Responsive Design",
      progress: 80,
      lessons: [
        "CSS Basics",
        "Flexbox",
        "Grid",
        "Responsive Layout"
      ]
    },
    {
      id: 3,
      title: "Module 3: JavaScript Fundamentals",
      progress: 50,
      lessons: [
        "Variables & Functions",
        "DOM Manipulation",
        "Events",
        "ES6"
      ]
    },
    {
      id: 4,
      title: "Module 4: React Development",
      progress: 20,
      lessons: [
        "Components",
        "State & Props",
        "Routing",
        "API Integration"
      ]
    },
    {
      id: 5,
      title: "Module 5: Python Backend",
      progress: 0,
      lessons: [
        "Python Basics",
        "OOP",
        "File Handling"
      ]
    },
    {
      id: 6,
      title: "Module 6: Django Framework",
      progress: 0,
      lessons: [
        "Django Setup",
        "Models & Migrations",
        "Views & Templates",
        "REST API"
      ]
    },
    {
      id: 7,
      title: "Module 7: Database",
      progress: 0,
      lessons: [
        "SQL Basics",
        "PostgreSQL",
        "ORM"
      ]
    },
    {
      id: 8,
      title: "Module 8: Internship Phase",
      progress: -1, // representing Not Started visually
      lessons: [
        "Real-world Project",
        "Mentor Assigned",
        "Weekly Reviews",
        "Final Deployment"
      ]
    }
  ]
};

const StudentPackages = () => {
  const [openModuleId, setOpenModuleId] = useState<number | null>(1);

  const toggleModule = (id: number) => {
    setOpenModuleId(openModuleId === id ? null : id);
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6 lg:space-y-8 max-w-5xl mx-auto">

        {/* Course Header Section */}
        <Card className="border-primary/20 bg-card overflow-hidden">
          <div className="bg-primary/5 p-6 border-b border-primary/10">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                    {courseData.title}
                  </h1>
                  <Badge variant="default" className="bg-primary text-primary-foreground">
                    {courseData.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                  <span className="flex items-center gap-1.5 focus-visible:outline-none">
                    <Clock className="w-4 h-4" />
                    Duration: {courseData.duration}
                  </span>
                  <span className="flex items-center gap-1.5 focus-visible:outline-none">
                    <BookOpen className="w-4 h-4" />
                    {courseData.modules.length} Modules
                  </span>
                </div>
              </div>
            </div>
          </div>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">Overall Course Progress</span>
                <span className="font-bold text-primary">{courseData.progress}%</span>
              </div>
              <Progress value={courseData.progress} className="h-2.5 w-full bg-secondary" />
            </div>
          </CardContent>
        </Card>

        {/* Modules Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground mb-4">Course Content</h2>

          <div className="flex flex-col gap-3">
            {courseData.modules.map((mod) => {
              const isOpen = openModuleId === mod.id;
              const isNotStarted = mod.progress === -1;
              const isCompleted = mod.progress === 100;

              return (
                <Card
                  key={mod.id}
                  className={`overflow-hidden transition-colors border ${isOpen ? "border-primary/30 ring-1 ring-primary/20" : "border-border/50 hover:border-border"
                    }`}
                >
                  {/* Accordion Header */}
                  <div
                    onClick={() => toggleModule(mod.id)}
                    className="p-4 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isCompleted
                          ? "bg-primary/10 text-primary"
                          : isNotStarted
                            ? "bg-muted text-muted-foreground"
                            : "bg-primary/5 text-primary/70"
                        }`}>
                        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <BookOpen className="w-4 h-4" />}
                      </div>
                      <h3 className={`font-medium ${isOpen ? "text-foreground" : "text-foreground/90"}`}>
                        {mod.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6 pl-11 sm:pl-0">
                      <div className="flex items-center gap-3 min-w-32">
                        {isNotStarted ? (
                          <span className="text-sm font-medium text-muted-foreground w-full text-right">Not Started</span>
                        ) : (
                          <div className="flex items-center gap-2 w-full">
                            <Progress value={mod.progress} className="h-1.5 flex-1" />
                            <span className="text-sm font-medium w-10 text-right">{mod.progress}%</span>
                          </div>
                        )}
                      </div>

                      <button className="text-muted-foreground hover:text-foreground p-1 transition-colors">
                        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Accordion Content (Lessons) */}
                  {isOpen && (
                    <div className="bg-muted/10 border-t border-border/50 p-4 pl-[4.5rem]">
                      <div className="space-y-2">
                        {mod.lessons.map((lesson, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-2.5 rounded-md hover:bg-muted/50 transition-colors group cursor-pointer"
                          >
                            <PlayCircle className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">
                              {lesson}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default StudentPackages;
