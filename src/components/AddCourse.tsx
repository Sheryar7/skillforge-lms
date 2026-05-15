"use client";

import { useState, useRef } from "react";
import { Plus, X, Video, DollarSign, Type, FileText, ImagePlus } from "lucide-react";
import { supabase } from "@/lib/supabase-client";
import Image from "next/image";
import toast from "react-hot-toast";
import Spinner from "./Spinner";

export default function AddCourse() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">(""); 
  
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      let finalThumbnailUrl = "";

      if (thumbnailFile) {
        const fileExt = thumbnailFile.name.split('.').pop();
        const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
        const filePath = `thumbnails/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('course-images')
          .upload(filePath, thumbnailFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('course-images')
          .getPublicUrl(filePath);
        
        finalThumbnailUrl = urlData.publicUrl;
      }

      const { error } = await supabase.from("courses").insert({
        title,
        description,
        price: price === "" ? 0 : price,
        instructor_id: user.id,
        thumbnail: finalThumbnailUrl
      });

      if (error) throw error;

      toast.success("Course published successfully!");
      setIsOpen(false);
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message);
      setLoading(false); // Reset loading if error happens
    }
  };

  const inputStyles = "w-full p-4 bg-white border-2 border-slate-200 text-slate-900 placeholder-slate-400 rounded-2xl focus:ring-2 focus:ring-violet-600 focus:border-violet-600 font-bold outline-none transition-all";

  return (
    <div className="w-full">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full py-10 border-4 border-dashed border-slate-300 rounded-[3rem] flex flex-col items-center justify-center gap-4 text-slate-500 hover:text-violet-600 hover:border-violet-400 hover:bg-violet-50/30 transition-all group"
        >
          <div className="p-4 bg-white rounded-2xl shadow-sm group-hover:shadow-md border border-slate-100 transition-all">
            <Plus size={32} />
          </div>
          <span className="font-black text-xl tracking-tight text-slate-700">Create New Course</span>
        </button>
      ) : (
        <form onSubmit={handleCreate} className="bg-white p-8 rounded-[3.5rem] border-2 border-slate-100 shadow-2xl shadow-violet-100 animate-in zoom-in-95 duration-200">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black flex items-center gap-3 text-slate-900">
              <div className="p-2 bg-violet-600 rounded-xl text-white">
                <Video size={20} />
              </div>
              Course Builder
            </h2>
            <button 
              type="button" 
              onClick={() => setIsOpen(false)} 
              className="text-slate-400 hover:text-red-500 transition-colors"
            >
              <X size={28} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-600 ml-1 flex items-center gap-2">
                  <Type size={14} /> Course Title
                </label>
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Master Modern Web Development"
                  className={inputStyles}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-600 ml-1 flex items-center gap-2">
                  <FileText size={14} /> Description
                </label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What will students learn in this curriculum?"
                  rows={4}
                  className={`${inputStyles} font-medium resize-none`}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-600 ml-1 flex items-center gap-2">
                  <DollarSign size={14} /> Course Price (USD)
                </label>
                <input
                  type="number"
                  value={price}
                  placeholder="0.00"
                  onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
                  className={inputStyles}
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-black uppercase tracking-widest text-slate-600 mb-2 ml-1 flex items-center gap-2">
                <ImagePlus size={14} /> Course Thumbnail
              </label>
              
              <div 
                onClick={() => !loading && fileInputRef.current?.click()}
                className={`relative flex-1 min-h-[250px] border-2 border-dashed border-slate-300 rounded-[2.5rem] overflow-hidden transition-all flex flex-col items-center justify-center group ${loading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:border-violet-400 hover:bg-slate-50'}`}
              >
                {previewUrl ? (
                  <Image 
                    src={previewUrl} 
                    alt="Preview" 
                    fill 
                    className="object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-3 text-slate-500 group-hover:text-violet-500 transition-colors">
                    <ImagePlus size={48} strokeWidth={1.5} />
                    <p className="font-bold text-sm text-center px-6">Click to upload <br/> (1280x720 recommended)</p>
                  </div>
                )}
                <input 
                  type="file" 
                  hidden 
                  ref={fileInputRef} 
                  accept="image/*" 
                  onChange={handleImageChange} 
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-8 w-full py-5 bg-violet-600 text-white rounded-2xl font-black shadow-lg shadow-violet-200 hover:bg-violet-700 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3"
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <Spinner />
                    <span>Publishing Content...</span>
                  </div>
                ) : (
                  "Publish Course Content"
                )}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}