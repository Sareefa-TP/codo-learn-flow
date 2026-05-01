import { useState, useEffect, useCallback } from "react";
import { initialInvoices, payoutQueue, refundsList, InvoiceRow, PayoutRow, RefundRow } from "@/data/financeMock";
import { parse, isValid, startOfYear } from "date-fns";

const INVOICE_KEY = "finance.invoices.v1";
const PAYOUT_KEY = "finance.payouts.v1";
const REFUND_KEY = "finance.refunds.v1";
const UPDATE_EVENT = "finance:store-update";

// ─── Helpers ────────────────────────────────────────────────────────────────

export const parseFinanceDate = (dateStr: string) => {
  if (!dateStr) return new Date();
  // Handles "DD MMM YYYY"
  const d = parse(dateStr, "dd MMM yyyy", new Date());
  if (isValid(d)) return d;
  
  // Try short formats if needed
  return parseShortDate(dateStr);
};

export const parseShortDate = (dateStr: string) => {
  if (!dateStr) return new Date();
  // Handles "DD MMM, HH:mm" or "DD MMM YYYY" or "DD MMM"
  let d = parse(dateStr, "dd MMM, HH:mm", new Date());
  if (isValid(d)) return d;
  
  d = parse(dateStr, "dd MMM yyyy", new Date());
  if (isValid(d)) return d;

  d = parse(dateStr, "dd MMM", new Date());
  if (isValid(d)) return d;

  return new Date();
};

// ─── Store Hooks ────────────────────────────────────────────────────────────

export const useInvoicesStore = () => {
  const [invoices, setInvoices] = useState<InvoiceRow[]>(() => {
    const saved = localStorage.getItem(INVOICE_KEY);
    return saved ? JSON.parse(saved) : initialInvoices;
  });

  const refresh = useCallback(() => {
    const saved = localStorage.getItem(INVOICE_KEY);
    if (saved) setInvoices(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === INVOICE_KEY) refresh();
    };
    const handleUpdate = () => refresh();

    window.addEventListener("storage", handleStorage);
    window.addEventListener(UPDATE_EVENT, handleUpdate);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(UPDATE_EVENT, handleUpdate);
    };
  }, [refresh]);

  const saveInvoices = (newInvoices: InvoiceRow[]) => {
    localStorage.setItem(INVOICE_KEY, JSON.stringify(newInvoices));
    setInvoices(newInvoices);
    window.dispatchEvent(new CustomEvent(UPDATE_EVENT));
  };

  const addInvoice = (inv: InvoiceRow) => {
    const updated = [inv, ...invoices];
    saveInvoices(updated);
  };

  const updateInvoice = (number: string, updates: Partial<InvoiceRow>) => {
    const updated = invoices.map(inv => inv.number === number ? { ...inv, ...updates } : inv);
    saveInvoices(updated);
  };

  return { invoices, addInvoice, updateInvoice, setInvoices: saveInvoices };
};

export const usePayoutsStore = () => {
  const [payouts, setPayouts] = useState<PayoutRow[]>(() => {
    const saved = localStorage.getItem(PAYOUT_KEY);
    return saved ? JSON.parse(saved) : payoutQueue;
  });

  const refresh = useCallback(() => {
    const saved = localStorage.getItem(PAYOUT_KEY);
    if (saved) setPayouts(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === PAYOUT_KEY) refresh();
    };
    const handleUpdate = () => refresh();

    window.addEventListener("storage", handleStorage);
    window.addEventListener(UPDATE_EVENT, handleUpdate);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(UPDATE_EVENT, handleUpdate);
    };
  }, [refresh]);

  const savePayouts = (newPayouts: PayoutRow[]) => {
    localStorage.setItem(PAYOUT_KEY, JSON.stringify(newPayouts));
    setPayouts(newPayouts);
    window.dispatchEvent(new CustomEvent(UPDATE_EVENT));
  };

  return { payouts, setPayouts: savePayouts };
};

export const useRefundsStore = () => {
  const [refunds, setRefunds] = useState<RefundRow[]>(() => {
    const saved = localStorage.getItem(REFUND_KEY);
    return saved ? JSON.parse(saved) : refundsList;
  });

  const refresh = useCallback(() => {
    const saved = localStorage.getItem(REFUND_KEY);
    if (saved) setRefunds(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === REFUND_KEY) refresh();
    };
    const handleUpdate = () => refresh();

    window.addEventListener("storage", handleStorage);
    window.addEventListener(UPDATE_EVENT, handleUpdate);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(UPDATE_EVENT, handleUpdate);
    };
  }, [refresh]);

  const saveRefunds = (newRefunds: RefundRow[]) => {
    localStorage.setItem(REFUND_KEY, JSON.stringify(newRefunds));
    setRefunds(newRefunds);
    window.dispatchEvent(new CustomEvent(UPDATE_EVENT));
  };

  return { refunds, setRefunds: saveRefunds };
};
