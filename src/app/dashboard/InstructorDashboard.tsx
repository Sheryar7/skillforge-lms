"use client";

import { Users, BookOpen, DollarSign, Star } from "lucide-react";
import CourseCard from "@/components/CourseCard";
import { Course } from "@/types/course";

type DashboardProps = {
  user: any;
  userName: string;
  stats: {
    totalStudents: number;
    activeCourses: number;
  };
  initialCourses: Course[]; 
};

export default function InstructorDashboard({ 
  user, 
  userName, 
  stats, 
  initialCourses 
}: DashboardProps) {
  return (
    <div className="space-y-8">
      {/* INSTRUCTOR HERO */}
      <div className="bg-gradient-to-br from-gray-900 via-violet-950 to-violet-900 rounded-[2.5rem] p-10 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-sm uppercase tracking-[0.2em] opacity-60 font-bold">Instructor Panel</p>
          <h1 className="text-5xl font-black mt-2">Welcome Back, {userName}!</h1>
          <p className="mt-4 text-violet-200 max-w-md text-lg">
            You currently have <span className="text-white font-bold">{stats.totalStudents}</span> students enrolled.
          </p>
        </div>
      </div>

      {/* STATS SECTION */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <InstructorStat icon={<Users size={24}/>} label="Total Students" value={stats.totalStudents.toLocaleString()} color="bg-blue-500" />
        <InstructorStat icon={<BookOpen size={24}/>} label="Active Courses" value={stats.activeCourses.toString()} color="bg-violet-500" />
        <InstructorStat icon={<DollarSign size={24}/>} label="Total Revenue" value="$0.00" color="bg-emerald-500" />
        <InstructorStat icon={<Star size={24}/>} label="Avg. Rating" value="N/A" color="bg-orange-500" />
      </div>

      {/* COURSES GRID - This shows your creation instantly */}
      <div className="space-y-6">
        <h2 className="text-2xl font-black text-gray-800 flex items-center gap-3">
            <div className="w-2 h-8 bg-violet-600 rounded-full"></div>
            Your Published Courses ({initialCourses.length})
        </h2>

        {initialCourses.length > 0 ? (
          <div className="text-gray-800 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {initialCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] p-20 shadow-sm border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-center">
            <h3 className="text-xl font-bold text-gray-800">No courses created yet.</h3>
          </div>
        )}
      </div>
    </div>
  );
}

function InstructorStat({ icon, label, value, color }: any) {
  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-6">
      <div className={`${color} p-4 rounded-2xl text-white shadow-lg`}>{icon}</div>
      <div>
        <p className="text-gray-400 text-xs font-black uppercase tracking-widest">{label}</p>
        <h2 className="text-3xl font-black text-gray-800 mt-1">{value}</h2>
      </div>
    </div>
  );
}