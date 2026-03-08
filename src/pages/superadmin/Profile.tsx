import { useState, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import {
    Mail,
    Camera,
    Save,
    ShieldAlert,
    Shield,
    UploadCloud,
    Trash2,
    ImagePlus
} from "lucide-react";

// Mock Data for Super Admin
const initialSuperAdminData = {
    profile: {
        name: "System Administrator",
        email: "superadmin@codoacademy.com",
        role: "Super Admin",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SuperAdmin",
    }
};

const SuperAdminProfile = () => {
    const { toast } = useToast();

    // State for Modal and Form
    const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [formData, setFormData] = useState(initialSuperAdminData.profile);

    const photoInputRef = useRef<HTMLInputElement>(null);

    // Handlers for Photo Dropdown
    const handleRemovePhoto = () => {
        setFormData(prev => ({ ...prev, avatar: "" }));
        toast({
            title: "Profile photo removed",
            description: "Your avatar has been reset to default.",
        });
    };

    const handleOpenUploadModal = () => {
        setIsPhotoModalOpen(true);
        setPhotoPreview(formData.avatar);
    };

    // Drag and Drop Handlers
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

    return (
        <DashboardLayout>
            <div className="animate-fade-in space-y-6 max-w-5xl mx-auto pb-10">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
                            Super Admin Profile
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Manage system-wide permissions and portal settings.
                        </p>
                    </div>
                </div>

                {/* Profile Header Card */}
                <Card className="overflow-hidden border-border/50 shadow-sm border-l-4 border-l-red-500">
                    <div className="h-32 bg-gradient-to-r from-red-500/20 via-orange-500/10 to-red-600/20" />
                    <CardContent className="relative px-6 pb-6">
                        <div className="absolute -top-16 left-6 group">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <div className="relative cursor-pointer focus-visible:outline-none">
                                        <img
                                            src={formData.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=SuperAdmin"}
                                            alt={formData.name}
                                            className="w-32 h-32 rounded-full border-4 border-background shadow-lg object-cover bg-white"
                                        />
                                        <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Camera className="w-8 h-8 text-white" />
                                        </div>
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="w-48">
                                    <DropdownMenuItem onClick={handleOpenUploadModal} className="cursor-pointer gap-2">
                                        <ImagePlus className="w-4 h-4" />
                                        Upload new photo
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleRemovePhoto} className="cursor-pointer gap-2 text-destructive focus:text-destructive focus:bg-destructive/10">
                                        <Trash2 className="w-4 h-4" />
                                        Remove photo
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <div className="pt-20 sm:pt-4 sm:pl-40">
                            <div className="flex flex-col gap-4">
                                <div>
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <h2 className="text-2xl font-bold text-foreground">
                                            {formData.name}
                                        </h2>
                                        <Badge variant="destructive" className="bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors border-red-500/20 uppercase tracking-wider text-[10px] font-bold">
                                            <ShieldAlert className="w-3 h-3 mr-1" />
                                            Super Admin
                                        </Badge>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mt-4">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Mail className="w-4 h-4" />
                                            {formData.email}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-foreground font-medium">
                                            <Shield className="w-4 h-4 text-red-500" />
                                            Full System Access
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
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
                                src={photoPreview || "https://api.dicebear.com/7.x/avataaars/svg?seed=SuperAdmin"}
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

export default SuperAdminProfile;
