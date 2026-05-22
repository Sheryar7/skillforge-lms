"use client";

import { useState } from "react";
import Image from "next/image";
import { UploadCloud, Loader2, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/lib/supabase-client";

interface UploadThumbnailProps {
  onUploadComplete: (url: string) => void;
  initialValue?: string | null;
}

export default function UploadThumbnail({ onUploadComplete, initialValue = "" }: UploadThumbnailProps) {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(initialValue || "");
  const [error, setError] = useState("");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    // Create unique filename structure
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("course-images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false
      });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage
      .from("course-images")
      .getPublicUrl(fileName);

    setImageUrl(data.publicUrl);
    onUploadComplete(data.publicUrl); // Passes URL back up to your Form component state
    setUploading(false);
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-black uppercase tracking-widest text-slate-600 ml-1 flex items-center gap-1.5">
        <ImageIcon size={14} /> Course Cover Image
      </label>
      
      <div className="bg-white p-5 rounded-[2rem] border border-slate-200">
        {/* INTERACTIVE DASHBOARD ZONE */}
        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50/50 hover:border-violet-300 transition-all group relative overflow-hidden">
          {imageUrl ? (
            <div className="absolute inset-0 w-full h-full">
              <Image
                src={imageUrl}
                alt="Course cover preview"
                fill
                className="object-cover group-hover:opacity-40 transition-opacity"
                unoptimized
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 bg-slate-900/40 text-white transition-opacity font-bold text-xs gap-1">
                <UploadCloud size={20} />
                Replace Image Track
              </div>
            </div>
          ) : (
            <div className="text-center p-4">
              <UploadCloud size={28} className="mx-auto text-slate-400 group-hover:text-violet-500 transition-colors" />
              <p className="mt-2 text-xs text-slate-700 font-bold"> Click or drop media files</p>
              <p className="text-[10px] text-slate-400 mt-0.5 font-medium">PNG, JPG up to 5MB</p>
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>

        {/* LOADING INDICATOR STATE */}
        {uploading && (
          <div className="flex items-center gap-2 mt-3 text-violet-600 bg-violet-50/50 px-4 py-2.5 rounded-xl border border-violet-100">
            <Loader2 className="animate-spin" size={15} />
            <span className="text-xs font-black uppercase tracking-wider">Syncing resource block...</span>
          </div>
        )}

        {/* ERROR BOUNDARY DISPLAY */}
        {error && (
          <p className="mt-3 text-red-500 text-xs bg-red-50 px-4 py-2 rounded-xl font-bold">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}