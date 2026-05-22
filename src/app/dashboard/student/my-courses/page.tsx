"use client";

import { BookOpen, Search } from "lucide-react";
import EmptyState from "@/shared/components/EmptyState";
import { Button } from "@/shared/ui/button";
import Link from "next/link";

export default function StudentMyCoursesPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Enrolled Tracks</h1>
        <p className="text-xs text-slate-400 font-medium">Your personal suite of operational curriculum systems</p>
      </div>

      <div className="bg-white border border-slate-100 rounded-[2.5rem] p-12 text-center shadow-sm">
        <EmptyState
          title="No joined classrooms yet"
          description="You haven't added any education streams to your personal dashboard matrix workspace layout yet."
          icon={BookOpen}
        />
        <div className="pt-6">
          <Link href="/courses" passHref>
            <Button variant="primary" className="px-6 py-3.5 text-xs font-black rounded-xl">
              <Search size={14} className="mr-1.5 inline" /> Browse Universal Catalog
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}