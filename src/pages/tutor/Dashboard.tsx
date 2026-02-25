import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Users,
  BookOpen,
  ClipboardList,
  TrendingUp,
  CheckCircle2,
  Video,
  Plus,
  Link2,
  Calendar as CalendarIcon,
  Clock,
  Pencil,
  X
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

// Demo Data
const recentActivity = [
  { id: 1, name: "Aarav Sharma", batch: "Jan 2026 Batch", progress: 85, status: "Excellent" },
  { id: 2, name: "Diya Patel", batch: "Oct 2025 Batch", progress: 62, status: "Good" },
  { id: 3, name: "Kabir Singh", batch: "Jan 2026 Batch", progress: 40, status: "Needs Attention" },
  { id: 4, name: "Ananya Iyer", batch: "Oct 2025 Batch", progress: 95, status: "Excellent" },
];

const availableBatches = [
  "Jan 2026 Batch",
  "Oct 2025 Batch",
  "Feb 2026 Batch - Evening"
];

const initialLiveClasses = [
  { id: "LC-1", batch: "Jan 2026 Batch", topic: "Advanced React Hooks", date: "26 Feb 2026", time: "10:00 AM", link: "https://meet.google.com/abc-defg-hij", status: "Upcoming" },
  { id: "LC-2", batch: "Oct 2025 Batch", topic: "Redux State Management", date: "25 Feb 2026", time: "02:00 PM", link: "https://meet.google.com/xyz-abcd-efg", status: "Completed" }
];

