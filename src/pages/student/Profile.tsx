import { useState, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  Award,
  CreditCard,
  Edit,
  Camera,
  CheckCircle2,
  Clock,
  Briefcase,
  Save,
  X,
  UserCircle,
  UploadCloud
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { studentData } from "@/data/studentData";

const StudentProfile = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Mock data for fields not in studentData
  const [formData, setFormData] = useState({
    name: studentData.profile.name,
    email: "alex.rivera@email.com",
    phone: "+91 98765 43210",
    dob: "12 May 2002",
    gender: "Male",
    bloodGroup: "O+",
    joinDate: "15 Jan 2026",
    referralName: "John Mathew",
    address: "Block 4, Technopark Campus, Trivandrum, Kerala - 695581",
    avatar: studentData.profile.avatar,
  });

  // Academic & Activity Data (Mock)
  const academicInfo = {
    courseName: "Full Stack Web Development",
    batchName: "Jan 2026 Batch",
    startDate: "15 Jan 2026",
    duration: "6 Months",
    modulesCompleted: "4 / 8",
    currentWeek: "Week 12",
  };

  const learningActivity = {
    assignmentsSubmitted: 14,
    assignmentsPending: 2,
    progress: 72,
    lastLogin: "Today, 10:45 AM",
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarClick = () => {
    setIsPhotoModalOpen(true);
    setPhotoPreview(formData.avatar);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG, PNG, or WEBP image.",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 5MB.",
        variant: "destructive"
      });
      return;
    }

    const url = URL.createObjectURL(file);
    setPhotoPreview(url);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handlePhotoUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleSavePhoto = () => {
    if (photoPreview) {
      setFormData(prev => ({ ...prev, avatar: photoPreview }));
      setIsPhotoModalOpen(false);
      toast({
        title: "Profile photo updated successfully",
        description: "Your new profile photo has been saved.",
      });
    }
  };

  const toggleEdit = () => {
    if (isEditing) {
      // Save logic would go here
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your changes have been saved successfully.",
      });
    } else {
      setIsEditing(true);
    }
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6 max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
              Student Profile
            </h1>
            <p className="text-muted-foreground mt-1">
              View and manage your personal and academic details.
            </p>
          </div>
          <Button
            onClick={toggleEdit}
            variant={isEditing ? "outline" : "default"}
            className="gap-2"
          >
            {isEditing ? (
              <>
                <X className="w-4 h-4" />
                Cancel
              </>
            ) : (
              <>
                <Edit className="w-4 h-4" />
                Edit Profile
              </>
            )}
          </Button>
        </div>

        {/* Profile Header Card */}
        <Card className="overflow-hidden border-border/50 shadow-sm">
          <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20" />
          <CardContent className="relative px-6 pb-6">
            <div className="absolute -top-16 left-6 group">
              <div className="relative cursor-pointer" onClick={handleAvatarClick}>
                <img
                  src={formData.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Student"}
                  alt={formData.name}
                  className="w-32 h-32 rounded-full border-4 border-background shadow-lg object-cover"
                />
                <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            <div className="pt-20 sm:pt-4 sm:pl-40">
              <div className="flex flex-col gap-4">
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-2xl font-bold text-foreground">
                      {formData.name}
                    </h2>
                    <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                      <UserCircle className="w-3 h-3 mr-1" />
                      Student
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mt-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      {formData.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      {formData.phone}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Briefcase className="w-4 h-4" />
                      {academicInfo.batchName}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <BookOpen className="w-4 h-4" />
                      {academicInfo.courseName}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card className="border-border/50 shadow-sm flex flex-col">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Full Name</Label>
                  <p className="p-2.5 rounded-lg bg-muted/30 border border-transparent font-medium text-foreground">
                    {formData.name}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Email Address</Label>
                  <p className="p-2.5 rounded-lg bg-muted/30 border border-transparent font-medium text-foreground">
                    {formData.email}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Phone Number</Label>
                  {isEditing ? (
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="bg-background"
                    />
                  ) : (
                    <p className="p-2.5 rounded-lg bg-muted/30 border border-transparent font-medium text-foreground">
                      {formData.phone}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Date of Birth</Label>
                  <p className="p-2.5 rounded-lg bg-muted/30 border border-transparent font-medium text-foreground">
                    {formData.dob}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Gender</Label>
                  <p className="p-2.5 rounded-lg bg-muted/30 border border-transparent font-medium text-foreground">
                    {formData.gender}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Blood Group</Label>
                  <p className="p-2.5 rounded-lg bg-muted/30 border border-transparent font-medium text-foreground">
                    {formData.bloodGroup}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Join Date</Label>
                  <p className="p-2.5 rounded-lg bg-muted/30 border border-transparent font-medium text-foreground">
                    {formData.joinDate}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Referral Name</Label>
                  <p className="p-2.5 rounded-lg bg-muted/30 border border-transparent font-medium text-foreground">
                    {formData.referralName}
                  </p>
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Address</Label>
                  {isEditing ? (
                    <Textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="bg-background min-h-[80px]"
                    />
                  ) : (
                    <p className="p-2.5 rounded-lg bg-muted/30 border border-transparent font-medium text-foreground min-h-[80px]">
                      {formData.address}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
            {isEditing && (
              <div className="p-6 pt-0 flex justify-end">
                <Button onClick={toggleEdit} className="gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
              </div>
            )}
          </Card>

          {/* Academic Information */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Academic Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-muted/30 border border-border/20">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Course Name</p>
                  <p className="text-sm font-semibold text-foreground">{academicInfo.courseName}</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/30 border border-border/20">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Batch Name</p>
                  <p className="text-sm font-semibold text-foreground">{academicInfo.batchName}</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/30 border border-border/20">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Batch Start Date</p>
                  <p className="text-sm font-semibold text-foreground">{academicInfo.startDate}</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/30 border border-border/20">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Course Duration</p>
                  <p className="text-sm font-semibold text-foreground">{academicInfo.duration}</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/30 border border-border/20">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Modules Completed</p>
                  <p className="text-sm font-semibold text-foreground">{academicInfo.modulesCompleted}</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/30 border border-border/20">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Current Progress</p>
                  <p className="text-sm font-semibold text-foreground">{academicInfo.currentWeek}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Learning Activity */}
          <Card className="border-border/50 shadow-sm lg:col-span-2">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                Learning Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-4 md:col-span-1">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/10">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">Submitted</p>
                      <p className="text-2xl font-bold text-foreground">{learningActivity.assignmentsSubmitted}</p>
                    </div>
                    <CheckCircle2 className="w-8 h-8 text-primary opacity-20" />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-orange-500/5 border border-orange-500/10">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">Pending</p>
                      <p className="text-2xl font-bold text-foreground">{learningActivity.assignmentsPending}</p>
                    </div>
                    <Clock className="w-8 h-8 text-orange-500 opacity-20" />
                  </div>
                </div>

                <div className="md:col-span-2 flex flex-col justify-center gap-6 p-6 rounded-2xl bg-muted/20 border border-border/50">
                  <div className="space-y-2">
                    <div className="flex justify-between items-end">
                      <p className="text-sm font-medium text-foreground">Overall Course Progress</p>
                      <p className="text-2xl font-bold text-primary">{learningActivity.progress}%</p>
                    </div>
                    <div className="h-3 w-full bg-primary/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-1000 ease-out rounded-full"
                        style={{ width: `${learningActivity.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="outline" className="bg-background">On Track</Badge>
                    <span>Expected completion by July 2026</span>
                  </div>
                </div>

                <div className="md:col-span-1 flex flex-col justify-center items-center p-6 text-center rounded-2xl bg-muted/20 border border-border/50">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Last Login</p>
                  <p className="text-sm font-bold text-foreground">{learningActivity.lastLogin}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Update Profile Photo Modal */}
      <Dialog open={isPhotoModalOpen} onOpenChange={setIsPhotoModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Profile Photo</DialogTitle>
            <DialogDescription>
              Upload a new profile picture. Allowed formats: JPG, PNG, WEBP. Max size: 5MB.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-6 py-4">
            <div className="flex justify-center">
              <img
                src={photoPreview || "https://api.dicebear.com/7.x/avataaars/svg?seed=Student"}
                alt="Preview"
                className="w-32 h-32 rounded-full object-cover border-4 border-muted shadow-sm bg-white"
              />
            </div>

            <div
              className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${isDragging ? 'border-primary bg-primary/5' : 'border-border/60 hover:border-primary/50 hover:bg-muted/30'}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => photoInputRef.current?.click()}
            >
              <UploadCloud className={`w-10 h-10 mb-3 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
              <p className="text-sm font-medium text-foreground mb-1">
                Drag & drop your image here
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                or click to browse from your computer
              </p>
              <Button type="button" variant="secondary" size="sm" className="pointer-events-none">
                Select File
              </Button>
              <input
                type="file"
                ref={photoInputRef}
                className="hidden"
                accept="image/jpeg, image/png, image/webp"
                onChange={handlePhotoUploadChange}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPhotoModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSavePhoto} className="gap-2">
              <Save className="w-4 h-4" /> Save Photo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default StudentProfile;
