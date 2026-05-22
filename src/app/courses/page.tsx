"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, BookOpen, GraduationCap, ArrowRight, Layers } from "lucide-react";
import toast from "react-hot-toast";

// Importing your clean shared design primitives
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import EmptyState from "@/shared/components/EmptyState";
import Spinner from "@/shared/components/Spinner";

// Schema definitions
import { Course } from "@/types/database";
import { supabase } from "@/lib/supabase-client";

export default function CoursesExplorePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllPublishedCourses() {
      try {
        // Querying public courses table securely from Supabase
        const { data, error } = await supabase
          .from("courses")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setCourses(data || []);
      } catch (err: any) {
        toast.error("Failed to load the active course catalog matrix.");
      } finally {
        setLoading(false);
      }
    }

    fetchAllPublishedCourses();
  }, []);

  // Filter courses locally based on search input mapping
  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (course.description && course.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <Spinner />
        <p className="text-xs font-bold text-slate-400 mt-3 uppercase tracking-wider">Compiling universal catalog clusters...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      
      {/* Immersive Structural Header Panel */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100">
        <div className="space-y-2">
          <span className="px-3 py-1 bg-violet-50 text-violet-600 text-[10px] font-black uppercase tracking-widest rounded-md inline-block">
            Global Knowledge Hub
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Explore Architecture Tracks
          </h1>
          <p className="text-sm text-slate-400 font-medium">
            Acquire specialized full-stack competencies through highly structured, video-guided paths
          </p>
        </div>

        {/* Reusable Search Bar Primitive Wrapper */}
        <div className="w-full md:w-80 relative flex items-center">
          <div className="w-full">
            <Input
              placeholder="Search specific topics, frameworks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="absolute right-4 text-slate-400 pointer-events-none">
            <Search size={16} />
          </div>
        </div>
      </div>

      {/* Dynamic Results Grid Display */}
      {filteredCourses.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-[3rem] p-16 text-center shadow-sm max-w-xl mx-auto">
          <EmptyState
            title="No matching tracks found"
            description="We couldn't find any curriculum blocks matching your specific criteria. Try adjusting your vocabulary terms."
            icon={Layers}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div 
              key={course.id} 
              className="bg-white border border-slate-100 p-6 rounded-[2.5rem] shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-4">
                {/* Visual Accent Badge Wrapper */}
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-slate-50 text-slate-600 group-hover:bg-violet-50 group-hover:text-violet-600 rounded-2xl transition-colors">
                    <BookOpen size={18} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <GraduationCap size={12} /> Core Track
                  </span>
                </div>

                {/* Course Metadata Meta Text Block */}
                <div className="space-y-1.5">
                  <h3 className="font-black text-slate-900 text-lg tracking-tight line-clamp-2 group-hover:text-violet-600 transition-colors leading-snug">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium line-clamp-3 leading-relaxed">
                    {course.description || "No full curriculum briefing summary has been attached to this course mapping module yet."}
                  </p>
                </div>
              </div>

              {/* Action Button Navigation Control Trigger */}
              <div className="pt-6 border-t border-slate-50 mt-6">
                <Link href={`/courses/${course.id}`} passHref className="w-full">
                  <Button 
                    variant="primary" 
                    className="w-full py-3.5 text-xs font-black rounded-xl bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-1.5 border-none shadow-none group-hover:bg-violet-600 group-hover:shadow-lg group-hover:shadow-violet-100 transition-all"
                  >
                    <span>View Curriculum Track</span>
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}