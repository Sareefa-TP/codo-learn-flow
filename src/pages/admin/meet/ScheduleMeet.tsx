import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { scheduleLiveClassForSession } from "@/data/courseData";
import { SHARED_BATCHES } from "@/data/batchData";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Video,
  Calendar,
  Clock,
  Users,
  Link2,
  ChevronLeft,
  Info,
  Save,
  Check,
  Search,
  Bell,
  Monitor,
  X,
  Target,
  UserCheck
} from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

// --- Mock Data ---
const courseOptions = [
  { id: "fullstack", name: "Full Stack Development" },
  { id: "uiux", name: "UI/UX Design" },
  { id: "ds", name: "Data Science" }
];

const batchOptions = [
  { id: "jan24", name: "FS-JAN-24", courseId: "fullstack" },
  { id: "feb24", name: "FS-FEB-24", courseId: "fullstack" },
  { id: "ui-jan24", name: "UI-JAN-24", courseId: "uiux" }
];

const hostsByRole: Record<string, { id: string, name: string }[]> = {
  Tutor: [
    { id: "t1", name: "Arun Krishnan" },
    { id: "t2", name: "Anjali Desai" }
  ],
  Mentor: [
    { id: "m1", name: "Suresh Raina" },
    { id: "m2", name: "Priya Sharma" }
  ],
  Admin: [
    { id: "a1", name: "Admin Johnson" },
    { id: "a2", name: "Alex Carter" }
  ]
};

const participantOptions = {
  Admins: [
     { id: "a1", name: "Admin Johnson" },
     { id: "a2", name: "Alex Carter" }
  ],
  Tutors: [
    { id: "t1", name: "Arun Krishnan" },
    { id: "t2", name: "Anjali Desai" }
  ],
  Mentors: [
    { id: "m1", name: "Suresh Raina" },
    { id: "m2", name: "Priya Sharma" }
  ],
  Coordinators: [
    { id: "c1", name: "Rahul Varma" },
    { id: "c2", name: "Sneha Nair" }
  ],
  Students: [
    { id: "s1", name: "Sarah Connor", batchId: "jan24" },
    { id: "s2", name: "John Wick", batchId: "jan24" },
    { id: "s3", name: "Tony Stark", batchId: "feb24" }
  ]
};

