import { PrismaClient } from "@prisma/client";

// Ensure Prisma only runs on the server side
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Only create Prisma client on server side
export const prisma =
  typeof window === "undefined"
    ? (globalForPrisma.prisma ?? new PrismaClient())
    : null;

if (process.env.NODE_ENV !== "production" && typeof window === "undefined") {
  globalForPrisma.prisma = prisma as PrismaClient;
}
