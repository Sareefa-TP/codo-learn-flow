import { useMemo, useRef, useState, useCallback } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Calendar,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { InternSearchBar } from "@/components/inputs/InternSearchBar";

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
    url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
  { 
    id: "2", 
    title: "Docker & Kubernetes Crash Course", 
    type: "video", 
    uploadedBy: "Sarah Chen", 
    date: "Mar 20, 2026", 
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
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
    url: "https://www.w3schools.com/html/movie.mp4",
  },
  { 
    id: "5", 
    title: "Internship Project Guidelines v2.0", 
    type: "document", 
    uploadedBy: "John Doe", 
    date: "Mar 12, 2026", 
    url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
  { 
    id: "6", 
    title: "Figma Design Assets Library", 
    type: "link", 
    uploadedBy: "Alex Rivera", 
    date: "Mar 10, 2026", 
    url: "https://www.figma.com",
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

const getSafeHref = (raw: string | undefined | null) => {
  const value = (raw ?? "").trim();
  if (!value || value === "#" || value.toLowerCase() === "about:blank") return null;
  if (value.startsWith("/")) return value;
  try {
    const u = new URL(value);
    if (u.protocol === "http:" || u.protocol === "https:") return u.toString();
    return null;
  } catch {
    return null;
  }
};

const isDirectVideoFile = (href: string) => /\.(mp4|webm|ogg)(\?|#|$)/i.test(href);
const isYouTubeUrl = (href: string) => /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(href);

const getYouTubeEmbedUrl = (href: string) => {
  try {
    const u = new URL(href);
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    return null;
  } catch {
    return null;
  }
};

const MaterialActionButton = ({
  href,
  onClick,
  disabledLabel,
  children,
  ...buttonProps
}: {
  href: string | undefined;
  onClick: (safeHref: string) => void;
  disabledLabel: string;
  children: React.ReactNode;
} & Omit<React.ComponentProps<typeof Button>, "onClick">) => {
  const safeHref = getSafeHref(href);

  return (
    <Button
      {...buttonProps}
      onClick={() => safeHref && onClick(safeHref)}
      disabled={!safeHref || buttonProps.disabled}
      title={!safeHref ? disabledLabel : buttonProps.title}
      className={cn(buttonProps.className, !safeHref ? "cursor-not-allowed" : "cursor-pointer")}
    >
      {children}
    </Button>
  );
};

const MaterialCard = ({
  material,
  onWatch,
}: {
  material: Material;
  onWatch: (material: Material) => void;
}) => {
  const navigate = useNavigate();

  const openInSameTab = useCallback(
    (safeHref: string) => {
      if (safeHref.startsWith("/")) {
        navigate(safeHref);
        return;
      }
      window.location.href = safeHref;
    },
    [navigate],
  );

  const downloadInSameTab = useCallback((safeHref: string) => {
    // Uses the browser's download behavior without opening a new tab.
    // Note: cross-origin servers may ignore `download`.
    const a = document.createElement("a");
    a.href = safeHref;
    a.download = material.title || "";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }, [material.title]);

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
              <MaterialActionButton
                size="sm"
                variant="outline"
                className="h-9 text-xs px-4 gap-2 rounded-lg border-border/60 hover:border-primary/40 hover:bg-primary/5"
                href={material.url}
                onClick={openInSameTab}
                disabledLabel="No document available"
              >
                <Eye className="w-4 h-4 text-primary" />
                <span className="hidden sm:inline">View</span>
              </MaterialActionButton>
              <MaterialActionButton
                size="sm"
                className="h-9 text-xs px-4 gap-2 rounded-lg shadow-sm shadow-primary/10"
                href={material.url}
                onClick={downloadInSameTab}
                disabledLabel="No file available to download"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download</span>
                <span className="sm:hidden text-[10px]">Save</span>
              </MaterialActionButton>
            </>
          )}

          {material.type === "video" && (
            <MaterialActionButton
              size="sm"
              className="h-9 text-xs px-6 gap-2 rounded-lg shadow-sm shadow-primary/10"
              href={material.url}
              onClick={() => onWatch(material)}
              disabledLabel="No video link available"
            >
              <PlayCircle className="w-4 h-4 fill-white" />
              <span>Watch Now</span>
            </MaterialActionButton>
          )}

          {material.type === "link" && (
            <MaterialActionButton
              size="sm"
              variant="outline"
              className="h-9 text-xs px-4 gap-2 rounded-lg border-emerald-500/20 bg-emerald-500/5 text-emerald-600 hover:bg-emerald-500/10 hover:border-emerald-500/30"
              href={material.url}
              onClick={openInSameTab}
              disabledLabel="No external link available"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open Link</span>
            </MaterialActionButton>
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
  const [recordedMaterial, setRecordedMaterial] = useState<Material | null>(null);
  const recordedRef = useRef<HTMLDivElement | null>(null);

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

  const handleWatch = useCallback((material: Material) => {
    const safeHref = getSafeHref(material.url);
    if (!safeHref) return;
    setRecordedMaterial(material);
    window.setTimeout(() => recordedRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  }, []);

  const recordedSafeHref = recordedMaterial ? getSafeHref(recordedMaterial.url) : null;
  const recordedYouTubeEmbed = recordedSafeHref && isYouTubeUrl(recordedSafeHref) ? getYouTubeEmbedUrl(recordedSafeHref) : null;

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
        <InternSearchBar
          placeholder="Search materials by title, mentor, or date..."
          value={searchQuery}
          onChange={setSearchQuery}
        />

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

        {/* Recorded Player (appears when a video is selected) */}
        {recordedMaterial && (
          <div ref={recordedRef} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="border-border/60 bg-card/80 shadow-sm rounded-3xl overflow-hidden">
              <CardHeader className="p-4 sm:p-6 border-b border-border/60 bg-muted/5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <CardTitle className="text-base sm:text-lg truncate">Recorded</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {recordedMaterial.title} • {recordedMaterial.uploadedBy} • {recordedMaterial.date}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setRecordedMaterial(null)}
                    className="h-10 w-10 rounded-2xl border-border/60 bg-card shadow-sm shrink-0 hover:bg-muted/30"
                    aria-label="Close recorded player"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-4 sm:p-6">
                <div className="flex justify-center">
                  <div className="w-full max-w-[900px]">
                    <div className="aspect-video rounded-lg overflow-hidden bg-muted/20 border border-border/50 shadow-md">
                      {recordedYouTubeEmbed ? (
                        <iframe
                          src={recordedYouTubeEmbed}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title={recordedMaterial.title}
                        />
                      ) : recordedSafeHref && isDirectVideoFile(recordedSafeHref) ? (
                        <video src={recordedSafeHref} controls className="w-full h-full" />
                      ) : recordedSafeHref ? (
                        <div className="h-full w-full flex flex-col items-center justify-center text-center p-6">
                          <PlayCircle className="w-10 h-10 text-muted-foreground/40 mb-3" />
                          <p className="text-sm font-semibold text-foreground">This video can’t be embedded here.</p>
                          <p className="text-xs text-muted-foreground mt-1 max-w-md">
                            The source doesn’t provide an embeddable player. Use “Watch Now” to navigate in the same tab.
                          </p>
                          <Button
                            onClick={() => (window.location.href = recordedSafeHref)}
                            className="mt-4 h-9 text-xs px-6 gap-2 rounded-lg shadow-sm shadow-primary/10"
                          >
                            <PlayCircle className="w-4 h-4 fill-white" />
                            Watch Now
                          </Button>
                        </div>
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-sm text-muted-foreground">
                          Video source missing.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Content Section */}
        {filteredMaterials.length > 0 ? (
          <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {filteredMaterials.map(material => (
              <MaterialCard key={material.id} material={material} onWatch={handleWatch} />
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
