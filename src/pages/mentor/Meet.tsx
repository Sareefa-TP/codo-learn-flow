import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Video, 
  Calendar, 
  Clock, 
  ExternalLink,
  ShieldCheck,
  UserCircle,
  VideoOff,
  UserCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import CreateMeetModal from "@/components/coordinator/CreateMeetModal";

// --- Types ---

type Role = "Admin" | "Mentor" | "Coordinator";

interface Meeting {
  id: string;
  title: string;
  createdBy: Role;
  date: string;
  time: string;
  link: string;
  description?: string;
}

// --- Mock Data ---

const initialMeetings: Meeting[] = [
  {
    id: "MEET-001",
    title: "Quarterly Performance Review",
    createdBy: "Admin",
    date: "2026-04-15",
    time: "11:00 AM",
    link: "https://meet.google.com/abc-defg-hij",
    description: "Reviewing company-wide mentor and tutor performance metrics.",
  },
  {
    id: "MEET-002",
    title: "Batch B Mentor Sync",
    createdBy: "Mentor",
    date: "2026-04-12",
    time: "03:00 PM",
    link: "https://meet.google.com/pqr-stuv-wxy",
    description: "Weekly sync with mentors of Batch B to discuss intern progress.",
  },
  {
    id: "MEET-003",
    title: "Intern Guidance Workshop",
    createdBy: "Coordinator",
    date: "2026-04-09",
    time: "05:00 PM",
    link: "https://meet.google.com/xyz-mno-pqr",
    description: "Workshop session for interns on career guidance and placement strategies.",
  },
];

// --- Sub-components ---

