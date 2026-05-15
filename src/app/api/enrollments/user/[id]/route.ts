import { createSupabaseServer } from "@/lib/supabase-server";

// GET → Fetch enrolled courses for a user
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createSupabaseServer();

    const { id } = await params;

    // Validate user ID
    if (!id) {
      return Response.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Fetch enrollments
    const { data: enrollments, error: enrollError } =
      await supabase
        .from("enrollments")
        .select("*")
        .eq("user_id", id);

    if (enrollError) {
      return Response.json(
        { error: enrollError.message },
        { status: 500 }
      );
    }

    // No enrollments found
    if (!enrollments || enrollments.length === 0) {
      return Response.json([]);
    }

    // Extract course IDs
    const courseIds = enrollments.map(
      (item) => item.course_id
    );

    // Fetch courses
    const { data: courses, error: courseError } =
      await supabase
        .from("courses")
        .select("*")
        .in("id", courseIds);

    if (courseError) {
      return Response.json(
        { error: courseError.message },
        { status: 500 }
      );
    }

    return Response.json(courses);
  } catch (err) {
    console.error(err);

    return Response.json(
      { error: "Server error while fetching courses" },
      { status: 500 }
    );
  }
}