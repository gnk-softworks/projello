import { db } from "@/lib/db";
import { projects, columns, tasks } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { KanbanBoard } from "@/components/kanban-board";
import { ProjectHeader } from "@/components/project-header";
import { isClaudeCodeEnabled } from "@/actions/settings";

export default async function BoardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const projectId = parseInt(id);

  const [project] = await db
    .select()
    .from(projects)
    .where(eq(projects.id, projectId));

  if (!project) notFound();

  const projectColumns = await db
    .select()
    .from(columns)
    .where(eq(columns.projectId, projectId))
    .orderBy(asc(columns.position));

  let projectTasks: (typeof tasks.$inferSelect)[] = [];
  for (const col of projectColumns) {
    const colTasks = await db
      .select()
      .from(tasks)
      .where(eq(tasks.columnId, col.id))
      .orderBy(asc(tasks.position));
    projectTasks.push(...colTasks);
  }

  const claudeEnabled = await isClaudeCodeEnabled();

  return (
    <div className="h-full flex flex-col">
      <ProjectHeader project={project} activeTab="board" />
      <div className="flex-1 overflow-hidden">
        <KanbanBoard
          projectId={projectId}
          initialColumns={projectColumns}
          initialTasks={projectTasks}
          hasTerminal={!!project.sourceDirectory && claudeEnabled}
        />
      </div>
    </div>
  );
}
