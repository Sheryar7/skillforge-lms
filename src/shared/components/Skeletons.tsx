"use client";

export function CourseSkeleton() {
  return (
    <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden animate-pulse">
      <div className="h-48 bg-slate-200" />
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <div className="h-6 bg-slate-200 rounded-lg w-2/3" />
          <div className="h-4 bg-slate-200 rounded-lg w-full" />
          <div className="h-4 bg-slate-200 rounded-lg w-full" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="h-8 bg-slate-100 rounded-2xl" />
          <div className="h-8 bg-slate-100 rounded-2xl" />
        </div>
        <div className="h-10 bg-slate-200 rounded-2xl" />
      </div>
    </div>
  );
}

export function VideoPlayerSkeleton() {
  return (
    <div className="aspect-video w-full bg-slate-200 rounded-[2.5rem] border border-slate-300 animate-pulse" />
  );
}

export function SidebarSkeleton() {
  return (
    <div className="w-full border border-slate-100 rounded-[2.5rem] bg-white shadow-sm p-4 space-y-3 animate-pulse">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-10 bg-slate-200 rounded-2xl" />
          <div className="pl-4 space-y-2">
            {Array.from({ length: 2 }).map((_, j) => (
              <div key={j} className="h-8 bg-slate-100 rounded-2xl" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function LessonListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="bg-white border border-slate-100 rounded-2xl p-4 animate-pulse space-y-2">
          <div className="h-6 bg-slate-200 rounded w-2/3" />
          <div className="h-4 bg-slate-100 rounded w-full" />
        </div>
      ))}
    </div>
  );
}
