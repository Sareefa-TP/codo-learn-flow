// CODO Academy Super Admin Seed Data

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: "admin" | "tutor" | "mentor";
  status: "active" | "inactive";
  joinedDate: string;
  domain?: string;
  phone: string;
  assignedStudents?: number;
}

export interface StudentRecord {
  id: string;
  name: string;
  email: string;
  type: "student" | "intern";
  status: "demo_pending" | "active" | "completed" | "dropped";
  course: string;
  joinedDate: string;
  phone: string;
  mentorId: string | null;
  stipendStatus?: "paid" | "unpaid" | "partial";
  taskCompletion?: number;
  feePaid: number;
  feeTotal: number;
}

export interface CoursePackage {
  id: string;
  name: string;
  duration: string;
  fee: number;
  tutorId: string;
  syllabusUrl: string;
  driveId: string;
  studentsEnrolled: number;
  status: "active" | "draft" | "archived";
}

export interface Transaction {
  id: string;
  type: "student_fee" | "stipend" | "tutor_salary" | "mentor_salary" | "wallet_topup" | "course_purchase";
  description: string;
  amount: number;
  direction: "credit" | "debit";
  status: "paid" | "pending" | "overdue" | "approved";
  date: string;
  entityName: string;
  entityId: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  type: "user" | "finance" | "course" | "system";
}

export interface IntegrationStatus {
  id: string;
  name: string;
  provider: "google_meet" | "google_drive" | "razorpay" | "whatsapp";
  status: "connected" | "disconnected" | "error";
  lastSync?: string;
  apiKeySet: boolean;
}

export interface CertificateTemplate {
  id: string;
  name: string;
  course: string;
  layout: "landscape" | "portrait";
  borderStyle: string;
  logoPosition: "top-left" | "center" | "top-right";
  signatory: string;
}

// ========== STAFF DATA ==========
export const staffMembers: StaffMember[] = [
  { id: "S001", name: "Rajesh Kumar", email: "rajesh.k@codo.academy", role: "admin", status: "active", joinedDate: "2024-01-15", phone: "+91 98765 43210" },
  { id: "S002", name: "Priya Sharma", email: "priya.s@codo.academy", role: "tutor", status: "active", joinedDate: "2024-02-01", domain: "React Specialist", phone: "+91 87654 32109", assignedStudents: 12 },
  { id: "S003", name: "Arun Patel", email: "arun.p@codo.academy", role: "tutor", status: "active", joinedDate: "2024-03-10", domain: "Data Science Lead", phone: "+91 76543 21098", assignedStudents: 8 },
  { id: "S004", name: "Deepa Nair", email: "deepa.n@codo.academy", role: "mentor", status: "active", joinedDate: "2024-01-20", domain: "UI/UX Lead", phone: "+91 65432 10987", assignedStudents: 6 },
  { id: "S005", name: "Vikram Singh", email: "vikram.s@codo.academy", role: "mentor", status: "active", joinedDate: "2024-04-05", domain: "Backend Architect", phone: "+91 54321 09876", assignedStudents: 5 },
  { id: "S006", name: "Kavitha Reddy", email: "kavitha.r@codo.academy", role: "tutor", status: "inactive", joinedDate: "2023-11-15", domain: "Python Expert", phone: "+91 43210 98765", assignedStudents: 0 },
  { id: "S007", name: "Suresh Menon", email: "suresh.m@codo.academy", role: "admin", status: "active", joinedDate: "2024-05-01", phone: "+91 32109 87654" },
  { id: "S008", name: "Anjali Gupta", email: "anjali.g@codo.academy", role: "tutor", status: "active", joinedDate: "2024-06-15", domain: "Full Stack Dev", phone: "+91 21098 76543", assignedStudents: 10 },
];

