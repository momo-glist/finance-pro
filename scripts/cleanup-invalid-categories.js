const API_URL = "http://localhost:8081";
const USER_ID = "user_3I187oeExXIF7IxwhZNyL1gv44X";

async function getCategories() {
  try {
    const response = await fetch(`${API_URL}/api/category?userId=${USER_ID}`);
    const data = await response.json();
    if (response.ok && data.categories) {
      return data.categories;
    }
    return [];
  } catch (error) {
    console.error("Error fetching categories:", error.message);
    return [];
  }
}

async function getTransactions() {
  try {
    const response = await fetch(`${API_URL}/api/transaction?userId=${USER_ID}`);
    const data = await response.json();
    if (response.ok && data.transactions) {
      return data.transactions;
    }
    return [];
  } catch (error) {
    console.error("Error fetching transactions:", error.message);
    return [];
  }
}

async function deleteTransaction(id) {
  try {
    const response = await fetch(`${API_URL}/api/transaction`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action: "delete" }),
    });
    return response.ok;
  } catch (error) {
    console.error(`Error deleting transaction ${id}:`, error.message);
    return false;
  }
}

async function deleteCategory(id) {
  try {
    const response = await fetch(`${API_URL}/api/category`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action: "delete" }),
    });
    return response.ok;
  } catch (error) {
    console.error(`Error deleting category ${id}:`, error.message);
    return false;
  }
}

async function main() {
  console.log("🧹 Starting cleanup script...\n");
  
  // Get all categories
  console.log("📁 Fetching categories...");
  const categories = await getCategories();
  console.log(`Found ${categories.length} categories\n`);
  
  // Identify invalid categories (UUID as name or empty icon)
  const invalidCategories = categories.filter(cat => {
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cat.name);
    const hasEmptyIcon = !cat.icon || cat.icon === '';
    return isUUID || hasEmptyIcon;
  });
  
  console.log(`Found ${invalidCategories.length} invalid categories (UUID as name or empty icon)`);
  invalidCategories.forEach(cat => {
    const reason = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cat.name) ? 'UUID name' : 'empty icon';
    console.log(`- ${cat.id}: ${cat.name} (${reason})`);
  });
  console.log();
  
  if (invalidCategories.length === 0) {
    console.log("✅ No invalid categories found. Nothing to clean up.");
    return;
  }
  
  // Get all transactions
  console.log("💰 Fetching transactions...");
  const transactions = await getTransactions();
  console.log(`Found ${transactions.length} transactions\n`);
  
  // Find transactions linked to invalid categories
  const invalidCategoryIds = invalidCategories.map(cat => cat.id);
  const transactionsToDelete = transactions.filter(t => 
    invalidCategoryIds.includes(t.category_id)
  );
  
  console.log(`Found ${transactionsToDelete.length} transactions linked to invalid categories`);
  
  // Delete transactions first
  console.log("\n🗑️  Deleting transactions...");
  let deletedCount = 0;
  for (const transaction of transactionsToDelete) {
    const success = await deleteTransaction(transaction.id);
    if (success) {
      deletedCount++;
      console.log(`✓ Deleted transaction: ${transaction.title}`);
    } else {
      console.log(`✗ Failed to delete transaction: ${transaction.title}`);
    }
    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log(`\n✓ Deleted ${deletedCount}/${transactionsToDelete.length} transactions`);
  
  // Delete invalid categories
  console.log("\n🗑️  Deleting invalid categories...");
  let deletedCategoriesCount = 0;
  for (const category of invalidCategories) {
    const success = await deleteCategory(category.id);
    if (success) {
      deletedCategoriesCount++;
      console.log(`✓ Deleted category: ${category.name} (${category.id})`);
    } else {
      console.log(`✗ Failed to delete category: ${category.name} (${category.id})`);
    }
    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log(`\n✓ Deleted ${deletedCategoriesCount}/${invalidCategories.length} invalid categories`);
  console.log("\n✅ Cleanup script completed!");
}

main().catch(console.error);
