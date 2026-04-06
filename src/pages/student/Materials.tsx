import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  FileText,
  Video,
  Download,
  FileArchive,
  ClipboardList,
  ChevronDown,
  BarChart,
  Search,
  ArrowLeft,
  PlayCircle
} from "lucide-react";
import { useState, useMemo } from "react";

// Helper to generate the standard 5 material items for any given module
const generateMaterials = (modName: string) => [
  { id: 1, name: `${modName} Notes`, type: "pdf", fileTypeLabel: "Notes (PDF)", icon: FileText, size: "2.4 MB" },
  { id: 2, name: `${modName} Recorded Session`, type: "mp4", fileTypeLabel: "Recorded Session (MP4)", icon: Video, size: "120 MB" },
  { id: 3, name: `${modName} Slides`, type: "pdf", fileTypeLabel: "Slides (PDF)", icon: BarChart, size: "5.1 MB" },
  { id: 4, name: `${modName} Practice Files`, type: "zip", fileTypeLabel: "Practice Files (ZIP)", icon: FileArchive, size: "15.8 MB" },
  { id: 5, name: `${modName} Assignment`, type: "pdf", fileTypeLabel: "Assignment (PDF)", icon: ClipboardList, size: "1.2 MB" },
];

const courseList = [
  {
    id: 1,
    title: "Full Stack Development",
    modules: [
      { id: 1, title: "Module 1: HTML Basics", materials: generateMaterials("HTML Basics") },
      { id: 2, title: "Module 2: CSS Fundamentals", materials: generateMaterials("CSS Fundamentals") },
      { id: 3, title: "Module 3: JavaScript Core", materials: generateMaterials("JavaScript Core") },
      { id: 4, title: "Module 4: React Fundamentals", materials: generateMaterials("React Fundamentals") },
      { id: 5, title: "Module 5: Backend with Node.js", materials: generateMaterials("Backend with Node.js") },
      { id: 6, title: "Module 6: Express & API Development", materials: generateMaterials("Express & API Dev") },
      { id: 7, title: "Module 7: MongoDB & Database", materials: generateMaterials("MongoDB & Database") },
      { id: 8, title: "Module 8: Authentication & Security", materials: generateMaterials("Auth & Security") },
      { id: 9, title: "Module 9: Deployment & Hosting", materials: generateMaterials("Deployment & Hosting") },
      { id: 10, title: "Module 10: Final Project", materials: generateMaterials("Final Project") },
    ]
  },
  {
    id: 2,
    title: "Python Backend Development",
    modules: [
      { id: 11, title: "Module 1: Python Advanced Basics", materials: generateMaterials("Python Advanced Basics") },
      { id: 12, title: "Module 2: RESTful Services", materials: generateMaterials("RESTful Services") }
    ]
  },
  {
    id: 3,
    title: "UI/UX Design Masterclass",
    modules: [
      { id: 21, title: "Module 1: Design Thinking", materials: generateMaterials("Design Thinking") },
      { id: 22, title: "Module 2: Figma Fundamentals", materials: generateMaterials("Figma Fundamentals") }
    ]
  }
];