// ========== STUDENT & INTERN DATA ==========
export const studentRecords: StudentRecord[] = [
  { id: "STU001", name: "Aarav Mehta", email: "aarav.m@gmail.com", type: "student", status: "active", course: "Full Stack Web Dev", joinedDate: "2025-01-10", phone: "+91 99887 76655", mentorId: "S004", feePaid: 25000, feeTotal: 45000 },
  { id: "STU002", name: "Diya Krishnan", email: "diya.k@gmail.com", type: "student", status: "active", course: "Data Science Mastery", joinedDate: "2025-01-15", phone: "+91 88776 65544", mentorId: "S005", feePaid: 45000, feeTotal: 45000 },
  { id: "STU003", name: "Rohan Joshi", email: "rohan.j@gmail.com", type: "student", status: "demo_pending", course: "UI/UX Design Pro", joinedDate: "2025-02-01", phone: "+91 77665 54433", mentorId: null, feePaid: 0, feeTotal: 35000 },
  { id: "STU004", name: "Sneha Iyer", email: "sneha.i@gmail.com", type: "student", status: "active", course: "Full Stack Web Dev", joinedDate: "2024-11-20", phone: "+91 66554 43322", mentorId: "S004", feePaid: 45000, feeTotal: 45000 },
  { id: "STU005", name: "Karthik Rajan", email: "karthik.r@gmail.com", type: "student", status: "completed", course: "Python & AI Bootcamp", joinedDate: "2024-06-01", phone: "+91 55443 32211", mentorId: "S005", feePaid: 40000, feeTotal: 40000 },
  { id: "STU006", name: "Meera Bhat", email: "meera.b@gmail.com", type: "student", status: "active", course: "React Advanced", joinedDate: "2025-01-20", phone: "+91 44332 21100", mentorId: "S004", feePaid: 15000, feeTotal: 38000 },
  { id: "INT001", name: "Rahul Desai", email: "rahul.d@gmail.com", type: "intern", status: "active", course: "Full Stack Internship", joinedDate: "2025-01-05", phone: "+91 99001 12233", mentorId: "S005", stipendStatus: "paid", taskCompletion: 72, feePaid: 0, feeTotal: 0 },
  { id: "INT002", name: "Ananya Pillai", email: "ananya.p@gmail.com", type: "intern", status: "active", course: "Data Science Internship", joinedDate: "2025-01-10", phone: "+91 88112 23344", mentorId: "S005", stipendStatus: "unpaid", taskCompletion: 45, feePaid: 0, feeTotal: 0 },
  { id: "INT003", name: "Varun Choudhary", email: "varun.c@gmail.com", type: "intern", status: "active", course: "UI/UX Internship", joinedDate: "2024-12-15", phone: "+91 77223 34455", mentorId: "S004", stipendStatus: "paid", taskCompletion: 88, feePaid: 0, feeTotal: 0 },
  { id: "INT004", name: "Pooja Hegde", email: "pooja.h@gmail.com", type: "intern", status: "completed", course: "Full Stack Internship", joinedDate: "2024-08-01", phone: "+91 66334 45566", mentorId: "S005", stipendStatus: "paid", taskCompletion: 100, feePaid: 0, feeTotal: 0 },
  { id: "STU007", name: "Aditya Verma", email: "aditya.v@gmail.com", type: "student", status: "active", course: "Cloud & DevOps", joinedDate: "2025-02-01", phone: "+91 55445 56677", mentorId: null, feePaid: 10000, feeTotal: 42000 },
  { id: "STU008", name: "Nisha Agarwal", email: "nisha.a@gmail.com", type: "student", status: "demo_pending", course: "Data Science Mastery", joinedDate: "2025-02-05", phone: "+91 44556 67788", mentorId: null, feePaid: 0, feeTotal: 45000 },
  { id: "INT005", name: "Siddharth Rao", email: "sid.r@gmail.com", type: "intern", status: "active", course: "Backend Internship", joinedDate: "2025-01-20", phone: "+91 33667 78899", mentorId: "S005", stipendStatus: "partial", taskCompletion: 35, feePaid: 0, feeTotal: 0 },
];

// ========== COURSE PACKAGES ==========
export const coursePackages: CoursePackage[] = [
  { id: "CRS001", name: "Full Stack Web Dev", duration: "6 months", fee: 45000, tutorId: "S002", syllabusUrl: "/syllabus/fullstack.pdf", driveId: "1abc_FullStack", studentsEnrolled: 14, status: "active" },
  { id: "CRS002", name: "Data Science Mastery", duration: "4 months", fee: 45000, tutorId: "S003", syllabusUrl: "/syllabus/datascience.pdf", driveId: "1def_DataSci", studentsEnrolled: 8, status: "active" },
  { id: "CRS003", name: "UI/UX Design Pro", duration: "3 months", fee: 35000, tutorId: "S008", syllabusUrl: "/syllabus/uiux.pdf", driveId: "1ghi_UIUX", studentsEnrolled: 5, status: "active" },
  { id: "CRS004", name: "Python & AI Bootcamp", duration: "5 months", fee: 40000, tutorId: "S003", syllabusUrl: "/syllabus/python-ai.pdf", driveId: "1jkl_Python", studentsEnrolled: 3, status: "active" },
  { id: "CRS005", name: "React Advanced", duration: "2 months", fee: 38000, tutorId: "S002", syllabusUrl: "/syllabus/react.pdf", driveId: "1mno_React", studentsEnrolled: 6, status: "active" },
  { id: "CRS006", name: "Cloud & DevOps", duration: "4 months", fee: 42000, tutorId: "S008", syllabusUrl: "/syllabus/devops.pdf", driveId: "1pqr_DevOps", studentsEnrolled: 4, status: "draft" },
  { id: "CRS007", name: "Mobile App Development", duration: "5 months", fee: 48000, tutorId: "S002", syllabusUrl: "/syllabus/mobile.pdf", driveId: "1stu_Mobile", studentsEnrolled: 0, status: "draft" },
];

