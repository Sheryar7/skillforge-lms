"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react"; // Using Lucide for a cleaner look

type Props = {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string | null;
  title?: string;
};

export default function VideoPlayerModal({
  isOpen,
  onClose,
  videoUrl,
  title,
}: Props) {
  if (!isOpen || !videoUrl) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose} // Close when clicking outside
      >
        <motion.div
          className="bg-white w-full max-w-4xl rounded-[2rem] overflow-hidden shadow-2xl border border-white/20"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        >
          {/* Header Section */}
          <div className="flex items-center justify-between px-8 py-5 border-b border-slate-50">
            <h2 className="text-lg font-black text-black tracking-tight">
              {title || "Lesson Preview"}
            </h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-all cursor-pointer group"
            >
              <X className="text-slate-400 group-hover:text-black transition-colors" size={24} />
            </button>
          </div>

          {/* Video Container */}
          <div className="bg-black aspect-video relative flex items-center justify-center">
            <video
              src={videoUrl}
              controls
              className="w-full h-full object-contain"
              autoPlay
            />
          </div>

          {/* Optional Footer/Status Bar */}
          <div className="bg-slate-50 px-8 py-3">
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
               Sherry LMS • High Definition Playback
             </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}