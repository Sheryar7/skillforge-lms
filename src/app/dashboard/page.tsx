export default function Dashboard() {
  return (
    <div>

      {/* STATS */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

        {[
          { title: "Total Courses", value: "12", color: "from-purple-500 to-indigo-500" },
          { title: "Students", value: "320", color: "from-blue-500 to-cyan-500" },
          { title: "Revenue", value: "$4,200", color: "from-pink-500 to-red-500" },
          { title: "Active Users", value: "89", color: "from-green-500 to-emerald-500" },
        ].map((item, i) => (
          <div
            key={i}
            className={`bg-gradient-to-r ${item.color} text-white p-5 rounded-2xl shadow-md`}
          >
            <p className="text-sm opacity-80">{item.title}</p>
            <h2 className="text-2xl font-bold mt-2">{item.value}</h2>
          </div>
        ))}

      </div>

      {/* CHART + USERS */}
      <div className="grid lg:grid-cols-3 gap-6 mt-8">

        {/* CHART */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border">

          <h3 className="text-lg font-semibold mb-4">
            Revenue Overview
          </h3>

          {/* Fake Chart Bars */}
          <div className="flex items-end gap-4 h-40">
            {[40, 60, 80, 50, 90, 70, 100].map((h, i) => (
              <div key={i} className="flex-1">
                <div
                  className="bg-purple-500 rounded-lg"
                  style={{ height: `${h}%` }}
                />
              </div>
            ))}
          </div>

          <p className="text-sm text-gray-500 mt-4">
            Weekly performance
          </p>
        </div>

        {/* USERS PANEL */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border">

          <h3 className="text-lg font-semibold mb-4">
            Recent Users
          </h3>

          <div className="space-y-4">
            {["Ali", "Sara", "John", "Ayesha"].map((user, i) => (
              <div key={i} className="flex items-center gap-3">

                {/* Avatar */}
                <div className="w-10 h-10 bg-purple-500 text-white flex items-center justify-center rounded-full font-semibold">
                  {user[0]}
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {user}
                  </p>
                  <p className="text-xs text-gray-500">
                    Joined recently
                  </p>
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>

      {/* COURSES TABLE */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border mt-8">

        <h3 className="text-lg font-semibold mb-4">
          Courses
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">

            <thead className="text-gray-500 border-b">
              <tr>
                <th className="py-2">Course</th>
                <th>Status</th>
                <th>Students</th>
                <th></th>
              </tr>
            </thead>

            <tbody className="divide-y">

              {[
                { name: "Next.js Basics", students: 120 },
                { name: "React Advanced", students: 80 },
                { name: "TypeScript Mastery", students: 60 },
              ].map((course, i) => (
                <tr key={i} className="hover:bg-gray-50">

                  <td className="py-3 font-medium text-gray-700">
                    {course.name}
                  </td>

                  <td>
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                      Active
                    </span>
                  </td>

                  <td className="text-gray-500">
                    {course.students}
                  </td>

                  <td className="text-right">
                    <button className="text-purple-600 hover:underline text-sm">
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
  );
}