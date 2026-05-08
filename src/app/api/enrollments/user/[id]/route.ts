import { createSupabaseServer } from "@/lib/supabase-server";

export async function GET(
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

    // First fetch enrollments
    const { data: enrollments, error: enrollError } = await supabase
      .from("enrollments")
      .select("*")
      .eq("user_id", id);

    if (enrollError) {
      return Response.json(
        { error: enrollError.message },
        { status: 500 }
      );
    }

    // If no enrollments
    if (!enrollments || enrollments.length === 0) {
      return Response.json([]);
    }

    // Get all course IDs
    const courseIds = enrollments.map(
      (item) => item.course_id
    );

    // Fetch courses separately
    const { data: courses, error: courseError } = await supabase
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