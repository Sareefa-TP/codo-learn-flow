 import { useState } from "react";
 import DashboardLayout from "@/components/DashboardLayout";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 import { Badge } from "@/components/ui/badge";
 import {
   ClipboardCheck,
   Plus,
   Pencil,
   Trash2,
   CheckCircle2,
   XCircle,
   Clock,
   Trophy,
   Coffee,
 } from "lucide-react";
 import { studentData, type Assessment } from "@/data/studentData";
 import AssessmentFormDialog from "@/components/student/AssessmentFormDialog";
 import DeleteConfirmDialog from "@/components/student/DeleteConfirmDialog";
 import { toast } from "@/hooks/use-toast";

const StudentAssessments = () => {
   // Local state for CRUD operations
   const [assessments, setAssessments] = useState<Assessment[]>(() => 
     JSON.parse(JSON.stringify(studentData.assessments))
   );
   
   // Dialog states
   const [formOpen, setFormOpen] = useState(false);
   const [deleteOpen, setDeleteOpen] = useState(false);
   const [editingAssessment, setEditingAssessment] = useState<Assessment | null>(null);
   const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
 
   // Stats computed from state
   const passedCount = assessments.filter(a => a.status === "Passed").length;
   const pendingCount = assessments.filter(a => a.status === "Pending").length;
   const averageGrade = assessments.length > 0
     ? Math.round(
         assessments.reduce((acc, a) => {
           const match = a.grade.match(/(\d+)/);
           return acc + (match ? parseInt(match[1]) : 0);
         }, 0) / assessments.length
       )
     : 0;
 
   // CRUD handlers
   const handleAddAssessment = (data: Assessment) => {
     setAssessments(prev => [...prev, data]);
     toast({
       title: "Assessment Added",
       description: `${data.task} has been added`,
     });
   };
 
   const handleEditAssessment = (data: Assessment) => {
     if (editingAssessment) {
       setAssessments(prev => prev.map(a => 
         a.task === editingAssessment.task ? data : a
       ));
       toast({
         title: "Assessment Updated",
         description: `${data.task} has been updated`,
       });
     }
     setEditingAssessment(null);
   };
 
   const handleDelete = () => {
     if (deleteIndex !== null) {
       const deleted = assessments[deleteIndex];
       setAssessments(prev => prev.filter((_, i) => i !== deleteIndex));
       toast({
         title: "Assessment Deleted",
         description: `${deleted.task} has been removed`,
       });
     }
     setDeleteIndex(null);
     setDeleteOpen(false);
   };
 
   const openEdit = (assessment: Assessment) => {
     setEditingAssessment(assessment);
     setFormOpen(true);
   };
 
   const openDelete = (index: number) => {
     setDeleteIndex(index);
     setDeleteOpen(true);
   };
 
   const openAddNew = () => {
     setEditingAssessment(null);
     setFormOpen(true);
   };
 
   const getStatusIcon = (status: string) => {
     switch (status) {
       case "Passed":
         return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
       case "Failed":
         return <XCircle className="w-4 h-4 text-destructive" />;
       default:
         return <Clock className="w-4 h-4 text-amber-500" />;
     }
   };
 
   const getStatusBadge = (status: string) => {
     switch (status) {
       case "Passed":
         return <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20">Passed</Badge>;
       case "Failed":
         return <Badge variant="destructive">Failed</Badge>;
       default:
         return <Badge variant="secondary">Pending</Badge>;
     }
   };
 
  return (
    <DashboardLayout>
       <div className="animate-fade-in">
         {/* Header */}
         <div className="mb-8">
           <h1 className="text-2xl lg:text-3xl font-semibold text-foreground tracking-tight">
             Assessments
           </h1>
           <p className="text-muted-foreground mt-2">
             View your quizzes, assignments, and exam results
           </p>
         </div>
 
         {/* Stats Row */}
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
           <Card>
             <CardContent className="p-4 flex items-center gap-4">
               <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                 <Trophy className="w-6 h-6 text-emerald-600" />
               </div>
               <div>
                 <p className="text-2xl font-bold text-foreground">{passedCount}</p>
                 <p className="text-sm text-muted-foreground">Passed</p>
               </div>
             </CardContent>
           </Card>
           <Card>
             <CardContent className="p-4 flex items-center gap-4">
               <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                 <Clock className="w-6 h-6 text-amber-600" />
               </div>
               <div>
                 <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
                 <p className="text-sm text-muted-foreground">Pending</p>
               </div>
             </CardContent>
           </Card>
           <Card>
             <CardContent className="p-4 flex items-center gap-4">
               <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                 <ClipboardCheck className="w-6 h-6 text-primary" />
               </div>
               <div>
                 <p className="text-2xl font-bold text-foreground">{averageGrade}%</p>
                 <p className="text-sm text-muted-foreground">Average</p>
               </div>
             </CardContent>
           </Card>
         </div>
 
         {/* Add Button */}
         <div className="flex justify-end mb-4">
           <Button onClick={openAddNew} className="gap-2">
             <Plus className="w-4 h-4" />
             Add Assessment
           </Button>
         </div>
 
         {/* Assessments List */}
         <Card>
           <CardHeader>
             <CardTitle className="flex items-center gap-2">
               <ClipboardCheck className="w-5 h-5" />
               All Assessments ({assessments.length})
             </CardTitle>
           </CardHeader>
           <CardContent className="p-0">
             {assessments.length > 0 ? (
               <div className="divide-y">
                 {assessments.map((assessment, index) => (
                   <div
                     key={`${assessment.task}-${index}`}
                     className="p-4 hover:bg-muted/30 transition-colors flex items-center justify-between group"
                   >
                     <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                         {getStatusIcon(assessment.status)}
                       </div>
                       <div>
                         <p className="font-medium text-foreground">{assessment.task}</p>
                         <p className="text-sm text-muted-foreground">
                           Grade: {assessment.grade}
                         </p>
                       </div>
                     </div>
                     <div className="flex items-center gap-3">
                       {getStatusBadge(assessment.status)}
                       <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                         <Button
                           variant="ghost"
                           size="icon"
                           className="h-8 w-8"
                           onClick={() => openEdit(assessment)}
                         >
                           <Pencil className="w-4 h-4" />
                         </Button>
                         <Button
                           variant="ghost"
                           size="icon"
                           className="h-8 w-8 text-destructive hover:text-destructive"
                           onClick={() => openDelete(index)}
                         >
                           <Trash2 className="w-4 h-4" />
                         </Button>
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
             ) : (
               <div className="p-12 text-center">
                 <Coffee className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                 <h3 className="font-medium text-foreground mb-1">No Assessments Yet</h3>
                 <p className="text-sm text-muted-foreground">
                   Click "Add Assessment" to create your first one.
                 </p>
               </div>
             )}
           </CardContent>
         </Card>
 
         {/* Form Dialog */}
         <AssessmentFormDialog
           open={formOpen}
           onOpenChange={setFormOpen}
           onSubmit={editingAssessment ? handleEditAssessment : handleAddAssessment}
           editingAssessment={editingAssessment}
         />
 
         {/* Delete Confirmation */}
         <DeleteConfirmDialog
           open={deleteOpen}
           onOpenChange={setDeleteOpen}
           onConfirm={handleDelete}
           title="Delete Assessment?"
           description={
             deleteIndex !== null
               ? `This will permanently delete "${assessments[deleteIndex]?.task}".`
               : "This action cannot be undone."
           }
         />
       </div>
    </DashboardLayout>
  );
};

export default StudentAssessments;
