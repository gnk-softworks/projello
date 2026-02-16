"use client";

import { useTransition } from "react";
import { timeAgo, formatDate } from "@/lib/utils";
import { deleteUpdate } from "@/actions/updates";
import type { Update } from "@/db/schema";

interface UpdatesListProps {
  updates: Update[];
  projectId: number;
}

export function UpdatesList({ updates, projectId }: UpdatesListProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete(updateId: number) {
    startTransition(async () => {
      await deleteUpdate(updateId, projectId);
    });
  }

  if (updates.length === 0) {
    return (
      <p className="text-sm text-surface-400 text-center py-8">
        No updates yet. Add one above.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {updates.map((update) => (
        <div
          key={update.id}
          className="group relative pl-6 before:absolute before:left-[7px] before:top-2 before:w-2 before:h-2 before:rounded-full before:bg-surface-300 after:absolute after:left-[10px] after:top-5 after:w-px after:h-[calc(100%+0.5rem)] after:bg-surface-200 last:after:hidden"
        >
          <div className="bg-surface-50 border border-surface-200 rounded-lg p-4">
            <p className="text-sm text-surface-700 whitespace-pre-wrap">
              {update.content}
            </p>
            <div className="mt-2 flex items-center justify-between">
              <span
                className="text-xs text-surface-400"
                title={formatDate(update.createdAt)}
              >
                {timeAgo(update.createdAt)}
              </span>
              <button
                onClick={() => handleDelete(update.id)}
                disabled={isPending}
                className="opacity-0 group-hover:opacity-100 text-xs text-surface-400 hover:text-danger transition-all cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
