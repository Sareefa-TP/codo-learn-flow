import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams, Link, useLocation } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
    PencilLine,
    Clock,
    BookOpen,
    CheckCircle2,
    XCircle,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    Send,
    Search,
    Home,
    GraduationCap,
    ArrowRight,
    ShieldCheck,
    Trophy,
    RotateCcw
} from "lucide-react";
import PageSearch from "@/components/shared/PageSearch";
import CourseCard from "@/components/student/CourseCard";
import { toast } from "sonner";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

// Types
type ExamStatus = "Not Started" | "Completed";
type ActiveView = "list" | "playing" | "result" | "review" | "detail";

interface Question {
    id: number;
    question_text: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    correct_answer: "a" | "b" | "c" | "d";
}

interface Exam {
    id: number;
    course_id: number;
    course_slug: string;
    exam_slug: string;
    is_published: boolean;
    exam_title: string;
    course_name: string;
    module_name?: string;
    time_limit: number; // in minutes
    total_questions: number;
    pass_mark: number; // percentage
    attempt_limit: number;
    status: ExamStatus;
    questions: Question[];
    previous_score?: number;
    previous_answers?: Record<number, string>;
}

// Enrolled Course Type
interface EnrolledCourse {
    id: number;
    title: string;
    slug: string;
    duration: string;
    progress?: number;
}

// Mock Data
const enrolledCourses: EnrolledCourse[] = [
    {
        id: 1,
        title: "Full Stack Development",
        slug: "full-stack-web",
        duration: "3 Months",
        progress: 35
    },
    {
        id: 2,
        title: "Python Backend Development",
        slug: "python-backend-development",
        duration: "2 Months",
        progress: 0
    },
    {
        id: 3,
        title: "UI/UX Design Masterclass",
        slug: "ui-ux-design",
        duration: "4 Weeks",
        progress: 15
    }
];

const mockQuestions: Question[] = [
    {
        id: 1,
        question_text: "What does HTML stand for?",
        option_a: "Hyper Text Markup Language",
        option_b: "High Tech Modern Language",
        option_c: "Hyperlink and Text Markup Language",
        option_d: "Home Tool Markup Language",
        correct_answer: "a"
    },
    {
        id: 2,
        question_text: "Which CSS property controls the text size?",
        option_a: "text-style",
        option_b: "font-size",
        option_c: "text-size",
        option_d: "font-style",
        correct_answer: "b"
    },
    {
        id: 3,
        question_text: "What is the correct JavaScript syntax to change the content of the HTML element below?\n\n<p id=\"demo\">This is a demonstration.</p>",
        option_a: "document.getElement(\"p\").innerHTML = \"Hello World!\";",
        option_b: "#demo.innerHTML = \"Hello World!\";",
        option_c: "document.getElementById(\"demo\").innerHTML = \"Hello World!\";",
        option_d: "document.getElementByName(\"p\").innerHTML = \"Hello World!\";",
        correct_answer: "c"
    },
    {
        id: 4,
        question_text: "How do you create a function in JavaScript?",
        option_a: "function = myFunction()",
        option_b: "function myFunction()",
        option_c: "function:myFunction()",
        option_d: "create myFunction()",
        correct_answer: "b"
    },
    {
        id: 5,
        question_text: "Which HTML attribute specifies an alternate text for an image, if the image cannot be displayed?",
        option_a: "src",
        option_b: "title",
        option_c: "longdesc",
        option_d: "alt",
        correct_answer: "d"
    }
];

const mockQuestionsJs: Question[] = [
    {
        id: 1,
        question_text: "Which of the following is used to declare a variable in JavaScript?",
        option_a: "var",
        option_b: "let",
        option_c: "const",
        option_d: "All of the above",
        correct_answer: "d"
    },
    {
        id: 2,
        question_text: "What is the output of '2' + 2 in JavaScript?",
        option_a: "4",
        option_b: "22",
        option_c: "NaN",
        option_d: "Error",
        correct_answer: "b"
    },
    {
        id: 3,
        question_text: "Which method is used to add an element to the end of an array?",
        option_a: "push()",
        option_b: "pop()",
        option_c: "shift()",
        option_d: "unshift()",
        correct_answer: "a"
    },
    {
        id: 4,
        question_text: "What does '===' operator do in JavaScript?",
        option_a: "Assigns a value",
        option_b: "Compares only values",
        option_c: "Compares values and types",
        option_d: "None of the above",
        correct_answer: "c"
    },
    {
        id: 5,
        question_text: "Which keyword is used to skip the current iteration of a loop?",
        option_a: "break",
        option_b: "stop",
        option_c: "continue",
        option_d: "skip",
        correct_answer: "c"
    }
];

