import Image from "next/image";
import { Course } from "@/types/course";

type Props = {
  course: Course;
};

export default function CourseCard({ course }: Props) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition duration-300">

      {/* IMAGE */}
      {course.thumbnail ? (
        <Image
          src={course.thumbnail}
          alt={course.title}
          width={500}
          height={300}
          className="w-full h-52 object-cover"
        />
      ) : (
        <div className="h-52 bg-gradient-to-r from-violet-500 to-purple-500" />
      )}

      {/* CONTENT */}
      <div className="p-6">

        <div className="flex items-center justify-between">

          <span className="px-3 py-1 bg-violet-100 text-violet-700 text-xs font-medium rounded-full">
            Course
          </span>

          <span className="text-xs text-gray-400">
            New
          </span>

        </div>

        <h2 className="text-xl font-bold text-gray-800 mt-4">
          {course.title}
        </h2>

        <p className="text-gray-500 mt-3 leading-relaxed text-sm">
          {course.description}
        </p>

        <div className="mt-6 flex items-center justify-between">

          <div>
            <p className="text-xs text-gray-400">
              Instructor
            </p>

            <p className="text-sm font-semibold text-gray-700">
              {course.instructor}
            </p>
          </div>

          <button className="px-4 py-2 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition text-sm">
            View
          </button>

        </div>

      </div>

    </div>
  );
}