import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  { id: "LC-1", batch: "Jan 2026 Batch", topic: "Advanced React Hooks", date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }), time: "10:00 AM", link: "https://meet.google.com/abc-defg-hij", status: "Upcoming" },
  { id: "LC-2", batch: "Oct 2025 Batch", topic: "Redux State Management", date: "25 Feb 2026", time: "02:00 PM", link: "https://meet.google.com/xyz-abcd-efg", status: "Completed" },
  { id: "LC-3", batch: "Feb 2026 Batch", topic: "Node.js Basics", date: new Date(Date.now() + 86400000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }), time: "11:30 AM", link: "https://meet.google.com/qrs-tuvw-xyz", status: "Upcoming" }
];

const TutorDashboard = () => {
  const navigate = useNavigate();
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

  const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const todaysClasses = liveClasses.filter(lc => lc.date === todayStr && lc.status !== "Completed");
  const upcomingClasses = liveClasses.filter(lc => lc.status === "Upcoming");

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
      <div className="animate-fade-in space-y-8 lg:space-y-10 max-w-6xl mx-auto pb-10">

        {/* 1. Welcome Section */}
        <div className="bg-primary/5 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-primary/10 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none opacity-50" />

          <div className="relative z-10 flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
                Welcome, John 👋
              </h1>
              <p className="text-muted-foreground font-medium mt-1">Role: Learning Phase Tutor</p>
            </div>
          </div>

          <div className="relative z-10 flex gap-4 md:gap-12 bg-background/60 backdrop-blur-md p-5 rounded-2xl border border-border/50 shadow-inner">
            <div
              className="text-center px-2 cursor-pointer hover:scale-[1.05] hover:bg-primary/5 transition-all p-2 rounded-xl"
              onClick={() => navigate("/tutor/batches")}
            >
              <p className="text-xs uppercase tracking-wider font-bold text-muted-foreground/80 mb-1">Assigned Batches</p>
              <h3 className="text-3xl font-black text-primary">2</h3>
            </div>
            <div className="w-px bg-border/50 hidden sm:block"></div>
            <div
              className="text-center px-2 cursor-pointer hover:scale-[1.05] hover:bg-primary/5 transition-all p-2 rounded-xl"
              onClick={() => navigate("/tutor/students")}
            >
              <p className="text-xs uppercase tracking-wider font-bold text-muted-foreground/80 mb-1">Total Students</p>
              <h3 className="text-3xl font-black text-foreground">48</h3>
            </div>
          </div>
        </div>

        {/* 2. Today's Schedule */}
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Clock className="w-4 h-4 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Today's Schedule</h2>
          </div>

          <div className="grid gap-4">
            {todaysClasses.length > 0 ? (
              todaysClasses.map((lc) => (
                <Card key={lc.id} className="border-border/50 hover:border-primary/30 transition-all shadow-sm group">
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-primary/10 text-primary w-24 h-24 rounded-2xl flex flex-col items-center justify-center border border-primary/20 shrink-0 group-hover:bg-primary transition-colors group-hover:text-white">
                          <span className="text-sm font-bold uppercase opacity-80 mb-1">Time</span>
                          <span className="text-lg font-black tracking-tighter">{lc.time}</span>
                        </div>
                        <div className="min-w-0">
                          <Badge variant="outline" className="mb-2 bg-muted/50 border-border/50 text-[10px] font-bold uppercase tracking-wider">
                            {lc.batch}
                          </Badge>
                          <h3 className="text-xl font-bold text-foreground truncate">{lc.topic}</h3>
                          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                            <Video className="w-3.5 h-3.5" />
                            <span>Live Class via Google Meet</span>
                          </div>
                        </div>
                      </div>
                      <div className="shrink-0 flex sm:block items-center justify-between border-t sm:border-t-0 pt-4 sm:pt-0">
                        <a href={lc.link} target="_blank" rel="noopener noreferrer" className="w-full">
                          <Button className="w-full sm:w-auto h-12 px-8 rounded-xl font-bold shadow-lg shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-700 gap-2">
                            Join Class
                            <Plus className="w-4 h-4" />
                          </Button>
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="bg-muted/20 border-2 border-dashed border-border/60 rounded-3xl py-12 text-center flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <CalendarIcon className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <h3 className="text-xl font-bold text-foreground/80">No classes scheduled for today.</h3>
                <p className="text-muted-foreground mt-2 max-w-xs mx-auto">
                  Take this time to review assignments or prepare for upcoming sessions.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 3. Upcoming Live Sessions */}
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <CalendarIcon className="w-4 h-4 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Upcoming Live Sessions</h2>
            </div>
            <Button onClick={() => setIsModalOpen(true)} className="gap-2 rounded-xl h-11 px-6 shadow-md">
              <Plus className="w-4 h-4" />
              Schedule Live Class
            </Button>
          </div>

          <Card className="border-border/50 shadow-sm overflow-hidden rounded-2xl">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/40">
                    <TableRow className="hover:bg-transparent border-b-border/50">
                      <TableHead className="pl-6 h-14 font-bold text-foreground">Batch Name</TableHead>
                      <TableHead className="h-14 font-bold text-foreground">Topic</TableHead>
                      <TableHead className="h-14 font-bold text-foreground">Date</TableHead>
                      <TableHead className="h-14 font-bold text-foreground">Time</TableHead>
                      <TableHead className="h-14 font-bold text-foreground">Meet Link</TableHead>
                      <TableHead className="h-14 font-bold text-foreground text-center">Status</TableHead>
                      <TableHead className="pr-6 h-14 font-bold text-foreground text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {upcomingClasses.length > 0 ? (
                      upcomingClasses.map((lc) => (
                        <TableRow key={lc.id} className="hover:bg-muted/20 transition-colors border-b-border/30 last:border-0">
                          <TableCell className="pl-6 py-4">
                            <Badge variant="secondary" className="font-semibold bg-background border-border/50">
                              {lc.batch}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-bold text-foreground py-4">
                            {lc.topic}
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <CalendarIcon className="w-3.5 h-3.5" />
                              <span className="text-sm font-medium">{lc.date}</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Clock className="w-3.5 h-3.5" />
                              <span className="text-sm font-medium">{lc.time}</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <a href={lc.link} target="_blank" rel="noopener noreferrer">
                              <Button size="sm" variant="outline" className="rounded-lg h-9 bg-emerald-500/5 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all font-bold px-4">
                                Join
                              </Button>
                            </a>
                          </TableCell>
                          <TableCell className="py-4 text-center">
                            <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20 font-bold uppercase text-[10px]">
                              {lc.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="pr-6 py-4 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg h-9 w-9 p-0"
                              onClick={() => cancelClass(lc.id)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-12 text-muted-foreground font-medium">
                          No upcoming sessions found.
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
          <DialogContent className="sm:max-w-[425px] rounded-3xl overflow-hidden border-border/50">
            <DialogHeader className="pt-2">
              <DialogTitle className="text-2xl font-black">Schedule Live Class</DialogTitle>
              <DialogDescription className="font-medium">
                Set up a new Google Meet session for a Learning Phase batch.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-5 py-6">
              <div className="grid gap-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Batch Selection <span className="text-destructive">*</span></Label>
                <Select
                  value={formData.batch}
                  onValueChange={handleSelectChange}
                >
                  <SelectTrigger className="h-12 rounded-xl ring-offset-background focus-visible:ring-1 focus-visible:ring-primary">
                    <SelectValue placeholder="Select batch" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {availableBatches.map(b => (
                      <SelectItem key={b} value={b}>{b}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="topic" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Class Topic <span className="text-destructive">*</span></Label>
                <Input
                  id="topic"
                  name="topic"
                  placeholder="e.g. Intro to Node.js"
                  className="h-12 rounded-xl bg-muted/30 border-transparent focus:border-primary/30 transition-all font-medium"
                  value={formData.topic}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="date" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Date <span className="text-destructive">*</span></Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    className="h-12 rounded-xl bg-muted/30 border-transparent font-medium"
                    value={formData.date}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="time" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Time <span className="text-destructive">*</span></Label>
                  <Input
                    id="time"
                    name="time"
                    type="time"
                    className="h-12 rounded-xl bg-muted/30 border-transparent font-medium"
                    value={formData.time}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="link" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Google Meet Link <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="link"
                    name="link"
                    type="url"
                    placeholder="https://meet.google.com/..."
                    className="pl-12 h-12 rounded-xl bg-muted/30 border-transparent font-medium"
                    value={formData.link}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="gap-3 sm:gap-0">
              <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="rounded-xl h-12 flex-1 font-bold">
                Cancel
              </Button>
              <Button onClick={handleScheduleClass} className="rounded-xl h-12 flex-1 font-bold gap-2">
                <Video className="w-4 h-4" />
                Schedule Class
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </DashboardLayout>
  );
};

export default TutorDashboard;
