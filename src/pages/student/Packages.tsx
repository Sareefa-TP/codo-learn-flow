import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, PlayCircle, BookOpen, Clock, CheckCircle2, FileText, ExternalLink, Eye } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

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
      ],
      assignments: [
        {
          id: 1,
          title: "HTML Portfolio Page",
          description: "Build a simple HTML page using semantic tags.",
          instructions: "Include a header, navigation, about section, projects section, and footer. Use HTML5 semantic elements correctly.",
          dueDate: "10 March 2026"
        }
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
      ],
      assignments: []
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
      ],
      assignments: [
        {
          id: 2,
          title: "React Mini Project",
          description: "Build a todo application utilizing React hooks.",
          instructions: "The app should allow users to add, toggle, and delete tasks. Use useState and useEffect appropriately.",
          dueDate: "20 March 2026"
        }
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
      ],
      assignments: [
        {
          id: 3,
          title: "Django REST API",
          description: "Develop a standard RESTful API for a blog platform.",
          instructions: "Implement CRUD operations for posts and comments. Use Django REST Framework and proper serializers.",
          dueDate: "30 March 2026"
        }
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
  const navigate = useNavigate();
  const [openModuleId, setOpenModuleId] = useState<number | null>(1);
  const [viewingAssignmentId, setViewingAssignmentId] = useState<number | null>(null);

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

                  {/* Accordion Content (Lessons & Assignments) */}
                  {isOpen && (
                    <div className="bg-muted/10 border-t border-border/50 p-6 pl-[4.5rem] space-y-6">
                      {/* Lessons Section */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                          <PlayCircle className="w-3.5 h-3.5" />
                          Video Lessons
                        </h4>
                        <div className="space-y-1">
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

                      {/* Assignments Section */}
                      {mod.assignments && mod.assignments.length > 0 && (
                        <div className="space-y-4 pt-2">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                            <FileText className="w-3.5 h-3.5" />
                            Module Assignment
                          </h4>
                          <div className="space-y-3">
                            {mod.assignments.map((assignment) => {
                              const isViewing = viewingAssignmentId === assignment.id;

                              return (
                                <div key={assignment.id} className="space-y-3">
                                  <div
                                    className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-all ${isViewing ? "bg-primary/5 border-primary/30" : "bg-card border-border/50 hover:border-primary/20"
                                      }`}
                                  >
                                    <div className="flex items-center gap-3 mb-3 sm:mb-0">
                                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                        <FileText className="w-5 h-5" />
                                      </div>
                                      <div>
                                        <span className="text-sm font-semibold text-foreground block">
                                          {assignment.title}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                          <Clock className="w-3 h-3" />
                                          Due: {assignment.dueDate}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 text-[11px] gap-1.5"
                                        onClick={() => setViewingAssignmentId(isViewing ? null : assignment.id)}
                                      >
                                        <Eye className="w-3.5 h-3.5" />
                                        {isViewing ? "Hide" : "View Details"}
                                      </Button>
                                      <Button
                                        size="sm"
                                        className="h-8 text-[11px] gap-1.5 bg-primary hover:bg-primary/90"
                                        onClick={() => navigate(`/student/assignments?assignmentId=${assignment.id}`)}
                                      >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                        Submit
                                      </Button>
                                    </div>
                                  </div>

                                  {/* Inline Assignment Details */}
                                  {isViewing && (
                                    <div className="p-4 rounded-xl bg-muted/30 border border-border/50 animate-in fade-in slide-in-from-top-2 duration-200">
                                      <div className="space-y-3">
                                        <div>
                                          <h5 className="text-xs font-bold text-foreground mb-1">Description</h5>
                                          <p className="text-sm text-muted-foreground leading-relaxed italic">
                                            {assignment.description}
                                          </p>
                                        </div>
                                        <div>
                                          <h5 className="text-xs font-bold text-foreground mb-1">Instructions</h5>
                                          <p className="text-sm text-muted-foreground leading-relaxed">
                                            {assignment.instructions}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
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
