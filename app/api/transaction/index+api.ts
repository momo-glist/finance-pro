import { createTransaction, getAllTransactions } from "@/lib/server/db-actions";

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

    const createTransactionItem = createTransaction({
      userId,
      title,
      type,
      category_id,
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
