import { neon } from "@neondatabase/serverless";
import "dotenv/config";
import { randomUUID } from "node:crypto";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

const sql = neon(databaseUrl);

const expenses = [
  {
    title: "Courses alimentaires",
    category: "Alimentation",
    amount: 25000,
    expense_date: "2026-08-01",
  },
  {
    title: "Transport",
    category: "Transport",
    amount: 5000,
    expense_date: "2026-08-03",
  },
  {
    title: "Abonnement Internet",
    category: "Abonnements",
    amount: 15000,
    expense_date: "2026-08-05",
  },
  {
    title: "Restaurant",
    category: "Alimentation",
    amount: 12000,
    expense_date: "2026-08-08",
  },
  {
    title: "Électricité",
    category: "Factures",
    amount: 30000,
    expense_date: "2026-08-10",
  },
];

async function seedExpenses() {
  console.log("🌱 Seeding expenses...");

  for (const expense of expenses) {
    await sql`
      INSERT INTO expenses (
        id,
        title,
        category,
        amount,
        expense_date
      )
      VALUES (
        ${randomUUID()},
        ${expense.title},
        ${expense.category},
        ${expense.amount},
        ${expense.expense_date}
      )
    `;
  }

  console.log(`✅ ${expenses.length} dépenses ajoutées.`);
}

seedExpenses().catch((error) => {
  console.error("❌ Seed failed:", error);
  process.exit(1);
});
