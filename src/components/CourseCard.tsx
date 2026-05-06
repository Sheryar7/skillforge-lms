
import { Course } from "@/types/lms";

type Props = {
  course: Course;
};

export default function CourseCard({ course }: Props) {
  return (
    <div className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition">
      <h2 className="text-lg font-bold text-gray-800">
        {course.title}
      </h2>

      <p className="text-gray-600 mt-2">
        {course.description}
      </p>

      <p className="text-sm text-gray-400 mt-3">
        Instructor: {course.instructor}
      </p>
    </div>
  );
}