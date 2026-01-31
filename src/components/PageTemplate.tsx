import { ReactNode } from "react";
import { useRole } from "@/hooks/useRole";

interface PageTemplateProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

const PageTemplate = ({ title, description, children }: PageTemplateProps) => {
  const { displayInfo } = useRole();

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-semibold text-foreground tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-muted-foreground mt-2">{description}</p>
        )}
      </div>

      {children || (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <div className={`w-16 h-16 rounded-2xl ${displayInfo.color}/10 flex items-center justify-center mx-auto mb-4`}>
            <span className={`text-2xl ${displayInfo.color.replace('bg-', 'text-')}`}>🚧</span>
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">Coming Soon</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            This feature is being built with care. Check back soon for updates!
          </p>
        </div>
      )}
    </div>
  );
};

export default PageTemplate;
