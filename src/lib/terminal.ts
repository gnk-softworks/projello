import * as pty from "node-pty";
import * as os from "os";

type Listener = (data: string) => void;

const MAX_SCROLLBACK_BYTES = 50 * 1024; // 50KB

interface TerminalSession {
  pty: pty.IPty;
  listeners: Set<Listener>;
  scrollback: string[];
  scrollbackBytes: number;
}

// Use globalThis so the session map is shared across all server-side contexts
// (server actions and route handlers may load this module separately)
const globalKey = "__projello_terminal_sessions";
const g = globalThis as unknown as {
  [globalKey]?: Map<string, TerminalSession>;
  __projello_terminal_nextId?: number;
};
if (!g[globalKey]) g[globalKey] = new Map();
if (!g.__projello_terminal_nextId) g.__projello_terminal_nextId = 1;

function getSessions(): Map<string, TerminalSession> {
  return g[globalKey]!;
}

function getCleanEnv(): Record<string, string> {
  const env: Record<string, string> = {};
  for (const [key, value] of Object.entries(process.env)) {
    if (value !== undefined) env[key] = value;
  }
  const isWindows = process.platform === "win32";

  if (!env.PATH) {
    env.PATH = isWindows
      ? "C:\\Windows\\system32;C:\\Windows;C:\\Windows\\System32\\Wbem"
      : "/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin";
  }
  if (!env.HOME && !isWindows) {
    env.HOME = os.homedir();
  }
  if (!env.TERM) env.TERM = "xterm-256color";
  if (!env.LANG) env.LANG = "en_US.UTF-8";
  return env;
}

function getDefaultShell(env: Record<string, string>): { shell: string; args: string[] } {
  if (process.platform === "win32") {
    return { shell: process.env.COMSPEC || "cmd.exe", args: [] };
  }
  return { shell: env.SHELL || "/bin/sh", args: ["-l"] };
}

export function createSession(projectId: number, cwd: string): string {
  const sessionId = `${projectId}-${g.__projello_terminal_nextId!++}`;
  const env = getCleanEnv();
  const { shell, args } = getDefaultShell(env);

  const ptyProcess = pty.spawn(shell, args, {
    name: "xterm-256color",
    cols: 80,
    rows: 24,
    cwd,
    env,
  });

  const session: TerminalSession = {
    pty: ptyProcess,
    listeners: new Set(),
    scrollback: [],
    scrollbackBytes: 0,
  };

  ptyProcess.onData((data: string) => {
    // Append to scrollback buffer
    session.scrollback.push(data);
    session.scrollbackBytes += data.length;
    // Trim oldest chunks when over budget
    while (session.scrollbackBytes > MAX_SCROLLBACK_BYTES && session.scrollback.length > 1) {
      const removed = session.scrollback.shift()!;
      session.scrollbackBytes -= removed.length;
    }

    for (const listener of session.listeners) {
      listener(data);
    }
  });

  ptyProcess.onExit(() => {
    getSessions().delete(sessionId);
  });

  getSessions().set(sessionId, session);
  return sessionId;
}

export function writeToSession(sessionId: string, data: string): void {
  const session = getSessions().get(sessionId);
  if (!session) throw new Error("Session not found");
  session.pty.write(data);
}

export function resizeSession(
  sessionId: string,
  cols: number,
  rows: number
): void {
  const session = getSessions().get(sessionId);
  if (!session) return;
  session.pty.resize(cols, rows);
}

export function killSession(sessionId: string): void {
  const session = getSessions().get(sessionId);
  if (!session) return;
  session.pty.kill();
  getSessions().delete(sessionId);
}

export function addListener(sessionId: string, listener: Listener): void {
  const session = getSessions().get(sessionId);
  if (!session) throw new Error("Session not found");
  session.listeners.add(listener);
}

export function removeListener(sessionId: string, listener: Listener): void {
  const session = getSessions().get(sessionId);
  if (!session) return;
  session.listeners.delete(listener);
}

export function getSessionForProject(projectId: number): string | null {
  const prefix = `${projectId}-`;
  for (const key of getSessions().keys()) {
    if (key.startsWith(prefix)) return key;
  }
  return null;
}

export function getScrollback(sessionId: string): string {
  const session = getSessions().get(sessionId);
  if (!session) return "";
  return session.scrollback.join("");
}
