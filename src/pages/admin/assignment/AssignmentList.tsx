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
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  GraduationCap,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
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
  const [isDeleting, setIsDeleting] = useState(false);

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filteredAssignments = useMemo(() => {
    return assignments.filter((a) => {
      const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCourse = courseFilter === "all" || a.courseId === courseFilter;
      const matchesBatch = batchFilter === "all" || a.batchId === batchFilter;
      const matchesStatus = statusFilter === "all" || a.status === statusFilter;
      return matchesSearch && matchesCourse && matchesBatch && matchesStatus;
    });
  }, [assignments, searchQuery, courseFilter, batchFilter, statusFilter]);

  const summaryCards = useMemo(() => {
    const total = assignments.length;
    const published = assignments.filter((a) => a.status === "Published").length;
    const drafts = assignments.filter((a) => a.status === "Draft").length;
    return [
      { label: "Total Assignments", value: total.toLocaleString(), icon: ClipboardList, color: "text-blue-600", bg: "bg-blue-50", filter: "all" },
      { label: "Published Items", value: published.toLocaleString(), icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", filter: "Published" },
      { label: "Draft Assignments", value: drafts.toLocaleString(), icon: Clock, color: "text-slate-600", bg: "bg-slate-50", filter: "Draft" },
    ];
  }, [assignments]);

  const pageCount = Math.max(1, Math.ceil(filteredAssignments.length / pageSize));
  const currentPage = Math.min(Math.max(1, page), pageCount);

  const pagedAssignments = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAssignments.slice(start, start + pageSize);
  }, [currentPage, filteredAssignments]);

  const pageItems = useMemo(() => {
    const last = pageCount;
    const cur = currentPage;
    const items: Array<number | "ellipsis"> = [];
    if (last <= 1) return [1];
    if (last <= 5) {
      for (let i = 1; i <= last; i++) items.push(i);
      return items;
    }
    if (cur <= 2) {
      items.push(1, 2, 3, "ellipsis", last);
      return items;
    }
    if (cur === 3) {
      items.push(1, 2, 3, 4, "ellipsis", last);
      return items;
    }
    if (cur >= last - 1) {
      items.push(1, "ellipsis", last - 3, last - 2, last - 1, last);
      return items;
    }
    items.push(1, "ellipsis", cur - 1, cur, cur + 1, "ellipsis", last);
    return items;
  }, [currentPage, pageCount]);

  const handleDeleteClick = (assignment: Assignment) => {
    setAssignmentToDelete(assignment);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (assignmentToDelete) {
      setIsDeleting(true);
      // Simulate API delay for premium feel
      await new Promise(resolve => setTimeout(resolve, 800));
      
      deleteAssignment(assignmentToDelete.id);
      setAssignments([...SHARED_ASSIGNMENTS]);
      toast({
        title: "Assignment Deleted",
        description: `Successfully removed ${assignmentToDelete.title}.`,
      });
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setAssignmentToDelete(null);
    }
  };

  const getStatusBadge = (status: Assignment["status"]) => {
    switch (status) {
      case "Published":
        return <Badge className="text-[10px] font-black h-5 px-2.5 rounded-full border-none shadow-none bg-emerald-50 text-emerald-600">
          {status}
        </Badge>;
      case "Draft":
        return <Badge className="text-[10px] font-black h-5 px-2.5 rounded-full border-none shadow-none bg-slate-100 text-slate-600">
          {status}
        </Badge>;
      default:
        return <Badge variant="outline" className="text-[10px] font-black h-5 px-2.5 rounded-full">{status}</Badge>;
    }
  };

  const getCourseName = (id: string) => courses.find(c => c.id === id)?.name || "Unknown";
  const getBatchName = (id: string) => SHARED_BATCHES.find(b => b.id === id)?.name || "Unknown";

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-5 sm:space-y-6 max-w-[1600px] mx-auto pb-6 sm:pb-10 px-0 sm:px-2 md:px-4 lg:px-6">
        
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-1">
            <h1 className="text-xl font-bold text-foreground tracking-tight sm:text-2xl">Assignment Management</h1>
            <p className="text-xs text-muted-foreground font-medium leading-relaxed sm:text-sm">
              Manage, monitor, and evaluate student assignments across all courses.
            </p>
          </div>
          <Button 
            onClick={() => navigate("/admin/assignments/create")}
            className="h-11 w-full shrink-0 rounded-xl shadow-sm hover:shadow-md transition-all gap-2 px-6 sm:h-10 sm:w-auto"
          >
            <Plus className="w-4 h-4" /> Create Assignment
          </Button>
        </div>

        {/* Section A: Summary Cards */}
        <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {summaryCards.map((stat, idx) => (
            <Card 
              key={idx} 
              onClick={() => setStatusFilter(stat.filter)}
              className={cn(
                "border-none shadow-sm rounded-2xl cursor-pointer hover:shadow-md transition-all group overflow-hidden relative min-w-0",
                statusFilter === stat.filter && "ring-2 ring-primary/20 bg-primary/[0.02]"
              )}
            >
              <CardContent className="p-3.5 sm:p-5 flex items-center justify-between gap-2 relative z-10">
                <div className="min-w-0 space-y-0.5 sm:space-y-1">
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-wider sm:text-[11px] sm:tracking-widest leading-tight line-clamp-2">
                    {stat.label}
                  </p>
                  <h3 className="text-lg font-black text-foreground tabular-nums sm:text-2xl">{stat.value}</h3>
                </div>
                <div className={cn("p-2 rounded-lg sm:p-2.5 sm:rounded-xl shrink-0 group-hover:scale-110 transition-transform duration-300", stat.bg, stat.color)}>
                  <stat.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <div className="grid grid-cols-1 gap-6">
          <section className="space-y-6">
            
            {/* Search + Filter Bar */}
            <Card className="border-none shadow-sm rounded-2xl p-3 sm:p-4 flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center">
              <div className="relative flex-1 w-full min-w-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input 
                  placeholder="Search assignments..."
                  className="pl-10 bg-muted/20 border-none rounded-xl h-11 text-sm font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full shrink-0 lg:w-auto">
                <Select value={courseFilter} onValueChange={setCourseFilter}>
                  <SelectTrigger className="w-full sm:w-[160px] bg-muted/20 border-none rounded-xl h-11 font-bold text-xs uppercase">
                    <SelectValue placeholder="Course" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-none shadow-xl">
                    <SelectItem value="all">All Courses</SelectItem>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>{course.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={batchFilter} onValueChange={setBatchFilter}>
                  <SelectTrigger className="w-full sm:w-[160px] bg-muted/20 border-none rounded-xl h-11 font-bold text-xs uppercase">
                    <SelectValue placeholder="Batch" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-none shadow-xl">
                    <SelectItem value="all">All Batches</SelectItem>
                    {SHARED_BATCHES.map((batch) => (
                      <SelectItem key={batch.id} value={batch.id}>{batch.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[130px] bg-muted/20 border-none rounded-xl h-11 font-bold text-xs uppercase">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-none shadow-xl">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Published">Published</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Card>

            {/* Assignment Table (tablet/desktop) */}
            <Card className="border-none shadow-sm rounded-2xl overflow-hidden hidden md:block">
              <div className="overflow-x-auto overscroll-x-contain -mx-px">
                <Table className="min-w-[1000px]">
                  <TableHeader className="bg-muted/30">
                    <TableRow className="hover:bg-transparent border-b border-border/50">
                      <TableHead className="px-4 lg:px-6 py-4 text-[11px] font-black uppercase tracking-widest text-muted-foreground">Assignment</TableHead>
                      <TableHead className="py-4 text-[11px] font-black uppercase tracking-widest text-muted-foreground">Course / Batch</TableHead>
                      <TableHead className="py-4 text-[11px] font-black uppercase tracking-widest text-muted-foreground text-center">Submissions</TableHead>
                      <TableHead className="py-4 text-[11px] font-black uppercase tracking-widest text-muted-foreground">Due Date</TableHead>
                      <TableHead className="py-4 text-[11px] font-black uppercase tracking-widest text-muted-foreground text-center">Status</TableHead>
                      <TableHead className="py-4 text-right pr-6"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pagedAssignments.map((a) => (
                      <TableRow
                        key={a.id}
                        className="group cursor-pointer hover:bg-muted/10 transition-colors border-b border-border/50 last:border-0"
                        onClick={() => navigate(`/admin/assignments/${a.id}`)}
                      >
                        <TableCell className="px-4 lg:px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                              <FileText className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                              <p className="font-bold text-sm text-foreground truncate">{a.title}</p>
                              <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">ID: {a.id}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="space-y-0.5">
                            <p className="font-black text-[9px] uppercase tracking-widest text-primary leading-none">{getCourseName(a.courseId)}</p>
                            <p className="text-xs font-bold text-muted-foreground leading-tight">{getBatchName(a.batchId)}</p>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 text-center">
                          <Badge variant="outline" className="bg-white font-black text-slate-900 border-slate-200 text-[10px] px-2 h-5">
                            0 / {a.studentIds.length}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-2 text-muted-foreground font-bold text-xs">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(a.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </div>
                        </TableCell>
                        <TableCell className="py-4 text-center">
                          {getStatusBadge(a.status)}
                        </TableCell>
                        <TableCell className="py-4 text-right pr-6" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-2xl border-none shadow-2xl p-1.5 min-w-[160px]">
                              <DropdownMenuItem onClick={() => navigate(`/admin/assignments/${a.id}`)} className="rounded-xl gap-2 font-bold text-xs cursor-pointer">
                                <Eye className="w-4 h-4 text-blue-500" /> View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => navigate(`/admin/assignments/${a.id}/edit`)} className="rounded-xl gap-2 font-bold text-xs cursor-pointer">
                                <Pencil className="w-4 h-4 text-amber-500" /> Edit Assignment
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteClick(a)} className="rounded-xl gap-2 font-bold text-xs text-rose-600 cursor-pointer">
                                <Trash2 className="w-4 h-4" /> Delete Assignment
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination — desktop */}
              <div className="px-4 py-4 border-t border-border/50 bg-muted/10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <p className="text-center text-[10px] font-bold text-muted-foreground sm:text-left sm:text-[11px]">
                  Showing <span className="text-foreground">{filteredAssignments.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, filteredAssignments.length)}</span> of <span className="text-foreground">{filteredAssignments.length}</span> assignments
                </p>
                <div className="flex justify-center sm:justify-end">
                  <div className="inline-flex items-center rounded-2xl border border-border/60 bg-background px-1 py-1 shadow-sm">
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-1 px-1">
                      {pageItems.map((item, idx) => (
                        item === "ellipsis" ? (
                          <span key={idx} className="px-1.5 text-xs font-bold text-muted-foreground">…</span>
                        ) : (
                          <Button key={idx} variant={item === currentPage ? "default" : "ghost"} className={cn("h-9 min-w-9 rounded-xl px-2 text-xs font-bold", item === currentPage && "bg-primary text-primary-foreground shadow-sm")} onClick={() => setPage(item)}>
                            {item}
                          </Button>
                        )
                      ))}
                    </div>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl" onClick={() => setPage(p => Math.min(pageCount, p + 1))} disabled={currentPage === pageCount}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Mobile / small tablet: card list */}
            <div className="space-y-3 md:hidden">
              {pagedAssignments.map((a) => (
                <Card key={a.id} className="border-none shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-4" onClick={() => navigate(`/admin/assignments/${a.id}`)}>
                    <div className="flex gap-3">
                      <div className="w-11 h-11 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
                        <FileText className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <div className="flex items-center justify-between">
                          <p className="truncate text-sm font-bold text-foreground">{a.title}</p>
                          {getStatusBadge(a.status)}
                        </div>
                        <p className="truncate text-[10px] font-black uppercase tracking-widest text-primary">{getCourseName(a.courseId)}</p>
                        <div className="flex items-center gap-1.5 pt-1">
                          <Badge variant="outline" className="bg-white font-black text-slate-900 border-slate-200 text-[9px] px-1.5 h-4">
                            0 / {a.studentIds.length} Subs
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-border/40 flex items-center justify-between text-[11px] font-bold text-muted-foreground">
                      <span>Due: <span className="text-foreground">{new Date(a.dueDate).toLocaleDateString('en-GB')}</span></span>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl" onClick={(e) => { e.stopPropagation(); navigate(`/admin/assignments/${a.id}/edit`); }}>
                          <Pencil className="w-4 h-4 text-amber-500" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl text-rose-600" onClick={(e) => { e.stopPropagation(); handleDeleteClick(a); }}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {/* Mobile Pagination */}
              {pageCount > 1 && (
                <div className="flex justify-center pt-2">
                  <div className="inline-flex items-center rounded-2xl border border-border/60 bg-background px-1 py-1 shadow-sm">
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="px-4 text-xs font-bold text-muted-foreground">Page {currentPage} of {pageCount}</span>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl" onClick={() => setPage(p => Math.min(pageCount, p + 1))} disabled={currentPage === pageCount}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {filteredAssignments.length === 0 && (
              <div className="p-12 sm:p-20 text-center space-y-4">
                <div className="p-4 bg-muted/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto">
                  <ClipboardList className="w-8 h-8 text-muted-foreground/30" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-foreground">No assignments found</h3>
                  <p className="text-muted-foreground text-sm font-medium max-w-xs mx-auto">Adjust your filters to find what you're looking for.</p>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Delete Confirmation Modal */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent className="rounded-3xl border-none shadow-2xl p-6 sm:p-8 max-w-[400px]">
            <AlertDialogHeader className="space-y-4">
              <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto">
                <Trash2 className="w-8 h-8 text-rose-500" />
              </div>
              <div className="text-center space-y-2">
                <AlertDialogTitle className="text-2xl font-black text-foreground">Delete Assignment?</AlertDialogTitle>
                <AlertDialogDescription className="text-muted-foreground font-medium">
                  Are you sure you want to delete <span className="text-foreground font-bold">{assignmentToDelete?.title}</span>? This action cannot be undone.
                </AlertDialogDescription>
              </div>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-8 flex gap-3">
              <AlertDialogCancel className="flex-1 h-12 rounded-2xl border-2 font-bold hover:bg-muted/50 transition-all" disabled={isDeleting}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => { e.preventDefault(); handleConfirmDelete(); }}
                className="flex-1 h-12 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black shadow-lg shadow-rose-200 transition-all"
                disabled={isDeleting}
              >
                {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
};

export default AssignmentList;
