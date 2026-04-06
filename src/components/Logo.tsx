import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const Logo = ({ className, size = "md" }: LogoProps) => {
  const sizeClasses = {
    sm: "h-8",
    md: "h-10",
    lg: "h-14",
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Logo mark */}
      <div
        className={cn(
          "flex items-center justify-center rounded-xl bg-primary",
          sizeClasses[size],
          size === "sm" ? "w-8" : size === "md" ? "w-10" : "w-14"
        )}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className={cn(
            "text-primary-foreground",
            size === "sm" ? "w-5 h-5" : size === "md" ? "w-6 h-6" : "w-8 h-8"
          )}
        >
          {/* Stylized "C" for CODO */}
          <path
            d="M12 4C7.58 4 4 7.58 4 12s3.58 8 8 8c1.85 0 3.55-.63 4.9-1.69"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Academic cap accent */}
          <path
            d="M14 8l4 2-4 2-4-2 4-2z"
            fill="currentColor"
          />
          <path
            d="M14 12v3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Wordmark */}
      <div className="flex flex-col">
        <span
          className={cn(
            "font-semibold tracking-tight text-foreground",
            size === "sm" ? "text-lg" : size === "md" ? "text-xl" : "text-2xl"
          )}
        >
          CODO
        </span>
        <span
          className={cn(
            "font-medium text-muted-foreground -mt-1",
            size === "sm" ? "text-xs" : size === "md" ? "text-xs" : "text-sm"
          )}
        >
          Academy
        </span>
      </div>
    </div>
  );
};

export default Logo;
