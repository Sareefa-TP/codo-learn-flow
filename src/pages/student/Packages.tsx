import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronDown, ChevronUp, PlayCircle, BookOpen, Clock, CheckCircle2, FileText, Eye, UploadCloud, X, Info, Play, ArrowLeft, Search, Globe, Video, ExternalLink, Layout, MessageSquare, GraduationCap, ChevronRight, Home } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import CourseCard from "@/components/student/CourseCard";

// Mock Data Array
const coursesData = [
  {
    id: 1,
    title: "Full Stack Development",
    slug: "full-stack-web",
    category: "Web Development",
    duration: "3 Months",
    status: "Active",
    progress: 35,
    modules: [
      {
        id: 1,
        title: "Module 1: HTML Foundations",
        slug: "module-1-html-foundations",
        progress: 100,
        sessions: [
          {
            id: 101,
            title: "Session 1: HTML Basics & Semantic Tags",
            slug: "session-1-html-basics",
            liveLink: "https://meet.google.com/abc-defg-hij",
            notes: [
              { id: 1, title: "Introduction to HTML5", link: "https://docs.google.com/document/d/1" },
              { id: 2, title: "Semantic Elements Guide", link: "https://docs.google.com/document/d/2" }
            ],
            videoLessons: [
              { id: 1, title: "HTML Structure Deep Dive", link: "https://vimeo.com/1" },
              { id: 2, title: "Working with Tags", link: "https://vimeo.com/2" }
            ],
            recordingLink: "https://vimeo.com/recorded-1",
            assignment: {
              id: 1,
              title: "HTML Portfolio Page",
              description: "Build a simple HTML page using semantic tags.",
              instructions: "Include a header, navigation, about section, projects section, and footer. Use HTML5 semantic elements correctly.",
              dueDate: "10 March 2026",
              submittedDate: "12 March 2026",
              status: "Graded",
              grade: "A+",
              files: [
                { name: "portfolio_v1.zip", size: "2.4 MB" },
                { name: "design_system.pdf", size: "1.2 MB" }
              ],
              feedback: "Excellent use of semantic tags! Your portfolio layout is clean and professional."
            }
          },
          {
            id: 102,
            title: "Session 2: Forms & User Input",
            slug: "session-2-forms-user-input",
            liveLink: "https://meet.google.com/abc-defg-hij",
            notes: [
              { id: 3, title: "Form Validation Tips", link: "https://docs.google.com/document/d/3" }
            ],
            videoLessons: [
              { id: 3, title: "Input Types Explained", link: "https://vimeo.com/3" }
            ],
            recordingLink: "https://vimeo.com/recorded-2",
            assignment: {
              id: 4,
              title: "Contact Form Implementation",
              description: "Create a functional contact form with validation.",
              instructions: "Ensure all fields are required and email format is validated.",
              dueDate: "12 March 2026",
              submittedDate: "14 March 2026",
              status: "Pending",
              grade: null,
              files: [
                { name: "contact_form_logic.js", size: "45 KB" },
                { name: "validation_rules.pdf", size: "110 KB" }
              ],
              feedback: null
            }
          }
        ]
      },
      {
        id: 2,
        title: "Module 2: CSS & Responsive Design",
        slug: "module-2-css-responsive-design",
        progress: 80,
        sessions: [
          {
            id: 201,
            title: "Session 1: CSS Box Model & Flexbox",
            slug: "session-1-css-box-model-flexbox",
            liveLink: "https://meet.google.com/xyz-pqrs-uvw",
            notes: [
              { id: 4, title: "Flexbox Layout Guide", link: "https://docs.google.com/document/d/4" }
            ],
            videoLessons: [
              { id: 4, title: "Mastering Flexbox", link: "https://vimeo.com/4" }
            ],
            recordingLink: "https://vimeo.com/recorded-3",
            assignment: {
              id: 5,
              title: "Responsive Navigation Bar",
              description: "Build a navigation bar that adapts to different screen sizes.",
              instructions: "Use Flexbox for the layout and media queries for responsiveness.",
              dueDate: "15 March 2026",
              submittedDate: "16 March 2026",
              status: "Pending",
              grade: null,
              files: [
                { name: "nav_responsive_final.zip", size: "540 KB" }
              ],
              feedback: null
            }
          },
          {
            id: 202,
            title: "Session 2: CSS Grid & Layout Patterns",
            slug: "session-2-css-grid-layout-patterns",
            liveLink: "https://meet.google.com/xyz-pqrs-uvw",
            notes: [
              { id: 5, title: "CSS Grid Cheat Sheet", link: "https://docs.google.com/document/d/5" }
            ],
            videoLessons: [
              { id: 5, title: "Advanced Grid Layouts", link: "https://vimeo.com/5" }
            ],
            recordingLink: "https://vimeo.com/recorded-4",
            assignment: null
          }
        ]
      },
      {
        id: 3,
        title: "Module 3: JavaScript Fundamentals",
        slug: "module-3-javascript-fundamentals",
        progress: 50,
        sessions: [
          {
            id: 301,
            title: "Session 1: ES6+ Syntax & Array Methods",
            slug: "session-1-es6-syntax-array-methods",
            liveLink: "https://meet.google.com/js-basics-1",
            notes: [
              { id: 6, title: "ES6 Features Overview", link: "https://docs.google.com/document/d/6" }
            ],
            videoLessons: [
              { id: 6, title: "Map, Filter, Reduce Explained", link: "https://vimeo.com/6" }
            ],
            recordingLink: "https://vimeo.com/recorded-5",
            assignment: {
              id: 6,
              title: "Data Transformation Challenge",
              description: "Manipulate complex data arrays using ES6 methods.",
              instructions: "Write functions to filter, sort, and transform user data objects.",
              dueDate: "18 March 2026",
              status: "Pending",
              grade: null,
              feedback: null
            }
          }
        ]
      },
      {
        id: 4,
        title: "Module 4: React Development",
        slug: "module-4-react-development",
        progress: 20,
        sessions: [
          {
            id: 401,
            title: "Session 1: State Management & Hooks",
            slug: "session-1-state-management-hooks",
            liveLink: "https://meet.google.com/react-hooks",
            notes: [
              { id: 7, title: "useState & useEffect Deep Dive", link: "https://docs.google.com/document/d/7" }
            ],
            videoLessons: [
              { id: 7, title: "Building Functional Components", link: "https://vimeo.com/7" }
            ],
            recordingLink: "https://vimeo.com/recorded-6",
            assignment: {
              id: 7,
              title: "React Todo Dashboard",
              description: "Create a feature-rich todo application with local storage.",
              instructions: "Implement task categories, search, and persistent storage using React hooks.",
              dueDate: "22 March 2026",
              status: "Pending",
              grade: null,
              feedback: null
            }
          }
        ]
      },
      {
        id: 5,
        title: "Module 5: Python & Backend",
        slug: "module-5-python-backend",
        progress: 0,
        sessions: [
          {
            id: 501,
            title: "Session 1: API Development with Django",
            slug: "session-1-api-development-with-django",
            liveLink: "https://meet.google.com/django-api",
            notes: [
              { id: 8, title: "Django REST Framework Guide", link: "https://docs.google.com/document/d/8" }
            ],
            videoLessons: [
              { id: 8, title: "Setting up your first API", link: "https://vimeo.com/8" }
            ],
            recordingLink: "https://vimeo.com/recorded-7",
            assignment: {
              id: 8,
              title: "Blog API Interface",
              description: "Develop a standard RESTful API for a blog platform.",
              instructions: "Implement CRUD operations for posts and comments. Use Django REST Framework.",
              dueDate: "30 March 2026",
              status: "Pending",
              grade: null,
              feedback: null
            }
          }
        ]
      },
      {
        id: 6,
        title: "Module 6: Django Advanced",
        slug: "module-6-django-advanced",
        progress: 0,
        sessions: []
      },
      {
        id: 7,
        title: "Module 7: Database Design",
        slug: "module-7-database-design",
        progress: 0,
        sessions: []
      },
      {
        id: 8,
        title: "Module 8: Final Project Phase",
        slug: "module-8-final-project-phase",
        progress: -1,
        sessions: []
      }
    ],
    description: "Master both frontend and backend development in this comprehensive 3-month bootcamp designed to take you from beginner to job-ready.",
    mentor: "Sarah Jenkins",
    startDate: "05 Jan 2026",
    endDate: "05 April 2026",
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
    slug: "python-backend-development",
    category: "Software Engineering",
    duration: "2 Months",
    status: "Upcoming",
    progress: 0,
    modules: [
      { id: 12, title: "Module 2: RESTful Services", slug: "module-2-restful-services", progress: -1, sessions: [] }
    ],
    description: "Dive deep into robust backend services using Python, FastAPI, and advanced database modeling.",
    mentor: "Arjun Mehta",
    startDate: "01 May 2026",
    endDate: "01 July 2026",
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
    slug: "ui-ux-design",
    category: "Design",
    duration: "4 Weeks",
    status: "Enrolled",
    progress: 15,
    modules: [
      { id: 21, title: "Module 1: Design Thinking", slug: "module-1-design-thinking", progress: 100, sessions: [] },
      { id: 22, title: "Module 2: Figma Fundamentals", slug: "module-2-figma-fundamentals", progress: 10, sessions: [] }
    ],
    description: "Learn modern design principles and master Figma to create stunning user interfaces and experiences.",
    mentor: "Elena Rodriguez",
    startDate: "15 Feb 2026",
    endDate: "15 March 2026",
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
  const navigate = useNavigate();
  const handleWatchRecording = (recordingUrl: string | undefined | null) => {
    // Debug (remove later if not needed)
    console.log("recordingUrl:", recordingUrl);
    if (!recordingUrl || recordingUrl === "#") return;
    navigate(`/student/video-player?url=${encodeURIComponent(recordingUrl)}`);
  };
  const { courseSlug, moduleSlug, sessionSlug } = useParams();

  // Derived State from URL Params
  const activeCourse = useMemo(() => {
    return coursesData.find(c => c.slug === courseSlug) || null;
  }, [courseSlug]);

  const activeModule = useMemo(() => {
    if (!activeCourse || !moduleSlug) return null;
    return activeCourse.modules.find((m: any) => m.slug === moduleSlug) || null;
  }, [activeCourse, moduleSlug]);

  const activeSession = useMemo(() => {
    if (!activeModule || !sessionSlug) return null;
    return activeModule.sessions.find((s: any) => s.slug === sessionSlug) || null;
  }, [activeModule, sessionSlug]);

  // View State Management
  const [viewingCourseDetailsId, setViewingCourseDetailsId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [contentSearchQuery, setContentSearchQuery] = useState("");
  const [expandedSectionId, setExpandedSectionId] = useState<string | null>(null); // e.g., "notes-101", "assignment-101"
  const [viewingAssignmentId, setViewingAssignmentId] = useState<number | null>(null);

  useEffect(() => {
    if (viewingCourseDetailsId === null) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [viewingCourseDetailsId]);

  // File Upload State for Inline Submission
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [submittedAssignments, setSubmittedAssignments] = useState<number[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filtered Courses for Search
  const filteredCourses = useMemo(() => {
    return coursesData.filter(course =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.mentor.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Navigation Handlers
  const handleCourseClick = (course: any) => {
    navigate(`/student/my-course/${course.slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleModuleClick = (module: any) => {
    if (activeModule?.id === module.id) {
      navigate(`/student/my-course/${courseSlug}`);
    } else {
      navigate(`/student/my-course/${courseSlug}/${module.slug}`);
    }
  };

  const handleSessionClick = (session: any) => {
    if (activeSession?.id === session.id) {
      navigate(`/student/my-course/${courseSlug}/${moduleSlug}`);
    } else {
      navigate(`/student/my-course/${courseSlug}/${moduleSlug}/${session.slug}`);
    }
    setExpandedSectionId(null);
  };

  const detailsCourse = coursesData.find(c => c.id === viewingCourseDetailsId);

  const courseDetailsModal =
    detailsCourse && viewingCourseDetailsId !== null
      ? createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div
              className="bg-background border border-border/50 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-border/50 bg-muted/5 flex-shrink-0">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Course Details</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Comprehensive overview of your enrollment details.
                  </p>
                </div>
                <button
                  onClick={() => setViewingCourseDetailsId(null)}
                  className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground flex-shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {/* Main Course Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">Course Name</p>
                    <p className="text-sm font-semibold leading-relaxed bg-muted/50 rounded-xl px-4 py-3 border border-border/30">
                      {detailsCourse.title}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">Lead Mentor</p>
                    <p className="text-sm font-semibold leading-relaxed bg-muted/50 rounded-xl px-4 py-3 border border-border/30">
                      {detailsCourse.mentor}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">Duration / Speed</p>
                    <div className="bg-muted/50 rounded-xl px-4 py-3 border border-border/30 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="text-sm font-semibold">{detailsCourse.duration}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">Course Timeline</p>
                    <div className="bg-muted/50 rounded-xl px-4 py-3 border border-border/30 flex items-center gap-2">
                      <span className="text-sm font-semibold">{detailsCourse.startDate}</span>
                      <span className="text-muted-foreground/50">→</span>
                      <span className="text-sm font-semibold">{detailsCourse.endDate}</span>
                    </div>
                  </div>
                </div>

                {/* Course Description */}
                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">Course Description</p>
                  <div className="text-sm leading-relaxed bg-muted/30 rounded-xl px-4 py-3 border border-border/30 min-h-[80px]">
                    {detailsCourse.description}
                  </div>
                </div>

                {/* Requirements & Outcomes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Prerequisites
                    </p>
                    <ul className="space-y-2">
                      {detailsCourse.requirements?.map((req: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                          <div className="w-1 h-1 rounded-full bg-primary/40 mt-1.5 shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5" /> Core Outcomes
                    </p>
                    <ul className="space-y-2">
                      {detailsCourse.outcomes?.map((outcome: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                          <div className="w-1 h-1 rounded-full bg-primary/40 mt-1.5 shrink-0" />
                          <span>{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Curriculum Summary Badge Grid */}
                <div className="space-y-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">Enrollment Includes</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-foreground/70 bg-muted/20 p-2.5 rounded-xl border border-border/20">
                      <BookOpen className="w-3.5 h-3.5 shrink-0 text-primary/60" />
                      <span>{detailsCourse.modules.length} Modules</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-foreground/70 bg-muted/20 p-2.5 rounded-xl border border-border/20">
                      <Play className="w-3.5 h-3.5 shrink-0 text-primary/60" />
                      <span>Sessions</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-foreground/70 bg-muted/20 p-2.5 rounded-xl border border-border/20">
                      <FileText className="w-3.5 h-3.5 shrink-0 text-primary/60" />
                      <span>Projects</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-border/50 bg-muted/5 flex items-center justify-end gap-3 flex-shrink-0">
                <Button
                  variant="outline"
                  className="rounded-xl px-6"
                  onClick={() => setViewingCourseDetailsId(null)}
                >
                  Close
                </Button>
                <Button
                  className="rounded-xl px-6 bg-primary hover:bg-primary/90"
                  onClick={() => {
                    const firstIncompleteMod =
                      detailsCourse.modules.find((m: any) => m.progress < 100 && m.progress > -1) ||
                      detailsCourse.modules[0];
                    if (firstIncompleteMod) {
                      navigate(`/student/my-course/${detailsCourse.slug}/${firstIncompleteMod.slug}`);
                    } else {
                      navigate(`/student/my-course/${detailsCourse.slug}`);
                    }
                    setViewingCourseDetailsId(null);
                    window.scrollTo({ top: 300, behavior: "smooth" });
                  }}
                >
                  Start Learning
                </Button>
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

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
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto px-4 md:px-6 lg:px-8 pb-10">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 mb-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 overflow-x-auto whitespace-nowrap pb-2 no-scrollbar">
          <Link to="/student" className="flex items-center gap-1.5 hover:text-primary transition-colors">
            <Home className="w-3 h-3" />
            Dashboard
          </Link>
          <ChevronRight className="w-3 h-3 opacity-40" />
          <Link to="/student/my-course" className={cn(
            "hover:text-primary transition-colors",
            !courseSlug && "text-primary font-black"
          )}>
            My Courses
          </Link>
          {activeCourse && (
            <>
              <ChevronRight className="w-3 h-3 opacity-40" />
              <Link to={`/student/my-course/${activeCourse.slug}`} className={cn(
                "hover:text-primary transition-colors",
                courseSlug && !moduleSlug && "text-primary font-black"
              )}>
                {activeCourse.title}
              </Link>
            </>
          )}
          {activeModule && (
            <>
              <ChevronRight className="w-3 h-3 opacity-40" />
              <Link to={`/student/my-course/${activeCourse?.slug}/${activeModule.slug}`} className={cn(
                "hover:text-primary transition-colors",
                moduleSlug && !sessionSlug && "text-primary font-black"
              )}>
                {activeModule.title.split(":")[0]}
              </Link>
            </>
          )}
          {activeSession && (
            <>
              <ChevronRight className="w-3 h-3 opacity-40" />
              <span className="text-primary font-black whitespace-nowrap">
                {activeSession.title.split(":")[0]}
              </span>
            </>
          )}
        </div>

        {/* Header Section */}
        <div className="mb-8">
          <div className="space-y-2">
            {!activeCourse ? (
              <>
                <h1 className="text-3xl font-black tracking-tight text-foreground">My Enrolled Courses</h1>
                <p className="text-muted-foreground text-sm font-medium">Manage and track your progress across all your active learning programs.</p>
              </>
            ) : (
              <div className="flex flex-col gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-fit -ml-3 text-muted-foreground hover:text-primary transition-all group"
                  onClick={() => navigate("/student/my-course")}
                >
                  <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                  Back to All Courses
                </Button>
                <div>
                  <h1 className="text-3xl font-black tracking-tight text-foreground">{activeCourse.title}</h1>
                  <p className="text-muted-foreground text-sm font-medium">Course Curriculum and Learning Resources</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search Bar for Course List - New Full-Width Position */}
        {!activeCourse && (
          <div className="relative mb-6 sm:mb-10 group animate-in fade-in slide-in-from-top-4 duration-700 delay-100">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-all duration-300" />
            <input
              type="text"
              placeholder="Search courses by title, category, or mentor..."
              className="w-full bg-card border border-border/60 rounded-[1.25rem] py-3.5 sm:py-4 pl-12 pr-6 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm placeholder:text-muted-foreground/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}

        {/* Course List / Dynamic Content */}
        {!activeCourse ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                title={course.title}
                category={course.category}
                duration={course.duration}
                progress={course.progress}
                onDetailsClick={() => setViewingCourseDetailsId(course.id)}
                onActionClick={() => handleCourseClick(course)}
              />
            ))}
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500 max-w-6xl mx-auto space-y-6">
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
                        if (firstIncompleteMod) {
                          navigate(`/student/my-course/${activeCourse.slug}/${firstIncompleteMod.slug}`);
                        }
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

              {/* Search Bar (matches "My Enrolled Courses" searchbar styling) */}
              <div className="relative group animate-in fade-in slide-in-from-top-4 duration-700 delay-100">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-all duration-300" />
                <input
                  type="text"
                  placeholder="Search modules or sessions..."
                  className="w-full bg-card border border-border/60 rounded-[1.25rem] py-4 pl-12 pr-6 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm placeholder:text-muted-foreground/50"
                  value={contentSearchQuery}
                  onChange={(e) => setContentSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-3">
                {activeCourse.modules.map((mod) => {
                  const q = contentSearchQuery.trim().toLowerCase();
                  const matchesModule = q.length === 0 || mod.title.toLowerCase().includes(q);
                  const filteredSessions =
                    q.length === 0
                      ? mod.sessions
                      : mod.sessions.filter((s: any) => s.title.toLowerCase().includes(q));
                  if (!matchesModule && filteredSessions.length === 0) return null;

                  const isOpen = activeModule?.id === mod.id;
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
                        onClick={() => handleModuleClick(mod)}
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

                      {/* Accordion Content (Sessions List) */}
                      {isOpen && (
                        <div className="bg-muted/5 border-t border-border/50 animate-in fade-in slide-in-from-top-2 duration-300">
                          {filteredSessions && filteredSessions.length > 0 ? (
                            <div className="divide-y divide-border/30">
                              {filteredSessions.map((session: any, sIdx: number) => {
                                const isSessionOpen = activeSession?.id === session.id;
                                return (
                                  <div key={session.id} className="group/session">
                                    {/* Session Header */}
                                    <div
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleSessionClick(session);
                                      }}
                                      className={cn(
                                        "p-5 cursor-pointer flex items-center justify-between transition-colors",
                                        isSessionOpen ? "bg-primary/5" : "hover:bg-muted/30"
                                      )}
                                    >
                                      <div className="flex items-center gap-4">
                                        <div className={cn(
                                          "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs transition-colors",
                                          isSessionOpen ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover/session:bg-primary/10 group-hover/session:text-primary"
                                        )}>
                                          {sIdx + 1}
                                        </div>
                                        <div>
                                          <h4 className="font-bold text-sm text-foreground">{session.title}</h4>
                                          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-0.5">
                                            {session.videoLessons.length} Videos • {session.notes.length} Notes • {session.assignment ? "1 Assignment" : "No Assignment"}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <Badge variant="outline" className={cn(
                                          "px-2 py-0 text-[9px] font-black uppercase tracking-widest",
                                          isSessionOpen ? "border-primary/20 text-primary bg-primary/5" : "border-border/60 text-muted-foreground"
                                        )}>
                                          {isSessionOpen ? "Exploring" : "View"}
                                        </Badge>
                                        {isSessionOpen ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                                      </div>
                                    </div>

                                    {/* Session Content (Vertical Stack) */}
                                    {isSessionOpen && (
                                      <div className="p-6 bg-white border-t border-border/30 space-y-5 animate-in slide-in-from-top-4 duration-500">

                                        {/* 1. Live Class (Static) */}
                                        {session.liveLink && (
                                          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-blue-50/30 border border-blue-100/50 gap-4">
                                            <div className="flex items-center gap-3">
                                              <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
                                                <Globe className="w-5 h-5" />
                                              </div>
                                              <div>
                                                <h5 className="font-bold text-sm text-foreground">Interactive Live Class</h5>
                                                <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Join via Google Meet</p>
                                              </div>
                                            </div>
                                            <Button
                                              className="bg-blue-600 hover:bg-blue-700 text-xs font-bold px-6 h-9 rounded-full shadow-md shadow-blue-600/10"
                                              onClick={() => window.open(session.liveLink, '_blank')}
                                            >
                                              Join Now
                                              <ExternalLink className="w-3.5 h-3.5 ml-2" />
                                            </Button>
                                          </div>
                                        )}

                                        {/* 2. Notes (Expandable) */}
                                        {session.notes.length > 0 && (
                                          <div className="border border-border/60 rounded-2xl overflow-hidden bg-white shadow-sm">
                                            <div
                                              onClick={() => setExpandedSectionId(expandedSectionId === `notes-${session.id}` ? null : `notes-${session.id}`)}
                                              className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/10 transition-colors"
                                            >
                                              <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-600">
                                                  <BookOpen className="w-4 h-4" />
                                                </div>
                                                <h5 className="text-sm font-bold text-foreground">Study Notes & PDFs ({session.notes.length})</h5>
                                              </div>
                                              {expandedSectionId === `notes-${session.id}` ? <ChevronUp className="w-4 h-4 text-orange-500" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                                            </div>
                                            {expandedSectionId === `notes-${session.id}` && (
                                              <div className="p-4 pt-0 space-y-2 animate-in fade-in slide-in-from-top-2">
                                                {session.notes.map((note) => (
                                                  <div key={note.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/30 hover:bg-slate-50 transition-colors group/note">
                                                    <div className="flex items-center gap-3">
                                                      <FileText className="w-4 h-4 text-orange-400" />
                                                      <span className="text-xs font-medium text-foreground/80 group-hover/note:text-foreground">{note.title}</span>
                                                    </div>
                                                    <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold text-orange-600 hover:text-orange-700 hover:bg-orange-50" onClick={() => window.open(note.link, '_blank')}>
                                                      View Note
                                                    </Button>
                                                  </div>
                                                ))}
                                              </div>
                                            )}
                                          </div>
                                        )}

                                        {/* 3. Assignment (Expandable) */}
                                        {session.assignment && (
                                          <div className="border border-border/60 rounded-2xl overflow-hidden bg-white shadow-sm">
                                            <div
                                              onClick={() => setExpandedSectionId(expandedSectionId === `assignment-${session.id}` ? null : `assignment-${session.id}`)}
                                              className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/10 transition-colors"
                                            >
                                              <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                                  <FileText className="w-4 h-4" />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                  <h5 className="text-sm font-bold text-foreground">Practical Assignment</h5>
                                                  {submittedAssignments.includes(session.assignment.id) && (
                                                    <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-100 text-[9px] h-4 uppercase font-bold px-1.5">Submitted</Badge>
                                                  )}
                                                </div>
                                              </div>
                                              {expandedSectionId === `assignment-${session.id}` ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                                            </div>

                                            {expandedSectionId === `assignment-${session.id}` && (
                                              <div className="p-5 pt-0 space-y-4 animate-in fade-in slide-in-from-top-2 border-t border-slate-50">
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                                                  <div>
                                                    <p className="text-xs font-bold text-foreground">{session.assignment.title}</p>
                                                    <p className="text-[10px] text-muted-foreground font-bold mt-1 inline-flex items-center gap-1.5">
                                                      <Clock className="w-3 h-3" />
                                                      Due: {session.assignment.dueDate}
                                                    </p>
                                                  </div>
                                                  {!submittedAssignments.includes(session.assignment.id) ? (
                                                    <Button size="sm" className="rounded-full text-[11px] h-8 font-bold" onClick={() => handleOpenSubmitUI(session.assignment!.id)}>
                                                      Submit Assignment
                                                    </Button>
                                                  ) : (
                                                    <div className="flex items-center gap-4">
                                                      <div className="text-right">
                                                        <p className="text-[9px] font-bold text-primary uppercase tracking-widest">Status</p>
                                                        <p className={cn(
                                                          "text-[11px] font-bold",
                                                          session.assignment.status === "Graded" ? "text-green-600" : "text-amber-600"
                                                        )}>
                                                          {session.assignment.status}
                                                        </p>
                                                      </div>
                                                      <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="rounded-full text-[11px] h-8 font-bold border-green-200 text-green-700 bg-green-50 shadow-sm"
                                                        onClick={() => navigate(`/student/my-course/${activeCourse?.slug}/${activeModule?.slug}/${session.slug}/assignment`, { state: { assignment: session.assignment } })}
                                                      >
                                                        View Submission
                                                      </Button>
                                                    </div>
                                                  )}
                                                </div>

                                                {/* Mentor Feedback Section */}
                                                {submittedAssignments.includes(session.assignment.id) && session.assignment.feedback && (
                                                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-3">
                                                    <div className="flex items-center justify-between">
                                                      <h6 className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1.5">
                                                        <MessageSquare className="w-3 h-3" />
                                                        Instructor Feedback
                                                      </h6>
                                                      {session.assignment.grade && (
                                                        <div className="flex items-center gap-1">
                                                          <span className="text-[9px] font-bold text-muted-foreground uppercase">Grade:</span>
                                                          <span className="text-xs font-black text-primary">{session.assignment.grade}</span>
                                                        </div>
                                                      )}
                                                    </div>
                                                    <p className="text-xs text-foreground/80 leading-relaxed italic border-l-2 border-primary/20 pl-4 py-1">
                                                      "{session.assignment.feedback}"
                                                    </p>
                                                  </div>
                                                )}

                                                {/* Assignment Meta Details */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                                  <div className="space-y-1.5">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Objective</p>
                                                    <p className="text-xs text-muted-foreground leading-relaxed italic">{session.assignment.description}</p>
                                                  </div>
                                                  <div className="space-y-1.5">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Steps to Follow</p>
                                                    <p className="text-xs text-muted-foreground leading-relaxed">{session.assignment.instructions}</p>
                                                  </div>
                                                </div>

                                                {/* Submission Controls (if active) */}
                                                {viewingAssignmentId === session.assignment.id && !submittedAssignments.includes(session.assignment.id) && (
                                                  <div className="pt-4 mt-2 border-t border-slate-100 space-y-4">
                                                    <div
                                                      className={cn(
                                                        "relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 transition-all text-center cursor-pointer",
                                                        dragActive ? "border-primary bg-primary/5 scale-[1.01]" : "border-slate-200 hover:border-primary/40"
                                                      )}
                                                      onDragEnter={handleDrag}
                                                      onDragLeave={handleDrag}
                                                      onDragOver={handleDrag}
                                                      onDrop={handleDrop}
                                                      onClick={() => inputRef.current?.click()}
                                                    >
                                                      <input ref={inputRef} type="file" multiple className="hidden" onChange={handleChange} accept=".pdf,.docx,.zip,.pptx,.jpg,.png" />
                                                      <UploadCloud className="w-6 h-6 text-primary/40 mb-3" />
                                                      <p className="font-bold text-xs text-foreground">Upload files here</p>
                                                      <p className="text-[9px] text-muted-foreground mt-1 tracking-tight">PDF, DOCX, ZIP • High Resolution Only</p>
                                                    </div>
                                                    {selectedFiles.length > 0 && (
                                                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                                                        <span className="text-[10px] font-bold text-slate-600">{selectedFiles.length} files selected</span>
                                                        <Button size="sm" className="h-7 text-[10px] font-bold rounded-full" onClick={() => handleSubmit(session.assignment!.id)}>Finish & Upload</Button>
                                                      </div>
                                                    )}
                                                  </div>
                                                )}
                                              </div>
                                            )}
                                          </div>
                                        )}

                                        {/* 4. Video Lessons (Expandable) */}
                                        {session.videoLessons.length > 0 && (
                                          <div className="border border-border/60 rounded-2xl overflow-hidden bg-white shadow-sm">
                                            <div
                                              onClick={() => setExpandedSectionId(expandedSectionId === `videos-${session.id}` ? null : `videos-${session.id}`)}
                                              className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/10 transition-colors"
                                            >
                                              <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center text-red-600">
                                                  <Video className="w-4 h-4" />
                                                </div>
                                                <h5 className="text-sm font-bold text-foreground">Pre-recorded Lessons ({session.videoLessons.length})</h5>
                                              </div>
                                              {expandedSectionId === `videos-${session.id}` ? <ChevronUp className="w-4 h-4 text-red-500" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                                            </div>
                                            {expandedSectionId === `videos-${session.id}` && (
                                              <div className="p-4 pt-0 grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2">
                                                {session.videoLessons.map((video) => (
                                                  <div key={video.id} className="group/video relative overflow-hidden rounded-xl border border-slate-100 bg-slate-50/20 hover:border-red-100 transition-all">
                                                    <div className="p-3 flex items-center gap-4">
                                                      <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center group-hover/video:bg-red-600 transition-colors shrink-0">
                                                        <PlayCircle className="w-5 h-5 text-white" />
                                                      </div>
                                                      <div className="min-w-0 pr-8">
                                                        <p className="text-[11px] font-bold text-foreground truncate">{video.title}</p>
                                                        <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest mt-0.5">MP4 • 1080p</p>
                                                      </div>
                                                      <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-full" onClick={() => window.open(video.link, '_blank')}>
                                                        <Eye className="w-4 h-4" />
                                                      </Button>
                                                    </div>
                                                  </div>
                                                ))}
                                              </div>
                                            )}
                                          </div>
                                        )}

                                        {/* 5. Recorded Class (Static) */}
                                        {session.recordingLink && (
                                          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 gap-4">
                                            <div className="flex items-center gap-3">
                                              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-600/20">
                                                <Play className="w-4 h-4 fill-current ml-0.5" />
                                              </div>
                                              <div>
                                                <h5 className="font-bold text-sm text-foreground">Finished Class Recording</h5>
                                                <p className="text-[10px] text-purple-600 font-bold uppercase tracking-wider">Watch Full Session</p>
                                              </div>
                                            </div>
                                            <Button
                                              variant="outline"
                                              className="border-purple-200 text-purple-700 hover:bg-purple-50 text-xs font-bold px-6 h-9 rounded-full"
                                              onClick={() => handleWatchRecording(session.recordingLink)}
                                              disabled={!session.recordingLink}
                                            >
                                              {session.recordingLink ? "Watch Recording" : "No Recording Available"}
                                            </Button>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                              <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-300">
                                <Clock className="w-8 h-8" />
                              </div>
                              <div className="space-y-1">
                                <p className="font-bold text-foreground italic">No sessions available yet</p>
                                <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">The curriculum for this module is currently being finalized. Please check back later.</p>
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

      {courseDetailsModal}
    </DashboardLayout>
  );
};

export default StudentPackages;
