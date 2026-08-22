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

async function updateTransaction(transactionId, categoryId) {
  try {
    const response = await fetch(`${API_URL}/api/transaction`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: transactionId,
        category_id: categoryId,
      }),
    });
    return response.ok;
  } catch (error) {
    console.error(`Error updating transaction ${transactionId}:`, error.message);
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
  console.log("🧹 Starting duplicate category cleanup script...\n");
  
  // Get all categories
  console.log("📁 Fetching categories...");
  const categories = await getCategories();
  console.log(`Found ${categories.length} categories\n`);
  
  // Find duplicates
  const categoryMap = {};
  categories.forEach(cat => {
    if (!categoryMap[cat.name]) {
      categoryMap[cat.name] = [];
    }
    categoryMap[cat.name].push(cat);
  });
  
  const duplicates = Object.entries(categoryMap).filter(([name, cats]) => cats.length > 1);
  
  console.log(`Found ${duplicates.length} duplicate category groups`);
  duplicates.forEach(([name, cats]) => {
    console.log(`- ${name}: ${cats.length} duplicates`);
  });
  console.log();
  
  if (duplicates.length === 0) {
    console.log("✅ No duplicate categories found. Nothing to clean up.");
    return;
  }
  
  // Get all transactions
  console.log("💰 Fetching transactions...");
  const transactions = await getTransactions();
  console.log(`Found ${transactions.length} transactions\n`);
  
  // Process each duplicate group
  for (const [name, duplicateCategories] of duplicates) {
    console.log(`\n🔄 Processing duplicate group: ${name}`);
    
    // Sort by created_date (newest first) and prefer categories with icons
    duplicateCategories.sort((a, b) => {
      const aHasIcon = a.icon && a.icon !== '';
      const bHasIcon = b.icon && b.icon !== '';
      
      if (aHasIcon && !bHasIcon) return -1;
      if (!aHasIcon && bHasIcon) return 1;
      
      return new Date(b.created_date) - new Date(a.created_date);
    });
    
    // Keep the first one (best candidate)
    const keepCategory = duplicateCategories[0];
    const deleteCategories = duplicateCategories.slice(1);
    
    console.log(`  Keeping: ${keepCategory.id} (icon: ${keepCategory.icon ? 'yes' : 'no'})`);
    console.log(`  Deleting: ${deleteCategories.map(c => c.id).join(', ')}`);
    
    // Find transactions linked to categories to delete
    const deleteCategoryIds = deleteCategories.map(c => c.id);
    const transactionsToUpdate = transactions.filter(t => 
      deleteCategoryIds.includes(t.category_id)
    );
    
    console.log(`  Found ${transactionsToUpdate.length} transactions to update`);
    
    // Update transactions to point to the kept category
    let updatedCount = 0;
    for (const transaction of transactionsToUpdate) {
      const success = await updateTransaction(transaction.id, keepCategory.id);
      if (success) {
        updatedCount++;
        console.log(`    ✓ Updated transaction: ${transaction.title}`);
      } else {
        console.log(`    ✗ Failed to update transaction: ${transaction.title}`);
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`  Updated ${updatedCount}/${transactionsToUpdate.length} transactions`);
    
    // Delete duplicate categories
    let deletedCount = 0;
    for (const category of deleteCategories) {
      const success = await deleteCategory(category.id);
      if (success) {
        deletedCount++;
        console.log(`    ✓ Deleted category: ${category.id}`);
      } else {
        console.log(`    ✗ Failed to delete category: ${category.id}`);
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`  Deleted ${deletedCount}/${deleteCategories.length} duplicate categories`);
  }
  
  console.log("\n✅ Duplicate category cleanup completed!");
}

main().catch(console.error);
