"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownItem, DropdownSeparator } from "@/components/ui/dropdown-menu";
import { timeAgo } from "@/lib/utils";
import { useState } from "react";
import { EditProjectModal } from "@/components/modals/edit-project-modal";
import { DeleteConfirmModal } from "@/components/modals/delete-confirm-modal";
import { deleteProject } from "@/actions/projects";

interface ProjectCardProps {
  project: {
    id: number;
    name: string;
    description: string | null;
    color: string;
    createdAt: Date;
    updatedAt: Date;
  };
  columnCount: number;
  taskCount: number;
}

export function ProjectCard({ project, columnCount, taskCount }: ProjectCardProps) {
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  return (
    <>
      <Card className="group relative hover:shadow-card-hover overflow-hidden">
        <div className="h-1.5" style={{ backgroundColor: project.color }} />
        <Link href={`/projects/${project.id}`} className="block p-5">
          <h3 className="font-semibold text-surface-900 group-hover:text-primary transition-colors">
            {project.name}
          </h3>
          {project.description && (
            <p className="mt-1 text-sm text-surface-400 line-clamp-2">
              {project.description}
            </p>
          )}
          <div className="mt-4 flex items-center gap-4 text-xs text-surface-400">
            <span className="flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M9 3v18" />
                <path d="M15 3v18" />
              </svg>
              {columnCount} columns
            </span>
            <span className="flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
              {taskCount} tasks
            </span>
          </div>
        </Link>
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu
            trigger={
              <button className="p-1 rounded-md hover:bg-surface-100 text-surface-400 hover:text-surface-600 cursor-pointer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="5" r="1" />
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="12" cy="19" r="1" />
                </svg>
              </button>
            }
          >
            <DropdownItem onClick={() => setShowEdit(true)}>Edit project</DropdownItem>
            <DropdownSeparator />
            <DropdownItem variant="danger" onClick={() => setShowDelete(true)}>
              Delete project
            </DropdownItem>
          </DropdownMenu>
        </div>
        <div className="px-5 pb-3 text-xs text-surface-300">
          Updated {timeAgo(project.updatedAt)}
        </div>
      </Card>

      <EditProjectModal
        project={project}
        open={showEdit}
        onClose={() => setShowEdit(false)}
      />
      <DeleteConfirmModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        title="Delete project"
        description={`Are you sure you want to delete "${project.name}"? All columns, tasks, and notes will be permanently deleted.`}
        onConfirm={async () => {
          await deleteProject(project.id);
          setShowDelete(false);
        }}
      />
    </>
  );
}
