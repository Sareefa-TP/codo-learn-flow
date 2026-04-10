import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
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
  Search,
  Briefcase,
  Users,
  CheckCircle,
  Clock,
  Plus,
  UserX
} from "lucide-react";
import { INTERNS } from "@/data/internData";

const AdminInterns = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // Summary counts
  const totalInterns = INTERNS.length;
  const activeInterns = INTERNS.filter(i => i.status === "Active").length;
  const completedInterns = INTERNS.filter(i => i.status === "Completed").length;
  const inactiveInterns = INTERNS.filter(i => i.status === "Inactive").length;

  const filteredInterns = INTERNS.filter((intern) => {
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !q ||
      intern.name.toLowerCase().includes(q) ||
      intern.email.toLowerCase().includes(q) ||
      intern.role.toLowerCase().includes(q) ||
      intern.joinedDate.toLowerCase().includes(q);
    const matchesStatus = filterStatus === "All" || intern.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6 max-w-[1600px] mx-auto pb-10">
        
        {/* SECTION A: HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Interns</h1>
            <p className="text-muted-foreground mt-1">Manage and monitor all interns</p>
          </div>
          <div className="flex items-center gap-2">
            <Button className="rounded-xl gap-2 shadow-md shadow-primary/20 bg-primary hover:bg-primary/90 font-bold px-6" onClick={() => navigate("/admin/interns/create")}>
              <Plus className="w-4 h-4" />
              Add Intern
            </Button>
          </div>
        </div>

        {/* SUMMARY CARDS (Added for Premium UI) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="rounded-2xl border-border/50 shadow-sm overflow-hidden group">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 shrink-0 group-hover:scale-110 transition-transform">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Interns</p>
                <h3 className="text-2xl font-bold">{totalInterns}</h3>
              </div>
            </CardContent>
          </Card>
          
          <Card className="rounded-2xl border-border/50 shadow-sm overflow-hidden group">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0 group-hover:scale-110 transition-transform">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Active Interns</p>
                <h3 className="text-2xl font-bold">{activeInterns}</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/50 shadow-sm overflow-hidden group">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-600 shrink-0 group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Completed</p>
                <h3 className="text-2xl font-bold">{completedInterns}</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/50 shadow-sm overflow-hidden group">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-600 shrink-0 group-hover:scale-110 transition-transform">
                <UserX className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Inactive Interns</p>
                <h3 className="text-2xl font-bold">{inactiveInterns}</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* SECTION B: SEARCH + STATUS */}
        <div className="flex flex-col gap-4 rounded-2xl border border-border/50 bg-card p-4 shadow-sm sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search name, email, role, joined date..."
              className="h-11 rounded-xl border-border/50 bg-muted/30 pl-11"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="h-11 w-full shrink-0 rounded-xl border-border/50 bg-muted/30 sm:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* SECTION C: INTERNS TABLE */}
        <Card className="rounded-2xl border-border/50 shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow className="hover:bg-transparent border-border/60">
                <TableHead className="py-4 pl-6 text-foreground font-bold">Intern Name</TableHead>
                <TableHead className="text-foreground font-bold">Email</TableHead>
                <TableHead className="text-foreground font-bold">Course / Role</TableHead>
                <TableHead className="text-foreground font-bold">Status</TableHead>
                <TableHead className="text-foreground font-bold">Joined Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInterns.length > 0 ? (
                filteredInterns.map((intern) => (
                  <TableRow
                    key={intern.id}
                    tabIndex={0}
                    aria-label={`Open profile for ${intern.name}`}
                    className="cursor-pointer border-border/40 transition-colors hover:bg-muted/30 focus-visible:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25"
                    onClick={() => navigate(`/admin/interns/${intern.id}`)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        navigate(`/admin/interns/${intern.id}`);
                      }
                    }}
                  >
                    <TableCell className="py-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                          {intern.name.charAt(0)}
                        </div>
                        <span className="font-semibold text-foreground">{intern.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{intern.email}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">{intern.role}</span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{intern.course}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={
                        intern.status === "Active" 
                          ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20" 
                          : "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-blue-500/20"
                      }>
                        {intern.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground font-medium">{intern.joinedDate}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-40 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Users className="w-8 h-8 text-muted-foreground/30" />
                      <p className="text-muted-foreground font-medium">No interns found matching your criteria</p>
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

export default AdminInterns;
