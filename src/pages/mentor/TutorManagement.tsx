import { useState, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Clock,
    User,
    Book,
    Briefcase,
    MapPin,
    Building2,
    Calendar as CalendarIcon,
    Save,
    ShieldCheck,
    Users,
    GraduationCap,
    Search,
    Filter,
    ArrowUpDown,
    CheckCircle2,
    MoreVertical,
    Mail,
    Phone
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Tutor {
    id: string;
    name: string;
    email: string;
    phone: string;
    dob: string;
    gender: "Male" | "Female" | "Other";
    address: string;
    specialization: string;
    experience: string;
    assignedBatch: string;
    totalStudents: number;
    status: "Active" | "Inactive" | "On Leave";
    isAssignedToMe: boolean;
}

const mockTutors: Tutor[] = [
    {
        id: "T001", name: "Dr. Sarah Mitchell", email: "sarah.m@codo.edu", phone: "+91 98765 43210",
        dob: "1985-05-15", gender: "Female", address: "123 Tech Park, Bangalore",
        specialization: "Full Stack Development", experience: "12 Years",
        assignedBatch: "Batch 01", totalStudents: 45, status: "Active", isAssignedToMe: true
    },
    {
        id: "T002", name: "James Wilson", email: "james.w@codo.edu", phone: "+91 98765 43211",
        dob: "1988-11-20", gender: "Male", address: "456 Innovation Hub, Hyderabad",
        specialization: "Python Backend", experience: "8 Years",
        assignedBatch: "Batch 02", totalStudents: 32, status: "Active", isAssignedToMe: true
    },
    {
        id: "T003", name: "Elena Rodriguez", email: "elena.r@codo.edu", phone: "+91 98765 43212",
        dob: "1992-03-10", gender: "Female", address: "789 Creative Studio, Pune",
        specialization: "UI/UX Design", experience: "6 Years",
        assignedBatch: "Batch 01", totalStudents: 28, status: "Inactive", isAssignedToMe: false
    },
    {
        id: "T004", name: "Michael Chen", email: "michael.c@codo.edu", phone: "+91 98765 43213",
        dob: "1984-08-25", gender: "Male", address: "101 Data Dr, Mumbai",
        specialization: "Data Science", experience: "15 Years",
        assignedBatch: "Batch 03", totalStudents: 50, status: "Active", isAssignedToMe: true
    },
    {
        id: "T005", name: "Priya Das", email: "priya.d@codo.edu", phone: "+91 98765 43214",
        dob: "1990-12-05", gender: "Female", address: "202 Mobile Ln, Chennai",
        specialization: "React Native", experience: "7 Years",
        assignedBatch: "Batch 01", totalStudents: 25, status: "On Leave", isAssignedToMe: false
    },
];

const TutorManagement = () => {
    const [tutors, setTutors] = useState<Tutor[]>(mockTutors);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [assignmentFilter, setAssignmentFilter] = useState<"all" | "mine">("all");

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Partial<Tutor>>({});

    const stats = {
        allTutors: tutors.length,
        myTutors: tutors.filter(t => t.isAssignedToMe).length
    };

    const filteredTutors = useMemo(() => {
        return tutors.filter(tutor => {
            const matchesSearch = tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tutor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tutor.specialization.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus = statusFilter === "all" || tutor.status === statusFilter;
            const matchesAssignment = assignmentFilter === "all" || (assignmentFilter === "mine" && tutor.isAssignedToMe);

            return matchesSearch && matchesStatus && matchesAssignment;
        });
    }, [tutors, searchQuery, statusFilter, assignmentFilter]);

    const handleOpenModal = (tutor: Tutor) => {
        setSelectedTutor(tutor);
        setFormData({ ...tutor });
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleSaveAcademicDetails = () => {
        if (!selectedTutor) return;

        setTutors(prev => prev.map(t =>
            t.id === selectedTutor.id ? { ...t, ...formData } as Tutor : t
        ));

        toast.success(`Tutor profile updated for ${selectedTutor.name}`);
        setIsModalOpen(false);
    };

    const getStatusBadge = (status: Tutor["status"]) => {
        switch (status) {
            case "Active":
                return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Active</Badge>;
            case "Inactive":
                return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20">Inactive</Badge>;
            case "On Leave":
                return <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">On Leave</Badge>;
        }
    };

    return (
        <DashboardLayout>
            <div className="animate-fade-in space-y-8 max-w-6xl mx-auto pb-10">
                {/* Header */}
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">
                        Tutor Management
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Overview of all tutors and your assigned team.
                    </p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Card
                        className={`border-border/50 shadow-sm transition-all cursor-pointer ${assignmentFilter === "all" ? "ring-2 ring-primary bg-primary/5" : "hover:bg-muted/30"}`}
                        onClick={() => setAssignmentFilter("all")}
                    >
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                                    <Users className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground tracking-wider leading-none">All Tutors</p>
                                    <h3 className="text-3xl font-bold mt-1.5 text-blue-600">{stats.allTutors}</h3>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card
                        className={`border-border/50 shadow-sm transition-all cursor-pointer ${assignmentFilter === "mine" ? "ring-2 ring-primary bg-primary/5" : "hover:bg-muted/30"}`}
                        onClick={() => setAssignmentFilter("mine")}
                    >
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    <GraduationCap className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground tracking-wider leading-none">My Tutors</p>
                                    <h3 className="text-3xl font-bold mt-1.5 text-primary">{stats.myTutors}</h3>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filter & Table Section */}
                <Card className="border-border/50 shadow-sm overflow-hidden rounded-xl">
                    <CardHeader className="border-b bg-muted/20 px-6 py-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                <Users className="w-5 h-5 text-primary" />
                                Tutor List
                            </CardTitle>

                            <div className="flex flex-col sm:flex-row items-center gap-3">
                                <div className="relative w-full sm:w-64">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search tutors..."
                                        className="pl-9 h-9 rounded-lg"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                    <Button variant="outline" size="sm" className="h-9 gap-2 rounded-lg">
                                        <Filter className="w-4 h-4" />
                                        Filter
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/30 hover:bg-muted/30 border-b">
                                        <TableHead className="font-bold py-4">Tutor Name</TableHead>
                                        <TableHead className="font-bold">Email</TableHead>
                                        <TableHead className="font-bold">Course</TableHead>
                                        <TableHead className="font-bold">Assigned Batch</TableHead>
                                        <TableHead className="font-bold">Status</TableHead>
                                        <TableHead className="font-bold text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredTutors.length > 0 ? (
                                        filteredTutors.map((tutor) => (
                                            <TableRow key={tutor.id} className="hover:bg-muted/5 transition-colors border-b last:border-0 text-sm">
                                                <TableCell className="py-4 font-medium">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                                                            {tutor.name.split(" ").map(n => n[0]).join("")}
                                                        </div>
                                                        {tutor.name}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="w-3.5 h-3.5 text-primary/40" />
                                                        {tutor.email}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground font-medium">{tutor.specialization}</TableCell>
                                                <TableCell className="text-center font-bold">
                                                    {tutor.assignedBatch}
                                                </TableCell>
                                                <TableCell>{getStatusBadge(tutor.status)}</TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                                <MoreVertical className="w-4 h-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48 rounded-xl">
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="gap-2 cursor-pointer"
                                                                onClick={() => handleOpenModal(tutor)}
                                                            >
                                                                <User className="w-4 h-4 text-primary" />
                                                                View Full Profile
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-32 text-center text-muted-foreground italic">
                                                No tutors found matching your criteria.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Tutor Profile Modal */}
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl p-0 gap-0 border-none">
                        <DialogHeader className="p-6 bg-gradient-to-r from-primary/10 to-transparent border-b">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-xl font-bold text-primary">
                                    {selectedTutor?.name.split(" ").map(n => n[0]).join("")}
                                </div>
                                <div className="text-left">
                                    <DialogTitle className="text-2xl font-bold">Tutor Profile</DialogTitle>
                                    <p className="text-muted-foreground">{selectedTutor?.name} • {selectedTutor?.specialization}</p>
                                </div>
                            </div>
                        </DialogHeader>

                        <div className="p-6 space-y-8">
                            {/* Personal Information Section */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                                    <User className="w-4 h-4" /> Personal Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground">Full Name</Label>
                                        <Input
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="h-10 rounded-xl bg-background border-border/60"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground">Email Address</Label>
                                        <Input
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="h-10 rounded-xl bg-background border-border/60"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground">Phone Number</Label>
                                        <Input
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="h-10 rounded-xl bg-background border-border/60"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground">Date of Birth</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full h-10 rounded-xl justify-start text-left font-normal bg-background border-border/60",
                                                        !formData.dob && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                                                    {formData.dob ? format(new Date(formData.dob), "dd MMMM yyyy") : <span>Pick a date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0 rounded-2xl shadow-xl border-border/40" align="start">
                                                <CalendarUI
                                                    mode="single"
                                                    selected={formData.dob ? new Date(formData.dob) : undefined}
                                                    onSelect={(date) => setFormData({ ...formData, dob: date ? format(date, "yyyy-MM-dd") : "" })}
                                                    initialFocus
                                                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                                    className="rounded-2xl"
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground">Gender</Label>
                                        <Select
                                            value={formData.gender}
                                            onValueChange={(v) => setFormData({ ...formData, gender: v as any })}
                                        >
                                            <SelectTrigger className="h-10 rounded-xl bg-background border-border/60">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                <SelectItem value="Male">Male</SelectItem>
                                                <SelectItem value="Female">Female</SelectItem>
                                                <SelectItem value="Other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground">Address</Label>
                                        <Input
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            className="h-10 rounded-xl bg-background border-border/60"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Professional Information Section */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                                    <Briefcase className="w-4 h-4" /> Professional Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground">Specialization</Label>
                                        <Input
                                            value={formData.specialization}
                                            onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                                            className="h-10 rounded-xl bg-background border-border/60"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground">Experience</Label>
                                        <Input
                                            value={formData.experience}
                                            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                            className="h-10 rounded-xl bg-background border-border/60"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground">Assigned Batch</Label>
                                        <Input
                                            value={formData.assignedBatch}
                                            onChange={(e) => setFormData({ ...formData, assignedBatch: e.target.value })}
                                            className="h-10 rounded-xl bg-background border-border/60"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground">Total Students</Label>
                                        <Input
                                            type="number"
                                            value={formData.totalStudents}
                                            onChange={(e) => setFormData({ ...formData, totalStudents: parseInt(e.target.value) })}
                                            className="h-10 rounded-xl bg-background border-border/60"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground">Current Status</Label>
                                        <Select
                                            value={formData.status}
                                            onValueChange={(v) => setFormData({ ...formData, status: v as any })}
                                        >
                                            <SelectTrigger className="h-10 rounded-xl bg-background border-border/60">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                <SelectItem value="Active">Active</SelectItem>
                                                <SelectItem value="Inactive">Inactive</SelectItem>
                                                <SelectItem value="On Leave">On Leave</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="p-6 bg-muted/10 border-t flex flex-row justify-end gap-3">
                            <Button variant="outline" className="rounded-xl" onClick={() => setIsModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button className="rounded-xl gap-2 shadow-sm" onClick={handleSaveAcademicDetails}>
                                <Save className="w-4 h-4" /> Save Changes
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    );
};

export default TutorManagement;
