import DashboardLayout from "@/components/DashboardLayout";
import { useLocation, useNavigate } from "react-router-dom";
import { BookOpen, ExternalLink, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BackButton from "@/components/shared/BackButton";

interface NoteItem {
  id: number | string;
  title: string;
  link: string;
}

interface NotesLocationState {
  notes?: NoteItem[];
  sessionTitle?: string;
  moduleTitle?: string;
  courseTitle?: string;
}

export default function StudentNotes() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state || {}) as NotesLocationState;

  const notes = state.notes || [];

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 pb-10 md:px-6 lg:px-8">
        <div className="space-y-4">
          <BackButton label="Back" onClick={() => navigate(-1)} />
          <div>
            <h1 className="text-3xl font-display text-foreground">Study Notes</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {state.courseTitle ? `${state.courseTitle} • ` : ""}
              {state.moduleTitle ? `${state.moduleTitle} • ` : ""}
              {state.sessionTitle || "Session Notes"}
            </p>
          </div>
        </div>

        <Card className="card-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <BookOpen className="h-5 w-5 text-primary" />
              All Notes ({notes.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {notes.length > 0 ? (
              notes.map((note) => (
                <div
                  key={note.id}
                  className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-card/70 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                      <FileText className="h-4 w-4" />
                    </div>
                    <p className="truncate text-sm font-semibold text-foreground">{note.title}</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full sm:w-auto"
                    onClick={() => window.open(note.link, "_blank")}
                  >
                    View Note
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-border/70 bg-muted/20 p-8 text-center text-sm text-muted-foreground">
                No notes found for this session.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
