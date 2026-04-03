export const mockTutors = [
    { 
      id: "T1", 
      name: "Rahul Sharma", 
      email: "rahul@codo.com", 
      phone: "+91 9876543210", 
      status: "Active", 
      joinedDate: "10 Jan 2025", 
      assignedStudentIds: Array.from({ length: 42 }).map((_, i) => `S1-${i}`),
      courses: [
        { id: "c1", name: "Full Stack Development", batches: ["FS-JAN-24", "FS-FEB-24"] },
        { id: "c2", name: "Python Zero to Hero", batches: ["PY-JAN-24"] }
      ],
      meetHistory: [
        { id: "m1", title: "Introduction to React Hooks", date: "20 Mar 2024", status: "Completed", course: "Full Stack Development" },
        { id: "m2", title: "API Integration with Node.js", date: "22 Mar 2024", status: "Upcoming", course: "Full Stack Development" }
      ],
      assignmentsReviewed: 156,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul"
    },
    { 
      id: "T2", 
      name: "Neha Gupta", 
      email: "neha@codo.com", 
      phone: "+91 9876543211", 
      status: "Active", 
      joinedDate: "15 Jan 2025", 
      assignedStudentIds: Array.from({ length: 25 }).map((_, i) => `S2-${i}`),
      courses: [
        { id: "c3", name: "UI/UX Design Masterclass", batches: ["UI-MAR-24"] }
      ],
      meetHistory: [
        { id: "m3", title: "Wireframing Best Practices", date: "15 Mar 2024", status: "Completed", course: "UI/UX Design Masterclass" }
      ],
      assignmentsReviewed: 89,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Neha"
    },
    { 
      id: "T3", 
      name: "Arun Kumar", 
      email: "arun@codo.com", 
      phone: "+91 9876543212", 
      status: "Active", 
      joinedDate: "20 Jan 2025", 
      assignedStudentIds: Array.from({ length: 15 }).map((_, i) => `S3-${i}`),
      courses: [
        { id: "c1", name: "Full Stack Development", batches: ["FS-FEB-24"] }
      ],
      meetHistory: [
        { id: "m4", title: "Database Schema Design", date: "18 Mar 2024", status: "Completed", course: "Full Stack Development" }
      ],
      assignmentsReviewed: 45,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arun"
    },
    { 
      id: "T4", 
      name: "Priya Singh", 
      email: "priya@codo.com", 
      phone: "+91 9876543213", 
      status: "Inactive", 
      joinedDate: "05 Feb 2025", 
      assignedStudentIds: Array.from({ length: 5 }).map((_, i) => `S4-${i}`),
      courses: [],
      meetHistory: [],
      assignmentsReviewed: 12,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya"
    },
    { 
      id: "T5", 
      name: "Amit Verma", 
      email: "amit@codo.com", 
      phone: "+91 9876543214", 
      status: "Active", 
      joinedDate: "10 Feb 2025", 
      assignedStudentIds: [],
      courses: [],
      meetHistory: [],
      assignmentsReviewed: 0,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amit"
    }
];

export const mockStudents = [
    ...Array.from({ length: 42 }).map((_, i) => ({
      id: `S1-${i}`, name: `Student ${i}`, email: `student${i}@example.com`, batch: "Jan 2026 Cohort", progress: 50, status: "Active", assignedTutorId: "T1"
    })),
];
