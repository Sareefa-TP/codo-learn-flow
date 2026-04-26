import { useState } from "react";
import FinanceLayout from "@/components/finance/FinanceLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Settings as SettingsIcon,
  ShieldCheck,
  CreditCard,
  Building2,
  Percent,
  FileText,
  Mail,
  Bell,
  Save,
  Undo2,
  Lock,
  Target,
  Plus,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Component ───────────────────────────────────────────────────────────────

const FinanceSettings = () => {
  return (
    <FinanceLayout>
      <div className="animate-fade-in space-y-8 max-w-[1440px] mx-auto pb-20">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
              <SettingsIcon className="w-8 h-8 text-primary" />
              Finance Settings
            </h1>
            <p className="text-sm font-medium text-muted-foreground">
              Configure commission rules, payout policies, and statutory compliance.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" className="h-11 rounded-xl font-bold text-xs uppercase tracking-widest border-border/60">
              <Undo2 className="w-4 h-4 mr-2" />
              Reset Defaults
            </Button>
            <Button className="h-11 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-widest px-6 shadow-xl shadow-primary/20">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        <Tabs defaultValue="commission" className="space-y-8">
           <TabsList className="bg-muted/20 p-1.5 rounded-2xl border border-border/40 w-full sm:w-auto h-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
              <TabsTrigger value="commission" className="rounded-xl h-10 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">
                 <Percent className="w-3.5 h-3.5 mr-2" />
                 Commission
              </TabsTrigger>
              <TabsTrigger value="payouts" className="rounded-xl h-10 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">
                 <CreditCard className="w-3.5 h-3.5 mr-2" />
                 Payouts
              </TabsTrigger>
              <TabsTrigger value="compliance" className="rounded-xl h-10 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">
                 <ShieldCheck className="w-3.5 h-3.5 mr-2" />
                 Compliance
              </TabsTrigger>
              <TabsTrigger value="automation" className="rounded-xl h-10 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">
                 <Mail className="w-3.5 h-3.5 mr-2" />
                 Automation
              </TabsTrigger>
           </TabsList>

           {/* 1. Commission Rules */}
           <TabsContent value="commission" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 <div className="lg:col-span-2 space-y-6">
                    <Card className="rounded-[2rem] border-border/60 bg-card shadow-sm p-8">
                       <h3 className="text-lg font-black tracking-tight mb-6">Global Commission Engine</h3>
                       <div className="space-y-6">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                             <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Tutor Revenue Share (%)</Label>
                                <Input type="number" defaultValue="70" className="h-12 rounded-xl border-border/60 font-bold text-lg" />
                             </div>
                             <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Mentor Revenue Share (%)</Label>
                                <Input type="number" defaultValue="15" className="h-12 rounded-xl border-border/60 font-bold text-lg" />
                             </div>
                          </div>
                          <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10">
                             <div className="flex items-center gap-3">
                                <Info className="w-5 h-5 text-primary" />
                                <p className="text-xs font-bold text-primary">LMS Net Retention: 15%</p>
                             </div>
                             <p className="text-[10px] text-muted-foreground mt-2">Calculated after payment gateway fees (approx 2.5%).</p>
                          </div>
                       </div>
                    </Card>

                    <Card className="rounded-[2rem] border-border/60 bg-card shadow-sm p-8">
                       <div className="flex items-center justify-between mb-6">
                          <h3 className="text-lg font-black tracking-tight">Category Overrides</h3>
                          <Button variant="outline" className="h-9 rounded-xl text-[10px] font-black uppercase tracking-widest">
                             <Plus className="w-3.5 h-3.5 mr-2" />
                             Add Rule
                          </Button>
                       </div>
                       <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/5 border border-border/40 group hover:border-primary/40 transition-colors">
                             <div className="flex items-center gap-4">
                                <div className="p-2 rounded-xl bg-violet-50 text-violet-600">
                                   <Target className="w-4 h-4" />
                                </div>
                                <div>
                                   <p className="text-sm font-black">Data Science Courses</p>
                                   <p className="text-[10px] text-muted-foreground">Tutor: 80% • Mentor: 10%</p>
                                </div>
                             </div>
                             <Button variant="ghost" size="icon" className="rounded-xl"><SettingsIcon className="w-4 h-4" /></Button>
                          </div>
                       </div>
                    </Card>
                 </div>
                 
                 <div className="space-y-6">
                    <Card className="rounded-[2rem] border-border/60 bg-card shadow-sm p-8 bg-amber-50/30">
                       <div className="flex items-center gap-3 text-amber-600 mb-4">
                          <Lock className="w-5 h-5" />
                          <h4 className="text-sm font-black uppercase tracking-widest">Governance</h4>
                       </div>
                       <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                          Commission overrides require a dual-approval process by Finance and Super Admin roles.
                       </p>
                    </Card>
                 </div>
              </div>
           </TabsContent>

           {/* 2. Payouts Policy */}
           <TabsContent value="payouts" className="space-y-6">
              <Card className="rounded-[2rem] border-border/60 bg-card shadow-sm p-8">
                 <h3 className="text-lg font-black tracking-tight mb-6">Payout Policy & Thresholds</h3>
                 <div className="space-y-8 max-w-2xl">
                    <div className="flex items-center justify-between">
                       <div className="space-y-1">
                          <Label className="text-sm font-black tracking-tight">Minimum Payout Threshold</Label>
                          <p className="text-[10px] text-muted-foreground">Min balance required for tutor to request payout.</p>
                       </div>
                       <div className="w-32">
                          <Input type="number" defaultValue="1000" className="h-10 rounded-xl border-border/60 text-right font-black" />
                       </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                       <div className="space-y-1">
                          <Label className="text-sm font-black tracking-tight">TDS Deduction (Fixed %)</Label>
                          <p className="text-[10px] text-muted-foreground">Statutory deduction at source for all payouts.</p>
                       </div>
                       <div className="w-32">
                          <Input type="number" defaultValue="10" className="h-10 rounded-xl border-border/60 text-right font-black" />
                       </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border/40">
                       <div className="space-y-1">
                          <Label className="text-sm font-black tracking-tight">Automatic Weekly Payouts</Label>
                          <p className="text-[10px] text-muted-foreground">Finance can still manually pause any queue.</p>
                       </div>
                       <Switch defaultChecked />
                    </div>
                 </div>
              </Card>
           </TabsContent>

           {/* 3. Compliance & GST */}
           <TabsContent value="compliance" className="space-y-6">
              <Card className="rounded-[2rem] border-border/60 bg-card shadow-sm p-8">
                 <h3 className="text-lg font-black tracking-tight mb-6">Tax Registration Details</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">GST Registration Number</Label>
                       <Input placeholder="27AAACR1234A1Z5" className="h-11 rounded-xl border-border/60 font-black" />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">PAN / Tax ID</Label>
                       <Input placeholder="AAACR1234A" className="h-11 rounded-xl border-border/60 font-black" />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Registered Business Address</Label>
                       <Input placeholder="123 Academy Lane, Mumbai, Maharashtra" className="h-11 rounded-xl border-border/60" />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Invoice HSN/SAC Code</Label>
                       <Input placeholder="9992 (Education Services)" className="h-11 rounded-xl border-border/60" />
                    </div>
                 </div>
              </Card>

              <Card className="rounded-[2rem] border-border/60 bg-card shadow-sm p-8">
                 <h3 className="text-lg font-black tracking-tight mb-6">Invoice Templates</h3>
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="aspect-[3/4] rounded-2xl bg-muted/20 border-2 border-primary/40 flex flex-col items-center justify-center p-6 text-center group cursor-pointer hover:bg-primary/5 transition-all">
                       <FileText className="w-12 h-12 text-primary mb-4" />
                       <p className="text-xs font-black uppercase tracking-widest">Standard GST</p>
                       <Badge className="mt-3 bg-primary text-white text-[8px] font-black uppercase">Active</Badge>
                    </div>
                    <div className="aspect-[3/4] rounded-2xl bg-muted/10 border border-border/60 flex flex-col items-center justify-center p-6 text-center group cursor-pointer hover:bg-muted/20 transition-all opacity-60">
                       <FileText className="w-12 h-12 text-muted-foreground mb-4" />
                       <p className="text-xs font-black uppercase tracking-widest">Pro-forma Lite</p>
                       <p className="text-[9px] font-bold text-muted-foreground mt-2 italic">Non-GST Template</p>
                    </div>
                 </div>
              </Card>
           </TabsContent>
        </Tabs>

      </div>
    </FinanceLayout>
  );
};

export default FinanceSettings;
