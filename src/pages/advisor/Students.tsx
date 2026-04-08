import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InternSearchBar } from "@/components/inputs/InternSearchBar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StandardModal } from "@/components/modals/StandardModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
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
import { Users, ChevronLeft, ChevronRight, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type AdvisorStudent = {
  name: string;
  email: string;
  phone: string;
  gender: "Male" | "Female" | "Other" | "Prefer not to say";
  address: string;
};

const MOCK_STUDENTS: AdvisorStudent[] = [
  {
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 555 010 1001",
    gender: "Male",
    address: "12 Market Street, Springfield",
  },
  {
    name: "Emily Chen",
    email: "emily.chen@example.com",
    phone: "+1 555 010 1002",
    gender: "Female",
    address: "48 Lakeview Ave, San Jose",
  },
  {
    name: "Marcus Johnson",
    email: "marcus.j@example.com",
    phone: "+1 555 010 1003",
    gender: "Male",
    address: "221B Baker Street, Austin",
  },
  {
    name: "Priya Sharma",
    email: "priya.s@example.com",
    phone: "+1 555 010 1004",
    gender: "Female",
    address: "77 Palm Road, Seattle",
  },
  {
    name: "Liam O'Brien",
    email: "liam.obrien@example.com",
    phone: "+1 555 010 1005",
    gender: "Male",
    address: "5 Riverbank, Boston",
  },
  {
    name: "Aisha Khan",
    email: "aisha.k@example.com",
    phone: "+1 555 010 1006",
    gender: "Female",
    address: "9 Orchid Lane, Chicago",
  },
  {
    name: "Noah Williams",
    email: "noah.w@example.com",
    phone: "+1 555 010 1007",
    gender: "Male",
    address: "1600 Elm Street, Denver",
  },
  {
    name: "Sofia Martinez",
    email: "sofia.m@example.com",
    phone: "+1 555 010 1008",
    gender: "Female",
    address: "34 Sunset Blvd, Miami",
  },
  {
    name: "Ethan Brown",
    email: "ethan.brown@example.com",
    phone: "+1 555 010 1009",
    gender: "Male",
    address: "8 Pine Street, Portland",
  },
  {
    name: "Mia Taylor",
    email: "mia.taylor@example.com",
    phone: "+1 555 010 1010",
    gender: "Prefer not to say",
    address: "11 Ocean Drive, San Diego",
  },
  {
    name: "Oliver Davis",
    email: "oliver.d@example.com",
    phone: "+1 555 010 1011",
    gender: "Other",
    address: "3 Hilltop Road, Phoenix",
  },
  {
    name: "Zara Ahmed",
    email: "zara.ahmed@example.com",
    phone: "+1 555 010 1012",
    gender: "Female",
    address: "90 Cedar Street, Newark",
  },
];

const PAGE_SIZE = 8;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[+()0-9\s-]{7,}$/;
const GENDERS = ["Male", "Female", "Other", "Prefer not to say"] as const;

const AdvisorStudents = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [students, setStudents] = useState<AdvisorStudent[]>(MOCK_STUDENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [studentGender, setStudentGender] = useState<AdvisorStudent["gender"] | "">("");
  const [studentAddress, setStudentAddress] = useState("");

  const filteredStudents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return students;
    return students.filter((s) => {
      const hay = `${s.name} ${s.email} ${s.phone} ${s.gender} ${s.address}`.toLowerCase();
      return hay.includes(q);
    });
  }, [searchQuery, students]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  useEffect(() => {
    if (searchParams.get("openAdd") !== "1") return;
    setIsAddOpen(true);

    // Clean the URL so refresh doesn't keep reopening the modal.
    const next = new URLSearchParams(searchParams);
    next.delete("openAdd");
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = useMemo(
    () =>
      filteredStudents.slice(
        (safePage - 1) * PAGE_SIZE,
        safePage * PAGE_SIZE
      ),
    [filteredStudents, safePage]
  );

  const nameOk = studentName.trim().length > 0;
  const emailOk = emailRegex.test(studentEmail.trim());
  const phoneOk = phoneRegex.test(studentPhone.trim());
  const genderOk = String(studentGender).trim().length > 0;
  const addressOk = studentAddress.trim().length > 0;
  const canSubmit = nameOk && emailOk && phoneOk && genderOk && addressOk && !isSubmitting;

  const closeAdd = () => {
    setIsAddOpen(false);
    setConfirmOpen(false);
    setIsSubmitting(false);
    setStudentName("");
    setStudentEmail("");
    setStudentPhone("");
    setStudentGender("");
    setStudentAddress("");
  };

  const handleRequestSubmit = () => {
    if (!canSubmit) return;
    setConfirmOpen(true);
  };

  const handleConfirmAdd = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);

    const payload = {
      name: studentName.trim(),
      email: studentEmail.trim(),
      phone: studentPhone.trim(),
      gender: studentGender as AdvisorStudent["gender"],
      address: studentAddress.trim(),
    };

    const exists = students.some(
      (s) => s.email.toLowerCase() === payload.email.toLowerCase()
    );
    if (exists) {
      toast.error("Email already exists", {
        description: "A student with this email is already in the list.",
      });
      setIsSubmitting(false);
      setConfirmOpen(false);
      return;
    }

    const newStudent: AdvisorStudent = payload;

    setStudents((prev) => [newStudent, ...prev]);
    toast.success("Student added", { description: `${newStudent.name} was added.` });
    closeAdd();
  };

  return (
    <div className="animate-fade-in space-y-6 max-w-6xl mx-auto px-4 md:px-6 lg:px-8 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:justify-between">
        <div className="flex items-start gap-4 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 shadow-inner">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
              Students
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Manage and view student details
            </p>
          </div>
        </div>

        <Button
          type="button"
          className="h-11 rounded-xl px-6 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 gap-2 font-bold transition-all hover:scale-[1.02] active:scale-[0.99] text-primary-foreground"
          onClick={() => setIsAddOpen(true)}
        >
          <Plus className="w-5 h-5" />
          Add Student
        </Button>
      </div>

      <InternSearchBar
        placeholder="Search students..."
        value={searchQuery}
        onChange={setSearchQuery}
      />

      <StandardModal
        open={isAddOpen}
        onOpenChange={(open) => {
          if (!open) closeAdd();
          else setIsAddOpen(true);
        }}
        title="Add Student"
        subtitle="Enter student details to add them to the list."
        footer={
          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl px-6"
              onClick={closeAdd}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="rounded-xl px-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
              onClick={handleRequestSubmit}
              disabled={!canSubmit}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Student"
              )}
            </Button>
          </div>
        }
      >
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="student-name" className="text-sm font-semibold">
                Student Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="student-name"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="e.g., John Doe"
                className="rounded-xl h-11"
                autoComplete="name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="student-email" className="text-sm font-semibold">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="student-email"
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
                placeholder="e.g., john@example.com"
                className={cn(
                  "rounded-xl h-11",
                  studentEmail.trim().length > 0 &&
                    !emailOk &&
                    "border-destructive/60 focus-visible:ring-destructive/30"
                )}
                inputMode="email"
                autoComplete="email"
              />
              {studentEmail.trim().length > 0 && !emailOk && (
                <p className="text-xs text-destructive font-medium">
                  Please enter a valid email address.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="student-phone" className="text-sm font-semibold">
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="student-phone"
                value={studentPhone}
                onChange={(e) => setStudentPhone(e.target.value)}
                placeholder="e.g., +1 555 010 1001"
                className={cn(
                  "rounded-xl h-11",
                  studentPhone.trim().length > 0 &&
                    !phoneOk &&
                    "border-destructive/60 focus-visible:ring-destructive/30"
                )}
                inputMode="tel"
                autoComplete="tel"
              />
              {studentPhone.trim().length > 0 && !phoneOk && (
                <p className="text-xs text-destructive font-medium">
                  Please enter a valid phone number.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="student-gender" className="text-sm font-semibold">
                Gender <span className="text-red-500">*</span>
              </Label>
              <Select
                value={studentGender}
                onValueChange={(v) => setStudentGender(v as AdvisorStudent["gender"])}
              >
                <SelectTrigger
                  id="student-gender"
                  className="h-11 rounded-xl bg-background border border-border/50"
                >
                  <SelectValue placeholder="Select Gender" />
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="student-address" className="text-sm font-semibold">
              Address <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="student-address"
              value={studentAddress}
              onChange={(e) => setStudentAddress(e.target.value)}
              placeholder="Enter full address..."
              className="min-h-[120px] resize-none rounded-xl"
            />
          </div>
        </div>
      </StandardModal>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm add student</AlertDialogTitle>
            <AlertDialogDescription>
              This will create a new student entry in your list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting} className="rounded-xl">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={!canSubmit}
              onClick={(e) => {
                e.preventDefault();
                void handleConfirmAdd();
              }}
              className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Student"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card className="border-border/50 shadow-sm rounded-2xl overflow-hidden bg-card/50 backdrop-blur-sm">
        <CardHeader className="px-6 pt-6 pb-3 border-b border-border/40 bg-muted/20">
          <CardTitle className="text-lg font-bold">All students</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredStudents.length === 0 ? (
            <div className="text-center py-16 px-6 text-muted-foreground">
              <div className="w-14 h-14 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7 opacity-30" />
              </div>
              <p className="font-semibold text-foreground">No students found</p>
              <p className="text-sm mt-1">
                Try adjusting your search or check back later.
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border/50">
                      <TableHead className="text-left text-xs font-bold uppercase tracking-wider text-muted-foreground px-4 py-4 h-12">
                        Student Name
                      </TableHead>
                      <TableHead className="text-left text-xs font-bold uppercase tracking-wider text-muted-foreground px-4 py-4 h-12 min-w-[220px]">
                        Email
                      </TableHead>
                      <TableHead className="text-left text-xs font-bold uppercase tracking-wider text-muted-foreground px-4 py-4 h-12 min-w-[160px]">
                        Phone Number
                      </TableHead>
                      <TableHead className="text-left text-xs font-bold uppercase tracking-wider text-muted-foreground px-4 py-4 h-12 min-w-[140px]">
                        Gender
                      </TableHead>
                      <TableHead className="text-left text-xs font-bold uppercase tracking-wider text-muted-foreground px-4 py-4 h-12 min-w-[320px]">
                        Address
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginated.map((student) => (
                      <TableRow
                        key={student.email}
                        className="border-b border-border/40 hover:bg-muted/20 transition-colors"
                      >
                        <TableCell className="text-left px-4 py-4 text-sm font-medium text-foreground">
                          {student.name}
                        </TableCell>
                        <TableCell className="text-left px-4 py-4 text-sm text-muted-foreground">
                          {student.email}
                        </TableCell>
                        <TableCell className="text-left px-4 py-4 text-sm text-foreground">
                          {student.phone}
                        </TableCell>
                        <TableCell className="text-left px-4 py-4 text-sm text-muted-foreground">
                          {student.gender}
                        </TableCell>
                        <TableCell className="text-left px-4 py-4 text-sm text-foreground whitespace-normal break-words max-w-xs">
                          {student.address}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-4 border-t border-border/40 bg-muted/10">
                  <p className="text-xs text-muted-foreground font-medium">
                    Showing{" "}
                    <span className="text-foreground font-semibold">
                      {(safePage - 1) * PAGE_SIZE + 1}
                    </span>
                    –
                    <span className="text-foreground font-semibold">
                      {Math.min(safePage * PAGE_SIZE, filteredStudents.length)}
                    </span>{" "}
                    of{" "}
                    <span className="text-foreground font-semibold">
                      {filteredStudents.length}
                    </span>
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className={cn(
                        "h-9 rounded-xl gap-1 font-semibold",
                        safePage <= 1 && "pointer-events-none opacity-50"
                      )}
                      disabled={safePage <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>
                    <span className="text-xs font-semibold text-muted-foreground tabular-nums px-2">
                      {safePage} / {totalPages}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className={cn(
                        "h-9 rounded-xl gap-1 font-semibold",
                        safePage >= totalPages && "pointer-events-none opacity-50"
                      )}
                      disabled={safePage >= totalPages}
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvisorStudents;
