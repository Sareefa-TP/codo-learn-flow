import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Users, 
  UserCheck, 
  UserX, 
  UserPlus, 
  Search, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2, 
  Ban,
  FilterX,
  Plus,
  BookOpen,
  Layers,
  Phone
} from "lucide-react";
import { toast } from "sonner";
import { mockTutors as initialTutors } from "@/data/mockTutors";
import { cn } from "@/lib/utils";

const AdminTutors = () => {
  const navigate = useNavigate();
  const [tutors, setTutors] = useState(initialTutors);
  
  // Filters State
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [batchFilter, setBatchFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Pagination State
  const [rowsPerPage, setRowsPerPage] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);

  // Summary Metrics
  const metrics = {
    total: tutors.length,
    active: tutors.filter(t => t.status === "Active").length,
    inactive: tutors.filter(t => t.status === "Inactive").length,
    new: tutors.filter(t => {
        // Mocking "New" as joined in the last 30 days logic for UI purposes
        return t.joinedDate.includes("2025"); 
    }).length
  };

  // Filtering Logic
  const filteredTutors = useMemo(() => {
    return tutors.filter(tutor => {
      const matchesSearch = 
        tutor.name.toLowerCase().includes(search.toLowerCase()) || 
        tutor.email.toLowerCase().includes(search.toLowerCase());
      
      const matchesCourse = courseFilter === "all" || tutor.courses.some(c => c.name === courseFilter);
      const matchesStatus = statusFilter === "all" || tutor.status === statusFilter;
      
      // Batch filtering would ideally be more complex, but for now:
      const matchesBatch = batchFilter === "all" || tutor.courses.some(c => c.batches.includes(batchFilter));

      return matchesSearch && matchesCourse && matchesStatus && matchesBatch;
    });
  }, [tutors, search, courseFilter, batchFilter, statusFilter]);

  const resetFilters = () => {
    setSearch("");
    setCourseFilter("all");
    setBatchFilter("all");
    setStatusFilter("all");
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete tutor ${name}?`)) {
      setTutors(tutors.filter(t => t.id !== id));
      toast.success("Tutor deleted successfully");
    }
  };

  const handleToggleBlock = (id: string, name: string, isBlocked: boolean) => {
    const action = isBlocked ? "unblock" : "block";
    if (window.confirm(`Are you sure you want to ${action} tutor ${name}?`)) {
      setTutors(tutors.map(t => t.id === id ? { ...t, status: isBlocked ? "Active" : "Inactive" } : t));
      toast.success(`Tutor ${name} ${isBlocked ? "unblocked" : "blocked"} successfully`);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none font-bold text-[10px] uppercase rounded-lg px-2.5">Active</Badge>;
      case "Inactive":
        return <Badge className="bg-slate-100 text-slate-500 hover:bg-slate-100 border-none font-bold text-[10px] uppercase rounded-lg px-2.5">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6 max-w-[1600px] mx-auto pb-10 px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Tutor Management</h1>
            <p className="text-muted-foreground text-sm flex items-center gap-1.5 mt-0.5 font-medium">
               <Users className="w-3.5 h-3.5 text-primary" />
               Manage educator profiles, assignments, and performance
            </p>
          </div>
          <Button 
            onClick={() => navigate("/admin/tutor/add")}
            className="rounded-xl h-12 px-8 font-black uppercase tracking-widest text-[11px] shadow-lg shadow-primary/20 gap-2 transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" /> Add New Tutor
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-none shadow-sm rounded-2xl bg-white ring-1 ring-slate-100 hover:shadow-md transition-all group">
            <CardContent className="p-6 flex items-center gap-5">
               <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6" />
               </div>
               <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Tutors</p>
                  <h3 className="text-2xl font-bold text-slate-900">{metrics.total}</h3>
               </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-2xl bg-white ring-1 ring-slate-100 hover:shadow-md transition-all group">
            <CardContent className="p-6 flex items-center gap-5">
               <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                  <UserCheck className="w-6 h-6" />
               </div>
               <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Active Tutors</p>
                  <h3 className="text-2xl font-bold text-slate-900">{metrics.active}</h3>
               </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-2xl bg-white ring-1 ring-slate-100 hover:shadow-md transition-all group">
            <CardContent className="p-6 flex items-center gap-5">
               <div className="w-12 h-12 rounded-2xl bg-slate-400 flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                  <UserX className="w-6 h-6" />
               </div>
               <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Inactive Tutors</p>
                  <h3 className="text-2xl font-bold text-slate-900">{metrics.inactive}</h3>
               </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-2xl bg-white ring-1 ring-slate-100 hover:shadow-md transition-all group">
            <CardContent className="p-6 flex items-center gap-5">
               <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                  <Plus className="w-6 h-6" />
               </div>
               <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">New Tutors</p>
                  <h3 className="text-2xl font-bold text-slate-900">{metrics.new}</h3>
               </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-none shadow-sm rounded-2xl bg-white ring-1 ring-slate-100">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                <Input 
                  placeholder="Search name, email..." 
                  className="pl-10 h-11 bg-slate-50/50 border-slate-100/50 rounded-xl font-bold text-slate-800"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <Select value={courseFilter} onValueChange={setCourseFilter}>
                <SelectTrigger className="h-11 bg-slate-50/50 border-slate-100/50 rounded-xl font-bold text-slate-800">
                  <SelectValue placeholder="Course" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-none shadow-xl">
                  <SelectItem value="all" className="font-bold py-2.5">All Courses</SelectItem>
                  <SelectItem value="Full Stack Development" className="font-bold py-2.5">Full Stack</SelectItem>
                  <SelectItem value="UI/UX Design Masterclass" className="font-bold py-2.5">UI/UX Design</SelectItem>
                  <SelectItem value="Python Zero to Hero" className="font-bold py-2.5">Python</SelectItem>
                </SelectContent>
              </Select>

              <Select value={batchFilter} onValueChange={setBatchFilter}>
                <SelectTrigger className="h-11 bg-slate-50/50 border-slate-100/50 rounded-xl font-bold text-slate-800">
                  <SelectValue placeholder="Batch" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-none shadow-xl">
                  <SelectItem value="all" className="font-bold py-2.5">All Batches</SelectItem>
                  <SelectItem value="FS-JAN-24" className="font-bold py-2.5 outline-none">FS-JAN-24</SelectItem>
                  <SelectItem value="UI-MAR-24" className="font-bold py-2.5 outline-none">UI-MAR-24</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-11 bg-slate-50/50 border-slate-100/50 rounded-xl font-bold text-slate-800">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-none shadow-xl">
                  <SelectItem value="all" className="font-bold py-2.5">All Status</SelectItem>
                  <SelectItem value="Active" className="font-bold py-2.5">Active</SelectItem>
                  <SelectItem value="Inactive" className="font-bold py-2.5">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                onClick={resetFilters}
                className="h-11 rounded-xl border-slate-100 text-slate-500 font-bold hover:bg-slate-50 gap-2"
              >
                <FilterX className="w-4 h-4" /> Reset Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden ring-1 ring-slate-100">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 border-b border-slate-100 hover:bg-slate-50/50">
                  <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Educator Information</TableHead>
                  <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Contact Details</TableHead>
                  <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Assigned Units</TableHead>
                  <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</TableHead>
                  <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Joined Date</TableHead>
                  <TableHead className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Quick Controls</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTutors.length > 0 ? (
                  filteredTutors.map((tutor) => (
                    <TableRow key={tutor.id} className="hover:bg-slate-50/30 transition-colors border-b-slate-50/50">
                      <TableCell className="px-8 py-6">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-900 overflow-hidden shrink-0 border-2 border-white shadow-sm ring-1 ring-slate-100">
                               <img src={tutor.avatar} alt={tutor.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="space-y-0.5">
                               <p className="text-sm font-bold text-slate-900 tracking-tight">{tutor.name}</p>
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Educator ID: {tutor.id}</p>
                            </div>
                         </div>
                      </TableCell>
                      <TableCell className="py-6">
                        <div className="space-y-1">
                           <div className="flex items-center gap-2 text-xs font-bold text-slate-600 italic">
                             <Phone className="w-3 h-3 text-slate-300" /> {tutor.phone}
                           </div>
                           <p className="text-[10px] font-medium text-slate-400">{tutor.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="py-6">
                        <div className="space-y-1.5">
                           <div className="flex items-center gap-2">
                             <BookOpen className="w-3 h-3 text-primary/50" />
                             <span className="text-[10px] font-bold text-slate-600">{tutor.courses.length} Courses</span>
                           </div>
                           <div className="flex items-center gap-2">
                             <Layers className="w-3 h-3 text-slate-300" />
                             <span className="text-[10px] font-bold text-slate-400 italic">
                                {tutor.courses.reduce((acc, curr) => acc + curr.batches.length, 0)} Batches
                             </span>
                           </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-6">
                        {getStatusBadge(tutor.status)}
                      </TableCell>
                      <TableCell className="py-6 font-bold text-slate-500 text-xs">
                        {tutor.joinedDate}
                      </TableCell>
                      <TableCell className="px-8 py-6 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-slate-50">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56 rounded-2xl border-none shadow-2xl p-2">
                            <DropdownMenuLabel className="text-[10px] font-black uppercase text-slate-400 px-3 py-2">Profile Oversight</DropdownMenuLabel>
                             <DropdownMenuItem 
                              onClick={() => navigate(`/admin/tutor/${tutor.id}`)} 
                              className="rounded-xl h-11 px-3 font-bold text-slate-600 gap-3"
                            >
                              <Eye className="w-4 h-4" /> View Full Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => navigate(`/admin/tutor/edit/${tutor.id}`)} 
                              className="rounded-xl h-11 px-3 font-bold text-slate-600 gap-3"
                            >
                              <Edit className="w-4 h-4" /> Modify Config
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-slate-50 mx-1" />
                            <DropdownMenuItem 
                              onClick={() => handleToggleBlock(tutor.id, tutor.name, tutor.status === "Inactive")}
                              className="rounded-xl h-11 px-3 font-bold text-slate-600 gap-3"
                            >
                              <Ban className="w-4 h-4" /> {tutor.status === "Inactive" ? "Unblock Account" : "Block Access"}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(tutor.id, tutor.name)}
                              className="rounded-xl h-11 px-3 font-bold text-rose-500 hover:text-rose-600 gap-3"
                            >
                              <Trash2 className="w-4 h-4" /> Purge Explorer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-60 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                         <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center">
                            <Users className="w-8 h-8 text-slate-200" />
                         </div>
                         <p className="text-sm font-bold text-slate-500 italic">No tutors found in this view</p>
                         <Button variant="outline" onClick={resetFilters} className="rounded-xl font-bold h-10 border-slate-200">Reset Filters</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-6 rounded-2xl ring-1 ring-slate-100 shadow-sm">
           <div className="flex items-center gap-3">
              <p className="text-[10px] font-black uppercase text-slate-400">Rows per page</p>
              <Select value={rowsPerPage} onValueChange={setRowsPerPage}>
                <SelectTrigger className="w-20 h-9 bg-slate-50 border-none rounded-lg text-xs font-bold ring-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-none shadow-xl min-w-[5rem]">
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
           </div>

           <div className="flex items-center gap-2">
              <Button variant="outline" className="h-9 rounded-xl font-bold text-xs px-4" disabled>Previous</Button>
              <div className="flex items-center gap-1 mx-2">
                 {[1].map(p => (
                   <Button key={p} variant={currentPage === p ? "default" : "ghost"} className="w-9 h-9 rounded-xl font-bold text-xs p-0">{p}</Button>
                 ))}
              </div>
              <Button variant="outline" className="h-9 rounded-xl font-bold text-xs px-4" disabled>Next</Button>
           </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default AdminTutors;
