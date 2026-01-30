import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

const roleLabels: Record<string, string> = {
  student: "Student",
  intern: "Intern",
  tutor: "Tutor",
  mentor: "Mentor",
  admin: "Admin",
  finance: "Finance",
  superadmin: "Super Admin",
};

const Login = () => {
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") || "student";
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic
    console.log("Login attempt:", { email, role });
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 py-12 lg:px-16">
        <div className="w-full max-w-md mx-auto">
          {/* Back link */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 opacity-0 animate-fade-in"
          >
            <ArrowLeft className="w-4 h-4" />
            Choose a different role
          </Link>

          {/* Logo */}
          <div className="mb-8 opacity-0 animate-fade-in" style={{ animationDelay: "50ms" }}>
            <Logo size="md" />
          </div>

          {/* Welcome text */}
          <div className="mb-8 opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              Sign in as {roleLabels[role]}
            </h1>
            <p className="text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 opacity-0 animate-fade-in" style={{ animationDelay: "150ms" }}>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 bg-card border-border/50 focus:border-primary/50"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <a
                  href="#"
                  className="text-sm text-primary hover:underline underline-offset-4"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 bg-card border-border/50 focus:border-primary/50 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 font-medium"
            >
              Sign in
            </Button>
          </form>

          {/* Sign up link */}
          <p className="mt-8 text-center text-sm text-muted-foreground opacity-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
            Don't have an account?{" "}
            <a
              href="#"
              className="text-primary hover:underline underline-offset-4"
            >
              Contact your administrator
            </a>
          </p>
        </div>
      </div>

      {/* Right side - Visual */}
      <div className="hidden lg:flex flex-1 bg-secondary items-center justify-center p-12">
        <div className="max-w-md text-center opacity-0 animate-scale-in" style={{ animationDelay: "200ms" }}>
          {/* Illustration placeholder */}
          <div className="w-64 h-64 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <div className="w-32 h-32 rounded-2xl bg-primary/30 flex items-center justify-center">
              <div className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-8 h-8 text-primary-foreground"
                >
                  <path
                    d="M12 4C7.58 4 4 7.58 4 12s3.58 8 8 8c1.85 0 3.55-.63 4.9-1.69"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path d="M14 8l4 2-4 2-4-2 4-2z" fill="currentColor" />
                  <path
                    d="M14 12v3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-foreground mb-3">
            Your learning journey starts here
          </h2>
          <p className="text-muted-foreground">
            Access courses, track your progress, connect with mentors, and achieve your goals with CODO Academy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
