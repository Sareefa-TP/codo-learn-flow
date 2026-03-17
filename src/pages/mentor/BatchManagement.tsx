import { useState, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format, parse, parseISO, isValid } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
    Search,
    Layers,
    MoreVertical,
    Eye,
    Pencil,
    Users,
    Calendar,
    BookOpen,
    User,
    CalendarIcon
} from "lucide-react";

// --- Types ---
interface Batch {
    id: string;
    name: string;
    course: string;
    tutor: string;
    studentsCount: number;
    startDate: string;
    status: "Upcoming" | "Learning" | "Internship" | "Completed";
    assignedToMe: boolean;
    description?: string;
    endDate?: string;
}

// --- Mock Data ---
const INITIAL_BATCHES: Batch[] = [
    {
        id: "B-001",
        name: "Full Stack Jan 2026",
        course: "Full Stack Development",
        tutor: "Dr. Sarah Mitchell",
        studentsCount: 28,
        startDate: "2026-01-05",
        status: "Learning",
        assignedToMe: true,
        endDate: "2026-04-05",
        description: "Comprehensive Full Stack Development program covering React, Node.js, and Cloud architectures."
    },
    {
        id: "B-002",
        name: "Python FastTrack Feb",
        course: "Data Science with Python",
        tutor: "James Wilson",
        studentsCount: 15,
        startDate: "2026-02-10",
        status: "Upcoming",
        assignedToMe: true,
        endDate: "2026-05-10",
        description: "Intensive Python course focused on data analytics and machine learning fundamentals."
    },
    {
        id: "B-003",
        name: "UI/UX Design Masterclass",
        course: "Graphic & UI Design",
        tutor: "Elena Rodriguez",
        studentsCount: 30,
        startDate: "2025-11-20",
        status: "Internship",
        assignedToMe: false,
        endDate: "2026-03-20",
        description: "Mastering user experience and interface design using industry-standard tools."
    },
    {
        id: "B-004",
        name: "Advanced Node.js Dec",
        course: "Backend Engineering",
        tutor: "Michael Chen",
        studentsCount: 12,
        startDate: "2025-12-01",
        status: "Completed",
        assignedToMe: false,
        endDate: "2026-02-28",
        description: "Specialized course on high-performance backend systems and microservices."
    },
    {
        id: "B-005",
        name: "React Native Mobile Dev",
        course: "Mobile Application Development",
        tutor: "Robert Fox",
        studentsCount: 20,
        startDate: "2026-03-15",
        status: "Upcoming",
        assignedToMe: true,
        endDate: "2026-06-15",
        description: "Building cross-platform mobile applications using React Native and Expo."
    }
];

