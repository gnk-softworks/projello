"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreateProjectModal } from "@/components/modals/create-project-modal";

export function CreateProjectButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </svg>
        New Project
      </Button>
      <CreateProjectModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
