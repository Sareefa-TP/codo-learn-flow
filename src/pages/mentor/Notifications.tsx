import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Bell, Send, Clock } from "lucide-react";
import { mentees, mentorActivityLog as initialLog, MentorNotification } from "@/data/mentorData";
import { toast } from "sonner";

const activityTypeIcon: Record<string, string> = {
  task: "📋",
  attendance: "📊",
  progress: "🚀",
  system: "⚙️",
};

const MentorNotifications = () => {
  const [notifications, setNotifications] = useState<MentorNotification[]>(() => JSON.parse(JSON.stringify(initialLog)));
  const [sendOpen, setSendOpen] = useState(false);
  const [sendForm, setSendForm] = useState({ target: "all", menteeId: "", message: "" });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  const handleSend = () => {
    if (!sendForm.message) return;
    const target = sendForm.target === "all" ? "All Mentees" : mentees.find((m) => m.id === sendForm.menteeId)?.name || "Unknown";
    const newNotification: MentorNotification = {
      id: `MACT${String(notifications.length + 1).padStart(3, "0")}`,
      type: "system",
      message: `Sent to ${target}: ${sendForm.message}`,
      timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
      read: true,
    };
    setNotifications((prev) => [newNotification, ...prev]);
    toast.success(`Notification sent to ${target}`);
    setSendOpen(false);
    setSendForm({ target: "all", menteeId: "", message: "" });
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-semibold text-foreground tracking-tight">Notifications</h1>
            <p className="text-muted-foreground mt-1">
              Stay updated with mentee activities · {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
            </p>
          </div>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllRead}>Mark all read</Button>
            )}
            <Button size="sm" className="gap-2" onClick={() => setSendOpen(true)}>
              <Send className="w-4 h-4" /> Send Notification
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <Card className="border border-border/60 shadow-card">
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`px-5 py-4 flex items-start gap-3 hover:bg-muted/30 transition-colors cursor-pointer ${!notif.read ? "bg-primary/5" : ""}`}
                  onClick={() => markRead(notif.id)}
                >
                  <span className="text-lg mt-0.5">{activityTypeIcon[notif.type]}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!notif.read ? "font-medium text-foreground" : "text-foreground"}`}>{notif.message}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" /> {notif.timestamp}
                      {notif.menteeName && <span>· {notif.menteeName}</span>}
                    </p>
                  </div>
                  {!notif.read && <span className="w-2.5 h-2.5 rounded-full bg-primary mt-1.5 shrink-0" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Send Notification Dialog */}
        <Dialog open={sendOpen} onOpenChange={setSendOpen}>
          <DialogContent className="sm:max-w-[480px] rounded-xl">
            <DialogHeader>
              <DialogTitle>Send Notification</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="space-y-2">
                <Label>Send To</Label>
                <Select value={sendForm.target} onValueChange={(v) => setSendForm({ ...sendForm, target: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Mentees</SelectItem>
                    <SelectItem value="individual">Individual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {sendForm.target === "individual" && (
                <div className="space-y-2">
                  <Label>Select Mentee</Label>
                  <Select value={sendForm.menteeId} onValueChange={(v) => setSendForm({ ...sendForm, menteeId: v })}>
                    <SelectTrigger><SelectValue placeholder="Choose mentee" /></SelectTrigger>
                    <SelectContent>
                      {mentees.map((m) => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea value={sendForm.message} onChange={(e) => setSendForm({ ...sendForm, message: e.target.value })} placeholder="Type your message..." rows={3} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSendOpen(false)}>Cancel</Button>
              <Button onClick={handleSend} disabled={!sendForm.message || (sendForm.target === "individual" && !sendForm.menteeId)} className="gap-1">
                <Send className="w-4 h-4" /> Send
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default MentorNotifications;
