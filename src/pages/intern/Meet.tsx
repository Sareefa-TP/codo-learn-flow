import { MeetPage } from "@/modules/meet/MeetPage";
import type { MeetRegularSession, MeetSession } from "@/modules/meet/types";

// --- Mock Data (intern-specific; UI stays identical to Student) ---
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
    id: "i1",
    title: "Intern Kickoff: Expectations & Weekly Cadence",
    mentor: "Intern Program Lead",
    date: "Today",
    time: "Starting Soon",
    startTime: inMinutes(8).toISOString(),
    duration: "45 min",
    status: "upcoming",
    meetLink: "https://meet.google.com/abc-defg-hij",
  },
  {
    id: "i2",
    title: "Code Review Clinic: Clean Architecture & UI Consistency",
    mentor: "CODO Engineering",
    date: formatDateLabel(inDaysAt(0, 20, 0)),
    time: "08:00 PM",
    startTime: inDaysAt(0, 20, 0).toISOString(),
    duration: "60 min",
    status: "upcoming",
    meetLink: "https://meet.google.com/abc-defg-hij",
  },
  {
    id: "i3",
    title: "Live Pairing: Fixes, Performance, and Refactors",
    mentor: "Senior Mentor",
    date: "Today",
    time: "10:00 AM",
    startTime: new Date(now.getTime() - 20 * 60_000).toISOString(),
    duration: "75 min",
    status: "live",
    meetLink: "https://meet.google.com/abc-defg-hij",
  },
  {
    id: "i4",
    title: "Intern Demo Day: Present Your Feature",
    mentor: "Panel",
    date: formatDateLabel(inDaysAt(2, 18, 30)),
    time: formatTimeLabel(inDaysAt(2, 18, 30)),
    startTime: inDaysAt(2, 18, 30).toISOString(),
    duration: "90 min",
    status: "upcoming",
    meetLink: "https://meet.google.com/abc-defg-hij",
  },
  {
    id: "i5",
    title: "Sprint Retrospective: What Worked, What Didn't",
    mentor: "Intern Program Lead",
    date: "Mar 20, 2026",
    time: "04:00 PM",
    startTime: new Date("2026-03-20T16:00:00").toISOString(),
    duration: "50 min",
    status: "completed",
    meetLink: "https://meet.google.com/abc-defg-hij",
    recordingLink: DEMO_RECORDING_MP4,
  },
];

const fixedSessions: MeetRegularSession[] = [
  {
    id: "ifs1",
    title: "Daily Standup",
    mentor: "Intern Program",
    schedule: "Mon - Fri",
    time: "10:30 AM",
    isActive: true,
    meetLink: "https://meet.google.com/abc-defg-hij",
  },
  {
    id: "ifs2",
    title: "Weekly Feedback Sync",
    mentor: "Mentor Team",
    schedule: "Every Fri",
    time: "05:00 PM",
    isActive: true,
    meetLink: "https://meet.google.com/abc-defg-hij",
  },
];

const InternMeet = () => {
  return (
    <MeetPage
      basePath="/intern/meet"
      initialSessions={initialSessions}
      fixedSessions={fixedSessions}
      demoRecordingMp4={DEMO_RECORDING_MP4}
      enableSearch
      searchPlaceholder="Search meetings..."
    />
  );
};

export default InternMeet;
