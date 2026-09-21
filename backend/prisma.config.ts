import "dotenv/config";
import { defineConfig } from "prisma/config";

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.error("=========================================");
  console.error("CRITICAL ERROR: DATABASE_URL IS NOT SET!");
  console.error("Available Environment Variable Keys:");
  console.error(Object.keys(process.env).join(", "));
  console.error("=========================================");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx ts-node -r dotenv/config prisma/seed.ts",
  },
  datasource: {
    url: dbUrl as string,
  },
});
