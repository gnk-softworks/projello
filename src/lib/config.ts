import fs from "fs";
import path from "path";

const PROJELLO_DIR = path.join(process.cwd(), ".projello");
const CONFIG_FILE = path.join(PROJELLO_DIR, "config.json");
const DEFAULT_DB_NAME = "projello.db";

export interface ProjelloConfig {
  databasePath: string;
  claudeCodeEnabled: boolean;
}

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function getConfig(): ProjelloConfig {
  ensureDir(PROJELLO_DIR);

  if (fs.existsSync(CONFIG_FILE)) {
    try {
      const raw = fs.readFileSync(CONFIG_FILE, "utf-8");
      const config = JSON.parse(raw) as Partial<ProjelloConfig>;
      if (config.databasePath) {
        return {
          databasePath: config.databasePath,
          claudeCodeEnabled: config.claudeCodeEnabled ?? false,
        };
      }
    } catch {
      // Corrupt config — fall through to default
    }
  }

  return { databasePath: path.join(PROJELLO_DIR, DEFAULT_DB_NAME), claudeCodeEnabled: false };
}

export function saveConfig(config: ProjelloConfig) {
  ensureDir(PROJELLO_DIR);
  // If path is relative, resolve it from cwd
  const resolved = path.isAbsolute(config.databasePath)
    ? config.databasePath
    : path.resolve(process.cwd(), config.databasePath);
  fs.writeFileSync(
    CONFIG_FILE,
    JSON.stringify(
      { databasePath: resolved, claudeCodeEnabled: config.claudeCodeEnabled },
      null,
      2
    ) + "\n",
    "utf-8"
  );
}

export function getDatabasePath(): string {
  const config = getConfig();
  const dbPath = path.isAbsolute(config.databasePath)
    ? config.databasePath
    : path.resolve(process.cwd(), config.databasePath);

  // Ensure parent directory exists
  ensureDir(path.dirname(dbPath));

  return dbPath;
}

export function getConfigDir(): string {
  return PROJELLO_DIR;
}
