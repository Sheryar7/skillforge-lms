import { createSupabaseServer } from "@/lib/supabase-server";

// GET → fetch all courses
export async function GET() {
  try {
    // Initialize the server-side client
    const supabase = await createSupabaseServer();

    const { data, error } = await supabase
      .from("courses")
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
      { error: "Server error while fetching courses" },
      { status: 500 }
    );
  }
}

// POST → create new course
export async function POST(req: Request) {
  try {
    // Initialize the server-side client
    const supabase = await createSupabaseServer();

    const body = await req.json();

    // Basic Validation
    if (!body.title || body.title.trim() === "") {
      return Response.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    // Include the thumbnail if it exists in the request body
    const { data, error } = await supabase
      .from("courses")
      .insert([
        { 
          title: body.title,
          thumbnail: body.thumbnail || null // Support for the Day 21 thumbnail feature
        }
      ])
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
      { error: "Server error while creating course" },
      { status: 500 }
    );
  }
}