import { useNavigate } from "react-router-dom";
import {
  GraduationCap,
  Briefcase,
  BookOpen,
  Users,
  Shield,
  Wallet,
  Crown,
} from "lucide-react";
import RoleCard from "@/components/RoleCard";
import Logo from "@/components/Logo";

const roles = [
  {
    id: "student",
    icon: GraduationCap,
    title: "Student",
    description: "Access courses, track progress, and earn certifications",
    colorClass: "bg-role-student",
  },
  {
    id: "intern",
    icon: Briefcase,
    title: "Intern",
    description: "Manage internship tasks, submit reports, and get feedback",
    colorClass: "bg-role-intern",
  },
  {
    id: "tutor",
    icon: BookOpen,
    title: "Tutor",
    description: "Create content, conduct sessions, and guide learners",
    colorClass: "bg-role-tutor",
  },
  {
    id: "mentor",
    icon: Users,
    title: "Mentor",
    description: "Support interns, review work, and provide career guidance",
    colorClass: "bg-role-mentor",
  },
  {
    id: "admin",
    icon: Shield,
    title: "Admin",
    description: "Manage users, courses, and platform operations",
    colorClass: "bg-role-admin",
  },
  {
    id: "finance",
    icon: Wallet,
    title: "Finance",
    description: "Handle payments, invoices, and financial reporting",
    colorClass: "bg-role-finance",
  },
  {
    id: "superadmin",
    icon: Crown,
    title: "Super Admin",
    description: "Full system access with advanced configuration controls",
    colorClass: "bg-role-superadmin",
  },
];

const RoleSelection = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (roleId: string) => {
    // Store selected role and navigate to login
    sessionStorage.setItem("selectedRole", roleId);
    navigate(`/login?role=${roleId}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="w-full py-6 px-8">
        <Logo size="md" />
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Welcome text */}
        <div className="text-center mb-12 opacity-0 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-3">
            Welcome to CODO Academy
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto">
            Select your role to continue. You're just one step away from your learning journey.
          </p>
        </div>

        {/* Role cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl w-full">
          {roles.map((role, index) => (
            <RoleCard
              key={role.id}
              icon={role.icon}
              title={role.title}
              description={role.description}
              colorClass={role.colorClass}
              onClick={() => handleRoleSelect(role.id)}
              animationDelay={index * 50}
            />
          ))}
        </div>

        {/* Helper text */}
        <p className="mt-12 text-sm text-muted-foreground opacity-0 animate-fade-in" style={{ animationDelay: "400ms" }}>
          Not sure which role fits you?{" "}
          <a
            href="#"
            className="text-primary hover:underline underline-offset-4 transition-colors"
          >
            Learn more about roles
          </a>
        </p>
      </main>

      {/* Footer */}
      <footer className="py-6 px-8 text-center">
        <p className="text-sm text-muted-foreground">
          © 2026 CODO Academy. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default RoleSelection;
