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
  UserX,
  UserPlus,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { mockMentors } from "@/data/mockMentors";
import { cn } from "@/lib/utils";

type MentorRow = (typeof mockMentors)[number];

function mentorInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function mentorSearchHaystack(m: MentorRow): string {
  const courseText = m.assignedCourses
    .map((c) => `${c.name} ${c.batches.join(" ")}`)
    .join(" ");
  return [m.name, m.email, m.phone, m.joinedDate, courseText].join(" ").toLowerCase();
}

function primaryBatchLabel(m: MentorRow): string {
  const all = m.assignedCourses.flatMap((c) => c.batches);
  if (all.length === 0) return "—";
  const unique = [...new Set(all)];
  return unique.slice(0, 2).join(", ") + (unique.length > 2 ? "…" : "");
}

function isNewMentor(m: MentorRow): boolean {
  return m.joinedDate.includes("2025");
}

const AdminMentors = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive" | "new">("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const mentors = mockMentors;

  useEffect(() => {
    setPage(1);
  }, [searchTerm, statusFilter]);

  const filteredMentors = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return mentors.filter((m) => {
      const matchesSearch = !q || mentorSearchHaystack(m).includes(q);
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && m.status === "Active") ||
        (statusFilter === "inactive" && m.status === "Inactive") ||
        (statusFilter === "new" && isNewMentor(m));
      return matchesSearch && matchesStatus;
    });
  }, [mentors, searchTerm, statusFilter]);

  const summaryCards = useMemo(() => {
    const total = mentors.length;
    const active = mentors.filter((m) => m.status === "Active").length;
    const inactive = mentors.filter((m) => m.status === "Inactive").length;
    const newCount = mentors.filter(isNewMentor).length;
    return [
      { label: "Total Mentors", value: total.toLocaleString(), icon: Users, color: "text-blue-600", bg: "bg-blue-50", filter: "all" as const },
      { label: "Active Mentors", value: active.toLocaleString(), icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", filter: "active" as const },
      { label: "Inactive Mentors", value: inactive.toLocaleString(), icon: UserX, color: "text-red-600", bg: "bg-red-50", filter: "inactive" as const },
      { label: "New Mentors", value: newCount.toLocaleString(), icon: UserPlus, color: "text-amber-600", bg: "bg-amber-50", filter: "new" as const },
    ];
  }, [mentors]);

  const pageCount = Math.max(1, Math.ceil(filteredMentors.length / pageSize));
  const currentPage = Math.min(Math.max(1, page), pageCount);

  useEffect(() => {
    if (page !== currentPage) setPage(currentPage);
  }, [page, currentPage]);

  const pagedMentors = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredMentors.slice(start, start + pageSize);
  }, [currentPage, filteredMentors]);

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
    if (cur === last - 2) {
      items.push(1, "ellipsis", last - 3, last - 2, last - 1, last);
      return items;
    }
    items.push(1, "ellipsis", cur - 1, cur, cur + 1, "ellipsis", last);
    return items;
  }, [currentPage, pageCount]);

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-5 sm:space-y-6 max-w-[1600px] mx-auto pb-6 sm:pb-10 px-0 sm:px-2 md:px-4 lg:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-1">
            <h1 className="text-xl font-bold text-foreground tracking-tight sm:text-2xl">Mentor Management</h1>
            <p className="text-xs text-muted-foreground font-medium leading-relaxed sm:text-sm">
              Oversee mentors, assignments, and course coverage.
            </p>
          </div>
          <Button
            onClick={() => navigate("/admin/mentors/add")}
            className="h-11 w-full shrink-0 rounded-xl shadow-sm hover:shadow-md transition-all gap-2 px-6 sm:h-10 sm:w-auto"
          >
            <Plus className="w-4 h-4" /> Add Mentor
          </Button>
        </div>

        <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {summaryCards.map((stat, idx) => (
            <Card
              key={idx}
              onClick={() => setStatusFilter(stat.filter)}
              className={cn(
                "border-none shadow-sm rounded-2xl cursor-pointer hover:shadow-md transition-all group overflow-hidden relative min-w-0",
                statusFilter === stat.filter && "ring-2 ring-primary/20 bg-primary/[0.02]",
              )}
            >
              <CardContent className="p-3.5 sm:p-5 flex items-center justify-between gap-2 relative z-10">
                <div className="min-w-0 space-y-0.5 sm:space-y-1">
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-wider sm:text-[11px] sm:tracking-widest leading-tight line-clamp-2">
                    {stat.label}
                  </p>
                  <h3 className="text-lg font-black text-foreground tabular-nums sm:text-2xl">{stat.value}</h3>
                </div>
                <div
                  className={cn(
                    "p-2 rounded-lg sm:p-2.5 sm:rounded-xl shrink-0 group-hover:scale-110 transition-transform duration-300",
                    stat.bg,
                    stat.color,
                  )}
                >
                  <stat.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="space-y-6">
          <Card className="border-none shadow-sm rounded-2xl p-3 sm:p-4 flex flex-col gap-3 sm:gap-4 md:flex-row md:items-stretch">
            <div className="relative flex-1 w-full min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search name, email, phone, courses, batches, joined date..."
                className="pl-10 bg-muted/20 border-none rounded-xl h-11 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex w-full shrink-0 md:w-auto md:max-w-[200px]">
              <Select
                value={statusFilter}
                onValueChange={(v) => setStatusFilter(v as "all" | "active" | "inactive" | "new")}
              >
                <SelectTrigger className="w-full md:w-[160px] bg-muted/20 border-none rounded-xl h-11 font-bold text-xs">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-none shadow-xl">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="new">New (2025)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          <Card className="border-none shadow-sm rounded-2xl overflow-hidden hidden md:block">
            <div className="overflow-x-auto overscroll-x-contain -mx-px">
              <Table className="min-w-[720px]">
                <TableHeader className="bg-muted/30">
                  <TableRow className="hover:bg-transparent border-b border-border/50">
                    <TableHead className="px-4 lg:px-6 py-4 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                      Mentor
                    </TableHead>
                    <TableHead className="py-4 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                      Courses
                    </TableHead>
                    <TableHead className="py-4 text-[11px] font-black uppercase tracking-widest text-muted-foreground hidden lg:table-cell">
                      Batch
                    </TableHead>
                    <TableHead className="py-4 text-[11px] font-black uppercase tracking-widest text-muted-foreground text-center">
                      Status
                    </TableHead>
                    <TableHead className="py-4 text-[11px] font-black uppercase tracking-widest text-muted-foreground hidden xl:table-cell">
                      Joined
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagedMentors.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-40 text-center">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Users className="h-8 w-8 text-muted-foreground/30" />
                          <p className="font-medium text-muted-foreground">No mentors match your search or filters</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : null}
                  {pagedMentors.map((mentor) => (
                    <TableRow
                      key={mentor.id}
                      tabIndex={0}
                      aria-label={`Open profile for ${mentor.name}`}
                      className="cursor-pointer border-b border-border/50 transition-colors hover:bg-muted/30 focus-visible:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 last:border-0"
                      onClick={() => navigate(`/admin/mentors/${mentor.id}`)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          navigate(`/admin/mentors/${mentor.id}`);
                        }
                      }}
                    >
                      <TableCell className="px-4 lg:px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                            {mentorInitials(mentor.name)}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-foreground">{mentor.name}</p>
                            <p className="truncate text-[10px] font-medium text-muted-foreground">{mentor.email}</p>
                            <p className="text-[9px] font-black uppercase tracking-tight text-muted-foreground/80">
                              ID: {mentor.id}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[220px] py-4">
                        <div className="flex flex-wrap gap-1">
                          {mentor.assignedCourses.length === 0 ? (
                            <span className="text-xs font-medium text-muted-foreground">—</span>
                          ) : (
                            mentor.assignedCourses.map((c) => (
                              <Badge
                                key={c.id}
                                variant="secondary"
                                className="h-4 max-w-full truncate border-none bg-muted px-1.5 text-[9px] font-bold text-muted-foreground"
                              >
                                {c.name}
                              </Badge>
                            ))
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden py-4 text-xs font-bold text-muted-foreground lg:table-cell">
                        {primaryBatchLabel(mentor)}
                      </TableCell>
                      <TableCell className="py-4 text-center">
                        <Badge
                          className={cn(
                            "h-5 rounded-full border-none px-2.5 text-[10px] font-black shadow-none",
                            mentor.status === "Active"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-muted text-muted-foreground",
                          )}
                        >
                          {mentor.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden py-4 text-[11px] font-bold text-muted-foreground whitespace-nowrap xl:table-cell">
                        {mentor.joinedDate}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex flex-col gap-4 border-t border-border/50 bg-muted/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p className="text-center text-[10px] font-bold text-muted-foreground sm:text-left sm:text-[11px]">
                Showing{" "}
                <span className="text-foreground">
                  {filteredMentors.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}-
                  {Math.min(currentPage * pageSize, filteredMentors.length)}
                </span>{" "}
                of <span className="text-foreground">{filteredMentors.length}</span> mentors
              </p>
              <div className="flex min-w-0 justify-center sm:justify-end">
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

          <div className="space-y-3 md:hidden">
            {filteredMentors.length === 0 ? (
              <Card className="border-none shadow-sm rounded-2xl">
                <CardContent className="flex flex-col items-center justify-center gap-2 py-12">
                  <Users className="h-8 w-8 text-muted-foreground/30" />
                  <p className="text-sm font-medium text-muted-foreground">No mentors match your search or filters</p>
                </CardContent>
              </Card>
            ) : null}
            {pagedMentors.map((mentor) => (
              <Card
                key={mentor.id}
                className="border-none shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <button
                    type="button"
                    className="flex w-full gap-3 rounded-xl text-left outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary/30"
                    onClick={() => navigate(`/admin/mentors/${mentor.id}`)}
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {mentorInitials(mentor.name)}
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <p className="truncate text-sm font-bold text-foreground">{mentor.name}</p>
                      <p className="truncate text-[11px] font-medium text-muted-foreground">{mentor.email}</p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {mentor.assignedCourses.length === 0 ? (
                          <span className="text-[10px] text-muted-foreground">No courses</span>
                        ) : (
                          mentor.assignedCourses.map((c) => (
                            <Badge
                              key={c.id}
                              variant="secondary"
                              className="max-w-full truncate border-none bg-muted px-2 py-0 text-[9px] font-bold text-muted-foreground"
                            >
                              {c.name}
                            </Badge>
                          ))
                        )}
                      </div>
                    </div>
                  </button>
                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-border/40 pt-3 text-[11px]">
                    <span className="font-bold text-muted-foreground">
                      Batch: <span className="text-foreground">{primaryBatchLabel(mentor)}</span>
                    </span>
                    <span className="hidden min-[400px]:inline text-muted-foreground">·</span>
                    <span className="font-bold text-muted-foreground">
                      Joined: <span className="text-foreground">{mentor.joinedDate}</span>
                    </span>
                    <Badge
                      className={cn(
                        "ml-auto text-[10px] font-black",
                        mentor.status === "Active"
                          ? "border-none bg-emerald-50 text-emerald-600 shadow-none"
                          : "border-none bg-muted text-muted-foreground shadow-none",
                      )}
                    >
                      {mentor.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-none shadow-sm rounded-2xl overflow-hidden md:hidden">
            <div className="flex flex-col gap-4 bg-muted/10 px-4 py-4">
              <p className="text-center text-[10px] font-bold text-muted-foreground">
                Showing{" "}
                <span className="text-foreground">
                  {filteredMentors.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}-
                  {Math.min(currentPage * pageSize, filteredMentors.length)}
                </span>{" "}
                of <span className="text-foreground">{filteredMentors.length}</span> mentors
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
    </DashboardLayout>
  );
};

export default AdminMentors;