const StudentMaterials = () => {
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [openModuleId, setOpenModuleId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleModule = (id: number) => {
    setOpenModuleId(openModuleId === id ? null : id);
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'pdf': return 'destructive'; // Reddish
      case 'mp4': return 'default';     // Primary color
      case 'zip': return 'secondary';   // Secondary
      default: return 'outline';
    }
  };

  const activeCourse = useMemo(() => {
    return courseList.find(c => c.id === selectedCourseId) || null;
  }, [selectedCourseId]);

  // Filter courses based on search query
  const filteredCourses = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return courseList;

    return courseList.filter(course => {
      const matchesCourse = course.title.toLowerCase().includes(query);
      const matchesInternal = course.modules.some(mod =>
        mod.title.toLowerCase().includes(query) ||
        mod.materials.some(mat => mat.name.toLowerCase().includes(query))
      );
      return matchesCourse || matchesInternal;
    });
  }, [searchQuery]);

  // Filter materials based on search query
  const filteredModules = useMemo(() => {
    if (!activeCourse) return [];
    if (!searchQuery.trim()) return activeCourse.modules;

    const lowerQuery = searchQuery.toLowerCase();

    return activeCourse.modules.map(mod => {
      // If module title matches, keep all its materials
      if (mod.title.toLowerCase().includes(lowerQuery)) {
        return mod;
      }

      // Otherwise filter materials by name
      const filteredMaterials = mod.materials.filter(mat =>
        mat.name.toLowerCase().includes(lowerQuery)
      );

      // Return module only if it has matching materials
      return { ...mod, materials: filteredMaterials };
    }).filter(mod => mod.materials.length > 0);
  }, [activeCourse, searchQuery]);

  // Expand module if search is active so user can see the filtered items
  const shouldForceOpen = searchQuery.trim().length > 0;

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6 max-w-5xl mx-auto">

        {/* 1️⃣ Page Header */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">
              Learning Materials
            </h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              {selectedCourseId ? "Access course resources, notes, and recordings." : "Select a course to view its learning materials."}
            </p>
          </div>

          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search materials, modules or courses..."
              className="pl-9 bg-card w-full shadow-sm rounded-xl focus:ring-2 focus:ring-primary/20 transition-all border-border/50 focus:border-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Step 1: Course List View */}
        {!selectedCourseId ? (
          <div className="space-y-6">
            {filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => {
                  const totalModules = course.modules.length;
                  const totalMaterials = course.modules.reduce((acc, mod) => acc + mod.materials.length, 0);

                  return (
                    <Card key={course.id} className="border-border/50 hover:border-primary/50 transition-colors bg-card hover:shadow-md flex flex-col h-full">
                      <div className="p-6 flex flex-col h-full">
                        <div className="mb-4">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                            <BookOpen className="w-6 h-6" />
                          </div>
                          <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2">{course.title}</h3>
                        </div>

                        <div className="flex flex-col gap-3 mt-auto pt-6 border-t border-border/50">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground flex items-center gap-1.5"><FileText className="w-4 h-4" /> Modules</span>
                            <span className="font-semibold text-foreground">{totalModules}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground flex items-center gap-1.5"><PlayCircle className="w-4 h-4" /> Materials</span>
                            <span className="font-semibold text-foreground">{totalMaterials}</span>
                          </div>
                          <Button
                            className="w-full mt-4 bg-primary hover:bg-primary/90 gap-2"
                            onClick={() => {
                              setSelectedCourseId(course.id);
                              // Keep search query to highlight results inside
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                          >
                            <Video className="w-4 h-4" />
                            View Materials
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="border-border/50 bg-card shadow-sm">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4 text-muted-foreground/30">
                    <Search className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">No learning materials found</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    We couldn't find any courses or materials matching "{searchQuery}".
                  </p>
                  <Button
                    variant="outline"
                    className="mt-6"
                    onClick={() => setSearchQuery("")}
                  >
                    Clear search
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          /* Step 2: Course Specific Materials */
          <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-6">
            <Button
              variant="ghost"
              className="w-fit text-muted-foreground hover:text-foreground pl-0 group"
              onClick={() => {
                setSelectedCourseId(null);
                setOpenModuleId(null);
              }}
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Courses
            </Button>

            <div className="bg-primary/5 p-6 rounded-xl border border-primary/10 mb-8">
              <h2 className="text-2xl font-bold text-foreground">{activeCourse?.title}</h2>
              <div className="flex items-center gap-4 mt-3">
                <Badge variant="secondary" className="font-normal text-sm">
                  {activeCourse?.modules.length} Modules
                </Badge>
                <Badge variant="outline" className="font-normal text-sm">
                  {activeCourse?.modules.reduce((acc, mod) => acc + mod.materials.length, 0)} Total Materials
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              {filteredModules.length > 0 ? (
                filteredModules.map((mod) => {
                  const isOpen = shouldForceOpen || openModuleId === mod.id;

                  return (
                    <Card
                      key={mod.id}
                      className={`overflow-hidden transition-all duration-200 border ${isOpen ? "border-primary/30 shadow-md ring-1 ring-primary/10" : "border-border/50 hover:border-border shadow-sm hover:shadow-md"
                        }`}
                    >
                      {/* Module Header (Clickable) */}
                      <div
                        onClick={() => !shouldForceOpen && toggleModule(mod.id)}
                        className={`p-4 sm:p-5 flex items-center justify-between gap-4 transition-colors ${!shouldForceOpen ? "cursor-pointer" : ""
                          } ${isOpen ? "bg-primary/5" : "bg-card hover:bg-muted/30"
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${isOpen ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                            }`}>
                            <BookOpen className="w-5 h-5" />
                          </div>
                          <h2 className="text-lg font-semibold text-foreground text-left">
                            {mod.title}
                          </h2>
                        </div>

                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="hidden sm:flex text-xs font-normal">
                            {mod.materials.length} Items
                          </Badge>
                          {!shouldForceOpen && (
                            <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                          )}
                        </div>
                      </div>

                      {/* Inside Each Module Include: (Smooth expand/collapse via CSS grid) */}
                      <div
                        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                          }`}
                      >
                        <div className="overflow-hidden">
                          <CardContent className="p-0 border-t border-border/50 bg-card">
                            <div className="divide-y divide-border/50">
                              {mod.materials.map((material, index) => {
                                const Icon = material.icon;
                                return (
                                  <div
                                    key={`${material.id}-${index}`}
                                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 gap-4 hover:bg-muted/30 transition-colors group"
                                  >
                                    <div className="flex items-start sm:items-center gap-4 text-left">
                                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${material.type === 'pdf' ? 'bg-destructive/10 text-destructive' :
                                        material.type === 'mp4' ? 'bg-primary/10 text-primary' :
                                          'bg-secondary text-secondary-foreground'
                                        }`}>
                                        <Icon className="w-5 h-5" />
                                      </div>

                                      <div>
                                        <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                                          {material.name}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-2 mt-1">
                                          <Badge variant={getBadgeVariant(material.type) as any} className="text-[10px] uppercase py-0 h-4 px-1.5 opacity-80">
                                            {material.type}
                                          </Badge>
                                          <span className="text-xs font-medium text-muted-foreground">
                                            {material.fileTypeLabel}
                                          </span>
                                          <span className="text-muted-foreground/50 text-xs hidden sm:inline">•</span>
                                          <span className="text-xs text-muted-foreground">
                                            {material.size}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="shrink-0 gap-2 w-full sm:w-auto hover:bg-primary hover:text-primary-foreground transition-colors"
                                    >
                                      <Download className="w-4 h-4" />
                                      Download
                                    </Button>
                                  </div>
                                );
                              })}
                            </div>
                          </CardContent>
                        </div>
                      </div>
                    </Card>
                  );
                })
              ) : (
                <Card className="border-border/50 bg-card shadow-sm">
                  <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4 text-muted-foreground/30">
                      <Search className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">No materials found in this course</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto">
                      We couldn't find any resources matching "{searchQuery}". Try a different search term.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-6"
                      onClick={() => setSearchQuery("")}
                    >
                      Clear search
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default StudentMaterials;
