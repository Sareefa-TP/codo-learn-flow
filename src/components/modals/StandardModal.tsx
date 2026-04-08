import { type ReactNode, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createPortal } from "react-dom";

export function StandardModal({
  open,
  onOpenChange,
  title,
  subtitle,
  children,
  footer,
  minHeightClassName = "min-h-[600px]",
  bodyClassName = "p-6 space-y-6 custom-scrollbar",
  zIndexClassName = "z-[100]",
  closeOnBackdrop = false,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  minHeightClassName?: string;
  bodyClassName?: string;
  zIndexClassName?: string;
  closeOnBackdrop?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <>
      {/* Overlay layer (z-40) */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200`}
        onClick={() => {
          if (closeOnBackdrop) onOpenChange(false);
        }}
      />

      {/* Centering layer + modal (z-50) */}
      <div className={`fixed inset-0 z-50 flex items-center justify-center p-4`}>
        <div
          className={`bg-background border border-border/50 rounded-2xl shadow-2xl w-full max-w-2xl ${minHeightClassName} max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200`}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <div className="flex items-center justify-between p-6 border-b border-border/50 bg-muted/5 flex-shrink-0">
            <div className="min-w-0">
              <h2 className="text-xl font-bold tracking-tight truncate">{title}</h2>
              {subtitle && <p className="text-sm text-muted-foreground mt-1 truncate">{subtitle}</p>}
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground flex-shrink-0"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className={`flex-1 overflow-y-auto ${bodyClassName}`}>{children}</div>

          <div className="p-6 border-t border-border/50 bg-muted/5 flex items-center justify-end gap-3 mt-auto flex-shrink-0">
            {footer ?? (
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="rounded-xl px-6 h-10 font-semibold"
              >
                Close
              </Button>
            )}
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}

