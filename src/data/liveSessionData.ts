export interface LiveSession {
  id: string;
  title: string;
  course: string;
  batch: string;
  tutor: string;
  module: string;
  topic: string;
  date: string;
  startTime: string;
  duration: string;
  status: "upcoming" | "completed" | "cancelled" | "live";
  meetingLink: string;
  recordingUrl?: string;
  notes?: string;
  settings?: {
    recordingEnabled: boolean;
    allowLateJoin: boolean;
  };
}

export const COURSES = [
  { id: "c1", name: "Full Stack Web Dev" },
  { id: "c2", name: "Data Science Mastery" },
  { id: "c3", name: "UI/UX Design Pro" },
];

export const BATCHES: Record<string, string[]> = {
  "Full Stack Web Dev": ["Jan 2026 Batch", "Feb 2026 Batch", "Mar 2026 Batch"],
  "Data Science Mastery": ["Python Masters Jan", "Data Cohort Feb"],
  "UI/UX Design Pro": ["Design Thinking Jan", "UX Research Feb"],
};

export const TUTORS: Record<string, string[]> = {
  "Full Stack Web Dev": ["James Wilson", "Dr. Sarah Mitchell", "Sarah Thompson"],
  "Data Science Mastery": ["Elena Rodriguez", "Michael Chen"],
  "UI/UX Design Pro": ["Elena Rodriguez", "Michael Chen"],
};

export const MODULES: Record<string, string[]> = {
  "Full Stack Web Dev": ["Frontend Basics", "React Deep Dive", "Node.js Fundamentals"],
  "Data Science Mastery": ["Python Basics", "Machine Learning Intro", "Data Visualization"],
  "UI/UX Design Pro": ["Design Principles", "Figma Advanced", "Prototyping"],
};

export const SESSIONS: Record<string, string[]> = {
  "Frontend Basics": ["HTML5/CSS3", "Responsive Design", "CSS Grid", "Flexbox Mastery"],
  "React Deep Dive": ["Hooks", "Context API", "State Management", "Redux Toolkit"],
  "Node.js Fundamentals": ["Express.js", "MongoDB Integration", "REST API Design"],
  "Python Basics": ["Syntax & Types", "Data Structures", "Functions & Modules"],
  "Machine Learning Intro": ["Linear Regression", "Decision Trees", "Neural Networks"],
  "Data Visualization": ["Matplotlib Basics", "Seaborn Charts", "Plotly Interaction"],
  "Design Principles": ["Visual Hierarchy", "Typography & Color", "Grid Systems"],
  "Figma Advanced": ["Auto Layout", "Components & Variants", "Design Systems"],
  "Prototyping": ["Interactive Overlays", "Smart Animate", "User Testing"],
};

export const MOCK_SESSIONS: LiveSession[] = [
  {
    id: "LS001",
    title: "React Hooks Deep Dive",
    course: "Full Stack Web Dev",
    batch: "Jan 2026 Batch",
    tutor: "Dr. Sarah Mitchell",
    module: "React Deep Dive",
    topic: "Hooks",
    date: "2026-03-24",
    startTime: "10:00 AM",
    duration: "1.5 hrs",
    status: "upcoming",
    meetingLink: "https://meet.google.com/abc-defg-hij",
    settings: { recordingEnabled: true, allowLateJoin: true },
  },
  {
    id: "LS002",
    title: "Node.js API Design",
    course: "Full Stack Web Dev",
    batch: "Jan 2026 Batch",
    tutor: "James Wilson",
    module: "Node.js Fundamentals",
    topic: "REST API Design",
    date: "2026-03-24",
    startTime: "02:00 PM",
    duration: "2 hrs",
    status: "upcoming",
    meetingLink: "https://meet.google.com/pqr-stuv-wxy",
  },
  {
    id: "LS003",
    title: "Python Data Structures",
    course: "Data Science Mastery",
    batch: "Python Masters Jan",
    tutor: "Elena Rodriguez",
    module: "Python Basics",
    topic: "Data Structures",
    date: "2026-03-23",
    startTime: "11:00 AM",
    duration: "1.5 hrs",
    status: "completed",
    meetingLink: "https://meet.google.com/mno-pqrs-tuv",
    recordingUrl: "https://vimeo.com/123456789",
  },
  {
    id: "LS004",
    title: "Figma Prototyping",
    course: "UI/UX Design Pro",
    batch: "Design Thinking Jan",
    tutor: "Michael Chen",
    module: "Prototyping",
    topic: "Smart Animate",
    date: "2026-03-22",
    startTime: "03:00 PM",
    duration: "1 hr",
    status: "completed",
    meetingLink: "https://meet.google.com/completed-link",
    recordingUrl: "https://vimeo.com/987654321",
  },
  {
    id: "LS005",
    title: "Layout with CSS Grid",
    course: "Full Stack Web Dev",
    batch: "Feb 2026 Batch",
    tutor: "Sarah Thompson",
    module: "Frontend Basics",
    topic: "CSS Grid",
    date: "2026-03-25",
    startTime: "09:30 AM",
    duration: "1.5 hrs",
    status: "cancelled",
    meetingLink: "https://meet.google.com/grid-meet",
  },
];

// Persistent storage simulation for the demo session
let sessionsStore = [...MOCK_SESSIONS];

export const getSessions = () => sessionsStore;

export const addSession = (session: LiveSession) => {
  sessionsStore = [session, ...sessionsStore];
};

export const deleteSession = (id: string) => {
  sessionsStore = sessionsStore.filter(s => s.id !== id);
};

export const updateSession = (id: string, updatedData: Partial<LiveSession>) => {
  sessionsStore = sessionsStore.map(s => s.id === id ? { ...s, ...updatedData } : s);
};

export const MOCK_ATTENDANCE = [
  { id: "S1", name: "Aarav Mehta", email: "aarav.m@gmail.com", status: "Present", engagement: "High" },
  { id: "S2", name: "Diya Krishnan", email: "diya.k@gmail.com", status: "Present", engagement: "High" },
  { id: "S3", name: "Rahul Sharma", email: "rahul.s@gmail.com", status: "Absent", engagement: "Low" },
  { id: "S4", name: "Sneha Iyer", email: "sneha.i@gmail.com", status: "Present", engagement: "Medium" },
  { id: "S5", name: "Vikram Shah", email: "vikram.s@gmail.com", status: "Present", engagement: "High" },
  { id: "S6", name: "Meera Nair", email: "meera.n@gmail.com", status: "Absent", engagement: "Low" },
  { id: "S7", name: "Arjun Das", email: "arjun.d@gmail.com", status: "Present", engagement: "Medium" },
  { id: "S8", name: "Priya Pillai", email: "priya.p@gmail.com", status: "Present", engagement: "High" },
];
