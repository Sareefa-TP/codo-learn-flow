import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Search, 
  Plus, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  Pencil, 
  Trash2,
  Calendar,
  Layers,
  FileText,
  ClipboardList,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  TrendingUp,
  GraduationCap
} from "lucide-react";
import { SHARED_ASSIGNMENTS, deleteAssignment, Assignment } from "@/data/assignmentData";
import { courses } from "@/data/courseData";
import { SHARED_BATCHES } from "@/data/batchData";
import { useToast } from "@/hooks/use-toast";

const AssignmentList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [assignments, setAssignments] = useState<Assignment[]>(SHARED_ASSIGNMENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState<string>("all");
  const [batchFilter, setBatchFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<Assignment | null>(null);

  const filteredAssignments = useMemo(() => {
    return assignments.filter((a) => {
      const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCourse = courseFilter === "all" || a.courseId === courseFilter;
      const matchesBatch = batchFilter === "all" || a.batchId === batchFilter;
      const matchesStatus = statusFilter === "all" || a.status === statusFilter;
      return matchesSearch && matchesCourse && matchesBatch && matchesStatus;
    });
  }, [assignments, searchQuery, courseFilter, batchFilter, statusFilter]);

  const handleDeleteClick = (assignment: Assignment) => {
    setAssignmentToDelete(assignment);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (assignmentToDelete) {
      deleteAssignment(assignmentToDelete.id);
      setAssignments([...SHARED_ASSIGNMENTS]);
      toast({
        title: "Assignment Deleted",
        description: `Successfully removed ${assignmentToDelete.title}.`,
      });
      setIsDeleteDialogOpen(false);
      setAssignmentToDelete(null);
    }
  };

  const getStatusBadge = (status: Assignment["status"]) => {
    switch (status) {
      case "Published":
        return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100 transition-colors gap-1.5 px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> {status}
        </Badge>;
      case "Draft":
        return <Badge className="bg-slate-100 text-slate-600 border-slate-200 gap-1.5 px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider">
          <Clock className="w-3 h-3" /> {status}
        </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCourseName = (id: string) => courses.find(c => c.id === id)?.name || "Unknown";
  const getBatchName = (id: string) => SHARED_BATCHES.find(b => b.id === id)?.name || "Unknown";

  return (
    <DashboardLayout>
      <div className="p-8 space-y-8 animate-in fade-in duration-700">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2">
              Assignment Management
            </h1>
            <p className="text-slate-500 font-medium flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-primary" />
              Manage, monitor, and evaluate student assignments across all courses.
            </p>
          </div>
          <Button 
            onClick={() => navigate("/admin/assignments/create")}
            className="bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 h-12 px-6 rounded-2xl font-bold gap-2 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Create Assignment
          </Button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-sm rounded-3xl bg-indigo-50/50 p-6 flex items-center gap-6">
            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-indigo-600" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 leading-none mb-1">Total Assignments</p>
              <p className="text-3xl font-black text-slate-900">{assignments.length}</p>
            </div>
          </Card>
          <Card className="border-none shadow-sm rounded-3xl bg-emerald-50/50 p-6 flex items-center gap-6">
            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 leading-none mb-1">Published</p>
              <p className="text-3xl font-black text-slate-900">{assignments.filter(a => a.status === "Published").length}</p>
            </div>
          </Card>
          <Card className="border-none shadow-sm rounded-3xl bg-slate-50 p-6 flex items-center gap-6">
            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center">
              <Clock className="w-7 h-7 text-slate-400" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Drafts</p>
              <p className="text-3xl font-black text-slate-900">{assignments.filter(a => a.status === "Draft").length}</p>
            </div>
          </Card>
        </div>

        {/* Filters Section */}
        <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white/50 backdrop-blur-sm border border-slate-100">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-1 relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="Search assignments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 bg-white border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                />
              </div>
              <Select value={courseFilter} onValueChange={setCourseFilter}>
                <SelectTrigger className="h-12 bg-white border-slate-200 rounded-2xl font-medium focus:ring-4 focus:ring-primary/10">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-slate-400" />
                    <SelectValue placeholder="All Courses" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                  <SelectItem value="all">All Courses</SelectItem>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>{course.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={batchFilter} onValueChange={setBatchFilter}>
                <SelectTrigger className="h-12 bg-white border-slate-200 rounded-2xl font-medium focus:ring-4 focus:ring-primary/10">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-slate-400" />
                    <SelectValue placeholder="All Batches" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                  <SelectItem value="all">All Batches</SelectItem>
                  {SHARED_BATCHES.map((batch) => (
                    <SelectItem key={batch.id} value={batch.id}>{batch.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-12 bg-white border-slate-200 rounded-2xl font-medium focus:ring-4 focus:ring-primary/10">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <SelectValue placeholder="All Status" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Published">Published</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Table Section */}
        <Card className="border-none shadow-2xl rounded-3xl overflow-hidden bg-white">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent border-slate-100">
                <TableHead className="font-black text-[11px] uppercase tracking-widest text-slate-500 h-14 pl-8">Assignment Title</TableHead>
                <TableHead className="font-black text-[11px] uppercase tracking-widest text-slate-500 h-14">Course / Batch</TableHead>
                <TableHead className="font-black text-[11px] uppercase tracking-widest text-slate-500 h-14 text-center">Submissions</TableHead>
                <TableHead className="font-black text-[11px] uppercase tracking-widest text-slate-500 h-14">Due Date</TableHead>
                <TableHead className="font-black text-[11px] uppercase tracking-widest text-slate-500 h-14">Status</TableHead>
                <TableHead className="font-black text-[11px] uppercase tracking-widest text-slate-500 h-14 text-right pr-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssignments.map((a) => (
                <TableRow
                  key={a.id}
                  className="group hover:bg-slate-50/50 border-slate-50 transition-all cursor-pointer"
                  onClick={() => navigate(`/admin/assignments/${a.id}`)}
                >
                  <TableCell className="pl-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                        <FileText className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 group-hover:text-primary transition-colors flex items-center gap-2">
                          {a.title}
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
                        </span>
                        <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mt-0.5">ID: {a.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-black text-[10px] uppercase tracking-widest text-primary leading-none">{getCourseName(a.courseId)}</p>
                      <p className="text-sm font-bold text-slate-600 leading-tight">{getBatchName(a.batchId)}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="bg-white font-black text-slate-900 border-slate-200">
                      0 / {a.studentIds.length}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-slate-600 font-bold text-sm">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {new Date(a.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(a.status)}
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-100 rounded-xl transition-all">
                          <MoreHorizontal className="h-4 w-4 text-slate-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-2xl border-slate-100 shadow-2xl p-1.5 min-w-[160px]">
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/assignments/${a.id}`);
                          }}
                          className="rounded-xl gap-2 font-bold text-slate-600 cursor-pointer"
                        >
                          <Eye className="w-4 h-4 text-blue-500" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/assignments/${a.id}/edit`);
                          }}
                          className="rounded-xl gap-2 font-bold text-slate-600 cursor-pointer"
                        >
                          <Pencil className="w-4 h-4 text-amber-500" /> Edit Assignment
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(a);
                          }}
                          className="rounded-xl gap-2 font-bold text-rose-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" /> Delete Assignment
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredAssignments.length === 0 && (
            <div className="p-20 text-center space-y-4">
              <div className="p-4 bg-slate-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto">
                <ClipboardList className="w-8 h-8 text-slate-300" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">No assignments found</h3>
                <p className="text-slate-500 font-medium max-w-xs mx-auto">Try adjusting your filters or search query to find what you're looking for.</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setCourseFilter("all");
                  setBatchFilter("all");
                }}
                className="rounded-xl border-slate-200"
              >
                Clear all filters
              </Button>
            </div>
          )}
        </Card>

        {/* Delete Confirmation Modal */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent className="rounded-3xl border-slate-100 shadow-2xl p-8 max-w-[400px]">
            <AlertDialogHeader className="space-y-4">
              <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center animate-pulse">
                <Trash2 className="w-8 h-8 text-rose-500" />
              </div>
              <AlertDialogTitle className="text-2xl font-black text-slate-900 leading-tight">
                Delete Assignment?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-slate-500 font-medium text-base leading-relaxed">
                Are you sure you want to delete <span className="text-slate-900 font-black">"{assignmentToDelete?.title}"</span>? 
                This action cannot be undone and all student submissions will be lost.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-8 flex gap-3">
              <AlertDialogCancel className="flex-1 h-12 rounded-2xl border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all border-2">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDelete}
                className="flex-1 h-12 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black shadow-xl shadow-rose-200 transition-all border-none"
              >
                Delete Now
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
};

export default AssignmentList;