const MeetingCard = ({ meeting }: { meeting: Meeting }) => {
  const getRoleBadge = (role: Role) => {
    switch (role) {
      case "Admin":
        return {
          text: "Admin",
          icon: <ShieldCheck className="w-3 h-3" />,
          style: "text-amber-600 bg-amber-50 border-amber-100",
          containerStyle: "bg-amber-500/10 border-amber-500/20 text-amber-600"
        };
      case "Mentor":
        return {
          text: "Mentor",
          icon: <UserCheck className="w-3 h-3" />,
          style: "text-emerald-600 bg-emerald-50 border-emerald-100",
          containerStyle: "bg-emerald-500/10 border-emerald-500/20 text-emerald-600"
        };
      default:
        return {
          text: "Coordinator",
          icon: <UserCircle className="w-3 h-3" />,
          style: "text-blue-600 bg-blue-50 border-blue-100",
          containerStyle: "bg-primary/5 border-primary/10 text-primary"
        };
    }
  };

  const roleInfo = getRoleBadge(meeting.createdBy);

  const handleJoinNow = () => {
    window.open(meeting.link, "_blank");
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Card className={cn(
      "border-border/50 shadow-sm rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg group bg-card/60 backdrop-blur-sm border-l-4 relative overflow-hidden",
      meeting.createdBy === "Admin" ? "border-l-amber-500" : meeting.createdBy === "Mentor" ? "border-l-emerald-500" : "border-l-primary"
    )}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
      
      <CardContent className="p-0">
        <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-5 relative z-10">
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner border transition-all duration-300",
              roleInfo.containerStyle
            )}>
              <Video className="w-6 h-6" />
            </div>
            
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="font-bold text-lg leading-tight text-foreground group-hover:text-primary transition-colors truncate">
                  {meeting.title}
                </h3>
                <Badge variant="outline" className={cn(
                  "font-bold rounded-lg px-2 py-0 h-5 text-[10px] uppercase border tracking-wider",
                  roleInfo.style
                )}>
                  <span className="flex items-center gap-1">{roleInfo.icon} {roleInfo.text}</span>
                </Badge>
              </div>
              
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground font-medium">
                <div className="flex items-center gap-1.5 bg-muted/30 px-2 py-1 rounded-lg">
                  <Calendar className="w-3.5 h-3.5 text-primary/60" />
                  <span>{formatDate(meeting.date)}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-muted/30 px-2 py-1 rounded-lg">
                  <Clock className="w-3.5 h-3.5 text-primary/60" />
                  <span>{meeting.time}</span>
                </div>
              </div>

              {meeting.description && (
                <p className="text-[13px] text-muted-foreground/70 line-clamp-1 mt-2 max-w-lg">
                  {meeting.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 relative z-10 pt-4 md:pt-0 border-t md:border-t-0 border-border/40">
            <Button 
              onClick={handleJoinNow}
              className="w-full sm:w-auto h-11 rounded-xl px-8 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 font-bold gap-2 transition-all hover:scale-[1.03] active:scale-[0.97]"
            >
              Join Now
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// --- Main Page ---

const MentorMeet = () => {
  const [meetings, setMeetings] = useState<Meeting[]>(initialMeetings);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = ["All", "Admin", "Mentor", "Coordinator"];

  const filteredMeetings = meetings.filter(m => 
    activeFilter === "All" || m.createdBy === activeFilter
  );

  const handleCreateMeeting = (meetingData: Omit<Meeting, "id" | "createdBy">) => {
    const newMeeting: Meeting = {
      ...meetingData,
      id: `MEET-${Math.floor(Math.random() * 900) + 100}`,
      createdBy: "Mentor",
    };

    setMeetings([newMeeting, ...meetings]);
    setIsModalOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8 max-w-6xl mx-auto px-4 md:px-6 lg:px-8 pb-10">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-b border-border/10 pb-8 bg-gradient-to-r from-primary/5 to-transparent p-6 rounded-3xl border border-primary/5">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0 shadow-inner border border-primary/20">
              <Video className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-4xl font-black tracking-tight text-foreground">
                Meet
              </h1>
              <p className="text-muted-foreground text-sm font-medium mt-1">
                View meetings scheduled by Admin, Mentor, and Coordinator.
              </p>
            </div>
          </div>

          <Button 
            onClick={() => setIsModalOpen(true)}
            className="h-12 rounded-2xl px-8 bg-primary hover:bg-primary/90 shadow-xl shadow-primary/30 gap-2.5 font-black transition-all hover:scale-[1.05] active:scale-[0.95] text-primary-foreground group"
          >
            <Plus className="w-5.5 h-5.5 text-primary-foreground group-hover:rotate-90 transition-transform duration-300" />
            Create Meet
          </Button>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <CreateMeetModal 
            onClose={() => setIsModalOpen(false)} 
            onSubmit={handleCreateMeeting}
          />
        )}

        {/* Filters and List */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 bg-muted/30 p-1.5 rounded-2xl w-fit border border-border/40 flex-wrap shadow-sm">
            {filters.map(filter => {
              const count = meetings.filter(m => filter === "All" || m.createdBy === filter).length;
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={cn(
                    "flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all relative",
                    activeFilter === filter
                      ? "bg-background shadow-md text-foreground border border-border/50 ring-1 ring-black/5"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  {filter}
                  <span className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-black min-w-[20px]",
                    activeFilter === filter
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  )}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="space-y-5">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <div className="w-1.5 h-6 bg-primary rounded-full" />
                {activeFilter === "All" ? "Scheduled Meetings" : `${activeFilter} Meetings`}
                <span className="text-xs font-black bg-primary/10 text-primary px-2 py-0.5 rounded-full ml-1">
                  {filteredMeetings.length}
                </span>
              </h2>
            </div>

            {filteredMeetings.length > 0 ? (
              <div className="grid gap-5 animate-in fade-in duration-700">
                {filteredMeetings.map(meeting => (
                  <MeetingCard key={meeting.id} meeting={meeting} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 px-4 text-center space-y-6 bg-muted/5 border border-dashed border-border/60 rounded-[2.5rem]">
                <div className="w-24 h-24 rounded-full bg-muted/20 flex items-center justify-center animate-pulse">
                  <VideoOff className="w-12 h-12 text-muted-foreground/30" />
                </div>
                <div className="max-w-md">
                  <p className="text-muted-foreground font-black text-2xl">No {activeFilter === "All" ? "" : activeFilter} meetings found</p>
                  <p className="text-sm text-muted-foreground/60 mt-2 font-medium">
                    {activeFilter === "All" 
                      ? "There are no upcoming meetings at the moment."
                      : `There are no upcoming meetings scheduled by ${activeFilter}.`}
                  </p>
                  {activeFilter !== "All" && (
                    <Button 
                      variant="link" 
                      className="mt-4 font-bold text-primary"
                      onClick={() => setActiveFilter("All")}
                    >
                      View all meetings
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MentorMeet;
