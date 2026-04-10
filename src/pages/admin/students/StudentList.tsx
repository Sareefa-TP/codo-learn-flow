import { useEffect, useMemo, useState } from "react";
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
  Users,
  CheckCircle2,
  TrendingUp,
  UserX,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { defaultMentorNameForStudentId } from "./studentDefaults";

// --- LocalStorage Student Store (frontend-only persistence) ---

const STUDENTS_STORAGE_KEY = "students";

type StudentStatus = "Active" | "Blocked" | "Completed";

type StudentCourse = {
  id: string;
  name: string;
};

type StudentRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: StudentStatus;
  courses: StudentCourse[]; // must always exist
  batchId: string;
  batchName: string;
  joined: string; // YYYY-MM-DD
  mentorName: string;
};

function normalizeStudentRow(input: any): StudentRow | null {
  if (!input || typeof input !== "object") return null;
  const id = typeof input.id === "string" ? input.id : null;
  const name = typeof input.name === "string" ? input.name : "";
  const email = typeof input.email === "string" ? input.email : "";
  const phone = typeof input.phone === "string" ? input.phone : "";
  const status = (["Active", "Blocked", "Completed"] as const).includes(input.status) ? (input.status as StudentStatus) : "Active";
  const joined = typeof input.joined === "string" ? input.joined : new Date().toISOString().slice(0, 10);
  const batchId = typeof input.batchId === "string" ? input.batchId : "";
  const batchName = typeof input.batchName === "string" ? input.batchName : "";
  const rawCourses = Array.isArray(input.courses) ? input.courses : [];
  const courses: StudentCourse[] = rawCourses
    .map((c: any) => {
      if (typeof c === "string") return { id: c, name: c };
      if (!c || typeof c !== "object") return null;
      const cid = typeof c.id === "string" ? c.id : null;
      const cname = typeof c.name === "string" ? c.name : null;
      if (!cid || !cname) return null;
      return { id: cid, name: cname };
    })
    .filter(Boolean) as StudentCourse[];
  if (!id) return null;
  const rawMentor = typeof input.mentorName === "string" ? input.mentorName.trim() : "";
  const mentorName = rawMentor || defaultMentorNameForStudentId(id);
  return { id, name, email, phone, status, joined, courses, batchId, batchName, mentorName };
}

function readStoredStudents(): StudentRow[] {
  try {
    const raw = localStorage.getItem(STUDENTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return (parsed as any[]).map(normalizeStudentRow).filter(Boolean) as StudentRow[];
  } catch {
    return [];
  }
}

function writeStoredStudents(students: StudentRow[]) {
  localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(students));
}

const baseStudents = [
  { id: "S1001", name: "Sarah Connor", email: "sarah.c@example.com", phone: "+1 234 567 890", status: "Active" as const, joined: "2024-01-15", batchId: "b1", batchName: "Morning Batch", mentorName: "Elena Rodriguez", courses: [{ id: "c1", name: "Full Stack Development" }, { id: "c3", name: "UI/UX Design" }] },
  { id: "S1002", name: "John Smith", email: "john.s@example.com", phone: "+1 234 567 891", status: "Active" as const, joined: "2024-02-10", batchId: "b2", batchName: "Evening Batch", mentorName: "Michael Chen", courses: [{ id: "c3", name: "Python Data Science" }] },
  { id: "S1003", name: "Elena Gilbert", email: "elena.g@example.com", phone: "+1 234 567 892", status: "Blocked" as const, joined: "2024-03-05", batchId: "b2", batchName: "Evening Batch", mentorName: "James Kumar", courses: [{ id: "c4", name: "Digital Marketing" }] },
  { id: "S1004", name: "Stefan Salvatore", email: "stefan.s@example.com", phone: "+1 234 567 893", status: "Completed" as const, joined: "2024-01-20", batchId: "b1", batchName: "Morning Batch", mentorName: "Priya Sharma", courses: [{ id: "c1", name: "Full Stack Development" }] },
  { id: "S1005", name: "Bonnie Bennett", email: "bonnie.b@example.com", phone: "+1 234 567 894", status: "Active" as const, joined: "2024-02-15", batchId: "b1", batchName: "Morning Batch", mentorName: "Ananya Iyer", courses: [{ id: "c3", name: "UI/UX Design" }] },
];

