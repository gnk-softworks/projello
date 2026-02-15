"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, type ReactNode } from "react";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export function Dialog({ open, onClose, children, className }: DialogProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div className="fixed inset-0 bg-black/60 animate-fade-in" />
      <div
        className={cn(
          "relative z-10 w-full max-w-md bg-surface-50 rounded-xl border border-surface-200 shadow-modal animate-scale-in",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("px-6 pt-6 pb-4", className)}>
      <h2 className="text-lg font-semibold text-surface-900">{children}</h2>
    </div>
  );
}

export function DialogBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("px-6 pb-4 space-y-4", className)}>{children}</div>;
}

export function DialogFooter({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "px-6 py-4 flex items-center justify-end gap-3 border-t border-surface-200",
        className
      )}
    >
      {children}
    </div>
  );
}
