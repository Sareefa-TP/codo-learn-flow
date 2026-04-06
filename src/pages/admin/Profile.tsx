import { useState, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
    Calendar,
    ShieldCheck,
    Edit,
    Camera,
    CheckCircle2,
    Clock,
    Briefcase,
    Save,
    Lock,
    Building,
    KeyRound,
    Eye,
    EyeOff,
    UploadCloud,
    Image as ImageIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock Admin Data
const initialAdminData = {
    profile: {
        name: "Sarah Jenkins",
        email: "sarah.j@codo.academy",
        phone: "+91 98765 43210",
        role: "Admin",
        adminId: "ADM-2024-001",
        department: "Operations",
        dateJoined: "15 Jan 2024",
        lastLogin: "Today, 09:15 AM",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    },
    permissions: [
        { name: "Course Management", enabled: true },
        { name: "User Management", enabled: true },
        { name: "Finance Access", enabled: true },
        { name: "Reports Access", enabled: true },
    ]
};

const AdminProfile = () => {
    const { toast } = useToast();

    // State for Modals
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    // State for Form Data
    const [profileData, setProfileData] = useState(initialAdminData.profile);
    const [editFormData, setEditFormData] = useState({
        name: profileData.name,
        phone: profileData.phone,
        avatar: profileData.avatar,
    });

    // State for Password Form
    const [passwordData, setPasswordData] = useState({
        current: "",
        new: "",
        confirm: ""
    });
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const photoInputRef = useRef<HTMLInputElement>(null);

    // --- Handlers ---

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const togglePasswordVisibility = (field: keyof typeof showPassword) => {
        setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setEditFormData(prev => ({ ...prev, avatar: url }));
        }
    };

    const handlePhotoClick = () => {
        setIsPhotoModalOpen(true);
        setPhotoPreview(profileData.avatar);
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
            setProfileData(prev => ({ ...prev, avatar: photoPreview }));
            // Also update editFormData avatar in case Edit Profile is opened later
            setEditFormData(prev => ({ ...prev, avatar: photoPreview }));
            setIsPhotoModalOpen(false);
            toast({
                title: "Profile photo updated successfully",
                description: "Your new profile photo has been saved.",
            });
        }
    };

    const handleSaveProfile = () => {
        setProfileData(prev => ({
            ...prev,
            name: editFormData.name,
            phone: editFormData.phone,
            avatar: editFormData.avatar,
        }));
        setIsEditModalOpen(false);
        toast({
            title: "Profile Updated",
            description: "Your profile information has been successfully updated.",
        });
    };

    const handleSavePassword = () => {
        if (passwordData.new !== passwordData.confirm) {
            toast({
                title: "Passwords do not match",
                description: "New password and confirm password must be the same.",
                variant: "destructive"
            });
            return;
        }

        // Simulate API Call
        setTimeout(() => {
            setIsPasswordModalOpen(false);
            setPasswordData({ current: "", new: "", confirm: "" });
            toast({
                title: "Password Changed",
                description: "Your password has been successfully updated.",
            });
        }, 500);
    };

    return (
        <DashboardLayout>
            <div className="animate-fade-in space-y-6 max-w-5xl mx-auto pb-10">

                {/* Page Header */}
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
                        Admin Profile
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your personal information, security settings, and view permissions.
                    </p>
                </div>

                {/* 1. Profile Header */}
                <Card className="overflow-hidden border-border/50 shadow-sm border-l-4 border-l-primary">
                    <div className="h-28 bg-gradient-to-r from-primary/20 via-primary/5 to-accent/20" />
                    <CardContent className="relative px-6 pb-6">
                        <div className="absolute -top-12 left-6 group cursor-pointer" onClick={handlePhotoClick}>
                            <img
                                src={profileData.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"}
                                alt={profileData.name}
                                className="w-24 h-24 rounded-full border-4 border-background shadow-md object-cover bg-white"
                            />
                            <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="pt-16 sm:pt-4 sm:pl-32 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-3 flex-wrap">
                                    <h2 className="text-2xl font-bold text-foreground">
                                        {profileData.name}
                                    </h2>
                                    <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors border-primary/20 uppercase tracking-wider text-[10px] font-bold">
                                        <ShieldCheck className="w-3 h-3 mr-1" />
                                        {profileData.role}
                                    </Badge>
                                </div>
                                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                                        <Mail className="w-4 h-4 text-primary/70" />
                                        {profileData.email}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                                        <KeyRound className="w-4 h-4 text-primary/70" />
                                        ID: {profileData.adminId}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Info & Security Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* 2. Basic Information (Col Span 2) */}
                    <Card className="border-border/50 shadow-sm lg:col-span-2 flex flex-col">
                        <CardHeader className="pb-4 px-6 border-b border-border/40 flex flex-row items-center justify-between">
                            <CardTitle className="text-lg flex items-center gap-2 text-foreground">
                                <User className="w-5 h-5 text-primary" />
                                Basic Information
                            </CardTitle>
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                                onClick={() => {
                                    setEditFormData({
                                        name: profileData.name,
                                        phone: profileData.phone,
                                        avatar: profileData.avatar,
                                    });
                                    setIsEditModalOpen(true);
                                }}
                            >
                                <Edit className="w-4 h-4" />
                                Edit Profile
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4 flex-1 px-6 pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                        <User className="w-3 h-3" /> Full Name
                                    </Label>
                                    <p className="p-2.5 rounded-lg bg-muted/30 border border-border/40 font-medium text-foreground">
                                        {profileData.name}
                                    </p>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                        <Mail className="w-3 h-3" /> Email Address
                                    </Label>
                                    <p className="p-2.5 rounded-lg bg-muted/30 border border-border/40 font-medium text-foreground">
                                        {profileData.email}
                                    </p>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                        <Phone className="w-3 h-3" /> Phone Number
                                    </Label>
                                    <p className="p-2.5 rounded-lg bg-muted/30 border border-border/40 font-medium text-foreground">
                                        {profileData.phone}
                                    </p>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                        <Building className="w-3 h-3" /> Department
                                    </Label>
                                    <p className="p-2.5 rounded-lg bg-muted/30 border border-border/40 font-medium text-foreground">
                                        {profileData.department}
                                    </p>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                        <Calendar className="w-3 h-3" /> Date Joined
                                    </Label>
                                    <p className="p-2.5 rounded-lg bg-muted/30 border border-border/40 font-medium text-foreground">
                                        {profileData.dateJoined}
                                    </p>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                        <Clock className="w-3 h-3" /> Last Login
                                    </Label>
                                    <p className="p-2.5 rounded-lg bg-muted/30 border border-border/40 font-medium text-foreground">
                                        {profileData.lastLogin}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Right Column: Security & Permissions */}
                    <div className="space-y-6">

                        {/* 3. Account Security */}
                        <Card className="border-border/50 shadow-sm">
                            <CardHeader className="pb-4 px-6 border-b border-border/40 bg-muted/10">
                                <CardTitle className="text-lg flex items-center gap-2 text-foreground">
                                    <Lock className="w-5 h-5 text-primary" />
                                    Account Security
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="px-6 pt-6 flex flex-col gap-4">
                                <p className="text-sm text-muted-foreground">
                                    Ensure your account is using a long, random password to stay secure.
                                </p>
                                <Button
                                    className="w-full gap-2"
                                    onClick={() => setIsPasswordModalOpen(true)}
                                >
                                    <KeyRound className="w-4 h-4" />
                                    Change Password
                                </Button>
                            </CardContent>
                        </Card>

                        {/* 4. Permissions Section */}
                        <Card className="border-border/50 shadow-sm">
                            <CardHeader className="pb-4 px-6 border-b border-border/40 bg-muted/10">
                                <CardTitle className="text-lg flex items-center gap-2 text-foreground">
                                    <ShieldCheck className="w-5 h-5 text-primary" />
                                    Permissions
                                </CardTitle>
                                <CardDescription>
                                    Your current access levels across the platform.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="px-6 pt-6">
                                <div className="flex flex-col gap-3">
                                    {initialAdminData.permissions.map((perm, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-border/40 bg-muted/10">
                                            <span className="text-sm font-medium text-foreground">{perm.name}</span>
                                            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100 flex items-center gap-1">
                                                <CheckCircle2 className="w-3 h-3" />
                                                Enabled
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                    </div>
                </div>
            </div>

            {/* MODALS */}

            {/* Edit Profile Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                        <DialogDescription>
                            Make changes to your profile here. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col gap-6 py-4">
                        <div className="flex flex-col items-center gap-3">
                            <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                                <img
                                    src={editFormData.avatar}
                                    alt="Avatar"
                                    className="w-24 h-24 rounded-full object-cover border-4 border-muted"
                                />
                                <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="w-6 h-6 text-white" />
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </div>
                            <span className="text-xs text-muted-foreground">Click to change photo</span>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit-name">Full Name</Label>
                            <Input
                                id="edit-name"
                                name="name"
                                value={editFormData.name}
                                onChange={handleEditChange}
                            />
                        </div>

                        <div className="grid gap-2 relative">
                            <Label htmlFor="edit-email">Email Address <span className="text-muted-foreground font-normal">(Read-only)</span></Label>
                            <Input
                                id="edit-email"
                                value={profileData.email}
                                disabled
                                className="bg-muted/50 cursor-not-allowed"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit-phone">Phone Number</Label>
                            <Input
                                id="edit-phone"
                                name="phone"
                                value={editFormData.phone}
                                onChange={handleEditChange}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveProfile} className="gap-2">
                            <Save className="w-4 h-4" /> Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

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
                                src={photoPreview || "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"}
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

            {/* Change Password Modal */}
            <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Change Password</DialogTitle>
                        <DialogDescription>
                            Enter your current password and choose a new one.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="current-password">Current Password</Label>
                            <div className="relative">
                                <Input
                                    id="current-password"
                                    name="current"
                                    type={showPassword.current ? "text" : "password"}
                                    value={passwordData.current}
                                    onChange={handlePasswordChange}
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('current')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <div className="relative">
                                <Input
                                    id="new-password"
                                    name="new"
                                    type={showPassword.new ? "text" : "password"}
                                    value={passwordData.new}
                                    onChange={handlePasswordChange}
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('new')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                            <div className="relative">
                                <Input
                                    id="confirm-password"
                                    name="confirm"
                                    type={showPassword.confirm ? "text" : "password"}
                                    value={passwordData.confirm}
                                    onChange={handlePasswordChange}
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('confirm')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsPasswordModalOpen(false)}>Cancel</Button>
                        <Button
                            onClick={handleSavePassword}
                            disabled={!passwordData.current || !passwordData.new || !passwordData.confirm}
                        >
                            Update Password
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </DashboardLayout>
    );
};

export default AdminProfile;
