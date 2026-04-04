import { SHARED_BATCHES } from "./batchData";

export interface Note {
  id: string;
  title: string;
  type: "PDF" | "Text" | "Link";
  content: string; // URL or content text
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  attachmentUrl?: string;
}

export interface Lesson {
  id: string;
  title: string;
  videoUrl: string;
}

export interface LiveClass {
  id: string;
  title?: string;
  scheduledAt: string;
  duration: string;
  meetingLink?: string;
  status: "Scheduled" | "Live" | "Completed" | "Cancelled";
}

export interface Recording {
  id: string;
  url: string;
  duration?: string;
  fileSize?: string;
}

export interface Session {
  id: string;
  name: string;
  // REQUIRED FIELDS (SESSION INCLUDES ALL 5 SECTIONS)
  liveClass: LiveClass | null; // Null if not scheduled
  notes: Note[];
  assignments: Assignment[];
  lessons: Lesson[];
  recording: Recording | null; // Null if not available
  slug: string; // URL-safe identifier
  
  // Backward compatibility (optional)
  type?: "Live" | "Video" | "Assignment" | "Quiz";
  duration?: string;
}

export interface Module {
  id: string;
  name: string;
  slug: string; // URL-safe identifier
  description?: string;
  sessions: Session[];
}

export interface Course {
  id: string;
  name: string;
  description: string;
  category: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  status: "Draft" | "Published";
  thumbnail?: string;
  createdDate: string;
  modules: Module[];
  totalStudents: number;
  totalBatches: number;
  // NEW ASSIGNMENT & SCHEDULE FIELDS
  tutors: string[];
  mentors: string[];
  students: string[];
  batches: string[];
  startDate?: string;
  endDate?: string;
}

export interface CourseStudent {
  id: string;
  name: string;
  email: string;
  progress: number;
  joinedDate: string;
}

export interface CourseTutor {
  id: string;
  name: string;
  email: string;
  status: string;
  joinedDate: string;
}

export interface CourseMentor {
  id: string;
  name: string;
  email: string;
  status: string;
  joinedDate: string;
}

/**
 * ADMIN PERMISSION NOTICE:
 * The Admin role must maintain UNRESTRICTED control over all course attributes
 * (metadata, modules, sessions, tutors, mentors, and batches) regardless 
 * of whether the course is in 'Draft' or 'Published' status.
 */

export const courses: Course[] = [
  {
    id: "C-001",
    name: "Full Stack Web Development",
    description: "A comprehensive program covering React, Node.js, and modern web architecture.",
    category: "Web Development",
    duration: "12 Weeks",
    level: "Intermediate",
    status: "Published",
    createdDate: "15 Jan 2025",
    totalStudents: 124,
    totalBatches: 3,
    tutors: ["T1", "T3"],
    mentors: ["M1"],
    students: ["S1", "S2", "S3"],
    batches: ["B-001"],
    startDate: "2025-01-15",
    endDate: "2025-04-15",
    modules: [
      {
        id: "M-1",
        name: "Introduction to React & State Management",
        slug: "react-intro",
        sessions: [
          { 
            id: "S-1-1", 
            name: "React Fundamentals & JSX", 
            slug: "fundamentals-jsx",
            liveClass: { id: "LC-1", scheduledAt: "2026-04-10T10:00:00Z", duration: "90 min", status: "Scheduled", meetingLink: "https://meet.google.com/abc-defg-hij" },
            notes: [
              { id: "N-1", title: "React Basics PDF", type: "PDF", content: "/files/react-basics.pdf" }
            ],
            assignments: [
              { id: "A-1", title: "Counter App", description: "Use useState to create a functional counter." }
            ],
            lessons: [
              { id: "L-1", title: "Virtual DOM Explained", videoUrl: "https://vimeo.com/76543210" }
            ],
            recording: { id: "R-1", url: "https://vimeo.com/recording-sample-1", fileSize: "1.2 GB" }
          },
          { 
            id: "S-1-2", 
            name: "State & Props Deep Dive", 
            slug: "state-props-deep-dive",
            liveClass: null,
            notes: [],
            assignments: [],
            lessons: [],
            recording: null
          }
        ]
      }
    ]
  }
];

