import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Users, Search, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Helper to convert DD MMM YYYY to YYYY-MM-DD for date inputs
const formatDateForInput = (dateString: string) => {
  if (!dateString) return "";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().split('T')[0];
  } catch (e) {
    return "";
  }
};

// Initial Demo Data (Updated to shorter 3-month cycles per previous context)
const initialBatches = [
  {
    id: "B-001",
    name: "Jan 2026 Batch",
    startDate: "15 Jan 2026",
    endDate: "15 Apr 2026",
    totalStudents: 120,
    phase: "Learning",
    status: "Active"
  },
  {
    id: "B-002",
    name: "Oct 2025 Batch",
    startDate: "10 Oct 2025",
    endDate: "10 Jan 2026",
    totalStudents: 95,
    phase: "Internship",
    status: "Active"
  },
  {
    id: "B-003",
    name: "Jul 2025 Batch",
    startDate: "05 Jul 2025",
    endDate: "05 Oct 2025",
    totalStudents: 110,
    phase: "Completed",
    status: "Completed"
  },
  {
    id: "B-004",
    name: "Apr 2025 Batch",
    startDate: "12 Apr 2025",
    endDate: "12 Jul 2025",
    totalStudents: 85,
    phase: "Completed",
    status: "Completed"
  }
];

const SuperAdminBatches = () => {
  const { toast } = useToast();
  const [batches, setBatches] = useState(initialBatches);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingBatchId, setEditingBatchId] = useState<string | null>(null);
  const [batchToDelete, setBatchToDelete] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    totalStudents: "",
    phase: "Learning",
    status: "Active"
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openCreateModal = () => {
    setEditingBatchId(null);
    setFormData({
      name: "",
      startDate: "",
      endDate: "",
      totalStudents: "",
      phase: "Learning",
      status: "Active"
    });
    setIsModalOpen(true);
  };

  const openEditModal = (batch: typeof initialBatches[0]) => {
    setEditingBatchId(batch.id);
    setFormData({
      name: batch.name,
      startDate: formatDateForInput(batch.startDate),
      endDate: formatDateForInput(batch.endDate),
      totalStudents: batch.totalStudents.toString(),
      phase: batch.phase,
      status: batch.status
    });
    setIsModalOpen(true);
  };

  const confirmDelete = (id: string) => {
    setBatchToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = () => {
    if (batchToDelete) {
      setBatches(batches.filter(b => b.id !== batchToDelete));
      toast({
        title: "Batch Deleted",
        description: "The batch has been successfully removed.",
      });
      setIsDeleteModalOpen(false);
      setBatchToDelete(null);
    }
  };

  const validateAndSubmit = () => {
    // Basic Validation
    if (!formData.name || !formData.startDate || !formData.endDate || !formData.totalStudents) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (isNaN(Number(formData.totalStudents)) || Number(formData.totalStudents) <= 0) {
      toast({
        title: "Invalid Input",
        description: "Total students must be a valid positive number.",
        variant: "destructive",
      });
      return;
    }

    // Prepare Date formatting
    const formattedStartDate = new Date(formData.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const formattedEndDate = new Date(formData.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    if (editingBatchId) {
      // Update existing
      setBatches(batches.map(batch =>
        batch.id === editingBatchId
          ? {
            ...batch,
            name: formData.name,
            startDate: formattedStartDate,
            endDate: formattedEndDate,
            totalStudents: Number(formData.totalStudents),
            phase: formData.phase,
            status: formData.status
          }
          : batch
      ));
      toast({
        title: "Batch Updated",
        description: "The batch details have been successfully updated.",
      });
    } else {
      // Create new
      const createdBatch = {
        id: `B-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        name: formData.name,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        totalStudents: Number(formData.totalStudents),
        phase: formData.phase,
        status: formData.status
      };
      setBatches([createdBatch, ...batches]);
      toast({
        title: "Success",
        description: "New batch has been successfully created.",
      });
    }

    // Reset and Close
    setIsModalOpen(false);
  };

  // Filter batches based on search
  const filteredBatches = batches.filter(batch =>
    batch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    batch.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6 lg:space-y-8 max-w-6xl mx-auto">

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
              Batches
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage student cohorts, timelines, and active phases.
            </p>
          </div>

          <Button onClick={openCreateModal} className="gap-2 shadow-sm">
            <Plus className="w-4 h-4" />
            Create Batch
          </Button>

          {/* Form Modal (Create / Edit) */}
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{editingBatchId ? "Edit Batch" : "Create New Batch"}</DialogTitle>
                <DialogDescription>
                  {editingBatchId
                    ? "Update the details for this cohort. Changes appear immediately."
                    : "Enter the details for the new batch cohort. They will appear immediately in the table."}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-sm font-medium">Batch Name <span className="text-destructive">*</span></Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g. Apr 2026 Batch"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="startDate" className="text-sm font-medium">Start Date <span className="text-destructive">*</span></Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="endDate" className="text-sm font-medium">End Date <span className="text-destructive">*</span></Label>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="totalStudents" className="text-sm font-medium">Total Students <span className="text-destructive">*</span></Label>
                  <Input
                    id="totalStudents"
                    name="totalStudents"
                    type="number"
                    min="1"
                    placeholder="Total expected enrollments"
                    value={formData.totalStudents}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="text-sm font-medium">Phase</Label>
                    <Select
                      value={formData.phase}
                      onValueChange={(value) => handleSelectChange('phase', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select phase" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Learning">Learning</SelectItem>
                        <SelectItem value="Internship">Internship</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label className="text-sm font-medium">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleSelectChange('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Paused">Paused</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={validateAndSubmit} className="gap-2">
                  {editingBatchId ? "Update Batch" : "Save Batch"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Modal */}
          <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle className="text-destructive">Confirm Deletion</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this batch? This action cannot be undone, and the batch will be removed immediately.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={executeDelete}>
                  Delete Batch
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

        </div>

        {/* Batches Table Card */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              All Batches
            </CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search batches..."
                className="pl-9 bg-muted/30"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="pl-6.5 w-[200px]">Batch Name</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead className="text-center">Total Students</TableHead>
                    <TableHead>Phase</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="pr-6 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBatches.length > 0 ? (
                    filteredBatches.map((batch) => (
                      <TableRow key={batch.id} className="hover:bg-muted/20 transition-colors">
                        <TableCell className="pl-6 font-medium text-foreground">
                          {batch.name}
                        </TableCell>
                        <TableCell className="text-muted-foreground whitespace-nowrap">{batch.startDate}</TableCell>
                        <TableCell className="text-muted-foreground whitespace-nowrap">{batch.endDate}</TableCell>
                        <TableCell className="text-center font-semibold text-foreground">
                          {batch.totalStudents}
                        </TableCell>
                        <TableCell>
                          {batch.phase === "Learning" && (
                            <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">Learning</Badge>
                          )}
                          {batch.phase === "Internship" && (
                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Internship</Badge>
                          )}
                          {batch.phase === "Completed" && (
                            <Badge variant="secondary" className="text-muted-foreground">Completed</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={
                            batch.status === "Active"
                              ? "bg-primary/10 text-primary border-primary/20"
                              : "bg-muted text-muted-foreground"
                          }>
                            {batch.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="pr-6 text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-8 h-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                              onClick={() => openEditModal(batch)}
                              title="Edit Batch"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-8 h-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                              onClick={() => confirmDelete(batch.id)}
                              title="Delete Batch"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No batches found matching your search.
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

export default SuperAdminBatches;
