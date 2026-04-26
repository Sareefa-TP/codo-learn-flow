import { useState } from "react";
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
  Search,
  Users,
  Plus,
} from "lucide-react";
import { INTERNS } from "@/data/internData";
import { useRole } from "@/hooks/useRole";
import { cn } from "@/lib/utils";

const AdminInterns = () => {
  const navigate = useNavigate();
  const { role } = useRole();
  const basePath = role === "superadmin" ? "/superadmin" : "/admin";

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
            <Button className="rounded-xl gap-2 shadow-md shadow-primary/20 bg-primary hover:bg-primary/90 font-bold px-6" onClick={() => navigate(`${basePath}/interns/create`)}>
              <Plus className="w-4 h-4" />
              Add Intern
            </Button>
          </div>
        </div>



        {/* SEARCH BAR */}
        <div className="flex flex-col gap-4">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search name, email, role, joined date..."
              className="h-11 rounded-xl border-border/50 bg-muted/30 pl-11 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Filter Tabs */}
          <div className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden w-full">
            <div className="grid grid-cols-2 md:grid-cols-4 w-full">
              {[
                { label: "All", count: totalInterns },
                { label: "Active", count: activeInterns },
                { label: "Completed", count: completedInterns },
                { label: "Inactive", count: inactiveInterns }
              ].map(tab => {
                const isActive = filterStatus === tab.label;
                return (
                  <button
                    key={tab.label}
                    onClick={() => setFilterStatus(tab.label)}
                    className={cn(
                      "flex items-center justify-center gap-2.5 py-4 transition-all duration-300 outline-none group border-r last:border-r-0 border-slate-50 relative",
                      isActive 
                        ? "bg-primary/[0.03] text-primary" 
                        : "text-slate-400 hover:text-slate-600 hover:bg-slate-50/50"
                    )}
                  >
                    {isActive && (
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-primary animate-in fade-in slide-in-from-bottom-1 duration-300" />
                    )}
                    <span className="text-xs font-black uppercase tracking-widest whitespace-nowrap">
                      {tab.label}
                    </span>
                    <div className={cn(
                      "flex items-center justify-center min-w-[20px] h-5 rounded-full text-[9px] font-black px-1.5 transition-colors",
                      isActive 
                        ? "bg-primary text-white shadow-sm" 
                        : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                    )}>
                      {tab.count}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
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
                    onClick={() => navigate(`${basePath}/interns/${intern.id}`)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        navigate(`${basePath}/interns/${intern.id}`);
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
                          : intern.status === "Completed"
                          ? "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-blue-500/20"
                          : "bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 border-rose-500/20"
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
