"use client";

import { useTransition } from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteConfirmModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  onConfirm: () => Promise<void>;
}

export function DeleteConfirmModal({
  open,
  onClose,
  title,
  description,
  onConfirm,
}: DeleteConfirmModalProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogHeader>{title}</DialogHeader>
      <DialogBody>
        <p className="text-sm text-surface-500">{description}</p>
      </DialogBody>
      <DialogFooter>
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="danger"
          disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              await onConfirm();
            });
          }}
        >
          {isPending ? "Deleting..." : "Delete"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
