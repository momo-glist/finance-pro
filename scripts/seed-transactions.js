const API_URL = "http://localhost:8081";
const USER_ID = "user_3I187oeExXIF7IxwhZNyL1gv44X";

const CATEGORY_KEY = {
  FOOD: "Nourriture",
  TRANSPORT: "Transport",
  GROCERIES: "Épicerie",
  ENTERTAINMENT: "Divertissements",
  BILLS: "Factures",
  SHOPPING: "Shopping",
  HEALTH: "Santé",
  EDUCATION: "Éducation",
  SALARY: "Salaire",
  INVESTMENT: "Investissement",
  GIFTS: "Cadeaux",
  TRAVEL: "Voyage",
  UTILITIES: "Services",
  INSURANCE: "Assurance",
  SUBSCRIPTIONS: "Abonnements",
};

const MAP_CATEGORY_TO_ICON = {
  [CATEGORY_KEY.FOOD]: "https://cdn-icons-png.flaticon.com/128/5359/5359085.png",
  [CATEGORY_KEY.TRANSPORT]: "https://cdn-icons-png.flaticon.com/128/2357/2357242.png",
  [CATEGORY_KEY.GROCERIES]: "https://cdn-icons-png.flaticon.com/128/4168/4168659.png",
  [CATEGORY_KEY.ENTERTAINMENT]: "https://cdn-icons-png.flaticon.com/128/4423/4423702.png",
  [CATEGORY_KEY.BILLS]: "https://cdn-icons-png.flaticon.com/128/9382/9382189.png",
  [CATEGORY_KEY.SHOPPING]: "https://cdn-icons-png.flaticon.com/128/3081/3081559.png",
  [CATEGORY_KEY.HEALTH]: "https://cdn-icons-png.flaticon.com/128/2991/2991148.png",
  [CATEGORY_KEY.EDUCATION]: "https://cdn-icons-png.flaticon.com/128/2991/2991106.png",
  [CATEGORY_KEY.SALARY]: "https://cdn-icons-png.flaticon.com/128/781/781835.png",
  [CATEGORY_KEY.INVESTMENT]: "https://cdn-icons-png.flaticon.com/128/918/918821.png",
  [CATEGORY_KEY.GIFTS]: "https://cdn-icons-png.flaticon.com/128/2991/2991151.png",
  [CATEGORY_KEY.TRAVEL]: "https://cdn-icons-png.flaticon.com/128/2991/2991150.png",
  [CATEGORY_KEY.UTILITIES]: "https://cdn-icons-png.flaticon.com/128/2991/2991152.png",
  [CATEGORY_KEY.INSURANCE]: "https://cdn-icons-png.flaticon.com/128/2991/2991153.png",
  [CATEGORY_KEY.SUBSCRIPTIONS]: "https://cdn-icons-png.flaticon.com/128/2991/2991154.png",
};

// Categories with their types
const categories = [
  { name: CATEGORY_KEY.FOOD, type: "expense", icon: MAP_CATEGORY_TO_ICON[CATEGORY_KEY.FOOD] },
  { name: CATEGORY_KEY.TRANSPORT, type: "expense", icon: MAP_CATEGORY_TO_ICON[CATEGORY_KEY.TRANSPORT] },
  { name: CATEGORY_KEY.GROCERIES, type: "expense", icon: MAP_CATEGORY_TO_ICON[CATEGORY_KEY.GROCERIES] },
  { name: CATEGORY_KEY.ENTERTAINMENT, type: "expense", icon: MAP_CATEGORY_TO_ICON[CATEGORY_KEY.ENTERTAINMENT] },
  { name: CATEGORY_KEY.BILLS, type: "expense", icon: MAP_CATEGORY_TO_ICON[CATEGORY_KEY.BILLS] },
  { name: CATEGORY_KEY.SHOPPING, type: "expense", icon: MAP_CATEGORY_TO_ICON[CATEGORY_KEY.SHOPPING] },
  { name: CATEGORY_KEY.HEALTH, type: "expense", icon: MAP_CATEGORY_TO_ICON[CATEGORY_KEY.HEALTH] },
  { name: CATEGORY_KEY.EDUCATION, type: "expense", icon: MAP_CATEGORY_TO_ICON[CATEGORY_KEY.EDUCATION] },
  { name: CATEGORY_KEY.SALARY, type: "income", icon: MAP_CATEGORY_TO_ICON[CATEGORY_KEY.SALARY] },
  { name: CATEGORY_KEY.INVESTMENT, type: "expense", icon: MAP_CATEGORY_TO_ICON[CATEGORY_KEY.INVESTMENT] },
  { name: CATEGORY_KEY.GIFTS, type: "expense", icon: MAP_CATEGORY_TO_ICON[CATEGORY_KEY.GIFTS] },
  { name: CATEGORY_KEY.TRAVEL, type: "expense", icon: MAP_CATEGORY_TO_ICON[CATEGORY_KEY.TRAVEL] },
  { name: CATEGORY_KEY.UTILITIES, type: "expense", icon: MAP_CATEGORY_TO_ICON[CATEGORY_KEY.UTILITIES] },
  { name: CATEGORY_KEY.INSURANCE, type: "expense", icon: MAP_CATEGORY_TO_ICON[CATEGORY_KEY.INSURANCE] },
  { name: CATEGORY_KEY.SUBSCRIPTIONS, type: "expense", icon: MAP_CATEGORY_TO_ICON[CATEGORY_KEY.SUBSCRIPTIONS] },
];

