"use server";

import { db } from "@/lib/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  createSession,
  writeToSession,
  resizeSession,
  killSession,
  getSessionForProject,
} from "@/lib/terminal";

export async function getOrCreateTerminalSession(
  projectId: number
): Promise<string> {
  // Reuse an existing live session for this project
  const existing = getSessionForProject(projectId);
  if (existing) return existing;

  const [project] = await db
    .select()
    .from(projects)
    .where(eq(projects.id, projectId));

  if (!project) throw new Error("Project not found");
  if (!project.sourceDirectory) throw new Error("No source directory set");

  return createSession(projectId, project.sourceDirectory);
}

export async function sendTerminalInput(
  sessionId: string,
  data: string
): Promise<void> {
  writeToSession(sessionId, data);
}

export async function resizeTerminal(
  sessionId: string,
  cols: number,
  rows: number
): Promise<void> {
  resizeSession(sessionId, cols, rows);
}

export async function killTerminalSession(
  sessionId: string
): Promise<void> {
  killSession(sessionId);
}
