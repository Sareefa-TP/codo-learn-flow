import { User, ShieldCheck, GraduationCap, Headset } from "lucide-react";

export interface ChatParticipant {
  id: string;
  name: string;
  role: 'Tutor' | 'Mentor' | 'Advisor' | 'Admin' | 'Student' | 'Coordinator';
  avatar?: string;
  course?: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  courseTag?: string;
  isOwn: boolean;
  isVoice?: boolean;
  voiceDuration?: string;
  voiceUrl?: string;
  isFile?: boolean;
  fileType?: 'image' | 'pdf' | 'other';
  fileName?: string;
  fileUrl?: string;
  replyTo?: Message;
}

export interface UnifiedChat {
  id: string;
  title: string;
  subtitle: string;
  participants: ChatParticipant[];
  messages: Message[];
  unreadCount: number;
}

export const unifiedSupportChat: UnifiedChat = {
  id: "central-support",
  title: "CODO Support Team",
  subtitle: "Tutors • Mentors • Advisors • Coordinator • Admin",
  unreadCount: 5,
  participants: [
    { id: "s1", name: "YOU", role: "Student" },
    { id: "t1", name: "John Wick", role: "Tutor", course: "Full Stack" },
    { id: "t2", name: "Sarah Connor", role: "Tutor", course: "UI/UX Design" },
    { id: "m2", name: "Ellen Ripley", role: "Mentor" },
    { id: "c1", name: "Arthur Dent", role: "Coordinator" },
    { id: "a1", name: "Mike Ross", role: "Advisor" },
    { id: "adm1", name: "Super Admin", role: "Admin" },
  ],
  messages: [
    {
      id: "m1",
      senderId: "t1",
      senderName: "John Wick",
      text: "Welcome to the unified support chat, Alex! Feel free to ask anything about your courses here.",
      timestamp: "09:00 AM",
      isOwn: false,
    },
    {
      id: "m2",
      senderId: "s1",
      senderName: "YOU",
      text: "Thanks! Can you explain how the API authentication works in the latest module?",
      timestamp: "10:15 AM",
      courseTag: "Full Stack",
      isOwn: true,
    },
    {
      id: "m3",
      senderId: "t1",
      senderName: "John Wick",
      text: "Of course. We use JWT for session handling. I've sent a resource link to your dashboard.",
      timestamp: "10:20 AM",
      courseTag: "Full Stack",
      isOwn: false,
    },
    {
      id: "m4",
      senderId: "s1",
      senderName: "YOU",
      text: "I uploaded my design for the mobile app project. Could someone review it?",
      timestamp: "11:45 AM",
      courseTag: "UI/UX",
      isOwn: true,
    },
    {
      id: "m5",
      senderId: "t2",
      senderName: "Sarah Connor",
      text: "Just saw it, Alex! The spacing in the hero section looks much better now. Great improvement.",
      timestamp: "12:10 PM",
      courseTag: "UI/UX",
      isOwn: false,
    },
    {
      id: "m6",
      senderId: "adm1",
      senderName: "Admin",
      text: "Hi Alex, your certificate for the previous module has been generated and is ready for download.",
      timestamp: "02:30 PM",
      isOwn: false,
    },
  ]
};
