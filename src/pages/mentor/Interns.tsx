import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Search, Eye } from "lucide-react";

// ─── Types & Mock Data ────────────────────────────────────────────────────────

type InternStatus = "Active" | "Needs Attention" | "Inactive";

interface Intern {
  id: string;
  name: string;
  email: string;
  batch: string;
  tasksCompleted: string;
  progress: number;
  attendance: number;
  status: InternStatus;
}

const mockInterns: Intern[] = [
  { id: "INT-001", name: "Aarav Singh", email: "aarav.s@example.com", batch: "Full Stack - Mar 2026", tasksCompleted: "8 / 10", progress: 80, attendance: 95, status: "Active" },
  { id: "INT-002", name: "Priya Sharma", email: "priya.s@example.com", batch: "Full Stack - Mar 2026", tasksCompleted: "4 / 10", progress: 40, attendance: 70, status: "Needs Attention" },
  { id: "INT-003", name: "Rahul Mehta", email: "rahul.m@example.com", batch: "Full Stack - Mar 2026", tasksCompleted: "9 / 10", progress: 90, attendance: 100, status: "Active" },
  { id: "INT-004", name: "Sneha Verma", email: "sneha.v@example.com", batch: "Full Stack - Mar 2026", tasksCompleted: "1 / 10", progress: 10, attendance: 40, status: "Inactive" },
  { id: "INT-005", name: "Karan Nair", email: "karan.n@example.com", batch: "Full Stack - Mar 2026", tasksCompleted: "7 / 10", progress: 70, attendance: 85, status: "Active" },
];

const statusStyles: Record<InternStatus, string> = {
  "Active": "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  "Needs Attention": "bg-amber-500/10 text-amber-600 border-amber-500/20",
  "Inactive": "bg-red-500/10 text-red-600 border-red-500/20",
};

// ─── Page Component ───────────────────────────────────────────────────────────

const MentorInterns = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filteredInterns = mockInterns.filter(intern =>
    intern.name.toLowerCase().includes(search.toLowerCase()) ||
    intern.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6 max-w-7xl mx-auto pb-10">

        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">Interns</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              List of interns assigned to you in this internship batch.
            </p>
          </div>
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search interns by name or email..."
              className="pl-9 bg-background shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* ── Interns Table ── */}
        <Card className="border-border/50 shadow-sm rounded-xl overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="text-xs font-semibold">Intern Name</TableHead>
                    <TableHead className="text-xs font-semibold">Email</TableHead>
                    <TableHead className="text-xs font-semibold">Batch</TableHead>
                    <TableHead className="text-xs font-semibold">Tasks Completed</TableHead>
                    <TableHead className="text-xs font-semibold">Progress</TableHead>
                    <TableHead className="text-xs font-semibold">Attendance</TableHead>
                    <TableHead className="text-xs font-semibold">Status</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInterns.length > 0 ? (
                    filteredInterns.map((intern) => (
                      <TableRow key={intern.id} className="hover:bg-muted/10 transition-colors">
                        <TableCell className="font-medium text-sm text-foreground">
                          {intern.name}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {intern.email}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {intern.batch}
                        </TableCell>
                        <TableCell className="text-sm font-medium">
                          {intern.tasksCompleted}
                        </TableCell>
                        <TableCell className="text-sm font-medium">
                          {intern.progress}%
                        </TableCell>
                        <TableCell className="text-sm font-medium">
                          {intern.attendance}%
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-[10px] font-semibold ${statusStyles[intern.status]}`}>
                            {intern.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 gap-1.5 text-xs font-medium"
                            onClick={() => navigate(`/mentor/interns/${intern.id}`)}
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View Intern
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center text-muted-foreground text-sm">
                        No interns found matching your search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  );
};

export default MentorInterns;
