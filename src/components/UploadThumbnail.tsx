"use client";

import { useState } from "react";
import Image from "next/image";
import { UploadCloud, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase-client";

export default function UploadThumbnail() {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setUploading(true);
    setError("");

    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("course-images")
      .upload(fileName, file);

    if (error) {
      setError(error.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage
      .from("course-images")
      .getPublicUrl(fileName);

    setImageUrl(data.publicUrl);

    setUploading(false);
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">

      <div className="flex items-center gap-3 mb-5">

        <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center">
          <UploadCloud className="text-violet-600" size={24} />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Upload Thumbnail
          </h2>

          <p className="text-sm text-gray-400">
            Upload course cover image
          </p>
        </div>

      </div>

      {/* INPUT */}
      <label className="flex items-center justify-center w-full h-36 border-2 border-dashed border-violet-200 rounded-2xl cursor-pointer hover:bg-violet-50 transition">

        <div className="text-center">

          <UploadCloud
            size={32}
            className="mx-auto text-violet-500"
          />

          <p className="mt-3 text-sm text-gray-500">
            Click to upload image
          </p>

        </div>

        <input
          type="file"
          onChange={handleUpload}
          className="hidden"
        />

      </label>

      {/* LOADING */}
      {uploading && (
        <div className="flex items-center gap-2 mt-4 text-violet-600">

          <Loader2 className="animate-spin" size={18} />

          <p className="text-sm font-medium">
            Uploading image...
          </p>

        </div>
      )}

      {/* ERROR */}
      {error && (
        <p className="mt-4 text-red-500 text-sm">
          {error}
        </p>
      )}

      {/* IMAGE */}
      {imageUrl && (
        <div className="mt-6">

          <Image
            src={imageUrl}
            alt="thumbnail"
            width={500}
            height={300}
            className="rounded-2xl border object-cover w-full h-64"
          />

        </div>
      )}

    </div>
  );
}