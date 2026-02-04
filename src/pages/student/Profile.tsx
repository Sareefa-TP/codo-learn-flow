import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  BookOpen,
  Award,
  CreditCard,
  Bell,
  Shield,
  Edit,
  Camera,
  Star,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { studentData } from "@/data/studentData";
import CircularProgress from "@/components/CircularProgress";

// Extended profile data
const profileData = {
  ...studentData.profile,
  email: "alex.rivera@email.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  joinDate: "September 2025",
  studentId: "STU-2025-0847",
  course: "Full Stack Web Development",
  batch: "Batch 2025-A",
  enrollmentStatus: "Active",
  completedCourses: 3,
  ongoingCourses: 2,
  totalHours: 156,
  lastActive: "Today, 2:30 PM",
};

const StudentProfile = () => {
  const { attendance, wallet, certificates, assessments } = studentData;

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6">
        {/* Header */}
        <div className="mb-2">
          <h1 className="text-2xl lg:text-3xl font-semibold text-foreground tracking-tight">
            My Profile
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your personal information and preferences
          </p>
        </div>

        {/* Profile Header Card */}
        <Card className="overflow-hidden">
          {/* Cover gradient */}
          <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20" />
          
          <CardContent className="relative px-6 pb-6">
            {/* Avatar */}
            <div className="absolute -top-16 left-6">
              <div className="relative">
                <img 
                  src={profileData.avatar}
                  alt={profileData.name}
                  className="w-32 h-32 rounded-2xl border-4 border-background shadow-lg"
                />
                <button className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Profile info */}
            <div className="pt-20 sm:pt-4 sm:pl-40">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-foreground">
                      {profileData.name}
                    </h2>
                    <Badge className="bg-primary/10 text-primary">
                      <Star className="w-3 h-3 mr-1" />
                      {profileData.tier}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mt-1">
                    {profileData.course}
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {profileData.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Joined {profileData.joinDate}
                    </span>
                  </div>
                </div>
                <Button className="gap-2">
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="transition-all hover:shadow-hover hover:-translate-y-0.5">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground">{attendance.percentage}%</p>
              <p className="text-xs text-muted-foreground mt-1">Attendance</p>
            </CardContent>
          </Card>
          
          <Card className="transition-all hover:shadow-hover hover:-translate-y-0.5">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground">{profileData.completedCourses}</p>
              <p className="text-xs text-muted-foreground mt-1">Courses Done</p>
            </CardContent>
          </Card>
          
          <Card className="transition-all hover:shadow-hover hover:-translate-y-0.5">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground">{certificates.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Certificates</p>
            </CardContent>
          </Card>
          
          <Card className="transition-all hover:shadow-hover hover:-translate-y-0.5">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground">{profileData.totalHours}h</p>
              <p className="text-xs text-muted-foreground mt-1">Learning Hours</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Personal Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-muted/30">
                    <p className="text-xs text-muted-foreground mb-1">Full Name</p>
                    <p className="font-medium text-foreground">{profileData.name}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/30">
                    <p className="text-xs text-muted-foreground mb-1">Student ID</p>
                    <p className="font-medium text-foreground">{profileData.studentId}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/30">
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <Mail className="w-3 h-3" /> Email
                    </p>
                    <p className="font-medium text-foreground">{profileData.email}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/30">
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <Phone className="w-3 h-3" /> Phone
                    </p>
                    <p className="font-medium text-foreground">{profileData.phone}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/30">
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> Location
                    </p>
                    <p className="font-medium text-foreground">{profileData.location}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/30">
                    <p className="text-xs text-muted-foreground mb-1">Last Active</p>
                    <p className="font-medium text-foreground">{profileData.lastActive}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Academic Information */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Academic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-muted/30">
                    <p className="text-xs text-muted-foreground mb-1">Current Course</p>
                    <p className="font-medium text-foreground">{profileData.course}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/30">
                    <p className="text-xs text-muted-foreground mb-1">Batch</p>
                    <p className="font-medium text-foreground">{profileData.batch}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/30">
                    <p className="text-xs text-muted-foreground mb-1">Enrollment Status</p>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <p className="font-medium text-foreground">{profileData.enrollmentStatus}</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/30">
                    <p className="text-xs text-muted-foreground mb-1">Ongoing Courses</p>
                    <p className="font-medium text-foreground">{profileData.ongoingCourses} courses</p>
                  </div>
                </div>

                {/* Latest Assessment */}
                {assessments.length > 0 && (
                  <div className="p-4 rounded-xl border border-primary/20 bg-primary/5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Latest Assessment</p>
                        <p className="font-medium text-foreground">{assessments[0].task}</p>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-primary/10 text-primary">{assessments[0].status}</Badge>
                        <p className="text-lg font-bold text-primary mt-1">{assessments[0].grade}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Attendance Progress */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  Attendance
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <CircularProgress 
                  value={attendance.percentage} 
                  size={120} 
                  strokeWidth={10}
                  color="stroke-primary"
                >
                  <span className="text-3xl font-bold text-foreground">{attendance.percentage}%</span>
                </CircularProgress>
                <Badge className="mt-4 bg-primary/10 text-primary">
                  🏆 {attendance.status} Status
                </Badge>
                <p className="text-xs text-muted-foreground mt-2">
                  {attendance.provider}
                </p>
              </CardContent>
            </Card>

            {/* Wallet Status */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Wallet & Payments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-xl bg-muted/30">
                  <p className="text-xs text-muted-foreground mb-1">Current Balance</p>
                  <p className="text-2xl font-bold text-foreground">{wallet.balance}</p>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <div>
                    <p className="text-xs text-muted-foreground">Payment Status</p>
                    <p className="font-medium text-foreground">{wallet.status}</p>
                  </div>
                  <Badge className="bg-primary/10 text-primary">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Up to date
                  </Badge>
                </div>
                <div className="p-4 rounded-xl bg-muted/30">
                  <p className="text-xs text-muted-foreground mb-1">Next Due Date</p>
                  <p className="font-medium text-foreground">{wallet.next_due}</p>
                </div>
              </CardContent>
            </Card>

            {/* Account Settings */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Bell className="w-4 h-4" />
                  Notification Settings
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Shield className="w-4 h-4" />
                  Privacy & Security
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Award className="w-4 h-4" />
                  View Certificates
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentProfile;
