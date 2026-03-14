import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    ClipboardList,
    UploadCloud,
    X,
    CheckCircle2,
    Clock,
    FileText,
    ArrowLeft,
    Search,
    Play
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface Assignment {
    id: number;
    title: string;
    description: string;
    instructions: string;
    dueDate: string;
    status: string;
    marks?: string;
}

interface Module {
    id: number;
    title: string;
    progress: number;
    lessons: string[];
    assignments: Assignment[];
}

interface Course {
    id: number;
    title: string;
    category: string;
    duration: string;
    status: string;
    progress: number;
    modules: Module[];
    description: string;
    mentor: string;
}

// Centralized Course Data (matching Packages.tsx)
const coursesData: Course[] = [
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
                        dueDate: "10 March 2026",
                        status: "Pending"
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
                lessons: ["Variables & Functions", "DOM Manipulation", "Events", "ES6"],
                assignments: []
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
                        dueDate: "20 March 2026",
                        status: "Submitted"
                    }
                ]
            },
            {
                id: 5,
                title: "Module 5: Python Backend",
                progress: 0,
                lessons: ["Python Basics", "OOP", "File Handling"],
                assignments: []
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
                        dueDate: "30 March 2026",
                        status: "Graded",
                        marks: "85/100"
                    }
                ]
            }
        ],
        description: "Master both frontend and backend development in this comprehensive 3-month bootcamp designed to take you from beginner to job-ready.",
        mentor: "Sarah Jenkins"
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
        mentor: "Arjun Mehta"
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
        mentor: "Elena Rodriguez"
    }
];

