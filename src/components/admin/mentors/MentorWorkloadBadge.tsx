import { Badge } from "@/components/ui/badge";

export const MentorWorkloadBadge = ({ internCount }: { internCount: number }) => {
    if (internCount >= 7) {
        return (
            <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20 ml-2 whitespace-nowrap">
                🔴 Overloaded
            </Badge>
        );
    }

    if (internCount >= 4) {
        return (
            <Badge variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-500/20 ml-2 whitespace-nowrap">
                🟠 Medium
            </Badge>
        );
    }

    return (
        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 ml-2 whitespace-nowrap">
            🟢 Normal
        </Badge>
    );
};
