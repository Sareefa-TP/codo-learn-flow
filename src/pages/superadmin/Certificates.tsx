import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, FileText } from "lucide-react";
import { certificateTemplates } from "@/data/superAdminData";

const layoutLabel: Record<string, string> = { landscape: "Landscape", portrait: "Portrait" };

const SuperAdminCertificates = () => {
  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-semibold text-foreground tracking-tight">Certificates</h1>
          <p className="text-muted-foreground mt-1">Manage auto-generated certificate templates</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {certificateTemplates.map((cert) => (
            <Card key={cert.id} className="border border-border/60 shadow-card hover:shadow-hover transition-all">
              <CardContent className="p-5 space-y-4">
                <div className={`rounded-lg border-2 border-dashed border-border bg-muted/30 flex items-center justify-center ${cert.layout === "landscape" ? "h-32" : "h-44"}`}>
                  <div className="text-center">
                    <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground font-medium">{cert.name}</p>
                    <p className="text-[10px] text-muted-foreground">{cert.borderStyle}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">{cert.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{cert.course}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="text-xs">{layoutLabel[cert.layout]}</Badge>
                  <Badge variant="secondary" className="text-xs">Logo: {cert.logoPosition}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Signatory: {cert.signatory}</p>
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <Eye className="w-4 h-4" /> Preview Template
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SuperAdminCertificates;
