<p align="center">
  <img src="public/logo.png" alt="Projello" width="128" />
</p>

<h1 align="center">Projello</h1>

<p align="center">Local-first project management app with Kanban boards. No accounts, no cloud — your data lives in a SQLite database on your machine.</p>

![Projello Kanban Board](public/screenshot.png)

## Features

- **Dashboard** — Overview of all projects with task/column counts
- **Kanban Board** — Drag-and-drop task management across columns
- **Scratchpad** — Per-project auto-saving text editor for quick notes and ideas
- **Updates Timeline** — Timestamped project updates and logs
- **Integrated Terminal** — Embedded terminal for projects with a source directory (powered by node-pty + xterm.js)
- **Agent Task Completion** — Send in-progress tasks to Claude Code for autonomous implementation (requires [Claude Code](https://docs.anthropic.com/en/docs/claude-code/overview) installed)
- **Auto-saving Task Edits** — Changes to task title, description, and priority save automatically
- **Configurable Storage** — Store your database anywhere, including inside a git repo
- **Cross-platform** — Works on macOS, Linux, and Windows

## Tech Stack

- Next.js 16 (App Router, Turbopack)
- Tailwind CSS v4
- Drizzle ORM + better-sqlite3
- node-pty + @xterm/xterm (integrated terminal)
- @dnd-kit (drag-and-drop)
- TypeScript

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:1337](http://localhost:1337).

The database and config are created automatically in `.projello/` on first run.

### Enabling the Terminal

To see the Terminal tab on a project, set a **Source Directory** when creating or editing the project. This tells Projello where to open the terminal.

### Enabling Agent Task Completion

1. Install [Claude Code](https://docs.anthropic.com/en/docs/claude-code/overview) and ensure `claude` is available in your PATH
2. Go to **Settings** and enable the **Claude Code Integration** toggle
3. On any in-progress task, click **Complete with Agent** to send it to the terminal

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server on port 1337 |
| `npm run build` | Production build |
| `npm start` | Start production server on port 1337 |
| `npm run db:seed` | Seed the database with demo data |
| `npm run db:push` | Push schema changes to the database |
| `npm run db:studio` | Open Drizzle Studio |

## Database

Projello uses a local SQLite database. On first startup it:

1. Creates a `.projello/` directory in the project root
2. Creates `projello.db` inside it
3. Auto-creates all tables

### Custom database location

You can point Projello to a different database file via **Settings** in the sidebar, or by editing `.projello/config.json` directly:

```json
{
  "databasePath": "/path/to/your/projello.db"
}
```

This is useful if you want to store the database inside a git repo or a synced folder. If the file doesn't exist, it will be created automatically with all tables.

## Project Structure

```
src/
  app/
    page.tsx                    # Dashboard
    settings/page.tsx           # Settings (database, integrations)
    projects/[id]/
      page.tsx                  # Scratchpad (default tab)
      board/page.tsx            # Kanban board
      updates/page.tsx          # Updates timeline
      terminal/page.tsx         # Integrated terminal
    api/terminal/route.ts       # Terminal WebSocket endpoint
  actions/                      # Server actions (all mutations)
  components/
    ui/                         # Primitives (button, input, dialog, etc.)
    kanban-board.tsx            # DnD board orchestrator
    scratchpad-editor.tsx       # Auto-saving text editor
    terminal-view.tsx           # xterm.js terminal client
  db/
    schema.ts                   # Drizzle schema (4 tables)
    seed.ts                     # Demo data
  lib/
    config.ts                   # .projello/config.json reader/writer
    db.ts                       # Database connection with auto-setup
    terminal.ts                 # PTY session manager
    utils.ts                    # cn(), timeAgo(), formatDate()
```
