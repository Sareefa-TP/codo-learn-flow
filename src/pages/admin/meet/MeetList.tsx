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
  Plus, 
  Search, 
  MoreVertical, 
  Video, 
  ExternalLink, 
  Copy, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar,
  Layers,
  User,
  FilterX
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// --- Mock Data ---
const mockMeets = [
  {
    id: "M1",
    title: "React Fundamentals: Hooks & State",
    course: "Full Stack Development",
    batch: "FS-JAN-24",
    host: "Arun Krishnan",
    hostRole: "Tutor",
    dateTime: "25 Mar 2024, 10:00 AM",
    duration: "90 Min",
    status: "Upcoming",
    link: "https://meet.google.com/abc-defg-hij"
  },
  {
    id: "M2",
    title: "Advanced CSS: Grid & Flexbox",
    course: "UI/UX Design",
    batch: "UI-JAN-24",
    host: "Anjali Desai",
    hostRole: "Tutor",
    dateTime: "24 Mar 2024, 02:00 PM",
    duration: "60 Min",
    status: "Live",
    link: "https://meet.google.com/klm-nopq-rst"
  },
  {
    id: "M3",
    title: "Node.js API Development",
    course: "Full Stack Development",
    batch: "FS-JAN-24",
    host: "Suresh Raina",
    hostRole: "Mentor",
    dateTime: "20 Mar 2024, 11:30 AM",
    duration: "120 Min",
    status: "Completed",
    link: "https://meet.google.com/uvw-xyz-123"
  }
];