const mockExams: Exam[] = [
    {
        id: 1,
        course_id: 1,
        course_slug: "full-stack-web",
        exam_slug: "html-css-mastery",
        is_published: true,
        exam_title: "HTML & CSS Core Mastery Exam",
        course_name: "Full Stack Development",
        module_name: "Module 1 & 2",
        time_limit: 15,
        total_questions: 5,
        pass_mark: 60,
        attempt_limit: 3,
        status: "Not Started",
        questions: mockQuestions
    },
    {
        id: 2,
        course_id: 1,
        course_slug: "full-stack-web",
        exam_slug: "javascript-fundamentals-quiz",
        is_published: true,
        exam_title: "JavaScript Fundamentals Quiz",
        course_name: "Full Stack Development",
        module_name: "Module 3",
        time_limit: 20,
        total_questions: 5,
        pass_mark: 70,
        attempt_limit: 2,
        status: "Completed",
        previous_score: 4,
        questions: mockQuestionsJs,
        previous_answers: {
            0: "d",
            1: "b",
            2: "a",
            3: "b", // wrong, correct is c
            4: "c"
        }
    },
    {
        id: 3,
        course_id: 2,
        course_slug: "python-backend-development",
        exam_slug: "python-basics",
        is_published: true,
        exam_title: "Python Basic assessment",
        course_name: "Python Backend Development",
        module_name: "Module 1",
        time_limit: 30,
        total_questions: 20,
        pass_mark: 60,
        attempt_limit: 1,
        status: "Not Started",
        questions: []
    }
];

