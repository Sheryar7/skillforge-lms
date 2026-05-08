import { createSupabaseServer } from "@/lib/supabase-server";

// GET → Fetch all users from database
export async function GET() {
  try {
    const supabase = await createSupabaseServer();

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      return Response.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return Response.json(data);
  } catch (err) {
    return Response.json(
      { error: "Server error while fetching users" },
      { status: 500 }
    );
  }
}

// POST → Create a new user
export async function POST(req: Request) {
  try {
    const supabase = await createSupabaseServer();

    const body = await req.json();

    // Validate input
    if (!body.email || body.email.trim() === "") {
      return Response.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("users")
      .insert([{ email: body.email }])
      .select()
      .single();

    if (error) {
      return Response.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return Response.json(data, { status: 201 });
  } catch (err) {
    return Response.json(
      { error: "Server error while creating user" },
      { status: 500 }
    );
  }
}