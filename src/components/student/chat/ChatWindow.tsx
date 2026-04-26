import { useState, useRef, useEffect } from "react";
import { Send, Plus, MoreVertical, ShieldCheck, GraduationCap, Users, Info, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { unifiedSupportChat, Message } from "@/data/chatMock";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Trash2 } from "lucide-react";

import { toast } from "sonner";
import { X } from "lucide-react";

interface ChatWindowProps {
  messages: Message[];
  onSendMessage: (text: string, courseTag?: string) => void;
  onDeleteMessage: (id: string) => void;
  onClearHistory: () => void;
  isParticipantsOpen: boolean;
  onOpenParticipants: () => void;
  onCloseParticipants: () => void;
}

export default function ChatWindow({ 
  messages, 
  onSendMessage, 
  onDeleteMessage, 
  onClearHistory,
  isParticipantsOpen,
  onOpenParticipants,
  onCloseParticipants
}: ChatWindowProps) {
  const [inputText, setInputText] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current && !isSearchOpen) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isSearchOpen]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    // Detect course tag [Course Name] at start
    let text = inputText.trim();
    let courseTag: string | undefined;

    const tagMatch = text.match(/^\[(.*?)\]\s*(.*)/);
    if (tagMatch) {
      courseTag = tagMatch[1];
      text = tagMatch[2];
    }

    onSendMessage(text, courseTag);
    setInputText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    toast.success(!isMuted ? "Notifications Muted" : "Notifications Restored", {
      description: !isMuted ? "You won't receive sound alerts for this chat." : "Alerts have been re-enabled.",
      duration: 2000,
    });
  };

  const filteredMessages = messages.filter(msg => 
    msg.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (msg.courseTag && msg.courseTag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
      {/* Header */}
      <div className="px-8 py-6 border-b border-border/40 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10 shadow-sm min-h-[100px]">
        {isSearchOpen ? (
          <div className="flex-1 flex items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                autoFocus
                placeholder="Search in conversation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              />
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => {
                setIsSearchOpen(false);
                setSearchQuery("");
              }}
              className="rounded-xl hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-black tracking-tight text-foreground">{unifiedSupportChat.title}</h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className={cn("w-1.5 h-1.5 rounded-full", isMuted ? "bg-slate-300" : "bg-emerald-500")} />
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    {isMuted ? "Notifications Muted" : "Support Team Online"}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Dialog open={isParticipantsOpen} onOpenChange={(open) => !open && onCloseParticipants()}>
                <button 
                  onClick={onOpenParticipants}
                  className="flex flex-col items-end mr-4 hover:opacity-70 transition-opacity group outline-none"
                >
                  <div className="flex -space-x-3 mb-1">
                    {unifiedSupportChat.participants.slice(1, 4).map((p, i) => (
                      <div 
                        key={p.id}
                        className="w-9 h-9 rounded-xl border-4 border-white bg-muted flex items-center justify-center shadow-sm relative shrink-0"
                      >
                        <p className="text-[10px] font-black text-muted-foreground">{p.name.charAt(0)}</p>
                        {p.role === 'Tutor' && <GraduationCap className="absolute -top-1 -right-1 w-3 h-3 text-primary bg-white rounded-full p-0.5" />}
                      </div>
                    ))}
                    <div className="w-9 h-9 rounded-xl border-4 border-white bg-primary/10 text-primary flex items-center justify-center text-[10px] font-black shadow-sm">
                      +4
                    </div>
                  </div>
                  <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest mr-1 group-hover:text-primary transition-colors">
                    Participants: <span className="text-foreground">7</span>
                  </p>
                </button>
                <DialogContent className="rounded-[2.5rem] max-w-lg p-10 border-none shadow-2xl">
                  <DialogHeader className="mb-6">
                    <DialogTitle className="text-2xl font-black tracking-tight">Group Participants</DialogTitle>
                    <DialogDescription className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-1">
                      Assigned Support Experts
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-6">
                    <div className="rounded-3xl bg-muted/30 border border-border/40 p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10">
                          <Users className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Unified Chat</p>
                          <h3 className="text-sm font-black text-foreground">Verified Support Team</h3>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        This group includes all course tutors, mentors, advisors, coordinators and admins enrolled in your learning path.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-2">Team Members</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {unifiedSupportChat.participants.map((p) => (
                          <div key={p.id} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-transparent hover:border-border/60 transition-all">
                            <div className="w-10 h-10 rounded-xl bg-white border border-border/40 flex items-center justify-center relative shadow-sm shrink-0">
                              <span className="text-xs font-black text-muted-foreground">{p.name.charAt(0)}</span>
                              {p.role === 'Tutor' && <GraduationCap className="absolute -top-1 -right-1 w-3.5 h-3.5 text-primary bg-white rounded-full p-0.5 shadow-sm" />}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-black text-foreground truncate">{p.name}</p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <p className="text-[9px] font-bold text-primary uppercase tracking-wider">{p.role}</p>
                                {p.course && (
                                  <>
                                    <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                                    <p className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-wider">{p.course}</p>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <div className="h-10 w-[1px] bg-border/40 mx-2" />
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-xl text-muted-foreground hover:bg-muted transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-[1.5rem] border-border/40 shadow-2xl p-2 min-w-[180px]">
                  <DropdownMenuItem 
                    onClick={() => setIsSearchOpen(true)}
                    className="rounded-xl p-3 text-xs font-bold gap-3 cursor-pointer"
                  >
                    <Search className="w-4 h-4 text-muted-foreground" />
                    Search Message
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={toggleMute}
                    className="rounded-xl p-3 text-xs font-bold gap-3 cursor-pointer"
                  >
                    {isMuted ? <Info className="w-4 h-4 text-muted-foreground" /> : <ShieldCheck className="w-4 h-4 text-muted-foreground" />}
                    {isMuted ? "Unmute Alerts" : "Mute Notifications"}
                  </DropdownMenuItem>
                  <div className="h-[1px] bg-border/40 my-1" />
                  <DropdownMenuItem 
                    onClick={onClearHistory}
                    className="rounded-xl p-3 text-xs font-bold gap-3 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/5"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear History
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </>
        )}
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-auto p-8 space-y-8 scroll-smooth bg-slate-50/30"
      >
        {filteredMessages.length > 0 ? (
          filteredMessages.map((msg, index) => (
            <MessageBubble 
              key={msg.id} 
              message={msg} 
              showSender={index === 0 || filteredMessages[index-1].senderId !== msg.senderId} 
              onDelete={() => onDeleteMessage(msg.id)}
            />
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-10 animate-fade-in">
            <div className="w-20 h-20 rounded-[2.5rem] bg-slate-100 flex items-center justify-center mb-6">
              <Search className="w-8 h-8 text-muted-foreground/30" />
            </div>
            <h3 className="text-lg font-black text-foreground mb-2">No messages found</h3>
            <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
              {searchQuery ? `We couldn't find any results for "${searchQuery}". Try a different term.` : "Your conversation history is empty."}
            </p>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white border-t border-border/40">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Quick Tags */}
          <div className="flex items-center gap-2 animate-in fade-in slide-in-from-bottom-1 duration-500">
            <span className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-widest mr-2">Quick Tag:</span>
            {["Full Stack", "UI/UX"].map(tag => (
              <button
                key={tag}
                onClick={() => setInputText(`[${tag}] ${inputText}`)}
                className="px-3 py-1 rounded-full bg-slate-100 border border-border/40 text-[10px] font-bold text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all active:scale-95"
              >
                + {tag}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 relative flex items-center">
              <div className="absolute left-3">
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-11 w-11 rounded-2xl text-muted-foreground hover:bg-muted/60 transition-colors flex items-center justify-center"
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
              <textarea 
                placeholder="Type your message... (e.g. [UI/UX] help me)" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                className="w-full min-h-[60px] max-h-32 py-[18px] pl-16 pr-6 rounded-[2rem] bg-slate-100/50 border-none focus:ring-2 focus:ring-primary/20 text-sm font-medium resize-none shadow-inner transition-all overflow-hidden"
              />
            </div>
            <Button 
              onClick={handleSend}
              disabled={!inputText.trim()}
              className="h-[60px] w-[60px] rounded-[2rem] bg-primary shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all shrink-0 flex items-center justify-center p-0"
            >
              <Send className="w-6 h-6 text-white ml-0.5" />
            </Button>
          </div>
          <p className="text-center text-[9px] font-black text-muted-foreground/30 uppercase tracking-[0.3em]">
            Press Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message, showSender, onDelete }: { message: Message, showSender: boolean, onDelete: () => void }) {
  return (
    <div className={cn(
      "flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300",
      message.isOwn ? "items-end" : "items-start"
    )}>
      {showSender && !message.isOwn && (
        <div className="flex items-center gap-2 mb-2 ml-1">
          <span className="text-[10px] font-black text-foreground uppercase tracking-widest">{message.senderName}</span>
          <div className="w-1 h-1 rounded-full bg-border" />
          <span className="text-[9px] font-bold text-muted-foreground tabular-nums">{message.timestamp}</span>
        </div>
      )}
      
      <div className="flex items-center gap-2 group">
        {message.isOwn && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
            <span className="text-[9px] font-bold text-muted-foreground/40 tabular-nums uppercase">{message.timestamp}</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl text-muted-foreground/40 hover:text-destructive hover:bg-destructive/5 transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-2xl border-border/40 shadow-xl p-1.5 min-w-[120px]">
                <DropdownMenuItem 
                  onClick={onDelete}
                  className="rounded-xl text-destructive focus:text-destructive focus:bg-destructive/5 cursor-pointer font-bold text-xs p-2.5 gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        <div className={cn(
          "max-w-[80%] sm:max-w-[70%] px-6 py-4 rounded-[2rem] shadow-sm relative transition-all hover:shadow-md",
          message.isOwn 
            ? "bg-primary text-white rounded-tr-lg" 
            : "bg-white border border-border/50 text-foreground rounded-tl-lg"
        )}>
          {message.courseTag && (
            <div className={cn(
              "text-[9px] font-black uppercase tracking-widest mb-1.5 px-2 py-0.5 rounded-lg w-fit",
              message.isOwn ? "bg-white/20 text-white" : "bg-primary/5 text-primary"
            )}>
              {message.courseTag}
            </div>
          )}
          <p className="text-sm leading-relaxed font-medium">
            {message.text}
          </p>
        </div>

        {!message.isOwn && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
             <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl text-muted-foreground/40 hover:text-primary transition-colors">
                <MoreVertical className="w-4 h-4" />
              </Button>
          </div>
        )}
      </div>
    </div>
  );
}
