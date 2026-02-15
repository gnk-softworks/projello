"use client";

import { useState, useTransition, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { KanbanColumn } from "@/components/kanban-column";
import { TaskCardOverlay } from "@/components/task-card";
import { CreateTaskModal } from "@/components/modals/create-task-modal";
import { EditTaskModal } from "@/components/modals/edit-task-modal";
import { Button } from "@/components/ui/button";
import {
  moveTaskBetweenColumns,
  reorderTasksInColumn,
} from "@/actions/tasks";
import { renameColumn, deleteColumn, createColumn } from "@/actions/columns";
import type { Column, Task } from "@/db/schema";

interface KanbanBoardProps {
  projectId: number;
  initialColumns: Column[];
  initialTasks: Task[];
}

type ColumnTasks = Record<number, Task[]>;

function groupTasksByColumn(allTasks: Task[], allColumns: Column[]): ColumnTasks {
  const grouped: ColumnTasks = {};
  for (const col of allColumns) {
    grouped[col.id] = allTasks
      .filter((t) => t.columnId === col.id)
      .sort((a, b) => a.position - b.position);
  }
  return grouped;
}

export function KanbanBoard({
  projectId,
  initialColumns,
  initialTasks,
}: KanbanBoardProps) {
  const [cols] = useState(initialColumns);
  const [columnTasks, setColumnTasks] = useState<ColumnTasks>(() =>
    groupTasksByColumn(initialTasks, initialColumns)
  );
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [createTaskForColumn, setCreateTaskForColumn] = useState<number | null>(null);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [isPending, startTransition] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  function findColumnOfTask(taskId: number): number | null {
    for (const [colId, tasks] of Object.entries(columnTasks)) {
      if (tasks.some((t) => t.id === taskId)) return Number(colId);
    }
    return null;
  }

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    if (active.data.current?.type === "task") {
      setActiveTask(active.data.current.task);
    }
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    if (!activeId.startsWith("task-")) return;

    const activeTaskId = parseInt(activeId.replace("task-", ""));
    const sourceColId = findColumnOfTask(activeTaskId);
    if (sourceColId === null) return;

    let destColId: number;
    if (overId.startsWith("column-")) {
      destColId = parseInt(overId.replace("column-", ""));
    } else if (overId.startsWith("task-")) {
      const overTaskId = parseInt(overId.replace("task-", ""));
      destColId = findColumnOfTask(overTaskId) ?? sourceColId;
    } else {
      return;
    }

    if (sourceColId === destColId) return;

    // Move task between columns optimistically
    setColumnTasks((prev) => {
      const sourceTasks = [...(prev[sourceColId] || [])];
      const destTasks = [...(prev[destColId] || [])];

      const taskIndex = sourceTasks.findIndex((t) => t.id === activeTaskId);
      if (taskIndex === -1) return prev;

      const [movedTask] = sourceTasks.splice(taskIndex, 1);
      const updatedTask = { ...movedTask, columnId: destColId };

      // Find insert position
      if (overId.startsWith("task-")) {
        const overTaskId = parseInt(overId.replace("task-", ""));
        const overIndex = destTasks.findIndex((t) => t.id === overTaskId);
        destTasks.splice(overIndex >= 0 ? overIndex : destTasks.length, 0, updatedTask);
      } else {
        destTasks.push(updatedTask);
      }

      return {
        ...prev,
        [sourceColId]: sourceTasks,
        [destColId]: destTasks,
      };
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    if (!activeId.startsWith("task-")) return;

    const activeTaskId = parseInt(activeId.replace("task-", ""));
    const colId = findColumnOfTask(activeTaskId);
    if (colId === null) return;

    // Reorder within same column
    if (overId.startsWith("task-")) {
      const overTaskId = parseInt(overId.replace("task-", ""));
      const overColId = findColumnOfTask(overTaskId);

      if (colId === overColId && activeTaskId !== overTaskId) {
        setColumnTasks((prev) => {
          const tasks = [...(prev[colId] || [])];
          const oldIndex = tasks.findIndex((t) => t.id === activeTaskId);
          const newIndex = tasks.findIndex((t) => t.id === overTaskId);
          if (oldIndex === -1 || newIndex === -1) return prev;

          return {
            ...prev,
            [colId]: arrayMove(tasks, oldIndex, newIndex),
          };
        });
      }
    }

    // Persist the final state
    startTransition(() => {
      // Read latest state
      setColumnTasks((current) => {
        // Find which column the task is now in
        for (const [cId, tasks] of Object.entries(current)) {
          const columnId = Number(cId);
          const taskIndex = tasks.findIndex((t) => t.id === activeTaskId);
          if (taskIndex !== -1) {
            const taskIds = tasks.map((t) => t.id);

            // Check if task moved columns
            const originalCol = initialTasks.find((t) => t.id === activeTaskId)?.columnId;
            if (originalCol !== undefined && originalCol !== columnId) {
              const sourceTaskIds = (current[originalCol] || []).map((t) => t.id);
              moveTaskBetweenColumns(
                projectId,
                activeTaskId,
                columnId,
                taskIndex,
                sourceTaskIds,
                taskIds
              );
            } else {
              reorderTasksInColumn(projectId, columnId, taskIds);
            }
            break;
          }
        }
        return current;
      });
    });
  }

  const handleRenameColumn = useCallback(
    (columnId: number, name: string) => {
      startTransition(async () => {
        await renameColumn(columnId, name, projectId);
      });
    },
    [projectId]
  );

  const handleDeleteColumn = useCallback(
    (columnId: number) => {
      startTransition(async () => {
        await deleteColumn(columnId, projectId);
      });
    },
    [projectId]
  );

  const handleAddColumn = useCallback(() => {
    const name = prompt("Column name:");
    if (name?.trim()) {
      startTransition(async () => {
        await createColumn(projectId, name);
      });
    }
  }, [projectId]);

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-5 p-6 overflow-x-auto h-full items-start">
          {cols.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={columnTasks[column.id] || []}
              onEditTask={setEditTask}
              onAddTask={setCreateTaskForColumn}
              onRenameColumn={handleRenameColumn}
              onDeleteColumn={handleDeleteColumn}
            />
          ))}

          <button
            onClick={handleAddColumn}
            className="flex items-center gap-2 px-4 py-2 text-sm text-surface-400 hover:text-surface-600 bg-surface-50/50 hover:bg-surface-100 rounded-xl border border-dashed border-surface-200 hover:border-surface-300 transition-colors shrink-0 h-fit cursor-pointer"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
            Add Column
          </button>
        </div>

        <DragOverlay>
          {activeTask ? <TaskCardOverlay task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>

      <CreateTaskModal
        open={createTaskForColumn !== null}
        onClose={() => setCreateTaskForColumn(null)}
        columnId={createTaskForColumn ?? 0}
        projectId={projectId}
      />

      <EditTaskModal
        open={editTask !== null}
        onClose={() => setEditTask(null)}
        task={editTask}
        projectId={projectId}
      />
    </>
  );
}
