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
import PageSearch from "@/components/shared/PageSearch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
    id: "f001",
    type: "to_tutor",
    author: "You",
    rating: 5,
    message: "The explanation of Redux was very clear. Thank you!",
    date: "2026-03-20",
    status: "Read"
  },
  {
    id: "f002",
    type: "to_tutor",
    author: "You",
    rating: 4,
    message: "Great class pace in React module 2. More real-world API examples would help even more.",
    date: "2026-03-17",
    status: "Read"
  },
  {
    id: "f003",
    type: "to_mentor",
    author: "You",
    rating: 5,
    message: "Your career guidance session helped me prepare my portfolio with confidence.",
    date: "2026-03-16",
    status: "Pending"
  },
  {
    id: "f004",
    type: "to_mentor",
    author: "You",
    rating: 3,
    message: "Please share a checklist for internship interview preparation.",
    date: "2026-03-12",
    status: "Read"
  },
  {
    id: "f005",
    type: "from_tutor",
    author: "Dr. Sarah Johnson",
    rating: 5,
    message: "Excellent progress in the React module! Your understanding of hooks is impressive.",
    date: "2026-03-25",
    status: "Read"
  },
  {
    id: "f006",
    type: "from_mentor",
    author: "Michael Chen",
    rating: 4,
    message: "Good work on the recent project. Focus more on state management best practices.",
    date: "2026-03-24",
    status: "Read"
  },
  {
    id: "f007",
    type: "from_tutor",
    author: "Prof. Emma Lewis",
    rating: 3,
    message: "Attendance is improving. Please submit assignments before deadline to maintain momentum.",
    date: "2026-03-19",
    status: "Pending"
  },
  {
    id: "f008",
    type: "from_mentor",
    author: "Arjun Malhotra",
    rating: 5,
    message: "Fantastic growth in communication and presentation. Keep sharing your weekly wins.",
    date: "2026-03-11",
    status: "Read"
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
  const [isEditMode, setIsEditMode] = useState(false);
  const [editRating, setEditRating] = useState(5);
  const [editMessage, setEditMessage] = useState("");

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
    setIsModalOpen(false);
    setMessage("");
    setRating(5);
    setSelectedCourse("");
    setSelectedTutor("");
    toast.success(`Feedback sent successfully`);
  };

  const openFeedbackDetails = (entry: FeedbackEntry) => {
    setSelectedFeedback(entry);
    setEditRating(entry.rating || 5);
    setEditMessage(entry.message);
    setIsEditMode(false);
    setIsViewModalOpen(true);
  };

  const handleSaveFeedbackEdit = () => {
    if (!selectedFeedback || !editMessage.trim()) {
      toast.error("Please enter feedback message");
      return;
    }

    const updated = entries.map((entry) =>
      entry.id === selectedFeedback.id
        ? {
            ...entry,
            rating: editRating,
            message: editMessage.trim(),
            date: new Date().toISOString().split("T")[0],
            status: "Pending",
          }
        : entry,
    );

    const updatedSelected = updated.find((entry) => entry.id === selectedFeedback.id) || null;
    setEntries(updated);
    setSelectedFeedback(updatedSelected);
    setIsEditMode(false);
    toast.success("Feedback updated successfully");
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

          {/* Standardized Search Bar */}
          <PageSearch
            placeholder="Search feedback..."
            onSearch={setSearchQuery}
            className="mb-10"
          />

          {/* Tab-based Navigation (Updated to match design) */}
          <div className="bg-white p-1.5 rounded-full border border-border/40 mb-8 w-full shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
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
                    "px-4 py-3 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest transition-all duration-300 text-center flex items-center justify-center h-full",
                    activeTab === tab.id 
                      ? "bg-[#28B485] text-white shadow-lg shadow-[#28B485]/20" 
                      : "text-[#94A3B8] hover:bg-slate-50 hover:text-[#64748B]"
                  )}
                >
                  <span className="truncate">{tab.label}</span>
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
              {activeTab.startsWith("my-") ? (
                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="rounded-xl px-4 h-10 font-semibold"
                >
                  Create Ticket
                </Button>
              ) : null}
            </div>

            <CardContent className="p-8 flex-1">
              {filteredEntries.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {filteredEntries.map((entry) => (
                    <Card
                      key={entry.id}
                      className="cursor-pointer border-border/40 bg-slate-50/30 transition-all duration-500 hover:border-primary/20 hover:bg-white hover:shadow-xl hover:shadow-primary/5 group rounded-3xl overflow-hidden"
                      onClick={() => openFeedbackDetails(entry)}
                    >
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

                        {/* Right: Date */}
                        <div className="flex items-center gap-4 shrink-0 justify-between md:justify-end w-full md:w-auto">
                          <Badge variant="outline" className="rounded-lg text-[10px] border-border/60 font-bold uppercase py-1 px-3 whitespace-nowrap bg-background shadow-sm">
                            {entry.date}
                          </Badge>
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
                <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                  <SelectTrigger className="h-10 rounded-xl border-border/50 bg-background text-sm font-medium">
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="fullstack">Full Stack Development</SelectItem>
                    <SelectItem value="datascience">Data Science</SelectItem>
                    <SelectItem value="uiux">UI/UX Design</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Select Tutor */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">
                  Select Tutor <span className="text-red-500">*</span>
                </Label>
                <Select value={selectedTutor} onValueChange={setSelectedTutor}>
                  <SelectTrigger className="h-10 rounded-xl border-border/50 bg-background text-sm font-medium">
                    <SelectValue placeholder="Select a tutor" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="robert">Robert Fox</SelectItem>
                    <SelectItem value="jane">Jane Cooper</SelectItem>
                    <SelectItem value="guy">Guy Hawkins</SelectItem>
                  </SelectContent>
                </Select>
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
                  {isEditMode ? (
                    <div className="grid grid-cols-5 gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setEditRating(star)}
                          className={cn(
                            "h-8 rounded-lg border transition-all",
                            editRating >= star
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border/40 bg-background text-muted-foreground hover:border-primary/40"
                          )}
                        >
                          <Star className={cn("mx-auto h-4 w-4", editRating >= star && "fill-primary")} />
                        </button>
                      ))}
                    </div>
                  ) : (
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
                  )}
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
              {isEditMode ? (
                <Textarea
                  value={editMessage}
                  onChange={(e) => setEditMessage(e.target.value)}
                  className="min-h-[250px] rounded-xl border-border/40 bg-background p-4 text-sm"
                  placeholder="Update your feedback..."
                />
              ) : (
                <div className="relative p-6 rounded-xl border border-border/40 bg-background min-h-[250px] shadow-sm">
                  <span className="absolute left-4 top-2 text-6xl text-primary/5 font-serif leading-none select-none">"</span>
                  <p className="text-sm text-foreground/80 leading-relaxed italic relative z-10 whitespace-pre-wrap">
                    {selectedFeedback.message}
                  </p>
                  <span className="absolute right-4 bottom-2 text-6xl text-primary/5 font-serif leading-none select-none rotate-180">"</span>
                </div>
              )}
            </div>
          </div>

          {/* Footer (Cloned from Weekly Report) */}
          <div className="p-6 border-t border-border/50 bg-muted/5 flex items-center justify-end gap-3 mt-auto">
            {selectedFeedback.author === "You" ? (
              isEditMode ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditMode(false);
                      setEditMessage(selectedFeedback.message);
                      setEditRating(selectedFeedback.rating || 5);
                    }}
                    className="rounded-xl px-6 h-10 font-semibold"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveFeedbackEdit}
                    className="rounded-xl px-6 h-10 font-semibold bg-primary hover:bg-primary/90 text-white"
                  >
                    Save Changes
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setIsViewModalOpen(false)}
                    className="rounded-xl px-6 h-10 font-semibold"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => setIsEditMode(true)}
                    className="rounded-xl px-6 h-10 font-semibold bg-primary hover:bg-primary/90 text-white"
                  >
                    Edit Feedback
                  </Button>
                </>
              )
            ) : null}
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default StudentFeedback;
