import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Clock, 
  User, 
  FileText, 
  Video, 
  Link as LinkIcon,
  Search,
  Calendar,
  Play,
  Download,
  ExternalLink,
  FolderOpen,
  Coffee,
} from "lucide-react";

const StudentClasses = () => {
  const [selectedClass, setSelectedClass] = useState<string | null>("react-hooks");
  const [searchQuery, setSearchQuery] = useState("");
  const [materialFilter, setMaterialFilter] = useState<"all" | "docs" | "videos" | "links">("all");

  const classes = [
    {
      id: "react-hooks",
      name: "Advanced React Hooks",
      tutor: "Sarah Jenkins",
      tutorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      schedule: "Mon, Wed, Fri • 4:30 PM",
      materials: 15,
      recordings: 12,
      color: "bg-primary",
    },
    {
      id: "typescript",
      name: "TypeScript Mastery",
      tutor: "James Chen",
      tutorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
      schedule: "Tue, Thu • 10:00 AM",
      materials: 10,
      recordings: 8,
      color: "bg-role-intern",
    },
    {
      id: "ui-ux",
      name: "UI/UX Design Principles",
      tutor: "Emma Wilson",
      tutorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
      schedule: "Wed, Fri • 2:00 PM",
      materials: 18,
      recordings: 14,
      color: "bg-role-tutor",
    },
    {
      id: "nodejs",
      name: "Node.js Backend",
      tutor: "Michael Park",
      tutorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
      schedule: "Mon • 6:00 PM",
      materials: 8,
      recordings: 5,
      color: "bg-role-mentor",
    },
  ];

  const documents = [
    { id: 1, name: "React Hooks Deep Dive.pdf", size: "2.4 MB", date: "Feb 1, 2026", type: "pdf" },
    { id: 2, name: "useEffect Patterns.pdf", size: "1.8 MB", date: "Jan 28, 2026", type: "pdf" },
    { id: 3, name: "Custom Hooks Guide.pdf", size: "3.1 MB", date: "Jan 25, 2026", type: "pdf" },
    { id: 4, name: "Performance Optimization.pdf", size: "2.1 MB", date: "Jan 22, 2026", type: "pdf" },
  ];

  const videos = [
    { id: 1, name: "Week 1: useState & useReducer", duration: "45:30", date: "Feb 1, 2026" },
    { id: 2, name: "Week 2: useEffect Mastery", duration: "52:15", date: "Jan 28, 2026" },
    { id: 3, name: "Week 3: Custom Hooks", duration: "38:45", date: "Jan 25, 2026" },
    { id: 4, name: "Week 4: Context API", duration: "41:20", date: "Jan 22, 2026" },
  ];

  const links = [
    { id: 1, name: "React Official Docs", url: "#", description: "Official React documentation" },
    { id: 2, name: "Figma Design Files", url: "#", description: "Course design resources" },
    { id: 3, name: "GitHub Repository", url: "#", description: "Course code examples" },
  ];

  const selectedClassData = classes.find((c) => c.id === selectedClass);

  const openGoogleDrive = () => {
    window.open("https://drive.google.com", "_blank");
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-semibold text-foreground tracking-tight">
            Classes & Schedule
          </h1>
          <p className="text-muted-foreground mt-2">
            Access your courses, materials, and recorded sessions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Class List - Left */}
          <div className="lg:col-span-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search classes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="space-y-3">
              {classes
                .filter((c) =>
                  c.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((classItem) => (
                  <Card
                    key={classItem.id}
                    className={`cursor-pointer transition-all hover:shadow-hover hover:-translate-y-0.5 ${
                      selectedClass === classItem.id
                        ? "ring-2 ring-primary border-primary/50"
                        : ""
                    }`}
                    onClick={() => setSelectedClass(classItem.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl ${classItem.color}/10 flex items-center justify-center shrink-0`}>
                          <BookOpen className={`w-5 h-5 ${classItem.color.replace('bg-', 'text-')}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-foreground truncate">
                            {classItem.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <img 
                              src={classItem.tutorAvatar} 
                              alt={classItem.tutor}
                              className="w-4 h-4 rounded-full"
                            />
                            <span className="truncate">{classItem.tutor}</span>
                          </div>
                          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            <span>{classItem.schedule}</span>
                          </div>
                          <div className="flex items-center gap-3 mt-2">
                            <Badge variant="secondary" className="text-xs">
                              <FileText className="w-3 h-3 mr-1" />
                              {classItem.materials}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              <Video className="w-3 h-3 mr-1" />
                              {classItem.recordings}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>

          {/* Materials Panel - Right */}
          <div className="lg:col-span-8">
            {selectedClassData ? (
              <Card>
                <CardHeader className="border-b">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl">{selectedClassData.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <img 
                          src={selectedClassData.tutorAvatar} 
                          alt={selectedClassData.tutor}
                          className="w-5 h-5 rounded-full"
                        />
                        <span>with {selectedClassData.tutor}</span>
                        <span>•</span>
                        <span>{selectedClassData.schedule}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-2" onClick={openGoogleDrive}>
                        <FolderOpen className="w-4 h-4" />
                        Recordings
                      </Button>
                      <Button size="sm" className="gap-2">
                        <Video className="w-4 h-4" />
                        Join Live
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Tabs defaultValue="all" className="w-full">
                    <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 h-auto">
                      <TabsTrigger
                        value="all"
                        onClick={() => setMaterialFilter("all")}
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                      >
                        All Materials
                      </TabsTrigger>
                      <TabsTrigger
                        value="docs"
                        onClick={() => setMaterialFilter("docs")}
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Docs
                      </TabsTrigger>
                      <TabsTrigger
                        value="videos"
                        onClick={() => setMaterialFilter("videos")}
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                      >
                        <Video className="w-4 h-4 mr-2" />
                        Videos
                      </TabsTrigger>
                      <TabsTrigger
                        value="links"
                        onClick={() => setMaterialFilter("links")}
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                      >
                        <LinkIcon className="w-4 h-4 mr-2" />
                        Links
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="p-4 space-y-4">
                      {/* Documents */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Documents
                        </h4>
                        <div className="grid gap-2">
                          {documents.slice(0, 2).map((doc) => (
                            <div
                              key={doc.id}
                              className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/30 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-destructive/10 flex items-center justify-center">
                                  <FileText className="w-4 h-4 text-destructive" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-foreground">{doc.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {doc.size} • {doc.date}
                                  </p>
                                </div>
                              </div>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Videos */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <Video className="w-4 h-4" />
                          Recent Videos
                        </h4>
                        <div className="grid gap-2">
                          {videos.slice(0, 2).map((video) => (
                            <div
                              key={video.id}
                              className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/30 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-role-tutor/10 flex items-center justify-center">
                                  <Play className="w-4 h-4 text-role-tutor" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-foreground">{video.name}</p>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Clock className="w-3 h-3" />
                                    <span>{video.duration}</span>
                                    <span>•</span>
                                    <span>{video.date}</span>
                                  </div>
                                </div>
                              </div>
                              <Button variant="outline" size="sm" className="gap-1.5 h-8">
                                <Play className="w-3 h-3" />
                                Watch
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="docs" className="p-4 space-y-3">
                      {documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                              <FileText className="w-5 h-5 text-destructive" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{doc.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {doc.size} • {doc.date}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </TabsContent>

                    <TabsContent value="videos" className="p-4 space-y-3">
                      {videos.map((video) => (
                        <div
                          key={video.id}
                          className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-role-tutor/10 flex items-center justify-center">
                              <Play className="w-5 h-5 text-role-tutor" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{video.name}</p>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                <span>{video.duration}</span>
                                <span>•</span>
                                <span>{video.date}</span>
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="gap-2">
                            <Play className="w-4 h-4" />
                            Watch
                          </Button>
                        </div>
                      ))}
                    </TabsContent>

                    <TabsContent value="links" className="p-4 space-y-3">
                      {links.map((link) => (
                        <div
                          key={link.id}
                          className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-role-intern/10 flex items-center justify-center">
                              <LinkIcon className="w-5 h-5 text-role-intern" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{link.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {link.description}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              <Card className="flex flex-col items-center justify-center h-96 text-center">
                <Coffee className="w-16 h-16 text-muted-foreground/30 mb-4" />
                <p className="text-lg font-medium text-foreground mb-2">
                  All caught up!
                </p>
                <p className="text-muted-foreground">
                  Select a class to view materials, or grab a coffee. ☕
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentClasses;
