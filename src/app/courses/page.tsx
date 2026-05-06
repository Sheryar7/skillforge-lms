
import { getCourses } from "@/lib/api";
import CourseCard from "@/components/CourseCard";
import { Course } from "@/types/lms";

export default async function CoursesPage() {
  const courses: Course[] = await getCourses();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      
      <h1 className="text-3xl font-bold mb-6">
        All Courses
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

    </div>
  );
}