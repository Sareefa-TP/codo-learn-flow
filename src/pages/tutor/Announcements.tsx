import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Megaphone, Send, Trash2, Calendar as CalendarIcon, Users, Plus, Clock, Eye, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Demo Data
const initialAnnouncements = [
    { id: "AN-1", title: "Welcome to the Jan 2026 Batch!", message: "We are excited to begin our journey into full-stack development. Please check your emails for the introductory syllabus.", batchName: "Jan 2026 Batch", postedDate: "20 Feb 2026", times: ["09:00", "14:00"] },
    { id: "AN-2", title: "Project Deadline Extended", message: "The due date for the API Integration Capstone has been extended by 48 hours to give everyone ample time to debug their endpoints.", batchName: "Oct 2025 Batch", postedDate: "18 Feb 2026", times: ["10:30"] },
    { id: "AN-3", title: "Upcoming Guest Lecture: System Design", message: "Reminder that we have an ex-FAANG engineer joining us this Friday at 6PM to discuss scalable architecture patterns.", batchName: "Feb 2026 Batch - Evening", postedDate: "15 Feb 2026", times: ["18:00"] },
];

const availableBatches = [
    "Jan 2026 Batch",
    "Oct 2025 Batch",
    "Feb 2026 Batch - Evening"
];

const TutorAnnouncements = () => {
    const { toast } = useToast();
    const [announcements, setAnnouncements] = useState(initialAnnouncements);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        message: "",
        batchName: "",
        date: "",
        times: [""] // Initialize with one empty time field
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (value: string) => {
        setFormData(prev => ({ ...prev, batchName: value }));
    };

    const handleTimeChange = (index: number, value: string) => {
        const newTimes = [...formData.times];
        newTimes[index] = value;
        setFormData(prev => ({ ...prev, times: newTimes }));
    };

    const handleAddTime = () => {
        setFormData(prev => ({ ...prev, times: [...prev.times, ""] }));
    };

    const handleRemoveTime = (index: number) => {
        if (formData.times.length > 1) {
            const newTimes = formData.times.filter((_, i) => i !== index);
            setFormData(prev => ({ ...prev, times: newTimes }));
        }
    };

    const handlePostAnnouncement = () => {
        // Validation
        if (!formData.title.trim()) {
            toast({ title: "Validation Error", description: "Announcement Title is required.", variant: "destructive" });
            return;
        }
        if (!formData.batchName) {
            toast({ title: "Validation Error", description: "Target Batch selection is required.", variant: "destructive" });
            return;
        }
        if (!formData.date) {
            toast({ title: "Validation Error", description: "Scheduled Date is required.", variant: "destructive" });
            return;
        }
        if (formData.times.some(t => !t)) {
            toast({ title: "Validation Error", description: "All scheduled times must be filled.", variant: "destructive" });
            return;
        }
        if (!formData.message.trim()) {
            toast({ title: "Validation Error", description: "Announcement Message cannot be empty.", variant: "destructive" });
            return;
        }

        const scheduledDate = new Date(formData.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

        const newAnnouncement = {
            id: `AN-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
            title: formData.title,
            message: formData.message,
            batchName: formData.batchName,
            postedDate: scheduledDate,
            times: [...formData.times]
        } as any;

        // Prepend to array
        setAnnouncements([newAnnouncement, ...announcements]);

        // Reset Form
        setFormData({ title: "", message: "", batchName: "", date: "", times: [""] });

        toast({
            title: "Announcement Scheduled",
            description: `Your message has been scheduled for ${scheduledDate} at ${formData.times.length} different times.`,
        });
    };

    const handleDeleteAnnouncement = (id: string) => {
        setAnnouncements(announcements.filter(a => a.id !== id));
        toast({
            title: "Announcement Deleted",
            description: "The message has been removed from the cohort's feed.",
        });
    };

    const handleViewAnnouncement = (announcement: any) => {
        setSelectedAnnouncement(announcement);
        setIsViewModalOpen(true);
    };

    return (
        <DashboardLayout>
            <div className="animate-fade-in space-y-6 lg:space-y-8 max-w-5xl mx-auto pb-10">

                {/* Header Section */}
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <Megaphone className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                        Cohort Announcements
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Broadcast important updates, schedule changes, and general information to your active learning batches.
                    </p>
                </div>

                {/* Compose Announcement Card */}
                <Card className="border-border/50 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                    <CardHeader className="pb-4 relative z-10">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg">Compose New Announcement</CardTitle>
                                <CardDescription>
                                    Schedule a single message for multiple times on a specific date.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="relative z-10 space-y-6">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="grid gap-2">
                                <Label htmlFor="title" className="text-sm font-medium">Title <span className="text-destructive">*</span></Label>
                                <Input
                                    id="title"
                                    name="title"
                                    placeholder="e.g. Schedule Change for Friday"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="bg-background rounded-xl border-border/50 h-11"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label className="text-sm font-medium">Target Batch <span className="text-destructive">*</span></Label>
                                <Select
                                    value={formData.batchName}
                                    onValueChange={handleSelectChange}
                                >
                                    <SelectTrigger className="bg-background rounded-xl border-border/50 h-11">
                                        <SelectValue placeholder="Select batch to notify..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableBatches.map(b => (
                                            <SelectItem key={b} value={b}>{b}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                             <div className="grid gap-2">
                                <Label htmlFor="date" className="text-sm font-medium">Scheduled Date <span className="text-destructive">*</span></Label>
                                <Input
                                    id="date"
                                    name="date"
                                    type="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    className="bg-background rounded-xl border-border/50 h-11 cursor-pointer"
                                />
                                <p className="text-[10px] text-muted-foreground mt-1">This announcement will only be sent on this specific date.</p>
                            </div>

                            <div className="grid gap-3">
                                <Label className="text-sm font-medium flex items-center justify-between">
                                    Scheduled Time(s) <span className="text-destructive">*</span>
                                </Label>
                                <div className="space-y-3">
                                    {formData.times.map((time, index) => (
                                        <div key={index} className="flex items-center gap-2 group animate-in slide-in-from-top-1 duration-200">
                                            <Input
                                                type="time"
                                                value={time}
                                                onChange={(e) => handleTimeChange(index, e.target.value)}
                                                className="bg-background rounded-xl border-border/50 h-11 cursor-pointer flex-1"
                                            />
                                            {formData.times.length > 1 && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleRemoveTime(index)}
                                                    className="w-11 h-11 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleAddTime}
                                        className="w-full h-11 rounded-xl border-dashed border-2 border-border/60 hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all gap-2"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Another Time
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="message" className="text-sm font-medium">Message <span className="text-destructive">*</span></Label>
                            <Textarea
                                id="message"
                                name="message"
                                placeholder="Draft your announcement here..."
                                value={formData.message}
                                onChange={handleInputChange}
                                className="resize-none min-h-[140px] bg-background rounded-2xl border-border/50 p-4"
                            />
                        </div>

                        <div className="pt-4 flex justify-end">
                            <Button onClick={handlePostAnnouncement} className="gap-2 sm:w-auto w-full h-12 px-8 rounded-2xl shadow-lg shadow-primary/20 font-bold active:scale-95 transition-all">
                                <Send className="w-4 h-4" />
                                Schedule Announcement
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Announcements History Table Card */}
                <Card className="border-border/50 shadow-sm">
                    <CardHeader className="pb-4 border-b border-border/50 bg-muted/10">
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                            Announcement History
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-muted/30">
                                    <TableRow>
                                        <TableHead className="pl-6 w-[300px] lg:w-[400px]">Announcement Detail</TableHead>
                                        <TableHead>Target Cohort</TableHead>
                                        <TableHead>Posted Date</TableHead>
                                        <TableHead className="pr-6 text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {announcements.length > 0 ? (
                                        announcements.map((announcement) => (
                                            <TableRow key={announcement.id} className="hover:bg-muted/20 transition-colors group">
                                                <TableCell className="pl-6 py-4">
                                                    <div className="space-y-1.5 flex max-w-[400px] flex-col">
                                                        <h4 className="font-semibold text-foreground line-clamp-1" title={announcement.title}>
                                                            {announcement.title}
                                                        </h4>
                                                        <p className="text-sm text-muted-foreground line-clamp-2 leading-snug" title={announcement.message}>
                                                            {announcement.message}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary" className="font-normal text-muted-foreground flex items-center gap-1.5 w-fit rounded-lg px-2">
                                                        <Users className="w-3.5 h-3.5" />
                                                        {announcement.batchName}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-sm text-muted-foreground flex items-center gap-1.5 w-fit whitespace-nowrap">
                                                        <CalendarIcon className="w-3.5 h-3.5" />
                                                        {announcement.postedDate}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {(announcement as any).times?.map((time: string, idx: number) => (
                                                            <Badge key={idx} variant="outline" className="font-medium text-[10px] bg-primary/5 text-primary border-primary/20 flex items-center gap-1 py-0.5 px-2 rounded-md">
                                                                <Clock className="w-3 h-3" />
                                                                {time}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="pr-6 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="w-8 h-8 rounded-lg text-primary border-primary/20 hover:bg-primary/10 transition-all shadow-sm"
                                                            onClick={() => handleViewAnnouncement(announcement)}
                                                            title="View Details"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="w-8 h-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                                                            onClick={() => handleDeleteAnnouncement(announcement.id)}
                                                            title="Delete Announcement"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                                                <Megaphone className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                                No announcements have been published yet.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

            </div>

            {/* View Announcement Modal */}
            {isViewModalOpen && selectedAnnouncement && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="absolute inset-0" onClick={() => setIsViewModalOpen(false)} />
                    
                    <div className="relative bg-background border border-border/50 rounded-2xl shadow-2xl w-full max-w-2xl h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300" onClick={e => e.stopPropagation()}>
                        
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-border/50 bg-muted/5 flex-shrink-0">
                            <div>
                                <h3 className="text-xl font-bold tracking-tight text-foreground leading-none">
                                    Announcement Details
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1.5 flex items-center gap-2">
                                    Status: <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] py-0 px-2 font-bold uppercase tracking-wider">Scheduled</Badge>
                                </p>
                            </div>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => setIsViewModalOpen(false)}
                                className="rounded-xl hover:bg-muted/50 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-muted/30 border border-border/40">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Target Audience</p>
                                    <div className="flex items-center gap-2 text-foreground font-semibold">
                                        <Users className="w-4 h-4 text-primary" />
                                        {selectedAnnouncement.batchName}
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl bg-muted/30 border border-border/40">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Scheduled Date</p>
                                    <div className="flex items-center gap-2 text-foreground font-semibold">
                                        <CalendarIcon className="w-4 h-4 text-primary" />
                                        {selectedAnnouncement.postedDate}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Announcement Message</p>
                                <div className="p-6 rounded-2xl bg-primary/[0.02] border border-primary/10 relative overflow-hidden group">
                                    <h4 className="text-lg font-bold text-foreground mb-3 leading-tight">{selectedAnnouncement.title}</h4>
                                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-sm">
                                        {selectedAnnouncement.message}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3 pb-2">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Broadcast Times</p>
                                <div className="flex flex-wrap gap-2.5">
                                    {selectedAnnouncement.times && selectedAnnouncement.times.length > 0 ? (
                                        selectedAnnouncement.times.map((time: string, idx: number) => (
                                            <div 
                                                key={idx} 
                                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-background border border-border/40 shadow-sm transition-all hover:border-primary/30 hover:shadow-primary/5 group"
                                            >
                                                <Clock className="w-4 h-4 text-primary transition-transform group-hover:scale-110" />
                                                <span className="font-bold text-foreground text-sm">{time}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="w-full p-4 rounded-xl bg-muted/20 border border-dashed border-border/50 text-center text-sm text-muted-foreground">
                                            No scheduled times available
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-border/50 bg-muted/5 flex items-center justify-end gap-3 flex-shrink-0">
                            <Button 
                                variant="outline"
                                onClick={() => setIsViewModalOpen(false)}
                                className="px-6 rounded-xl font-semibold h-11"
                            >
                                Close View
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default TutorAnnouncements;
