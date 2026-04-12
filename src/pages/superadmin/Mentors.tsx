import MentorList from "@/components/mentor/MentorList";

/**
 * Super Admin Mentor Management
 * This page uses the shared MentorList component to ensure consistent functionality
 * and UI between Admin and Super Admin roles.
 */
const Mentors = () => {
  return <MentorList />;
};

export default Mentors;
