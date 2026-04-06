import DashboardLayout from "@/components/DashboardLayout";
import { Bell } from "lucide-react";

const MentorAnnouncements = () => {
    return (
        <DashboardLayout>
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                    <Bell className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Announcements</h1>
                <p className="text-muted-foreground max-w-md">
                    Stay tuned for batch-wide announcements. This feature is currently being integrated into the Mentor portal.
                </p>
            </div>
        </DashboardLayout>
    );
};

export default MentorAnnouncements;
