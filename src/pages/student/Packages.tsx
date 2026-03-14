import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronDown, ChevronUp, PlayCircle, BookOpen, Clock, CheckCircle2, FileText, Eye, UploadCloud, X, Info, Play, ArrowLeft, Search } from "lucide-react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Mock Data Array
const coursesData = [
  {
    id: 1,
    title: "Full Stack Development",
    category: "Web Development",
    duration: "3 Months",
    status: "Active",
    progress: 35,
    modules: [
      {
        id: 1,
        title: "Module 1: HTML Foundations",
        progress: 100,
        lessons: ["Introduction to HTML", "Tags & Structure", "Forms", "Semantic HTML"],
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
        lessons: ["CSS Basics", "Flexbox", "Grid", "Responsive Layout"],
        assignments: []
      },
      {
        id: 3,
        title: "Module 3: JavaScript Fundamentals",
        progress: 50,
        lessons: ["Variables & Functions", "DOM Manipulation", "Events", "ES6"]
      },
      {
        id: 4,
        title: "Module 4: React Development",
        progress: 20,
        lessons: ["Components", "State & Props", "Routing", "API Integration"],
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
        lessons: ["Python Basics", "OOP", "File Handling"]
      },
      {
        id: 6,
        title: "Module 6: Django Framework",
        progress: 0,
        lessons: ["Django Setup", "Models & Migrations", "Views & Templates", "REST API"],
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
        lessons: ["SQL Basics", "PostgreSQL", "ORM"]
      },
      {
        id: 8,
        title: "Module 8: Internship Phase",
        progress: -1,
        lessons: ["Real-world Project", "Mentor Assigned", "Weekly Reviews", "Final Deployment"]
      }
    ],
    description: "Master both frontend and backend development in this comprehensive 3-month bootcamp designed to take you from beginner to job-ready.",
    mentor: "Sarah Jenkins",
    requirements: [
      "Basic computer knowledge",
      "Internet connection",
      "No prior coding experience required"
    ],
    outcomes: [
      "Skills students will gain after completing the course",
      "Real-world project experience",
      "Job-ready development skills"
    ]
  },
  {
    id: 2,
    title: "Python Backend Development",
    category: "Software Engineering",
    duration: "2 Months",
    status: "Upcoming",
    progress: 0,
    modules: [
      { id: 11, title: "Module 1: Python Advanced Basics", progress: 0, lessons: [], assignments: [] },
      { id: 12, title: "Module 2: RESTful Services", progress: -1, lessons: [], assignments: [] }
    ],
    description: "Dive deep into robust backend services using Python, FastAPI, and advanced database modeling.",
    mentor: "Arjun Mehta",
    requirements: [
      "Basic programming concepts",
      "Familiarity with command line"
    ],
    outcomes: [
      "Build scalable REST APIs",
      "Manage SQL and NoSQL databases",
      "Deploy services to production"
    ]
  },
  {
    id: 3,
    title: "UI/UX Design Masterclass",
    category: "Design",
    duration: "4 Weeks",
    status: "Enrolled",
    progress: 15,
    modules: [
      { id: 21, title: "Module 1: Design Thinking", progress: 100, lessons: ["Empathy Maps", "User Personas"], assignments: [] },
      { id: 22, title: "Module 2: Figma Fundamentals", progress: 10, lessons: ["Auto Layout", "Prototyping"], assignments: [] }
    ],
    description: "Learn modern design principles and master Figma to create stunning user interfaces and experiences.",
    mentor: "Elena Rodriguez",
    requirements: [
      "Creative mindset",
      "Interest in user psychology"
    ],
    outcomes: [
      "Design high-fidelity mockups",
      "Create interactive prototypes",
      "Understand accessibility standards"
    ]
  }
];

