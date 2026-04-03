import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Users,
  CheckCircle2,
  TrendingUp,
  UserX,
  Search,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Lock,
  RotateCcw,
  Plus,
  Filter,
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Mock Data ---

const summaryCards = [
  { label: "Total Students", value: "1,248", icon: Users, color: "text-blue-600", bg: "bg-blue-50", filter: "all" },
  { label: "Active Students", value: "1,180", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", filter: "active" },
  { label: "Completed Students", value: "45", icon: TrendingUp, color: "text-indigo-600", bg: "bg-indigo-50", filter: "completed" },
  { label: "Blocked Students", value: "23", icon: UserX, color: "text-red-600", bg: "bg-red-50", filter: "blocked" },
];

const courseWiseData = [
  { name: "Full Stack Development", count: 450 },
  { name: "Python Data Science", count: 320 },
  { name: "UI/UX Design", count: 280 },
  { name: "Digital Marketing", count: 198 },
];

const initialStudents = [
  { id: "S1001", name: "Sarah Connor", email: "sarah.c@example.com", phone: "+1 234 567 890", courses: ["Full Stack", "UI/UX"], batch: "Jan-2024", status: "Active", joined: "2024-01-15" },
  { id: "S1002", name: "John Smith", email: "john.s@example.com", phone: "+1 234 567 891", courses: ["Python DS"], batch: "Feb-2024", status: "Active", joined: "2024-02-10" },
  { id: "S1003", name: "Elena Gilbert", email: "elena.g@example.com", phone: "+1 234 567 892", courses: ["Digital Marketing"], batch: "Mar-2024", status: "Blocked", joined: "2024-03-05" },
  { id: "S1004", name: "Stefan Salvatore", email: "stefan.s@example.com", phone: "+1 234 567 893", courses: ["Full Stack"], batch: "Jan-2024", status: "Completed", joined: "2024-01-20" },
  { id: "S1005", name: "Bonnie Bennett", email: "bonnie.b@example.com", phone: "+1 234 567 894", courses: ["UI/UX"], batch: "Feb-2024", status: "Active", joined: "2024-02-15" },
];

const StudentList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  const filteredStudents = initialStudents.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.phone.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || s.status.toLowerCase() === statusFilter;
    const matchesCourse = courseFilter === "all" || (selectedCourse ? s.courses.includes(selectedCourse) : true);
    
    return matchesSearch && matchesStatus && matchesCourse;
  });

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6 max-w-[1600px] mx-auto pb-10 px-6">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Student Management</h1>
            <p className="text-sm text-muted-foreground mt-1 font-medium">
              Oversee all students, manage status, and track enrollment phases.
            </p>
          </div>
          <Button 
            onClick={() => navigate("/admin/students/add")}
            className="rounded-xl shadow-sm hover:shadow-md transition-all gap-2 px-6"
          >
            <Plus className="w-4 h-4" /> Add Student
          </Button>
        </div>

        {/* Section A: Summary Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {summaryCards.map((stat, idx) => (
            <Card 
              key={idx} 
              onClick={() => setStatusFilter(stat.filter)}
              className={cn(
                "border-none shadow-sm rounded-2xl cursor-pointer hover:shadow-md transition-all group overflow-hidden relative",
                statusFilter === stat.filter && "ring-2 ring-primary/20 bg-primary/[0.02]"
              )}
            >
              <CardContent className="p-5 flex items-center justify-between relative z-10">
                <div className="space-y-1">
                  <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                  <h3 className="text-2xl font-black text-foreground">{stat.value}</h3>
                </div>
                <div className={cn("p-2.5 rounded-xl group-hover:scale-110 transition-transform duration-300", stat.bg, stat.color)}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Section B: Course-wise Student Count */}
          <section className="lg:col-span-1 space-y-4">
            <Card className="border-none shadow-sm rounded-2xl overflow-hidden h-full">
              <CardHeader className="py-4 px-6 border-b border-border/50 bg-muted/10">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  Course-wise Count
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCourse(null)}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all",
                      !selectedCourse ? "bg-primary text-white shadow-md shadow-primary/20" : "bg-transparent text-muted-foreground hover:bg-muted/50"
                    )}
                  >
                    All Courses
                    <Filter className={cn("w-3.5 h-3.5", !selectedCourse ? "text-white" : "text-muted-foreground")} />
                  </button>
                  {courseWiseData.map((course, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedCourse(course.name)}
                      className={cn(
                        "w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all group",
                        selectedCourse === course.name ? "bg-primary text-white shadow-md shadow-primary/20" : "bg-transparent text-foreground hover:bg-muted/50"
                      )}
                    >
                      <span className="truncate pr-2">{course.name}</span>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "px-2 py-0.5 rounded-md text-[10px]",
                          selectedCourse === course.name ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                        )}>
                          {course.count}
                        </span>
                        <ArrowRight className={cn("w-3 h-3 group-hover:translate-x-1 transition-transform", selectedCourse === course.name ? "text-white" : "text-muted-foreground")} />
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Section C, D, E: List View */}
          <section className="lg:col-span-3 space-y-6">
            
            {/* Search + Filter Bar */}
            <Card className="border-none shadow-sm rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by name, email, or phone..."
                  className="pl-10 bg-muted/20 border-none rounded-xl h-11"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-[140px] bg-muted/20 border-none rounded-xl h-11 font-bold text-xs">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-none shadow-xl">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="icon" className="shrink-0 h-11 w-11 rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors">
                  <RotateCcw className="w-4 h-4" onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setSelectedCourse(null);
                  }} />
                </Button>
              </div>
            </Card>

            {/* Student Table */}
            <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow className="hover:bg-transparent border-b border-border/50">
                      <TableHead className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-muted-foreground">Student</TableHead>
                      <TableHead className="py-4 text-[11px] font-black uppercase tracking-widest text-muted-foreground">Courses</TableHead>
                      <TableHead className="py-4 text-[11px] font-black uppercase tracking-widest text-muted-foreground">Batch</TableHead>
                      <TableHead className="py-4 text-[11px] font-black uppercase tracking-widest text-muted-foreground text-center">Status</TableHead>
                      <TableHead className="py-4 text-[11px] font-black uppercase tracking-widest text-muted-foreground">Joined</TableHead>
                      <TableHead className="px-6 py-4 text-right text-[11px] font-black uppercase tracking-widest text-muted-foreground">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id} className="group hover:bg-muted/10 transition-colors border-b border-border/50 last:border-0">
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs shrink-0">
                              {student.name.split(" ").map(n => n[0]).join("")}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-sm text-foreground truncate">{student.name}</p>
                              <p className="text-[10px] font-medium text-muted-foreground truncate">{student.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex flex-wrap gap-1">
                            {student.courses.map((c, i) => (
                              <Badge key={i} variant="secondary" className="text-[9px] font-bold h-4 px-1.5 bg-muted text-muted-foreground border-none">
                                {c}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="py-4 font-bold text-xs text-muted-foreground">
                          {student.batch}
                        </TableCell>
                        <TableCell className="py-4 text-center">
                          <Badge className={cn(
                            "text-[10px] font-black h-5 px-2 px-2.5 rounded-full border-none shadow-none",
                            student.status === "Active" ? "bg-emerald-50 text-emerald-600" : 
                            student.status === "Blocked" ? "bg-red-50 text-red-600" :
                            "bg-blue-50 text-blue-600"
                          )}>
                            {student.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4 text-[11px] font-bold text-muted-foreground whitespace-nowrap">
                          {student.joined}
                        </TableCell>
                        <TableCell className="px-6 py-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg hover:bg-muted transition-colors">
                                <MoreVertical className="w-4 h-4 text-muted-foreground" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 p-1.5 rounded-xl border-none shadow-xl">
                              <DropdownMenuItem 
                                onClick={() => navigate(`/admin/students/${student.id}`)}
                                className="rounded-lg gap-2 text-xs font-bold"
                              >
                                <Eye className="w-3.5 h-3.5 text-primary" /> View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => navigate(`/admin/students/edit/${student.id}`)}
                                className="rounded-lg gap-2 text-xs font-bold"
                              >
                                <Edit className="w-3.5 h-3.5 text-blue-500" /> Edit Student
                              </DropdownMenuItem>
                              <DropdownMenuItem className="rounded-lg gap-2 text-xs font-bold">
                                <Lock className={cn("w-3.5 h-3.5", student.status === "Blocked" ? "text-emerald-500" : "text-amber-500")}>
                                  {student.status === "Blocked" ? <RotateCcw className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                                </Lock>
                                {student.status === "Blocked" ? "Unblock" : "Block"}
                              </DropdownMenuItem>
                              <DropdownMenuItem className="rounded-lg gap-2 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50">
                                <Trash2 className="w-3.5 h-3.5" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {/* Pagination */}
              <div className="px-6 py-4 border-t border-border/50 bg-muted/10 flex items-center justify-between">
                <p className="text-[11px] font-bold text-muted-foreground">
                  Showing <span className="text-foreground">1-5</span> of <span className="text-foreground">1,248</span> students
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="h-8 rounded-lg text-[11px] font-bold gap-1 px-3" disabled>
                    <ChevronLeft className="w-3.5 h-3.5" /> Previous
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 rounded-lg text-[11px] font-bold gap-1 px-3">
                    Next <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          </section>

        </div>

      </div>
    </DashboardLayout>
  );
};

export default StudentList;