const MentorBatchManagement = () => {
    const [batches, setBatches] = useState<Batch[]>(INITIAL_BATCHES);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState<"all" | "assigned">("all");
    const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editFormData, setEditFormData] = useState<Partial<Batch>>({});
    const [monthView, setMonthView] = useState<Date>(new Date());

    const years = Array.from({ length: 41 }, (_, i) => (new Date().getFullYear() - 20 + i).toString());
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // --- Statistics ---
    const stats = useMemo(() => {
        return {
            total: batches.length,
            assigned: batches.filter(b => b.assignedToMe).length
        };
    }, [batches]);

    // --- Filtering Logic ---
    const filteredBatches = useMemo(() => {
        return batches.filter(batch => {
            const matchesSearch =
                batch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                batch.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
                batch.tutor.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesFilter = filterType === "all" || batch.assignedToMe;

            return matchesSearch && matchesFilter;
        });
    }, [batches, searchQuery, filterType]);

    // --- Handlers ---
    const handleViewDetails = (batch: Batch) => {
        setSelectedBatch(batch);
        setIsDetailsOpen(true);
    };

    const handleEditBatch = (batch: Batch) => {
        setSelectedBatch(batch);
        setEditFormData({ ...batch });
        setIsEditOpen(true);
    };

    const handleSaveEdit = () => {
        if (!editFormData.name) {
            toast.error("Batch name is required");
            return;
        }

        setBatches(prev => prev.map(b => b.id === selectedBatch?.id ? { ...b, ...editFormData } as Batch : b));
        setIsEditOpen(false);
        toast.success("Batch details updated successfully");
    };

    const getStatusStyles = (status: Batch["status"]) => {
        switch (status) {
            case "Learning":
                return "bg-blue-500/10 text-blue-600 border-blue-500/20";
            case "Internship":
                return "bg-purple-500/10 text-purple-600 border-purple-500/20";
            case "Completed":
                return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
            case "Upcoming":
                return "bg-slate-500/10 text-slate-600 border-slate-500/20";
            default:
                return "bg-gray-500/10 text-gray-600 border-gray-500/20";
        }
    };

    return (
        <DashboardLayout>
            <div className="animate-fade-in space-y-8 max-w-7xl mx-auto pb-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                            <Layers className="w-8 h-8 text-primary" />
                            Batch Management
                        </h1>
                        <p className="text-muted-foreground mt-2 text-sm lg:text-base">
                            Monitor and oversee active batches and program phases.
                        </p>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Card
                        className={cn(
                            "border-border/50 shadow-sm transition-all hover:shadow-md cursor-pointer relative overflow-hidden group",
                            filterType === "all" ? "ring-2 ring-primary bg-primary/5 shadow-md" : "bg-card shadow-sm"
                        )}
                        onClick={() => setFilterType("all")}
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Layers className="w-16 h-16" />
                        </div>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "w-12 h-12 rounded-xl flex items-center justify-center transition-colors shadow-sm",
                                    filterType === "all" ? "bg-primary text-white" : "bg-primary/10 text-primary"
                                )}>
                                    <Layers className="w-6 h-6" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-semibold text-muted-foreground tracking-wider leading-none">Total Batch</p>
                                    <h3 className="text-3xl font-bold text-foreground mt-1">{stats.total}</h3>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card
                        className={cn(
                            "border-border/50 shadow-sm transition-all hover:shadow-md cursor-pointer relative overflow-hidden group",
                            filterType === "assigned" ? "ring-2 ring-indigo-500 bg-indigo-500/5 shadow-md" : "bg-card shadow-sm"
                        )}
                        onClick={() => setFilterType("assigned")}
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <User className="w-16 h-16" />
                        </div>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "w-12 h-12 rounded-xl flex items-center justify-center transition-colors shadow-sm",
                                    filterType === "assigned" ? "bg-indigo-600 text-white" : "bg-indigo-500/10 text-indigo-600"
                                )}>
                                    <User className="w-6 h-6" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-semibold text-muted-foreground tracking-wider leading-none">My Batch</p>
                                    <h3 className="text-3xl font-bold text-foreground mt-1">{stats.assigned}</h3>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Batch List Section */}
                <Card className="border-border/50 shadow-sm overflow-hidden rounded-2xl">
                    <CardHeader className="bg-muted/20 px-6 py-5 border-b border-border/40">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-primary" />
                                Batch List Overview
                            </CardTitle>

                            <div className="relative w-full md:w-80">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search batches, courses, or tutors..."
                                    className="pl-10 h-10 rounded-xl bg-background border-border/50 focus:ring-primary/20 text-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/10 border-b border-border/40 hover:bg-muted/10">
                                        <TableHead className="py-4 pl-6 font-bold text-xs uppercase tracking-wider text-muted-foreground">Batch Name</TableHead>
                                        <TableHead className="py-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">Course</TableHead>
                                        <TableHead className="py-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">Tutor</TableHead>
                                        <TableHead className="py-4 font-bold text-xs uppercase tracking-wider text-muted-foreground text-center">Students</TableHead>
                                        <TableHead className="py-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">Start Date</TableHead>
                                        <TableHead className="py-4 font-bold text-xs uppercase tracking-wider text-muted-foreground text-center">Status</TableHead>
                                        <TableHead className="py-4 pr-6 font-bold text-xs uppercase tracking-wider text-muted-foreground text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredBatches.length > 0 ? (
                                        filteredBatches.map((batch) => (
                                            <TableRow key={batch.id} className="group hover:bg-muted/5 transition-colors border-b border-border/20 last:border-0">
                                                <TableCell className="py-5 pl-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center text-primary font-bold text-xs">
                                                            {batch.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                                        </div>
                                                        <span className="font-bold text-foreground text-sm tracking-tight">{batch.name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-5">
                                                    <span className="text-sm font-medium text-muted-foreground">{batch.course}</span>
                                                </TableCell>
                                                <TableCell className="py-5">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                                                            <User className="w-3 h-3 text-muted-foreground" />
                                                        </div>
                                                        <span className="text-sm font-semibold text-foreground/80">{batch.tutor}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-5 text-center">
                                                    <div className="flex items-center justify-center gap-1.5">
                                                        <Users className="w-3.5 h-3.5 text-primary/60" />
                                                        <span className="text-sm font-bold text-foreground">{batch.studentsCount}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-5">
                                                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                                        <Calendar className="w-3.5 h-3.5 text-primary/40" />
                                                        {batch.startDate}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-5 text-center">
                                                    <Badge className={cn(
                                                        "rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest border shadow-none bg-background",
                                                        getStatusStyles(batch.status)
                                                    )}>
                                                        {batch.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="py-5 pr-6 text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/5 hover:text-primary transition-colors">
                                                                <MoreVertical className="w-4 h-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48 rounded-xl border-border/50 shadow-xl p-1.5">
                                                            <DropdownMenuLabel className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest px-3 py-2">Batch Actions</DropdownMenuLabel>
                                                            <DropdownMenuItem className="gap-2.5 px-3 py-2 cursor-pointer rounded-lg focus:bg-primary/5 focus:text-primary transition-colors mb-0.5" onClick={() => handleViewDetails(batch)}>
                                                                <Eye className="w-3.5 h-3.5" />
                                                                <span className="font-semibold text-xs">View Details</span>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="gap-2.5 px-3 py-2 cursor-pointer rounded-lg focus:bg-indigo-50 focus:text-indigo-600 transition-colors" onClick={() => handleEditBatch(batch)}>
                                                                <Pencil className="w-3.5 h-3.5" />
                                                                <span className="font-semibold text-xs">Edit Batch</span>
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={7} className="h-48 text-center bg-muted/5">
                                                <div className="flex flex-col items-center justify-center gap-3 opacity-40">
                                                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                                                        <Layers className="w-8 h-8" />
                                                    </div>
                                                    <p className="text-sm font-medium italic">No batches found matching your criteria</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Details Modal */}
                <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                    <DialogContent className="sm:max-w-[500px] rounded-3xl border-border shadow-2xl p-0 overflow-hidden bg-background">
                        <div className="bg-primary/5 p-8 border-b border-border/50">
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                                    <Layers className="w-8 h-8" />
                                </div>
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-bold tracking-tight text-foreground">{selectedBatch?.name}</h2>
                                    <Badge className={cn("rounded-full uppercase text-[9px] font-black tracking-widest px-3 py-0.5 border shadow-none bg-background", selectedBatch ? getStatusStyles(selectedBatch.status) : "")}>
                                        {selectedBatch?.status}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5 p-4 rounded-2xl bg-muted/30 border border-border/50 hover:border-primary/30 transition-colors">
                                    <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Course</Label>
                                    <p className="font-bold text-foreground text-sm leading-tight">{selectedBatch?.course}</p>
                                </div>
                                <div className="space-y-1.5 p-4 rounded-2xl bg-muted/30 border border-border/50 hover:border-primary/30 transition-colors">
                                    <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Tutor</Label>
                                    <p className="font-bold text-foreground text-sm leading-tight">{selectedBatch?.tutor}</p>
                                </div>
                                <div className="space-y-1.5 p-4 rounded-2xl bg-muted/30 border border-border/50 hover:border-primary/30 transition-colors">
                                    <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Start Date</Label>
                                    <p className="font-bold text-foreground text-sm leading-tight">{selectedBatch?.startDate}</p>
                                </div>
                                <div className="space-y-1.5 p-4 rounded-2xl bg-muted/30 border border-border/50 hover:border-primary/30 transition-colors text-center">
                                    <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Students</Label>
                                    <div className="flex items-center justify-center gap-2 mt-1">
                                        <Users className="w-4 h-4 text-primary" />
                                        <p className="font-black text-foreground text-xl">{selectedBatch?.studentsCount}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2.5">
                                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Batch Description</Label>
                                <div className="p-5 rounded-2xl bg-muted/10 border border-border/40 min-h-[100px] flex items-center justify-center text-center">
                                    <p className="text-sm text-foreground/70 leading-relaxed font-medium">
                                        {selectedBatch?.description || "No description available for this batch."}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-muted/20 border-t border-border/50 flex justify-end">
                            <Button variant="outline" className="rounded-xl px-8 font-bold border-border/50 hover:bg-background transition-colors" onClick={() => setIsDetailsOpen(false)}>
                                Close View
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Edit Modal */}
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DialogContent className="sm:max-w-[500px] rounded-3xl border-border shadow-2xl p-0 overflow-hidden bg-background">
                        <div className="bg-indigo-600/5 p-8 border-b border-border/50">
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                                    <Pencil className="w-8 h-8" />
                                </div>
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-bold tracking-tight text-foreground">Edit Batch</h2>
                                    <p className="text-sm text-muted-foreground font-medium italic">Refine batch information and schedules.</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 space-y-5">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Batch Name</Label>
                                <Input
                                    value={editFormData.name}
                                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                    className="rounded-xl h-11 border-border/50 focus:ring-indigo-500/20 font-semibold"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Tutor</Label>
                                <Input
                                    value={editFormData.tutor}
                                    onChange={(e) => setEditFormData({ ...editFormData, tutor: e.target.value })}
                                    className="rounded-xl h-11 border-border/50 focus:ring-indigo-500/20 font-semibold"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Start Date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full rounded-xl h-11 border-border/50 justify-start text-left font-normal focus:ring-indigo-500/20",
                                                    !editFormData.startDate && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4 text-indigo-500" />
                                                {editFormData.startDate ? format(parseISO(editFormData.startDate), "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-4 rounded-2xl shadow-xl border-border/50" align="start">
                                            <div className="flex gap-2 mb-4">
                                                <Select
                                                    value={months[monthView.getMonth()]}
                                                    onValueChange={(value) => {
                                                        const newDate = new Date(monthView);
                                                        newDate.setMonth(months.indexOf(value));
                                                        setMonthView(newDate);
                                                    }}
                                                >
                                                    <SelectTrigger className="w-[130px] rounded-lg bg-muted/50 border-none h-9 text-xs font-bold">
                                                        <SelectValue placeholder="Month" />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-xl border-border/50 shadow-lg">
                                                        {months.map((month) => (
                                                            <SelectItem key={month} value={month} className="text-xs font-medium rounded-lg">{month}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <Select
                                                    value={monthView.getFullYear().toString()}
                                                    onValueChange={(value) => {
                                                        const newDate = new Date(monthView);
                                                        newDate.setFullYear(parseInt(value));
                                                        setMonthView(newDate);
                                                    }}
                                                >
                                                    <SelectTrigger className="w-[100px] rounded-lg bg-muted/50 border-none h-9 text-xs font-bold">
                                                        <SelectValue placeholder="Year" />
                                                    </SelectTrigger>
                                                    <SelectContent className="max-h-[200px] rounded-xl border-border/50 shadow-lg">
                                                        {years.map((year) => (
                                                            <SelectItem key={year} value={year} className="text-xs font-medium rounded-lg">{year}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <CalendarComponent
                                                mode="single"
                                                selected={editFormData.startDate ? parseISO(editFormData.startDate) : undefined}
                                                onSelect={(date) => {
                                                    if (date) {
                                                        const formattedDate = format(date, "yyyy-MM-dd");
                                                        setEditFormData({ ...editFormData, startDate: formattedDate });
                                                    }
                                                }}
                                                month={monthView}
                                                onMonthChange={setMonthView}
                                                initialFocus
                                                className="rounded-xl border-none p-0"
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Enrolled Count</Label>
                                    <Input
                                        type="number"
                                        value={editFormData.studentsCount}
                                        onChange={(e) => setEditFormData({ ...editFormData, studentsCount: Number(e.target.value) })}
                                        className="rounded-xl h-11 border-border/50 focus:ring-indigo-500/20 font-bold"
                                    />
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="p-6 bg-muted/20 border-t border-border/50 gap-3">
                            <Button variant="outline" className="rounded-xl px-6 border-border/50 font-bold hover:bg-background transition-colors" onClick={() => setIsEditOpen(false)}>
                                Cancel
                            </Button>
                            <Button className="rounded-xl px-8 bg-indigo-600 hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-500/20 transition-all" onClick={handleSaveEdit}>
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    );
};

export default MentorBatchManagement;
