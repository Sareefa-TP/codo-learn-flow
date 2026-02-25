import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Calendar, ArrowRight } from "lucide-react";

// Demo Data (Filtered for Learning Phase only)
const tutorBatches = [
    {
        id: "B-001",
        name: "Jan 2026 Batch",
        startDate: "15 Jan 2026",
        totalStudents: 45,
        status: "Active"
    },
    {
        id: "B-002",
        name: "Oct 2025 Batch",
        startDate: "10 Oct 2025",
        totalStudents: 38,
        status: "Active"
    },
    {
        id: "B-005",
        name: "Feb 2026 Batch - Evening",
        startDate: "01 Feb 2026",
        totalStudents: 21,
        status: "Active"
    }
];

const TutorBatches = () => {
    return (
        <DashboardLayout>
            <div className="animate-fade-in space-y-6 lg:space-y-8 max-w-6xl mx-auto">

                {/* Header Section */}
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
                        My Batches
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Overview of the Learning Phase learning cohorts you are actively instructing.
                    </p>
                </div>

                {/* Batches Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {tutorBatches.map((batch) => (
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
                                            Active
                                        </Badge>
                                    </div>

                                    <div>
                                        <h2 className="text-xl font-bold text-foreground line-clamp-1">{batch.name}</h2>
                                        <p className="text-sm font-medium text-primary bg-primary/5 w-fit px-2 py-1 rounded mt-2">
                                            Learning Phase
                                        </p>
                                    </div>

                                    <div className="space-y-2 pt-2">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="w-4 h-4 text-primary/70" />
                                            Started: <span className="font-medium text-foreground">{batch.startDate}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Users className="w-4 h-4 text-emerald-600/70" />
                                            Total Students: <span className="font-medium text-foreground">{batch.totalStudents}</span>
                                        </div>
                                    </div>

                                </div>

                                {/* Footer Action */}
                                <div className="p-4 border-t border-border/50 bg-muted/20">
                                    <Button variant="ghost" className="w-full justify-between hover:bg-primary/10 hover:text-primary">
                                        View Students
                                        <ArrowRight className="w-4 h-4" />
                                    </Button>
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
