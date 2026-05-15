export default function AnalyticsPage() {
  const metrics = [
    { label: "Course Completion Rate", value: "68%", color: "text-emerald-500" },
    { label: "Avg. Study Time", value: "4.2 hrs", color: "text-blue-500" },
    { label: "New Enrollments", value: "+24", color: "text-violet-500" },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Analytics Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((m, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm font-medium">{m.label}</p>
            <p className={`text-4xl font-bold mt-2 ${m.color}`}>{m.value}</p>
          </div>
        ))}
      </div>
      <div className="bg-white h-64 rounded-3xl border border-gray-100 flex items-center justify-center text-gray-400 italic">
        [ Chart Visualization Placeholder ]
      </div>
    </div>
  );
}