// ========== TRANSACTIONS ==========
export const transactions: Transaction[] = [
  { id: "TXN001", type: "student_fee", description: "Course fee - Full Stack Web Dev", amount: 25000, direction: "credit", status: "paid", date: "2025-01-10", entityName: "Aarav Mehta", entityId: "STU001" },
  { id: "TXN002", type: "student_fee", description: "Course fee - Data Science Mastery", amount: 45000, direction: "credit", status: "paid", date: "2025-01-15", entityName: "Diya Krishnan", entityId: "STU002" },
  { id: "TXN003", type: "tutor_salary", description: "January salary - Priya Sharma", amount: 35000, direction: "debit", status: "paid", date: "2025-01-31", entityName: "Priya Sharma", entityId: "S002" },
  { id: "TXN004", type: "tutor_salary", description: "January salary - Arun Patel", amount: 32000, direction: "debit", status: "paid", date: "2025-01-31", entityName: "Arun Patel", entityId: "S003" },
  { id: "TXN005", type: "mentor_salary", description: "January salary - Deepa Nair", amount: 28000, direction: "debit", status: "paid", date: "2025-01-31", entityName: "Deepa Nair", entityId: "S004" },
  { id: "TXN006", type: "mentor_salary", description: "January salary - Vikram Singh", amount: 30000, direction: "debit", status: "pending", date: "2025-02-05", entityName: "Vikram Singh", entityId: "S005" },
  { id: "TXN007", type: "stipend", description: "January stipend - Rahul Desai", amount: 8000, direction: "debit", status: "paid", date: "2025-01-31", entityName: "Rahul Desai", entityId: "INT001" },
  { id: "TXN008", type: "stipend", description: "January stipend - Ananya Pillai", amount: 8000, direction: "debit", status: "overdue", date: "2025-01-31", entityName: "Ananya Pillai", entityId: "INT002" },
  { id: "TXN009", type: "student_fee", description: "Course fee - Full Stack Web Dev", amount: 45000, direction: "credit", status: "paid", date: "2024-11-20", entityName: "Sneha Iyer", entityId: "STU004" },
  { id: "TXN010", type: "student_fee", description: "Course fee - React Advanced", amount: 15000, direction: "credit", status: "pending", date: "2025-01-20", entityName: "Meera Bhat", entityId: "STU006" },
  { id: "TXN011", type: "wallet_topup", description: "Wallet top-up", amount: 5000, direction: "credit", status: "paid", date: "2025-01-25", entityName: "Aarav Mehta", entityId: "STU001" },
  { id: "TXN012", type: "course_purchase", description: "Course purchase - Cloud & DevOps", amount: 10000, direction: "credit", status: "pending", date: "2025-02-01", entityName: "Aditya Verma", entityId: "STU007" },
  { id: "TXN013", type: "stipend", description: "January stipend - Varun Choudhary", amount: 8000, direction: "debit", status: "paid", date: "2025-01-31", entityName: "Varun Choudhary", entityId: "INT003" },
  { id: "TXN014", type: "tutor_salary", description: "January salary - Anjali Gupta", amount: 33000, direction: "debit", status: "approved", date: "2025-01-31", entityName: "Anjali Gupta", entityId: "S008" },
  { id: "TXN015", type: "student_fee", description: "Course fee - UI/UX Design Pro", amount: 35000, direction: "credit", status: "overdue", date: "2025-02-01", entityName: "Rohan Joshi", entityId: "STU003" },
];

