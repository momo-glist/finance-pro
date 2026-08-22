import { createCategory, deleteCategory, getCategories } from "@/lib/server/db-actions";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return Response.json({ error: "userId is required" }, { status: 400 });
    }

    const categories = await getCategories(userId);

    return Response.json({ categories });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to get categories";

    return Response.json({ error, errorMessage });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, name, type, icon, id, action } = body || {};

    // If action is delete, handle delete operation
    if (action === "delete") {
      if (!id) {
        return Response.json({ error: "id is required for delete" }, { status: 400 });
      }
      await deleteCategory(id);
      return Response.json({ ok: true, status: 204 });
    }

    if (!userId || !name || !type) {
      return Response.json({
        error: "Please provide userId, name, and type",
        status: 400,
      });
    }

    const category = await createCategory({
      userId,
      name,
      type,
      icon: icon || "",
    });

    return Response.json({ category, status: 201 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create category";

    return Response.json({ error, errorMessage });
  }
}
