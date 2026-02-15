"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { saveScratchpad } from "@/actions/scratchpad";

interface ScratchpadEditorProps {
  projectId: number;
  initialContent: string;
}

export function ScratchpadEditor({ projectId, initialContent }: ScratchpadEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "idle">("idle");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef(initialContent);

  const save = useCallback(
    async (text: string) => {
      if (text === lastSavedRef.current) return;
      setSaveStatus("saving");
      await saveScratchpad(projectId, text);
      lastSavedRef.current = text;
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    },
    [projectId]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setContent(value);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => save(value), 800);
    },
    [save]
  );

  // Save on unmount / tab switch
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Ctrl+S / Cmd+S to save immediately
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        save(content);
      }
    },
    [content, save]
  );

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex items-center justify-between px-6 py-2 border-b border-surface-200 shrink-0">
        <span className="text-xs text-surface-400">
          {saveStatus === "saving" && "Saving..."}
          {saveStatus === "saved" && "Saved"}
          {saveStatus === "idle" && ""}
        </span>
        <span className="text-xs text-surface-300 font-mono">
          {content.length} chars
        </span>
      </div>
      <textarea
        value={content}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Start typing... your notes auto-save as you write."
        className="flex-1 w-full p-6 bg-transparent text-surface-800 text-sm leading-relaxed resize-none focus:outline-none placeholder:text-surface-300 font-mono"
        spellCheck={false}
      />
    </div>
  );
}
