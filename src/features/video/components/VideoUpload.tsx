"use client";

import { useRef, useState } from "react";
import { Video, UploadCloud, CheckCircle2, AlertTriangle } from "lucide-react";
import Spinner from "@/shared/components/Spinner";
import { useVideoUpload } from "../hooks/useVideoUpload";

interface VideoUploadProps {
  onUploadComplete: (url: string) => void;
}

export default function VideoUpload({ onUploadComplete }: VideoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadVideo, progress, isUploading, error } = useVideoUpload();
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const uploadedUrl = await uploadVideo(file);
    
    if (uploadedUrl) {
      onUploadComplete(uploadedUrl);
    }
  };

  return (
    <div className="bg-white border-2 border-slate-100 p-6 rounded-[2.5rem] shadow-xl shadow-slate-100/40 space-y-4">
      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500">
        <Video size={14}/> Media Asset Ingestion
      </div>

      <div 
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`border-2 border-dashed border-slate-300 rounded-[2rem] p-8 text-center transition-all flex flex-col items-center justify-center cursor-pointer group ${
          isUploading ? "opacity-60 cursor-not-allowed bg-slate-50" : "hover:border-violet-400 hover:bg-violet-50/5"
        }`}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          hidden 
          accept="video/*" 
          onChange={handleFileChange} 
        />

        {!isUploading && !fileName && (
          <div className="space-y-2 text-slate-400 group-hover:text-violet-500 transition-colors">
            <UploadCloud size={40} className="mx-auto" strokeWidth={1.5} />
            <p className="text-sm font-bold">Click to attach video lesson module</p>
            <p className="text-[10px] uppercase font-black tracking-wider text-slate-400">MP4, WebM formats supported</p>
          </div>
        )}

        {isUploading && (
          <div className="space-y-4 w-full max-w-xs mx-auto">
            <Spinner />
            <div>
              <p className="text-sm font-black text-slate-700">Uploading: {progress}%</p>
              <p className="text-[11px] font-medium text-slate-400 mt-0.5 truncate">{fileName}</p>
            </div>
            {/* Custom Premium Smooth Tracker Line Progress bar */}
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-violet-600 transition-all duration-300 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {!isUploading && fileName && !error && (
          <div className="text-emerald-600 space-y-1.5 animate-in zoom-in-95">
            <CheckCircle2 size={36} className="mx-auto" />
            <p className="text-sm font-black">Asset Sync Complete</p>
            <p className="text-xs font-medium text-slate-400 truncate max-w-xs">{fileName}</p>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 font-bold text-xs">
          <AlertTriangle size={16} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}