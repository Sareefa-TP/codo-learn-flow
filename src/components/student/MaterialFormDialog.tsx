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
 import type { LearningMaterial, MaterialFile } from "@/data/studentData";
 
 interface MaterialFormDialogProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   onSubmit: (data: {
     subject: string;
     tutor: string;
     file?: { name: string; type: "doc" | "video" };
     isNewSubject: boolean;
   }) => void;
   editingMaterial?: LearningMaterial | null;
   editingFile?: MaterialFile | null;
   existingSubjects: string[];
 }
 
 const MaterialFormDialog = ({
   open,
   onOpenChange,
   onSubmit,
   editingMaterial,
   editingFile,
   existingSubjects,
 }: MaterialFormDialogProps) => {
   const [subject, setSubject] = useState("");
   const [tutor, setTutor] = useState("");
   const [fileName, setFileName] = useState("");
   const [fileType, setFileType] = useState<"doc" | "video">("doc");
   const [useExistingSubject, setUseExistingSubject] = useState(false);
   const [selectedSubject, setSelectedSubject] = useState("");
 
   const isEditing = !!editingMaterial || !!editingFile;
 
   useEffect(() => {
     if (editingMaterial) {
       setSubject(editingMaterial.subject);
       setTutor(editingMaterial.tutor);
       setUseExistingSubject(false);
     }
     if (editingFile) {
       setFileName(editingFile.name);
       setFileType(editingFile.type);
     }
     if (!editingMaterial && !editingFile) {
       setSubject("");
       setTutor("");
       setFileName("");
       setFileType("doc");
       setUseExistingSubject(false);
       setSelectedSubject("");
     }
   }, [editingMaterial, editingFile, open]);
 
   const handleSubmit = (e: React.FormEvent) => {
     e.preventDefault();
     const finalSubject = useExistingSubject ? selectedSubject : subject;
     
     onSubmit({
       subject: finalSubject,
       tutor,
       file: fileName ? { name: fileName, type: fileType } : undefined,
       isNewSubject: !useExistingSubject && !editingMaterial,
     });
     
     onOpenChange(false);
   };
 
   return (
     <Dialog open={open} onOpenChange={onOpenChange}>
       <DialogContent className="sm:max-w-md">
         <DialogHeader>
           <DialogTitle>
             {isEditing ? "Edit Material" : "Add New Material"}
           </DialogTitle>
         </DialogHeader>
         <form onSubmit={handleSubmit} className="space-y-4">
           {!editingFile && (
             <>
               {existingSubjects.length > 0 && !editingMaterial && (
                 <div className="flex items-center gap-2">
                   <input
                     type="checkbox"
                     id="useExisting"
                     checked={useExistingSubject}
                     onChange={(e) => setUseExistingSubject(e.target.checked)}
                     className="rounded border-input"
                   />
                   <Label htmlFor="useExisting" className="text-sm">
                     Add to existing subject
                   </Label>
                 </div>
               )}
 
               {useExistingSubject ? (
                 <div className="space-y-2">
                   <Label htmlFor="existingSubject">Subject</Label>
                   <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                     <SelectTrigger>
                       <SelectValue placeholder="Select a subject" />
                     </SelectTrigger>
                     <SelectContent>
                       {existingSubjects.map((subj) => (
                         <SelectItem key={subj} value={subj}>
                           {subj}
                         </SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                 </div>
               ) : (
                 <>
                   <div className="space-y-2">
                     <Label htmlFor="subject">Subject Title</Label>
                     <Input
                       id="subject"
                       value={subject}
                       onChange={(e) => setSubject(e.target.value)}
                       placeholder="e.g., Advanced JavaScript"
                       required={!useExistingSubject}
                     />
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="tutor">Tutor Name</Label>
                     <Input
                       id="tutor"
                       value={tutor}
                       onChange={(e) => setTutor(e.target.value)}
                       placeholder="e.g., John Smith"
                       required={!useExistingSubject}
                     />
                   </div>
                 </>
               )}
             </>
           )}
 
           <div className="space-y-2">
             <Label htmlFor="fileName">File Name (optional)</Label>
             <Input
               id="fileName"
               value={fileName}
               onChange={(e) => setFileName(e.target.value)}
               placeholder="e.g., React_Guide.pdf"
             />
           </div>
 
           <div className="space-y-2">
             <Label htmlFor="fileType">File Type</Label>
             <Select value={fileType} onValueChange={(v) => setFileType(v as "doc" | "video")}>
               <SelectTrigger>
                 <SelectValue />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="doc">Document (PDF)</SelectItem>
                 <SelectItem value="video">Video (MP4)</SelectItem>
               </SelectContent>
             </Select>
           </div>
 
           <DialogFooter>
             <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
               Cancel
             </Button>
             <Button type="submit">
               {isEditing ? "Save Changes" : "Add Material"}
             </Button>
           </DialogFooter>
         </form>
       </DialogContent>
     </Dialog>
   );
 };
 
 export default MaterialFormDialog;