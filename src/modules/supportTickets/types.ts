export type SupportTicketStatus = "Open" | "In Progress" | "Resolved";

export type SupportTicketPriority = "Low" | "Medium" | "High";

export type SupportTicketRole = "Student" | "Advisor";

export type SupportTicketMessageSender = "user" | "admin";

export interface SupportTicketMessage {
  id: string;
  sender: SupportTicketMessageSender;
  text: string;
  createdAt: string; // ISO string for easy sorting/formatting later
}

export interface SupportTicket {
  id: string; // e.g. TCK-001
  name: string;
  role: SupportTicketRole;
  subject: string;
  description: string;
  priority: SupportTicketPriority;
  status: SupportTicketStatus;
  createdAt: string; // YYYY-MM-DD for list filters
  attachments?: { name: string; url: string }[];
  messages: SupportTicketMessage[];
}

