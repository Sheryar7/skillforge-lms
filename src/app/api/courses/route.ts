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

/**
 * POST → Create a new course entry in the database.
 * This endpoint handles the final step: saving the course details 
 * and the thumbnail URL into the "courses" table.
 */
export async function POST(req: Request) {
  try {
    // 1. Initialize the Supabase client for server-side operations
    const supabase = await createSupabaseServer();

    // 2. Extract the JSON body from the incoming request (Postman or Frontend)
    const body = await req.json();

    // 3. Validation: Ensure a title is provided and isn't just empty whitespace
    if (!body.title || body.title.trim() === "") {
      return Response.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    // 4. Insert the data into the 'courses' table
    // We provide fallbacks (|| "") to ensure fields aren't null if left empty
    const { data, error } = await supabase
      .from("courses")
      .insert([
        {
          title: body.title,
          description: body.description || "",
          // This thumbnail field should receive the publicUrl from your upload API
          thumbnail: body.thumbnail || "", 
        },
      ])
      // .select() returns the newly created row
      // .single() ensures we get one object back instead of an array
      .select()
      .single();

    // 5. Check for database-level errors (like RLS policy violations)
    if (error) {
      return Response.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // 6. Return the successfully created course with a 201 Created status
    return Response.json(data, { status: 201 });

  } catch (err) {
    // 7. Catch block for unexpected server crashes or JSON parsing errors
    console.error("Course Creation Error:", err);

    return Response.json(
      { error: "Server error while creating course" },
      { status: 500 }
    );
  }
}