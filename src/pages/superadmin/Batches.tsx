import BatchList from "@/components/batch/BatchList";

/**
 * Super Admin Batch Management
 * This page uses the shared BatchList component to ensure consistent functionality
 * and UI between Admin and Super Admin roles.
 */
const Batches = () => {
  return <BatchList />;
};

export default Batches;
