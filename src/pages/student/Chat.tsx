import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import ChatWindow from "@/components/student/chat/ChatWindow";
import { unifiedSupportChat } from "@/data/chatMock";

export default function StudentChat() {
  const [messages, setMessages] = useState(unifiedSupportChat.messages);
  const location = useLocation();
  const navigate = useNavigate();

  const isParticipantsOpen = location.pathname === "/student/chat/participants";

  const handleSendMessage = (
    text: string,
    courseTag?: string,
    attachment?: { url: string; name: string; type: string },
  ) => {
    const newMessage = {
      id: Date.now().toString(),
      senderId: "s1", // Student ID from mock
      senderName: "YOU",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      courseTag,
      attachmentUrl: attachment?.url,
      attachmentName: attachment?.name,
      attachmentType: attachment?.type,
      isOwn: true,
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
            onSendVoiceMessage={handleSendVoiceMessage}
            onDeleteMessage={handleDeleteMessage}
            onClearHistory={handleClearHistory}
            isParticipantsOpen={isParticipantsOpen}
            onOpenParticipants={handleOpenParticipants}
            onCloseParticipants={handleCloseParticipants}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
