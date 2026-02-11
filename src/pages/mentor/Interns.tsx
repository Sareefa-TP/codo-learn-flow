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
import { Search, CheckCircle2, RotateCcw, Clock, Eye } from "lucide-react";
import { mentees, internTasks as initialTasks, InternTask } from "@/data/mentorData";
import { toast } from "sonner";

const MentorInterns = () => {
  const [search, setSearch] = useState("");
  const [tasks, setTasks] = useState<InternTask[]>(() => JSON.parse(JSON.stringify(initialTasks)));
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewTask, setReviewTask] = useState<InternTask | null>(null);
  const [feedback, setFeedback] = useState("");

  const interns = mentees.filter((m) => m.type === "intern");
  const filtered = interns.filter((i) => `${i.name} ${i.course}`.toLowerCase().includes(search.toLowerCase()));

  const openReview = (task: InternTask) => {
    setReviewTask(task);
    setFeedback(task.feedback || "");
    setReviewOpen(true);
  };

  const handleApprove = () => {
    if (!reviewTask) return;
    setTasks((prev) => prev.map((t) => t.id === reviewTask.id ? { ...t, status: "approved" as const, completion: 100, feedback } : t));
    toast.success(`Task approved for ${reviewTask.internName}`);
    setReviewOpen(false);
  };

  const handleRevision = () => {
    if (!reviewTask || !feedback) return;
    setTasks((prev) => prev.map((t) => t.id === reviewTask.id ? { ...t, status: "revision" as const, feedback } : t));
    toast.info(`Revision requested from ${reviewTask.internName}`);
    setReviewOpen(false);
  };

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      pending: "bg-muted text-muted-foreground",
      in_progress: "bg-primary/10 text-primary",
      submitted: "bg-warning/10 text-warning",
      approved: "bg-primary/15 text-primary",
      revision: "bg-destructive/10 text-destructive",
    };
    return <Badge variant="secondary" className={`${map[status] || ""} border-0 capitalize text-xs`}>{status.replace("_", " ")}</Badge>;
  };

  const menteeStatus = (status: string) => {
    const map: Record<string, string> = {
      "on-track": "bg-primary/10 text-primary",
      "ahead": "bg-primary/15 text-primary",
      "at-risk": "bg-destructive/10 text-destructive",
      "needs-attention": "bg-warning/10 text-warning",
    };
    return map[status] || "bg-muted text-muted-foreground";
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Interns</h1>
            <p className="text-muted-foreground mt-1">Guide and review your assigned interns' tasks</p>
          </div>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search interns..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filtered.map((intern, index) => {
            const internTaskList = tasks.filter((t) => t.internId === intern.id);
            return (
              <Card key={intern.id} className="border border-border/60 shadow-card opacity-0 animate-fade-in" style={{ animationDelay: `${index * 60}ms` }}>
                <CardContent className="p-5">
                  {/* Intern Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-role-intern/10 text-role-intern font-medium">
                          {intern.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{intern.name}</h3>
                        <p className="text-xs text-muted-foreground">{intern.course}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className={`${menteeStatus(intern.status)} border-0 text-xs capitalize`}>
                      {intern.status.replace("-", " ")}
                    </Badge>
                  </div>

                  {/* Overall Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Overall Completion</span>
                      <span className="font-semibold">{intern.progress}%</span>
                    </div>
                    <Progress value={intern.progress} className="h-2" />
                  </div>

                  {/* Tasks */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Tasks</p>
                    {internTaskList.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/30">
                        <div className="flex-1 min-w-0 mr-3">
                          <p className="text-sm font-medium truncate">{task.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {statusBadge(task.status)}
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {task.deadline}
                            </span>
                          </div>
                        </div>
                        {task.status === "submitted" && (
                          <Button variant="outline" size="sm" onClick={() => openReview(task)}>
                            <Eye className="w-3.5 h-3.5 mr-1" /> Review
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Quick stats */}
                  <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border/50 text-sm">
                    <span className="text-muted-foreground">Attendance: <span className={`font-medium ${intern.attendance < 80 ? "text-destructive" : "text-foreground"}`}>{intern.attendance}%</span></span>
                    <span className="text-muted-foreground">Active: <span className="text-foreground">{intern.lastActive}</span></span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Task Review Dialog */}
        <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
          <DialogContent className="sm:max-w-[520px] rounded-xl">
            <DialogHeader>
              <DialogTitle>Review Task: {reviewTask?.title}</DialogTitle>
            </DialogHeader>
            {reviewTask && (
              <div className="space-y-4 py-2">
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-sm">{reviewTask.description}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <span>By: {reviewTask.internName}</span>
                    <span>·</span>
                    <span>Submitted: {reviewTask.submittedDate}</span>
                    <span>·</span>
                    <span>Deadline: {reviewTask.deadline}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Feedback</Label>
                  <Textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Provide feedback on this submission..." rows={3} />
                </div>
              </div>
            )}
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setReviewOpen(false)}>Cancel</Button>
              <Button variant="outline" onClick={handleRevision} disabled={!feedback} className="text-destructive border-destructive/30 hover:bg-destructive/10">
                <RotateCcw className="w-4 h-4 mr-1" /> Request Revision
              </Button>
              <Button onClick={handleApprove} className="gap-1">
                <CheckCircle2 className="w-4 h-4" /> Approve
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default MentorInterns;
