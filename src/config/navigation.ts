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
  Plus,
  PieChart,
  ScrollText,
  UserCog,
  Layers,
  ChevronDown,
  Gamepad2,
  LifeBuoy,
  PencilLine,
  History,
  Star,
} from "lucide-react";

export type UserRole = "student" | "intern" | "tutor" | "mentor" | "admin" | "finance" | "superadmin" | "coordinator" | "advisor";

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
    { title: "Courses", url: "/student/courses", icon: Layers },
    { title: "Meet", url: "/student/meet", icon: Video },
    { title: "Webinar", url: "/student/webinar", icon: Video },
    { title: "Chat", url: "/student/chat", icon: MessageSquare },
    { title: "Payments", url: "/student/wallet", icon: CreditCard },
    { title: "Exam", url: "/student/exam", icon: PencilLine },
    { title: "Certificate", url: "/student/certificates", icon: Award },
    { title: "Support Tickets", url: "/student/support-tickets", icon: LifeBuoy },
    { title: "Game", url: "/student/game", icon: Gamepad2 },
    { title: "Feedback", url: "/student/feedback", icon: MessageSquare },
    {
      title: "My Courses",
      url: "/student/my-course",
      icon: BookOpen,
      children: [
        { title: "Live Sessions", url: "/student/live-sessions", icon: Video },
        { title: "Learning Materials", url: "/student/materials", icon: FileText },
        { title: "Assignments", url: "/student/assignments", icon: ClipboardList },
      ]
    },
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
    { title: "Meet", url: "/intern/meet", icon: Video },
    { title: "Materials", url: "/intern/materials", icon: BookOpen },
    { title: "Task", url: "/intern/tasks", icon: ListTodo },
    { title: "Progress", url: "/intern/progress", icon: TrendingUp },
    { title: "Weekly Report", url: "/intern/weekly-report", icon: FileText },
    { title: "Support Ticket", url: "/intern/support-ticket", icon: LifeBuoy },
    { title: "Chat", url: "/intern/chat", icon: MessageSquare },
    { title: "Certificates", url: "/intern/certificates", icon: Award },
    { title: "Placement Update", url: "/intern/placement-updates", icon: Briefcase },
    { title: "Feedback", url: "/intern/feedback", icon: MessageSquare },
    { title: "Attendance", url: "/intern/attendance", icon: UserCheck },
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
    { title: "Chat", url: "/tutor/chat", icon: MessageSquare },
    { title: "Feedback", url: "/tutor/feedback", icon: MessageSquare },
    { title: "Assignments", url: "/tutor/assignments", icon: ClipboardList },
    { title: "Announcements", url: "/tutor/announcements", icon: Bell },
    { title: "Learning Materials", url: "/tutor/materials", icon: FileText },
    { title: "Support Ticket", url: "/tutor/support-ticket", icon: LifeBuoy },
    { title: "Wallet", url: "/tutor/wallet", icon: Wallet },
    { title: "Students", url: "/tutor/students", icon: Users },
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
    { title: "Meet", url: "/mentor/meet", icon: Video },
    {
      title: "My Batches",
      url: "#",
      icon: BookOpen,
      children: [
        { title: "Tutors", url: "/mentor/my-batches/tutors", icon: GraduationCap },
        { title: "Students", url: "/mentor/my-batches/students", icon: GraduationCap },
        { title: "Live Sessions", url: "/mentor/my-batches/live-sessions", icon: Video },
      ]
    },
    { title: "Feedback", url: "/mentor/feedback", icon: MessageSquare },
    { title: "Chat", url: "/mentor/chat", icon: MessageSquare },
    { title: "Support Ticket", url: "/mentor/support-ticket", icon: LifeBuoy },
    {
      title: "Intern",
      url: "#",
      icon: Briefcase,
      children: [
        { title: "Interns", url: "/mentor/interns", icon: Briefcase },
        { title: "Tasks", url: "/mentor/tasks", icon: ListTodo },
        { title: "Task Reviews", url: "/mentor/task-reviews", icon: ClipboardList },
        { title: "Weekly Reports", url: "/mentor/weekly-reports", icon: FileText },
        { title: "Attendance", url: "/mentor/attendance", icon: UserCheck },
        { title: "Performance", url: "/mentor/performance", icon: TrendingUp },
      ]
    },
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
    { title: "Tutors", url: "/admin/tutor", icon: BookOpen },
    { title: "Mentors", url: "/admin/mentor", icon: Users },
    { title: "Course", url: "/admin/courses", icon: Package },
    { title: "Batch", url: "/admin/batch", icon: Layers },
    { title: "Meet", url: "/admin/meet", icon: Video },
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

// Coordinator Navigation - Focus: management and monitoring
export const coordinatorNavigation: RoleNavigation = {
  role: "coordinator",
  label: "Coordinator",
  baseUrl: "/coordinator",
  mainNav: [
    { title: "Dashboard", url: "/coordinator/dashboard", icon: LayoutDashboard },
    { title: "Meet", url: "/coordinator/meet", icon: Video },
    { title: "Interns", url: "/coordinator/interns", icon: Briefcase },
    { title: "Tasks", url: "/coordinator/tasks", icon: ListTodo },
    { title: "Task Reviews", url: "/coordinator/task-reviews", icon: ClipboardList },
    { title: "Weekly Reports", url: "/coordinator/weekly-reports", icon: FileText },
    { title: "Attendance", url: "/coordinator/attendance", icon: UserCheck },
    { title: "Performance", url: "/coordinator/progress", icon: TrendingUp },
    { title: "Chat", url: "/coordinator/chat", icon: MessageSquare },
    { title: "Feedback", url: "/coordinator/feedback", icon: MessageSquare },
    { title: "Support Ticket", url: "/coordinator/support-ticket", icon: LifeBuoy },
  ],
  secondaryNav: [],
};

// Advisor Navigation - Focus: leads, sales, and student guidance
export const advisorNavigation: RoleNavigation = {
  role: "advisor",
  label: "Advisor",
  baseUrl: "/advisor",
  mainNav: [
    { title: "Dashboard", url: "/advisor/dashboard", icon: LayoutDashboard },
    { title: "Leads", url: "/advisor/leads", icon: Users },
    { title: "Students", url: "/advisor/students", icon: GraduationCap },
    { title: "Courses", url: "/advisor/courses", icon: BookOpen },
    { title: "Follow-ups", url: "/advisor/follow-ups", icon: History },
    { title: "Meet", url: "/advisor/meet", icon: Video },
    { title: "Chat", url: "/advisor/chat", icon: MessageSquare },
    { title: "Support Ticket", url: "/advisor/support-ticket", icon: LifeBuoy },
    { title: "Feedback", url: "/advisor/feedback", icon: Star },
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
    case "coordinator":
      return coordinatorNavigation;
    case "advisor":
      return advisorNavigation;
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
  coordinator: { label: "Coordinator", color: "bg-role-coordinator" },
  advisor: { label: "Advisor", color: "bg-role-advisor" },
};
