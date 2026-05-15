"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { UploadCloud, CheckCircle, Loader2, X } from "lucide-react";
import toast from "react-hot-toast";

export default function VideoUpload({ onUploadComplete }: { onUploadComplete: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      const fileSizeInMB = file.size / (1024 * 1024);
      if (fileSizeInMB > 50) {
        return toast.error("File is too large! Maximum size is 50MB.");
      }

      setUploading(true);
      setFileName(file.name);

      const fileExt = file.name.split(".").pop();
      const path = `lessons/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("course-videos")
        .upload(path, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("course-videos").getPublicUrl(path);
      
      setVideoUrl(data.publicUrl);
      onUploadComplete(data.publicUrl);
      toast.success("Video uploaded!");
    } catch (error: any) {
      toast.error(error.message);
      setFileName(null);
    } finally {
      setUploading(false);
    }
  };

  const resetUpload = () => {
    setVideoUrl(null);
    setFileName(null);
  };

  return (
    <div className="mt-2">
      <div className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl transition ${
        videoUrl ? "border-emerald-500 bg-emerald-50" : uploading ? "border-violet-300 bg-violet-50" : "border-slate-200"
      }`}>
        {uploading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="animate-spin text-violet-600 mb-2" size={32} />
            <span className="text-[10px] font-black text-violet-600 uppercase tracking-tighter">
              Uploading {fileName?.substring(0, 15)}...
            </span>
          </div>
        ) : videoUrl ? (
          <div className="flex flex-col items-center relative w-full">
            <button 
              onClick={resetUpload}
              className="absolute top-[-30px] right-2 p-1 bg-slate-100 rounded-full hover:bg-slate-200 transition"
            >
              <X size={14} className="text-slate-600" />
            </button>
            <CheckCircle className="text-emerald-500 mb-2" size={32} />
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
              Ready to Save
            </span>
            <p className="text-[9px] text-emerald-400 mt-1 truncate max-w-[200px]">{fileName}</p>
          </div>
        ) : (
          <label className="flex flex-col items-center cursor-pointer w-full h-full justify-center hover:bg-slate-50 transition rounded-2xl">
            <UploadCloud className="text-slate-400 mb-2" size={28} />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Upload Lesson Video
            </span>
            <input 
              type="file" 
              className="hidden" 
              accept="video/*" 
              onChange={handleUpload} 
            />
          </label>
        )}
      </div>
    </div>
  );
}