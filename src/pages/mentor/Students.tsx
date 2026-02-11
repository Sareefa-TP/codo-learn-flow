import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Search, MessageSquare, TrendingUp, FileText } from "lucide-react";
import { mentees, menteeNotes as initialNotes, MenteeNote } from "@/data/mentorData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const MentorStudents = () => {
  const [search, setSearch] = useState("");
  const [notes, setNotes] = useState<MenteeNote[]>(() => JSON.parse(JSON.stringify(initialNotes)));
  const [noteOpen, setNoteOpen] = useState(false);
  const [selectedMentee, setSelectedMentee] = useState<typeof mentees[0] | null>(null);
  const [noteForm, setNoteForm] = useState({ type: "observation" as MenteeNote["type"], content: "" });

  const students = mentees.filter((m) => m.type === "student");
  const filtered = students.filter((s) => `${s.name} ${s.course}`.toLowerCase().includes(search.toLowerCase()));

  const openNote = (mentee: typeof mentees[0]) => {
    setSelectedMentee(mentee);
    setNoteForm({ type: "observation", content: "" });
    setNoteOpen(true);
  };

  const handleSaveNote = () => {
    if (!selectedMentee || !noteForm.content) return;
    const newNote: MenteeNote = {
      id: `NOTE${String(notes.length + 1).padStart(3, "0")}`,
      menteeId: selectedMentee.id,
      menteeName: selectedMentee.name,
      type: noteForm.type,
      content: noteForm.content,
      createdDate: new Date().toISOString().slice(0, 10),
    };
    setNotes((prev) => [newNote, ...prev]);
    toast.success(`Note added for ${selectedMentee.name}`);
    setNoteOpen(false);
  };

  const statusColor = (status: string) => {
    const map: Record<string, string> = {
      "on-track": "bg-primary/10 text-primary",
      "ahead": "bg-primary/15 text-primary",
      "at-risk": "bg-destructive/10 text-destructive",
      "needs-attention": "bg-warning/10 text-warning",
    };
    return map[status] || "bg-muted text-muted-foreground";
  };

  const noteTypeColor = (type: string) => {
    const map: Record<string, string> = { growth: "bg-primary/10 text-primary", career: "bg-role-intern/10 text-role-intern", observation: "bg-muted text-muted-foreground", concern: "bg-destructive/10 text-destructive" };
    return map[type] || "";
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Students</h1>
            <p className="text-muted-foreground mt-1">Monitor and support your assigned students</p>
          </div>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search students..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((student, index) => {
            const studentNotes = notes.filter((n) => n.menteeId === student.id);
            return (
              <Card key={student.id} className="hover:shadow-md transition-shadow opacity-0 animate-fade-in border border-border/60" style={{ animationDelay: `${index * 50}ms` }}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {student.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{student.name}</h3>
                        <p className="text-xs text-muted-foreground">{student.course}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className={`${statusColor(student.status)} border-0 text-xs capitalize`}>
                      {student.status.replace("-", " ")}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">Course Progress</span>
                        <span className="text-xs font-medium">{student.progress}%</span>
                      </div>
                      <Progress value={student.progress} className="h-2" />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Attendance</span>
                      <span className={`font-medium ${student.attendance < 80 ? "text-destructive" : ""}`}>{student.attendance}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Last Active</span>
                      <span className="text-xs">{student.lastActive}</span>
                    </div>
                    {studentNotes.length > 0 && (
                      <div className="pt-2 border-t border-border/50">
                        <p className="text-xs text-muted-foreground mb-1">Latest Note:</p>
                        <p className="text-xs bg-muted/50 p-2 rounded line-clamp-2">{studentNotes[0].content}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/50">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => openNote(student)}>
                      <FileText className="w-3.5 h-3.5 mr-1.5" /> Add Note
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1">
                      <TrendingUp className="w-3.5 h-3.5 mr-1.5" /> Progress
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Add Note Dialog */}
        <Dialog open={noteOpen} onOpenChange={setNoteOpen}>
          <DialogContent className="sm:max-w-[480px] rounded-xl">
            <DialogHeader>
              <DialogTitle>Add Note for {selectedMentee?.name}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="space-y-2">
                <Label>Note Type</Label>
                <Select value={noteForm.type} onValueChange={(v) => setNoteForm({ ...noteForm, type: v as MenteeNote["type"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="growth">Growth</SelectItem>
                    <SelectItem value="career">Career Advice</SelectItem>
                    <SelectItem value="observation">Observation</SelectItem>
                    <SelectItem value="concern">Concern</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Note</Label>
                <Textarea value={noteForm.content} onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })} placeholder="Write your observation or guidance..." rows={4} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNoteOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveNote} disabled={!noteForm.content}>Save Note</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default MentorStudents;
