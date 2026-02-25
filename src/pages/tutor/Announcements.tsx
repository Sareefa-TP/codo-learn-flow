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
import { Megaphone, Send, Trash2, Calendar as CalendarIcon, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Demo Data
const initialAnnouncements = [
    { id: "AN-1", title: "Welcome to the Jan 2026 Batch!", message: "We are excited to begin our journey into full-stack development. Please check your emails for the introductory syllabus.", batchName: "Jan 2026 Batch", postedDate: "20 Feb 2026" },
    { id: "AN-2", title: "Project Deadline Extended", message: "The due date for the API Integration Capstone has been extended by 48 hours to give everyone ample time to debug their endpoints.", batchName: "Oct 2025 Batch", postedDate: "18 Feb 2026" },
    { id: "AN-3", title: "Upcoming Guest Lecture: System Design", message: "Reminder that we have an ex-FAANG engineer joining us this Friday at 6PM to discuss scalable architecture patterns.", batchName: "Feb 2026 Batch - Evening", postedDate: "15 Feb 2026" },
];

const availableBatches = [
    "Jan 2026 Batch",
    "Oct 2025 Batch",
    "Feb 2026 Batch - Evening"
];

const TutorAnnouncements = () => {
    const { toast } = useToast();
    const [announcements, setAnnouncements] = useState(initialAnnouncements);

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        message: "",
        batchName: ""
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (value: string) => {
        setFormData(prev => ({ ...prev, batchName: value }));
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
        if (!formData.message.trim()) {
            toast({ title: "Validation Error", description: "Announcement Message cannot be empty.", variant: "destructive" });
            return;
        }

        const now = new Date();
        const formattedDate = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

        const newAnnouncement = {
            id: `AN-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
            title: formData.title,
            message: formData.message,
            batchName: formData.batchName,
            postedDate: formattedDate
        };

        // Prepend to array (sorts newest first organically)
        setAnnouncements([newAnnouncement, ...announcements]);

        // Reset Form
        setFormData({ title: "", message: "", batchName: "" });

        toast({
            title: "Announcement Posted",
            description: "Your message has been successfully broadcasted to the selected cohort.",
        });
    };

    const handleDeleteAnnouncement = (id: string) => {
        setAnnouncements(announcements.filter(a => a.id !== id));
        toast({
            title: "Announcement Deleted",
            description: "The message has been removed from the cohort's feed.",
        });
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
                        <CardTitle className="text-lg">Compose New Announcement</CardTitle>
                        <CardDescription>
                            Fields marked with an asterisk (*) are required.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="relative z-10 space-y-5">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="grid gap-2">
                                <Label htmlFor="title" className="text-sm font-medium">Title <span className="text-destructive">*</span></Label>
                                <Input
                                    id="title"
                                    name="title"
                                    placeholder="e.g. Schedule Change for Friday"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="bg-background"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label className="text-sm font-medium">Target Batch <span className="text-destructive">*</span></Label>
                                <Select
                                    value={formData.batchName}
                                    onValueChange={handleSelectChange}
                                >
                                    <SelectTrigger className="bg-background">
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

                        <div className="grid gap-2">
                            <Label htmlFor="message" className="text-sm font-medium">Message <span className="text-destructive">*</span></Label>
                            <Textarea
                                id="message"
                                name="message"
                                placeholder="Draft your announcement here..."
                                value={formData.message}
                                onChange={handleInputChange}
                                className="resize-none min-h-[120px] bg-background"
                            />
                        </div>

                        <div className="pt-2 flex justify-end">
                            <Button onClick={handlePostAnnouncement} className="gap-2 sm:w-auto w-full shadow-sm">
                                <Send className="w-4 h-4" />
                                Post Announcement
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
                                                    <Badge variant="secondary" className="font-normal text-muted-foreground flex items-center gap-1.5 w-fit">
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
                                                <TableCell className="pr-6 text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="w-8 h-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all"
                                                        onClick={() => handleDeleteAnnouncement(announcement.id)}
                                                        title="Delete Announcement"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
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
        </DashboardLayout>
    );
};

export default TutorAnnouncements;
