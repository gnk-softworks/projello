"use client";

import { useEffect, useRef, useState } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";
import {
  getOrCreateTerminalSession,
  sendTerminalInput,
  resizeTerminal,
} from "@/actions/terminal";

type Status = "connecting" | "connected" | "disconnected";

export function TerminalView({ projectId }: { projectId: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("connecting");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const terminal = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: "Menlo, Monaco, 'Courier New', monospace",
      theme: {
        background: "#1e1e2e",
        foreground: "#cdd6f4",
        cursor: "#f5e0dc",
        selectionBackground: "#585b7066",
        black: "#45475a",
        red: "#f38ba8",
        green: "#a6e3a1",
        yellow: "#f9e2af",
        blue: "#89b4fa",
        magenta: "#f5c2e7",
        cyan: "#94e2d5",
        white: "#bac2de",
        brightBlack: "#585b70",
        brightRed: "#f38ba8",
        brightGreen: "#a6e3a1",
        brightYellow: "#f9e2af",
        brightBlue: "#89b4fa",
        brightMagenta: "#f5c2e7",
        brightCyan: "#94e2d5",
        brightWhite: "#a6adc8",
      },
    });

    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);
    terminal.open(container);
    fitAddon.fit();

    let sessionId: string | null = null;
    let eventSource: EventSource | null = null;
    let disposed = false;

    async function init() {
      try {
        sessionId = await getOrCreateTerminalSession(projectId);
        if (disposed) {
          return;
        }

        eventSource = new EventSource(
          `/api/terminal?sessionId=${encodeURIComponent(sessionId)}`
        );

        eventSource.onmessage = (event) => {
          const binary = atob(event.data);
          const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
          terminal.write(bytes);
        };

        eventSource.onopen = () => setStatus("connected");
        eventSource.onerror = () => setStatus("disconnected");

        terminal.onData((data) => {
          if (sessionId) sendTerminalInput(sessionId, data);
        });

        const resizeObserver = new ResizeObserver(() => {
          fitAddon.fit();
          if (sessionId) {
            resizeTerminal(sessionId, terminal.cols, terminal.rows);
          }
        });
        resizeObserver.observe(container!);

        setStatus("connected");
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        setStatus("disconnected");
      }
    }

    init();

    return () => {
      disposed = true;
      eventSource?.close();
      terminal.dispose();
    };
  }, [projectId]);

  const statusColor = {
    connecting: "bg-yellow-400",
    connected: "bg-green-400",
    disconnected: "bg-red-400",
  }[status];

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-surface-200 bg-surface-50">
        <span className={`w-2 h-2 rounded-full ${statusColor}`} />
        <span className="text-xs text-surface-400 capitalize">{status}</span>
      </div>
      {error && (
        <div className="mx-4 mt-3 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <div ref={containerRef} className="flex-1 bg-[#1e1e2e] p-1" />
    </div>
  );
}
