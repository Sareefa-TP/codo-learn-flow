import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Users, Calendar, ArrowRight, PlayCircle, Clock, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {batches.map((batch) => (
                        <Card
                            key={batch.id}
                            className="border-border/50 hover:border-primary/50 transition-all hover:shadow-md overflow-hidden flex flex-col"
                        >
                            <CardContent className="p-0 flex flex-col h-full">
                                <div className="p-6 flex-1 space-y-4">

                                    <div className="flex justify-between items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                            <BookOpen className="w-6 h-6 text-primary" />
                                        </div>
                                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                            {batch.status}
                                        </Badge>
                                    </div>

                                    <div>
                                        <h2 className="text-xl font-bold text-foreground line-clamp-1">{batch.name}</h2>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-bold uppercase text-[10px] tracking-wider">
                                                {batch.courseName || batch.category || "Full Stack Development"}
                                            </Badge>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider bg-muted px-2 py-0.5 rounded">
                                                {batch.phase || (isAdmin ? "Curriculum Design" : "Learning Phase")}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-2">
                                        <div className="flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-2 text-muted-foreground font-medium">
                                                <Calendar className="w-3.5 h-3.5 text-primary" />
                                                <span>{isAdmin ? "Created Date:" : "Start Date:"}</span>
                                            </div>
                                            <span className="font-bold text-foreground">{batch.startDate || batch.createdDate}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-2 text-muted-foreground font-medium">
                                                <Clock className="w-3.5 h-3.5 text-blue-500" />
                                                <span>Duration:</span>
                                            </div>
                                            <span className="font-bold text-foreground">{batch.duration}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-2 text-muted-foreground font-medium">
                                                <Users className="w-3.5 h-3.5 text-emerald-500" />
                                                <span>Students:</span>
                                            </div>
                                            <span className="font-bold text-foreground">{batch.totalStudents}</span>
                                        </div>

                                        <div className="space-y-2 pt-1">
                                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                                <span>{isAdmin ? "Curriculum Readiness" : "Course Progress"}</span>
                                                <span className="text-primary">{batch.progress !== undefined ? batch.progress : 100}%</span>
                                            </div>
                                            <Progress value={batch.progress !== undefined ? batch.progress : 100} className="h-1.5" />
                                        </div>
                                    </div>

                                </div>

                                {/* Footer Action */}
                                <div className="p-4 border-t border-border/50 bg-muted/20 flex flex-col gap-2">
                                    <Button
                                        className="w-full justify-center bg-primary hover:bg-primary/90 text-primary-foreground gap-2 font-bold shadow-sm"
                                        onClick={() => navigate(isAdmin ? `${basePath}/${batch.id}/teaching` : `${basePath}/batches/${batch.id}/${isMentor ? 'monitor' : 'teaching'}`)}
                                    >
                                        <PlayCircle className="w-4 h-4" />
                                        {isAdmin ? "Manage Curriculum" : (isMentor ? "Monitor Class" : "Resume Teaching")}
                                    </Button>
                                    {!isAdmin && (
                                        <Button
                                            variant="outline"
                                            className="w-full justify-center hover:bg-primary/10 hover:text-primary gap-2 font-bold border-border/60"
                                            onClick={() => navigate(`${basePath}/students?batchId=${batch.id}`)}
                                        >
                                            <Users className="w-4 h-4" />
                                            View Students
                                        </Button>
                                    )}
                                    {isAdmin && (
                                        <Button
                                            variant="outline"
                                            className="w-full justify-center hover:bg-primary/10 hover:text-primary gap-2 font-bold border-border/60"
                                            onClick={() => navigate(`/admin/courses/edit/${batch.id}`)}
                                        >
                                            <Clock className="w-4 h-4" />
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
