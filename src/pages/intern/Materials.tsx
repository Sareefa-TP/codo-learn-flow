import { useState, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  FileText, 
  PlayCircle, 
  ExternalLink, 
  Download, 
  Eye, 
  Info,
  User,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Types ---

interface Material {
  id: string;
  title: string;
  type: "document" | "video" | "link";
  uploadedBy: string;
  date: string;
  url: string;
}

type MaterialFilter = "All" | "Documents" | "Videos" | "Links";

// --- Mock Data ---

const materialsData: Material[] = [
  { 
    id: "1", 
    title: "Advanced React Component Patterns", 
    type: "document", 
    uploadedBy: "John Doe", 
    date: "Mar 22, 2026", 
    url: "#" 
  },
  { 
    id: "2", 
    title: "Docker & Kubernetes Crash Course", 
    type: "video", 
    uploadedBy: "Sarah Chen", 
    date: "Mar 20, 2026", 
    url: "#" 
  },
  { 
    id: "3", 
    title: "Standard API Documentation", 
    type: "link", 
    uploadedBy: "John Doe", 
    date: "Mar 18, 2026", 
    url: "https://api.example.com" 
  },
  { 
    id: "4", 
    title: "Modern State Management: Redux & Zustand", 
    type: "video", 
    uploadedBy: "Jane Smith", 
    date: "Mar 15, 2026", 
    url: "#" 
  },
  { 
    id: "5", 
    title: "Internship Project Guidelines v2.0", 
    type: "document", 
    uploadedBy: "John Doe", 
    date: "Mar 12, 2026", 
    url: "#" 
  },
  { 
    id: "6", 
    title: "Figma Design Assets Library", 
    type: "link", 
    uploadedBy: "Alex Rivera", 
    date: "Mar 10, 2026", 
    url: "#" 
  },
];

const typeStyles: Record<Material["type"], string> = {
  document: "bg-rose-500/10 text-rose-600 border-rose-500/20",
  video: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  link: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
};

const typeIcons: Record<Material["type"], React.ElementType> = {
  document: FileText,
  video: PlayCircle,
  link: ExternalLink,
};

// --- Sub-components ---

const MaterialCard = ({ material }: { material: Material }) => {
  const TypeIcon = typeIcons[material.type];

  return (
    <Card className="border-border/50 shadow-sm rounded-xl hover:shadow-md transition-all duration-200 border-l-4 border-l-transparent hover:border-l-primary group">
      <CardContent className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left Side: Material Info */}
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-sm lg:text-base text-foreground truncate group-hover:text-primary transition-colors">
              {material.title}
            </h3>
            <Badge variant="outline" className={cn("text-[10px] font-bold uppercase tracking-wider h-5 flex items-center", typeStyles[material.type])}>
              {material.type === "link" ? "External Link" : material.type}
            </Badge>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium flex-wrap text-nowrap">
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-primary/60" />
              <span>Mentor: <span className="text-foreground/80">{material.uploadedBy}</span></span>
            </div>
            <div className="flex items-center gap-1.5 border-l border-border pl-4">
              <Calendar className="w-3.5 h-3.5 text-primary/60" />
              <span>{material.date}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Actions Combined */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {material.type === "document" && (
            <>
              <Button
                size="sm"
                variant="outline"
                className="h-9 text-xs px-4 gap-2 rounded-lg border-border/60 hover:border-primary/40 hover:bg-primary/5"
              >
                <Eye className="w-4 h-4 text-primary" />
                <span className="hidden sm:inline">View</span>
              </Button>
              <Button
                size="sm"
                className="h-9 text-xs px-4 gap-2 rounded-lg shadow-sm shadow-primary/10"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download</span>
                <span className="sm:hidden text-[10px]">Save</span>
              </Button>
            </>
          )}

          {material.type === "video" && (
            <Button
              size="sm"
              className="h-9 text-xs px-6 gap-2 rounded-lg shadow-sm shadow-primary/10"
            >
              <PlayCircle className="w-4 h-4 fill-white" />
              <span>Watch Now</span>
            </Button>
          )}

          {material.type === "link" && (
            <Button
              size="sm"
              variant="outline"
              className="h-9 text-xs px-4 gap-2 rounded-lg border-emerald-500/20 bg-emerald-500/5 text-emerald-600 hover:bg-emerald-500/10 hover:border-emerald-500/30"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open Link</span>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// --- Main Page ---

const Materials = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<MaterialFilter>("All");

  const filteredMaterials = useMemo(() => {
    return materialsData.filter(material => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        material.title.toLowerCase().includes(searchLower) ||
        material.uploadedBy.toLowerCase().includes(searchLower) ||
        material.date.toLowerCase().includes(searchLower);

      const filterMap: Record<MaterialFilter, string> = {
        "All": "all",
        "Documents": "document",
        "Videos": "video",
        "Links": "link"
      };
      const matchesFilter = activeFilter === "All" || material.type === filterMap[activeFilter];
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, activeFilter]);

  const counts = {
    All: materialsData.length,
    Documents: materialsData.filter(m => m.type === "document").length,
    Videos: materialsData.filter(m => m.type === "video").length,
    Links: materialsData.filter(m => m.type === "link").length,
  };

  const filterTabs: MaterialFilter[] = ["All", "Documents", "Videos", "Links"];

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6 max-w-6xl mx-auto px-4 md:px-6 lg:px-8 pb-10">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">Materials</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Access your learning resources and documents
            </p>
          </div>
        </div>

        {/* Search Bar - Positioned below Header */}
        <div className="relative w-full group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search materials by title, mentor, or date..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 h-12 bg-muted/40 border-border/40 focus:bg-background transition-all rounded-xl text-sm shadow-inner"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-muted/50 p-1 rounded-xl w-fit border border-border/40 flex-wrap">
          {filterTabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeFilter === tab
                ? "bg-background shadow-sm text-foreground border border-border/50"
                : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
              <span className={`text-[10px] px-1.5 py-0 rounded-full font-semibold ${
                activeFilter === tab
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground"
              }`}>
                {counts[tab]}
              </span>
            </button>
          ))}
        </div>

        {/* Content Section */}
        {filteredMaterials.length > 0 ? (
          <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {filteredMaterials.map(material => (
              <MaterialCard key={material.id} material={material} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground border border-dashed border-border/40 rounded-xl bg-muted/5">
            <Info className="w-10 h-10 mx-auto opacity-20 mb-3" />
            <p className="font-medium">No materials found</p>
            <p className="text-xs mt-1">No resources match your search or filter criteria.</p>
            {(searchQuery || activeFilter !== "All") && (
              <Button 
                variant="link" 
                onClick={() => { setSearchQuery(""); setActiveFilter("All"); }}
                className="text-primary font-bold mt-2"
              >
                Clear all filters
              </Button>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Materials;
