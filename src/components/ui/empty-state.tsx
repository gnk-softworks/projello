import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-4 text-center", className)}>
      {icon && <div className="mb-4 text-surface-300">{icon}</div>}
      <h3 className="text-lg font-medium text-surface-600">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-surface-400 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
