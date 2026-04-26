import { useState } from "react";
import FinanceLayout from "@/components/finance/FinanceLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ShieldCheck,
  FileBarChart,
  Download,
  Calendar,
  Filter,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  FileText,
  DollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Component ───────────────────────────────────────────────────────────────

const TaxCompliance = () => {
  return (
    <FinanceLayout>
      <div className="animate-fade-in space-y-8 max-w-[1440px] mx-auto pb-20">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-primary" />
              Tax & Compliance
            </h1>
            <p className="text-sm font-medium text-muted-foreground">
              Statutory tax records, GST output tracking and TDS liability management.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" className="h-11 rounded-xl font-bold text-xs uppercase tracking-widest border-border/60">
              <Download className="w-4 h-4 mr-2" />
              Full Audit Export (Excel)
            </Button>
          </div>
        </div>

        {/* Tax Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <Card className="rounded-[2rem] border-border/60 bg-card shadow-sm p-8">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">GST Collected (Output)</p>
              <div className="space-y-1">
                 <h2 className="text-3xl font-black tracking-tight text-emerald-600">₹2.45L</h2>
                 <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">For Period: Apr 2026</p>
              </div>
           </Card>
           <Card className="rounded-[2rem] border-border/60 bg-card shadow-sm p-8">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">TDS Liability (Input)</p>
              <div className="space-y-1">
                 <h2 className="text-3xl font-black tracking-tight text-indigo-600">₹42.8K</h2>
                 <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Payable to Govt.</p>
              </div>
           </Card>
           <Card className="rounded-[2rem] border-border/60 bg-card shadow-sm p-8">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">Net Tax Liability</p>
              <div className="space-y-1">
                 <h2 className="text-3xl font-black tracking-tight text-foreground">₹2.02L</h2>
                 <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Estimated Payment</p>
              </div>
           </Card>
           <Card className="rounded-[2rem] border-border/60 bg-card shadow-sm p-8">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">Audit Status</p>
              <div className="space-y-4">
                 <Badge className="bg-emerald-50 text-emerald-600 border-emerald-200 font-black text-[10px]">Verified</Badge>
                 <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest block">Last Check: 24h ago</p>
              </div>
           </Card>
        </div>

        {/* GST Filing Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           <Card className="lg:col-span-8 rounded-[2rem] border-border/60 bg-card shadow-sm overflow-hidden">
              <CardHeader className="p-8 border-b border-border/40 bg-muted/5">
                 <div className="flex items-center justify-between">
                    <div>
                       <CardTitle className="text-xl font-black tracking-tight">GST B2C Summary</CardTitle>
                       <CardDescription className="text-xs font-medium uppercase tracking-wider">Categorized by State and Tax Rate</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="h-9 rounded-xl text-[10px] font-black uppercase tracking-widest">
                       <Filter className="w-4 h-4 mr-2" />
                       Filter
                    </Button>
                 </div>
              </CardHeader>
              <div className="p-0">
                 <Table>
                    <TableHeader className="bg-muted/10">
                       <TableRow>
                          <TableHead className="pl-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">State Code</TableHead>
                          <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Tax Rate</TableHead>
                          <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Taxable Value</TableHead>
                          <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">IGST</TableHead>
                          <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">CGST/SGST</TableHead>
                          <TableHead className="pr-8 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Tax</TableHead>
                       </TableRow>
                    </TableHeader>
                    <TableBody>
                       <TableRow className="border-b border-border/40">
                          <TableCell className="pl-8 py-5 font-black">27 (Maharashtra)</TableCell>
                          <TableCell>18%</TableCell>
                          <TableCell className="font-bold">₹8,50,000</TableCell>
                          <TableCell>-</TableCell>
                          <TableCell className="font-bold">₹1,53,000</TableCell>
                          <TableCell className="pr-8 text-right font-black">₹1,53,000</TableCell>
                       </TableRow>
                       <TableRow className="border-b border-border/40">
                          <TableCell className="pl-8 py-5 font-black">29 (Karnataka)</TableCell>
                          <TableCell>18%</TableCell>
                          <TableCell className="font-bold">₹4,20,000</TableCell>
                          <TableCell className="font-bold">₹75,600</TableCell>
                          <TableCell>-</TableCell>
                          <TableCell className="pr-8 text-right font-black">₹75,600</TableCell>
                       </TableRow>
                       <TableRow className="border-b border-border/40">
                          <TableCell className="pl-8 py-5 font-black">07 (Delhi)</TableCell>
                          <TableCell>18%</TableCell>
                          <TableCell className="font-bold">₹1,10,000</TableCell>
                          <TableCell className="font-bold">₹19,800</TableCell>
                          <TableCell>-</TableCell>
                          <TableCell className="pr-8 text-right font-black">₹19,800</TableCell>
                       </TableRow>
                    </TableBody>
                 </Table>
              </div>
           </Card>

           <div className="lg:col-span-4 space-y-6">
              <Card className="rounded-[2rem] border-border/60 bg-card shadow-sm p-8">
                 <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-6">Compliance Tasks</h3>
                 <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-muted/5 border border-border/40">
                       <div className="p-2 rounded-xl bg-primary/10 text-primary">
                          <FileBarChart className="w-4 h-4" />
                       </div>
                       <div>
                          <p className="text-xs font-black uppercase tracking-tighter">GSTR-1 Preparation</p>
                          <p className="text-[10px] text-muted-foreground">Due in 11 days</p>
                       </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-muted/5 border border-border/40">
                       <div className="p-2 rounded-xl bg-violet-50 text-violet-600">
                          <DollarSign className="w-4 h-4" />
                       </div>
                       <div>
                          <p className="text-xs font-black uppercase tracking-tighter">TDS Deposit (26QB)</p>
                          <p className="text-[10px] text-muted-foreground">Due on 7th May</p>
                       </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                       <div className="p-2 rounded-xl bg-emerald-100/50">
                          <CheckCircle2 className="w-4 h-4" />
                       </div>
                       <div>
                          <p className="text-xs font-black uppercase tracking-tighter">KYC Verification</p>
                          <p className="text-[10px] text-muted-foreground">All Tutors Verified</p>
                       </div>
                    </div>
                 </div>
              </Card>

              <Card className="rounded-[2rem] border-border/60 bg-card shadow-sm p-8 bg-primary/5">
                 <h3 className="text-sm font-black tracking-tight text-primary mb-2">Audit Ready</h3>
                 <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                    Every transaction in this period has a valid tax invoice or refund credit note attached.
                 </p>
                 <Button className="w-full mt-6 h-11 rounded-xl bg-primary text-white font-bold text-xs uppercase tracking-widest">
                    Request CA Audit Access
                 </Button>
              </Card>
           </div>
        </div>

      </div>
    </FinanceLayout>
  );
};

export default TaxCompliance;
