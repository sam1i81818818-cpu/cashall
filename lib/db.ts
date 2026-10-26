import { PrismaClient } from "@prisma/client";
import dns from "node:dns";

// Ensure Node.js resolves IPv4 addresses first to avoid pooler connection timeouts
try {
  dns.setDefaultResultOrder?.("ipv4first");
} catch {
  // Ignore in environments where not supported
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// Resolve database connection URL strictly from environment variables
let dbUrl =
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  "";

if (!dbUrl) {
  // Fail securely when database environment variable is not configured
  throw new Error(
    "[FATAL CONFIGURATION ERROR] Database connection URL is missing. Set DATABASE_URL or POSTGRES_PRISMA_URL in environment configuration."
  );
}

// If the URL accidentally points to session mode (:5432/), rewrite to transaction pooler (:6543/)
if (dbUrl.includes(":5432/")) {
  dbUrl = dbUrl.replace(":5432/", ":6543/");
}

// Ensure Supabase transaction pooler parameters are present
if (!dbUrl.includes("pgbouncer=true")) {
  dbUrl += (dbUrl.includes("?") ? "&" : "?") + "pgbouncer=true";
}

// Ensure connection_limit is set to 5 to allow parallel queries within requests without queue timeout
const connectionLimit = "5";

if (dbUrl.includes("connection_limit=")) {
  dbUrl = dbUrl.replace(/connection_limit=\d+/, `connection_limit=${connectionLimit}`);
} else {
  dbUrl += `&connection_limit=${connectionLimit}`;
}

// Pool timeout: 30s so queries queue safely under traffic surges
if (dbUrl.includes("pool_timeout=")) {
  dbUrl = dbUrl.replace(/pool_timeout=\d+/, "pool_timeout=30");
} else {
  dbUrl += "&pool_timeout=30";
}

if (!dbUrl.includes("sslmode=")) {
  dbUrl += "&sslmode=require";
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: dbUrl,
      },
    },
    log: process.env.NODE_ENV === "development" ? ["error"] : ["error"],
  });

// Always store singleton on globalThis across all environments to prevent connection leaks
globalForPrisma.prisma = prisma;
