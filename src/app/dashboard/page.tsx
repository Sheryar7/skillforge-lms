import ProtectedRoute from "@/components/ProtectedRoute";
import { createSupabaseServer } from "@/lib/supabase-server";
import StudentDashboard from "./StudentDashboard";
import InstructorDashboard from "./InstructorDashboard";

export default async function Dashboard() {
  const supabase = await createSupabaseServer();

  // 1. Get the current user
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null; // Safety check for ProtectedRoute

  // 2. Fetch profile - (Using maybeSingle to avoid 406 errors)
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .maybeSingle();

  const userRole = profile?.role || "student";
  const fullName = profile?.full_name || "Sherry";

  // 3. Logic for Instructor
  let instructorStats = { totalStudents: 0, activeCourses: 0 };
  let instructorCourses: any[] = []; // This will hold your list
  
  if (userRole === "instructor") {
    // A. FETCH ALL COURSES OWNED BY THIS INSTRUCTOR
    const { data: courses } = await supabase
      .from("courses")
      .select("*")
      .eq("instructor_id", user.id)
      .order("created_at", { ascending: true }); // Newest will be at the bottom

    instructorCourses = courses || [];

    // B. STATS LOGIC
    const { count: courseCount } = await supabase
      .from("courses")
      .select("*", { count: 'exact', head: true })
      .eq("instructor_id", user.id);

    const { data: enrollmentData } = await supabase
      .from("enrollments")
      .select("user_id, courses!inner(instructor_id)")
      .eq("courses.instructor_id", user.id);

    const uniqueStudents = new Set(enrollmentData?.map(e => e.user_id)).size;

    instructorStats = {
      totalStudents: uniqueStudents,
      activeCourses: courseCount || 0
    };
  }

  // 4. Logic for Student Enrollments
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select(`
      course_id,
      courses ( title, description, instructor_id, thumbnail, price ),
      progress: progress ( completion_percentage, status, updated_at )
    `)
    .eq("user_id", user.id);

  return (
    <ProtectedRoute>
      {userRole === "instructor" ? (
        <InstructorDashboard 
          user={user} 
          stats={instructorStats} 
          userName={fullName} 
          initialCourses={instructorCourses} // Pass the courses here!
        />
      ) : (
        <StudentDashboard enrollments={enrollments} />
      )}
    </ProtectedRoute>
  );
}