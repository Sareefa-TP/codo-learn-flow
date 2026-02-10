import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { integrations as initialIntegrations, IntegrationStatus } from "@/data/superAdminData";
import { Video, HardDrive, CreditCard, MessageSquare, CheckCircle2, XCircle, AlertTriangle, Link2 } from "lucide-react";
import { toast } from "sonner";

const providerIcons: Record<string, React.ElementType> = {
  google_meet: Video,
  google_drive: HardDrive,
  razorpay: CreditCard,
  whatsapp: MessageSquare,
};

const statusConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  connected: { icon: CheckCircle2, color: "text-primary", label: "Connected" },
  disconnected: { icon: XCircle, color: "text-muted-foreground", label: "Disconnected" },
  error: { icon: AlertTriangle, color: "text-destructive", label: "Error" },
};

const SuperAdminIntegrations = () => {
  const [integrations, setIntegrations] = useState<IntegrationStatus[]>(() => JSON.parse(JSON.stringify(initialIntegrations)));

  const toggleConnection = (id: string) => {
    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, status: i.status === "connected" ? "disconnected" : "connected", lastSync: i.status !== "connected" ? new Date().toISOString().slice(0, 16).replace("T", " ") : i.lastSync }
          : i
      )
    );
    toast.success("Integration status updated");
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-semibold text-foreground tracking-tight">Integrations</h1>
          <p className="text-muted-foreground mt-1">Manage third-party service connections</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {integrations.map((integration) => {
            const Icon = providerIcons[integration.provider] || Link2;
            const status = statusConfig[integration.status];
            const StatusIcon = status.icon;
            return (
              <Card key={integration.id} className="border border-border/60 shadow-card">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-muted">
                        <Icon className="w-5 h-5 text-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{integration.name}</h3>
                        <div className={`flex items-center gap-1 text-xs ${status.color}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          <span>{status.label}</span>
                        </div>
                      </div>
                    </div>
                    <Switch
                      checked={integration.status === "connected"}
                      onCheckedChange={() => toggleConnection(integration.id)}
                    />
                  </div>
                  {integration.lastSync && (
                    <p className="text-xs text-muted-foreground">Last synced: {integration.lastSync}</p>
                  )}
                  {!integration.apiKeySet && (
                    <div className="mt-3 p-3 rounded-lg bg-warning-muted border border-warning/20">
                      <p className="text-xs text-warning-foreground">API key not configured. Add your key in System Settings.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SuperAdminIntegrations;
