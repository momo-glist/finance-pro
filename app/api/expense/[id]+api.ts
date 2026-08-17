import { deleteExpense, updateExpense } from "@/lib/server/db-actions";

export async function PATH(request: Request, { id }: { id: string }) {
  try {
    const body = await request.json();
    const { title, category, amount, expense_date } = body || {};

    const updateExpenseItem = await updateExpense(id, {
      title,
      category,
      amount,
      expense_date,
    });

    if (!updateExpense) {
      return Response.json({ error: "Dépense non trouvé", status: 404 });
    }

    return Response.json({ updateExpenseItem });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update the expense";

    return Response.json({ error, errorMessage });
  }
}

export async function DELETE(_request: Request, { id }: { id: string }) {
  try {
    await deleteExpense(id);

    return Response.json({ ok: true, status: 204 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete the expense";

    return Response.json({ error, errorMessage });
  }
}
