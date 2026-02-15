"use client";

import { useTransition } from "react";
import { timeAgo, formatDate } from "@/lib/utils";
import { deleteNote } from "@/actions/notes";
import type { Note } from "@/db/schema";

interface NotesListProps {
  notes: Note[];
  projectId: number;
}

export function NotesList({ notes, projectId }: NotesListProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete(noteId: number) {
    startTransition(async () => {
      await deleteNote(noteId, projectId);
    });
  }

  if (notes.length === 0) {
    return (
      <p className="text-sm text-surface-400 text-center py-8">
        No notes yet. Add one above.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <div
          key={note.id}
          className="group relative pl-6 before:absolute before:left-[7px] before:top-2 before:w-2 before:h-2 before:rounded-full before:bg-surface-300 after:absolute after:left-[10px] after:top-5 after:w-px after:h-[calc(100%+0.5rem)] after:bg-surface-200 last:after:hidden"
        >
          <div className="bg-surface-50 border border-surface-200 rounded-lg p-4">
            <p className="text-sm text-surface-700 whitespace-pre-wrap">
              {note.content}
            </p>
            <div className="mt-2 flex items-center justify-between">
              <span
                className="text-xs text-surface-400"
                title={formatDate(note.createdAt)}
              >
                {timeAgo(note.createdAt)}
              </span>
              <button
                onClick={() => handleDelete(note.id)}
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
