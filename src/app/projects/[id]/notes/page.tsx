import { db } from "@/lib/db";
import { projects, notes } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { AddNoteForm } from "@/components/add-note-form";
import { NotesList } from "@/components/notes-list";
import { ProjectHeader } from "@/components/project-header";

export default async function NotesPage({
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

  const projectNotes = await db
    .select()
    .from(notes)
    .where(eq(notes.projectId, projectId))
    .orderBy(desc(notes.createdAt));

  return (
    <div className="h-full flex flex-col">
      <ProjectHeader project={project} activeTab="notes" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto space-y-8">
          <AddNoteForm projectId={projectId} />
          <NotesList notes={projectNotes} projectId={projectId} />
        </div>
      </div>
    </div>
  );
}
