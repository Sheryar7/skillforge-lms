import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase-server";
import { BookOpen, ChevronRight, Plus, TrendingUp } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Course } from "@/features/courses/types/course.types";
import InstructorCourseCard from "@/features/courses/components/InstructorCourseCard";

export default async function InstructorCoursesPage() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const instructorId = user.id;
  const { data: courses, error } = await supabase
    .from("courses")
    .select("*")
    .eq("instructor_id", instructorId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  const instructorCourses = (courses || []) as Course[];
  
  // Fetch stats for each course
  const courseStats = await Promise.all(
    instructorCourses.map(async (course) => {
      const [{ count: lessonCount }, { count: enrollmentCount }] = await Promise.all([
        supabase
          .from("lessons")
          .select("id", { count: "exact", head: true })
          .in("section_id", 
            (await supabase
              .from("sections")
              .select("id")
              .eq("course_id", course.id)
              .then(r => r.data?.map(s => s.id) || [])
            )
          ),
        supabase
          .from("enrollments")
          .select("id", { count: "exact", head: true })
          .eq("course_id", course.id),
      ]);

      return {
        courseId: course.id,
        lessonCount: lessonCount || 0,
        enrollmentCount: enrollmentCount || 0,
      };
    })
  );

  const publishedCount = instructorCourses.filter((course) => course.published).length;
  const draftCount = instructorCourses.length - publishedCount;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-4 py-2 text-xs font-black uppercase tracking-[0.32em] text-violet-600 border border-violet-200">
            <BookOpen size={14} strokeWidth={3} /> Instructor Studio
          </div>
          <div>
            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">Your Course Library</h1>
            <p className="max-w-2xl text-sm text-slate-500 mt-2">Create, manage, and publish courses to build your student community.</p>
          </div>
        </div>

        <Link href="/dashboard/instructor/courses/create">
          <Button className="px-6 py-4 rounded-2xl flex items-center gap-2 text-base" variant="primary">
            <Plus size={18} strokeWidth={2.5} /> Create New Course
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100/50 p-6 transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500 font-black">Total courses</p>
              <p className="mt-3 text-4xl font-black text-slate-900">{instructorCourses.length}</p>
            </div>
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-violet-100">
              <BookOpen size={24} className="text-violet-600" />
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-green-50 to-emerald-50/50 p-6 transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500 font-black">Published</p>
              <p className="mt-3 text-4xl font-black text-slate-900">{publishedCount}</p>
            </div>
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-green-100">
              <ChevronRight size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-amber-50 to-orange-50/50 p-6 transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500 font-black">In Drafts</p>
              <p className="mt-3 text-4xl font-black text-slate-900">{draftCount}</p>
            </div>
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-100">
              <TrendingUp size={24} className="text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      {instructorCourses.length === 0 ? (
        <div className="rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-slate-50/50 p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white border border-slate-200 mb-4">
            <BookOpen size={32} className="text-slate-400" />
          </div>
          <h2 className="text-xl font-black text-slate-900 mt-4">No courses yet</h2>
          <p className="text-sm text-slate-500 mt-2 max-w-sm">Start creating your first course to build your instructor profile and reach students.</p>
          <Link href="/dashboard/instructor/courses/create">
            <Button className="mt-6 px-6 py-3 rounded-2xl" variant="primary">
              <Plus size={16} /> Create Your First Course
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {instructorCourses.map((course) => {
            const stats = courseStats.find((s) => s.courseId === course.id);
            return (
              <InstructorCourseCard
                key={course.id}
                course={course}
                lessonCount={stats?.lessonCount || 0}
                enrollmentCount={stats?.enrollmentCount || 0}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
