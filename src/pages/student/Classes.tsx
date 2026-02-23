import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Clock, 
  User, 
  FileText, 
  Video,
  Play,
  Calendar,
  ExternalLink,
} from "lucide-react";
import NextClassCard from "@/components/student/NextClassCard";
import { studentData } from "@/data/studentData";

const StudentClasses = () => {
  const { next_class, learning_materials, recorded_classes } = studentData;

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6">
        {/* Header */}
        <div className="mb-2">
          <h1 className="text-2xl lg:text-3xl font-semibold text-foreground tracking-tight">
            Classes & Schedule
          </h1>
          <p className="text-muted-foreground mt-2">
            Access your courses, materials, and recorded sessions
          </p>
        </div>

        {/* Next Class Hero */}
        <NextClassCard 
          subject={next_class.title}
          tutor={next_class.tutor}
          time="4:30 PM"
          timeLabel="Today"
          meetLink={next_class.link}
        />

        {/* Subject Cards */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Your Subjects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {learning_materials.map((material, index) => {
              const docCount = material.files.filter(f => f.type === "doc").length;
              const videoCount = material.files.filter(f => f.type === "video").length;
              
              return (
                <Card 
                  key={index}
                  className="transition-all hover:shadow-hover hover:-translate-y-0.5"
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <BookOpen className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground text-lg">
                          {material.subject}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <User className="w-4 h-4" />
                          <span>with {material.tutor}</span>
                        </div>
                        
                        {/* File counts */}
                        <div className="flex items-center gap-3 mt-3">
                          {docCount > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              <FileText className="w-3 h-3 mr-1" />
                              {docCount} docs
                            </Badge>
                          )}
                          {videoCount > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              <Video className="w-3 h-3 mr-1" />
                              {videoCount} videos
                            </Badge>
                          )}
                        </div>

                        {/* File list */}
                        <div className="mt-4 space-y-2">
                          {material.files.map((file, fileIndex) => (
                            <div 
                              key={fileIndex}
                              className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                {file.type === "doc" ? (
                                  <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                                    <FileText className="w-4 h-4 text-destructive" />
                                  </div>
                                ) : (
                                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Play className="w-4 h-4 text-primary" />
                                  </div>
                                )}
                                <span className="text-sm font-medium text-foreground truncate">
                                  {file.name}
                                </span>
                              </div>
                              <Button variant="ghost" size="sm" className="h-8">
                                {file.type === "doc" ? "View" : "Watch"}
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Recordings */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Video className="w-5 h-5 text-primary" />
                Recent Recordings
              </CardTitle>
              <Button variant="outline" size="sm" className="gap-2">
                View All
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recorded_classes.length > 0 ? (
              <div className="space-y-3">
                {recorded_classes.map((recording, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 rounded-xl border hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center relative">
                        <Video className="w-6 h-6 text-primary" />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <Play className="w-3 h-3 text-primary-foreground" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{recording.title}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                          <Calendar className="w-3 h-3" />
                          <span>{recording.date}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Play className="w-4 h-4" />
                      Watch
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Video className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No recordings available yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentClasses;