const AdminScheduleMeet = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const sessionContext = location.state as { 
    courseId: string; 
    moduleId: string; 
    sessionId: string; 
    sessionName: string; 
  } | null;
  
  const [participantType, setParticipantType] = useState<"batch" | "custom">("batch");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    courseId: "",
    batchId: "",
    hostRole: "Tutor",
    hostUserId: "",
    date: "",
    startTime: "",
    duration: "60",
    link: "",
    recording: true,
    chat: true,
    reminder: "15",
  });

  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const resetSelection = (type: "batch" | "custom") => {
    setParticipantType(type);
    setFormData(prev => ({ 
      ...prev, 
      courseId: "", 
      batchId: ""
    }));
    setSelectedParticipants([]);
    setSearchTerm("");
  };

  // Prefill from session context
  useEffect(() => {
    if (sessionContext) {
      setFormData(prev => ({
        ...prev,
        title: `Live Class: ${sessionContext.sessionName}`,
        courseId: "fullstack", // Mock logic - normally derived from courseId
        batchId: sessionContext.courseId // In our reused UI, batchId is used as key
      }));
      setParticipantType("batch");
    }
  }, [sessionContext]);

  // Auto-load students from batch (Batch Mode)
  useEffect(() => {
    if (participantType === "batch" && formData.batchId) {
      const batchStudents = participantOptions.Students
        .filter(s => s.batchId === formData.batchId)
        .map(s => s.id);
      
      setSelectedParticipants(prev => {
        const nonStudents = prev.filter(id => !participantOptions.Students.some(s => s.id === id));
        return Array.from(new Set([...nonStudents, ...batchStudents]));
      });
    }
  }, [formData.batchId, participantType]);

  const toggleParticipant = (id: string) => {
    setSelectedParticipants(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const removeParticipant = (id: string) => {
    setSelectedParticipants(prev => prev.filter(p => p !== id));
  };

  const getNameById = (id: string) => {
    const allUsers = Object.values(participantOptions).flat();
    return allUsers.find(u => u.id === id)?.name || id;
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Core details check
    if (!formData.title || !formData.date || !formData.startTime || !formData.link || !formData.hostUserId) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Participants check
    if (selectedParticipants.length === 0) {
      toast.error("Please select at least one participant.");
      return;
    }

    // Mode specific checks
    if (participantType === "batch" && (!formData.courseId || !formData.batchId)) {
      toast.error("Please select a Course and Batch.");
      return;
    }

    if (sessionContext) {
      scheduleLiveClassForSession(
        sessionContext.courseId,
        sessionContext.moduleId,
        sessionContext.sessionId,
        {
          id: `MT-${Date.now()}`,
          scheduledAt: `${formData.date}T${formData.startTime}:00Z`,
          duration: `${formData.duration} min`,
          meetingLink: formData.link,
          status: "Scheduled"
        }
      );
      toast.success("Linked to curriculum session!");
    } else {
      toast.success("Meet session scheduled successfully!");
    }

    navigate(sessionContext ? `/admin/courses/${sessionContext.courseId}/teaching` : "/admin/meet");
  };

  const filteredParticipants = (category: keyof typeof participantOptions) => {
    return participantOptions[category].filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6 max-w-[1200px] mx-auto pb-10 px-6">
        
        {/* Header Navigation */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate("/admin/meet")}
                className="rounded-xl hover:bg-slate-100 h-10 w-10 shrink-0"
              >
                <ChevronLeft className="w-5 h-5" />
            </Button>
            <div>
               <h1 className="text-2xl font-bold tracking-tight text-slate-900">Schedule Meet</h1>
               <p className="text-muted-foreground text-sm flex items-center gap-1.5 mt-0.5 font-medium">
                  <Video className="w-4 h-4 text-primary" />
                  Live Video Interaction Setup
               </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <Button 
              variant="ghost" 
              onClick={() => navigate("/admin/meet")}
              className="rounded-xl h-11 px-6 font-bold text-slate-500 hover:text-slate-900"
            >
              ← Back to Meet
            </Button>
            <Button 
              onClick={handleCreate}
              className="rounded-xl h-11 px-8 font-black uppercase tracking-tight text-xs shadow-lg shadow-primary/20 gap-2 transition-transform active:scale-95"
            >
              <Save className="w-4 h-4" /> Schedule Meet
            </Button>
          </div>
        </div>

        {/* Global Participant Type Switcher */}
        <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden p-6 ring-1 ring-slate-100">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                 <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" /> Participant Type
                 </h2>
                 <p className="text-xs text-slate-400 mt-1 font-medium">Define your target audience for this meeting</p>
              </div>
              <RadioGroup 
                value={participantType} 
                onValueChange={(v: "batch" | "custom") => resetSelection(v)} 
                className="flex flex-col sm:flex-row gap-3"
              >
                  <Label 
                    className={cn(
                      "flex items-center gap-2.5 px-6 py-3 rounded-xl border-2 transition-all cursor-pointer",
                      participantType === "batch" ? "border-primary bg-primary/5 text-primary" : "border-slate-50 bg-slate-50/50 text-slate-400"
                    )}
                  >
                    <RadioGroupItem value="batch" className="sr-only" />
                    <Monitor className="w-4 h-4" />
                    <span className="text-xs font-black uppercase">Batch-based Meeting</span>
                  </Label>
                  <Label 
                    className={cn(
                      "flex items-center gap-2.5 px-6 py-3 rounded-xl border-2 transition-all cursor-pointer",
                      participantType === "custom" ? "border-primary bg-primary/5 text-primary" : "border-slate-50 bg-slate-50/50 text-slate-400"
                    )}
                  >
                    <RadioGroupItem value="custom" className="sr-only" />
                    <Users className="w-4 h-4" />
                    <span className="text-xs font-black uppercase">Custom Participants</span>
                  </Label>
              </RadioGroup>
           </div>
        </Card>

        <form onSubmit={handleCreate} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Main Info & Selections */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* SECTION A: BASIC INFO */}
            <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white ring-1 ring-slate-100">
              <div className="px-8 py-5 border-b border-slate-50 flex items-center gap-3">
                 <div className="p-2 bg-indigo-50 rounded-lg"><Info className="w-3.5 h-3.5 text-indigo-600" /></div>
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Core Information</h3>
              </div>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 opacity-60">Meeting Title <span className="text-red-500">*</span></Label>
                  <Input 
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="h-13 bg-slate-50/50 border-slate-100/50 rounded-xl focus-visible:ring-primary/20 font-bold text-slate-900 placeholder:text-slate-300 placeholder:font-normal" 
<<<<<<< HEAD
                    placeholder="e.g. Advanced AI Prompt Engineering Session"
=======
                    placeholder="e.g. Advanced Prompt Engineering Session"
>>>>>>> 75f5dee4 (updated)
                  />
                </div>
                <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 opacity-60">Session Description</Label>
                  <Textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="min-h-[140px] bg-slate-50/50 border-slate-100/50 rounded-xl focus-visible:ring-primary/20 font-medium py-4 px-5 text-slate-800 leading-relaxed" 
                    placeholder="Provide context and key topics..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* SECTION B: BATCH SELECTION (Conditional) */}
            {participantType === "batch" && (
               <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white ring-1 ring-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="px-8 py-5 border-b border-slate-50 flex items-center gap-3">
                    <div className="p-2 bg-amber-50 rounded-lg"><Monitor className="w-3.5 h-3.5 text-amber-600" /></div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Academic Hierarchy</h3>
                  </div>
                  <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 opacity-60">Course Track <span className="text-red-500">*</span></Label>
                      <Select value={formData.courseId} onValueChange={(v) => setFormData({ ...formData, courseId: v })}>
                        <SelectTrigger className="h-12 bg-slate-50/50 border-slate-100/50 rounded-xl font-bold text-slate-900">
                          <SelectValue placeholder="Identify Course" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-none shadow-xl">
                          {courseOptions.map(c => (
                            <SelectItem key={c.id} value={c.id} className="font-bold py-2.5 rounded-lg">{c.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 opacity-60">Specific Batch <span className="text-red-500">*</span></Label>
                      <Select 
                        value={formData.batchId} 
                        onValueChange={(v) => setFormData({ ...formData, batchId: v })}
                        disabled={!formData.courseId}
                      >
                        <SelectTrigger className="h-12 bg-slate-50/50 border-slate-100/50 rounded-xl font-bold text-slate-900">
                          <SelectValue placeholder="Identify Batch" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-none shadow-xl">
                          {batchOptions
                            .filter(b => b.courseId === formData.courseId)
                            .map(b => (
                              <SelectItem key={b.id} value={b.id} className="font-bold py-2.5 rounded-lg">{b.name}</SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
               </Card>
            )}

            {/* SECTION D: PARTICIPANTS ROSTER */}
            <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white ring-1 ring-slate-100">
               <div className="px-8 py-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-primary/10 rounded-lg"><Users className="w-3.5 h-3.5 text-primary" /></div>
                     <div>
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Participant Roster</h3>
                        {selectedParticipants.length > 0 && (
                           <p className="text-[10px] font-bold text-primary mt-0.5">{selectedParticipants.length} SELECTED</p>
                        )}
                     </div>
                  </div>
                  <div className="relative w-full md:w-80">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input 
                      placeholder="Search users by name..." 
                      className="h-10 pl-10 bg-slate-50/50 border-slate-100/50 rounded-xl text-xs font-bold"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
               </div>
               
               {/* Selection Chips Area */}
               {selectedParticipants.length > 0 && (
                  <div className="px-8 py-4 bg-slate-50/30 flex flex-wrap gap-2 animate-in fade-in zoom-in-95 duration-200">
                     {selectedParticipants.map(id => (
                        <Badge key={id} variant="secondary" className="bg-white border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-sm font-bold text-[10px]">
                           {getNameById(id)}
                           <X className="w-3 h-3 cursor-pointer hover:text-red-500 transition-colors" onClick={() => removeParticipant(id)} />
                        </Badge>
                     ))}
                     <Button 
                       variant="ghost" 
                       size="sm" 
                       className="text-[10px] font-black text-red-500 hover:text-red-600 hover:bg-transparent"
                       onClick={() => setSelectedParticipants([])}
                     >
                       CLEAR ALL
                     </Button>
                  </div>
               )}

               <CardContent className="p-0">
                  <ScrollArea className="h-[460px]">
                    <div className="p-8 space-y-10">
                       {(["Admins", "Tutors", "Mentors", "Coordinators", "Students"] as const).map(category => {
                         const filtered = filteredParticipants(category);
                         if (filtered.length === 0) return null;

                         return (
                          <div key={category} className="space-y-4">
                             <div className="flex items-center gap-4">
                                <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-400 shrink-0">{category}</h4>
                                <div className="h-[1px] bg-slate-100 flex-1" />
                             </div>
                             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {filtered.map(p => (
                                  <div 
                                    key={p.id} 
                                    className={cn(
                                      "group flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all cursor-pointer relative overflow-hidden",
                                      selectedParticipants.includes(p.id) 
                                        ? "border-primary bg-primary/[0.03] ring-1 ring-primary/20" 
                                        : "border-slate-50 bg-white hover:border-slate-100 active:scale-[0.98]"
                                    )}
                                    onClick={() => toggleParticipant(p.id)}
                                  >
                                    <div className={cn(
                                      "w-4 h-4 rounded-md border flex items-center justify-center transition-all shrink-0",
                                      selectedParticipants.includes(p.id) ? "bg-primary border-primary scale-110 shadow-sm" : "border-slate-300 bg-white group-hover:border-slate-400"
                                    )}>
                                      {selectedParticipants.includes(p.id) && <Check className="w-2.5 h-2.5 text-white stroke-[4]" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className={cn(
                                        "text-xs font-bold truncate",
                                        selectedParticipants.includes(p.id) ? "text-primary" : "text-slate-700"
                                      )}> {p.name} </p>
                                      <p className="text-[9px] font-bold text-slate-400 mt-0.5 tracking-tight uppercase">User ID: {p.id}</p>
                                    </div>
                                  </div>
                                ))}
                             </div>
                          </div>
                         );
                       })}
                       
                       {searchTerm && Object.values(participantOptions).every(cat => cat.filter(p => p.name.includes(searchTerm)).length === 0) && (
                          <div className="py-20 text-center space-y-2">
                             <Search className="w-10 h-10 text-slate-100 mx-auto" />
                             <p className="text-xs font-bold text-slate-400">No users match your search terms.</p>
                          </div>
                       )}
                    </div>
                  </ScrollArea>
               </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN: Settings & Host */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* HOST SELECTION */}
            <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white ring-1 ring-slate-100">
               <div className="px-8 py-5 border-b border-slate-50 flex items-center gap-3">
                  <div className="p-2 bg-purple-50 rounded-lg"><UserCheck className="w-3.5 h-3.5 text-purple-600" /></div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Designated Host</h3>
               </div>
               <CardContent className="p-8 space-y-6">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 opacity-60">Primary Role <span className="text-red-500">*</span></Label>
                  <Select 
                    value={formData.hostRole} 
                    onValueChange={(v) => setFormData({ ...formData, hostRole: v, hostUserId: "" })}
                  >
                    <SelectTrigger className="h-12 bg-slate-50/50 border-slate-100/50 rounded-xl font-bold text-slate-900 shadow-none focus:ring-primary/20">
                      <SelectValue placeholder="Select Hosting Role" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-xl">
                      <SelectItem value="Tutor" className="font-bold py-2.5 rounded-lg">Tutor</SelectItem>
                      <SelectItem value="Mentor" className="font-bold py-2.5 rounded-lg">Mentor</SelectItem>
                      <SelectItem value="Admin" className="font-bold py-2.5 rounded-lg">Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 opacity-60">Select Host User <span className="text-red-500">*</span></Label>
                  <Select 
                    value={formData.hostUserId} 
                    onValueChange={(v) => setFormData({ ...formData, hostUserId: v })}
                  >
                    <SelectTrigger className="h-12 bg-slate-50/50 border-slate-100/50 rounded-xl font-bold text-slate-900 shadow-none focus:ring-primary/20">
                      <SelectValue placeholder="Assign Individual" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-xl">
                      {hostsByRole[formData.hostRole]?.map(h => (
                        <SelectItem key={h.id} value={h.id} className="font-bold py-2.5 rounded-lg">{h.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
               </CardContent>
            </Card>

            {/* SCHEDULE CONFIG */}
            <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white ring-1 ring-slate-100 transition-shadow hover:shadow-md">
               <div className="px-8 py-5 border-b border-slate-50 flex items-center gap-3">
                  <div className="p-2 bg-pink-50 rounded-lg"><Clock className="w-3.5 h-3.5 text-pink-600" /></div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Session Timing</h3>
               </div>
               <CardContent className="p-8 space-y-6">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 opacity-60">Launch Date <span className="text-red-500">*</span></Label>
                  <Input 
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="h-12 bg-slate-50/50 border-slate-100/50 rounded-xl font-bold text-slate-900 shadow-none focus:ring-primary/20" 
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 opacity-60">Start Time <span className="text-red-500">*</span></Label>
                  <Input 
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="h-12 bg-slate-50/50 border-slate-100/50 rounded-xl font-bold text-slate-900 shadow-none focus:ring-primary/20" 
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 opacity-60">Projected Duration</Label>
                  <Select value={formData.duration} onValueChange={(v) => setFormData({ ...formData, duration: v })}>
                    <SelectTrigger className="h-12 bg-slate-50/50 border-slate-100/50 rounded-xl font-bold text-slate-900 shadow-none focus:ring-primary/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-xl">
                      <SelectItem value="30" className="font-bold py-2 rounded-lg">30 Minutes</SelectItem>
                      <SelectItem value="45" className="font-bold py-2 rounded-lg">45 Minutes</SelectItem>
                      <SelectItem value="60" className="font-bold py-2 rounded-lg">1.0 Hour</SelectItem>
                      <SelectItem value="90" className="font-bold py-2 rounded-lg">1.5 Hours</SelectItem>
                      <SelectItem value="120" className="font-bold py-2 rounded-lg">2.0 Hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
               </CardContent>
            </Card>

            {/* CONNECTIVITY */}
            <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white ring-1 ring-slate-100 transition-shadow hover:shadow-md">
               <div className="px-8 py-5 border-b border-slate-50 flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg"><Link2 className="w-3.5 h-3.5 text-blue-600" /></div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Connectivity Path</h3>
               </div>
               <CardContent className="p-8 space-y-4">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 opacity-60">Google Meet / Zoom URL <span className="text-red-500">*</span></Label>
                    <div className="relative group">
                      <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                      <Input 
                        value={formData.link}
                        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                        className="pl-10 h-13 bg-slate-50/50 border-slate-100/50 rounded-xl font-bold text-slate-900 placeholder:text-slate-300 placeholder:font-normal focus:ring-primary/20" 
                        placeholder="https://meet.google.com/xxx-xxxx-xxx"
                      />
                    </div>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 italic px-1">Ensure the link is accessible by all invited participants.</p>
               </CardContent>
            </Card>

            {/* PREFERENCES */}
            <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white ring-1 ring-slate-100">
               <div className="px-8 py-5 border-b border-slate-50 flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 rounded-lg"><Bell className="w-3.5 h-3.5 text-emerald-600" /></div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Configuration</h3>
               </div>
               <CardContent className="p-8 space-y-8">
                  <div className="flex items-center justify-between">
                     <div className="space-y-0.5">
                        <Label className="text-xs font-bold text-slate-800">Recording Enabled</Label>
                        <p className="text-[10px] font-medium text-slate-400">Archive session automatically</p>
                     </div>
                     <Switch checked={formData.recording} onCheckedChange={(v) => setFormData({ ...formData, recording: v })} />
                  </div>
                  <div className="flex items-center justify-between">
                     <div className="space-y-0.5">
                        <Label className="text-xs font-bold text-slate-800">Allow Public Chat</Label>
                        <p className="text-[10px] font-medium text-slate-400">Enable in-session messaging</p>
                     </div>
                     <Switch checked={formData.chat} onCheckedChange={(v) => setFormData({ ...formData, chat: v })} />
                  </div>
                  <div className="space-y-3 pt-4 border-t border-slate-50">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 opacity-60">Push Reminder Schedule</Label>
                    <Select value={formData.reminder} onValueChange={(v) => setFormData({ ...formData, reminder: v })}>
                      <SelectTrigger className="h-11 bg-slate-50/50 border-slate-100/50 rounded-xl font-bold text-slate-900 focus:ring-primary/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-none shadow-xl">
                        <SelectItem value="5" className="font-bold py-2 rounded-lg">5 min before start</SelectItem>
                        <SelectItem value="15" className="font-bold py-2 rounded-lg">15 min before start</SelectItem>
                        <SelectItem value="30" className="font-bold py-2 rounded-lg">30 min before start</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
               </CardContent>
            </Card>
          </div>
        </form>

      </div>
    </DashboardLayout>
  );
};

export default AdminScheduleMeet;
