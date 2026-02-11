import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { MessageSquare, Star, Send } from "lucide-react";
import { mentees } from "@/data/mentorData";
import { toast } from "sonner";

interface FeedbackItem {
  id: string;
  menteeName: string;
  menteeId: string;
  rating: number;
  content: string;
  date: string;
  type: "positive" | "constructive" | "milestone";
}

const initialFeedback: FeedbackItem[] = [
  { id: "FB001", menteeName: "Diya Krishnan", menteeId: "STU002", rating: 5, content: "Outstanding work on the ML pipeline project. Your code quality and documentation are exemplary.", date: "2025-02-10", type: "positive" },
  { id: "FB002", menteeName: "Meera Bhat", menteeId: "STU006", rating: 3, content: "Need to focus more on React fundamentals. Suggest reviewing hooks documentation and completing practice exercises.", date: "2025-02-09", type: "constructive" },
  { id: "FB003", menteeName: "Varun Choudhary", menteeId: "INT003", rating: 5, content: "Congratulations on completing the mobile app redesign ahead of schedule. Your UX skills are impressive.", date: "2025-02-08", type: "milestone" },
  { id: "FB004", menteeName: "Ananya Pillai", menteeId: "INT002", rating: 2, content: "Task completion rate needs improvement. Let's schedule more frequent check-ins to identify blockers early.", date: "2025-02-07", type: "constructive" },
  { id: "FB005", menteeName: "Sneha Iyer", menteeId: "STU004", rating: 4, content: "Great leadership in study groups. Consider taking on more complex projects to push your boundaries.", date: "2025-02-06", type: "positive" },
];

const MentorFeedback = () => {
  const [feedback, setFeedback] = useState<FeedbackItem[]>(initialFeedback);
  const [sendOpen, setSendOpen] = useState(false);
  const [form, setForm] = useState({ menteeId: "", rating: "4", content: "", type: "positive" as FeedbackItem["type"] });

  const handleSend = () => {
    const mentee = mentees.find((m) => m.id === form.menteeId);
    if (!mentee || !form.content) return;
    const newFeedback: FeedbackItem = {
      id: `FB${String(feedback.length + 1).padStart(3, "0")}`,
      menteeName: mentee.name,
      menteeId: form.menteeId,
      rating: parseInt(form.rating),
      content: form.content,
      date: new Date().toISOString().slice(0, 10),
      type: form.type,
    };
    setFeedback((prev) => [newFeedback, ...prev]);
    toast.success(`Feedback sent to ${mentee.name}`);
    setSendOpen(false);
    setForm({ menteeId: "", rating: "4", content: "", type: "positive" });
  };

  const typeColor = (type: string) => {
    const map: Record<string, string> = { positive: "bg-primary/10 text-primary", constructive: "bg-warning/10 text-warning", milestone: "bg-role-intern/10 text-role-intern" };
    return map[type] || "";
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-semibold text-foreground tracking-tight">Feedback</h1>
            <p className="text-muted-foreground mt-1">Provide and review feedback for your mentees</p>
          </div>
          <Button size="sm" className="gap-2" onClick={() => setSendOpen(true)}>
            <Send className="w-4 h-4" /> Give Feedback
          </Button>
        </div>

        <div className="space-y-4">
          {feedback.map((item, index) => (
            <Card key={item.id} className="border border-border/60 shadow-card opacity-0 animate-fade-in" style={{ animationDelay: `${index * 40}ms` }}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium">{item.menteeName}</p>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < item.rating ? "fill-warning text-warning" : "text-muted"}`} />
                      ))}
                    </div>
                    <Badge variant="secondary" className={`${typeColor(item.type)} border-0 capitalize text-xs`}>
                      {item.type}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-foreground leading-relaxed">{item.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Send Feedback Dialog */}
        <Dialog open={sendOpen} onOpenChange={setSendOpen}>
          <DialogContent className="sm:max-w-[480px] rounded-xl">
            <DialogHeader>
              <DialogTitle>Give Feedback</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="space-y-2">
                <Label>Mentee</Label>
                <Select value={form.menteeId} onValueChange={(v) => setForm({ ...form, menteeId: v })}>
                  <SelectTrigger><SelectValue placeholder="Select mentee" /></SelectTrigger>
                  <SelectContent>
                    {mentees.map((m) => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as FeedbackItem["type"] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="positive">Positive</SelectItem>
                      <SelectItem value="constructive">Constructive</SelectItem>
                      <SelectItem value="milestone">Milestone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Rating</Label>
                  <Select value={form.rating} onValueChange={(v) => setForm({ ...form, rating: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((r) => <SelectItem key={r} value={r.toString()}>{r} Star{r > 1 ? "s" : ""}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Feedback</Label>
                <Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Write your feedback..." rows={4} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSendOpen(false)}>Cancel</Button>
              <Button onClick={handleSend} disabled={!form.menteeId || !form.content}>Send Feedback</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default MentorFeedback;