const AdminMeetList = () => {
  const navigate = useNavigate();
  const [meets, setMeets] = useState(mockMeets);
  
  // Filters State
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [hostFilter, setHostFilter] = useState("all");

  // Filtering Logic
  const filteredMeets = useMemo(() => {
    return meets.filter(meet => {
      const matchesSearch = meet.title.toLowerCase().includes(search.toLowerCase());
      const matchesCourse = courseFilter === "all" || meet.course === courseFilter;
      const matchesStatus = statusFilter === "all" || meet.status === statusFilter;
      const matchesHost = hostFilter === "all" || meet.hostRole === hostFilter;
      return matchesSearch && matchesCourse && matchesStatus && matchesHost;
    });
  }, [meets, search, courseFilter, statusFilter, hostFilter]);

  const resetFilters = () => {
    setSearch("");
    setCourseFilter("all");
    setStatusFilter("all");
    setHostFilter("all");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Upcoming":
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none font-bold text-[10px] uppercase rounded-lg px-2.5">Upcoming</Badge>;
      case "Live":
        return <Badge className="bg-red-100 text-red-600 hover:bg-red-100 border-none font-bold text-[10px] uppercase animate-pulse rounded-lg px-2.5">Live Now</Badge>;
      case "Completed":
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none font-bold text-[10px] uppercase rounded-lg px-2.5">Completed</Badge>;
      case "Cancelled":
        return <Badge className="bg-slate-100 text-slate-500 hover:bg-slate-100 border-none font-bold text-[10px] uppercase rounded-lg px-2.5">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const copyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast.success("Meeting link copied!");
  };

  const summaryData = [
    { label: "Total Meets", value: meets.length, color: "bg-primary" },
    { label: "Upcoming", value: meets.filter(m => m.status === "Upcoming").length, color: "bg-amber-500" },
    { label: "Completed", value: meets.filter(m => m.status === "Completed").length, color: "bg-emerald-500" },
    { label: "Cancelled", value: meets.filter(m => m.status === "Cancelled").length, color: "bg-rose-500" },
  ];

  const handleRefresh = () => {
    // In a real app, this would re-fetch data from API
    // For mock, I'll just show a success message
    toast.success("Meet list refreshed!");
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6 max-w-[1600px] mx-auto pb-10 px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Meet Administration</h1>
            <p className="text-muted-foreground text-sm flex items-center gap-1.5 mt-0.5 font-medium">
               <Video className="w-3.5 h-3.5 text-primary" />
               Complete oversight of all live learning sessions
            </p>
          </div>
          <Button 
            onClick={() => navigate("/admin/meet/schedule")}
            className="rounded-xl h-12 px-8 font-black uppercase tracking-widest text-[11px] shadow-lg shadow-primary/20 gap-2 transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" /> Schedule New Meet
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {summaryData.map((card, i) => (
            <Card key={i} className="border-none shadow-sm rounded-2xl bg-white overflow-hidden group hover:shadow-md transition-all duration-300 ring-1 ring-slate-100">
              <CardContent className="p-6 flex items-center gap-5">
                 <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-xl shrink-0 group-hover:scale-110 transition-transform duration-300", card.color)}>
                    {card.value}
                 </div>
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{card.label}</p>
                    <p className="text-xs font-bold text-slate-800 mt-0.5 italic">Session Activity</p>
                 </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filter Bar */}
        <Card className="border-none shadow-sm rounded-2xl bg-white ring-1 ring-slate-100">
          <CardContent className="p-4 md:p-6 lg:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
              <div className="relative group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                <Input 
                  placeholder="Search titles..." 
                  className="pl-10 h-12 bg-slate-50/50 border-slate-100/50 rounded-xl font-bold text-slate-800 placeholder:text-slate-300"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <Select value={courseFilter} onValueChange={setCourseFilter}>
                <SelectTrigger className="h-12 bg-slate-50/50 border-slate-100/50 rounded-xl font-bold text-slate-800 focus:ring-primary/20">
                  <SelectValue placeholder="Course Track" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-none shadow-xl">
                  <SelectItem value="all" className="font-bold py-2.5">All Courses</SelectItem>
                  <SelectItem value="Full Stack Development" className="font-bold py-2.5">Full Stack</SelectItem>
                  <SelectItem value="UI/UX Design" className="font-bold py-2.5">UI/UX Design</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-12 bg-slate-50/50 border-slate-100/50 rounded-xl font-bold text-slate-800 focus:ring-primary/20">
                  <SelectValue placeholder="Session Status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-none shadow-xl">
                  <SelectItem value="all" className="font-bold py-2.5">All Status</SelectItem>
                  <SelectItem value="Upcoming" className="font-bold py-2.5 underline decoration-amber-400">Upcoming</SelectItem>
                  <SelectItem value="Live" className="font-bold py-2.5 underline decoration-rose-400">Live Now</SelectItem>
                  <SelectItem value="Completed" className="font-bold py-2.5 underline decoration-emerald-400">Completed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={hostFilter} onValueChange={setHostFilter}>
                <SelectTrigger className="h-12 bg-slate-50/50 border-slate-100/50 rounded-xl font-bold text-slate-800 focus:ring-primary/20">
                  <SelectValue placeholder="Host Role" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-none shadow-xl">
                  <SelectItem value="all" className="font-bold py-2.5">All Roles</SelectItem>
                  <SelectItem value="Tutor" className="font-bold py-2.5">Tutors</SelectItem>
                  <SelectItem value="Mentor" className="font-bold py-2.5">Mentors</SelectItem>
                  <SelectItem value="Admin" className="font-bold py-2.5">Administrators</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                onClick={resetFilters}
                className="h-12 rounded-xl border-slate-100 text-slate-500 font-bold hover:bg-slate-50 hover:text-primary gap-2"
              >
                <FilterX className="w-4 h-4" /> Reset Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Meet Table */}
        <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden ring-1 ring-slate-100">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 border-b border-slate-100 hover:bg-slate-50/50">
                  <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Session Narrative</TableHead>
                  <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Target Group</TableHead>
                  <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Session Host</TableHead>
                  <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Timeline</TableHead>
                  <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</TableHead>
                  <TableHead className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Quick Controls</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMeets.length > 0 ? (
                  filteredMeets.map((meet) => (
                    <TableRow key={meet.id} className="hover:bg-slate-50/30 transition-colors border-b-slate-50/50">
                      <TableCell className="px-8 py-6">
                         <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                               <Video className="w-5 h-5 text-slate-400" />
                            </div>
                            <div className="space-y-1">
                               <p className="text-sm font-bold text-slate-900 tracking-tight leading-none">{meet.title}</p>
                               <p className="text-[10px] font-black text-slate-300 uppercase leading-none">Internal ID: {meet.id}</p>
                            </div>
                         </div>
                      </TableCell>
                      <TableCell className="py-6">
                        <div className="space-y-1.5">
                           <div className="flex items-center gap-1.5 px-2 py-0.5 bg-indigo-50/50 w-fit rounded-md border border-indigo-100/30">
                              <Layers className="w-3 h-3 text-indigo-400" />
                              <span className="text-[9px] font-black text-indigo-700 uppercase">{meet.course}</span>
                           </div>
                           <p className="text-[10px] font-bold text-slate-400 px-2 italic text-left">{meet.batch}</p>
                        </div>
                      </TableCell>
                      <TableCell className="py-6">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black text-[10px]">
                              {meet.host.split(" ").map(n => n[0]).join("")}
                           </div>
                           <div className="space-y-0.5">
                              <p className="text-xs font-bold text-slate-800">{meet.host}</p>
                              <p className="text-[9px] font-black text-primary uppercase opacity-60 tracking-tighter">{meet.hostRole}</p>
                           </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-6">
                        <div className="space-y-1">
                           <div className="flex items-center gap-2 text-slate-600 font-bold text-xs ring-offset-2">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              {meet.dateTime.split(",")[0]}
                           </div>
                           <p className="text-[10px] font-medium text-slate-400 italic">{meet.dateTime.split(",")[1]}</p>
                        </div>
                      </TableCell>
                      <TableCell className="py-6">
                        {getStatusBadge(meet.status)}
                      </TableCell>
                      <TableCell className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-9 w-9 rounded-xl hover:bg-primary/5 hover:text-primary transition-colors"
                            onClick={() => window.open(meet.link, "_blank")}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-9 w-9 rounded-xl hover:bg-slate-50"
                            onClick={() => copyLink(meet.link)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-slate-50">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 rounded-2xl border-none shadow-2xl p-2">
                              <DropdownMenuLabel className="text-[10px] font-black uppercase text-slate-400 px-3 py-2">Session Administration</DropdownMenuLabel>
                               <DropdownMenuItem onClick={() => navigate(`/admin/meet/${meet.id}`)} className="rounded-xl h-11 px-3 font-bold text-slate-600 gap-3">
                                <Eye className="w-4 h-4" /> View Full Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem className="rounded-xl h-11 px-3 font-bold text-slate-600 gap-3">
                                <Edit className="w-4 h-4" /> Modify Config
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-slate-50 mx-1" />
                              <DropdownMenuItem className="rounded-xl h-11 px-3 font-bold text-rose-500 hover:text-rose-600 gap-3">
                                <Trash2 className="w-4 h-4" /> Terminate Meet
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-80 text-center">
                      <div className="flex flex-col items-center justify-center space-y-4">
                         <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center ring-4 ring-white shadow-sm">
                            <Video className="w-8 h-8 text-slate-200" />
                         </div>
                         <div>
                            <p className="text-sm font-bold text-slate-600 italic">No live or scheduled sessions found</p>
                            <p className="text-xs text-slate-400 mt-1">Try adjusting your active filters or create a new one.</p>
                         </div>
                         <Button variant="outline" onClick={resetFilters} className="rounded-xl font-bold h-10 border-slate-200">
                            Clear Active Filters
                         </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminMeetList;
