export interface LessonProgress {
  id: string;
  student_id: string;
  course_id: string;
  lesson_id: string;
  is_completed: boolean;
  updated_at: string;
}

export interface CourseProgressSummary {
  courseId: string;
  totalLessons: number;
  completedLessons: number;
  percentage: number;
}