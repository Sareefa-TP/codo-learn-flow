import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Users,
  BookOpen,
  Briefcase,
  Calendar,
  ClipboardList,
  Award,
  UserCheck,
  AlertCircle,
  ArrowRight,
  MoreVertical,
  Eye,
  Edit,
  PowerOff,
  Search
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

// Static mock data
const summaryCards = [
  {
    title: "Total Students",
    count: "487",
    subtitle: "+12 this month",
    icon: Users,
    colorClass: "text-blue-600 bg-blue-100 dark:bg-blue-900/30",
    path: "/admin/students"
  },
  {
    title: "Learning Phase",
    count: "245",
    subtitle: "Active participants",
    icon: BookOpen,
    colorClass: "text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30",
    path: "/admin/students?phase=learning"
  },
  {
    title: "Internship Phase",
    count: "156",
    subtitle: "Currently engaged",
    icon: Briefcase,
    colorClass: "text-purple-600 bg-purple-100 dark:bg-purple-900/30",
    path: "/admin/students?phase=internship"
  },
  {
    title: "Active Batches",
    count: "12",
    subtitle: "Across all phases",
    icon: Calendar,
    colorClass: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30",
    path: "/admin/batches"
  },
  {
    title: "Pending Grading",
    count: "38",
    subtitle: "Assignments to review",
    icon: ClipboardList,
    colorClass: "text-orange-600 bg-orange-100 dark:bg-orange-900/30",
    path: "/admin/assignments?filter=pending"
  },
  {
    title: "Certificates Pending",
    count: "14",
    subtitle: "Awaiting approval",
    icon: Award,
    colorClass: "text-pink-600 bg-pink-100 dark:bg-pink-900/30",
    path: "/admin/certificates?filter=pending"
  },
  {
    title: "Average Attendance",
    count: "88%",
    subtitle: "Stable trend",
    icon: UserCheck,
    colorClass: "text-teal-600 bg-teal-100 dark:bg-teal-900/30",
    path: "/admin/attendance"
  }
];

const initialBatchPerformance = [
  { id: "B1", name: "Jan 2026 Cohort", tutor: "Arun Krishnan", totalStudents: 120, capacity: 150, learningCount: 120, internshipCount: 0, avgProgress: 35, status: "Active", startDate: "2026-01-15", endDate: "2026-04-15" },
  { id: "B2", name: "Oct 2025 Cohort", tutor: "Anjali Desai", totalStudents: 95, capacity: 100, learningCount: 10, internshipCount: 85, avgProgress: 82, status: "Active", startDate: "2025-10-10", endDate: "2026-01-10" },
  { id: "B3", name: "Jul 2025 Evening", tutor: "Meera Nair", totalStudents: 60, capacity: 60, learningCount: 0, internshipCount: 55, avgProgress: 95, status: "Active", startDate: "2025-07-05", endDate: "2025-10-05" },
  { id: "B4", name: "Feb 2026 Python", tutor: "Rajesh Iyer", totalStudents: 85, capacity: 100, learningCount: 85, internshipCount: 0, avgProgress: 15, status: "Active", startDate: "2026-02-01", endDate: "2026-05-01" },
];

const alerts = [
  {
    id: 1,
    message: "5 Students ready for Internship (100% progress)",
    actionLabel: "Review",
    icon: Award,
    path: "/admin/students?status=ready"
  },
  {
    id: 2,
    message: "2 Internship students without Mentor",
    actionLabel: "Assign",
    icon: Users,
    path: "/admin/interns?filter=unassigned"
  },
  {
    id: 3,
    message: "3 Assignments overdue for grading",
    actionLabel: "Review",
    icon: ClipboardList,
    path: "/admin/assignments?filter=overdue"
  },
  {
    id: 4,
    message: "4 Certificates pending final approval",
    actionLabel: "Approve",
    icon: Award,
    path: "/admin/certificates?filter=pending"
  }
];

const phaseDistribution = [
  { label: "Learning Phase", percentage: 45, color: "bg-blue-500", count: 245 },
  { label: "Internship Phase", percentage: 35, color: "bg-purple-500", count: 185 },
  { label: "Completed/Graduated", percentage: 20, color: "bg-emerald-500", count: 108 },
];

