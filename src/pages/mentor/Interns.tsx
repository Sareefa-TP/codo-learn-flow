import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format, parseISO } from "date-fns";
import {
  Search,
  Eye,
  Briefcase,
  Users,
  Filter,
  Mail,
  User,
  Phone,
  Calendar,
  Clock,
  BookOpen,
  MapPin,
  UserCheck,
  ClipboardList,
  BarChart3,
  GraduationCap,
  Save
} from "lucide-react";
import { mentees as initialMentees, Mentee } from "@/data/mentorData";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// ─── Constants ─────────────────────────────────────────────────────────────

const statusStyles: Record<string, string> = {
  "on-track": "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  "ahead": "bg-blue-500/10 text-blue-600 border-blue-500/20",
  "at-risk": "bg-rose-500/10 text-rose-600 border-rose-500/20",
  "needs-attention": "bg-amber-500/10 text-amber-600 border-amber-500/20",
};

// ─── Page Component ───────────────────────────────────────────────────────────

const MentorInterns = () => {
  const [internList, setInternList] = useState<Mentee[]>(initialMentees);
  const [search, setSearch] = useState("");
  const [assignedOnly, setAssignedOnly] = useState(false);
  const [selectedIntern, setSelectedIntern] = useState<Mentee | null>(null);
  const [editData, setEditData] = useState<Mentee | null>(null);
  const navigate = useNavigate();

  const allInterns = useMemo(() => internList.filter(m => m.type === "intern"), [internList]);

  const stats = useMemo(() => ({
    totalInterns: allInterns.length,
    myInterns: allInterns.filter(m => m.assignedToMe).length
  }), [allInterns]);

  const filteredInterns = useMemo(() => {
    return allInterns.filter(m => {
      const matchesSearch =
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.email.toLowerCase().includes(search.toLowerCase()) ||
        (m.batch?.toLowerCase() || "").includes(search.toLowerCase()) ||
        m.course.toLowerCase().includes(search.toLowerCase());

      const matchesAssignment = !assignedOnly || m.assignedToMe;

      return matchesSearch && matchesAssignment;
    });
  }, [allInterns, search, assignedOnly]);

  const handleOpenProfile = (intern: Mentee) => {
    setSelectedIntern(intern);
    setEditData({ ...intern });
    if (intern.dob) {
      setMonthView(parseISO(intern.dob));
    } else {
      setMonthView(new Date());
    }

    // Initialize Internship Start Date view
    if (intern.startDate) {
      setStartMonthView(parseISO(intern.startDate));
    } else {
      setStartMonthView(new Date());
    }
  };

  const handleSaveChanges = () => {
    if (!editData || !selectedIntern) return;

    setInternList(prev => prev.map(m => m.id === editData.id ? editData : m));
    setSelectedIntern(null);
    setEditData(null);
    toast.success("Intern profile updated successfully!");
  };

  const availableGenders = ["Male", "Female"];
  const availableStatus = ["on-track", "ahead", "at-risk", "needs-attention"];
  const availableMentors = ["Deepa Nair", "Elena Rodriguez", "Arjun Verma", "Sarah Parker"];
  const availableTutors = ["James Wilson", "Sarah Thompson", "Michael Chen", "Dr. Sarah Mitchell", "Robert Fox"];

  // ─── DOB Picker Helpers ───
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1949 }, (_, i) => (currentYear - i).toString());
  // Years for internship might need to look ahead slightly or just standard
  const futureYears = Array.from({ length: 15 }, (_, i) => (currentYear + 5 - i).toString());
  const combinedYears = Array.from(new Set([...futureYears, ...years])).sort((a, b) => parseInt(b) - parseInt(a));

  const [monthView, setMonthView] = useState<Date>(new Date());
  const [startMonthView, setStartMonthView] = useState<Date>(new Date());

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-8 max-w-6xl mx-auto pb-10">

        {/* ── Page Header ── */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">Intern Management</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Monitor and guide interns assigned to your mentorship programs.
          </p>
        </div>

        {/* ── Summary Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card
            className={cn(
              "border-border/50 shadow-sm transition-all cursor-pointer",
              !assignedOnly ? "ring-2 ring-primary bg-primary/5 shadow-md" : "hover:bg-muted/30"
            )}
            onClick={() => setAssignedOnly(false)}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                  !assignedOnly ? "bg-blue-600 text-white" : "bg-blue-500/10 text-blue-600"
                )}>
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground tracking-wider leading-none">Total Interns</p>
                  <h3 className={cn(
                    "text-3xl font-bold mt-1.5 transition-colors",
                    !assignedOnly ? "text-blue-700 dark:text-blue-400" : "text-blue-600"
                  )}>{stats.totalInterns}</h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className={cn(
              "border-border/50 shadow-sm transition-all cursor-pointer",
              assignedOnly ? "ring-2 ring-primary bg-primary/5 shadow-md" : "hover:bg-muted/30"
            )}
            onClick={() => setAssignedOnly(true)}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                  assignedOnly ? "bg-primary text-white" : "bg-primary/10 text-primary"
                )}>
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground tracking-wider leading-none">My Interns</p>
                  <h3 className={cn(
                    "text-3xl font-bold mt-1.5 transition-colors",
                    assignedOnly ? "text-primary-700 dark:text-primary-400" : "text-primary"
                  )}>{stats.myInterns}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Filter & Table Section ── */}
        <Card className="border-border/50 shadow-sm overflow-hidden rounded-xl">
          <CardHeader className="border-b bg-muted/20 px-6 py-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                Intern List
              </CardTitle>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search interns..."
                    className="pl-9 h-9 rounded-lg"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
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
                    <TableHead className="font-bold py-4 pl-6">Intern Name</TableHead>
                    <TableHead className="font-bold">Email</TableHead>
                    <TableHead className="font-bold">Batch</TableHead>
                    <TableHead className="font-bold">Course</TableHead>
                    <TableHead className="font-bold">Assigned Mentor</TableHead>
                    <TableHead className="font-bold">Status</TableHead>
                    <TableHead className="font-bold text-right pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInterns.length > 0 ? (
                    filteredInterns.map((intern) => (
                      <TableRow key={intern.id} className="hover:bg-muted/5 transition-colors border-b last:border-0 text-sm font-medium">
                        <TableCell className="py-4 pl-6 font-semibold">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                              {intern.name.split(" ").map(n => n[0]).join("")}
                            </div>
                            <span className="text-foreground">{intern.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground font-normal">
                          <div className="flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5 text-primary/40" />
                            {intern.email}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground font-medium">
                          {intern.batch || "Not Assigned"}
                        </TableCell>
                        <TableCell className="text-muted-foreground font-normal">
                          {intern.course}
                        </TableCell>
                        <TableCell className="text-muted-foreground font-medium">
                          {intern.assignedMentor || "Not Assigned"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-[10px] font-bold capitalize px-2.5 py-0.5 rounded-full ${statusStyles[intern.status]}`}>
                            {intern.status.replace("-", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 gap-1.5 text-xs font-semibold rounded-lg hover:bg-primary/5"
                            onClick={() => handleOpenProfile(intern)}
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View Profile
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-32 text-center text-muted-foreground italic">
                        No interns found matching your criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* ── Intern Profile Modal ── */}
        <Dialog open={!!selectedIntern} onOpenChange={(open) => {
          if (!open) {
            setSelectedIntern(null);
            setEditData(null);
          }
        }}>
          <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden rounded-2xl border-none shadow-2xl">
            <DialogHeader className="p-8 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-b">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-primary/20">
                  {selectedIntern?.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="space-y-1">
                  <DialogTitle className="text-2xl font-bold tracking-tight">Edit Intern Profile</DialogTitle>
                  <p className="text-sm font-medium text-primary/60 flex items-center gap-2">
                    Intern ID: {selectedIntern?.id} • <span className="text-foreground/80 lowercase">{selectedIntern?.status.replace("-", " ")}</span>
                  </p>
                </div>
              </div>
            </DialogHeader>

            {editData && (
              <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                {/* Section 1: Personal Information */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Personal Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Full Name</Label>
                      <Input
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        className="h-11 rounded-xl bg-background border-border/50 focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Email Address</Label>
                      <Input
                        value={editData.email}
                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                        className="h-11 rounded-xl bg-background border-border/50 focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Phone Number</Label>
                      <Input
                        value={editData.phone || ""}
                        onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                        placeholder="+91 XXXXX XXXXX"
                        className="h-11 rounded-xl bg-background border-border/50 focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Date of Birth</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full h-11 justify-start text-left font-normal rounded-xl bg-background border-border/50 focus:ring-primary/20",
                              !editData.dob && "text-muted-foreground"
                            )}
                          >
                            <Calendar className="mr-2 h-4 w-4 text-primary" />
                            {editData.dob ? (
                              format(parseISO(editData.dob), "dd MMMM yyyy")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-4 rounded-2xl border-border/50 shadow-xl" align="start">
                          <div className="flex items-center gap-2 mb-4">
                            <Select
                              value={months[monthView.getMonth()]}
                              onValueChange={(val) => {
                                const newMonth = months.indexOf(val);
                                const newDate = new Date(monthView);
                                newDate.setMonth(newMonth);
                                setMonthView(newDate);
                              }}
                            >
                              <SelectTrigger className="h-9 rounded-lg bg-muted/50 border-none text-xs font-bold">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="max-h-64 rounded-xl">
                                {months.map(m => (
                                  <SelectItem key={m} value={m} className="text-xs font-medium">{m}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <Select
                              value={monthView.getFullYear().toString()}
                              onValueChange={(val) => {
                                const newYear = parseInt(val);
                                const newDate = new Date(monthView);
                                newDate.setFullYear(newYear);
                                setMonthView(newDate);
                              }}
                            >
                              <SelectTrigger className="h-9 rounded-lg bg-muted/50 border-none text-xs font-bold">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="max-h-64 rounded-xl">
                                {years.map(y => (
                                  <SelectItem key={y} value={y} className="text-xs font-medium">{y}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <CalendarComponent
                            mode="single"
                            month={monthView}
                            onMonthChange={setMonthView}
                            selected={editData.dob ? parseISO(editData.dob) : undefined}
                            onSelect={(date) => {
                              if (date) {
                                setEditData({ ...editData, dob: format(date, "yyyy-MM-dd") });
                              }
                            }}
                            initialFocus
                            className="rounded-xl p-0"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Gender</Label>
                      <Select
                        value={editData.gender}
                        onValueChange={(val) => setEditData({ ...editData, gender: val })}
                      >
                        <SelectTrigger className="h-11 rounded-xl bg-background border-border/50">
                          <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {availableGenders.map(g => (
                            <SelectItem key={g} value={g}>{g}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Address</Label>
                      <Input
                        value={editData.address || ""}
                        onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                        className="h-11 rounded-xl bg-background border-border/50 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Internship Information */}
                <div className="space-y-4 pt-6 border-t border-border/50">
                  <h4 className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Internship Information
                  </h4>
                  <div className="p-6 rounded-2xl bg-muted/30 border border-border/50 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Program / Course</Label>
                      <Input
                        value={editData.course}
                        onChange={(e) => setEditData({ ...editData, course: e.target.value })}
                        className="h-11 rounded-xl bg-background border-border/50 focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Batch Name</Label>
                      <Input
                        value={editData.batch || ""}
                        onChange={(e) => setEditData({ ...editData, batch: e.target.value })}
                        placeholder="e.g. Jan 2026 Batch"
                        className="h-11 rounded-xl bg-background border-border/50 focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Internship Start Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full h-11 justify-start text-left font-normal rounded-xl bg-background border-border/50 focus:ring-primary/20",
                              !editData.startDate && "text-muted-foreground"
                            )}
                          >
                            <Calendar className="mr-2 h-4 w-4 text-primary" />
                            {editData.startDate ? (
                              format(parseISO(editData.startDate), "dd MMMM yyyy")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-4 rounded-2xl border-border/50 shadow-xl" align="start">
                          <div className="flex items-center gap-2 mb-4">
                            <Select
                              value={months[startMonthView.getMonth()]}
                              onValueChange={(val) => {
                                const newMonth = months.indexOf(val);
                                const newDate = new Date(startMonthView);
                                newDate.setMonth(newMonth);
                                setStartMonthView(newDate);
                              }}
                            >
                              <SelectTrigger className="h-9 rounded-lg bg-muted/50 border-none text-xs font-bold">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="max-h-64 rounded-xl">
                                {months.map(m => (
                                  <SelectItem key={m} value={m} className="text-xs font-medium">{m}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <Select
                              value={startMonthView.getFullYear().toString()}
                              onValueChange={(val) => {
                                const newYear = parseInt(val);
                                const newDate = new Date(startMonthView);
                                newDate.setFullYear(newYear);
                                setStartMonthView(newDate);
                              }}
                            >
                              <SelectTrigger className="h-9 rounded-lg bg-muted/50 border-none text-xs font-bold">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="max-h-64 rounded-xl">
                                {combinedYears.map(y => (
                                  <SelectItem key={y} value={y} className="text-xs font-medium">{y}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <CalendarComponent
                            mode="single"
                            month={startMonthView}
                            onMonthChange={setStartMonthView}
                            selected={editData.startDate ? parseISO(editData.startDate) : undefined}
                            onSelect={(date) => {
                              if (date) {
                                setEditData({ ...editData, startDate: format(date, "yyyy-MM-dd") });
                              }
                            }}
                            initialFocus
                            className="rounded-xl p-0"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Internship Duration</Label>
                      <Input
                        value={editData.duration || ""}
                        onChange={(e) => setEditData({ ...editData, duration: e.target.value })}
                        placeholder="e.g. 6 Months"
                        className="h-11 rounded-xl bg-background border-border/50 focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2 text-left">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Assigned Mentor</Label>
                      <Select
                        value={editData.assignedMentor}
                        onValueChange={(val) => setEditData({ ...editData, assignedMentor: val })}
                      >
                        <SelectTrigger className="h-11 rounded-xl bg-background border-border/50">
                          <div className="flex items-center gap-2">
                            <UserCheck className="w-4 h-4 text-primary/40" />
                            <SelectValue placeholder="Select Mentor" />
                          </div>
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {availableMentors.map(m => (
                            <SelectItem key={m} value={m}>{m}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 text-left">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Assigned Tutor</Label>
                      <Select
                        value={editData.assignedTutor}
                        onValueChange={(val) => setEditData({ ...editData, assignedTutor: val })}
                      >
                        <SelectTrigger className="h-11 rounded-xl bg-background border-border/50">
                          <div className="flex items-center gap-2">
                            <GraduationCap className="w-4 h-4 text-primary/40" />
                            <SelectValue placeholder="Select Tutor" />
                          </div>
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {availableTutors.map(t => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 md:col-span-2 text-left">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Internship Status</Label>
                      <Select
                        value={editData.status}
                        onValueChange={(val) => setEditData({ ...editData, status: val as Mentee["status"] })}
                      >
                        <SelectTrigger className="h-11 rounded-xl bg-background border-border/50">
                          <SelectValue placeholder="Update Status" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {availableStatus.map(s => (
                            <SelectItem key={s} value={s}>
                              <Badge variant="outline" className={`text-[10px] font-bold capitalize px-2.5 py-0.5 rounded-full ${statusStyles[s]}`}>
                                {s.replace("-", " ")}
                              </Badge>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Section 3: Performance Summary (View Only) */}
                <div className="space-y-4 pt-6 border-t border-border/50">
                  <h4 className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Performance Summary
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-orange-500/5 border border-orange-500/10 p-4 rounded-xl text-center">
                      <p className="text-[10px] font-bold text-orange-600 uppercase mb-1">Total Tasks</p>
                      <p className="text-2xl font-black text-orange-700">{editData.metrics?.tasks?.total || 0}</p>
                    </div>
                    <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-xl text-center">
                      <p className="text-[10px] font-bold text-emerald-600 uppercase mb-1">Completed</p>
                      <p className="text-2xl font-black text-emerald-700">{editData.metrics?.tasks?.completed || 0}</p>
                    </div>
                    <div className="bg-muted border border-border/50 p-4 rounded-xl text-center">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Pending</p>
                      <p className="text-2xl font-black">{editData.metrics?.tasks?.pending || 0}</p>
                    </div>
                    <div className="bg-primary/5 border border-primary/10 p-4 rounded-xl text-center">
                      <p className="text-[10px] font-bold text-primary uppercase mb-1">Attendance</p>
                      <p className="text-2xl font-black text-primary">{editData.attendance}%</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="p-6 bg-muted/20 border-t flex items-center justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedIntern(null);
                  setEditData(null);
                }}
                className="rounded-xl px-6 h-11 border-border/50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveChanges}
                className="rounded-xl px-8 h-11 shadow-lg shadow-primary/20 gap-2 font-bold"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </DashboardLayout>
  );
};

export default MentorInterns;
