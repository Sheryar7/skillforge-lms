import { supabase } from "@/lib/supabase-server";

// GET → fetch single course
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // Updated to Promise
) {
  try {
    const { id } = await params; // Unwrapping params
    const { data, error } = await supabase
      .from("courses")
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
      { error: "Server error while fetching course" },
      { status: 500 }
    );
  }
}

// PUT → update course
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // Updated to Promise
) {
  try {
    const body = await req.json();
    const { id } = await params; // Unwrapped params

    if (!body.title || body.title.trim() === "") {
      return Response.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("courses")
      .update({ title: body.title })
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
      { error: "Server error while updating course" },
      { status: 500 }
    );
  }
}

// DELETE → remove course
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // Updated to Promise
) {
  try {
    const { id } = await params; // Unwrapped params
    const { error } = await supabase
      .from("courses")
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
      { error: "Server error while deleting course" },
      { status: 500 }
    );
  }
}