import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, 
  Plus, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  Pencil, 
  Trash2,
  Calendar,
  Users,
  Layers,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Loader2
} from "lucide-react";
import { SHARED_BATCHES, Batch } from "@/data/batchData";
import { courses } from "@/data/courseData";
import { mockTutors } from "@/data/mockTutors";
import { mockMentors } from "@/data/mockMentors";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
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
import { useToast } from "@/hooks/use-toast";

const BatchList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [batches, setBatches] = useState<Batch[]>(SHARED_BATCHES);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [courseFilter, setCourseFilter] = useState<string>("all");
  
  // Deletion state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [batchToDelete, setBatchToDelete] = useState<Batch | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredBatches = useMemo(() => {
    return batches.filter((batch) => {
      const matchesSearch = batch.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || batch.status === statusFilter;
      const matchesCourse = courseFilter === "all" || batch.courseId === courseFilter;
      return matchesSearch && matchesStatus && matchesCourse;
    });
  }, [batches, searchQuery, statusFilter, courseFilter]);

  const handleDeleteClick = (batch: Batch) => {
    setBatchToDelete(batch);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!batchToDelete) return;

    setIsDeleting(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      // Update global mock state
      const globalIndex = SHARED_BATCHES.findIndex(b => b.id === batchToDelete.id);
      if (globalIndex !== -1) {
        SHARED_BATCHES.splice(globalIndex, 1);
      }

      // Update local state
      setBatches(prev => prev.filter(b => b.id !== batchToDelete.id));
      
      toast({
        title: "Batch Deleted",
        description: `Successfully removed ${batchToDelete.name} from the system.`,
      });
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "An unexpected error occurred while deleting the batch.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setBatchToDelete(null);
    }
  };

  const getStatusBadge = (status: Batch["status"]) => {
    switch (status) {
      case "Active":
      case "Learning":
        return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100 transition-colors gap-1.5 px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> {status}
        </Badge>;
      case "Upcoming":
        return <Badge className="bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100 transition-colors gap-1.5 px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider">
          <Clock className="w-3 h-3" /> {status}
        </Badge>;
      case "Completed":
        return <Badge className="bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200 transition-colors gap-1.5 px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider">
          <CheckCircle2 className="w-3 h-3" /> {status}
        </Badge>;
      case "Internship":
        return <Badge className="bg-purple-50 text-purple-700 border-purple-100 hover:bg-purple-100 transition-colors gap-1.5 px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider">
          <Layers className="w-3 h-3" /> {status}
        </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTutorName = (id: string) => mockTutors.find(t => t.id === id)?.name || "Unassigned";
  const getMentorName = (id: string) => mockMentors.find(m => m.id === id)?.name || "Unassigned";

  return (
    <DashboardLayout>
      <div className="p-8 space-y-8 animate-in fade-in duration-700">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2">
              Batch Management
            </h1>
            <p className="text-slate-500 font-medium flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Manage course execution, student cohorts, and staff assignments.
            </p>
          </div>
          <div>
            <Button 
              onClick={() => navigate("/admin/batch/create")}
              className="bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 h-12 px-6 rounded-2xl font-bold gap-2 transition-all"
            >
              <Plus className="w-5 h-5" />
              Create New Batch
            </Button>
          </div>
        </div>

        {/* Filters Section */}
        <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white/50 backdrop-blur-sm border border-slate-100">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2 relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="Search by batch name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 bg-white border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                />
              </div>
              <Select value={courseFilter} onValueChange={setCourseFilter}>
                <SelectTrigger className="h-12 bg-white border-slate-200 rounded-2xl font-medium focus:ring-4 focus:ring-primary/10">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-slate-400" />
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
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-12 bg-white border-slate-200 rounded-2xl font-medium focus:ring-4 focus:ring-primary/10">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <SelectValue placeholder="All Status" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Upcoming">Upcoming</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table Section */}
        <Card className="border-none shadow-2xl rounded-3xl overflow-hidden bg-white">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent border-slate-100">
                <TableHead className="font-black text-[11px] uppercase tracking-widest text-slate-500 h-14 pl-8">Batch Name</TableHead>
                <TableHead className="font-black text-[11px] uppercase tracking-widest text-slate-500 h-14">Course Name</TableHead>
                <TableHead className="font-black text-[11px] uppercase tracking-widest text-slate-500 h-14">Tutor</TableHead>
                <TableHead className="font-black text-[11px] uppercase tracking-widest text-slate-500 h-14">Mentor</TableHead>
                <TableHead className="font-black text-[11px] uppercase tracking-widest text-slate-500 h-14">Students Count</TableHead>
                <TableHead className="font-black text-[11px] uppercase tracking-widest text-slate-500 h-14">Start Date</TableHead>
                <TableHead className="font-black text-[11px] uppercase tracking-widest text-slate-500 h-14">End Date</TableHead>
                <TableHead className="font-black text-[11px] uppercase tracking-widest text-slate-500 h-14">Status</TableHead>
                <TableHead className="font-black text-[11px] uppercase tracking-widest text-slate-500 h-14 text-right pr-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBatches.map((batch, index) => (
                <TableRow
                  key={batch.id}
                  className="group hover:bg-slate-50/50 border-slate-50 transition-all cursor-pointer"
                  onClick={() => navigate(`/admin/batch/${batch.id}`)}
                >
                  <TableCell className="pl-8 py-5">
                    <span className="font-bold text-slate-900 group-hover:text-primary transition-colors flex items-center gap-2">
                      {batch.name}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-slate-600 text-sm">
                      {batch.courseName}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-bold text-slate-700">{getTutorName(batch.tutorId)}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-bold text-slate-700">{getMentorName(batch.mentorId)}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-primary" />
                      <span className="font-black text-slate-900 text-sm">
                        {batch.studentIds.length}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-bold text-slate-600">
                      {new Date(batch.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-bold text-slate-600">
                      {new Date(batch.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(batch.status)}
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
                            navigate(`/admin/batch/${batch.id}`);
                          }}
                          className="rounded-xl gap-2 font-bold text-slate-600 cursor-pointer"
                        >
                          <Eye className="w-4 h-4 text-blue-500" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/batch/${batch.id}/edit`);
                          }}
                          className="rounded-xl gap-2 font-bold text-slate-600 cursor-pointer"
                        >
                          <Pencil className="w-4 h-4 text-amber-500" /> Edit Batch
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(batch);
                          }}
                          className="rounded-xl gap-2 font-bold text-rose-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" /> Delete Batch
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredBatches.length === 0 && (
            <div className="p-20 text-center space-y-4">
              <div className="p-4 bg-slate-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto">
                <Search className="w-8 h-8 text-slate-300" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">No batches found</h3>
                <p className="text-slate-500 font-medium max-w-xs mx-auto">Try adjusting your filters or search query to find what you're looking for.</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setCourseFilter("all");
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
                Delete Batch?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-slate-500 font-medium text-base">
                Are you sure you want to delete <span className="text-slate-900 font-bold">{batchToDelete?.name}</span>? 
                This action cannot be undone and all session data will be lost.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-8 flex gap-3">
              <AlertDialogCancel 
                className="flex-1 h-12 rounded-2xl border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all border-2"
                disabled={isDeleting}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  handleConfirmDelete();
                }}
                className="flex-1 h-12 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black shadow-xl shadow-rose-200 transition-all border-none"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Delete Now"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
};

export default BatchList;
