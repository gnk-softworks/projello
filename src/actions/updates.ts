"use server";

import { db } from "@/lib/db";
import { updates } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createUpdate(projectId: number, formData: FormData) {
  const content = formData.get("content") as string;

  if (!content?.trim()) throw new Error("Update content is required");

  await db.insert(updates).values({
    projectId,
    content: content.trim(),
  });

  revalidatePath(`/projects/${projectId}/updates`);
}

export async function deleteUpdate(updateId: number, projectId: number) {
  await db.delete(updates).where(eq(updates.id, updateId));
  revalidatePath(`/projects/${projectId}/updates`);
}
