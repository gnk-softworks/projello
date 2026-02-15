"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState, type ReactNode } from "react";

interface DropdownMenuProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: "left" | "right";
}

export function DropdownMenu({ trigger, children, align = "right" }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div
          className={cn(
            "absolute z-50 mt-1 min-w-[160px] py-1 bg-surface-50 rounded-lg border border-surface-200 shadow-dropdown animate-scale-in",
            align === "right" ? "right-0" : "left-0"
          )}
        >
          {typeof children === "function"
            ? (children as (close: () => void) => ReactNode)(() => setOpen(false))
            : <DropdownContext.Provider value={() => setOpen(false)}>{children}</DropdownContext.Provider>}
        </div>
      )}
    </div>
  );
}

import { createContext, useContext } from "react";
const DropdownContext = createContext<() => void>(() => {});

interface DropdownItemProps {
  onClick?: () => void;
  variant?: "default" | "danger";
  children: ReactNode;
  className?: string;
}

export function DropdownItem({ onClick, variant = "default", children, className }: DropdownItemProps) {
  const close = useContext(DropdownContext);
  return (
    <button
      onClick={() => {
        onClick?.();
        close();
      }}
      className={cn(
        "w-full flex items-center gap-2 px-3 py-1.5 text-sm text-left transition-colors cursor-pointer",
        variant === "default"
          ? "text-surface-600 hover:text-surface-900 hover:bg-surface-100"
          : "text-danger hover:bg-danger-muted",
        className
      )}
    >
      {children}
    </button>
  );
}

export function DropdownSeparator() {
  return <div className="my-1 border-t border-surface-200" />;
}
