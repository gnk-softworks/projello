"use client";

import { useState, useTransition } from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createProject } from "@/actions/projects";
import { cn } from "@/lib/utils";

const PROJECT_COLORS = [
  { name: "Indigo", value: "#818cf8" },
  { name: "Rose", value: "#fb7185" },
  { name: "Amber", value: "#fbbf24" },
  { name: "Emerald", value: "#34d399" },
  { name: "Cyan", value: "#22d3ee" },
  { name: "Violet", value: "#a78bfa" },
  { name: "Pink", value: "#f472b6" },
  { name: "Orange", value: "#fb923c" },
];

interface CreateProjectModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateProjectModal({ open, onClose }: CreateProjectModalProps) {
  const [color, setColor] = useState(PROJECT_COLORS[0].value);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("color", color);

    startTransition(async () => {
      await createProject(formData);
      onClose();
      setColor(PROJECT_COLORS[0].value);
    });
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <DialogHeader>New Project</DialogHeader>
        <DialogBody>
          <Input
            id="name"
            name="name"
            label="Name"
            placeholder="My awesome project"
            required
            autoFocus
          />
          <Textarea
            id="description"
            name="description"
            label="Description"
            placeholder="What's this project about?"
            rows={3}
          />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-surface-500">Color</label>
            <div className="flex flex-wrap gap-2">
              {PROJECT_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={cn(
                    "w-8 h-8 rounded-full transition-all cursor-pointer",
                    color === c.value
                      ? "ring-2 ring-offset-2 ring-offset-surface-50 scale-110"
                      : "hover:scale-105"
                  )}
                  style={{
                    backgroundColor: c.value,
                    "--tw-ring-color": c.value,
                  } as React.CSSProperties}
                  title={c.name}
                />
              ))}
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating..." : "Create Project"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
