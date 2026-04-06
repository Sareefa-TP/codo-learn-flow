import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";

import {
    Layers,
    Plus,
    Eye,
    Trash2,
    Calendar,
    BookOpen,
    CheckCircle,
    Pencil
} from "lucide-react";

// Types
type Phase = "Upcoming" | "Learning" | "Internship" | "Completed";

interface Tutor {
    id: string;
    name: string;
    email: string;
}

interface Student {
    id: string;
    name: string;
    email: string;
    status: "Active";
}

interface Batch {
    id: string;
    name: string;
    startDate: string;
    learningEndDate: string;
    internshipStartDate: string;
    endDate: string;
    capacity: number;
    tutorId: string;
    studentIds: string[];
}

// Mock Data
const mockTutors: Tutor[] = [
    { id: "t1", name: "Alex Johnson", email: "alex.j@example.com" },
    { id: "t2", name: "Sarah Williams", email: "sarah.w@example.com" },
    { id: "t3", name: "David Chen", email: "david.c@example.com" },
];

const mockStudents: Student[] = [
    { id: "s1", name: "Rahul Sharma", email: "rahul@example.com", status: "Active" },
    { id: "s2", name: "Priya Singh", email: "priya@example.com", status: "Active" },
    { id: "s3", name: "Amit Kumar", email: "amit@example.com", status: "Active" },
    { id: "s4", name: "Neha Gupta", email: "neha@example.com", status: "Active" },
    { id: "s5", name: "Sara Khan", email: "sara@example.com", status: "Active" },
];

const initialBatches: Batch[] = [
    {
        id: "b1",
        name: "FSD Jan 2026",
        startDate: "2026-01-05",
        learningEndDate: "2026-03-05",
        internshipStartDate: "2026-03-06",
        endDate: "2026-04-05",
        capacity: 30,
        tutorId: "t1",
        studentIds: ["s1", "s2"],
    }
];