// ========== ACTIVITY LOGS ==========
export const activityLogs: ActivityLog[] = [
  { id: "ACT001", action: "New student registered", user: "Aditya Verma", timestamp: "2025-02-01 14:30", type: "user" },
  { id: "ACT002", action: "Tutor salary processed", user: "System", timestamp: "2025-01-31 18:00", type: "finance" },
  { id: "ACT003", action: "New course published: Cloud & DevOps", user: "Rajesh Kumar", timestamp: "2025-01-28 10:15", type: "course" },
  { id: "ACT004", action: "Intern stipend payment failed", user: "System", timestamp: "2025-01-31 18:05", type: "finance" },
  { id: "ACT005", action: "Google Meet integration updated", user: "Rajesh Kumar", timestamp: "2025-01-27 09:30", type: "system" },
  { id: "ACT006", action: "Student completed course", user: "Karthik Rajan", timestamp: "2025-01-25 16:00", type: "user" },
  { id: "ACT007", action: "Certificate issued", user: "System", timestamp: "2025-01-25 16:05", type: "system" },
  { id: "ACT008", action: "Demo class scheduled", user: "Nisha Agarwal", timestamp: "2025-02-05 11:00", type: "user" },
  { id: "ACT009", action: "Fee payment received ₹15,000", user: "Meera Bhat", timestamp: "2025-01-20 13:45", type: "finance" },
  { id: "ACT010", action: "Mentor assigned to intern", user: "Vikram Singh → Siddharth Rao", timestamp: "2025-01-20 10:00", type: "user" },
];

// ========== INTEGRATION STATUS ==========
export const integrations: IntegrationStatus[] = [
  { id: "INT_GM", name: "Google Meet", provider: "google_meet", status: "connected", lastSync: "2025-02-01 09:00", apiKeySet: true },
  { id: "INT_GD", name: "Google Drive", provider: "google_drive", status: "connected", lastSync: "2025-02-01 09:05", apiKeySet: true },
  { id: "INT_RP", name: "Razorpay", provider: "razorpay", status: "disconnected", apiKeySet: false },
  { id: "INT_WA", name: "WhatsApp Business", provider: "whatsapp", status: "error", lastSync: "2025-01-28 14:00", apiKeySet: true },
];

// ========== CERTIFICATE TEMPLATES ==========
export const certificateTemplates: CertificateTemplate[] = [
  { id: "CERT001", name: "Course Completion", course: "All Courses", layout: "landscape", borderStyle: "gold-ornate", logoPosition: "top-left", signatory: "Rajesh Kumar, Director" },
  { id: "CERT002", name: "Internship Completion", course: "All Internships", layout: "landscape", borderStyle: "modern-blue", logoPosition: "center", signatory: "Rajesh Kumar, Director" },
  { id: "CERT003", name: "Excellence Award", course: "Special Recognition", layout: "portrait", borderStyle: "minimal", logoPosition: "top-right", signatory: "Priya Sharma, Head of Academics" },
];

// ========== FINANCIAL CHART DATA ==========
export const financialChartData = [
  { month: "Sep 24", studentFees: 185000, tutorSalaries: 95000, mentorSalaries: 55000, stipends: 24000 },
  { month: "Oct 24", studentFees: 210000, tutorSalaries: 100000, mentorSalaries: 58000, stipends: 24000 },
  { month: "Nov 24", studentFees: 195000, tutorSalaries: 100000, mentorSalaries: 58000, stipends: 32000 },
  { month: "Dec 24", studentFees: 160000, tutorSalaries: 100000, mentorSalaries: 58000, stipends: 32000 },
  { month: "Jan 25", studentFees: 245000, tutorSalaries: 100000, mentorSalaries: 58000, stipends: 24000 },
  { month: "Feb 25", studentFees: 120000, tutorSalaries: 100000, mentorSalaries: 58000, stipends: 24000 },
];

// ========== HELPER FUNCTIONS ==========
export const getStaffByRole = (role: StaffMember["role"]) =>
  staffMembers.filter((s) => s.role === role);

export const getStudentsByType = (type: StudentRecord["type"]) =>
  studentRecords.filter((s) => s.type === type);

export const getTutorName = (id: string) =>
  staffMembers.find((s) => s.id === id)?.name ?? "Unassigned";

export const getMentorName = (id: string | null) =>
  id ? staffMembers.find((s) => s.id === id)?.name ?? "Unassigned" : "Unassigned";

export const getWalletBalance = () => {
  const credits = transactions.filter((t) => t.direction === "credit").reduce((a, t) => a + t.amount, 0);
  const debits = transactions.filter((t) => t.direction === "debit").reduce((a, t) => a + t.amount, 0);
  return { credits, debits, balance: credits - debits };
};
