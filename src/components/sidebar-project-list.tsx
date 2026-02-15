"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface SidebarProject {
  id: number;
  name: string;
  color: string;
}

export function SidebarProjectList({ projects }: { projects: SidebarProject[] }) {
  const pathname = usePathname();

  if (projects.length === 0) {
    return (
      <p className="px-2 py-4 text-sm text-surface-400 text-center">
        No projects yet
      </p>
    );
  }

  return (
    <ul className="space-y-0.5">
      {projects.map((project) => {
        const isActive = pathname.startsWith(`/projects/${project.id}`);
        return (
          <li key={project.id}>
            <Link
              href={`/projects/${project.id}`}
              className={cn(
                "flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm transition-colors",
                isActive
                  ? "bg-surface-100 text-surface-900"
                  : "text-surface-500 hover:text-surface-800 hover:bg-surface-100"
              )}
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: project.color }}
              />
              <span className="truncate">{project.name}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
