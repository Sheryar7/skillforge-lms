
export type Course = {
  id: number;
  title: string;
  description: string;
  instructor: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
};

export type Enrollment = {
  id: number;
  userId: number;
  courseId: number;
};