// Helper to get students for a course
export const getCourseStudents = (courseId: string): CourseStudent[] => {
  return [
    { id: "S1", name: "Alice Johnson", email: "alice@example.com", progress: 85, joinedDate: "20 Jan 2026" },
    { id: "S2", name: "Bob Smith", email: "bob@example.com", progress: 65, joinedDate: "22 Jan 2026" },
    { id: "S3", name: "Charlie Davis", email: "charlie@example.com", progress: 45, joinedDate: "25 Jan 2026" },
  ];
};

export const getCourseTutors = (courseId: string): CourseTutor[] => {
  return [
    { id: "T1", name: "Rahul Sharma", email: "rahul@codo.com", status: "Active", joinedDate: "10 Jan 2025" },
    { id: "T2", name: "Arun Kumar", email: "arun@codo.com", status: "Active", joinedDate: "20 Jan 2025" },
  ];
};

export const getCourseMentors = (courseId: string): CourseMentor[] => {
  return [
    { id: "M1", name: "Suresh Raina", email: "suresh@example.com", status: "Active", joinedDate: "05 Jan 2025" },
  ];
};

// CRUD Helpers
export const addCourse = (course: Course) => { courses.unshift(course); };
export const updateCourse = (updatedCourse: Course) => { 
  const index = courses.findIndex(c => c.id === updatedCourse.id);
  if (index !== -1) {
    courses[index] = { ...courses[index], ...updatedCourse };
  }
};
export const deleteCourse = (id: string) => { 
  const index = courses.findIndex(c => c.id === id);
  if (index !== -1) {
    courses.splice(index, 1);
  }
};

// --- Module CRUD ---
export const addModuleToCourse = (courseId: string, module: Module) => {
  const course = courses.find(c => c.id === courseId);
  if (course) {
    course.modules.push(module);
  }
};

export const updateModuleInCourse = (courseId: string, updatedModule: Module) => {
  const course = courses.find(c => c.id === courseId);
  if (course) {
    course.modules = course.modules.map(m => m.id === updatedModule.id ? updatedModule : m);
  }
};

export const deleteModuleFromCourse = (courseId: string, moduleId: string) => {
  const course = courses.find(c => c.id === courseId);
  if (course) {
    course.modules = course.modules.filter(m => m.id !== moduleId);
  }
};

// --- Session CRUD ---
export const addSessionToModule = (courseId: string, moduleId: string, session: Session) => {
  const course = courses.find(c => c.id === courseId);
  if (course) {
    const module = course.modules.find(m => m.id === moduleId);
    if (module) {
      module.sessions.push(session);
    }
  }
};

export const updateSessionInModule = (courseId: string, moduleId: string, updatedSession: Session) => {
  const course = courses.find(c => c.id === courseId);
  if (course) {
    const module = course.modules.find(m => m.id === moduleId);
    if (module) {
      module.sessions = module.sessions.map(s => s.id === updatedSession.id ? updatedSession : s);
    }
  }
};

export const deleteSessionFromModule = (courseId: string, moduleId: string, sessionId: string) => {
  const course = courses.find(c => c.id === courseId);
  if (course) {
    const module = course.modules.find(m => m.id === moduleId);
    if (module) {
      module.sessions = module.sessions.filter(s => s.id !== sessionId);
    }
  }
};

// --- Live Class Scheduling helper ---
export const scheduleLiveClassForSession = (courseId: string, moduleId: string, sessionId: string, liveClass: LiveClass) => {
  const course = courses.find(c => c.id === courseId);
  if (course) {
    const module = course.modules.find(m => m.id === moduleId);
    if (module) {
      const session = module.sessions.find(s => s.id === sessionId);
      if (session) {
        session.liveClass = liveClass;
      }
    }
  }
};
