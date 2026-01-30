import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoleCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  colorClass: string;
  onClick: () => void;
  animationDelay?: number;
}

const RoleCard = ({
  icon: Icon,
  title,
  description,
  colorClass,
  onClick,
  animationDelay = 0,
}: RoleCardProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex flex-col items-center gap-4 p-8 rounded-2xl",
        "bg-card border border-border/50",
        "shadow-card hover:shadow-hover",
        "transition-all duration-200 ease-out",
        "hover:-translate-y-1",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "opacity-0 animate-fade-in"
      )}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {/* Icon container with role-specific color */}
      <div
        className={cn(
          "flex items-center justify-center w-16 h-16 rounded-xl",
          "transition-transform duration-200 ease-out",
          "group-hover:scale-110",
          colorClass
        )}
      >
        <Icon className="w-8 h-8 text-white" strokeWidth={1.75} />
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-card-foreground">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-muted-foreground text-center leading-relaxed max-w-[200px]">
        {description}
      </p>

      {/* Subtle arrow indicator on hover */}
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <svg
          className="w-5 h-5 text-muted-foreground/50"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 7l5 5m0 0l-5 5m5-5H6"
          />
        </svg>
      </div>
    </button>
  );
};

export default RoleCard;
