export default function StudentDashboard({ enrollments }: { enrollments: any[] | null }) {
  const latestCourse = enrollments?.[0];
  const totalCourses = enrollments?.length || 0;
  
  const avgProgress = enrollments?.length 
    ? Math.round(enrollments.reduce((acc, curr: any) => acc + (curr.progress?.[0]?.completion_percentage || 0), 0) / enrollments.length)
    : 0;

  return (
    <div className="space-y-8">
      {/* HERO */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-500 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <p className="text-sm uppercase tracking-widest opacity-80">Welcome Back</p>
          <h1 className="text-4xl font-bold mt-2">Ready to keep learning?</h1>
          
          {latestCourse ? (
            <div className="mt-6 flex items-center gap-6 bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/20 max-w-xl">
              <img 
                src={latestCourse.courses.thumbnail || "/placeholder-course.jpg"} 
                className="w-20 h-20 rounded-lg object-cover"
                alt="Thumbnail"
              />
              <div>
                <h3 className="font-bold text-lg">{latestCourse.courses.title}</h3>
                <p className="text-white/70 text-sm">Last session: {new Date(latestCourse.progress?.[0]?.updated_at).toLocaleDateString()}</p>
                <button className="mt-2 bg-white text-purple-600 px-4 py-1 rounded-full text-sm font-bold hover:bg-opacity-90 transition">
                  Resume Lesson
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-3 text-white/80">You haven't enrolled in any courses yet. Start your journey today!</p>
          )}
        </div>
      </div>

      {/* STATS */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        <StatItem label="Enrolled Courses" value={totalCourses} />
        <StatItem label="Overall Progress" value={`${avgProgress}%`} color="text-purple-600" />
        <StatItem label="Learning Streak" value="5 Days" color="text-blue-500" />
      </div>

      {/* COURSES GRID */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">My Learning Journey</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {enrollments?.map((item: any, i: number) => {
            const progPercent = item.progress?.[0]?.completion_percentage || 0;
            return (
              <div key={i} className="group flex gap-5 p-4 rounded-2xl hover:bg-gray-50 transition border border-transparent hover:border-gray-100">
                <img src={item.courses.thumbnail} className="w-32 h-32 rounded-xl object-cover shadow-md" />
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="font-bold text-gray-800 text-lg group-hover:text-purple-600 transition">{item.courses.title}</h3>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mt-4">
                    <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-full transition-all duration-500" style={{ width: `${progPercent}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatItem({ label, value, color = "text-gray-800" }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
      <p className="text-gray-500 text-sm">{label}</p>
      <h2 className={`text-3xl font-bold mt-1 ${color}`}>{value}</h2>
    </div>
  );
}