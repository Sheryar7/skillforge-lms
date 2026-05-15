import AddCourse from "@/components/AddCourse";
import CourseCard from "@/components/CourseCard";
import { createSupabaseServer } from "@/lib/supabase-server";
import { BookOpen, GraduationCap } from "lucide-react";
import { redirect } from "next/navigation";

export default async function CoursesPage() {
  const supabase = await createSupabaseServer();

  // 1. Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // 2. Fetch User Profile and Enrollment Requests
  const [profileResponse, enrollmentsResponse] = await Promise.all([
    supabase.from("profiles").select("role").eq("id", user.id).single(),
    supabase.from("enrollment_requests").select("course_id").eq("student_id", user.id)
  ]);

  // DEBUG: Check your terminal/console to see if this is actually "instructor"
  console.log("Current User Role:", profileResponse.data?.role);

  const isInstructor = profileResponse.data?.role === "instructor";
  
  const requestedCourseIds = new Set(enrollmentsResponse.data?.map(req => req.course_id) || []);

  // 3. Conditional Fetch Logic for Courses
  let query = supabase.from("courses").select("*");

  if (isInstructor) {
    query = query.eq("instructor_id", user.id);
  }

  const { data: courses, error } = await query.order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching courses:", error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-10 text-center bg-white rounded-3xl shadow-xl">
          <p className="text-red-500 font-black text-xl">Failed to load courses</p>
          <p className="text-slate-400 mt-2">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-10 animate-in fade-in duration-500">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-800 flex items-center gap-4">
            <div className="p-3 bg-violet-600 rounded-2xl text-white shadow-lg shadow-violet-200">
              <GraduationCap size={32} />
            </div>
            {isInstructor ? "My Courses" : "Available Courses"}
          </h1>
          <p className="text-slate-500 font-medium mt-3 ml-1">
            {isInstructor
              ? "Manage your curriculum and student enrollments."
              : "Expand your knowledge with our modern curriculum."}
          </p>
        </div>

        {/* 4. Instructor Action Area - Only shows if role is exactly 'instructor' */}
        {isInstructor && (
          <div className="mb-12">
            <AddCourse /> 
          </div>
        )}

        {/* Courses Grid */}
        <div className="space-y-6">
          <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-slate-400 ml-1">
            {isInstructor ? "Your Published Courses" : "Current Catalog"} ({courses?.length || 0})
          </h2>

          {courses && courses.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  isStudentView={!isInstructor}
                  hasRequested={requestedCourseIds.has(course.id)} 
                />
              ))}
            </div>
          ) : (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] py-24 flex flex-col items-center justify-center text-center">
              <div className="bg-slate-50 p-8 rounded-full mb-6 text-slate-300">
                <BookOpen size={64} />
              </div>
              <h3 className="text-2xl font-black text-slate-700">
                {isInstructor ? "No courses created yet" : "No courses available"}
              </h3>
              <p className="text-slate-400 max-w-sm mt-2 font-medium">
                {isInstructor
                  ? "Start by creating your first course using the builder above."
                  : "We're currently preparing new content. Check back soon!"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}