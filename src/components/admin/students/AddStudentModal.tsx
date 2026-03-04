import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
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
import { User, Mail, Phone, BookOpen, Clock } from "lucide-react";

// The base object structure that Students.tsx expects
type StudentPayload = {
    id: string;
    name: string;
    email: string;
    phone?: string;
    batch: string;
    course: string;
    status: string;
    enrollmentDate: string;
    progress: number;
    assignedTutorId: string | null;
    phase: string;
    attendance: number;
    mentor: string;
    internshipStatus: string;
    assignments: any[];
};

interface AddStudentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (student: StudentPayload) => void;
    availableBatches: string[];
}

export const AddStudentModal = ({ isOpen, onClose, onSave, availableBatches }: AddStudentModalProps) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        batch: availableBatches[0] || "Jan 2026 Cohort",
        course: "Full Stack Development",
        status: "Active"
    });

    const isFormValid = formData.name.trim() !== "" && formData.email.trim() !== "";

    const handleSave = () => {
        if (!isFormValid) return;

        const generateId = `S-${Math.floor(Math.random() * 90000) + 10000}`;
        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format based on local browser logic

        const newStudent: StudentPayload = {
            id: generateId,
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            batch: formData.batch,
            course: formData.course,
            status: formData.status,
            enrollmentDate: today,
            progress: 0,
            assignedTutorId: null,
            phase: "Learning",
            attendance: 0,
            mentor: "",
            internshipStatus: "",
            assignments: []
        };

        onSave(newStudent);

        // Reset defaults on close
        setFormData({
            name: "",
            email: "",
            phone: "",
            batch: availableBatches[0] || "Jan 2026 Cohort",
            course: "Full Stack Development",
            status: "Active"
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
                <div className="bg-primary/5 p-6 border-b border-border/50">
                    <DialogHeader>
                        <DialogTitle className="text-xl flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                <User className="w-4 h-4 text-primary" />
                            </div>
                            Add New Student
                        </DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground mt-2">
                        Create a new student profile and assign them to a batch.
                    </p>
                </div>

                <div className="p-6 grid gap-6 md:grid-cols-2">
                    {/* Full Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1">
                            Full Name <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                id="name"
                                placeholder="Ex. John Doe"
                                className="pl-9"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1">
                            Email Address <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="Ex. john@example.com"
                                className="pl-9"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Phone (Optional) */}
                    <div className="space-y-2">
                        <Label htmlFor="phone" className="text-xs font-semibold uppercase text-muted-foreground">
                            Phone Number
                        </Label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                id="phone"
                                placeholder="+91 9876543210"
                                className="pl-9"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                        <Label className="text-xs font-semibold uppercase text-muted-foreground">Account Status</Label>
                        <Select
                            value={formData.status}
                            onValueChange={(value) => setFormData({ ...formData, status: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Batch Assignment */}
                    <div className="space-y-2 md:col-span-2">
                        <div className="p-4 rounded-lg border border-border bg-muted/20 space-y-4">
                            <h4 className="text-sm font-medium flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-muted-foreground" />
                                Program Details
                            </h4>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold text-muted-foreground">Assigned Batch</Label>
                                    <Select
                                        value={formData.batch}
                                        onValueChange={(value) => setFormData({ ...formData, batch: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a batch" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableBatches.map(b => (
                                                <SelectItem key={b} value={b}>{b}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold text-muted-foreground">Course Track</Label>
                                    <Input
                                        disabled
                                        value={formData.course}
                                        className="bg-muted/50 cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2 bg-background p-2 rounded border border-border/50">
                                <Clock className="w-3.5 h-3.5 text-blue-500" />
                                Enrollment date and progress (0%) will be automatically generated upon save.
                            </div>
                        </div>
                    </div>

                </div>

                <DialogFooter className="p-6 pt-0 border-t border-border/50 mt-2 bg-muted/10">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={!isFormValid}>
                        Save Student
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
