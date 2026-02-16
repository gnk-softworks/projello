"use server";

import { db } from "@/lib/db";
import { columns, tasks } from "@/db/schema";
import { eq, gt, sql, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createColumn(projectId: number, name: string) {
  if (!name?.trim()) throw new Error("Column name is required");

  // Get max position
  const existing = await db
    .select({ maxPos: sql<number>`COALESCE(MAX(${columns.position}), -1)` })
    .from(columns)
    .where(eq(columns.projectId, projectId));

  const position = (existing[0]?.maxPos ?? -1) + 1;

  await db.insert(columns).values({
    projectId,
    name: name.trim(),
    position,
  });

  revalidatePath(`/projects/${projectId}`);
}

export async function renameColumn(columnId: number, name: string, projectId: number) {
  if (!name?.trim()) throw new Error("Column name is required");

  await db
    .update(columns)
    .set({ name: name.trim() })
    .where(eq(columns.id, columnId));

  revalidatePath(`/projects/${projectId}`);
}

export async function deleteColumn(
  columnId: number,
  projectId: number,
  migrateToColumnId?: number
) {
  if (migrateToColumnId) {
    // Move all tasks to the target column at the end
    const targetTasks = await db
      .select({ maxPos: sql<number>`COALESCE(MAX(${tasks.position}), -1)` })
      .from(tasks)
      .where(eq(tasks.columnId, migrateToColumnId));

    let nextPos = (targetTasks[0]?.maxPos ?? -1) + 1;

    const tasksToMigrate = await db
      .select()
      .from(tasks)
      .where(eq(tasks.columnId, columnId));

    for (const task of tasksToMigrate) {
      await db
        .update(tasks)
        .set({ columnId: migrateToColumnId, position: nextPos++ })
        .where(eq(tasks.id, task.id));
    }
  }

  // Get the position of the column being deleted
  const [col] = await db.select().from(columns).where(eq(columns.id, columnId));

  // Delete the column (cascades tasks if not migrated)
  await db.delete(columns).where(eq(columns.id, columnId));

  // Shift positions of remaining columns
  if (col) {
    await db
      .update(columns)
      .set({ position: sql`${columns.position} - 1` })
      .where(and(eq(columns.projectId, projectId), gt(columns.position, col.position)));
  }

  revalidatePath(`/projects/${projectId}`);
}

export async function reorderColumns(
  projectId: number,
  columnIds: number[]
) {
  for (let i = 0; i < columnIds.length; i++) {
    await db
      .update(columns)
      .set({ position: i })
      .where(eq(columns.id, columnIds[i]));
  }

  revalidatePath(`/projects/${projectId}`);
}