const StudentPackages = () => {
  // View State Management
  const [activeCourseId, setActiveCourseId] = useState<number | null>(null);
  const [viewingCourseDetailsId, setViewingCourseDetailsId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Specific Module State
  const [openModuleId, setOpenModuleId] = useState<number | null>(null);
  const [viewingAssignmentId, setViewingAssignmentId] = useState<number | null>(null);

  // File Upload State for Inline Submission
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [submittedAssignments, setSubmittedAssignments] = useState<number[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Computed Courses
  const activeCourse = coursesData.find(c => c.id === activeCourseId);
  const detailsCourse = coursesData.find(c => c.id === viewingCourseDetailsId);

  const toggleModule = (id: number) => {
    setOpenModuleId(openModuleId === id ? null : id);
  };

  // Drag and Drop Handlers
  const processFiles = (files: FileList | File[]) => {
    setUploadError(null);
    const newFiles = Array.from(files);

    // Check sizes
    const invalidSize = newFiles.some(file => file.size > 20 * 1024 * 1024);
    if (invalidSize) {
      setUploadError("One or more files exceed the 20MB limit.");
      return;
    }

    setSelectedFiles(prev => {
      const combined = [...prev, ...newFiles];
      if (combined.length > 5) {
        setUploadError("You can only upload a maximum of 5 files.");
        return prev;
      }
      return combined;
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
    if (inputRef.current) inputRef.current.value = "";
  };

  const removeFile = (indexToRemove: number) => {
    setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    setUploadError(null);
  };

  const handleSubmit = (assignmentId: number) => {
    // In a real app, send data to backend here
    setTimeout(() => {
      setSubmittedAssignments(prev => [...prev, assignmentId]);
      setSelectedFiles([]);
      setUploadError(null);
    }, 500); // simulate brief upload delay
  };

  const handleOpenSubmitUI = (assignmentId: number) => {
    if (viewingAssignmentId !== assignmentId) {
      setViewingAssignmentId(assignmentId);
      setSelectedFiles([]); // clear any previous file selection
      setUploadError(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6 lg:space-y-8 max-w-5xl mx-auto">

        {/* Course List View (Step 1) */}
        {!activeCourseId && (
          <div className="space-y-6">
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">
                  My Courses
                </h1>
                <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                  View and manage your active enrollments and learning paths.
                </p>
              </div>

              <div className="relative max-w-md group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="w-full bg-card border border-border rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {coursesData.filter(course =>
              course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              course.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
              course.mentor.toLowerCase().includes(searchQuery.toLowerCase())
            ).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {coursesData
                  .filter(course =>
                    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    course.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    course.mentor.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((course) => (
                    <Card key={course.id} className="flex flex-col border-border/50 hover:border-primary/20 transition-colors shadow-sm hover:shadow-md">
                      <div className="bg-primary/5 p-5 border-b border-primary/10">
                        <div className="flex justify-between items-start mb-3 gap-2">
                          <h3 className="font-semibold text-lg leading-tight line-clamp-2">{course.title}</h3>
                          <Badge variant={course.status === 'Active' ? 'default' : 'secondary'} className={course.status === 'Active' ? 'bg-primary text-primary-foreground' : ''}>
                            {course.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
                          {course.description}
                        </p>
                      </div>
                      <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-5">
                        <div>
                          <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="bg-muted/30 p-2.5 rounded-lg border flex items-center gap-2">
                              <Clock className="w-3.5 h-3.5 text-primary" />
                              <div className="flex flex-col">
                                <span className="text-[10px] text-muted-foreground font-medium uppercase leading-none mb-1">Duration</span>
                                <span className="text-xs font-semibold leading-none">{course.duration}</span>
                              </div>
                            </div>
                            <div className="bg-muted/30 p-2.5 rounded-lg border flex items-center gap-2">
                              <BookOpen className="w-3.5 h-3.5 text-primary" />
                              <div className="flex flex-col">
                                <span className="text-[10px] text-muted-foreground font-medium uppercase leading-none mb-1">Modules</span>
                                <span className="text-xs font-semibold leading-none">{course.modules.length}</span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-medium text-foreground">Course Progress</span>
                              <span className="font-bold text-primary">{course.progress}%</span>
                            </div>
                            <Progress value={course.progress} className="h-2 w-full bg-secondary" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-xs gap-1.5"
                            onClick={() => setViewingCourseDetailsId(course.id)}
                          >
                            <Info className="w-3.5 h-3.5" />
                            Details
                          </Button>
                          <Button
                            size="sm"
                            className="w-full text-xs gap-1.5"
                            onClick={() => {
                              setActiveCourseId(course.id);
                              window.scrollTo(0, 0);
                            }}
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            {course.progress > 0 ? 'Resume' : 'Start'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-muted/20 rounded-2xl border border-dashed border-border">
                <p className="text-muted-foreground">
                  {searchQuery ? `No courses found matching "${searchQuery}"` : "No courses available in your learning paths yet."}
                </p>
                {searchQuery && (
                  <Button
                    variant="link"
                    className="mt-2 text-primary"
                    onClick={() => setSearchQuery("")}
                  >
                    Clear Search
                  </Button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Course Specific View (Step 2) */}
        {activeCourseId && activeCourse && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500 max-w-5xl mx-auto space-y-6">
            <Button
              variant="ghost"
              className="w-fit text-muted-foreground hover:text-foreground pl-0 group"
              onClick={() => {
                setActiveCourseId(null);
                setOpenModuleId(null); // reset open module state
              }}
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Courses
            </Button>

            {/* Active Course Header Section */}
            <Card className="border-primary/20 bg-card overflow-hidden">
              <div className="bg-primary/5 p-6 border-b border-primary/10">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                        {activeCourse.title}
                      </h1>
                      <Badge variant="default" className="bg-primary text-primary-foreground">
                        {activeCourse.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                      <span className="flex items-center gap-1.5 focus-visible:outline-none">
                        <Clock className="w-4 h-4" />
                        Duration: {activeCourse.duration}
                      </span>
                      <span className="flex items-center gap-1.5 focus-visible:outline-none">
                        <BookOpen className="w-4 h-4" />
                        {activeCourse.modules.length} Modules
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0 w-full md:w-auto">
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto bg-card hover:bg-muted"
                      onClick={() => setViewingCourseDetailsId(activeCourse.id)}
                    >
                      <Info className="w-4 h-4 mr-2" />
                      Detailed View
                    </Button>

                    <Button
                      className={cn(
                        "w-full sm:w-auto gap-2 text-secondary-foreground",
                        activeCourse.progress > 0 ? "bg-secondary hover:bg-secondary/90" : "bg-primary hover:bg-primary/90 text-primary-foreground"
                      )}
                      onClick={() => {
                        const firstIncompleteMod = activeCourse.modules.find(m => m.progress < 100 && m.progress > -1) || activeCourse.modules[0];
                        setOpenModuleId(firstIncompleteMod.id);
                        window.scrollBy({ top: 300, behavior: 'smooth' });
                      }}
                    >
                      {activeCourse.progress > 0 ? <PlayCircle className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                      {activeCourse.progress > 0 ? "Continue Learning" : "Start Learning"}
                    </Button>
                  </div>
                </div>

                {/* Added short description to header */}
                <p className="mt-4 text-sm text-muted-foreground max-w-3xl leading-relaxed">
                  {activeCourse.description}
                </p>
              </div>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">Current Progress</span>
                    <span className="font-bold text-primary">{activeCourse.progress}%</span>
                  </div>
                  <Progress value={activeCourse.progress} className="h-2.5 w-full bg-secondary" />
                </div>
              </CardContent>
            </Card>

            {/* Modules Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground mb-4">Course Content</h2>

              <div className="flex flex-col gap-3">
                {activeCourse.modules.map((mod) => {
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
                                  const isSubmitted = submittedAssignments.includes(assignment.id);

                                  return (
                                    <div key={assignment.id} className="space-y-3">
                                      <div
                                        className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-all ${isViewing ? "bg-primary/5 border-primary/30" : "bg-card border-border/50 hover:border-primary/20"
                                          }`}
                                      >
                                        <div className="flex items-center gap-3 mb-3 sm:mb-0">
                                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isSubmitted ? 'bg-primary/10 text-primary' : 'bg-primary/5 text-primary'}`}>
                                            {isSubmitted ? <CheckCircle2 className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
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
                                            disabled={isSubmitted}
                                            className={cn(
                                              "h-8 text-[11px] gap-1.5",
                                              isSubmitted ? "bg-muted text-muted-foreground opacity-100" : "bg-primary hover:bg-primary/90"
                                            )}
                                            onClick={() => handleOpenSubmitUI(assignment.id)}
                                          >
                                            {!isSubmitted && <UploadCloud className="w-3.5 h-3.5" />}
                                            {isSubmitted ? "Submitted" : "Submit"}
                                          </Button>
                                        </div>
                                      </div>

                                      {/* Inline Assignment Details & Submission */}
                                      {isViewing && (
                                        <div className="p-4 rounded-xl bg-muted/30 border border-border/50 animate-in fade-in slide-in-from-top-2 duration-200">
                                          <div className="space-y-4">
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

                                            {/* File Upload / Confirmation Area */}
                                            <div className="pt-2">
                                              {isSubmitted ? (
                                                <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-xl text-primary animate-fade-in">
                                                  <CheckCircle2 className="w-6 h-6 shrink-0" />
                                                  <div>
                                                    <h6 className="font-semibold text-sm">Assignment Submitted Successfully</h6>
                                                    <p className="text-xs opacity-80 mt-0.5">Your submission is pending review by the instructor.</p>
                                                  </div>
                                                </div>
                                              ) : (
                                                <div className="space-y-3">
                                                  <h5 className="text-xs font-bold text-foreground mb-1">Upload Submission</h5>
                                                  {uploadError && (
                                                    <div className="p-3 mb-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg animate-fade-in">
                                                      {uploadError}
                                                    </div>
                                                  )}

                                                  <div
                                                    className={cn(
                                                      "relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 transition-colors text-center cursor-pointer bg-card",
                                                      dragActive ? "border-primary bg-primary/5 scale-[1.02]" : "border-border/60 hover:border-primary/50 hover:bg-muted/30"
                                                    )}
                                                    onDragEnter={handleDrag}
                                                    onDragLeave={handleDrag}
                                                    onDragOver={handleDrag}
                                                    onDrop={handleDrop}
                                                    onClick={() => inputRef.current?.click()}
                                                  >
                                                    <input
                                                      ref={inputRef}
                                                      type="file"
                                                      multiple
                                                      className="hidden"
                                                      onChange={handleChange}
                                                      accept=".pdf,.docx,.zip,.pptx,.jpg,.png"
                                                    />

                                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3 text-primary pointer-events-none">
                                                      <UploadCloud className="w-5 h-5 pointer-events-none" />
                                                    </div>
                                                    <p className="font-semibold text-foreground text-sm pointer-events-none">
                                                      Drag and drop your files here or click to upload
                                                    </p>
                                                    <p className="text-[10px] text-muted-foreground mt-1 pointer-events-none">
                                                      Maximum 5 files, 20MB per file. Supported: .pdf, .docx, .zip, .png, .jpg
                                                    </p>
                                                  </div>

                                                  {/* Uploaded Files Preview List */}
                                                  {selectedFiles.length > 0 && (
                                                    <div className="mt-4 space-y-2 animate-fade-in">
                                                      <h6 className="text-xs font-semibold text-foreground">Uploaded Files ({selectedFiles.length}/5):</h6>
                                                      <div className="grid gap-2">
                                                        {selectedFiles.map((file, idx) => (
                                                          <div key={`${file.name}-${idx}`} className="flex items-center justify-between p-3 rounded-lg border bg-card/50">
                                                            <div className="flex items-center gap-3 overflow-hidden">
                                                              <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                                                <FileText className="w-4 h-4" />
                                                              </div>
                                                              <div className="min-w-0 flex-1 text-left">
                                                                <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                                                                </p>
                                                              </div>
                                                            </div>
                                                            <Button
                                                              variant="ghost"
                                                              size="icon"
                                                              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
                                                              onClick={(e) => {
                                                                e.stopPropagation();
                                                                removeFile(idx);
                                                              }}
                                                            >
                                                              <X className="w-4 h-4" />
                                                            </Button>
                                                          </div>
                                                        ))}
                                                      </div>
                                                    </div>
                                                  )}
                                                </div>
                                              )}
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
        )}
      </div>

      {/* Course Details Modal */}
      {detailsCourse && (
        <Dialog open={viewingCourseDetailsId !== null} onOpenChange={(open) => !open && setViewingCourseDetailsId(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader className="pb-4 border-b">
              <DialogTitle className="text-xl">{detailsCourse.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {detailsCourse.description}
                </p>
              </div>

              {/* 1. Course Requirements */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Course Requirements
                </h4>
                <ul className="space-y-2">
                  {detailsCourse.requirements?.map((req: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 2. Course Includes */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  Course Includes
                </h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2.5 text-sm text-muted-foreground bg-muted/30 p-2.5 rounded-lg border">
                    <BookOpen className="w-4 h-4 shrink-0" />
                    <span>{detailsCourse.modules.length} Modules</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-muted-foreground bg-muted/30 p-2.5 rounded-lg border">
                    <PlayCircle className="w-4 h-4 shrink-0" />
                    <span>{detailsCourse.modules.reduce((acc, mod) => acc + (mod.lessons?.length || 0), 0)} Video lessons</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-muted-foreground bg-muted/30 p-2.5 rounded-lg border">
                    <FileText className="w-4 h-4 shrink-0" />
                    <span>{detailsCourse.modules.reduce((acc, mod) => acc + (mod.assignments?.length || 0), 0)} Assignments</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-muted-foreground bg-muted/30 p-2.5 rounded-lg border">
                    <FileText className="w-4 h-4 shrink-0" />
                    <span>Assessments</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-muted-foreground bg-muted/30 p-2.5 rounded-lg border">
                    <UploadCloud className="w-4 h-4 shrink-0" />
                    <span>Downloadable resources</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-muted-foreground bg-muted/30 p-2.5 rounded-lg border">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Certificate of completion</span>
                  </div>
                </div>
              </div>

              {/* 3. Course Outcome */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Course Outcome
                </h4>
                <ul className="space-y-2">
                  {detailsCourse.outcomes?.map((outcome: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 shrink-0" />
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="pt-4 border-t flex flex-col sm:flex-row justify-end gap-3">
              <Button variant="outline" onClick={() => setViewingCourseDetailsId(null)}>Close</Button>
              <Button
                className="bg-primary hover:bg-primary/90 gap-2"
                onClick={() => {
                  const firstIncompleteMod = detailsCourse.modules.find(m => m.progress < 100 && m.progress > -1) || detailsCourse.modules[0];
                  setActiveCourseId(detailsCourse.id);
                  setOpenModuleId(firstIncompleteMod.id);
                  setViewingCourseDetailsId(null);
                  window.scrollTo({ top: 300, behavior: 'smooth' });
                }}
              >
                <Play className="w-4 h-4 fill-current" />
                Start Learning
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </DashboardLayout>
  );
};

export default StudentPackages;
