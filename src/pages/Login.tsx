import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Info,
  GraduationCap,
  Briefcase,
  BookOpen,
  Users,
  Shield,
  Wallet,
  Crown,
  Settings,
  LifeBuoy
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { MOCK_CREDENTIALS } from "@/data/authData";

const roleConfig: Record<string, { label: string; color: string; icon: any }> = {
  student: { label: "Student", color: "bg-role-student", icon: GraduationCap },
  intern: { label: "Intern", color: "bg-role-intern", icon: Briefcase },
  tutor: { label: "Tutor", color: "bg-role-tutor", icon: BookOpen },
  mentor: { label: "Mentor", color: "bg-role-mentor", icon: Users },
  admin: { label: "Admin", color: "bg-role-admin", icon: Shield },
  finance: { label: "Finance", color: "bg-role-finance", icon: Wallet },
  superadmin: { label: "Super Admin", color: "bg-role-superadmin", icon: Crown },
  coordinator: { label: "Coordinator", color: "bg-role-coordinator", icon: Settings },
  advisor: { label: "Advisor", color: "bg-role-advisor", icon: LifeBuoy },
};

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

const Login = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialRole = (searchParams.get("role") || "student") as keyof typeof MOCK_CREDENTIALS;
  
  const [activeRole, setActiveRole] = useState<keyof typeof MOCK_CREDENTIALS>(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill email and password based on role selection for convenience
  useEffect(() => {
    const mock = MOCK_CREDENTIALS[activeRole];
    if (mock) {
      setEmail(mock.email);
      setPassword(mock.password);
    }
    setErrors({});
  }, [activeRole]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!email.trim()) {
      newErrors.email = "Please enter your email address";
    }

    if (!password) {
      newErrors.password = "Please enter your password";
    }

    // Validate against mock credentials
    if (Object.keys(newErrors).length === 0) {
      const mock = MOCK_CREDENTIALS[activeRole];
      if (mock && (email !== mock.email || password !== mock.password)) {
        newErrors.general = "Invalid credentials for this role. Use the mock accounts provided.";
      }
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
    await new Promise((resolve) => setTimeout(resolve, 800));

    setIsSubmitting(false);
    // Navigate to the role-specific dashboard
    sessionStorage.setItem("selectedRole", activeRole);
    
    // Direct routing
    navigate(`/${activeRole}`);
  };

  const clearFieldError = (field: keyof FormErrors) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 sm:p-12">
      {/* Login card container */}
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden animate-scale-in">
        
        {/* Left Side: Role Selector */}
        <div className="bg-slate-50/50 p-8 flex flex-col border-r border-slate-100">
          <div className="mb-8">
            <h2 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Select Your Role</h2>
            <p className="text-slate-500 text-sm font-medium">Choose a role to sign in with mock data</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {Object.entries(roleConfig).map(([id, config]) => {
              const Icon = config.icon;
              const isActive = activeRole === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveRole(id as any)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border transition-all duration-300",
                    isActive 
                      ? cn("border-primary/20 shadow-md ring-2 ring-primary/20", config.color)
                      : "bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-transform",
                    isActive ? "scale-110" : "bg-slate-100"
                  )}>
                    <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-400")} />
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-wider text-center line-clamp-1",
                    isActive ? "text-white" : "text-slate-500"
                  )}>
                    {config.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-auto pt-8 border-t border-slate-200/60">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-100">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Info className="w-5 h-5 text-primary" />
              </div>
              <div className="text-[11px] leading-relaxed">
                <p className="font-bold text-slate-900 mb-0.5 uppercase tracking-wide">Developer Tip</p>
                <p className="text-slate-500 font-medium">Mock credentials are pre-filled automatically for your convenience.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Sign In Form */}
        <div className="p-8 sm:p-10 flex flex-col justify-center">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Logo size="lg" />
          </div>

          {/* Welcome text */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">
              Welcome back
            </h1>
            <p className="text-slate-500 font-medium">
              Signing in as <span className="text-primary font-bold">{roleConfig[activeRole]?.label}</span>
            </p>
          </div>

          {/* General error message */}
          {errors.general && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-600 font-bold">{errors.general}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">
                Email Address
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
                  "h-12 bg-slate-50/50 border-slate-200/60 focus:bg-white focus:border-primary/50 transition-all rounded-xl font-medium",
                  errors.email && "border-red-400 ring-red-50"
                )}
              />
              {errors.email && (
                <p className="text-xs text-red-500 font-bold ml-1 animate-fade-in">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-slate-500">
                  Password
                </Label>
                <a href="#" className="text-xs font-bold text-primary hover:underline transition-colors">
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    clearFieldError("password");
                  }}
                  className={cn(
                    "h-12 bg-slate-50/50 border-slate-200/60 focus:bg-white focus:border-primary/50 pr-10 transition-all rounded-xl font-medium",
                    errors.password && "border-red-400 ring-red-50"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 font-bold ml-1 animate-fade-in">{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-14 font-black text-base uppercase tracking-widest rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-0.5 active:scale-95"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Authenticating..." : "Sign In"}
            </Button>
          </form>

          {/* Social proof or alternative contact */}
          <p className="mt-10 text-center text-xs font-medium text-slate-400">
            Need access? <a href="#" className="text-primary font-bold hover:underline">Contact Administrator</a>
          </p>
        </div>
      </div>

      <Link
        to="/"
        className="mt-8 flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>
    </div>
  );
};

export default Login;
