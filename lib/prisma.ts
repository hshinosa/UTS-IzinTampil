import { PrismaClient } from "@prisma/client";

declare global {
  // prevent multiple instances of Prisma Client in dev
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["query"], // opsional, untuk debug query
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
