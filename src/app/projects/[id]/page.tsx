import { db } from "@/lib/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ProjectHeader } from "@/components/project-header";
import { ScratchpadEditor } from "@/components/scratchpad-editor";

export default async function ScratchpadPage({
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

  return (
    <div className="h-full flex flex-col">
      <ProjectHeader project={project} activeTab="scratchpad" />
      <ScratchpadEditor
        projectId={projectId}
        initialContent={project.scratchpad || ""}
      />
    </div>
  );
}
