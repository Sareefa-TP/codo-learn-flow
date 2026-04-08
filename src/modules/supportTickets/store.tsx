import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { SupportTicket, SupportTicketMessage, SupportTicketStatus } from "./types";
import { INITIAL_SUPPORT_TICKETS } from "./mockTickets";

type SupportTicketsContextValue = {
  tickets: SupportTicket[];
  getTicketById: (id: string) => SupportTicket | undefined;
  updateTicketStatus: (id: string, status: SupportTicketStatus) => void;
  addAdminReply: (id: string, text: string) => void;
};

const SupportTicketsContext = createContext<SupportTicketsContextValue | null>(null);

const isoNow = () => new Date().toISOString();

export function SupportTicketsProvider({ children }: { children: React.ReactNode }) {
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_SUPPORT_TICKETS);

  const getTicketById = useCallback(
    (id: string) => tickets.find((t) => t.id === id),
    [tickets],
  );

  const updateTicketStatus = useCallback((id: string, status: SupportTicketStatus) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t)),
    );
  }, []);

  const addAdminReply = useCallback((id: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const msg: SupportTicketMessage = {
      id: `msg-${Date.now()}`,
      sender: "admin",
      text: trimmed,
      createdAt: isoNow(),
    };

    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, messages: [...t.messages, msg] } : t)),
    );
  }, []);

  const value = useMemo<SupportTicketsContextValue>(
    () => ({ tickets, getTicketById, updateTicketStatus, addAdminReply }),
    [tickets, getTicketById, updateTicketStatus, addAdminReply],
  );

  return <SupportTicketsContext.Provider value={value}>{children}</SupportTicketsContext.Provider>;
}

export function useSupportTickets() {
  const ctx = useContext(SupportTicketsContext);
  if (!ctx) throw new Error("useSupportTickets must be used within SupportTicketsProvider");
  return ctx;
}

