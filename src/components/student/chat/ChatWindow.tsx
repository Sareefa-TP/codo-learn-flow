import { useState, useRef, useEffect } from "react";
import { Send, Plus, MoreVertical, ShieldCheck, GraduationCap, Users, Info, Search, Mic, Square, Play, Pause, X, Trash2, FileText, Image as ImageIcon, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { unifiedSupportChat, Message } from "@/data/chatMock";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { toast } from "sonner";

interface ChatWindowProps {
  messages: Message[];
  onSendMessage: (text: string, courseTag?: string, files?: File[], replyTo?: Message) => void;
  onSendVoice?: (duration: string, voiceUrl?: string) => void;
  onDeleteMessage: (id: string) => void;
  onClearHistory: () => void;
  isParticipantsOpen: boolean;
  onOpenParticipants: () => void;
  onCloseParticipants: () => void;
  selectedMediaUrl?: string | null;
  onOpenMedia: (url: string) => void;
  onCloseMedia: () => void;
}

export default function ChatWindow({ 
  messages, 
  onSendMessage, 
  onSendVoice,
  onDeleteMessage, 
  onClearHistory,
  isParticipantsOpen,
  onOpenParticipants,
  onCloseParticipants,
  selectedMediaUrl,
  onOpenMedia,
  onCloseMedia
}: ChatWindowProps) {
  const [inputText, setInputText] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
  const [isClearHistoryOpen, setIsClearHistoryOpen] = useState(false);
  const [isMuteConfirmOpen, setIsMuteConfirmOpen] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (scrollRef.current && !isSearchOpen) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isSearchOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      startTimeRef.current = Date.now();

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const durationSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        onSendVoice?.(formatTime(durationSeconds), audioUrl);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      toast.info("Recording started...", { duration: 1000 });
    } catch (err) {
      console.error("Microphone access denied:", err);
      toast.error("Microphone access denied", { description: "Please enable microphone permissions in your browser." });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.onstop = null;
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      setRecordingTime(0);
    }
  };

  const handleSend = () => {
    if (!inputText.trim() && selectedFiles.length === 0) return;

    let text = inputText.trim();
    let courseTag: string | undefined;

    const tagMatch = text.match(/^\[(.*?)\]\s*(.*)/);
    if (tagMatch) {
      courseTag = tagMatch[1];
      text = tagMatch[2];
    }

    onSendMessage(text, courseTag, selectedFiles.length > 0 ? selectedFiles : undefined, replyingTo || undefined);
    setInputText("");
    setSelectedFiles([]);
    setReplyingTo(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const validFiles = files.filter(file => {
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`File ${file.name} too large`, { description: "Maximum file size is 5MB" });
          return false;
        }
        return true;
      });

      if (validFiles.length > 0) {
        setSelectedFiles(prev => [...prev, ...validFiles]);
        toast.success(`${validFiles.length} files attached`);
      }
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
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

  const handleVoiceEnded = (currentId: string) => {
    const currentIndex = filteredMessages.findIndex(m => m.id === currentId);
    if (currentIndex === -1) return;

    const nextVoiceMessage = filteredMessages.slice(currentIndex + 1).find(m => m.isVoice);
    if (nextVoiceMessage) {
      setPlayingMessageId(nextVoiceMessage.id);
    } else {
      setPlayingMessageId(null);
    }
  };

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
                    onClick={() => setIsMuteConfirmOpen(true)}
                    className="rounded-xl p-3 text-xs font-bold gap-3 cursor-pointer"
                  >
                    {isMuted ? <Info className="w-4 h-4 text-muted-foreground" /> : <ShieldCheck className="w-4 h-4 text-muted-foreground" />}
                    {isMuted ? "Unmute Alerts" : "Mute Notifications"}
                  </DropdownMenuItem>
                  <div className="h-[1px] bg-border/40 my-1" />
                  <DropdownMenuItem 
                    onClick={() => setIsClearHistoryOpen(true)}
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
              onDelete={() => setMessageToDelete(msg.id)}
              onImageClick={(url) => onOpenMedia(url)}
              isPlaying={playingMessageId === msg.id}
              onPlay={() => setPlayingMessageId(msg.id)}
              onPause={() => setPlayingMessageId(null)}
              onEnded={() => handleVoiceEnded(msg.id)}
              onReply={(m) => setReplyingTo(m)}
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

      {/* Confirmation Dialogs */}
      <AlertDialog open={!!messageToDelete} onOpenChange={(open) => !open && setMessageToDelete(null)}>
        <AlertDialogContent className="rounded-[2.5rem] border-none shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-black tracking-tight">Delete Message?</AlertDialogTitle>
            <AlertDialogDescription className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-2">
              This action cannot be undone. This message will be permanently removed from your chat history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 gap-3">
            <AlertDialogCancel className="rounded-2xl border-border/40 font-bold text-xs uppercase tracking-widest hover:bg-slate-50">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (messageToDelete) {
                  onDeleteMessage(messageToDelete);
                  setMessageToDelete(null);
                  toast.success("Message deleted");
                }
              }}
              className="rounded-2xl bg-destructive text-destructive-foreground hover:bg-destructive/90 font-bold text-xs uppercase tracking-widest px-8"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isClearHistoryOpen} onOpenChange={setIsClearHistoryOpen}>
        <AlertDialogContent className="rounded-[2.5rem] border-none shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-black tracking-tight text-destructive">Clear All History?</AlertDialogTitle>
            <AlertDialogDescription className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-2">
              WARNING: This will permanently delete every message in this conversation for you. This action is irreversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 gap-3">
            <AlertDialogCancel className="rounded-2xl border-border/40 font-bold text-xs uppercase tracking-widest hover:bg-slate-50">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                onClearHistory();
                setIsClearHistoryOpen(false);
                toast.success("Chat history cleared");
              }}
              className="rounded-2xl bg-destructive text-destructive-foreground hover:bg-destructive/90 font-bold text-xs uppercase tracking-widest px-8"
            >
              Clear Everything
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isMuteConfirmOpen} onOpenChange={setIsMuteConfirmOpen}>
        <AlertDialogContent className="rounded-[2.5rem] border-none shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-black tracking-tight">
              {isMuted ? "Unmute Notifications?" : "Mute Notifications?"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-2">
              {isMuted 
                ? "You will start receiving sound alerts for new messages again." 
                : "You won't receive sound alerts or vibration for new messages in this chat."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 gap-3">
            <AlertDialogCancel className="rounded-2xl border-border/40 font-bold text-xs uppercase tracking-widest hover:bg-slate-50">
              Go Back
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                toggleMute();
                setIsMuteConfirmOpen(false);
              }}
              className="rounded-2xl bg-primary text-white hover:bg-primary/90 font-bold text-xs uppercase tracking-widest px-8"
            >
              {isMuted ? "Unmute Now" : "Mute Now"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Image Preview Modal */}
      <Dialog open={!!selectedMediaUrl} onOpenChange={(open) => !open && onCloseMedia()}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 border-none bg-transparent shadow-none flex items-center justify-center overflow-visible">
          {selectedMediaUrl && (
            <div className="relative group animate-in zoom-in-95 duration-300">
              <img 
                src={selectedMediaUrl} 
                alt="Preview" 
                className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl ring-1 ring-white/10" 
              />
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onCloseMedia}
                className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/90 backdrop-blur-md text-foreground shadow-2xl hover:bg-white transition-all z-50 flex items-center justify-center border border-white/20"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Input Area */}
      <div className="p-6 bg-white border-t border-border/40">
        <div className="max-w-4xl mx-auto space-y-4">
          {!isRecording && (
            <div className="flex flex-col gap-3">
              {/* Files Preview */}
              {selectedFiles.length > 0 && (
                <div className="flex flex-wrap gap-3 animate-in slide-in-from-bottom-2 max-h-48 overflow-y-auto p-1">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-2xl bg-primary/5 border border-primary/10 w-full sm:w-[calc(50%-6px)]">
                      <div className="w-10 h-10 rounded-xl bg-white border border-border/40 flex items-center justify-center shrink-0">
                        {file.type.includes('image') ? <ImageIcon className="w-5 h-5 text-primary" /> : <FileText className="w-5 h-5 text-primary" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-foreground truncate">{file.name}</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => removeFile(index)}
                        className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

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
            </div>
          )}

          {/* Reply Preview */}
          {replyingTo && (
            <div className="flex items-center gap-3 mb-2 px-0">
              {/* Spacer to align with input's left side (plus button area) */}
              <div className="w-[48px] shrink-0" /> 
              <div className="flex-1 p-3 bg-slate-50 border border-slate-200/60 rounded-2xl flex items-center gap-3 animate-in slide-in-from-bottom-2 duration-300">
                <div className="w-1 h-8 bg-primary/40 rounded-full shrink-0" />
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary">Replying to {replyingTo.senderName}</p>
                  </div>
                  <p className="text-xs text-muted-foreground truncate font-medium">{replyingTo.text}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setReplyingTo(null)}
                  className="h-8 w-8 rounded-lg hover:bg-slate-200/50 text-muted-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              {/* Spacer to align with send button area */}
              <div className="w-[76px] shrink-0" /> 
            </div>
          )}

          <div className="flex items-end gap-3">
            {isRecording ? (
              <div className="flex-1 flex items-center gap-4 px-6 py-4 rounded-[2rem] bg-rose-50 border border-rose-100 animate-in zoom-in-95 h-[64px]">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                  <span className="text-sm font-black text-rose-600 tabular-nums">{formatTime(recordingTime)}</span>
                  <div className="h-4 w-[1px] bg-rose-200 mx-2" />
                  <p className="text-xs font-bold text-rose-400 uppercase tracking-widest animate-pulse">Recording Voice...</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={cancelRecording}
                    className="h-10 w-10 rounded-xl text-rose-400 hover:text-rose-600 hover:bg-rose-100 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                  <Button 
                    size="icon" 
                    onClick={stopRecording}
                    className="h-10 w-10 rounded-xl bg-rose-500 text-white shadow-lg shadow-rose-200 hover:bg-rose-600 transition-all"
                  >
                    <Square className="w-4 h-4 fill-current" />
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 relative flex items-center">
                  <div className="absolute left-3 bottom-[10px] flex items-center gap-1 z-10">
                    <input 
                      type="file" 
                      className="hidden" 
                      multiple
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                    />
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => fileInputRef.current?.click()}
                      className="h-11 w-11 rounded-2xl text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"
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
                    className="w-full min-h-[64px] max-h-32 py-[20px] pl-16 pr-14 rounded-[2rem] bg-slate-100/50 border-none focus:ring-2 focus:ring-primary/20 text-sm font-medium resize-none shadow-inner transition-all outline-none leading-tight"
                  />
                  <div className="absolute right-3 bottom-[10px] z-10">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={startRecording}
                      className="h-11 w-11 rounded-2xl text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all active:scale-95"
                    >
                      <Mic className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
                <Button 
                  onClick={handleSend}
                  disabled={!inputText.trim() && selectedFiles.length === 0}
                  className="h-[64px] w-[64px] rounded-[2rem] bg-primary shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all shrink-0 flex items-center justify-center p-0 mb-0"
                >
                  <Send className="w-6 h-6 text-white ml-0.5" />
                </Button>
              </>
            )}
          </div>
          <p className="text-center text-[9px] font-black text-muted-foreground/30 uppercase tracking-[0.25em] flex items-center justify-center gap-4">
            <span>{isRecording ? "Click square to send" : "Double click message to reply"}</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/20" />
            <span>{isRecording ? "Click trash to cancel" : "Press Enter to send"}</span>
          </p>
      </div>
    </div>
      </div>
  );
}


