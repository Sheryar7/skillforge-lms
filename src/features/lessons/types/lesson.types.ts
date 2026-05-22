export interface Lesson {
  id: string;
  section_id: string;
  course_id?: string;
  title: string;
  description: string | null;
  video_url: string | null;
  duration?: string | null;
  position: number;
  is_preview: boolean;
  published?: boolean;
  created_at?: string;
}

export interface CreateLessonInput {
  section_id: string;
  course_id: string;
  title: string;
  description?: string | null;
  video_url?: string | null;
  duration?: string | null;
  position?: number;
  is_preview?: boolean;
  published?: boolean;
}

export interface UpdateLessonInput {
  title?: string;
  description?: string | null;
  video_url?: string | null;
  duration?: string | null;
  position?: number;
  is_preview?: boolean;
  published?: boolean;
}
