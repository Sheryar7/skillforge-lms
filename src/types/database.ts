export interface Course {
  id: string; // UUID string representation
  title: string;
  description: string | null;
  created_at: string; // ISO Timestamp string
  updated_at: string;
}

export interface Section {
  id: string;
  course_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: string;
  section_id: string;
  title: string;
  video_url: string | null;
  is_preview: boolean;
  position: number; // Order index position mapping
  created_at: string;
  updated_at: string;
}