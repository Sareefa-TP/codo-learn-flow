import { useMemo, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Megaphone, ShieldAlert, Sparkles, Clock3 } from "lucide-react";
import { cn } from "@/lib/utils";

type NotificationType = "updates" | "important";

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  time: string;
  type: NotificationType;
  unread: boolean;
};

const initialNotifications: NotificationItem[] = [
  {
    id: "N-201",
    title: "Assignment deadline updated",
    message: "React hooks assignment is now due by Tuesday, 11:59 PM.",
    time: "10 min ago",
    type: "updates",
    unread: true,
  },
  {
    id: "N-202",
    title: "Important: Live session rescheduled",
    message: "Tomorrow's DSA session moved to 7:30 PM due to mentor availability.",
    time: "35 min ago",
    type: "important",
    unread: true,
  },
  {
    id: "N-203",
    title: "New module material added",
    message: "Week 6 notes and examples are now available under Materials.",
    time: "2 hours ago",
    type: "updates",
    unread: false,
  },
  {
    id: "N-204",
    title: "Fee reminder",
    message: "Your next installment is due in 3 days. Please review wallet details.",
    time: "Yesterday",
    type: "important",
    unread: false,
  },
];

const StudentNotifications = () => {
  const [activeTab, setActiveTab] = useState<"all" | NotificationType>("all");
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  const counts = useMemo(
    () => ({
      all: notifications.length,
      updates: notifications.filter((n) => n.type === "updates").length,
      important: notifications.filter((n) => n.type === "important").length,
      unread: notifications.filter((n) => n.unread).length,
    }),
    [notifications],
  );

  const filteredNotifications = useMemo(() => {
    if (activeTab === "all") return notifications;
    return notifications.filter((n) => n.type === activeTab);
  }, [activeTab, notifications]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, unread: false })));
  };

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-5xl space-y-4 sm:space-y-6">
        <Card className="border-border/60 bg-card/80 shadow-sm">
          <CardHeader className="space-y-4 border-b border-border/60 p-4 pb-4 sm:p-6 sm:pb-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-primary/15 bg-primary/10 text-primary">
                    <Bell className="h-5 w-5" />
                  </span>
                  Notifications
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Stay on top of updates and important alerts from your learning dashboard.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs">
                  {counts.unread} unread
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full rounded-xl sm:w-auto"
                  onClick={markAllRead}
                  disabled={counts.unread === 0}
                >
                  Mark all read
                </Button>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "all" | NotificationType)}>
              <TabsList className="no-scrollbar flex h-auto w-full justify-start gap-1.5 overflow-x-auto rounded-2xl border border-border/50 bg-background p-1.5 sm:grid sm:grid-cols-3 sm:justify-stretch sm:overflow-visible">
                <TabsTrigger value="all" className="min-w-[120px] rounded-xl sm:min-w-0">
                  All ({counts.all})
                </TabsTrigger>
                <TabsTrigger value="updates" className="min-w-[120px] rounded-xl sm:min-w-0">
                  Updates ({counts.updates})
                </TabsTrigger>
                <TabsTrigger value="important" className="min-w-[130px] rounded-xl sm:min-w-0">
                  Important ({counts.important})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <CardContent className="p-0">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 px-4 py-12 text-center text-muted-foreground">
                <Sparkles className="h-6 w-6 text-primary/70" />
                <p className="font-medium text-foreground">You are all caught up.</p>
                <p className="text-sm">New notifications will appear here.</p>
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {filteredNotifications.map((notification) => (
                  <article
                    key={notification.id}
                    className={cn(
                      "flex gap-3 px-4 py-4 sm:px-6",
                      notification.unread && "bg-primary/5",
                    )}
                  >
                    <div
                      className={cn(
                        "mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border",
                        notification.type === "important"
                          ? "border-rose-500/20 bg-rose-500/10 text-rose-600"
                          : "border-primary/20 bg-primary/10 text-primary",
                      )}
                    >
                      {notification.type === "important" ? (
                        <ShieldAlert className="h-4 w-4" />
                      ) : (
                        <Megaphone className="h-4 w-4" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-semibold text-foreground">{notification.title}</h3>
                        {notification.unread && (
                          <Badge className="rounded-full bg-primary/15 text-primary hover:bg-primary/15">
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                      <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock3 className="h-3 w-3" />
                        {notification.time}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentNotifications;
