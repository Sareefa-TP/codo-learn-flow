import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  BookOpen,
  Video,
  FileText,
  Link2,
  Clock,
  User,
  Play,
  Download,
  ExternalLink,
  ChevronDown,
  Search,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// Mock data
const classes = [
  {
    id: 1,
    subject: "UX Design Fundamentals",
    tutor: "Dr. Sarah Mitchell",
    schedule: "Mon, Wed • 2:00 PM",
    color: "bg-role-student",
    materials: {
      documents: 12,
      videos: 8,
      links: 5,
    },
    hasRecording: true,
  },
  {
    id: 2,
    subject: "UI Development",
    tutor: "Prof. James Chen",
    schedule: "Tue, Thu • 10:00 AM",
    color: "bg-role-intern",
    materials: {
      documents: 15,
      videos: 12,
      links: 8,
    },
    hasRecording: true,
  },
  {
    id: 3,
    subject: "Design Systems",
    tutor: "Maria Rodriguez",
    schedule: "Fri • 3:00 PM",
    color: "bg-role-tutor",
    materials: {
      documents: 8,
      videos: 4,
      links: 3,
    },
    hasRecording: false,
  },
  {
    id: 4,
    subject: "User Research Methods",
    tutor: "Dr. Emily Park",
    schedule: "Wed • 11:00 AM",
    color: "bg-role-mentor",
    materials: {
      documents: 10,
      videos: 6,
      links: 4,
    },
    hasRecording: true,
  },
];

const materials = {
  documents: [
    { id: 1, name: "Week 1 - Introduction to UX.pdf", size: "2.4 MB", date: "Jan 15" },
    { id: 2, name: "User Personas Template.docx", size: "856 KB", date: "Jan 18" },
    { id: 3, name: "Design Principles Guide.pdf", size: "4.1 MB", date: "Jan 22" },
    { id: 4, name: "Wireframing Basics.pdf", size: "1.8 MB", date: "Jan 25" },
  ],
  videos: [
    { id: 1, name: "Class Recording - Jan 15", duration: "1:24:30", date: "Jan 15" },
    { id: 2, name: "Prototyping Workshop", duration: "45:12", date: "Jan 20" },
    { id: 3, name: "User Testing Demo", duration: "32:45", date: "Jan 24" },
  ],
  links: [
    { id: 1, name: "Figma Design System", url: "figma.com", type: "Tool" },
    { id: 2, name: "Nielsen Norman Group", url: "nngroup.com", type: "Resource" },
    { id: 3, name: "UX Collective", url: "uxdesign.cc", type: "Blog" },
  ],
};

