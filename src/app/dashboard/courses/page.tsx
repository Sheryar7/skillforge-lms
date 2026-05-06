import AddCourse from "@/components/AddCourse";
import CourseItem from "@/components/CourseItem";

type Course = {
  id: number;
  title: string;
};

async function getCourses(): Promise<Course[]> {
  const res = await fetch("http://localhost:3001/api/courses", {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch");

  return res.json();
}

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Courses</h1>

      <AddCourse />

      <div className="space-y-4">
        {courses.map((course) => (
          <CourseItem key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}