import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
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

// Mentor Pages
import MentorDashboard from "./pages/mentor/Dashboard";
import MentorProfile from "./pages/mentor/Profile";
import MentorStudents from "./pages/mentor/Students";
import MentorInterns from "./pages/mentor/Interns";
import MentorProgress from "./pages/mentor/Progress";
import MentorGuidance from "./pages/mentor/Guidance";
import MentorSalary from "./pages/mentor/Salary";
import MentorNotifications from "./pages/mentor/Notifications";
import MentorFeedback from "./pages/mentor/Feedback";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminStudents from "./pages/admin/Students";
import AdminInterns from "./pages/admin/Interns";
import AdminTutors from "./pages/admin/Tutors";
import AdminMentors from "./pages/admin/Mentors";
import AdminCourses from "./pages/admin/Courses";
import AdminAttendance from "./pages/admin/Attendance";
import AdminAssessments from "./pages/admin/Assessments";
import AdminFinance from "./pages/admin/Finance";
import AdminReports from "./pages/admin/Reports";
import AdminNotifications from "./pages/admin/Notifications";

// Finance Pages
import FinanceDashboard from "./pages/finance/Dashboard";
import FinanceStudentFees from "./pages/finance/StudentFees";
import FinanceWallets from "./pages/finance/Wallets";
import FinanceStipends from "./pages/finance/Stipends";
import FinanceTutorSalaries from "./pages/finance/TutorSalaries";
import FinanceMentorSalaries from "./pages/finance/MentorSalaries";
import FinanceReports from "./pages/finance/Reports";
import FinanceNotifications from "./pages/finance/Notifications";

// Super Admin Pages
import SuperAdminDashboard from "./pages/superadmin/Dashboard";
import SuperAdminUsers from "./pages/superadmin/Users";
import SuperAdminStudents from "./pages/superadmin/Students";
import SuperAdminInterns from "./pages/superadmin/Interns";
import SuperAdminTutors from "./pages/superadmin/Tutors";
import SuperAdminMentors from "./pages/superadmin/Mentors";
import SuperAdminCourses from "./pages/superadmin/Courses";
import SuperAdminFinance from "./pages/superadmin/Finance";
import SuperAdminReports from "./pages/superadmin/Reports";
import SuperAdminCertificates from "./pages/superadmin/Certificates";
import SuperAdminIntegrations from "./pages/superadmin/Integrations";
import SuperAdminSettings from "./pages/superadmin/Settings";
import SuperAdminNotifications from "./pages/superadmin/Notifications";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/select-role" element={<RoleSelection />} />
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

          {/* Mentor Routes */}
          <Route path="/mentor" element={<MentorDashboard />} />
          <Route path="/mentor/profile" element={<MentorProfile />} />
          <Route path="/mentor/students" element={<MentorStudents />} />
          <Route path="/mentor/interns" element={<MentorInterns />} />
          <Route path="/mentor/progress" element={<MentorProgress />} />
          <Route path="/mentor/guidance" element={<MentorGuidance />} />
          <Route path="/mentor/salary" element={<MentorSalary />} />
          <Route path="/mentor/notifications" element={<MentorNotifications />} />
          <Route path="/mentor/feedback" element={<MentorFeedback />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/students" element={<AdminStudents />} />
          <Route path="/admin/interns" element={<AdminInterns />} />
          <Route path="/admin/tutors" element={<AdminTutors />} />
          <Route path="/admin/mentors" element={<AdminMentors />} />
          <Route path="/admin/courses" element={<AdminCourses />} />
          <Route path="/admin/attendance" element={<AdminAttendance />} />
          <Route path="/admin/assessments" element={<AdminAssessments />} />
          <Route path="/admin/finance" element={<AdminFinance />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/notifications" element={<AdminNotifications />} />

          {/* Finance Routes */}
          <Route path="/finance" element={<FinanceDashboard />} />
          <Route path="/finance/student-fees" element={<FinanceStudentFees />} />
          <Route path="/finance/wallets" element={<FinanceWallets />} />
          <Route path="/finance/stipends" element={<FinanceStipends />} />
          <Route path="/finance/tutor-salaries" element={<FinanceTutorSalaries />} />
          <Route path="/finance/mentor-salaries" element={<FinanceMentorSalaries />} />
          <Route path="/finance/reports" element={<FinanceReports />} />
          <Route path="/finance/notifications" element={<FinanceNotifications />} />

          {/* Super Admin Routes */}
          <Route path="/superadmin" element={<SuperAdminDashboard />} />
          <Route path="/superadmin/users" element={<SuperAdminUsers />} />
          <Route path="/superadmin/students" element={<SuperAdminStudents />} />
          <Route path="/superadmin/interns" element={<SuperAdminInterns />} />
          <Route path="/superadmin/tutors" element={<SuperAdminTutors />} />
          <Route path="/superadmin/mentors" element={<SuperAdminMentors />} />
          <Route path="/superadmin/courses" element={<SuperAdminCourses />} />
          <Route path="/superadmin/finance" element={<SuperAdminFinance />} />
          <Route path="/superadmin/reports" element={<SuperAdminReports />} />
          <Route path="/superadmin/certificates" element={<SuperAdminCertificates />} />
          <Route path="/superadmin/integrations" element={<SuperAdminIntegrations />} />
          <Route path="/superadmin/settings" element={<SuperAdminSettings />} />
          <Route path="/superadmin/notifications" element={<SuperAdminNotifications />} />

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
