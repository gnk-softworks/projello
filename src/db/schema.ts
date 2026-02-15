import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description").default(""),
  color: text("color").notNull().default("#6366f1"),
  scratchpad: text("scratchpad").default(""),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const columns = sqliteTable("columns", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  position: integer("position").notNull().default(0),
});

export const tasks = sqliteTable("tasks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  columnId: integer("column_id")
    .notNull()
    .references(() => columns.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").default(""),
  priority: text("priority", {
    enum: ["low", "medium", "high", "urgent"],
  })
    .notNull()
    .default("medium"),
  position: integer("position").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const notes = sqliteTable("notes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// Relations
export const projectsRelations = relations(projects, ({ many }) => ({
  columns: many(columns),
  notes: many(notes),
}));

export const columnsRelations = relations(columns, ({ one, many }) => ({
  project: one(projects, {
    fields: [columns.projectId],
    references: [projects.id],
  }),
  tasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  column: one(columns, {
    fields: [tasks.columnId],
    references: [columns.id],
  }),
}));

export const notesRelations = relations(notes, ({ one }) => ({
  project: one(projects, {
    fields: [notes.projectId],
    references: [projects.id],
  }),
}));

// Type exports
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type Column = typeof columns.$inferSelect;
export type NewColumn = typeof columns.$inferInsert;
export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
export type Note = typeof notes.$inferSelect;
export type NewNote = typeof notes.$inferInsert;
