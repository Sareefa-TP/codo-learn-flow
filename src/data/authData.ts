export const MOCK_CREDENTIALS = {
  student: { email: "student@codo.com", password: "password123" },
  intern: { email: "intern@codo.com", password: "password123" },
  tutor: { email: "tutor@codo.com", password: "password123" },
  mentor: { email: "mentor@codo.com", password: "password123" },
  admin: { email: "admin@codo.com", password: "password123" },
  finance: { email: "finance@codo.com", password: "password123" },
  superadmin: { email: "superadmin@codo.com", password: "password123" },
  coordinator: { email: "coordinator@codo.com", password: "password123" },
  advisor: { email: "advisor@codo.com", password: "password123" },
};

export const MOCK_ACCOUNT_EMAILS = Object.values(MOCK_CREDENTIALS).map((account) => account.email.toLowerCase());

export const isMockAccountEmail = (email: string) => MOCK_ACCOUNT_EMAILS.includes(email.trim().toLowerCase());
