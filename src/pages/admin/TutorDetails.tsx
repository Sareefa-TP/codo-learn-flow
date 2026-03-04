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
import { ArrowLeft, Mail, Phone, Calendar, Users, Briefcase, Activity, Trash2 } from "lucide-react";
import { mockTutors as initialTutors, mockStudents as initialStudents } from "@/data/mockTutors";
import { StatusBadge } from "@/components/admin/tutors/StatusBadge";
import { WorkloadBadge } from "@/components/admin/tutors/WorkloadBadge";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const AdminTutorDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();

    // Local State Initialization
    const [tutors, setTutors] = useState(initialTutors);
    const [students, setStudents] = useState(initialStudents);

    const tutor = tutors.find((t) => t.id === id);

    if (!tutor) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
                    <h2 className="text-2xl font-bold text-foreground">Tutor not found</h2>
                    <p className="text-muted-foreground">The tutor you're looking for doesn't exist.</p>
                    <Button onClick={() => navigate("/admin/tutors")}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Tutors
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

    // Derive associated active/inactive mock students
    const assignedStudents = students.filter((s) => s.assignedTutorId === id);
    const activeStudents = assignedStudents.filter((s) => s.status === "Active");
    const inactiveStudents = assignedStudents.filter((s) => s.status === "Inactive");

    const handleRemoveStudent = (studentId: string, studentName: string) => {
        if (!window.confirm(`Are you sure you want to remove ${studentName} from this tutor?`)) return;

        // Update Student State (set tutor ID to null)
        setStudents(students.map(s => s.id === studentId ? { ...s, assignedTutorId: null } : s));

        // Update Tutor State (remove student ID from array)
        setTutors(tutors.map(t => t.id === tutor.id
            ? { ...t, assignedStudentIds: t.assignedStudentIds.filter(id => id !== studentId) }
            : t
        ));

        toast({
            title: "Student Removed",
            description: `${studentName} has been successfully removed from this tutor's workload.`
        });
    };

    return (
        <DashboardLayout>
            <div className="space-y-6 max-w-7xl mx-auto">

                {/* Navigation & Header */}
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => navigate("/admin/tutors")} className="h-9 w-9">
                        <ArrowLeft className="w-4 h-4 text-muted-foreground" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">{tutor.name}</h1>
                        <p className="text-muted-foreground mt-1 tabular-nums text-sm">Tutor ID: {tutor.id}</p>
                    </div>
                </div>

                {/* Top Split: Basic Info & Workload Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Basic Info */}
                    <Card className="border-border/50 shadow-sm">
                        <CardContent className="p-6">
                            <h3 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border/50 flex items-center gap-2">
                                <Briefcase className="w-4 h-4 text-muted-foreground" />
                                Basic Info
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground text-sm flex items-center gap-2">
                                        <Mail className="w-4 h-4" /> Email
                                    </span>
                                    <span className="font-medium text-sm">{tutor.email}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground text-sm flex items-center gap-2">
                                        <Phone className="w-4 h-4" /> Phone
                                    </span>
                                    <span className="font-medium text-sm">{tutor.phone}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground text-sm flex items-center gap-2">
                                        <Calendar className="w-4 h-4" /> Joined Date
                                    </span>
                                    <span className="font-medium text-sm">{tutor.joinedDate}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground text-sm flex items-center gap-2">
                                        <Activity className="w-4 h-4" /> Status
                                    </span>
                                    <StatusBadge status={tutor.status} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Workload Summary */}
                    <Card className="border-border/50 shadow-sm">
                        <CardContent className="p-6">
                            <h3 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border/50 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-muted-foreground" />
                                    Workload Summary
                                </div>
                                <WorkloadBadge studentCount={assignedStudents.length} />
                            </h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-muted/30 p-4 rounded-lg border border-border/50 flex flex-col items-center justify-center text-center">
                                    <p className="text-muted-foreground text-xs font-medium mb-1 uppercase tracking-wider">Total</p>
                                    <p className="text-3xl font-bold text-foreground">{assignedStudents.length}</p>
                                </div>
                                <div className="bg-emerald-500/5 p-4 rounded-lg border border-emerald-500/20 flex flex-col items-center justify-center text-center">
                                    <p className="text-emerald-700 dark:text-emerald-400 text-xs font-medium mb-1 uppercase tracking-wider">Active</p>
                                    <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">{activeStudents.length}</p>
                                </div>
                                <div className="bg-muted/50 p-4 rounded-lg border border-border/50 flex flex-col items-center justify-center text-center">
                                    <p className="text-muted-foreground text-xs font-medium mb-1 uppercase tracking-wider">Inactive</p>
                                    <p className="text-3xl font-bold text-muted-foreground">{inactiveStudents.length}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                </div>

                {/* Student List Section */}
                <Card className="border-border/50 shadow-sm overflow-hidden mt-6">
                    <div className="p-4 bg-muted/30 border-b border-border/50 flex items-center justify-between">
                        <h3 className="font-semibold text-foreground flex items-center gap-2">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            Assigned Students List
                        </h3>
                        <Badge variant="secondary" className="font-normal text-xs">{assignedStudents.length} Students</Badge>
                    </div>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-muted/10">
                                <TableRow>
                                    <TableHead className="w-[200px]">Student Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Batch</TableHead>
                                    <TableHead>Progress %</TableHead>
                                    <TableHead className="text-right">Status</TableHead>
                                    <TableHead className="text-right w-[100px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {assignedStudents.length > 0 ? (
                                    assignedStudents.map((student) => (
                                        <TableRow key={student.id} className="hover:bg-muted/10">
                                            <TableCell className="font-medium text-foreground">
                                                {student.name}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm">
                                                {student.email}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                                                {student.batch}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium w-6 text-right">{student.progress}%</span>
                                                    <div className="h-1.5 w-24 bg-muted overflow-hidden rounded-full">
                                                        <div
                                                            className="h-full bg-primary"
                                                            style={{ width: `${student.progress}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <StatusBadge status={student.status} />
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
                                                    onClick={() => handleRemoveStudent(student.id, student.name)}
                                                    title="Remove Student"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                            No students assigned to this tutor.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </Card>

            </div>
        </DashboardLayout>
    );
};

export default AdminTutorDetails;
