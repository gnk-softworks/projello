import Link from "next/link";
import { cn } from "@/lib/utils";

interface ProjectHeaderProps {
  project: { id: number; name: string; description: string | null; color: string };
  activeTab: "scratchpad" | "board" | "notes";
}

const tabs = [
  { key: "scratchpad", label: "Scratchpad", href: (id: number) => `/projects/${id}` },
  { key: "board", label: "Board", href: (id: number) => `/projects/${id}/board` },
  { key: "notes", label: "Notes", href: (id: number) => `/projects/${id}/notes` },
] as const;

export function ProjectHeader({ project, activeTab }: ProjectHeaderProps) {
  return (
    <div className="px-4 pt-14 pb-4 md:px-6 md:pt-6 border-b border-surface-200 shrink-0">
      <div className="flex items-center gap-3 mb-3">
        <span
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: project.color }}
        />
        <h1 className="text-xl font-bold text-surface-900">{project.name}</h1>
      </div>
      {project.description && (
        <p className="text-sm text-surface-400 mb-3">{project.description}</p>
      )}
      <div className="flex gap-1">
        {tabs.map((tab) => (
          <Link
            key={tab.key}
            href={tab.href(project.id)}
            className={cn(
              "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
              activeTab === tab.key
                ? "bg-surface-100 text-surface-800"
                : "text-surface-400 hover:text-surface-600 hover:bg-surface-100"
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
