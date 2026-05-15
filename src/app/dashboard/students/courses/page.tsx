"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import CourseCard from "@/components/CourseCard"; // We will modify this component next
import { GraduationCap, LayoutGrid } from "lucide-react";

export default function StudentCoursesPage() {
    const [courses, setCourses] = useState<any[]>([]);
    const [userRequests, setUserRequests] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const { data: { user } } = await supabase.auth.getUser();

        // 1. Fetch all courses
        const { data: coursesData } = await supabase.from("courses").select("*");

        // 2. Fetch current user's requests to disable buttons for pending ones
        if (user) {
            const { data: requestsData } = await supabase
                .from("enrollment_requests")
                .select("course_id")
                .eq("student_id", user.id);

            setUserRequests(requestsData?.map(r => r.course_id) || []);
        }

        setCourses(coursesData || []);
        setLoading(false);
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <div className="bg-violet-600 p-3 rounded-2xl text-white shadow-lg shadow-violet-200">
                    <GraduationCap size={32} />
                </div>
                <div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight">Available Courses</h1>
                    <p className="text-slate-500 font-medium">Expand your knowledge with our modern curriculum.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.map((course: any) => (
                    <CourseCard
                        key={course.id}
                        course={course}
                        isStudentView={true}
                        hasRequested={userRequests.includes(course.id)}
                    />
                ))}
            </div>
        </div>
    );
}