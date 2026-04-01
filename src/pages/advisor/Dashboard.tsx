import DashboardLayout from "@/components/DashboardLayout";

const AdvisorDashboard = () => {
  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Advisor Dashboard 👋
        </h1>
        <p className="text-muted-foreground">
          Academic guidance and student support module coming soon.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-64 rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center text-center p-8 bg-muted/5">
           <p className="text-muted-foreground font-medium">Student progress monitoring will appear here.</p>
        </div>
        <div className="h-64 rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center text-center p-8 bg-muted/5">
           <p className="text-muted-foreground font-medium">Upcoming guidance sessions will appear here.</p>
        </div>
      </div>
    </div>
  );
};

export default AdvisorDashboard;
