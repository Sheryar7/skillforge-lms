import { useState } from "react";
import { videoService } from "../services/video.service";

export function useVideoUpload() {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadVideo = async (file: File): Promise<string | null> => {
    setIsUploading(true);
    setProgress(0);
    setError(null);

    try {
      // Fake progressive loader steps to feed premium tracking tickers smoothly
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const publicUrl = await videoService.uploadVideoFile(file, (percent) => {
        clearInterval(interval);
        setProgress(percent);
      });

      return publicUrl;
    } catch (err: any) {
      setError(err.message || "Failed to finalize streaming video file ingestion upload.");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadVideo, progress, isUploading, error };
}