import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable, { Column } from "@/components/superadmin/DataTable";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { GradebookEntry, gradebookEntries as initialEntries } from "@/data/tutorData";
import { toast } from "sonner";

const TutorEvaluations = () => {
  const [entries, setEntries] = useState<GradebookEntry[]>(() => JSON.parse(JSON.stringify(initialEntries)));
  const [gradeOpen, setGradeOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<GradebookEntry | null>(null);
  const [gradeForm, setGradeForm] = useState({ quiz1: "", quiz2: "", midterm: "", project: "", final: "" });

  const openGrade = (entry: GradebookEntry) => {
    setEditingEntry(entry);
    setGradeForm({
      quiz1: entry.quiz1?.toString() || "",
      quiz2: entry.quiz2?.toString() || "",
      midterm: entry.midterm?.toString() || "",
      project: entry.project?.toString() || "",
      final: entry.final?.toString() || "",
    });
    setGradeOpen(true);
  };

  const handleSaveGrade = () => {
    if (!editingEntry) return;
    setEntries((prev) =>
      prev.map((e) =>
        e.id === editingEntry.id
          ? {
              ...e,
              quiz1: gradeForm.quiz1 ? parseInt(gradeForm.quiz1) : null,
              quiz2: gradeForm.quiz2 ? parseInt(gradeForm.quiz2) : null,
              midterm: gradeForm.midterm ? parseInt(gradeForm.midterm) : null,
              project: gradeForm.project ? parseInt(gradeForm.project) : null,
              final: gradeForm.final ? parseInt(gradeForm.final) : null,
            }
          : e
      )
    );
    toast.success(`Grades updated for ${editingEntry.studentName}`);
    setGradeOpen(false);
  };

  const getAverage = (e: GradebookEntry) => {
    const scores = [e.quiz1, e.quiz2, e.midterm, e.project, e.final].filter((s): s is number => s !== null);
    if (scores.length === 0) return null;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  };

  const scoreCell = (val: number | null) => {
    if (val === null) return <span className="text-muted-foreground text-xs">—</span>;
    const color = val >= 85 ? "text-primary" : val >= 70 ? "text-foreground" : "text-destructive";
    return <span className={`font-medium ${color}`}>{val}</span>;
  };

  const columns: Column<GradebookEntry>[] = [
    { key: "studentName", header: "Student", sortable: true, accessor: (e) => e.studentName },
    { key: "course", header: "Course", render: (e) => <Badge variant="outline" className="text-xs">{e.course}</Badge> },
    { key: "attendance", header: "Attendance", sortable: true, accessor: (e) => e.attendance, render: (e) => (
      <Badge variant="secondary" className={`border-0 ${e.attendance >= 85 ? "bg-primary/10 text-primary" : e.attendance >= 75 ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"}`}>
        {e.attendance}%
      </Badge>
    )},
    { key: "quiz1", header: "Quiz 1", render: (e) => scoreCell(e.quiz1) },
    { key: "quiz2", header: "Quiz 2", render: (e) => scoreCell(e.quiz2) },
    { key: "midterm", header: "Midterm", render: (e) => scoreCell(e.midterm) },
    { key: "project", header: "Project", render: (e) => scoreCell(e.project) },
    { key: "final", header: "Final", render: (e) => scoreCell(e.final) },
    { key: "avg", header: "Average", render: (e) => {
      const avg = getAverage(e);
      if (avg === null) return <span className="text-muted-foreground text-xs">—</span>;
      return <Badge variant="secondary" className={`border-0 font-bold ${avg >= 85 ? "bg-primary/10 text-primary" : avg >= 70 ? "bg-muted" : "bg-destructive/10 text-destructive"}`}>{avg}%</Badge>;
    }},
  ];

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-semibold text-foreground tracking-tight">Gradebook</h1>
          <p className="text-muted-foreground mt-1">Input and manage student scores for quizzes, tests, and projects</p>
        </div>

        <DataTable
          data={entries}
          columns={columns}
          searchPlaceholder="Search students..."
          searchKey={(e) => `${e.studentName} ${e.course}`}
          actions={(item) => (
            <Button variant="outline" size="sm" onClick={() => openGrade(item)}>
              Edit Grades
            </Button>
          )}
        />

        {/* Grade Edit Dialog */}
        <Dialog open={gradeOpen} onOpenChange={setGradeOpen}>
          <DialogContent className="sm:max-w-[480px] rounded-xl">
            <DialogHeader>
              <DialogTitle>Edit Grades: {editingEntry?.studentName}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-2">
              <div className="space-y-2">
                <Label>Quiz 1</Label>
                <Input type="number" min={0} max={100} value={gradeForm.quiz1} onChange={(e) => setGradeForm({ ...gradeForm, quiz1: e.target.value })} placeholder="—" />
              </div>
              <div className="space-y-2">
                <Label>Quiz 2</Label>
                <Input type="number" min={0} max={100} value={gradeForm.quiz2} onChange={(e) => setGradeForm({ ...gradeForm, quiz2: e.target.value })} placeholder="—" />
              </div>
              <div className="space-y-2">
                <Label>Midterm</Label>
                <Input type="number" min={0} max={100} value={gradeForm.midterm} onChange={(e) => setGradeForm({ ...gradeForm, midterm: e.target.value })} placeholder="—" />
              </div>
              <div className="space-y-2">
                <Label>Project</Label>
                <Input type="number" min={0} max={100} value={gradeForm.project} onChange={(e) => setGradeForm({ ...gradeForm, project: e.target.value })} placeholder="—" />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Final Exam</Label>
                <Input type="number" min={0} max={100} value={gradeForm.final} onChange={(e) => setGradeForm({ ...gradeForm, final: e.target.value })} placeholder="—" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setGradeOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveGrade}>Save Grades</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default TutorEvaluations;
