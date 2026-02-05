 import { useState, useEffect } from "react";
 import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogFooter,
 } from "@/components/ui/dialog";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from "@/components/ui/select";
 import type { Assessment } from "@/data/studentData";
 
 interface AssessmentFormDialogProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   onSubmit: (data: Assessment) => void;
   editingAssessment?: Assessment | null;
 }
 
 const AssessmentFormDialog = ({
   open,
   onOpenChange,
   onSubmit,
   editingAssessment,
 }: AssessmentFormDialogProps) => {
   const [task, setTask] = useState("");
   const [grade, setGrade] = useState("");
   const [status, setStatus] = useState<"Passed" | "Failed" | "Pending">("Pending");
 
   const isEditing = !!editingAssessment;
 
   useEffect(() => {
     if (editingAssessment) {
       setTask(editingAssessment.task);
       setGrade(editingAssessment.grade);
       setStatus(editingAssessment.status as "Passed" | "Failed" | "Pending");
     } else {
       setTask("");
       setGrade("");
       setStatus("Pending");
     }
   }, [editingAssessment, open]);
 
   const handleSubmit = (e: React.FormEvent) => {
     e.preventDefault();
     onSubmit({ task, grade, status });
     onOpenChange(false);
   };
 
   return (
     <Dialog open={open} onOpenChange={onOpenChange}>
       <DialogContent className="sm:max-w-md">
         <DialogHeader>
           <DialogTitle>
             {isEditing ? "Edit Assessment" : "Add New Assessment"}
           </DialogTitle>
         </DialogHeader>
         <form onSubmit={handleSubmit} className="space-y-4">
           <div className="space-y-2">
             <Label htmlFor="task">Task/Assignment Name</Label>
             <Input
               id="task"
               value={task}
               onChange={(e) => setTask(e.target.value)}
               placeholder="e.g., Project Alpha"
               required
             />
           </div>
 
           <div className="space-y-2">
             <Label htmlFor="grade">Grade</Label>
             <Input
               id="grade"
               value={grade}
               onChange={(e) => setGrade(e.target.value)}
               placeholder="e.g., 92/100"
               required
             />
           </div>
 
           <div className="space-y-2">
             <Label htmlFor="status">Status</Label>
             <Select value={status} onValueChange={(v) => setStatus(v as "Passed" | "Failed" | "Pending")}>
               <SelectTrigger>
                 <SelectValue />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="Passed">Passed</SelectItem>
                 <SelectItem value="Failed">Failed</SelectItem>
                 <SelectItem value="Pending">Pending</SelectItem>
               </SelectContent>
             </Select>
           </div>
 
           <DialogFooter>
             <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
               Cancel
             </Button>
             <Button type="submit">
               {isEditing ? "Save Changes" : "Add Assessment"}
             </Button>
           </DialogFooter>
         </form>
       </DialogContent>
     </Dialog>
   );
 };
 
 export default AssessmentFormDialog;