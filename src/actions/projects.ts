"use server";

import { db } from "@/lib/db";
import { projects, columns } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createProject(formData: FormData) {
  const name = formData.get("name") as string;
  const description = (formData.get("description") as string) || "";
  const color = (formData.get("color") as string) || "#818cf8";

  if (!name?.trim()) throw new Error("Project name is required");

  const [project] = await db
    .insert(projects)
    .values({ name: name.trim(), description, color })
    .returning();

  // Create default columns
  const defaultColumns = ["Todo", "In Progress", "Done"];
  for (let i = 0; i < defaultColumns.length; i++) {
    await db.insert(columns).values({
      projectId: project.id,
      name: defaultColumns[i],
      position: i,
    });
  }

  revalidatePath("/");
  revalidatePath(`/projects/${project.id}`);
  return project;
}

export async function updateProject(id: number, formData: FormData) {
  const name = formData.get("name") as string;
  const description = (formData.get("description") as string) || "";
  const color = (formData.get("color") as string) || "#818cf8";

  if (!name?.trim()) throw new Error("Project name is required");

  await db
    .update(projects)
    .set({ name: name.trim(), description, color, updatedAt: new Date() })
    .where(eq(projects.id, id));

  revalidatePath("/");
  revalidatePath(`/projects/${id}`);
}

export async function deleteProject(id: number) {
  await db.delete(projects).where(eq(projects.id, id));
  revalidatePath("/");
}
