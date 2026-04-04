import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  ArrowLeft, 
  Save, 
  Video, 
  Calendar, 
  Clock, 
  BookOpen, 
  Layers, 
  User,
  Settings,
  Info,
  ExternalLink
} from "lucide-react";
import { toast } from "sonner";
import { 
  COURSES, 
  BATCHES, 
  TUTORS, 
  MODULES, 
  SESSIONS, 
  getSessions,
  addSession,
  updateSession,
  LiveSession 
} from "@/data/liveSessionData";

interface CreateSessionProps {
  mode: "create" | "edit";
  role?: "tutor" | "mentor";
}

const MentorCreateSession = ({ mode, role = "mentor" }: CreateSessionProps) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isMentor = role === "mentor";
  const sessionListPath = isMentor ? "/mentor/my-batches/live-sessions" : "/tutor/live-sessions";
  
  const [formData, setFormData] = useState<Partial<LiveSession>>({
    title: "",
    course: "",
    batch: "",
    tutor: "",
    module: "",
    topic: "",
    date: "",
    startTime: "",
    duration: "",
    meetingLink: "",
    status: "upcoming",
    settings: {
      recordingEnabled: true,
      allowLateJoin: true,
    }
  });

  useEffect(() => {
    if (mode === "edit" && id) {
      const sessions = getSessions();
      const session = sessions.find(s => s.id === id);
      if (session) {
        setFormData(session);
      } else {
        toast.error("Session not found");
        navigate(sessionListPath);
      }
    }
  }, [mode, id, navigate]);

  const handleSave = () => {
    // Basic validation
    const requiredFields = ["title", "course", "batch", "tutor", "module", "topic", "date", "startTime", "duration", "meetingLink"];
    const missingFields = requiredFields.filter(f => !formData[f as keyof LiveSession]);
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(", ")}`);
      return;
    }

    if (mode === "create") {
      const newSession: LiveSession = {
        ...(formData as LiveSession),
        id: `LS${Math.floor(Math.random() * 900) + 100}`,
        status: "upcoming",
      };
      addSession(newSession);
    } else if (mode === "edit" && id) {
      updateSession(id, formData);
    }

    toast.success(mode === "create" ? "Session scheduled successfully!" : "Session updated successfully!");
    navigate(sessionListPath);
  };

  const currentBatches = formData.course ? BATCHES[formData.course as string] || [] : [];
  const currentTutors = formData.course ? TUTORS[formData.course as string] || [] : [];
  const currentModules = formData.course ? MODULES[formData.course as string] || [] : [];
  const currentTopics = formData.module ? SESSIONS[formData.module as string] || [] : [];

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6 max-w-4xl mx-auto pb-20">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full hover:bg-muted"
              onClick={() => navigate(sessionListPath)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {mode === "create" ? "Schedule Live Session" : "Edit Session"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {mode === "create" ? "Create a new learning session for your batches" : `Updating ${formData.id}`}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-xl px-6" onClick={() => navigate(sessionListPath)}>
              Cancel
            </Button>
            <Button className="rounded-xl px-6 gap-2 shadow-lg shadow-primary/20" onClick={handleSave}>
              <Save className="w-4 h-4" />
              {mode === "create" ? "Create Session" : "Save Changes"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Section 1: Basic Info */}
          <Card className="rounded-2xl border-border/50 shadow-sm overflow-hidden">
             <CardHeader className="bg-muted/30 pb-4">
               <div className="flex items-center gap-2">
                 <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                    <Info className="w-4 h-4" />
                 </div>
                 <div>
                   <CardTitle className="text-base">Basic Information</CardTitle>
                   <CardDescription className="text-xs">Give your session a clear and descriptive name</CardDescription>
                 </div>
               </div>
             </CardHeader>
             <CardContent className="pt-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-xs font-bold uppercase tracking-wider text-muted-foreground pl-1">Session Title <span className="text-red-500">*</span></Label>
                  <Input 
                    id="title" 
                    placeholder="e.g., Advanced React Patterns Masterclass" 
                    className="h-11 rounded-xl bg-muted/20 border-border/50"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>
             </CardContent>
          </Card>

          {/* Section 2: Course Structure */}
          <Card className="rounded-2xl border-border/50 shadow-sm overflow-hidden">
             <CardHeader className="bg-muted/30 pb-4">
               <div className="flex items-center gap-2">
                 <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600">
                    <Layers className="w-4 h-4" />
                 </div>
                 <div>
                   <CardTitle className="text-base">Course & Batch Assignment</CardTitle>
                   <CardDescription className="text-xs">Select which course, batch and tutor this session belongs to</CardDescription>
                 </div>
               </div>
             </CardHeader>
             <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                   <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground pl-1">Course <span className="text-red-500">*</span></Label>
                   <Select 
                      value={formData.course} 
                      onValueChange={(val) => setFormData({...formData, course: val, batch: "", module: "", topic: ""})}
                    >
                     <SelectTrigger className="h-11 rounded-xl bg-muted/20 border-border/50">
                       <SelectValue placeholder="Select Course" />
                     </SelectTrigger>
                     <SelectContent className="rounded-xl">
                       {COURSES.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
                     </SelectContent>
                   </Select>
                </div>
                <div className="space-y-2">
                   <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground pl-1">Batch <span className="text-red-500">*</span></Label>
                   <Select 
                    value={formData.batch} 
                    onValueChange={(val) => setFormData({...formData, batch: val})}
                    disabled={!formData.course}
                   >
                     <SelectTrigger className="h-11 rounded-xl bg-muted/20 border-border/50">
                       <SelectValue placeholder={formData.course ? "Select Batch" : "Select Course first"} />
                     </SelectTrigger>
                     <SelectContent className="rounded-xl">
                        {currentBatches.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                     </SelectContent>
                   </Select>
                </div>
                <div className="space-y-2">
                   <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground pl-1">Assign Tutor <span className="text-red-500">*</span></Label>
                   <Select 
                    value={formData.tutor} 
                    onValueChange={(val) => setFormData({...formData, tutor: val})}
                    disabled={!formData.course}
                   >
                     <SelectTrigger className="h-11 rounded-xl bg-muted/20 border-border/50">
                       <SelectValue placeholder={formData.course ? "Select Tutor" : "Select Course first"} />
                     </SelectTrigger>
                     <SelectContent className="rounded-xl">
                        {currentTutors.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                     </SelectContent>
                   </Select>
                </div>
             </CardContent>
          </Card>

          {/* Section 3: Module & Session */}
          <Card className="rounded-2xl border-border/50 shadow-sm overflow-hidden">
             <CardHeader className="bg-muted/30 pb-4">
               <div className="flex items-center gap-2">
                 <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-600">
                    <BookOpen className="w-4 h-4" />
                 </div>
                 <div>
                   <CardTitle className="text-base">Module & Topic</CardTitle>
                   <CardDescription className="text-xs">Tag this session to a specific curriculum module and topic</CardDescription>
                 </div>
               </div>
             </CardHeader>
             <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground pl-1">Module <span className="text-red-500">*</span></Label>
                   <Select 
                    value={formData.module} 
                    onValueChange={(val) => setFormData({...formData, module: val, topic: ""})}
                    disabled={!formData.course}
                   >
                     <SelectTrigger className="h-11 rounded-xl bg-muted/20 border-border/50">
                       <SelectValue placeholder={formData.course ? "Select Module" : "Select Course first"} />
                     </SelectTrigger>
                     <SelectContent className="rounded-xl">
                        {currentModules.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                     </SelectContent>
                   </Select>
                </div>
                <div className="space-y-2">
                   <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground pl-1">Session (Topic) <span className="text-red-500">*</span></Label>
                   <Select 
                    value={formData.topic} 
                    onValueChange={(val) => setFormData({...formData, topic: val})}
                    disabled={!formData.module}
                   >
                     <SelectTrigger className="h-11 rounded-xl bg-muted/20 border-border/50">
                       <SelectValue placeholder={formData.module ? "Select Topic" : "Select Module first"} />
                     </SelectTrigger>
                     <SelectContent className="rounded-xl">
                        {currentTopics.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                     </SelectContent>
                   </Select>
                </div>
             </CardContent>
          </Card>

          {/* Section 4: Schedule */}
          <Card className="rounded-2xl border-border/50 shadow-sm overflow-hidden">
             <CardHeader className="bg-muted/30 pb-4">
               <div className="flex items-center gap-2">
                 <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-600">
                    <Calendar className="w-4 h-4" />
                 </div>
                 <div>
                   <CardTitle className="text-base">Schedule Details</CardTitle>
                   <CardDescription className="text-xs">When will the session take place?</CardDescription>
                 </div>
               </div>
             </CardHeader>
             <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                   <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground pl-1">Date <span className="text-red-500">*</span></Label>
                   <Input 
                    type="date" 
                    className="h-11 rounded-xl bg-muted/20 border-border/50"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                   />
                </div>
                <div className="space-y-2">
                   <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground pl-1">Start Time <span className="text-red-500">*</span></Label>
                   <Input 
                    type="time" 
                    className="h-11 rounded-xl bg-muted/20 border-border/50"
                    value={formData.startTime}
                    onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                   />
                </div>
                <div className="space-y-2">
                   <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground pl-1">Duration <span className="text-red-500">*</span></Label>
                   <Select value={formData.duration} onValueChange={(val) => setFormData({...formData, duration: val})}>
                     <SelectTrigger className="h-11 rounded-xl bg-muted/20 border-border/50">
                       <SelectValue placeholder="Select Duration" />
                     </SelectTrigger>
                     <SelectContent className="rounded-xl">
                        <SelectItem value="30 mins">30 mins</SelectItem>
                        <SelectItem value="1 hr">1 hr</SelectItem>
                        <SelectItem value="1.5 hrs">1.5 hrs</SelectItem>
                        <SelectItem value="2 hrs">2 hrs</SelectItem>
                        <SelectItem value="3 hrs">3 hrs</SelectItem>
                     </SelectContent>
                   </Select>
                </div>
             </CardContent>
          </Card>

          {/* Section 5: Meet Link */}
          <Card className="rounded-2xl border-border/50 shadow-sm overflow-hidden border-primary/20 bg-primary/5">
             <CardHeader className="pb-4">
               <div className="flex items-center gap-2">
                 <div className="p-1.5 rounded-lg bg-primary/20 text-primary">
                    <Video className="w-4 h-4" />
                 </div>
                 <div>
                   <CardTitle className="text-base">Meeting Link</CardTitle>
                   <CardDescription className="text-xs">Provide the URL for the live session (Google Meet, Zoom, etc.)</CardDescription>
                 </div>
               </div>
             </CardHeader>
             <CardContent className="pt-2">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground pl-1">URL <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <Video className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground" />
                    <Input 
                      placeholder="https://meet.google.com/..." 
                      className="pl-11 h-12 rounded-xl bg-background border-border/50 text-primary font-medium"
                      value={formData.meetingLink}
                      onChange={(e) => setFormData({...formData, meetingLink: e.target.value})}
                    />
                  </div>
                </div>
             </CardContent>
          </Card>

          {/* Section 6: Settings */}
          <Card className="rounded-2xl border-border/50 shadow-sm overflow-hidden">
             <CardHeader className="bg-muted/30 pb-4">
               <div className="flex items-center gap-2">
                 <div className="p-1.5 rounded-lg bg-muted text-foreground">
                    <Settings className="w-4 h-4" />
                 </div>
                 <div>
                   <CardTitle className="text-base">Session Settings</CardTitle>
                   <CardDescription className="text-xs">Configure additional permissions and options</CardDescription>
                 </div>
               </div>
             </CardHeader>
             <CardContent className="pt-6 space-y-6">
                <div className="flex items-center justify-between p-4 rounded-xl bg-muted/20 border border-border/50">
                   <div className="space-y-0.5">
                      <Label className="text-sm font-semibold">Automatic Recording</Label>
                      <p className="text-xs text-muted-foreground">Start recording automatically when the session begins</p>
                   </div>
                   <Switch 
                    checked={formData.settings?.recordingEnabled} 
                    onCheckedChange={(checked) => setFormData({...formData, settings: {...formData.settings!, recordingEnabled: checked}})}
                   />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-muted/20 border border-border/50">
                   <div className="space-y-0.5">
                      <Label className="text-sm font-semibold">Allow Late Joining</Label>
                      <p className="text-xs text-muted-foreground">Participants can join after the session has started</p>
                   </div>
                   <Switch 
                    checked={formData.settings?.allowLateJoin}
                    onCheckedChange={(checked) => setFormData({...formData, settings: {...formData.settings!, allowLateJoin: checked}})}
                   />
                </div>

                <div className="space-y-2">
                   <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground pl-1">Additional Notes (Private)</Label>
                   <textarea 
                    className="w-full min-h-[100px] rounded-xl bg-muted/20 border border-border/50 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Add any internal reminders or instructions for the tutor..."
                    value={formData.notes || ""}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                   />
                </div>
             </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MentorCreateSession;
