import { useState, useRef, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  UploadCloud,
  FileText,
  Plus,
  X,
  Eye,
  Trash2,
  Download,
  Video,
  ImageIcon,
  Code2,
  Archive,
  FileQuestion,
  ChevronRight,
  Search,
  BookOpen,
  MoreVertical,
  Edit2,
  ArrowLeft,
  Layers
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// Types
interface Course {
  id: string;
  name: string;
  description: string;
  studentCount: number;
  moduleCount: number;
  image: string;
}

interface Module {
  id: string;
  name: string;
  courseId: string;
}

interface Material {
  id: string;
  name: string;
  moduleId: string;
  courseId: string;
  type: "PDF" | "Video" | "DOCX" | "Slides" | "Code" | "Other";
  uploadedDate: string;
}

// Demo Data
const courses: Course[] = [
  {
    id: "C-001",
    name: "Full Stack Development",
    description: "Master modern web development from HTML to advanced React and Node.js.",
    studentCount: 124,
    moduleCount: 12,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: "C-002",
    name: "Python Backend Development",
    description: "Build robust backend systems with Python, Django, and PostgreSQL.",
    studentCount: 86,
    moduleCount: 8,
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&auto=format&fit=crop&q=60"
  }
];

const modules: Module[] = [
  { id: "MOD-001", name: "Module 1 – HTML Basics", courseId: "C-001" },
  { id: "MOD-002", name: "Module 2 – CSS Fundamentals", courseId: "C-001" },
  { id: "MOD-003", name: "Module 3 – JavaScript Core", courseId: "C-001" },
  { id: "MOD-004", name: "Module 1 – Python Syntax", courseId: "C-002" },
  { id: "MOD-005", name: "Module 2 – Data Structures", courseId: "C-002" },
];

const initialMaterials: Material[] = [
  { id: "MAT-001", name: "React_Hooks_Cheatsheet.pdf", moduleId: "MOD-003", courseId: "C-001", type: "PDF", uploadedDate: "20 Feb 2026" },
  { id: "MAT-002", name: "CSS_Layouts_Presentation.pptx", moduleId: "MOD-002", courseId: "C-001", type: "Slides", uploadedDate: "18 Feb 2026" },
  { id: "MAT-003", name: "Python_Basics_Guide.docx", moduleId: "MOD-004", courseId: "C-002", type: "DOCX", uploadedDate: "15 Feb 2026" },
  { id: "MAT-004", name: "Node_Architecture_Video.mp4", moduleId: "MOD-003", courseId: "C-001", type: "Video", uploadedDate: "10 Feb 2026" },
];

// Helper to get Icon
const getMaterialIcon = (type: string) => {
  switch (type) {
    case "PDF": return <FileText className="w-4 h-4 text-rose-500" />;
    case "Video": return <Video className="w-4 h-4 text-blue-500" />;
    case "Slides": return <ImageIcon className="w-4 h-4 text-orange-500" />;
    case "Code": return <Code2 className="w-4 h-4 text-emerald-500" />;
    case "DOCX": return <FileText className="w-4 h-4 text-blue-600" />;
    default: return <FileQuestion className="w-4 h-4 text-muted-foreground" />;
  }
};

const TutorMaterials = () => {
  const { toast } = useToast();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [materials, setMaterials] = useState<Material[]>(initialMaterials);
  const [searchQuery, setSearchQuery] = useState("");

  // Management State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);

  // Form State
  const [newMaterialName, setNewMaterialName] = useState("");
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [selectedType, setSelectedType] = useState<Material["type"]>("PDF");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtered Materials for selected course
  const courseMaterials = useMemo(() => {
    if (!selectedCourse) return [];
    return materials.filter(m => m.courseId === selectedCourse.id);
  }, [materials, selectedCourse]);

  const filteredMaterials = useMemo(() => {
    return courseMaterials.filter(m =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [courseMaterials, searchQuery]);

  // Handle Upload
  const handleUpload = () => {
    if (!newMaterialName || !selectedModuleId || !selectedCourse) return;

    const newEntry: Material = {
      id: `MAT-${Math.floor(Math.random() * 9000) + 1000}`,
      name: newMaterialName,
      moduleId: selectedModuleId,
      courseId: selectedCourse.id,
      type: selectedType,
      uploadedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    setMaterials([newEntry, ...materials]);
    setIsUploadModalOpen(false);
    resetForm();
    toast({ title: "Material Uploaded", description: `${newMaterialName} has been added.` });
  };

  // Handle Edit
  const handleEdit = () => {
    if (!selectedMaterial || !newMaterialName || !selectedModuleId) return;

    setMaterials(materials.map(m =>
      m.id === selectedMaterial.id
        ? { ...m, name: newMaterialName, moduleId: selectedModuleId, type: selectedType }
        : m
    ));
    setIsEditModalOpen(false);
    resetForm();
    toast({ title: "Material Updated", description: "Changes saved successfully." });
  };

  // Handle Delete
  const handleDelete = (id: string) => {
    setMaterials(materials.filter(m => m.id !== id));
    toast({ title: "Material Deleted", variant: "destructive", description: "The resource has been removed." });
  };

  const resetForm = () => {
    setNewMaterialName("");
    setSelectedModuleId("");
    setSelectedType("PDF");
    setSelectedMaterial(null);
  };

  const openEditModal = (material: Material) => {
    setSelectedMaterial(material);
    setNewMaterialName(material.name);
    setSelectedModuleId(material.moduleId);
    setSelectedType(material.type);
    setIsEditModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6 lg:space-y-8 max-w-6xl mx-auto pb-10">

        {!selectedCourse ? (
          /* Step 1: Course Selection View */
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
                Learning Materials
              </h1>
              <p className="text-muted-foreground mt-2">
                Select a course to manage and distribute learning resources.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map((course) => (
                <Card key={course.id} className="group overflow-hidden hover:border-primary/50 transition-all hover:shadow-xl cursor-pointer" onClick={() => setSelectedCourse(course)}>
                  <div className="aspect-[21/9] overflow-hidden relative">
                    <img src={course.image} alt={course.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <Badge className="bg-primary/90 hover:bg-primary border-none mb-2">
                        {course.moduleCount} Modules
                      </Badge>
                      <h3 className="text-xl font-bold">{course.name}</h3>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-6">
                      {course.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium">
                        <div className="flex items-center gap-1.5">
                          <BookOpen className="w-4 h-4" />
                          {course.moduleCount} Modules
                        </div>
                        <div className="flex items-center gap-1.5 border-l border-border pl-4">
                          <Layers className="w-4 h-4" />
                          {materials.filter(m => m.courseId === course.id).length} Materials
                        </div>
                      </div>
                      <Button variant="ghost" className="group-hover:text-primary gap-1 px-0 hover:bg-transparent">
                        View Materials <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          /* Step 2: Module-Based Materials View */
          <div className="space-y-6">
            {/* Sub-Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => setSelectedCourse(null)} className="h-9 w-9 rounded-full hover:bg-primary/10 hover:text-primary">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                  <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-foreground">
                    {selectedCourse.name}
                  </h1>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                    <span>Learning Materials</span>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-primary font-medium">{courseMaterials.length} Items</span>
                  </div>
                </div>
              </div>
              <Button onClick={() => setIsUploadModalOpen(true)} className="gap-2 shadow-lg shadow-primary/20">
                <Plus className="w-4 h-4" />
                Upload Material
              </Button>
            </div>

            {/* Search Bar */}
            <div className="max-w-md relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by file name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card/50"
              />
            </div>

            {/* Modules & Materials */}
            <div className="space-y-8">
              {modules.filter(mod => mod.courseId === selectedCourse.id).map((module) => {
                const moduleMaterials = filteredMaterials.filter(m => m.moduleId === module.id);
                if (searchQuery && moduleMaterials.length === 0) return null;

                return (
                  <div key={module.id} className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                        {module.name.match(/\d+/)?.[0] || "M"}
                      </div>
                      <h2 className="text-lg font-bold text-foreground">{module.name}</h2>
                      <Badge variant="secondary" className="bg-muted text-muted-foreground font-normal">
                        {moduleMaterials.length} resources
                      </Badge>
                    </div>

                    <Card className="border-border/50 shadow-sm overflow-hidden">
                      <CardContent className="p-0">
                        <Table>
                          <TableHeader className="bg-muted/30">
                            <TableRow className="hover:bg-transparent">
                              <TableHead className="pl-6 w-[400px]">Material Name</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Uploaded Date</TableHead>
                              <TableHead className="pr-6 text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {moduleMaterials.length > 0 ? (
                              moduleMaterials.map((material) => (
                                <TableRow key={material.id} className="hover:bg-muted/20 transition-colors">
                                  <TableCell className="pl-6 py-4">
                                    <div className="flex items-center gap-3">
                                      <div className="p-1.5 rounded bg-muted/50">
                                        {getMaterialIcon(material.type)}
                                      </div>
                                      <span className="font-semibold text-foreground">{material.name}</span>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider bg-background">
                                      {material.type}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-sm text-muted-foreground">
                                    {material.uploadedDate}
                                  </TableCell>
                                  <TableCell className="pr-6 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                                              <Download className="w-4 h-4" />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>Download</TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>

                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreVertical className="w-4 h-4" />
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-40 font-bold">
                                          <DropdownMenuItem onClick={() => openEditModal(material)} className="gap-2">
                                            <Edit2 className="w-4 h-4" /> Edit
                                          </DropdownMenuItem>
                                          <DropdownMenuItem className="text-destructive gap-2 focus:text-destructive" onClick={() => handleDelete(material.id)}>
                                            <Trash2 className="w-4 h-4" /> Delete
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground italic text-sm">
                                  No materials uploaded for this module yet.
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <Dialog open={isUploadModalOpen} onOpenChange={(val) => { setIsUploadModalOpen(val); if (!val) resetForm(); }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-primary" />
              Upload Learning Material
            </DialogTitle>
            <DialogDescription>
              Add new resources to {selectedCourse?.name}.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="font-bold">Material Name</Label>
              <Input
                id="name"
                placeholder="e.g. Intro_to_HTML.pdf"
                value={newMaterialName}
                onChange={(e) => setNewMaterialName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="font-bold">Module</Label>
                <Select value={selectedModuleId} onValueChange={setSelectedModuleId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Module" />
                  </SelectTrigger>
                  <SelectContent>
                    {modules.filter(m => m.courseId === selectedCourse?.id).map(m => (
                      <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label className="font-bold">File Type</Label>
                <Select value={selectedType} onValueChange={(v) => setSelectedType(v as Material["type"])}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PDF">PDF Document</SelectItem>
                    <SelectItem value="Video">Video Link/File</SelectItem>
                    <SelectItem value="Slides">Presentation Slides</SelectItem>
                    <SelectItem value="DOCX">Word Document</SelectItem>
                    <SelectItem value="Code">Source Code</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center bg-muted/20 hover:bg-muted/40 transition-all cursor-pointer border-border/60" onClick={() => fileInputRef.current?.click()}>
              <input type="file" ref={fileInputRef} className="hidden" />
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Plus className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm font-bold text-foreground">Select File</p>
              <p className="text-xs text-muted-foreground mt-1">Supports PDF, Video, Slides, and Docs</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadModalOpen(false)} className="font-bold">Cancel</Button>
            <Button onClick={handleUpload} disabled={!newMaterialName || !selectedModuleId} className="font-bold min-w-[120px]">Upload Now</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={(val) => { setIsEditModalOpen(val); if (!val) resetForm(); }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit2 className="w-5 h-5 text-primary" />
              Edit Learning Material
            </DialogTitle>
            <DialogDescription>
              Update the details for this shared resource.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name" className="font-bold">Material Name</Label>
              <Input
                id="edit-name"
                value={newMaterialName}
                onChange={(e) => setNewMaterialName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="font-bold">Module</Label>
                <Select value={selectedModuleId} onValueChange={setSelectedModuleId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Module" />
                  </SelectTrigger>
                  <SelectContent>
                    {modules.filter(m => m.courseId === selectedCourse?.id).map(m => (
                      <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label className="font-bold">File Type</Label>
                <Select value={selectedType} onValueChange={(v) => setSelectedType(v as Material["type"])}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PDF">PDF Document</SelectItem>
                    <SelectItem value="Video">Video Link/File</SelectItem>
                    <SelectItem value="Slides">Presentation Slides</SelectItem>
                    <SelectItem value="DOCX">Word Document</SelectItem>
                    <SelectItem value="Code">Source Code</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)} className="font-bold">Cancel</Button>
            <Button onClick={handleEdit} className="font-bold min-w-[120px]">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </DashboardLayout>
  );
};

export default TutorMaterials;
