"use client";

import { useState, useTransition, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogHeader, DialogBody, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { updateTask, deleteTask } from "@/actions/tasks";
import { getOrCreateTerminalSession, sendTerminalInput } from "@/actions/terminal";
import type { Task } from "@/db/schema";

interface EditTaskModalProps {
  open: boolean;
  onClose: () => void;
  task: Task | null;
  projectId: number;
  showAgentButton?: boolean;
}

const PRIORITIES = [
  { value: "low", label: "Low", color: "bg-priority-low" },
  { value: "medium", label: "Medium", color: "bg-priority-medium" },
  { value: "high", label: "High", color: "bg-priority-high" },
  { value: "urgent", label: "Urgent", color: "bg-priority-urgent" },
];

export function EditTaskModal({ open, onClose, task, projectId, showAgentButton }: EditTaskModalProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [priority, setPriority] = useState<string>(task?.priority ?? "medium");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  // Sync state when a different task is opened
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description ?? "");
      setPriority(task.priority);
    }
  }, [task]);

  const saveFields = useCallback(
    (fields: { title?: string; description?: string; priority?: string }) => {
      const t = fields.title ?? title;
      if (!t.trim()) return;

      const formData = new FormData();
      formData.set("title", fields.title ?? title);
      formData.set("description", fields.description ?? description);
      formData.set("priority", fields.priority ?? priority);

      startTransition(async () => {
        await updateTask(task!.id, projectId, formData);
      });
    },
    [title, description, priority, task, projectId, startTransition]
  );

  const debouncedSave = useCallback(
    (fields: { title?: string; description?: string; priority?: string }) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => saveFields(fields), 500);
    },
    [saveFields]
  );

  // Flush pending debounce on unmount / close
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  if (!task) return null;

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setTitle(val);
    debouncedSave({ title: val });
  }

  function handleDescriptionChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const val = e.target.value;
    setDescription(val);
    debouncedSave({ description: val });
  }

  function handlePriorityChange(val: string) {
    setPriority(val);
    // Priority is instant — no need to debounce
    if (debounceRef.current) clearTimeout(debounceRef.current);
    saveFields({ priority: val });
  }

  function handleDelete() {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    startTransition(async () => {
      await deleteTask(task!.id, projectId);
      onClose();
    });
  }

  function handleCompleteWithAgent() {
    startTransition(async () => {
      const sessionId = await getOrCreateTerminalSession(projectId);

      const escape = (s: string) => s.replace(/'/g, "'\\''");
      const t = escape(task!.title);
      const desc = escape(task!.description || "No description provided");

      const command = `claude 'Enter plan mode and implement the following task:\n\nTitle: ${t}\n\nDescription: ${desc}'\n`;
      await sendTerminalInput(sessionId, command);

      onClose();
      router.push(`/projects/${projectId}/terminal`);
    });
  }

  function handleClose() {
    // Flush any pending save before closing
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      saveFields({});
    }
    onClose();
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogHeader>
        <div className="flex items-center justify-between gap-3">
          <span>Edit Task</span>
          {showAgentButton && (
            <Button type="button" variant="secondary" size="sm" onClick={handleCompleteWithAgent} disabled={isPending}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="4 17 10 11 4 5" />
                <line x1="12" y1="19" x2="20" y2="19" />
              </svg>
              Complete with Agent
            </Button>
          )}
        </div>
      </DialogHeader>
      <DialogBody>
        <Input
          id="edit-title"
          label="Title"
          value={title}
          onChange={handleTitleChange}
          required
          autoFocus
        />
        <Textarea
          id="edit-description"
          label="Description"
          value={description}
          onChange={handleDescriptionChange}
          rows={6}
          className="resize-y"
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
                  checked={p.value === priority}
                  onChange={() => handlePriorityChange(p.value)}
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
        <Button type="button" variant="ghost" onClick={handleClose}>
          Close
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