const TutorDashboard = () => {
  const { toast } = useToast();
  const [liveClasses, setLiveClasses] = useState(initialLiveClasses);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    batch: "",
    topic: "",
    date: "",
    time: "",
    link: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, batch: value }));
  };

  const handleScheduleClass = () => {
    if (!formData.batch || !formData.topic || !formData.date || !formData.time || !formData.link) {
      toast({
        title: "Missing Fields",
        description: "Please fill out all fields including the Google Meet link.",
        variant: "destructive",
      });
      return;
    }

    const formattedDate = new Date(formData.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    // Format time (attempt logic from time value normally HH:mm)
    let formattedTime = formData.time;
    try {
      if (formData.time.includes(":")) {
        const [hour, minute] = formData.time.split(":");
        const h = parseInt(hour, 10);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const h12 = h % 12 || 12;
        formattedTime = `${h12.toString().padStart(2, '0')}:${minute} ${ampm}`;
      }
    } catch (e) {
      // Ignore format
    }

    const newClass = {
      id: `LC-${Math.floor(Math.random() * 1000).toString()}`,
      batch: formData.batch,
      topic: formData.topic,
      date: formattedDate !== "Invalid Date" ? formattedDate : formData.date,
      time: formattedTime,
      link: formData.link,
      status: "Upcoming"
    };

    setLiveClasses([newClass, ...liveClasses]);

    setFormData({ batch: "", topic: "", date: "", time: "", link: "" });
    setIsModalOpen(false);

    toast({
      title: "Class Scheduled",
      description: "The live session has been successfully added to the schedule.",
    });
  };

  const cancelClass = (id: string) => {
    setLiveClasses(liveClasses.filter(lc => lc.id !== id));
    toast({
      title: "Session Canceled",
      description: "The live class has been removed.",
    });
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6 lg:space-y-8 max-w-6xl mx-auto pb-10">

        {/* Welcome Section */}
        <div className="bg-primary/5 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-primary/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          <div className="relative z-10">
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
              Welcome, John 👋
            </h1>
            <Badge variant="outline" className="mt-3 bg-primary/10 text-primary border-primary/20 text-sm px-3 py-1">
              Role: Learning Phase Tutor
            </Badge>
          </div>

          <div className="relative z-10 flex gap-4 md:gap-8 bg-background/50 backdrop-blur-sm p-4 rounded-xl border border-border/50 shadow-sm">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">Assigned Batches</p>
              <h3 className="text-2xl font-bold text-foreground mt-1">2</h3>
            </div>
            <div className="w-px bg-border/50 hidden sm:block"></div>
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">Total Students</p>
              <h3 className="text-2xl font-bold text-foreground mt-1">48</h3>
            </div>
          </div>
        </div>

        {/* Live Class Management Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Video className="w-5 h-5 text-primary" />
              Live Class Management
            </h2>
            <Button onClick={() => setIsModalOpen(true)} className="gap-2 shadow-sm">
              <Plus className="w-4 h-4" />
              Schedule Google Meet
            </Button>
          </div>

          <Card className="border-border/50 shadow-sm">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead className="pl-6">Batch</TableHead>
                      <TableHead>Topic</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Meet Link</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="pr-6 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {liveClasses.length > 0 ? (
                      liveClasses.map((lc) => (
                        <TableRow key={lc.id} className="hover:bg-muted/20 transition-colors">
                          <TableCell className="pl-6">
                            <Badge variant="secondary" className="font-normal text-muted-foreground">
                              {lc.batch}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium text-foreground">
                            {lc.topic}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <span className="text-sm flex items-center gap-1.5 text-muted-foreground">
                                <CalendarIcon className="w-3.5 h-3.5" />
                                {lc.date}
                              </span>
                              <span className="text-sm flex items-center gap-1.5 text-muted-foreground">
                                <Clock className="w-3.5 h-3.5" />
                                {lc.time}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {lc.link ? (
                              <a href={lc.link} target="_blank" rel="noopener noreferrer">
                                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-4 font-medium transition-colors shadow-sm">
                                  Join
                                </Button>
                              </a>
                            ) : (
                              <Button size="sm" disabled className="rounded-full px-4 font-medium opacity-50 cursor-not-allowed text-muted-foreground bg-muted">
                                Join
                              </Button>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={
                              lc.status === "Upcoming"
                                ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                                : "bg-muted text-muted-foreground"
                            }>
                              {lc.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="pr-6 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                              onClick={() => cancelClass(lc.id)}
                            >
                              Cancel
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No upcoming live classes scheduled.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Schedule Class Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Schedule Live Class</DialogTitle>
              <DialogDescription>
                Set up a new Google Meet session for a Learning Phase batch.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label className="text-sm font-medium">Batch Selection <span className="text-destructive">*</span></Label>
                <Select
                  value={formData.batch}
                  onValueChange={handleSelectChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select batch" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableBatches.map(b => (
                      <SelectItem key={b} value={b}>{b}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="topic" className="text-sm font-medium">Class Topic <span className="text-destructive">*</span></Label>
                <Input
                  id="topic"
                  name="topic"
                  placeholder="e.g. Intro to Node.js"
                  value={formData.topic}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="date" className="text-sm font-medium">Date <span className="text-destructive">*</span></Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="time" className="text-sm font-medium">Time <span className="text-destructive">*</span></Label>
                  <Input
                    id="time"
                    name="time"
                    type="time"
                    value={formData.time}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="link" className="text-sm font-medium">Google Meet Link <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="link"
                    name="link"
                    type="url"
                    placeholder="https://meet.google.com/..."
                    className="pl-9"
                    value={formData.link}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleScheduleClass} className="gap-2">
                <Video className="w-4 h-4" />
                Schedule Class
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>


        {/* Overview Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-border/50 shadow-sm hover:border-primary/30 transition-colors">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Assigned Batches</p>
                <h3 className="text-2xl font-bold text-foreground mt-1">2</h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm hover:border-primary/30 transition-colors">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <h3 className="text-2xl font-bold text-foreground mt-1">48</h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm hover:border-primary/30 transition-colors">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Assignments</p>
                <h3 className="text-2xl font-bold text-foreground mt-1">12</h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm hover:border-primary/30 transition-colors">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Submissions</p>
                <h3 className="text-2xl font-bold text-foreground mt-1">89%</h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Student Activity Table Card */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              Recent Student Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="pl-6 w-[250px]">Student Name</TableHead>
                    <TableHead>Batch</TableHead>
                    <TableHead className="w-[30%]">Progress</TableHead>
                    <TableHead className="pr-6">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentActivity.map((student) => (
                    <TableRow key={student.id} className="hover:bg-muted/20 transition-colors">
                      <TableCell className="pl-6 font-medium text-foreground">
                        {student.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{student.batch}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Progress value={student.progress} className="h-2 flex-1 max-w-[150px]" />
                          <span className="text-sm font-medium text-muted-foreground w-12">{student.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="pr-6">
                        {student.status === "Excellent" && (
                          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Excellent</Badge>
                        )}
                        {student.status === "Good" && (
                          <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">Good</Badge>
                        )}
                        {student.status === "Needs Attention" && (
                          <Badge variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-500/20">Needs Attention</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  );
};

export default TutorDashboard;
