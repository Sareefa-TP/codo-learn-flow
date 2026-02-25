import { useState, useRef } from "react";
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
    FileText
} from "lucide-react";
import { cn } from "@/lib/utils";

// Static Demo Data 
const demoAssignments = [
    {
        id: 1,
        title: "HTML Portfolio Page",
        module: "Frontend Basics",
        description: "Create a personal portfolio single-page website using semantic HTML tags.",
        dueDate: "10 March 2026",
        status: "Pending",
        marks: null,
    },
    {
        id: 2,
        title: "React Mini Project",
        module: "React Development",
        description: "Build a todo application utilizing React hooks and functional components.",
        dueDate: "20 March 2026",
        status: "Submitted",
        marks: null,
    },
    {
        id: 3,
        title: "Django REST API",
        module: "Backend Development",
        description: "Develop a standard RESTful API for a blog platform using Django.",
        dueDate: "30 March 2026",
        status: "Graded",
        marks: "85/100",
    }
];

const StudentAssignments = () => {
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState<typeof demoAssignments[0] | null>(null);

    // Simulated File Upload State
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

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

                {/* 1️⃣ Page Header */}
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">
                        Assignments
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Submit and track your course assignments
                    </p>
                </div>

                {/* 2️⃣ Assignment List Section */}
                <div className="space-y-4">
                    {demoAssignments.map((assignment) => (
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

                                        <div className="flex items-center gap-2 text-sm text-primary font-medium bg-primary/5 w-fit px-2.5 py-1 rounded-md">
                                            <ClipboardList className="w-4 h-4" />
                                            {assignment.module}
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
                                                onClick={() => openSubmission(assignment)}
                                            >
                                                Submit Assignment
                                            </Button>
                                        )}

                                        {assignment.status === "Submitted" && (
                                            <Button variant="secondary" className="w-full md:w-auto cursor-default pointer-events-none opacity-80">
                                                Under Review
                                            </Button>
                                        )}
                                    </div>

                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* 3️⃣ Submission UI (Drag & Drop Mock) Modal */}
                <Dialog open={isSubmitModalOpen} onOpenChange={setIsSubmitModalOpen}>
                    <DialogContent className="sm:max-w-xl">
                        <DialogHeader className="mb-2">
                            <DialogTitle className="text-xl">Submit Assignment</DialogTitle>
                            <DialogDescription>
                                {selectedAssignment?.title}
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
