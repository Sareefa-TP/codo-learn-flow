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
import { mockMentors as initialMentors, mockInterns as initialInterns } from "@/data/mockMentors";
import { StatusBadge } from "@/components/admin/tutors/StatusBadge";
import { MentorWorkloadBadge } from "@/components/admin/mentors/MentorWorkloadBadge";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const AdminMentorDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();

    // Local State Initialization
    const [mentors, setMentors] = useState(initialMentors);
    const [interns, setInterns] = useState(initialInterns);

    const mentor = mentors.find((m) => m.id === id);

    if (!mentor) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
                    <h2 className="text-2xl font-bold text-foreground">Mentor not found</h2>
                    <p className="text-muted-foreground">The mentor you're looking for doesn't exist.</p>
                    <Button onClick={() => navigate("/admin/mentors")}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Mentors
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

    // Derive associated assigned mock interns
    const assignedInterns = interns.filter((i) => i.assignedMentorId === mentor.id);

    const handleRemoveIntern = (internId: string, internName: string) => {
        if (!window.confirm(`Are you sure you want to remove ${internName} from this mentor?`)) return;

        // Update Intern State (set mentor ID to null)
        setInterns(interns.map(i => i.id === internId ? { ...i, assignedMentorId: null } : i));

        // Update Mentor State (remove intern ID from array)
        setMentors(mentors.map(m => m.id === mentor.id
            ? { ...m, assignedInternIds: m.assignedInternIds.filter(id => id !== internId) }
            : m
        ));

        toast({
            title: "Intern Removed",
            description: `${internName} has been successfully removed from this mentor's workload.`
        });
    };

    return (
        <DashboardLayout>
            <div className="space-y-6 max-w-7xl mx-auto">

                {/* Navigation & Header */}
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => navigate("/admin/mentors")} className="h-9 w-9">
                        <ArrowLeft className="w-4 h-4 text-muted-foreground" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">{mentor.name}</h1>
                        <p className="text-muted-foreground mt-1 tabular-nums text-sm">Mentor ID: {mentor.id}</p>
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
                                    <span className="font-medium text-sm">{mentor.email}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground text-sm flex items-center gap-2">
                                        <Phone className="w-4 h-4" /> Phone
                                    </span>
                                    <span className="font-medium text-sm">{mentor.phone}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground text-sm flex items-center gap-2">
                                        <Calendar className="w-4 h-4" /> Joined Date
                                    </span>
                                    <span className="font-medium text-sm">{mentor.joinedDate}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground text-sm flex items-center gap-2">
                                        <Activity className="w-4 h-4" /> Status
                                    </span>
                                    <StatusBadge status={mentor.status} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Workload Summary */}
                    <Card className="border-border/50 shadow-sm">
                        <CardContent className="p-6 h-full flex flex-col">
                            <h3 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border/50 flex items-center gap-2">
                                <Users className="w-4 h-4 text-muted-foreground" />
                                Workload Indicator
                            </h3>
                            <div className="flex-1 flex flex-col items-center justify-center space-y-3">
                                <span className="text-6xl font-black text-foreground">{assignedInterns.length}</span>
                                <span className="text-sm text-muted-foreground uppercase tracking-widest font-medium">Assigned Interns</span>
                                <div className="pt-2">
                                    <MentorWorkloadBadge internCount={assignedInterns.length} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                </div>

                {/* Assigned Interns Section */}
                <Card className="border-border/50 shadow-sm overflow-hidden mt-6">
                    <div className="p-4 bg-muted/30 border-b border-border/50 flex items-center justify-between">
                        <h3 className="font-semibold text-foreground flex items-center gap-2">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            Assigned Interns List
                        </h3>
                        <Badge variant="secondary" className="font-normal text-xs">{assignedInterns.length} Interns</Badge>
                    </div>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-muted/10">
                                <TableRow>
                                    <TableHead className="w-[200px]">Intern Name</TableHead>
                                    <TableHead>Batch</TableHead>
                                    <TableHead>Internship Progress %</TableHead>
                                    <TableHead className="text-right">Status</TableHead>
                                    <TableHead className="text-right w-[100px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {assignedInterns.length > 0 ? (
                                    assignedInterns.map((intern) => (
                                        <TableRow key={intern.id} className="hover:bg-muted/10">
                                            <TableCell className="font-medium text-foreground">
                                                {intern.name}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                                                {intern.batch}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium w-6 text-right">{intern.progress}%</span>
                                                    <div className="h-1.5 w-24 bg-muted overflow-hidden rounded-full">
                                                        <div
                                                            className="h-full bg-primary"
                                                            style={{ width: `${intern.progress}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <StatusBadge status={intern.status} />
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
                                                    onClick={() => handleRemoveIntern(intern.id, intern.name)}
                                                    title="Remove Intern"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                                            This mentor has no assigned interns.
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

export default AdminMentorDetails;
