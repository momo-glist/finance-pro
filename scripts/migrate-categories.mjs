import { neon } from "@neondatabase/serverless";
import "dotenv/config";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

const sql = neon(databaseUrl);

const categoryMapping = {
  "Food": "Nourriture",
  "Groceries": "Épicerie",
  "Entertainments": "Divertissements",
  "Bills": "Factures",
  // Transport reste le même
};

async function migrateCategories() {
  console.log("🔄 Migration des catégories...");

  for (const [oldCategory, newCategory] of Object.entries(categoryMapping)) {
    const result = await sql`
      UPDATE expenses
      SET category = ${newCategory}
      WHERE category = ${oldCategory}
    `;

    console.log(`✅ Catégorie "${oldCategory}" → "${newCategory}" : ${result.count} lignes mises à jour`);
  }

  console.log("🎉 Migration terminée !");
}

migrateCategories().catch((error) => {
  console.error("❌ Migration failed:", error);
  process.exit(1);
});