// 100 pages (pageSize=10) => 1000 mock rows for pagination UI testing
const seededStudents: StudentRow[] = Array.from({ length: 1000 }).map((_, i) => {
  const s = baseStudents[i % baseStudents.length];
  const n = i + 1;
  const id = `S${String(1000 + n)}`; // stable seeded ids
  const emailPrefix = s.email.split("@")[0] ?? "student";
  return {
    ...s,
    id,
    name: `${s.name} ${n}`,
    email: `${emailPrefix}.${n}@example.com`,
    phone: `+1 234 567 ${String(800 + n).padStart(3, "0")}`,
  };
});

const StudentList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [students, setStudents] = useState<StudentRow[]>([]);
  const pageSize = 10;

  // Load from localStorage (and seed once if empty)
  useEffect(() => {
    const stored = readStoredStudents();
    if (stored.length > 0) {
      setStudents(stored);
      return;
    }
    writeStoredStudents(seededStudents);
    setStudents(seededStudents);
  }, []);

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.phone.includes(searchTerm);
      const matchesStatus = statusFilter === "all" || s.status.toLowerCase() === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter, students]);

  const summaryCards = useMemo(() => {
    const total = students.length;
    const active = students.filter((s) => s.status === "Active").length;
    const completed = students.filter((s) => s.status === "Completed").length;
    const inactive = students.filter((s) => s.status === "Blocked").length;
    return [
      { label: "Total Students", value: total.toLocaleString(), icon: Users, color: "text-blue-600", bg: "bg-blue-50", filter: "all" },
      { label: "Active Students", value: active.toLocaleString(), icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", filter: "active" },
      { label: "Completed Students", value: completed.toLocaleString(), icon: TrendingUp, color: "text-indigo-600", bg: "bg-indigo-50", filter: "completed" },
      { label: "Inactive Students", value: inactive.toLocaleString(), icon: UserX, color: "text-red-600", bg: "bg-red-50", filter: "blocked" },
    ];
  }, [students]);

  const pageCount = Math.max(1, Math.ceil(filteredStudents.length / pageSize));
  const currentPage = Math.min(Math.max(1, page), pageCount);

  useEffect(() => {
    if (page !== currentPage) setPage(currentPage);
  }, [page, currentPage]);

  const pagedStudents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredStudents.slice(start, start + pageSize);
  }, [currentPage, filteredStudents]);

  const pageItems = useMemo(() => {
    const last = pageCount;
    const cur = currentPage;
    const items: Array<number | "ellipsis"> = [];

    // Keep pagination ultra-compact (matches requested sequences):
    // - Page 1/2: 1 2 3 … last
    // - Page 3:   1 2 3 4 … last
    // - Page 4:   1 … 3 4 5 … last
    // - Page 5:   1 … 4 5 6 … last
    if (last <= 1) return [1];

    // If the total pages are small, show them all.
    if (last <= 5) {
      for (let i = 1; i <= last; i++) items.push(i);
      return items;
    }

    // Near the start: 1 2 3 … last (or 1 2 3 4 … last when cur=3)
    if (cur <= 2) {
      items.push(1, 2, 3, "ellipsis", last);
      return items;
    }
    if (cur === 3) {
      items.push(1, 2, 3, 4, "ellipsis", last);
      return items;
    }

    // Near the end: 1 … last-3 last-2 last-1 last
    if (cur >= last - 1) {
      items.push(1, "ellipsis", last - 3, last - 2, last - 1, last);
      return items;
    }
    if (cur === last - 2) {
      items.push(1, "ellipsis", last - 3, last - 2, last - 1, last);
      return items;
    }

    // Middle: 1 … cur-1 cur cur+1 … last
    items.push(1, "ellipsis", cur - 1, cur, cur + 1, "ellipsis", last);
    return items;
  }, [currentPage, pageCount]);

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-5 sm:space-y-6 max-w-[1600px] mx-auto pb-6 sm:pb-10 px-0 sm:px-2 md:px-4 lg:px-6">
        
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-1">
            <h1 className="text-xl font-bold text-foreground tracking-tight sm:text-2xl">Student Management</h1>
            <p className="text-xs text-muted-foreground font-medium leading-relaxed sm:text-sm">
              Oversee all students, manage status, and track enrollment phases.
            </p>
          </div>
          <Button 
            onClick={() => navigate("/admin/students/add")}
            className="h-11 w-full shrink-0 rounded-xl shadow-sm hover:shadow-md transition-all gap-2 px-6 sm:h-10 sm:w-auto"
          >
            <Plus className="w-4 h-4" /> Add Student
          </Button>
        </div>

        {/* Section A: Summary Cards — 2×2 on small phones, 4 across on large screens */}
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
          {/* List View */}
          <section className="space-y-6">
            
            {/* Search + Filter Bar */}
            <Card className="border-none shadow-sm rounded-2xl p-3 sm:p-4 flex flex-col gap-3 sm:gap-4 md:flex-row md:items-stretch">
              <div className="relative flex-1 w-full min-w-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input 
                  placeholder="Search name, email, phone..."
                  className="pl-10 bg-muted/20 border-none rounded-xl h-11 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex w-full shrink-0 md:w-auto md:max-w-[200px]">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-[160px] bg-muted/20 border-none rounded-xl h-11 font-bold text-xs">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-none shadow-xl">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="blocked">Inactive</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Card>

            {/* Student Table (tablet/desktop) */}
            <Card className="border-none shadow-sm rounded-2xl overflow-hidden hidden md:block">
              <div className="overflow-x-auto overscroll-x-contain -mx-px">
                <Table className="min-w-[800px]">
                  <TableHeader className="bg-muted/30">
                    <TableRow className="hover:bg-transparent border-b border-border/50">
                      <TableHead className="px-4 lg:px-6 py-4 text-[11px] font-black uppercase tracking-widest text-muted-foreground">Student</TableHead>
                      <TableHead className="py-4 text-[11px] font-black uppercase tracking-widest text-muted-foreground">Courses</TableHead>
                      <TableHead className="py-4 text-[11px] font-black uppercase tracking-widest text-muted-foreground hidden lg:table-cell">Batch</TableHead>
                      <TableHead className="py-4 text-[11px] font-black uppercase tracking-widest text-muted-foreground hidden lg:table-cell">Mentor</TableHead>
                      <TableHead className="py-4 text-[11px] font-black uppercase tracking-widest text-muted-foreground text-center">Status</TableHead>
                      <TableHead className="py-4 text-[11px] font-black uppercase tracking-widest text-muted-foreground hidden xl:table-cell">Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pagedStudents.map((student) => (
                      <TableRow
                        key={student.id}
                        className="group cursor-pointer hover:bg-muted/10 transition-colors border-b border-border/50 last:border-0 focus-within:bg-muted/10"
                        tabIndex={0}
                        onClick={() => navigate(`/admin/students/${student.id}`)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            navigate(`/admin/students/${student.id}`);
                          }
                        }}
                      >
                        <TableCell className="px-4 lg:px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs shrink-0">
                              {student.name.split(" ").map(n => n[0]).join("")}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-sm text-foreground truncate">{student.name}</p>
                              <p className="text-[10px] font-medium text-muted-foreground truncate">{student.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 max-w-[200px]">
                          <div className="flex flex-wrap gap-1">
                            {student.courses.map((c, i) => (
                              <Badge key={i} variant="secondary" className="text-[9px] font-bold h-4 px-1.5 bg-muted text-muted-foreground border-none truncate max-w-full">
                                {c.name}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="py-4 font-bold text-xs text-muted-foreground hidden lg:table-cell">
                          {student.batchName || "—"}
                        </TableCell>
                        <TableCell className="py-4 hidden lg:table-cell">
                          <p className="max-w-[160px] truncate text-xs font-bold text-foreground" title={student.mentorName}>
                            {student.mentorName}
                          </p>
                        </TableCell>
                        <TableCell className="py-4 text-center">
                          <Badge className={cn(
                            "text-[10px] font-black h-5 px-2 px-2.5 rounded-full border-none shadow-none",
                            student.status === "Active" ? "bg-emerald-50 text-emerald-600" : 
                            student.status === "Blocked" ? "bg-red-50 text-red-600" :
                            "bg-blue-50 text-blue-600"
                          )}>
                            {student.status === "Blocked" ? "Inactive" : student.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4 text-[11px] font-bold text-muted-foreground whitespace-nowrap hidden xl:table-cell">
                          {student.joined}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {/* Pagination — desktop table card */}
              <div className="px-4 py-4 border-t border-border/50 bg-muted/10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <p className="text-center text-[10px] font-bold text-muted-foreground sm:text-left sm:text-[11px]">
                  Showing{" "}
                  <span className="text-foreground">
                    {filteredStudents.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}-
                    {Math.min(currentPage * pageSize, filteredStudents.length)}
                  </span>{" "}
                  of <span className="text-foreground">{filteredStudents.length}</span> students
                </p>
                <div className="flex justify-center sm:justify-end min-w-0">
                  <div className="inline-flex max-w-full items-center overflow-x-auto rounded-2xl border border-border/60 bg-background px-1 py-1 shadow-sm">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 shrink-0 rounded-xl"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <div className="flex items-center gap-0.5 px-0.5 sm:gap-1 sm:px-1">
                    {pageItems.map((item, idx) =>
                      item === "ellipsis" ? (
                        <div key={`e-${idx}`} className="px-1.5 text-sm font-bold text-muted-foreground sm:px-2">
                          …
                        </div>
                      ) : (
                        <Button
                          key={item}
                          type="button"
                          variant={item === currentPage ? "default" : "ghost"}
                          className={cn(
                            "h-9 min-w-8 shrink-0 rounded-xl px-2 text-xs font-bold sm:min-w-9 sm:px-3 sm:text-sm",
                            item === currentPage && "bg-primary text-primary-foreground shadow-sm",
                          )}
                          onClick={() => setPage(item)}
                          aria-current={item === currentPage ? "page" : undefined}
                        >
                          {item}
                        </Button>
                      ),
                    )}
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 shrink-0 rounded-xl"
                    onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                    disabled={currentPage === pageCount}
                    aria-label="Next page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Mobile / small tablet: card list */}
            <div className="space-y-3 md:hidden">
              {pagedStudents.map((student) => (
                <Card
                  key={student.id}
                  className="border-none shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <button
                      type="button"
                      className="flex w-full gap-3 rounded-xl text-left outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary/30"
                      onClick={() => navigate(`/admin/students/${student.id}`)}
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {student.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div className="min-w-0 flex-1 space-y-1">
                        <p className="truncate text-sm font-bold text-foreground">{student.name}</p>
                        <p className="truncate text-[11px] font-medium text-muted-foreground">{student.email}</p>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {student.courses.map((c, i) => (
                            <Badge
                              key={i}
                              variant="secondary"
                              className="max-w-full truncate border-none bg-muted px-2 py-0 text-[9px] font-bold text-muted-foreground"
                            >
                              {c.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </button>
                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-border/40 pt-3 text-[11px]">
                      <span className="font-bold text-muted-foreground">
                        Mentor: <span className="text-foreground">{student.mentorName}</span>
                      </span>
                      <span className="hidden min-[400px]:inline text-muted-foreground">·</span>
                      <span className="font-bold text-muted-foreground">
                        Batch: <span className="text-foreground">{student.batchName || "—"}</span>
                      </span>
                      <span className="hidden min-[400px]:inline text-muted-foreground">·</span>
                      <span className="font-bold text-muted-foreground">
                        Joined: <span className="text-foreground">{student.joined}</span>
                      </span>
                      <Badge
                        className={cn(
                          "ml-auto text-[10px] font-black",
                          student.status === "Active"
                            ? "border-none bg-emerald-50 text-emerald-600 shadow-none"
                            : student.status === "Blocked"
                              ? "border-none bg-red-50 text-red-600 shadow-none"
                              : "border-none bg-blue-50 text-blue-600 shadow-none",
                        )}
                      >
                        {student.status === "Blocked" ? "Inactive" : student.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination — mobile (shared controls below card list) */}
            <Card className="border-none shadow-sm rounded-2xl overflow-hidden md:hidden">
              <div className="flex flex-col gap-4 bg-muted/10 px-4 py-4">
                <p className="text-center text-[10px] font-bold text-muted-foreground">
                  Showing{" "}
                  <span className="text-foreground">
                    {filteredStudents.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}-
                    {Math.min(currentPage * pageSize, filteredStudents.length)}
                  </span>{" "}
                  of <span className="text-foreground">{filteredStudents.length}</span> students
                </p>
                <div className="flex justify-center overflow-x-auto pb-1">
                  <div className="inline-flex max-w-full items-center rounded-2xl border border-border/60 bg-background px-1 py-1 shadow-sm">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 shrink-0 rounded-xl"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex max-w-[min(100vw-8rem,20rem)] items-center gap-0.5 overflow-x-auto px-1">
                      {pageItems.map((item, idx) =>
                        item === "ellipsis" ? (
                          <div key={`m-e-${idx}`} className="shrink-0 px-1.5 text-sm font-bold text-muted-foreground">
                            …
                          </div>
                        ) : (
                          <Button
                            key={`m-${item}`}
                            type="button"
                            variant={item === currentPage ? "default" : "ghost"}
                            className={cn(
                              "h-9 min-w-8 shrink-0 rounded-xl px-2 text-xs font-bold",
                              item === currentPage && "bg-primary text-primary-foreground shadow-sm",
                            )}
                            onClick={() => setPage(item)}
                            aria-current={item === currentPage ? "page" : undefined}
                          >
                            {item}
                          </Button>
                        ),
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 shrink-0 rounded-xl"
                      onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                      disabled={currentPage === pageCount}
                      aria-label="Next page"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </section>

        </div>

      </div>
    </DashboardLayout>
  );
};

export default StudentList;