const tutorOptions = [
  "Arun Krishnan",
  "Anjali Desai",
  "Meera Nair",
  "Rajesh Iyer",
  "Priya Sharma"
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [batches, setBatches] = useState(initialBatchPerformance);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBatches = batches.filter(batch =>
    batch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    batch.tutor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    batch.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Modals state
  const [viewBatch, setViewBatch] = useState<typeof initialBatchPerformance[0] | null>(null);
  const [editBatch, setEditBatch] = useState<typeof initialBatchPerformance[0] | null>(null);
  const [closeBatchData, setCloseBatchData] = useState<typeof initialBatchPerformance[0] | null>(null);

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: "",
    tutor: "",
    capacity: "",
    startDate: "",
    endDate: "",
    status: ""
  });

  const handleOpenEdit = (batch: typeof initialBatchPerformance[0]) => {
    setEditForm({
      name: batch.name,
      tutor: batch.tutor,
      capacity: batch.capacity.toString(),
      startDate: batch.startDate,
      endDate: batch.endDate,
      status: batch.status
    });
    setEditBatch(batch);
  };

  const handleSaveEdit = () => {
    if (!editBatch) return;

    setBatches(batches.map(b => b.id === editBatch.id ? {
      ...b,
      name: editForm.name,
      tutor: editForm.tutor,
      capacity: parseInt(editForm.capacity) || b.capacity,
      startDate: editForm.startDate,
      endDate: editForm.endDate,
      status: editForm.status
    } : b));

    toast({
      title: "Batch Updated",
      description: "Batch details have been saved successfully.",
    });

    setEditBatch(null);
  };

  const handleConfirmClose = () => {
    if (!closeBatchData) return;

    setBatches(batches.map(b => b.id === closeBatchData.id ? { ...b, status: "Closed" } : b));

    toast({
      title: "Batch Closed",
      description: `${closeBatchData.name} has been marked as Closed.`,
    });

    setCloseBatchData(null);
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-8 max-w-7xl mx-auto pb-10">

        {/* Header Section */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
            Admin Overview
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitor institutional metrics, batch performance, and pending operational tasks.
          </p>
        </div>

        {/* 1. Summary Cards Section */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {summaryCards.map((stat, idx) => (
              <div
                key={idx}
                onClick={() => navigate(stat.path)}
                className="group rounded-xl border border-border/50 bg-card p-5 shadow-sm transition-all hover:shadow-md hover:border-primary/20 cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                      {stat.title}
                    </p>
                    <h3 className="text-3xl font-bold mt-2 text-foreground">
                      {stat.count}
                    </h3>
                  </div>
                  <div className={`p-2.5 rounded-lg ${stat.colorClass} transition-transform group-hover:scale-110`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
                  {stat.subtitle}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Main Grid Layout for the Rest */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">

          {/* 2. Batch Performance Overview (Left - takes 2 cols on XL) */}
          <section className="xl:col-span-2 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-lg font-semibold tracking-tight">Batch Performance Overview</h2>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by batch name, tutor, or status..."
                    className="pl-9 bg-muted/30"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button onClick={() => navigate("/admin/batches")} variant="ghost" size="sm" className="hidden sm:flex text-primary shrink-0">
                  View All Batches <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>

            <Card className="border-border/50 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead className="pl-6 w-[200px]">Batch Name</TableHead>
                      <TableHead>Tutor</TableHead>
                      <TableHead className="text-center">Total</TableHead>
                      <TableHead className="text-center">Learning</TableHead>
                      <TableHead className="text-center">Internship</TableHead>
                      <TableHead className="w-[15%]">Progress</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="pr-6"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBatches.length > 0 ? (
                      filteredBatches.map((batch) => (
                        <TableRow key={batch.id} className="hover:bg-muted/20">
                          <TableCell className="pl-6 font-medium text-foreground">
                            {batch.name}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {batch.tutor}
                          </TableCell>
                          <TableCell className="text-center font-semibold">
                            {batch.totalStudents}
                          </TableCell>
                          <TableCell className="text-center text-indigo-600 dark:text-indigo-400">
                            {batch.learningCount}
                          </TableCell>
                          <TableCell className="text-center text-purple-600 dark:text-purple-400">
                            {batch.internshipCount}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={batch.avgProgress} className="h-2 flex-1" />
                              <span className="text-xs font-medium text-muted-foreground w-6">{batch.avgProgress}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={
                              batch.status === "Active"
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                : "bg-muted text-muted-foreground border-border/50"
                            }>
                              {batch.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="pr-6 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="w-8 h-8 hover:bg-muted">
                                  <MoreVertical className="w-4 h-4 text-muted-foreground" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => setViewBatch(batch)}>
                                  <Eye className="w-4 h-4" /> View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => handleOpenEdit(batch)}>
                                  <Edit className="w-4 h-4" /> Edit Batch
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="cursor-pointer gap-2 text-destructive focus:text-destructive focus:bg-destructive/10"
                                  onClick={() => setCloseBatchData(batch)}
                                  disabled={batch.status === "Closed"}
                                >
                                  <PowerOff className="w-4 h-4" /> Close Batch
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                          No batches found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </section>

          {/* Right Column: Alerts & Phase Distribution */}
          <div className="space-y-6 lg:space-y-8">

            {/* 3. Action Required Panel */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold tracking-tight flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-warning" />
                Action Required
              </h2>

              <Card className="border-warning/30 shadow-sm bg-warning/5 dark:bg-warning/10 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-1 h-full bg-warning"></div>
                <CardContent className="p-0">
                  <div className="divide-y divide-border/50">
                    {alerts.map((alert) => (
                      <div key={alert.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 hover:bg-muted/30 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-full bg-background border border-border mt-0.5 shadow-sm">
                            <alert.icon className="w-4 h-4 text-warning" />
                          </div>
                          <p className="text-sm font-medium text-foreground mt-1.5 leading-snug">
                            {alert.message}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="shrink-0 w-full sm:w-auto h-8 bg-background border border-border hover:bg-muted font-medium"
                          onClick={() => navigate(alert.path)}
                        >
                          {alert.actionLabel}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* 4. Phase Distribution Overview */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold tracking-tight">Phase Distribution</h2>

              <Card className="border-border/50 shadow-sm">
                <CardContent className="p-5 space-y-6">

                  {/* Combined Visual Bar */}
                  <div className="w-full h-3 rounded-full overflow-hidden flex bg-muted">
                    {phaseDistribution.map((phase, idx) => (
                      <div
                        key={idx}
                        style={{ width: `${phase.percentage}%` }}
                        className={phase.color}
                        title={`${phase.label} (${phase.percentage}%)`}
                      />
                    ))}
                  </div>

                  {/* Legends */}
                  <div className="space-y-4">
                    {phaseDistribution.map((phase, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${phase.color}`} />
                          <span className="text-sm font-medium text-foreground">{phase.label}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-muted-foreground">{phase.count} students</span>
                          <span className="text-sm font-bold text-foreground w-10 text-right">{phase.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>

                </CardContent>
              </Card>
            </section>

          </div>
        </div>
      </div>

      {/* View Details Modal */}
      <Dialog open={!!viewBatch} onOpenChange={(open) => !open && setViewBatch(null)}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Batch Details</DialogTitle>
          </DialogHeader>
          {viewBatch && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Batch Name</p>
                  <p className="font-semibold text-foreground">{viewBatch.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Tutor</p>
                  <p className="font-semibold text-foreground">{viewBatch.tutor}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Total Students</p>
                  <p className="font-semibold text-foreground">{viewBatch.totalStudents} / {viewBatch.capacity}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Status</p>
                  <Badge variant="outline" className={viewBatch.status === "Active" ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"}>
                    {viewBatch.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Learning Phase</p>
                  <p className="font-semibold text-indigo-600 dark:text-indigo-400">{viewBatch.learningCount} students</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Internship Phase</p>
                  <p className="font-semibold text-purple-600 dark:text-purple-400">{viewBatch.internshipCount} students</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Start Date</p>
                  <p className="font-semibold text-foreground">{viewBatch.startDate}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">End Date</p>
                  <p className="font-semibold text-foreground">{viewBatch.endDate}</p>
                </div>
              </div>
              <div>
                <p className="text-muted-foreground mb-2 text-sm">Average Progress</p>
                <div className="flex items-center gap-3">
                  <Progress value={viewBatch.avgProgress} className="h-2 flex-1" />
                  <span className="text-sm font-semibold">{viewBatch.avgProgress}%</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Batch Modal */}
      <Dialog open={!!editBatch} onOpenChange={(open) => !open && setEditBatch(null)}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Edit Batch</DialogTitle>
            <DialogDescription>Modify the batch details. Changes appear immediately.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Batch Name</Label>
              <Input id="name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="tutor">Tutor</Label>
                <Select value={editForm.tutor} onValueChange={(val) => setEditForm({ ...editForm, tutor: val })}>
                  <SelectTrigger id="tutor">
                    <SelectValue placeholder="Select Tutor" />
                  </SelectTrigger>
                  <SelectContent>
                    {tutorOptions.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input id="capacity" type="number" value={editForm.capacity} onChange={(e) => setEditForm({ ...editForm, capacity: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" type="date" value={editForm.startDate} onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input id="endDate" type="date" value={editForm.endDate} onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })} />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={editForm.status} onValueChange={(val) => setEditForm({ ...editForm, status: val })}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditBatch(null)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Close Confirm Modal */}
      <Dialog open={!!closeBatchData} onOpenChange={(open) => !open && setCloseBatchData(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-destructive">Close Batch</DialogTitle>
            <DialogDescription>
              Are you sure you want to close this batch? This will mark the batch status as "Closed".
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setCloseBatchData(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleConfirmClose}>Close Batch</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </DashboardLayout>
  );
};

export default AdminDashboard;
