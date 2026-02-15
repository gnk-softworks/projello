import { cn } from "@/lib/utils";
import { forwardRef, type HTMLAttributes } from "react";

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-surface-50 rounded-xl border border-surface-200 shadow-card transition-shadow duration-200",
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = "Card";
