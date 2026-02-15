import { defineConfig } from "drizzle-kit";
import { getDatabasePath } from "./src/lib/config";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: getDatabasePath(),
  },
});