const StudentAssignments = () => {
    const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState<any>(null);

    // Simulated File Upload State
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [searchParams] = useSearchParams();

    // Handle deep linking from Course page
    useEffect(() => {
        const assignmentIdParam = searchParams.get("assignmentId");
        if (assignmentIdParam) {
            const assId = parseInt(assignmentIdParam);

            // Find which course this assignment belongs to
            let foundCourse = null;
            let foundAssignment = null;

            for (const course of coursesData) {
                for (const module of course.modules) {
                    const ass = module.assignments.find(a => a.id === assId);
                    if (ass) {
                        foundCourse = course;
                        foundAssignment = ass;
                        break;
                    }
                }
                if (foundCourse) break;
            }

            if (foundCourse && foundAssignment) {
                setSelectedCourseId(foundCourse.id);
                setSelectedAssignment({
                    ...foundAssignment,
                    moduleName: foundCourse.modules.find(m => m.assignments.some(a => a.id === assId))?.title
                });
                setIsSubmitModalOpen(true);
            }
        }
    }, [searchParams]);

    const activeCourse = coursesData.find(c => c.id === selectedCourseId);

    // Filtering Logic
    const filteredCourses = coursesData.filter(course => {
        const query = searchQuery.toLowerCase();
        const matchesCourse = course.title.toLowerCase().includes(query);
        const matchesInternal = course.modules.some(mod =>
            mod.title.toLowerCase().includes(query) ||
            mod.assignments.some(ass => ass.title.toLowerCase().includes(query))
        );
        return matchesCourse || matchesInternal;
    });

    const filteredModules = activeCourse?.modules
        .map(mod => ({
            ...mod,
            assignments: mod.assignments.filter(ass =>
                ass.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                mod.title.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }))
        .filter(mod => mod.assignments.length > 0) || [];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Pending":
                return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">Pending</Badge>;
            case "Submitted":
                return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">Submitted</Badge>;
            case "Graded":
                return <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Graded</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    // Drag and Drop Handlers
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

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setSelectedFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const onButtonClick = () => {
        inputRef.current?.click();
    };

    const removeFile = () => {
        setSelectedFile(null);
    };

    const handleSubmit = () => {
        // In a real app, logic to send formData to backend
        setTimeout(() => {
            setSelectedFile(null);
            setIsSubmitModalOpen(false);
        }, 500);
    };

    const openSubmission = (assignment: any) => {
        setSelectedAssignment(assignment);
        setSelectedFile(null); // Reset
        setIsSubmitModalOpen(true);
    };

    return (
        <DashboardLayout>
            <div className="animate-fade-in space-y-6 lg:space-y-8 max-w-5xl mx-auto">

                {!selectedCourseId ? (
                    /* Step 1: Course Selection List */
                    <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">
                                    My Assignments
                                </h1>
                                <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                                    Select a course to view and submit your assignments.
                                </p>
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="relative max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search assignments, courses or modules..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                            />
                        </div>

                        {filteredCourses.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredCourses.map((course) => (
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
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="bg-muted/30 p-2.5 rounded-lg border flex items-center gap-2">
                                                    <ClipboardList className="w-3.5 h-3.5 text-primary" />
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] text-muted-foreground font-medium uppercase leading-none mb-1">Tasks</span>
                                                        <span className="text-xs font-semibold leading-none">
                                                            {course.modules.reduce((acc, mod) => acc + (mod.assignments?.length || 0), 0)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="bg-muted/30 p-2.5 rounded-lg border flex items-center gap-2">
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] text-muted-foreground font-medium uppercase leading-none mb-1">Graded</span>
                                                        <span className="text-xs font-semibold leading-none">
                                                            {course.modules.reduce((acc, mod) => acc + (mod.assignments?.filter(a => a.status === 'Graded').length || 0), 0)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <Button
                                                className="w-full text-xs gap-1.5"
                                                onClick={() => {
                                                    setSelectedCourseId(course.id);
                                                    window.scrollTo(0, 0);
                                                }}
                                            >
                                                <ClipboardList className="w-3.5 h-3.5" />
                                                View Assignments
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center bg-muted/20 rounded-2xl border border-dashed border-border animate-in fade-in zoom-in-95">
                                <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-foreground">No assignments found</h3>
                                <p className="text-muted-foreground max-w-xs mx-auto mt-1">
                                    We couldn't find any courses or assignments matching "{searchQuery}". Try a different search term.
                                </p>
                                <Button
                                    variant="outline"
                                    className="mt-6"
                                    onClick={() => setSearchQuery("")}
                                >
                                    Clear Search
                                </Button>
                            </div>
                        )}
                    </div>
                ) : (
                    /* Step 2: Course-specific Assignment Dashboard */
                    <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <Button
                                variant="ghost"
                                className="w-fit text-muted-foreground hover:text-foreground pl-0 group"
                                onClick={() => {
                                    setSelectedCourseId(null);
                                }}
                            >
                                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                                Back to courses
                            </Button>

                            {/* Search Bar in Step 2 */}
                            <div className="relative w-full sm:max-w-xs">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search in this course..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-3">
                                    <h1 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">
                                        {activeCourse?.title}
                                    </h1>
                                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                                        Assignments
                                    </Badge>
                                </div>
                                <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                                    Manage and submit tasks for this learning path.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            {filteredModules.length > 0 ? (
                                filteredModules.map((mod) => (
                                    <div key={mod.id} className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-6 w-1 rounded-full bg-primary" />
                                            <h2 className="text-lg font-bold text-foreground">
                                                {mod.title}
                                            </h2>
                                            <Badge variant="secondary" className="text-[10px] py-0 h-5">
                                                {mod.assignments.length} Tasks
                                            </Badge>
                                        </div>

                                        <div className="grid gap-4">
                                            {mod.assignments.map((assignment) => (
                                                <Card
                                                    key={assignment.id}
                                                    className="overflow-hidden border border-border/50 hover:border-border transition-all hover:shadow-md"
                                                >
                                                    <CardContent className="p-5 sm:p-6">
                                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                                            {/* Info Section */}
                                                            <div className="space-y-3 flex-1">
                                                                <div className="flex items-center gap-3 flex-wrap">
                                                                    <h2 className="text-xl font-semibold text-foreground">
                                                                        {assignment.title}
                                                                    </h2>
                                                                    {getStatusBadge(assignment.status)}
                                                                </div>

                                                                <p className="text-muted-foreground text-sm max-w-2xl leading-relaxed">
                                                                    {assignment.description}
                                                                </p>
                                                            </div>

                                                            {/* Actions & Metadata Section */}
                                                            <div className="flex flex-col items-start md:items-end gap-4 min-w-[200px]">
                                                                <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium bg-muted/50 px-3 py-1.5 rounded-lg w-full md:w-auto mt-2 md:mt-0">
                                                                    <Clock className="w-4 h-4 text-warning" />
                                                                    Due: {assignment.dueDate}
                                                                </div>

                                                                {assignment.status === "Graded" && assignment.marks && (
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-sm text-muted-foreground">Marks:</span>
                                                                        <span className="font-bold text-lg text-foreground flex items-center gap-1.5">
                                                                            <CheckCircle2 className="w-5 h-5 text-primary" />
                                                                            {assignment.marks}
                                                                        </span>
                                                                    </div>
                                                                )}

                                                                {assignment.status === "Pending" && (
                                                                    <Button
                                                                        className="w-full md:w-auto shadow-sm"
                                                                        onClick={() => openSubmission({ ...assignment, moduleName: mod.title })}
                                                                    >
                                                                        <UploadCloud className="w-4 h-4 mr-2" />
                                                                        Submit Assignment
                                                                    </Button>
                                                                )}

                                                                {assignment.status === "Submitted" && (
                                                                    <Button variant="secondary" className="w-full md:w-auto cursor-default pointer-events-none opacity-80 gap-2">
                                                                        <Clock className="w-4 h-4" />
                                                                        Under Review
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-20 bg-muted/20 rounded-2xl border border-dashed border-border animate-in fade-in zoom-in-95">
                                    <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-foreground">No assignments found in this course</h3>
                                    <p className="text-muted-foreground max-w-xs mx-auto mt-1">
                                        We couldn't find any assignments matching "{searchQuery}". Try a different search term.
                                    </p>
                                    <Button
                                        variant="outline"
                                        className="mt-6"
                                        onClick={() => setSearchQuery("")}
                                    >
                                        Clear Search
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* 3️⃣ Submission UI (Drag & Drop Mock) Modal */}
                <Dialog open={isSubmitModalOpen} onOpenChange={setIsSubmitModalOpen}>
                    <DialogContent className="sm:max-w-xl">
                        <DialogHeader className="mb-2">
                            <DialogTitle className="text-xl">Submit Assignment</DialogTitle>
                            <DialogDescription className="flex items-center gap-2">
                                <Badge variant="secondary" className="px-1.5 py-0 h-5 text-[10px]">
                                    {selectedAssignment?.moduleName}
                                </Badge>
                                <span className="text-foreground/80">{selectedAssignment?.title}</span>
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6">

                            {/* Drag & Drop Zone */}
                            <div
                                className={cn(
                                    "relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-10 transition-colors text-center cursor-pointer",
                                    dragActive ? "border-primary bg-primary/5" : "border-border/60 hover:border-primary/50 hover:bg-muted/30",
                                    selectedFile && "border-primary/50 bg-primary/5"
                                )}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                onClick={!selectedFile ? onButtonClick : undefined}
                            >
                                <input
                                    ref={inputRef}
                                    type="file"
                                    className="hidden"
                                    onChange={handleChange}
                                    accept=".pdf,.docx,.zip,.pptx,.jpg,.png"
                                />

                                {!selectedFile ? (
                                    <>
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                                            <UploadCloud className="w-6 h-6" />
                                        </div>
                                        <p className="font-semibold text-foreground text-sm sm:text-base">
                                            Drag & Drop your file here or click to browse
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-2">
                                            Supported formats: .pdf, .docx, .zip, .pptx, .jpg, .png
                                        </p>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center w-full max-w-xs">
                                        <FileText className="w-10 h-10 text-primary mb-3" />
                                        <p className="font-medium text-sm text-foreground truncate w-full">{selectedFile.name}</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                                        </p>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeFile();
                                            }}
                                            className="mt-4 gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                                        >
                                            <X className="w-4 h-4" /> Remove File
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <Button variant="outline" onClick={() => setIsSubmitModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    disabled={!selectedFile}
                                    onClick={handleSubmit}
                                    className="gap-2"
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    Submit Assignment
                                </Button>
                            </div>

                        </div>
                    </DialogContent>
                </Dialog>

            </div>
        </DashboardLayout>
    );
};

export default StudentAssignments;
