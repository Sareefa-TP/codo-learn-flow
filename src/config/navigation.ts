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
  Layers,
  ChevronDown,
} from "lucide-react";

export type UserRole = "student" | "intern" | "tutor" | "mentor" | "admin" | "finance" | "superadmin";

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  children?: NavItem[];   // optional collapsible sub-items
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
    { title: "My Course", url: "/student/packages", icon: BookOpen },
    { title: "Classes & Schedule", url: "/student/classes", icon: Calendar },
    { title: "Learning Materials", url: "/student/materials", icon: FileText },
    { title: "Assignments", url: "/student/assignments", icon: ClipboardList },
    { title: "Chat", url: "/student/chat", icon: MessageSquare },
    { title: "Wallet & Payments", url: "/student/wallet", icon: Wallet },
    { title: "Certificate", url: "/student/certificates", icon: Award },
  ],
  secondaryNav: [],
};

// Intern Navigation - Focus: tasks, growth, accountability
export const internNavigation: RoleNavigation = {
  role: "intern",
  label: "Intern",
  baseUrl: "/intern",
  mainNav: [
    { title: "Dashboard", url: "/intern", icon: LayoutDashboard },
    { title: "Tasks", url: "/intern/tasks", icon: ListTodo },
    { title: "Weekly Report", url: "/intern/weekly-report", icon: FileText },
    { title: "Progress", url: "/intern/progress", icon: TrendingUp },
    { title: "Attendance", url: "/intern/attendance", icon: UserCheck },
    { title: "Chat", url: "/intern/chat", icon: MessageSquare },
    { title: "Certificates", url: "/intern/certificates", icon: Award },
  ],
  secondaryNav: [],
};

// Tutor Navigation - Focus: teaching efficiency and evaluation clarity for Learning Phase
export const tutorNavigation: RoleNavigation = {
  role: "tutor",
  label: "Tutor",
  baseUrl: "/tutor",
  mainNav: [
    { title: "Dashboard", url: "/tutor", icon: LayoutDashboard },
    { title: "My Batches", url: "/tutor/batches", icon: BookOpen },
    { title: "Students", url: "/tutor/students", icon: Users },
    { title: "Chat", url: "/tutor/chat", icon: MessageSquare },
    { title: "Assignments", url: "/tutor/assignments", icon: ClipboardList },
    { title: "Announcements", url: "/tutor/announcements", icon: Bell },
    { title: "Learning Materials", url: "/tutor/materials", icon: FileText },
  ],
  secondaryNav: [],
};

// Mentor Navigation - Focus: guidance, oversight, insight
export const mentorNavigation: RoleNavigation = {
  role: "mentor",
  label: "Mentor",
  baseUrl: "/mentor",
  mainNav: [
    { title: "Dashboard", url: "/mentor", icon: LayoutDashboard },
    { title: "Interns", url: "/mentor/interns", icon: Briefcase },
    { title: "Tasks", url: "/mentor/tasks", icon: ListTodo },
    { title: "Task Reviews", url: "/mentor/task-reviews", icon: ClipboardList },
    { title: "Weekly Reports", url: "/mentor/weekly-reports", icon: FileText },
    { title: "Attendance", url: "/mentor/attendance", icon: UserCheck },
    { title: "Performance", url: "/mentor/performance", icon: TrendingUp },
  ],
  secondaryNav: [],
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
    { title: "Course", url: "/admin/courses", icon: Package },
    { title: "Batch", url: "/admin/batch", icon: Layers },
    { title: "Assignments", url: "/admin/assignments", icon: ClipboardList },
    { title: "Attendance", url: "/admin/attendance", icon: UserCheck },
    { title: "Finance Overview", url: "/admin/finance", icon: Wallet },
    { title: "Reports", url: "/admin/reports", icon: FileBarChart },
  ],
  secondaryNav: [],
};

// Finance Navigation - Focus: accuracy, trust, clean numbers
export const financeNavigation: RoleNavigation = {
  role: "finance",
  label: "Finance",
  baseUrl: "/finance",
  mainNav: [
    { title: "Dashboard", url: "/finance", icon: LayoutDashboard },
    {
      title: "Wallet",
      url: "/finance/wallets",
      icon: Wallet,
      children: [
        { title: "Top-up Requests", url: "/finance/wallets/topup", icon: CreditCard },
        { title: "Student Wallets", url: "/finance/wallets/students", icon: GraduationCap },
        { title: "Wallet Transactions", url: "/finance/wallets/transactions", icon: BarChart3 },
      ],
    },
    {
      title: "Revenue",
      url: "/finance/revenue",
      icon: TrendingUp,
      children: [
        { title: "Course Payments", url: "/finance/revenue/course-payments", icon: DollarSign },
      ],
    },
    {
      title: "Earnings",
      url: "/finance/earnings",
      icon: PieChart,
      children: [
        { title: "Tutor Earnings", url: "/finance/earnings/tutor", icon: BookOpen },
        { title: "Mentor Earnings", url: "/finance/earnings/mentor", icon: Users },
        { title: "Intern Earnings", url: "/finance/earnings/intern", icon: Briefcase },
      ],
    },
    { title: "Payouts", url: "/finance/payouts", icon: CreditCard },
    { title: "Reports", url: "/finance/reports", icon: FileBarChart },
  ],
  secondaryNav: [],
};

export { ChevronDown };

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
    { title: "Program Structure", url: "/superadmin/program", icon: Package },
    { title: "Batches", url: "/superadmin/batches", icon: Users },
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
