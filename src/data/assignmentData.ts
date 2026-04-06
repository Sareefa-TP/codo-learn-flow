import { courses } from "./courseData";

export interface Assignment {
  id: string;
  title: string;
  description: string;
  courseId: string;
  moduleId: string;
  sessionId: string;
  batchId: string;
  studentIds: string[];
  dueDate: string;
  maxMarks: number;
  files: string[];
  status: "Draft" | "Published";
  createdAt: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  status: "Submitted" | "Pending" | "Late";
  submittedDate?: string;
  marks?: number;
  fileUrl?: string;
}

export const SHARED_ASSIGNMENTS: Assignment[] = [
  {
    id: "A-001",
    title: "React State Management Challenge",
    description: "Build a multi-step form using React state and hooks. Ensure all validations are handled.",
    courseId: "C-001",
    moduleId: "M-1",
    sessionId: "S-1-1",
    batchId: "B-001",
    studentIds: ["S1", "S2", "S3"],
    dueDate: "2026-04-15",
    maxMarks: 100,
    files: ["/files/assignment-1-brief.pdf"],
    status: "Published",
    createdAt: "2026-03-25T10:00:00Z"
  }
];

export const MOCK_SUBMISSIONS: AssignmentSubmission[] = [
  {
    id: "SUB-001",
    assignmentId: "A-001",
    studentId: "S1",
    studentName: "Alice Johnson",
    status: "Submitted",
    submittedDate: "2026-04-12T14:30:00Z",
    marks: 85,
    fileUrl: "/submissions/alice-react-form.zip"
  },
  {
    id: "SUB-002",
    assignmentId: "A-001",
    studentId: "S2",
    studentName: "Bob Smith",
    status: "Pending",
  },
  {
    id: "SUB-003",
    assignmentId: "A-001",
    studentId: "S3",
    studentName: "Charlie Davis",
    status: "Late",
    submittedDate: "2026-04-16T09:15:00Z",
    marks: 60,
    fileUrl: "/submissions/charlie-react-form.zip"
  }
];

// CRUD Helpers
export const addAssignment = (assignment: Assignment) => {
  SHARED_ASSIGNMENTS.unshift(assignment);
};

export const updateAssignment = (updated: Assignment) => {
  const index = SHARED_ASSIGNMENTS.findIndex(a => a.id === updated.id);
  if (index !== -1) {
    SHARED_ASSIGNMENTS[index] = updated;
  }
};

export const deleteAssignment = (id: string) => {
  const index = SHARED_ASSIGNMENTS.findIndex(a => a.id === id);
  if (index !== -1) {
    SHARED_ASSIGNMENTS.splice(index, 1);
  }
};

export const getAssignmentById = (id: string) => SHARED_ASSIGNMENTS.find(a => a.id === id);

export const getSubmissionsForAssignment = (assignmentId: string) => 
  MOCK_SUBMISSIONS.filter(s => s.assignmentId === assignmentId);
