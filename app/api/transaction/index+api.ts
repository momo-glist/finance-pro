import { createCategory, createTransaction, getAllTransactions, getCategories } from "@/lib/server/db-actions";
import { MAP_CATEGORY_TO_ICON } from "@/utils/constants";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return Response.json({ error: "userId is required" }, { status: 400 });
    }

    const transactions = await getAllTransactions(userId);

    return Response.json({ transactions });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to get the transactions";

    return Response.json({ error, errorMessage });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, type, category_id, amount, transaction_date, userId } = body || {};

    if (
      !title ||
      !type ||
      !category_id ||
      amount === undefined ||
      transaction_date === undefined ||
      !userId
    ) {
      return Response.json({
        error: "Please provide all the field including userId",
        status: 400,
      });
    }

    // Check if category exists, if not create it
    const existingCategories = await getCategories(userId);
    const existingCategory = existingCategories.find(cat => cat.name === category_id);
    
    let finalCategoryId = category_id;
    
    if (!existingCategory) {
      // Create the category
      const newCategory = await createCategory({
        userId,
        name: category_id,
        type: type as "income" | "expense",
        icon: MAP_CATEGORY_TO_ICON[category_id as keyof typeof MAP_CATEGORY_TO_ICON] || "",
      });
      finalCategoryId = newCategory.id;
    }

    const createTransactionItem = await createTransaction({
      userId,
      title,
      type,
      category_id: finalCategoryId,
      amount,
      transaction_date: transaction_date,
    });

    return Response.json({ createTransactionItem, status: 201 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create the expense";

    return Response.json({ error, errorMessage });
  }
}
