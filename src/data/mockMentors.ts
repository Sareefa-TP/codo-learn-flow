export const mockMentors = [
    { id: "M1", name: "Vikram Singh", email: "vikram@codo.com", phone: "+91 9876543220", status: "Active", joinedDate: "05 Jan 2025", assignedInternIds: ["I1", "I2", "I3", "I4", "I5", "I6", "I7", "I8"] },
    { id: "M2", name: "Sunita Desai", email: "sunita@codo.com", phone: "+91 9876543221", status: "Active", joinedDate: "12 Jan 2025", assignedInternIds: ["I9", "I10", "I11", "I12", "I13"] },
    { id: "M3", name: "Rajesh Rao", email: "rajesh@codo.com", phone: "+91 9876543222", status: "Active", joinedDate: "18 Jan 2025", assignedInternIds: ["I14", "I15"] },
    { id: "M4", name: "Ananya Reddy", email: "ananya@codo.com", phone: "+91 9876543223", status: "Inactive", joinedDate: "22 Jan 2025", assignedInternIds: ["I16"] },
    { id: "M5", name: "Kunal Kapoor", email: "kunal@codo.com", phone: "+91 9876543224", status: "Active", joinedDate: "01 Feb 2025", assignedInternIds: [] }
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
