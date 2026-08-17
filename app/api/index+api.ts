import { createExpense, getAllExpense } from "@/lib/server/db-actions";

export async function GET(_request: Request, { id }: { id: string }) {
  try {
    const expenses = await getAllExpense();

    return Response.json({ expenses });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to get the expenses";

    return Response.json({ error, errorMessage });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, category, amount, expense_date } = body || {};

    if (
      !title ||
      !category ||
      amount === undefined ||
      expense_date === undefined
    ) {
      return Response.json({
        error: "Please provide all the field",
        status: 400,
      });
    }

    const createExpenseItem = createExpense({
      title,
      category,
      amount,
      expense_date: expense_date,
    });

    return Response.json({ createExpenseItem, status: 201 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create the expense";

    return Response.json({ error, errorMessage });
  }
}
