"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { PriorityBadge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Task } from "@/db/schema";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  isDragging?: boolean;
}

export function TaskCard({ task, onEdit, isDragging }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: `task-${task.id}`,
    data: { type: "task", task },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const dragging = isDragging || isSortableDragging;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onEdit(task)}
      className={cn(
        "p-3 bg-surface-0 rounded-lg border border-surface-200 cursor-grab active:cursor-grabbing",
        "hover:border-surface-300 transition-colors group",
        dragging && "opacity-50 shadow-card-hover rotate-2"
      )}
    >
      <p className="text-sm font-medium text-surface-800 group-hover:text-surface-900">
        {task.title}
      </p>
      {task.description && (
        <p className="mt-1 text-xs text-surface-400 line-clamp-2">
          {task.description}
        </p>
      )}
      <div className="mt-2">
        <PriorityBadge priority={task.priority} />
      </div>
    </div>
  );
}

export function TaskCardOverlay({ task }: { task: Task }) {
  return (
    <div className="p-3 bg-surface-0 rounded-lg border border-primary shadow-card-hover rotate-3 w-[260px]">
      <p className="text-sm font-medium text-surface-800">{task.title}</p>
      {task.description && (
        <p className="mt-1 text-xs text-surface-400 line-clamp-2">
          {task.description}
        </p>
      )}
      <div className="mt-2">
        <PriorityBadge priority={task.priority} />
      </div>
    </div>
  );
}
