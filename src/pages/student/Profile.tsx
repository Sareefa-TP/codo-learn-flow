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
  BookOpen,
  Edit,
  Camera,
  Briefcase,
  Save,
  X,
  UserCircle,
  UploadCloud
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { studentData } from "@/data/studentData";
import { cn } from "@/lib/utils";

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
  const enrolledCourses = [
    {
      name: "Full Stack Web Development",
      batch: "Jan 2026 Batch",
      start: "15 Jan 2026",
      duration: "6 Months",
      modules: "4 / 8",
      current: "Week 12",
      status: "Ongoing",
      progress: 72
    },
    {
      name: "UI/UX Design Foundation",
      batch: "Aug 2025 Batch",
      start: "10 Aug 2025",
      duration: "3 Months",
      modules: "6 / 6",
      current: "Completed",
      status: "Completed",
      progress: 100
    }
  ];

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
                      {enrolledCourses[0].batch}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <BookOpen className="w-4 h-4" />
                      {enrolledCourses[0].name}
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

          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Academic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {enrolledCourses.map((course, index) => (
                <div key={index} className="p-5 rounded-2xl bg-muted/20 border border-border/40 space-y-4 hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="font-bold text-foreground text-lg leading-tight">{course.name}</h3>
                      <p className="text-xs text-muted-foreground font-medium">{course.batch}</p>
                    </div>
                    <Badge 
                      className={cn(
                        "rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                        course.status === "Ongoing" 
                          ? "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20" 
                          : "bg-muted/50 text-muted-foreground border-border/50"
                      )}
                      variant="outline"
                    >
                      {course.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Start Date</p>
                      <p className="text-xs font-semibold text-foreground">{course.start}</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Duration</p>
                      <p className="text-xs font-semibold text-foreground">{course.duration}</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Modules</p>
                      <p className="text-xs font-semibold text-foreground">{course.modules}</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Progress</p>
                      <p className="text-xs font-semibold text-foreground">{course.current}</p>
                    </div>
                  </div>

                  {course.status === "Ongoing" && (
                    <div className="space-y-1.5">
                      <div className="h-1.5 w-full bg-primary/5 rounded-full overflow-hidden border border-primary/5">
                        <div 
                          className="h-full bg-primary/80 transition-all duration-1000 ease-out"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
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
