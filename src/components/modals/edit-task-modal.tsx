"use client";

import { useTransition } from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { updateTask, deleteTask } from "@/actions/tasks";
import type { Task } from "@/db/schema";

interface EditTaskModalProps {
  open: boolean;
  onClose: () => void;
  task: Task | null;
  projectId: number;
}

const PRIORITIES = [
  { value: "low", label: "Low", color: "bg-priority-low" },
  { value: "medium", label: "Medium", color: "bg-priority-medium" },
  { value: "high", label: "High", color: "bg-priority-high" },
  { value: "urgent", label: "Urgent", color: "bg-priority-urgent" },
];

export function EditTaskModal({ open, onClose, task, projectId }: EditTaskModalProps) {
  const [isPending, startTransition] = useTransition();

  if (!task) return null;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      await updateTask(task!.id, projectId, formData);
      onClose();
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteTask(task!.id, projectId);
      onClose();
    });
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <DialogHeader>Edit Task</DialogHeader>
        <DialogBody>
          <Input
            id="edit-title"
            name="title"
            label="Title"
            defaultValue={task.title}
            required
            autoFocus
          />
          <Textarea
            id="edit-description"
            name="description"
            label="Description"
            defaultValue={task.description || ""}
            rows={3}
          />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-surface-500">Priority</label>
            <div className="flex gap-2">
              {PRIORITIES.map((p) => (
                <label
                  key={p.value}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-surface-200 cursor-pointer hover:bg-surface-100 has-[:checked]:border-primary has-[:checked]:bg-primary-muted transition-colors"
                >
                  <input
                    type="radio"
                    name="priority"
                    value={p.value}
                    defaultChecked={p.value === task.priority}
                    className="sr-only"
                  />
                  <span className={`w-2 h-2 rounded-full ${p.color}`} />
                  <span className="text-sm text-surface-600">{p.label}</span>
                </label>
              ))}
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button type="button" variant="danger" onClick={handleDelete} disabled={isPending}>
            Delete
          </Button>
          <div className="flex-1" />
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
