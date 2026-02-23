// CODO Academy Tutor Dashboard Seed Data

export interface TutorClass {
  id: string;
  subject: string;
  course: string;
  date: string;
  time: string;
  duration: string;
  meetLink: string;
  syllabusUrl: string;
  studentsEnrolled: number;
  status: "scheduled" | "live" | "completed" | "cancelled";
}

export interface TutorResource {
  id: string;
  title: string;
  subject: string;
  type: "pdf" | "video" | "drive_folder" | "link";
  url: string;
  uploadedDate: string;
  size?: string;
}

export interface TutorAssignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  deadline: string;
  totalStudents: number;
  submissions: TutorSubmission[];
  status: "active" | "closed" | "draft";
}

export interface TutorSubmission {
  id: string;
  studentName: string;
  studentId: string;
  submittedDate: string;
  status: "submitted" | "late" | "graded" | "revision";
  grade?: number;
  feedback?: string;
  fileUrl: string;
}

export interface GradebookEntry {
  id: string;
  studentName: string;
  studentId: string;
  course: string;
  attendance: number;
  quiz1: number | null;
  quiz2: number | null;
  midterm: number | null;
  project: number | null;
  final: number | null;
}

// ========== CLASSES ==========
export const tutorClasses: TutorClass[] = [
  { id: "CLS001", subject: "React Hooks Deep Dive", course: "Full Stack Web Dev", date: "2025-02-11", time: "10:00 AM", duration: "1.5 hrs", meetLink: "https://meet.google.com/abc-defg-hij", syllabusUrl: "/syllabus/react-hooks.pdf", studentsEnrolled: 14, status: "scheduled" },
  { id: "CLS002", subject: "Node.js API Design", course: "Full Stack Web Dev", date: "2025-02-11", time: "2:00 PM", duration: "2 hrs", meetLink: "https://meet.google.com/klm-nopq-rst", syllabusUrl: "/syllabus/nodejs-api.pdf", studentsEnrolled: 12, status: "scheduled" },
  { id: "CLS003", subject: "Python Data Structures", course: "Data Science Mastery", date: "2025-02-12", time: "10:00 AM", duration: "1.5 hrs", meetLink: "https://meet.google.com/uvw-xyza-bcd", syllabusUrl: "/syllabus/python-ds.pdf", studentsEnrolled: 8, status: "scheduled" },
  { id: "CLS004", subject: "Figma Prototyping", course: "UI/UX Design Pro", date: "2025-02-12", time: "3:00 PM", duration: "1 hr", meetLink: "https://meet.google.com/efg-hijk-lmn", syllabusUrl: "/syllabus/figma.pdf", studentsEnrolled: 5, status: "scheduled" },
  { id: "CLS005", subject: "MongoDB & Mongoose", course: "Full Stack Web Dev", date: "2025-02-13", time: "11:00 AM", duration: "2 hrs", meetLink: "https://meet.google.com/opq-rstu-vwx", syllabusUrl: "/syllabus/mongodb.pdf", studentsEnrolled: 14, status: "scheduled" },
  { id: "CLS006", subject: "React State Management", course: "React Advanced", date: "2025-02-10", time: "10:00 AM", duration: "1.5 hrs", meetLink: "https://meet.google.com/yza-bcde-fgh", syllabusUrl: "/syllabus/react-state.pdf", studentsEnrolled: 6, status: "completed" },
  { id: "CLS007", subject: "Pandas & NumPy Basics", course: "Data Science Mastery", date: "2025-02-10", time: "2:00 PM", duration: "1.5 hrs", meetLink: "https://meet.google.com/ijk-lmno-pqr", syllabusUrl: "/syllabus/pandas.pdf", studentsEnrolled: 8, status: "completed" },
];

