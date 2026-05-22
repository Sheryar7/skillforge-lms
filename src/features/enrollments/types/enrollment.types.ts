export type EnrollmentStatus = "pending" | "approved" | "rejected";

export interface EnrollmentRequest {
  id: string;
  created_at: string;
  student_id: string;
  course_id: string;
  status: EnrollmentStatus;
  // Included relational database properties
  profiles?: {
    full_name: string | null;
    email: string;
  } | null;
  courses?: {
    title: string;
    instructor_id: string;
  } | null;
}

export interface EnrollmentStatusUpdate {
  id: string;
  status: EnrollmentStatus;
}