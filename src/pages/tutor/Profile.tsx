import { useState, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Edit,
  Camera,
  CheckCircle2,
  Clock,
  Briefcase,
  Save,
  X,
  UserCircle,
  TrendingUp,
  Users,
  BookOpen,
  UploadCloud,
  FileText
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { tutorProfile } from "@/data/tutorData";

// Extended Mock Data for Tutor
const initialTutorData = {
  profile: {
    name: tutorProfile.name,
    email: tutorProfile.email,
    phone: tutorProfile.phone,
    specialization: tutorProfile.domain,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    dob: "22 August 1994",
    gender: "Female",
    address: "HSR Layout, Sector 2, Bangalore, Karnataka - 560102",
  },
  professional: {
    experience: "8 Years",
    totalBatches: 12,
    totalStudents: 156,
  },
  activity: {
    materialsShared: 42,
    assignmentsCreated: 18,
    studentsMentored: 34,
    lastLogin: "Today, 02:15 PM",
  },
  batches: [
    { name: "Full Stack Web Dev - Jan 2026", startDate: "15 Jan 2026", students: 14 },
    { name: "React Advanced - Dec 2025", startDate: "01 Dec 2025", students: 12 },
    { name: "Data Science Mastery - Nov 2025", startDate: "10 Nov 2025", students: 8 },
  ]
};

const TutorProfile = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState(initialTutorData.profile);

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
      // Save logic (simulation)
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your changes have been saved successfully.",
      });
    } else {
      setIsEditing(true);
    }
  };

  const { professional, activity, batches } = initialTutorData;

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6 max-w-5xl mx-auto pb-10">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
              Tutor Profile
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your teaching experience and personal information.
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
                  src={formData.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Tutor"}
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
                    <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors border-primary/20">
                      <Briefcase className="w-3 h-3 mr-1" />
                      Tutor
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
                      <Award className="w-4 h-4" />
                      {formData.specialization}
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
            <CardHeader className="pb-4 px-6 border-b border-border/40 mb-4">
              <CardTitle className="text-lg flex items-center gap-2 text-foreground">
                <User className="w-5 h-5 text-primary" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 flex-1 px-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Full Name</Label>
                  <p className="p-2.5 rounded-lg bg-muted/30 border border-transparent font-medium text-foreground">
                    {formData.name}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Email Address</Label>
                  <p className="p-2.5 rounded-lg bg-muted/30 border border-transparent font-medium text-foreground">
                    {formData.email}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Phone Number</Label>
                  {isEditing ? (
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="bg-background focus:ring-primary"
                    />
                  ) : (
                    <p className="p-2.5 rounded-lg bg-muted/30 border border-transparent font-medium text-foreground">
                      {formData.phone}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Date of Birth</Label>
                  <p className="p-2.5 rounded-lg bg-muted/30 border border-transparent font-medium text-foreground">
                    {formData.dob}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Gender</Label>
                  <p className="p-2.5 rounded-lg bg-muted/30 border border-transparent font-medium text-foreground">
                    {formData.gender}
                  </p>
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Address</Label>
                  {isEditing ? (
                    <Textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="bg-background focus:ring-primary min-h-[80px]"
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

          {/* Professional Information */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-4 px-6 border-b border-border/40 mb-4">
              <CardTitle className="text-lg flex items-center gap-2 text-foreground">
                <Briefcase className="w-5 h-5 text-primary" />
                Professional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-muted/30 border border-border/20">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Specialization</p>
                  <p className="text-sm font-semibold text-foreground">{formData.specialization}</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/30 border border-border/20">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Experience</p>
                  <p className="text-sm font-semibold text-foreground">{professional.experience}</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/30 border border-border/20">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Total Batches</p>
                  <p className="text-sm font-semibold text-foreground">{professional.totalBatches} Batches</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/30 border border-border/20">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Total Students</p>
                  <p className="text-sm font-semibold text-foreground">{professional.totalStudents} Students</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Teaching Activity */}
          <Card className="border-border/50 shadow-sm lg:col-span-2">
            <CardHeader className="pb-4 px-6 border-b border-border/40 mb-4">
              <CardTitle className="text-lg flex items-center gap-2 text-foreground">
                <TrendingUp className="w-5 h-5 text-primary" />
                Teaching Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 mt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10 flex flex-col items-center text-center gap-2 group hover:bg-primary/10 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{activity.materialsShared}</p>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Materials Shared</p>
                  </div>
                </div>
                <div className="p-5 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex flex-col items-center text-center gap-2 group hover:bg-blue-500/10 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{activity.assignmentsCreated}</p>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Assignments Created</p>
                  </div>
                </div>
                <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex flex-col items-center text-center gap-2 group hover:bg-emerald-500/10 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{activity.studentsMentored}</p>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Students Mentored</p>
                  </div>
                </div>
                <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex flex-col items-center text-center gap-2 group hover:bg-amber-500/10 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{activity.lastLogin}</p>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Last Login</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Batch Overview */}
          <Card className="border-border/50 shadow-sm lg:col-span-2">
            <CardHeader className="pb-4 px-6 border-b border-border/40">
              <CardTitle className="text-lg flex items-center gap-2 text-foreground">
                <Users className="w-5 h-5 text-primary" />
                Batch Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border/20">
                    <tr>
                      <th className="px-6 py-4">Batch Name</th>
                      <th className="px-6 py-4">Start Date</th>
                      <th className="px-6 py-4">Total Students</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20">
                    {batches.map((batch, idx) => (
                      <tr key={idx} className="group hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-foreground">{batch.name}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-muted-foreground">{batch.startDate}</p>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/10">
                            {batch.students} Students
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                src={photoPreview || "https://api.dicebear.com/7.x/avataaars/svg?seed=Tutor"}
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

export default TutorProfile;
