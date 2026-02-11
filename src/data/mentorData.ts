// CODO Academy Mentor Dashboard Seed Data

export interface Mentee {
  id: string;
  name: string;
  email: string;
  type: "student" | "intern";
  course: string;
  attendance: number;
  progress: number;
  status: "on-track" | "at-risk" | "ahead" | "needs-attention";
  lastActive: string;
  joinedDate: string;
}

export interface MenteeNote {
  id: string;
  menteeId: string;
  menteeName: string;
  type: "growth" | "career" | "observation" | "concern";
  content: string;
  createdDate: string;
}

export interface InternTask {
  id: string;
  internId: string;
  internName: string;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "submitted" | "approved" | "revision";
  completion: number;
  deadline: string;
  submittedDate?: string;
  feedback?: string;
}

export interface MentorNotification {
  id: string;
  type: "task" | "attendance" | "progress" | "system";
  message: string;
  menteeId?: string;
  menteeName?: string;
  timestamp: string;
  read: boolean;
}

export interface AttendanceRecord {
  menteeId: string;
  menteeName: string;
  type: "student" | "intern";
  weekly: number[];
  monthlyAvg: number;
}

// ========== MENTEES ==========
export const mentees: Mentee[] = [
  { id: "STU001", name: "Aarav Mehta", email: "aarav.m@gmail.com", type: "student", course: "Full Stack Web Dev", attendance: 92, progress: 78, status: "on-track", lastActive: "2 hours ago", joinedDate: "2025-01-10" },
  { id: "STU004", name: "Sneha Iyer", email: "sneha.i@gmail.com", type: "student", course: "Full Stack Web Dev", attendance: 96, progress: 85, status: "ahead", lastActive: "30 mins ago", joinedDate: "2024-11-20" },
  { id: "STU006", name: "Meera Bhat", email: "meera.b@gmail.com", type: "student", course: "React Advanced", attendance: 78, progress: 55, status: "needs-attention", lastActive: "3 days ago", joinedDate: "2025-01-20" },
  { id: "STU002", name: "Diya Krishnan", email: "diya.k@gmail.com", type: "student", course: "Data Science Mastery", attendance: 98, progress: 92, status: "ahead", lastActive: "1 hour ago", joinedDate: "2025-01-15" },
  { id: "INT001", name: "Rahul Desai", email: "rahul.d@gmail.com", type: "intern", course: "Full Stack Internship", attendance: 90, progress: 72, status: "on-track", lastActive: "4 hours ago", joinedDate: "2025-01-05" },
  { id: "INT002", name: "Ananya Pillai", email: "ananya.p@gmail.com", type: "intern", course: "Data Science Internship", attendance: 75, progress: 45, status: "at-risk", lastActive: "2 days ago", joinedDate: "2025-01-10" },
  { id: "INT003", name: "Varun Choudhary", email: "varun.c@gmail.com", type: "intern", course: "UI/UX Internship", attendance: 94, progress: 88, status: "ahead", lastActive: "1 hour ago", joinedDate: "2024-12-15" },
  { id: "INT005", name: "Siddharth Rao", email: "sid.r@gmail.com", type: "intern", course: "Backend Internship", attendance: 68, progress: 35, status: "at-risk", lastActive: "5 days ago", joinedDate: "2025-01-20" },
];

// ========== MENTEE NOTES ==========
export const menteeNotes: MenteeNote[] = [
  { id: "NOTE001", menteeId: "STU002", menteeName: "Diya Krishnan", type: "growth", content: "Excellent progress on ML project. Ready for advanced deep learning topics. Consider recommending for TA role.", createdDate: "2025-02-10" },
  { id: "NOTE002", menteeId: "STU006", menteeName: "Meera Bhat", type: "concern", content: "Attendance has dropped below 80%. Needs additional support with React hooks. Scheduled a 1:1 session.", createdDate: "2025-02-09" },
  { id: "NOTE003", menteeId: "INT002", menteeName: "Ananya Pillai", type: "concern", content: "Task completion at 45%. Struggling with data pipeline setup. Paired with senior intern for guidance.", createdDate: "2025-02-08" },
  { id: "NOTE004", menteeId: "STU001", menteeName: "Aarav Mehta", type: "career", content: "Interested in full-stack roles post course. Recommended building portfolio projects and contributing to open source.", createdDate: "2025-02-07" },
  { id: "NOTE005", menteeId: "INT003", menteeName: "Varun Choudhary", type: "growth", content: "Outstanding UX research skills. Design quality improving rapidly. Strong candidate for full-time conversion.", createdDate: "2025-02-06" },
  { id: "NOTE006", menteeId: "INT005", menteeName: "Siddharth Rao", type: "concern", content: "Low engagement and attendance. 1:1 revealed personal issues. Adjusted deadlines by 1 week.", createdDate: "2025-02-05" },
  { id: "NOTE007", menteeId: "STU004", menteeName: "Sneha Iyer", type: "observation", content: "Helping peers in study group. Leadership qualities emerging. Consider for mentorship program next batch.", createdDate: "2025-02-04" },
];

