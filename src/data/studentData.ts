// Centralized Student Data Store
// This is the single source of truth for all student-related mock data

export const studentData = {
  profile: {
    name: "Alex Rivera",
    tier: "Pro Member",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  },
  attendance: {
    percentage: 94,
    status: "Elite",
    provider: "Google Meet Sync",
  },
  next_class: {
    title: "Advanced React Hooks",
    tutor: "Dr. Sarah Jenkins",
    time: "Today, 4:30 PM",
    link: "https://meet.google.com/abc-defg-hij",
  },
  learning_materials: [
    {
      subject: "Front-end Dev",
      tutor: "Marco",
      files: [
        { name: "React_Cheat_Sheet.pdf", type: "doc" as const },
        { name: "useState_DeepDive.mp4", type: "video" as const },
      ],
    },
    {
      subject: "UI/UX Design",
      tutor: "Sofia",
      files: [{ name: "Figma_Shortcuts.pdf", type: "doc" as const }],
    },
  ],
  recorded_classes: [{ title: "Intro to HTML", date: "Jan 28", link: "#" }],
  assessments: [{ task: "Project Alpha", grade: "92/100", status: "Passed" }],
  wallet: {
    balance: "$0.00",
    status: "Paid",
    next_due: "March 15, 2026",
  },
  notifications: [{ text: "New material uploaded", is_read: false }],
  certificates: [{ title: "HTML Foundations", status: "Issued" }],
};

// Type exports for TypeScript support
export type StudentData = typeof studentData;
export type LearningMaterial = (typeof studentData.learning_materials)[number];
export type MaterialFile = LearningMaterial["files"][number];
export type RecordedClass = (typeof studentData.recorded_classes)[number];
export type Assessment = (typeof studentData.assessments)[number];
export type Notification = (typeof studentData.notifications)[number];
export type Certificate = (typeof studentData.certificates)[number];
