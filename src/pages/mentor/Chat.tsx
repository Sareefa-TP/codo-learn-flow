import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Users, Search, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const MentorChat = () => {
    return (
        <DashboardLayout>
            <div className="animate-fade-in space-y-8 max-w-7xl mx-auto pb-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                            <MessageSquare className="w-8 h-8 text-primary" />
                            Mentor Chat
                        </h1>
                        <p className="text-muted-foreground mt-2 text-sm lg:text-base">
                            Communicate and guide your students through real-time messaging.
                        </p>
                    </div>
                </div>

                {/* Main Chat Interface Placeholder */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-250px)] min-h-[500px]">
                    {/* Contacts List Placeholder */}
                    <Card className="lg:col-span-4 border-border/50 shadow-sm overflow-hidden flex flex-col rounded-2xl bg-card">
                        <div className="p-4 border-b border-border/40 bg-muted/20">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search students..."
                                    className="pl-9 h-10 rounded-xl bg-background border-border/50 text-sm focus:ring-primary/20"
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center text-center space-y-4 opacity-50 grayscale transition-all hover:grayscale-0">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                <Users className="w-8 h-8" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-bold text-foreground">Student List</h3>
                                <p className="text-xs text-muted-foreground max-w-[200px]">
                                    Your student contacts will appear here once connected.
                                </p>
                            </div>
                        </div>
                    </Card>

                    {/* Chat Window Placeholder */}
                    <Card className="lg:col-span-8 border-border/50 shadow-sm overflow-hidden flex flex-col rounded-2xl bg-card relative group">
                        {/* Decorative glassmorphism elements */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-indigo-500/5 pointer-events-none" />

                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative z-10">
                            <div className="w-24 h-24 rounded-3xl bg-primary/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                <MessageSquare className="w-12 h-12 text-primary opacity-20" />
                            </div>
                            <h2 className="text-2xl font-black tracking-tight text-foreground mb-3">Mentor Chat Hub</h2>
                            <p className="text-muted-foreground max-w-md leading-relaxed font-medium">
                                Here you will see all chats with students. We are currently finalizing the real-time messaging engine to ensure your communications are seamless and secure.
                            </p>

                            <div className="mt-8 flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-primary italic">Coming Soon</span>
                            </div>
                        </div>

                        {/* Input Area Placeholder */}
                        <div className="p-6 border-t border-border/40 bg-muted/10 relative z-10">
                            <div className="flex gap-3 opacity-30">
                                <Input
                                    placeholder="Type a message..."
                                    className="rounded-xl h-12 border-border/50 flex-1 cursor-not-allowed"
                                    disabled
                                />
                                <Button size="icon" className="h-12 w-12 rounded-xl bg-primary/50 cursor-not-allowed" disabled>
                                    <Send className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default MentorChat;
