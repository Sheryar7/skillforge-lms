"use client";

import { Video } from "lucide-react";

interface VideoPlayerProps {
  url: string | null;
}

export default function VideoPlayer({ url }: VideoPlayerProps) {
  if (!url) {
    return (
      <div className="aspect-video w-full bg-slate-900 rounded-[2.5rem] border border-slate-800 flex flex-col items-center justify-center text-slate-500 space-y-2">
        <div className="p-3 bg-slate-800/50 rounded-2xl text-slate-400">
          <Video size={28} strokeWidth={1.5} />
        </div>
        <p className="font-bold text-sm">No streaming source file linked to this node</p>
      </div>
    );
  }

  return (
    <div className="aspect-video w-full bg-slate-950 rounded-[2.5rem] overflow-hidden border-2 border-slate-900 shadow-2xl relative shadow-violet-900/10 group">
      <video
        src={url}
        controls
        controlsList="nodownload"
        className="w-full h-full object-contain"
        preload="metadata"
      />
    </div>
  );
}