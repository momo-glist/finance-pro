import { createTransaction, deleteTransaction, getAllTransactions, getCategories, updateTransaction } from "@/lib/server/db-actions";

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

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id } = body || {};
    
    console.log("DELETE request body:", body);
    console.log("Deleting transaction with id:", id);

    if (!id) {
      return Response.json({ error: "id is required" }, { status: 400 });
    }

    await deleteTransaction(id);

    return Response.json({ ok: true, status: 204 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete the expense";

    return Response.json({ error, errorMessage });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, type, category_id, amount, transaction_date, userId, id, action } = body || {};
    
    console.log("POST request body:", body);
    console.log("ID present:", id);
    console.log("Action:", action);

    // If action is delete, handle delete operation (check this first!)
    if (action === "delete") {
      console.log("Processing delete for id:", id);
      if (!id) {
        return Response.json({ error: "id is required for delete" }, { status: 400 });
      }
      await deleteTransaction(id);
      return Response.json({ ok: true, status: 204 });
    }

    // If id is provided, it's an update operation
    if (id) {
      console.log("Processing update for id:", id);
      const updateTransactionItem = await updateTransaction(id, {
        title,
        type,
        category_id,
        amount,
        transaction_date,
      });

      if (!updateTransaction) {
        return Response.json({ error: "Transaction non trouvé", status: 404 });
      }

      return Response.json({ updateTransactionItem });
    }

    console.log("Processing create operation");
    // Otherwise, it's a create operation
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

    // Check if category exists by ID (category_id should be an ID now)
    const existingCategories = await getCategories(userId);
    console.log("Existing categories:", existingCategories);
    const existingCategory = existingCategories.find(cat => cat.id === category_id);
    console.log("Looking for category ID:", category_id);
    console.log("Found existing category:", existingCategory);
    
    let finalCategoryId: string;
    
    if (existingCategory) {
      finalCategoryId = existingCategory.id;
      console.log("Using existing category ID:", finalCategoryId);
    } else {
      console.log("Category not found, cannot create transaction without valid category_id");
      return Response.json({ 
        error: "Category not found. Please provide a valid category_id.", 
        status: 400 
      });
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
      error instanceof Error ? error.message : "Failed to create/update the expense";

    return Response.json({ error, errorMessage });
  }
}
