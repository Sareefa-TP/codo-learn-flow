import { useState, useRef, useEffect, useMemo } from "react";
import { Send, Plus, MoreVertical, ShieldCheck, GraduationCap, Users, Info, Search, Mic, X as CloseIcon, Play, Pause, Volume2 } from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

import { toast } from "sonner";
import { X } from "lucide-react";

interface ChatWindowProps {
  messages: Message[];
  onSendMessage: (
    text: string,
    courseTag?: string,
    attachment?: { url: string; name: string; type: string },
  ) => void;
  onSendVoiceMessage: (audioUrl: string, audioDurationSec: number, courseTag?: string) => void;
  onDeleteMessage: (id: string) => void;
  onClearHistory: () => void;
  isParticipantsOpen: boolean;
  onOpenParticipants: () => void;
  onCloseParticipants: () => void;
}

interface AttachmentPreview {
  url: string;
  name: string;
  type?: string;
}

export default function ChatWindow({ 
  messages, 
  onSendMessage, 
  onSendVoiceMessage,
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
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [selectedQuickTag, setSelectedQuickTag] = useState<string | undefined>(undefined);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [previewAttachment, setPreviewAttachment] = useState<AttachmentPreview | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const attachmentInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recordingChunksRef = useRef<BlobPart[]>([]);
  const recordingStartAtRef = useRef<number | null>(null);

  useEffect(() => {
    if (scrollRef.current && !isSearchOpen) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isSearchOpen]);

  useEffect(() => {
    if (!isRecordingVoice) return;
    const timer = window.setInterval(() => {
      if (!recordingStartAtRef.current) return;
      const elapsedMs = Date.now() - recordingStartAtRef.current;
      setRecordingSeconds(Math.max(1, Math.round(elapsedMs / 1000)));
    }, 300);
    return () => window.clearInterval(timer);
  }, [isRecordingVoice]);

  useEffect(() => {
    return () => {
      mediaRecorderRef.current?.stop();
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const handleSend = () => {
    if (!inputText.trim() && !attachedFile) return;

    // Detect course tag [Course Name] at start
    let text = inputText.trim();
    let courseTag: string | undefined;

    const tagMatch = text.match(/^\[(.*?)\]\s*(.*)/);
    if (tagMatch) {
      courseTag = tagMatch[1];
      text = tagMatch[2];
    }
    if (!courseTag && selectedQuickTag) {
      courseTag = selectedQuickTag;
    }

    const attachment = attachedFile
      ? {
          url: URL.createObjectURL(attachedFile),
          name: attachedFile.name,
          type: attachedFile.type || "application/octet-stream",
        }
      : undefined;

    onSendMessage(text, courseTag, attachment);
    setInputText("");
    setAttachedFile(null);
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
    (msg.courseTag && msg.courseTag.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (msg.attachmentName && msg.attachmentName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const quickTags = useMemo(
    () =>
      Array.from(
        new Set(
          unifiedSupportChat.participants
            .map((p) => p.course)
            .filter((course): course is string => Boolean(course)),
        ),
      ),
    [],
  );

  const isImageAttachment = (type?: string, name?: string) =>
    !!type?.startsWith("image/") || !!name?.match(/\.(png|jpe?g|gif|webp|bmp|svg)$/i);

  const isPdfAttachment = (type?: string, name?: string) =>
    type === "application/pdf" || !!name?.toLowerCase().endsWith(".pdf");

  const handlePickAttachment = () => {
    attachmentInputRef.current?.click();
  };

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAttachedFile(file);
    toast.success(`Attached: ${file.name}`);
  };

  const toggleVoiceInput = async () => {
    if (isRecordingVoice && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      return;
    }

    if (!(window as any).MediaRecorder || !navigator.mediaDevices?.getUserMedia) {
      toast.error("Voice recording is not supported in this browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      recordingChunksRef.current = [];
      recordingStartAtRef.current = Date.now();
      setRecordingSeconds(0);

      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          recordingChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const durationSec = Math.max(1, recordingSeconds || Math.round((Date.now() - (recordingStartAtRef.current || Date.now())) / 1000));
        const audioBlob = new Blob(recordingChunksRef.current, { type: recorder.mimeType || "audio/webm" });
        const audioUrl = URL.createObjectURL(audioBlob);

        onSendVoiceMessage(audioUrl, durationSec, selectedQuickTag);

        recordingChunksRef.current = [];
        recordingStartAtRef.current = null;
        setRecordingSeconds(0);
        setIsRecordingVoice(false);
        mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      };

      recorder.onerror = () => {
        toast.error("Could not record voice message.");
        setIsRecordingVoice(false);
        mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      };

      recorder.start();
      setIsRecordingVoice(true);
    } catch {
      toast.error("Microphone permission denied or unavailable.");
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
      {/* Header */}
      <div className="px-4 py-4 sm:px-8 sm:py-6 border-b border-border/40 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10 shadow-sm min-h-[84px] sm:min-h-[100px]">
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
            <div className="flex items-center gap-3 sm:gap-5 min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10 shrink-0">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-foreground truncate">{unifiedSupportChat.title}</h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className={cn("w-1.5 h-1.5 rounded-full", isMuted ? "bg-slate-300" : "bg-emerald-500")} />
                  <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest truncate">
                    {isMuted ? "Notifications Muted" : "Support Team Online"}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Dialog open={isParticipantsOpen} onOpenChange={(open) => !open && onCloseParticipants()}>
                <button 
                  onClick={onOpenParticipants}
                  className="hidden sm:flex flex-col items-end mr-4 hover:opacity-70 transition-opacity group outline-none"
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

                <DialogContent className="rounded-3xl sm:rounded-[2.5rem] w-[calc(100vw-1rem)] sm:w-[calc(100vw-3rem)] md:w-[calc(100vw-5rem)] max-w-4xl p-4 sm:p-8 border-none shadow-2xl max-h-[88vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  <DialogHeader className="mb-4 sm:mb-6">
                    <DialogTitle className="text-xl sm:text-2xl font-black tracking-tight">Group Participants</DialogTitle>
                    <DialogDescription className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-1">
                      Assigned Support Experts
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 sm:space-y-6">
                    <div className="rounded-3xl bg-muted/30 border border-border/40 p-4 sm:p-6">
                      <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10">
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
                      <div className="grid grid-cols-1 gap-2 sm:gap-3">
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
                    onClick={onOpenParticipants}
                    className="rounded-xl p-3 text-xs font-bold gap-3 cursor-pointer"
                  >
                    <Users className="w-4 h-4 text-muted-foreground" />
                    Participants
                  </DropdownMenuItem>
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
              onPreviewAttachment={setPreviewAttachment}
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
      <div className="border-t border-border/40 bg-white p-4 sm:p-6">
        <div className="mx-auto max-w-4xl space-y-3 sm:space-y-4">
          {/* Quick Tags */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 animate-in fade-in slide-in-from-bottom-1 duration-500">
            <span className="mr-1 text-[8px] sm:text-[9px] font-black text-muted-foreground/60 uppercase tracking-[0.16em] sm:tracking-widest">Quick Tag:</span>
            {quickTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedQuickTag((prev) => (prev === tag ? undefined : tag))}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[9px] sm:text-[10px] font-bold transition-all active:scale-95 max-w-[42vw] sm:max-w-none truncate",
                  selectedQuickTag === tag
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "border-border/40 bg-slate-100 text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/20",
                )}
                title={tag}
              >
                {tag}
              </button>
            ))}
          </div>

          {attachedFile && (
            <div className="flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-muted/30 px-3 py-2 text-xs">
              <span className="truncate font-medium text-foreground">Attached: {attachedFile.name}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-lg text-muted-foreground"
                onClick={() => setAttachedFile(null)}
              >
                <CloseIcon className="h-4 w-4" />
              </Button>
            </div>
          )}

          {isRecordingVoice && (
            <div className="flex items-center justify-between gap-3 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-xs">
              <span className="font-semibold text-primary">
                Recording voice... {recordingSeconds}s
              </span>
              <span className="text-muted-foreground">Tap mic to stop & send</span>
            </div>
          )}

          <div className="flex items-center gap-2.5 sm:gap-4">
            <div className="flex-1 relative flex items-center">
              <input
                ref={attachmentInputRef}
                type="file"
                className="hidden"
                onChange={handleAttachmentChange}
              />
              <div className="absolute left-3">
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-9 w-9 sm:h-11 sm:w-11 rounded-xl sm:rounded-2xl text-muted-foreground hover:bg-muted/60 transition-colors flex items-center justify-center"
                  onClick={handlePickAttachment}
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </div>
              <textarea 
                placeholder="Type" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                className="w-full min-h-[50px] sm:min-h-[60px] max-h-32 py-3 sm:py-[18px] pl-12 sm:pl-16 pr-4 sm:pr-6 rounded-[1.5rem] sm:rounded-[2rem] bg-slate-100/50 border-none focus:ring-2 focus:ring-primary/20 text-sm font-medium resize-none shadow-inner transition-all overflow-hidden"
              />
            </div>
            <Button
              type="button"
              onClick={toggleVoiceInput}
              className={cn(
                "h-[50px] w-[50px] sm:h-[60px] sm:w-[60px] rounded-[1.5rem] sm:rounded-[2rem] shadow-xl transition-all shrink-0 flex items-center justify-center p-0",
                isRecordingVoice
                  ? "bg-rose-500/90 hover:bg-rose-500 shadow-rose-500/30"
                  : "bg-muted text-foreground hover:bg-muted/80 shadow-muted/40",
              )}
            >
              <Mic className="w-5 h-5 sm:w-6 sm:h-6" />
            </Button>
            <Button 
              onClick={handleSend}
              disabled={!inputText.trim() && !attachedFile}
              className="h-[50px] w-[50px] sm:h-[60px] sm:w-[60px] rounded-[1.5rem] sm:rounded-[2rem] bg-primary shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all shrink-0 flex items-center justify-center p-0"
            >
              <Send className="w-5 h-5 sm:w-6 sm:h-6 text-white ml-0.5" />
            </Button>
          </div>
        </div>
      </div>

      <Dialog
        open={!!previewAttachment}
        onOpenChange={(open) => {
          if (!open) setPreviewAttachment(null);
        }}
      >
        <DialogContent className="w-[calc(100vw-1rem)] max-w-4xl rounded-2xl p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="truncate pr-8 text-sm sm:text-base">
              {previewAttachment?.name || "Attachment Preview"}
            </DialogTitle>
          </DialogHeader>

          {previewAttachment ? (
            <div className="max-h-[80vh] overflow-auto rounded-xl border border-border/50 bg-muted/20 p-2 sm:p-3">
              {isImageAttachment(previewAttachment.type, previewAttachment.name) ? (
                <img
                  src={previewAttachment.url}
                  alt={previewAttachment.name}
                  className="mx-auto max-h-[70vh] w-auto max-w-full rounded-lg object-contain"
                />
              ) : isPdfAttachment(previewAttachment.type, previewAttachment.name) ? (
                <iframe
                  src={previewAttachment.url}
                  title={previewAttachment.name}
                  className="h-[65vh] w-full rounded-lg bg-white"
                />
              ) : (
                <div className="p-4 sm:p-6 text-center space-y-2">
                  <p className="text-sm font-semibold text-foreground break-all">{previewAttachment.name}</p>
                  <p className="text-xs text-muted-foreground">Preview is not available for this file type.</p>
                  <a
                    href={previewAttachment.url}
                    download={previewAttachment.name}
                    className="inline-flex rounded-lg border border-border/60 bg-background px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted"
                  >
                    Download file
                  </a>
                </div>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MessageBubble({
  message,
  showSender,
  onDelete,
  onPreviewAttachment,
}: {
  message: Message,
  showSender: boolean,
  onDelete: () => void,
  onPreviewAttachment: (attachment: AttachmentPreview) => void,
}) {
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
      
      <div className={cn("relative flex items-center gap-2 group", message.isOwn && "justify-end sm:pr-10")}>
        <div className={cn(
          "max-w-[86%] sm:max-w-[70%] px-4 sm:px-6 py-3 sm:py-4 rounded-[1.5rem] sm:rounded-[2rem] shadow-sm relative transition-all hover:shadow-md",
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
          {message.audioUrl ? (
            <div>
              <VoiceMessagePlayer audioUrl={message.audioUrl} isOwn={message.isOwn} />
            </div>
          ) : message.attachmentUrl ? (
            <div className="space-y-2">
              {message.attachmentType?.startsWith("image/") ? (
                <button
                  type="button"
                  className="block"
                  onClick={() =>
                    onPreviewAttachment({
                      url: message.attachmentUrl!,
                      name: message.attachmentName || "Attachment",
                      type: message.attachmentType,
                    })
                  }
                >
                  <img
                    src={message.attachmentUrl}
                    alt={message.attachmentName || "Attached image"}
                    className="w-full max-w-[280px] sm:max-w-[320px] rounded-2xl object-cover border border-white/20"
                  />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    onPreviewAttachment({
                      url: message.attachmentUrl!,
                      name: message.attachmentName || "Attachment",
                      type: message.attachmentType,
                    })
                  }
                  className={cn(
                    "rounded-xl px-3 py-2 text-xs font-semibold border text-left",
                    message.isOwn
                      ? "bg-white/10 border-white/20 text-white"
                      : "bg-muted/20 border-border/50 text-foreground",
                  )}
                >
                  {message.attachmentName || "Attachment"}
                </button>
              )}
              {message.text ? (
                <p className="text-sm leading-relaxed font-medium">
                  {message.text}
                </p>
              ) : null}
            </div>
          ) : (
            <p className="text-sm leading-relaxed font-medium break-all">
              {message.text}
            </p>
          )}
        </div>

        {message.isOwn && (
          <div className="opacity-100 flex items-center gap-1.5 transition-opacity sm:absolute sm:right-0 sm:top-1/2 sm:-translate-y-1/2 sm:opacity-0 sm:group-hover:opacity-100">
            <span className="hidden sm:inline text-[9px] font-bold text-muted-foreground/40 tabular-nums uppercase">{message.timestamp}</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg sm:rounded-xl text-muted-foreground/40 hover:text-destructive hover:bg-destructive/5 transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl border-border/40 shadow-xl p-1 min-w-0 w-11">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem
                      onSelect={(e) => e.preventDefault()}
                      className="h-9 w-9 rounded-lg p-0 flex items-center justify-center text-destructive focus:text-destructive focus:bg-destructive/5 cursor-pointer"
                      aria-label="Delete message"
                    >
                      <Trash2 className="w-4 h-4" />
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete this message?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={onDelete}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

      </div>
    </div>
  );
}

function VoiceMessagePlayer({ audioUrl, isOwn }: { audioUrl: string; isOwn: boolean }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const formatTime = (time: number) => {
    const total = Math.max(0, Math.floor(time));
    const min = Math.floor(total / 60);
    const sec = total % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  const togglePlay = async () => {
    const el = audioRef.current;
    if (!el) return;

    try {
      if (isPlaying) {
        el.pause();
      } else {
        await el.play();
      }
    } catch {
      toast.error("Unable to play voice message.");
    }
  };

  return (
    <div className="w-[190px] sm:w-[340px] md:w-[430px] lg:w-[500px] max-w-full">
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentTime(0);
        }}
      />

      <div className="flex items-center gap-2 sm:gap-2.5">
        <button
          type="button"
          onClick={togglePlay}
          className={cn(
            "h-7 w-7 sm:h-8 sm:w-8 rounded-full flex items-center justify-center shrink-0 transition-colors",
            isOwn ? "bg-white text-primary hover:bg-white/90" : "bg-primary text-white hover:bg-primary/90",
          )}
          aria-label={isPlaying ? "Pause voice message" : "Play voice message"}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-0.5" />}
        </button>

        <div className="flex-1 min-w-0">
          <div className={cn("h-1.5 rounded-full overflow-hidden", isOwn ? "bg-white/30" : "bg-muted")}>
            <div
              className={cn("h-full rounded-full transition-all", isOwn ? "bg-white" : "bg-primary")}
              style={{ width: `${Math.min(100, Math.max(0, progressPct))}%` }}
            />
          </div>
        </div>

        <Volume2 className={cn("w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0", isOwn ? "text-white/80" : "text-muted-foreground")} />
      </div>

      <div className={cn("mt-1 text-[9px] sm:text-[10px] font-bold tabular-nums", isOwn ? "text-white/90" : "text-muted-foreground")}>
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>
    </div>
  );
}
