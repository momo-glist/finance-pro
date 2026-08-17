import { neon } from "@neondatabase/serverless";
import "dotenv/config";
import { randomUUID } from "node:crypto";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

const sql = neon(databaseUrl);

const expenses = [
  // Janvier 2026
  {
    title: "Courses alimentaires",
    category: "Nourriture",
    amount: 25000,
    expense_date: "2026-01-05",
  },
  {
    title: "Transport",
    category: "Transport",
    amount: 8000,
    expense_date: "2026-01-10",
  },
  {
    title: "Abonnement Internet",
    category: "Factures",
    amount: 15000,
    expense_date: "2026-01-15",
  },
  // Février 2026
  {
    title: "Courses alimentaires",
    category: "Nourriture",
    amount: 28000,
    expense_date: "2026-02-03",
  },
  {
    title: "Restaurant",
    category: "Divertissements",
    amount: 15000,
    expense_date: "2026-02-14",
  },
  {
    title: "Électricité",
    category: "Factures",
    amount: 35000,
    expense_date: "2026-02-20",
  },
  // Mars 2026
  {
    title: "Courses alimentaires",
    category: "Nourriture",
    amount: 22000,
    expense_date: "2026-03-05",
  },
  {
    title: "Transport",
    category: "Transport",
    amount: 6000,
    expense_date: "2026-03-12",
  },
  {
    title: "Abonnement streaming",
    category: "Divertissements",
    amount: 10000,
    expense_date: "2026-03-25",
  },
  // Avril 2026
  {
    title: "Courses alimentaires",
    category: "Nourriture",
    amount: 30000,
    expense_date: "2026-04-02",
  },
  {
    title: "Restaurant",
    category: "Divertissements",
    amount: 18000,
    expense_date: "2026-04-15",
  },
  {
    title: "Eau",
    category: "Factures",
    amount: 8000,
    expense_date: "2026-04-20",
  },
  // Mai 2026
  {
    title: "Courses alimentaires",
    category: "Nourriture",
    amount: 26000,
    expense_date: "2026-05-08",
  },
  {
    title: "Transport",
    category: "Transport",
    amount: 7000,
    expense_date: "2026-05-14",
  },
  {
    title: "Abonnement Internet",
    category: "Factures",
    amount: 15000,
    expense_date: "2026-05-28",
  },
  // Juin 2026
  {
    title: "Courses alimentaires",
    category: "Nourriture",
    amount: 24000,
    expense_date: "2026-06-05",
  },
  {
    title: "Restaurant",
    category: "Divertissements",
    amount: 12000,
    expense_date: "2026-06-18",
  },
  {
    title: "Électricité",
    category: "Factures",
    amount: 32000,
    expense_date: "2026-06-22",
  },
  // Juillet 2026
  {
    title: "Courses alimentaires",
    category: "Nourriture",
    amount: 27000,
    expense_date: "2026-07-03",
  },
  {
    title: "Transport",
    category: "Transport",
    amount: 9000,
    expense_date: "2026-07-11",
  },
  {
    title: "Abonnement streaming",
    category: "Divertissements",
    amount: 10000,
    expense_date: "2026-07-24",
  },
  // Août 2026
  {
    title: "Courses alimentaires",
    category: "Nourriture",
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
    category: "Factures",
    amount: 15000,
    expense_date: "2026-08-05",
  },
  {
    title: "Restaurant",
    category: "Divertissements",
    amount: 12000,
    expense_date: "2026-08-08",
  },
  {
    title: "Électricité",
    category: "Factures",
    amount: 30000,
    expense_date: "2026-08-10",
  },
  // Septembre 2026
  {
    title: "Courses alimentaires",
    category: "Nourriture",
    amount: 23000,
    expense_date: "2026-09-04",
  },
  {
    title: "Transport",
    category: "Transport",
    amount: 6500,
    expense_date: "2026-09-12",
  },
  {
    title: "Restaurant",
    category: "Divertissements",
    amount: 14000,
    expense_date: "2026-09-20",
  },
  // Octobre 2026
  {
    title: "Courses alimentaires",
    category: "Nourriture",
    amount: 29000,
    expense_date: "2026-10-02",
  },
  {
    title: "Abonnement Internet",
    category: "Factures",
    amount: 15000,
    expense_date: "2026-10-15",
  },
  {
    title: "Électricité",
    category: "Factures",
    amount: 33000,
    expense_date: "2026-10-25",
  },
  // Novembre 2026
  {
    title: "Courses alimentaires",
    category: "Nourriture",
    amount: 26000,
    expense_date: "2026-11-06",
  },
  {
    title: "Transport",
    category: "Transport",
    amount: 7500,
    expense_date: "2026-11-13",
  },
  {
    title: "Restaurant",
    category: "Divertissements",
    amount: 16000,
    expense_date: "2026-11-22",
  },
  // Décembre 2026
  {
    title: "Courses alimentaires",
    category: "Nourriture",
    amount: 35000,
    expense_date: "2026-12-05",
  },
  {
    title: "Transport",
    category: "Transport",
    amount: 8000,
    expense_date: "2026-12-12",
  },
  {
    title: "Abonnement Internet",
    category: "Factures",
    amount: 15000,
    expense_date: "2026-12-20",
  },
  {
    title: "Cadeaux",
    category: "Divertissements",
    amount: 40000,
    expense_date: "2026-12-24",
  },
];

async function seedMultiMonthExpenses() {
  console.log("🌱 Seeding multi-month expenses...");

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

  console.log(`✅ ${expenses.length} dépenses ajoutées sur plusieurs mois.`);
}

seedMultiMonthExpenses().catch((error) => {
  console.error("❌ Seed failed:", error);
  process.exit(1);
});
