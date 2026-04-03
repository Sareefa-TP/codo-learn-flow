export interface MentorSession {
  id: string;
  title: string;
  type: "Review" | "Doubt" | "Career";
  date: string;
  status: "Upcoming" | "Completed" | "Cancelled";
}

export interface MentorCourse {
  id: string;
  name: string;
  batches: string[];
}

export interface MentorStudent {
  id: string;
  name: string;
  progressStatus: "Good" | "Average" | "Needs Attention";
}

export const mockMentors = [
  { 
    id: "M1", 
    name: "Vikram Singh", 
    email: "vikram@codo.com", 
    phone: "+91 9876543220", 
    status: "Active", 
    joinedDate: "05 Jan 2025", 
    assignedInternIds: ["I1", "I2", "I3", "I4", "I5", "I6", "I7", "I8"],
    assignedCourses: [
      { id: "C1", name: "Full Stack Web Development", batches: ["Jan 2026 Alpha", "Feb 2026 Beta"] },
      { id: "C2", name: "Backend Engineering", batches: ["Mar 2026 Gamma"] }
    ],
    sessions: [
      { id: "S1", title: "Project Milestone Review", type: "Review", date: "10 Mar 2025", status: "Completed" },
      { id: "S2", title: "React State Management Doubt Session", type: "Doubt", date: "15 Mar 2025", status: "Upcoming" },
      { id: "S3", title: "Career Guidance Workshop", type: "Career", date: "20 Mar 2025", status: "Upcoming" }
    ],
    performance: { totalSessions: 42, rating: 4.8 },
    studentProgress: [
      { id: "I1", name: "Rohan Das", progressStatus: "Good" },
      { id: "I2", name: "Priya Nair", progressStatus: "Average" },
      { id: "I3", name: "Siddharth Rao", progressStatus: "Needs Attention" }
    ]
  },
  { 
    id: "M2", 
    name: "Sunita Desai", 
    email: "sunita@codo.com", 
    phone: "+91 9876543221", 
    status: "Active", 
    joinedDate: "12 Jan 2025", 
    assignedInternIds: ["I9", "I10", "I11", "I12", "I13"],
    assignedCourses: [
      { id: "C1", name: "Full Stack Web Development", batches: ["Jan 2026 Alpha"] }
    ],
    sessions: [
      { id: "S4", title: "Weekly Sync", type: "Review", date: "05 Mar 2025", status: "Completed" },
      { id: "S5", title: "CSS Layouts Doubt Clearing", type: "Doubt", date: "12 Mar 2025", status: "Completed" }
    ],
    performance: { totalSessions: 28, rating: 4.5 },
    studentProgress: [
      { id: "I9", name: "Rahul Menon", progressStatus: "Good" },
      { id: "I10", name: "Aditi Sharma", progressStatus: "Good" }
    ]
  },
  { 
    id: "M3", 
    name: "Rajesh Rao", 
    email: "rajesh@codo.com", 
    phone: "+91 9876543222", 
    status: "Active", 
    joinedDate: "18 Jan 2025", 
    assignedInternIds: ["I14", "I15"],
    assignedCourses: [
      { id: "C3", name: "UI/UX Design", batches: [] }
    ],
    sessions: [],
    performance: { totalSessions: 15, rating: 4.2 },
    studentProgress: []
  },
  { 
    id: "M4", 
    name: "Ananya Reddy", 
    email: "ananya@codo.com", 
    phone: "+91 9876543223", 
    status: "Inactive", 
    joinedDate: "22 Jan 2025", 
    assignedInternIds: ["I16"],
    assignedCourses: [
      { id: "C1", name: "Full Stack Web Development", batches: [] }
    ],
    sessions: [],
    performance: { totalSessions: 5, rating: 4.0 },
    studentProgress: []
  },
  { 
    id: "M5", 
    name: "Kunal Kapoor", 
    email: "kunal@codo.com", 
    phone: "+91 9876543224", 
    status: "Active", 
    joinedDate: "01 Feb 2025", 
    assignedInternIds: [],
    assignedCourses: [],
    sessions: [],
    performance: { totalSessions: 0, rating: 0 },
    studentProgress: []
  }
];

const realisticInternNames = [
    "Rohan Das", "Priya Nair", "Siddharth Rao", "Kavya Iyer", "Amitabh Varma",
    "Sneha Patel", "Gaurav Singh", "Nisha Desai", "Rahul Menon", "Aditi Sharma",
    "Vikash Kumar", "Meghna Reddy", "Ankit Gupta", "Pooja Krishnan", "Sandeep Thomas",
    "Shruti Bhat", "Rishabh Joshi", "Tanvi Agarwal", "Karan Malhotra", "Divya Pillai"
];

// Generate 16 assigned interns explicitly and 4 unassigned interns
export const mockInterns = Array.from({ length: 20 }).map((_, i) => {
    const name = realisticInternNames[i];
    const email = `${name.toLowerCase().replace(" ", ".")}@intern.com`;

    let assignedMentorId: string | null = null;
    // Map IDs according to the mockMentors assignedInternIds list
    if (i < 8) assignedMentorId = "M1"; // I1 to I8
    else if (i < 13) assignedMentorId = "M2"; // I9 to I13
    else if (i < 15) assignedMentorId = "M3"; // I14, I15
    else if (i < 16) assignedMentorId = "M4"; // I16

    return {
        id: `I${i + 1}`,
        name,
        email,
        batch: i % 2 === 0 ? "Jan 2026 Alpha" : "Feb 2026 Beta",
        progress: Math.floor(Math.random() * 80) + 20, // 20 to 99
        status: i % 7 === 0 ? "Inactive" : "Active",
        assignedMentorId
    };
});
