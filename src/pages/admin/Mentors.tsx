import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select as UISelect,
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
  Search,
  MoreVertical,
  Eye,
  Power,
  UserPlus,
  Users,
  UserCheck
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { mockMentors as initialMentors, mockInterns as initialInterns } from "@/data/mockMentors";
import { StatusBadge } from "@/components/admin/tutors/StatusBadge";
import { MentorWorkloadBadge } from "@/components/admin/mentors/MentorWorkloadBadge";
import { AddMentorModal } from "@/components/admin/mentors/AddMentorModal";
import { EditMentorModal } from "@/components/admin/mentors/EditMentorModal";
import { Edit2 } from "lucide-react";

const AdminMentors = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  // State
  const [mentors, setMentors] = useState(initialMentors);
  const [interns, setInterns] = useState(initialInterns);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // Modals state
  const [assignInternModalMentor, setAssignInternModalMentor] = useState<typeof initialMentors[0] | null>(null);
  const [editModalMentor, setEditModalMentor] = useState<typeof initialMentors[0] | null>(null);
  const [selectedInternIds, setSelectedInternIds] = useState<string[]>([]);
  const [isAddMentorModalOpen, setIsAddMentorModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "assigned" | "unassigned">("all");

  // Summary Metrics calculations
  const totalMentors = mentors.length;
  const activeMentors = mentors.filter(m => m.status === "Active").length;
  const totalAssignedInterns = interns.filter(i => i.assignedMentorId !== null).length;
  const totalUnassignedInterns = interns.filter(i => i.assignedMentorId === null).length;

  // Filter list
  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch =
      mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === "All" || mentor.status === filterStatus;

    let matchesActiveFilter = true;
    if (activeFilter === "active") matchesActiveFilter = mentor.status === "Active";
    if (activeFilter === "assigned") matchesActiveFilter = mentor.assignedInternIds.length > 0;

    return matchesSearch && matchesStatus && matchesActiveFilter;
  });

  const unassignedInternsList = interns.filter(i => {
    const isUnassigned = i.assignedMentorId === null;
    const matchesSearch =
      i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.email.toLowerCase().includes(searchTerm.toLowerCase());
    return isUnassigned && matchesSearch;
  });

  // Actions
  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    setMentors(mentors.map(m => m.id === id ? { ...m, status: newStatus } : m));

    toast({
      title: "Status Updated",
      description: `Mentor account has been marked as ${newStatus}.`
    });
  };

  const handleAssignInternSave = () => {
    if (!assignInternModalMentor || selectedInternIds.length === 0) return;

    // Update Intern State
    setInterns(interns.map(i => selectedInternIds.includes(i.id) ? { ...i, assignedMentorId: assignInternModalMentor.id } : i));

    // Update Mentor State
    setMentors(mentors.map(m => m.id === assignInternModalMentor.id
      ? { ...m, assignedInternIds: [...m.assignedInternIds, ...selectedInternIds] }
      : m
    ));

    toast({
      title: "Interns Assigned",
      description: `${selectedInternIds.length} intern(s) successfully assigned to ${assignInternModalMentor.name}.`
    });

    setAssignInternModalMentor(null);
    setSelectedInternIds([]);
  };

  const handleSaveNewMentor = (newMentor: typeof initialMentors[0]) => {
    setMentors([newMentor, ...mentors]);
    setIsAddMentorModalOpen(false);
    toast({
      title: "Mentor Created",
      description: `${newMentor.name} has been successfully added to the system.`
    });
  };

  const handleSaveEditMentor = (updatedMentor: typeof initialMentors[0]) => {
    setMentors(mentors.map(m => m.id === updatedMentor.id ? updatedMentor : m));
    setEditModalMentor(null);
    toast({
      title: "Mentor Updated",
      description: `${updatedMentor.name}'s profile has been updated.`
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Mentor Management</h1>
            <p className="text-muted-foreground mt-1">Control mentor accounts and internship assignments</p>
          </div>
          <Button onClick={() => setIsAddMentorModalOpen(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Add Mentor
          </Button>
        </div>

        {/* 4 Summary Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card
            className={`cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${activeFilter === "all" ? "ring-2 ring-primary border-transparent shadow-md bg-primary/5" : "border-border/50 shadow-sm"}`}
            onClick={() => setActiveFilter("all")}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <UserCheck className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Mentors</p>
                  <p className="text-2xl font-bold">{totalMentors}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card
            className={`cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${activeFilter === "active" ? "ring-2 ring-emerald-500 border-transparent shadow-md bg-emerald-500/5" : "border-border/50 shadow-sm"}`}
            onClick={() => setActiveFilter("active")}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-500/10 rounded-lg">
                  <UserCheck className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Mentors</p>
                  <p className="text-2xl font-bold">{activeMentors}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card
            className={`cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${activeFilter === "assigned" ? "ring-2 ring-blue-500 border-transparent shadow-md bg-blue-500/5" : "border-border/50 shadow-sm"}`}
            onClick={() => setActiveFilter("assigned")}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Assigned Interns</p>
                  <p className="text-2xl font-bold">{totalAssignedInterns}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card
            className={`cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${activeFilter === "unassigned" ? "ring-2 ring-orange-500 border-transparent shadow-md bg-orange-500/5" : "border-border/50 shadow-sm"}`}
            onClick={() => setActiveFilter("unassigned")}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-500/10 rounded-lg">
                  <Users className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Unassigned Interns</p>
                  <p className="text-2xl font-bold">{totalUnassignedInterns}</p>
                </div>
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
                placeholder="Search by mentor name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-background w-full"
              />
            </div>
            <div className="w-full sm:w-[180px]">
              <UISelect value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </UISelect>
            </div>
          </CardContent>
        </Card>

        {/* Main Table Section */}
        <Card className="border-border/50 shadow-sm overflow-hidden">
          <div className="p-4 bg-muted/30 border-b border-border/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              {activeFilter === "unassigned" ? "Unassigned Interns List" : "Mentors Directory"}
            </h3>
            {activeFilter !== "all" && (
              <Button variant="ghost" size="sm" onClick={() => setActiveFilter("all")} className="h-8 text-xs">
                Clear Filters
              </Button>
            )}
          </div>
          <div className="overflow-x-auto">
            <Table>
              {activeFilter === "unassigned" ? (
                <>
                  <TableHeader className="bg-muted/10">
                    <TableRow>
                      <TableHead className="min-w-[150px]">Intern Name</TableHead>
                      <TableHead className="min-w-[150px]">Email</TableHead>
                      <TableHead>Batch</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {unassignedInternsList.length > 0 ? (
                      unassignedInternsList.map((intern) => (
                        <TableRow key={intern.id} className="hover:bg-muted/10">
                          <TableCell className="font-medium text-foreground">{intern.name}</TableCell>
                          <TableCell className="text-muted-foreground">{intern.email}</TableCell>
                          <TableCell className="text-muted-foreground text-sm whitespace-nowrap">{intern.batch}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium w-6 text-right">{intern.progress}%</span>
                              <div className="h-1.5 w-24 bg-muted overflow-hidden rounded-full">
                                <div className="h-full bg-primary" style={{ width: `${intern.progress}%` }} />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right"><StatusBadge status={intern.status} /></TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                          No unassigned interns found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </>
              ) : (
                <>
                  <TableHeader className="bg-muted/10">
                    <TableRow>
                      <TableHead className="min-w-[180px]">Mentor Name</TableHead>
                      <TableHead className="min-w-[150px]">Email</TableHead>
                      <TableHead>Assigned Interns</TableHead>
                      <TableHead>Workload Status</TableHead>
                      <TableHead>Account Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMentors.length > 0 ? (
                      filteredMentors.map((mentor) => (
                        <TableRow key={mentor.id} className="hover:bg-muted/20">
                          <TableCell className="font-medium text-foreground">{mentor.name}</TableCell>
                          <TableCell className="text-muted-foreground">{mentor.email}</TableCell>
                          <TableCell className="font-semibold tabular-nums">{mentor.assignedInternIds.length}</TableCell>
                          <TableCell><MentorWorkloadBadge internCount={mentor.assignedInternIds.length} /></TableCell>
                          <TableCell><StatusBadge status={mentor.status} /></TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4 text-muted-foreground" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-[180px]">
                                <DropdownMenuItem className="cursor-pointer" onClick={() => navigate(`/admin/mentors/${mentor.id}`)}>
                                  <Eye className="w-4 h-4 mr-2" /> View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer" onClick={() => setEditModalMentor(mentor)}>
                                  <Edit2 className="w-4 h-4 mr-2" /> Edit Mentor
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer" onClick={() => setAssignInternModalMentor(mentor)}>
                                  <UserPlus className="w-4 h-4 mr-2" /> Assign Intern
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer text-orange-600 focus:text-orange-600" onClick={() => handleToggleStatus(mentor.id, mentor.status)}>
                                  <Power className="w-4 h-4 mr-2" /> {mentor.status === "Active" ? "Deactivate Account" : "Activate Account"}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                          No mentors found matching your filters.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </>
              )}
            </Table>
          </div>
        </Card>

        {/* Assign Intern Modal */}
        <Dialog open={!!assignInternModalMentor} onOpenChange={(open) => {
          if (!open) {
            setAssignInternModalMentor(null);
            setSelectedInternIds([]);
          }
        }}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Assign Interns</DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <p className="text-sm text-muted-foreground">
                Assign new interns to <span className="font-medium text-foreground">{assignInternModalMentor?.name}</span>.
              </p>

              <div className="space-y-3 border rounded-md p-3 bg-muted/10">
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Available Interns</span>
                  {interns.filter(i => i.assignedMentorId === null).length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 text-xs text-primary hover:bg-transparent hover:text-primary/80"
                      onClick={() => {
                        const unassigned = interns.filter(i => i.assignedMentorId === null).map(i => i.id);
                        if (selectedInternIds.length === unassigned.length) {
                          setSelectedInternIds([]);
                        } else {
                          setSelectedInternIds(unassigned);
                        }
                      }}
                    >
                      {selectedInternIds.length === interns.filter(i => i.assignedMentorId === null).length ? "Deselect All" : "Select All"}
                    </Button>
                  )}
                </div>

                <div className="flex flex-col gap-3 max-h-[200px] overflow-y-auto pr-2">
                  {interns.filter(i => i.assignedMentorId === null).length === 0 ? (
                    <p className="text-sm text-muted-foreground italic text-center py-2">No unassigned interns available</p>
                  ) : (
                    interns.filter(i => i.assignedMentorId === null).map(unassignedIntern => (
                      <div key={unassignedIntern.id} className="flex items-center space-x-3 group">
                        <Checkbox
                          id={`intern-${unassignedIntern.id}`}
                          checked={selectedInternIds.includes(unassignedIntern.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedInternIds([...selectedInternIds, unassignedIntern.id]);
                            } else {
                              setSelectedInternIds(selectedInternIds.filter(id => id !== unassignedIntern.id));
                            }
                          }}
                        />
                        <label
                          htmlFor={`intern-${unassignedIntern.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer group-hover:text-primary transition-colors"
                        >
                          {unassignedIntern.name} <span className="text-muted-foreground font-normal">({unassignedIntern.batch})</span>
                        </label>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setAssignInternModalMentor(null);
                setSelectedInternIds([]);
              }}>Cancel</Button>
              <Button onClick={handleAssignInternSave} disabled={selectedInternIds.length === 0}>
                Assign {selectedInternIds.length > 0 ? `(${selectedInternIds.length})` : ""}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Mentor Modal */}
        <AddMentorModal
          isOpen={isAddMentorModalOpen}
          onClose={() => setIsAddMentorModalOpen(false)}
          onSave={handleSaveNewMentor}
        />

        {/* Edit Mentor Modal */}
        <EditMentorModal
          mentor={editModalMentor}
          isOpen={!!editModalMentor}
          onClose={() => setEditModalMentor(null)}
          onSave={handleSaveEditMentor}
        />

      </div>
    </DashboardLayout>
  );
};

export default AdminMentors;
