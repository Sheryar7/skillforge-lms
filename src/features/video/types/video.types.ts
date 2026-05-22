export interface VideoMetadata {
  id: string;
  lesson_id: string;
  storage_path: string;
  public_url: string;
  duration_seconds: number | null;
  file_size_bytes: number;
  created_at?: string;
}

export interface UploadProgressState {
  progress: number;
  isUploading: boolean;
  error: string | null;
}