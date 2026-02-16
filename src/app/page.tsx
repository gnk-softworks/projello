import { db } from "@/lib/db";
import { projects, columns, tasks } from "@/db/schema";
import { eq, count } from "drizzle-orm";
import { ProjectCard } from "@/components/project-card";
import { CreateProjectButton } from "@/components/create-project-button";
import { EmptyState } from "@/components/ui/empty-state";

export default async function DashboardPage() {
  const allProjects = await db.select().from(projects);

  const projectStats = await Promise.all(
    allProjects.map(async (project) => {
      const [colCount] = await db
        .select({ count: count() })
        .from(columns)
        .where(eq(columns.projectId, project.id));

      const [taskCount] = await db
        .select({ count: count() })
        .from(tasks)
        .innerJoin(columns, eq(tasks.columnId, columns.id))
        .where(eq(columns.projectId, project.id));

      return {
        project,
        columnCount: colCount?.count ?? 0,
        taskCount: taskCount?.count ?? 0,
      };
    })
  );

  return (
    <div className="p-4 md:p-8 pt-14 md:pt-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Dashboard</h1>
          <p className="text-sm text-surface-400 mt-1">
            {allProjects.length} project{allProjects.length !== 1 ? "s" : ""}
          </p>
        </div>
        <CreateProjectButton />
      </div>

      {projectStats.length === 0 ? (
        <EmptyState
          icon={
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              <line x1="12" y1="11" x2="12" y2="17" />
              <line x1="9" y1="14" x2="15" y2="14" />
            </svg>
          }
          title="No projects yet"
          description="Create your first project to get started with Kanban boards, tasks, and updates."
          action={<CreateProjectButton />}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projectStats.map(({ project, columnCount, taskCount }) => (
            <ProjectCard
              key={project.id}
              project={project}
              columnCount={columnCount}
              taskCount={taskCount}
            />
          ))}
        </div>
      )}
    </div>
  );
}
