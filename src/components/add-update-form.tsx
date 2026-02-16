"use client";

import { useRef, useTransition } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createUpdate } from "@/actions/updates";

export function AddUpdateForm({ projectId }: { projectId: number }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      await createUpdate(projectId, formData);
      formRef.current?.reset();
    });
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        name="content"
        placeholder="Write an update..."
        rows={3}
        required
      />
      <Button type="submit" disabled={isPending} size="sm">
        {isPending ? "Adding..." : "Add Update"}
      </Button>
    </form>
  );
}
