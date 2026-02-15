"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { updateDatabasePath } from "@/actions/settings";
import { useRouter } from "next/navigation";

interface SettingsFormProps {
  settings: {
    databasePath: string;
    resolvedPath: string;
    exists: boolean;
    sizeFormatted: string;
  };
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const [dbPath, setDbPath] = useState(settings.databasePath);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    startTransition(async () => {
      try {
        await updateDatabasePath(dbPath);
        setMessage({ type: "success", text: "Database path updated. The app will now use the new location." });
        router.refresh();
      } catch (err) {
        setMessage({ type: "error", text: (err as Error).message });
      }
    });
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-sm font-semibold text-surface-700 mb-4">Current Database</h2>
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs text-surface-400">Location</p>
              <p className="text-sm text-surface-600 font-mono break-all mt-0.5">
                {settings.resolvedPath}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-xs text-surface-400">Size</p>
              <p className="text-sm text-surface-600 mt-0.5">{settings.sizeFormatted}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${settings.exists ? "bg-success" : "bg-warning"}`}
            />
            <span className="text-xs text-surface-400">
              {settings.exists ? "Database file exists" : "Will be created on first use"}
            </span>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-sm font-semibold text-surface-700 mb-1">Change Database Location</h2>
        <p className="text-xs text-surface-400 mb-4">
          Point Projello to a different database file. Use an absolute path, or a path relative to the
          project root. If the file doesn&apos;t exist it will be created automatically.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="dbPath"
            value={dbPath}
            onChange={(e) => setDbPath(e.target.value)}
            placeholder="/path/to/projello.db"
            label="Database path"
          />

          {message && (
            <p
              className={`text-sm ${message.type === "success" ? "text-success" : "text-danger"}`}
            >
              {message.text}
            </p>
          )}

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={isPending || dbPath === settings.databasePath}>
              {isPending ? "Updating..." : "Update Path"}
            </Button>
            {dbPath !== settings.databasePath && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setDbPath(settings.databasePath)}
              >
                Reset
              </Button>
            )}
          </div>
        </form>
      </Card>

      <Card className="p-6">
        <h2 className="text-sm font-semibold text-surface-700 mb-1">How it works</h2>
        <ul className="text-xs text-surface-400 space-y-1.5 mt-3">
          <li className="flex gap-2">
            <span className="text-surface-300 shrink-0">1.</span>
            Config is stored in <code className="text-surface-500 bg-surface-100 px-1 rounded">.projello/config.json</code>
          </li>
          <li className="flex gap-2">
            <span className="text-surface-300 shrink-0">2.</span>
            Default database location is <code className="text-surface-500 bg-surface-100 px-1 rounded">.projello/projello.db</code>
          </li>
          <li className="flex gap-2">
            <span className="text-surface-300 shrink-0">3.</span>
            Point it to a path inside your repo to version-control the database with git
          </li>
          <li className="flex gap-2">
            <span className="text-surface-300 shrink-0">4.</span>
            Tables are created automatically when the app connects to a new database
          </li>
        </ul>
      </Card>
    </div>
  );
}
