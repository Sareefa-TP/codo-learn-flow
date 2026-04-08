import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  UserCircle2, 
  Users2, 
  Star, 
  Plus, 
  History,
  Send,
  ArrowLeft,
  Search,
  Filter,
  Clock,
  MoreVertical,
  X,
  Eye,
  ChevronDown
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FeedbackEntry {
  id: string;
  type: "to_tutor" | "to_mentor" | "from_tutor" | "from_mentor";
  author: string;
  rating?: number;
  message: string;
  date: string;
  status?: "Pending" | "Read";
}

const mockFeedback: FeedbackEntry[] = [
  {
    id: "1",
    type: "from_tutor",
    author: "Dr. Sarah Johnson",
    rating: 5,
    message: "Excellent progress in the React module! Your understanding of hooks is impressive.",
    date: "2024-03-25",
    status: "Read"
  },
  {
    id: "2",
    type: "from_mentor",
    author: "Michael Chen",
    rating: 4,
    message: "Good work on the recent project. Focus more on state management best practices.",
    date: "2024-03-24",
    status: "Read"
  },
  {
    id: "3",
    type: "to_tutor",
    author: "You",
    rating: 5,
    message: "The explanation of Redux was very clear. Thank you!",
    date: "2024-03-20"
  }
];

const StudentFeedback = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<FeedbackEntry[]>(mockFeedback);
  const [activeTab, setActiveTab] = useState("my-teacher");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedTutor, setSelectedTutor] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackEntry | null>(null);

  const tabMapping: Record<string, FeedbackEntry["type"]> = {
    "my-teacher": "to_tutor",
    "my-mentor": "to_mentor",
    "from-teacher": "from_tutor",
    "from-mentor": "from_mentor",
  };

  const currentType = tabMapping[activeTab];

  const filteredEntries = entries.filter(entry => 
    entry.type === currentType &&
    entry.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = () => {
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    const newEntry: FeedbackEntry = {
      id: Math.random().toString(36).substr(2, 9),
      type: currentType.startsWith("to_") ? currentType : "to_tutor", // Default to tutor if on "from" tab
 author: "You",
      rating,
      message,
      date: new Date().toISOString().split('T')[0],
    };

    setEntries([newEntry, ...entries]);
    setEntries([newEntry, ...entries]);
    setIsModalOpen(false);
    setMessage("");
    setRating(5);
    setSelectedCourse("");
    setSelectedTutor("");
    toast.success(`Feedback sent successfully`);
  };

  return (
    <>
      <DashboardLayout>
        <div className="animate-fade-in max-w-6xl mx-auto px-4 md:px-6 lg:px-8 pb-20">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pt-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
                Feedback
              </h1>
            </div>
          </div>

          {/* Standardized Search Bar (matches Student → Exam exactly) */}
          <div className="relative mb-10 group animate-in fade-in slide-in-from-top-4 duration-700 delay-100">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-all duration-300" />
            <input
              type="text"
              placeholder="Search feedback..."
              className="w-full bg-card border border-border/60 rounded-[1.25rem] py-4 pl-12 pr-6 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm placeholder:text-muted-foreground/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Tab-based Navigation */}
          <div className="bg-slate-50/50 p-1.5 rounded-[1.5rem] border border-border/40 mb-8 w-full">
            <div className="grid grid-cols-4 gap-1 sm:gap-2">
              {[
                { id: "my-teacher", label: "My Teacher" },
                { id: "my-mentor", label: "My Mentor" },
                { id: "from-teacher", label: "From Teacher" },
                { id: "from-mentor", label: "From Mentor" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "px-2 sm:px-4 py-3 rounded-2xl text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 text-center flex items-center justify-center h-full",
                    activeTab === tab.id 
                      ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]" 
                      : "text-muted-foreground hover:bg-white hover:text-foreground"
                  )}
                >
                  <span className="truncate sm:whitespace-normal">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="bg-card rounded-[2.5rem] border border-border/40 shadow-xl shadow-slate-200/50 min-h-[500px] overflow-hidden flex flex-col">
            <div className="p-8 pb-4 flex items-center justify-between border-b border-border/20 bg-muted/5">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2 capitalize">
                  <History className="w-5 h-5 text-primary" />
                  {activeTab.replace(/-/g, ' ')} Feedbacks
                </h2>
                <p className="text-xs text-muted-foreground font-medium mt-1">
                  Total {filteredEntries.length} Records Found
                </p>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </div>

            <CardContent className="p-8 flex-1">
              {filteredEntries.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {filteredEntries.map((entry) => (
                    <Card key={entry.id} className="border-border/40 bg-slate-50/30 hover:bg-white hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 rounded-3xl overflow-hidden group">
                      <CardContent className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        {/* Left: Author */}
                        <div className="flex items-center gap-3 w-48 shrink-0">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 transition-transform group-hover:scale-110 duration-500">
                            {entry.type.includes("tutor") ? <UserCircle2 className="w-5 h-5" /> : <Users2 className="w-5 h-5" />}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-tight">Author</p>
                            <p className="text-sm font-bold text-foreground truncate">{entry.author}</p>
                          </div>
                        </div>

                        {/* Center: Feedback & Rating */}
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={cn("w-3.5 h-3.5", i < (entry.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-muted/20")} />
                            ))}
                          </div>
                          <div className="relative">
                            <span className="absolute -left-1 -top-1 text-2xl text-primary/10 font-serif leading-none">"</span>
                            <p className="text-sm text-foreground/80 leading-relaxed line-clamp-2 italic pl-3 relative z-10">
                              {entry.message}
                            </p>
                          </div>
                        </div>

                        {/* Right: Date & Actions */}
                        <div className="flex items-center gap-4 shrink-0 justify-between md:justify-end w-full md:w-auto">
                          <Badge variant="outline" className="rounded-lg text-[10px] border-border/60 font-bold uppercase py-1 px-3 whitespace-nowrap bg-background shadow-sm">
                            {entry.date}
                          </Badge>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-9 text-xs px-4 gap-2 rounded-lg border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-all"
                              onClick={() => {
                                setSelectedFeedback(entry);
                                setIsViewModalOpen(true);
                              }}
                            >
                              <Eye className="w-4 h-4 text-primary" />
                              <span className="hidden sm:inline">View</span>
                            </Button>
                            
                            <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:bg-muted shrink-0 transition-colors">
                              <MoreVertical className="w-5 h-5" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-12 space-y-6 animate-in fade-in zoom-in-95 duration-500">
                  <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center relative">
                    <MessageSquare className="w-16 h-16 text-muted-foreground/20" />
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white shadow-lg rounded-xl flex items-center justify-center animate-bounce">
                      <History className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <div className="space-y-2 max-w-xs">
                    <h3 className="text-xl font-bold tracking-tight text-foreground">No Feedbacks</h3>
                    <p className="text-sm text-muted-foreground font-medium">
                      There are no feedbacks to display at the moment.
                    </p>
                  </div>
                  {activeTab.startsWith("my-") && (
                    <Button 
                      onClick={() => setIsModalOpen(true)}
                      className="bg-primary hover:bg-primary/90 rounded-2xl px-8 h-12 font-bold shadow-xl shadow-primary/20"
                    >
                      Give First Feedback <Plus className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </div>

          {/* Floating Action Button */}
          {activeTab.startsWith("my-") && (
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="fixed bottom-10 right-10 w-16 h-16 rounded-full bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/30 z-50 hover:scale-110 active:scale-95 transition-all group overflow-hidden"
            >
              <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform duration-500" />
            </Button>
          )}

        </div>
      </DashboardLayout>

      {/* Add Feedback Modal (Standardized exactly to Weekly Report) */}
    {isModalOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div 
          className="bg-background border border-border/50 rounded-2xl shadow-2xl w-full max-w-2xl min-h-[600px] max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200"
          onClick={e => e.stopPropagation()}
        >
          {/* Header (Cloned from Weekly Report) */}
          <div className="flex items-center justify-between p-6 border-b border-border/50 bg-muted/5">
            <div>
              <h2 className="text-xl font-bold tracking-tight">Add Feedback</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Fill in the details for your feedback.
              </p>
            </div>
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body (Cloned from Weekly Report) */}
          <form className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Context Box (Gray-ish background like Month/Week) */}
            <div className="space-y-4 p-4 rounded-xl bg-muted/30 border border-border/40">
              {/* Overall Rating */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">
                  Overall Rating <span className="text-red-500">*</span>
                </Label>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={cn(
                        "h-10 rounded-xl flex items-center justify-center transition-all duration-150 border",
                        rating >= star 
                          ? "border-primary bg-primary/10 text-primary" 
                          : "border-border/40 bg-background hover:border-primary/40 hover:bg-primary/5 text-muted-foreground"
                      )}
                    >
                      <Star className={cn("w-4 h-4", rating >= star && "fill-primary")} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Select Course */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">
                  Select Course <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full h-10 rounded-xl border border-border/50 bg-background px-3 py-2 text-sm font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40 pr-10"
                  >
                    <option value="" disabled>Select a course</option>
                    <option value="fullstack">Full Stack Development</option>
                    <option value="datascience">Data Science</option>
                    <option value="uiux">UI/UX Design</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Select Tutor */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">
                  Select Tutor <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <select
                    value={selectedTutor}
                    onChange={(e) => setSelectedTutor(e.target.value)}
                    className="w-full h-10 rounded-xl border border-border/50 bg-background px-3 py-2 text-sm font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40 pr-10"
                  >
                    <option value="" disabled>Select a tutor</option>
                    <option value="robert">Robert Fox</option>
                    <option value="jane">Jane Cooper</option>
                    <option value="guy">Guy Hawkins</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Message Section (Large Textarea to match length) */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">
                Your Thoughts <span className="text-red-500">*</span>
              </Label>
              <Textarea 
                placeholder="Share your experience with us..."
                className="min-h-[280px] rounded-xl border-border/50 bg-background focus:ring-2 focus:ring-primary/40 p-4 text-sm font-medium resize-none placeholder:text-muted-foreground/40"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          </form>

          {/* Footer (Cloned from Weekly Report) */}
          <div className="p-6 border-t border-border/50 bg-muted/5 flex items-center justify-end gap-3 mt-auto">
            <Button 
              variant="outline" 
              onClick={() => setIsModalOpen(false)}
              className="rounded-xl px-6 h-10 font-semibold"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!message.trim() || rating === 0 || !selectedCourse || !selectedTutor}
              className="rounded-xl px-6 h-10 font-semibold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/10 transition-all"
            >
              Submit Feedback
            </Button>
          </div>
        </div>
      </div>
    )}
    
    {/* View Feedback Modal (Standardized exactly to Weekly Report) */}
    {isViewModalOpen && selectedFeedback && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div 
          className="bg-background border border-border/50 rounded-2xl shadow-2xl w-full max-w-2xl min-h-[600px] max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200"
          onClick={e => e.stopPropagation()}
        >
          {/* Header (Cloned from Weekly Report) */}
          <div className="flex items-center justify-between p-6 border-b border-border/50 bg-muted/5">
            <div>
              <h2 className="text-xl font-bold tracking-tight">Feedback Details</h2>
              <p className="text-sm text-muted-foreground mt-1">
                View the complete details of this feedback entry.
              </p>
            </div>
            <button 
              onClick={() => setIsViewModalOpen(false)} 
              className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body (Cloned from Weekly Report) */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Meta Context Box (Gray-ish background like Month/Week) */}
            <div className="space-y-4 p-4 rounded-xl bg-muted/30 border border-border/40">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Author</p>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {selectedFeedback.type.includes("tutor") ? <UserCircle2 className="w-4 h-4" /> : <Users2 className="w-4 h-4" />}
                    </div>
                    <p className="text-sm font-semibold text-foreground">{selectedFeedback.author}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Type</p>
                  <Badge variant="outline" className="rounded-lg text-[10px] border-border/60 font-bold uppercase py-0.5 px-2 bg-background">
                    {selectedFeedback.type.replace(/_/g, ' ')}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/20">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Rating</p>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={cn(
                          "w-4 h-4", 
                          i < (selectedFeedback.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-muted/20"
                        )} 
                      />
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Date</p>
                  <p className="text-sm font-semibold text-foreground">{selectedFeedback.date}</p>
                </div>
              </div>
            </div>

            {/* Message Content Section */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">Feedback Message</Label>
              <div className="relative p-6 rounded-xl border border-border/40 bg-background min-h-[250px] shadow-sm">
                <span className="absolute left-4 top-2 text-6xl text-primary/5 font-serif leading-none select-none">"</span>
                <p className="text-sm text-foreground/80 leading-relaxed italic relative z-10 whitespace-pre-wrap">
                  {selectedFeedback.message}
                </p>
                <span className="absolute right-4 bottom-2 text-6xl text-primary/5 font-serif leading-none select-none rotate-180">"</span>
              </div>
            </div>
          </div>

          {/* Footer (Cloned from Weekly Report) */}
          <div className="p-6 border-t border-border/50 bg-muted/5 flex items-center justify-end mt-auto">
            <Button 
              onClick={() => setIsViewModalOpen(false)}
              className="rounded-xl px-8 h-10 font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/10 transition-all active:scale-95"
            >
              Close Details
            </Button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default StudentFeedback;
