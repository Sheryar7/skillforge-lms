import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, BookOpen, Eye } from "lucide-react";

import CourseEditor from "@/features/courses/components/CourseEditor";
import { createSupabaseServer } from "@/lib/supabase-server";
import { Course } from "@/features/courses/types/course.types";

interface CourseManagementPageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default async function CourseManagementPage({
  params,
}: CourseManagementPageProps) {
  const { courseId } = await params;

  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: course, error } = await supabase
    .from("courses")
    .select("*")
    .eq("id", courseId)
    .single();

  if (error || !course) {
    notFound();
  }

  const courseRecord = course as Course;

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-2">
          <Link
            href="/dashboard/instructor"
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-400 transition-colors hover:text-slate-700"
          >
            <ArrowLeft size={14} strokeWidth={2.5} />
            Return to Studio Portfolio
          </Link>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-violet-600 p-3 text-white shadow-lg shadow-violet-100">
              <BookOpen size={20} />
            </div>

            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900">
                {courseRecord.title || "Untitled course"}
              </h1>

              <p className="mt-0.5 text-xs font-medium text-slate-400">
                Build, order, and deploy chapter modules with a modern curriculum editor.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href={`/learn/${courseRecord.id}`}>
            <button className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-bold uppercase tracking-[0.28em] text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
              <Eye size={14} />
              Preview course
            </button>
          </Link>
        </div>
      </div>

      <CourseEditor course={courseRecord} />
    </div>
  );
}
