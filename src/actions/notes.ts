"use server";

import { db } from "@/lib/db";
import { notes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createNote(projectId: number, formData: FormData) {
  const content = formData.get("content") as string;

  if (!content?.trim()) throw new Error("Note content is required");

  await db.insert(notes).values({
    projectId,
    content: content.trim(),
  });

  revalidatePath(`/projects/${projectId}/notes`);
}

export async function deleteNote(noteId: number, projectId: number) {
  await db.delete(notes).where(eq(notes.id, noteId));
  revalidatePath(`/projects/${projectId}/notes`);
}
