import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Shield, Users, FileText, CreditCard, BarChart3, Settings2 } from "lucide-react";
import { toast } from "sonner";

interface PermissionToggle {
  key: string;
  label: string;
  description: string;
  icon: React.ElementType;
  enabled: boolean;
}

const SuperAdminSettings = () => {
  const [permissions, setPermissions] = useState<PermissionToggle[]>([
    { key: "view_finance", label: "View Finance Data", description: "Allow Admins to see financial reports", icon: CreditCard, enabled: true },
    { key: "manage_students", label: "Manage Students", description: "Allow Admins to add/edit/delete students", icon: Users, enabled: true },
    { key: "manage_courses", label: "Manage Courses", description: "Allow Admins to create/edit courses", icon: FileText, enabled: false },
    { key: "view_reports", label: "View Reports", description: "Allow Admins to access analytics", icon: BarChart3, enabled: true },
    { key: "manage_integrations", label: "Manage Integrations", description: "Allow Admins to configure third-party services", icon: Settings2, enabled: false },
  ]);

  const togglePermission = (key: string) => {
    setPermissions((prev) =>
      prev.map((p) => (p.key === key ? { ...p, enabled: !p.enabled } : p))
    );
    toast.success("Permission updated");
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-semibold text-foreground tracking-tight">System Settings</h1>
          <p className="text-muted-foreground mt-1">Configure platform-wide settings and permissions</p>
        </div>

        <Card className="border border-border/60 shadow-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <CardTitle className="text-base">Admin Role Permissions</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">Control what lower-level Admins can access</p>
          </CardHeader>
          <CardContent className="space-y-1">
            {permissions.map((perm, i) => {
              const Icon = perm.icon;
              return (
                <div key={perm.key}>
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-muted">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{perm.label}</p>
                        <p className="text-xs text-muted-foreground">{perm.description}</p>
                      </div>
                    </div>
                    <Switch checked={perm.enabled} onCheckedChange={() => togglePermission(perm.key)} />
                  </div>
                  {i < permissions.length - 1 && <Separator />}
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="border border-border/60 shadow-card">
          <CardHeader>
            <CardTitle className="text-base">General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Default Currency</p>
                <p className="text-xs text-muted-foreground">Used across all financial modules</p>
              </div>
              <Badge variant="secondary">₹ INR</Badge>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Academic Year</p>
                <p className="text-xs text-muted-foreground">Current academic cycle</p>
              </div>
              <Badge variant="outline">2024-2025</Badge>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Timezone</p>
                <p className="text-xs text-muted-foreground">Platform-wide timezone setting</p>
              </div>
              <Badge variant="outline">IST (UTC+5:30)</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SuperAdminSettings;