const StudentClasses = () => {
  const [selectedClass, setSelectedClass] = useState(classes[0]);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="opacity-0 animate-fade-in">
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
            Classes & Materials
          </h1>
          <p className="text-muted-foreground mt-1">
            Access your course content and learning resources
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Class list - left sidebar */}
          <div
            className="lg:col-span-4 space-y-4 opacity-0 animate-fade-in"
            style={{ animationDelay: "50ms" }}
          >
            <div className="bg-card rounded-2xl border border-border/50 shadow-card p-4">
              <h2 className="text-sm font-medium text-muted-foreground mb-4 px-2">
                Your Classes
              </h2>
              <div className="space-y-2">
                {classes.map((classItem, index) => (
                  <button
                    key={classItem.id}
                    onClick={() => setSelectedClass(classItem)}
                    className={cn(
                      "w-full text-left p-4 rounded-xl transition-all duration-200",
                      selectedClass.id === classItem.id
                        ? "bg-accent border border-border/50 shadow-sm"
                        : "hover:bg-accent/50"
                    )}
                    style={{ animationDelay: `${100 + index * 50}ms` }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                          classItem.color
                        )}
                      >
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground truncate">
                          {classItem.subject}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                          <User className="w-3 h-3" />
                          <span className="truncate">{classItem.tutor}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                          <Clock className="w-3 h-3" />
                          <span>{classItem.schedule}</span>
                        </div>
                      </div>
                    </div>

                    {/* Material counts */}
                    <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {classItem.materials.documents}
                      </span>
                      <span className="flex items-center gap-1">
                        <Video className="w-3 h-3" />
                        {classItem.materials.videos}
                      </span>
                      <span className="flex items-center gap-1">
                        <Link2 className="w-3 h-3" />
                        {classItem.materials.links}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Materials content - right side */}
          <div
            className="lg:col-span-8 opacity-0 animate-fade-in"
            style={{ animationDelay: "100ms" }}
          >
            <div className="bg-card rounded-2xl border border-border/50 shadow-card p-6">
              {/* Selected class header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      selectedClass.color
                    )}
                  >
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">
                      {selectedClass.subject}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {selectedClass.tutor}
                    </p>
                  </div>
                </div>

                {selectedClass.hasRecording && (
                  <Button variant="outline" className="gap-2 shrink-0">
                    <Play className="w-4 h-4" />
                    Latest Recording
                  </Button>
                )}
              </div>

              {/* Search and filter */}
              <div className="flex items-center gap-3 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search materials..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-background"
                  />
                </div>
                <Button variant="outline" size="icon" className="shrink-0">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>

              {/* Material tabs */}
              <Tabs defaultValue="documents" className="w-full">
                <TabsList className="w-full justify-start bg-secondary/50 p-1 rounded-xl mb-6">
                  <TabsTrigger
                    value="documents"
                    className="gap-2 data-[state=active]:bg-card rounded-lg"
                  >
                    <FileText className="w-4 h-4" />
                    Documents
                    <span className="text-xs text-muted-foreground ml-1">
                      ({materials.documents.length})
                    </span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="videos"
                    className="gap-2 data-[state=active]:bg-card rounded-lg"
                  >
                    <Video className="w-4 h-4" />
                    Videos
                    <span className="text-xs text-muted-foreground ml-1">
                      ({materials.videos.length})
                    </span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="links"
                    className="gap-2 data-[state=active]:bg-card rounded-lg"
                  >
                    <Link2 className="w-4 h-4" />
                    Links
                    <span className="text-xs text-muted-foreground ml-1">
                      ({materials.links.length})
                    </span>
                  </TabsTrigger>
                </TabsList>

                {/* Documents tab */}
                <TabsContent value="documents" className="mt-0">
                  <div className="space-y-2">
                    {materials.documents.map((doc, index) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-background hover:bg-accent/50 transition-colors group cursor-pointer"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5 text-destructive" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-foreground truncate">
                              {doc.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {doc.size} • {doc.date}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* Videos tab */}
                <TabsContent value="videos" className="mt-0">
                  <div className="space-y-2">
                    {materials.videos.map((video, index) => (
                      <div
                        key={video.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-background hover:bg-accent/50 transition-colors group cursor-pointer"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <Play className="w-5 h-5 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-foreground truncate">
                              {video.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {video.duration} • {video.date}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="gap-2">
                          <Play className="w-4 h-4" />
                          Watch
                        </Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* Links tab */}
                <TabsContent value="links" className="mt-0">
                  <div className="space-y-2">
                    {materials.links.map((link, index) => (
                      <div
                        key={link.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-background hover:bg-accent/50 transition-colors group cursor-pointer"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-lg bg-role-intern/10 flex items-center justify-center shrink-0">
                            <Link2 className="w-5 h-5 text-role-intern" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-foreground truncate">
                              {link.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {link.url} • {link.type}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="gap-2">
                          <ExternalLink className="w-4 h-4" />
                          Open
                        </Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>

              {/* Empty state placeholder */}
              {materials.documents.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-muted mx-auto flex items-center justify-center mb-4">
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium text-foreground mb-1">
                    No materials yet
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Materials will appear here once your tutor uploads them.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentClasses;
