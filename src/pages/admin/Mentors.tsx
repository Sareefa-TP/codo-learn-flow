import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
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
  Search,
  MoreVertical,
  Eye,
  Edit2,
  Trash2,
  UserPlus,
  Users,
  UserCheck,
  UserX,
  Plus
} from "lucide-react";
import { mockMentors } from "@/data/mockMentors";
import { Badge } from "@/components/ui/badge";

const AdminMentors = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  // Summary Metrics
  const metrics = [
    { label: "Total Mentors", value: mockMentors.length, icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Active Mentors", value: mockMentors.filter(m => m.status === "Active").length, icon: UserCheck, color: "text-emerald-600", bg: "bg-emerald-100" },
    { label: "Inactive Mentors", value: mockMentors.filter(m => m.status === "Inactive").length, icon: UserX, color: "text-rose-600", bg: "bg-rose-100" },
    { label: "New Mentors", value: 2, icon: Plus, color: "text-amber-600", bg: "bg-amber-100" }, // Mocked for now
  ];

  // Unique courses for filter
  const courses = Array.from(new Set(mockMentors.flatMap(m => m.assignedCourses.map(c => c.name))));

  // Filter Logic
  const filteredMentors = mockMentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         mentor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = filterCourse === "All" || mentor.assignedCourses.some(c => c.name === filterCourse);
    const matchesStatus = filterStatus === "All" || mentor.status === filterStatus;
    
    return matchesSearch && matchesCourse && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 bg-slate-50/50 min-h-screen">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Mentors List</h1>
            <p className="text-slate-500 text-sm">Manage your academic mentors and their course assignments</p>
          </div>
          <Button 
            className="bg-primary hover:bg-primary/90 text-white rounded-xl px-6"
            onClick={() => navigate("/admin/mentors/add")}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add Mentor
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((item, index) => (
            <Card key={index} className="border-none shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`p-3 rounded-xl ${item.bg}`}>
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-900">{item.value}</p>
                  <p className="text-sm font-medium text-slate-500">{item.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="border-none shadow-sm rounded-2xl">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search mentors by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-11 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-primary/20"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Select value={filterCourse} onValueChange={setFilterCourse}>
                  <SelectTrigger className="w-full sm:w-[200px] h-11 bg-slate-50 border-slate-200 rounded-xl">
                    <SelectValue placeholder="All Courses" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="All">All Courses</SelectItem>
                    {courses.map(course => (
                      <SelectItem key={course} value={course}>{course}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-[150px] h-11 bg-slate-50 border-slate-200 rounded-xl">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="All">All Status</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50 border-b border-slate-100">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="py-4 px-6 text-slate-600 font-semibold">Name</TableHead>
                  <TableHead className="py-4 px-6 text-slate-600 font-semibold">Email</TableHead>
                  <TableHead className="py-4 px-6 text-slate-600 font-semibold">Phone</TableHead>
                  <TableHead className="py-4 px-6 text-slate-600 font-semibold">Courses (Batches)</TableHead>
                  <TableHead className="py-4 px-6 text-slate-600 font-semibold">Status</TableHead>
                  <TableHead className="py-4 px-6 text-slate-600 font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMentors.length > 0 ? (
                  filteredMentors.map((mentor) => (
                    <TableRow key={mentor.id} className="hover:bg-slate-50/80 border-b border-slate-50 transition-colors">
                      <TableCell className="py-4 px-6 font-medium text-slate-900">{mentor.name}</TableCell>
                      <TableCell className="py-4 px-6 text-slate-600">{mentor.email}</TableCell>
                      <TableCell className="py-4 px-6 text-slate-600">{mentor.phone}</TableCell>
                      <TableCell className="py-4 px-6">
                        <div className="flex flex-wrap gap-1">
                          {mentor.assignedCourses.map((c, i) => (
                            <Badge key={i} variant="secondary" className="bg-blue-50 text-blue-700 border-none rounded-lg text-[10px] font-medium">
                              {c.name} ({c.batches.join(", ")})
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <Badge className={`rounded-lg px-2.5 py-0.5 text-xs font-semibold ${
                          mentor.status === "Active" 
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-50" 
                            : "bg-slate-100 text-slate-600 hover:bg-slate-100"
                        }`}>
                          {mentor.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4 px-6 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg hover:bg-slate-200">
                              <MoreVertical className="h-4 w-4 text-slate-500" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[180px] rounded-xl border-slate-200 shadow-lg">
                            <DropdownMenuItem 
                              className="cursor-pointer gap-2 py-2.5 focus:bg-slate-50"
                              onClick={() => navigate(`/admin/mentors/${mentor.id}`)}
                            >
                              <Eye className="w-4 h-4 text-slate-500" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="cursor-pointer gap-2 py-2.5 focus:bg-slate-50"
                              onClick={() => navigate(`/admin/mentors/edit/${mentor.id}`)}
                            >
                              <Edit2 className="w-4 h-4 text-slate-500" /> Edit Mentor
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer gap-2 py-2.5 text-rose-600 focus:text-rose-600 focus:bg-rose-50">
                              <Trash2 className="w-4 h-4" /> Delete Mentor
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-slate-500">
                      No mentors found matching your search.
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

export default AdminMentors;
