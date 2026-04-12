/** Stable display mentor when none is stored (e.g. legacy rows). */
export const DEFAULT_MENTOR_NAMES = [
  "Elena Rodriguez",
  "Michael Chen",
  "James Kumar",
  "Priya Sharma",
  "Ananya Iyer",
] as const;

export function defaultMentorNameForStudentId(id: string): string {
  const m = id.match(/\d+/);
  const n = m ? parseInt(m[0], 10) : 0;
  return DEFAULT_MENTOR_NAMES[n % DEFAULT_MENTOR_NAMES.length];
}
