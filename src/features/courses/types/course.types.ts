export type CourseStatus = "draft" | "published" | "archived";

export interface Course {
  id: string;
  created_at?: string;
  updated_at?: string;
  title: string;
  description: string | null;
  price: number;
  thumbnail: string | null;
  category?: string | null;
  level?: string | null;
  status?: CourseStatus;
  published?: boolean;
  instructor_id: string;
}

export interface CreateCourseInput {
  title: string;
  description?: string | null; // Allow it to be optional or explicitly null
  price: number;
  thumbnail?: string | null;   // Allow it to be optional or explicitly null
  category?: string | null;
  level?: string | null;
  status?: CourseStatus;
  published?: boolean;
}

export interface UpdateCourseInput {
  title?: string;
  description?: string | null; // Match creation rules
  price?: number;
  thumbnail?: string | null;   // Match creation rules
  category?: string | null;
  level?: string | null;
  status?: CourseStatus;
  published?: boolean;
}