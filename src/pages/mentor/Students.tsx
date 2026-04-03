import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  UserCheck2 
} from "lucide-react";

// Mock data for assigned students
const initialStudents = [
  {
    id: "S001",
    name: "Aarav Mehta",
    email: "aarav.m@gmail.com",
    course: "Full Stack Web Dev",
    batch: "Jan 2026 Batch",
    progress: 78,
    attendance: 85,
    status: "Active",
  },
  {
    id: "S002",
    name: "Diya Krishnan",
    email: "diya.k@gmail.com",
    course: "Data Science Mastery",
    batch: "Jan 2026 Batch",
    progress: 92,
    attendance: 95,
    status: "Active",
  },
  {
    id: "S003",
    name: "Rahul Sharma",
    email: "rahul.s@gmail.com",
    course: "Python Backend",
    batch: "Feb 2026 Python",
    progress: 45,
    attendance: 65,
    status: "At Risk",
  },
  {
    id: "S004",
    name: "Sneha Iyer",
    email: "sneha.i@gmail.com",
    course: "Full Stack Web Dev",
    batch: "Jan 2026 Batch",
    progress: 100,
    attendance: 98,
    status: "Completed",
  },
  {
    id: "S005",
    name: "Vikram Shah",
    email: "vikram.s@gmail.com",
    course: "UI/UX Design",
    batch: "Oct 2025 Cohort",
    progress: 30,
    attendance: 40,
    status: "At Risk",
  },
];

const MentorStudents = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");
  const [batchFilter, setBatchFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const stats = {
    total: initialStudents.length,
    active: initialStudents.filter((s) => s.status === "Active").length,
    atRisk: initialStudents.filter((s) => s.status === "At Risk").length,
    completed: initialStudents.filter((s) => s.status === "Completed").length,
  };

  const filteredStudents = useMemo(() => {
    return initialStudents.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCourse = courseFilter === "All" || student.course === courseFilter;
      const matchesBatch = batchFilter === "All" || student.batch === batchFilter;
      const matchesStatus = statusFilter === "All" || student.status === statusFilter;

      return matchesSearch && matchesCourse && matchesBatch && matchesStatus;
    });
  }, [searchTerm, courseFilter, batchFilter, statusFilter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20">
            Active
          </Badge>
        );
      case "Completed":
        return (
          <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-blue-500/20">
            Completed
          </Badge>
        );
      case "At Risk":
        return (
          <Badge className="bg-red-500/10 text-red-600 hover:bg-red-500/20 border-red-500/20">
            At Risk
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in p-6">
        {/* Page Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-foreground">Students</h1>
          <p className="text-muted-foreground">Monitor student progress in your assigned batches</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-none shadow-sm rounded-[16px] overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                  <Users className="text-blue-500" size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                  <h3 className="text-2xl font-bold">{stats.total}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm rounded-[16px] overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
                  <UserCheck2 className="text-emerald-500" size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Students</p>
                  <h3 className="text-2xl font-bold">{stats.active}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm rounded-[16px] overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center">
                  <AlertCircle className="text-red-500" size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">At Risk Students</p>
                  <h3 className="text-2xl font-bold text-red-600">{stats.atRisk}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm rounded-[16px] overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="text-primary" size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed Students</p>
                  <h3 className="text-2xl font-bold text-primary">{stats.completed}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filter */}
        <Card className="border-none shadow-sm rounded-[16px]">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  className="pl-10 h-11 rounded-xl bg-muted/30 border-none"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:w-2/3 lg:w-1/2">
                <Select value={courseFilter} onValueChange={setCourseFilter}>
                  <SelectTrigger className="h-11 rounded-xl bg-muted/30 border-none">
                    <SelectValue placeholder="Course" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-none shadow-lg">
                    <SelectItem value="All">All Courses</SelectItem>
                    <SelectItem value="Full Stack Web Dev">Full Stack Web Dev</SelectItem>
                    <SelectItem value="Data Science Mastery">Data Science Mastery</SelectItem>
                    <SelectItem value="Python Backend">Python Backend</SelectItem>
                    <SelectItem value="UI/UX Design">UI/UX Design</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={batchFilter} onValueChange={setBatchFilter}>
                  <SelectTrigger className="h-11 rounded-xl bg-muted/30 border-none">
                    <SelectValue placeholder="Batch" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-none shadow-lg">
                    <SelectItem value="All">All Batches</SelectItem>
                    <SelectItem value="Jan 2026 Batch">Jan 2026 Batch</SelectItem>
                    <SelectItem value="Feb 2026 Python">Feb 2026 Python</SelectItem>
                    <SelectItem value="Oct 2025 Cohort">Oct 2025 Cohort</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-11 rounded-xl bg-muted/30 border-none">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-none shadow-lg">
                    <SelectItem value="All">All Statuses</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="At Risk">At Risk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card className="border-none shadow-sm rounded-[16px] overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="border-none">
                <TableHead className="py-4 pl-6">Student Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Progress (%)</TableHead>
                <TableHead>Attendance (%)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <TableRow key={student.id} className="border-b border-muted/20 hover:bg-muted/5 transition-colors">
                    <TableCell className="py-4 pl-6 font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary">
                          {student.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        {student.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{student.email}</TableCell>
                    <TableCell className="text-muted-foreground">{student.course}</TableCell>
                    <TableCell className="text-muted-foreground">{student.batch}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1.5 min-w-[120px]">
                        <span className="text-xs font-semibold">{student.progress}%</span>
                        <Progress value={student.progress} className="h-1.5" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`font-semibold ${student.attendance < 75 ? "text-red-600" : "text-foreground"}`}>
                        {student.attendance}%
                      </span>
                    </TableCell>
                    <TableCell>{getStatusBadge(student.status)}</TableCell>
                    <TableCell className="text-right pr-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-xl hover:bg-primary/10 hover:text-primary transition-all gap-2"
                        onClick={() => navigate(`/mentor/my-batches/students/${student.id}`)}
                      >
                        <Eye size={16} />
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-48 text-center text-muted-foreground font-medium italic">
                    <div className="flex flex-col items-center gap-2">
                      <Users size={48} className="opacity-20 mb-2" />
                      No students found matching your filters.
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default MentorStudents;
