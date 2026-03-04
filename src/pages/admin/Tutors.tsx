import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  MoreVertical,
  Eye,
  Power,
  UserPlus,
  Users,
  UserCheck,
  GraduationCap,
  UserX
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { mockTutors, mockStudents } from "@/data/mockTutors";
import { StatusBadge } from "@/components/admin/tutors/StatusBadge";
import { WorkloadBadge } from "@/components/admin/tutors/WorkloadBadge";
import { AddTutorModal } from "@/components/admin/tutors/AddTutorModal";
import { EditTutorModal } from "@/components/admin/tutors/EditTutorModal";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Edit2 } from "lucide-react";

const AdminTutors = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  // State
  const [tutors, setTutors] = useState(mockTutors);
  const [students, setStudents] = useState(mockStudents);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editModalTutor, setEditModalTutor] = useState<typeof mockTutors[0] | null>(null);
  const [assignModalTutor, setAssignModalTutor] = useState<typeof mockTutors[0] | null>(null);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  // Derived Summary Metrics
  const totalTutors = tutors.length;
  const activeTutors = tutors.filter(t => t.status === "Active").length;
  const totalAssignedStudents = students.filter(s => s.assignedTutorId !== null).length;
  const totalUnassignedStudents = students.filter(s => s.assignedTutorId === null).length;

  // Derive workload
  const tutorsWithWorkload = tutors.map(tutor => {
    const assignedStudents = students.filter(s => s.assignedTutorId === tutor.id);
    const activeStudents = assignedStudents.filter(s => s.status === "Active");
    return {
      ...tutor,
      totalStudentsCount: assignedStudents.length,
      activeStudentsCount: activeStudents.length
    };
  });

  // Filter list
  const filteredTutors = tutorsWithWorkload.filter(tutor => {
    const matchesSearch =
      tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === "All" || tutor.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Actions
  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    setTutors(tutors.map(t => t.id === id ? { ...t, status: newStatus } : t));

    toast({
      title: "Status Updated",
      description: `Tutor account has been marked as ${newStatus}.`
    });
  };

  const handleSaveNewTutor = (newTutor: typeof mockTutors[0]) => {
    setTutors([newTutor, ...tutors]);
    setIsAddModalOpen(false);
    toast({
      title: "Tutor Created",
      description: `${newTutor.name} has been successfully added to the system.`
    });
  };

  const handleSaveEditTutor = (updatedTutor: typeof mockTutors[0]) => {
    setTutors(tutors.map(t => t.id === updatedTutor.id ? updatedTutor : t));
    setEditModalTutor(null);
    toast({
      title: "Tutor Updated",
      description: `${updatedTutor.name}'s profile has been updated.`
    });
  };

  const handleAssignStudentSave = () => {
    if (!assignModalTutor || selectedStudentIds.length === 0) return;

    // 1. Map new Tutor ID to selected students
    setStudents(students.map(s =>
      selectedStudentIds.includes(s.id) ? { ...s, assignedTutorId: assignModalTutor.id } : s
    ));

    // 2. Append new student IDs to the mapped Array on Tutor object
    setTutors(tutors.map(t =>
      t.id === assignModalTutor.id
        ? { ...t, assignedStudentIds: [...t.assignedStudentIds, ...selectedStudentIds] }
        : t
    ));

    toast({
      title: "Students Assigned",
      description: `${selectedStudentIds.length} student(s) successfully assigned to ${assignModalTutor.name}.`
    });

    setAssignModalTutor(null);
    setSelectedStudentIds([]);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Tutor Management</h1>
            <p className="text-muted-foreground mt-1">Control tutor accounts and monitor workload</p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Add Tutor
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Tutors</p>
                <h3 className="text-2xl font-bold text-foreground">{totalTutors}</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                <UserCheck className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Tutors</p>
                <h3 className="text-2xl font-bold text-foreground">{activeTutors}</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Assigned Students</p>
                <h3 className="text-2xl font-bold text-foreground">{totalAssignedStudents}</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                <UserX className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Unassigned Students</p>
                <h3 className="text-2xl font-bold text-foreground">{totalUnassignedStudents}</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-background w-full"
              />
            </div>
            <div className="w-full sm:w-[180px]">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="border-border/50 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="min-w-[180px]">Name</TableHead>
                  <TableHead className="min-w-[150px]">Email</TableHead>
                  <TableHead>Total Students</TableHead>
                  <TableHead>Active Students</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTutors.length > 0 ? (
                  filteredTutors.map((tutor) => (
                    <TableRow key={tutor.id} className="hover:bg-muted/20">
                      <TableCell className="font-medium text-foreground">
                        {tutor.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {tutor.email}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className="font-semibold">{tutor.totalStudentsCount}</span>
                          <WorkloadBadge studentCount={tutor.totalStudentsCount} />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 font-medium">
                          <Users className="w-3.5 h-3.5 text-emerald-600" />
                          {tutor.activeStudentsCount}
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={tutor.status} />
                      </TableCell>
                      <TableCell className="text-muted-foreground whitespace-nowrap">
                        {tutor.joinedDate}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[180px]">
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => navigate(`/admin/tutors/${tutor.id}`)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => setEditModalTutor(tutor)}
                            >
                              <Edit2 className="w-4 h-4 mr-2" />
                              Edit Tutor
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => setAssignModalTutor(tutor)}
                            >
                              <UserPlus className="w-4 h-4 mr-2" />
                              Assign Students
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer text-orange-600 focus:text-orange-600 focus:bg-orange-50 dark:focus:bg-orange-950/50"
                              onClick={() => handleToggleStatus(tutor.id, tutor.status)}
                            >
                              <Power className="w-4 h-4 mr-2" />
                              {tutor.status === "Active" ? "Deactivate Account" : "Activate Account"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                      No tutors found matching your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Add Tutor Modal */}
        <AddTutorModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleSaveNewTutor}
        />

        {/* Edit Tutor Modal */}
        <EditTutorModal
          tutor={editModalTutor}
          isOpen={!!editModalTutor}
          onClose={() => setEditModalTutor(null)}
          onSave={handleSaveEditTutor}
        />

        {/* Assign Students Modal */}
        <Dialog open={!!assignModalTutor} onOpenChange={(open) => {
          if (!open) {
            setAssignModalTutor(null);
            setSelectedStudentIds([]);
          }
        }}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Assign Students</DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <p className="text-sm text-muted-foreground">
                Assign new students to <span className="font-medium text-foreground">{assignModalTutor?.name}</span>.
              </p>

              <div className="space-y-3 border rounded-md p-3 bg-muted/10">
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-xs font-semibold uppercase text-muted-foreground">
                    Available Unassigned Students
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs"
                    onClick={() => {
                      const allUnassigned = students.filter(s => s.assignedTutorId === null).map(s => s.id);
                      if (selectedStudentIds.length === allUnassigned.length) {
                        setSelectedStudentIds([]);
                      } else {
                        setSelectedStudentIds(allUnassigned);
                      }
                    }}
                  >
                    {selectedStudentIds.length === students.filter(s => s.assignedTutorId === null).length && students.filter(s => s.assignedTutorId === null).length > 0
                      ? "Deselect All"
                      : "Select All"}
                  </Button>
                </div>

                <div className="max-h-[200px] overflow-y-auto space-y-2 pr-2">
                  {students.filter(s => s.assignedTutorId === null).length === 0 ? (
                    <div className="text-sm text-center text-muted-foreground py-4">
                      No unassigned students available
                    </div>
                  ) : (
                    students.filter(s => s.assignedTutorId === null).map(unassignedStudent => (
                      <div key={unassignedStudent.id} className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded-md transition-colors">
                        <Checkbox
                          id={`student-${unassignedStudent.id}`}
                          checked={selectedStudentIds.includes(unassignedStudent.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedStudentIds([...selectedStudentIds, unassignedStudent.id]);
                            } else {
                              setSelectedStudentIds(selectedStudentIds.filter(id => id !== unassignedStudent.id));
                            }
                          }}
                        />
                        <label
                          htmlFor={`student-${unassignedStudent.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                        >
                          {unassignedStudent.name} <span className="text-muted-foreground font-normal ml-1">({unassignedStudent.batch})</span>
                        </label>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setAssignModalTutor(null);
                setSelectedStudentIds([]);
              }}>Cancel</Button>
              <Button
                onClick={handleAssignStudentSave}
                disabled={selectedStudentIds.length === 0}
              >
                {selectedStudentIds.length > 0 ? `Assign ${selectedStudentIds.length} Student(s)` : 'Assign Students'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </DashboardLayout>
  );
};

export default AdminTutors;
