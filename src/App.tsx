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
import StudentAssignments from "./pages/student/Assignments";
import StudentChat from "./pages/student/Chat";
import StudentRecordings from "./pages/student/Recordings";
import StudentAssessments from "./pages/student/Assessments";
import StudentAssessmentReport from "./pages/student/AssessmentReport";
import StudentPackages from "./pages/student/Packages";
import StudentAssignmentSubmission from "@/pages/student/AssignmentSubmission";
import StudentWallet from "./pages/student/Wallet";
import StudentCertificates from "./pages/student/Certificates";
import StudentNotifications from "./pages/student/Notifications";
import StudentFeedback from "./pages/student/Feedback";
import StudentExams from "@/pages/student/Exams";
import StudentSupportTickets from "./pages/student/SupportTickets";
import StudentWebinars from "./pages/student/Webinars";
import WebinarDetails from "./pages/student/WebinarDetails";
import StudentMeet from "./pages/student/Meet";

// Intern Pages
import InternDashboard from "./pages/intern/Dashboard";
import InternProfile from "./pages/intern/Profile";
import InternTasks from "./pages/intern/Tasks";
import TaskDetails from "./pages/intern/TaskDetails";
import TaskSubmit from "./pages/intern/TaskSubmit";
import WeeklyReport from "./pages/intern/WeeklyReport";
import InternProgress from "./pages/intern/Progress";
import InternAttendance from "./pages/intern/Attendance";
import InternStipend from "./pages/intern/Stipend";
import InternCertificates from "./pages/intern/Certificates";
import InternNotifications from "./pages/intern/Notifications";
import InternFeedback from "./pages/intern/Feedback";
import InternMeet from "./pages/intern/Meet";
import InternMaterials from "./pages/intern/Materials";
import InternSupportTicket from "@/pages/intern/SupportTicket";
import InternPlacementUpdates from "@/pages/intern/PlacementUpdates";

// Tutor Pages
import TutorDashboard from "./pages/tutor/Dashboard";
import TutorBatches from "./pages/tutor/Batches";
import TutorBatchStudents from "./pages/tutor/BatchStudents";
import TutorStudents from "./pages/tutor/Students";
import TutorStudentDashboard from "./pages/tutor/StudentDashboard";
import TutorChat from "./pages/tutor/Chat";
import TutorAssignments from "./pages/tutor/Assignments";
import TutorAnnouncements from "./pages/tutor/Announcements";
import TutorMaterials from "./pages/tutor/Materials";
import TutorWallet from "@/pages/tutor/Wallet";
import TutorProfile from "./pages/tutor/Profile";
import TutorFeedback from "./pages/tutor/Feedback";
import TutorTeachingFlow from "./pages/tutor/TeachingFlow";

import MentorSupportTicket from "@/pages/mentor/SupportTicket";
import MentorMeet from "@/pages/mentor/Meet";
import MentorAssignments from "@/pages/mentor/Assignments";
import MentorAnnouncements from "@/pages/mentor/Announcements";
import MentorMaterials from "@/pages/mentor/Materials";
import MentorWallet from "@/pages/mentor/Wallet";
import TutorSupportTicket from "./pages/tutor/SupportTicket";