const BatchManagement = () => {
    const { toast } = useToast();

    const [batches, setBatches] = useState<Batch[]>(initialBatches);

    // Modal State for Edit/Create
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"create" | "edit">("create");

    // Drawer View State
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);

    const [activeFormData, setActiveFormData] = useState<Partial<Batch>>({
        name: "",
        startDate: "",
        learningEndDate: "",
        internshipStartDate: "",
        endDate: "",
        capacity: 30,
        tutorId: "",
        studentIds: [],
    });

    // Calculate phase dynamically based on current date
    const getPhase = (batch: Batch): Phase => {
        const today = new Date().toISOString().split("T")[0];

        if (today < batch.startDate) return "Upcoming";
        if (today <= batch.learningEndDate) return "Learning";
        if (today <= batch.endDate) return "Internship";
        return "Completed";
    };

    const getPhaseBadge = (phase: Phase) => {
        switch (phase) {
            case "Learning":
                return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 shadow-none hover:bg-blue-500/20">Learning</Badge>;
            case "Internship":
                return <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20 shadow-none hover:bg-purple-500/20">Internship</Badge>;
            case "Completed":
                return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 shadow-none hover:bg-emerald-500/20">Completed</Badge>;
            case "Upcoming":
                return <Badge variant="outline" className="text-muted-foreground shadow-none bg-muted/50 hover:bg-muted">Upcoming</Badge>;
            default:
                return <Badge variant="outline">{phase}</Badge>;
        }
    };

    const openCreateModal = () => {
        setModalMode("create");
        setActiveFormData({
            name: "",
            startDate: "",
            learningEndDate: "",
            internshipStartDate: "",
            endDate: "",
            capacity: 30,
            tutorId: "",
            studentIds: [],
        });
        setIsModalOpen(true);
    };

    const openEditModal = (batch: Batch) => {
        setModalMode("edit");
        setActiveFormData({ ...batch });
        setIsModalOpen(true);
    };

    const openViewDrawer = (batch: Batch) => {
        setSelectedBatch(batch);
        setIsViewOpen(true);
    };

    const handleSubmit = () => {
        if (!activeFormData.name || !activeFormData.startDate || !activeFormData.learningEndDate || !activeFormData.internshipStartDate || !activeFormData.endDate || !activeFormData.tutorId) {
            toast({
                title: "Missing fields",
                description: "Please fill out all required dates and fields.",
                variant: "destructive",
            });
            return;
        }

        if (modalMode === "create") {
            const createdBatch: Batch = {
                id: `b${Date.now()}`,
                name: activeFormData.name,
                startDate: activeFormData.startDate,
                learningEndDate: activeFormData.learningEndDate,
                internshipStartDate: activeFormData.internshipStartDate,
                endDate: activeFormData.endDate,
                capacity: Number(activeFormData.capacity) || 30,
                tutorId: activeFormData.tutorId,
                studentIds: activeFormData.studentIds || [],
            };

            setBatches([createdBatch, ...batches]);
            toast({
                title: "Batch Created",
                description: `${createdBatch.name} has been successfully added.`,
            });
        } else {
            // Edit
            setBatches(batches.map(b => b.id === activeFormData.id ? { ...b, ...activeFormData } as Batch : b));
            toast({
                title: "Batch Updated",
                description: `${activeFormData.name} has been successfully updated.`,
            });
        }

        setIsModalOpen(false);
    };

    const handleDelete = (id: string, name: string) => {
        if (confirm(`Are you sure you want to delete ${name}?`)) {
            setBatches(batches.filter(b => b.id !== id));
            toast({
                title: "Batch Deleted",
                description: `${name} has been removed.`,
            });
        }
    };

    const toggleStudentSelection = (studentId: string) => {
        setActiveFormData(prev => {
            const currentIds = prev.studentIds || [];
            if (currentIds.includes(studentId)) {
                return { ...prev, studentIds: currentIds.filter(id => id !== studentId) };
            } else {
                return { ...prev, studentIds: [...currentIds, studentId] };
            }
        });
    };

    return (
        <DashboardLayout>
            <div className="animate-fade-in space-y-6 lg:space-y-8 max-w-7xl mx-auto pb-10">

                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
                            Batch Management
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Manage batches, assign tutors, enroll students
                        </p>
                    </div>

                    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                        <Button className="gap-2 shrink-0" onClick={openCreateModal}>
                            <Plus className="w-4 h-4" /> Create Batch
                        </Button>
                        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>{modalMode === "create" ? "Create New Batch" : "Edit Batch"}</DialogTitle>
                            </DialogHeader>

                            <div className="grid gap-6 py-4">
                                <div className="space-y-2">
                                    <Label>Batch Name</Label>
                                    <Input
                                        placeholder="e.g. FSD March 2026"
                                        value={activeFormData.name}
                                        onChange={(e) => setActiveFormData({ ...activeFormData, name: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground flex items-center gap-1.5"><Calendar className="w-3 h-3" /> Start Date</Label>
                                        <Input
                                            type="date"
                                            value={activeFormData.startDate}
                                            onChange={(e) => setActiveFormData({ ...activeFormData, startDate: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground flex items-center gap-1.5"><BookOpen className="w-3 h-3" /> Learning End</Label>
                                        <Input
                                            type="date"
                                            value={activeFormData.learningEndDate}
                                            onChange={(e) => setActiveFormData({ ...activeFormData, learningEndDate: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground flex items-center gap-1.5"><Layers className="w-3 h-3" /> Internship Start</Label>
                                        <Input
                                            type="date"
                                            value={activeFormData.internshipStartDate}
                                            onChange={(e) => setActiveFormData({ ...activeFormData, internshipStartDate: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground flex items-center gap-1.5"><CheckCircle className="w-3 h-3" /> End Date</Label>
                                        <Input
                                            type="date"
                                            value={activeFormData.endDate}
                                            onChange={(e) => setActiveFormData({ ...activeFormData, endDate: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Capacity</Label>
                                        <Input
                                            type="number"
                                            min="1"
                                            value={activeFormData.capacity}
                                            onChange={(e) => setActiveFormData({ ...activeFormData, capacity: Number(e.target.value) })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Assign Tutor</Label>
                                        <Select value={activeFormData.tutorId} onValueChange={(val) => setActiveFormData({ ...activeFormData, tutorId: val })}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a tutor" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {mockTutors.map(tutor => (
                                                    <SelectItem key={tutor.id} value={tutor.id}>{tutor.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-4 border-t border-border/50">
                                    <div className="flex justify-between items-center mb-1">
                                        <Label>Enroll Students</Label>
                                        <span className="text-xs text-muted-foreground">
                                            {(activeFormData.studentIds?.length || 0)} / {activeFormData.capacity || 30} Selected
                                        </span>
                                    </div>
                                    <div className="border border-border/50 rounded-md max-h-48 overflow-y-auto bg-muted/10 divide-y divide-border/30">
                                        {mockStudents.map(student => (
                                            <div
                                                key={student.id}
                                                className={`px-3 py-2 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors ${activeFormData.studentIds?.includes(student.id) ? 'bg-indigo-50/50 dark:bg-indigo-950/20' : ''}`}
                                                onClick={() => toggleStudentSelection(student.id)}
                                            >
                                                <div>
                                                    <p className={`text-sm font-medium ${activeFormData.studentIds?.includes(student.id) ? 'text-indigo-600 dark:text-indigo-400' : 'text-foreground'}`}>{student.name}</p>
                                                    <p className="text-xs text-muted-foreground">{student.email}</p>
                                                </div>
                                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${activeFormData.studentIds?.includes(student.id) ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-input bg-background'}`}>
                                                    {activeFormData.studentIds?.includes(student.id) && <Plus className="w-3 h-3 rotate-45" />}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                <Button onClick={handleSubmit}>{modalMode === "create" ? "Create Batch" : "Save Changes"}</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Dynamic Table Section */}
                {batches.length > 0 ? (
                    <Card className="border-border/50 overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-muted/30">
                                    <TableRow>
                                        <TableHead className="pl-6">Batch Name</TableHead>
                                        <TableHead>Duration</TableHead>
                                        <TableHead>Tutor Target</TableHead>
                                        <TableHead>Phase</TableHead>
                                        <TableHead className="w-[15%]">Enrolled</TableHead>
                                        <TableHead className="text-right pr-6">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {batches.map((batch) => {
                                        const tutor = mockTutors.find(t => t.id === batch.tutorId);
                                        const phase = getPhase(batch);
                                        const enrollmentPercentage = (batch.studentIds.length / batch.capacity) * 100;

                                        return (
                                            <TableRow key={batch.id} className="hover:bg-muted/20">
                                                <TableCell className="pl-6 font-medium text-foreground">
                                                    {batch.name}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm text-foreground">{batch.startDate}</div>
                                                    <div className="text-xs text-muted-foreground">{batch.endDate}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm text-foreground">{tutor?.name || "Unassigned"}</div>
                                                </TableCell>
                                                <TableCell>
                                                    {getPhaseBadge(phase)}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-1.5 justify-center">
                                                        <div className="flex items-center gap-2">
                                                            <Progress value={enrollmentPercentage} className="h-2 flex-1" />
                                                            <span className="text-xs font-medium text-muted-foreground shrink-0 leading-none">
                                                                {batch.studentIds.length}/{batch.capacity}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right pr-6">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                                                            onClick={() => openViewDrawer(batch)}
                                                            title="View details"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-slate-600 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                                                            onClick={() => openEditModal(batch)}
                                                            title="Edit batch"
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                            onClick={() => handleDelete(batch.id, batch.name)}
                                                            title="Delete batch"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                ) : (
                    <Card className="border-dashed border-2 bg-muted/30">
                        <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-16 h-16 rounded-full bg-indigo-100/50 flex items-center justify-center mb-4">
                                <Layers className="w-8 h-8 text-indigo-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-1">
                                No batches yet
                            </h3>
                            <p className="text-muted-foreground max-w-sm mb-6">
                                Get started by creating a new batch, or assigning tutors and students to an existing one.
                            </p>
                            <Button onClick={openCreateModal}>Create First Batch</Button>
                        </CardContent>
                    </Card>
                )}

            </div>

            {/* View Batch Drawer */}
            <Sheet open={isViewOpen} onOpenChange={setIsViewOpen}>
                <SheetContent className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl overflow-y-auto">
                    {selectedBatch && (
                        <div className="flex flex-col gap-6 py-4">
                            <SheetHeader className="pb-4 border-b">
                                <div className="flex justify-between items-start pt-4">
                                    <div>
                                        <SheetTitle className="text-2xl font-bold flex items-center gap-3">
                                            {selectedBatch.name}
                                            {getPhaseBadge(getPhase(selectedBatch))}
                                        </SheetTitle>
                                        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                                            <Calendar className="w-4 h-4" />
                                            <span>{selectedBatch.startDate} to {selectedBatch.endDate}</span>
                                        </div>
                                    </div>
                                </div>
                            </SheetHeader>

                            {/* Batch Details Section */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg flex items-center gap-2 border-b pb-2">
                                    <Layers className="w-5 h-5 text-indigo-500" />
                                    Batch Details
                                </h3>
                                <Card className="shadow-none border-border/50">
                                    <CardContent className="p-4 grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <span className="text-xs text-muted-foreground w-full block">Start Date</span>
                                            <span className="text-sm font-medium">{selectedBatch.startDate}</span>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-xs text-muted-foreground w-full block">Learning End Date</span>
                                            <span className="text-sm font-medium">{selectedBatch.learningEndDate}</span>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-xs text-muted-foreground w-full block">Internship Start Date</span>
                                            <span className="text-sm font-medium">{selectedBatch.internshipStartDate}</span>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-xs text-muted-foreground w-full block">End Date</span>
                                            <span className="text-sm font-medium">{selectedBatch.endDate}</span>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-xs text-muted-foreground w-full block">Tutor Name</span>
                                            <span className="text-sm font-medium">{mockTutors.find(t => t.id === selectedBatch.tutorId)?.name || 'Unassigned'}</span>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-xs text-muted-foreground w-full block">Capacity</span>
                                            <span className="text-sm font-medium">{selectedBatch.capacity}</span>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-xs text-muted-foreground w-full block">Enrolled Students Count</span>
                                            <span className="text-sm font-medium">{selectedBatch.studentIds.length}</span>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-xs text-muted-foreground w-full block">Remaining Seats</span>
                                            <span className="text-sm font-medium max-w-fit px-2 py-0.5 rounded bg-muted">
                                                {selectedBatch.capacity - selectedBatch.studentIds.length}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Enrolled Students Table */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center pb-2 border-b">
                                    <h3 className="font-semibold text-lg flex items-center gap-2">
                                        <BookOpen className="w-5 h-5 text-indigo-500" />
                                        Enrolled Students
                                    </h3>
                                    <Badge variant="secondary" className="rounded-full">
                                        {selectedBatch.studentIds.length} Students
                                    </Badge>
                                </div>

                                <div className="border border-border/50 rounded-md overflow-hidden bg-card">
                                    <Table>
                                        <TableHeader className="bg-muted/30">
                                            <TableRow>
                                                <TableHead>Student Name</TableHead>
                                                <TableHead>Email Address</TableHead>
                                                <TableHead>Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {selectedBatch.studentIds.map(stId => {
                                                const st = mockStudents.find(s => s.id === stId);
                                                if (!st) return null;
                                                return (
                                                    <TableRow key={st.id}>
                                                        <TableCell className="font-medium text-sm">{st.name}</TableCell>
                                                        <TableCell className="text-muted-foreground text-xs">{st.email}</TableCell>
                                                        <TableCell>
                                                            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 shadow-none">
                                                                {st.status}
                                                            </Badge>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                            {selectedBatch.studentIds.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                                                        <div className="flex flex-col items-center justify-center space-y-2">
                                                            <BookOpen className="w-8 h-8 text-muted/50" />
                                                            <span>No students enrolled yet.</span>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-border/50 flex justify-end">
                                <Button variant="outline" onClick={() => setIsViewOpen(false)}>Close View</Button>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>

        </DashboardLayout>
    );
};

export default BatchManagement;
