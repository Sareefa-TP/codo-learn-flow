import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  FileText, 
  BarChart3, 
  Calendar, 
  BookOpen,
  Award,
  CheckCircle2,
  AlertCircle,
  TrendingUp
} from "lucide-react";

const AssessmentReport = () => {
  const navigate = useNavigate();

  // Mock data (matching Dashboard.tsx sources)
  const assessmentData = {
    name: "Pre Assessment",
    courseName: "Full Stack Development",
    score: "85%",
    status: "Passed",
    date: "10 Feb 2026",
    details: {
      totalQuestions: 50,
      correctAnswers: 42,
      accuracy: "84%",
      sections: [
        { name: "Frontend Basics", score: "90%" },
        { name: "JavaScript Fundamentals", score: "80%" },
        { name: "React Components", score: "85%" }
      ]
    }
  };

  const getAttendanceColor = (pct: number) => {
    if (pct >= 90) return "bg-green-500";
    if (pct >= 75) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6 max-w-6xl mx-auto px-4 md:px-6 lg:px-8 pb-10">
        {/* Navigation Header */}
        <div className="flex flex-col gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/student')}
            className="w-fit text-muted-foreground hover:text-primary -ml-2 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                <FileText className="w-8 h-8 text-primary" />
                Assessment Report
              </h1>
              <p className="text-muted-foreground font-medium">Detailed performance analysis for your recent assessment.</p>
            </div>
            <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-xl border border-primary/10">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold">{assessmentData.date}</span>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <Card className="shadow-xl border-primary/5 overflow-hidden bg-card/50 backdrop-blur-sm">
          {/* Summary Header */}
          <div className="p-8 border-b border-primary/5 bg-slate-50/30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4 text-center md:text-left">
                <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1 font-bold text-xs uppercase tracking-wider">
                  {assessmentData.name}
                </Badge>
                <h2 className="text-4xl font-black text-foreground">{assessmentData.courseName}</h2>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                   <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                    <BookOpen className="w-4 h-4 text-primary" />
                    Student View
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 flex flex-col items-center justify-center text-center">
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Final Score</p>
                  <p className="text-4xl font-black">{assessmentData.score}</p>
                </div>
                <div className="p-6 rounded-2xl bg-white border border-slate-200 flex flex-col items-center justify-center text-center shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Status</p>
                  <Badge className="bg-green-500 hover:bg-green-600 border-none font-black px-4 py-1.5 text-xs">
                    {assessmentData.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <CardContent className="p-8 space-y-10">
            {/* Stats Breakdown */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold flex items-center gap-2 text-foreground">
                <BarChart3 className="w-5 h-5 text-primary" />
                Performance Metrics
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center gap-2 group hover:border-primary/20 transition-all shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Questions</p>
                    <p className="text-2xl font-black">{assessmentData.details.totalQuestions}</p>
                  </div>
                </div>
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center gap-2 group hover:border-green-500/20 transition-all shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Correct Answers</p>
                    <p className="text-2xl font-black text-green-600">{assessmentData.details.correctAnswers}</p>
                  </div>
                </div>
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center gap-2 group hover:border-primary/20 transition-all shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Test Accuracy</p>
                    <p className="text-2xl font-black text-primary">{assessmentData.details.accuracy}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section Breakdown */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold flex items-center gap-2 text-foreground">
                <Award className="w-5 h-5 text-primary" />
                Section-wise Performance
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {assessmentData.details.sections.map((section, idx) => (
                  <div 
                    key={idx} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-white border border-slate-100 hover:border-primary/20 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center gap-4 mb-3 sm:mb-0">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                        <span className="text-sm font-bold text-primary">{idx + 1}</span>
                      </div>
                      <div>
                        <span className="text-sm font-bold text-foreground block">{section.name}</span>
                        <span className="text-[11px] text-muted-foreground font-medium uppercase">Domain Knowledge Area</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden hidden md:block">
                        <div 
                          className="h-full bg-primary transition-all duration-1000"
                          style={{ width: section.score }}
                        />
                      </div>
                      <Badge variant="outline" className="font-black border-primary/20 text-primary bg-primary/5 min-w-[60px] justify-center py-1.5">
                        {section.score}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>

          {/* Footer Navigation */}
          <div className="p-8 border-t border-primary/5 bg-slate-50/30 text-center space-y-6">
            <div className="inline-flex items-center gap-2 p-3 bg-blue-50/50 rounded-xl text-xs text-blue-700 font-bold border border-blue-100 shadow-sm">
              <AlertCircle className="w-4 h-4" />
              This is an official assessment record from Codo Academy
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                onClick={() => navigate('/student')}
                variant="outline"
                className="font-bold border-primary/20 hover:bg-primary/5 hover:text-primary min-w-[200px]"
              >
                Back to Dashboard
              </Button>
              <Button 
                onClick={() => window.print()}
                className="font-bold min-w-[200px] shadow-lg shadow-primary/10"
              >
                Download PDF Report
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AssessmentReport;
