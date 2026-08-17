// db connection
import { drizzle } from "drizzle-orm/neon-http";

const databaseUrl = process.env.DATABASE_URL;

const schema = {};

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required for API routes");
}

export const db = drizzle(databaseUrl, schema);