// Mentor Pages
import MentorDashboard from "./pages/mentor/Dashboard";
import MentorProfile from "./pages/mentor/Profile";
import StudentManagement from "./pages/mentor/StudentManagement";
import MentorInterns from "./pages/mentor/Interns";
import MentorInternDetails from "./pages/mentor/InternDetails";
import MentorTasks from "./pages/mentor/Tasks";
import MentorTaskDetails from "./pages/mentor/TaskDetails";
import MentorTaskReviews from "./pages/mentor/TaskReviews";
import MentorWeeklyReports from "./pages/mentor/WeeklyReports";
import MentorAttendance from "./pages/mentor/Attendance";
import MentorPerformance from "./pages/mentor/Performance";
import MentorProgress from "./pages/mentor/Progress";
import MentorGuidance from "./pages/mentor/Guidance";
import MentorSalary from "./pages/mentor/Salary";
import MentorNotifications from "./pages/mentor/Notifications";
import MentorFeedback from "./pages/mentor/Feedback";
import TutorManagement from "./pages/mentor/TutorManagement";
import MentorTutorDetails from "./pages/mentor/TutorDetails";
import MentorTutorSessions from "./pages/mentor/TutorSessions";
import MentorLiveSessions from "./pages/mentor/LiveSessions";
import MentorBatchManagement from "./pages/mentor/BatchManagement";
import MentorStudents from "./pages/mentor/Students";
import MentorStudentDetails from "./pages/mentor/StudentDetails";
import MentorChat from "./pages/mentor/Chat";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import StudentList from "./pages/admin/students/StudentList";
import StudentDetails from "./pages/admin/students/StudentDetails";
import AddEditStudent from "./pages/admin/students/AddEditStudent";
import AdminInterns from "./pages/admin/Interns";
import AdminTutorDetails from "./pages/admin/TutorDetails";
import AddEditTutor from "./pages/admin/AddEditTutor";
import AdminTutors from "./pages/admin/Tutors";
import AdminMentors from "./pages/admin/Mentors";
import AddEditMentor from "./pages/admin/AddEditMentor";
import AdminMentorDetails from "./pages/admin/MentorDetails";
import AdminCourses from "./pages/admin/Courses";
import CoursePage from "./pages/admin/CoursePage";
import AdminBatchManagement from "./pages/admin/BatchManagement";
import AdminAttendance from "./pages/admin/Attendance";
import AdminAssessments from "./pages/admin/Assessments";
import AdminFinance from "./pages/admin/FinanceOverview";
import AdminFinanceBatchDetails from "./pages/admin/FinanceBatchDetails";
import AdminReports from "./pages/admin/AdminReports";
import AdminNotifications from "./pages/admin/Notifications";
import AdminProfile from "./pages/admin/Profile";
import AdminMeetList from "./pages/admin/meet/MeetList";
import AdminCreateMeet from "./pages/admin/meet/CreateMeet";
import AdminMeetDetails from "./pages/admin/meet/MeetDetails";
import AdminScheduleMeet from "./pages/admin/meet/ScheduleMeet";

// Finance Pages
import FinanceDashboard from "./pages/finance/Dashboard";
import FinanceStudentFees from "./pages/finance/StudentFees";
import FinanceWallets from "./pages/finance/Wallets";
import FinanceStipends from "./pages/finance/Stipends";
import FinanceTutorSalaries from "./pages/finance/TutorSalaries";
import FinanceMentorSalaries from "./pages/finance/MentorSalaries";
import FinanceReports from "./pages/finance/FinanceReports";
import FinanceNotifications from "./pages/finance/Notifications";
import FinanceProfile from "./pages/finance/Profile";
import WalletTopupRequests from "./pages/finance/WalletTopupRequests";
import StudentWallets from "./pages/finance/StudentWallets";
import WalletTransactions from "./pages/finance/WalletTransactions";
import CoursePayments from "./pages/finance/CoursePayments";
import TutorEarnings from "./pages/finance/TutorEarnings";
import MentorEarnings from "./pages/finance/MentorEarnings";
import InternEarnings from "./pages/finance/InternEarnings";
import Payouts from "./pages/finance/Payouts";


