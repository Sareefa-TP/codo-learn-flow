import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ChevronLeft, User, Eye, Users } from "lucide-react";

// Mock Student Data
const mockStudents: Record<string, any[]> = {
    "B-001": [
        { id: "S-101", name: "Rahul Kumar", email: "rahul@email.com", enrollmentDate: "15 Jan 2026", progress: 70, assignments: "5/7", lastActive: "2 days ago" },
        { id: "S-102", name: "Anita Sharma", email: "anita@email.com", enrollmentDate: "16 Jan 2026", progress: 85, assignments: "7/7", lastActive: "Today" },
        { id: "S-103", name: "Arjun Nair", email: "arjun@email.com", enrollmentDate: "17 Jan 2026", progress: 45, assignments: "3/7", lastActive: "Yesterday" },
        { id: "S-104", name: "Priya Das", email: "priya@email.com", enrollmentDate: "18 Jan 2026", progress: 92, assignments: "7/7", lastActive: "Today" },
    ],
    "B-002": [
        { id: "S-105", name: "Vikas Verma", email: "vikas@email.com", enrollmentDate: "10 Oct 2025", progress: 100, assignments: "10/10", lastActive: "1 week ago" },
        { id: "S-106", name: "Suman Rao", email: "suman@email.com", enrollmentDate: "12 Oct 2025", progress: 95, assignments: "10/10", lastActive: "3 days ago" },
    ],
    "B-005": [], // Empty batch for testing empty state
};

// Batch Names for Header
const batchNames: Record<string, string> = {
    "B-001": "Jan 2026 Batch",
    "B-002": "Oct 2025 Batch",
    "B-005": "Feb 2026 Batch - Evening",
};

const TutorBatchStudents = () => {
    const { batchId } = useParams();
    const navigate = useNavigate();

    const students = batchId ? (mockStudents[batchId] || []) : [];
    const batchName = batchId ? (batchNames[batchId] || "Unknown Batch") : "Unknown Batch";

    return (
        <DashboardLayout>
            <div className="animate-fade-in space-y-6 lg:space-y-8 max-w-7xl mx-auto pb-10">

                {/* Back Button and Header */}
                <div className="space-y-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 -ml-2 text-muted-foreground hover:text-primary"
                        onClick={() => navigate("/tutor/batches")}
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back to Batches
                    </Button>

                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
                                Batch Students
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                Viewing students enrolled in <span className="text-primary font-medium">{batchName}</span>
                            </p>
                        </div>

                        <Badge variant="outline" className="w-fit bg-primary/5 text-primary border-primary/20 h-7">
                            {students.length} Students Total
                        </Badge>
                    </div>
                </div>

                {/* Students Table */}
                <Card className="border-border/50 shadow-sm rounded-xl overflow-hidden">
                    <CardContent className="p-0">
                        {students.length > 0 ? (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/30">
                                            <TableHead className="text-xs font-semibold">Student Name</TableHead>
                                            <TableHead className="text-xs font-semibold">Email</TableHead>
                                            <TableHead className="text-xs font-semibold">Enrollment Date</TableHead>
                                            <TableHead className="text-xs font-semibold text-center">Progress %</TableHead>
                                            <TableHead className="text-xs font-semibold text-center">Assignment Status</TableHead>
                                            <TableHead className="text-xs font-semibold">Last Active</TableHead>
                                            <TableHead className="text-xs font-semibold text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {students.map((student) => (
                                            <TableRow key={student.id} className="hover:bg-muted/10 transition-colors group">
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                            <User className="w-4 h-4 text-primary" />
                                                        </div>
                                                        {student.name}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">{student.email}</TableCell>
                                                <TableCell className="text-sm text-muted-foreground">{student.enrollmentDate}</TableCell>
                                                <TableCell className="text-center">
                                                    <div className="flex flex-col items-center gap-1">
                                                        <span className="text-sm font-semibold">{student.progress}%</span>
                                                        <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-primary"
                                                                style={{ width: `${student.progress}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant="secondary" className="font-medium">
                                                        {student.assignments}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">{student.lastActive}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="gap-2 h-8 text-xs hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                                                        onClick={() => navigate(`/tutor/students/${student.id}`)}
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                        View Profile
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                                <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center">
                                    <Users className="w-8 h-8 text-muted-foreground/50" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xl font-semibold text-foreground">No students enrolled</p>
                                    <p className="text-muted-foreground max-w-xs mx-auto">
                                        No students enrolled in this batch yet.
                                    </p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

            </div>
        </DashboardLayout>
    );
};

export default TutorBatchStudents;
