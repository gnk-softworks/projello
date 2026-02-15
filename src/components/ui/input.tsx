import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-surface-500">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            "w-full h-9 px-3 rounded-lg text-sm bg-surface-50 border border-surface-200 text-surface-900",
            "placeholder:text-surface-400",
            "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
            "transition-colors duration-150",
            error && "border-danger focus:ring-danger/50",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-danger">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
