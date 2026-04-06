import DashboardLayout from "@/components/DashboardLayout";
import { MessageSquare } from "lucide-react";

export default function StudentChat() {
    return (
        <DashboardLayout>
            <div className="animate-fade-in space-y-6 max-w-7xl mx-auto pb-10">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Student Chat</h1>
                    <p className="text-muted-foreground mt-2">
                        Communicate with your tutor for questions and support.
                    </p>
                </div>

                <div className="mt-8 flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl bg-muted/10 text-center min-h-[400px]">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                        <MessageSquare className="w-8 h-8" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Chat system will appear here.</h2>
                    <p className="text-muted-foreground max-w-sm text-sm">
                        This module is currently under construction. Check back soon for the full messaging experience.
                    </p>
                </div>
            </div>
        </DashboardLayout>
    );
}
