import { db } from "@/lib/db";
import { projects, updates } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { AddUpdateForm } from "@/components/add-update-form";
import { UpdatesList } from "@/components/updates-list";
import { ProjectHeader } from "@/components/project-header";

export default async function UpdatesPage({
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

  const projectUpdates = await db
    .select()
    .from(updates)
    .where(eq(updates.projectId, projectId))
    .orderBy(desc(updates.createdAt));

  return (
    <div className="h-full flex flex-col">
      <ProjectHeader project={project} activeTab="updates" />
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-2xl mx-auto space-y-8">
          <AddUpdateForm projectId={projectId} />
          <UpdatesList updates={projectUpdates} projectId={projectId} />
        </div>
      </div>
    </div>
  );
}
