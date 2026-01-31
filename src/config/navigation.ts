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

// Get navigation config by role
export const getNavigationByRole = (role: UserRole): RoleNavigation => {
  switch (role) {
    case "student":
      return studentNavigation;
    case "intern":
      return internNavigation;
    case "tutor":
      return tutorNavigation;
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
