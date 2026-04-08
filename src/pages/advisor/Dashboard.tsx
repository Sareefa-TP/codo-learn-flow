import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LifeBuoy, Plus, Ticket, Users } from "lucide-react";

type TicketStatus = "Open" | "Closed";

type MockTicket = {
  id: string;
  status: TicketStatus;
};

const mockStudents = [
  { name: "John Doe", email: "john@example.com", date: "2026-04-07" },
  { name: "Emily Chen", email: "emily.chen@example.com", date: "2026-04-07" },
  { name: "Marcus Johnson", email: "marcus.j@example.com", date: "2026-04-06" },
  { name: "Priya Sharma", email: "priya.s@example.com", date: "2026-04-05" },
  { name: "Liam O'Brien", email: "liam.obrien@example.com", date: "2026-04-04" },
  { name: "Aisha Khan", email: "aisha.k@example.com", date: "2026-04-03" },
  { name: "Noah Williams", email: "noah.w@example.com", date: "2026-04-02" },
];

const mockTickets: MockTicket[] = [
  { id: "TIC-201", status: "Open" },
  { id: "TIC-202", status: "Open" },
  { id: "TIC-203", status: "Closed" },
  { id: "TIC-204", status: "Open" },
  { id: "TIC-205", status: "Closed" },
  { id: "TIC-206", status: "Closed" },
];

function formatJoinedDate(input: string) {
  if (/\d{2}\s[A-Za-z]{3}\s\d{4}/.test(input)) return input;
  const d = new Date(`${input}T00:00:00`);
  if (Number.isNaN(d.getTime())) return input;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function SummaryCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <Card className="border-border/50 shadow-sm rounded-2xl overflow-hidden bg-card/50 backdrop-blur-sm">
      <CardContent className="p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 shadow-inner">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {title}
          </p>
          <p className="text-2xl font-black tracking-tight text-foreground mt-1">
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function RecentStudents({ students }: { students: typeof mockStudents }) {
  const recent = students.slice(0, 5);
  return (
    <div className="mt-8">
      <h2 className="text-base font-bold text-foreground mb-4">Recent Students</h2>
      <Card className="border-border/50 shadow-sm rounded-2xl overflow-hidden bg-background">
        <CardContent className="p-0">
          {recent.length === 0 ? (
            <div className="text-center py-12 px-6 text-muted-foreground">
              <p className="font-semibold text-foreground">No recent students found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border/50">
                    <TableHead className="text-left text-xs font-bold uppercase tracking-wider text-muted-foreground px-4 py-4 h-12">
                      Name
                    </TableHead>
                    <TableHead className="text-left text-xs font-bold uppercase tracking-wider text-muted-foreground px-4 py-4 h-12 min-w-[220px]">
                      Email
                    </TableHead>
                    <TableHead className="text-left text-xs font-bold uppercase tracking-wider text-muted-foreground px-4 py-4 h-12 min-w-[140px]">
                      Joined Date
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recent.map((s) => (
                    <TableRow
                      key={s.email}
                      className="border-b border-border/40 hover:bg-muted/20 transition-colors"
                    >
                      <TableCell className="text-left px-4 py-4 text-sm font-medium text-foreground">
                        {s.name}
                      </TableCell>
                      <TableCell className="text-left px-4 py-4 text-sm text-muted-foreground">
                        {s.email}
                      </TableCell>
                      <TableCell className="text-left px-4 py-4 text-sm text-foreground">
                        {formatJoinedDate(s.date)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

const AdvisorDashboard = () => {
  const navigate = useNavigate();
  const ticketCounts = useMemo(() => {
    const counts: Record<TicketStatus, number> = { Open: 0, Closed: 0 };
    for (const t of mockTickets) counts[t.status] += 1;
    return counts;
  }, []);

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Button
            type="button"
            className="h-11 rounded-xl px-6 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 gap-2 font-bold transition-all hover:scale-[1.02] active:scale-[0.99] text-primary-foreground"
            onClick={() => navigate("/advisor/students?openAdd=1")}
          >
            <Plus className="w-5 h-5" />
            + Add Student
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-xl px-6 gap-2 font-bold border-border/50"
            onClick={() => navigate("/advisor/support-ticket")}
          >
            <LifeBuoy className="w-5 h-5" />
            Support Ticket
          </Button>
        </div>
      </div>

      <Card className="border-border/50 shadow-sm rounded-2xl overflow-hidden bg-card/50 backdrop-blur-sm">
        <CardHeader className="px-6 pt-6 pb-3 border-b border-border/40 bg-muted/20">
          <CardTitle className="text-lg font-bold">Support Ticket Overview</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SummaryCard
              title="Total Students"
              value={mockStudents.length}
              icon={<Users className="w-6 h-6 text-primary" />}
            />
            <SummaryCard
              title="Open Tickets"
              value={ticketCounts.Open}
              icon={<Ticket className="w-6 h-6 text-primary" />}
            />
            <SummaryCard
              title="Closed Tickets"
              value={ticketCounts.Closed}
              icon={<Ticket className="w-6 h-6 text-primary" />}
            />
          </div>
        </CardContent>
      </Card>

      <RecentStudents students={mockStudents} />
    </div>
  );
};

export default AdvisorDashboard;