// Sample transactions for different months
const sampleTransactions = [
  // January
  { title: "Salaire Janvier", type: "income", category: CATEGORY_KEY.SALARY, amount: 500000, date: "2026-01-05" },
  { title: "Courses alimentaires", type: "expense", category: CATEGORY_KEY.GROCERIES, amount: 45000, date: "2026-01-10" },
  { title: "Transport bus", type: "expense", category: CATEGORY_KEY.TRANSPORT, amount: 15000, date: "2026-01-15" },
  { title: "Facture électricité", type: "expense", category: CATEGORY_KEY.BILLS, amount: 25000, date: "2026-01-20" },
  { title: "Restaurant", type: "expense", category: CATEGORY_KEY.FOOD, amount: 12000, date: "2026-01-25" },
  
  // February
  { title: "Salaire Février", type: "income", category: CATEGORY_KEY.SALARY, amount: 500000, date: "2026-02-05" },
  { title: "Achat vêtements", type: "expense", category: CATEGORY_KEY.SHOPPING, amount: 35000, date: "2026-02-10" },
  { title: "Essence", type: "expense", category: CATEGORY_KEY.TRANSPORT, amount: 20000, date: "2026-02-15" },
  { title: "Cinéma", type: "expense", category: CATEGORY_KEY.ENTERTAINMENT, amount: 8000, date: "2026-02-20" },
  { title: "Pharmacie", type: "expense", category: CATEGORY_KEY.HEALTH, amount: 5000, date: "2026-02-25" },
  
  // March
  { title: "Salaire Mars", type: "income", category: CATEGORY_KEY.SALARY, amount: 500000, date: "2026-03-05" },
  { title: "Courses hebdo", type: "expense", category: CATEGORY_KEY.GROCERIES, amount: 38000, date: "2026-03-10" },
  { title: "Uber", type: "expense", category: CATEGORY_KEY.TRANSPORT, amount: 12000, date: "2026-03-15" },
  { title: "Netflix", type: "expense", category: CATEGORY_KEY.SUBSCRIPTIONS, amount: 10000, date: "2026-03-20" },
  { title: "Investissement", type: "expense", category: CATEGORY_KEY.INVESTMENT, amount: 100000, date: "2026-03-25" },
  
  // April
  { title: "Salaire Avril", type: "income", category: CATEGORY_KEY.SALARY, amount: 500000, date: "2026-04-05" },
  { title: "Restaurant famille", type: "expense", category: CATEGORY_KEY.FOOD, amount: 25000, date: "2026-04-10" },
  { title: "Réparation voiture", type: "expense", category: CATEGORY_KEY.TRANSPORT, amount: 45000, date: "2026-04-15" },
  { title: "Internet", type: "expense", category: CATEGORY_KEY.UTILITIES, amount: 15000, date: "2026-04-20" },
  { title: "Cadeau anniversaire", type: "expense", category: CATEGORY_KEY.GIFTS, amount: 20000, date: "2026-04-25" },
  
  // May
  { title: "Salaire Mai", type: "income", category: CATEGORY_KEY.SALARY, amount: 500000, date: "2026-05-05" },
  { title: "Supermarché", type: "expense", category: CATEGORY_KEY.GROCERIES, amount: 42000, date: "2026-05-10" },
  { title: "Métro", type: "expense", category: CATEGORY_KEY.TRANSPORT, amount: 10000, date: "2026-05-15" },
  { title: "Assurance voiture", type: "expense", category: CATEGORY_KEY.INSURANCE, amount: 30000, date: "2026-05-20" },
  { title: "Formation en ligne", type: "expense", category: CATEGORY_KEY.EDUCATION, amount: 25000, date: "2026-05-25" },
  
  // June
  { title: "Salaire Juin", type: "income", category: CATEGORY_KEY.SALARY, amount: 500000, date: "2026-06-05" },
  { title: "Déjeuner travail", type: "expense", category: CATEGORY_KEY.FOOD, amount: 8000, date: "2026-06-10" },
  { title: "Essence", type: "expense", category: CATEGORY_KEY.TRANSPORT, amount: 18000, date: "2026-06-15" },
  { title: "Eau", type: "expense", category: CATEGORY_KEY.UTILITIES, amount: 5000, date: "2026-06-20" },
  { title: "Voyage week-end", type: "expense", category: CATEGORY_KEY.TRAVEL, amount: 80000, date: "2026-06-25" },
  
  // July
  { title: "Salaire Juillet", type: "income", category: CATEGORY_KEY.SALARY, amount: 500000, date: "2026-07-05" },
  { title: "Courses", type: "expense", category: CATEGORY_KEY.GROCERIES, amount: 40000, date: "2026-07-10" },
  { title: "Taxi", type: "expense", category: CATEGORY_KEY.TRANSPORT, amount: 15000, date: "2026-07-15" },
  { title: "Spotify", type: "expense", category: CATEGORY_KEY.SUBSCRIPTIONS, amount: 8000, date: "2026-07-20" },
  { title: "Consultation médecin", type: "expense", category: CATEGORY_KEY.HEALTH, amount: 10000, date: "2026-07-25" },
  
  // August
  { title: "Salaire Août", type: "income", category: CATEGORY_KEY.SALARY, amount: 500000, date: "2026-08-05" },
  { title: "Shopping soldes", type: "expense", category: CATEGORY_KEY.SHOPPING, amount: 55000, date: "2026-08-10" },
  { title: "Essence", type: "expense", category: CATEGORY_KEY.TRANSPORT, amount: 22000, date: "2026-08-15" },
  { title: "Gaz", type: "expense", category: CATEGORY_KEY.UTILITIES, amount: 12000, date: "2026-08-20" },
  { title: "Parc d'attractions", type: "expense", category: CATEGORY_KEY.ENTERTAINMENT, amount: 30000, date: "2026-08-25" },
  
  // September
  { title: "Salaire Septembre", type: "income", category: CATEGORY_KEY.SALARY, amount: 500000, date: "2026-09-05" },
  { title: "Épicerie", type: "expense", category: CATEGORY_KEY.GROCERIES, amount: 36000, date: "2026-09-10" },
  { title: "Bus", type: "expense", category: CATEGORY_KEY.TRANSPORT, amount: 9000, date: "2026-09-15" },
  { title: "Téléphone", type: "expense", category: CATEGORY_KEY.BILLS, amount: 20000, date: "2026-09-20" },
  { title: "Livres", type: "expense", category: CATEGORY_KEY.EDUCATION, amount: 15000, date: "2026-09-25" },
  
  // October
  { title: "Salaire Octobre", type: "income", category: CATEGORY_KEY.SALARY, amount: 500000, date: "2026-10-05" },
  { title: "Restaurant", type: "expense", category: CATEGORY_KEY.FOOD, amount: 15000, date: "2026-10-10" },
  { title: "Essence", type: "expense", category: CATEGORY_KEY.TRANSPORT, amount: 19000, date: "2026-10-15" },
  { title: "Prime", type: "income", category: CATEGORY_KEY.SALARY, amount: 100000, date: "2026-10-20" },
  { title: "Halloween", type: "expense", category: CATEGORY_KEY.ENTERTAINMENT, amount: 5000, date: "2026-10-25" },
  
  // November
  { title: "Salaire Novembre", type: "income", category: CATEGORY_KEY.SALARY, amount: 500000, date: "2026-11-05" },
  { title: "Courses", type: "expense", category: CATEGORY_KEY.GROCERIES, amount: 39000, date: "2026-11-10" },
  { title: "Train", type: "expense", category: CATEGORY_KEY.TRANSPORT, amount: 25000, date: "2026-11-15" },
  { title: "Chauffage", type: "expense", category: CATEGORY_KEY.UTILITIES, amount: 35000, date: "2026-11-20" },
  { title: "Noël cadeaux", type: "expense", category: CATEGORY_KEY.GIFTS, amount: 100000, date: "2026-11-25" },
  
  // December
  { title: "Salaire Décembre", type: "income", category: CATEGORY_KEY.SALARY, amount: 500000, date: "2026-12-05" },
  { title: "Fêtes", type: "expense", category: CATEGORY_KEY.FOOD, amount: 80000, date: "2026-12-10" },
  { title: "Essence", type: "expense", category: CATEGORY_KEY.TRANSPORT, amount: 20000, date: "2026-12-15" },
  { title: "Prime fin d'année", type: "income", category: CATEGORY_KEY.SALARY, amount: 200000, date: "2026-12-20" },
  { title: "Voyage", type: "expense", category: CATEGORY_KEY.TRAVEL, amount: 150000, date: "2026-12-25" },
];

