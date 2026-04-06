import { Badge } from "@/components/ui/badge";

export const WorkloadBadge = ({ studentCount }: { studentCount: number }) => {
    if (studentCount >= 21) {
        return (
            <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20 ml-2 whitespace-nowrap">
                🔴 Overloaded
            </Badge>
        );
    }

    if (studentCount >= 11) {
        return (
            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 ml-2 whitespace-nowrap">
                🟡 Medium
            </Badge>
        );
    }

    return (
        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 ml-2 whitespace-nowrap">
            🟢 Normal
        </Badge>
    );
};
