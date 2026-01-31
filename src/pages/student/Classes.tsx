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
} from "lucide-react";

const StudentClasses = () => {
  const [selectedClass, setSelectedClass] = useState<string | null>("ux-design");
  const [searchQuery, setSearchQuery] = useState("");

  const classes = [
    {
      id: "ux-design",
      name: "UX Design Fundamentals",
      tutor: "Sarah Mitchell",
      schedule: "Mon, Wed, Fri • 2:00 PM",
      materials: 12,
      recordings: 8,
      color: "bg-role-student",
    },
    {
      id: "ui-dev",
      name: "UI Development",
      tutor: "James Chen",
      schedule: "Tue, Thu • 10:00 AM",
      materials: 8,
      recordings: 5,
      color: "bg-role-intern",
    },
    {
      id: "design-systems",
      name: "Design Systems",
      tutor: "Emma Wilson",
      schedule: "Wed • 4:00 PM",
      materials: 6,
      recordings: 3,
      color: "bg-role-tutor",
    },
  ];

  const documents = [
    { id: 1, name: "Introduction to UX Principles.pdf", size: "2.4 MB", date: "Jan 28" },
    { id: 2, name: "User Research Methods.pdf", size: "1.8 MB", date: "Jan 25" },
    { id: 3, name: "Wireframing Best Practices.pdf", size: "3.1 MB", date: "Jan 22" },
  ];

  const videos = [
    { id: 1, name: "Week 1: Introduction to UX", duration: "45:30", date: "Jan 28" },
    { id: 2, name: "Week 2: User Research Deep Dive", duration: "52:15", date: "Jan 25" },
    { id: 3, name: "Week 3: Information Architecture", duration: "38:45", date: "Jan 22" },
  ];

  const links = [
    { id: 1, name: "Figma Project Template", url: "#", description: "Starter template for assignments" },
    { id: 2, name: "Design Resources Library", url: "#", description: "Curated design resources" },
    { id: 3, name: "UX Case Study Examples", url: "#", description: "Industry case studies" },
  ];

  const selectedClassData = classes.find((c) => c.id === selectedClass);

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
                    className={`cursor-pointer transition-all hover:shadow-md ${
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
                          <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                            <User className="w-3 h-3" />
                            <span className="truncate">{classItem.tutor}</span>
                          </div>
                          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            <span>{classItem.schedule}</span>
                          </div>
                          <div className="flex items-center gap-3 mt-2">
                            <Badge variant="secondary" className="text-xs">
                              {classItem.materials} materials
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {classItem.recordings} recordings
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
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{selectedClassData.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        with {selectedClassData.tutor} • {selectedClassData.schedule}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Video className="w-4 h-4" />
                      Join Live
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Tabs defaultValue="documents" className="w-full">
                    <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 h-auto">
                      <TabsTrigger
                        value="documents"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Documents
                      </TabsTrigger>
                      <TabsTrigger
                        value="videos"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                      >
                        <Video className="w-4 h-4 mr-2" />
                        Videos
                      </TabsTrigger>
                      <TabsTrigger
                        value="links"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                      >
                        <LinkIcon className="w-4 h-4 mr-2" />
                        Links
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="documents" className="p-4 space-y-3">
                      {documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                              <FileText className="w-5 h-5 text-red-500" />
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
                            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                              <Play className="w-5 h-5 text-purple-500" />
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
                            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                              <LinkIcon className="w-5 h-5 text-blue-500" />
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
              <Card className="flex items-center justify-center h-96">
                <div className="text-center">
                  <BookOpen className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Select a class to view materials
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentClasses;
