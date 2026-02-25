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
  Search
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

const modulesData = [
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
];

const StudentMaterials = () => {
  const [openModuleId, setOpenModuleId] = useState<number | null>(1);
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

  // Filter materials based on search query
  const filteredModules = useMemo(() => {
    if (!searchQuery.trim()) return modulesData;

    const lowerQuery = searchQuery.toLowerCase();

    return modulesData.map(mod => {
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
  }, [searchQuery]);

  // Expand module if search is active so user can see the filtered items
  const shouldForceOpen = searchQuery.trim().length > 0;

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6 lg:space-y-8 max-w-5xl mx-auto">

        {/* 1️⃣ Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">
              Learning Materials
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-muted-foreground font-medium text-lg">Full Stack Development</span>
            </div>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search materials or modules..."
              className="pl-9 bg-card w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* 2️⃣ Module-wise Expandable Structure */}
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
                      <h2 className="text-lg font-semibold text-foreground">
                        {mod.title}
                      </h2>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="hidden sm:flex text-xs font-normal">
                        {mod.materials.length} Items
                      </Badge>
                      {!shouldForceOpen && (
                        <button className="text-muted-foreground hover:text-foreground transition-colors p-1 flex items-center justify-center">
                          <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 3️⃣ Inside Each Module Include: (Smooth expand/collapse via CSS grid) */}
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
                                <div className="flex items-start sm:items-center gap-4">
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
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge variant={getBadgeVariant(material.type) as any} className="text-[10px] uppercase py-0 h-4 px-1.5 opacity-80">
                                        {material.type}
                                      </Badge>
                                      <span className="text-xs font-medium text-muted-foreground">
                                        {material.fileTypeLabel}
                                      </span>
                                      <span className="text-muted-foreground/50 text-xs">•</span>
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
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No materials found</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  We couldn't find any materials matching "{searchQuery}". Try checking for typos or using different keywords.
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
    </DashboardLayout>
  );
};

export default StudentMaterials;
