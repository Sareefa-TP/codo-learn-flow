import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import HeroScene from "@/components/landing/HeroScene";
import { ArrowRight, BookOpen, Mail, Orbit, Sparkles, Target, TrendingUp, Users } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileQuery = window.matchMedia("(max-width: 768px)");

    const updateFlags = () => {
      setReducedMotion(motionQuery.matches || mobileQuery.matches);
    };

    updateFlags();
    motionQuery.addEventListener("change", updateFlags);
    mobileQuery.addEventListener("change", updateFlags);

    return () => {
      motionQuery.removeEventListener("change", updateFlags);
      mobileQuery.removeEventListener("change", updateFlags);
    };
  }, []);

  const pillars = [
    {
      icon: BookOpen,
      title: "Guided Learning",
      description: "Structured cohorts, clear milestones, and mentor-backed resources that build job-ready skills.",
    },
    {
      icon: Users,
      title: "Industry Internships",
      description: "Work on real deliverables with expert feedback loops that mirror modern team workflows.",
    },
    {
      icon: TrendingUp,
      title: "Career Growth",
      description: "Measure progress, showcase achievements, and move with confidence into high-impact roles.",
    },
  ];

  const highlights = [
    {
      metric: "12k+",
      label: "Active Learners",
    },
    {
      metric: "450+",
      label: "Hiring Partners",
    },
    {
      metric: "92%",
      label: "Program Completion",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
          <button className="group flex items-center gap-2" onClick={() => navigate("/")} aria-label="Go to homepage">
            <Logo size="md" tone="dark" />
          </button>

          <div className="hidden items-center gap-8 text-sm font-semibold text-muted-foreground md:flex">
            <a href="#experience" className="transition-colors hover:text-foreground">
              Experience
            </a>
            <a href="#pillars" className="transition-colors hover:text-foreground">
              Platform
            </a>
            <a href="#impact" className="transition-colors hover:text-foreground">
              Impact
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigate("/login")}
              className="rounded-xl bg-primary px-6 font-semibold text-primary-foreground shadow-emerald transition-all hover:-translate-y-0.5 hover:bg-primary/90"
            >
              Join Now
            </Button>
          </div>
        </div>
      </header>

      <main className="overflow-hidden">
        <section id="experience" className="relative isolate px-6 pb-20 pt-12 md:pt-20">
          <HeroScene reducedMotion={reducedMotion} />

          <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="animate-cinematic-in space-y-8">
              <div className="landing-glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                <Sparkles className="h-4 w-4" />
                Education & Internship Platform
              </div>

              <h1 className="landing-hero-title relative z-10 text-balance text-4xl leading-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Learn. Intern. Grow.
                <span className="landing-hero-subtitle mt-2 block">All in one platform.</span>
              </h1>

              <p className="max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                CODO Academy brings structured learning, real-world internship execution, and clear career pathways into one
                cohesive experience.
              </p>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Button
                  size="lg"
                  onClick={() => navigate("/login")}
                  className="group h-14 rounded-2xl px-8 text-base font-semibold shadow-emerald transition-all hover:-translate-y-1 hover:shadow-[0_18px_34px_hsl(158_65%_22%_/_0.28)]"
                >
                  Get Started
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>

              <div className="grid max-w-xl grid-cols-3 gap-4 pt-3">
                {highlights.map((item) => (
                  <div key={item.label} className="landing-glass rounded-2xl px-4 py-3">
                    <p className="text-2xl font-bold text-foreground">{item.metric}</p>
                    <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden justify-end lg:flex">
              <div className="landing-glass animate-float-soft relative w-full max-w-md rounded-[2rem] border border-primary/20 p-8">
                <div className="absolute -left-8 -top-8 rounded-2xl border border-primary/20 bg-background/80 p-4 backdrop-blur-lg">
                  <Orbit className="h-5 w-5 text-primary" />
                </div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Realtime Progress</p>
                <h3 className="mt-2 font-display text-3xl text-foreground">Adaptive Journey</h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Personalized learning + internship checkpoints evolve based on pace, strengths, and target outcomes.
                </p>
                <div className="mt-8 space-y-3">
                  <div className="landing-progress h-2 w-full rounded-full bg-primary/10">
                    <span className="block h-full w-[82%] rounded-full bg-primary" />
                  </div>
                  <div className="landing-progress h-2 w-full rounded-full bg-primary/10">
                    <span className="block h-full w-[68%] rounded-full bg-emerald-400" />
                  </div>
                  <div className="landing-progress h-2 w-full rounded-full bg-primary/10">
                    <span className="block h-full w-[91%] rounded-full bg-teal-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="pillars" className="relative px-6 py-16 md:py-24">
          <div className="mx-auto w-full max-w-7xl">
            <div className="mb-10 max-w-2xl animate-cinematic-in">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Built for Momentum</p>
              <h2 className="mt-3 font-display text-3xl text-foreground sm:text-4xl">A platform designed for outcomes, not noise.</h2>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {pillars.map((pillar, idx) => (
                <article
                  key={pillar.title}
                  className={`landing-card animate-cinematic-in rounded-3xl border border-border/60 p-8 shadow-soft delay-${(idx + 1) * 100}`}
                >
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <pillar.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-2xl font-semibold text-foreground">{pillar.title}</h3>
                  <p className="mt-4 text-base leading-relaxed text-muted-foreground">{pillar.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="impact" className="px-6 py-20">
          <div className="mx-auto grid w-full max-w-7xl gap-8 rounded-[2rem] border border-border/70 bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/40 p-8 md:grid-cols-3 md:p-10">
            <div className="md:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Execution Focused</p>
              <h3 className="mt-3 font-display text-3xl text-foreground md:text-4xl">From guided education to measurable career velocity.</h3>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
                We combine curriculum, internships, and mentorship into one continuous loop so learners keep advancing with clarity.
              </p>
            </div>

            <div className="space-y-4">
              <div className="landing-glass rounded-2xl p-4">
                <div className="mb-2 flex items-center gap-2 text-primary">
                  <Target className="h-5 w-5" />
                  <span className="text-sm font-semibold">Roadmap Precision</span>
                </div>
                <p className="text-sm text-muted-foreground">Weekly goals, live reviews, and actionable checkpoints.</p>
              </div>
              <div className="landing-glass rounded-2xl p-4">
                <div className="mb-2 flex items-center gap-2 text-primary">
                  <Sparkles className="h-5 w-5" />
                  <span className="text-sm font-semibold">Mentor Feedback</span>
                </div>
                <p className="text-sm text-muted-foreground">Fast, high-signal evaluations from industry practitioners.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative border-t border-border/60 px-6 py-14">
        <div className="footer-background-glow" />
        <div className="mx-auto grid w-full max-w-7xl gap-10 rounded-[2rem] border border-border/60 bg-background/80 p-8 shadow-soft backdrop-blur-xl md:grid-cols-[1.15fr_0.85fr] md:p-10">
          <div className="space-y-5">
            <Logo size="md" tone="dark" />
            <p className="max-w-md text-base leading-relaxed text-muted-foreground">
              Build practical skills, work on real projects, and grow with mentors inside one modern learning ecosystem.
            </p>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Mail className="h-4 w-4" />
              hello@codoacademy.com
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 text-sm sm:grid-cols-2">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary">Company</p>
              <div className="flex flex-col items-start gap-3 text-muted-foreground">
                <button className="footer-link">About</button>
                <button className="footer-link">Contact</button>
                <button className="footer-link">Careers</button>
              </div>
            </div>
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary">Legal</p>
              <div className="flex flex-col items-start gap-3 text-muted-foreground">
                <button className="footer-link">Privacy</button>
                <button className="footer-link">Terms</button>
                <button className="footer-link">Cookies</button>
              </div>
            </div>
          </div>

          <div className="border-t border-border/60 pt-6 text-sm text-muted-foreground md:col-span-2 md:flex md:items-center md:justify-between">
            <p>© 2026 CODO Academy. Built for ambitious learners.</p>
            <p className="mt-3 text-xs uppercase tracking-[0.14em] text-muted-foreground/80 md:mt-0">Learn • Intern • Grow</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
