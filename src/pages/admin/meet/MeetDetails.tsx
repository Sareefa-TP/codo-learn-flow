import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Video,
  Calendar,
  Clock,
  Users,
  Link2,
  ChevronLeft,
  Edit,
  ExternalLink,
  Mail,
  Phone,
  Copy,
  LayoutGrid,
  Info,
  CalendarDays,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// --- Mock Data ---

const mockMeetDetails = {
  id: "M1",
  title: "React Fundamentals: Hooks & State",
  description: "This comprehensive session dive deep into the core concepts of React Hooks, specifically focusing on useState and useEffect. We will explore advanced patterns for state management, performance optimization with useMemo/useCallback, and best practices for building scalable components in large-scale applications. The session includes live coding examples and a dedicated Q&A at the end.",
  course: "Full Stack Development",
  batch: "FS-JAN-24",
  status: "Upcoming",
  date: "25 March 2024",
  startTime: "10:00 AM",
  endTime: "11:30 AM",
  duration: "90 Minutes",
  link: "https://meet.google.com/abc-defg-hij",
  host: {
    name: "Arun Krishnan",
    role: "Senior Tutor",
    email: "arun.k@codoadamcy.com",
    phone: "+91 98765 43210",
    avatar: "AK"
  },
  participants: [
    { id: "p1", name: "Sarah Connor", role: "Student", email: "sarah@example.com", status: "Joined" },
    { id: "p2", name: "John Wick", role: "Student", email: "wick.j@example.com", status: "Pending" },
    { id: "p3", name: "Suresh Raina", role: "Mentor", email: "suresh@example.com", status: "Joined" },
    { id: "p4", name: "Anjali Desai", role: "Tutor", email: "anjali@example.com", status: "Joined" },
    { id: "p5", name: "Rahul Varma", role: "Coordinator", email: "rahul@example.com", status: "Joined" },
  ]
};

const AdminMeetDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meet, setMeet] = useState(mockMeetDetails);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Upcoming":
        return <Badge className="bg-amber-100 text-amber-700 font-black text-[10px] uppercase border-none rounded-lg px-3 py-1">Upcoming</Badge>;
      case "Live":
        return <Badge className="bg-red-100 text-red-600 font-black text-[10px] uppercase border-none animate-pulse rounded-lg px-3 py-1">Live Now</Badge>;
      case "Completed":
        return <Badge className="bg-emerald-100 text-emerald-700 font-black text-[10px] uppercase border-none rounded-lg px-3 py-1">Completed</Badge>;
      default:
        return <Badge className="rounded-lg px-3 py-1">{status}</Badge>;
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(meet.link);
    toast.success("Meeting link copied!");
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6 max-w-[1400px] mx-auto pb-10 px-6">
        
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
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Meet Administration</p>
               <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-none mt-0.5">Session Overview</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <Button 
              variant="outline" 
              className="rounded-xl h-11 px-6 font-bold text-slate-600 border-slate-200 gap-2"
              onClick={copyToClipboard}
            >
              <Copy className="w-4 h-4" /> Copy Link
            </Button>
            <Button 
              onClick={() => navigate(`/admin/meet/create`)}
              className="rounded-xl h-11 px-8 font-bold shadow-lg shadow-slate-100 border border-slate-200 gap-2 bg-white text-slate-900 hover:bg-slate-50"
            >
              <Edit className="w-4 h-4" /> Edit Session
            </Button>
            <Button 
               className="rounded-xl h-11 px-8 font-bold shadow-lg shadow-primary/20 gap-2"
               onClick={() => window.open(meet.link, "_blank")}
            >
              <ExternalLink className="w-4 h-4" /> Join Now
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT COLUMN: Main Info */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* HERO SECTION */}
            <Card className="border-none shadow-sm rounded-[16px] overflow-hidden bg-white">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                   <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Video className="w-10 h-10 text-primary" />
                   </div>
                   <div className="flex-1 space-y-5">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-3">
                           <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{meet.title}</h2>
                           {getStatusBadge(meet.status)}
                        </div>
                        <p className="text-slate-500 font-medium leading-relaxed max-w-3xl text-sm italic">
                          "{meet.description}"
                        </p>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-6 pt-2">
                        <div className="flex items-center gap-2">
                           <Badge variant="ghost" className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase rounded-lg px-2.5 h-6 border-none">
                              <LayoutGrid className="w-3 h-3 mr-1.5 opacity-40" />
                              {meet.course}
                           </Badge>
                           <Badge variant="ghost" className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase rounded-lg px-2.5 h-6 border-none">
                              <Users className="w-3 h-3 mr-1.5 opacity-40" />
                              {meet.batch}
                           </Badge>
                        </div>
                      </div>
                   </div>
                </div>
              </CardContent>
            </Card>

            {/* PARTICIPANTS TABLE */}
            <Card className="border-none shadow-sm rounded-[16px] overflow-hidden bg-white">
              <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                   <Users className="w-3.5 h-3.5" /> Participant Roster
                </h3>
                <span className="text-[10px] font-black text-slate-400">{meet.participants.length} TOTAL</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                   <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100 italic">
                         <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">User Details</th>
                         <th className="py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                         <th className="py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</th>
                         <th className="px-8 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Presence</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {meet.participants.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/30 transition-colors">
                           <td className="px-8 py-5 flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-400">
                                 {p.name.split(" ").map(n => n[0]).join("")}
                              </div>
                              <p className="text-xs font-bold text-slate-800">{p.name}</p>
                           </td>
                           <td className="py-5">
                              <Badge variant="ghost" className="text-[10px] font-bold text-slate-400 uppercase bg-transparent p-0">
                                 {p.role}
                              </Badge>
                           </td>
                           <td className="py-5">
                              <p className="text-xs font-medium text-slate-500">{p.email}</p>
                           </td>
                           <td className="px-8 py-5 text-right">
                              <div className={cn(
                                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase",
                                p.status === "Joined" ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-400"
                              )}>
                                 <div className={cn("w-1.5 h-1.5 rounded-full", p.status === "Joined" ? "bg-emerald-500" : "bg-slate-300")} />
                                 {p.status}
                              </div>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* RIGHT COLUMN: Metadata */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* SCHEDULE INFO */}
            <Card className="border-none shadow-sm rounded-[16px] overflow-hidden bg-white">
              <div className="p-6 border-b border-slate-50">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                   <CalendarDays className="w-4 h-4" /> Schedule Info
                </h3>
              </div>
              <CardContent className="p-8 space-y-8">
                 <div className="space-y-6">
                    <div className="flex items-start gap-4">
                       <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                          <Calendar className="w-5 h-5" />
                       </div>
                       <div className="space-y-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scheduled Date</p>
                          <p className="text-sm font-bold text-slate-800">{meet.date}</p>
                       </div>
                    </div>
                    <div className="flex items-start gap-4">
                       <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <Clock className="w-5 h-5" />
                       </div>
                       <div className="space-y-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Time Window</p>
                          <p className="text-sm font-bold text-slate-800">{meet.startTime} - {meet.endTime}</p>
                          <p className="text-[10px] font-medium text-slate-400">Net Duration: {meet.duration}</p>
                       </div>
                    </div>
                 </div>

                 <div className="p-5 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-3">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Meeting Target</p>
                    <div className="flex items-center gap-2 text-primary font-bold text-xs truncate">
                       <Link2 className="w-3.5 h-3.5 shrink-0" />
                       <span className="truncate">{meet.link}</span>
                    </div>
                 </div>
              </CardContent>
            </Card>

            {/* HOST INFO */}
            <Card className="border-none shadow-sm rounded-[16px] overflow-hidden bg-white">
              <div className="p-6 border-b border-slate-50">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                   <User className="w-4 h-4" /> Session Host
                </h3>
              </div>
              <CardContent className="p-8">
                 <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-2xl shadow-xl shadow-slate-100">
                       {meet.host.avatar}
                    </div>
                    <div className="space-y-1">
                       <h4 className="text-lg font-bold text-slate-900 leading-none">{meet.host.name}</h4>
                       <p className="text-[10px] font-black text-primary uppercase">{meet.host.role}</p>
                    </div>
                 </div>
                 <div className="mt-10 space-y-5 pt-2 border-t border-slate-50">
                    <div className="flex items-center gap-3 group cursor-pointer">
                       <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-primary transition-colors">
                          <Mail className="w-4 h-4 text-slate-400 group-hover:text-white" />
                       </div>
                       <p className="text-xs font-bold text-slate-600 truncate">{meet.host.email}</p>
                    </div>
                    <div className="flex items-center gap-3 group cursor-pointer">
                       <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-primary transition-colors">
                          <Phone className="w-4 h-4 text-slate-400 group-hover:text-white" />
                       </div>
                       <p className="text-xs font-bold text-slate-600">{meet.host.phone}</p>
                    </div>
                 </div>
              </CardContent>
            </Card>

            {/* QUICK ACTIONS */}
            <Card className="border-none shadow-sm rounded-[16px] overflow-hidden bg-white">
              <CardContent className="p-6">
                 <div className="p-4 bg-emerald-50 rounded-2xl flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                       <Info className="w-5 h-5" />
                    </div>
                    <p className="text-[11px] font-bold text-emerald-800 leading-relaxed">
                       This session is scheduled for {meet.date}. Reminders will be sent to participants 15 minutes prior.
                    </p>
                 </div>
              </CardContent>
            </Card>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
};

export default AdminMeetDetails;
