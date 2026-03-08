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
import { UploadCloud, FileText, Plus, X, Eye, Trash2, Download, Video, ImageIcon, Code2, Archive, FileQuestion } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Demo Data
const initialMaterials = [
  { id: "M-001", fileName: "React_Hooks_Cheatsheet.pdf", batchName: "Jan 2026 Batch", category: "Document", fileType: "PDF", uploadedDate: "20 Feb 2026" },
  { id: "M-002", fileName: "CSS_Grid_Presentation.ppt", batchName: "Oct 2025 Batch", category: "Document", fileType: "PPT", uploadedDate: "18 Feb 2026" },
  { id: "M-003", fileName: "JS_Fundamentals_Guide.docx", batchName: "Jan 2026 Batch", category: "Document", fileType: "DOCX", uploadedDate: "15 Feb 2026" },
  { id: "M-004", fileName: "API_Integration_Tutorial.mp4", batchName: "Feb 2026 Batch - Evening", category: "Video", fileType: "MP4", uploadedDate: "10 Feb 2026" },
];

const availableBatches = [
  "Jan 2026 Batch",
  "Oct 2025 Batch",
  "Feb 2026 Batch - Evening"
];

// File category detection helper
const getFileCategory = (fileName: string): string => {
  const ext = fileName.split('.').pop()?.toLowerCase() || "";
  if (['pdf', 'doc', 'docx', 'ppt', 'pptx', 'txt'].includes(ext)) return "Document";
  if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)) return "Image";
  if (['mp4', 'mov', 'webm'].includes(ext)) return "Video";
  if (['json', 'js', 'html', 'css', 'xml'].includes(ext)) return "Code";
  if (['zip', 'rar'].includes(ext)) return "Archive";
  return "Other";
};

// Icon selector helper
const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Image": return <ImageIcon className="w-4 h-4" />;
    case "Video": return <Video className="w-4 h-4" />;
    case "Code": return <Code2 className="w-4 h-4" />;
    case "Archive": return <Archive className="w-4 h-4" />;
    case "Document": return <FileText className="w-4 h-4" />;
    default: return <FileQuestion className="w-4 h-4" />;
  }
};

