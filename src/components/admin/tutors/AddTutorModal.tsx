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

type TutorPayload = {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: string;
    joinedDate: string;
    assignedStudentIds: string[];
};

interface AddTutorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (newTutor: TutorPayload) => void;
}

export const AddTutorModal = ({ isOpen, onClose, onSave }: AddTutorModalProps) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [status, setStatus] = useState<"Active" | "Inactive">("Active");

    const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

    const validate = () => {
        const newErrors: { name?: string; email?: string } = {};
        if (!name.trim()) newErrors.name = "Full Name is required";
        if (!email.trim()) newErrors.email = "Email is required";
        else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Invalid email format";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (!validate()) return;

        const today = new Date();
        const joinedDate = today.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });

        const newTutor: TutorPayload = {
            id: `T${Date.now()}`,
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            status,
            joinedDate,
            assignedStudentIds: []
        };

        onSave(newTutor);
        resetForm();
    };

    const resetForm = () => {
        setName("");
        setEmail("");
        setPhone("");
        setStatus("Active");
        setErrors({});
    };

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            resetForm();
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-xl">Add New Tutor</DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                        <Input
                            id="name"
                            placeholder="e.g. John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={errors.name ? "border-red-500" : ""}
                        />
                        {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="e.g. john@codo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={errors.email ? "border-red-500" : ""}
                        />
                        {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                            id="phone"
                            type="tel"
                            placeholder="e.g. +91 9876543210"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Account Status</Label>
                        <Select value={status} onValueChange={(val: "Active" | "Inactive") => setStatus(val)}>
                            <SelectTrigger id="status" className="w-full">
                                <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => handleOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Create Tutor</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
