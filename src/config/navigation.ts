import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  Award,
  Bell,
  User,
  ClipboardList,
  TrendingUp,
  UserCheck,
  MessageSquare,
  Wallet,
  FileText,
  Video,
  DollarSign,
  ListTodo,
  GraduationCap,
  Users,
  BarChart3,
  LucideIcon,
  Briefcase,
  FileBarChart,
  CreditCard,
  Settings,
  Link2,
  Package,
  PieChart,
  ScrollText,
  UserCog,
} from "lucide-react";

export type UserRole = "student" | "intern" | "tutor" | "mentor" | "admin" | "finance" | "superadmin";

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

export interface RoleNavigation {
  role: UserRole;
  label: string;
  baseUrl: string;
  mainNav: NavItem[];
  secondaryNav: NavItem[];
}

// Student Navigation - Focus: learning, progress, encouragement
export const studentNavigation: RoleNavigation = {
  role: "student",
  label: "Student",
  baseUrl: "/student",
  mainNav: [
    { title: "Dashboard", url: "/student", icon: LayoutDashboard },
    { title: "Profile", url: "/student/profile", icon: User },
    { title: "Classes & Schedule", url: "/student/classes", icon: BookOpen },
    { title: "Attendance", url: "/student/attendance", icon: UserCheck },
    { title: "Learning Materials", url: "/student/materials", icon: FileText },
    { title: "Recorded Classes", url: "/student/recordings", icon: Video },
    { title: "Assessments", url: "/student/assessments", icon: ClipboardList },
    { title: "Package Recommendations", url: "/student/packages", icon: GraduationCap },
    { title: "Wallet & Payments", url: "/student/wallet", icon: Wallet },
    { title: "Certificates", url: "/student/certificates", icon: Award },
  ],
  secondaryNav: [
    { title: "Notifications", url: "/student/notifications", icon: Bell },
    { title: "Feedback", url: "/student/feedback", icon: MessageSquare },
  ],
};

// Intern Navigation - Focus: tasks, growth, accountability
export const internNavigation: RoleNavigation = {
  role: "intern",
  label: "Intern",
  baseUrl: "/intern",
  mainNav: [
    { title: "Dashboard", url: "/intern", icon: LayoutDashboard },
    { title: "Profile", url: "/intern/profile", icon: User },
    { title: "Tasks", url: "/intern/tasks", icon: ListTodo },
    { title: "Progress", url: "/intern/progress", icon: TrendingUp },
    { title: "Attendance", url: "/intern/attendance", icon: UserCheck },
    { title: "Stipend", url: "/intern/stipend", icon: DollarSign },
    { title: "Certificates", url: "/intern/certificates", icon: Award },
  ],
  secondaryNav: [
    { title: "Notifications", url: "/intern/notifications", icon: Bell },
    { title: "Feedback", url: "/intern/feedback", icon: MessageSquare },
  ],
};

// Tutor Navigation - Focus: teaching efficiency and evaluation clarity
export const tutorNavigation: RoleNavigation = {
  role: "tutor",
  label: "Tutor",
  baseUrl: "/tutor",
  mainNav: [
    { title: "Dashboard", url: "/tutor", icon: LayoutDashboard },
    { title: "Profile", url: "/tutor/profile", icon: User },
    { title: "Classes", url: "/tutor/classes", icon: BookOpen },
    { title: "Learning Materials", url: "/tutor/materials", icon: FileText },
    { title: "Assignments", url: "/tutor/assignments", icon: ClipboardList },
    { title: "Evaluations", url: "/tutor/evaluations", icon: BarChart3 },
    { title: "Student Performance", url: "/tutor/performance", icon: Users },
    { title: "Salary", url: "/tutor/salary", icon: DollarSign },
  ],
  secondaryNav: [
    { title: "Notifications", url: "/tutor/notifications", icon: Bell },
    { title: "Feedback", url: "/tutor/feedback", icon: MessageSquare },
  ],
};

// Mentor Navigation - Focus: guidance, oversight, insight
export const mentorNavigation: RoleNavigation = {
  role: "mentor",
  label: "Mentor",
  baseUrl: "/mentor",
  mainNav: [
    { title: "Dashboard", url: "/mentor", icon: LayoutDashboard },
    { title: "Profile", url: "/mentor/profile", icon: User },
    { title: "Students", url: "/mentor/students", icon: GraduationCap },
    { title: "Interns", url: "/mentor/interns", icon: Briefcase },
    { title: "Progress Reports", url: "/mentor/progress", icon: TrendingUp },
    { title: "Guidance & Notes", url: "/mentor/guidance", icon: ScrollText },
    { title: "Salary", url: "/mentor/salary", icon: DollarSign },
  ],
  secondaryNav: [
    { title: "Notifications", url: "/mentor/notifications", icon: Bell },
    { title: "Feedback", url: "/mentor/feedback", icon: MessageSquare },
  ],
};

