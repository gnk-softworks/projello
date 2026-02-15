import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "low" | "medium" | "high" | "urgent";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-surface-100 text-surface-500",
  low: "bg-priority-low/15 text-priority-low",
  medium: "bg-priority-medium/15 text-priority-medium",
  high: "bg-priority-high/15 text-priority-high",
  urgent: "bg-priority-urgent/15 text-priority-urgent",
};

export function Badge({ variant = "default", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: string }) {
  return (
    <Badge variant={priority as BadgeVariant}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </Badge>
  );
}
