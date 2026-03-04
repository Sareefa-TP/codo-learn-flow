export const mockTutors = [
    { id: "T1", name: "Rahul Sharma", email: "rahul@codo.com", phone: "+91 9876543210", status: "Active", joinedDate: "10 Jan 2025", assignedStudentIds: Array.from({ length: 42 }).map((_, i) => `S1-${i}`) },
    { id: "T2", name: "Neha Gupta", email: "neha@codo.com", phone: "+91 9876543211", status: "Active", joinedDate: "15 Jan 2025", assignedStudentIds: Array.from({ length: 25 }).map((_, i) => `S2-${i}`) },
    { id: "T3", name: "Arun Kumar", email: "arun@codo.com", phone: "+91 9876543212", status: "Active", joinedDate: "20 Jan 2025", assignedStudentIds: Array.from({ length: 15 }).map((_, i) => `S3-${i}`) },
    { id: "T4", name: "Priya Singh", email: "priya@codo.com", phone: "+91 9876543213", status: "Inactive", joinedDate: "05 Feb 2025", assignedStudentIds: Array.from({ length: 5 }).map((_, i) => `S4-${i}`) },
    { id: "T5", name: "Amit Verma", email: "amit@codo.com", phone: "+91 9876543214", status: "Active", joinedDate: "10 Feb 2025", assignedStudentIds: [] }
];

const realisticNames = [
    "Arjun Nair", "Aisha Rahman", "Neha Joseph", "Mohammed Rafi", "Anjali Menon",
    "Kiran Kumar", "Diya Thomas", "Rohit Sharma", "Sneha Pillai", "Aditya Varma",
    "Farhan Ali", "Meera Krishnan", "Vivek Raj", "Nithya S", "Rahul Das",
    "Priya Patel", "Vikram Singh", "Sunita Desai", "Rajesh Rao", "Ananya Reddy"
];

export const mockStudents = [
    // Heavy Load for Rahul (id: T1) - needs 42 students. Let's make 42 objects mapped to T1
    ...Array.from({ length: 42 }).map((_, i) => {
        const name = realisticNames[i % realisticNames.length];
        const email = `${name.toLowerCase().replace(" ", ".")}@student.com`;
        return {
            id: `S1-${i}`, name: `${name} ${i > realisticNames.length - 1 ? (Math.floor(i / realisticNames.length) + 1) : ""}`.trim(), email: `${i > realisticNames.length - 1 ? i : ""}${email}`, batch: "Jan 2026 Cohort", progress: 50, status: "Active", assignedTutorId: "T1"
        }
    }),

    // Moderate Load for Neha (id: T2) - needs 25 students. Let's make 25 objects mapped to T2
    ...Array.from({ length: 25 }).map((_, i) => {
        const name = realisticNames[(i + 5) % realisticNames.length]; // Offset to get different names
        const email = `${name.toLowerCase().replace(" ", ".")}@student.com`;
        return {
            id: `S2-${i}`, name: `${name} ${i > realisticNames.length - 1 ? (Math.floor(i / realisticNames.length) + 1) : ""}`.trim(), email: `${i > realisticNames.length - 1 ? i : ""}${email}`, batch: "Oct 2025 Cohort", progress: 75, status: "Active", assignedTutorId: "T2"
        }
    }),

    // Normal Load for Arun (id: T3) - needs 15 students
    ...Array.from({ length: 15 }).map((_, i) => {
        const name = realisticNames[(i + 10) % realisticNames.length]; // Offset
        const email = `${name.toLowerCase().replace(" ", ".")}@student.com`;
        return {
            id: `S3-${i}`, name: name, email: email, batch: "Feb 2026 Python", progress: 90, status: i % 5 === 0 ? "Inactive" : "Active", assignedTutorId: "T3"
        }
    }),

    // Normal Load for Priya (id: T4) - 5 students
    ...Array.from({ length: 5 }).map((_, i) => {
        const name = realisticNames[(i + 15) % realisticNames.length]; // Offset
        const email = `${name.toLowerCase().replace(" ", ".")}@student.com`;
        return {
            id: `S4-${i}`, name: name, email: email, batch: "Jul 2025 Evening", progress: 20, status: "Active", assignedTutorId: "T4"
        }
    }),

    // Zero Load for Amit (id: T5) - 0 students mapped.

    // Add some unassigned students to allow assignment logic to work
    ...Array.from({ length: 12 }).map((_, i) => {
        const name = realisticNames[(i + 7) % realisticNames.length]; // Offset
        const email = `unassigned${i}_${name.toLowerCase().replace(" ", ".")}@student.com`;
        return {
            id: `S-UNASSIGNED-${i}`, name: name, email: email, batch: "May 2026 Intro", progress: 0, status: "Active", assignedTutorId: null
        }
    })
];