const StudentExams = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { courseSlug, examSlug } = useParams();
    const [activeView, setActiveView] = useState<ActiveView>("list");
    const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isDeclared, setIsDeclared] = useState(false);

    // Active Exam state
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

    // Derived State
    const activeCourse = useMemo(() => 
        enrolledCourses.find(c => c.slug === courseSlug),
    [courseSlug]);

    const activeExam = useMemo(() => 
        mockExams.find(e => e.exam_slug === examSlug && e.course_slug === courseSlug),
    [courseSlug, examSlug]);

    // Handle initial routing to Level 3
    useEffect(() => {
        const path = location.pathname;
        if (examSlug && activeExam) {
            setSelectedExam(activeExam);
            
            // Hydrate answers if completed and available
            if (activeExam.status === "Completed" && activeExam.previous_answers) {
                setAnswers(activeExam.previous_answers);
            } else if (activeView === "detail" || activeView === "list") {
                // Clear answers when visiting a new exam's instructions or list
                setAnswers({});
            }

            if (path.endsWith("/details/review")) {
                setActiveView("review");
            } else if (path.endsWith("/details")) {
                setActiveView("result");
            } else {
                // Default to detail (instructions) if not playing
                if (activeView !== "playing") {
                    setActiveView("detail");
                }
            }
        } else if (courseSlug && activeCourse) {
            setActiveView("list");
        } else {
            setActiveView("list");
        }
    }, [courseSlug, examSlug, activeExam, activeCourse, location.pathname, activeView]);

    // Reset declaration on view change
    useEffect(() => {
        setIsDeclared(false);
    }, [activeView]);

    // Formatting helpers
    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    // Timer Effect
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (activeView === "playing" && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (activeView === "playing" && timeLeft <= 0) {
            handleSubmitExam();
        }
        return () => clearInterval(timer);
    }, [activeView, timeLeft]);

    // Handlers
    const beginExam = () => {
        if (selectedExam) {
            setAnswers({});
            setCurrentQuestionIndex(0);
            setTimeLeft(selectedExam.time_limit * 60);
            setActiveView("playing");
        }
    };

    const handleSelectOption = (optionKey: string) => {
        setAnswers(prev => ({
            ...prev,
            [currentQuestionIndex]: optionKey
        }));
    };

    const handleSubmitExam = () => {
        setShowConfirmSubmit(false);
        if (selectedExam) {
            selectedExam.status = "Completed";
            // Navigate to results page
            navigate(`/student/exam/${courseSlug}/${selectedExam.exam_slug}/details`);
        }
    };

    // --- Views ---

    const renderCourseListView = () => {
        const filteredCourses = enrolledCourses.filter(course =>
            course.title.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return (
            <div className="space-y-8 animate-fade-in max-w-6xl mx-auto pb-10">
                <div className="mb-8">
                    <div className="space-y-2">
                        <h1 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">
                            Exams & Assessments
                        </h1>
                        <p className="text-muted-foreground text-sm font-medium">
                            Select a course to view available exams.
                        </p>
                    </div>
                </div>

                {/* Standardized Search Bar */}
                <PageSearch
                    placeholder="Search courses by title..."
                    onSearch={setSearchQuery}
                    className="mb-10"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => (
                        <CourseCard
                            key={course.id}
                            title={course.title}
                            category={course.progress !== undefined ? `${course.progress}% Complete` : undefined}
                            duration={`${course.duration} Program`}
                            icon={BookOpen}
                            onDetailsClick={() => {
                                toast.info(`Viewing exams for ${course.title}`);
                                navigate(`/student/exam/${course.slug}`);
                            }}
                            onActionClick={() => {
                                toast.info(`Accessing ${course.title} exam area`);
                                navigate(`/student/exam/${course.slug}`);
                            }}
                            actionText="View Exams"
                            actionIcon={ArrowRight}
                        />
                    ))}

                </div>
            </div>
        );
    };

    const renderExamListView = () => {
        if (!activeCourse) return null;

        const availableExams = mockExams.filter(exam =>
            exam.course_slug === courseSlug && exam.is_published
        );

        const filteredExams = availableExams.filter(exam =>
            exam.exam_title.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return (
            <div className="space-y-8 animate-fade-in max-w-6xl mx-auto pb-10">
                <div className="mb-8 p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-center justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">
                            Available Exams
                        </h1>
                        <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-primary" />
                            {activeCourse.title}
                        </p>
                    </div>
                </div>

                {/* Standardized Search Bar */}
                <PageSearch
                    placeholder="Search exams by title..."
                    onSearch={setSearchQuery}
                    className="mb-10"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredExams.map((exam) => (
                        <CourseCard
                            key={exam.id}
                            title={exam.exam_title}
                            category={exam.status}
                            categoryVariant={exam.status === "Completed" ? "secondary" : "default"}
                            duration={exam.module_name || "Assessment"}
                            description={`${exam.total_questions} Questions • ${exam.time_limit} Mins`}
                            showProgress={false}
                            icon={PencilLine}
                            onDetailsClick={() => {
                                toast.info(`Loading details for ${exam.exam_title}`);
                                navigate(`/student/exam/${courseSlug}/${exam.exam_slug}${exam.status === "Completed" ? "/details" : ""}`);
                            }}
                            onActionClick={() => {
                                if (exam.status === "Completed") {
                                    toast.success(`Viewing results for ${exam.exam_title}`);
                                    navigate(`/student/exam/${courseSlug}/${exam.exam_slug}/details`);
                                } else {
                                    toast.info(`Preparing ${exam.exam_title}`);
                                    navigate(`/student/exam/${courseSlug}/${exam.exam_slug}`);
                                }
                            }}
                            actionText={exam.status === "Completed" ? "View Details" : "Start Exam"}
                            actionIcon={ArrowRight}
                            actionClassName={exam.status === "Completed" ? "bg-slate-800 hover:bg-slate-900 shadow-slate-200" : ""}
                        />
                    ))}

                    {filteredExams.length === 0 && (
                        <div className="col-span-full py-20 text-center bg-muted/20 rounded-3xl border border-dashed border-border/50">
                            <p className="text-muted-foreground font-medium text-sm">No exams found matching your search.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderExamDetailView = () => {
        if (!selectedExam) return null;

        return (
            <div className="mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-5 sm:space-y-8">
                <Card className="border-border/50 bg-card overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] shadow-xl sm:shadow-2xl shadow-primary/5 mx-auto">
                    {/* Header */}
                    <div className="bg-gradient-to-br from-primary/10 via-background to-background p-5 sm:p-12 border-b border-border/40">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-8">
                            <div className="flex-1 space-y-3 sm:space-y-4">
                                <Badge variant="outline" className="font-black uppercase tracking-widest text-[9px] px-3 border-primary/20 text-primary bg-primary/5">Examination Hub</Badge>
                                <h2 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight leading-[1.05]">
                                  {selectedExam.exam_title}
                                </h2>
                                <p className="text-muted-foreground font-bold text-base sm:text-lg">
                                  {selectedExam.course_name} {selectedExam.module_name ? `• ${selectedExam.module_name}` : ""}
                                </p>
                            </div>
                            <div className="shrink-0">
                                <Badge 
                                    className={cn(
                                        "rounded-xl px-5 py-2 text-xs font-black uppercase tracking-widest",
                                        selectedExam.status === "Completed" ? "bg-green-500 text-white" : "bg-primary text-white"
                                    )}
                                >
                                    {selectedExam.status}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <CardContent className="p-5 sm:p-12 space-y-8 sm:space-y-12">
                        {/* Metrics Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                            <div className="bg-muted/30 p-4 sm:p-6 rounded-2xl border border-border/40 space-y-2">
                                <div className="flex items-center gap-2 text-muted-foreground/60">
                                    <Clock className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Duration</span>
                                </div>
                                <p className="text-2xl font-black text-foreground">{selectedExam.time_limit} Mins</p>
                            </div>
                            <div className="bg-muted/30 p-4 sm:p-6 rounded-2xl border border-border/40 space-y-2">
                                <div className="flex items-center gap-2 text-muted-foreground/60">
                                    <BookOpen className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Questions</span>
                                </div>
                                <p className="text-2xl font-black text-foreground">{selectedExam.total_questions}</p>
                            </div>
                            <div className="bg-muted/30 p-4 sm:p-6 rounded-2xl border border-border/40 space-y-2">
                                <div className="flex items-center gap-2 text-muted-foreground/60">
                                    <GraduationCap className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Pass Mark</span>
                                </div>
                                <p className="text-2xl font-black text-foreground">{selectedExam.pass_mark}%</p>
                            </div>
                            <div className="bg-muted/30 p-4 sm:p-6 rounded-2xl border border-border/40 space-y-2">
                                <div className="flex items-center gap-2 text-muted-foreground/60">
                                    <AlertCircle className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Attempts</span>
                                </div>
                                <p className="text-2xl font-black text-foreground">{selectedExam.attempt_limit}</p>
                            </div>
                        </div>

                        {/* Instructions Section */}
                        <div className="space-y-6">
                            <h3 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-3">
                                <div className="w-1.5 h-6 bg-primary rounded-full" />
                                Exam Instructions
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 sm:gap-y-6 bg-muted/20 p-4 sm:p-8 rounded-3xl border border-border/40">
                                <div className="flex gap-4 items-start">
                                    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 font-bold text-xs shadow-inner">1</div>
                                    <p className="text-sm text-muted-foreground font-medium leading-relaxed">Ensure a stable internet connection. The timer will not pause once started.</p>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 font-bold text-xs shadow-inner">2</div>
                                    <p className="text-sm text-muted-foreground font-medium leading-relaxed">Multiple choice format. You can navigate between questions freely.</p>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 font-bold text-xs shadow-inner">3</div>
                                    <p className="text-sm text-muted-foreground font-medium leading-relaxed">Passing the assessment requires matching or exceeding the {selectedExam.pass_mark}% mark.</p>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 font-bold text-xs shadow-inner">4</div>
                                    <p className="text-sm text-muted-foreground font-medium leading-relaxed">Review all responses before the final submission. Results are generated instantly.</p>
                                </div>
                            </div>
                        </div>

                        {/* Declaration Section */}
                        <div className="space-y-6">
                            <div className="p-4 sm:p-8 rounded-3xl border-2 border-primary/20 bg-primary/[0.02] space-y-4 sm:space-y-6">
                                <div className="flex items-center gap-3 text-primary">
                                    <ShieldCheck className="w-6 h-6" />
                                    <h3 className="text-lg sm:text-xl font-bold tracking-tight">Final Declaration</h3>
                                </div>
                                <div className="space-y-4">
                                    <p className="text-sm text-foreground/80 font-bold leading-relaxed italic">
                                        "I understand that this exam is a formal assessment and any form of malpractice will lead to disqualification.
                                        I will not access external resources or switch tabs during the examination window."
                                    </p>
                                    
                                    <div className={cn(
                                        "flex flex-row items-center space-x-3 space-y-0 rounded-2xl border p-4 transition-all duration-300",
                                        isDeclared ? "bg-primary/10 border-primary shadow-sm" : "bg-muted/30 border-border/60 hover:border-primary/40"
                                    )}>
                                        <Checkbox 
                                            id="declaration" 
                                            checked={isDeclared} 
                                            onCheckedChange={(checked) => setIsDeclared(!!checked)}
                                            className="w-5 h-5 rounded-md border-2"
                                        />
                                        <label
                                            htmlFor="declaration"
                                            className="text-sm font-bold text-foreground cursor-pointer select-none"
                                        >
                                            I agree to the above declaration
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row gap-3 sm:gap-4">
                            <Button 
                                variant="outline" 
                                className="sm:flex-1 h-12 sm:h-14 rounded-2xl font-black uppercase tracking-[0.16em] sm:tracking-[0.2em] text-[11px] sm:text-xs border-2 hover:bg-muted"
                                onClick={() => navigate(`/student/exam/${courseSlug}`)}
                            >
                                Not Today
                            </Button>
                            <Button 
                                className={cn(
                                    "sm:flex-1 h-12 sm:h-14 rounded-2xl font-black uppercase tracking-[0.16em] sm:tracking-[0.2em] text-[11px] sm:text-xs transition-all duration-500",
                                    isDeclared || selectedExam.status === "Completed" ? "bg-primary shadow-2xl shadow-primary/30" : "bg-muted text-muted-foreground/40_cursor-not-allowed"
                                )}
                                disabled={!isDeclared && selectedExam.status !== "Completed"}
                                onClick={() => {
                                    if (selectedExam.status === "Completed") {
                                        navigate(`/student/exam/${courseSlug}/${selectedExam.exam_slug}/details`);
                                    } else {
                                        beginExam();
                                    }
                                }}
                            >
                                {selectedExam.status === "Completed" ? "View Results" : "Start Examination"}
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    };

    const renderListView = () => {
        if (examSlug) return renderExamDetailView();
        return courseSlug ? renderExamListView() : renderCourseListView();
    };

    const renderPlayingView = () => {
        if (!selectedExam || selectedExam.questions.length === 0) return null;

        const question = selectedExam.questions[currentQuestionIndex];
        const isLastQuestion = currentQuestionIndex === selectedExam.questions.length - 1;
        const isLowTime = timeLeft < 300; // less than 5 minutes

        return (
            <div className="mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col xl:flex-row gap-8 pb-10">
                {/* Left Column: Question Area */}
                <div className="flex-1 space-y-6">
                    {/* Question Card */}
                    <Card className="border-border/50 bg-card shadow-lg shadow-black/[0.02] rounded-3xl overflow-hidden">
                        <CardContent className="p-8 sm:p-12">
                            <div className="mb-10">
                                <Badge variant="outline" className="mb-6 font-black uppercase tracking-widest text-[10px] px-3 border-primary/20 text-primary">Question {currentQuestionIndex + 1}</Badge>
                                <h3 className="text-xl sm:text-2xl font-bold text-foreground leading-tight whitespace-pre-wrap tracking-tight">
                                    {question.question_text}
                                </h3>
                            </div>

                            <div className="space-y-4">
                                {['a', 'b', 'c', 'd'].map((opt) => {
                                    const key = `option_${opt}` as keyof Question;
                                    const isSelected = answers[currentQuestionIndex] === opt;

                                    return (
                                        <div
                                            key={opt}
                                            onClick={() => handleSelectOption(opt)}
                                            className={cn(
                                                "p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex items-center gap-3 sm:gap-5 group transform hover:scale-[1.01]",
                                                isSelected 
                                                    ? "border-primary bg-primary/[0.03] shadow-inner shadow-primary/5" 
                                                    : "border-border/40 bg-muted/10 hover:border-primary/30 hover:bg-muted/20"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300",
                                                isSelected ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "border-muted-foreground/30 group-hover:border-primary/40 bg-white"
                                            )}>
                                                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-primary-foreground animate-in zoom-in duration-300" />}
                                            </div>
                                            <span
                                                className={cn(
                                                    "min-w-0 whitespace-normal break-words text-sm sm:text-base leading-relaxed font-semibold transition-colors duration-300",
                                                    isSelected ? "text-foreground" : "text-muted-foreground group-hover:text-foreground",
                                                )}
                                            >
                                                {question[key]}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Footer */}
                    <div className="flex flex-col gap-3 bg-card p-4 sm:p-5 rounded-2xl border border-border/50 shadow-sm md:flex-row md:items-center md:justify-between">
                        <Button
                            variant="ghost"
                            className="h-11 w-full rounded-xl font-bold text-xs uppercase tracking-widest px-4 sm:px-6 md:w-auto"
                            disabled={currentQuestionIndex === 0}
                            onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                        >
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            Previous
                        </Button>

                        {!isLastQuestion ? (
                            <Button className="h-11 w-full rounded-xl font-bold text-xs uppercase tracking-[0.14em] sm:tracking-widest px-4 sm:px-8 shadow-lg shadow-primary/10 md:h-12 md:w-auto" onClick={() => setCurrentQuestionIndex(prev => prev + 1)}>
                                Next Question
                                <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        ) : (
                            <Button
                                variant="default"
                                className="h-11 w-full bg-primary hover:bg-primary/90 rounded-xl font-bold text-xs uppercase tracking-[0.14em] sm:tracking-widest px-4 sm:px-10 shadow-lg shadow-primary/20 animate-in fade-in duration-500 md:h-12 md:w-auto"
                                onClick={() => setShowConfirmSubmit(true)}
                            >
                                Submit Exam
                                <Send className="w-4 h-4 ml-2" />
                            </Button>
                        )}
                    </div>
                </div>

                {/* Right Column: Navigator */}
                <div className="xl:w-80 shrink-0 space-y-4">
                    <Card className="border-border/50 bg-card shadow-xl shadow-black/[0.02] rounded-3xl sticky top-6">
                        <CardContent className="p-6">
                            <h3 className="font-bold text-foreground text-base mb-6 border-b border-border/40 pb-4 uppercase tracking-widest text-[11px]">Question Navigator</h3>

                            <div className="grid grid-cols-5 gap-2.5 mb-8">
                                {selectedExam.questions.map((_, idx) => {
                                    const isAnswered = answers[idx] !== undefined;
                                    const isActive = currentQuestionIndex === idx;

                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentQuestionIndex(idx)}
                                            className={cn(
                                                "w-full aspect-square rounded-xl text-xs font-black transition-all duration-300 flex items-center justify-center border-2",
                                                isActive ? "border-primary bg-primary/5 text-primary scale-110 shadow-lg shadow-primary/10" : "",
                                                isAnswered && !isActive ? "bg-primary border-primary text-primary-foreground hover:bg-primary/90" : "",
                                                !isAnswered && !isActive ? "bg-muted/20 text-muted-foreground/60 hover:bg-muted/40 border-transparent" : "",
                                                isActive && isAnswered ? "bg-primary text-primary-foreground border-primary" : ""
                                            )}
                                        >
                                            {idx + 1}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="space-y-3 pt-6 border-t border-border/40">
                                <div className="flex items-center gap-3">
                                    <div className="w-3.5 h-3.5 rounded-md bg-primary" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Answered</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-3.5 h-3.5 rounded-md bg-muted/30 border border-border/50" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Unanswered</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-3.5 h-3.5 rounded-md border-2 border-primary bg-primary/5" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Current</span>
                                </div>
                            </div>

                            <Button
                                variant="destructive"
                                className="w-full mt-10 rounded-xl font-bold text-xs uppercase tracking-widest h-12 shadow-lg shadow-destructive/10"
                                onClick={() => setShowConfirmSubmit(true)}
                            >
                                Finish Attempt
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 bg-card shadow-sm rounded-3xl">
                        <CardContent className="p-5 space-y-4">
                            <div>
                                <h2 className="font-bold text-foreground text-base leading-tight">{selectedExam.exam_title}</h2>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mt-1">
                                    Question {currentQuestionIndex + 1} of {selectedExam.total_questions}
                                </p>
                            </div>
                            <div className={cn(
                                "flex items-center justify-center gap-2.5 rounded-xl px-4 py-3 font-mono text-2xl font-black transition-all duration-300",
                                isLowTime
                                    ? "animate-pulse border border-destructive/20 bg-destructive/10 text-destructive"
                                    : "border border-primary/20 bg-primary/5 text-primary"
                            )}>
                                <Clock className="h-6 w-6" />
                                {formatTime(timeLeft)}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Submit Confirmation Dialog */}
                <AlertDialog open={showConfirmSubmit} onOpenChange={setShowConfirmSubmit}>
                    <AlertDialogContent className="rounded-3xl border-border/50 shadow-2xl">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-xl font-bold">End Exam Attempt?</AlertDialogTitle>
                            <AlertDialogDescription className="text-base font-medium leading-relaxed">
                                You have answered <span className="text-primary font-bold">{Object.keys(answers).length}</span> out of <span className="font-bold">{selectedExam.total_questions}</span> questions.
                                Once submitted, your answers will be finalized and marked immediately.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="mt-6 gap-3">
                            <AlertDialogCancel className="rounded-xl font-bold border-border/50 h-11">Continue Exam</AlertDialogCancel>
                            <AlertDialogAction onClick={handleSubmitExam} className="bg-primary hover:bg-primary/90 rounded-xl font-bold px-8 h-11">
                                Yes, Submit Now
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        );
    };

    const renderResultView = () => {
        if (!selectedExam) return null;

        if (selectedExam.status === "Completed" && (!selectedExam.questions || selectedExam.questions.length === 0)) {
            return (
                <div className="mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700 mt-20 text-center space-y-6">
                    <div className="w-20 h-20 bg-muted rounded-3xl mx-auto flex items-center justify-center text-muted-foreground/40">
                        <AlertCircle className="w-10 h-10" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-black text-foreground">No Result Data Available</h2>
                        <p className="text-muted-foreground font-medium">We couldn't find the detailed breakdown for this attempt.</p>
                    </div>
                    <Button variant="outline" className="rounded-xl px-8" onClick={() => navigate(`/student/exam/${courseSlug}`)}>
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Back to Exams
                    </Button>
                </div>
            );
        }

        let correctCount = 0;
        if (selectedExam.questions && selectedExam.questions.length > 0) {
            selectedExam.questions.forEach((q, idx) => {
                if (answers[idx] === q.correct_answer) {
                    correctCount++;
                }
            });
        } else if (selectedExam.previous_score !== undefined) {
            correctCount = selectedExam.previous_score;
        }

        const totalQuestions = selectedExam.total_questions;
        const wrongCount = totalQuestions - correctCount;
        const percentage = Math.round((correctCount / totalQuestions) * 100);
        const passed = percentage >= selectedExam.pass_mark;

        return (
            <div className="mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700 mt-6 mb-12">
                <Card className={cn(
                    "bg-card overflow-hidden shadow-2xl rounded-[2.5rem] border-t-8 mx-auto",
                    passed ? "border-t-green-500 shadow-green-500/5" : "border-t-destructive shadow-destructive/5"
                )}>
                    <div className="p-10 text-center border-b border-border/40 flex flex-col items-center bg-gradient-to-b from-muted/20 to-transparent">
                        {passed ? (
                            <div className="w-24 h-24 rounded-[2rem] bg-green-500/10 flex items-center justify-center text-green-500 mb-8 shadow-inner animate-in zoom-in-50 duration-500">
                                <Trophy className="w-12 h-12" />
                            </div>
                        ) : (
                            <div className="w-24 h-24 rounded-[2rem] bg-destructive/10 flex items-center justify-center text-destructive mb-8 shadow-inner animate-in zoom-in-50 duration-500">
                                <AlertCircle className="w-12 h-12" />
                            </div>
                        )}

                        <h2 className="text-3xl font-black text-foreground mb-2 tracking-tight">Exam Performance Summary</h2>
                        <p className="text-muted-foreground text-lg font-bold mb-8 uppercase tracking-widest text-[11px] opacity-60">{selectedExam.exam_title}</p>

                        <div className={cn(
                            "inline-flex items-center gap-2 px-6 py-2 rounded-2xl font-black text-xs uppercase tracking-[0.2em] mb-10 shadow-lg",
                            passed ? "bg-green-500 text-white shadow-green-500/20" : "bg-destructive text-white shadow-destructive/20"
                        )}>
                            {passed ? "Status: Qualified" : "Status: Retake Recommended"}
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px w-full bg-border/20 rounded-3xl overflow-hidden border border-border/40 shadow-inner">
                            <div className="bg-muted/10 p-6 font-mono">
                                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-2 opacity-60">Total</p>
                                <p className="text-2xl font-black text-foreground tabular-nums">{totalQuestions}</p>
                            </div>
                            <div className="bg-muted/10 p-6 font-mono">
                                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-2 opacity-60">Correct</p>
                                <p className="text-2xl font-black text-green-600 tabular-nums">{correctCount}</p>
                            </div>
                            <div className="bg-muted/10 p-6 font-mono">
                                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-2 opacity-60">Wrong</p>
                                <p className="text-2xl font-black text-destructive tabular-nums">{wrongCount}</p>
                            </div>
                            <div className="bg-muted/10 p-6 font-mono">
                                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-2 opacity-60">Final Score</p>
                                <p className={cn("text-2xl font-black tabular-nums", passed ? "text-primary" : "text-destructive")}>{percentage}%</p>
                            </div>
                        </div>

                        <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/60 mt-8 flex items-center gap-2">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Passing Threshold: {selectedExam.pass_mark}%
                        </p>
                    </div>

                    <CardContent className="p-8 bg-muted/5 flex flex-col sm:flex-row gap-4">
                        <Button 
                            variant="outline" 
                            className="sm:flex-1 rounded-2xl h-14 font-black uppercase tracking-widest text-xs border-2 border-border/40 hover:bg-muted hover:border-border/60 transition-all" 
                            onClick={() => navigate(`/student/exam/${courseSlug}`)}
                        >
                            <Home className="w-4 h-4 mr-2" />
                            Exit to Exams
                        </Button>
                        <Button 
                            className="sm:flex-1 rounded-2xl h-14 font-black uppercase tracking-widest text-xs bg-primary shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all" 
                            variant="default" 
                            onClick={() => navigate(`/student/exam/${courseSlug}/${examSlug}/details/review`)}
                        >
                            <Search className="w-4 h-4 mr-2" />
                            Review Analysis
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    };

    const renderReviewView = () => {
        if (!selectedExam) return null;

        let score = 0;
        selectedExam.questions.forEach((q, idx) => {
            if (answers[idx] === q.correct_answer) {
                score++;
            }
        });
        const total = selectedExam.total_questions;
        const percentage = Math.round((score / total) * 100);

        return (
            <div className="mx-auto mt-4 animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-6 pb-16 sm:space-y-8 sm:pb-20">
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <Button
                        variant="ghost"
                        className="text-muted-foreground hover:text-foreground pl-0 group font-black uppercase tracking-widest text-[10px]"
                        onClick={() => navigate(`/student/exam/${courseSlug}/${examSlug}/details`)}
                    >
                        <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Performance Summary
                    </Button>
                    
                    <div className="flex w-full items-center justify-center gap-4 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 shadow-sm sm:w-auto sm:gap-6 sm:rounded-3xl sm:px-8 sm:py-4">
                        <div className="text-center">
                            <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest mb-0.5 opacity-60">Accuracy</p>
                            <p className="text-base font-black text-primary tabular-nums">{percentage}%</p>
                        </div>
                        <div className="w-px h-8 bg-primary/20" />
                        <div className="text-center">
                            <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest mb-0.5 opacity-60">Score</p>
                            <p className="text-base font-black text-primary tabular-nums">{score} / {total}</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-3xl border-y border-r border-l-[8px] border-l-primary border-border/50 bg-card p-5 shadow-xl shadow-black/[0.02] sm:rounded-[2.5rem] sm:border-l-[12px] sm:p-10 md:p-12">
                <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center lg:gap-6">
                        <div className="min-w-0">
                            <h2 className="mb-2 break-words text-[clamp(1.125rem,1rem+0.6vw,1.625rem)] font-black tracking-tight text-foreground sm:mb-3">{selectedExam.exam_title}</h2>
                            <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs opacity-70 flex items-center gap-2">
                                <BookOpen className="w-4 h-4" />
                                {selectedExam.course_name} • Knowledge Review
                            </p>
                        </div>
                        <Button 
                            variant="outline" 
                            className="min-h-11 w-full rounded-xl border-border/60 px-4 text-xs font-bold uppercase tracking-widest hover:bg-muted lg:w-auto"
                            onClick={() => navigate(`/student/exam/${courseSlug}`)}
                        >
                            Exit Review
                        </Button>
                    </div>
                </div>

                {selectedExam.questions.length === 0 ? (
                    <div className="py-20 text-center bg-muted/20 rounded-[2.5rem] border border-dashed border-border/50">
                        <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                        <p className="text-muted-foreground font-bold text-lg">No question-level data available for review.</p>
                        <p className="text-muted-foreground/60 text-sm mt-1">This may happen for legacy attempts or quizzes without stored sessions.</p>
                    </div>
                ) : (
                    <div className="space-y-8 sm:space-y-12">
                    {selectedExam.questions.map((question, qIdx) => {
                        const studentAns = answers[qIdx];
                        const isCorrect = studentAns === question.correct_answer;
                        const letterMap: Record<string, string> = { "a": "A", "b": "B", "c": "C", "d": "D" };

                        return (
                            <Card key={question.id} className={cn(
                                "overflow-hidden rounded-3xl border-y border-r border-l-[6px] border-border/40 shadow-md transition-all duration-300 sm:rounded-[2.5rem] sm:border-l-[10px]",
                                isCorrect ? "border-l-green-500 shadow-green-500/[0.03]" : "border-l-destructive shadow-destructive/[0.03]"
                            )}>
                                <CardContent className="p-5 sm:p-8 lg:p-10">
                                    <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:mb-10 sm:flex-row sm:items-center">
                                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                            <Badge variant="outline" className="bg-primary/5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-primary border-primary/20 sm:px-4">Question {qIdx + 1}</Badge>
                                            {isCorrect ? (
                                                <Badge className="bg-green-500/10 text-green-600 border-none px-4 py-1.5 font-bold text-[10px] uppercase tracking-widest flex items-center gap-1.5">
                                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                                    Perfect
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-destructive/10 text-destructive border-none px-4 py-1.5 font-bold text-[10px] uppercase tracking-widest flex items-center gap-1.5">
                                                    <XCircle className="w-3.5 h-3.5" />
                                                    Misstep
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    <h3 className="mb-8 whitespace-pre-wrap break-words text-base font-bold leading-tight tracking-tight text-foreground sm:mb-12 sm:text-lg">
                                        {question.question_text}
                                    </h3>

                                    <div className="mb-8 grid grid-cols-1 gap-4 sm:mb-12 lg:grid-cols-2 sm:gap-6">
                                        {['a', 'b', 'c', 'd'].map((key) => {
                                            const optionKey = `option_${key}` as keyof Question;
                                            const isStudentSelected = studentAns === key;
                                            const isActuallyCorrect = question.correct_answer === key;

                                            return (
                                                <div
                                                    key={key}
                                                    className={cn(
                                                        "group relative flex min-h-11 items-start gap-4 rounded-2xl border-2 p-4 pr-10 text-sm font-bold transition-all duration-500 sm:gap-6 sm:rounded-[1.5rem] sm:p-6",
                                                        isActuallyCorrect 
                                                            ? "bg-green-500/10 border-green-500/50 text-green-700 ring-4 ring-green-500/5 shadow-inner" 
                                                            : (isStudentSelected && !isCorrect ? "bg-destructive/5 border-destructive/50 text-destructive/80" : "bg-muted/10 border-border/40 text-muted-foreground/50 opacity-60")
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "w-9 h-9 rounded-xl flex items-center justify-center text-[10px] font-black shrink-0 shadow-lg transition-all duration-500",
                                                        isActuallyCorrect ? "bg-green-500 text-white scale-110 rotate-3" :
                                                            (isStudentSelected && !isCorrect ? "bg-destructive text-white -rotate-3" : "bg-muted-foreground/20 text-muted-foreground")
                                                    )}>
                                                        {letterMap[key]}
                                                    </div>
                                                    <span className="min-w-0 flex-1 break-words leading-snug">{question[optionKey]}</span>
                                                    {isActuallyCorrect && (
                                                        <div className="absolute -top-3 -right-3">
                                                            <div className="bg-green-500 text-white p-2 rounded-xl shadow-lg animate-in zoom-in duration-500">
                                                                <CheckCircle2 className="w-4 h-4" />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="flex flex-col gap-5 border-t border-border/40 pt-6 sm:flex-row sm:flex-wrap sm:gap-12 sm:pt-8">
                                        <div className="space-y-1.5">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
                                                <div className={cn("w-1.5 h-1.5 rounded-full", isCorrect ? "bg-green-500" : "bg-destructive")} />
                                                Your Response
                                            </p>
                                            <p className={cn("text-sm font-black uppercase tracking-tighter", isCorrect ? "text-green-600" : "text-destructive")}>
                                                {studentAns ? `Option ${letterMap[studentAns]}` : 'Not Attempted'}
                                            </p>
                                        </div>
                                        <div className="space-y-1.5">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                                Validated Answer
                                            </p>
                                            <p className="text-sm font-black uppercase text-green-600 tracking-tighter">
                                                Option {letterMap[question.correct_answer]}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

                <div className="flex flex-col justify-center gap-4 pb-10 pt-10 sm:flex-row sm:gap-6 sm:pb-12 sm:pt-16">
                    <Button variant="outline" size="lg" className="h-14 rounded-2xl border-2 px-6 text-[10px] font-black uppercase tracking-[0.18em] hover:bg-muted sm:h-16 sm:px-12 sm:text-xs" onClick={() => navigate(`/student/exam/${courseSlug}/${examSlug}/details`)}>
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Summary
                    </Button>
                    <Button size="lg" className="h-14 rounded-2xl px-6 text-[10px] font-black uppercase tracking-[0.18em] shadow-2xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 sm:h-16 sm:px-16 sm:text-xs" onClick={() => navigate(`/student/exam/${courseSlug}`)}>
                        Finish Review
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <DashboardLayout>
            <div className="animate-in fade-in duration-500 max-w-6xl mx-auto px-4 md:px-6 lg:px-8 pb-10">
                {activeView === "list" && renderListView()}
                {activeView === "detail" && renderExamDetailView()}
                {activeView === "playing" && renderPlayingView()}
                {activeView === "result" && renderResultView()}
                {activeView === "review" && renderReviewView()}
            </div>
        </DashboardLayout>
    );
};

export default StudentExams;
