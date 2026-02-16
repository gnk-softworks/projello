import { db } from "@/lib/db";
import { projects } from "@/db/schema";
import { asc } from "drizzle-orm";
import { SidebarProjectList } from "./sidebar-project-list";
import { SidebarWrapper } from "./mobile-sidebar";
import Link from "next/link";
import Image from "next/image";

export async function Sidebar() {
  const allProjects = await db
    .select({ id: projects.id, name: projects.name, color: projects.color })
    .from(projects)
    .orderBy(asc(projects.createdAt));

  return (
    <SidebarWrapper>
      <div className="p-4 border-b border-surface-200 flex justify-center">
        <Link href="/">
          <Image src="/logo.png" alt="Projello" width={140} height={48} className="rounded-lg object-contain" />
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        <div className="mb-2 px-2 flex items-center justify-between">
          <span className="text-xs font-semibold text-surface-400 uppercase tracking-wider">
            Projects
          </span>
        </div>
        <SidebarProjectList projects={allProjects} />
      </nav>

      <div className="p-3 border-t border-surface-200 space-y-0.5">
        <Link
          href="/settings"
          className="flex items-center gap-2 px-2 py-1.5 text-sm text-surface-400 hover:text-surface-600 rounded-md hover:bg-surface-100 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          Settings
        </Link>
        <Link
          href="/design-system"
          className="flex items-center gap-2 px-2 py-1.5 text-sm text-surface-400 hover:text-surface-600 rounded-md hover:bg-surface-100 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="13.5" cy="6.5" r="2.5" />
            <circle cx="17.5" cy="15.5" r="2.5" />
            <circle cx="8.5" cy="15.5" r="2.5" />
            <path d="M13.5 9a5 5 0 0 1 4 8" />
            <path d="M5.5 11a5 5 0 0 1 8-4" />
            <path d="M15 18a5 5 0 0 1-8 0" />
          </svg>
          Design System
        </Link>
      </div>
    </SidebarWrapper>
  );
}
