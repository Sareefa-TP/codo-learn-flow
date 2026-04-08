import { MeetPage } from "@/modules/meet/MeetPage";
import type { MeetRegularSession, MeetSession } from "@/modules/meet/types";

// --- Mock Data ---
const now = new Date();

const inMinutes = (minutes: number) => new Date(now.getTime() + minutes * 60_000);
const inDaysAt = (days: number, hour: number, minute: number) => {
  const d = new Date(now);
  d.setDate(d.getDate() + days);
  d.setHours(hour, minute, 0, 0);
  return d;
};

const formatDateLabel = (d: Date) =>
  d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const formatTimeLabel = (d: Date) =>
  d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

const DEMO_RECORDING_MP4 = "https://www.w3schools.com/html/mov_bbb.mp4";

const initialSessions: MeetSession[] = [
  {
    id: "1",
    title: "Advanced React Patterns & Performance",
    mentor: "John Doe",
    date: "Today",
    time: "10:00 AM",
    startTime: new Date(now.getTime() - 1800000).toISOString(),
    duration: "90 min",
    status: "live",
    meetLink: "https://meet.google.com/abc-defg-hij",
  },
  {
    id: "2",
    title: "Backend Scalability: Moving from Monolith to Microservices",
    mentor: "Jane Smith",
    date: "Today",
    time: "Starting Soon",
    startTime: inMinutes(12).toISOString(),
    duration: "60 min",
    status: "upcoming",
    meetLink: "https://meet.google.com/abc-defg-hij",
  },
  {
    id: "3",
    title: "UI/UX Best Practices for Enterprise Dashboards",
    mentor: "Alex Rivera",
    date: formatDateLabel(inDaysAt(0, 20, 0)),
    time: "08:00 PM",
    startTime: inDaysAt(0, 20, 0).toISOString(),
    duration: "45 min",
    status: "upcoming",
    meetLink: "https://meet.google.com/abc-defg-hij",
  },
  {
    id: "4",
    title: "System Design: Caching & Rate Limiting Essentials",
    mentor: "Sarah Chen",
    date: formatDateLabel(inDaysAt(1, 19, 0)),
    time: formatTimeLabel(inDaysAt(1, 19, 0)),
    startTime: inDaysAt(1, 19, 0).toISOString(),
    duration: "75 min",
    status: "upcoming",
    meetLink: "https://meet.google.com/abc-defg-hij",
  },
  {
    id: "5",
    title: "Data Structures Sprint: Arrays, Hashmaps, and Complexity",
    mentor: "Team CODO",
    date: formatDateLabel(inDaysAt(3, 18, 30)),
    time: formatTimeLabel(inDaysAt(3, 18, 30)),
    startTime: inDaysAt(3, 18, 30).toISOString(),
    duration: "60 min",
    status: "upcoming",
    meetLink: "https://meet.google.com/abc-defg-hij",
  },
  {
    id: "6",
    title: "Introduction to Docker & Kubernetes",
    mentor: "Sarah Chen",
    date: "Mar 20, 2026",
    time: "10:00 AM",
    startTime: new Date("2026-03-20T10:00:00").toISOString(),
    duration: "120 min",
    status: "completed",
    meetLink: "https://meet.google.com/abc-defg-hij",
    recordingLink: DEMO_RECORDING_MP4,
  },
  {
    id: "7",
    title: "State Management Deep Dive",
    mentor: "John Doe",
    date: "Mar 18, 2026",
    time: "04:00 PM",
    startTime: new Date("2026-03-18T16:00:00").toISOString(),
    duration: "75 min",
    status: "completed",
    meetLink: "https://meet.google.com/abc-defg-hij",
    recordingLink: DEMO_RECORDING_MP4,
  },
  {
    id: "8",
    title: "Interview Prep: Frontend Project Walkthrough",
    mentor: "Jane Smith",
    date: "Mar 12, 2026",
    time: "07:00 PM",
    startTime: new Date("2026-03-12T19:00:00").toISOString(),
    duration: "50 min",
    status: "completed",
    meetLink: "https://meet.google.com/abc-defg-hij",
    recordingLink: DEMO_RECORDING_MP4,
  },
];

const fixedSessions: MeetRegularSession[] = [
  {
    id: "fs1",
    title: "Growth Glimps",
    mentor: "Team Codo",
    schedule: "Every Tue & Thu",
    time: "10:00 AM",
    isActive: true,
    meetLink: "https://meet.google.com/abc-defg-hij",
  },
  {
    id: "fs2",
    title: "Weekly Meet",
    mentor: "Team Codo",
    schedule: "Every Mon",
    time: "04:00 PM",
    isActive: true,
    meetLink: "https://meet.google.com/abc-defg-hij",
  },
];

const StudentMeet = () => {
  return (
    <MeetPage
      basePath="/student/meet"
      initialSessions={initialSessions}
      fixedSessions={fixedSessions}
      demoRecordingMp4={DEMO_RECORDING_MP4}
    />
  );
};

export default StudentMeet;