// ========== RESOURCES ==========
export const tutorResources: TutorResource[] = [
  { id: "RES001", title: "React Hooks Cheat Sheet", subject: "Full Stack Web Dev", type: "pdf", url: "/materials/react-hooks.pdf", uploadedDate: "2025-02-05", size: "2.4 MB" },
  { id: "RES002", title: "Node.js REST API Tutorial", subject: "Full Stack Web Dev", type: "video", url: "https://drive.google.com/video1", uploadedDate: "2025-02-03", size: "120 MB" },
  { id: "RES003", title: "Python Data Science Notebook", subject: "Data Science Mastery", type: "pdf", url: "/materials/python-ds.pdf", uploadedDate: "2025-01-28", size: "5.1 MB" },
  { id: "RES004", title: "Figma Design System Template", subject: "UI/UX Design Pro", type: "link", url: "https://figma.com/template", uploadedDate: "2025-01-25" },
  { id: "RES005", title: "Full Stack Course Materials", subject: "Full Stack Web Dev", type: "drive_folder", url: "https://drive.google.com/folder1", uploadedDate: "2025-01-20" },
  { id: "RES006", title: "MongoDB Schema Design Guide", subject: "Full Stack Web Dev", type: "pdf", url: "/materials/mongodb-guide.pdf", uploadedDate: "2025-02-08", size: "3.8 MB" },
  { id: "RES007", title: "Machine Learning Intro Video", subject: "Data Science Mastery", type: "video", url: "https://drive.google.com/video2", uploadedDate: "2025-02-01", size: "250 MB" },
  { id: "RES008", title: "UX Research Methods", subject: "UI/UX Design Pro", type: "pdf", url: "/materials/ux-research.pdf", uploadedDate: "2025-02-06", size: "1.9 MB" },
];

// ========== ASSIGNMENTS ==========
export const tutorAssignments: TutorAssignment[] = [
  {
    id: "ASG001", title: "Build a Todo App with React Hooks", description: "Create a fully functional Todo application using useState and useEffect hooks. Include CRUD operations and local storage persistence.", subject: "Full Stack Web Dev", deadline: "2025-02-15", totalStudents: 14, status: "active",
    submissions: [
      { id: "SUB001", studentName: "Aarav Mehta", studentId: "STU001", submittedDate: "2025-02-10", status: "graded", grade: 88, feedback: "Good implementation. Consider adding error boundaries.", fileUrl: "/submissions/aarav-todo.zip" },
      { id: "SUB002", studentName: "Sneha Iyer", studentId: "STU004", submittedDate: "2025-02-11", status: "submitted", fileUrl: "/submissions/sneha-todo.zip" },
      { id: "SUB003", studentName: "Meera Bhat", studentId: "STU006", submittedDate: "2025-02-12", status: "late", fileUrl: "/submissions/meera-todo.zip" },
    ],
  },
  {
    id: "ASG002", title: "REST API with Express & MongoDB", description: "Design and implement a RESTful API with proper error handling, validation, and authentication middleware.", subject: "Full Stack Web Dev", deadline: "2025-02-20", totalStudents: 14, status: "active",
    submissions: [
      { id: "SUB004", studentName: "Aarav Mehta", studentId: "STU001", submittedDate: "2025-02-09", status: "graded", grade: 92, feedback: "Excellent error handling and clean code structure.", fileUrl: "/submissions/aarav-api.zip" },
    ],
  },
  {
    id: "ASG003", title: "EDA on Titanic Dataset", description: "Perform Exploratory Data Analysis on the Titanic dataset using Pandas. Include visualizations with Matplotlib.", subject: "Data Science Mastery", deadline: "2025-02-18", totalStudents: 8, status: "active",
    submissions: [
      { id: "SUB005", studentName: "Diya Krishnan", studentId: "STU002", submittedDate: "2025-02-08", status: "graded", grade: 95, feedback: "Outstanding analysis with insightful visualizations.", fileUrl: "/submissions/diya-eda.ipynb" },
      { id: "SUB006", studentName: "Karthik Rajan", studentId: "STU005", submittedDate: "2025-02-10", status: "submitted", fileUrl: "/submissions/karthik-eda.ipynb" },
    ],
  },
  {
    id: "ASG004", title: "Mobile App Wireframes", description: "Design wireframes for a food delivery mobile app. Include at least 5 key screens with user flow annotations.", subject: "UI/UX Design Pro", deadline: "2025-02-14", totalStudents: 5, status: "active",
    submissions: [
      { id: "SUB007", studentName: "Rohan Joshi", studentId: "STU003", submittedDate: "2025-02-11", status: "submitted", fileUrl: "/submissions/rohan-wireframes.fig" },
      { id: "SUB008", studentName: "Nisha Agarwal", studentId: "STU008", submittedDate: "2025-02-13", status: "late", fileUrl: "/submissions/nisha-wireframes.fig" },
    ],
  },
  {
    id: "ASG005", title: "React Context API Project", description: "Build a shopping cart using React Context API for state management.", subject: "React Advanced", deadline: "2025-02-08", totalStudents: 6, status: "closed",
    submissions: [
      { id: "SUB009", studentName: "Meera Bhat", studentId: "STU006", submittedDate: "2025-02-07", status: "graded", grade: 85, feedback: "Good use of Context. Could improve performance with useMemo.", fileUrl: "/submissions/meera-cart.zip" },
      { id: "SUB010", studentName: "Aditya Verma", studentId: "STU007", submittedDate: "2025-02-08", status: "graded", grade: 78, feedback: "Works well but missing some edge cases.", fileUrl: "/submissions/aditya-cart.zip" },
    ],
  },
];

