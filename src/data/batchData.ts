export interface Batch {
    id: string;
    name: string;
    courseId: string;
    courseName?: string; // Cache course name for easy access
    tutorId: string;
    mentorId: string;
    studentIds: string[];
    startDate: string;
    endDate: string;
    status: "Upcoming" | "Active" | "Completed" | "Learning" | "Internship";
    duration: string;
    progress: number;
    phase?: string;
    batchCode?: string;
    notes?: string;
}

// Demo Data (Unified for consistency)
export const SHARED_BATCHES: Batch[] = [
    {
        id: "B-001",
        name: "Jan 2026 Alpha",
        courseId: "C-001",
        courseName: "Full Stack Development",
        tutorId: "T1",
        mentorId: "M1",
        studentIds: ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8", "S9", "S10"],
        startDate: "2026-01-15",
        endDate: "2026-04-15",
        status: "Active",
        duration: "3 Months",
        progress: 65,
        phase: "Learning Phase",
        batchCode: "JAN-26-A",
        notes: "Group of enthusiastic learners focusing on React and Node.js."
    },
    {
        id: "B-002",
        name: "Oct 2025 Beta",
        courseId: "C-001",
        courseName: "Full Stack Development",
        tutorId: "T2",
        mentorId: "M2",
        studentIds: ["S11", "S12", "S13", "S14", "S15"],
        startDate: "2025-10-10",
        endDate: "2026-01-10",
        status: "Active",
        duration: "3 Months",
        progress: 95,
        phase: "Learning Phase",
        batchCode: "OCT-25-B",
        notes: "Approaching completion of the core curriculum."
    },
    {
        id: "B-005",
        name: "Feb 2026 Evening",
        courseId: "C-001",
        courseName: "Full Stack Development",
        tutorId: "T3",
        mentorId: "M3",
        studentIds: ["S21", "S22", "S23"],
        startDate: "2026-02-01",
        endDate: "2026-05-01",
        status: "Upcoming",
        duration: "3 Months",
        progress: 0,
        phase: "Orientation Phase",
        batchCode: "FEB-26-E",
        notes: "Evening batch tailored for working professionals."
    }
];
