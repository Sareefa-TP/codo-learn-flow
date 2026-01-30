import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const roleLabels: Record<string, string> = {
  student: "Student",
  intern: "Intern",
  tutor: "Tutor",
  mentor: "Mentor",
  admin: "Admin",
  finance: "Finance",
  superadmin: "Super Admin",
};

const roleColors: Record<string, string> = {
  student: "bg-role-student",
  intern: "bg-role-intern",
  tutor: "bg-role-tutor",
  mentor: "bg-role-mentor",
  admin: "bg-role-admin",
  finance: "bg-role-finance",
  superadmin: "bg-role-superadmin",
};

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

const Login = () => {
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") || "student";
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!email.trim()) {
      newErrors.email = "Please enter your email address";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Please enter your password";
    } else if (password.length < 6) {
      newErrors.password = "Password should be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    // Simulate login attempt
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // For demo, show a gentle error
    setErrors({
      general: "We couldn't find an account with those credentials. Please try again.",
    });
    setIsSubmitting(false);
  };

  const clearFieldError = (field: keyof FormErrors) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      {/* Login card */}
      <div className="w-full max-w-md">
        {/* Back link - outside card */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 opacity-0 animate-fade-in"
        >
          <ArrowLeft className="w-4 h-4" />
          Choose a different role
        </Link>

        {/* Card */}
        <div
          className="bg-card rounded-2xl shadow-soft border border-border/50 p-8 opacity-0 animate-scale-in"
          style={{ animationDelay: "50ms" }}
        >
          {/* Role indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className={cn("w-2 h-2 rounded-full", roleColors[role])} />
            <span className="text-sm text-muted-foreground">
              Signing in as {roleLabels[role]}
            </span>
          </div>

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Logo size="lg" />
          </div>

          {/* Welcome text */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-foreground mb-1">
              Welcome back
            </h1>
            <p className="text-muted-foreground">
              Glad to see you again
            </p>
          </div>

          {/* General error message */}
          {errors.general && (
            <div className="mb-6 p-4 rounded-xl bg-warning-muted border border-warning/20 flex items-start gap-3 animate-fade-in">
              <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
              <p className="text-sm text-foreground">{errors.general}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearFieldError("email");
                }}
                className={cn(
                  "h-12 bg-background border-border/50 focus:border-primary/50 transition-colors",
                  errors.email && "border-warning/50 focus:border-warning/50"
                )}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <p
                  id="email-error"
                  className="text-sm text-warning flex items-center gap-1.5 mt-1.5 animate-fade-in"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <a
                  href="#"
                  className="text-sm text-primary hover:underline underline-offset-4 transition-colors"
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
                  onChange={(e) => {
                    setPassword(e.target.value);
                    clearFieldError("password");
                  }}
                  className={cn(
                    "h-12 bg-background border-border/50 focus:border-primary/50 pr-10 transition-colors",
                    errors.password && "border-warning/50 focus:border-warning/50"
                  )}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p
                  id="password-error"
                  className="text-sm text-warning flex items-center gap-1.5 mt-1.5 animate-fade-in"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.password}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 font-medium text-base"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          {/* Sign up link */}
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <a
              href="#"
              className="text-primary hover:underline underline-offset-4 transition-colors"
            >
              Contact your administrator
            </a>
          </p>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-muted-foreground opacity-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
          By signing in, you agree to our{" "}
          <a href="#" className="text-primary hover:underline underline-offset-4">
            Terms
          </a>{" "}
          and{" "}
          <a href="#" className="text-primary hover:underline underline-offset-4">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