// Super Admin Pages
import SuperAdminDashboard from "./pages/superadmin/Dashboard";
import SuperAdminUsers from "./pages/superadmin/Users";
import SuperAdminStudents from "./pages/superadmin/Students";
import SuperAdminInterns from "./pages/superadmin/Interns";
import SuperAdminTutors from "./pages/superadmin/Tutors";
import SuperAdminMentors from "./pages/superadmin/Mentors";
import SuperAdminProgram from "./pages/superadmin/Program";
import SuperAdminBatches from "./pages/superadmin/Batches";
import SuperAdminFinance from "./pages/superadmin/Finance";
import SuperAdminReports from "./pages/superadmin/Reports";
import SuperAdminCertificates from "./pages/superadmin/Certificates";
import SuperAdminIntegrations from "./pages/superadmin/Integrations";
import SuperAdminSettings from "./pages/superadmin/Settings";
import SuperAdminNotifications from "./pages/superadmin/Notifications";
import SuperAdminProfile from "./pages/superadmin/Profile";
import DashboardLayout from "./components/DashboardLayout";

// Coordinator Pages
import CoordinatorDashboard from "./pages/coordinator/Dashboard";
import CoordinatorFeedback from "./pages/coordinator/Feedback";
import CoordinatorInterns from "./pages/coordinator/Interns";
import CoordinatorInternDetails from "./pages/coordinator/InternDetails";
import CoordinatorTasks from "./pages/coordinator/Tasks";
import CoordinatorTaskDetails from "./pages/coordinator/TaskDetails";
import CoordinatorTaskReviews from "./pages/coordinator/TaskReviews";
import CoordinatorWeeklyReports from "./pages/coordinator/WeeklyReports";
import CoordinatorProgress from "./pages/coordinator/Progress";
import CoordinatorAttendance from "./pages/coordinator/Attendance";
import CoordinatorSupportTicket from "./pages/coordinator/SupportTicket";
import CoordinatorMeet from "./pages/coordinator/Meet";

