"use server";

import fs from "fs";
import path from "path";
import { getConfig, saveConfig, getDatabasePath } from "@/lib/config";
import { resetDb } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getSettings() {
  const config = getConfig();
  const dbPath = getDatabasePath();
  const exists = fs.existsSync(dbPath);
  let sizeBytes = 0;
  if (exists) {
    sizeBytes = fs.statSync(dbPath).size;
  }

  return {
    databasePath: config.databasePath,
    resolvedPath: dbPath,
    exists,
    sizeBytes,
    claudeCodeEnabled: config.claudeCodeEnabled,
  };
}

export async function updateDatabasePath(newPath: string) {
  if (!newPath?.trim()) {
    throw new Error("Database path is required");
  }

  const resolved = path.isAbsolute(newPath.trim())
    ? newPath.trim()
    : path.resolve(process.cwd(), newPath.trim());

  // Ensure parent directory exists
  const dir = path.dirname(resolved);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const config = getConfig();
  saveConfig({ ...config, databasePath: resolved });

  // Reset the db connection so next query picks up the new path
  resetDb();

  revalidatePath("/");
  revalidatePath("/settings");

  return { databasePath: resolved };
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export async function getSettingsDisplay() {
  const settings = await getSettings();
  return {
    ...settings,
    sizeFormatted: formatBytes(settings.sizeBytes),
  };
}

export async function updateClaudeCodeEnabled(enabled: boolean) {
  const config = getConfig();
  saveConfig({ ...config, claudeCodeEnabled: enabled });

  revalidatePath("/");
  revalidatePath("/settings");

  return { claudeCodeEnabled: enabled };
}

export async function isClaudeCodeEnabled(): Promise<boolean> {
  const config = getConfig();
  return config.claudeCodeEnabled;
}
