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
import { mentees, Mentee } from "@/data/mentorData";

// ─── Types & Mock Data ────────────────────────────────────────────────────────

const statusStyles: Record<string, string> = {
  "on-track": "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  "ahead": "bg-blue-500/10 text-blue-600 border-blue-500/20",
  "at-risk": "bg-rose-500/10 text-rose-600 border-rose-500/20",
  "needs-attention": "bg-amber-500/10 text-amber-600 border-amber-500/20",
};

// ─── Page Component ───────────────────────────────────────────────────────────

const MentorInterns = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filteredInterns = mentees.filter(m => m.type === "intern" && (
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase())
  ));

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
                    <TableHead className="text-xs font-semibold">Program</TableHead>
                    <TableHead className="text-xs font-semibold">Joined Date</TableHead>
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
                          {intern.course}
                        </TableCell>
                        <TableCell className="text-sm font-medium">
                          {intern.joinedDate}
                        </TableCell>
                        <TableCell className="text-sm font-medium">
                          {intern.progress}%
                        </TableCell>
                        <TableCell className="text-sm font-medium">
                          {intern.attendance}%
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-[10px] font-semibold capitalize ${statusStyles[intern.status]}`}>
                            {intern.status.replace("-", " ")}
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
