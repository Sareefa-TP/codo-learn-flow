import { useMemo, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StandardModal } from "@/components/modals/StandardModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Edit, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Gender = "Male" | "Female" | "Other" | "Prefer not to say";

const GENDERS: Gender[] = ["Male", "Female", "Other", "Prefer not to say"];

const initialAdvisor = {
  name: "Alex Johnson",
  email: "alex@example.com",
  phone: "9876543210",
  gender: "Male" as Gender,
  address: "Calicut, Kerala",
};

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "A";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

export default function AdvisorProfile() {
  const [advisor, setAdvisor] = useState(initialAdvisor);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [draft, setDraft] = useState(initialAdvisor);

  const initials = useMemo(() => getInitials(advisor.name), [advisor.name]);

  const openEdit = () => {
    setDraft(advisor);
    setIsEditOpen(true);
  };

  const closeEdit = () => {
    setIsEditOpen(false);
    setConfirmOpen(false);
    setIsSaving(false);
    setDraft(advisor);
  };

  const canSave = draft.phone.trim().length > 0 && draft.address.trim().length > 0 && !isSaving;

  const handleRequestSave = () => {
    if (!canSave) return;
    setConfirmOpen(true);
  };

  const handleConfirmSave = async () => {
    if (!canSave) return;
    setIsSaving(true);

    // UI-only save simulation
    await new Promise((r) => setTimeout(r, 500));
    setAdvisor((prev) => ({
      ...prev,
      phone: draft.phone.trim(),
      address: draft.address.trim(),
    }));
    toast.success("Profile updated", { description: "Your changes were saved." });
    closeEdit();
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6 max-w-6xl mx-auto px-4 md:px-6 lg:px-8 pb-10">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
              My Profile
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              View and manage your profile
            </p>
          </div>
        </div>

        <Card className="border-border/50 shadow-sm rounded-2xl overflow-hidden bg-background">
          <CardHeader className="px-6 pt-6 pb-3 border-b border-border/40 bg-muted/10">
            <div className="flex items-start justify-between gap-4">
              <CardTitle className="text-lg font-bold">Profile</CardTitle>
              <Button
                type="button"
                className="h-10 rounded-xl px-5 gap-2 font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
                onClick={openEdit}
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 shadow-inner overflow-hidden">
                <span className="text-lg font-black text-primary">{initials}</span>
              </div>
              <div className="min-w-0">
                <p className="text-lg font-bold text-foreground truncate">
                  {advisor.name}
                </p>
                <p className="text-sm text-muted-foreground font-semibold">
                  Advisor
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Name
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {advisor.name}
                </p>
              </div>
              <div className="space-y-1.5">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Email
                </p>
                <p className="text-sm font-semibold text-foreground break-words">
                  {advisor.email}
                </p>
              </div>
              <div className="space-y-1.5">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Phone Number
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {advisor.phone}
                </p>
              </div>
              <div className="space-y-1.5">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Gender
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {advisor.gender}
                </p>
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Address
                </p>
                <p className="text-sm font-semibold text-foreground whitespace-normal break-words">
                  {advisor.address}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <StandardModal
          open={isEditOpen}
          onOpenChange={(open) => {
            if (!open) closeEdit();
            else setIsEditOpen(true);
          }}
          title="Edit Profile"
          subtitle="Only phone number and address can be updated."
          minHeightClassName="min-h-[520px]"
          footer={
            <div className="flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl px-6"
                onClick={closeEdit}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="rounded-xl px-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
                onClick={handleRequestSave}
                disabled={!canSave}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="advisor-name" className="text-sm font-semibold">
                Name
              </Label>
              <Input
                id="advisor-name"
                value={draft.name}
                disabled
                className="rounded-xl h-11 bg-muted/40 cursor-not-allowed"
                autoComplete="name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="advisor-email" className="text-sm font-semibold">
                Email
              </Label>
              <Input
                id="advisor-email"
                value={draft.email}
                disabled
                className="rounded-xl h-11 bg-muted/40 cursor-not-allowed"
                inputMode="email"
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="advisor-phone" className="text-sm font-semibold">
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="advisor-phone"
                value={draft.phone}
                onChange={(e) => setDraft((p) => ({ ...p, phone: e.target.value }))}
                className="rounded-xl h-11"
                inputMode="tel"
                autoComplete="tel"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="advisor-gender" className="text-sm font-semibold">
                Gender
              </Label>
              <Select
                value={draft.gender}
                onValueChange={() => {}}
                disabled
              >
                <SelectTrigger
                  id="advisor-gender"
                  className="h-11 rounded-xl bg-muted/40 border border-border/50 cursor-not-allowed"
                >
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/40 shadow-xl">
                  {GENDERS.map((g) => (
                    <SelectItem key={g} value={g} className="rounded-lg">
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="advisor-address" className="text-sm font-semibold">
                Address <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="advisor-address"
                value={draft.address}
                onChange={(e) => setDraft((p) => ({ ...p, address: e.target.value }))}
                className="min-h-[120px] resize-none rounded-xl"
                placeholder="Enter your address..."
              />
            </div>
          </div>
        </StandardModal>

        <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <AlertDialogContent className="rounded-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Save profile changes?</AlertDialogTitle>
              <AlertDialogDescription>
                This will update your profile information (UI only).
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isSaving} className="rounded-xl">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                disabled={!canSave}
                onClick={(e) => {
                  e.preventDefault();
                  void handleConfirmSave();
                }}
                className={cn(
                  "rounded-xl bg-primary text-primary-foreground hover:bg-primary/90",
                )}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
}

