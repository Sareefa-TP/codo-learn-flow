import { ShieldCheck, GraduationCap, Users, Info, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { unifiedSupportChat } from "@/data/chatMock";

export default function ChatSidebar() {
  return (
    <div className="w-full lg:w-[340px] border-r border-border/40 bg-slate-50/50 backdrop-blur-sm flex flex-col h-full overflow-hidden animate-in fade-in slide-in-from-left-4 duration-500">
      {/* Header */}
      <div className="p-8 pb-4">
        <h2 className="text-2xl font-black tracking-tight text-foreground">Support Hub</h2>
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mt-1.5">Your Expert Team</p>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-8">
        {/* Active Session Info */}
        <div className="rounded-[2rem] bg-white border border-border/60 p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Status</p>
              <h3 className="text-sm font-black text-foreground mt-0.5">Verified Group</h3>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-muted-foreground">Encryption</span>
              <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 text-[8px] font-black uppercase">End-to-End</Badge>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-muted-foreground">Participants</span>
              <span className="font-black tabular-nums">{unifiedSupportChat.participants.length}</span>
            </div>
          </div>
        </div>

        {/* Team Members List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Assigned Experts</p>
            <Users className="h-3 w-3 text-muted-foreground/40" />
          </div>
          
          <div className="space-y-2">
            {unifiedSupportChat.participants.filter(p => p.role !== 'Student').map((p) => (
              <div key={p.id} className="group flex items-center gap-4 p-3 rounded-2xl border border-transparent hover:border-border/60 hover:bg-white transition-all cursor-default">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center relative shrink-0">
                  <span className="text-xs font-black text-muted-foreground">{p.name.charAt(0)}</span>
                  {p.role === 'Tutor' && <GraduationCap className="absolute -top-1 -right-1 w-3 h-3 text-primary bg-white rounded-full p-0.5" />}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-black text-foreground truncate">{p.name}</p>
                  <p className="text-[9px] font-bold text-primary uppercase tracking-wider mt-0.5">{p.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Help */}
        <div className="space-y-4 pt-4 border-t border-border/40">
           <div className="flex items-center gap-2 px-2">
             <Info className="h-3 w-3 text-muted-foreground" />
             <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Resources</p>
           </div>
           <div className="space-y-2">
             <button className="w-full flex items-center justify-between p-3 rounded-xl bg-white/50 hover:bg-white text-[10px] font-bold text-muted-foreground border border-transparent hover:border-border/40 transition-all">
               <span>Knowledge Base</span>
               <ExternalLink className="h-3 w-3 opacity-40" />
             </button>
             <button className="w-full flex items-center justify-between p-3 rounded-xl bg-white/50 hover:bg-white text-[10px] font-bold text-muted-foreground border border-transparent hover:border-border/40 transition-all">
               <span>LMS Tutorials</span>
               <ExternalLink className="h-3 w-3 opacity-40" />
             </button>
           </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-8 border-t border-border/40 bg-white/40">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Live Connection</p>
        </div>
      </div>
    </div>
  );
}
