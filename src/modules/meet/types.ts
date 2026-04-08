export interface MeetSession {
  id: string;
  title: string;
  mentor: string;
  date: string;
  time: string;
  startTime: string; // ISO string (used for ordering / reference)
  duration: string;
  status: "upcoming" | "live" | "completed";
  meetLink: string;
  recordingLink?: string;
}

export interface MeetRegularSession {
  id: string;
  title: string;
  mentor: string;
  schedule: string;
  time: string;
  isActive: boolean;
  meetLink: string;
}

export type MeetTabId = "live" | "upcoming" | "recordings" | "regular";
