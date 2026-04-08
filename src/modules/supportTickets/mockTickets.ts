import type { SupportTicket } from "./types";

export const INITIAL_SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: "TCK-001",
    name: "John Doe",
    role: "Student",
    subject: "Payment issue",
    description:
      "I completed the payment for my course, but the dashboard still shows payment pending. Please verify and help me access the course.",
    priority: "High",
    status: "Open",
    createdAt: "2026-04-01",
    attachments: [{ name: "payment-receipt.png", url: "/uploads/tickets/payment-receipt.png" }],
    messages: [
      { id: "m-1", sender: "user", text: "I have payment issue", createdAt: "2026-04-01T10:05:00.000Z" },
      { id: "m-2", sender: "admin", text: "We are checking", createdAt: "2026-04-01T10:12:00.000Z" },
    ],
  },
  {
    id: "TCK-002",
    name: "Aisha Khan",
    role: "Advisor",
    subject: "Student profile not loading",
    description:
      "On the Students page, opening a student profile sometimes gets stuck on loading. It happens more frequently for newly registered students.",
    priority: "Medium",
    status: "In Progress",
    createdAt: "2026-04-02",
    messages: [
      { id: "m-1", sender: "user", text: "Student profile not loading for some IDs.", createdAt: "2026-04-02T09:15:00.000Z" },
      { id: "m-2", sender: "admin", text: "Thanks — can you share a sample student ID where it happens?", createdAt: "2026-04-02T09:23:00.000Z" },
    ],
  },
  {
    id: "TCK-003",
    name: "Ravi Patel",
    role: "Student",
    subject: "Unable to join meet session",
    description:
      "When I click the Meet link from the dashboard, it opens but shows 'You do not have permission to join'. I tried multiple browsers.",
    priority: "Low",
    status: "Resolved",
    createdAt: "2026-03-30",
    messages: [
      { id: "m-1", sender: "user", text: "Meet link says I don't have permission.", createdAt: "2026-03-30T14:40:00.000Z" },
      { id: "m-2", sender: "admin", text: "We refreshed your access and updated the session link.", createdAt: "2026-03-30T15:05:00.000Z" },
      { id: "m-3", sender: "user", text: "Works now, thanks!", createdAt: "2026-03-30T15:12:00.000Z" },
    ],
  },
  {
    id: "TCK-004",
    name: "Neha Sharma",
    role: "Advisor",
    subject: "Lead assignment mismatch",
    description:
      "Some leads appear duplicated across advisors. When filtering by date, the counts also look inconsistent.",
    priority: "High",
    status: "Open",
    createdAt: "2026-04-03",
    messages: [
      { id: "m-1", sender: "user", text: "Leads duplicated across advisors.", createdAt: "2026-04-03T11:00:00.000Z" },
      { id: "m-2", sender: "admin", text: "Acknowledged. We’re reviewing the data sync.", createdAt: "2026-04-03T11:10:00.000Z" },
    ],
  },
];

