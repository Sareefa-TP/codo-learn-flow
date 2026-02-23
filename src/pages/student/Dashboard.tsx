import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Award, 
  Bell,
  Star,
  FileText,
  Play,
} from "lucide-react";
import CircularProgress from "@/components/CircularProgress";
import NextClassCard from "@/components/student/NextClassCard";
import { studentData } from "@/data/studentData";

const StudentDashboard = () => {
  const { profile, attendance, next_class, notifications, certificates, assessments } = studentData;

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6 lg:space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img 
              src={profile.avatar} 
              alt={profile.name}
              className="w-14 h-14 rounded-full border-2 border-primary/20"
            />
            <div>
              <h1 className="text-2xl lg:text-3xl font-semibold text-foreground tracking-tight">
                Welcome back, {profile.name.split(' ')[0]}! 👋
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  <Star className="w-3 h-3 mr-1" />
                  {profile.tier}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  You're making great progress. Keep up the momentum!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Hero: Next Class Card */}
        <NextClassCard 
          subject={next_class.title}
          tutor={next_class.tutor}
          time="4:30 PM"
          timeLabel="Today"
          meetLink={next_class.link}
        />

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Attendance Gauge */}
          <Card className="transition-all hover:shadow-hover hover:-translate-y-0.5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Attendance</p>
                  <p className="text-xs text-primary font-medium">🏆 {attendance.status} Status</p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {attendance.provider}
                  </p>
                </div>
                <CircularProgress 
                  value={attendance.percentage} 
                  size={100} 
                  strokeWidth={8}
                  color="stroke-primary"
                >
                  <span className="text-2xl font-bold text-foreground">{attendance.percentage}%</span>
                </CircularProgress>
              </div>
            </CardContent>
          </Card>

          {/* Latest Assessment */}
          <Card className="transition-all hover:shadow-hover hover:-translate-y-0.5">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Latest Assessment</p>
                  <Badge 
                    variant="secondary" 
                    className="bg-primary/10 text-primary"
                  >
                    {assessments[0]?.status}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {assessments[0]?.task}
                  </h3>
                  <p className="text-2xl font-bold text-primary mt-1">
                    {assessments[0]?.grade}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Certificates Earned */}
          <Card className="transition-all hover:shadow-hover hover:-translate-y-0.5">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Certificates</p>
                  <Badge variant="secondary">
                    {certificates.length} earned
                  </Badge>
                </div>
                {certificates.map((cert, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Award className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{cert.title}</p>
                      <p className="text-xs text-muted-foreground">{cert.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Learning Materials Preview */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Learning Materials
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {studentData.learning_materials.map((material, index) => (
                <div 
                  key={index}
                  className="p-4 rounded-lg border hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-foreground">{material.subject}</h4>
                    <Badge variant="outline" className="text-xs">
                      {material.files.length} files
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    with {material.tutor}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {material.files.map((file, fileIndex) => (
                      <div 
                        key={fileIndex}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 text-xs"
                      >
                        {file.type === "doc" ? (
                          <FileText className="w-3 h-3 text-destructive" />
                        ) : (
                          <Play className="w-3 h-3 text-primary" />
                        )}
                        <span className="truncate max-w-32">{file.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Notifications
                {notifications.filter(n => !n.is_read).length > 0 && (
                  <Badge variant="destructive" className="ml-auto text-xs">
                    {notifications.filter(n => !n.is_read).length} new
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {notifications.length > 0 ? (
                notifications.map((notification, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border transition-colors ${
                      !notification.is_read
                        ? "bg-primary/5 border-primary/20"
                        : "bg-muted/30 border-transparent"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {!notification.is_read && (
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                      )}
                      <p className="text-sm text-foreground leading-relaxed">
                        {notification.text}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">All caught up! Grab a coffee. ☕</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
