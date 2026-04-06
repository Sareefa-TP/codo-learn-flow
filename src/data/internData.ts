
export interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: "Assigned" | "In Progress" | "Submitted" | "Reviewed" | "Missing" | "Late";
}

export interface Submission {
  id: string;
  taskId: string;
  taskName: string;
  fileUrl: string;
  fileName: string;
  submissionDate: string;
  status: "Pending" | "Approved" | "Rejected";
  feedback?: string;
}

export interface WeeklyReport {
  id: string;
  week: string;
  workDone: string;
  challenges: string;
  learnings: string;
  date: string;
  feedback?: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  status: "Present" | "Absent";
}

export interface Intern {
  id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  role: string;
  batch: string;
  status: "Active" | "Completed";
  joinedDate: string;
  avatar?: string;
  performance: {
    taskCompletionRate: number;
    submissionQuality: number;
    attendanceRate: number;
    overallScore: number;
    remarks?: string;
  };
}

export let INTERNS: Intern[] = [
  {
    id: "I1",
    name: "Ajay Dev",
    email: "ajay.dev@example.com",
    phone: "+91 98765 43210",
    course: "Full Stack Development",
    role: "Frontend Intern",
    batch: "Jul 2025 Evening",
    status: "Active",
    joinedDate: "2025-01-15",
    performance: {
      taskCompletionRate: 85,
      submissionQuality: 90,
      attendanceRate: 95,
      overallScore: 92,
      remarks: "Consistent performer with strong React skills."
    }
  },
  {
    id: "I2",
    name: "Riya Patel",
    email: "riya.patel@example.com",
    phone: "+91 98765 43211",
    course: "Python Data Science",
    role: "Data Analyst Intern",
    batch: "Jan 2026 Cohort",
    status: "Active",
    joinedDate: "2025-02-01",
    performance: {
      taskCompletionRate: 70,
      submissionQuality: 75,
      attendanceRate: 80,
      overallScore: 75,
    }
  },
  {
    id: "I3",
    name: "Vikram Singh",
    email: "vikram.s@example.com",
    phone: "+91 98765 43212",
    course: "Full Stack Development",
    role: "Backend Intern",
    batch: "Jul 2025 Evening",
    status: "Completed",
    joinedDate: "2024-11-01",
    performance: {
      taskCompletionRate: 100,
      submissionQuality: 95,
      attendanceRate: 100,
      overallScore: 98,
      remarks: "Exceptional backend developer, now moved to a full-time role."
    }
  }
];

export const TASKS: Record<string, Task[]> = {
  "I1": [
    { id: "T1", title: "Project Setup", description: "Initialize React app with Tailwind and Shadcn.", deadline: "2025-02-05", status: "Reviewed" },
    { id: "T2", title: "Auth Flow", description: "Implement login and signup with JWT.", deadline: "2025-02-12", status: "Submitted" },
    { id: "T3", title: "Dashboard UI", description: "Build main dashboard with grid layouts.", deadline: "2025-02-20", status: "Assigned" }
  ],
  "I2": [
    { id: "T4", title: "Data Cleaning", description: "Clean the CSV dataset for analysis.", deadline: "2025-02-10", status: "In Progress" }
  ]
};

export const SUBMISSIONS: Record<string, Submission[]> = {
  "I1": [
    { 
      id: "S1", 
      taskId: "T1", 
      taskName: "Project Setup", 
      fileUrl: "https://example.com/setup.zip", 
      fileName: "project_setup.zip", 
      submissionDate: "2025-02-04", 
      status: "Approved",
      feedback: "Great structure and clean code."
    },
    { 
      id: "S2", 
      taskId: "T2", 
      taskName: "Auth Flow", 
      fileUrl: "https://example.com/auth.zip", 
      fileName: "auth_impl.zip", 
      submissionDate: "2025-02-11", 
      status: "Pending" 
    }
  ]
};

export const REPORTS: Record<string, WeeklyReport[]> = {
  "I1": [
    { 
      id: "R1", 
      week: "Week 1", 
      workDone: "Setup development environment and basic layout.", 
      challenges: "Faced issues with Tailwind configuration.", 
      learnings: "Learned how to use Shadcn components properly.", 
      date: "2025-01-22",
      feedback: "Maintain this pace."
    },
    { 
      id: "R2", 
      week: "Week 2", 
      workDone: "Implemented Login and Sign up screens.", 
      challenges: "Handling complex form states.", 
      learnings: "Deep dived into React Hook Form.", 
      date: "2025-01-29" 
    }
  ]
};

export const ATTENDANCE: Record<string, AttendanceRecord[]> = {
  "I1": [
    { id: "A1", date: "2025-02-01", status: "Present" },
    { id: "A2", date: "2025-02-02", status: "Present" },
    { id: "A3", date: "2025-02-03", status: "Absent" },
    { id: "A4", date: "2025-02-04", status: "Present" },
    { id: "A5", date: "2025-02-05", status: "Present" }
  ]
};

export const addIntern = (newIntern: Intern) => {
  INTERNS = [newIntern, ...INTERNS];
};