// Advisor Pages
import AdvisorDashboard from "./pages/advisor/Dashboard";

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
          <Route path="/student/live-sessions" element={<StudentClasses />} />
          <Route path="/student/attendance" element={<StudentAttendance />} />
          <Route path="/student/materials" element={<StudentMaterials />} />
          <Route path="/student/assignments" element={<StudentAssignments />} />
          <Route path="/student/chat" element={<StudentChat />} />
          <Route path="/student/recordings" element={<StudentRecordings />} />
          <Route path="/student/assessments" element={<StudentAssessments />} />
          <Route path="/student/assessment-report" element={<StudentAssessmentReport />} />
          <Route path="/student/my-course" element={<StudentPackages />} />
          <Route path="/student/courses" element={<StudentPackages />} />
          <Route path="/student/my-course/:courseSlug" element={<StudentPackages />} />
          <Route path="/student/my-course/:courseSlug/:moduleSlug" element={<StudentPackages />} />
          <Route path="/student/my-course/:courseSlug/:moduleSlug/:sessionSlug" element={<StudentPackages />} />
          <Route path="/student/my-course/:courseSlug/:moduleSlug/:sessionSlug/assignment" element={<StudentAssignmentSubmission />} />
          <Route path="/student/wallet" element={<StudentWallet />} />
          <Route path="/student/payments" element={<StudentWallet />} />
          <Route path="/student/payments/:courseId" element={<StudentWallet />} />
          <Route path="/student/certificates" element={<StudentCertificates />} />
          <Route path="/student/notifications" element={<StudentNotifications />} />
          <Route path="/student/feedback" element={<StudentFeedback />} />
          <Route path="/student/exam" element={<StudentExams />} />
          <Route path="/student/exam/:courseSlug" element={<StudentExams />} />
          <Route path="/student/exam/:courseSlug/:examSlug" element={<StudentExams />} />
          <Route path="/student/exam/:courseSlug/:examSlug/details" element={<StudentExams />} />
          <Route path="/student/exam/:courseSlug/:examSlug/details/review" element={<StudentExams />} />
          <Route path="/student/support-tickets" element={<StudentSupportTickets />} />
          <Route path="/student/webinar" element={<StudentWebinars />} />
          <Route path="/student/webinar/:id" element={<WebinarDetails />} />
          <Route path="/student/meet" element={<StudentMeet />} />
          <Route path="/student/meet/:tab" element={<StudentMeet />} />

          {/* Intern Routes */}
          <Route path="/intern" element={<InternDashboard />} />
          <Route path="/intern/profile" element={<InternProfile />} />
          <Route path="/intern/tasks" element={<InternTasks />} />
          <Route path="/intern/tasks/:taskId" element={<TaskDetails />} />
          <Route path="/intern/tasks/:taskId/submit" element={<TaskSubmit />} />
          <Route path="/intern/weekly-report" element={<WeeklyReport />} />
          <Route path="/intern/weekly-report/submit-weekly-report" element={<WeeklyReport />} />
          <Route path="/intern/progress" element={<InternProgress />} />
          <Route path="/intern/attendance" element={<InternAttendance />} />
          <Route path="/intern/stipend" element={<InternStipend />} />
          <Route path="/intern/certificates" element={<InternCertificates />} />
          <Route path="/intern/notifications" element={<InternNotifications />} />
          <Route path="/intern/feedback" element={<InternFeedback />} />
          <Route path="/intern/meet" element={<InternMeet />} />
          <Route path="/intern/meet/:tab" element={<InternMeet />} />
          <Route path="/intern/materials" element={<InternMaterials />} />
          <Route path="/intern/support-ticket" element={<InternSupportTicket />} />
          <Route path="/intern/placement-updates" element={<InternPlacementUpdates />} />

          {/* Tutor Routes */}
          <Route path="/tutor" element={<TutorDashboard />} />
          <Route path="/tutor/batches" element={<TutorBatches />} />
          <Route path="/tutor/batches/:batchId/teaching" element={<TutorTeachingFlow />} />
          <Route path="/tutor/batches/:batchId/teaching/:moduleSlug" element={<TutorTeachingFlow />} />
          <Route path="/tutor/batches/:batchId/teaching/:moduleSlug/:sessionSlug" element={<TutorTeachingFlow />} />
          <Route path="/tutor/batches/:batchId/students" element={<TutorBatchStudents />} />
          <Route path="/tutor/students" element={<TutorStudents />} />
          <Route path="/tutor/students/:studentId" element={<TutorStudentDashboard />} />
          <Route path="/tutor/chat" element={<TutorChat />} />
          <Route path="/tutor/assignments" element={<TutorAssignments />} />
          <Route path="/tutor/announcements" element={<TutorAnnouncements />} />
          <Route path="/tutor/feedback" element={<TutorFeedback />} />
          <Route path="/tutor/materials" element={<TutorMaterials />} />
          <Route path="/tutor/wallet" element={<TutorWallet />} />
          <Route path="/tutor/profile" element={<TutorProfile />} />
          <Route path="/tutor/support-ticket" element={<TutorSupportTicket />} />

          {/* Mentor Routes */}
          <Route path="/mentor" element={<MentorDashboard />} />
          <Route path="/mentor/profile" element={<MentorProfile />} />
          <Route path="/mentor/students" element={<MentorStudents />} />
          <Route path="/mentor/my-batches/students" element={<MentorStudents />} />
          <Route path="/mentor/my-batches/students/:id" element={<MentorStudentDetails />} />
          <Route path="/mentor/interns" element={<MentorInterns />} />
          <Route path="/mentor/interns/:internId" element={<MentorInternDetails />} />
          <Route path="/mentor/tasks" element={<MentorTasks />} />
          <Route path="/mentor/tasks/:taskId" element={<MentorTaskDetails />} />
          <Route path="/mentor/task-reviews" element={<MentorTaskReviews />} />
          <Route path="/mentor/weekly-reports" element={<MentorWeeklyReports />} />
          <Route path="/mentor/attendance" element={<MentorAttendance />} />
          <Route path="/mentor/performance" element={<MentorPerformance />} />
          <Route path="/mentor/progress" element={<MentorProgress />} />
          <Route path="/mentor/guidance" element={<MentorGuidance />} />
          <Route path="/mentor/salary" element={<MentorSalary />} />
          <Route path="/mentor/notifications" element={<MentorNotifications />} />
          <Route path="/mentor/feedback" element={<MentorFeedback />} />
          <Route path="/mentor/my-batches/tutors" element={<TutorManagement />} />
          <Route path="/mentor/my-batches/tutors/:id" element={<MentorTutorDetails />} />
          <Route path="/mentor/my-batches/tutors/:id/sessions" element={<MentorTutorSessions />} />
          <Route path="/mentor/live-sessions" element={<MentorLiveSessions />} />
          <Route path="/mentor/batches" element={<MentorBatchManagement />} />
          <Route path="/mentor/chat" element={<MentorChat />} />
          <Route path="/mentor/meet" element={<MentorMeet />} />
          <Route path="/mentor/assignments" element={<MentorAssignments />} />
          <Route path="/mentor/announcements" element={<MentorAnnouncements />} />
          <Route path="/mentor/materials" element={<MentorMaterials />} />
          <Route path="/mentor/support-ticket" element={<MentorSupportTicket />} />
          <Route path="/mentor/wallet" element={<MentorWallet />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/meet" element={<AdminMeetList />} />
          <Route path="/admin/meet/schedule" element={<AdminScheduleMeet />} />
          <Route path="/admin/meet/:id" element={<AdminMeetDetails />} />
          <Route path="/admin/students" element={<StudentList />} />
          <Route path="/admin/students/:id" element={<StudentDetails />} />
          <Route path="/admin/students/add" element={<AddEditStudent mode="add" />} />
          <Route path="/admin/students/edit/:id" element={<AddEditStudent mode="edit" />} />
          <Route path="/admin/interns" element={<AdminInterns />} />
          <Route path="/admin/tutor" element={<AdminTutors />} />
          <Route path="/admin/tutor/:id" element={<AdminTutorDetails />} />
          <Route path="/admin/tutor/add" element={<AddEditTutor mode="add" />} />
          <Route path="/admin/tutor/edit/:id" element={<AddEditTutor mode="edit" />} />
          <Route path="/admin/mentor" element={<AdminMentors />} />
          <Route path="/admin/mentor/add" element={<AddEditMentor mode="add" />} />
          <Route path="/admin/mentor/edit/:id" element={<AddEditMentor mode="edit" />} />
          <Route path="/admin/mentor/:id" element={<AdminMentorDetails />} />
          <Route path="/admin/courses" element={<CoursePage />} />
          <Route path="/admin/batch" element={<AdminBatchManagement />} />
          <Route path="/admin/attendance" element={<AdminAttendance />} />
          <Route path="/admin/assessments" element={<AdminAssessments />} />
          <Route path="/admin/assignments" element={<AdminAssessments />} />
          <Route path="/admin/finance" element={<AdminFinance />} />
          <Route path="/admin/finance/batch/:batchId" element={<AdminFinanceBatchDetails />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/notifications" element={<AdminNotifications />} />
          <Route path="/admin/profile" element={<AdminProfile />} />

          {/* Finance Routes */}
          <Route path="/finance" element={<FinanceDashboard />} />
          <Route path="/finance/student-fees" element={<FinanceStudentFees />} />
          <Route path="/finance/wallets" element={<FinanceWallets />} />
          <Route path="/finance/stipends" element={<FinanceStipends />} />
          <Route path="/finance/tutor-salaries" element={<FinanceTutorSalaries />} />
          <Route path="/finance/mentor-salaries" element={<FinanceMentorSalaries />} />
          <Route path="/finance/reports" element={<FinanceReports />} />
          <Route path="/finance/notifications" element={<FinanceNotifications />} />
          <Route path="/finance/profile" element={<FinanceProfile />} />
          <Route path="/finance/wallets/topup" element={<WalletTopupRequests />} />
          <Route path="/finance/wallets/students" element={<StudentWallets />} />
          <Route path="/finance/wallets/transactions" element={<WalletTransactions />} />
          <Route path="/finance/revenue/course-payments" element={<CoursePayments />} />
          <Route path="/finance/earnings/tutors" element={<TutorEarnings />} />
          <Route path="/finance/earnings/tutor" element={<TutorEarnings />} />
          <Route path="/finance/earnings/mentors" element={<MentorEarnings />} />
          <Route path="/finance/earnings/mentor" element={<MentorEarnings />} />
          <Route path="/finance/earnings/interns" element={<InternEarnings />} />
          <Route path="/finance/earnings/intern" element={<InternEarnings />} />
          <Route path="/finance/payouts" element={<Payouts />} />


          {/* Super Admin Routes */}
          <Route path="/superadmin" element={<SuperAdminDashboard />} />
          <Route path="/superadmin/users" element={<SuperAdminUsers />} />
          <Route path="/superadmin/students" element={<SuperAdminStudents />} />
          <Route path="/superadmin/interns" element={<SuperAdminInterns />} />
          <Route path="/superadmin/tutors" element={<SuperAdminTutors />} />
          <Route path="/superadmin/mentors" element={<SuperAdminMentors />} />
          <Route path="/superadmin/program" element={<SuperAdminProgram />} />
          <Route path="/superadmin/batches" element={<SuperAdminBatches />} />
          <Route path="/superadmin/finance" element={<SuperAdminFinance />} />
          <Route path="/superadmin/reports" element={<SuperAdminReports />} />
          <Route path="/superadmin/certificates" element={<SuperAdminCertificates />} />
          <Route path="/superadmin/integrations" element={<SuperAdminIntegrations />} />
          <Route path="/superadmin/settings" element={<SuperAdminSettings />} />
          <Route path="/superadmin/notifications" element={<SuperAdminNotifications />} />
          <Route path="/super-admin/profile" element={<SuperAdminProfile />} />

          {/* Coordinator Routes */}
          <Route path="/coordinator" element={<DashboardLayout><CoordinatorDashboard /></DashboardLayout>} />
          <Route path="/coordinator/dashboard" element={<DashboardLayout><CoordinatorDashboard /></DashboardLayout>} />
          <Route path="/coordinator/feedback" element={<DashboardLayout><CoordinatorFeedback /></DashboardLayout>} />
          <Route path="/coordinator/interns" element={<DashboardLayout><CoordinatorInterns /></DashboardLayout>} />
          <Route path="/coordinator/interns/:internId" element={<DashboardLayout><CoordinatorInternDetails /></DashboardLayout>} />
          <Route path="/coordinator/tasks" element={<DashboardLayout><CoordinatorTasks /></DashboardLayout>} />
          <Route path="/coordinator/tasks/:taskId" element={<DashboardLayout><CoordinatorTaskDetails /></DashboardLayout>} />
          <Route path="/coordinator/task-reviews" element={<DashboardLayout><CoordinatorTaskReviews /></DashboardLayout>} />
          <Route path="/coordinator/weekly-reports" element={<DashboardLayout><CoordinatorWeeklyReports /></DashboardLayout>} />
          <Route path="/coordinator/progress" element={<DashboardLayout><CoordinatorProgress /></DashboardLayout>} />
          <Route path="/coordinator/performance" element={<DashboardLayout><CoordinatorProgress /></DashboardLayout>} />
          <Route path="/coordinator/attendance" element={<DashboardLayout><CoordinatorAttendance /></DashboardLayout>} />
          <Route path="/coordinator/meet" element={<CoordinatorMeet />} />
          <Route path="/coordinator/chat" element={<DashboardLayout><div className="p-8 font-bold text-2xl">Chat Module - Coming Soon</div></DashboardLayout>} />
          <Route path="/coordinator/support-ticket" element={<CoordinatorSupportTicket />} />

          {/* Advisor Routes */}
          <Route path="/advisor" element={<DashboardLayout><AdvisorDashboard /></DashboardLayout>} />
          <Route path="/advisor/dashboard" element={<DashboardLayout><AdvisorDashboard /></DashboardLayout>} />

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
