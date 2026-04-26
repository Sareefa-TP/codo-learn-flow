import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <Button variant="outline" onClick={() => navigate("/")} className="rounded-xl">
          Back to Home
        </Button>
        <div className="rounded-3xl border border-border/60 bg-card p-6 sm:p-10 shadow-soft">
          <h1 className="text-3xl font-bold tracking-tight">About CODO Academy</h1>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            CODO Academy is a modern learning and internship platform built to help learners gain practical
            skills, work on real projects, and transition confidently into careers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
