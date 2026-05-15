import { createSupabaseServer } from "@/lib/supabase-server";

export async function POST(req: Request) {
  try {
    const supabase = await createSupabaseServer();
    const { course_id, percentage, status } = await req.json();

    // Get the current logged-in user's ID
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    // UPSERT logic: If progress exists, update it. If not, create it.
    const { data, error } = await supabase
      .from("progress")
      .upsert({
        user_id: user.id,
        course_id: course_id,
        completion_percentage: percentage,
        status: status || 'in-progress',
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id, course_id' }) // Ensure one row per user per course
      .select()
      .single();

    if (error) throw error;
    return Response.json(data);
  } catch (err) {
    return Response.json({ error: "Failed to update progress" }, { status: 500 });
  }
}