import { FormEvent, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Mail, Send } from "lucide-react";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MOCK_ACCOUNT_EMAILS, isMockAccountEmail } from "@/data/authData";
import { cn } from "@/lib/utils";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const suggestedEmails = useMemo(() => MOCK_ACCOUNT_EMAILS.slice(0, 4), []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      setError("Please enter your email address.");
      setSuccessMessage("");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccessMessage("");

    await new Promise((resolve) => setTimeout(resolve, 900));

    if (!isMockAccountEmail(trimmedEmail)) {
      setError("Email not found in mock data. Try one of the sample mock accounts below.");
      setIsSubmitting(false);
      return;
    }

    setSuccessMessage("Reset link sent (mock). Check your inbox to continue.");
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 sm:p-10">
      <div className="w-full max-w-xl rounded-3xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/50 sm:p-10">
        <div className="mb-8 flex justify-center">
          <Logo size="lg" />
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Forgot Password</h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            Enter your account email and we will send a reset link (mock flow).
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="forgot-email" className="ml-1 text-xs font-black uppercase tracking-widest text-slate-500">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="forgot-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (error) setError("");
                }}
                className={cn(
                  "h-12 rounded-xl border-slate-200/70 bg-slate-50/70 pl-10 font-medium transition-all focus:border-primary/60 focus:bg-white",
                  error && "border-red-400 ring-red-50"
                )}
              />
            </div>
            {error && <p className="ml-1 text-xs font-semibold text-red-500">{error}</p>}
          </div>

          <Button type="submit" className="h-12 w-full rounded-2xl font-black uppercase tracking-wider" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Reset Link"}
            {!isSubmitting && <Send className="ml-2 h-4 w-4" />}
          </Button>
        </form>

        {successMessage && (
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-emerald-700">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
            <p className="text-sm font-semibold">{successMessage}</p>
          </div>
        )}

        <div className="mt-7 rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">Mock account emails</p>
          <p className="mt-2 text-xs leading-relaxed text-slate-500">
            {suggestedEmails.join(" • ")}
          </p>
        </div>

        <Link
          to="/login"
          className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition-colors hover:text-slate-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
