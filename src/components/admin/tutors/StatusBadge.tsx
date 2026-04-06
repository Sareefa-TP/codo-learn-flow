import { Badge } from "@/components/ui/badge";

export const StatusBadge = ({ status }: { status: string }) => {
    if (status === "Active") {
        return (
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                Active
            </Badge>
        );
    }

    return (
        <Badge variant="outline" className="bg-muted/50 text-muted-foreground border-border/50">
            Inactive
        </Badge>
    );
};
