import { useState } from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const Logo = ({ className, size = "md" }: LogoProps) => {
  const [hasImageError, setHasImageError] = useState(false);

  const sizeClasses = {
    sm: {
      wrapper: "h-8",
      mark: "w-8 h-8",
      text: "h-6",
      fallbackLetter: "text-sm",
      title: "text-lg",
      subtitle: "text-xs",
    },
    md: {
      wrapper: "h-10",
      mark: "w-10 h-10",
      text: "h-7",
      fallbackLetter: "text-base",
      title: "text-xl",
      subtitle: "text-xs",
    },
    lg: {
      wrapper: "h-14",
      mark: "w-14 h-14",
      text: "h-9",
      fallbackLetter: "text-xl",
      title: "text-2xl",
      subtitle: "text-sm",
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {hasImageError ? (
        <>
          <div
            className={cn(
              "flex items-center justify-center rounded-xl bg-primary shadow-sm",
              currentSize.mark
            )}
          >
            <span className={cn("font-semibold text-primary-foreground", currentSize.fallbackLetter)}>
              C
            </span>
          </div>
          <div className="flex flex-col">
            <span className={cn("font-semibold tracking-tight text-foreground", currentSize.title)}>
              CODO
            </span>
            <span className={cn("font-medium text-muted-foreground -mt-1", currentSize.subtitle)}>
              Academy
            </span>
          </div>
        </>
      ) : (
        <>
          <img
            src="/codo-logo-dark.webp"
            alt="CODO Academy"
            className={cn("block dark:hidden w-auto object-contain", currentSize.wrapper)}
            onError={() => setHasImageError(true)}
          />
          <img
            src="/codo-logo-light.webp"
            alt="CODO Academy"
            className={cn("hidden dark:block w-auto object-contain", currentSize.wrapper)}
            onError={() => setHasImageError(true)}
          />
        </>
      )}
    </div>
  );
};

export default Logo;