// ========== GRADEBOOK ==========
export const gradebookEntries: GradebookEntry[] = [
  { id: "GB001", studentName: "Aarav Mehta", studentId: "STU001", course: "Full Stack Web Dev", attendance: 92, quiz1: 85, quiz2: 90, midterm: 88, project: 92, final: null },
  { id: "GB002", studentName: "Sneha Iyer", studentId: "STU004", course: "Full Stack Web Dev", attendance: 96, quiz1: 92, quiz2: 88, midterm: 91, project: 95, final: null },
  { id: "GB003", studentName: "Meera Bhat", studentId: "STU006", course: "React Advanced", attendance: 78, quiz1: 72, quiz2: 68, midterm: 70, project: 75, final: null },
  { id: "GB004", studentName: "Diya Krishnan", studentId: "STU002", course: "Data Science Mastery", attendance: 98, quiz1: 95, quiz2: 92, midterm: 96, project: 98, final: null },
  { id: "GB005", studentName: "Karthik Rajan", studentId: "STU005", course: "Python & AI Bootcamp", attendance: 88, quiz1: 80, quiz2: 85, midterm: 82, project: 88, final: 90 },
  { id: "GB006", studentName: "Rohan Joshi", studentId: "STU003", course: "UI/UX Design Pro", attendance: 65, quiz1: 70, quiz2: null, midterm: null, project: null, final: null },
  { id: "GB007", studentName: "Aditya Verma", studentId: "STU007", course: "Cloud & DevOps", attendance: 85, quiz1: 78, quiz2: 82, midterm: null, project: null, final: null },
  { id: "GB008", studentName: "Nisha Agarwal", studentId: "STU008", course: "Data Science Mastery", attendance: 72, quiz1: 65, quiz2: null, midterm: null, project: null, final: null },
  { id: "GB009", studentName: "Rahul Desai", studentId: "INT001", course: "Full Stack Web Dev", attendance: 90, quiz1: 82, quiz2: 86, midterm: 84, project: 88, final: null },
  { id: "GB010", studentName: "Ananya Pillai", studentId: "INT002", course: "Data Science Mastery", attendance: 75, quiz1: 68, quiz2: 72, midterm: 70, project: null, final: null },
];

// ========== TUTOR PROFILE ==========
export const tutorProfile = {
  name: "Priya Sharma",
  email: "priya.s@codo.academy",
  domain: "React Specialist",
  phone: "+91 87654 32109",
  joinedDate: "2024-02-01",
  totalClasses: 156,
  avgRating: 4.8,
  monthlySalary: 35000,
};

// ========== HELPER FUNCTIONS ==========
export const getTodaysClasses = () =>
  tutorClasses.filter((c) => c.date === "2025-02-11");

export const getActiveAssignments = () =>
  tutorAssignments.filter((a) => a.status === "active");

export const getPendingSubmissions = () =>
  tutorAssignments.flatMap((a) => a.submissions).filter((s) => s.status === "submitted" || s.status === "late");

export const getAverageAttendance = () => {
  const entries = gradebookEntries.filter((e) => e.attendance > 0);
  return Math.round(entries.reduce((sum, e) => sum + e.attendance, 0) / entries.length);
};
