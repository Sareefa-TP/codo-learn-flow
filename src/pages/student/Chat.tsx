import { useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import ChatWindow from "@/components/student/chat/ChatWindow";
import { unifiedSupportChat, Message } from "@/data/chatMock";

export default function StudentChat() {
  const [messages, setMessages] = useState(unifiedSupportChat.messages);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const isParticipantsOpen = location.pathname === "/student/chat/participants";
  const selectedMediaUrl = searchParams.get("media");

  const handleOpenMedia = (url: string) => {
    setSearchParams({ media: url });
  };

  const handleCloseMedia = () => {
    setSearchParams({});
  };

  const handleSendMessage = (text: string, courseTag?: string, files?: File[], replyTo?: Message) => {
    if (files && files.length > 0) {
      const newMessages = files.map(file => ({
        id: (Date.now() + Math.random()).toString(),
        senderId: "s1",
        senderName: "YOU",
        text: text || "File attached",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        courseTag,
        isOwn: true,
        isFile: true,
        fileName: file.name,
        fileType: file.type.includes('image') ? 'image' as const : 'pdf' as const,
        fileUrl: URL.createObjectURL(file),
        replyTo
      }));
      setMessages([...messages, ...newMessages]);
    } else {
      const newMessage: Message = {
        id: Date.now().toString(),
        senderId: "s1",
        senderName: "YOU",
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        courseTag,
        isOwn: true,
        isFile: false,
        replyTo
      };
      setMessages([...messages, newMessage]);
    }
  };

  const handleSendVoice = (duration: string, voiceUrl?: string) => {
    const newMessage = {
      id: Date.now().toString(),
      senderId: "s1",
      senderName: "YOU",
      text: "Voice message",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
      isVoice: true,
      voiceDuration: duration,
      voiceUrl
    };
    setMessages([...messages, newMessage]);
  };

  const handleSendVoiceMessage = (audioUrl: string, audioDurationSec: number, courseTag?: string) => {
    const newMessage = {
      id: Date.now().toString(),
      senderId: "s1",
      senderName: "YOU",
      text: "",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      courseTag,
      audioUrl,
      audioDurationSec,
      isOwn: true,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter(m => m.id !== messageId));
  };

  const handleClearHistory = () => {
    setMessages([]);
  };

  const handleOpenParticipants = () => {
    navigate("/student/chat/participants");
  };

  const handleCloseParticipants = () => {
    navigate("/student/chat");
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-140px)] max-w-[1200px] mx-auto animate-fade-in">
        <div className="bg-white border border-border/40 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 h-full overflow-hidden flex">
          {/* Main Messaging Canvas - Full Width */}
          <ChatWindow 
            messages={messages} 
            onSendMessage={handleSendMessage} 
            onSendVoice={handleSendVoice}
            onDeleteMessage={handleDeleteMessage}
            onClearHistory={handleClearHistory}
            isParticipantsOpen={isParticipantsOpen}
            onOpenParticipants={handleOpenParticipants}
            onCloseParticipants={handleCloseParticipants}
            selectedMediaUrl={selectedMediaUrl}
            onOpenMedia={handleOpenMedia}
            onCloseMedia={handleCloseMedia}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
