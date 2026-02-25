import { useState, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UploadCloud, FileText, Plus, X, Eye, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Demo Data
const initialMaterials = [
  { id: "M-001", fileName: "React_Hooks_Cheatsheet.pdf", batchName: "Jan 2026 Batch", fileType: "PDF", uploadedDate: "20 Feb 2026" },
  { id: "M-002", fileName: "CSS_Grid_Presentation.ppt", batchName: "Oct 2025 Batch", fileType: "PPT", uploadedDate: "18 Feb 2026" },
  { id: "M-003", fileName: "JS_Fundamentals_Guide.docx", batchName: "Jan 2026 Batch", fileType: "DOCX", uploadedDate: "15 Feb 2026" },
  { id: "M-004", fileName: "API_Integration_Tutorial.mp4", batchName: "Feb 2026 Batch - Evening", fileType: "MP4", uploadedDate: "10 Feb 2026" },
];

const availableBatches = [
  "Jan 2026 Batch",
  "Oct 2025 Batch",
  "Feb 2026 Batch - Evening"
];

const TutorMaterials = () => {
  const { toast } = useToast();
  const [materials, setMaterials] = useState(initialMaterials);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag & Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    const validExtensions = ['.pdf', '.ppt', '.pptx', '.docx', '.mp4'];
    const fileName = file.name.toLowerCase();
    const isValid = validExtensions.some(ext => fileName.endsWith(ext));

    if (!isValid) {
      toast({
        title: "Invalid File Type",
        description: "Please upload .pdf, .ppt, .docx, or .mp4 files only.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleShare = () => {
    if (!selectedFile || !selectedBatch) {
      toast({
        title: "Missing Information",
        description: "Please attach a file and select a target batch.",
        variant: "destructive",
      });
      return;
    }

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    // Determine type string simply from extension
    const ext = selectedFile.name.split('.').pop()?.toUpperCase() || "FILE";

    const newMaterial = {
      id: `M-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      fileName: selectedFile.name,
      batchName: selectedBatch,
      fileType: ext,
      uploadedDate: formattedDate
    };

    setMaterials([newMaterial, ...materials]);

    // Reset and Close
    removeFile();
    setSelectedBatch("");
    setIsModalOpen(false);

    toast({
      title: "Material Shared",
      description: "Successfully uploaded and shared with the selected cohort.",
    });
  };

  // Mock Actions
  const handleRemoveMaterial = (id: string) => {
    setMaterials(materials.filter(m => m.id !== id));
    toast({
      title: "Material Removed",
      description: "The resource is no longer available to students.",
    });
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6 lg:space-y-8 max-w-6xl mx-auto">

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
              Learning Materials
            </h1>
            <p className="text-muted-foreground mt-2">
              Distribute documents, presentations, and recordings to your active batches.
            </p>
          </div>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-sm">
                <Plus className="w-4 h-4" />
                Share Material
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Share New Material</DialogTitle>
                <DialogDescription>
                  Upload a resource to distribute to an active Learning Phase cohort.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-6 py-4">

                {/* Drag & Drop Zone */}
                <div className="grid gap-2">
                  <Label className="text-sm font-medium">Upload File <span className="text-destructive">*</span></Label>

                  {!selectedFile ? (
                    <div
                      className={`
                        border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer
                        ${isDragging ? 'border-primary bg-primary/5' : 'border-border/60 bg-muted/20 hover:bg-muted/40 hover:border-primary/50'}
                      `}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileInput}
                        accept=".pdf,.ppt,.pptx,.docx,.mp4"
                      />
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <UploadCloud className="w-6 h-6 text-primary" />
                      </div>
                      <p className="text-sm font-medium text-foreground mb-1">
                        Drag & drop your file here or click to browse
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Supported formats: .pdf, .ppt, .docx, .mp4 (Max 50MB)
                      </p>
                    </div>
                  ) : (
                    <div className="border border-border/50 rounded-xl p-4 flex items-center justify-between bg-muted/10">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div className="truncate">
                          <p className="text-sm font-medium text-foreground truncate">{selectedFile.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={removeFile} className="shrink-0 text-muted-foreground hover:text-destructive">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Batch Selection */}
                <div className="grid gap-2">
                  <Label className="text-sm font-medium">Target Batch <span className="text-destructive">*</span></Label>
                  <Select
                    value={selectedBatch}
                    onValueChange={setSelectedBatch}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select cohort to share with..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableBatches.map(b => (
                        <SelectItem key={b} value={b}>{b}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setIsModalOpen(false);
                  removeFile();
                  setSelectedBatch("");
                }}>
                  Cancel
                </Button>
                <Button onClick={handleShare} className="gap-2">
                  <UploadCloud className="w-4 h-4" />
                  Share Resource
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Materials Table Card */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Shared Materials Repository
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="pl-6 w-[350px]">File Name</TableHead>
                    <TableHead>Batch</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Uploaded Date</TableHead>
                    <TableHead className="pr-6 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {materials.length > 0 ? (
                    materials.map((material) => (
                      <TableRow key={material.id} className="hover:bg-muted/20 transition-colors">
                        <TableCell className="pl-6">
                          <div className="flex items-center gap-3">
                            <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                            <span className="font-medium text-foreground line-clamp-1">
                              {material.fileName}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="font-normal text-muted-foreground">
                            {material.batchName}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs bg-muted text-muted-foreground">
                            {material.fileType}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {material.uploadedDate}
                        </TableCell>
                        <TableCell className="pr-6 text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-8 h-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                              title="View Material"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-8 h-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleRemoveMaterial(material.id)}
                              title="Remove Material"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No materials have been shared yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  );
};

export default TutorMaterials;
