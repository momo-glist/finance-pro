import { neon } from "@neondatabase/serverless";
import "dotenv/config";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

const sql = neon(databaseUrl);

async function resetDatabase() {
  console.log("🗑️  Suppression de l'ancienne table expenses...");

  try {
    await sql`DROP TABLE IF EXISTS expenses CASCADE`;
    console.log("✅ Table expenses supprimée");
  } catch (error) {
    console.log("⚠️  La table expenses n'existe peut-être pas déjà");
  }

  console.log("🎉 Base de données prête pour les nouvelles migrations");
}

resetDatabase().catch((error) => {
  console.error("❌ Reset failed:", error);
  process.exit(1);
});
