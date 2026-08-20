import { createUser, getUser } from "@/lib/server/db-actions";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return Response.json({ error: "userId is required" }, { status: 400 });
    }

    const user = await getUser(userId);

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({ user });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to get user";

    return Response.json({ error, errorMessage });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, email, first_name, last_name, currency } = body || {};

    if (!id || !email) {
      return Response.json({
        error: "Please provide id and email",
        status: 400,
      });
    }

    const user = await createUser({
      id,
      email,
      first_name: first_name || "",
      last_name: last_name || "",
      currency: currency || "XOF",
    });

    return Response.json({ user, status: 201 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create user";

    return Response.json({ error, errorMessage });
  }
}
