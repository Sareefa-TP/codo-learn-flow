import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
    ChevronLeft, 
    Mail, 
    Phone, 
    Calendar, 
    Users, 
    Briefcase, 
    Activity, 
    Video,
    BookOpen,
    CheckCircle2,
    Clock,
    Star,
    Edit,
    FileText,
    ExternalLink
} from "lucide-react";
import { mockTutors as initialTutors } from "@/data/mockTutors";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useRole } from "@/hooks/useRole";

const AdminTutorDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { role } = useRole();
    const basePath = role === "superadmin" ? "/superadmin" : "/admin";

    // Finding tutor from mock data
    const tutor = initialTutors.find((t) => t.id === id);

    if (!tutor) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Tutor Profile Not Found</h2>
                    <p className="text-slate-400 font-medium">The educator you're looking for doesn't exist or has been removed.</p>
                    <Button 
                        onClick={() => navigate(`${basePath}/tutors`)}
                        className="rounded-xl h-11 px-6 font-bold gap-2"
                    >
                        <ChevronLeft className="w-5 h-5" /> Back to Dashboard
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
          case "Active":
            return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none font-black text-[10px] uppercase rounded-lg px-2.5">Active</Badge>;
          case "Inactive":
            return <Badge className="bg-slate-100 text-slate-500 hover:bg-slate-100 border-none font-black text-[10px] uppercase rounded-lg px-2.5">Inactive</Badge>;
          default:
            return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <DashboardLayout>
            <div className="animate-fade-in space-y-8 max-w-[1400px] mx-auto pb-20 px-6">

                {/* Header & Nav */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => navigate(`${basePath}/tutors`)} 
                            className="h-11 w-11 rounded-xl border-slate-100 shadow-sm"
                        >
                            <ChevronLeft className="w-5 h-5 text-slate-400" />
                        </Button>
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-slate-900 border-4 border-white shadow-xl ring-1 ring-slate-100 overflow-hidden shrink-0">
                                <img src={tutor.avatar} alt={tutor.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black tracking-tight text-slate-900 leading-none">{tutor.name}</h1>
                                <div className="flex items-center gap-3 mt-2">
                                    <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase shrink-0">Internal ID: {tutor.id}</p>
                                    <div className="w-1 h-1 rounded-full bg-slate-200 shrink-0" />
                                    {getStatusBadge(tutor.status)}
                                </div>
                            </div>
                        </div>
                    </div>
                    <Button 
                        onClick={() => navigate(`${basePath}/tutors/edit/${tutor.id}`)}
                        className="rounded-xl h-11 px-8 font-black uppercase text-xs shadow-lg shadow-primary/20 gap-2 transition-transform active:scale-95"
                    >
                        <Edit className="w-4 h-4" /> Modify Profile
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
                    
                    {/* LEFT COLUMN: Profile & Performance */}
                    <div className="lg:col-span-4 space-y-8">
                        
                        {/* BASIC INFO CARD */}
                        <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white ring-1 ring-slate-100">
                            <CardContent className="p-8 space-y-8">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Core Identity</h3>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2.5 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                                                <Mail className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 tracking-tighter uppercase leading-none">Email Channel</p>
                                                <p className="text-xs font-black text-slate-700 mt-1">{tutor.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2.5 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                                <Phone className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 tracking-tighter uppercase leading-none">Mobile Contact</p>
                                                <p className="text-xs font-black text-slate-700 mt-1">{tutor.phone}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2.5 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-amber-50 group-hover:text-amber-600 transition-colors">
                                                <Calendar className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 tracking-tighter uppercase leading-none">Onboarding Date</p>
                                                <p className="text-xs font-black text-slate-700 mt-1">{tutor.joinedDate}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* PERFORMANCE STATS */}
                        <Card className="border-none shadow-sm rounded-3xl bg-slate-900 text-white overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-2xl" />
                            <CardContent className="p-8 relative z-10 space-y-8">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Educator Impact</h3>
                                
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <h4 className="text-3xl font-black tracking-tight">{tutor.meetHistory.filter(m => m.status === 'Completed').length}</h4>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sessions <br/>Held</p>
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-3xl font-black tracking-tight">{tutor.assignmentsReviewed}</h4>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tasks <br/>Evaluated</p>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/5 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[10px] font-black uppercase text-slate-400">Avg. Rating</p>
                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full ring-1 ring-white/10">
                                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                            <span className="text-xs font-black">4.9/5</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-[10px] font-black uppercase text-slate-400">Total Workload</p>
                                        <Badge className="bg-primary hover:bg-primary border-none rounded-lg font-black text-[9px] px-2 py-0.5">HIGH REACH</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT COLUMN: History & Details */}
                    <div className="lg:col-span-8 space-y-8">
                        
                        {/* ASSIGNED TRACKS */}
                        <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white ring-1 ring-slate-100">
                            <div className="px-8 py-5 border-b border-slate-50 flex items-center gap-3 bg-slate-50/50">
                                <div className="p-2 bg-indigo-50 rounded-lg"><BookOpen className="w-3.5 h-3.5 text-indigo-600" /></div>
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 underline decoration-indigo-200 decoration-2 underline-offset-4">Assigned Course Paths</h3>
                            </div>
                            <CardContent className="p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {tutor.courses.length > 0 ? (
                                        tutor.courses.map((course, i) => (
                                            <div key={i} className="flex flex-col gap-4 p-6 rounded-2xl border border-slate-100 bg-white hover:shadow-lg hover:shadow-indigo-500/5 transition-all">
                                                <div className="flex items-start justify-between">
                                                    <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
                                                        <Briefcase className="w-5 h-5" />
                                                    </div>
                                                    <Badge className="bg-slate-900 border-none text-[9px] font-black uppercase tracking-widest px-2.5 py-1">Course Active</Badge>
                                                </div>
                                                <div>
                                                    <h4 className="text-base font-black text-slate-900 tracking-tight">{course.name}</h4>
                                                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Academic Authority Track</p>
                                                </div>
                                                <div className="flex flex-wrap gap-2 mt-2 pt-4 border-t border-slate-50">
                                                    {course.batches.map(batch => (
                                                        <Badge key={batch} variant="outline" className="px-3 py-1 border-slate-100 text-slate-500 font-bold text-[10px] bg-slate-50/50 rounded-lg">
                                                            {batch}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-2 py-10 text-center flex flex-col items-center justify-center opacity-40 italic">
                                            <BookOpen className="w-10 h-10 mb-2" />
                                            <p className="text-xs font-bold text-slate-400">No course paths assigned yet.</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* SESSION HISTORY */}
                        <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white ring-1 ring-slate-100">
                            <div className="px-8 py-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-50 rounded-lg"><Clock className="w-3.5 h-3.5 text-emerald-600" /></div>
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live Session Log</h3>
                                </div>
                                <Button variant="ghost" size="sm" className="h-8 rounded-lg font-black text-[9px] uppercase text-emerald-600 gap-1.5 px-3">
                                    Full Log <ExternalLink className="w-3 h-3" />
                                </Button>
                            </div>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-slate-50/20">
                                        <TableRow className="hover:bg-transparent border-b-slate-50">
                                            <TableHead className="px-8 text-[9px] font-black uppercase tracking-widest text-slate-400">Intervention Narrative</TableHead>
                                            <TableHead className="text-[9px] font-black uppercase tracking-widest text-slate-400">Track</TableHead>
                                            <TableHead className="text-[9px] font-black uppercase tracking-widest text-slate-400">Launch Date</TableHead>
                                            <TableHead className="px-8 text-right text-[9px] font-black uppercase tracking-widest text-slate-400">Outcome</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {tutor.meetHistory.length > 0 ? (
                                            tutor.meetHistory.map((meet) => (
                                                <TableRow key={meet.id} className="hover:bg-slate-50/50 border-b-slate-50/50 transition-colors">
                                                    <TableCell className="px-8 py-6">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100/50 flex items-center justify-center text-indigo-400 shrink-0">
                                                                <Video className="w-4 h-4" />
                                                            </div>
                                                            <p className="text-xs font-bold text-slate-900 tracking-tight">{meet.title}</p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-6">
                                                        <Badge variant="outline" className="bg-slate-50 border-none font-bold text-[9px] uppercase text-slate-500 px-2.5 py-0.5">
                                                            {meet.course.split(' ')[0]}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="py-6 text-xs font-bold text-slate-500">
                                                        {meet.date}
                                                    </TableCell>
                                                    <TableCell className="px-8 py-6 text-right">
                                                        {meet.status === 'Completed' ? (
                                                            <div className="flex items-center justify-end gap-1.5 text-emerald-500 font-black text-[10px] uppercase">
                                                                <CheckCircle2 className="w-3.5 h-3.5" /> ARCHIVED
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center justify-end gap-1.5 text-amber-500 font-black text-[10px] uppercase italic">
                                                                <Clock className="w-3.5 h-3.5" /> PENDING LAUNCH
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={4} className="h-40 text-center text-slate-300 italic text-xs font-bold">
                                                    No prior sessions found in historical log.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </Card>

                        {/* RECENT ASSIGNMENTS / TASKS */}
                        <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white ring-1 ring-slate-100">
                             <div className="px-8 py-5 border-b border-slate-50 flex items-center gap-3 bg-slate-50/50">
                                <div className="p-2 bg-pink-50 rounded-lg"><FileText className="w-3.5 h-3.5 text-pink-600" /></div>
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Curriculum Assets & Evaluation</h3>
                            </div>
                            <CardContent className="p-8">
                                <div className="flex flex-col sm:flex-row gap-6">
                                    <div className="flex-1 p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Tasks Created</p>
                                            <FileText className="w-4 h-4 text-slate-300" />
                                        </div>
                                        <div className="flex items-end gap-3">
                                            <h4 className="text-4xl font-black text-slate-900 tracking-tighter tabular-nums">24</h4>
                                            <p className="text-[10px] font-black text-slate-400 mb-1.5">ASSETS</p>
                                        </div>
                                        <div className="pt-2">
                                            <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                                                <div className="h-full bg-pink-500 w-[70%]" />
                                            </div>
                                            <p className="text-[9px] font-bold text-slate-400 mt-2 italic">70% of targets reached this quarter</p>
                                        </div>
                                    </div>

                                    <div className="flex-1 p-6 rounded-2xl bg-indigo-900 text-white space-y-4 shadow-xl shadow-indigo-500/10 relative overflow-hidden group">
                                        <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-white/5 rounded-full group-hover:scale-150 transition-transform duration-700" />
                                        <div className="flex items-center justify-between">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Reviews Pending</p>
                                            <Activity className="w-4 h-4 text-indigo-400 animate-pulse" />
                                        </div>
                                        <div className="flex items-end gap-3">
                                            <h4 className="text-4xl font-black text-white tracking-tighter tabular-nums">12</h4>
                                            <p className="text-[10px] font-black text-indigo-300 mb-1.5">PENDING</p>
                                        </div>
                                        <Button className="w-full bg-white text-indigo-900 hover:bg-slate-100 font-black text-[10px] uppercase h-9 rounded-xl shadow-lg mt-2">
                                            Enter Evaluation Hub
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                </div>

            </div>
        </DashboardLayout>
    );
};

export default AdminTutorDetails;
