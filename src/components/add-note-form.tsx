"use client";

import { useRef, useTransition } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createNote } from "@/actions/notes";

export function AddNoteForm({ projectId }: { projectId: number }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      await createNote(projectId, formData);
      formRef.current?.reset();
    });
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        name="content"
        placeholder="Write a note or update..."
        rows={3}
        required
      />
      <Button type="submit" disabled={isPending} size="sm">
        {isPending ? "Adding..." : "Add Note"}
      </Button>
    </form>
  );
}
