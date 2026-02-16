import { db } from "@/lib/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { ProjectHeader } from "@/components/project-header";
import { TerminalView } from "@/components/terminal-view";

export default async function TerminalPage({
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
  if (!project.sourceDirectory) redirect(`/projects/${projectId}`);

  return (
    <div className="h-full flex flex-col">
      <ProjectHeader project={project} activeTab="terminal" />
      <div className="flex-1 overflow-hidden">
        <TerminalView projectId={projectId} />
      </div>
    </div>
  );
}
