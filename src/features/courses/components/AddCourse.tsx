"use client";

import { useState } from "react";
import { Video, FileText } from "lucide-react";
import toast from "react-hot-toast";

import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { useCourse } from "../hooks/useCourse";
import UploadThumbnail from "./UploadThumbnail";

interface AddCourseProps {
  onSuccess?: () => void;
}

export default function AddCourse({ onSuccess }: AddCourseProps) {
  const { createCourse, loading } = useCourse();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">(""); 
  const [thumbnailUrl, setThumbnailUrl] = useState(""); // Holds string URL from storage bucket

  const handleCreate = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    await createCourse(
      {
        title,
        description: description || null, // No longer errors out!
        price: price === "" ? 0 : price,
        thumbnail: thumbnailUrl || null,
      },
      null // Safely satisfies the 2nd argument required by useCourse hook
    );

    toast.success("Course published successfully!");
    
    // Reset form fields
    setTitle("");
    setDescription("");
    setPrice("");
    setThumbnailUrl("");

    if (onSuccess) {
      onSuccess();
    } else {
      window.location.reload();
    }
  } catch (error: any) {
    toast.error(error.message || "Something went wrong while publishing.");
  }
};

  return (
    <form onSubmit={handleCreate} className="bg-white p-2 w-full animate-in zoom-in-95 duration-200">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-violet-600 rounded-xl text-white">
          <Video size={20} />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Course Builder</h2>
          <p className="text-xs text-slate-400 font-medium">Draft and publish a new structural program track asset</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column Content Metadata Inputs */}
        <div className="space-y-6">
          <Input
            label="Course Title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Master Modern Web Development"
            disabled={loading}
          />

          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-widest text-slate-600 ml-1 flex items-center gap-2">
              <FileText size={14} /> Description
            </label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What will students learn in this curriculum?"
              rows={4}
              className="w-full px-5 py-4 bg-white border-2 border-slate-200 text-slate-900 placeholder-slate-400 rounded-2xl focus:ring-2 focus:ring-violet-600 focus:border-violet-600 font-bold outline-none transition-all resize-none"
              disabled={loading}
                />
          </div>

          <Input
            label="Course Price (USD)"
            type="number"
            value={price}
            placeholder="0.00"
            onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
            disabled={loading}
          />
        </div>

        {/* Right Column Component Media Control Subsystem */}
        <div className="flex flex-col h-full justify-between gap-6">
          <UploadThumbnail 
            initialValue={thumbnailUrl} 
            onUploadComplete={(url) => setThumbnailUrl(url)} 
          />

          <Button
            type="submit"
            variant="primary"
            isLoading={loading}
            className="w-full py-4 text-sm font-black uppercase tracking-widest rounded-2xl"
          >
            {loading ? "Publishing Content..." : "Publish Course Content"}
          </Button>
        </div>
      </div>
    </form>
  );
}