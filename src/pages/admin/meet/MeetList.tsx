import { useState, useMemo, useEffect } from "react";
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
  Plus,
  Search,
  Video,
  Calendar,
  Users,
  TrendingUp,
  UserX,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
    link: "https://meet.google.com/abc-defg-hij",
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
    link: "https://meet.google.com/klm-nopq-rst",
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
    link: "https://meet.google.com/uvw-xyz-123",
  },
];

type MeetRow = (typeof mockMeets)[number];

type MeetStatusFilter = "all" | "Upcoming" | "Live" | "Completed" | "Cancelled";

function meetSearchHaystack(m: MeetRow): string {
  return [
    m.title,
    m.id,
    m.course,
    m.batch,
    m.host,
    m.hostRole,
    m.dateTime,
    m.duration,
  ]
    .join(" ")
    .toLowerCase();
}

function sessionInitials(title: string) {
  const parts = title
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return "M";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function timelineParts(dateTime: string) {
  const [datePart, ...rest] = dateTime.split(",");
  return { dateLine: datePart?.trim() ?? dateTime, timeLine: rest.join(",").trim() };
}

function meetStatusBadgeClasses(status: string) {
  switch (status) {
    case "Upcoming":
      return "bg-amber-50 text-amber-700";
    case "Live":
      return "bg-red-50 text-red-600 animate-pulse";
    case "Completed":
      return "bg-emerald-50 text-emerald-600";
    case "Cancelled":
      return "bg-muted text-muted-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function meetStatusLabel(status: string) {
  if (status === "Live") return "Live Now";
  return status;
}

const AdminMeetList = () => {
  const navigate = useNavigate();
  const [meets] = useState(mockMeets);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<MeetStatusFilter>("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filteredMeets = useMemo(() => {
    const q = search.trim().toLowerCase();
    return meets.filter((meet) => {
      const matchesSearch = !q || meetSearchHaystack(meet).includes(q);
      const matchesStatus = statusFilter === "all" || meet.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [meets, search, statusFilter]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const summaryCards = useMemo(() => {
    const total = meets.length;
    const upcoming = meets.filter((m) => m.status === "Upcoming").length;
    const completed = meets.filter((m) => m.status === "Completed").length;
    const cancelled = meets.filter((m) => m.status === "Cancelled").length;
    return [
      {
        label: "Total Meets",
        value: total.toLocaleString(),
        icon: Users,
        color: "text-blue-600",
        bg: "bg-blue-50",
        filter: "all" as const,
      },
      {
        label: "Upcoming",
        value: upcoming.toLocaleString(),
        icon: Calendar,
        color: "text-amber-600",
        bg: "bg-amber-50",
        filter: "Upcoming" as const,
      },
      {
        label: "Completed",
        value: completed.toLocaleString(),
        icon: TrendingUp,
        color: "text-indigo-600",
        bg: "bg-indigo-50",
        filter: "Completed" as const,
      },
      {
        label: "Cancelled",
        value: cancelled.toLocaleString(),
        icon: UserX,
        color: "text-red-600",
        bg: "bg-red-50",
        filter: "Cancelled" as const,
      },
    ];
  }, [meets]);

  const pageCount = Math.max(1, Math.ceil(filteredMeets.length / pageSize));
  const currentPage = Math.min(Math.max(1, page), pageCount);

  useEffect(() => {
    if (page !== currentPage) setPage(currentPage);
  }, [page, currentPage]);

  const pagedMeets = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredMeets.slice(start, start + pageSize);
  }, [currentPage, filteredMeets]);

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
            <h1 className="text-xl font-bold text-foreground tracking-tight sm:text-2xl">Meet Administration</h1>
            <p className="text-xs text-muted-foreground font-medium leading-relaxed sm:text-sm">
              Complete oversight of all live learning sessions.
            </p>
          </div>
          <Button
            onClick={() => navigate("/admin/meet/schedule")}
            className="h-11 w-full shrink-0 rounded-xl shadow-sm hover:shadow-md transition-all gap-2 px-6 sm:h-10 sm:w-auto"
          >
            <Plus className="w-4 h-4" /> Schedule New Meet
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

        <div className="grid grid-cols-1 gap-6">
          <section className="space-y-6">
            <Card className="border-none shadow-sm rounded-2xl p-3 sm:p-4 flex flex-col gap-3 sm:gap-4 md:flex-row md:items-stretch">
              <div className="relative flex-1 w-full min-w-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Search title, ID, course, batch, host, role, date, time..."
                  className="pl-10 bg-muted/20 border-none rounded-xl h-11 text-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex w-full shrink-0 md:w-auto md:max-w-[200px]">
                <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as MeetStatusFilter)}>
                  <SelectTrigger className="w-full md:w-[160px] bg-muted/20 border-none rounded-xl h-11 font-bold text-xs">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-none shadow-xl">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Upcoming">Upcoming</SelectItem>
                    <SelectItem value="Live">Live Now</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Card>

            <Card className="border-none shadow-sm rounded-2xl overflow-hidden hidden md:block">
              <div className="overflow-x-auto overscroll-x-contain -mx-px">
                <Table className="min-w-[880px]">
                  <TableHeader className="bg-muted/30">
                    <TableRow className="hover:bg-transparent border-b border-border/50">
                      <TableHead className="px-4 lg:px-6 py-4 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                        Session
                      </TableHead>
                      <TableHead className="py-4 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                        Course
                      </TableHead>
                      <TableHead className="py-4 text-[11px] font-black uppercase tracking-widest text-muted-foreground hidden lg:table-cell">
                        Batch
                      </TableHead>
                      <TableHead className="py-4 text-[11px] font-black uppercase tracking-widest text-muted-foreground hidden lg:table-cell">
                        Host
                      </TableHead>
                      <TableHead className="py-4 text-[11px] font-black uppercase tracking-widest text-muted-foreground text-center">
                        Status
                      </TableHead>
                      <TableHead className="py-4 text-[11px] font-black uppercase tracking-widest text-muted-foreground hidden xl:table-cell">
                        Timeline
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pagedMeets.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-40 text-center">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <Video className="h-8 w-8 text-muted-foreground/30" />
                            <p className="font-medium text-muted-foreground">No sessions match your search or filters</p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-xl mt-2"
                              onClick={() => {
                                setSearch("");
                                setStatusFilter("all");
                              }}
                            >
                              Clear search & status
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : null}
                    {pagedMeets.map((meet) => {
                      const { dateLine, timeLine } = timelineParts(meet.dateTime);
                      return (
                        <TableRow
                          key={meet.id}
                          tabIndex={0}
                          aria-label={`Open session ${meet.title}`}
                          className="cursor-pointer border-b border-border/50 transition-colors hover:bg-muted/30 focus-visible:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 last:border-0"
                          onClick={() => navigate(`/admin/meet/${meet.id}`)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              navigate(`/admin/meet/${meet.id}`);
                            }
                          }}
                        >
                          <TableCell className="px-4 lg:px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                {sessionInitials(meet.title)}
                              </div>
                              <div className="min-w-0">
                                <p className="truncate text-sm font-bold text-foreground">{meet.title}</p>
                                <p className="truncate text-[10px] font-medium text-muted-foreground">ID: {meet.id}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-[200px] py-4">
                            <Badge
                              variant="secondary"
                              className="h-4 max-w-full truncate border-none bg-muted px-1.5 text-[9px] font-bold text-muted-foreground"
                            >
                              {meet.course}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden py-4 text-xs font-bold text-muted-foreground lg:table-cell">
                            {meet.batch || "—"}
                          </TableCell>
                          <TableCell className="hidden py-4 lg:table-cell">
                            <p className="max-w-[160px] truncate text-xs font-bold text-foreground" title={meet.host}>
                              {meet.host}
                            </p>
                            <p className="text-[10px] font-medium text-muted-foreground">{meet.hostRole}</p>
                          </TableCell>
                          <TableCell className="py-4 text-center">
                            <Badge
                              className={cn(
                                "h-5 rounded-full border-none px-2.5 text-[10px] font-black shadow-none",
                                meetStatusBadgeClasses(meet.status),
                              )}
                            >
                              {meetStatusLabel(meet.status)}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden py-4 text-[11px] font-bold text-muted-foreground whitespace-nowrap xl:table-cell">
                            <div className="flex flex-col gap-0.5">
                              <span>{dateLine}</span>
                              {timeLine ? <span className="text-[10px] font-medium">{timeLine}</span> : null}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              <div className="flex flex-col gap-4 border-t border-border/50 bg-muted/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <p className="text-center text-[10px] font-bold text-muted-foreground sm:text-left sm:text-[11px]">
                  Showing{" "}
                  <span className="text-foreground">
                    {filteredMeets.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}-
                    {Math.min(currentPage * pageSize, filteredMeets.length)}
                  </span>{" "}
                  of <span className="text-foreground">{filteredMeets.length}</span> sessions
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
              {filteredMeets.length === 0 ? (
                <Card className="border-none shadow-sm rounded-2xl">
                  <CardContent className="flex flex-col items-center justify-center gap-2 py-12">
                    <Video className="h-8 w-8 text-muted-foreground/30" />
                    <p className="text-sm font-medium text-muted-foreground">No sessions match your search or filters</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl"
                      onClick={() => {
                        setSearch("");
                        setStatusFilter("all");
                      }}
                    >
                      Clear search & status
                    </Button>
                  </CardContent>
                </Card>
              ) : null}
              {pagedMeets.map((meet) => {
                const { dateLine, timeLine } = timelineParts(meet.dateTime);
                return (
                  <Card
                    key={meet.id}
                    className="border-none shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      <button
                        type="button"
                        className="flex w-full gap-3 rounded-xl text-left outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary/30"
                        onClick={() => navigate(`/admin/meet/${meet.id}`)}
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {sessionInitials(meet.title)}
                        </div>
                        <div className="min-w-0 flex-1 space-y-1">
                          <p className="truncate text-sm font-bold text-foreground">{meet.title}</p>
                          <p className="truncate text-[11px] font-medium text-muted-foreground">ID: {meet.id}</p>
                          <div className="flex flex-wrap gap-1 pt-1">
                            <Badge
                              variant="secondary"
                              className="max-w-full truncate border-none bg-muted px-2 py-0 text-[9px] font-bold text-muted-foreground"
                            >
                              {meet.course}
                            </Badge>
                          </div>
                        </div>
                      </button>
                      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-border/40 pt-3 text-[11px]">
                        <span className="font-bold text-muted-foreground">
                          Host: <span className="text-foreground">{meet.host}</span>
                        </span>
                        <span className="hidden min-[400px]:inline text-muted-foreground">·</span>
                        <span className="font-bold text-muted-foreground">
                          Batch: <span className="text-foreground">{meet.batch || "—"}</span>
                        </span>
                        <span className="hidden min-[400px]:inline text-muted-foreground">·</span>
                        <span className="font-bold text-muted-foreground">
                          {dateLine}
                          {timeLine ? ` · ${timeLine}` : ""}
                        </span>
                        <Badge
                          className={cn(
                            "ml-auto text-[10px] font-black",
                            meetStatusBadgeClasses(meet.status),
                            "border-none shadow-none rounded-full px-2.5",
                          )}
                        >
                          {meetStatusLabel(meet.status)}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card className="border-none shadow-sm rounded-2xl overflow-hidden md:hidden">
              <div className="flex flex-col gap-4 bg-muted/10 px-4 py-4">
                <p className="text-center text-[10px] font-bold text-muted-foreground">
                  Showing{" "}
                  <span className="text-foreground">
                    {filteredMeets.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}-
                    {Math.min(currentPage * pageSize, filteredMeets.length)}
                  </span>{" "}
                  of <span className="text-foreground">{filteredMeets.length}</span> sessions
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

export default AdminMeetList;