function MessageBubble({ 
  message, 
  showSender, 
  onDelete,
  onImageClick,
  isPlaying,
  onPlay,
  onPause,
  onEnded,
  onReply
}: { 
  message: Message, 
  showSender: boolean, 
  onDelete: () => void,
  onImageClick?: (url: string) => void,
  isPlaying?: boolean,
  onPlay?: () => void,
  onPause?: () => void,
  onEnded?: () => void,
  onReply?: (message: Message) => void
}) {
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (message.isVoice && message.voiceUrl) {
      const audio = new Audio(message.voiceUrl);
      audioRef.current = audio;

      audio.ontimeupdate = () => {
        setCurrentTime(Math.floor(audio.currentTime));
      };

      audio.onended = () => {
        setCurrentTime(0);
        onEnded?.();
      };

      return () => {
        audio.pause();
        audioRef.current = null;
      };
    }
  }, [message.isVoice, message.voiceUrl, onEnded]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(console.error);
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const togglePlayback = () => {
    if (isPlaying) {
      onPause?.();
    } else {
      onPlay?.();
    }
  };

  const formatPlaybackTime = (secs: number) => {
    return `0:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      id={`msg-${message.id}`}
      className={cn(
        "flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300 transition-all",
        message.isOwn ? "items-end" : "items-start"
      )}
    >
      {showSender && !message.isOwn && (
        <div className="flex items-center gap-2 mb-2 ml-1">
          <span className="text-[10px] font-black text-foreground uppercase tracking-widest">{message.senderName}</span>
          <div className="w-1 h-1 rounded-full bg-border" />
          <span className="text-[9px] font-bold text-muted-foreground tabular-nums">{message.timestamp}</span>
        </div>
      )}
      
      <div className={cn(
        "flex items-end gap-1.5 group",
        message.isOwn ? "flex-row-reverse" : "flex-row"
      )}>
        <div 
          id={`msg-${message.id}`}
          onDoubleClick={() => {
            onReply?.(message);
            const textarea = document.querySelector('textarea');
            textarea?.focus();
            toast.info(`Replying to ${message.senderName}`, { duration: 1000 });
          }}
          className={cn(
            "max-w-[85%] py-4 rounded-[2rem] shadow-sm relative transition-all hover:shadow-md cursor-default active:scale-[0.99] overflow-hidden",
            message.isOwn 
              ? "bg-primary text-white rounded-tr-lg" 
              : "bg-white border border-border/50 text-foreground rounded-tl-lg",
            message.isVoice ? "px-5" : (message.isFile && message.fileType === 'image' ? "p-1.5" : "px-6"),
            !message.isVoice && !(message.isFile && message.fileType === 'image') && "min-w-[280px]"
          )}
        >
          {message.replyTo && (
            <div 
              onClick={(e) => {
                e.stopPropagation();
                const target = document.getElementById(`msg-${message.replyTo?.id}`);
                if (target) {
                  target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  target.classList.add('bg-primary/10', 'scale-[1.02]');
                  setTimeout(() => {
                    target.classList.remove('bg-primary/10', 'scale-[1.02]');
                  }, 2000);
                }
              }}
              className={cn(
                "mb-3 p-2 rounded-xl border-l-4 text-[10px] bg-black/5 flex flex-col gap-0.5 cursor-pointer hover:bg-black/10 transition-colors",
                message.isOwn ? "border-white/30 text-white/80" : "border-primary/30 text-muted-foreground"
              )}
            >
              <span className="font-black uppercase tracking-widest">{message.replyTo.senderName}</span>
              <p className="truncate opacity-80">{message.replyTo.text}</p>
            </div>
          )}
          {message.courseTag && (
            <div className={cn(
              "text-[9px] font-black uppercase tracking-widest mb-1.5 px-2 py-0.5 rounded-lg w-fit",
              message.isOwn ? "bg-white/20 text-white" : "bg-primary/5 text-primary"
            )}>
              {message.courseTag}
            </div>
          )}
          
          {message.isVoice ? (
            <div className="flex items-center gap-4 py-1 w-full">
              <Button 
                size="icon" 
                variant="ghost"
                onClick={togglePlayback}
                className={cn(
                  "h-12 w-12 rounded-2xl transition-all shadow-sm shrink-0",
                  message.isOwn 
                    ? "bg-white/20 text-white hover:bg-white/30" 
                    : "bg-primary/5 text-primary hover:bg-primary/10"
                )}
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </Button>
              <div className="flex-1 space-y-2.5">
                <div 
                  className="relative h-6 flex items-center cursor-pointer group/seek px-1"
                  onClick={(e) => {
                    if (!audioRef.current) return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const percentage = x / rect.width;
                    const newTime = percentage * (audioRef.current.duration || 1);
                    audioRef.current.currentTime = newTime;
                    setCurrentTime(Math.floor(newTime));
                  }}
                >
                  {/* Track Background */}
                  <div className={cn(
                    "absolute left-1 right-1 h-[3px] rounded-full transition-all",
                    message.isOwn ? "bg-white/20" : "bg-primary/20"
                  )} />
                  
                  {/* Progress Fill */}
                  <div 
                    className={cn(
                      "absolute left-1 h-[3px] rounded-full transition-all",
                      message.isOwn ? "bg-white" : "bg-primary"
                    )}
                    style={{ 
                      width: `calc(${(currentTime / (audioRef.current?.duration || 1)) * 100}% - 8px)` 
                    }}
                  />

                  {/* Handle/Dot */}
                  <div 
                    className={cn(
                      "absolute w-2.5 h-2.5 rounded-full shadow-lg transition-all scale-0 group-hover/seek:scale-100 border-2",
                      message.isOwn ? "bg-white border-primary" : "bg-primary border-white"
                    )}
                    style={{ 
                      left: `calc(${(currentTime / (audioRef.current?.duration || 1)) * 100}% + 4px)`,
                      transform: 'translateX(-50%)'
                    }}
                  />
                </div>
                <div className="flex items-center justify-between gap-4">
                   <p className={cn("text-[9px] font-black uppercase tracking-widest truncate", message.isOwn ? "text-white/60" : "text-muted-foreground/60")}>
                    {isPlaying ? "Playing..." : "Voice Message"}
                   </p>
                   <div className="flex items-center gap-1.5 shrink-0 whitespace-nowrap">
                    <p className={cn("text-[9px] font-black tabular-nums", message.isOwn ? "text-white" : "text-primary")}>
                      {formatPlaybackTime(currentTime)}
                    </p>
                    <div className={cn("w-1 h-1 rounded-full", message.isOwn ? "bg-white/30" : "bg-border")} />
                    <p className={cn("text-[9px] font-bold tabular-nums opacity-60", message.isOwn ? "text-white" : "text-muted-foreground")}>
                      {message.voiceDuration}
                    </p>
                   </div>
                </div>
              </div>
            </div>
          ) : message.isFile ? (
            <div className="space-y-3">
              {message.fileType === 'image' ? (
                <div 
                  onClick={() => onImageClick?.(message.fileUrl || "")}
                  className="rounded-[1.6rem] overflow-hidden border border-black/5 bg-black/5 cursor-zoom-in relative group/img"
                >
                  <img src={message.fileUrl} alt={message.fileName} className="w-full h-auto max-h-[400px] object-cover transition-transform duration-700 group-hover/img:scale-110" />
                  <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/40 backdrop-blur-xl border border-white/40 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-all scale-50 group-hover/img:scale-100 shadow-2xl">
                      <ZoomIn className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              ) : (
                <a 
                  href={message.fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  download={message.fileName}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-2xl border transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer block",
                    message.isOwn ? "bg-white/10 border-white/20 hover:bg-white/20" : "bg-slate-50 border-border/40 hover:bg-slate-100"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                    message.isOwn ? "bg-white/20" : "bg-primary/10"
                  )}>
                    <FileText className={cn("w-5 h-5", message.isOwn ? "text-white" : "text-primary")} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black truncate">{message.fileName}</p>
                    <p className={cn("text-[9px] font-bold uppercase", message.isOwn ? "text-white/60" : "text-muted-foreground/60")}>Document</p>
                  </div>
                </a>
              )}
              {message.text && message.text !== "File attached" && (
                <p className="text-sm leading-relaxed font-medium mt-2">{message.text}</p>
              )}
            </div>
          ) : (
            <p className="text-sm leading-relaxed font-medium">
              {message.text}
            </p>
          )}
        </div>

        {/* Unified Metadata Column (Timestamp & Actions) */}
        <div className={cn(
          "flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 pb-1 shrink-0 self-end",
          message.isOwn ? "items-end pr-1" : "items-start pl-1"
        )}>
          <span className="text-[8px] font-black tabular-nums text-muted-foreground/30 uppercase tracking-tighter">
            {message.timestamp}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn(
                  "h-7 w-7 rounded-lg transition-all",
                  message.isOwn ? "hover:bg-destructive/5 hover:text-destructive" : "hover:bg-primary/5 hover:text-primary",
                  "text-muted-foreground/20 hover:scale-110 active:scale-90"
                )}
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align={message.isOwn ? "end" : "start"} 
              className="rounded-2xl border-border/40 shadow-2xl p-1.5 min-w-[140px] animate-in zoom-in-95 duration-200"
            >
              <DropdownMenuItem 
                onClick={() => {
                  onReply?.(message);
                  const textarea = document.querySelector('textarea');
                  textarea?.focus();
                }}
                className="rounded-xl focus:bg-primary/5 cursor-pointer font-bold text-xs p-2.5 gap-2.5"
              >
                <Plus className="w-4 h-4 text-primary" />
                Reply Message
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => {
                  navigator.clipboard.writeText(message.text);
                  toast.success("Text copied to clipboard");
                }}
                className="rounded-xl focus:bg-primary/5 cursor-pointer font-bold text-xs p-2.5 gap-2.5"
              >
                <FileText className="w-4 h-4 text-primary" />
                Copy Text
              </DropdownMenuItem>
              <div className="h-[1px] bg-border/40 my-1 mx-1" />
              <DropdownMenuItem 
                onClick={onDelete}
                className="rounded-xl text-destructive focus:text-destructive focus:bg-destructive/5 cursor-pointer font-bold text-xs p-2.5 gap-2.5"
              >
                <Trash2 className="w-4 h-4" />
                Delete Message
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
