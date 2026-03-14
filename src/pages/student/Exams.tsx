import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    PencilLine,
    Clock,
    BookOpen,
    CheckCircle2,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    Send,
    Search
} from "lucide-react";
import { useState, useEffect } from "react";
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
type ActiveView = "list" | "instructions" | "playing" | "result" | "review";

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
}

// Mock Data
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

const mockExams: Exam[] = [
    {
        id: 1,
        course_id: 1, // Full Stack Development
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
        course_id: 1, // Full Stack Development
        is_published: true,
        exam_title: "JavaScript Fundamentals Quiz",
        course_name: "Full Stack Development",
        module_name: "Module 3",
        time_limit: 20,
        total_questions: 10,
        pass_mark: 70,
        attempt_limit: 2,
        status: "Completed",
        previous_score: 8,
        questions: [] // Intentionally empty for demo
    },
    {
        id: 3,
        course_id: 2, // Python Backend Development
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
    const [activeView, setActiveView] = useState<ActiveView>("list");
    const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Active Exam state
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

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
            // Auto submit when time runs out
            handleSubmitExam();
        }
        return () => clearInterval(timer);
    }, [activeView, timeLeft]);

    // Handlers
    const handleStartExam = (exam: Exam) => {
        setSelectedExam(exam);
        if (exam.status === "Completed") {
            setActiveView("result");
        } else {
            setActiveView("instructions");
        }
    };

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
        setActiveView("result");

        // In a real app we would dispatch an API call here to save the result
        if (selectedExam) {
            selectedExam.status = "Completed";
        }
    };

    // --- Views ---

    const renderListView = () => {
        // In a real app, this would come from the student's actual enrollments
        const enrolledCourseIds = [1, 2, 3];

        const availableExams = mockExams.filter(exam =>
            enrolledCourseIds.includes(exam.course_id) && exam.is_published
        );

        // Apply Search Filtering
        const filteredExams = availableExams.filter(exam =>
            exam.exam_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            exam.course_name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        // Group filtered exams by course name
        const groupedExams = filteredExams.reduce((acc, exam) => {
            if (!acc[exam.course_name]) {
                acc[exam.course_name] = [];
            }
            acc[exam.course_name].push(exam);
            return acc;
        }, {} as Record<string, Exam[]>);

        return (
            <div className="space-y-10 animate-fade-in max-w-7xl mx-auto mt-2">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">
                            Exams & Assessments
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Test your knowledge and track your certification progress.
                        </p>
                    </div>

                    <div className="relative w-full md:w-80 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Search exams..."
                            className="w-full bg-card border border-border rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {Object.entries(groupedExams).length > 0 ? (
                    Object.entries(groupedExams).map(([courseName, exams]) => (
                        <div key={courseName} className="space-y-6">
                            <div className="flex items-center gap-4">
                                <h2 className="text-lg font-bold text-foreground whitespace-nowrap">{courseName}</h2>
                                <div className="h-px bg-border w-full" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                                {exams.map((exam) => (
                                    <Card key={exam.id} className="border-border/50 hover:border-primary/50 transition-colors bg-card hover:shadow-md flex flex-col h-full">
                                        <div className="p-6 flex flex-col h-full">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                                    <PencilLine className="w-6 h-6" />
                                                </div>
                                                <Badge variant={exam.status === "Completed" ? "default" : "secondary"}>
                                                    {exam.status}
                                                </Badge>
                                            </div>

                                            <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2">{exam.exam_title}</h3>
                                            <p className="text-sm text-muted-foreground mb-4 line-clamp-1">{exam.course_name}</p>

                                            <div className="flex flex-col gap-3 mt-auto pt-4 border-t border-border/50">
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-muted-foreground flex items-center gap-1.5"><BookOpen className="w-4 h-4" /> Questions</span>
                                                    <span className="font-semibold text-foreground">{exam.total_questions}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-muted-foreground flex items-center gap-1.5"><Clock className="w-4 h-4" /> Time Limit</span>
                                                    <span className="font-semibold text-foreground">{exam.time_limit} Mins</span>
                                                </div>

                                                <Button
                                                    className={cn("w-full mt-4 gap-2", exam.status === "Completed" ? "bg-secondary text-secondary-foreground hover:bg-secondary/80" : "bg-primary hover:bg-primary/90")}
                                                    onClick={() => handleStartExam(exam)}
                                                >
                                                    {exam.status === "Completed" ? "View Result" : "Start Exam"}
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-muted/20 rounded-2xl border border-dashed border-border">
                        <p className="text-muted-foreground">
                            {searchQuery ? `No exams found matching "${searchQuery}"` : "No exams available for your enrolled courses yet."}
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
        );
    };

    const renderInstructionsView = () => {
        if (!selectedExam) return null;

        return (
            <div className="max-w-3xl mx-auto animate-fade-in mt-4">
                <Button
                    variant="ghost"
                    className="text-muted-foreground hover:text-foreground pl-0 group mb-6"
                    onClick={() => setActiveView("list")}
                >
                    <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Exams
                </Button>

                <Card className="border-border/50 bg-card overflow-hidden">
                    <div className="bg-primary/5 px-6 py-8 border-b border-primary/10 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                            <AlertCircle className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-bold text-foreground mb-2">{selectedExam.exam_title}</h2>
                        <p className="text-muted-foreground">{selectedExam.course_name} {selectedExam.module_name ? `- ${selectedExam.module_name}` : ''}</p>
                    </div>

                    <CardContent className="p-6 sm:p-8 space-y-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-muted/30 p-4 rounded-xl border border-border/50">
                            <div className="text-center">
                                <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Questions</p>
                                <p className="text-lg font-semibold text-foreground">{selectedExam.total_questions}</p>
                            </div>
                            <div className="text-center border-l border-border/50">
                                <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Time Limit</p>
                                <p className="text-lg font-semibold text-foreground">{selectedExam.time_limit}m</p>
                            </div>
                            <div className="text-center border-l border-border/50">
                                <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Pass Mark</p>
                                <p className="text-lg font-semibold text-foreground">{selectedExam.pass_mark}%</p>
                            </div>
                            <div className="text-center border-l border-border/50">
                                <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Attempts</p>
                                <p className="text-lg font-semibold text-foreground">{selectedExam.attempt_limit}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-semibold text-foreground text-lg">Instructions</h3>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 shrink-0" />
                                    <span>This exam contains multiple choice questions (MCQ). Only one option can be selected per question.</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 shrink-0" />
                                    <span>You have a strict time limit to complete the exam. The timer will continuously run even if you switch tabs.</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-muted-foreground text-destructive font-medium">
                                    <div className="w-1.5 h-1.5 rounded-full bg-destructive/40 mt-1.5 shrink-0" />
                                    <span>Do not refresh the page during the exam. Doing so may result in an automatic submission.</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 shrink-0" />
                                    <span>Click "Submit Exam" when finished. Unanswered questions will be marked as incorrect.</span>
                                </li>
                            </ul>
                        </div>

                        <div className="pt-4 border-t flex justify-end">
                            <Button size="lg" className="w-full sm:w-auto" onClick={beginExam}>
                                I Understand, Start Exam
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    };

    const renderPlayingView = () => {
        if (!selectedExam || selectedExam.questions.length === 0) return null;

        const question = selectedExam.questions[currentQuestionIndex];
        const isLastQuestion = currentQuestionIndex === selectedExam.questions.length - 1;
        const isLowTime = timeLeft < 300; // less than 5 minutes

        return (
            <div className="max-w-6xl mx-auto animate-fade-in flex flex-col lg:flex-row gap-6 mt-2">

                {/* Left Column: Question Area */}
                <div className="flex-1 space-y-4">
                    {/* Top Bar */}
                    <div className="flex items-center justify-between bg-card p-4 rounded-xl border border-border/50 shadow-sm">
                        <div>
                            <h2 className="font-bold text-foreground">{selectedExam.exam_title}</h2>
                            <p className="text-xs text-muted-foreground hidden sm:block">Question {currentQuestionIndex + 1} of {selectedExam.total_questions}</p>
                        </div>
                        <div className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg font-bold transition-colors",
                            isLowTime ? "bg-destructive/10 text-destructive animate-pulse" : "bg-primary/10 text-primary"
                        )}>
                            <Clock className="w-5 h-5" />
                            {formatTime(timeLeft)}
                        </div>
                    </div>

                    {/* Question Card */}
                    <Card className="border-border/50 bg-card shadow-sm">
                        <CardContent className="p-6 sm:p-8">
                            <div className="mb-6">
                                <Badge variant="outline" className="mb-4">Question {currentQuestionIndex + 1}</Badge>
                                <h3 className="text-lg sm:text-xl font-medium text-foreground whitespace-pre-wrap">
                                    {question.question_text}
                                </h3>
                            </div>

                            <div className="space-y-3">
                                {['a', 'b', 'c', 'd'].map((opt) => {
                                    const key = `option_${opt}` as keyof Question;
                                    const isSelected = answers[currentQuestionIndex] === opt;

                                    return (
                                        <div
                                            key={opt}
                                            onClick={() => handleSelectOption(opt)}
                                            className={cn(
                                                "p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 flex items-center gap-4 group hover:border-primary/50",
                                                isSelected ? "border-primary bg-primary/5 shadow-sm" : "border-border/50 bg-transparent"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                                                isSelected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30 group-hover:border-primary/50"
                                            )}>
                                                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-primary-foreground" />}
                                            </div>
                                            <span className={cn("text-base", isSelected ? "text-foreground font-medium" : "text-muted-foreground group-hover:text-foreground")}>
                                                {question[key]}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Footer */}
                    <div className="flex justify-between items-center bg-card p-4 rounded-xl border border-border/50 shadow-sm">
                        <Button
                            variant="outline"
                            disabled={currentQuestionIndex === 0}
                            onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                        >
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            Previous
                        </Button>

                        {!isLastQuestion ? (
                            <Button onClick={() => setCurrentQuestionIndex(prev => prev + 1)}>
                                Next
                                <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        ) : (
                            <Button
                                variant="default"
                                className="bg-primary hover:bg-primary/90"
                                onClick={() => setShowConfirmSubmit(true)}
                            >
                                Submit Exam
                                <Send className="w-4 h-4 ml-2" />
                            </Button>
                        )}
                    </div>
                </div>

                {/* Right Column: Navigator */}
                <div className="lg:w-72 shrink-0">
                    <Card className="border-border/50 bg-card shadow-sm sticky top-6">
                        <CardContent className="p-5">
                            <h3 className="font-semibold text-foreground mb-4">Question Navigator</h3>

                            <div className="grid grid-cols-5 gap-2 mb-6">
                                {selectedExam.questions.map((_, idx) => {
                                    const isAnswered = answers[idx] !== undefined;
                                    const isActive = currentQuestionIndex === idx;

                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentQuestionIndex(idx)}
                                            className={cn(
                                                "w-full aspect-square rounded-md text-sm font-medium transition-all flex items-center justify-center border",
                                                isActive ? "ring-2 ring-primary ring-offset-2 ring-offset-background border-primary" : "",
                                                isAnswered && !isActive ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90" : "",
                                                !isAnswered && !isActive ? "bg-transparent text-muted-foreground hover:bg-muted border-border/50" : "",
                                                isActive && isAnswered ? "bg-primary text-primary-foreground" : "",
                                                isActive && !isAnswered ? "bg-background text-foreground border-primary" : ""
                                            )}
                                        >
                                            {idx + 1}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="space-y-2 text-sm text-muted-foreground border-t border-border/50 pt-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-sm bg-primary" />
                                    <span>Answered</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-sm border border-border/50 bg-transparent" />
                                    <span>Unanswered</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-sm border-2 border-primary bg-transparent" />
                                    <span>Current</span>
                                </div>
                            </div>

                            <Button
                                variant="destructive"
                                className="w-full mt-6"
                                onClick={() => setShowConfirmSubmit(true)}
                            >
                                Submit Exam
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Submit Confirmation Dialog */}
                <AlertDialog open={showConfirmSubmit} onOpenChange={setShowConfirmSubmit}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure you want to submit?</AlertDialogTitle>
                            <AlertDialogDescription>
                                You have answered {Object.keys(answers).length} out of {selectedExam.total_questions} questions.
                                Once submitted, you cannot change your answers and this attempt will be finalized.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Continue Exam</AlertDialogCancel>
                            <AlertDialogAction onClick={handleSubmitExam} className="bg-primary hover:bg-primary/90">
                                Yes, Submit Exam
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

            </div>
        );
    };

    const renderResultView = () => {
        if (!selectedExam) return null;

        // Calculate score
        let score = 0;
        if (selectedExam.questions && selectedExam.questions.length > 0) {
            selectedExam.questions.forEach((q, idx) => {
                if (answers[idx] === q.correct_answer) {
                    score++;
                }
            });
        } else if (selectedExam.previous_score !== undefined) {
            score = selectedExam.previous_score;
        }

        const percentage = Math.round((score / selectedExam.total_questions) * 100);
        const passed = percentage >= selectedExam.pass_mark;

        return (
            <div className="max-w-2xl mx-auto animate-fade-in mt-8">
                <Card className="border-border/50 bg-card overflow-hidden shadow-lg border-t-4 border-t-primary">
                    <div className="p-8 text-center border-b border-border/50 flex flex-col items-center">
                        {passed ? (
                            <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 mb-6">
                                <CheckCircle2 className="w-10 h-10" />
                            </div>
                        ) : (
                            <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-6">
                                <AlertCircle className="w-10 h-10" />
                            </div>
                        )}

                        <h2 className="text-3xl font-bold text-foreground mb-2">Exam Result</h2>
                        <p className="text-muted-foreground text-lg mb-6">{selectedExam.exam_title}</p>

                        <Badge variant={passed ? "default" : "destructive"} className="text-base px-4 py-1.5 mb-8">
                            {passed ? "PASSED" : "FAILED"}
                        </Badge>

                        <div className="grid grid-cols-2 gap-4 w-full bg-muted/30 p-6 rounded-2xl">
                            <div>
                                <p className="text-sm text-muted-foreground uppercase font-bold mb-1">Score</p>
                                <p className="text-3xl font-bold text-foreground">{score} <span className="text-lg text-muted-foreground">/ {selectedExam.total_questions}</span></p>
                            </div>
                            <div className="border-l border-border/50">
                                <p className="text-sm text-muted-foreground uppercase font-bold mb-1">Percentage</p>
                                <p className={cn("text-3xl font-bold", passed ? "text-green-500" : "text-destructive")}>{percentage}%</p>
                            </div>
                        </div>

                        <p className="text-sm text-muted-foreground mt-4">
                            Requires {selectedExam.pass_mark}% to pass.
                        </p>
                    </div>

                    <CardContent className="p-6 bg-card flex flex-col sm:flex-row gap-4 justify-center">
                        <Button variant="outline" className="sm:flex-1" onClick={() => setActiveView("list")}>
                            Back to Exams
                        </Button>
                        <Button className="sm:flex-1 font-semibold" variant="default" onClick={() => setActiveView("review")}>
                            Review Answers
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    };

    const renderReviewView = () => {
        if (!selectedExam) return null;

        // Calculate score for header
        let score = 0;
        selectedExam.questions.forEach((q, idx) => {
            if (answers[idx] === q.correct_answer) {
                score++;
            }
        });
        const percentage = Math.round((score / selectedExam.total_questions) * 100);

        return (
            <div className="max-w-4xl mx-auto animate-fade-in space-y-6 pb-20 mt-4">
                <div className="flex items-center justify-between mb-2">
                    <Button
                        variant="ghost"
                        className="text-muted-foreground hover:text-foreground pl-0 group"
                        onClick={() => setActiveView("list")}
                    >
                        <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Exams
                    </Button>
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs text-muted-foreground uppercase font-bold">Your Score</p>
                            <p className="text-sm font-bold text-foreground">{score} / {selectedExam.total_questions} ({percentage}%)</p>
                        </div>
                    </div>
                </div>

                <div className="bg-card border border-border/50 rounded-2xl p-6 sm:p-8 shadow-sm">
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">{selectedExam.exam_title}</h2>
                    <p className="text-muted-foreground">{selectedExam.course_name} • Review Attempt</p>
                </div>

                <div className="space-y-6">
                    {selectedExam.questions.map((question, qIdx) => {
                        const studentAns = answers[qIdx];
                        const isCorrect = studentAns === question.correct_answer;
                        const letterMap: Record<string, string> = { "a": "A", "b": "B", "c": "C", "d": "D" };

                        return (
                            <Card key={question.id} className={cn(
                                "border-l-4 overflow-hidden",
                                isCorrect ? "border-l-green-500" : "border-l-red-500"
                            )}>
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Question {qIdx + 1}</span>
                                        <Badge variant={isCorrect ? "default" : "destructive"} className={cn(
                                            "px-3 py-0.5",
                                            isCorrect ? "bg-green-500 hover:bg-green-600" : ""
                                        )}>
                                            {isCorrect ? "Correct" : "Incorrect"}
                                        </Badge>
                                    </div>

                                    <h3 className="text-lg font-medium text-foreground mb-6 whitespace-pre-wrap">
                                        {question.question_text}
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                                        {['a', 'b', 'c', 'd'].map((key) => {
                                            const optionKey = `option_${key}` as keyof Question;
                                            const isStudentSelected = studentAns === key;
                                            const isActuallyCorrect = question.correct_answer === key;

                                            return (
                                                <div
                                                    key={key}
                                                    className={cn(
                                                        "p-4 rounded-xl border text-sm transition-all flex items-center gap-3",
                                                        isActuallyCorrect ? "bg-green-500/10 border-green-500/50 text-foreground ring-1 ring-green-500/20" :
                                                            (isStudentSelected && !isCorrect ? "bg-red-500/10 border-red-500/50 text-foreground" : "bg-muted/30 border-border/50 text-muted-foreground")
                                                    )}
                                                >
                                                    <span className={cn(
                                                        "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0",
                                                        isActuallyCorrect ? "bg-green-500 text-white" :
                                                            (isStudentSelected && !isCorrect ? "bg-red-500 text-white" : "bg-muted-foreground/20 text-muted-foreground")
                                                    )}>
                                                        {letterMap[key]}
                                                    </span>
                                                    <span className="flex-1">{question[optionKey]}</span>
                                                    {isActuallyCorrect && <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="flex flex-wrap gap-4 pt-4 border-t border-border/50 text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="text-muted-foreground">Your Answer:</span>
                                            <span className={cn("font-bold", isCorrect ? "text-green-500" : "text-red-500")}>
                                                {studentAns ? letterMap[studentAns] : 'None'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-muted-foreground">Correct Answer:</span>
                                            <span className="font-bold text-green-500">
                                                {letterMap[question.correct_answer]}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <div className="pt-8 flex justify-center">
                    <Button size="lg" className="px-12" onClick={() => setActiveView("list")}>
                        Back to Exams
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <DashboardLayout>
            {activeView === "list" && renderListView()}
            {activeView === "instructions" && renderInstructionsView()}
            {activeView === "playing" && renderPlayingView()}
            {activeView === "result" && renderResultView()}
            {activeView === "review" && renderReviewView()}
        </DashboardLayout>
    );
};

export default StudentExams;
