import { createSupabaseServer } from "@/lib/supabase-server";

/**
 * POST → Enroll user into course
 */
export async function POST(req: Request) {
  try {
    const supabase = await createSupabaseServer();

    // Get request body
    const body = await req.json();

    const { user_id, course_id } = body;

    // Validation
    if (!user_id || !course_id) {
      return Response.json(
        { error: "user_id and course_id are required" },
        { status: 400 }
      );
    }

    // Insert enrollment
    const { data, error } = await supabase
      .from("enrollments")
      .insert([
        {
          user_id,
          course_id,
        },
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
      { error: "Server error while enrolling user" },
      { status: 500 }
    );
  }
}