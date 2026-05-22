"use client";

import { X, Play } from "lucide-react";
import VideoPlayer from "./VideoPlayer";

interface VideoPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string | null;
  lessonTitle: string;
}

export default function VideoPreviewModal({ isOpen, onClose, videoUrl, lessonTitle }: VideoPreviewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 rounded-[3.5rem] p-6 border border-slate-800 shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Top bar info info parameters */}
        <div className="flex justify-between items-center mb-4 px-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-violet-600 rounded-xl text-white">
              <Play size={14} fill="currentColor" />
            </div>
            <h3 className="font-black text-white text-base tracking-tight line-clamp-1">{lessonTitle}</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-xl transition-all"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Video stream chassis wrapper block */}
        <div className="rounded-[2rem] overflow-hidden">
          <VideoPlayer url={videoUrl} />
        </div>
      </div>
    </div>
  );
}