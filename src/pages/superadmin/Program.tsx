import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    BookOpen,
    Users,
    GraduationCap,
    Briefcase,
    Calendar,
    Layers,
    CheckCircle2
} from "lucide-react";

const SuperAdminProgram = () => {
    return (
        <DashboardLayout>
            <div className="animate-fade-in space-y-6 lg:space-y-8 max-w-5xl mx-auto">

                {/* Header */}
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
                        Program Structure
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Overview of the main program and its operational metrics
                    </p>
                </div>

                {/* Main Program Overview Card */}
                <Card className="border-primary/20 bg-primary/5 shadow-sm">
                    <CardContent className="p-6 md:p-8">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">

                            <div className="space-y-4 flex-1">
                                <div className="flex flex-wrap items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                                        <BookOpen className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-foreground">
                                            Full Stack Development
                                        </h2>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 gap-1 rounded-full">
                                                <CheckCircle2 className="w-3 h-3" />
                                                Active
                                            </Badge>
                                            <span className="text-sm text-muted-foreground font-medium flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5" /> 3 Months Duration
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">
                                    This is the single core comprehensive program designed to take students from foundational programming concepts through to an industry-ready internship phase, resulting in complete full-stack proficiency.
                                </p>
                            </div>

                        </div>
                    </CardContent>
                </Card>

                {/* Structure Breakdown */}
                <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Layers className="w-5 h-5 text-primary" />
                        Curriculum Structure
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <Card className="border-border/50 hover:border-primary/30 transition-all hover:shadow-md">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                                        <GraduationCap className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-lg">Learning Phase</h4>
                                        <p className="text-sm text-muted-foreground mt-1 mb-3">
                                            Core training in frontend, backend, and database technologies.
                                        </p>
                                        <Badge variant="secondary" className="font-normal text-xs px-2 py-0.5">
                                            2 Months
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-border/50 hover:border-primary/30 transition-all hover:shadow-md">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                                        <Briefcase className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-lg">Internship Phase</h4>
                                        <p className="text-sm text-muted-foreground mt-1 mb-3">
                                            Practical application building real-world projects under mentorship.
                                        </p>
                                        <Badge variant="secondary" className="font-normal text-xs px-2 py-0.5">
                                            1 Month
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                    </div>
                </div>

                {/* Operational Metrics */}
                <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary" />
                        Current Metrics
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Card className="border-border/50">
                            <CardContent className="p-5 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                                    <Users className="w-5 h-5 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Total Enrolled</p>
                                    <p className="text-2xl font-bold text-foreground">845</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-border/50">
                            <CardContent className="p-5 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                    <GraduationCap className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Active Students</p>
                                    <p className="text-2xl font-bold text-foreground">312</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-border/50">
                            <CardContent className="p-5 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                    <Briefcase className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Active Interns</p>
                                    <p className="text-2xl font-bold text-foreground">184</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
};

export default SuperAdminProgram;
