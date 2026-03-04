import { useState, useEffect } from "react";
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

// Type definition matches mockMentors[0]
interface MentorType {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: string;
    joinedDate: string;
    assignedInternIds: string[];
}

interface EditMentorModalProps {
    mentor: MentorType | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (mentor: MentorType) => void;
}

export const EditMentorModal = ({ mentor, isOpen, onClose, onSave }: EditMentorModalProps) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [status, setStatus] = useState<"Active" | "Inactive">("Active");

    const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

    useEffect(() => {
        if (mentor && isOpen) {
            setName(mentor.name);
            setEmail(mentor.email);
            setPhone(mentor.phone);
            setStatus(mentor.status as "Active" | "Inactive");
            setErrors({});
        }
    }, [mentor, isOpen]);

    const validate = () => {
        const newErrors: { name?: string; email?: string } = {};
        if (!name.trim()) newErrors.name = "Full Name is required";
        if (!email.trim()) newErrors.email = "Email is required";
        else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Invalid email format";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (!validate() || !mentor) return;

        const updatedMentor: MentorType = {
            ...mentor, // Preserves ID, Joined Date, and Assigned Interns
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            status
        };

        onSave(updatedMentor);
    };

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-xl">Edit Mentor Profile</DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit-name">Full Name <span className="text-red-500">*</span></Label>
                        <Input
                            id="edit-name"
                            placeholder="e.g. Rahul Sharma"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={errors.name ? "border-red-500" : ""}
                        />
                        {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-email">Email Address <span className="text-red-500">*</span></Label>
                        <Input
                            id="edit-email"
                            type="email"
                            placeholder="e.g. rahul@codo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={errors.email ? "border-red-500" : ""}
                        />
                        {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-phone">Phone Number</Label>
                        <Input
                            id="edit-phone"
                            type="tel"
                            placeholder="e.g. +91 9876543210"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-status">Account Status</Label>
                        <Select value={status} onValueChange={(val: "Active" | "Inactive") => setStatus(val)}>
                            <SelectTrigger id="edit-status" className="w-full">
                                <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="pt-2 text-xs text-muted-foreground flex justify-between bg-muted/20 p-2 rounded border border-border/50">
                        <span>Joined: {mentor?.joinedDate}</span>
                        <span>ID: {mentor?.id}</span>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => handleOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
