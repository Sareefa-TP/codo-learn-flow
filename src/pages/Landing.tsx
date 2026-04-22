import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import { ArrowRight, BookOpen, Users, Award, Sparkles } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: BookOpen,
      title: "Learn",
      description: "Access structured courses with expert tutors and comprehensive materials",
    },
    {
      icon: Users,
      title: "Intern",
      description: "Gain real-world experience with guided internship programs",
    },
    {
      icon: Award,
      title: "Grow",
      description: "Track your progress and earn certificates that matter",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-primary/20 selection:text-primary">
      {/* Header - Sticky with Glassmorphism */}
      <header className="sticky top-0 z-50 w-full px-6 py-4 flex items-center justify-between border-b border-border/40 bg-background/80 backdrop-blur-md transition-all">
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate("/")}>
          <Logo size="md" />
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/login")}
            className="text-muted-foreground hover:text-foreground font-medium rounded-xl hover:bg-slate-100 transition-colors hidden sm:flex"
          >
            Sign In
          </Button>
          <Button 
            onClick={() => navigate("/login")}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold rounded-xl px-6 h-10 shadow-lg shadow-primary/20"
          >
            Join Now
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center">
        {/* Banner with subtle gradient background */}
        <section className="w-full relative overflow-hidden flex flex-col items-center justify-center px-6 py-16 md:py-32 lg:py-40">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-70" />
          
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold border border-primary/10 mb-4 animate-scale-in">
              <Sparkles className="w-4 h-4 fill-primary/20" />
              <span className="uppercase tracking-wider text-[10px]">Education & Internship Platform</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Learn. Intern. Grow.
              <span className="block text-slate-400 mt-2 italic font-serif opacity-90">
                All in one platform.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
              CODO Academy brings together structured learning, hands-on internships, 
              and career growth — designed to help you succeed at every step.
            </p>

            {/* CTA Group */}
            <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in stagger-3">
              <Button 
                size="lg" 
                onClick={() => navigate("/login")}
                className="w-full sm:w-auto h-14 px-10 text-base font-black gap-2 group rounded-2xl shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-1"
              >
                Get Started
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button 
                variant="outline"
                size="lg"
                onClick={() => navigate("/login")}
                className="w-full sm:w-auto h-14 px-10 text-base font-bold rounded-2xl border-slate-200 hover:bg-slate-50 transition-all"
              >
                Sign In
              </Button>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="w-full px-6 py-16 md:py-24 bg-slate-50/50 border-y border-slate-100">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {features.map((feature, idx) => (
                <div 
                  key={feature.title}
                  className={`group p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:border-primary/20 transition-all duration-300 animate-fade-in stagger-${idx + 4}`}
                >
                  <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mb-6 group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-300">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-slate-500 font-medium leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="mt-6 w-10 h-1 bg-slate-100 group-hover:w-full group-hover:bg-primary/30 transition-all duration-500 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full px-6 py-12 border-t border-slate-100 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-sm font-medium text-slate-500">
          <div className="flex flex-col items-center md:items-start gap-4 text-center md:text-left">
            <Logo size="sm" />
            <p>© 2025 CODO Academy. Built for the next generation of creators.</p>
          </div>
          <div className="flex items-center gap-8">
            <a href="#" className="hover:text-primary transition-colors">About</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
