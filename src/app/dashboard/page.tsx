"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <div className="space-y-8">

        {/* HERO */}
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-500 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">

          <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <p className="text-sm uppercase tracking-widest opacity-80">
              Welcome Back
            </p>

            <h1 className="text-4xl font-bold mt-2">
              Sherry LMS Dashboard
            </h1>

            <p className="mt-3 text-white/80 max-w-2xl">
              Manage your courses, students, enrollments and analytics
              from one modern admin panel.
            </p>

            <div className="flex gap-4 mt-6">
              <button className="bg-white text-purple-700 px-5 py-2 rounded-xl font-semibold hover:bg-gray-100 transition">
                Create Course
              </button>

              <button className="bg-white/10 backdrop-blur border border-white/20 px-5 py-2 rounded-xl hover:bg-white/20 transition">
                View Reports
              </button>
            </div>
          </div>

        </div>

        {/* STATS */}
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

          {[
            {
              title: "Total Courses",
              value: "12",
              change: "+12%",
              color: "from-purple-500 to-indigo-500",
            },
            {
              title: "Students",
              value: "320",
              change: "+8%",
              color: "from-blue-500 to-cyan-500",
            },
            {
              title: "Revenue",
              value: "$4,200",
              change: "+18%",
              color: "from-pink-500 to-rose-500",
            },
            {
              title: "Active Users",
              value: "89",
              change: "+5%",
              color: "from-green-500 to-emerald-500",
            },
          ].map((item, i) => (
            <div
              key={i}
              className={`bg-gradient-to-r ${item.color} text-white p-6 rounded-3xl shadow-lg hover:scale-[1.02] transition`}
            >
              <p className="text-sm opacity-80">
                {item.title}
              </p>

              <div className="flex items-end justify-between mt-4">
                <h2 className="text-3xl font-bold">
                  {item.value}
                </h2>

                <span className="text-sm bg-white/20 px-2 py-1 rounded-lg">
                  {item.change}
                </span>
              </div>
            </div>
          ))}

        </div>

        {/* CHARTS + USERS */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* CHART */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">

            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Revenue Analytics
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Weekly platform performance
                </p>
              </div>

              <button className="text-sm bg-purple-100 text-purple-700 px-4 py-2 rounded-xl">
                Download Report
              </button>
            </div>

            {/* Fake chart */}
            <div className="flex items-end gap-5 h-72">

              {[40, 60, 85, 50, 100, 75, 90].map((height, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center"
                >

                  <div
                    className="w-full bg-gradient-to-t from-purple-600 to-indigo-400 rounded-t-2xl hover:opacity-80 transition"
                    style={{ height: `${height}%` }}
                  />

                  <p className="text-xs text-gray-400 mt-3">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                  </p>

                </div>
              ))}

            </div>

          </div>

          {/* RECENT USERS */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">

            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                Recent Users
              </h2>

              <button className="text-sm text-purple-600">
                View all
              </button>
            </div>

            <div className="space-y-5 mt-6">

              {[
                {
                  name: "Ali Khan",
                  role: "Frontend Student",
                },
                {
                  name: "Sara Ahmed",
                  role: "Backend Student",
                },
                {
                  name: "John Smith",
                  role: "UI/UX Designer",
                },
                {
                  name: "Ayesha Noor",
                  role: "Instructor",
                },
              ].map((user, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between"
                >

                  <div className="flex items-center gap-3">

                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white flex items-center justify-center font-bold shadow">
                      {user.name[0]}
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-700">
                        {user.name}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {user.role}
                      </p>
                    </div>

                  </div>

                  <span className="w-3 h-3 rounded-full bg-green-500" />

                </div>
              ))}

            </div>

          </div>

        </div>

        {/* TABLE */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">

          <div className="flex items-center justify-between mb-6">

            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Recent Courses
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Latest uploaded LMS courses
              </p>
            </div>

            <button className="bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition">
              Add New Course
            </button>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>
                <tr className="text-left border-b text-gray-500 text-sm">

                  <th className="pb-4">Course</th>
                  <th className="pb-4">Instructor</th>
                  <th className="pb-4">Students</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4 text-right">Action</th>

                </tr>
              </thead>

              <tbody className="divide-y">

                {[
                  {
                    name: "Next.js Mastery",
                    instructor: "Sherryar",
                    students: 120,
                  },
                  {
                    name: "React Advanced",
                    instructor: "Ali",
                    students: 80,
                  },
                  {
                    name: "TypeScript Basics",
                    instructor: "Sara",
                    students: 45,
                  },
                ].map((course, i) => (
                  <tr
                    key={i}
                    className="hover:bg-gray-50 transition"
                  >

                    <td className="py-5">
                      <div className="flex items-center gap-3">

                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500" />

                        <div>
                          <p className="font-semibold text-gray-800">
                            {course.name}
                          </p>

                          <p className="text-sm text-gray-500">
                            UI Development
                          </p>
                        </div>

                      </div>
                    </td>

                    <td className="text-gray-600">
                      {course.instructor}
                    </td>

                    <td className="text-gray-600">
                      {course.students}
                    </td>

                    <td>
                      <span className="bg-green-100 text-green-600 text-xs px-3 py-1 rounded-full">
                        Active
                      </span>
                    </td>

                    <td className="text-right">

                      <button className="text-purple-600 font-medium hover:underline">
                        View
                      </button>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>
    </ProtectedRoute>
  );
}