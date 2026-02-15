import { cn } from "@/lib/utils";
import { forwardRef, type ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-surface-0 hover:bg-primary-hover active:brightness-90",
  secondary:
    "bg-surface-100 text-surface-800 hover:bg-surface-200 border border-surface-200",
  ghost: "text-surface-500 hover:text-surface-800 hover:bg-surface-100",
  danger: "bg-danger text-white hover:bg-danger-hover active:brightness-90",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm gap-1.5",
  md: "h-9 px-4 text-sm gap-2",
  lg: "h-10 px-5 text-base gap-2",
  icon: "h-9 w-9 justify-center",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-lg font-medium transition-all duration-150 cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        disabled={disabled}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
