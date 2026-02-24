import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Calendar,
  FileText,
  CreditCard,
  Award
} from "lucide-react";

const StudentDashboard = () => {
  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6 lg:space-y-8">

        {/* 1. Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full border-2 border-primary/20 bg-primary/10 flex flex-shrink-0 items-center justify-center text-primary text-2xl font-bold">
              S
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-semibold text-foreground tracking-tight">
                Welcome, Sareefa 👋
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm font-medium text-foreground">
                  Full Stack Development
                </p>
                <span className="text-muted-foreground">•</span>
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  Phase: Learning (Month 1)
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Upcoming Class Section */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Upcoming Class</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="font-medium text-foreground">
                  Topic: React State Management
                </p>
                <p className="text-sm text-muted-foreground">
                  Next Class Date: 25 March 2026
                </p>
                <p className="text-sm text-muted-foreground">
                  Time: 7:00 PM - 8:30 PM
                </p>
              </div>
              <Button asChild className="shrink-0 bg-primary text-primary-foreground hover:bg-primary/90">
                <a
                  href="https://meet.google.com/xyz-demo-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Join Google Meet
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 3. Progress Overview Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Course Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">Overall Progress</span>
                <span className="text-muted-foreground">35%</span>
              </div>
              <Progress value={35} className="h-2" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted/50 flex flex-col justify-center">
                <p className="text-sm text-muted-foreground mb-1">Modules Completed</p>
                <p className="text-2xl font-semibold text-foreground">
                  5 <span className="text-lg text-muted-foreground font-normal">/ 14</span>
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 flex flex-col justify-center">
                <p className="text-sm text-muted-foreground mb-1">Internship Status</p>
                <p className="text-lg font-medium text-foreground">
                  Not Started
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 4. Quick Access Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-foreground">Quick Access</h2>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <Link to="/student/packages" className="block group">
              <Card className="h-full transition-all hover:shadow-md hover:border-primary/50 group-hover:-translate-y-1 bg-card">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-3 h-full">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-medium text-foreground">My Courses</span>
                </CardContent>
              </Card>
            </Link>

            <Link to="/student/classes" className="block group">
              <Card className="h-full transition-all hover:shadow-md hover:border-primary/50 group-hover:-translate-y-1 bg-card">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-3 h-full">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-medium text-foreground">Classes & Schedule</span>
                </CardContent>
              </Card>
            </Link>

            <Link to="/student/materials" className="block group">
              <Card className="h-full transition-all hover:shadow-md hover:border-primary/50 group-hover:-translate-y-1 bg-card">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-3 h-full">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-medium text-foreground">Learning Materials</span>
                </CardContent>
              </Card>
            </Link>

            <Link to="/student/wallet" className="block group">
              <Card className="h-full transition-all hover:shadow-md hover:border-primary/50 group-hover:-translate-y-1 bg-card">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-3 h-full">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-medium text-foreground">Wallet & Payment</span>
                </CardContent>
              </Card>
            </Link>

            <Link to="/student/certificates" className="block group">
              <Card className="h-full transition-all hover:shadow-md hover:border-primary/50 group-hover:-translate-y-1 bg-card">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-3 h-full">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Award className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-medium text-foreground">Certificate</span>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