// Admin Navigation - Focus: daily operations and coordination
export const adminNavigation: RoleNavigation = {
  role: "admin",
  label: "Admin",
  baseUrl: "/admin",
  mainNav: [
    { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
    { title: "Students", url: "/admin/students", icon: GraduationCap },
    { title: "Interns", url: "/admin/interns", icon: Briefcase },
    { title: "Tutors", url: "/admin/tutors", icon: BookOpen },
    { title: "Mentors", url: "/admin/mentors", icon: Users },
    { title: "Classes & Courses", url: "/admin/courses", icon: Package },
    { title: "Attendance", url: "/admin/attendance", icon: UserCheck },
    { title: "Assessments & Performance", url: "/admin/assessments", icon: ClipboardList },
    { title: "Finance Overview", url: "/admin/finance", icon: Wallet },
    { title: "Reports", url: "/admin/reports", icon: FileBarChart },
  ],
  secondaryNav: [
    { title: "Notifications", url: "/admin/notifications", icon: Bell },
  ],
};

// Finance Navigation - Focus: accuracy, trust, clean numbers
export const financeNavigation: RoleNavigation = {
  role: "finance",
  label: "Finance",
  baseUrl: "/finance",
  mainNav: [
    { title: "Dashboard", url: "/finance", icon: LayoutDashboard },
    { title: "Student Fees", url: "/finance/student-fees", icon: GraduationCap },
    { title: "Wallet Management", url: "/finance/wallets", icon: Wallet },
    { title: "Intern Stipends", url: "/finance/stipends", icon: Briefcase },
    { title: "Tutor Salaries", url: "/finance/tutor-salaries", icon: BookOpen },
    { title: "Mentor Salaries", url: "/finance/mentor-salaries", icon: Users },
    { title: "Financial Reports", url: "/finance/reports", icon: FileBarChart },
  ],
  secondaryNav: [
    { title: "Notifications", url: "/finance/notifications", icon: Bell },
  ],
};

// Super Admin Navigation - Focus: full control and governance
export const superadminNavigation: RoleNavigation = {
  role: "superadmin",
  label: "Super Admin",
  baseUrl: "/superadmin",
  mainNav: [
    { title: "Dashboard", url: "/superadmin", icon: LayoutDashboard },
    { title: "User Management", url: "/superadmin/users", icon: UserCog },
    { title: "Students", url: "/superadmin/students", icon: GraduationCap },
    { title: "Interns", url: "/superadmin/interns", icon: Briefcase },
    { title: "Tutors", url: "/superadmin/tutors", icon: BookOpen },
    { title: "Mentors", url: "/superadmin/mentors", icon: Users },
    { title: "Courses & Packages", url: "/superadmin/courses", icon: Package },
    { title: "Finance & Payroll", url: "/superadmin/finance", icon: CreditCard },
    { title: "Reports & Analytics", url: "/superadmin/reports", icon: PieChart },
    { title: "Certificates", url: "/superadmin/certificates", icon: Award },
    { title: "Integrations", url: "/superadmin/integrations", icon: Link2 },
    { title: "System Settings", url: "/superadmin/settings", icon: Settings },
  ],
  secondaryNav: [
    { title: "Notifications", url: "/superadmin/notifications", icon: Bell },
  ],
};

// Get navigation config by role
export const getNavigationByRole = (role: UserRole): RoleNavigation => {
  switch (role) {
    case "student":
      return studentNavigation;
    case "intern":
      return internNavigation;
    case "tutor":
      return tutorNavigation;
    case "mentor":
      return mentorNavigation;
    case "admin":
      return adminNavigation;
    case "finance":
      return financeNavigation;
    case "superadmin":
      return superadminNavigation;
    default:
      return studentNavigation;
  }
};

// Role display info
export const roleDisplayInfo: Record<UserRole, { label: string; color: string }> = {
  student: { label: "Student", color: "bg-role-student" },
  intern: { label: "Intern", color: "bg-role-intern" },
  tutor: { label: "Tutor", color: "bg-role-tutor" },
  mentor: { label: "Mentor", color: "bg-role-mentor" },
  admin: { label: "Admin", color: "bg-role-admin" },
  finance: { label: "Finance", color: "bg-role-finance" },
  superadmin: { label: "Super Admin", color: "bg-role-superadmin" },
};
