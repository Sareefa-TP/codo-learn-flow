 import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
 import { 
   BookOpen, 
   FileText, 
   Play, 
   FolderOpen,
   Coffee,
   Download,
   User,
   Plus,
   Pencil,
   Trash2,
 } from "lucide-react";
 import { studentData, type LearningMaterial, type MaterialFile } from "@/data/studentData";
 import MaterialFormDialog from "@/components/student/MaterialFormDialog";
 import DeleteConfirmDialog from "@/components/student/DeleteConfirmDialog";
 import { toast } from "@/hooks/use-toast";

const StudentMaterials = () => {
   // Local state for CRUD operations
   const [materials, setMaterials] = useState<LearningMaterial[]>(() => 
     JSON.parse(JSON.stringify(studentData.learning_materials))
   );
  const [selectedSubject, setSelectedSubject] = useState<string | null>(
     materials[0]?.subject || null
  );
   
   // Dialog states
   const [formOpen, setFormOpen] = useState(false);
   const [deleteOpen, setDeleteOpen] = useState(false);
   const [editingMaterial, setEditingMaterial] = useState<LearningMaterial | null>(null);
   const [editingFile, setEditingFile] = useState<MaterialFile | null>(null);
   const [deleteTarget, setDeleteTarget] = useState<{
     type: "subject" | "file";
     subject: string;
     fileName?: string;
   } | null>(null);

  const selectedMaterial = materials.find(m => m.subject === selectedSubject);
 
   // Stats computed from state
   const totalFiles = materials.reduce((acc, m) => acc + m.files.length, 0);

  // Get all files for selected subject
  const docs = selectedMaterial?.files.filter(f => f.type === "doc") || [];
  const videos = selectedMaterial?.files.filter(f => f.type === "video") || [];
   
   // Update selected subject if current one is deleted
   useEffect(() => {
     if (selectedSubject && !materials.find(m => m.subject === selectedSubject)) {
       setSelectedSubject(materials[0]?.subject || null);
     }
   }, [materials, selectedSubject]);
 
   // CRUD handlers
   const handleAddMaterial = (data: {
     subject: string;
     tutor: string;
     file?: { name: string; type: "doc" | "video" };
     isNewSubject: boolean;
   }) => {
     setMaterials(prev => {
       const existingIndex = prev.findIndex(m => m.subject === data.subject);
       
       if (existingIndex >= 0 && data.file) {
         // Add file to existing subject
         const updated = [...prev];
         updated[existingIndex] = {
           ...updated[existingIndex],
           files: [...updated[existingIndex].files, data.file],
         };
         return updated;
       } else if (data.isNewSubject) {
         // Create new subject
         const newMaterial: LearningMaterial = {
           subject: data.subject,
           tutor: data.tutor,
           files: data.file ? [data.file] : [],
         };
         return [...prev, newMaterial];
       }
       return prev;
     });
     
     toast({
       title: "Material Added",
       description: `Successfully added to ${data.subject}`,
     });
     setEditingMaterial(null);
     setEditingFile(null);
   };
 
   const handleEditMaterial = (data: {
     subject: string;
     tutor: string;
     file?: { name: string; type: "doc" | "video" };
   }) => {
     if (editingMaterial) {
       setMaterials(prev => prev.map(m => 
         m.subject === editingMaterial.subject
           ? { ...m, subject: data.subject, tutor: data.tutor }
           : m
       ));
       if (selectedSubject === editingMaterial.subject) {
         setSelectedSubject(data.subject);
       }
     }
     
     if (editingFile && selectedSubject) {
       setMaterials(prev => prev.map(m => 
         m.subject === selectedSubject
           ? {
               ...m,
               files: m.files.map(f => 
                 f.name === editingFile.name && data.file
                   ? data.file
                   : f
               ),
             }
           : m
       ));
     }
     
     toast({
       title: "Changes Saved",
       description: "Material updated successfully",
     });
     setEditingMaterial(null);
     setEditingFile(null);
   };
 
   const handleDelete = () => {
     if (!deleteTarget) return;
     
     if (deleteTarget.type === "subject") {
       setMaterials(prev => prev.filter(m => m.subject !== deleteTarget.subject));
       toast({
         title: "Subject Deleted",
         description: `${deleteTarget.subject} has been removed`,
       });
     } else if (deleteTarget.type === "file" && deleteTarget.fileName) {
       setMaterials(prev => prev.map(m => 
         m.subject === deleteTarget.subject
           ? { ...m, files: m.files.filter(f => f.name !== deleteTarget.fileName) }
           : m
       ));
       toast({
         title: "File Deleted",
         description: `${deleteTarget.fileName} has been removed`,
       });
     }
     
     setDeleteTarget(null);
     setDeleteOpen(false);
   };
 
   const openEditSubject = (material: LearningMaterial) => {
     setEditingMaterial(material);
     setEditingFile(null);
     setFormOpen(true);
   };
 
   const openEditFile = (file: MaterialFile) => {
     setEditingFile(file);
     setEditingMaterial(null);
     setFormOpen(true);
   };
 
   const openDeleteSubject = (subject: string) => {
     setDeleteTarget({ type: "subject", subject });
     setDeleteOpen(true);
   };
 
   const openDeleteFile = (subject: string, fileName: string) => {
     setDeleteTarget({ type: "file", subject, fileName });
     setDeleteOpen(true);
   };
 
   const openAddNew = () => {
     setEditingMaterial(null);
     setEditingFile(null);
     setFormOpen(true);
   };

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-semibold text-foreground tracking-tight">
            Learning Materials
          </h1>
          <p className="text-muted-foreground mt-2">
            Access course documents, videos, and resources
          </p>
           <div className="mt-2 text-sm text-muted-foreground">
             Total: {materials.length} subjects • {totalFiles} files
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Subject List - Left */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground px-1">
              Subjects
            </h3>
             <Button onClick={openAddNew} className="w-full gap-2">
               <Plus className="w-4 h-4" />
               Add Material
             </Button>
            <div className="space-y-3">
              {materials.map((material) => (
                <Card
                  key={material.subject}
                  className={`cursor-pointer transition-all hover:shadow-hover hover:-translate-y-0.5 ${
                    selectedSubject === material.subject
                      ? "ring-2 ring-primary border-primary/50"
                      : ""
                   } group`}
                  onClick={() => setSelectedSubject(material.subject)}
                >
                  <CardContent className="p-4">
                     <div className="flex items-start gap-3 relative">
                       {/* Edit/Delete buttons */}
                       <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                         <Button
                           variant="ghost"
                           size="icon"
                           className="h-7 w-7"
                           onClick={(e) => {
                             e.stopPropagation();
                             openEditSubject(material);
                           }}
                         >
                           <Pencil className="w-3.5 h-3.5" />
                         </Button>
                         <Button
                           variant="ghost"
                           size="icon"
                           className="h-7 w-7 text-destructive hover:text-destructive"
                           onClick={(e) => {
                             e.stopPropagation();
                             openDeleteSubject(material.subject);
                           }}
                         >
                           <Trash2 className="w-3.5 h-3.5" />
                         </Button>
                       </div>
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <BookOpen className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground">
                          {material.subject}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <User className="w-3 h-3" />
                          <span>with {material.tutor}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs mt-2">
                          <FolderOpen className="w-3 h-3 mr-1" />
                          {material.files.length} files
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Materials Panel - Right */}
          <div className="lg:col-span-8">
            {selectedMaterial ? (
              <Card>
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{selectedMaterial.subject}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        with {selectedMaterial.tutor}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {selectedMaterial.files.length} resources
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* Documents Section */}
                  {docs.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Documents (PDF)
                      </h4>
                      <div className="grid gap-2">
                        {docs.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 rounded-xl border hover:bg-muted/30 transition-colors"
                          >
                           <div className="flex items-center gap-3 flex-1">
                              <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                                <FileText className="w-5 h-5 text-destructive" />
                              </div>
                              <div>
                                <p className="font-medium text-foreground">{file.name}</p>
                                <p className="text-xs text-muted-foreground">PDF Document</p>
                              </div>
                            </div>
                           <div className="flex items-center gap-1">
                             <Button
                               variant="ghost"
                               size="icon"
                               className="h-8 w-8"
                               onClick={() => openEditFile(file)}
                             >
                               <Pencil className="w-4 h-4" />
                             </Button>
                             <Button
                               variant="ghost"
                               size="icon"
                               className="h-8 w-8 text-destructive hover:text-destructive"
                               onClick={() => openDeleteFile(selectedSubject!, file.name)}
                             >
                               <Trash2 className="w-4 h-4" />
                             </Button>
                             <Button variant="ghost" size="icon" className="h-8 w-8">
                               <Download className="w-4 h-4" />
                             </Button>
                           </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Videos Section */}
                  {videos.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Play className="w-4 h-4" />
                        Videos (MP4)
                      </h4>
                      <div className="grid gap-2">
                        {videos.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 rounded-xl border hover:bg-muted/30 transition-colors"
                          >
                           <div className="flex items-center gap-3 flex-1">
                              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Play className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium text-foreground">{file.name}</p>
                                <p className="text-xs text-muted-foreground">Video File</p>
                              </div>
                            </div>
                           <div className="flex items-center gap-1">
                             <Button
                               variant="ghost"
                               size="icon"
                               className="h-8 w-8"
                               onClick={() => openEditFile(file)}
                             >
                               <Pencil className="w-4 h-4" />
                             </Button>
                             <Button
                               variant="ghost"
                               size="icon"
                               className="h-8 w-8 text-destructive hover:text-destructive"
                               onClick={() => openDeleteFile(selectedSubject!, file.name)}
                             >
                               <Trash2 className="w-4 h-4" />
                             </Button>
                             <Button variant="outline" size="sm" className="gap-2">
                               <Play className="w-4 h-4" />
                               Watch
                             </Button>
                           </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Empty state for no files */}
                  {docs.length === 0 && videos.length === 0 && (
                    <div className="text-center py-12">
                      <Coffee className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                      <h3 className="font-medium text-foreground mb-1">All caught up!</h3>
                      <p className="text-sm text-muted-foreground">
                        Grab a coffee. ☕ No materials here yet.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <FolderOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="font-medium text-foreground mb-1">Select a Subject</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose a subject from the left to view materials.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
         
         {/* Form Dialog */}
         <MaterialFormDialog
           open={formOpen}
           onOpenChange={setFormOpen}
           onSubmit={editingMaterial || editingFile ? handleEditMaterial : handleAddMaterial}
           editingMaterial={editingMaterial}
           editingFile={editingFile}
           existingSubjects={materials.map(m => m.subject)}
         />
         
         {/* Delete Confirmation */}
         <DeleteConfirmDialog
           open={deleteOpen}
           onOpenChange={setDeleteOpen}
           onConfirm={handleDelete}
           title={deleteTarget?.type === "subject" ? "Delete Subject?" : "Delete File?"}
           description={
             deleteTarget?.type === "subject"
               ? `This will remove "${deleteTarget.subject}" and all its files.`
               : `This will remove "${deleteTarget?.fileName}" from the subject.`
           }
         />
      </div>
    </DashboardLayout>
  );
};

export default StudentMaterials;