const TutorMaterials = () => {
  const { toast } = useToast();
  const [materials, setMaterials] = useState(initialMaterials);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState<typeof initialMaterials[0] | null>(null);

  // Upload State
  interface SelectedFile {
    id: string;
    file: File;
    previewUrl?: string;
  }
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
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
      validateAndAddFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndAddFiles(e.target.files);
    }
  };

  const validateAndAddFiles = (files: FileList) => {
    const supportedExts = [
      'pdf', 'doc', 'docx', 'ppt', 'pptx', 'txt',
      'jpg', 'jpeg', 'png', 'webp', 'gif',
      'json', 'js', 'html', 'css', 'xml',
      'mp4', 'mov', 'webm',
      'zip', 'rar'
    ];

    const newSelectedFiles: SelectedFile[] = [];
    const MAX_SIZE = 50 * 1024 * 1024; // 50MB per file

    Array.from(files).forEach(file => {
      const fileName = file.name.toLowerCase();
      const ext = fileName.split('.').pop() || "";
      const isValidType = supportedExts.includes(ext);

      if (!isValidType) {
        toast({
          title: "Unsupported file format.",
          description: `Skipped ${file.name} - Unsupported extension.`,
          variant: "destructive",
        });
        return;
      }

      if (file.size > MAX_SIZE) {
        toast({
          title: "File Too Large",
          description: `Skipped ${file.name} - Exceeds 50MB limit.`,
          variant: "destructive",
        });
        return;
      }

      let previewUrl: string | undefined;
      if (getFileCategory(file.name) === "Image") {
        previewUrl = URL.createObjectURL(file);
      }

      newSelectedFiles.push({
        id: Math.random().toString(36).substring(7),
        file,
        previewUrl
      });
    });

    setSelectedFiles(prev => [...prev, ...newSelectedFiles]);
  };

  const removeFile = (id: string) => {
    setSelectedFiles(prev => {
      const filtered = prev.filter(f => {
        if (f.id === id && f.previewUrl) {
          URL.revokeObjectURL(f.previewUrl);
        }
        return f.id !== id;
      });
      return filtered;
    });
  };

  const clearUploadState = () => {
    selectedFiles.forEach(f => {
      if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
    });
    setSelectedFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleShare = () => {
    if (selectedFiles.length === 0 || !selectedBatch) {
      toast({
        title: "Missing Information",
        description: "Please attach at least one file and select a target batch.",
        variant: "destructive",
      });
      return;
    }

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    const newEntries = selectedFiles.map(sf => {
      const ext = sf.file.name.split('.').pop()?.toUpperCase() || "FILE";
      const category = getFileCategory(sf.file.name);
      return {
        id: `M-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}-${Math.random().toString(36).substring(7)}`,
        fileName: sf.file.name,
        batchName: selectedBatch,
        category: category,
        fileType: ext,
        uploadedDate: formattedDate
      };
    });

    setMaterials([...newEntries, ...materials]);

    // Reset and Close
    clearUploadState();
    setSelectedBatch("");
    setIsModalOpen(false);

    toast({
      title: "Materials Shared",
      description: `Successfully shared ${newEntries.length} resource(s) with the selected cohort.`,
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

  const handlePreview = (material: typeof initialMaterials[0]) => {
    setSelectedPreview(material);
    setIsPreviewOpen(true);
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
                  Upload one or more resources to distribute to an active Learning Phase cohort.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-6 py-4">

                {/* Drag & Drop Zone / File List */}
                <div className="grid gap-2">
                  <Label className="text-sm font-medium">Upload Files <span className="text-destructive">*</span></Label>

                  <div
                    className={`
                        border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer mb-2
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
                      multiple
                      accept=".png,.jpg,.jpeg,.webp,.gif,.pdf,.doc,.docx,.ppt,.pptx,.txt,.mp4,.mov,.webm,.json,.js,.html,.css,.zip,.rar"
                    />
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                      <UploadCloud className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-sm font-medium text-foreground mb-1">
                      Drag & drop multiple files or click to browse
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Max 50MB per file
                    </p>
                  </div>

                  {selectedFiles.length > 0 && (
                    <div className="grid gap-2 max-h-[220px] overflow-y-auto pr-1">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Selected Files ({selectedFiles.length})</p>
                      {selectedFiles.map((sf) => (
                        <div key={sf.id} className="border border-border/50 rounded-lg p-2.5 flex items-center justify-between bg-muted/10 group hover:border-primary/30 transition-colors">
                          <div className="flex items-center gap-3 overflow-hidden">
                            {sf.previewUrl ? (
                              <div className="w-8 h-8 rounded-md overflow-hidden shrink-0 border border-border/50">
                                <img src={sf.previewUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                              </div>
                            ) : (
                              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                                {getCategoryIcon(getFileCategory(sf.file.name))}
                              </div>
                            )}
                            <div className="truncate min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">{sf.file.name}</p>
                              <p className="text-[10px] text-muted-foreground">
                                {(sf.file.size / (1024 * 1024)).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile(sf.id);
                            }}
                            className="w-7 h-7 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          >
                            <X className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      ))}
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
                  clearUploadState();
                  setSelectedBatch("");
                }}>
                  Cancel
                </Button>
                <Button onClick={handleShare} className="gap-2 min-w-[140px]">
                  <UploadCloud className="w-4 h-4" />
                  Share Resource
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Materials Table Card */}
        <Card className="border-border/50 shadow-sm" >
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
                            <div className="text-muted-foreground shrink-0">
                              {getCategoryIcon(material.category)}
                            </div>
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
                          <Badge variant="outline" className="text-xs bg-muted text-muted-foreground font-medium">
                            {material.category || material.fileType}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {material.uploadedDate}
                        </TableCell>
                        <TableCell className="pr-6 text-right">
                          <div className="flex justify-end gap-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="w-8 h-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                                    onClick={() => handlePreview(material)}
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>View Material</TooltipContent>
                              </Tooltip>

                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="w-8 h-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => handleRemoveMaterial(material.id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Delete Material</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
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
        </Card >

        {/* Material Preview Dialog */}
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col p-0 overflow-hidden border-border/50 shadow-2xl">
            <DialogHeader className="p-6 pb-4 border-b border-border/50 bg-muted/20">
              <div className="flex flex-col gap-1">
                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Material Preview
                </DialogTitle>
                {selectedPreview && (
                  <p className="text-sm text-muted-foreground font-medium">
                    {selectedPreview.fileName}
                  </p>
                )}
              </div>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto p-6 bg-background">
              {selectedPreview && (
                <div className="space-y-6">
                  {/* File Metadata Overview */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-muted/30 border border-border/40 shadow-inner">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Batch</p>
                      <p className="text-sm font-semibold text-foreground truncate">{selectedPreview.batchName}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Type</p>
                      <Badge variant="outline" className="text-[10px] bg-background">{selectedPreview.fileType}</Badge>
                    </div>
                    <div className="space-y-1 text-center border-l border-border/40 pl-4">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Uploaded</p>
                      <p className="text-sm font-medium text-foreground">{selectedPreview.uploadedDate}</p>
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Status</p>
                      <p className="text-sm font-bold text-emerald-600">Active</p>
                    </div>
                  </div>

                  {/* Dynamic Preview Content */}
                  <div className="border border-border/50 rounded-xl overflow-hidden bg-muted/10 min-h-[400px] flex flex-col shadow-sm">
                    {selectedPreview.fileType === "PDF" ? (
                      <div className="flex-1 flex flex-col">
                        <iframe
                          src={`https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf`} // Placeholder for demo
                          className="w-full h-[500px] border-none"
                          title="PDF Preview"
                        />
                      </div>
                    ) : selectedPreview.category === "Video" ? (
                      <div className="flex-1 bg-black flex items-center justify-center h-[450px]">
                        <video controls className="max-w-full max-h-full aspect-video shadow-2xl">
                          <source src="" type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    ) : selectedPreview.category === "Image" ? (
                      <div className="flex-1 bg-muted/30 flex items-center justify-center p-4">
                        <img
                          src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60" // Placeholder
                          alt="Preview"
                          className="max-w-full max-h-[500px] rounded-lg shadow-lg object-contain"
                        />
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-4">
                        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center transform rotate-6 hover:rotate-0 transition-transform duration-300">
                          {getCategoryIcon(selectedPreview.category)}
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-lg font-bold text-foreground">Preview not available</h3>
                          <p className="text-sm text-muted-foreground max-w-[260px] mx-auto">
                            Direct preview is not supported for {selectedPreview.category} files. Please download to view the content.
                          </p>
                        </div>
                        <Button className="gap-2 shadow-md">
                          <Download className="w-4 h-4" />
                          Download to View
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="p-6 border-t border-border/50 bg-muted/20 flex gap-3">
              <Button variant="outline" onClick={() => setIsPreviewOpen(false)} className="flex-1 sm:flex-none">
                Close
              </Button>
              <Button className="flex-1 sm:flex-none gap-2 shadow-sm font-bold">
                <Download className="w-4 h-4" />
                Download Material
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </DashboardLayout>
  );
};

export default TutorMaterials;