async function getExistingCategories() {
  try {
    const response = await fetch(`${API_URL}/api/category?userId=${USER_ID}`);
    const data = await response.json();
    if (response.ok && data.categories) {
      const categoryMap = {};
      data.categories.forEach(cat => {
        // Filter out categories with UUID as name (invalid data)
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cat.name);
        if (!isUUID && cat.name) {
          categoryMap[cat.name] = cat.id;
        }
      });
      console.log(`✓ Found ${Object.keys(categoryMap).length} valid existing categories`);
      return categoryMap;
    }
    return {};
  } catch (error) {
    console.error("Error fetching existing categories:", error.message);
    return {};
  }
}

async function createCategory(category) {
  try {
    const response = await fetch(`${API_URL}/api/category`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: USER_ID,
        name: category.name,
        type: category.type,
        icon: category.icon,
      }),
    });

    const data = await response.json();
    console.log(`Response for ${category.name}:`, JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log(`✓ Category created: ${category.name}`);
      const categoryId = data.category?.id || data.id;
      console.log(`Category ID: ${categoryId}`);
      return categoryId;
    } else {
      console.log(`- Category already exists or error: ${category.name}`, data);
      return null;
    }
  } catch (error) {
    console.error(`Error creating category ${category.name}:`, error.message);
    return null;
  }
}

