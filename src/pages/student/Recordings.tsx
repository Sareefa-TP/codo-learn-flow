import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Calendar,
  ExternalLink,
  Video,
  Coffee,
  FolderOpen,
} from "lucide-react";
import { studentData } from "@/data/studentData";

const StudentRecordings = () => {
  const recordings = studentData.recorded_classes;

  const openGoogleDrive = () => {
    window.open("https://drive.google.com", "_blank");
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-semibold text-foreground tracking-tight">
                Recorded Classes
              </h1>
              <p className="text-muted-foreground mt-2">
                Watch past class recordings from Google Drive
              </p>
            </div>
            <Button onClick={openGoogleDrive} className="gap-2">
              <FolderOpen className="w-4 h-4" />
              Open Google Drive
              <ExternalLink className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Google Drive-style List */}
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Video className="w-5 h-5 text-primary" />
                Recent Recordings
              </CardTitle>
              <Badge variant="secondary">
                {recordings.length} recordings
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {recordings.length > 0 ? (
              <div className="divide-y">
                {recordings.map((recording, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {/* Google Drive-style thumbnail */}
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center relative">
                        <Video className="w-6 h-6 text-primary" />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <Play className="w-3 h-3 text-primary-foreground" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">
                          {recording.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                          <Calendar className="w-3 h-3" />
                          <span>{recording.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-2"
                        onClick={() => window.open(recording.link, "_blank")}
                      >
                        <Play className="w-4 h-4" />
                        Watch
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8"
                        onClick={openGoogleDrive}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <Coffee className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="font-medium text-foreground mb-1">All caught up!</h3>
                <p className="text-sm text-muted-foreground">
                  Grab a coffee. ☕ No recordings available yet.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Drive Integration Info */}
        <Card className="mt-6 border-dashed">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                <FolderOpen className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground">Google Drive Integration</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  All class recordings are automatically synced to your Google Drive folder.
                </p>
              </div>
              <Button variant="outline" onClick={openGoogleDrive} className="gap-2">
                View All
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentRecordings;
