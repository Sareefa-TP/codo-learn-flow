import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Eye, 
  Pencil, 
  Trash2,
  BookOpen,
  Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { courses, deleteCourse } from "@/data/courseData";
import { useToast } from "@/hooks/use-toast";
import { useRole } from "@/hooks/useRole";

const CoursesList = () => {
  const navigate = useNavigate();
  const { role } = useRole();
  const basePath = role === "superadmin" ? "/superadmin" : "/admin";
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const categories = ["All", ...Array.from(new Set(courses.map(c => c.category)))];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "All" || course.category === categoryFilter;
    const matchesStatus = statusFilter === "All" || course.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the course "${name}"?`)) {
      deleteCourse(id);
      toast({
        title: "Course Deleted",
        description: `The course "${name}" has been removed.`,
      });
      // Simple force refresh by navigating to the same page
      navigate(`${basePath}/courses`); 
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* SECTION A: HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Courses</h1>
            <p className="text-slate-500 text-sm">Manage and control all courses</p>
          </div>
          <Button 
            onClick={() => navigate(`${basePath}/courses/create`)}
            className="bg-primary hover:bg-primary/90 text-white rounded-xl px-6"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Course
          </Button>
        </div>

        {/* SECTION B: SEARCH + FILTER */}
        <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="p-4 bg-white">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search by course name..."
                  className="pl-10 h-11 bg-slate-50 border-slate-200 rounded-xl"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[160px] h-11 bg-slate-50 border-slate-200 rounded-xl">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px] h-11 bg-slate-50 border-slate-200 rounded-xl">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="All">All Status</SelectItem>
                    <SelectItem value="Published">Published</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SECTION C: COURSES TABLE */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden text-xs">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent border-slate-100">
                <TableHead className="font-bold text-slate-700 py-4">Course Name</TableHead>
                <TableHead className="font-bold text-slate-700 py-4">Category</TableHead>
                <TableHead className="font-bold text-slate-700 py-4">Duration</TableHead>
                <TableHead className="font-bold text-slate-700 py-4">Modules</TableHead>
                <TableHead className="font-bold text-slate-700 py-4 text-center">Status</TableHead>
                <TableHead className="font-bold text-slate-700 py-4">Created Date</TableHead>
                <TableHead className="font-bold text-slate-700 py-4 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <TableRow key={course.id} className="hover:bg-slate-50/50 border-slate-50 transition-colors">
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-slate-900 uppercase tracking-tighter">{course.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-100 rounded-lg">
                        {course.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 text-slate-600 font-medium">{course.duration}</TableCell>
                    <TableCell className="py-4 font-black">{course.modules.length}</TableCell>
                    <TableCell className="py-4 text-center">
                      <Badge className={
                        course.status === "Published" 
                          ? "bg-emerald-50 text-emerald-700 border-none rounded-lg" 
                          : "bg-amber-50 text-amber-700 border-none rounded-lg"
                      }>
                        {course.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 text-slate-500 text-sm font-medium">{course.createdDate}</TableCell>
                    <TableCell className="py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-slate-100">
                            <MoreVertical className="w-4 h-4 text-slate-500" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px] rounded-xl border-slate-200 shadow-lg">
                          <DropdownMenuItem 
                            onClick={() => navigate(`${basePath}/courses/${course.id}`)}
                            className="cursor-pointer gap-2 py-2.5 focus:bg-slate-50"
                          >
                            <Eye className="w-4 h-4 text-slate-500" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => navigate(`${basePath}/courses/edit/${course.id}`)}
                            className="cursor-pointer gap-2 py-2.5 focus:bg-slate-50"
                          >
                            <Pencil className="w-4 h-4 text-slate-500" /> Edit Course
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(course.id, course.name)}
                            className="cursor-pointer gap-2 py-2.5 text-rose-600 focus:bg-rose-50 focus:text-rose-600"
                          >
                            <Trash2 className="w-4 h-4" /> Delete Course
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-40 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <BookOpen className="w-10 h-10 mb-2 opacity-20" />
                      <p>No courses found matching your filters.</p>
                      <Button 
                        variant="link" 
                        onClick={() => { setSearchTerm(""); setCategoryFilter("All"); setStatusFilter("All"); }}
                        className="text-primary mt-1"
                      >
                        Clear all filters
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CoursesList;
