import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <Button variant="outline" onClick={() => navigate("/")} className="rounded-xl">
          Back to Home
        </Button>
        <div className="rounded-3xl border border-border/60 bg-card p-6 sm:p-10 shadow-soft">
          <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            By using CODO Academy, you agree to follow platform rules, maintain academic integrity, and use all
            learning resources responsibly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
