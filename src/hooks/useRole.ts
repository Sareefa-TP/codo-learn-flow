import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { UserRole, getNavigationByRole, roleDisplayInfo } from "@/config/navigation";

export const useRole = () => {
  const location = useLocation();
  const [role, setRole] = useState<UserRole>("student");

  useEffect(() => {
    // Determine role from URL path
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const roleFromPath = pathSegments[0] as UserRole;

    if (roleFromPath && ["student", "intern", "tutor", "mentor", "admin", "finance", "superadmin"].includes(roleFromPath)) {
      setRole(roleFromPath);
      sessionStorage.setItem("selectedRole", roleFromPath);
    } else {
      // Fallback to session storage
      const storedRole = sessionStorage.getItem("selectedRole") as UserRole;
      if (storedRole) {
        setRole(storedRole);
      }
    }
  }, [location.pathname]);

  const navigation = getNavigationByRole(role);
  const displayInfo = roleDisplayInfo[role];

  return {
    role,
    navigation,
    displayInfo,
    isRole: (checkRole: UserRole) => role === checkRole,
  };
};
