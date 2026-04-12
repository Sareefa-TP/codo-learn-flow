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
  MoreHorizontal, 
  Eye, 
  Pencil, 
  Trash2,
  Users,
  CheckCircle2,
  Clock,
  Loader2,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
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
import { useRole } from "@/hooks/useRole";

const BatchList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { role } = useRole();
  const basePath = `/${role}/batches`;
  
  const [batches, setBatches] = useState<Batch[]>(SHARED_BATCHES);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [courseFilter, setCourseFilter] = useState<string>("all");
  
  // Deletion state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [batchToDelete, setBatchToDelete] = useState<Batch | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filteredBatches = useMemo(() => {
    return batches.filter((batch) => {
      const matchesSearch = batch.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || batch.status === statusFilter;
      const matchesCourse = courseFilter === "all" || batch.courseId === courseFilter;
      return matchesSearch && matchesStatus && matchesCourse;
    });
  }, [batches, searchQuery, statusFilter, courseFilter]);

  const summaryCards = useMemo(() => {
    const total = batches.length;
    const active = batches.filter((b) => ["Active", "Learning", "Internship"].includes(b.status)).length;
    const upcoming = batches.filter((b) => b.status === "Upcoming").length;
    const completed = batches.filter((b) => b.status === "Completed").length;
    return [
      { label: "Total Batches", value: total.toLocaleString(), icon: Users, color: "text-blue-600", bg: "bg-blue-50", filter: "all" },
      { label: "Active Batches", value: active.toLocaleString(), icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", filter: "Active" },
      { label: "Upcoming Batches", value: upcoming.toLocaleString(), icon: Clock, color: "text-indigo-600", bg: "bg-indigo-50", filter: "Upcoming" },
      { label: "Completed Batches", value: completed.toLocaleString(), icon: TrendingUp, color: "text-slate-600", bg: "bg-slate-50", filter: "Completed" },
    ];
  }, [batches]);

  const pageCount = Math.max(1, Math.ceil(filteredBatches.length / pageSize));
  const currentPage = Math.min(Math.max(1, page), pageCount);

  const pagedBatches = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredBatches.slice(start, start + pageSize);
  }, [currentPage, filteredBatches]);

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
        return <Badge className="text-[10px] font-black h-5 px-2.5 rounded-full border-none shadow-none bg-emerald-50 text-emerald-600">
          {status}
        </Badge>;
      case "Upcoming":
        return <Badge className="text-[10px] font-black h-5 px-2.5 rounded-full border-none shadow-none bg-blue-50 text-blue-600">
          {status}
        </Badge>;
      case "Completed":
        return <Badge className="text-[10px] font-black h-5 px-2.5 rounded-full border-none shadow-none bg-slate-100 text-slate-600">
          {status}
        </Badge>;
      case "Internship":
        return <Badge className="text-[10px] font-black h-5 px-2.5 rounded-full border-none shadow-none bg-purple-50 text-purple-600">
          {status}
        </Badge>;
      default:
        return <Badge variant="outline" className="text-[10px] font-black h-5 px-2.5 rounded-full">{status}</Badge>;
    }
  };

  const getTutorName = (id: string) => mockTutors.find(t => t.id === id)?.name || "Unassigned";
  const getMentorName = (id: string) => mockMentors.find(m => m.id === id)?.name || "Unassigned";

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-5 sm:space-y-6 max-w-[1600px] mx-auto pb-6 sm:pb-10 px-0 sm:px-2 md:px-4 lg:px-6">
        
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-1">
            <h1 className="text-xl font-bold text-foreground tracking-tight sm:text-2xl">Batch Management</h1>
            <p className="text-xs text-muted-foreground font-medium leading-relaxed sm:text-sm">
              Manage course execution, student cohorts, and staff assignments.
            </p>
          </div>
          <Button 
            onClick={() => navigate(`${basePath}/create`)}
            className="h-11 w-full shrink-0 rounded-xl shadow-sm hover:shadow-md transition-all gap-2 px-6 sm:h-10 sm:w-auto"
          >
            <Plus className="w-4 h-4" /> Create New Batch
          </Button>
        </div>

        {/* Section A: Summary Cards */}
        <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
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
            <Card className="border-none shadow-sm rounded-2xl p-3 sm:p-4 flex flex-col gap-3 sm:gap-4 md:flex-row md:items-stretch">
              <div className="relative flex-1 w-full min-w-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input 
                  placeholder="Search by batch name..."
                  className="pl-10 bg-muted/20 border-none rounded-xl h-11 text-sm font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full shrink-0 md:w-auto">
                <Select value={courseFilter} onValueChange={setCourseFilter}>
                  <SelectTrigger className="w-full sm:w-[180px] bg-muted/20 border-none rounded-xl h-11 font-bold text-xs">
                    <SelectValue placeholder="All Courses" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-none shadow-xl">
                    <SelectItem value="all">All Courses</SelectItem>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>{course.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[150px] bg-muted/20 border-none rounded-xl h-11 font-bold text-xs">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-none shadow-xl">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Upcoming">Upcoming</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Learning">Learning</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Card>

            {/* Batch Table (tablet/desktop) */}
            <Card className="border-none shadow-sm rounded-2xl overflow-hidden hidden md:block">
              <div className="overflow-x-auto overscroll-x-contain -mx-px">
                <Table className="min-w-[1000px]">
                  <TableHeader className="bg-muted/30">
                    <TableRow className="hover:bg-transparent border-b border-border/50">
                      <TableHead className="px-4 lg:px-6 py-4 text-[11px] font-black uppercase tracking-widest text-muted-foreground">Batch Name</TableHead>
                      <TableHead className="py-4 text-[11px] font-black uppercase tracking-widest text-muted-foreground">Course</TableHead>
                      <TableHead className="py-4 text-[11px] font-black uppercase tracking-widest text-muted-foreground">Tutor</TableHead>
                      <TableHead className="py-4 text-[11px] font-black uppercase tracking-widest text-muted-foreground">Mentor</TableHead>
                      <TableHead className="py-4 text-[11px] font-black uppercase tracking-widest text-muted-foreground text-center">Students</TableHead>
                      <TableHead className="py-4 text-[11px] font-black uppercase tracking-widest text-muted-foreground">Start Date</TableHead>
                      <TableHead className="py-4 text-[11px] font-black uppercase tracking-widest text-muted-foreground text-center">Status</TableHead>
                      <TableHead className="py-4 text-right pr-6"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pagedBatches.map((batch) => (
                      <TableRow
                        key={batch.id}
                        className="group cursor-pointer hover:bg-muted/10 transition-colors border-b border-border/50 last:border-0"
                        onClick={() => navigate(`${basePath}/${batch.id}`)}
                      >
                        <TableCell className="px-4 lg:px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs shrink-0">
                              {batch.name.split(" ").filter(Boolean).slice(0, 2).map(n => n[0]).join("")}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-sm text-foreground truncate">{batch.name}</p>
                              <p className="text-[10px] font-medium text-muted-foreground truncate">{batch.id}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <p className="text-xs font-bold text-muted-foreground truncate max-w-[180px]">{batch.courseName}</p>
                        </TableCell>
                        <TableCell className="py-4">
                          <p className="text-xs font-bold text-foreground truncate">{getTutorName(batch.tutorId)}</p>
                        </TableCell>
                        <TableCell className="py-4">
                          <p className="text-xs font-bold text-foreground truncate">{getMentorName(batch.mentorId)}</p>
                        </TableCell>
                        <TableCell className="py-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-primary" />
                            <span className="font-black text-foreground text-xs">{batch.studentIds.length}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 text-xs font-bold text-muted-foreground">
                          {new Date(batch.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </TableCell>
                        <TableCell className="py-4 text-center">
                          {getStatusBadge(batch.status)}
                        </TableCell>
                        <TableCell className="py-4 text-right pr-6" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-2xl border-none shadow-2xl p-1.5 min-w-[160px]">
                              <DropdownMenuItem onClick={() => navigate(`${basePath}/${batch.id}`)} className="rounded-xl gap-2 font-bold text-xs cursor-pointer">
                                <Eye className="w-4 h-4 text-blue-500" /> View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => navigate(`${basePath}/${batch.id}/edit`)} className="rounded-xl gap-2 font-bold text-xs cursor-pointer">
                                <Pencil className="w-4 h-4 text-amber-500" /> Edit Batch
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteClick(batch)} className="rounded-xl gap-2 font-bold text-xs text-rose-600 cursor-pointer">
                                <Trash2 className="w-4 h-4" /> Delete Batch
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
                  Showing <span className="text-foreground">{filteredBatches.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, filteredBatches.length)}</span> of <span className="text-foreground">{filteredBatches.length}</span> batches
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
              {pagedBatches.map((batch) => (
                <Card key={batch.id} className="border-none shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-4" onClick={() => navigate(`${basePath}/${batch.id}`)}>
                    <div className="flex gap-3">
                      <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs shrink-0">
                        {batch.name.split(" ").filter(Boolean).slice(0, 2).map(n => n[0]).join("")}
                      </div>
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <div className="flex items-center justify-between">
                          <p className="truncate text-sm font-bold text-foreground">{batch.name}</p>
                          {getStatusBadge(batch.status)}
                        </div>
                        <p className="truncate text-[10px] font-medium text-muted-foreground">{batch.courseName}</p>
                        <div className="flex items-center gap-1.5 pt-1">
                          <Users className="w-3.5 h-3.5 text-primary" />
                          <span className="font-black text-foreground text-[10px]">{batch.studentIds.length} Students</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-border/40 flex items-center justify-between text-[11px] font-bold text-muted-foreground">
                      <span>Start: <span className="text-foreground">{new Date(batch.startDate).toLocaleDateString('en-GB')}</span></span>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl" onClick={(e) => { e.stopPropagation(); navigate(`${basePath}/${batch.id}/edit`); }}>
                          <Pencil className="w-4 h-4 text-amber-500" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl text-rose-600" onClick={(e) => { e.stopPropagation(); handleDeleteClick(batch); }}>
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

            {filteredBatches.length === 0 && (
              <div className="p-12 sm:p-20 text-center space-y-4">
                <div className="p-4 bg-muted/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto">
                  <Search className="w-8 h-8 text-muted-foreground/30" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-foreground">No batches found</h3>
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
                <AlertDialogTitle className="text-2xl font-black text-foreground">Delete Batch?</AlertDialogTitle>
                <AlertDialogDescription className="text-muted-foreground font-medium">
                  Are you sure you want to delete <span className="text-foreground font-bold">{batchToDelete?.name}</span>? This action cannot be undone.
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

export default BatchList;