async function createTransaction(transaction, categoryMap) {
  try {
    const categoryId = categoryMap[transaction.category];
    if (!categoryId) {
      console.log(`✗ Category not found for: ${transaction.category}`);
      return;
    }

    const response = await fetch(`${API_URL}/api/transaction`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: USER_ID,
        title: transaction.title,
        type: transaction.type,
        category_id: categoryId, // This is now the ID, not the name
        amount: transaction.amount,
        transaction_date: transaction.date,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      console.log(`✓ Transaction created: ${transaction.title} (${transaction.date})`);
    } else {
      console.log(`✗ Error creating transaction: ${transaction.title}`, data);
    }
  } catch (error) {
    console.error(`Error creating transaction ${transaction.title}:`, error.message);
  }
}

async function main() {
  console.log("🚀 Starting seed script...\n");
  
  // First, fetch existing categories
  console.log("📁 Fetching existing categories...");
  const existingCategoryMap = await getExistingCategories();
  console.log(`Existing categories: ${Object.keys(existingCategoryMap).join(", ")}\n`);
  
  // Filter sample transactions to only use existing categories
  const validTransactions = sampleTransactions.filter(transaction => {
    const categoryExists = existingCategoryMap[transaction.category];
    if (!categoryExists) {
      console.log(`⚠️  Skipping transaction with missing category: ${transaction.category}`);
    }
    return categoryExists;
  });
  
  console.log(`✓ Found ${validTransactions.length} valid transactions (out of ${sampleTransactions.length})`);
  console.log(`✓ Using ${Object.keys(existingCategoryMap).length} existing categories\n`);
  
  // Wait a bit for categories to be processed
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Create transactions
  console.log("💰 Creating transactions...");
  for (const transaction of validTransactions) {
    await createTransaction(transaction, existingCategoryMap);
    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log(`\n✓ Created ${validTransactions.length} transactions`);
  console.log("✅ Seed script completed!\n");
}

main().catch(console.error);
