"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TaskCard } from "@/components/task-card";
import { DropdownMenu, DropdownItem, DropdownSeparator } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Column, Task } from "@/db/schema";
import { useState, useRef, useEffect } from "react";

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onAddTask: (columnId: number) => void;
  onRenameColumn: (columnId: number, name: string) => void;
  onDeleteColumn: (columnId: number) => void;
}

export function KanbanColumn({
  column,
  tasks,
  onEditTask,
  onAddTask,
  onRenameColumn,
  onDeleteColumn,
}: KanbanColumnProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(column.name);
  const inputRef = useRef<HTMLInputElement>(null);

  const { setNodeRef, isOver } = useDroppable({
    id: `column-${column.id}`,
    data: { type: "column", column },
  });

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  function handleRename() {
    if (editName.trim() && editName.trim() !== column.name) {
      onRenameColumn(column.id, editName.trim());
    } else {
      setEditName(column.name);
    }
    setIsEditing(false);
  }

  return (
    <div className="flex flex-col w-[72vw] sm:w-[300px] shrink-0">
      <div className="flex items-center justify-between mb-3 px-1">
        {isEditing ? (
          <input
            ref={inputRef}
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleRename();
              if (e.key === "Escape") {
                setEditName(column.name);
                setIsEditing(false);
              }
            }}
            className="text-sm font-semibold bg-surface-50 border border-surface-200 rounded-md px-2 py-0.5 text-surface-800 focus:outline-none focus:ring-2 focus:ring-primary/50 w-full"
          />
        ) : (
          <h3
            className="text-sm font-semibold text-surface-500 cursor-pointer hover:text-surface-700 transition-colors"
            onDoubleClick={() => setIsEditing(true)}
          >
            {column.name}
            <span className="ml-2 text-xs font-normal text-surface-300">
              {tasks.length}
            </span>
          </h3>
        )}
        <DropdownMenu
          trigger={
            <button className="p-1 rounded-md hover:bg-surface-100 text-surface-300 hover:text-surface-500 cursor-pointer">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="5" r="1" />
                <circle cx="12" cy="12" r="1" />
                <circle cx="12" cy="19" r="1" />
              </svg>
            </button>
          }
        >
          <DropdownItem onClick={() => setIsEditing(true)}>
            Rename column
          </DropdownItem>
          <DropdownItem onClick={() => onAddTask(column.id)}>
            Add task
          </DropdownItem>
          <DropdownSeparator />
          <DropdownItem variant="danger" onClick={() => onDeleteColumn(column.id)}>
            Delete column
          </DropdownItem>
        </DropdownMenu>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 space-y-2 p-2 rounded-xl min-h-[200px] transition-colors",
          isOver ? "bg-primary/5 border-2 border-dashed border-primary/30" : "bg-surface-50/50"
        )}
      >
        <SortableContext
          items={tasks.map((t) => `task-${t.id}`)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={onEditTask} />
          ))}
        </SortableContext>

        <button
          onClick={() => onAddTask(column.id)}
          className="w-full flex items-center gap-1.5 px-3 py-2 text-sm text-surface-400 hover:text-surface-600 hover:bg-surface-100 rounded-lg transition-colors cursor-pointer"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14" />
            <path d="M5 12h14" />
          </svg>
          Add task
        </button>
      </div>
    </div>
  );
}
