import { createClient } from "@/lib/supabase-server";

// GET → single user
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient(); 

    const { id } = params;

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 404 });
    }

    return Response.json(data);
  } catch (err) {
    return Response.json(
      { error: "Server error while fetching user" },
      { status: 500 }
    );
  }
}

// PUT → update user
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient(); 

    const body = await req.json();
    const { id } = params;

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
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(data);
  } catch (err) {
    return Response.json(
      { error: "Server error while updating user" },
      { status: 500 }
    );
  }
}

// DELETE → remove user
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient(); 

    const { id } = params;

    const { error } = await supabase
      .from("users")
      .delete()
      .eq("id", id);

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (err) {
    return Response.json(
      { error: "Server error while deleting user" },
      { status: 500 }
    );
  }
}