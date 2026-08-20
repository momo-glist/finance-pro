import { deleteTransaction, updateTransaction } from "@/lib/server/db-actions";

export async function PATH(request: Request, { id }: { id: string }) {
  try {
    const body = await request.json();
    const { title, type, category, amount, transaction_date } = body || {};

    const updateTransactionItem = await updateTransaction(id, {
      title,
      type,
      category,
      amount,
      transaction_date,
    });

    if (!updateTransaction) {
      return Response.json({ error: "Transaction non trouvé", status: 404 });
    }

    return Response.json({ updateTransactionItem });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update the expense";

    return Response.json({ error, errorMessage });
  }
}

export async function DELETE(_request: Request, { id }: { id: string }) {
  try {
    await deleteTransaction(id);

    return Response.json({ ok: true, status: 204 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete the expense";

    return Response.json({ error, errorMessage });
  }
}
