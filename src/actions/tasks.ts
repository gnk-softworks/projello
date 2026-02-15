"use server";

import { db } from "@/lib/db";
import { tasks, columns } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createTask(
  columnId: number,
  projectId: number,
  formData: FormData
) {
  const title = formData.get("title") as string;
  const description = (formData.get("description") as string) || "";
  const priority =
    (formData.get("priority") as "low" | "medium" | "high" | "urgent") ||
    "medium";

  if (!title?.trim()) throw new Error("Task title is required");

  const existing = await db
    .select({ maxPos: sql<number>`COALESCE(MAX(${tasks.position}), -1)` })
    .from(tasks)
    .where(eq(tasks.columnId, columnId));

  const position = (existing[0]?.maxPos ?? -1) + 1;

  await db.insert(tasks).values({
    columnId,
    title: title.trim(),
    description,
    priority,
    position,
  });

  revalidatePath(`/projects/${projectId}`);
}

export async function updateTask(
  taskId: number,
  projectId: number,
  formData: FormData
) {
  const title = formData.get("title") as string;
  const description = (formData.get("description") as string) || "";
  const priority =
    (formData.get("priority") as "low" | "medium" | "high" | "urgent") ||
    "medium";

  if (!title?.trim()) throw new Error("Task title is required");

  await db
    .update(tasks)
    .set({
      title: title.trim(),
      description,
      priority,
      updatedAt: new Date(),
    })
    .where(eq(tasks.id, taskId));

  revalidatePath(`/projects/${projectId}`);
}

export async function deleteTask(taskId: number, projectId: number) {
  await db.delete(tasks).where(eq(tasks.id, taskId));
  revalidatePath(`/projects/${projectId}`);
}

export async function moveTaskBetweenColumns(
  projectId: number,
  taskId: number,
  newColumnId: number,
  newPosition: number,
  taskOrderInSource: number[],
  taskOrderInDest: number[]
) {
  // Update source column positions
  for (let i = 0; i < taskOrderInSource.length; i++) {
    await db
      .update(tasks)
      .set({ position: i })
      .where(eq(tasks.id, taskOrderInSource[i]));
  }

  // Update destination column positions and move the task
  for (let i = 0; i < taskOrderInDest.length; i++) {
    const tid = taskOrderInDest[i];
    if (tid === taskId) {
      await db
        .update(tasks)
        .set({ columnId: newColumnId, position: i, updatedAt: new Date() })
        .where(eq(tasks.id, tid));
    } else {
      await db
        .update(tasks)
        .set({ position: i })
        .where(eq(tasks.id, tid));
    }
  }

  revalidatePath(`/projects/${projectId}`);
}

export async function reorderTasksInColumn(
  projectId: number,
  columnId: number,
  taskIds: number[]
) {
  for (let i = 0; i < taskIds.length; i++) {
    await db
      .update(tasks)
      .set({ position: i })
      .where(eq(tasks.id, taskIds[i]));
  }

  revalidatePath(`/projects/${projectId}`);
}
