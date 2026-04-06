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
  ListTodo,
  FileText,
  Download,
  UploadCloud
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

// Mock Data (Expanding on Dashboard data)
const initialInternData = {
  profile: {
    name: "Alex Johnson",
    email: "alex.johnson@intern.codoademy.com",
    phone: "+91 98765 43210",
    batch: "Batch Alpha – Jan 2026",
    mentor: "John Doe",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    dob: "15 April 2003",
    gender: "Male",
    address: "Block 4, Technopark Campus, Trivandrum, Kerala - 695581",
  },
  internship: {
    startDate: "15 Jan 2026",
    duration: "3 Months",
    status: "Active" as "Active" | "Completed",
  },
  activity: {
    tasksAssigned: 18,
    tasksCompleted: 12,
    reportsSubmitted: 8,
    attendance: 94,
    progress: 72,
  },
  certificate: {
    status: "Available" as "Available" | "Pending",
  }
};

const InternProfile = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState(initialInternData.profile);

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

  const { internship, activity, certificate } = initialInternData;

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6 max-w-5xl mx-auto pb-10">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
              Intern Profile
            </h1>
            <p className="text-muted-foreground mt-1">
              Management of your internship details and professional profile.
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
          <div className="h-32 bg-gradient-to-r from-emerald-500/20 via-emerald-500/10 to-blue-500/10" />
          <CardContent className="relative px-6 pb-6">
            <div className="absolute -top-16 left-6 group">
              <div className="relative cursor-pointer" onClick={handleAvatarClick}>
                <img
                  src={formData.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Intern"}
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
                    <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-700 border-emerald-500/20">
                      <Briefcase className="w-3 h-3 mr-1" />
                      Intern
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
                      <Calendar className="w-4 h-4" />
                      {formData.batch}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <UserCircle className="w-4 h-4" />
                      Mentor: {formData.mentor}
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
            <CardHeader className="pb-4 border-b border-border/40 mb-4 px-6">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-600" />
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
                      className="bg-background focus:ring-emerald-500"
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
                      className="bg-background focus:ring-emerald-500 min-h-[80px]"
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
                <Button onClick={toggleEdit} className="bg-emerald-600 hover:bg-emerald-700 gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
              </div>
            )}
          </Card>

          {/* Internship Information */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-4 border-b border-border/40 mb-4 px-6">
              <CardTitle className="text-lg flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-600" />
                Internship Information
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-muted/30 border border-border/20">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Internship Batch</p>
                  <p className="text-sm font-semibold text-foreground">{formData.batch}</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/30 border border-border/20">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Assigned Mentor</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <p className="text-sm font-semibold text-foreground">{formData.mentor}</p>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-muted/30 border border-border/20">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Start Date</p>
                  <p className="text-sm font-semibold text-foreground">{internship.startDate}</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/30 border border-border/20">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Duration</p>
                  <p className="text-sm font-semibold text-foreground">{internship.duration}</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/30 border border-border/20 sm:col-span-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Internship Status</p>
                  <Badge className={`mt-0.5 ${internship.status === "Active"
                    ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                    : "bg-blue-100 text-blue-700 border-blue-200"
                    }`}>
                    {internship.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Internship Activity */}
          <Card className="border-border/50 shadow-sm lg:col-span-2">
            <CardHeader className="pb-4 border-b border-border/40 mb-4 px-6">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                Internship Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <div className="space-y-4 md:col-span-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 hover:bg-emerald-500/10 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <ListTodo className="w-4 h-4 text-emerald-600" />
                        <span className="text-emerald-700 font-bold text-lg">{activity.tasksCompleted}</span>
                      </div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Tasks Done</p>
                      <p className="text-xs text-muted-foreground">out of {activity.tasksAssigned}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 hover:bg-blue-500/10 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="text-blue-700 font-bold text-lg">{activity.reportsSubmitted}</span>
                      </div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Reports</p>
                      <p className="text-xs text-muted-foreground">Submitted</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-violet-500/5 border border-violet-500/10 hover:bg-violet-500/10 transition-colors">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Attendance</p>
                      <span className="text-violet-700 font-bold text-lg">{activity.attendance}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-violet-500/10 rounded-full overflow-hidden">
                      <div className="h-full bg-violet-500 transition-all duration-700" style={{ width: `${activity.attendance}%` }} />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-3 flex flex-col justify-center gap-6 p-6 rounded-2xl bg-muted/20 border border-border/50">
                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-foreground">Internship Progress</p>
                        <p className="text-xs text-muted-foreground">Your overall growth within the program</p>
                      </div>
                      <p className="text-3xl font-black text-emerald-600 tracking-tight">{activity.progress}%</p>
                    </div>
                    <div className="relative h-4 w-full overflow-hidden rounded-full bg-emerald-500/10">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-1000 ease-out rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                        style={{ width: `${activity.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">On Track</Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Approximately {100 - activity.progress}% of internship time remaining.
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Certificates */}
          <Card className="border-border/50 shadow-sm lg:col-span-2">
            <CardHeader className="pb-4 border-b border-border/40 mb-4 px-6">
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-600" />
                Certificates
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="flex flex-col sm:flex-row items-center justify-between p-6 rounded-2xl bg-gradient-to-br from-emerald-500/5 to-transparent border border-emerald-500/10 gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                    <Award className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Internship Certificate</h3>
                    <p className="text-sm text-muted-foreground">Issued upon successful completion of the internship phase.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Status</p>
                    <Badge className={certificate.status === "Available" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}>
                      {certificate.status}
                    </Badge>
                  </div>
                  <Button
                    disabled={certificate.status !== "Available"}
                    className="bg-emerald-600 hover:bg-emerald-700 gap-2 shrink-0"
                  >
                    <Download className="w-4 h-4" />
                    Download Certificate
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Update Profile Photo Modal */}
      <Dialog open={isPhotoModalOpen} onOpenChange={setIsPhotoModalOpen}>
        <DialogContent
          className="sm:max-w-md"
          onInteractOutside={e => e.preventDefault()}
          onPointerDownOutside={e => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Update Profile Photo</DialogTitle>
            <DialogDescription>
              Upload a new profile picture. Allowed formats: JPG, PNG, WEBP. Max size: 5MB.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-6 py-4">
            <div className="flex justify-center">
              <img
                src={photoPreview || "https://api.dicebear.com/7.x/avataaars/svg?seed=Intern"}
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
            <Button onClick={handleSavePhoto} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
              <Save className="w-4 h-4" /> Save Photo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default InternProfile;
