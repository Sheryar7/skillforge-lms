import { createSupabaseServer } from "@/lib/supabase-server";

/**
 * GET → Fetch single user by ID
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createSupabaseServer();

    // Fetch params (required in Next.js 16)
    const { id } = await params;

    if (!id) {
      return Response.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return Response.json(
        { error: error.message },
        { status: 404 }
      );
    }

    return Response.json(data);
  } catch (err) {
    return Response.json(
      { error: "Server error while fetching user" },
      { status: 500 }
    );
  }
}

/**
 * PUT → Update user by ID
 */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createSupabaseServer();

    const body = await req.json();
    const { id } = await params;

    if (!id) {
      return Response.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    if (!body.email || body.email.trim() === "") {
      return Response.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("users")
      .update({ email: body.email })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return Response.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return Response.json(data);
  } catch (err) {
    return Response.json(
      { error: "Server error while updating user" },
      { status: 500 }
    );
  }
}

/**
 * DELETE → Remove user by ID
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createSupabaseServer();

    const { id } = await params;

    if (!id) {
      return Response.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("users")
      .delete()
      .eq("id", id);

    if (error) {
      return Response.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return Response.json({ success: true });
  } catch (err) {
    return Response.json(
      { error: "Server error while deleting user" },
      { status: 500 }
    );
  }
}