// ========== INTERN TASKS ==========
export const internTasks: InternTask[] = [
  { id: "TASK001", internId: "INT001", internName: "Rahul Desai", title: "Build REST API for User Module", description: "Create Express.js API with JWT auth, CRUD endpoints for user management, and input validation.", status: "submitted", completion: 85, deadline: "2025-02-14", submittedDate: "2025-02-11", feedback: "" },
  { id: "TASK002", internId: "INT001", internName: "Rahul Desai", title: "Database Schema Design", description: "Design MongoDB schema for the e-commerce platform with proper indexing.", status: "approved", completion: 100, deadline: "2025-02-08", submittedDate: "2025-02-07", feedback: "Well-structured schema. Good use of embedded documents." },
  { id: "TASK003", internId: "INT002", internName: "Ananya Pillai", title: "Data Pipeline Setup", description: "Set up ETL pipeline using Python for processing CSV data into structured format.", status: "in_progress", completion: 45, deadline: "2025-02-16" },
  { id: "TASK004", internId: "INT002", internName: "Ananya Pillai", title: "Visualization Dashboard", description: "Create interactive data visualizations using Plotly for sales analytics.", status: "pending", completion: 0, deadline: "2025-02-22" },
  { id: "TASK005", internId: "INT003", internName: "Varun Choudhary", title: "Mobile App Redesign", description: "Redesign the checkout flow for the food delivery app with improved UX.", status: "submitted", completion: 95, deadline: "2025-02-12", submittedDate: "2025-02-10" },
  { id: "TASK006", internId: "INT003", internName: "Varun Choudhary", title: "Design System Components", description: "Create a reusable component library in Figma following atomic design principles.", status: "in_progress", completion: 60, deadline: "2025-02-20" },
  { id: "TASK007", internId: "INT005", internName: "Siddharth Rao", title: "API Testing Suite", description: "Write comprehensive test cases for the payment gateway API using Jest.", status: "in_progress", completion: 30, deadline: "2025-02-18" },
  { id: "TASK008", internId: "INT005", internName: "Siddharth Rao", title: "CI/CD Pipeline Setup", description: "Configure GitHub Actions for automated testing and deployment.", status: "pending", completion: 0, deadline: "2025-02-25" },
];

// ========== ACTIVITY LOG ==========
export const mentorActivityLog: MentorNotification[] = [
  { id: "MACT001", type: "task", message: "Rahul Desai submitted 'Build REST API for User Module'", menteeId: "INT001", menteeName: "Rahul Desai", timestamp: "2025-02-11 14:30", read: false },
  { id: "MACT002", type: "task", message: "Varun Choudhary submitted 'Mobile App Redesign'", menteeId: "INT003", menteeName: "Varun Choudhary", timestamp: "2025-02-10 16:45", read: false },
  { id: "MACT003", type: "attendance", message: "Meera Bhat attendance dropped below 80%", menteeId: "STU006", menteeName: "Meera Bhat", timestamp: "2025-02-10 09:00", read: true },
  { id: "MACT004", type: "progress", message: "Diya Krishnan completed Module 8 of Data Science", menteeId: "STU002", menteeName: "Diya Krishnan", timestamp: "2025-02-09 11:20", read: true },
  { id: "MACT005", type: "attendance", message: "Siddharth Rao absent for 3 consecutive days", menteeId: "INT005", menteeName: "Siddharth Rao", timestamp: "2025-02-08 10:00", read: true },
  { id: "MACT006", type: "task", message: "Ananya Pillai started 'Data Pipeline Setup'", menteeId: "INT002", menteeName: "Ananya Pillai", timestamp: "2025-02-07 15:30", read: true },
  { id: "MACT007", type: "progress", message: "Sneha Iyer achieved 95% quiz score", menteeId: "STU004", menteeName: "Sneha Iyer", timestamp: "2025-02-07 12:00", read: true },
  { id: "MACT008", type: "system", message: "Monthly progress reports due in 3 days", timestamp: "2025-02-08 08:00", read: false },
];

// ========== ATTENDANCE HEATMAP ==========
export const attendanceRecords: AttendanceRecord[] = [
  { menteeId: "STU001", menteeName: "Aarav Mehta", type: "student", weekly: [100, 80, 100, 100, 80], monthlyAvg: 92 },
  { menteeId: "STU004", menteeName: "Sneha Iyer", type: "student", weekly: [100, 100, 100, 80, 100], monthlyAvg: 96 },
  { menteeId: "STU006", menteeName: "Meera Bhat", type: "student", weekly: [80, 60, 80, 100, 60], monthlyAvg: 78 },
  { menteeId: "STU002", menteeName: "Diya Krishnan", type: "student", weekly: [100, 100, 100, 100, 80], monthlyAvg: 98 },
  { menteeId: "INT001", menteeName: "Rahul Desai", type: "intern", weekly: [100, 80, 100, 80, 100], monthlyAvg: 90 },
  { menteeId: "INT002", menteeName: "Ananya Pillai", type: "intern", weekly: [80, 60, 80, 60, 80], monthlyAvg: 75 },
  { menteeId: "INT003", menteeName: "Varun Choudhary", type: "intern", weekly: [100, 100, 80, 100, 100], monthlyAvg: 94 },
  { menteeId: "INT005", menteeName: "Siddharth Rao", type: "intern", weekly: [60, 40, 80, 60, 60], monthlyAvg: 68 },
];

// ========== MENTOR PROFILE ==========
export const mentorProfile = {
  name: "Deepa Nair",
  email: "deepa.n@codo.academy",
  domain: "UI/UX Lead",
  phone: "+91 65432 10987",
  joinedDate: "2024-01-20",
  totalMentees: 8,
  monthlySalary: 28000,
};

// ========== HELPER FUNCTIONS ==========
export const getMenteesByType = (type: Mentee["type"]) =>
  mentees.filter((m) => m.type === type);

export const getAtRiskMentees = () =>
  mentees.filter((m) => m.status === "at-risk" || m.status === "needs-attention");

export const getPendingTaskReviews = () =>
  internTasks.filter((t) => t.status === "submitted");

export const getUnreadNotifications = () =>
  mentorActivityLog.filter((n) => !n.read);

export const getAttendanceAlerts = () =>
  attendanceRecords.filter((a) => a.monthlyAvg < 80);
