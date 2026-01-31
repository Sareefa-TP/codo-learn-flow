import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RoleSelection from "./pages/RoleSelection";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Student Pages
import StudentDashboard from "./pages/student/Dashboard";
import StudentProfile from "./pages/student/Profile";
import StudentClasses from "./pages/student/Classes";
import StudentAttendance from "./pages/student/Attendance";
import StudentMaterials from "./pages/student/Materials";
import StudentRecordings from "./pages/student/Recordings";
import StudentAssessments from "./pages/student/Assessments";
import StudentPackages from "./pages/student/Packages";
import StudentWallet from "./pages/student/Wallet";
import StudentCertificates from "./pages/student/Certificates";
import StudentNotifications from "./pages/student/Notifications";
import StudentFeedback from "./pages/student/Feedback";

// Intern Pages
import InternDashboard from "./pages/intern/Dashboard";
import InternProfile from "./pages/intern/Profile";
import InternTasks from "./pages/intern/Tasks";
import InternProgress from "./pages/intern/Progress";
import InternAttendance from "./pages/intern/Attendance";
import InternStipend from "./pages/intern/Stipend";
import InternCertificates from "./pages/intern/Certificates";
import InternNotifications from "./pages/intern/Notifications";
import InternFeedback from "./pages/intern/Feedback";

// Tutor Pages
import TutorDashboard from "./pages/tutor/Dashboard";
import TutorProfile from "./pages/tutor/Profile";
import TutorClasses from "./pages/tutor/Classes";
import TutorMaterials from "./pages/tutor/Materials";
import TutorAssignments from "./pages/tutor/Assignments";
import TutorEvaluations from "./pages/tutor/Evaluations";
import TutorPerformance from "./pages/tutor/Performance";
import TutorSalary from "./pages/tutor/Salary";
import TutorNotifications from "./pages/tutor/Notifications";
import TutorFeedback from "./pages/tutor/Feedback";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<RoleSelection />} />
          <Route path="/login" element={<Login />} />

          {/* Student Routes */}
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/profile" element={<StudentProfile />} />
          <Route path="/student/classes" element={<StudentClasses />} />
          <Route path="/student/attendance" element={<StudentAttendance />} />
          <Route path="/student/materials" element={<StudentMaterials />} />
          <Route path="/student/recordings" element={<StudentRecordings />} />
          <Route path="/student/assessments" element={<StudentAssessments />} />
          <Route path="/student/packages" element={<StudentPackages />} />
          <Route path="/student/wallet" element={<StudentWallet />} />
          <Route path="/student/certificates" element={<StudentCertificates />} />
          <Route path="/student/notifications" element={<StudentNotifications />} />
          <Route path="/student/feedback" element={<StudentFeedback />} />

          {/* Intern Routes */}
          <Route path="/intern" element={<InternDashboard />} />
          <Route path="/intern/profile" element={<InternProfile />} />
          <Route path="/intern/tasks" element={<InternTasks />} />
          <Route path="/intern/progress" element={<InternProgress />} />
          <Route path="/intern/attendance" element={<InternAttendance />} />
          <Route path="/intern/stipend" element={<InternStipend />} />
          <Route path="/intern/certificates" element={<InternCertificates />} />
          <Route path="/intern/notifications" element={<InternNotifications />} />
          <Route path="/intern/feedback" element={<InternFeedback />} />

          {/* Tutor Routes */}
          <Route path="/tutor" element={<TutorDashboard />} />
          <Route path="/tutor/profile" element={<TutorProfile />} />
          <Route path="/tutor/classes" element={<TutorClasses />} />
          <Route path="/tutor/materials" element={<TutorMaterials />} />
          <Route path="/tutor/assignments" element={<TutorAssignments />} />
          <Route path="/tutor/evaluations" element={<TutorEvaluations />} />
          <Route path="/tutor/performance" element={<TutorPerformance />} />
          <Route path="/tutor/salary" element={<TutorSalary />} />
          <Route path="/tutor/notifications" element={<TutorNotifications />} />
          <Route path="/tutor/feedback" element={<TutorFeedback />} />

          {/* Legacy redirect */}
          <Route path="/dashboard" element={<Navigate to="/student" replace />} />
          <Route path="/dashboard/*" element={<Navigate to="/student" replace />} />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
