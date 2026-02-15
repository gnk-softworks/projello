"use server";

import { db } from "@/lib/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function saveScratchpad(projectId: number, content: string) {
  await db
    .update(projects)
    .set({ scratchpad: content, updatedAt: new Date() })
    .where(eq(projects.id, projectId));
}
