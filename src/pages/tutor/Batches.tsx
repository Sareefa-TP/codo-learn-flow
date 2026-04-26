import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Users, Calendar, ArrowRight, PlayCircle, Clock, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

import { SHARED_BATCHES, Batch } from "@/data/batchData";

interface BatchesProps {
    role?: "tutor" | "mentor" | "admin";
    batches?: any[]; // Flexible for Batch or Course
}

const TutorBatches = ({ role = "tutor", batches = SHARED_BATCHES }: BatchesProps) => {
    const navigate = useNavigate();
    const isMentor = role === "mentor";
    const isAdmin = role === "admin";
    const basePath = isAdmin ? "/admin/courses" : (isMentor ? "/mentor/my-batches" : "/tutor");

    return (
        <DashboardLayout>
            <div className="animate-fade-in space-y-6 lg:space-y-8 max-w-6xl mx-auto">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
                            {isAdmin ? "Course Management" : (isMentor ? "My Assigned Batches" : "My Batches")}
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            {isAdmin 
                                ? "Manage curriculum, modules, and content for all offered programs."
                                : (isMentor 
                                    ? "Overview of learning cohorts currently under your guidance and oversight."
                                    : "Overview of the Learning Phase cohorts you are actively instructing.")
                            }
                        </p>
                    </div>
                    {isAdmin && (
                        <Button 
                            onClick={() => navigate("/admin/courses/create")} 
                            className="bg-primary text-white rounded-xl font-bold h-12 px-6 shadow-lg shadow-primary/20"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Add New Course
                        </Button>
                    )}
                </div>

                {/* Batches Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {batches.map((batch) => (
                        <Card
                            key={batch.id}
                            className="group overflow-hidden border-border/50 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 rounded-3xl flex flex-col h-full bg-card cursor-pointer"
                            onClick={() => navigate(isAdmin ? `${basePath}/${batch.id}/teaching` : `${basePath}/batches/${batch.id}/${isMentor ? 'monitor' : 'teaching'}`)}
                        >
                            {/* Card Header Area (Slate-100 with gradient) */}
                            <div className="h-32 bg-slate-100 flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center relative z-10 transition-transform duration-500 group-hover:scale-110">
                                    <BookOpen className="w-6 h-6 text-primary" />
                                </div>
                                <Badge 
                                    className={cn(
                                        "absolute top-4 right-4 text-[10px] uppercase font-black tracking-widest px-2.5 py-1 shadow-sm border-none backdrop-blur-sm",
                                        batch.status === "Active" ? "bg-emerald-500/90 text-white" : "bg-white/90 text-slate-900"
                                    )}
                                >
                                    {batch.status}
                                </Badge>
                            </div>

                            <CardContent className="p-6 flex-1 flex flex-col space-y-5">
                                {/* Title and Phase */}
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">
                                        {batch.phase || (isAdmin ? "Curriculum Design" : "Learning Phase")}
                                    </p>
                                    <h3 className="text-lg font-bold text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-2 min-h-[3rem]">
                                        {batch.name}
                                    </h3>
                                    <div className="flex items-center gap-2 pt-1">
                                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-bold uppercase text-[9px] tracking-wider px-2">
                                            {batch.courseName || batch.category || "Full Stack Development"}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Batch Details Grid */}
                                <div className="grid grid-cols-2 gap-y-3 pt-2">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                                            {isAdmin ? "Created Date" : "Start Date"}
                                        </p>
                                        <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                                            <Calendar className="w-3.5 h-3.5 text-primary/60" />
                                            {batch.startDate || batch.createdDate}
                                        </div>
                                    </div>
                                    <div className="space-y-1 text-right">
                                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Duration</p>
                                        <div className="flex items-center gap-2 text-xs font-bold text-foreground justify-end">
                                            <Clock className="w-3.5 h-3.5 text-blue-500/60" />
                                            {batch.duration}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Total Students</p>
                                        <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                                            <Users className="w-3.5 h-3.5 text-emerald-500/60" />
                                            {batch.totalStudents}
                                        </div>
                                    </div>
                                </div>

                                {/* Progress Section */}
                                <div className="space-y-2 pt-2">
                                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                        <span>{isAdmin ? "Curriculum Readiness" : "Batch Progress"}</span>
                                        <span className="text-primary">{batch.progress !== undefined ? batch.progress : 100}%</span>
                                    </div>
                                    <Progress value={batch.progress !== undefined ? batch.progress : 100} className="h-1.5" />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col gap-3 pt-4 mt-auto">
                                    <Button
                                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2 rounded-xl h-11 font-bold text-xs shadow-md shadow-primary/20"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(isAdmin ? `${basePath}/${batch.id}/teaching` : `${basePath}/batches/${batch.id}/${isMentor ? 'monitor' : 'teaching'}`);
                                        }}
                                    >
                                        <PlayCircle className="w-4 h-4" />
                                        {isAdmin ? "Manage Curriculum" : (isMentor ? "Monitor Class" : "Resume Teaching")}
                                    </Button>
                                    
                                    {!isAdmin ? (
                                        <Button
                                            variant="ghost"
                                            className="w-full rounded-xl text-[10px] uppercase font-black tracking-widest text-muted-foreground hover:text-primary h-10"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`${basePath}/students?batchId=${batch.id}`);
                                            }}
                                        >
                                            <Users className="w-4 h-4 mr-2" />
                                            View Students
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="ghost"
                                            className="w-full rounded-xl text-[10px] uppercase font-black tracking-widest text-muted-foreground hover:text-primary h-10"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/admin/courses/edit/${batch.id}`);
                                            }}
                                        >
                                            <Clock className="w-4 h-4 mr-2" />
                                            Edit Settings
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

            </div>
        </DashboardLayout>
    );
};

export default TutorBatches;
