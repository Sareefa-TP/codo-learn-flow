export type InternAttendanceStatus = "checked-in" | "checked-out";

export interface InternAttendanceRecord {
  internId: string;
  dateISO: string; // yyyy-mm-dd
  checkInTime?: string; // ISO
  checkOutTime?: string; // ISO
  tasksCompleted?: string;
  blockers?: string;
  status: InternAttendanceStatus;
}

const STORAGE_KEY = "intern_attendance_records_v1";

const safeParse = <T,>(raw: string | null, fallback: T): T => {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

export const todayISO = () => new Date().toISOString().split("T")[0];

export const formatDateLabel = (dateISO: string) => {
  const d = new Date(`${dateISO}T00:00:00`);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

export const formatDayLabel = (dateISO: string) => {
  const d = new Date(`${dateISO}T00:00:00`);
  return d.toLocaleDateString("en-US", { weekday: "long" });
};

export const formatTimeLabel = (iso: string | undefined) => {
  if (!iso) return "--:--";
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export const calculateDurationLabel = (checkInIso?: string, checkOutIso?: string) => {
  if (!checkInIso || !checkOutIso) return "--";
  const start = new Date(checkInIso).getTime();
  const end = new Date(checkOutIso).getTime();
  const diffMs = Math.max(0, end - start);
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffMins = Math.floor((diffMs % 3600000) / 60000);
  return `${diffHrs}h ${diffMins}m`;
};

export const readAllAttendance = (): InternAttendanceRecord[] => {
  try {
    return safeParse<InternAttendanceRecord[]>(localStorage.getItem(STORAGE_KEY), []);
  } catch {
    return [];
  }
};

export const writeAllAttendance = (records: InternAttendanceRecord[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {
    // ignore storage write errors (private mode / quota)
  }
  try {
    // Notify same-tab listeners (storage event doesn't fire in same tab).
    window.dispatchEvent(new CustomEvent("intern-attendance-updated"));
  } catch {
    // ignore
  }
};

export const getAttendanceForIntern = (internId: string) => {
  const all = readAllAttendance();
  return all
    .filter((r) => r.internId === internId)
    .sort((a, b) => (a.dateISO < b.dateISO ? 1 : -1));
};

export const upsertCheckIn = (internId: string, dateISO: string, checkInTimeISO: string) => {
  const all = readAllAttendance();
  const idx = all.findIndex((r) => r.internId === internId && r.dateISO === dateISO);
  const next: InternAttendanceRecord = {
    internId,
    dateISO,
    checkInTime: checkInTimeISO,
    status: "checked-in",
  };

  if (idx === -1) all.push(next);
  else all[idx] = { ...all[idx], ...next };

  writeAllAttendance(all);
  return next;
};

export const updateCheckOut = (internId: string, dateISO: string, patch: Pick<InternAttendanceRecord, "checkOutTime" | "tasksCompleted" | "blockers">) => {
  const all = readAllAttendance();
  const idx = all.findIndex((r) => r.internId === internId && r.dateISO === dateISO);
  if (idx === -1) return null;

  const updated: InternAttendanceRecord = {
    ...all[idx],
    ...patch,
    status: "checked-out",
  };
  all[idx] = updated;
  writeAllAttendance(all);
  return updated;
};

