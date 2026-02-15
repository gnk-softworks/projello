import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import { getDatabasePath } from "../lib/config";

const dbPath = getDatabasePath();
console.log(`Using database at: ${dbPath}`);
const sqlite = new Database(dbPath);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

const db = drizzle(sqlite, { schema });

function seed() {
  console.log("Seeding database...");

  // Clear existing data
  db.delete(schema.notes).run();
  db.delete(schema.tasks).run();
  db.delete(schema.columns).run();
  db.delete(schema.projects).run();

  // Create projects
  const projects = db
    .insert(schema.projects)
    .values([
      {
        name: "Website Redesign",
        description: "Complete overhaul of the company website with new branding",
        color: "#818cf8",
      },
      {
        name: "Mobile App",
        description: "Build a cross-platform mobile app for iOS and Android",
        color: "#34d399",
      },
      {
        name: "API Migration",
        description: "Migrate from REST to GraphQL API",
        color: "#fb7185",
      },
    ])
    .returning()
    .all();

  const [project1, project2, project3] = projects;

  // Project 1 columns
  const p1Cols = db
    .insert(schema.columns)
    .values([
      { projectId: project1.id, name: "Todo", position: 0 },
      { projectId: project1.id, name: "In Progress", position: 1 },
      { projectId: project1.id, name: "Review", position: 2 },
      { projectId: project1.id, name: "Done", position: 3 },
    ])
    .returning()
    .all();

  const [todo1, inProgress1, review1, done1] = p1Cols;

  // Project 1 tasks
  db.insert(schema.tasks)
    .values([
      { columnId: todo1.id, title: "Design new color palette", description: "Research brand colors and create a cohesive palette", priority: "high" as const, position: 0 },
      { columnId: todo1.id, title: "Create wireframes for homepage", priority: "medium" as const, position: 1 },
      { columnId: todo1.id, title: "Write content for About page", priority: "low" as const, position: 2 },
      { columnId: inProgress1.id, title: "Build navigation component", description: "Responsive nav with mobile hamburger menu", priority: "high" as const, position: 0 },
      { columnId: inProgress1.id, title: "Set up CI/CD pipeline", priority: "medium" as const, position: 1 },
      { columnId: review1.id, title: "Footer design mockup", priority: "low" as const, position: 0 },
      { columnId: done1.id, title: "Set up project repository", priority: "medium" as const, position: 0 },
      { columnId: done1.id, title: "Configure Tailwind CSS", priority: "low" as const, position: 1 },
    ])
    .run();

  // Project 2 columns
  const p2Cols = db
    .insert(schema.columns)
    .values([
      { projectId: project2.id, name: "Backlog", position: 0 },
      { projectId: project2.id, name: "Sprint", position: 1 },
      { projectId: project2.id, name: "Done", position: 2 },
    ])
    .returning()
    .all();

  const [todo2, inProgress2, done2] = p2Cols;

  // Project 2 tasks
  db.insert(schema.tasks)
    .values([
      { columnId: todo2.id, title: "User authentication flow", description: "Implement login, signup, and password reset", priority: "urgent" as const, position: 0 },
      { columnId: todo2.id, title: "Push notification service", priority: "high" as const, position: 1 },
      { columnId: todo2.id, title: "Offline mode support", priority: "medium" as const, position: 2 },
      { columnId: inProgress2.id, title: "Home screen UI", description: "Build the main dashboard view", priority: "high" as const, position: 0 },
      { columnId: done2.id, title: "Set up React Native project", priority: "medium" as const, position: 0 },
    ])
    .run();

  // Project 3 columns
  const p3Cols = db
    .insert(schema.columns)
    .values([
      { projectId: project3.id, name: "Todo", position: 0 },
      { projectId: project3.id, name: "In Progress", position: 1 },
      { projectId: project3.id, name: "Done", position: 2 },
    ])
    .returning()
    .all();

  const [todo3, inProgress3, done3] = p3Cols;

  // Project 3 tasks
  db.insert(schema.tasks)
    .values([
      { columnId: todo3.id, title: "Define GraphQL schema", description: "Map all REST endpoints to GraphQL types", priority: "urgent" as const, position: 0 },
      { columnId: todo3.id, title: "Set up Apollo Server", priority: "high" as const, position: 1 },
      { columnId: inProgress3.id, title: "Migrate user endpoints", priority: "high" as const, position: 0 },
      { columnId: done3.id, title: "Research GraphQL best practices", priority: "low" as const, position: 0 },
    ])
    .run();

  // Notes for project 1
  db.insert(schema.notes)
    .values([
      { projectId: project1.id, content: "Kickoff meeting went well. Team aligned on new design direction with focus on minimalism and accessibility." },
      { projectId: project1.id, content: "Decided to use Tailwind CSS v4 with the new @theme configuration. Much cleaner than the old config file approach." },
      { projectId: project1.id, content: "Client approved the initial wireframes. Moving forward with the dark theme as the primary design." },
    ])
    .run();

  // Notes for project 2
  db.insert(schema.notes)
    .values([
      { projectId: project2.id, content: "Using React Native with Expo for faster development. Will target iOS first, then Android." },
    ])
    .run();

  console.log("Seed complete!");
  console.log("Created 3 projects with columns, tasks, and notes.");
  process.exit(0);
}

seed();
