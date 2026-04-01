import DashboardLayout from "@/components/DashboardLayout";
import { FileText } from "lucide-react";

const MentorMaterials = () => {
    return (
        <DashboardLayout>
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                    <FileText className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Learning Materials</h1>
                <p className="text-muted-foreground max-w-md">
                    Access and manage educational resources for your batches. This module is under active development for the Mentor portal.
                </p>
            </div>
        </DashboardLayout>
    );
};

export default MentorMaterials;
