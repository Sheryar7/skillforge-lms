
import { Course } from "@/types/lms";

async function getCourse(id: string): Promise<Course> {
  const res = await fetch(`https://dummyjson.com/products/${id}`);

  if (!res.ok) {
    throw new Error("Failed to fetch course");
  }

  const data = await res.json();

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    instructor: "John Doe",
  };
}

export default async function CoursePage({
  params,
}: {
  params: { id: string };
}) {
  const course = await getCourse(params.id);

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <h1 className="text-4xl font-bold mb-4">
        {course.title}
      </h1>

      <p className="text-gray-700 text-lg">
        {course.description}
      </p>

      <p className="mt-4 text-gray-500">
        Instructor: {course.instructor}
      </p>
    </div>
  );
}