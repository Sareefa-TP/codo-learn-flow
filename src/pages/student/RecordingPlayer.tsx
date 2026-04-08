import { useMemo } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, ArrowLeft } from "lucide-react";

type LocationState = {
  url?: string;
  title?: string;
  meta?: string;
};

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
const isVimeoUrl = (href: string) => /^(https?:\/\/)?(www\.)?vimeo\.com\//i.test(href);

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

const getVimeoEmbedUrl = (href: string) => {
  try {
    const u = new URL(href);
    // Accept /<id> or /video/<id>
    const parts = u.pathname.split("/").filter(Boolean);
    const id = parts[0] === "video" ? parts[1] : parts[0];
    return id ? `https://player.vimeo.com/video/${id}` : null;
  } catch {
    return null;
  }
};

const StudentRecordingPlayer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();

  const state = (location.state ?? {}) as LocationState;
  const safeHref = useMemo(() => getSafeHref(state.url ?? params.get("url")), [state.url, params]);

  const title = state.title ?? "Recording";
  const meta = state.meta ?? "Recorded session";

  const youtubeEmbed = safeHref && isYouTubeUrl(safeHref) ? getYouTubeEmbedUrl(safeHref) : null;
  const vimeoEmbed = safeHref && isVimeoUrl(safeHref) ? getVimeoEmbedUrl(safeHref) : null;

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6 max-w-6xl mx-auto px-4 md:px-6 lg:px-8 pb-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <Card className="border-border/60 bg-card/80 shadow-sm rounded-3xl overflow-hidden">
          <CardHeader className="p-4 sm:p-6 border-b border-border/60 bg-muted/5">
            <div className="min-w-0">
              <CardTitle className="text-base sm:text-lg truncate">{title}</CardTitle>
              <p className="text-xs text-muted-foreground mt-1 truncate">{meta}</p>
            </div>
          </CardHeader>

          <CardContent className="p-4 sm:p-6">
            <div className="flex justify-center">
              <div className="w-full max-w-[900px]">
                <div className="aspect-video rounded-lg overflow-hidden bg-muted/20 border border-border/50 shadow-md">
                  {youtubeEmbed || vimeoEmbed ? (
                    <iframe
                      src={youtubeEmbed ?? vimeoEmbed ?? undefined}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={title}
                    />
                  ) : safeHref && isDirectVideoFile(safeHref) ? (
                    <video src={safeHref} controls className="w-full h-full" />
                  ) : safeHref ? (
                    <div className="h-full w-full flex flex-col items-center justify-center text-center p-6">
                      <PlayCircle className="w-10 h-10 text-muted-foreground/40 mb-3" />
                      <p className="text-sm font-semibold text-foreground">This recording can’t be played inline.</p>
                      <p className="text-xs text-muted-foreground mt-1 max-w-md">
                        This source doesn’t provide an embeddable player. Continue to the recording in the same tab.
                      </p>
                      <Button
                        onClick={() => {
                          window.location.href = safeHref;
                        }}
                        className="mt-4 h-9 text-xs px-6 gap-2 rounded-lg shadow-sm shadow-primary/10"
                      >
                        <PlayCircle className="w-4 h-4 fill-white" />
                        Watch Recorded
                      </Button>
                    </div>
                  ) : (
                    <div className="h-full w-full flex flex-col items-center justify-center text-center p-6">
                      <PlayCircle className="w-10 h-10 text-muted-foreground/40 mb-3" />
                      <p className="text-sm font-semibold text-foreground">No recording available</p>
                      <p className="text-xs text-muted-foreground mt-1 max-w-md">
                        This session does not have a recording link yet.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentRecordingPlayer;

