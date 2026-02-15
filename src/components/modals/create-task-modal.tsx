"use client";

import { useTransition } from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createTask } from "@/actions/tasks";

interface CreateTaskModalProps {
  open: boolean;
  onClose: () => void;
  columnId: number;
  projectId: number;
}

const PRIORITIES = [
  { value: "low", label: "Low", color: "bg-priority-low" },
  { value: "medium", label: "Medium", color: "bg-priority-medium" },
  { value: "high", label: "High", color: "bg-priority-high" },
  { value: "urgent", label: "Urgent", color: "bg-priority-urgent" },
];

export function CreateTaskModal({ open, onClose, columnId, projectId }: CreateTaskModalProps) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      await createTask(columnId, projectId, formData);
      onClose();
    });
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <DialogHeader>New Task</DialogHeader>
        <DialogBody>
          <Input
            id="title"
            name="title"
            label="Title"
            placeholder="What needs to be done?"
            required
            autoFocus
          />
          <Textarea
            id="description"
            name="description"
            label="Description"
            placeholder="Add more details..."
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
                    defaultChecked={p.value === "medium"}
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
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating..." : "Create Task"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
