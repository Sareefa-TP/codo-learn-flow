import DashboardLayout from "@/components/DashboardLayout";
import { ClipboardList } from "lucide-react";

const MentorAssignments = () => {
    return (
        <DashboardLayout>
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                    <ClipboardList className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Assignments Management</h1>
                <p className="text-muted-foreground max-w-md">
                    This module is currently being optimized for Mentors. You will soon be able to manage batch-wide assignments here.
                </p>
            </div>
        </DashboardLayout>
    );
};

export default MentorAssignments;
