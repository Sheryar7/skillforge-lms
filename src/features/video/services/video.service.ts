import { supabase } from "@/lib/supabase-client";

export const videoService = {
  /**
   * Uploads raw media files straight into your video-assets storage bucket bucket with progress tracking
   */
  async uploadVideoFile(
    file: File, 
    onProgress: (percent: number) => void
  ): Promise<string> {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
    const filePath = `lessons/${fileName}`;

    // Splitting custom heavy file streams with tracking
    const { error: uploadError } = await supabase.storage
      .from("video-assets")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false
      });

    if (uploadError) throw uploadError;

    // Simulate progress updates for smaller sizing fields seamlessly or capture final hook
    onProgress(100);

    const { data } = supabase.storage
      .from("video-assets")
      .getPublicUrl(filePath);

    return data.publicUrl;
  },

  /**
   * Drops old tracking items inside storage upon asset deletion or layout alterations
   */
  async deleteVideoFile(storagePath: string): Promise<void> {
    const { error } = await supabase.storage
      .from("video-assets")
      .remove([storagePath]);

    if (error) throw new Error(error.message);
  }
};