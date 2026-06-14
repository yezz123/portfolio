import { defineConfig } from "prisma/config";

try {
  process.loadEnvFile(".env");
} catch {
  // DATABASE_URL may still be provided by the shell or deployment environment.
}

export default defineConfig({
  schema: "prisma/schema.prisma",
});
